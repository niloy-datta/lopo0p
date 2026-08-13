/**
 * Translate English-heavy MCQ stems/options in HSC Chemistry 1st Paper to Bangla.
 * Updates public questions, backend answers, and mega JSON.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SUBJECT = "chemistry-1st-paper";
const LEVEL = "hsc";
const QUESTIONS_DIR = path.join(ROOT, "public", "questions", SUBJECT);
const ANSWERS_DIR = path.join(ROOT, "backend", "data", "answers", SUBJECT);
const MEGA_PATH = path.join(ROOT, "public", "quiz-data", LEVEL, `${SUBJECT}.json`);
const MAP_PATH = path.join(__dirname, "data", "chemistry-1st-paper-en-bn-map.json");

const LETTERS = ["A", "B", "C", "D"];

const MAP = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const TEXT_MAP = MAP.text ?? {};
const OPTION_MAP = MAP.options ?? {};

/** Chemical tokens / formulas that should not count as English prose. */
const CHEM_TOKENS = new Set([
  "STP", "pH", "mol", "g", "L", "mL", "M", "Kw", "IUPAC", "PTFE", "PVC", "CFC", "N2O",
  "HgSO4", "CO", "CO2", "SO2", "SO3", "HCl", "HNO3", "H2SO4", "NH3", "CH4", "O2", "N2",
  "NaCl", "NaOH", "AgNO3", "CaCO3", "Ba", "Fe", "Zn", "Cu", "Al", "Mg", "Ca", "K", "Na",
  "Cl2", "C2H6", "C2H4", "C2H2", "hv", "w/v", "cc", "atm", "kPa", "kJ", "eV", "nm",
]);

function isEnglishWord(token) {
  const w = String(token).replace(/[.,;:!?()]/g, "");
  if (!w || !/[A-Za-z]/.test(w)) return false;
  if (CHEM_TOKENS.has(w)) return false;
  if (/^[A-Z][a-z]?(\d+)?([A-Z][a-z]?\d*)*$/.test(w)) return false;
  if (/^\d+[A-Za-z]+$/.test(w)) return false;
  return /[A-Za-z]{2,}/.test(w);
}

/**
 * True when question stem is predominantly English prose (not already Bangla MCQ).
 */
function isEnglishHeavy(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return false;

  const bengali = (raw.match(/[\u0980-\u09FF]/g) || []).length;
  const latin = (raw.match(/[A-Za-z]/g) || []).length;

  if (bengali === 0 && latin > 0) return true;

  const words = raw.split(/\s+/).filter(Boolean);
  let englishWords = 0;
  for (const word of words) {
    if (isEnglishWord(word)) englishWords++;
  }

  if (englishWords >= 2) return true;
  if (latin > bengali * 2 && latin > 10) return true;
  return false;
}

function translateText(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return raw;
  if (TEXT_MAP[raw]) return TEXT_MAP[raw];
  return raw;
}

function translateOption(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return raw;
  if (OPTION_MAP[raw]) return OPTION_MAP[raw];
  return raw;
}

function applyToQuestion(q) {
  let changed = false;
  const needsTranslation = isEnglishHeavy(q.text) || TEXT_MAP[String(q.text ?? "").trim()];

  if (needsTranslation) {
    const newText = translateText(q.text);
    if (newText !== q.text) {
      q.text = newText;
      changed = true;
    }
  }

  const newOptions = q.options.map((opt) => {
    const next = translateOption(opt);
    if (next !== opt) changed = true;
    return next;
  });
  q.options = newOptions;
  return changed;
}

function applyToAnswers(answers, questions) {
  let changed = false;
  for (const q of questions) {
    const entry = answers[q.id];
    if (!entry) continue;
    if (entry.correctOption) {
      const next = translateOption(entry.correctOption);
      if (next !== entry.correctOption) {
        entry.correctOption = next;
        changed = true;
      }
    }
    if (entry.answer) {
      const next = translateOption(entry.answer);
      if (next !== entry.answer) {
        entry.answer = next;
        changed = true;
      }
    }
  }
  return changed;
}

function toMegaQuestions(publicQuestions, answers) {
  return publicQuestions.map((q, i) => {
    const ans = answers[q.id] ?? {};
    const opts = q.options;
    let answerIndex = opts.findIndex((o) => o === ans.correctOption || o === ans.answer);
    if (answerIndex < 0 && typeof ans.answerIndex === "number") {
      answerIndex = ans.answerIndex;
    }
    if (answerIndex < 0) answerIndex = 0;

    return {
      id: q.id,
      questionText: q.text,
      optionA: opts[0] ?? "",
      optionB: opts[1] ?? "",
      optionC: opts[2] ?? "",
      optionD: opts[3] ?? "",
      correctOption: LETTERS[answerIndex] ?? "A",
      explanation: String(ans.explanation ?? "").trim(),
      chapter: String(q.chapter ?? "").match(/chapter-(\d+)/)?.[1]?.padStart(2, "0") ?? "",
      topic: String(ans.topic ?? "").trim(),
      difficulty: "Board Standard",
      questionNo: i + 1,
      image: q.image ?? null,
      optionImages: q.optionImages ?? null,
    };
  });
}

function countRemainingEnglish() {
  let count = 0;
  const samples = [];
  for (const file of fs.readdirSync(QUESTIONS_DIR).sort()) {
    if (!file.endsWith(".json") || file === "index.json") continue;
    const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), "utf8"));
    for (const q of questions) {
      if (isEnglishHeavy(q.text)) {
        count++;
        if (samples.length < 5) samples.push(q.text);
      }
    }
  }
  return { count, samples };
}

function main() {
  const mega = JSON.parse(fs.readFileSync(MEGA_PATH, "utf8"));
  const touchedSets = new Set();
  let fileChanges = 0;
  let questionChanges = 0;

  for (const file of fs.readdirSync(QUESTIONS_DIR).sort()) {
    if (!file.endsWith(".json") || file === "index.json") continue;
    const setId = file.replace(/\.json$/, "");
    const qPath = path.join(QUESTIONS_DIR, file);
    const aPath = path.join(ANSWERS_DIR, `${setId}.answers.json`);

    const questions = JSON.parse(fs.readFileSync(qPath, "utf8"));
    let qChanged = false;
    for (const q of questions) {
      if (applyToQuestion(q)) {
        qChanged = true;
        questionChanges++;
      }
    }

    let aChanged = false;
    let answers = {};
    if (fs.existsSync(aPath)) {
      answers = JSON.parse(fs.readFileSync(aPath, "utf8"));
      aChanged = applyToAnswers(answers, questions);
    }

    if (qChanged) {
      fs.writeFileSync(qPath, `${JSON.stringify(questions, null, 2)}\n`);
      fileChanges++;
    }
    if (aChanged) {
      fs.writeFileSync(aPath, `${JSON.stringify(answers, null, 2)}\n`);
    }
    if ((qChanged || aChanged) && mega.modelTests?.[setId]) {
      mega.modelTests[setId] = toMegaQuestions(questions, answers);
      touchedSets.add(setId);
    }
  }

  if (touchedSets.size > 0) {
    fs.writeFileSync(MEGA_PATH, `${JSON.stringify(mega, null, 2)}\n`);
  }

  const remaining = countRemainingEnglish();

  console.log(`Translated ${questionChanges} question fields across ${fileChanges} files`);
  console.log(`Synced mega for ${touchedSets.size} sets`);
  console.log(`English-heavy stems remaining: ${remaining.count}`);
  if (remaining.samples.length) {
    console.log("Sample remaining:", remaining.samples[0]);
  }

  const set01 = "hsc-chemistry-1st-paper-chapter-02-high-priority-set-01";
  if (fs.existsSync(path.join(QUESTIONS_DIR, `${set01}.json`))) {
    const q = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, `${set01}.json`), "utf8"));
    console.log("\n--- Chapter-02 set-01 Q17-25 ---");
    for (let i = 16; i < 25; i++) {
      const item = q[i];
      console.log(`Q${i + 1}: ${item.text}`);
      console.log(`  Options: ${item.options.join(" | ")}`);
    }
  }
}

main();
