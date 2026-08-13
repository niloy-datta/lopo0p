const fs = require("fs");
const path = require("path");

const QUESTIONS_DIR = "/home/niloy-chandra-datta/sschsc-quiz.com/public/questions/higher-math";
const boardFiles = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith(".json") && !f.startsWith("ssc-") && !f.startsWith("index"));

console.log("Found board files:", boardFiles.length);

const chapterQuestions = {
  "01": [],
  "02": [],
  "03": [],
  "11": []
};

// Map questions based on text keywords
for (const file of boardFiles) {
  const filePath = path.join(QUESTIONS_DIR, file);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const q of questions) {
    const text = q.text || "";
    // Chapter 1: সেট, ফাংশন, ডোমেন, রেঞ্জ, injective, bijective, subset, domain, range
    if (/সেট|ফাংশন|ডোমেন|রেঞ্জ|এক-এক|সার্বিক|পূরক|subset|domain|range/i.test(text)) {
      chapterQuestions["01"].push({ file, q });
    }
    // Chapter 2: উৎপাদক, বহুপদী, মুখ্য সহগ, চক্র-ক্রমিক, প্রতিসম, মাত্রা, আংশিক ভগ্নাংশ
    else if (/উৎপাদক|বহুপদী|সহগ|চক্র-ক্রমিক|প্রতিসম|মাত্রা|আংশিক ভগ্নাংশ/i.test(text)) {
      chapterQuestions["02"].push({ file, q });
    }
    // Chapter 3: সমীকরণ, নিশ্চয়ক, মূলদ্বয়, সমাধান সেট, বাস্তব সমাধান, নিশ্চয়ক
    else if (/সমীকরণ|নিশ্চয়ক|মূলদ্বয়|মূলদ্বয়|নিশ্চায়ক|সমাধান সেট/i.test(text)) {
      chapterQuestions["03"].push({ file, q });
    }
    // Chapter 11: বিস্তৃতি, দ্বিপদী, প্যাসকেল, বর্জিত পদ
    else if (/বিস্তৃতি|দ্বিপদী|প্যাসকেল|বর্জিত পদ/i.test(text)) {
      chapterQuestions["11"].push({ file, q });
    }
  }
}

console.log("\nChapter-wise board questions count:");
for (const [ch, list] of Object.entries(chapterQuestions)) {
  console.log(`Chapter ${ch}: ${list.length} questions`);
}

// Print some examples for Chapter 3 and Chapter 11
console.log("\n--- Chapter 3 (Equations) Board Examples (First 5):");
chapterQuestions["03"].slice(0, 5).forEach((item, i) => {
  console.log(`${i+1}. [${item.file}] ${item.q.text}`);
  console.log(`   Options: ${JSON.stringify(item.q.options)}`);
});

console.log("\n--- Chapter 11 (Binomial) Board Examples (First 5):");
chapterQuestions["11"].slice(0, 5).forEach((item, i) => {
  console.log(`${i+1}. [${item.file}] ${item.q.text}`);
  console.log(`   Options: ${JSON.stringify(item.q.options)}`);
});
