/* The IDE widget: CodeMirror editor + Run/Stop/Check/Reset + a real console (streaming output, inline input())
   + optional visualiser stage. */
(function () {
  const { html, raw, el, $, esc, explainError } = FP.u;

  const ICON = {
    play: `<svg viewBox="0 0 24 24"><path d="M7 5v14l11-7z" fill="currentColor" stroke="none"/></svg>`,
    stop: `<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none"/></svg>`,
    check: `<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>`,
    copy: `<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  };
  FP.ICON = ICON;

  const STATUS_TEXT = { idle: "Python idle", loading: "Loading Python…", ready: "Python ready", running: "Running…", waiting: "Waiting for input", error: "Python failed to load (offline?)" };

  /* A terminal-like console. write() streams text; ask(prompt) shows an inline input and resolves on Enter. */
  function createConsole(pre) {
    let pendingInput = null;
    const scroll = () => { pre.scrollTop = pre.scrollHeight; };
    return {
      clear(msg) { pre.innerHTML = msg ? `<span class="dim">${esc(msg)}</span>` : ""; this.fresh = !msg; },
      write(text, kind = "out") {
        if (!this.fresh) { pre.innerHTML = ""; this.fresh = true; }
        const span = document.createElement("span");
        if (kind === "err") span.className = "err";
        span.textContent = text; pre.append(span); scroll();
      },
      ask(prompt) {
        if (!this.fresh) { pre.innerHTML = ""; this.fresh = true; }
        if (prompt) this.write(prompt);
        return new Promise(resolve => {
          const inp = el(`<input class="con-input" spellcheck="false" autocomplete="off" aria-label="Program input">`);
          pre.append(inp); scroll();
          inp.focus({ preventScroll: true });
          pre.closest(".ide-out")?.classList.add("asking");
          pendingInput = { inp, resolve };
          inp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); done(inp.value); }
            if (e.key === "c" && e.ctrlKey && !inp.value) { e.preventDefault(); done(null); }
          });
          const done = (v) => {
            const echo = document.createElement("span"); echo.className = "in"; echo.textContent = (v ?? "^C") + "\n";
            inp.replaceWith(echo); pendingInput = null;
            pre.closest(".ide-out")?.classList.remove("asking");
            resolve(v);
          };
        });
      },
      cancel() { if (pendingInput) { pendingInput.inp.remove(); pendingInput.resolve(null); pendingInput = null; } pre.closest(".ide-out")?.classList.remove("asking"); },
      text: () => pre.textContent,
    };
  }

  /**
   * opts: { code, key, file, check: async (code, stdin) => result, minLines, autoRun, fill, visual: bool|"auto", onRun }
   */
  function createIDE(host, opts = {}) {
    const original = opts.code || "";
    const draft = opts.key ? FP.store.getCode(opts.key) : null;
    const live = FP.runner.LIVE_OK;
    const node = el(html`
      <div class="ide">
        <div class="ide-bar">
          <span class="file">${opts.file || "main.py"}</span>
          <span class="spacer"></span>
          <button class="btn sm" data-act="visual" title="Show the visualiser" hidden>${raw(ICON.eye)}<span>Visualise</span></button>
          <button class="btn sm" data-act="reset" title="Reset code">${raw(ICON.reset)}<span>Reset</span></button>
          ${opts.check ? raw(`<button class="btn sm check" data-act="check" title="Check answer (Ctrl+Shift+Enter)">${ICON.check}<span>Check</span></button>`) : ""}
          <button class="btn sm go" data-act="run" title="Run (Ctrl+Enter)">${raw(ICON.play)}<span>Run</span></button>
        </div>
        <div class="ide-body"></div>
        ${!live ? raw(`<label class="ide-stdin">Input <input data-stdin placeholder="values for input(), separated by |  e.g.  Ada | 21" spellcheck="false"></label>`) : ""}
        <div class="ide-stage-slot"></div>
        <div class="ide-out">
          <div class="ide-out-head">Console <span class="spacer"></span><span class="run-status"></span></div>
          <pre class="console" aria-live="polite" tabindex="0"><span class="dim">Press Run (Ctrl + Enter). If your program uses input(), you'll type the answer right here, just like real Python.</span></pre>
        </div>
      </div>`);
    host.replaceChildren(node);

    const body = $(".ide-body", node), outPre = $(".console", node), statusEl = $(".run-status", node);
    const stageSlot = $(".ide-stage-slot", node); // kept by reference: the playground moves it to another column
    const runBtn = $("[data-act=run]", node), visBtn = $("[data-act=visual]", node);
    const stdinEl = $("[data-stdin]", node);
    if (opts.stdinValue && stdinEl) stdinEl.value = opts.stdinValue;
    const con = createConsole(outPre);
    let cm = null, ta = null, stage = null, running = false;
    const startCode = draft ?? original;

    if (window.CodeMirror) {
      cm = CodeMirror(body, {
        value: startCode, mode: "python", lineNumbers: true, indentUnit: 4, tabSize: 4,
        matchBrackets: true, autoCloseBrackets: true, viewportMargin: Infinity, lineWrapping: false,
        extraKeys: {
          "Ctrl-Enter": () => run(), "Cmd-Enter": () => run(),
          "Shift-Ctrl-Enter": () => check(), "Shift-Cmd-Enter": () => check(),
          Tab: (c) => c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end"),
        },
      });
      const lines = Math.max(opts.minLines || 6, startCode.split("\n").length + 1);
      if (!opts.fill) cm.setSize(null, Math.min(lines, 26) * 23.2 + 14);
      cm.on("change", () => { if (opts.key) FP.store.setCode(opts.key, cm.getValue()); syncVisual(); opts.onChange?.(cm.getValue()); });
      node.style.setProperty("--editor-font", FP.store.setting("fontSize") + "px");
      // CodeMirror measures gutter + char widths at creation. If the editor was created before being
      // attached, or before the mono web font loaded, line numbers overlap the code. Re-measure on
      // size changes and once fonts are ready.
      let lastW = 0;
      const remeasure = () => { if (node.isConnected && node.offsetWidth) cm.refresh(); };
      if (window.ResizeObserver) new ResizeObserver(([e]) => { const w = Math.round(e.contentRect.width); if (w !== lastW) { lastW = w; remeasure(); } }).observe(body);
      document.fonts?.ready.then(remeasure);
      document.fonts?.addEventListener?.("loadingdone", remeasure);
      requestAnimationFrame(remeasure);
    } else {
      ta = el(`<textarea class="fallback" spellcheck="false"></textarea>`);
      ta.value = startCode; ta.rows = Math.max(opts.minLines || 8, startCode.split("\n").length + 2);
      ta.addEventListener("input", () => { if (opts.key) FP.store.setCode(opts.key, ta.value); syncVisual(); });
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Tab") { e.preventDefault(); ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end"); }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.shiftKey ? check() : run(); }
      });
      body.append(ta);
    }

    const getCode = () => cm ? cm.getValue() : ta.value;
    const setCode = (v) => cm ? cm.setValue(v) : (ta.value = v);
    const stdin = () => (stdinEl?.value || "").split("|").map(s => s.trim()).join("\n");

    // Visualiser: shown automatically when the code calls stage functions, or when opts.visual === true.
    let visualOn = opts.visual === true;
    function ensureStage() {
      if (!stage) stage = FP.stage.create(stageSlot);
      return stage;
    }
    function syncVisual() {
      const uses = FP.stage.usesStage(getCode());
      visBtn.hidden = !live || !uses;
      if (opts.visual === "auto" && uses && !stage) { visualOn = true; ensureStage(); }
      visBtn.classList.toggle("on", visualOn);
    }
    syncVisual();
    if (visualOn) ensureStage();

    const unsub = FP.runner.onStatus(s => { statusEl.className = "run-status " + s; statusEl.textContent = STATUS_TEXT[s] || s; });

    function setRunning(on) {
      running = on;
      runBtn.classList.toggle("go", !on); runBtn.classList.toggle("stop", on);
      runBtn.innerHTML = on ? `${ICON.stop}<span>Stop</span>` : `${ICON.play}<span>Run</span>`;
      runBtn.title = on ? "Stop the program" : "Run (Ctrl+Enter)";
    }

    function showHelp(error) {
      clearHelp();
      const help = explainError(error);
      if (help) outPre.after(el(`<div class="err-help"><b>What this means:</b> ${help}</div>`));
    }
    const clearHelp = () => outPre.parentElement.querySelector(".err-help")?.remove();

    function show(res) {
      con.clear();
      if (res.out) con.write(res.out);
      if (res.error) con.write((res.out && !res.out.endsWith("\n") ? "\n" : "") + res.error, "err");
      if (!res.out && !res.error) outPre.innerHTML = `<span class="dim">(no output; try adding a print())</span>`;
      showHelp(res.error);
    }

    async function run() {
      if (running) { FP.runner.stop(); con.cancel(); return; }
      clearHelp();
      const code = getCode();
      con.clear(FP.runner.status === "ready" ? "" : "Starting Python (first run takes a few seconds)…");
      const useStage = live && visualOn;
      FP.fx?.sound("run");
      if (useStage) ensureStage().reset();
      setRunning(true);
      let res;
      try {
        if (live) {
          let printed = false;
          res = await FP.runner.live(code, {
            onOut: (t, k) => { printed = true; con.write(t, k); },
            onInput: (p) => { printed = true; return con.ask(p); },
            onEvent: (n, d) => stage?.event(n, d),
          }, { visual: useStage, speed: +(FP.store.setting("vizSpeed") || 1) });
          if (res.error) { FP.fx?.sound("wrong"); FP.fx?.shake(outPre.closest(".ide-out")); con.write((con.text().endsWith("\n") || !printed ? "" : "\n") + res.error + "\n", "err"); showHelp(res.error); }
          else if (!printed) outPre.innerHTML = `<span class="dim">(no output; try adding a print())</span>`;
          else { if (!con.text().endsWith("\n")) con.write("\n"); outPre.append(el(`<span class="dim">[program finished]</span>`)); FP.fx?.sound("done"); }
        } else {
          res = await FP.runner.run(code, { stdin: stdin() });
          show(res);
        }
      } finally { setRunning(false); con.cancel(); }
      FP.store.markRun();
      opts.onRun?.(res);
      return res;
    }

    async function check() {
      if (!opts.check) return run();
      if (running) { FP.runner.stop(); con.cancel(); }
      const btn = $("[data-act=check]", node);
      btn.disabled = true;
      con.clear("Checking your answer…");
      try {
        const res = await opts.check(getCode(), stdin());
        show(res);
        FP.store.markRun();
        return res;
      } finally { btn.disabled = false; }
    }

    node.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "run") run();
      if (act === "check") check();
      if (act === "visual") {
        visualOn = !visualOn;
        if (visualOn) ensureStage(); else { stage?.node.remove(); stage = null; }
        syncVisual();
      }
      if (act === "reset") { setCode(original); if (opts.key) FP.store.clearCode(opts.key); con.clear("Code reset."); clearHelp(); }
    });
    outPre.addEventListener("click", () => outPre.querySelector(".con-input")?.focus());

    if (opts.autoRun) setTimeout(run, 50);
    FP.runner.start();

    return { node, run, check, getCode, setCode, refresh: () => cm?.refresh(), focus: () => (cm || ta).focus(), destroy() { unsub(); if (running) FP.runner.stop(); }, get cm() { return cm; } };
  }

  // Read-only "Example" box with Copy + Try it Yourself.
  function exampleBlock(code, { label = "Example", tryIt = true } = {}) {
    return html`
      <div class="example">
        <div class="example-head">
          <span class="label">${label}</span><span class="spacer"></span>
          <button class="btn sm ghost copy-btn" data-copy>${raw(ICON.copy)}Copy</button>
          ${tryIt ? raw(`<button class="btn sm yellow" data-tryit>Try it Yourself »</button>`) : ""}
        </div>
        <pre><code>${raw(FP.u.highlight(code))}</code></pre>
      </div>`;
  }

  FP.editor = { createIDE, exampleBlock, createConsole };
})();
