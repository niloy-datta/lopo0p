/**
 * Imports a reviewed 25-question replacement set for SSC Physics, Chapter 09,
 * Test 02. It deliberately updates the public question bank, server answer
 * key, runtime quiz data, and both indexes in the same operation.
 *
 * Usage:
 * node scripts/import-ssc-physics-chapter-09-test-02-replacement.js <spec-file>
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SUBJECT = "physics";
const SLUG = "ssc-physics-chapter-09-model-test-02";
const LETTERS = ["A", "B", "C", "D"];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function extractQuestions(specPath) {
  const source = fs.readFileSync(specPath, "utf8");
  const match = source.match(/```json\s*([\s\S]*?)\s*```/u);
  if (!match) throw new Error("The replacement specification has no JSON code block.");
  const questions = JSON.parse(match[1]);
  if (!Array.isArray(questions) || questions.length !== 25) {
    throw new Error("The replacement set must contain exactly 25 questions.");
  }
  const seen = new Set();
  for (const [index, question] of questions.entries()) {
    const expectedId = `${SLUG}-q${String(index + 1).padStart(2, "0")}`;
    if (question.id !== expectedId || question.subject !== SUBJECT || question.chapter !== SLUG) {
      throw new Error(`Invalid identity at question ${index + 1}.`);
    }
    if (!Array.isArray(question.options) || question.options.length !== 4 || question.options.some((option) => !String(option).trim())) {
      throw new Error(`Question ${index + 1} must have four non-empty options.`);
    }
    if (!Number.isInteger(question.correctOption) || question.correctOption < 0 || question.correctOption > 3 || question.answer !== question.options[question.correctOption]) {
      throw new Error(`Question ${index + 1} has an invalid answer key.`);
    }
    if (seen.has(question.text)) throw new Error(`Duplicate question stem at question ${index + 1}.`);
    seen.add(question.text);
  }
  // The bright circular view of the sky seen by an underwater observer is
  // Snell's window, caused by refraction. Total internal reflection creates
  // the darker region surrounding that window.
  const lastQuestion = questions[24];
  if (lastQuestion?.id === `${SLUG}-q25` && /ডুবুরি/u.test(lastQuestion.text)) {
    lastQuestion.options = [
      "আলোর প্রতিসরণ",
      "অভ্যন্তরীণ পূর্ণ প্রতিফলন",
      "আলোর বিচ্ছুরণ",
      "লেন্সের ক্রিয়া",
    ];
    lastQuestion.correctOption = 0;
    lastQuestion.answerLabel = "A";
    lastQuestion.answer = lastQuestion.options[0];
    lastQuestion.explanation = "পানি-বায়ু বিভেদতলে সংকট কোণের ভেতরের রশ্মি প্রতিসরিত হয়ে ডুবুরির কাছে উজ্জ্বল বৃত্তাকার Snell’s window তৈরি করে; এর বাইরের অংশে পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটে।";
  }
  return questions;
}

function main() {
  const specPath = process.argv[2];
  if (!specPath) throw new Error("Provide the pasted replacement specification path.");
  const questions = extractQuestions(path.resolve(specPath));
  const publicQuestions = questions.map((question) => ({
    id: question.id,
    subject: SUBJECT,
    chapter: SLUG,
    text: question.text,
    options: question.options,
    image: question.image ?? null,
    optionImages: question.optionImages ?? null,
    timeLimit: question.timeLimit ?? 60,
  }));
  const answers = Object.fromEntries(questions.map((question) => [question.id, {
    correctOption: question.options[question.correctOption],
    explanation: question.explanation ?? "",
  }]));
  const megaQuestions = questions.map((question, index) => ({
    id: question.id,
    questionText: question.text,
    optionA: question.options[0],
    optionB: question.options[1],
    optionC: question.options[2],
    optionD: question.options[3],
    correctOption: LETTERS[question.correctOption],
    explanation: question.explanation ?? "",
    topic: question.topic ?? "",
    difficulty: question.difficulty ?? "Board Standard",
    chapter: "09",
    questionNo: index + 1,
    visualRequired: false,
    imageStatus: "not-required",
    image: question.image ?? null,
    optionImages: question.optionImages ?? null,
  }));

  const publicPath = path.join(ROOT, "public", "questions", SUBJECT, `${SLUG}.json`);
  const answerPath = path.join(ROOT, "backend", "data", "answers", SUBJECT, `${SLUG}.answers.json`);
  const megaPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.json`);
  const questionIndexPath = path.join(ROOT, "public", "questions", SUBJECT, "index.json");
  const modelIndexPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.model-tests.index.json`);

  const mega = readJson(megaPath);
  mega.modelTests[SLUG] = megaQuestions;
  mega.modelTestsMeta[SLUG] = {
    ...mega.modelTestsMeta[SLUG],
    questionCount: questions.length,
    durationMinutes: 25,
    needsRegeneration: false,
  };

  const questionIndex = readJson(questionIndexPath);
  const questionIndexEntry = questionIndex.modelTests.find((entry) => entry.id === SLUG);
  if (!questionIndexEntry) throw new Error("Missing subject-index entry for the replacement set.");
  questionIndexEntry.questionCount = questions.length;

  const modelIndex = readJson(modelIndexPath);
  if (!modelIndex.modelTests?.[SLUG]) throw new Error("Missing runtime-index entry for the replacement set.");
  modelIndex.modelTests[SLUG].questionCount = questions.length;

  writeJson(publicPath, publicQuestions);
  writeJson(answerPath, answers);
  writeJson(megaPath, mega);
  writeJson(questionIndexPath, questionIndex);
  writeJson(modelIndexPath, modelIndex);
  console.log(`Imported ${SLUG}: ${questions.length} questions.`);
}

main();
