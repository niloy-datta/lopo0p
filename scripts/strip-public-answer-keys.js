#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const publicRoot = path.join(root, "public", "questions");
const privateRoot = path.join(root, "backend", "data", "answers");
const privateKeys = new Set([
  "answer",
  "answerIndex",
  "answerLabel",
  "correctAnswer",
  "correctAnswerIndex",
  "correctOption",
  "correctOptionIndex",
  "explanation",
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const changed = [];
const unsafe = [];
for (const publicPath of walk(publicRoot).filter((file) => file.endsWith(".json"))) {
  const questions = JSON.parse(fs.readFileSync(publicPath, "utf8"));
  if (!Array.isArray(questions) || !questions.some((q) => Object.keys(q).some((key) => privateKeys.has(key)))) continue;

  const relative = path.relative(publicRoot, publicPath).replace(/\.json$/i, ".answers.json");
  const privatePath = path.join(privateRoot, relative);
  if (!fs.existsSync(privatePath)) {
    unsafe.push({ publicPath, reason: "private answer file missing" });
    continue;
  }
  const answers = JSON.parse(fs.readFileSync(privatePath, "utf8"));
  const ids = new Set(Object.keys(answers));
  if (!questions.every((question) => ids.has(question.id))) {
    unsafe.push({ publicPath, reason: "private answer coverage incomplete" });
    continue;
  }

  const sanitized = questions.map((question) =>
    Object.fromEntries(Object.entries(question).filter(([key]) => !privateKeys.has(key))),
  );
  changed.push(publicPath);
  if (apply) fs.writeFileSync(publicPath, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", files: changed.length, unsafe }, null, 2));
if (apply) console.log(`Sanitized ${changed.length} public question files; private answer files were preserved.`);
if (unsafe.length) process.exitCode = 2;
