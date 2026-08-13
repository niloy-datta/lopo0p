/**
 * Remove obvious placeholder/basic SSC higher-math premium content.
 *
 * The premium source has some chapters generated as fake placeholders
 * ("সেট ও ফাংশন Q1", "basic" solution, junk options). This cleaner removes
 * those records and keeps only sets that still have usable, non-placeholder
 * questions.
 */
const fs = require("fs");
const path = require("path");
const { isJunkQuestionText } = require("./lib/ssc-set-quality");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_PATH = path.join(ROOT, "ssc_higher_math_premium_full", "ssc_higher_math_premium.json");
const REPORT_PATH = path.join(ROOT, "data", "reports", "ssc-higher-math-premium-cleanup-report.json");
const JUNK_OPTIONS = new Set([
  "360",
  "180",
  "0",
  "1",
  "-1",
  "2",
  "3",
  "4",
  "5",
  "7",
  "8",
  "10",
  "11",
  "15",
  "22",
  "25",
  "a+b",
  "a-b",
  "x",
  "y",
  "b",
  "?",
  "ক",
  "খ",
  "গ",
  "ঘ",
]);

function questionText(q) {
  return String(q?.question ?? q?.questionText ?? q?.text ?? "").trim();
}

function isPlaceholderQuestion(q) {
  const text = questionText(q);
  const solution = String(q?.shortSolution ?? q?.explanation ?? "").trim().toLowerCase();
  const optionTexts = (Array.isArray(q?.options) ? q.options : []).map((option) =>
    String(option?.text ?? option ?? "").trim(),
  );
  const junkOptionCount = optionTexts.filter((option) => JUNK_OPTIONS.has(option)).length;

  if (solution === "basic" || solution.startsWith("basic ")) return true;
  if (junkOptionCount >= 3) return true;
  if (isJunkQuestionText(text, "higher-math")) return true;
  return /^.+\sQ\d+$/i.test(text);
}

function main() {
  const data = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf8"));
  const report = {
    generatedAt: new Date().toISOString(),
    source: path.relative(ROOT, SOURCE_PATH),
    before: { chapters: 0, sets: 0, questions: 0 },
    after: { chapters: 0, sets: 0, questions: 0 },
    removed: { chapters: 0, sets: 0, questions: 0 },
    chapters: [],
  };

  const cleanedChapters = [];
  for (const chapter of data.chapters ?? []) {
    report.before.chapters += 1;
    const chapterReport = {
      chapter: String(chapter.chapter ?? ""),
      chapterName: String(chapter.chapterName ?? ""),
      beforeSets: 0,
      afterSets: 0,
      beforeQuestions: 0,
      afterQuestions: 0,
      removedQuestions: 0,
    };

    const cleanedSets = [];
    for (const set of chapter.sets ?? []) {
      report.before.sets += 1;
      chapterReport.beforeSets += 1;

      const questions = Array.isArray(set.questions) ? set.questions : [];
      report.before.questions += questions.length;
      chapterReport.beforeQuestions += questions.length;

      const kept = questions.filter((q) => !isPlaceholderQuestion(q));
      const removed = questions.length - kept.length;
      chapterReport.removedQuestions += removed;
      report.removed.questions += removed;

      if (!kept.length) {
        report.removed.sets += 1;
        continue;
      }

      cleanedSets.push({ ...set, questions: kept });
      chapterReport.afterSets += 1;
      chapterReport.afterQuestions += kept.length;
      report.after.sets += 1;
      report.after.questions += kept.length;
    }

    if (!cleanedSets.length) {
      report.removed.chapters += 1;
      report.chapters.push(chapterReport);
      continue;
    }

    cleanedChapters.push({ ...chapter, sets: cleanedSets });
    report.after.chapters += 1;
    report.chapters.push(chapterReport);
  }

  fs.writeFileSync(SOURCE_PATH, `${JSON.stringify({ ...data, chapters: cleanedChapters }, null, 2)}\n`, "utf8");
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(
    `Premium cleanup: removed ${report.removed.questions} placeholder question(s), ${report.removed.sets} set(s), ${report.removed.chapters} chapter(s).`,
  );
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
}

main();
