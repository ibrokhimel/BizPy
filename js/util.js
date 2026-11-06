/* Small DOM + text helpers shared by every view. */
(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // html`...` tagged template: interpolations are escaped unless wrapped with raw().
  class Raw { constructor(v) { this.v = v; } toString() { return this.v; } }
  const raw = (v) => new Raw(v);
  const html = (strings, ...vals) => raw(strings.reduce((acc, s, i) => {
    if (i === 0) return s;
    const v = vals[i - 1];
    const piece = Array.isArray(v) ? v.map(x => x instanceof Raw ? x.v : esc(x)).join("")
      : v instanceof Raw ? v.v : (v === false || v == null ? "" : esc(v));
    return acc + piece + s;
  }, ""));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const el = (markup) => { const t = document.createElement("template"); t.innerHTML = String(markup).trim(); return t.content.firstElementChild; };

  // Static syntax highlighting for read-only code blocks (CodeMirror runMode when available).
  function highlight(code) {
    if (window.CodeMirror && CodeMirror.runMode) {
      let out = "";
      CodeMirror.runMode(code, "python", (text, style) => {
        out += style ? `<span class="cm-${style.replace(/ /g, " cm-")}">${esc(text)}</span>` : esc(text);
      });
      return out;
    }
    return esc(code);
  }

  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) {
      const ta = el(`<textarea style="position:fixed;opacity:0"></textarea>`); ta.value = text;
      document.body.append(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove(); return ok;
    }
  }

  // Translates common Python errors into plain English for beginners.
  function explainError(err) {
    if (!err) return "";
    const m = (re) => err.match(re);
    let r;
    if ((r = m(/NameError: name '(\w+)' is not defined/))) return `Python doesn't know <b>${esc(r[1])}</b>. Check the spelling (names are case-sensitive), that you created it <i>before</i> using it, and that text is wrapped in quotes.`;
    if (m(/IndentationError|TabError/)) return `The <b>indentation</b> (spaces at the start of lines) is off. Code inside <code>if</code>, <code>for</code>, <code>def</code> and <code>class</code> must be indented by the same amount, usually 4 spaces.`;
    if (m(/SyntaxError: unterminated string|EOL while scanning/)) return `A <b>string isn't closed</b>. Every opening quote needs a matching closing quote.`;
    if (m(/SyntaxError: expected ':'/)) return `Missing a <b>colon</b>. Lines starting with <code>if</code>, <code>for</code>, <code>while</code>, <code>def</code>, <code>class</code> must end with <code>:</code>.`;
    if (m(/SyntaxError: '\(' was never closed|unexpected EOF/)) return `A <b>bracket isn't closed</b>. Count your <code>(</code> and <code>)</code>.`;
    if (m(/SyntaxError/)) return `Python couldn't understand the grammar of a line. Look at the line number and check brackets, quotes, colons and commas.`;
    if ((r = m(/TypeError: can only concatenate str \(not "(\w+)"\) to str/))) return `You tried to join text with a <b>${esc(r[1])}</b> using <code>+</code>. Convert it first with <code>str()</code>, or use an f-string.`;
    if (m(/TypeError: unsupported operand/)) return `Those two types can't be combined with that operator. Check the types with <code>type()</code>; you may need <code>int()</code> or <code>str()</code>.`;
    if ((r = m(/TypeError: (\w+)\(\) missing (\d+) required positional argument/))) return `<b>${esc(r[1])}()</b> was called with too few arguments. Check how many values the function expects.`;
    if (m(/TypeError: '(\w+)' object is not callable/)) return `You used <code>( )</code> on something that isn't a function. Did you name a variable the same as a function, like <code>list</code> or <code>print</code>?`;
    if (m(/IndexError/)) return `You asked for a position that doesn't exist. Remember indexes start at <b>0</b>, so the last item of a 3-item list is <code>[2]</code>.`;
    if ((r = m(/KeyError: (.+)/))) return `The dictionary has no key <b>${esc(r[1])}</b>. Use <code>.get(key)</code> or check with <code>in</code> first.`;
    if (m(/ZeroDivisionError/)) return `You divided by <b>zero</b>. Check the value before dividing, or catch it with <code>try/except</code>.`;
    if (m(/ValueError: invalid literal for int/)) return `<code>int()</code> got text that isn't a whole number. Check the input or wrap it in <code>try/except ValueError</code>.`;
    if ((r = m(/AttributeError: '(\w+)' object has no attribute '(\w+)'/))) return `A <b>${esc(r[1])}</b> has no <b>.${esc(r[2])}</b>. Check the spelling, or whether you set <code>self.${esc(r[2])}</code> in <code>__init__</code>.`;
    if (m(/RecursionError/)) return `A function keeps calling itself forever. Make sure the recursion has a base case.`;
    if (m(/EOFError/)) return `Your code called <code>input()</code> but there was nothing to read. Type values into the <b>Input</b> box (one per line, separated by <code>|</code>).`;
    if (m(/Stopped after/)) return `Your code ran for too long. A <code>while</code> loop whose condition never becomes False is the usual culprit.`;
    return "";
  }

  FP.u = { esc, raw, html, $, $$, el, highlight, slug, plural, todayKey, debounce, copyText, explainError };
})();
