/* Home: hero with live editor for newcomers, dashboard once they've started. */
(function () {
  const { html, raw, $ } = FP.u;
  const S = FP.store, U = FP.ui;

  const HERO_CODE = `# Edit me, then press Run (or Ctrl + Enter)
marks = {"Ada": 78, "Grace": 91, "Alan": 64}

for name, mark in sorted(marks.items(), key=lambda m: -m[1]):
    bar = "█" * (mark // 10)
    print(f"{name:<6} {bar} {mark}")`;

  function heatmap() {
    const days = 7 * 12, cells = [], today = new Date();
    const start = new Date(today); start.setDate(start.getDate() - (days - 1) - start.getDay());
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const k = FP.u.todayKey(d), xp = S.state.activity[k] || 0;
      const l = xp === 0 ? 0 : xp < 40 ? 1 : xp < 120 ? 2 : 3;
      cells.push(`<i data-l="${l}" class="${k === FP.u.todayKey() ? "today" : ""}" title="${k}: ${xp} XP"></i>`);
    }
    return cells.join("");
  }

  function render(main) {
    const started = S.state.xp > 0 || Object.keys(S.state.lessons).length;
    const next = U.nextLesson();
    const last = S.state.lastLesson && FP.LESSONS.find(l => l.id === S.state.lastLesson);
    const resume = (last && !S.state.lessons[last.id]?.done) ? last : next;
    const lp = S.levelProgress();
    const done = U.doneCount(), total = FP.LESSONS.length;
    const ch = Object.keys(S.state.challenges).length, chTotal = FP.LESSONS.reduce((a, l) => a + l.challenges.length, 0);

    const roadmap = FP.LESSONS.map((l, i) => html`
      <a class="r-card ${S.state.lessons[l.id]?.done ? "done" : ""} ${next && l.id === next.id ? "next" : ""}" href="#/learn/${l.id}">
        <span class="n">${String(i + 1).padStart(2, "0")}</span>
        <span><div class="t">${l.title}</div><div class="m">${l.track} · ${l.minutes} min · ${l.xp} XP</div></span>
      </a>`);

    const tracks = U.tracks().map(t => {
      const ls = FP.LESSONS.filter(l => l.track === t), d = ls.filter(l => S.state.lessons[l.id]?.done).length;
      return html`<div class="track-row"><span class="n">${t}</span><div class="bar ${d === ls.length ? "green" : ""}"><i style="width:${d / ls.length * 100}%"></i></div><span class="c">${d}/${ls.length}</span></div>`;
    });

    const badges = S.BADGES.map(b => html`<div class="badge ${S.state.badges[b.id] ? "got" : ""}" title="${b.name}"><div class="b-icon">${b.short}</div>${b.name}</div>`);

    main.innerHTML = html`
      <div class="page">
        ${!started ? raw(html`
        <section class="home-hero">
          <div>
            <p class="eyebrow">Python for UDE4070CM · Fundamentals of Business Programming</p>
            <h1>Learn Python by <em>writing</em> Python.</h1>
            <p class="lede">${total} bite-sized lessons with a live editor on every page. Every exercise is checked by actually running your code, from your first <code>print()</code> to the bills, mark sheets and OOP salary systems the CW1 test asks for.</p>
            <div class="actions">
              <a class="btn primary lg" href="#/learn/${FP.LESSONS[0].id}">Start lesson 1 →</a>
              <a class="btn lg" href="#/playground">Open the playground</a>
            </div>
            <p class="muted" style="margin-top:18px;font-size:.88rem">Nothing to install. Python runs right here in your browser, and your progress saves automatically.</p>
          </div>
          <div class="hero-ide" id="heroIde"></div>
        </section>`.toString()) : raw(html`
        <p class="eyebrow">Dashboard</p>
        <h1 style="margin-bottom:6px">${S.state.settings.name ? `Welcome back, ${S.state.settings.name}.` : "Welcome back."}</h1>
        <p class="muted" style="font-size:1.05rem">Level ${lp.lvl} · ${S.rank()} · ${lp.need - lp.into} XP to level ${lp.lvl + 1}</p>`.toString())}

        <div class="dash">
          <div>
            ${resume ? raw(html`
            <div class="panel continue">
              <div>
                <p class="eyebrow">${started ? "Continue where you left off" : "Up first"}</p>
                <div class="title">${U.lessonIndex(resume.id) + 1}. ${resume.title}</div>
                <div class="muted">${resume.summary}</div>
              </div>
              <a class="btn primary lg" href="#/learn/${resume.id}">${started ? "Continue" : "Start"} →</a>
            </div>`.toString()) : raw(`<div class="panel continue"><div><p class="eyebrow">Course complete</p><div class="title">You finished every lesson.</div><div class="muted">Take on the boss fights or claim your certificate.</div></div><a class="btn yellow lg" href="#/certificate">Certificate →</a></div>`)}

            <div class="stats" style="margin-top:20px">
              <div class="stat"><div class="v">${done}<span class="muted" style="font-size:1rem">/${total}</span></div><div class="k">Lessons complete</div></div>
              <div class="stat"><div class="v">${ch}<span class="muted" style="font-size:1rem">/${chTotal}</span></div><div class="k">Exercises solved</div></div>
              <div class="stat"><div class="v">${S.streak()}</div><div class="k">Day streak</div></div>
            </div>

            <div class="panel" style="margin-top:20px">
              <h3>Progress by track</h3>
              <div class="track-list">${tracks}</div>
            </div>
          </div>

          <div>
            <div class="panel">
              <h3 style="display:flex;justify-content:space-between;align-items:baseline">Level ${lp.lvl} <span class="tag xp">${S.state.xp} XP</span></h3>
              <div class="bar yellow" style="height:10px"><i style="width:${lp.pct}%"></i></div>
              <p class="muted" style="font-size:.85rem;margin:8px 0 0">${lp.into} / ${lp.need} XP to <b>${S.RANKS[Math.min(lp.lvl, S.RANKS.length - 1)]}</b></p>
            </div>
            <div class="panel">
              <h3>Activity</h3>
              <div class="heat" aria-label="Activity over the last 12 weeks">${raw(heatmap())}</div>
              <p class="muted" style="font-size:.8rem;margin:10px 0 0">Earn XP each day to keep your streak going.</p>
            </div>
            <div class="panel">
              <h3>Badges <span class="muted" style="font-weight:500;font-size:.85rem">${Object.keys(S.state.badges).length}/${S.BADGES.length}</span></h3>
              <div class="badges">${badges}</div>
            </div>
          </div>
        </div>

        <section class="roadmap">
          <h2 style="margin-top:0">Your roadmap</h2>
          <div class="roadmap-grid">${roadmap}</div>
        </section>
      </div>`.toString();

    const host = $("#heroIde", main);
    if (host) FP.editor.createIDE(host, { code: HERO_CODE, file: "try_me.py", stdin: false, minLines: 7 });
  }

  FP.views = FP.views || {};
  FP.views.home = render;
})();
