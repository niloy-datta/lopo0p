/**
 * Replace junk placeholder set ssc-general-math-chapter-12-model-test-06
 * with 30 original SSC-level সেট (Set) MCQs in Bangla.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SET_ID = "ssc-general-math-chapter-12-model-test-06";
const SUBJECT = "general-math";
const CHAPTER_NO = "12";
const CHAPTER_NAME = "সেট";
const LETTERS = ["A", "B", "C", "D"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

const BANK = [
  {
    text: "x = {−1, 0, 1, 2} সেটটির প্রকৃত উপসেটের সংখ্যা কত?",
    options: ["16", "15", "8", "4"],
    answerIndex: 1,
    explanation: "৪টি উপাদানের প্রকৃত উপসেট = 2⁴ − 1 = 15।",
  },
  {
    text: "A = {2, 3, 4} ও B = {3, 4, 5} হলে A ∩ B কোনটি?",
    options: ["{2, 3, 4, 5}", "{3, 4}", "{2, 5}", "{3}"],
    answerIndex: 1,
    explanation: "A ∩ B = {3, 4}।",
  },
  {
    text: "A = {1, 2, 3, 4, 5, 6}, B = {2, 4, 6} হলে A − B কোনটি?",
    options: ["{2, 4, 6}", "{1, 3, 5}", "{1, 2, 3, 4, 5, 6}", "φ"],
    answerIndex: 1,
    explanation: "A − B = {1, 3, 5}।",
  },
  {
    text: "n(A) = 12, n(B) = 8, n(A ∩ B) = 3 হলে n(A ∪ B) কত?",
    options: ["23", "17", "20", "15"],
    answerIndex: 1,
    explanation: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = 12 + 8 − 3 = 17।",
  },
  {
    text: "{x ∈ N : 6 < x < 10} সেটের পদসংখ্যা কত?",
    options: ["4", "3", "2", "5"],
    answerIndex: 1,
    explanation: "সেট = {7, 8, 9}, পদসংখ্যা 3।",
  },
  {
    text: "φ (শূন্য সেট) এর উপসেট কয়টি?",
    options: ["0", "1", "2", "অসীম"],
    answerIndex: 1,
    explanation: "শূন্য সেটের একমাত্র উপসেট φ।",
  },
  {
    text: "{a, b} সেটের উপসেট কয়টি?",
    options: ["2", "3", "4", "8"],
    answerIndex: 2,
    explanation: "২টি উপাদানের উপসেট = 2² = 4।",
  },
  {
    text: "A = {x: x ∈ N, x ≤ 6}, B = {x: x একটি 3 এর গুণিতক এবং x ≤ 6} হলে A − B কোনটি?",
    options: ["{1, 2, 4, 5}", "{3, 6}", "{1, 3}", "{1, 2, 3, 6}"],
    answerIndex: 0,
    explanation: "A = {1,2,3,4,5,6}, B = {3,6}, A−B = {1,2,4,5}।",
  },
  {
    text: "Q = {x, y, z} এবং R = {q, r} হলে Q × R এর উপাদান সংখ্যা কত?",
    options: ["5", "6", "8", "9"],
    answerIndex: 1,
    explanation: "n(Q × R) = 3 × 2 = 6।",
  },
  {
    text: "U = {1, 2, 3, 4, 5}, A = {2, 4} হলে A′ (A-এর পূরক) কোনটি?",
    options: ["{1, 3, 5}", "{2, 4}", "{1, 2, 3, 4, 5}", "φ"],
    answerIndex: 0,
    explanation: "A′ = U − A = {1, 3, 5}।",
  },
  {
    text: "x² = 9x সমীকরণের সমাধান সেট কোনটি?",
    options: ["{9}", "{0, 9}", "{−9, 9}", "{0}"],
    answerIndex: 1,
    explanation: "x(x − 9) = 0, x = 0 বা 9।",
  },
  {
    text: "x² − x = 6 সমীকরণের সমাধান সেট কোনটি?",
    options: ["{2, 3}", "{−2, 3}", "{−3, 2}", "{6}"],
    answerIndex: 1,
    explanation: "x² − x − 6 = 0, (x − 3)(x + 2) = 0, x = 3, −2।",
  },
  {
    text: "D = {y : y ∈ N এবং 5 ≤ y ≤ 10} সেটটিকে তালিকা পদ্ধতিতে প্রকাশ করলে কোনটি?",
    options: ["{5, 6, 7, 8, 9, 10}", "{5, 6, 7, 8, 9}", "{6, 7, 8, 9, 10}", "{5, 10}"],
    answerIndex: 0,
    explanation: "স্বাভাবিক সংখ্যায় 5 থেকে 10 পর্যন্ত সব পদ।",
  },
  {
    text: "A ⊆ B হলে নিচের কোনটি সর্বদা সত্য?",
    options: ["A ∪ B = A", "A ∪ B = B", "A ∩ B = φ", "A − B = B"],
    answerIndex: 1,
    explanation: "A ⊆ B হলে A ∪ B = B।",
  },
  {
    text: "P({1, 2}) (ক্ষমতা সেট) এর উপাদান সংখ্যা কত?",
    options: ["2", "3", "4", "8"],
    answerIndex: 2,
    explanation: "P({1,2}) = {φ, {1}, {2}, {1,2}}, মোট 4টি।",
  },
  {
    text: "n(P(A)) = 16 হলে n(A) কত?",
    options: ["2", "3", "4", "8"],
    answerIndex: 2,
    explanation: "2^n = 16, n = 4।",
  },
  {
    text: "A ∪ B = B ∪ A — এটি সেটের কোন বৈশিষ্ট্য?",
    options: ["অ্যাসোসিয়েটিভ", "কমিউটেটিভ", "ডিসট্রিবিউটিভ", "আইডempotent"],
    answerIndex: 1,
    explanation: "যোগ ও ছেদ উভয়ের ক্ষেত্রে কমিউটেটিভ বৈশিষ্ট্য থাকে।",
  },
  {
    text: "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) — এটি কোন সূত্র?",
    options: ["ডি মরগান", "ডিসট্রিবিউটিভ", "অ্যাসোসিয়েটিভ", "ডিমরগান"],
    answerIndex: 1,
    explanation: "ছেদের উপর যোগের ডিসট্রিবিউটিভ সূত্র।",
  },
  {
    text: "{1, 2, 3} ∪ {3, 4, 5} = ?",
    options: ["{3}", "{1, 2, 3, 4, 5}", "{1, 2, 4, 5}", "{1, 2, 3, 5}"],
    answerIndex: 1,
    explanation: "সাধারণ সব পদ একত্র = {1,2,3,4,5}।",
  },
  {
    text: "{1, 2, 3, 4} ∩ {3, 4, 5, 6} = ?",
    options: ["{1, 2}", "{3, 4}", "{5, 6}", "φ"],
    answerIndex: 1,
    explanation: "উভয় সেটের সাধারণ পদ {3, 4}।",
  },
  {
    text: "A ∩ B = φ হলে A ও B কী ধরনের সেট?",
    options: ["সমান", "অসদৃশ (disjoint)", "পূরক", "অন্তর্ভুক্ত"],
    answerIndex: 1,
    explanation: "কোনো সাধারণ পদ না থাকলে সেটদ্বয় অসদৃশ।",
  },
  {
    text: "n(U) = 50, n(A) = 30, n(B) = 25, n(A ∩ B) = 10 হলে n(A ∪ B) কত?",
    options: ["55", "45", "40", "65"],
    answerIndex: 1,
    explanation: "n(A ∪ B) = 30 + 25 − 10 = 45।",
  },
  {
    text: "2x − 1 = 5 সমীকরণের সমাধান সেট কোনটি?",
    options: ["{2}", "{3}", "{−3}", "{1, 5}"],
    answerIndex: 1,
    explanation: "2x = 6, x = 3।",
  },
  {
    text: "{x ∈ Z : −2 ≤ x ≤ 2} সেটের পদসংখ্যা কত?",
    options: ["4", "5", "6", "3"],
    answerIndex: 1,
    explanation: "সেট = {−2, −1, 0, 1, 2}, মোট 5টি।",
  },
  {
    text: "U = {1, 2, 3} হলে U′ (সার্বজনীন সেটের পূরক) কোনটি?",
    options: ["{1, 2, 3}", "φ", "U", "{0}"],
    answerIndex: 1,
    explanation: "সার্বজনীন সেটের পূরক শূন্য সেট।",
  },
  {
    text: "A = {1, 3, 5}, B = {2, 3, 4} হলে (A − B) ∪ (B − A) কোনটি?",
    options: ["{3}", "{1, 2, 4, 5}", "{1, 2, 3, 4, 5}", "φ"],
    answerIndex: 1,
    explanation: "A−B = {1,5}, B−A = {2,4}, যোগফল = {1,2,4,5}।",
  },
  {
    text: "{1, 2} × {a, b} কার্টেশিয়ান গুণফলের উপাদান সংখ্যা কত?",
    options: ["2", "3", "4", "6"],
    answerIndex: 2,
    explanation: "(1,a), (1,b), (2,a), (2,b) — মোট 4টি।",
  },
  {
    text: "Q = {x, y, z} এবং R = {q, r} হলে Q \\ R এর প্রকৃত উপসেট কয়টি?",
    options: ["6", "7", "8", "15"],
    answerIndex: 1,
    explanation: "Q \\ R = Q = {x,y,z}, প্রকৃত উপসেট = 2³ − 1 = 7।",
  },
  {
    text: "A = {2, 3, 5, 7} সেটটির সেট-গঠন পদ্ধতিতে প্রকাশ কোনটি?",
    options: [
      "{x : x জোড় সংখ্যা}",
      "{x : x মৌলিক সংখ্যা এবং x < 8}",
      "{x : x ∈ N, x > 10}",
      "{x : x 3 এর গুণিতক}",
    ],
    answerIndex: 1,
    explanation: "২, ৩, ৫, ৭ — ৮-এর নিচের মৌলিক সংখ্যা।",
  },
  {
    text: "নিচের কোনটি অসীম সেট?",
    options: ["{1, 2, 3}", "{x ∈ N : x < 100}", "{x ∈ N}", "φ"],
    answerIndex: 2,
    explanation: "সকল স্বাভাবিক সংখ্যার সেট অসীম।",
  },
];

if (BANK.length !== 30) {
  throw new Error(`Expected 30 questions, got ${BANK.length}`);
}

const publicQuestions = BANK.map((q, i) => ({
  id: `${SET_ID}-q${pad2(i + 1)}`,
  subject: SUBJECT,
  chapter: SET_ID,
  text: q.text,
  options: q.options,
  image: q.image ?? null,
  optionImages: null,
  timeLimit: 45,
}));

const answerMap = {};
publicQuestions.forEach((q, i) => {
  const src = BANK[i];
  answerMap[q.id] = {
    answer: q.options[src.answerIndex],
    answerIndex: src.answerIndex,
    explanation: src.explanation,
    topic: CHAPTER_NAME,
    difficulty: 1200,
  };
});

const questionsPath = path.join(ROOT, "public", "questions", SUBJECT, `${SET_ID}.json`);
const answersPath = path.join(ROOT, "backend", "data", "answers", SUBJECT, `${SET_ID}.answers.json`);

fs.mkdirSync(path.dirname(questionsPath), { recursive: true });
fs.mkdirSync(path.dirname(answersPath), { recursive: true });
fs.writeFileSync(questionsPath, `${JSON.stringify(publicQuestions, null, 2)}\n`, "utf8");
fs.writeFileSync(answersPath, `${JSON.stringify(answerMap, null, 2)}\n`, "utf8");

const megaPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.json`);
const mega = JSON.parse(fs.readFileSync(megaPath, "utf8"));

mega.modelTests[SET_ID] = publicQuestions.map((q, i) => {
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
    chapter: CHAPTER_NO,
    topic: CHAPTER_NAME,
    difficulty: "Medium",
    questionNo: i + 1,
    image: q.image,
    optionImages: null,
  };
});

mega.modelTestsMeta[SET_ID] = {
  ...(mega.modelTestsMeta[SET_ID] ?? {}),
  displayTitle: "Chapter 12 Model Test 06",
  name: "Chapter 12 Model Test 06",
  scope: "chapter",
  tags: ["chapter-wise", "model-test"],
  chaptersCovered: [{ chapter: CHAPTER_NO, chapterName: CHAPTER_NAME }],
  durationMinutes: 30,
  questionCount: 30,
  importance: "high",
  needsRegeneration: false,
};

fs.writeFileSync(megaPath, `${JSON.stringify(mega, null, 2)}\n`, "utf8");

const modelIndexPath = path.join(
  ROOT,
  "public",
  "quiz-data",
  "ssc",
  `${SUBJECT}.model-tests.index.json`,
);
if (fs.existsSync(modelIndexPath)) {
  const modelIndex = JSON.parse(fs.readFileSync(modelIndexPath, "utf8"));
  if (modelIndex.modelTests?.[SET_ID]) {
    modelIndex.modelTests[SET_ID].questionCount = 30;
    modelIndex.modelTests[SET_ID].needsRegeneration = false;
  }
  fs.writeFileSync(modelIndexPath, `${JSON.stringify(modelIndex, null, 2)}\n`, "utf8");
}

console.log(`✓ Replaced ${SET_ID} with ${publicQuestions.length} real সেট MCQs`);
