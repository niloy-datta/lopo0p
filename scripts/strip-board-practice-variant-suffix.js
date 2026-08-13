/**
 * Remove leaked "বোর্ড অনুশীলন ভ্যারিয়েন্ট …" suffixes from question JSON.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGET_DIRS = [
  path.join(ROOT, "public", "quiz-data"),
  path.join(ROOT, "public", "questions"),
  path.join(ROOT, "backend", "data", "answers"),
];

const SUFFIX_RE = /\s*[—\-–]?\s*বোর্ড\s+অনুশীলন[\s\S]*$/gi;

const TEXT_KEYS = new Set([
  "questionText",
  "text",
  "question",
  "explanation",
  "shortSolution",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctAnswerText",
]);

function cleanText(value) {
  if (typeof value !== "string" || !/বোর্ড\s+অনুশীলন/.test(value)) return value;
  return value.replace(SUFFIX_RE, "").trim();
}

function walkValue(value, stats) {
  if (Array.isArray(value)) {
    for (const item of value) walkValue(item, stats);
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (TEXT_KEYS.has(key) && typeof child === "string") {
      const next = cleanText(child);
      if (next !== child) {
        value[key] = next;
        stats.fields += 1;
      }
      continue;
    }
    walkValue(child, stats);
  }
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  if (!/বোর্ড\s+অনুশীলন/.test(raw)) return 0;

  const data = JSON.parse(raw);
  const stats = { fields: 0 };
  walkValue(data, stats);
  if (!stats.fields) return 0;

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  return stats.fields;
}

function walkDir(dir, totals) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkDir(p, totals);
    else if (ent.name.endsWith(".json")) {
      const changed = processFile(p);
      if (changed) {
        totals.files += 1;
        totals.fields += changed;
      }
    }
  }
}

function main() {
  const totals = { files: 0, fields: 0 };
  for (const dir of TARGET_DIRS) walkDir(dir, totals);
  console.log(
    `\nStripped board practice variant suffix from ${totals.fields} fields in ${totals.files} files.\n`,
  );
}

main();
