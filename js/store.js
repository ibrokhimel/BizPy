/* Progress store: localStorage-backed, with XP/levels, streaks, badges and spaced-repetition boxes. */
(function () {
  const KEY = "bizpy.v1";
  const { todayKey } = FP.u;

  const RANKS = ["Hatchling", "Script Kiddie", "Loop Wrangler", "Function Smith", "Data Tamer", "Class Act", "Algorithm Ace", "Query Master", "Bug Slayer", "Artefact Shipper", "Pythonista"];

  const defaults = () => ({
    xp: 0,
    lessons: {},          // id -> { done: bool, at: iso }
    challenges: {},       // "lessonId:i" -> true
    quizzes: {},          // "lessonId:i" -> chosen index
    bosses: {},           // id -> { done, at }
    code: {},             // editor drafts by key
    cards: {},            // flashcard index -> { box, due }
    activity: {},         // "YYYY-MM-DD" -> xp earned that day
    badges: {},           // id -> iso date
    lastLesson: null,
    snippets: [],
    settings: { theme: null, fontSize: 14.5, name: "" },
    awarded: {},          // idempotency keys so XP can never be farmed
    spent: 0,             // XP spent in the rewards shop (level is based on total xp, so it never drops)
    redemptions: [],      // { id, item, xp, uzs, code, at }
    revealed: {},         // "lessonId:i" or "boss:id" -> iso date the solution was shown (no XP after that)
  });

  let state;
  try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch (_) { state = defaults(); }
  state.settings = Object.assign(defaults().settings, state.settings);

  const subs = new Set();
  const save = FP.u.debounce(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }, 150);
  const emit = (evt) => { save(); subs.forEach(fn => fn(evt)); };

  // Level n needs 100 * n * (n + 1) / 2 total XP: 100, 300, 600, 1000...
  const levelFor = (xp) => { let lvl = 1; while (xp >= 50 * lvl * (lvl + 1)) lvl++; return lvl; };
  const levelFloor = (lvl) => 50 * (lvl - 1) * lvl;

  function streak() {
    let n = 0; const d = new Date();
    if (!state.activity[todayKey(d)]) d.setDate(d.getDate() - 1); // today not done yet still keeps yesterday's streak
    while (state.activity[todayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  const BADGES = [
    { id: "first_run", name: "Hello World", short: "HW", test: s => s.awarded["run:first"] },
    { id: "first_pass", name: "First Green", short: "1", test: s => Object.keys(s.challenges).length >= 1 },
    { id: "ten_pass", name: "Ten Down", short: "10", test: s => Object.keys(s.challenges).length >= 10 },
    { id: "foundations", name: "Foundations", short: "F", test: s => ["py_01_setup", "py_02_variables", "py_03_operators", "py_04_strings"].every(id => s.lessons[id]?.done) },
    { id: "oop", name: "OOP Master", short: "OOP", test: s => ["py_13_oop_classes", "py_14_oop_inheritance"].every(id => s.lessons[id]?.done) },
    { id: "algo", name: "Sorted", short: "O(n)", test: s => s.lessons["py_16_algorithms"]?.done },
    { id: "sql", name: "SQL Ready", short: "SQL", test: s => s.lessons["py_17_databases"]?.done },
    { id: "boss1", name: "Boss Slayer", short: "B", test: s => Object.values(s.bosses).some(b => b.done) },
    { id: "streak3", name: "3-Day Streak", short: "3d", test: () => streak() >= 3 },
    { id: "streak7", name: "Week Warrior", short: "7d", test: () => streak() >= 7 },
    { id: "cards", name: "Card Shark", short: "♠", test: s => Object.values(s.cards).filter(c => c.box >= 3).length >= 15 },
    { id: "shipper", name: "Artefact Shipper", short: "★", test: s => s.bosses["boss_05"]?.done },
  ];

  function checkBadges() {
    const fresh = [];
    for (const b of BADGES) if (!state.badges[b.id] && b.test(state)) { state.badges[b.id] = new Date().toISOString(); fresh.push(b); }
    return fresh;
  }

  // Award XP exactly once per key. Returns the amount actually awarded (0 if already given).
  function award(key, amount, reason) {
    if (state.awarded[key]) return 0;
    const before = levelFor(state.xp);
    state.awarded[key] = true;
    state.xp += amount;
    const day = todayKey();
    state.activity[day] = (state.activity[day] || 0) + amount;
    const after = levelFor(state.xp);
    const badges = checkBadges();
    emit({ type: "xp", amount, reason, levelUp: after > before ? after : 0, badges });
    return amount;
  }

  FP.store = {
    get state() { return state; },
    RANKS, BADGES,
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    level: () => levelFor(state.xp),
    rank: () => RANKS[Math.min(levelFor(state.xp) - 1, RANKS.length - 1)],
    levelProgress() {
      const lvl = levelFor(state.xp), lo = levelFloor(lvl), hi = levelFloor(lvl + 1);
      return { lvl, into: state.xp - lo, need: hi - lo, pct: Math.round(((state.xp - lo) / (hi - lo)) * 100) };
    },
    streak,
    award,
    markRun() { if (!state.awarded["run:first"]) award("run:first", 10, "First code run"); },
    passChallenge(lessonId, i, xp = 15) {
      const k = `${lessonId}:${i}`;
      if (!state.challenges[k]) { state.challenges[k] = true; }
      if (state.revealed[k]) { emit({ type: "challenge" }); return 0; }
      return award("ch:" + k, xp, "Challenge solved");
    },
    // Looking at / loading / copying a solution forfeits that item's XP (it still counts as solved).
    reveal(key) { if (!state.revealed[key]) { state.revealed[key] = new Date().toISOString(); emit({ type: "reveal" }); } },
    isRevealed: (key) => !!state.revealed[key],
    answerQuiz(lessonId, i, choice, correct) {
      const k = `${lessonId}:${i}`;
      if (k in state.quizzes) return 0;
      state.quizzes[k] = choice;
      if (correct) return award("qz:" + k, 5, "Quiz answer");
      emit({ type: "quiz" });
      return 0;
    },
    /* Lesson completion bonus must be earned honestly:
       - any exercise solved after viewing its solution -> bonus is 0
       - otherwise the bonus scales with correct quiz answers (2 of 3 right -> 2/3 of the bonus) */
    lessonBonus(lesson) {
      const revealed = lesson.challenges.filter((_, i) => state.revealed[`${lesson.id}:${i}`]).length;
      const quizTotal = lesson.quiz.length;
      const quizRight = lesson.quiz.filter((q, i) => state.quizzes[`${lesson.id}:${i}`] === q.answer).length;
      const xp = revealed ? 0 : quizTotal ? Math.round(lesson.xp * quizRight / quizTotal) : lesson.xp;
      return { xp, revealed, quizRight, quizTotal };
    },
    completeLesson(lesson) {
      if (state.lessons[lesson.id]?.done) return 0;
      const { xp } = this.lessonBonus(lesson);
      state.lessons[lesson.id] = { done: true, at: new Date().toISOString(), xp };
      if (!xp) { state.awarded["ls:" + lesson.id] = true; emit({ type: "lesson" }); return 0; }
      return award("ls:" + lesson.id, xp, "Lesson complete");
    },
    completeBoss(boss) {
      if (state.bosses[boss.id]?.done) return 0;
      state.bosses[boss.id] = { done: true, at: new Date().toISOString() };
      if (state.revealed["boss:" + boss.id]) { emit({ type: "boss" }); return 0; }
      return award("bs:" + boss.id, boss.xp, "Boss defeated");
    },
    wallet: () => state.xp - (state.spent || 0),
    redeem(item, xpCost) {
      if (this.wallet() < xpCost) throw new Error("Not enough XP yet.");
      const code = "FP-" + item.id.toUpperCase().slice(0, 6) + "-" + Math.floor(1000 + Math.random() * 9000);
      const rec = { id: item.id, item: item.name, xp: xpCost, uzs: item.uzs, code, at: new Date().toISOString(), claimed: false };
      state.spent = (state.spent || 0) + xpCost;
      state.redemptions = [rec, ...(state.redemptions || [])];
      emit({ type: "redeem", rec });
      return rec;
    },
    markClaimed(code) { const r = state.redemptions.find(x => x.code === code); if (r) { r.claimed = !r.claimed; emit({ type: "redeem" }); } },
    setLast(id) { state.lastLesson = id; save(); },
    getCode: (k) => state.code[k],
    setCode(k, v) { state.code[k] = v; save(); },
    clearCode(k) { delete state.code[k]; save(); },
    card(i) { return state.cards[i] || { box: 1, due: 0 }; },
    gradeCard(i, right) {
      const c = this.card(i);
      const box = right ? Math.min(c.box + 1, 5) : 1;
      const days = [0, 0, 1, 3, 7, 14][box];
      state.cards[i] = { box, due: Date.now() + days * 86400000 };
      if (right) award("card:" + i + ":" + box, 2, "Flashcard");
      else emit({ type: "card" });
    },
    setting(k, v) { if (v === undefined) return state.settings[k]; state.settings[k] = v; emit({ type: "settings" }); },
    saveSnippet(name, code) { state.snippets = [{ name, code, at: Date.now() }, ...state.snippets.filter(s => s.name !== name)].slice(0, 30); emit({ type: "snippets" }); },
    deleteSnippet(name) { state.snippets = state.snippets.filter(s => s.name !== name); emit({ type: "snippets" }); },
    exportJSON: () => JSON.stringify({ app: "bizpy", version: 1, exported: new Date().toISOString(), state }, null, 2),
    importJSON(text) {
      const data = JSON.parse(text);
      const incoming = data.state || data;
      if (typeof incoming !== "object" || typeof incoming.xp !== "number") throw new Error("That file isn't a BizPy progress export.");
      state = Object.assign(defaults(), incoming);
      state.settings = Object.assign(defaults().settings, state.settings);
      emit({ type: "import" });
    },
    // Cloud helpers: load an account's saved state, start a fresh one, or apply the server's wallet.
    replaceState(incoming) {
      const theme = state.settings.theme, fontSize = state.settings.fontSize;
      state = Object.assign(defaults(), incoming || {});
      state.settings = Object.assign(defaults().settings, state.settings, { theme: state.settings?.theme ?? theme, fontSize: state.settings?.fontSize ?? fontSize });
      this.flush(); emit({ type: "server" });
    },
    resetForNewUser(name) {
      const theme = state.settings.theme; state = defaults(); state.settings.theme = theme; state.settings.name = name || "";
      this.flush(); emit({ type: "server" });
    },
    applyServerWallet(spent, redemptions) {
      if (typeof spent === "number") state.spent = spent;
      if (Array.isArray(redemptions)) state.redemptions = redemptions;
      save(); subs.forEach(fn => fn({ type: "server" }));
    },
    reset() { const theme = state.settings.theme; state = defaults(); state.settings.theme = theme; emit({ type: "reset" }); },
    flush() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} },
  };
  addEventListener("beforeunload", () => FP.store.flush());
})();
