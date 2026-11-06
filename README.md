# BizPy

An interactive Python course for **UDE4070CM – Fundamentals of Business Programming**, built on the FlowPy engine.
Real Python (Pyodide) runs in the browser, every exercise is graded by running your code against hidden tests, and progress is saved in the browser.

## Open it
- Double-click `index.html`. You need internet the first time you click Run, because Python (about 10 MB) loads from a CDN and is cached after that.
- Or serve the folder: `python -m http.server 8000` and open http://localhost:8000. It's a static site with no server code and no secrets, so any static host works (Netlify Drop, GitHub Pages).

## What's inside
- 15 lessons that follow the module handbook: Foundations (print, input, types, business maths, formatted output), Data Structures (lists, dictionaries), Logic (if/elif/else, Boolean logic, loops, functions), Algorithms and recursion, Error handling, OOP, Debugging/Testing/Documentation, Git, and a CW1 test-strategy lesson
- 52 auto-graded exercises. Input-driven ones are re-run with several input sets, so hard-coded answers fail
- 10 exam-style projects: the four CW1 mock tasks (food bill, marks analysis, Employee OOP, debugging the expense tracker), plus six new practice tasks in the same style
- Playground with `input()`, flashcards (including an Exam deck), a reference cheat sheet, a dictionary, XP and a certificate

## Develop
```
python tests/check_content.py                       # every solution passes, every starter fails
uv run --with playwright python tests/smoke.py      # headless browser test of all pages + Python
```
Lessons live in `js/content/lessons-*.js`; exam projects in `js/content/exam.js`.
Test code can use `run_input([...])` to re-run the learner's code with different `input()` values, and `has_num(text, value)` / `nums(text)` to read numbers from output.
