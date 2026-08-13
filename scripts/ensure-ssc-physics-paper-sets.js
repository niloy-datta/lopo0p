/**
 * Regenerate SSC Physics paper-wise model tests (sets 04–15) from board-quality pool.
 *
 * Usage: node scripts/ensure-ssc-physics-paper-sets.js [setNo|all]
 */
const fs = require("fs");
const path = require("path");
const { buildPhysicsPaperSet } = require("./lib/ssc-physics-premium-bank");
const { normalizeStemForDedup } = require("./lib/ssc-biology-stem-utils");
const { isParametricBoilerplate, templateKeyForDedup, isStandaloneBoardMcq } = require("./lib/ssc-physics-premium-bank");

const ROOT = path.resolve(__dirname, "..");
const SUBJECT = "physics";
const LEVEL = "ssc";
const TARGET_Q = 25;
const SET_RANGE = { from: 4, to: 15 };
const LETTER_OPTIONS = ["A", "B", "C", "D"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function writePaperSet(setNo, questions) {
  const setId = `ssc-physics-paper-set-${pad2(setNo)}`;
  const displayTitle = `SSC Physics Paper-wise Model Test Set ${pad2(setNo)}`;

  const publicQuestions = questions.map((q, i) => ({
    id: `${setId}-q${pad2(i + 1)}`,
    subject: SUBJECT,
    chapter: setId,
    text: String(q.text ?? "").trim(),
    options: q.options.map((o) => String(o).trim()),
    image: q.image ?? null,
    timeLimit: 45,
  }));

  const answerMap = {};
  const megaQuestions = publicQuestions.map((q, i) => {
    const src = questions[i];
    const answerIndex = src.answerIndex ?? 0;
    answerMap[q.id] = {
      answer: q.options[answerIndex] ?? q.options[0],
      answerIndex,
      explanation: String(src.explanation ?? "").trim(),
      topic: String(src.topic ?? "").trim(),
      difficulty: 1200,
    };
    return {
      id: q.id,
      questionText: q.text,
      optionA: q.options[0] ?? "",
      optionB: q.options[1] ?? "",
      optionC: q.options[2] ?? "",
      optionD: q.options[3] ?? "",
      correctOption: LETTER_OPTIONS[answerIndex] ?? "A",
      explanation: answerMap[q.id].explanation,
      chapter: src.chapter ?? "",
      topic: answerMap[q.id].topic,
      difficulty: "Board Standard",
      questionNo: i + 1,
      image: q.image,
    };
  });

  const pubPath = path.join(ROOT, "public", "questions", SUBJECT, `${setId}.json`);
  const ansPath = path.join(ROOT, "backend", "data", "answers", SUBJECT, `${setId}.answers.json`);
  fs.mkdirSync(path.dirname(pubPath), { recursive: true });
  fs.mkdirSync(path.dirname(ansPath), { recursive: true });
  fs.writeFileSync(pubPath, `${JSON.stringify(publicQuestions, null, 2)}\n`, "utf8");
  fs.writeFileSync(ansPath, `${JSON.stringify(answerMap, null, 2)}\n`, "utf8");

  const meta = {
    displayTitle,
    tags: ["paper-wise", "model-test", "board-quality"],
    durationMinutes: 25,
    questionCount: megaQuestions.length,
  };

  const megaPath = path.join(ROOT, "public", "quiz-data", LEVEL, `${SUBJECT}.json`);
  let mega = fs.existsSync(megaPath)
    ? JSON.parse(fs.readFileSync(megaPath, "utf8"))
    : { level: "SSC", subject: SUBJECT, chapters: {}, modelTests: {}, modelTestsMeta: {} };
  if (!mega.modelTests) mega.modelTests = {};
  if (!mega.modelTestsMeta) mega.modelTestsMeta = {};
  mega.modelTests[setId] = megaQuestions;
  mega.modelTestsMeta[setId] = {
    displayTitle: meta.displayTitle,
    name: meta.displayTitle,
    scope: "paper",
    tags: meta.tags,
    durationMinutes: meta.durationMinutes,
    questionCount: meta.questionCount,
    importance: "high",
  };
  fs.writeFileSync(megaPath, `${JSON.stringify(mega, null, 2)}\n`, "utf8");

  const indexPath = path.join(ROOT, "public", "quiz-data", LEVEL, `${SUBJECT}.model-tests.index.json`);
  let index = fs.existsSync(indexPath)
    ? JSON.parse(fs.readFileSync(indexPath, "utf8"))
    : { subject: SUBJECT, modelTests: {} };
  if (!index.modelTests) index.modelTests = {};
  index.modelTests[setId] = {
    questionCount: meta.questionCount,
    scope: "paper",
    displayTitle: meta.displayTitle,
    durationMinutes: meta.durationMinutes,
    importance: "high",
    tags: meta.tags,
  };
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  return { setId, count: megaQuestions.length };
}

function auditSet(setNo) {
  const setId = `ssc-physics-paper-set-${pad2(setNo)}`;
  const pubPath = path.join(ROOT, "public", "questions", SUBJECT, `${setId}.json`);
  const qs = JSON.parse(fs.readFileSync(pubPath, "utf8"));
  const stems = new Set();
  const templates = new Set();
  let dupes = 0;
  let templateDupes = 0;
  let fakeImg = 0;
  let boiler = 0;
  let nonBoard = 0;
  for (const q of qs) {
    const k = normalizeStemForDedup(q.text);
    if (stems.has(k)) dupes++;
    else stems.add(k);
    const tk = templateKeyForDedup(q.text);
    if (templates.has(tk)) templateDupes++;
    else templates.add(tk);
    if (q.image && /ssc-physics-paper-set-\d+-q\d+\.svg/.test(q.image)) fakeImg++;
    if (isParametricBoilerplate(q.text)) boiler++;
    if (!isStandaloneBoardMcq(q.text)) nonBoard++;
  }
  const ok = qs.length === TARGET_Q && dupes === 0 && templateDupes === 0 && fakeImg === 0 && boiler === 0 && nonBoard === 0;
  return { setId, count: qs.length, dupes, templateDupes, fakeImg, boiler, nonBoard, ok };
}

function main() {
  const arg = (process.argv[2] ?? "all").toLowerCase();
  const setNos =
    arg === "all"
      ? Array.from({ length: SET_RANGE.to - SET_RANGE.from + 1 }, (_, i) => SET_RANGE.from + i)
      : [Number(arg)];

  const usedGlobal = new Set();
  for (const setNo of setNos) {
    const questions = buildPhysicsPaperSet(setNo, usedGlobal);
    if (questions.length < TARGET_Q) {
      console.warn(`⚠️  Set ${pad2(setNo)}: only ${questions.length}/${TARGET_Q} questions`);
    }
    const { setId, count } = writePaperSet(setNo, questions);
    console.log(`✅ ${setId} — ${count} questions`);
  }

  console.log("\n--- Audit ---");
  for (const setNo of setNos) {
    const a = auditSet(setNo);
    console.log(
      `${a.ok ? "OK" : "NEED"} ${a.setId}: ${a.count} Q, dupes=${a.dupes}, templateDupes=${a.templateDupes}, nonBoard=${a.nonBoard}`,
    );
  }
}

main();
