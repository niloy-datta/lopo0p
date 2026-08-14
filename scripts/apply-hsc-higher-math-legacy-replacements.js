/**
 * Replaces the legacy under-filled HSC Higher Math paper sets with complete,
 * vetted 25-question model tests.  All four stores used by the application
 * are updated together: public question bodies, answer keys, quiz data, and
 * the subject index.
 *
 * Usage: node scripts/apply-hsc-higher-math-legacy-replacements.js
 */
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ANSWERS = path.join(ROOT, "backend", "data", "answers");
const OPTION_LETTERS = ["A", "B", "C", "D"];
const BN_TO_LETTER = { "ক": "A", "খ": "B", "গ": "C", "ঘ": "D" };

const REPLACEMENTS = [
  ...[6, 7, 8, 9, 10].map((sourceSet, offset) => ({
    subject: "higher-math-1st-paper",
    targetSet: offset + 11,
    source: { type: "existing", slug: `hsc-higher-math-1st-paper-tier-a-hot-model-test-${String(sourceSet).padStart(2, "0")}` },
  })),
  ...[1, 2, 3, 4, 5].map((sourceSet, offset) => ({
    subject: "higher-math-2nd-paper",
    targetSet: offset + 6,
    source: { type: "existing", slug: `hsc-higher-math-2nd-paper-tier-a-hot-model-test-${String(sourceSet).padStart(2, "0")}` },
  })),
  ...[1, 2, 3].map((sourceSet, offset) => ({
    subject: "higher-math-2nd-paper",
    targetSet: offset + 11,
    source: { type: "import", setNumber: sourceSet },
  })),
  { subject: "higher-math-2nd-paper", targetSet: 14, source: { type: "head" } },
  { subject: "higher-math-2nd-paper", targetSet: 15, source: { type: "head" } },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function targetSlug(subject, setNumber) {
  return `hsc-${subject}-paper-set-${String(setNumber).padStart(2, "0")}`;
}

function targetTitle(setNumber) {
  return `মডেল টেস্ট · সেট ${String(setNumber).padStart(2, "0")}`;
}

function rekeyExisting(source, subject, slug) {
  const sourcePath = path.join(PUBLIC, "questions", subject, `${source.slug}.json`);
  const answerPath = path.join(ANSWERS, subject, `${source.slug}.answers.json`);
  const questions = readJson(sourcePath);
  const answers = readJson(answerPath);
  const mega = readJson(path.join(PUBLIC, "quiz-data", "hsc", `${subject}.json`));
  const megaQuestions = mega.modelTests?.[source.slug];

  if (!Array.isArray(questions) || questions.length !== 25 || !Array.isArray(megaQuestions) || megaQuestions.length !== 25) {
    throw new Error(`Source ${source.slug} must contain exactly 25 questions in both stores.`);
  }

  const rekeyedQuestions = questions.map((question, index) => ({
    ...question,
    id: `${slug}-q${String(index + 1).padStart(2, "0")}`,
    subject,
    chapter: slug,
  }));
  const rekeyedMega = megaQuestions.map((question, index) => ({
    ...question,
    id: `${slug}-q${String(index + 1).padStart(2, "0")}`,
    chapter: String(index + 1).padStart(2, "0"),
    questionNo: index + 1,
  }));
  const rekeyedAnswers = {};
  for (let index = 0; index < questions.length; index += 1) {
    const oldId = questions[index].id;
    const newId = rekeyedQuestions[index].id;
    if (!answers[oldId]?.correctOption) throw new Error(`Missing answer for ${oldId}`);
    rekeyedAnswers[newId] = answers[oldId];
  }
  return { questions: rekeyedQuestions, megaQuestions: rekeyedMega, answers: rekeyedAnswers };
}

function importSet(source, subject, slug) {
  const sourcePath = path.join(ROOT, "data", "imports", "hsc-higher-math-2nd-hyper-mega-hot-sets-01-03.json");
  const imported = readJson(sourcePath);
  const set = imported.model_tests?.find((item) => Number(item.set_number) === source.setNumber);
  if (!set || !Array.isArray(set.questions) || set.questions.length !== 25) {
    throw new Error(`Imported set ${source.setNumber} is not a complete 25-question set.`);
  }

  const answers = {};
  const questions = set.questions.map((item, index) => {
    const id = `${slug}-q${String(index + 1).padStart(2, "0")}`;
    const options = ["ক", "খ", "গ", "ঘ"].map((key) => String(item.options?.[key] ?? "").trim());
    const correctLetter = BN_TO_LETTER[String(item.correct_option ?? "").trim()];
    if (options.some((option) => !option) || !correctLetter) {
      throw new Error(`Imported question ${index + 1} is missing options or a valid answer.`);
    }
    const correctOption = options[OPTION_LETTERS.indexOf(correctLetter)];
    answers[id] = { correctOption, explanation: String(item.explanation ?? "").trim() };
    const stem = String(item.stem ?? "").trim();
    const text = [stem, String(item.question ?? "").trim()].filter(Boolean).join("\n\n");
    return { id, subject, chapter: slug, text, options, image: null, optionImages: null, timeLimit: 45 };
  });
  const megaQuestions = questions.map((question, index) => {
    const answer = answers[question.id];
    const correctOption = OPTION_LETTERS[question.options.indexOf(answer.correctOption)];
    return {
      id: question.id,
      questionText: question.text,
      optionA: question.options[0],
      optionB: question.options[1],
      optionC: question.options[2],
      optionD: question.options[3],
      correctOption,
      explanation: answer.explanation,
      chapter: String(index + 1).padStart(2, "0"),
      topic: String(set.questions[index].topic ?? "").trim(),
      difficulty: String(set.questions[index].probability ?? "Board Standard").trim(),
      questionNo: index + 1,
      image: null,
      optionImages: null,
    };
  });
  return { questions, megaQuestions, answers };
}

function headJson(repoPath) {
  return JSON.parse(childProcess.execFileSync("git", ["show", `HEAD:${repoPath.replaceAll("\\", "/")}`], { cwd: ROOT, encoding: "utf8" }));
}

function loadHeadSet(subject, slug) {
  const questions = headJson(path.join("public", "questions", subject, `${slug}.json`));
  const answers = headJson(path.join("backend", "data", "answers", subject, `${slug}.answers.json`));
  const mega = headJson(path.join("public", "quiz-data", "hsc", `${subject}.json`));
  const megaQuestions = mega.modelTests?.[slug];
  if (!Array.isArray(questions) || questions.length !== 25 || !Array.isArray(megaQuestions) || megaQuestions.length !== 25 || Object.keys(answers).length !== 25) {
    throw new Error(`HEAD version of ${slug} is not a complete 25-question set.`);
  }
  return { questions, megaQuestions, answers };
}

function updateIndexes(subject, slug, setNumber, count) {
  const questionIndexPath = path.join(PUBLIC, "questions", subject, "index.json");
  const questionIndex = readJson(questionIndexPath);
  const title = targetTitle(setNumber);
  const indexEntry = {
    id: slug,
    title,
    questionCount: count,
    scope: "paper",
    importance: "high",
    tags: ["board-standard", "paper-wise", "replacement"],
  };
  const existingEntry = questionIndex.modelTests?.find((entry) => entry.id === slug);
  if (existingEntry) Object.assign(existingEntry, indexEntry);
  else questionIndex.modelTests.push(indexEntry);
  writeJson(questionIndexPath, questionIndex);

  const modelIndexPath = path.join(PUBLIC, "quiz-data", "hsc", `${subject}.model-tests.index.json`);
  const modelIndex = readJson(modelIndexPath);
  modelIndex.modelTests ??= {};
  modelIndex.modelTests[slug] = {
    questionCount: count,
    scope: "paper",
    displayTitle: title,
    durationMinutes: 25,
    importance: "high",
    tags: ["board-standard", "paper-wise", "replacement"],
  };
  writeJson(modelIndexPath, modelIndex);
}

function applyReplacement(replacement) {
  const { subject, targetSet, source } = replacement;
  const slug = targetSlug(subject, targetSet);
  const data = source.type === "existing"
    ? rekeyExisting(source, subject, slug)
    : source.type === "import"
      ? importSet(source, subject, slug)
      : loadHeadSet(subject, slug);
  if (data.questions.length !== 25 || data.megaQuestions.length !== 25 || Object.keys(data.answers).length !== 25) {
    throw new Error(`${slug} failed the 25-question replacement invariant.`);
  }

  const questionPath = path.join(PUBLIC, "questions", subject, `${slug}.json`);
  const answerPath = path.join(ANSWERS, subject, `${slug}.answers.json`);
  const megaPath = path.join(PUBLIC, "quiz-data", "hsc", `${subject}.json`);
  const mega = readJson(megaPath);
  mega.modelTests ??= {};
  mega.modelTestsMeta ??= {};
  mega.modelTests[slug] = data.megaQuestions;
  mega.modelTestsMeta[slug] = {
    ...(mega.modelTestsMeta[slug] ?? {}),
    displayTitle: targetTitle(targetSet),
    name: `Board Standard Paper Set ${String(targetSet).padStart(2, "0")}`,
    tags: ["board-standard", "paper-wise", "replacement"],
    durationMinutes: 25,
    questionCount: data.megaQuestions.length,
    confidenceLabel: "Board Standard",
    scope: "paper",
    needsRegeneration: false,
  };
  writeJson(questionPath, data.questions);
  writeJson(answerPath, data.answers);
  writeJson(megaPath, mega);
  updateIndexes(subject, slug, targetSet, data.questions.length);
  console.log(`Updated ${slug}: ${data.questions.length} questions`);
}

for (const replacement of REPLACEMENTS) applyReplacement(replacement);
