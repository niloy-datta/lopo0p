#!/usr/bin/env node

/**
 * Import the verified SSC Biology replacement bank (Chapter 03, 07-14;
 * Model Tests 02-10) into the canonical public question and answer stores.
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(
      ROOT,
      "data/quiz-text/ssc-biology/ssc-biology-replacement-mt02-mt10-with-answers.txt",
    );
const TARGET_CHAPTERS = new Set(["03", "07", "08", "09", "10", "11", "12", "13", "14"]);
const TARGET_TESTS = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]);

const questionDir = path.join(ROOT, "public/questions/biology");
const answerDir = path.join(ROOT, "backend/data/answers/biology");
const megaPath = path.join(ROOT, "public/quiz-data/ssc/biology.json");
const indexPath = path.join(ROOT, "public/quiz-data/ssc/biology.model-tests.index.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseSource(text) {
  const lines = text.split(/\r?\n/);
  const sets = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("### SSC Biology")) {
      if (current) sets.push(current);
      const match = line.match(/Chapter\s+(\d+).*Model Test\s+(\d+)/);
      if (!match) throw new Error(`Invalid set header: ${line}`);
      current = { chapter: match[1].padStart(2, "0"), test: Number(match[2]), questions: [] };
      continue;
    }
    if (!current || !line.trim()) continue;
    const questionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (questionMatch) {
      current.questions.push({ number: Number(questionMatch[1]), text: questionMatch[2].trim() });
      continue;
    }
    const optionMatch = line.match(/^A\.\s+(.+?)\s+B\.\s+(.+?)\s+C\.\s+(.+?)\s+D\.\s+(.+)$/);
    if (optionMatch) {
      const question = current.questions.at(-1);
      if (!question || question.options) throw new Error(`Invalid options near Chapter ${current.chapter} MT${current.test}`);
      question.options = optionMatch.slice(1).map((option) => option.trim());
      continue;
    }
    const answerMatch = line.match(/^Answer:\s*([ABCD])\.\s*(.+)$/i);
    if (answerMatch) {
      const question = current.questions.at(-1);
      if (!question || !question.options) throw new Error(`Answer before options near Chapter ${current.chapter} MT${current.test}`);
      question.answerLetter = answerMatch[1].toUpperCase();
      question.answerText = answerMatch[2].trim();
    }
  }
  if (current) sets.push(current);
  return sets;
}

function validate(sets) {
  const expected = new Set();
  for (const set of sets) {
    if (!TARGET_CHAPTERS.has(set.chapter) || !TARGET_TESTS.has(set.test)) {
      throw new Error(`Unexpected target set: Chapter ${set.chapter} MT${set.test}`);
    }
    const key = `${set.chapter}:${set.test}`;
    if (expected.has(key)) throw new Error(`Duplicate set: ${key}`);
    expected.add(key);
    if (set.questions.length !== 25) throw new Error(`${key} has ${set.questions.length} questions, expected 25`);
    for (const question of set.questions) {
      if (!question.options || question.options.length !== 4 || !question.answerLetter || !question.answerText) {
        throw new Error(`Incomplete question ${key} Q${question.number}`);
      }
      if (question.options[question.answerLetter.charCodeAt(0) - 65] !== question.answerText) {
        throw new Error(`Answer mismatch ${key} Q${question.number}: ${question.answerLetter}. ${question.answerText}`);
      }
    }
  }
  if (sets.length !== TARGET_CHAPTERS.size * TARGET_TESTS.size) {
    throw new Error(`Found ${sets.length} sets, expected ${TARGET_CHAPTERS.size * TARGET_TESTS.size}`);
  }
}

function main() {
  const sets = parseSource(fs.readFileSync(SOURCE, "utf8"));
  validate(sets);
  const index = readJson(indexPath);
  const mega = readJson(megaPath);
  const chapterNames = new Map();
  for (const [id, meta] of Object.entries(index.modelTests ?? {})) {
    const match = id.match(/^ssc-biology-chapter-(\d{2})-model-test-01$/);
    if (match) chapterNames.set(match[1], meta.chaptersCovered?.[0]?.chapterName ?? "");
  }

  for (const set of sets) {
    const setId = `ssc-biology-chapter-${set.chapter}-model-test-${String(set.test).padStart(2, "0")}`;
    const chapterName = chapterNames.get(set.chapter) ?? `অধ্যায় ${set.chapter}`;
    const questionRecords = set.questions.map((question) => ({
      id: `${setId}-q${String(question.number).padStart(2, "0")}`,
      subject: "biology",
      chapter: setId,
      text: question.text,
      options: question.options,
      image: null,
      optionImages: null,
      timeLimit: 45,
    }));
    const answerRecords = Object.fromEntries(
      set.questions.map((question) => [
        `${setId}-q${String(question.number).padStart(2, "0")}`,
        {
          correctOption: question.answerText,
          explanation: `সঠিক উত্তর: ${question.answerText}`,
        },
      ]),
    );
    const megaRecords = set.questions.map((question) => ({
      id: `${setId}-q${String(question.number).padStart(2, "0")}`,
      questionText: question.text,
      optionA: question.options[0],
      optionB: question.options[1],
      optionC: question.options[2],
      optionD: question.options[3],
      correctOption: question.answerLetter,
      explanation: `সঠিক উত্তর: ${question.answerText}`,
      chapter: set.chapter,
      topic: chapterName,
      difficulty: "Board Standard",
      questionNo: question.number,
      image: null,
      optionImages: null,
    }));

    writeJson(path.join(questionDir, `${setId}.json`), questionRecords);
    writeJson(path.join(answerDir, `${setId}.answers.json`), answerRecords);
    mega.modelTests[setId] = megaRecords;
    mega.modelTestsMeta[setId] = {
      questionCount: 25,
      scope: "chapter",
      displayTitle: `অধ্যায় ${set.chapter} · ${chapterName} · টেস্ট ${String(set.test).padStart(2, "0")}`,
      durationMinutes: 25,
      importance: "high",
      tags: ["chapter-wise", "model-test", "replacement"],
      chaptersCovered: [{ chapter: set.chapter, chapterName }],
      name: `অধ্যায় ${set.chapter} · ${chapterName} · টেস্ট ${String(set.test).padStart(2, "0")}`,
    };
    index.modelTests[setId] = mega.modelTestsMeta[setId];
  }

  writeJson(megaPath, mega);
  writeJson(indexPath, index);
  console.log(JSON.stringify({ source: SOURCE, sets: sets.length, questions: sets.length * 25 }, null, 2));
}

main();
