"""Regression: 'Try it Yourself' must open exactly one popup even after visiting several lessons. Also checks fx run without errors.
Usage: uv run --with playwright python tests/tryit_once.py"""
import pathlib, sys
from playwright.sync_api import sync_playwright

URL = pathlib.Path(__file__).resolve().parent.parent.joinpath("index.html").as_uri()
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    page = b.new_page()
    errs = []; page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto(URL + "#/learn/py_01_setup"); page.wait_for_selector(".example")
    for lid in ["py_02_variables", "py_03_operators", "py_01_setup", "py_04_strings"]:
        page.evaluate(f"location.hash = '#/learn/{lid}'"); page.wait_for_timeout(250)
    page.click(".example [data-tryit] >> nth=0")
    page.wait_for_timeout(600)
    n = page.evaluate("document.querySelectorAll('#modalRoot .modal-scrim').length")
    assert n == 1, f"{n} popups opened"
    print("try-it popups after 5 lesson visits:", n)
    page.keyboard.press("Escape")
    # fx: quiz answer triggers sound/burst without throwing
    page.locator(".quiz-q").first.locator(".quiz-opt").first.click()
    page.wait_for_timeout(300)
    page.evaluate("FP.fx.levelUp(3, 'Loop Wrangler')"); page.wait_for_selector(".fx-level")
    page.screenshot(path=sys.argv[1] if len(sys.argv) > 1 else "lvl.png")
    b.close()
    assert not errs, errs
print("TRYIT/FX TEST PASSED")
