/* Lesson page: W3Schools-style article + Try it Yourself + graded exercises + quiz + completion. */
(function () {
  const { html, raw, $, $$, el, slug } = FP.u;
  const S = FP.store, U = FP.ui;

  // Grade learner code against a challenge's hidden Python test.
  async function grade(code, stdin, test) {
    const res = await FP.runner.run(code, { stdin, test });
    return res;
  }
  FP.grade = grade;

  function exerciseCard(lesson, ch, i) {
    const key = `${lesson.id}:${i}`;
    const passed = !!S.state.challenges[key];
    const card = el(html`
      <div class="exercise ${passed ? "passed" : ""}" id="ex-${i + 1}">
        <div class="ex-head">
          <span class="ex-num">${passed ? "✓" : i + 1}</span>
          <div class="ex-prompt">${raw(ch.prompt)}</div>
        </div>
        <div class="ex-body">
          <div class="ex-ide"></div>
          <div class="ex-feedback-slot"></div>
          <div class="ex-tools">
            <button class="btn sm ghost" data-hint>Show hint</button>
            <button class="btn sm ghost" data-solution>Show solution</button>
          </div>
        </div>
      </div>`);
    const slot = $(".ex-feedback-slot", card);
    const markRevealed = () => { if (S.isRevealed(key) && !$(".tag.revealed", card)) $(".ex-prompt", card).insertAdjacentHTML("beforeend", `<div style="margin-top:6px"><span class="tag revealed">Solution viewed · no XP</span></div>`); };
    setTimeout(markRevealed);
    const feedback = (cls, msg) => { slot.innerHTML = `<div class="ex-feedback ${cls}">${msg}</div>`; };

    const ide = FP.editor.createIDE($(".ex-ide", card), {
      code: ch.starter, key: "ch:" + key, file: `exercise_${i + 1}.py`, minLines: 5, stdinValue: (ch.stdin || "").split("\n").join(" | "),
      check: async (code, stdin) => {
        const wasSolved = !!S.state.challenges[key];
        const res = await grade(code, stdin || ch.stdin || "", ch.test);
        if (res.passed) {
          const xp = S.passChallenge(lesson.id, i);
          card.classList.add("passed", "just-passed"); $(".ex-num", card).textContent = "✓";
          FP.fx.sound("correct"); FP.fx.burst(undefined, undefined, { n: 22 }); setTimeout(() => card.classList.remove("just-passed"), 1200);
          feedback("ok", `<b>Correct!</b>&nbsp;${xp ? `+${xp} XP.` : S.isRevealed(key) && !wasSolved ? "No XP because the solution was viewed, but it counts as solved." : "Already solved, nice refresher."}`);
          refreshCompleteBar();
        } else {
          feedback("bad", `<b>Not yet.</b>&nbsp;${FP.u.esc(res.message || "Try again.")}`);
          FP.fx.sound("wrong"); FP.fx.shake(card);
        }
        return res;
      },
    });
    card._ide = ide;

    $("[data-hint]", card).onclick = () => feedback("hint", `<b>Hint:</b>&nbsp;${FP.u.esc(ch.hint || "Re-read the task carefully.")}`);
    $("[data-solution]", card).onclick = () => {
      if (!passed && !S.isRevealed("" + key) && !S.state.challenges[key] &&
          !confirm("Viewing the solution means this exercise gives 0 XP, even after you solve it. Show it anyway?")) return;
      if (!S.state.challenges[key]) S.reveal(key);
      markRevealed();
      U.modal({ title: "Solution", wide: false, body: el(html`<div>${raw(FP.editor.exampleBlock(ch.solution, { label: "One possible answer", tryIt: false }).toString())}
        <p class="muted" style="font-size:.9rem">Read it, close this, then type it out yourself. Copy-pasting teaches your clipboard, not you.</p>
        <button class="btn" data-load>Load into editor anyway</button></div>`) }).body.querySelector("[data-load]").onclick = (e) => {
        ide.setCode(ch.solution); e.target.closest(".modal-scrim").querySelector("[data-close]").click();
      };
    };
    return card;
  }

  function quizBlock(lesson) {
    const box = el(`<div class="quiz"></div>`);
    lesson.quiz.forEach((q, qi) => {
      const k = `${lesson.id}:${qi}`;
      const chosen = S.state.quizzes[k];
      const node = el(html`<div class="quiz-q"><h4>${qi + 1}. ${q.q}</h4><div class="quiz-opts">${q.options.map((o, oi) =>
        html`<button class="quiz-opt" data-oi="${oi}"><span class="key">${String.fromCharCode(65 + oi)}</span><span>${o}</span></button>`)}</div></div>`);
      const reveal = (choice) => {
        $$(".quiz-opt", node).forEach((b, oi) => { b.disabled = true; if (oi === q.answer) b.classList.add("right"); else if (oi === choice) b.classList.add("wrong"); });
        node.append(el(html`<div class="quiz-why">${choice === q.answer ? "Correct. " : "Not quite. "}${q.why || ""}</div>`));
      };
      if (chosen !== undefined) reveal(chosen);
      node.addEventListener("click", (e) => {
        const b = e.target.closest(".quiz-opt"); if (!b || b.disabled) return;
        const choice = +b.dataset.oi, right = choice === q.answer;
        FP.fx.sound(right ? "correct" : "wrong"); if (right) FP.fx.burst(undefined, undefined, { n: 14, spread: .7 });
        S.answerQuiz(lesson.id, qi, choice, right); reveal(choice); refreshCompleteBar();
      });
      box.append(node);
    });
    return box;
  }

  let current = null;
  function refreshCompleteBar() {
    if (!current) return;
    const { lesson, main } = current;
    const bar = $(".complete-bar", main); if (!bar) return;
    const passedN = lesson.challenges.filter((_, i) => S.state.challenges[`${lesson.id}:${i}`]).length;
    const quizN = lesson.quiz.filter((_, i) => `${lesson.id}:${i}` in S.state.quizzes).length;
    const done = S.state.lessons[lesson.id]?.done;
    const ready = passedN === lesson.challenges.length && quizN === lesson.quiz.length;
    bar.classList.toggle("done", !!done);
    const bonus = S.lessonBonus(lesson);
    const why = bonus.revealed ? `No bonus: ${FP.u.plural(bonus.revealed, "solution")} viewed.`
      : bonus.quizRight < bonus.quizTotal ? `Bonus reduced: ${bonus.quizRight}/${bonus.quizTotal} quiz answers right.` : "";
    const earned = S.state.lessons[lesson.id]?.xp;
    bar.innerHTML = done
      ? `<div><b>Lesson complete.</b> <span class="muted">${earned === 0 ? "No bonus XP this time." : earned != null ? `+${earned} XP earned.` : "Nice work."}</span></div>${nextBtn(lesson)}`
      : html`<div class="req"><span class="${passedN === lesson.challenges.length ? "ok" : ""}">Exercises ${passedN}/${lesson.challenges.length}</span><span class="${quizN === lesson.quiz.length ? "ok" : ""}">Quiz ${quizN}/${lesson.quiz.length}</span>${why && ready ? raw(html`<div class="muted" style="font-size:.84rem;margin-top:6px">${why}</div>`.toString()) : ""}</div>
         <button class="btn ${ready ? "go" : ""}" data-complete ${ready ? "" : "disabled"} title="${ready ? "" : "Solve every exercise and answer the quiz first"}">Mark complete · +${ready ? bonus.xp : lesson.xp} XP</button>`.toString();
    const btn = $("[data-complete]", bar);
    if (btn) btn.onclick = () => { const xp = S.completeLesson(lesson); FP.fx.sound("complete"); if (xp) U.confetti(140); U.renderSidebar(lesson.id); refreshCompleteBar(); };
  }
  const nextBtn = (lesson) => {
    const i = U.lessonIndex(lesson.id), n = FP.LESSONS[i + 1];
    return n ? `<a class="btn primary" href="#/learn/${n.id}">Next: ${FP.u.esc(n.title)} →</a>` : `<a class="btn yellow" href="#/projects">On to the boss fights →</a>`;
  };

  function render(main, id, anchor) {
    const i = U.lessonIndex(id);
    const lesson = FP.LESSONS[i];
    if (!lesson) { main.innerHTML = `<div class="page narrow"><div class="empty">That lesson doesn't exist. <a href="#/learn">See all lessons</a></div></div>`; return; }
    S.setLast(id);
    const prev = FP.LESSONS[i - 1], next = FP.LESSONS[i + 1];
    const pn = (cls) => html`<nav class="prevnext ${cls}">
      ${prev ? raw(html`<a class="pn" href="#/learn/${prev.id}"><small>Previous</small><b>❮ ${prev.title}</b></a>`.toString()) : raw("<span></span>")}
      ${next ? raw(html`<a class="pn next" href="#/learn/${next.id}"><small>Next</small><b>${next.title} ❯</b></a>`.toString()) : raw(`<a class="pn next" href="#/projects"><small>Next</small><b>Boss fights ❯</b></a>`)}
    </nav>`;

    const sections = lesson.sections.map((s) => html`
      <section id="${slug(s.h)}">
        <h2>${s.h}</h2>
        ${raw(s.body)}
        ${s.code ? raw(FP.editor.exampleBlock(s.code).toString()) : ""}
      </section>`);

    const tocItems = [...lesson.sections.map(s => [slug(s.h), s.h]), ...((FP.VISUALS?.[id] || []).length ? [["real-life", "See it in real life"]] : []), ["exercises", "Exercises"], ["quiz", "Quick quiz"]];

    main.innerHTML = html`
      <div class="page">
        <div class="lesson-grid">
          <article>
            <div class="crumbs"><a href="#/learn">Tutorial</a><span>/</span><span>${lesson.track}</span><span>/</span><span>Lesson ${i + 1}</span></div>
            ${pn("top")}
            <header class="lesson-head">
              <h1>${lesson.title}</h1>
              <p class="lede">${lesson.summary}</p>
              <div class="lesson-meta">
                <span class="tag">${lesson.minutes} min</span>
                <span class="tag xp">${lesson.xp} XP</span>
                <span class="tag">${FP.u.plural(lesson.challenges.length, "exercise")}</span>
                ${S.state.lessons[id]?.done ? raw(`<span class="tag done">Completed</span>`) : ""}
              </div>
            </header>
            <div class="prose">${sections}</div>
            ${(FP.VISUALS?.[id] || []).length ? raw(html`<section id="real-life">
              <h2>See it in real life</h2>
              <p class="muted">Press <b>Run</b> and watch the code act it out. Change the numbers and run it again.</p>
              ${FP.VISUALS[id].map((v, vi) => html`<div class="viz-block"><h3>${v.title}</h3><p>${raw(v.story)}</p><div class="viz-ide" data-vi="${vi}"></div></div>`)}
            </section>`.toString()) : ""}
            <section id="exercises">
              <h2>Exercises</h2>
              <p class="muted">Write your answer and press <b>Check</b>. BizPy runs your code and tests it, so the answer has to actually work. Your code is saved as you type.</p>
              <div class="ex-list"></div>
            </section>
            <section id="quiz">
              <h2>Quick quiz</h2>
              <div class="quiz-slot"></div>
            </section>
            <div class="complete-bar"></div>
            ${pn("bottom")}
          </article>
          <aside class="toc" aria-label="On this page">
            <p class="eyebrow">On this page</p>
            ${tocItems.map(([a, t]) => html`<a href="#/learn/${id}/${a}" data-anchor="${a}">${t}</a>`)}
          </aside>
        </div>
      </div>`.toString();

    current = { lesson, main };
    $$(".viz-ide", main).forEach(h => {
      const v = FP.VISUALS[id][+h.dataset.vi];
      FP.editor.createIDE(h, { code: v.code, key: `viz:${id}:${h.dataset.vi}`, file: "real_life.py", visual: true, minLines: 4 });
    });
    const list = $(".ex-list", main);
    lesson.challenges.forEach((ch, ci) => list.append(exerciseCard(lesson, ch, ci)));
    $(".quiz-slot", main).append(quizBlock(lesson));
    $$(".prose > section, .viz-block > p, .ex-prompt, .lesson-head .lede", main).forEach(FP.dict.linkTerms);
    refreshCompleteBar();

    // Try it Yourself + copy on examples. main.onclick (not addEventListener): <main> lives for the whole visit,
    // so adding a listener on every render stacked them up and opened the popup once per lesson visited.
    main.onclick = async (e) => {
      const ex = e.target.closest(".example"); if (!ex) return;
      const code = ex.querySelector("pre").textContent;
      if (e.target.closest("[data-tryit]")) U.tryIt(code, `Try it Yourself · ${lesson.title}`);
      if (e.target.closest("[data-copy]")) { const b = e.target.closest("[data-copy]"); await FP.u.copyText(code); b.classList.add("copied"); b.lastChild.textContent = "Copied"; setTimeout(() => { b.classList.remove("copied"); b.lastChild.textContent = "Copy"; }, 1400); }
    };

    // Scroll-spy for the TOC
    const links = $$(".toc a", main);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.dataset.anchor === en.target.id)); });
    }, { rootMargin: "-20% 0px -70% 0px" });
    tocItems.forEach(([a]) => { const t = document.getElementById(a); if (t) obs.observe(t); });
    current.cleanup = () => obs.disconnect();

    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 60);
    else scrollTo(0, 0);
  }

  // Tutorial index (#/learn)
  function index(main) {
    const groups = U.tracks().map(t => html`
      <h2>${t}</h2>
      <div class="roadmap-grid">${FP.LESSONS.map((l, i) => ({ l, i })).filter(x => x.l.track === t).map(({ l, i }) => html`
        <a class="r-card ${S.state.lessons[l.id]?.done ? "done" : ""}" href="#/learn/${l.id}">
          <span class="n">${String(i + 1).padStart(2, "0")}</span>
          <span><div class="t">${l.title}</div><div class="m">${l.minutes} min · ${l.xp} XP</div></span></a>`)}</div>`);
    main.innerHTML = html`<div class="page">
      <p class="eyebrow">Tutorial</p><h1>Python, start to finish</h1>
      <p class="muted" style="font-size:1.1rem;max-width:44em">${FP.LESSONS.length} lessons that follow the UDE4070CM syllabus, from your first program to the CW1 programming test. Work through them in order, or jump to whatever your next class covers.</p>
      ${groups}</div>`.toString();
  }

  FP.views = FP.views || {};
  FP.views.lesson = render;
  FP.views.learnIndex = index;
  FP.views.lessonCleanup = () => { current?.cleanup?.(); current = null; };
})();
