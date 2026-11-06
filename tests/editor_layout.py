"""Reproduces the editor misalignment: delay web fonts, then check every CodeMirror's gutter/code geometry.
Usage: uv run --with playwright python tests/editor_layout.py
"""
import pathlib
import sys
import time
from playwright.sync_api import sync_playwright

URL = pathlib.Path(__file__).resolve().parent.parent.joinpath("index.html").as_uri()

MEASURE = """() => [...document.querySelectorAll('.CodeMirror')].filter(c => c.offsetParent && c.querySelector('.CodeMirror-linenumber')).map((c, i) => {
  const g = c.querySelector('.CodeMirror-gutters').getBoundingClientRect();
  const line = c.querySelector('.CodeMirror-line').getBoundingClientRect();
  const num = c.querySelector('.CodeMirror-linenumber').getBoundingClientRect();
  return { i, gutterRight: Math.round(g.right), codeLeft: Math.round(line.left),
           numTop: Math.round(num.top), lineTop: Math.round(line.top) };
})"""


def check(page, label):
    bad = []
    for m in page.evaluate(MEASURE):
        if m["codeLeft"] < m["gutterRight"] - 1 or abs(m["numTop"] - m["lineTop"]) > 3:
            bad.append(m)
    print(label, "editors:", len(page.evaluate(MEASURE)), "misaligned:", bad)
    return bad


def main():
    failed = False
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        for vw in [(390, 844), (1440, 900)]:
            page = b.new_page(viewport={"width": vw[0], "height": vw[1]})
            if "--no-fix" in sys.argv:  # simulate the old build to prove the bug reproduces
                page.add_init_script("window.ResizeObserver = undefined; Object.defineProperty(document, 'fonts', {value: undefined}); window.requestAnimationFrame = () => 0;")
            # Slow fonts + CodeMirror CSS down like a phone on mobile data.
            def slow(route):
                time.sleep(2.5)
                route.continue_()
            page.route("**/fonts.gstatic.com/**", slow)
            page.route("**/fonts.googleapis.com/**", slow)
            page.goto(URL + "#/learn/py_01_setup")
            page.wait_for_selector(".CodeMirror")
            page.wait_for_timeout(7000)
            failed |= bool(check(page, f"{vw} lesson after fonts"))
            # Also: open a Try-It modal and a different lesson
            page.click("[data-tryit]")
            page.wait_for_timeout(600)
            failed |= bool(check(page, f"{vw} try-it modal"))
            page.keyboard.press("Escape")
            page.evaluate("location.hash = '#/learn/py_13_oop_classes'")
            page.wait_for_timeout(800)
            failed |= bool(check(page, f"{vw} lesson 13"))
            page.close()
        b.close()
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
