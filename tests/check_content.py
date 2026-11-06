"""Verifies every challenge: the solution must pass its hidden test, the starter must fail.
Also runs every lesson example (must not raise) and checks the content's shape.
Usage (from repo root): python tests/check_content.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    raw = subprocess.run(["node", os.path.join(ROOT, "tests", "dump_content.js")],
                         capture_output=True, text=True, encoding="utf-8", check=True).stdout
    data = json.loads(raw)
    ns = {}
    exec(data["harness"], ns)
    run = ns["__flowpy_run"]

    failures = []
    ids = set()
    checked = 0
    workdir = tempfile.mkdtemp(prefix="flowpy-check-")
    os.chdir(workdir)  # file-handling / sqlite examples write here, not into the repo

    def check(owner, label, item):
        nonlocal checked
        for key in ("prompt", "starter", "solution", "test"):
            if key not in item:
                failures.append(f"{owner} {label}: missing '{key}'")
                return
        res = json.loads(run(item["solution"], item.get("stdin", ""), item["test"]))
        if not res.get("passed"):
            failures.append(f"{owner} {label}: SOLUTION FAILS -> {res.get('message')} | err={res.get('error')} | out={res.get('out')!r}")
        res2 = json.loads(run(item["starter"], item.get("stdin", ""), item["test"]))
        if res2.get("passed"):
            failures.append(f"{owner} {label}: starter already passes (test too weak)")
        checked += 1

    for lesson in data["lessons"]:
        lid = lesson.get("id")
        if lid in ids:
            failures.append(f"duplicate id {lid}")
        ids.add(lid)
        for key in ("title", "track", "xp", "minutes", "summary", "sections", "challenges", "quiz"):
            if key not in lesson:
                failures.append(f"{lid}: missing '{key}'")
        for si, sec in enumerate(lesson.get("sections", [])):
            if sec.get("code") and not sec.get("noRun"):
                res = json.loads(run(sec["code"], sec.get("stdin", ""), None))
                if res.get("error"):
                    failures.append(f"{lid} section {si} example raises: {res['error']}")
        for ci, ch in enumerate(lesson.get("challenges", [])):
            check(lid, f"challenge {ci + 1}", ch)
        for qi, q in enumerate(lesson.get("quiz", [])):
            if not (0 <= q.get("answer", -1) < len(q.get("options", []))):
                failures.append(f"{lid} quiz {qi + 1}: answer index out of range")

    for boss in data["bosses"]:
        bid = boss.get("id")
        for key in ("title", "xp", "brief", "requirements", "starter", "solution", "test"):
            if key not in boss:
                failures.append(f"{bid}: missing '{key}'")
        if "test" in boss:
            check(bid, "boss", {"prompt": boss.get("brief", ""), **boss})

    lesson_ids = {l["id"] for l in data["lessons"]}
    for lid, vis in data["visuals"].items():
        if lid not in lesson_ids:
            failures.append(f"visuals: unknown lesson {lid}")
        for vi, v in enumerate(vis):
            res = json.loads(run(v["code"], "", None))
            if res.get("error"):
                failures.append(f"visual {lid}[{vi}] raises: {res['error']}")
    gids = {g["id"] for g in data["glossary"]}
    for g in data["glossary"]:
        for key in ("id", "term", "short", "long"):
            if not g.get(key):
                failures.append(f"glossary {g.get('id')}: missing {key}")
        for rel in g.get("related", []):
            if rel not in gids:
                failures.append(f"glossary {g['id']}: related '{rel}' doesn't exist")
        if g.get("example"):
            try:
                compile(g["example"], g["id"], "exec")
            except SyntaxError as e:
                failures.append(f"glossary {g['id']} example syntax error: {e}")
    for it in data["rewards"].get("items", []):
        if not (isinstance(it.get("uzs"), int) and it["uzs"] > 0):
            failures.append(f"reward {it.get('id')}: bad price")

    print(f"visuals={sum(len(v) for v in data['visuals'].values())} glossary={len(data['glossary'])} rewards={len(data['rewards'].get('items', []))}")
    print(f"lessons={len(data['lessons'])} bosses={len(data['bosses'])} challenges_checked={checked} "
          f"flashcards={len(data['flashcards'])} reference_sections={len(data['reference'])}")
    if failures:
        print("\nFAILURES:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("ALL CONTENT CHECKS PASSED")


if __name__ == "__main__":
    main()
