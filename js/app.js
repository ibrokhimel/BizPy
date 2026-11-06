/* Router + global wiring. Hash routes work from file:// and any static host. */
(function () {
  const { $, $$ } = FP.u;
  const S = FP.store, U = FP.ui, V = FP.views;

  function applyTheme() {
    const t = S.setting("theme");
    const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }

  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [pathPart, qs] = hash.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    const query = new URLSearchParams(qs || "");
    const main = $("#main");
    V.lessonCleanup?.(); V.flashcardsCleanup?.(); V.flashcardsCleanup = null;
    main.onclick = null;
    document.body.classList.remove("drawer-open");
    $("#modalRoot").innerHTML = "";

    const section = parts[0] || "home";
    const shell = $(".shell");
    const withSidebar = ["learn", "exercises", "home", "projects", "certificate", "settings"].includes(section);
    shell.classList.toggle("no-sidebar", !withSidebar);
    $$(".mainnav a").forEach(a => a.classList.toggle("active", a.dataset.nav === section));

    let title = "BizPy";
    switch (section) {
      case "home": V.home(main); break;
      case "learn":
        if (parts[1]) { V.lesson(main, parts[1], parts[2]); title = (FP.LESSONS.find(l => l.id === parts[1])?.title || "Lesson") + " · BizPy"; }
        else { V.learnIndex(main); title = "Tutorial · BizPy"; }
        break;
      case "exercises": V.exercises(main); title = "Exercises · BizPy"; break;
      case "playground": V.playground(main, query); title = "Playground · BizPy"; break;
      case "projects": V.projects(main, parts[1]); title = "Projects · BizPy"; break;
      case "flashcards": V.flashcards(main); title = "Flashcards · BizPy"; break;
      case "reference": V.reference(main, query); title = "Reference · BizPy"; break;
      case "settings": V.settings(main); title = "Settings · BizPy"; break;
      case "dictionary": V.dictionary(main, parts[1], query); title = (parts[1] ? (FP.GLOSSARY.find(g => g.id === parts[1])?.term + " · ") : "") + "Dictionary · BizPy"; break;
      case "certificate": V.certificate(main); title = "Certificate · BizPy"; break;
      default: main.innerHTML = `<div class="page narrow"><div class="empty">Page not found. <a href="#/">Go home</a></div></div>`;
    }
    document.title = title;
    U.renderSidebar(section === "learn" ? parts[1] : null);
    U.renderChip();
    if (!(section === "learn" && parts[2])) scrollTo(0, 0);
  }

  // Lesson anchors (#/learn/id/section) shouldn't re-render the page when we're already on that lesson.
  let lastPath = "";
  addEventListener("hashchange", () => {
    const h = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
    const key = h.slice(0, 2).join("/");
    if (h[0] === "learn" && h[2] && key === lastPath) {
      document.getElementById(h[2])?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    lastPath = key; route();
  });

  // Global keys: Ctrl+K search, Alt+arrows lesson nav, "/" to search
  document.addEventListener("keydown", (e) => {
    const typing = e.target.closest("input, textarea, select, .CodeMirror");
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); U.palette(); }
    else if (e.key === "/" && !typing) { e.preventDefault(); U.palette(); }
    else if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight") && !typing) {
      const m = location.hash.match(/#\/learn\/([^/?]+)/); if (!m) return;
      const i = U.lessonIndex(m[1]) + (e.key === "ArrowRight" ? 1 : -1);
      if (FP.LESSONS[i]) location.hash = `/learn/${FP.LESSONS[i].id}`;
    }
  });

  // Reading progress bar
  addEventListener("scroll", () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    $("#readProgress").style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }, { passive: true });

  $("#themeBtn").onclick = () => { S.setting("theme", document.documentElement.dataset.theme === "dark" ? "light" : "dark"); applyTheme(); };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!S.setting("theme")) applyTheme(); });
  $("#searchBtn").onclick = () => U.palette();
  $("#menuBtn").onclick = () => document.body.classList.toggle("drawer-open");
  $("#scrim").onclick = () => document.body.classList.remove("drawer-open");

  FP.app = { route, applyTheme };
  applyTheme();
  lastPath = location.hash.replace(/^#\/?/, "").split("?")[0].split("/").slice(0, 2).join("/");
  (FP.cloud ? FP.cloud.init() : Promise.resolve()).catch(e => console.error(e)).finally(() => { route(); FP.ui.renderAccount?.(); });
  // Warm Python up in the background once the page is idle, so the first Run is fast.
  setTimeout(() => FP.runner.start(), 1500);
})();
