#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const repeatedSplit = /(?:-split-\d+){2,}/i;
const trailingSplit = /-split-\d+(?=(?:\.answers)?\.json$)/i;

function filesUnder(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(full) : [full];
  });
}

function questionSignature(question) {
  return JSON.stringify({
    text: question.text || question.question || question.questionText || "",
    options: question.options || [],
  });
}

function safeDuplicate(candidate) {
  let parent = candidate;
  while ((path.basename(parent).match(/-split-\d+/gi) || []).length > 1) {
    parent = parent.replace(trailingSplit, "");
  }
  if (!fs.existsSync(parent)) return { safe: false, reason: "parent missing" };
  try {
    const childData = JSON.parse(fs.readFileSync(candidate, "utf8"));
    const parentData = JSON.parse(fs.readFileSync(parent, "utf8"));
    if (!Array.isArray(childData) || !Array.isArray(parentData)) {
      return { safe: false, reason: "not question arrays" };
    }
    const child = childData.map(questionSignature);
    const source = new Set(parentData.map(questionSignature));
    return child.every((item) => source.has(item))
      ? { safe: true, parent }
      : { safe: false, reason: "content differs" };
  } catch (error) {
    return { safe: false, reason: error.message };
  }
}

const questionRoot = path.join(root, "public", "questions");
const answerRoot = path.join(root, "backend", "data", "answers");
const imageRoot = path.join(root, "public", "images", "quiz", "premium");
const questionCandidates = filesUnder(questionRoot).filter(
  (file) => file.endsWith(".json") && repeatedSplit.test(path.basename(file)),
);

const removableQuestions = [];
const skipped = [];
for (const candidate of questionCandidates) {
  const verdict = safeDuplicate(candidate);
  if (verdict.safe) removableQuestions.push(candidate);
  else skipped.push({ file: candidate, reason: verdict.reason });
}

const removableAnswers = removableQuestions
  .map((file) => {
    const relative = path.relative(questionRoot, file).replace(/\.json$/i, ".answers.json");
    return path.join(answerRoot, relative);
  })
  .filter((file) => fs.existsSync(file));

const removableQuestionSet = new Set(removableQuestions.map((file) => path.resolve(file)));
const referencedImages = new Set();
for (const file of filesUnder(questionRoot).filter((item) => item.endsWith(".json"))) {
  if (removableQuestionSet.has(path.resolve(file))) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/\/images\/quiz\/premium\/[^"']+/g)) {
    referencedImages.add(path.basename(match[0]));
  }
}
const removableImages = filesUnder(imageRoot).filter(
  (file) => repeatedSplit.test(path.basename(file)) && !referencedImages.has(path.basename(file)),
);

const targets = [...removableQuestions, ...removableAnswers, ...removableImages];
console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  duplicateQuestions: removableQuestions.length,
  matchingPrivateAnswers: removableAnswers.length,
  unreferencedImages: removableImages.length,
  skipped,
}, null, 2));

if (apply) {
  for (const file of targets) fs.unlinkSync(file);
  console.log(`Removed ${targets.length} verified nested-split artifacts.`);
} else {
  console.log("No files changed. Re-run with --apply after reviewing the report.");
}

if (skipped.length) process.exitCode = 2;
