"""Viewing a solution (exercise or boss) must forfeit XP. Usage: uv run --with playwright python tests/reveal_xp.py"""
import pathlib
from playwright.sync_api import sync_playwright

URL = pathlib.Path(__file__).resolve().parent.parent.joinpath("index.html").as_uri()

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    page = b.new_page()
    page.on("dialog", lambda d: d.accept())
    page.goto(URL + "#/learn/py_01_setup")
    page.wait_for_function("FP.runner.status === 'ready'", timeout=90000)

    # Exercise 1: show solution -> load into editor -> check => solved, 0 XP
    page.click("#ex-1 [data-solution]")
    page.click(".modal [data-load]")
    page.click("#ex-1 [data-act=check]")
    page.wait_for_selector("#ex-1 .ex-feedback.ok", timeout=20000)
    xp1 = page.evaluate("FP.store.state.xp")
    solved = page.evaluate("!!FP.store.state.challenges['py_01_setup:0']")
    msg = page.inner_text("#ex-1 .ex-feedback")
    assert solved and page.query_selector("#ex-1 .tag.revealed"), "should be solved + tagged"
    assert xp1 == 10, f"only the first-run bonus (10) expected, got {xp1}"  # 'Hello World' first run badge XP
    print("exercise reveal -> 0 XP ok:", msg.strip())

    # Exercise 2 solved honestly still gives XP
    page.evaluate("document.querySelector('#ex-2 .CodeMirror').CodeMirror.setValue('print(5 + 3)')")
    page.click("#ex-2 [data-act=check]")
    page.wait_for_selector("#ex-2 .ex-feedback.ok", timeout=20000)
    xp2 = page.evaluate("FP.store.state.xp")
    assert xp2 == xp1 + 15, (xp1, xp2)
    print("honest solve -> +15 XP ok")

    # Boss: reveal then pass => 0 XP
    page.evaluate("location.hash = '#/projects/boss_01'")
    page.wait_for_selector(".boss-ide .CodeMirror")
    page.click("[data-solution]")
    page.keyboard.press("Escape")
    page.evaluate("document.querySelector('.boss-ide .CodeMirror').CodeMirror.setValue(FP.BOSSES[0].solution)")
    page.click(".boss-ide [data-act=check]")
    page.wait_for_selector(".boss-fb .ex-feedback.ok", timeout=20000)
    xp3 = page.evaluate("FP.store.state.xp")
    assert xp3 == xp2 and page.evaluate("FP.store.state.bosses.boss_01.done"), (xp2, xp3)
    print("boss reveal -> 0 XP ok:", page.inner_text(".boss-fb").strip())

    # Survives reload
    page.reload(); page.wait_for_timeout(500)
    assert page.evaluate("FP.store.isRevealed('py_01_setup:0') && FP.store.isRevealed('boss:boss_01')")
    print("persisted after reload ok")
    b.close()
print("REVEAL XP TEST PASSED")
