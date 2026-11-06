// Dumps all FlowPy content (lessons, bosses) as JSON plus the Python harness source.
// Usage: node tests/dump_content.js > out.json
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { console };
ctx.window = ctx; // like a browser: window is the global object, so bare FP === window.FP
vm.createContext(ctx);
const files = ["js/harness.js", ...fs.readdirSync(path.join(root, "js/content")).sort().map(f => "js/content/" + f)];
for (const f of files) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
}
const FP = ctx.FP;
process.stdout.write(JSON.stringify({
  harness: FP.HARNESS,
  lessons: FP.LESSONS || [],
  bosses: FP.BOSSES || [],
  flashcards: FP.FLASHCARDS || [],
  reference: FP.REFERENCE || {},
  visuals: FP.VISUALS || {},
  glossary: FP.GLOSSARY || [],
  rewards: FP.REWARDS || {},
}));
