/* Runs Python in the browser with Pyodide inside a Web Worker.
   - batch mode: run code with prepared stdin (used for grading); 10s timeout.
   - live mode: a real console. Output streams as it's printed, input() pauses and asks in the console,
     time.sleep() really sleeps, and optional "stage" functions (sit(), jump(), bars()...) drive the visualiser.
     Live mode needs JSPI (Chrome/Edge 137+). Other browsers fall back to batch mode. */
(function () {
  const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/";
  const LIVE_OK = typeof WebAssembly !== "undefined" && typeof WebAssembly.Suspending === "function";

  const workerBody = `
    importScripts("${PYODIDE}pyodide.js");
    let py, live = null;
    self.fpEmit = (kind, text) => postMessage({ type: "stream", kind, text });
    self.fpEvent = (name, data) => postMessage({ type: "event", name, data: JSON.parse(data) });
    self.fpAsk = (prompt) => new Promise(res => { live = res; postMessage({ type: "input", prompt }); });
    self.fpSleep = (ms) => new Promise(res => setTimeout(res, ms));
    const ready = (async () => {
      py = await loadPyodide({ indexURL: "${PYODIDE}" });
      py.runPython(HARNESS);
      postMessage({ type: "ready" });
    })().catch(err => postMessage({ type: "fatal", message: String(err) }));
    onmessage = async (e) => {
      const m = e.data;
      if (m.kind === "reply") { const r = live; live = null; r && r(m.value); return; }
      await ready;
      try { await py.loadPackagesFromImports(m.code + "\\n" + (m.test || "")); } catch (_) {}
      if (m.kind === "live") {
        py.globals.set("__fp_code", m.code);
        py.globals.set("__fp_opts", py.toPy({ visual: !!m.visual, speed: m.speed || 1 }));
        try {
          const err = await py.runPythonAsync("__flowpy_live(__fp_code, __fp_opts)");
          postMessage({ type: "result", id: m.id, result: { error: err || null } });
        } catch (err) {
          postMessage({ type: "result", id: m.id, result: { error: String(err) } });
        }
        return;
      }
      const fn = py.globals.get("__flowpy_run");
      try {
        const res = fn(m.code, m.stdin || "", m.test == null ? null : m.test);
        postMessage({ type: "result", id: m.id, result: JSON.parse(res) });
      } catch (err) {
        postMessage({ type: "result", id: m.id, result: { out: "", error: String(err) } });
      } finally { fn.destroy(); }
    };`;

  let worker = null, status = "idle", seq = 0, pending = null;
  const queue = [], listeners = new Set();

  function setStatus(s) { status = s; listeners.forEach(fn => fn(s)); }

  function boot() {
    setStatus("loading");
    try {
      const src = "const HARNESS = " + JSON.stringify(FP.HARNESS) + ";\n" + workerBody;
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
    } catch (err) { setStatus("error"); return; }
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === "ready") { setStatus("ready"); pump(); return; }
      if (m.type === "fatal") { setStatus("error"); return; }
      if (!pending) return;
      const h = pending.handlers || {};
      if (m.type === "stream") h.onOut?.(m.text, m.kind);
      else if (m.type === "event") h.onEvent?.(m.name, m.data);
      else if (m.type === "input") {
        setStatus("waiting");
        Promise.resolve(h.onInput ? h.onInput(m.prompt) : "").then(v => {
          if (pending && worker) { setStatus("running"); worker.postMessage({ kind: "reply", value: v == null ? null : String(v) }); }
        });
      } else if (m.type === "result" && pending.id === m.id) finish(m.result);
    };
    worker.onerror = () => setStatus("error");
  }

  function finish(result) {
    const p = pending; pending = null;
    clearTimeout(p.timer);
    setStatus("ready");
    p.resolve(result);
    pump();
  }

  function pump() {
    if (pending || status !== "ready" || !queue.length) return;
    const job = queue.shift();
    pending = job;
    setStatus("running");
    if (job.kind === "batch") {
      job.timer = setTimeout(() => kill(`Stopped after ${job.timeout / 1000}s. Is there a loop that never ends?`), job.timeout);
    }
    worker.postMessage({ kind: job.kind, id: job.id, code: job.code, stdin: job.stdin, test: job.test, visual: job.visual, speed: job.speed });
  }

  // Terminates the worker (the only way to stop running Python) and starts a fresh one.
  function kill(message) {
    if (!pending) return;
    const p = pending; pending = null;
    clearTimeout(p.timer);
    worker.terminate(); worker = null;
    p.resolve({ out: "", error: message, stopped: true, passed: false, message: "Your code took too long (possible infinite loop)." });
    boot();
  }

  FP.runner = {
    LIVE_OK,
    get status() { return status; },
    get busy() { return !!pending; },
    onStatus(fn) { listeners.add(fn); fn(status); return () => listeners.delete(fn); },
    start() { if (!worker) boot(); },
    run(code, opts = {}) {
      this.start();
      return new Promise(resolve => {
        queue.push({ kind: "batch", id: ++seq, code, stdin: opts.stdin || "", test: opts.test ?? null,
                     timeout: opts.timeout || (status === "loading" ? 60000 : 10000), resolve });
        pump();
      });
    },
    // handlers: { onOut(text, kind), onInput(prompt) -> Promise<string|null>, onEvent(name, data) }
    live(code, handlers = {}, opts = {}) {
      this.start();
      if (!LIVE_OK) return this.run(code, { stdin: opts.stdin || "" }).then(r => { if (r.out) handlers.onOut?.(r.out, "out"); return { error: r.error }; });
      return new Promise(resolve => {
        queue.push({ kind: "live", id: ++seq, code, handlers, visual: !!opts.visual, speed: opts.speed || 1, resolve });
        pump();
      });
    },
    stop() { kill("Program stopped."); },
  };
})();
