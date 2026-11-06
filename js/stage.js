/* The Stage: animates events from Python (sit(), jump(), bars(), show_list()...) so code becomes something you can see. */
(function () {
  const { el, esc } = FP.u;

  const PERSON_SVG = `
    <svg class="person" viewBox="0 0 120 170" aria-hidden="true">
      <g class="p-body">
        <circle class="p-head" cx="60" cy="30" r="17"/>
        <circle class="p-eye" cx="54" cy="28" r="2"/><circle class="p-eye" cx="66" cy="28" r="2"/>
        <path class="p-smile" d="M53 36 q7 6 14 0"/>
        <path class="p-torso" d="M60 47 v48"/>
        <path class="p-arm p-arm-l" d="M60 60 l-22 18"/>
        <path class="p-arm p-arm-r" d="M60 60 l22 18"/>
        <g class="p-legs"><path class="p-leg p-leg-l" d="M60 95 l-16 34"/><path class="p-leg p-leg-r" d="M60 95 l16 34"/></g>
      </g>
    </svg>`;

  function create(host) {
    const node = el(`<div class="stage" aria-live="polite">
      <div class="stage-head"><span class="stage-title">Visualiser</span><span class="spacer"></span><span class="stage-count"></span></div>
      <div class="stage-body"><div class="stage-empty">Run the code to watch it happen.</div></div>
    </div>`);
    host.append(node);
    const body = node.querySelector(".stage-body"), count = node.querySelector(".stage-count");
    let layers = {};

    const layer = (name, make) => {
      if (!layers[name]) { body.querySelector(".stage-empty")?.remove(); layers[name] = make(); body.append(layers[name]); }
      return layers[name];
    };

    function person(d) {
      const box = layer("person", () => el(`<div class="st-person"><div class="st-floor"></div>
        <div class="st-chair"></div><div class="st-actor">${PERSON_SVG}<div class="st-bubble" hidden></div></div>
        <div class="st-tally"></div></div>`));
      const actor = box.querySelector(".st-actor"), bubble = box.querySelector(".st-bubble"), tally = box.querySelector(".st-tally");
      actor.classList.remove("jump", "wave", "walk");
      void actor.offsetWidth; // restart CSS animation
      if (d.action === "sit") { actor.classList.add("sitting"); setTimeout(() => actor.classList.remove("sitting"), 300); addTick(tally, "sit"); }
      if (d.action === "stand") actor.classList.remove("sitting");
      if (d.action === "jump") { actor.classList.add("jump"); addTick(tally, "jump"); }
      if (d.action === "wave") actor.classList.add("wave");
      if (d.action === "walk") { actor.classList.add("walk"); const x = Math.min((d.n % 12) * 18, 200); actor.style.setProperty("--x", x + "px"); }
      if (d.action === "say") { bubble.hidden = false; bubble.textContent = d.text; clearTimeout(bubble._t); bubble._t = setTimeout(() => bubble.hidden = true, 1600); }
      if (d.n) count.textContent = `${d.action} × ${d.n}`;
    }
    function addTick(tally, kind) {
      const t = el(`<i class="tick-${kind}"></i>`); tally.append(t);
      if (tally.children.length > 40) tally.firstElementChild.remove();
    }

    function list(d) {
      const box = layer("list", () => el(`<div class="st-list"><div class="st-label"></div><div class="st-cells"></div></div>`));
      box.querySelector(".st-label").textContent = d.label || "list";
      box.querySelector(".st-cells").innerHTML = d.items.map((v, i) =>
        `<div class="cell ${d.highlight.includes(i) ? "hl" : ""}"><span class="v">${esc(v)}</span><span class="i">${i}</span></div>`).join("") || `<div class="muted">[] empty</div>`;
    }
    function bars(d) {
      const box = layer("bars", () => el(`<div class="st-bars"><div class="st-label"></div><div class="st-barwrap"></div></div>`));
      box.querySelector(".st-label").textContent = d.label || "values";
      const max = Math.max(1, ...d.values.map(Math.abs));
      const wrap = box.querySelector(".st-barwrap");
      wrap.innerHTML = d.values.map((v, i) => `<div class="bar-col ${d.highlight.includes(i) ? "hl" : ""}"><i style="height:${Math.max(4, Math.abs(v) / max * 100)}%"></i><span>${Number.isInteger(v) ? v : v.toFixed(1)}</span></div>`).join("");
    }
    function dict(d) {
      const box = layer("dict", () => el(`<div class="st-dict"><div class="st-label"></div><div class="st-rows"></div></div>`));
      box.querySelector(".st-label").textContent = d.label || "dictionary";
      box.querySelector(".st-rows").innerHTML = d.items.map(([k, v]) => `<div class="kv"><span class="k">${esc(k)}</span><span class="arrow">→</span><span class="v">${esc(v)}</span></div>`).join("");
    }
    function vars(d) {
      const box = layer("vars", () => el(`<div class="st-vars"></div>`));
      d.items.forEach(([k, v]) => {
        let b = box.querySelector(`[data-k="${CSS.escape(k)}"]`);
        if (!b) { b = el(`<div class="var" data-k="${esc(k)}"><span class="k">${esc(k)}</span><span class="v"></span></div>`); box.append(b); }
        const vEl = b.querySelector(".v");
        if (vEl.textContent !== v) { vEl.textContent = v; b.classList.remove("changed"); void b.offsetWidth; b.classList.add("changed"); }
      });
    }
    function light(d) {
      const box = layer("light", () => el(`<div class="st-light"><i class="red"></i><i class="amber"></i><i class="green"></i></div>`));
      box.querySelectorAll("i").forEach(i => i.classList.toggle("on", i.classList.contains(d.colour)));
    }
    function shelf(d) {
      const box = layer("shelf", () => el(`<div class="st-shelf"><div class="st-label"></div><div class="st-items"></div><div class="st-plank"></div></div>`));
      box.querySelector(".st-label").textContent = d.label;
      box.querySelector(".st-items").innerHTML = d.items.map(x => `<div class="item">${esc(x)}</div>`).join("") || `<span class="muted">empty shelf</span>`;
    }

    const handlers = { person, list, bars, dict, vars, light, shelf };
    return {
      node,
      event(name, data) { handlers[name]?.(data); },
      reset() { layers = {}; body.innerHTML = `<div class="stage-empty">Running…</div>`; count.textContent = ""; },
    };
  }

  const USES_STAGE = /\b(sit|stand|jump|walk|wave|say|show_list|bars|show_dict|show_var|light|shelf)\s*\(/;
  FP.stage = { create, usesStage: (code) => USES_STAGE.test(code) };
})();
