/* Dictionary page + automatic term linking with hover hints.
   linkTerms(root) scans text (not code blocks, links or headings) and wraps the first mention of each
   dictionary word per section in <a class="term">. Hover shows a hint; click opens #/dictionary/<id>. */
(function () {
  const { html, raw, $, $$, el, esc } = FP.u;

  // Words too common in normal English to auto-link from prose (still linked when written as <code>word</code>).
  const AMBIGUOUS = new Set(["set", "key", "keys", "type", "types", "row", "rows", "record", "records", "column", "columns", "search",
    "test", "tests", "try", "except", "error", "errors", "file", "files", "select", "join", "query", "queries", "property", "private",
    "import", "return", "returns", "returned", "range", "str", "int", "dict", "bool", "assign", "convert", "conversion", "indent",
    "sort", "boundary", "bug", "bugs", "debug", "slice", "persist", "instance", "instances", "remainder", "iterate", "comment", "comments",
    "package", "packages", "condition", "conditions", "conditional", "assert", "inherit", "inherits"]);

  let byId = null, matcher = null, codeMap = null;
  function build() {
    if (byId) return;
    byId = new Map(FP.GLOSSARY.map(g => [g.id, g]));
    const words = new Map(); codeMap = new Map();
    for (const g of FP.GLOSSARY) {
      const head = g.term.replace(/\s*\(.*\)$/, "");
      const variants = [head, ...(g.match || [])];
      const paren = g.term.match(/\((.*)\)/); if (paren) variants.push(paren[1]);
      for (const v of variants) {
        const k = v.toLowerCase();
        codeMap.set(k, g.id); codeMap.set(k.replace(/\(\)$/, ""), g.id);
        if (!AMBIGUOUS.has(k) && /^[a-z][a-z0-9 \-]*[a-z0-9]$/i.test(v) && !words.has(k)) words.set(k, g.id);
      }
    }
    const list = [...words.keys()].sort((a, b) => b.length - a.length).map(w => w.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&").replace(/ /g, "\\s+"));
    matcher = { re: new RegExp(`\\b(${list.join("|")})\\b`, "gi"), words };
  }

  const termLink = (id, text) => {
    const a = document.createElement("a");
    a.className = "term"; a.dataset.term = id; a.href = `#/dictionary/${id}`; a.textContent = text;
    return a;
  };

  function linkTerms(root) {
    if (!root || !FP.GLOSSARY) return;
    build();
    const used = new Set();
    // 1) <code>float</code>-style inline code that is exactly a dictionary word
    $$("code", root).forEach(c => {
      if (c.closest("pre, a, .example, .ide, h1, h2, h3")) return;
      const id = codeMap.get(c.textContent.trim().toLowerCase().replace(/\(\)$/, ""));
      if (!id || used.has(id)) return;
      used.add(id);
      const a = termLink(id, ""); a.classList.add("code-term"); c.replaceWith(a); a.append(c);
    });
    // 2) plain-text mentions
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => n.parentElement.closest("pre, code, a, button, h1, h2, h3, h4, .example, .ide, .quiz-opt, input, textarea") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue; matcher.re.lastIndex = 0;
      let m, last = 0, frag = null;
      while ((m = matcher.re.exec(text))) {
        const id = matcher.words.get(m[1].toLowerCase().replace(/\s+/g, " "));
        if (!id || used.has(id)) continue;
        used.add(id);
        frag ||= document.createDocumentFragment();
        frag.append(text.slice(last, m.index), termLink(id, m[1]));
        last = m.index + m[1].length;
      }
      if (frag) { frag.append(text.slice(last)); node.replaceWith(frag); }
    }
  }

  // Hover tooltip (one shared element, follows the hovered term)
  let tip = null, tipFor = null;
  function showTip(a) {
    const g = byId?.get(a.dataset.term); if (!g) return;
    tip ||= document.body.appendChild(el(`<div class="term-tip" role="tooltip"></div>`));
    tip.innerHTML = `<b>${esc(g.term)}</b> ${esc(g.short)}<span class="more">Click for the full meaning →</span>`;
    tip.hidden = false; tipFor = a;
    const r = a.getBoundingClientRect(), tw = Math.min(300, innerWidth - 20);
    tip.style.maxWidth = tw + "px";
    const left = Math.max(10, Math.min(r.left, innerWidth - tw - 10));
    const below = r.bottom + 8 + tip.offsetHeight < innerHeight;
    tip.style.left = left + "px";
    tip.style.top = (below ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + "px";
  }
  const hideTip = () => { if (tip) tip.hidden = true; tipFor = null; };
  document.addEventListener("mouseover", (e) => { const a = e.target.closest?.("a.term"); if (a && a !== tipFor) { build(); showTip(a); } else if (!a && tipFor) hideTip(); });
  document.addEventListener("focusin", (e) => { const a = e.target.closest?.("a.term"); if (a) { build(); showTip(a); } });
  document.addEventListener("focusout", hideTip);
  addEventListener("scroll", hideTip, { passive: true });
  // Clicking a term remembers where you came from so the dictionary can offer "Go back".
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("a.term"); if (!a) return;
    e.preventDefault(); hideTip();
    sessionStorage.setItem("bizpy.dictFrom", location.hash || "#/");
    sessionStorage.setItem("bizpy.dictScroll", String(scrollY));
    location.hash = `/dictionary/${a.dataset.term}`;
  });

  function render(main, id, query) {
    build();
    const from = sessionStorage.getItem("bizpy.dictFrom");
    const sorted = [...FP.GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
    let letter = "";
    const index = sorted.map(g => {
      const L = g.term[0].toUpperCase(), head = L !== letter ? `<div class="letter">${L}</div>` : ""; letter = L;
      return head + html`<a href="#/dictionary/${g.id}" data-id="${g.id}" class="${g.id === id ? "active" : ""}">${g.term}</a>`;
    }).join("");
    const entry = (g) => html`<article class="dict-entry ${g.id === id ? "focus" : ""}" id="d-${g.id}">
      <h2>${g.term}</h2><div class="kind">${g.kind}</div>
      <p style="font-size:1.05rem;margin-bottom:8px"><b>${g.short}</b></p>
      <div class="prose">${raw(g.long)}</div>
      ${g.like ? raw(html`<div class="like"><b>In real life:</b> ${raw(g.like)}</div>`.toString()) : ""}
      ${g.example ? raw(FP.editor.exampleBlock(g.example).toString()) : ""}
      ${g.related?.length ? raw(html`<div class="related">Related: ${g.related.filter(r => byId.has(r)).map((r, i) => html`${i ? ", " : ""}<a href="#/dictionary/${r}" data-id="${r}">${byId.get(r).term}</a>`)}</div>`.toString()) : ""}
    </article>`;

    main.innerHTML = html`<div class="page">
      ${from && id ? raw(`<button class="btn back-btn" data-back>← Go back</button>`) : ""}
      <p class="eyebrow">Dictionary</p><h1>Programming words</h1>
      <p class="muted" style="max-width:44em">Every word you'll meet, in plain English with a real-life comparison. Dotted words in lessons link here, and hovering shows a quick hint.</p>
      <input class="ref-search" placeholder="Search words… e.g. float, loop, primary key" value="${query?.get("q") || ""}" aria-label="Search dictionary">
      <div class="dict-layout">
        <nav class="dict-index" aria-label="All words">${raw(index)}</nav>
        <div class="dict-entries">${(id && byId.has(id) ? [byId.get(id), ...sorted.filter(g => g.id !== id)] : sorted).map(entry)}</div>
      </div></div>`.toString();

    const input = $(".ref-search", main);
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      $$(".dict-entry", main).forEach(a => {
        const g = byId.get(a.id.slice(2));
        a.hidden = !!q && !(g.term + " " + (g.match || []).join(" ") + " " + g.short).toLowerCase().includes(q);
      });
    };
    input.addEventListener("input", filter); filter();

    $(".dict-entries", main).addEventListener("click", (e) => {
      const ex = e.target.closest(".example");
      if (ex && e.target.closest("[data-tryit]")) FP.ui.tryIt(ex.querySelector("pre").textContent);
      if (ex && e.target.closest("[data-copy]")) FP.u.copyText(ex.querySelector("pre").textContent);
    });
    $("[data-back]", main)?.addEventListener("click", () => {
      const target = sessionStorage.getItem("bizpy.dictFrom") || "#/";
      const y = +sessionStorage.getItem("bizpy.dictScroll") || 0;
      sessionStorage.removeItem("bizpy.dictFrom");
      location.hash = target.slice(1);
      setTimeout(() => scrollTo(0, y), 400);
    });
    if (id) scrollTo(0, 0);
  }

  FP.dict = { linkTerms };
  FP.views = FP.views || {};
  FP.views.dictionary = render;
})();
