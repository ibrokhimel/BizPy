/* Juice: sounds (synthesised with WebAudio, no files), flying XP, bursts, shakes, counters and the level-up overlay.
   Everything respects the "Sound effects" / "Animations" settings and prefers-reduced-motion. */
(function () {
  const { el, $ } = FP.u;
  const S = FP.store;
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches || S.setting("motion") === false;
  const soundOn = () => S.setting("sound") !== false;

  // ---------- sound ----------
  let ac = null;
  const ctx = () => (ac ||= new (window.AudioContext || window.webkitAudioContext)());
  function tone(freq, start, dur, { type = "sine", vol = 0.18, slide = 0, attack = 0.005 } = {}) {
    const a = ctx(), t = a.currentTime + start;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(start, dur, vol = 0.08, hp = 2000) {
    const a = ctx(), t = a.currentTime + start, n = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = "highpass"; f.frequency.value = hp; g.gain.value = vol;
    src.buffer = buf; src.connect(f).connect(g).connect(a.destination); src.start(t);
  }
  const SOUNDS = {
    click: () => tone(520, 0, 0.05, { type: "triangle", vol: 0.07 }),
    run: () => { tone(330, 0, 0.07, { type: "triangle", vol: 0.1 }); tone(495, 0.05, 0.09, { type: "triangle", vol: 0.1 }); },
    done: () => tone(880, 0, 0.12, { vol: 0.06 }),
    correct: () => { [523, 659, 784].forEach((f, i) => tone(f, i * 0.07, 0.22, { type: "triangle", vol: 0.14 })); tone(1568, 0.21, 0.3, { vol: 0.05 }); },
    wrong: () => { tone(220, 0, 0.16, { type: "sawtooth", vol: 0.05, slide: 0.7 }); tone(180, 0.1, 0.2, { type: "sawtooth", vol: 0.04, slide: 0.7 }); },
    xp: () => tone(1046, 0, 0.09, { type: "square", vol: 0.035, slide: 1.5 }),
    coin: () => { tone(988, 0, 0.07, { type: "square", vol: 0.05 }); tone(1319, 0.07, 0.25, { type: "square", vol: 0.05 }); },
    flip: () => noise(0, 0.12, 0.05, 1200),
    levelup: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.35, { type: "triangle", vol: 0.15 })); [1046, 1318, 1568].forEach(f => tone(f, 0.5, 0.7, { vol: 0.06 })); noise(0.45, 0.4, 0.04, 4000); },
    complete: () => { [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.08, 0.3, { type: "triangle", vol: 0.13 })); },
    order: () => { tone(784, 0, 0.1, { type: "square", vol: 0.05 }); tone(1046, 0.1, 0.1, { type: "square", vol: 0.05 }); tone(1568, 0.2, 0.4, { type: "triangle", vol: 0.1 }); noise(0.2, 0.25, 0.03, 5000); },
    badge: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.06, 0.25, { vol: 0.08 })); },
  };
  function sound(name) {
    if (!soundOn() || !SOUNDS[name]) return;
    try { if (ctx().state === "suspended") ctx().resume(); SOUNDS[name](); } catch (_) {}
  }

  // ---------- pointer tracking (XP flies from where you clicked) ----------
  let lastX = innerWidth / 2, lastY = innerHeight / 2;
  addEventListener("pointerdown", (e) => { lastX = e.clientX; lastY = e.clientY; }, { capture: true, passive: true });

  // ---------- visual effects ----------
  function burst(x = lastX, y = lastY, { n = 18, colors = ["#FFD43B", "#2F6CA3", "#1E8A55", "#F07A6A"], spread = 1 } = {}) {
    if (reduced()) return;
    const wrap = el(`<div class="fx-burst" style="left:${x}px;top:${y}px"></div>`);
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4, d = (40 + Math.random() * 50) * spread;
      const p = el(`<i></i>`);
      p.style.setProperty("--dx", Math.cos(a) * d + "px"); p.style.setProperty("--dy", Math.sin(a) * d + "px");
      p.style.background = colors[i % colors.length];
      p.style.width = p.style.height = 5 + Math.random() * 6 + "px";
      if (i % 3 === 0) p.style.borderRadius = "2px";
      wrap.append(p);
    }
    document.body.append(wrap); setTimeout(() => wrap.remove(), 800);
  }

  function flyXP(amount, from = { x: lastX, y: lastY }) {
    const chip = $("#statChip");
    const label = el(`<div class="fx-xp">+${amount} XP</div>`);
    label.style.left = from.x + "px"; label.style.top = from.y + "px";
    document.body.append(label);
    if (reduced() || !chip) { setTimeout(() => label.remove(), 900); bumpChip(); return; }
    const r = chip.getBoundingClientRect();
    requestAnimationFrame(() => {
      label.animate([
        { transform: "translate(-50%, -50%) scale(.6)", opacity: 0 },
        { transform: "translate(-50%, -150%) scale(1.25)", opacity: 1, offset: 0.25 },
        { transform: `translate(${r.left + r.width / 2 - from.x}px, ${r.top + r.height / 2 - from.y}px) translate(-50%, -50%) scale(.5)`, opacity: 0.2 },
      ], { duration: 950, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => { label.remove(); bumpChip(); sound("xp"); };
    });
  }
  function bumpChip() {
    const chip = $("#statChip"); if (!chip) return;
    chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump");
  }

  // Count a number up inside an element (e.g. XP on the dashboard).
  function countUp(node, to, ms = 700) {
    const from = +node.dataset.v || 0; node.dataset.v = to;
    if (reduced() || from === to) { node.textContent = to.toLocaleString("en-US"); return; }
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      node.textContent = Math.round(from + (to - from) * e).toLocaleString("en-US");
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function shake(node) {
    if (!node) return;
    node.classList.remove("fx-shake"); void node.offsetWidth; node.classList.add("fx-shake");
    setTimeout(() => node.classList.remove("fx-shake"), 500);
  }
  function pop(node) {
    if (!node) return;
    node.classList.remove("fx-pop"); void node.offsetWidth; node.classList.add("fx-pop");
    setTimeout(() => node.classList.remove("fx-pop"), 600);
  }

  function levelUp(level, rank) {
    sound("levelup");
    const o = el(`<div class="fx-level" role="status">
      <div class="fx-level-card">
        <div class="fx-rays"></div>
        <p class="eyebrow">Level up!</p>
        <div class="fx-level-num">${level}</div>
        <div class="fx-level-rank">You're now a <b>${FP.u.esc(rank)}</b></div>
        <button class="btn yellow lg">Let's go →</button>
      </div></div>`);
    document.body.append(o);
    FP.ui.confetti(220);
    const close = () => { o.classList.add("out"); setTimeout(() => o.remove(), 300); };
    o.querySelector("button").onclick = close; o.onclick = (e) => { if (e.target === o) close(); };
    setTimeout(close, 6000);
  }

  // Satisfying press feedback on every button: ripple + tiny click sound on primary actions.
  document.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".btn, .quiz-opt, .r-card, .hub-row, .boss, .pn, .side-link");
    if (!b || b.disabled || reduced()) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    const rip = el(`<span class="fx-ripple" style="width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px"></span>`);
    if (getComputedStyle(b).position === "static") b.style.position = "relative";
    b.style.overflow = "hidden"; b.append(rip); setTimeout(() => rip.remove(), 600);
  }, { passive: true });
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn:not(.go):not(.check):not([data-redeem]), .side-link, .mainnav a");
    if (b && !b.disabled) sound("click");
  });

  FP.fx = { sound, burst, flyXP, bumpChip, countUp, shake, pop, levelUp, get lastPoint() { return { x: lastX, y: lastY }; } };
})();
