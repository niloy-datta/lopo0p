/**
 * Import SSC chapter model-test sets from a JSON payload.
 *
 * Usage: node scripts/import-ssc-chapter-payload.js <payload.json>
 *
 * Payload shape:
 * {
 *   subject, chapterSlug, chapterName, scope?,
 *   sets: [{ setName, questions: [{ id, text, options, answer, answerIndex }] }]
 * }
 */
const fs = require("fs");
const path = require("path");
const {
  pad2,
  writeSetBundle,
  loadMega,
  loadModelIndex,
  syncSetToMega,
  upsertQuestionsIndex,
  saveMegaAndIndex,
} = require("./lib/ssc-five-set-sync");

const ROOT = path.resolve(__dirname, "..");
const payloadPath = process.argv[2];

if (!payloadPath) {
  console.error("Usage: node scripts/import-ssc-chapter-payload.js <payload.json>");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(path.resolve(payloadPath), "utf8"));
const subjectSlug = payload.subject;
const chapterSlug = payload.chapterSlug;
const chapterName = payload.chapterName;
const scope = payload.scope ?? "";
const chapterNo = Number(chapterSlug.match(/chapter-(\d+)/i)?.[1] ?? 0);

if (!subjectSlug || !chapterSlug || !chapterName || !chapterNo) {
  console.error("Invalid payload: subject, chapterSlug, chapterName required");
  process.exit(1);
}

const { mega } = loadMega(ROOT, subjectSlug);
const { modelIndex } = loadModelIndex(ROOT, subjectSlug);

for (let i = 0; i < payload.sets.length; i++) {
  const set = payload.sets[i];
  const setNo = i + 1;
  const setId = `ssc-${subjectSlug}-chapter-${pad2(chapterNo)}-model-test-${pad2(setNo)}`;
  const title = `অধ্যায় ${chapterNo} · ${chapterName} · ${set.setName}`;

  const publicQuestions = set.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
    image: q.image ?? null,
    timeLimit: q.timeLimit ?? 45,
  }));

  const answers = set.questions.map((q) => ({
    answer: q.answer,
    answerIndex: q.answerIndex,
    explanation: q.explanation ?? "",
    topic: chapterName,
  }));

  const bundle = writeSetBundle({
    root: ROOT,
    subjectSlug,
    chapterNo,
    chapterName,
    setNo,
    title,
    publicQuestions,
    answers,
  });

  syncSetToMega(mega, modelIndex, {
    ...bundle,
    displayTitle: title,
  });

  if (scope && mega.modelTestsMeta[bundle.setId]) {
    mega.modelTestsMeta[bundle.setId].scopeNote = scope;
  }

  upsertQuestionsIndex(ROOT, subjectSlug, bundle.setId, title, chapterNo, chapterName);
  console.log(`  ✓ ${bundle.setId} (${bundle.publicQuestions.length} questions)`);
}

saveMegaAndIndex(ROOT, subjectSlug, mega, modelIndex);
console.log(`\nSynced ${payload.sets.length} sets for ${chapterSlug}`);
