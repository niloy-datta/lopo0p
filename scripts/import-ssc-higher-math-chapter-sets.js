#!/usr/bin/env node
/**
 * Import SSC higher-math chapter model test sets from payload JSON.
 * Usage: node scripts/import-ssc-higher-math-chapter-sets.js <payload.json> [chapterNo] [chapterName]
 */
const fs = require("fs");
const path = require("path");
const {
  loadMega,
  loadModelIndex,
  syncSetToMega,
  upsertQuestionsIndex,
  saveMegaAndIndex,
} = require("./lib/ssc-five-set-sync");

const ROOT = path.resolve(__dirname, "..");
const SUBJECT = "higher-math";
const STRIP = new Set(["answer", "answerIndex", "explanation"]);

function fixEscapes(raw) {
  return raw.replace(/(?<!\\)\\(?!["\\/bfnrtu])([a-zA-Z])/g, "\\\\$1");
}

function importPayload(payloadPath, chapterNo, chapterName) {
  const payload = JSON.parse(fixEscapes(fs.readFileSync(payloadPath, "utf8")));
  const sets = payload.sets ?? payload;
  if (!Array.isArray(sets)) {
    throw new Error("Payload must contain a sets array");
  }

  const { mega } = loadMega(ROOT, SUBJECT);
  const { modelIndex } = loadModelIndex(ROOT, SUBJECT);
  const ch = String(chapterNo).padStart(2, "0");

  for (const set of sets) {
    const data = set.questions ?? set;
    if (!Array.isArray(data) || !data.length) continue;

    const setId = data[0].chapter;
    const setNo = Number(setId.match(/model-test-(\d+)/)?.[1] ?? 0);
    const displayTitle =
      set.setName ??
      `অধ্যায় ${chapterNo} · ${chapterName} · মডেল টেস্ট ${String(setNo).padStart(2, "0")}`;

    const questions = data.map((q) => {
      const out = {};
      for (const [k, v] of Object.entries(q)) {
        if (!STRIP.has(k)) out[k] = v;
      }
      return out;
    });

    const answers = {};
    const answerIndexMap = {};
    for (const q of data) {
      const idx = q.answerIndex ?? q.options.indexOf(q.answer);
      answers[q.id] = {
        correctOption: q.options[idx >= 0 ? idx : 0],
        explanation: q.explanation ?? "",
      };
      answerIndexMap[q.id] = {
        answerIndex: idx >= 0 ? idx : 0,
        explanation: q.explanation ?? "",
        topic: chapterName,
      };
    }

    const qPath = path.join(ROOT, "public/questions/higher-math", `${setId}.json`);
    const aPath = path.join(ROOT, "backend/data/answers/higher-math", `${setId}.answers.json`);
    fs.writeFileSync(qPath, `${JSON.stringify(questions, null, 2)}\n`);
    fs.writeFileSync(aPath, `${JSON.stringify(answers, null, 2)}\n`);

    syncSetToMega(mega, modelIndex, {
      setId,
      displayTitle,
      chapterNo: ch,
      chapterName,
      publicQuestions: questions,
      answers: answerIndexMap,
    });
    upsertQuestionsIndex(ROOT, SUBJECT, setId, displayTitle, chapterNo, chapterName);

    console.log(`Imported ${setId}: ${questions.length} questions`);
  }

  saveMegaAndIndex(ROOT, SUBJECT, mega, modelIndex);
  console.log("Mega + index synced");
}

const payloadPath = process.argv[2];
const chapterNo = Number(process.argv[3] ?? 6);
const chapterName = process.argv[4] ?? "অসমতা";

if (!payloadPath) {
  console.error(
    "Usage: node scripts/import-ssc-higher-math-chapter-sets.js <payload.json> [chapterNo] [chapterName]",
  );
  process.exit(1);
}

importPayload(path.resolve(payloadPath), chapterNo, chapterName);
