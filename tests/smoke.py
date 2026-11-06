"""Headless smoke test: loads every route, checks for JS errors, runs Python and grades an exercise.
Usage: uv run --with playwright python tests/smoke.py [--shots DIR]
Uses the installed Chrome in headless mode (no window opens).
"""
import os
import sys
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = ROOT.joinpath("index.html").as_uri()
SHOTS = sys.argv[sys.argv.index("--shots") + 1] if "--shots" in sys.argv else None

ROUTES = ["", "learn", "learn/py_01_setup", "learn/py_13_oop_classes", "learn/py_18_testing", "projects/boss_04", "exercises",
          "playground", "projects", "projects/boss_01", "flashcards", "reference", "settings", "certificate"]


def main():
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)

        page.goto(URL)
        page.wait_for_selector(".page")
        for r in ROUTES:
            page.evaluate(f"location.hash = '#/{r}'")
            page.wait_for_timeout(350)
            assert page.query_selector(".page"), f"route {r!r} rendered nothing"
            if SHOTS:
                os.makedirs(SHOTS, exist_ok=True)
                page.screenshot(path=os.path.join(SHOTS, (r or "home").replace("/", "_") + ".png"))
        print("routes ok:", len(ROUTES))

        # Real Python run + grading through Pyodide
        page.evaluate("location.hash = '#/learn/py_01_setup'")
        page.wait_for_selector(".exercise")
        page.wait_for_function("FP.runner.status === 'ready'", timeout=90000)
        res = page.evaluate("FP.runner.run('print(sum(range(5)))')")
        assert res["out"].strip() == "10", res
        bad = page.evaluate("FP.grade('print(\"nope\")', '', FP.LESSONS[0].challenges[0].test)")
        assert not bad["passed"], bad
        good = page.evaluate("FP.grade(FP.LESSONS[0].challenges[0].solution, '', FP.LESSONS[0].challenges[0].test)")
        assert good["passed"], good
        inp = page.evaluate("FP.runner.run('n = input(\"Name? \")\\nprint(\"Hi\", n)', {stdin: 'Ada'})")
        assert "Hi Ada" in inp["out"], inp
        boss = page.evaluate("(() => { const b = FP.BOSSES[0]; return FP.grade(b.solution, b.stdin, b.test); })()")
        assert boss["passed"], boss
        boss_bad = page.evaluate("(() => { const b = FP.BOSSES[0]; return FP.grade(b.starter, b.stdin, b.test); })()")
        assert not boss_bad["passed"], boss_bad
        loop = page.evaluate("FP.runner.run('while True: pass', {timeout: 3000})")
        assert "Stopped" in (loop["error"] or ""), loop
        page.wait_for_function("FP.runner.status === 'ready'", timeout=90000)
        after = page.evaluate("FP.runner.run('print(1+1)')")
        assert after["out"].strip() == "2", after
        print("python run/grade/input/timeout ok")

        # UI path: type the solution into the first exercise and click Check
        ex = page.query_selector("#ex-1")
        page.evaluate("document.querySelector('#ex-1 .CodeMirror').CodeMirror.setValue('print(\"Welcome to BizPy Store\")')")
        ex.query_selector("[data-act=check]").click()
        page.wait_for_selector("#ex-1 .ex-feedback.ok", timeout=20000)
        xp = page.evaluate("FP.store.state.xp")
        assert xp > 0, xp
        print("ui check ok, xp =", xp)
        if SHOTS:
            page.screenshot(path=os.path.join(SHOTS, "lesson_after_check.png"), full_page=False)
            page.evaluate("location.hash = '#/'"); page.wait_for_timeout(400)
            page.screenshot(path=os.path.join(SHOTS, "dashboard.png"))
            page.evaluate("document.documentElement.dataset.theme = 'dark'; location.hash = '#/learn/py_04_strings'")
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SHOTS, "lesson_dark.png"))
            page.set_viewport_size({"width": 390, "height": 844})
            page.wait_for_timeout(300)
            page.screenshot(path=os.path.join(SHOTS, "mobile.png"))
        browser.close()

    real = [e for e in errors if "fonts.g" not in e and "favicon" not in e]
    if real:
        print("ERRORS:\n" + "\n".join(real))
        sys.exit(1)
    print("SMOKE TEST PASSED (no console errors)")


if __name__ == "__main__":
    main()
