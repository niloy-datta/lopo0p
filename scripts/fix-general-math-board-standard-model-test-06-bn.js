/**
 * Regenerate ssc-general-math-board-standard-model-test-06 in proper Bangla.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SET_ID = "ssc-general-math-board-standard-model-test-06";
const SUBJECT = "general-math";

const QUESTIONS = [
  {
    text: "a+b=√10 এবং a−b=√6 হলে 2ab এর মান কত?",
    options: ["2", "8", "32", "128"],
    answerIndex: 0,
    explanation:
      "(a+b)² − (a−b)² = 4ab = 10 − 6 = 4, সুতরাং ab = 1 এবং 2ab = 2।",
    topic: "বীজগণিত",
  },
  {
    text: "½(a²+b²) এর মান কত, যদি a+b=√10 এবং a−b=√6?",
    options: ["16", "8", "4", "2"],
    answerIndex: 2,
    explanation:
      "(a+b)² + (a−b)² = 2(a²+b²) = 16, সুতরাং ½(a²+b²) = 4।",
    topic: "বীজগণিত",
  },
  {
    text: "৩^(x−2) = 2187 হলে x এর মান কত?",
    options: ["−9", "−5", "5", "9"],
    answerIndex: 3,
    explanation: "2187 = 3⁷, তাই x−2 = 7 এবং x = 9।",
    topic: "সূচক",
  },
  {
    text: "x = {−1, 0, 1, 2} সেটটির প্রকৃত উপসেটের সংখ্যা কত?",
    options: ["16", "15", "8", "4"],
    answerIndex: 1,
    explanation: "৪টি উপাদানের প্রকৃত উপসেট = 2⁴ − 1 = 15।",
    topic: "সেট",
  },
  {
    text: "A = {x: x ∈ N, x ≤ 6}, B = {x: x একটি 3 এর গুণিতক এবং x ≤ 6} হলে A − B কোনটি?",
    options: ["{1,2,4,5}", "{3,6}", "{1,3}", "{1,2,3,6}"],
    answerIndex: 0,
    explanation: "A = {1,2,3,4,5,6}, B = {3,6}, তাই A−B = {1,2,4,5}।",
    topic: "সেট",
  },
  {
    text: "f(x) = (2x+1)/(2x−1) হলে f(−½) এর মান কত?",
    options: ["2", "1", "−1", "0"],
    answerIndex: 3,
    explanation: "f(−½) = (0)/(−2) = 0।",
    topic: "ফাংশন",
  },
  {
    text: "একটি ত্রিভুজের তিনটি কোণের পরিমাণ যথাক্রমে 30°, 60° ও 90° হলে ত্রিভুজটি কোন ধরনের?",
    options: ["স্থূলকোণী", "সূক্ষ্মকোণী", "সমকোণী", "সমবাহু"],
    answerIndex: 2,
    explanation: "৯০° কোণ থাকায় এটি সমকোণী ত্রিভুজ।",
    topic: "জ্যামিতি",
  },
  {
    text: "বৃত্তের অর্ধবৃত্তের উপচাপে অন্তর্লিখিত কোণ কোনটি?",
    options: ["স্থূলকোণ", "সূক্ষ্মকোণ", "সমকোণ", "প্রবৃদ্ধ কোণ"],
    answerIndex: 2,
    explanation: "অর্ধবৃত্তে অন্তর্লিখিত কোণ সর্বদা 90°, অর্থাৎ সমকোণ।",
    topic: "বৃত্ত",
  },
  {
    text: "সমবাহু ত্রিভুজের বহিঃস্থ কোণের বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টি কত ডিগ্রি?",
    options: ["60", "90", "120", "180"],
    answerIndex: 2,
    explanation: "বহিঃস্থ কোণ 120° = 60° + 60°।",
    topic: "জ্যামিতি",
  },
  {
    text: "চিত্রে O বৃত্তের কেন্দ্র। ∠AOB = কত?",
    options: ["180°", "145°", "135°", "90°"],
    answerIndex: 1,
    image: "/images/quiz/geo-circle-center-o.svg",
    explanation: "চিত্র অনুযায়ী ∠AOB = 180° − 35° = 145°।",
    topic: "বৃত্ত",
  },
  {
    text: "বৃত্তের কেন্দ্রস্থ কোণ 144° এবং ব্যাসার্ধ 10 সে.মি. হলে বৃত্তচাপের দৈর্ঘ্য কত সে.মি.?",
    options: ["16π", "12π", "8π", "4π"],
    answerIndex: 2,
    explanation: "s = (θ/360°) × 2πr = (144/360) × 20π = 8π সে.মি.",
    topic: "বৃত্ত",
  },
  {
    text: "sin(60° − θ) = ½ হলে tan θ এর মান কত?",
    options: ["1/√3", "1/2", "√3/2", "√3"],
    answerIndex: 0,
    explanation: "60° − θ = 30°, তাই θ = 30° এবং tan 30° = 1/√3।",
    topic: "ত্রিকোণমিতি",
  },
  {
    text: "সমকোণী ত্রিভুজে ∠B-এর বিপরীত বাহু ৪ একক ও অতিভুজ ৫ একক হলে sin B = কত?",
    options: ["3/5", "4/5", "5/4", "5/3"],
    answerIndex: 1,
    explanation: "sin B = বিপরীত/অতিভুজ = 4/5।",
    topic: "ত্রিকোণমিতি",
  },
  {
    text: "একটি ত্রিভুজের দুই বাহু 10 সে.মি. ও 12 সে.মি. এবং অন্তর্ভুক্ত কোণ 30° হলে ক্ষেত্রফল কত?",
    options: ["30 বর্গ সে.মি.", "30√3 বর্গ সে.মি.", "60 বর্গ সে.মি.", "60√3 বর্গ সে.মি."],
    answerIndex: 0,
    explanation: "ক্ষেত্রফল = ½ × 10 × 12 × sin 30° = 30 বর্গ সে.মি.",
    topic: "ত্রিকোণমিতি",
  },
  {
    text:
      "নিচের শ্রেণীকৃত উপাত্তের প্রচুরক (mode) কত?\nশ্রেণিব্যাপ্তি: 11–20, 21–30, 31–40, 41–50\nগণসংখ্যা: 5, 12, 8, 5",
    options: ["20", "28", "25.5", "35.5"],
    answerIndex: 1,
    explanation:
      "প্রচুরক শ্রেণি 21–30। সূত্র প্রয়োগে প্রচুরক ≈ 27.5, নিকটতম অপশন 28।",
    topic: "পরিসংখ্যান",
  },
  {
    text: "একটি সমবাহু ত্রিভুজের প্রতি বাহুর দৈর্ঘ্য a হলে ক্ষেত্রফল কত?",
    options: ["a²", "(√3/4)a²", "(√3/2)a²", "(1/2)a²"],
    answerIndex: 1,
    explanation: "সমবাহু ত্রিভুজের ক্ষেত্রফল = (√3/4)a²।",
    topic: "পরিমিতি",
  },
  {
    text: "সামান্তরিকের ক্ষেত্রফলের সূত্র কোনটি?",
    options: ["দৈর্ঘ্য × প্রস্থ", "ভূমি × উচ্চতা", "কর্ণদ্বয়ের গুণফল", "½ × ভূমি × উচ্চতা"],
    answerIndex: 1,
    explanation: "সামান্তরিকের ক্ষেত্রফল = ভূমি × উচ্চতা।",
    topic: "পরিমিতি",
  },
  {
    text:
      "নিচের শ্রেণীকৃত উপাত্তের মধ্যমা (median) কত?\nশ্রেণিব্যাপ্তি: 31–40, 41–50, 51–60, 61–70, 71–80\nগণসংখ্যা: 4, 8, 20, 12, 6",
    options: ["57", "66", "67.67", "69.75"],
    answerIndex: 0,
    explanation: "N = 50, মধ্যম শ্রেণি 51–60, median ≈ 57।",
    topic: "পরিসংখ্যান",
  },
  {
    text: "3 + 6 + x + 24 + …… ধারাটির x এর মান কত?",
    options: ["9", "12", "15", "18"],
    answerIndex: 1,
    explanation: "গুণোত্তর ধারায় অনুপাত 2, তাই x = 12।",
    topic: "ধারা",
  },
  {
    text: "0.00045 সংখ্যার সাধারণ লগারিদমের characteristic কত?",
    options: ["2", "3", "6", "4"],
    answerIndex: 3,
    explanation: "0.00045 = 4.5 × 10⁻⁴, characteristic = 4 (বার 4)।",
    topic: "লগারিদম",
  },
  {
    text:
      "10 ভিত্তিক log এর ক্ষেত্রে—\ni. log 0 = 1\nii. log 1 = 0\niii. log 100 = 2\n\nনিচের কোনটি সঠিক?",
    options: ["i ও ii", "i ও iii", "ii ও iii", "i, ii ও iii"],
    answerIndex: 2,
    explanation: "log 1 = 0 ও log 100 = 2 সঠিক; log 0 অসংজ্ঞায়িত।",
    topic: "লগারিদম",
  },
  {
    text: "(√5)^(x+3) = (√5⁴)^(2x−1) হলে x এর মান কত?",
    options: ["1/7", "1", "5/3", "4"],
    answerIndex: 1,
    explanation: "সূচকের নিয়মে (x+3)/2 = 4x−2, সমাধানে x = 1।",
    topic: "সূচক",
  },
  {
    text: "একটি বর্গক্ষেত্রের পরিসীমা 36 মি. হলে একটি কর্নের দৈর্ঘ্য কত?",
    options: ["6√2 মি.", "6√3 মি.", "9√2 মি.", "9√3 মি."],
    answerIndex: 2,
    explanation: "বাহু = 9 মি., কর্ন = 9√2 মি.",
    topic: "জ্যামিতি",
  },
  {
    text: "একটি ঘনকের কর্নের দৈর্ঘ্য r√3, যেখানে r = 5 সে.মি. হলে মোট তলের ক্ষেত্রফল কত?",
    options: ["20 বর্গ সে.মি.", "25 বর্গ সে.মি.", "125 বর্গ সে.মি.", "150 বর্গ সে.মি."],
    answerIndex: 3,
    explanation: "প্রতি বাহু a = 5 সে.মি., মোট তল = 6a² = 150 বর্গ সে.মি.",
    topic: "পরিমিতি",
  },
  {
    text:
      "উচ্চতা 8 সে.মি. ও ব্যাসার্ধ 5 সে.মি. বিশিষ্ট বেলনের ক্ষেত্রে—\ni. বক্রতলের ক্ষেত্রফল 251.33 বর্গ সে.মি.\nii. আয়তন 628.32 ঘন সে.মি.\niii. ভূমির ক্ষেত্রফল 201.06 বর্গ সে.মি.\n\nনিচের কোনটি সঠিক?",
    options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
    answerIndex: 0,
    explanation:
      "2πrh ≈ 251.33 ও πr²h ≈ 628.32 সঠিক; ভূমির ক্ষেত্রফল πr² ≈ 78.54, 201.06 নয়।",
    topic: "পরিমিতি",
  },
];

const LETTERS = ["A", "B", "C", "D"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

const publicQuestions = QUESTIONS.map((q, i) => ({
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
  const src = QUESTIONS[i];
  answerMap[q.id] = {
    answer: q.options[src.answerIndex],
    answerIndex: src.answerIndex,
    explanation: src.explanation,
    topic: src.topic,
    difficulty: 1200,
  };
});

const questionsPath = path.join(
  ROOT,
  "public",
  "questions",
  SUBJECT,
  `${SET_ID}.json`,
);
const answersPath = path.join(
  ROOT,
  "backend",
  "data",
  "answers",
  SUBJECT,
  `${SET_ID}.answers.json`,
);

fs.writeFileSync(questionsPath, `${JSON.stringify(publicQuestions, null, 2)}\n`, "utf8");
fs.writeFileSync(answersPath, `${JSON.stringify(answerMap, null, 2)}\n`, "utf8");

const megaPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.json`);
const mega = JSON.parse(fs.readFileSync(megaPath, "utf8"));

const CHAPTER_TOPICS = [
  "সেট-ফাংশন / বীজগণিত / সমীকরণ",
  "সেট-ফাংশন / বীজগণিত / সমীকরণ",
  "সেট-ফাংশন / বীজগণিত / সমীকরণ",
  "সেট-ফাংশন / বীজগণিত / সমীকরণ",
  "সেট-ফাংশন / বীজগণিত / সমীকরণ",
  "সেট-ফাংশন / বীজগণিত / সমীকরণ",
  "জ্যামিতি / বৃত্ত / ক্ষেত্রফল উপপাদ্য",
  "জ্যামিতি / বৃত্ত / ক্ষেত্রফল উপপাদ্য",
  "জ্যামিতি / বৃত্ত / ক্ষেত্রফল উপপাদ্য",
  "জ্যামিতি / বৃত্ত / ক্ষেত্রফল উপপাদ্য",
  "জ্যামিতি / বৃত্ত / ক্ষেত্রফল উপপাদ্য",
  "ত্রিকোণমিতি / দূরত্ব ও উচ্চতা",
  "ত্রিকোণমিতি / দূরত্ব ও উচ্চতা",
  "ত্রিকোণমিতি / দূরত্ব ও উচ্চতা",
  "পরিসংখ্যান ও সম্ভাবনা",
  "পরিমিতি",
  "পরিমিতি",
  "পরিসংখ্যান ও সম্ভাবনা",
  "অনুপাত-সমানুপাত / সসীম ধারা / সূচক-লগারিদম",
  "অনুপাত-সমানুপাত / সসীম ধারা / সূচক-লগারিদম",
  "অনুপাত-সমানুপাত / সসীম ধারা / সূচক-লগারিদম",
  "অনুপাত-সমানুপাত / সসীম ধারা / সূচক-লগারিদম",
  "পরিমিতি",
  "পরিমিতি",
  "পরিমিতি",
];

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
    chapter: CHAPTER_TOPICS[i],
    topic: ans.topic,
    difficulty: "Medium",
    questionNo: i + 1,
    image: q.image,
    optionImages: null,
  };
});

if (mega.modelTestsMeta[SET_ID]) {
  mega.modelTestsMeta[SET_ID].needsRegeneration = false;
}

fs.writeFileSync(megaPath, `${JSON.stringify(mega, null, 2)}\n`, "utf8");

console.log(`Updated ${SET_ID}: ${publicQuestions.length} questions in Bangla`);
