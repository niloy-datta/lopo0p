/**
 * Harvest verified SSC Biology MCQs (with answer keys) into chapter pools.
 *
 * Usage: node scripts/build-ssc-biology-quality-pool.js
 */
const fs = require("fs");
const path = require("path");
const { mapBiologyChapter } = require("./lib/ssc-biology-chapter-map");
const { isJunkQuestionText, isIncompleteQuestionText } = require("./lib/ssc-set-quality");

const ROOT = path.resolve(__dirname, "..");
const QUESTION_DIRS = [
  path.join(ROOT, "data", "backups", "svg-fix-2026-06-28", "public", "questions", "biology"),
  path.join(ROOT, "public", "questions", "biology"),
];
const ANSWERS_DIR = path.join(ROOT, "backend", "data", "answers", "biology");
const OUT = path.join(ROOT, "scripts", "data", "ssc-biology-quality-pool.json");

function loadJson(fp) {
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf8"));
}

function normalizeStem(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function answerIndexFromKey(options, correctOption) {
  const target = String(correctOption ?? "").trim();
  const idx = options.findIndex((o) => String(o).trim() === target);
  return idx >= 0 ? idx : -1;
}

function toPoolItem(q, ans) {
  const options = (q.options ?? []).map(String);
  const answerIndex = answerIndexFromKey(options, ans.correctOption);
  if (answerIndex < 0 || options.length < 4) return null;

  const text = String(q.text ?? "").trim();
  if (text.length < 20 || isJunkQuestionText(text, "biology")) return null;
  if (isIncompleteQuestionText(text, "biology")) return null;

  const chapter = mapBiologyChapter(text);
  if (!chapter) return null;

  return {
    text,
    options,
    answerIndex,
    explanation: String(ans.explanation ?? "").trim(),
    topic: "",
    image: q.image ?? null,
    chapter,
  };
}

function scoreQuality(text, filename) {
  if (/ssc-biology-board-standard-model-test/i.test(filename)) return 5;
  if (/ssc-biology-high-common/i.test(filename)) return 4;
  if (text.includes("উদ্দীপক")) return 3;
  if (text.includes(" i.") || text.includes(" i ")) return 2;
  return 1;
}

function harvest() {
  const pools = Object.fromEntries(
    Array.from({ length: 14 }, (_, i) => [String(i + 1).padStart(2, "0"), []]),
  );
  const seen = new Set();
  const files = new Set();

  for (const dir of QUESTION_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json") || f === "index.json") continue;
      files.add(f);
    }
  }

  const ordered = [...files].sort((a, b) => {
    const pri = (f) =>
      /ssc-biology-board-standard-model-test/i.test(f)
        ? 0
        : /ssc-biology-high-common/i.test(f)
          ? 1
          : /ssc-biology-chapter-\d+-model-test/i.test(f)
            ? 9
            : 5;
    return pri(a) - pri(b);
  });

  for (const f of ordered) {
    let qs = null;
    for (const dir of QUESTION_DIRS) {
      const fp = path.join(dir, f);
      if (fs.existsSync(fp)) {
        qs = loadJson(fp);
        break;
      }
    }
    if (!Array.isArray(qs)) continue;

    const ansPath = path.join(ANSWERS_DIR, f.replace(/\.json$/, ".answers.json"));
    const answers = loadJson(ansPath);
    if (!answers) continue;

    for (const q of qs) {
      const ans = answers[q.id];
      if (!ans?.correctOption) continue;
      const item = toPoolItem(q, ans);
      if (!item) continue;
      item.quality = scoreQuality(item.text, f);
      const key = normalizeStem(item.text);
      if (seen.has(key)) continue;
      seen.add(key);
      pools[item.chapter].push(item);
    }
  }

  for (const ch of Object.keys(pools)) {
    pools[ch].sort((a, b) => b.quality - a.quality || b.text.length - a.text.length);
  }

  return pools;
}

function main() {
  const pools = harvest();
  const stats = {};
  let total = 0;
  for (const [ch, items] of Object.entries(pools)) {
    stats[ch] = items.length;
    total += items.length;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), stats, pools }, null, 2)}\n`);

  console.log("Wrote", OUT);
  console.log("Total harvested:", total);
  console.log(stats);
}

main();
