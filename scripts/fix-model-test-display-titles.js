/**
 * Normalize model test displayTitle values across quiz-data JSON files.
 * - Paper-wise tier-a-hot / board-analyzed → মডেল টেস্ট · সেট ০১
 * - Chapter-wise → অধ্যায় ০১ · {chapterName} · টেস্ট ০১
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const QUIZ_DATA = path.join(ROOT, "public", "quiz-data");
const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function bn2(n) {
  return String(n)
    .padStart(2, "0")
    .split("")
    .map((d) => BN[parseInt(d, 10)])
    .join("");
}

function extractChapterNo(sourceKey) {
  const m = String(sourceKey).match(/chapter-(\d{2})/i);
  return m ? parseInt(m[1], 10) : null;
}

function extractSetNo(sourceKey) {
  const s = String(sourceKey).toLowerCase();
  const split = s.match(/split-(\d+)$/);
  if (split) return parseInt(split[1], 10);
  const set = s.match(/(?:set|model-test)-(\d+)$/);
  if (set) return parseInt(set[1], 10);
  const tier = s.match(/tier-a-hot-model-test-(\d+)$/);
  if (tier) return parseInt(tier[1], 10);
  const board = s.match(/board-analyzed-premium-set-(\d+)$/);
  if (board) return parseInt(board[1], 10);
  return null;
}

function resolveChapterName(entry, chapterMap) {
  const covered = entry.chaptersCovered?.[0];
  const fromMeta = covered?.chapterName || covered?.name;
  if (fromMeta && !/^\d{1,2}$/.test(String(fromMeta).trim())) return String(fromMeta).trim();
  const ch = extractChapterNo(entry._sourceKey || "");
  if (ch && chapterMap[ch]) return chapterMap[ch];
  return undefined;
}

const ORPHAN_CHAPTER_NAMES = {
  "hsc/chemistry-2nd-paper": { "05": "পেট্রোলিয়াম" },
};

function orphanChapterName(subjectKey, chapterNo) {
  const padded = String(chapterNo).padStart(2, "0");
  return ORPHAN_CHAPTER_NAMES[subjectKey]?.[padded];
}

function formatTitle(sourceKey, entry, chapterMap, subjectKey) {
  const ch = extractChapterNo(sourceKey);
  const set = extractSetNo(sourceKey);
  const isSplit = /split-\d+$/i.test(sourceKey);

  if (ch != null && set != null) {
    const name =
      resolveChapterName({ ...entry, _sourceKey: sourceKey }, chapterMap) ||
      orphanChapterName(subjectKey, ch);
    const suffix = isSplit ? `ভাগ ${bn2(set)}` : `টেস্ট ${bn2(set)}`;
    if (name) return `অধ্যায় ${bn2(ch)} · ${name} · ${suffix}`;
    return `অধ্যায় ${bn2(ch)} · ${suffix}`;
  }

  if (/tier-a-hot-model-test-|board-analyzed-premium-set-/i.test(sourceKey) && set != null) {
    return `মডেল টেস্ট · সেট ${bn2(set)}`;
  }

  return null;
}

function buildChapterNameMap(modelTests) {
  const map = {};
  for (const [key, entry] of Object.entries(modelTests)) {
    const ch = extractChapterNo(key);
    if (!ch) continue;
    const name = resolveChapterName({ ...entry, _sourceKey: key }, {});
    if (name) map[ch] = name;
  }
  return map;
}

function updateModelTests(modelTests, subjectKey) {
  const chapterMap = buildChapterNameMap(modelTests);
  let changed = 0;

  for (const [key, entry] of Object.entries(modelTests)) {
    const next = formatTitle(key, entry, chapterMap, subjectKey);
    if (!next) continue;

    if (!entry.chaptersCovered?.length) {
      const ch = extractChapterNo(key);
      const name = chapterMap[ch] || orphanChapterName(subjectKey, ch);
      if (ch && name) {
        entry.chaptersCovered = [{ chapter: String(ch).padStart(2, "0"), chapterName: name }];
      }
    }

    if (entry.displayTitle !== next) {
      entry.displayTitle = next;
      entry.name = next;
      changed++;
    }

    if (/tier-a-hot-model-test-/i.test(key)) {
      entry.tags = ["board-standard", "high-priority", "paper-wise"];
      entry.confidenceLabel = "Board Standard";
    }
  }

  return changed;
}

function processSubject(level, baseName) {
  const subjectKey = `${level}/${baseName}`;
  const mainPath = path.join(QUIZ_DATA, level, `${baseName}.json`);
  const idxPath = path.join(QUIZ_DATA, level, `${baseName}.model-tests.index.json`);
  let total = 0;

  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    const c = updateModelTests(idx.modelTests || {}, subjectKey);
    if (c) fs.writeFileSync(idxPath, `${JSON.stringify(idx, null, 2)}\n`);
    total += c;
  }

  if (fs.existsSync(mainPath)) {
    const data = JSON.parse(fs.readFileSync(mainPath, "utf8"));
    if (data.modelTests) {
      const c = updateModelTests(data.modelTests, subjectKey);
      if (c) fs.writeFileSync(mainPath, `${JSON.stringify(data, null, 2)}\n`);
      total += c;
    }
    if (data.modelTestsMeta) {
      const c = updateModelTests(data.modelTestsMeta, subjectKey);
      if (c) fs.writeFileSync(mainPath, `${JSON.stringify(data, null, 2)}\n`);
      total += c;
    }
  }

  if (total) console.log(`  ${level}/${baseName}: ${total} titles updated`);
  return total;
}

function main() {
  let grand = 0;
  for (const level of ["hsc", "ssc"]) {
    const dir = path.join(QUIZ_DATA, level);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json") || file.includes(".model-tests.index")) continue;
      grand += processSubject(level, file.replace(".json", ""));
    }
  }
  console.log(`\nDone. ${grand} display titles updated.\n`);
}

main();
