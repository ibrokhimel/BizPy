/* Playground, Exercises hub, Projects (boss fights). */
(function () {
  const { html, raw, $, el } = FP.u;
  const S = FP.store, U = FP.ui;

  const SAMPLES = {
    "Hello input()": `name = input("What's your name? ")\nage = int(input("How old are you? "))\nprint(f"Hi {name}! In 10 years you'll be {age + 10}.")`,
    "Bill with discount": `name = input("Enter customer name: ")
n = int(input("Enter number of items: "))
total = 0
for i in range(1, n + 1):
    total += float(input(f"Enter price of item {i}: "))
discount = total * 0.15 if total > 300 else 0
print("----- BILL -----")
print(f"Customer Name : {name}")
print(f"Total Amount  : \${total}")
print(f"Discount      : \${discount}")
print(f"Amount Payable: \${total - discount}")`,
    "Squats (visualiser)": `# for i in range(10): sit()  ->  a person sitting 10 times\nreps = int(input("How many squats? "))\nfor i in range(reps):\n    sit()\n    stand()\nsay(f"{reps} squats done!")`,
    "Number guessing game": `import random\n\nsecret = random.randint(1, 20)\ntries = 0\nprint("I'm thinking of a number between 1 and 20.")\nwhile True:\n    guess = int(input("Your guess: "))\n    tries += 1\n    if guess < secret:\n        print("Higher!")\n    elif guess > secret:\n        print("Lower!")\n    else:\n        print(f"Got it in {tries} tries!")\n        break`,
    "Grade calculator": `def grade(mark):\n    if mark >= 70: return "First"\n    if mark >= 60: return "2:1"\n    if mark >= 50: return "2:2"\n    if mark >= 40: return "Third"\n    return "Fail"\n\nfor m in [82, 65, 55, 41, 30]:\n    print(m, "->", grade(m))`,
    "Class + objects": `class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Deposit must be positive")\n        self.balance += amount\n\n    def __str__(self):\n        return f"{self.owner}: £{self.balance:.2f}"\n\nacc = BankAccount("Ada")\nacc.deposit(50)\nprint(acc)`,
    
    "Binary search": `def binary_search(items, target):\n    lo, hi = 0, len(items) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\nnums = [2, 5, 8, 12, 16, 23, 38]\nprint(binary_search(nums, 23))\nprint(binary_search(nums, 7))`,
  };

  function playground(main, query) {
    let shared = null;
    if (query.get("code")) { try { shared = decodeURIComponent(escape(atob(query.get("code")))); } catch (_) {} }
    main.innerHTML = html`<div class="page" style="max-width:1500px">
      <div class="pg-head">
        <h1>Playground</h1>
        <select data-sample aria-label="Load an example"><option value="">Load an example…</option>${Object.keys(SAMPLES).map(k => html`<option>${k}</option>`)}</select>
        <select data-snippet aria-label="Open a saved snippet"><option value="">My snippets (${S.state.snippets.length})</option>${S.state.snippets.map(s => html`<option>${s.name}</option>`)}</select>
        <span style="flex:1"></span>
        <button class="btn sm" data-save>Save snippet</button>
        <button class="btn sm" data-share>Copy share link</button>
        <button class="btn sm ghost" data-download>Download .py</button>
      </div>
      <div class="pg"><div class="pg-ed"></div><div class="pg-out"></div></div>
      <p class="muted" style="font-size:.85rem;margin-top:12px"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> runs, and the Run button turns into Stop. <code>input()</code> waits for you to type in the console and press Enter, just like real Python. Try the visualiser functions: <code>sit()</code> <code>jump()</code> <code>walk(3)</code> <code>say("hi")</code> <code>bars([3,1,2])</code> <code>show_list(x)</code> <code>show_var(n=n)</code> <code>light("red")</code>.</p>
    </div>`.toString();

    const ide = FP.editor.createIDE($(".pg-ed", main), { code: shared ?? SAMPLES["Hello input()"], key: shared ? null : "playground", file: "playground.py", minLines: 20, fill: true, visual: "auto", stdinValue: "Ada | 21" });
    // Move the console (and visualiser) to the right column: editor left, terminal right, like an IDE.
    const right = el(`<div class="ide pg-term"></div>`);
    [".ide-stdin", ".ide-stage-slot", ".ide-out"].forEach(s => { const n = $(s, ide.node); if (n) right.append(n); });
    $(".pg-out", main).append(right);
    ide.node.style.height = "100%";
    setTimeout(() => ide.refresh(), 30);

    $("[data-sample]", main).onchange = (e) => { if (e.target.value) ide.setCode(SAMPLES[e.target.value]); e.target.value = ""; };
    $("[data-snippet]", main).onchange = (e) => { const s = S.state.snippets.find(x => x.name === e.target.value); if (s) ide.setCode(s.code); e.target.value = ""; };
    $("[data-save]", main).onclick = () => {
      const name = prompt("Name this snippet:", "my_script"); if (!name) return;
      S.saveSnippet(name.trim(), ide.getCode()); U.toast(`Saved <b>${FP.u.esc(name)}</b>`); playground(main, new URLSearchParams());
    };
    $("[data-share]", main).onclick = async () => {
      const b64 = btoa(unescape(encodeURIComponent(ide.getCode())));
      const url = location.href.split("#")[0] + "#/playground?code=" + encodeURIComponent(b64);
      await FP.u.copyText(url); U.toast("Share link copied. Anyone with it sees this code.");
    };
    $("[data-download]", main).onclick = () => {
      const a = el(`<a download="bizpy_playground.py"></a>`);
      a.href = URL.createObjectURL(new Blob([ide.getCode()], { type: "text/x-python" })); a.click();
    };
  }

  function exercises(main) {
    const rows = FP.LESSONS.map((l, i) => {
      const dots = l.challenges.map((_, ci) => `<i class="${S.state.challenges[`${l.id}:${ci}`] ? "ok" : ""}"></i>`).join("");
      const solved = l.challenges.filter((_, ci) => S.state.challenges[`${l.id}:${ci}`]).length;
      return html`<a class="hub-row" href="#/learn/${l.id}/exercises">
        <span class="r-card ${solved === l.challenges.length ? "done" : ""}" style="padding:0;border:0;background:none"><span class="n">${String(i + 1).padStart(2, "0")}</span></span>
        <span><b>${l.title}</b><div class="muted" style="font-size:.85rem">${l.track} · ${solved}/${l.challenges.length} solved</div></span>
        <span class="dots">${raw(dots)}</span></a>`;
    });
    const total = FP.LESSONS.reduce((a, l) => a + l.challenges.length, 0), solved = Object.keys(S.state.challenges).length;
    main.innerHTML = html`<div class="page narrow">
      <p class="eyebrow">Exercises</p><h1>Practise</h1>
      <p class="muted" style="font-size:1.05rem">${solved} of ${total} exercises solved. Each one is checked by running your code against hidden tests, so hard-coding the answer won't work.</p>
      <div class="bar green" style="margin:10px 0 28px"><i style="width:${total ? solved / total * 100 : 0}%"></i></div>
      <div class="hub-list">${rows}</div></div>`.toString();
  }

  const unlocked = (b) => !b.unlockAfter || S.state.lessons[b.unlockAfter]?.done;

  function projects(main, id) {
    const bosses = FP.BOSSES || [];
    if (id) return bossPage(main, bosses.find(b => b.id === id));
    main.innerHTML = html`<div class="page narrow">
      <p class="eyebrow">Projects</p><h1>Boss fights</h1>
      <p class="muted" style="font-size:1.05rem;max-width:40em">Bigger projects that combine everything from a group of lessons. Each one has a brief, a starter file and acceptance tests. Pass them all to defeat the boss. They are written like the CW1 test tasks: read input, calculate, print a formatted result, or fix broken code.</p>
      <div class="boss-grid" style="margin-top:26px">${bosses.map((b, i) => {
        const won = S.state.bosses[b.id]?.done, open = unlocked(b);
        const after = FP.LESSONS.find(l => l.id === b.unlockAfter);
        return html`<a class="boss ${won ? "won" : ""} ${open ? "" : "locked"}" href="#/projects/${b.id}">
          <span class="lvl">${won ? "✓" : i + 1}</span>
          <span><h3>${b.title}</h3><p>${b.tagline || ""}</p>${!open && after ? raw(html`<p class="muted" style="font-size:.82rem;margin-top:4px">Unlocks after “${after.title}” (you can still peek)</p>`.toString()) : ""}</span>
          <span class="tag xp">${b.xp} XP</span></a>`;
      })}</div></div>`.toString();
  }

  function bossPage(main, b) {
    if (!b) { main.innerHTML = `<div class="page narrow"><div class="empty">Project not found. <a href="#/projects">All projects</a></div></div>`; return; }
    const won = S.state.bosses[b.id]?.done;
    main.innerHTML = html`<div class="page narrow">
      <div class="crumbs"><a href="#/projects">Boss fights</a><span>/</span><span>${b.title}</span></div>
      <h1>${b.title}</h1>
      <div class="lesson-meta" style="margin-bottom:18px"><span class="tag xp">${b.xp} XP</span>${won ? raw(`<span class="tag done">Defeated</span>`) : ""}${!unlocked(b) ? raw(`<span class="tag">Recommended after an earlier lesson</span>`) : ""}</div>
      <div class="prose">${raw(b.brief)}</div>
      <h3 style="margin-top:22px">Requirements</h3>
      <ul class="reqs">${b.requirements.map(r => html`<li>${r}</li>`)}</ul>
      <h3 style="margin-top:28px">Your code</h3>
      <p class="muted" style="font-size:.92rem">Build it here, or in your own editor and paste it in. <b>Check</b> runs the acceptance tests.</p>
      <div class="boss-ide"></div><div class="boss-fb"></div>
      <div class="ex-tools"><button class="btn sm ghost" data-solution>Reveal reference solution</button></div>
    </div>`.toString();
    const fb = $(".boss-fb", main);
    FP.editor.createIDE($(".boss-ide", main), {
      code: b.starter, key: "boss:" + b.id, file: b.id + ".py", minLines: 18, stdinValue: (b.stdin || "").split("\n").join(" | "),
      check: async (code, stdin) => {
        const res = await FP.grade(code, stdin || b.stdin || "", b.test);
        fb.innerHTML = res.passed
          ? `<div class="ex-feedback ok"><b>Boss defeated!</b>&nbsp;Every acceptance test passed.</div>`
          : `<div class="ex-feedback bad"><b>Not yet.</b>&nbsp;${FP.u.esc(res.message || "")}</div>`;
        FP.fx.sound(res.passed ? "complete" : "wrong"); if (!res.passed) FP.fx.shake(fb);
        if (res.passed) { const xp = S.completeBoss(b); if (xp) U.confetti(220); else if (S.isRevealed("boss:" + b.id)) fb.innerHTML = `<div class="ex-feedback ok"><b>Boss defeated.</b>&nbsp;No XP because the reference solution was viewed.</div>`; }
        return res;
      },
    });
    $("[data-solution]", main).onclick = () => {
      if (!S.state.bosses[b.id]?.done && !S.isRevealed("boss:" + b.id) &&
          !confirm(`Viewing the reference solution means this boss gives 0 XP (instead of ${b.xp}), even after you beat it. Show it anyway?`)) return;
      if (!S.state.bosses[b.id]?.done) S.reveal("boss:" + b.id);
      U.modal({ title: b.title + " · reference solution", body: FP.editor.exampleBlock(b.solution, { label: "Reference solution", tryIt: false }).toString() });
    };
  }

  FP.views = FP.views || {};
  Object.assign(FP.views, { playground, exercises, projects });
})();
