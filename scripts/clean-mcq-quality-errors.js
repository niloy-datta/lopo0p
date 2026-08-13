/**
 * Remove public question records that fail hard MCQ QA checks.
 *
 * Usage:
 *   node scripts/clean-mcq-quality-errors.js --dry-run
 *   node scripts/clean-mcq-quality-errors.js --apply
 *
 * This intentionally does not invent replacement options or answers. If a
 * question has duplicate options, empty options, a duplicate stem, or no usable
 * stem, it is removed and the remaining valid questions are kept intact.
 *
 * Board/year-wise question files are always skipped.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");
const QA_REPORT_PATH = path.join(ROOT, "data", "mcq-qa-report.json");
const CLEANUP_REPORT_PATH = path.join(ROOT, "data", "reports", "mcq-quality-cleanup-report.json");
const BACKUP_ROOT = path.join(ROOT, "data", "backups");
const ARGS = new Set(process.argv.slice(2));
const APPLY = ARGS.has("--apply");
const DRY_RUN = ARGS.has("--dry-run") || !APPLY;

const HARD_ERROR_CODES = new Set([
  "missing_id",
  "missing_question",
  "invalid_option_count",
  "empty_option",
  "duplicate_options",
  "invalid_correct_option",
  "duplicate_in_set",
]);

const BOARD_FILE_RE =
  /(?:barishal|barisal|chattogram|cumilla|dhaka|dinajpur|jashore|jessore|mymensingh|rajshahi|sylhet)-20\d{2}\.json$/;

function isBoardQuestionIssue(issue) {
  const file = String(issue.file ?? "");
  const id = String(issue.id ?? "");

  return (
    /board/i.test(file) ||
    /board/i.test(id) ||
    BOARD_FILE_RE.test(file) ||
    file.includes("board-analyzed") ||
    id.includes("board-questions-year-wise") ||
    id.includes("board-analyzed") ||
    id.includes("rajshahi-board")
  );
}

function collectQuestions(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.questions)) return data.questions;
  return null;
}

function setQuestions(data, questions) {
  if (Array.isArray(data)) return questions;
  return { ...data, questions };
}

function makeBackupDir() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(BACKUP_ROOT, `mcq-quality-cleanup-${stamp}`);
}

function backupQuestionFile(absFile, backupDir) {
  const rel = path.relative(ROOT, absFile);
  const backupPath = path.join(backupDir, rel);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(absFile, backupPath);
}

function main() {
  if (!fs.existsSync(QA_REPORT_PATH)) {
    console.error(`QA report not found: ${path.relative(ROOT, QA_REPORT_PATH)}`);
    process.exit(1);
  }

  const qa = JSON.parse(fs.readFileSync(QA_REPORT_PATH, "utf8"));
  const badByFile = new Map();
  const skippedBoardFiles = new Set();
  for (const issue of qa.issues ?? []) {
    if (issue.severity !== "error") continue;
    if (!HARD_ERROR_CODES.has(issue.code)) continue;
    if (!issue.file || !issue.id) continue;
    if (isBoardQuestionIssue(issue)) {
      skippedBoardFiles.add(String(issue.file));
      continue;
    }

    const ids = badByFile.get(issue.file) ?? new Set();
    ids.add(String(issue.id));
    badByFile.set(issue.file, ids);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: DRY_RUN ? "dry-run" : "apply",
    filesTouched: 0,
    questionsRemoved: 0,
    filesWouldTouch: 0,
    questionsWouldRemove: 0,
    backupDir: null,
    boardFilesSkipped: [...skippedBoardFiles].sort(),
    files: [],
  };

  const backupDir = DRY_RUN ? null : makeBackupDir();

  for (const [relFile, badIds] of [...badByFile.entries()].sort()) {
    const abs = path.join(QUESTIONS_DIR, relFile);
    if (!fs.existsSync(abs)) continue;

    const data = JSON.parse(fs.readFileSync(abs, "utf8"));
    const questions = collectQuestions(data);
    if (!questions) continue;

    const before = questions.length;
    const kept = questions.filter((q) => !badIds.has(String(q?.id ?? "")));
    const removed = before - kept.length;
    if (!removed) continue;

    report.filesWouldTouch += 1;
    report.questionsWouldRemove += removed;

    if (!DRY_RUN) {
      backupQuestionFile(abs, backupDir);
      fs.writeFileSync(abs, `${JSON.stringify(setQuestions(data, kept), null, 2)}\n`, "utf8");
      report.filesTouched += 1;
      report.questionsRemoved += removed;
      report.backupDir = path.relative(ROOT, backupDir);
    }

    report.files.push({
      file: relFile,
      before,
      after: kept.length,
      removed,
      ids: [...badIds].filter((id) => questions.some((q) => String(q?.id ?? "") === id)).sort(),
    });
  }

  fs.mkdirSync(path.dirname(CLEANUP_REPORT_PATH), { recursive: true });
  fs.writeFileSync(CLEANUP_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (DRY_RUN) {
    console.log(
      `Dry run: would remove ${report.questionsWouldRemove} hard-error question(s) from ${report.filesWouldTouch} public question file(s).`,
    );
  } else {
    console.log(
      `Removed ${report.questionsRemoved} hard-error question(s) from ${report.filesTouched} public question file(s).`,
    );
    if (report.backupDir) {
      console.log(`Backup: ${report.backupDir}`);
    }
  }
  if (report.boardFilesSkipped.length) {
    console.log(`Skipped ${report.boardFilesSkipped.length} board question file(s).`);
  }
  console.log(`Report: ${path.relative(ROOT, CLEANUP_REPORT_PATH)}`);
}

main();
