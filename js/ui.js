/* Shell-level UI: sidebar, stat chip, toasts, confetti, modal, Try-It modal, command palette. */
(function () {
  const { html, raw, el, $, $$, esc } = FP.u;
  const S = FP.store;

  const lessonIndex = (id) => FP.LESSONS.findIndex(l => l.id === id);
  const tracks = () => [...new Set(FP.LESSONS.map(l => l.track))];
  const lessonPassed = (l) => l.challenges.every((_, i) => S.state.challenges[`${l.id}:${i}`]);
  const doneCount = () => FP.LESSONS.filter(l => S.state.lessons[l.id]?.done).length;
  const nextLesson = () => FP.LESSONS.find(l => !S.state.lessons[l.id]?.done);

  function renderSidebar(activeId) {
    const sb = $("#sidebar");
    const total = FP.LESSONS.length, done = doneCount();
    const runs = [];
    FP.LESSONS.forEach((l, i) => { if (!runs.length || runs[runs.length - 1].t !== l.track) runs.push({ t: l.track, items: [] }); runs[runs.length - 1].items.push({ l, i }); });
    const groups = runs.map(({ t, items: run }) => {
      const items = run.map(({ l, i }) => html`
        <a class="side-link ${l.id === activeId ? "active" : ""} ${S.state.lessons[l.id]?.done ? "done" : ""}" href="#/learn/${l.id}">
          <span class="num">${String(i + 1).padStart(2, "0")}</span><span>${l.title}</span><span class="tick" aria-hidden="true"></span>
        </a>`);
      return html`<div class="side-group">${t}</div>${items}`;
    });
    sb.innerHTML = html`
      <div class="side-progress">
        <div class="row"><span>Course progress</span><b>${done} / ${total}</b></div>
        <div class="bar green"><i style="width:${Math.round(done / total * 100)}%"></i></div>
      </div>
      ${groups}
      <div class="side-group">Practice</div>
      <a class="side-link" href="#/exercises"><span class="num">··</span><span>All exercises</span></a>
      <a class="side-link" href="#/projects"><span class="num">··</span><span>Boss fight projects</span></a>
      <a class="side-link" href="#/certificate"><span class="num">··</span><span>Certificate</span></a>
      <a class="side-link" href="#/settings"><span class="num">··</span><span>Settings & backup</span></a>`.toString();
    const act = $(".side-link.active", sb);
    if (act) {
      const r = act.getBoundingClientRect(), sr = sb.getBoundingClientRect();
      if (r.top < sr.top || r.bottom > sr.bottom) sb.scrollTop += r.top - sr.top - sr.height / 3;
    }
  }

  function renderChip() {
    const st = S.streak();
    $("#statChip").innerHTML = html`
      <span class="lvl">LV ${S.level()}</span>
      <span title="${S.wallet()} spendable">${S.state.xp}<span class="xp-label"> XP</span></span>
      <span class="streak ${st ? "" : "off"}" title="Day streak">▲ ${st}</span>`.toString();
  }

  function toast(content, ms = 3200) {
    const t = el(`<div class="toast" role="status">${content}</div>`);
    const stack = $("#toasts"); stack.append(t);
    while (stack.children.length > 3) stack.firstElementChild.remove();
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 260); }, ms);
  }

  function confetti(n = 120) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || S.setting("motion") === false) return;
    const c = el(`<canvas class="confetti"></canvas>`); document.body.append(c);
    const ctx = c.getContext("2d"); const dpr = devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ["#FFD43B", "#2F6CA3", "#1E8A55", "#F07A6A", "#17191C"];
    const ps = Array.from({ length: n }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35,
      vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4,
      rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[Math.random() * colors.length | 0],
    }));
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++frame < 160) requestAnimationFrame(tick); else c.remove();
    })();
  }

  function modal({ title, body, wide = true, onClose }) {
    const root = $("#modalRoot");
    const scrim = el(html`<div class="modal-scrim" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal" style="${wide ? "" : "width:min(560px,100%)"}">
        <div class="modal-head"><h3>${title}</h3><span class="spacer"></span><button class="icon-btn" data-close aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
        <div class="modal-body"></div>
      </div></div>`);
    const prevFocus = document.activeElement;
    const close = () => { scrim.remove(); document.removeEventListener("keydown", onKey); onClose?.(); prevFocus?.focus?.(); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    scrim.addEventListener("mousedown", (e) => { if (e.target === scrim) close(); });
    scrim.querySelector("[data-close]").onclick = close;
    document.addEventListener("keydown", onKey);
    const b = scrim.querySelector(".modal-body");
    if (typeof body === "string") b.innerHTML = body; else b.append(body);
    root.append(scrim);
    return { close, body: b };
  }

  // W3Schools-style "Try it Yourself": side-by-side editor and result.
  function tryIt(code, title = "Try it Yourself") {
    if ($("#modalRoot .modal-scrim")) return; // never stack a second popup
    const wrap = el(`<div></div>`);
    const m = modal({ title, body: wrap, onClose: () => ide.destroy() });
    const ide = FP.editor.createIDE(wrap, { code, minLines: 12, autoRun: !/input\s*\(/.test(code), visual: "auto" });
    setTimeout(() => { ide.refresh(); ide.focus(); }, 30);
    return m;
  }

  // Ctrl+K command palette across lessons, sections, reference and pages.
  function buildIndex() {
    const items = [
      { kind: "Page", title: "Dashboard", href: "#/" },
      { kind: "Page", title: "Playground", href: "#/playground", sub: "Write and run any Python" },
      { kind: "Page", title: "Exercises", href: "#/exercises" },
      { kind: "Page", title: "Boss fight projects", href: "#/projects" },
      { kind: "Page", title: "Flashcards", href: "#/flashcards" },
      { kind: "Page", title: "Reference", href: "#/reference" },
      { kind: "Page", title: "Settings & backup", href: "#/settings" },
      { kind: "Page", title: "Dictionary", href: "#/dictionary", sub: "Programming words explained" },
      { kind: "Page", title: "Certificate", href: "#/certificate" },
    ];
    FP.LESSONS.forEach((l, i) => {
      items.push({ kind: "Lesson", title: `${i + 1}. ${l.title}`, href: `#/learn/${l.id}`, sub: l.summary });
      l.sections.forEach(s => items.push({ kind: "Section", title: s.h, href: `#/learn/${l.id}/${FP.u.slug(s.h)}`, sub: l.title, text: s.body.replace(/<[^>]+>/g, " ") }));
    });
    (FP.BOSSES || []).forEach(b => items.push({ kind: "Project", title: b.title, href: `#/projects/${b.id}`, sub: b.tagline }));
    (FP.GLOSSARY || []).forEach(g => items.push({ kind: "Word", title: g.term, href: `#/dictionary/${g.id}`, sub: g.short }));
    Object.entries(FP.REFERENCE || {}).forEach(([sec, list]) => list.forEach(r => items.push({ kind: "Reference", title: r.term, href: `#/reference?q=${encodeURIComponent(r.term)}`, sub: sec, text: r.definition })));
    return items;
  }
  let index;
  function palette() {
    if ($(".palette")) return;
    index ||= buildIndex();
    const scrim = el(`<div class="modal-scrim"><div class="palette" role="dialog" aria-label="Search">
      <input placeholder="Search lessons, topics, functions…" aria-label="Search" spellcheck="false">
      <div class="palette-list" role="listbox"></div>
      <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div></div></div>`);
    const input = $("input", scrim), list = $(".palette-list", scrim);
    let results = [], sel = 0;
    const close = () => scrim.remove();
    const go = (r) => { if (r) { location.hash = r.href.slice(1); close(); } };
    function score(item, q) {
      const t = item.title.toLowerCase(), s = (item.sub || "").toLowerCase(), x = (item.text || "").toLowerCase();
      if (t.startsWith(q)) return 100; if (t.includes(q)) return 70;
      if (s.includes(q)) return 40; if (x.includes(q)) return 20;
      const words = q.split(/\s+/); if (words.every(w => (t + " " + s + " " + x).includes(w))) return 10;
      return 0;
    }
    function draw() {
      const q = input.value.trim().toLowerCase();
      results = q ? index.map(i => [score(i, q), i]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, 40).map(x => x[1])
        : index.filter(i => i.kind === "Lesson" || i.kind === "Page").slice(0, 14);
      sel = Math.min(sel, Math.max(results.length - 1, 0));
      list.innerHTML = results.length ? results.map((r, i) => html`<a class="palette-item ${i === sel ? "sel" : ""}" href="${r.href}" data-i="${i}" role="option"><span class="kind">${r.kind}</span><span>${r.title}</span><span class="sub">${r.sub || ""}</span></a>`).join("")
        : `<div class="palette-empty">No results for “${esc(input.value)}”</div>`;
      list.querySelector(".sel")?.scrollIntoView({ block: "nearest" });
    }
    input.addEventListener("input", () => { sel = 0; draw(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, results.length - 1); draw(); e.preventDefault(); }
      if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
      if (e.key === "Enter") { go(results[sel]); e.preventDefault(); }
      if (e.key === "Escape") close();
    });
    list.addEventListener("click", (e) => { const a = e.target.closest("[data-i]"); if (a) { e.preventDefault(); go(results[+a.dataset.i]); } });
    scrim.addEventListener("mousedown", (e) => { if (e.target === scrim) close(); });
    $("#modalRoot").append(scrim); draw(); input.focus();
  }

  // Reacts to XP events from the store with toasts / confetti.
  S.subscribe((evt) => {
    renderChip();
    if (evt.type === "xp" && evt.amount > 0) FP.fx ? FP.fx.flyXP(evt.amount) : toast(`<span class="big">+${evt.amount} XP</span>`);
    if (evt.levelUp) setTimeout(() => FP.fx ? FP.fx.levelUp(evt.levelUp, S.rank()) : confetti(), 900);
    (evt.badges || []).forEach((b, i) => setTimeout(() => { FP.fx?.sound("badge"); toast(`<span class="big">${esc(b.short)}</span><span>Badge unlocked: <b>${esc(b.name)}</b></span>`, 4500); }, 1200 + i * 600));
  });

  function renderAccount() {
    const box = $("#account"); if (!box) return;
    if (!FP.cloud?.enabled) { box.hidden = true; return; }
    box.hidden = false;
    const initial = (FP.cloud.user || "?").trim()[0].toUpperCase();
    box.innerHTML = html`<button class="avatar" aria-haspopup="true" title="${FP.cloud.user}">${initial}<i class="sync-dot"></i></button>
      <div class="account-menu" hidden><div class="who"><b>${FP.cloud.user}</b><span class="sync-text"></span></div>
      <a href="#/settings">Settings</a><button data-logout>Log out</button></div>`.toString();
    const menu = box.querySelector(".account-menu");
    box.querySelector(".avatar").onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; };
    document.addEventListener("click", () => menu.hidden = true);
    box.querySelector("[data-logout]").onclick = () => { if (confirm("Log out? Your progress is saved online.")) FP.cloud.logout(); };
    const labels = { synced: "Saved online", saving: "Saving…", offline: "Offline: will save when back online", "": "" };
    FP.cloud.onStatus(s => { box.dataset.sync = s; const t = box.querySelector(".sync-text"); if (t) t.textContent = labels[s] ?? s; });
  }

  FP.ui = { renderAccount, renderSidebar, renderChip, toast, confetti, modal, tryIt, palette, lessonIndex, tracks, lessonPassed, doneCount, nextLesson };
})();
