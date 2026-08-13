/**
 * Fix ALL junk SSC General Math chapter model-test sets.
 * - Chapter 12: sets 01-05, 07, 08 (06 already real)
 * - Chapters 01, 02, 09, 11, 16: model-test-06
 */
const fs = require("fs");
const path = require("path");
const {
  buildCh12ExtendedBank,
  buildCh01Bank,
  buildCh02Bank,
  buildCh09Bank,
  buildCh11Bank,
  buildCh16Bank,
} = require("./lib/ssc-general-math-chapter-banks");
const { isLowQualitySet } = require("./lib/ssc-set-quality");

const ROOT = path.resolve(__dirname, "..");
const SUBJECT = "general-math";
const LETTERS = ["A", "B", "C", "D"];
const Q_PER_SET = 30;

const CHAPTER_META = {
  "01": { name: "বাস্তব সংখ্যা", bank: buildCh01Bank },
  "02": { name: "বীজগণিত", bank: buildCh02Bank },
  "09": { name: "পরিমাপ", bank: buildCh09Bank },
  "11": { name: "অনুপাত ও সমানুপাত", bank: buildCh11Bank },
  "12": { name: "সেট", bank: buildCh12ExtendedBank },
  "16": { name: "বীজগাণিতিক অভিব্যক্তি", bank: buildCh16Bank },
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function writeSet(chapterNo, setNo, questions, chapterName) {
  const setId = `ssc-general-math-chapter-${pad2(chapterNo)}-model-test-${pad2(setNo)}`;
  const publicQuestions = questions.map((q, i) => ({
    id: `${setId}-q${pad2(i + 1)}`,
    subject: SUBJECT,
    chapter: setId,
    text: q.text,
    options: q.options,
    image: q.image ?? null,
    optionImages: null,
    timeLimit: 45,
  }));

  const answerMap = {};
  publicQuestions.forEach((q, i) => {
    const src = questions[i];
    answerMap[q.id] = {
      answer: q.options[src.answerIndex],
      answerIndex: src.answerIndex,
      explanation: src.explanation ?? "",
      topic: chapterName,
      difficulty: 1200,
    };
  });

  const qDir = path.join(ROOT, "public", "questions", SUBJECT);
  const aDir = path.join(ROOT, "backend", "data", "answers", SUBJECT);
  fs.mkdirSync(qDir, { recursive: true });
  fs.mkdirSync(aDir, { recursive: true });
  fs.writeFileSync(path.join(qDir, `${setId}.json`), `${JSON.stringify(publicQuestions, null, 2)}\n`);
  fs.writeFileSync(path.join(aDir, `${setId}.answers.json`), `${JSON.stringify(answerMap, null, 2)}\n`);

  return { setId, publicQuestions, answerMap, chapterName, chapterNo: pad2(chapterNo) };
}

function syncMega(mega, modelIndex, bundle, setNo) {
  const { setId, publicQuestions, answerMap, chapterName, chapterNo } = bundle;
  mega.modelTests[setId] = publicQuestions.map((q, i) => {
    const ans = answerMap[q.id];
    return {
      id: q.id,
      questionText: q.text,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correctOption: LETTERS[ans.answerIndex],
      explanation: ans.explanation,
      chapter: chapterNo,
      topic: chapterName,
      difficulty: "Medium",
      questionNo: i + 1,
      image: q.image,
      optionImages: null,
    };
  });

  mega.modelTestsMeta[setId] = {
    displayTitle: `Chapter ${Number(chapterNo)} Model Test ${pad2(setNo)}`,
    name: `Chapter ${Number(chapterNo)} Model Test ${pad2(setNo)}`,
    scope: "chapter",
    tags: ["chapter-wise", "model-test"],
    chaptersCovered: [{ chapter: chapterNo, chapterName }],
    durationMinutes: Q_PER_SET,
    questionCount: Q_PER_SET,
    importance: "high",
    needsRegeneration: false,
  };

  if (modelIndex) {
    modelIndex.modelTests[setId] = {
      questionCount: Q_PER_SET,
      scope: "chapter",
      displayTitle: mega.modelTestsMeta[setId].displayTitle,
      durationMinutes: Q_PER_SET,
      importance: "high",
      tags: ["chapter-wise", "model-test"],
      chaptersCovered: [{ chapter: chapterNo, chapterName }],
      needsRegeneration: false,
    };
  }
}

function upsertQuestionsIndex(setId, title, chapterNo, chapterName) {
  const indexPath = path.join(ROOT, "public", "questions", SUBJECT, "index.json");
  let idx = { modelTests: [] };
  if (fs.existsSync(indexPath)) idx = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  idx.modelTests = idx.modelTests ?? [];
  let entry = idx.modelTests.find((m) => m.id === setId);
  if (!entry) {
    entry = { id: setId };
    idx.modelTests.push(entry);
  }
  Object.assign(entry, {
    title,
    questionCount: Q_PER_SET,
    scope: "chapter",
    importance: "high",
    tags: ["chapter-wise", "model-test"],
    chaptersCovered: [{ chapter: pad2(chapterNo), chapterName }],
  });
  fs.writeFileSync(indexPath, `${JSON.stringify(idx, null, 2)}\n`);
}

function main() {
  const megaPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.json`);
  const modelIndexPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.model-tests.index.json`);
  const mega = JSON.parse(fs.readFileSync(megaPath, "utf8"));
  const modelIndex = JSON.parse(fs.readFileSync(modelIndexPath, "utf8"));
  if (!mega.modelTests) mega.modelTests = {};
  if (!mega.modelTestsMeta) mega.modelTestsMeta = {};
  if (!modelIndex.modelTests) modelIndex.modelTests = {};

  const written = [];

  // Chapter 12: sets 01-08 (30 MCQs each)
  const ch12Pool = buildCh12ExtendedBank();
  const ch12Base = require("./data/ssc-general-math-ch12-base-bank.json");
  const ch12Sets = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const setNo of ch12Sets) {
    const start = (setNo - 1) * Q_PER_SET;
    const slice =
      setNo === 6
        ? ch12Base
        : ch12Pool.slice(start, start + Q_PER_SET);
    if (slice.length < Q_PER_SET) throw new Error(`Ch12 set ${setNo}: only ${slice.length} questions`);
    const bundle = writeSet("12", setNo, slice, CHAPTER_META["12"].name);
    syncMega(mega, modelIndex, bundle, setNo);
    upsertQuestionsIndex(bundle.setId, mega.modelTestsMeta[bundle.setId].displayTitle, "12", CHAPTER_META["12"].name);
    written.push(bundle.setId);
    console.log(`✓ ${bundle.setId}`);
  }

  // Other chapters: model-test-06 only
  for (const ch of ["01", "02", "09", "11", "16"]) {
    const meta = CHAPTER_META[ch];
    const bank = meta.bank();
    if (bank.length < Q_PER_SET) throw new Error(`Ch${ch}: bank too small`);
    const bundle = writeSet(ch, 6, bank.slice(0, Q_PER_SET), meta.name);
    syncMega(mega, modelIndex, bundle, 6);
    upsertQuestionsIndex(bundle.setId, mega.modelTestsMeta[bundle.setId].displayTitle, ch, meta.name);
    written.push(bundle.setId);
    console.log(`✓ ${bundle.setId}`);
  }

  fs.writeFileSync(megaPath, `${JSON.stringify(mega, null, 2)}\n`);
  fs.writeFileSync(modelIndexPath, `${JSON.stringify(modelIndex, null, 2)}\n`);

  let bad = 0;
  for (const setId of written) {
    const qs = JSON.parse(
      fs.readFileSync(path.join(ROOT, "public", "questions", SUBJECT, `${setId}.json`), "utf8"),
    );
    if (isLowQualitySet(qs, SUBJECT)) {
      console.warn(`WARN low quality: ${setId}`);
      bad++;
    }
  }
  console.log(`\nDone: ${written.length} sets, ${bad} quality warnings`);
}

main();
