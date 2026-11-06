/* Flashcards (Leitner spaced repetition), Reference, Settings, Certificate. */
(function () {
  const { html, raw, $, $$, el } = FP.u;
  const S = FP.store, U = FP.ui;

  function flashcards(main) {
    const cards = FP.FLASHCARDS || [];
    const now = Date.now();
    const tags = ["All", ...new Set(cards.map(c => c.tag).filter(Boolean))];
    let tag = "All";
    const due = () => cards.map((c, i) => ({ c, i })).filter(x => (tag === "All" || x.c.tag === tag) && S.card(x.i).due <= Date.now())
      .sort((a, b) => S.card(a.i).box - S.card(b.i).box);
    let queue = due(), flipped = false;

    function draw() {
      flipped = false;
      const boxes = [1, 2, 3, 4, 5].map(b => cards.filter((_, i) => S.card(i).box === b).length);
      const cur = queue[0];
      main.innerHTML = html`<div class="page narrow">
        <p class="eyebrow">Flashcards</p><h1>Spaced repetition</h1>
        <p class="muted">Cards you get right move up a box and come back later (1, 3, 7, then 14 days). Cards you miss go back to box 1. Ten minutes a day beats a night of cramming.</p>
        <div style="display:flex;gap:16px;align-items:end;flex-wrap:wrap;margin:18px 0 6px">
          <div class="leitner">${boxes.map((n, b) => html`<div><b>${n}</b>Box ${b + 1}</div>`)}</div>
          <span style="flex:1"></span>
          <select data-tag style="height:34px;border-radius:7px;border:1px solid var(--line-strong);background:var(--surface);padding:0 8px">${tags.map(t => html`<option ${t === tag ? "selected" : ""}>${t}</option>`)}</select>
        </div>
        ${cur ? raw(html`
        <div class="fc-wrap">
          <p class="muted" style="margin:0">${queue.length} due · box ${S.card(cur.i).box}</p>
          <div class="fc" tabindex="0" role="button" aria-label="Flip card">
            <div class="fc-inner">
              <div class="fc-face"><span class="corner">${cur.c.tag || "Question"}</span><div class="q">${cur.c.front}</div><p class="muted" style="margin:18px 0 0;font-size:.85rem">Click or press Space to flip</p></div>
              <div class="fc-face back"><span class="corner">Answer</span><div class="q">${cur.c.back}</div></div>
            </div>
          </div>
          <div class="fc-actions">
            <button class="btn lg" data-grade="0" ${flipped ? "" : "disabled"}>Missed it <kbd>1</kbd></button>
            <button class="btn lg go" data-grade="1" ${flipped ? "" : "disabled"}>Got it <kbd>2</kbd></button>
          </div>
        </div>`.toString()) : raw(html`<div class="empty" style="margin-top:20px"><b>All caught up.</b><br>No cards due right now. Come back tomorrow, or <a href="#" data-cram>review everything anyway</a>.</div>`.toString())}
      </div>`.toString();
      $("[data-tag]", main).onchange = (e) => { tag = e.target.value; queue = due(); flipped = false; draw(); };
      const fc = $(".fc", main); if (fc) { fc.onclick = flip; fc.onkeydown = (e) => { if (e.key === "Enter") flip(); }; }
      $$("[data-grade]", main).forEach(b => b.onclick = () => gradeCur(b.dataset.grade === "1"));
      const cram = $("[data-cram]", main); if (cram) cram.onclick = (e) => { e.preventDefault(); queue = cards.map((c, i) => ({ c, i })).filter(x => tag === "All" || x.c.tag === tag); draw(); };
    }
    // Flip in place so the CSS 3D rotation actually animates (re-rendering would just swap the card instantly).
    function flip() {
      const fc = $(".fc", main); if (!fc) return;
      flipped = !flipped;
      FP.fx.sound("flip");
      fc.classList.toggle("flipped", flipped);
      $$("[data-grade]", main).forEach(b => b.disabled = !flipped);
    }
    function gradeCur(right) {
      const cur = queue.shift(); if (!cur) return;
      FP.fx.sound(right ? "coin" : "wrong"); if (right) FP.fx.burst(undefined, undefined, { n: 12, spread: .6 });
      S.gradeCard(cur.i, right); if (!right) queue.push(cur); flipped = false;
      const fc = $(".fc", main);
      if (fc) { fc.classList.add("leaving", right ? "right" : "wrong"); setTimeout(draw, 260); } else draw();
    }
    const onKey = (e) => {
      if (!location.hash.startsWith("#/flashcards") || e.target.matches("input,textarea,select")) return;
      if (e.code === "Space") { e.preventDefault(); flip(); }
      if (flipped && e.key === "1") gradeCur(false);
      if (flipped && e.key === "2") gradeCur(true);
    };
    document.addEventListener("keydown", onKey);
    FP.views.flashcardsCleanup = () => document.removeEventListener("keydown", onKey);
    draw();
  }

  function reference(main, query) {
    const ref = FP.REFERENCE || {};
    main.innerHTML = html`<div class="page narrow">
      <p class="eyebrow">Reference</p><h1>Cheat sheet</h1>
      <p class="muted">Everything you'll keep looking up, in one place. Click any example to try it.</p>
      <input class="ref-search" placeholder="Filter… e.g. append, JOIN, super" value="${query.get("q") || ""}" aria-label="Filter reference">
      <div class="ref-body"></div></div>`.toString();
    const body = $(".ref-body", main), input = $(".ref-search", main);
    function draw() {
      const q = input.value.trim().toLowerCase();
      const out = Object.entries(ref).map(([sec, items]) => {
        const hits = items.filter(r => !q || (r.term + " " + r.definition + " " + (r.example || "") + " " + sec).toLowerCase().includes(q));
        if (!hits.length) return "";
        return html`<section class="ref-section"><h2>${sec}</h2><table class="ref-table">${hits.map(r => html`<tr><td><code>${r.term}</code></td><td>${r.definition}${r.example ? raw(html`<pre data-try title="Click to try it">${raw(FP.u.highlight(r.example))}</pre>`.toString()) : ""}</td></tr>`)}</table></section>`.toString();
      }).join("");
      body.innerHTML = out || `<div class="empty">Nothing matches “${FP.u.esc(input.value)}”.</div>`;
    }
    input.addEventListener("input", draw);
    body.addEventListener("click", (e) => { const p = e.target.closest("[data-try]"); if (p && !/^\s*(SELECT|INSERT|CREATE|UPDATE|DELETE)/i.test(p.textContent)) U.tryIt(p.textContent); });
    draw(); if (query.get("q")) input.focus();
  }

  function settings(main) {
    const fs = S.setting("fontSize");
    main.innerHTML = html`<div class="page narrow">
      <p class="eyebrow">Settings</p><h1>Settings & backup</h1>
      <div class="settings-row"><div><b>Your name</b><p>Shown on the dashboard and your certificate.</p></div><input data-name value="${S.setting("name")}" placeholder="Your name" style="height:38px;border-radius:8px;border:1px solid var(--line-strong);background:var(--surface);padding:0 12px"></div>
      <div class="settings-row"><div><b>Theme</b><p>Light, dark, or follow your system.</p></div><select data-theme style="height:38px;border-radius:8px;border:1px solid var(--line-strong);background:var(--surface);padding:0 10px">${["system", "light", "dark"].map(t => html`<option ${((S.setting("theme") || "system") === t) ? "selected" : ""}>${t}</option>`)}</select></div>
      <div class="settings-row"><div><b>Sound effects</b><p>Little sounds for correct answers, XP and level-ups.</p></div><label class="switch"><input type="checkbox" data-sound ${S.setting("sound") !== false ? "checked" : ""}><span></span></label></div>
      <div class="settings-row"><div><b>Animations</b><p>Confetti, flying XP and bouncy buttons.</p></div><label class="switch"><input type="checkbox" data-motion ${S.setting("motion") !== false ? "checked" : ""}><span></span></label></div>
      <div class="settings-row"><div><b>Editor font size</b><p>Currently ${fs}px.</p></div><input type="range" min="12" max="20" step="0.5" value="${fs}" data-font></div>
      <div class="settings-row"><div><b>Back up progress</b><p>Progress lives in this browser. Download a backup to move it to another device.</p></div><div style="display:flex;gap:8px"><button class="btn" data-export>Download backup</button><label class="btn">Restore…<input type="file" accept="application/json,.json" data-import hidden></label></div></div>
      <div class="settings-row"><div><b>Reset everything</b><p>Deletes all XP, progress and saved code on this device.</p></div><button class="btn" style="color:var(--red)" data-reset>Reset progress</button></div>
      <div class="settings-row"><div><b>Keyboard shortcuts</b><p><kbd>Ctrl</kbd>+<kbd>K</kbd> search · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> run · <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd> check · <kbd>Alt</kbd>+<kbd>←/→</kbd> previous/next lesson</p></div></div>
    </div>`.toString();
    $("[data-sound]", main).onchange = (e) => { S.setting("sound", e.target.checked); if (e.target.checked) FP.fx.sound("correct"); };
    $("[data-motion]", main).onchange = (e) => S.setting("motion", e.target.checked);
    $("[data-name]", main).onchange = (e) => S.setting("name", e.target.value.trim());
    $("[data-theme]", main).onchange = (e) => { S.setting("theme", e.target.value === "system" ? null : e.target.value); FP.app.applyTheme(); };
    $("[data-font]", main).oninput = (e) => { S.setting("fontSize", +e.target.value); document.documentElement.style.setProperty("--editor-font", e.target.value + "px"); };
    $("[data-export]", main).onclick = () => { const a = el(`<a download="bizpy-progress-${FP.u.todayKey()}.json"></a>`); a.href = URL.createObjectURL(new Blob([S.exportJSON()], { type: "application/json" })); a.click(); };
    $("[data-import]", main).onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { S.importJSON(await f.text()); U.toast("Progress restored."); FP.app.route(); } catch (err) { alert(err.message); }
    };
    $("[data-reset]", main).onclick = () => { if (confirm("Really delete all progress on this device? Download a backup first if unsure.")) { S.reset(); U.toast("Progress reset."); FP.app.route(); } };
  }

  function certificate(main) {
    const total = FP.LESSONS.length, done = U.doneCount();
    const bossesWon = (FP.BOSSES || []).filter(b => S.state.bosses[b.id]?.done).length;
    if (done < total) {
      main.innerHTML = html`<div class="page narrow"><p class="eyebrow">Certificate</p><h1>Almost there</h1>
        <p class="muted" style="font-size:1.05rem">Finish all ${total} lessons to unlock your printable certificate. You've completed <b>${done}</b>.</p>
        <div class="bar green" style="margin:14px 0 24px;height:10px"><i style="width:${done / total * 100}%"></i></div>
        <a class="btn primary" href="#/learn/${U.nextLesson()?.id}">Continue learning →</a></div>`.toString();
      return;
    }
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    main.innerHTML = html`<div class="page">
      <div class="cert">
        <img src="assets/favicon.svg" alt="" width="54" height="54" style="margin:0 auto">
        <p class="eyebrow" style="margin-top:18px">Certificate of completion</p>
        <h1>Python Foundations</h1>
        <p class="muted">This certifies that</p>
        <input class="name" value="${S.setting("name") || ""}" placeholder="Type your name" aria-label="Name on certificate">
        <p>completed all ${total} BizPy lessons for <b>UDE4070CM Fundamentals of Business Programming</b>, covering input and output, lists, logic, OOP, debugging and testing,<br>solving ${Object.keys(S.state.challenges).length} graded exercises and ${bossesWon} boss-fight projects with ${S.state.xp} XP earned.</p>
        <p class="muted" style="margin-top:28px">${date}</p>
      </div>
      <p class="no-print" style="text-align:center"><button class="btn primary" onclick="print()">Print / save as PDF</button></p></div>`.toString();
    $(".cert input", main).onchange = (e) => S.setting("name", e.target.value.trim());
  }

  FP.views = FP.views || {};
  Object.assign(FP.views, { flashcards, reference, settings, certificate });
})();
