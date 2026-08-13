const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions");
const QUIZ_DATA_DIR = path.join(ROOT, "public", "quiz-data");

// Regex pattern to clean English translations like:
// "শক্তির মাত্রা কোনটি? (English: Which one is the dimension of energy?)"
// or "বেগ-সময় গ্রাফের ঢাল কী নির্দেশ করে? (English: What does the slope of a velocity-time graph represent?)"
const PATTERN = /\s*\(\s*English\s*:\s*[\s\S]*?\)/gi;

function cleanString(val) {
  if (typeof val !== "string") return val;
  if (PATTERN.test(val)) {
    return val.replace(PATTERN, "").trim();
  }
  return val;
}

function cleanObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  }
  if (typeof obj === "object") {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = cleanObject(obj[key]);
    }
    return newObj;
  }
  if (typeof obj === "string") {
    return cleanString(obj);
  }
  return obj;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const resPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(resPath, callback);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      callback(resPath);
    }
  }
}

function main() {
  console.log("Starting English translations removal...");
  let filesProcessed = 0;
  let filesModified = 0;
  let totalReplacements = 0;

  const processFile = (filePath) => {
    filesProcessed++;
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      console.error(`Failed to read ${filePath}:`, e.message);
      return;
    }

    // Check if the file content contains "(English:" before doing deep clean to save time/writes
    if (!content.toLowerCase().includes("(english:")) {
      return;
    }

    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      console.error(`Failed to parse JSON in ${filePath}:`, e.message);
      return;
    }

    // Count replacements in this file by counting matches
    const matches = content.match(PATTERN);
    const count = matches ? matches.length : 0;
    if (count === 0) return;

    const cleaned = cleanObject(json);
    const output = JSON.stringify(cleaned, null, 2) + "\n";

    try {
      fs.writeFileSync(filePath, output, "utf8");
      filesModified++;
      totalReplacements += count;
      console.log(`✓ Cleaned ${path.relative(ROOT, filePath)} (${count} translations removed)`);
    } catch (e) {
      console.error(`Failed to write ${filePath}:`, e.message);
    }
  };

  console.log(`Scanning ${QUESTIONS_DIR}...`);
  walkDir(QUESTIONS_DIR, processFile);

  console.log(`Scanning ${QUIZ_DATA_DIR}...`);
  walkDir(QUIZ_DATA_DIR, processFile);

  console.log(`\nRemoval complete.`);
  console.log(`Total files scanned: ${filesProcessed}`);
  console.log(`Total files modified: ${filesModified}`);
  console.log(`Total translations removed: ${totalReplacements}`);
}

main();
