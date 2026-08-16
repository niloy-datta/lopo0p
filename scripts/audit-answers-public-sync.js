/**
 * Cross-verify backend/data/answers vs public/questions.
 * Run: node scripts/audit-answers-public-sync.js
 * Writes: scripts/answers-public-sync-report.json
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ANSWERS_ROOT = path.join(ROOT, "backend", "data", "answers");
const PUBLIC_ROOT = path.join(ROOT, "public", "questions");
const REPORT_PATH = path.join(ROOT, "scripts", "answers-public-sync-report.json");
const MANIFEST_PATH = path.join(ROOT, "public", "quiz-data", "manifest.json");

const LEAK_FIELDS = [
  "correctOption",
  "correctAnswer",
  "answerIndex",
  "correctOptionIndex",
  "answer",
];

function walk(dir, suffix) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, suffix));
    else if (entry.name.endsWith(suffix)) out.push(full);
  }
  return out;
}

function readQuestions(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.questions)) return raw.questions;
  return [];
}

function hasLeakedAnswerFields(questions) {
  return questions.some((q) => q && LEAK_FIELDS.some((f) => q[f] != null));
}

function collectManifestSetIds(value, out = new Set()) {
  if (!value || typeof value !== "object") return out;
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object" && Number.isFinite(child.questionCount)) {
      out.add(key);
    }
    collectManifestSetIds(child, out);
  }
  return out;
}

function main() {
  const answerFiles = walk(ANSWERS_ROOT, ".answers.json");
  const publicFiles = walk(PUBLIC_ROOT, ".json").filter(
    (f) => path.basename(f) !== "index.json",
  );

  const publicBySetId = new Map();
  for (const file of publicFiles) {
    publicBySetId.set(path.basename(file, ".json"), file);
  }
  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    for (const setId of collectManifestSetIds(manifest)) {
      if (!publicBySetId.has(setId)) publicBySetId.set(setId, MANIFEST_PATH);
    }
  }

  const orphanAnswers = [];
  const missingAnswers = [];
  const leakedPublic = [];

  for (const ansFile of answerFiles) {
    const setId = path.basename(ansFile, ".answers.json");
    if (!publicBySetId.has(setId)) {
      orphanAnswers.push({
        setId,
        answersPath: path.relative(ROOT, ansFile),
      });
    }
  }

  for (const pubFile of publicFiles) {
    const setId = path.basename(pubFile, ".json");
    const subject = path.basename(path.dirname(pubFile));
    const ansPath = path.join(ANSWERS_ROOT, subject, `${setId}.answers.json`);

    if (!fs.existsSync(ansPath)) {
      missingAnswers.push({
        setId,
        subject,
        publicPath: path.relative(ROOT, pubFile),
      });
    }

    try {
      const questions = readQuestions(pubFile);
      if (hasLeakedAnswerFields(questions)) {
        leakedPublic.push({
          setId,
          subject,
          publicPath: path.relative(ROOT, pubFile),
        });
      }
    } catch (err) {
      leakedPublic.push({
        setId,
        subject,
        publicPath: path.relative(ROOT, pubFile),
        parseError: String(err),
      });
    }
  }

  const boardYears = { ssc: new Set(), hsc: new Set() };
  for (const pubFile of publicFiles) {
    const name = path.basename(pubFile, ".json");
    const yearMatch = name.match(/(?:^|[-_])(20(?:19|2[0-6]))(?:$|[-_])/);
    if (!yearMatch) continue;
    const subject = path.basename(path.dirname(pubFile));
    const bucket = subject.includes("hsc") || subject.includes("-paper") ? "hsc" : "ssc";
    boardYears[bucket].add(yearMatch[1]);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      answerFiles: answerFiles.length,
      publicQuestionFiles: publicFiles.length,
      orphanAnswers: orphanAnswers.length,
      missingAnswers: missingAnswers.length,
      leakedPublicFiles: leakedPublic.length,
    },
    boardYearCoverage: {
      ssc: [...boardYears.ssc].sort(),
      hsc: [...boardYears.hsc].sort(),
    },
    orphanAnswers: orphanAnswers.slice(0, 50),
    missingAnswers: missingAnswers.slice(0, 50),
    leakedPublic: leakedPublic.slice(0, 50),
    // Public answer leakage is a release blocker. Missing or private-only
    // legacy answer files need review, but are not evidence of exposed keys.
    status: leakedPublic.length > 0
      ? "FAIL"
      : missingAnswers.length > 0 || orphanAnswers.length > 0
        ? "WARNING"
        : "SUCCESS",
  };

  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Written: ${REPORT_PATH}`);
  console.log(JSON.stringify(report.counts, null, 2));
  console.log(`Status: ${report.status}`);
}

main();
