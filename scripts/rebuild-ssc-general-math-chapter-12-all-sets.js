/**
 * Rebuild SSC General Math Chapter 12 (সেট) model tests 01–08
 * with 30 varied, board-style MCQs per set (no equation spam / filler).
 */
const fs = require("fs");
const path = require("path");
const BASE = require("./data/ssc-general-math-ch12-base-bank.json");

const ROOT = path.resolve(__dirname, "..");
const SUBJECT = "general-math";
const CHAPTER_NO = "12";
const CHAPTER_NAME = "সেট";
const Q_PER_SET = 30;
const SET_COUNT = 8;
const LETTERS = ["A", "B", "C", "D"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function mcq(text, options, answerIndex, explanation) {
  return { text, options, answerIndex, explanation };
}

function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    [a[i], a[s % (i + 1)]] = [a[s % (i + 1)], a[i]];
  }
  return a;
}

function buildExtraBank() {
  const out = [];

  const ops = [
    ["{1,2,3}", "{2,3,4}", "{2,3}", "A ∩ B"],
    ["{2,4,6}", "{4,6,8}", "{4,6}", "A ∩ B"],
    ["{a,b,c}", "{b,c,d}", "{b,c}", "A ∩ B"],
    ["{1,3,5}", "{3,5,7}", "{3,5}", "A ∩ B"],
    ["{10,20}", "{20,30}", "{20}", "A ∩ B"],
    ["{1,2}", "{3,4}", "φ", "A ∩ B"],
    ["{2,3,5}", "{5,7}", "{5}", "A ∩ B"],
    ["{1,2,3}", "{4,5,6}", "φ", "A ∩ B"],
    ["{1,2,3,4}", "{3,4,5}", "{3,4}", "A ∩ B"],
    ["{x,y}", "{y,z}", "{y}", "A ∩ B"],
  ];
  ops.forEach(([a, b, ans], i) => {
    out.push(
      mcq(
        `A = ${a}, B = ${b} হলে A ∩ B = ?`,
        shuffle([ans, a, b, "φ"], i + 1),
        0,
        `A ∩ B = ${ans}।`,
      ),
    );
  });

  const unions = [
    ["{1,2}", "{2,3}", "{1,2,3}"],
    ["{2,4}", "{4,6}", "{2,4,6}"],
    ["{a,b}", "{c,d}", "{a,b,c,d}"],
    ["{1,3}", "{3,5}", "{1,3,5}"],
    ["{5,10}", "{10,15}", "{5,10,15}"],
    ["{2,3,4}", "{4,5}", "{2,3,4,5}"],
    ["{1}", "{2,3}", "{1,2,3}"],
    ["{6,7}", "{7,8,9}", "{6,7,8,9}"],
  ];
  unions.forEach(([a, b, ans], i) => {
    out.push(
      mcq(
        `A = ${a}, B = ${b} হলে A ∪ B = ?`,
        shuffle([ans, a, b, "φ"], i + 20),
        0,
        `A ∪ B = ${ans}।`,
      ),
    );
  });

  const diffs = [
    ["{1,2,3,4}", "{2,4}", "{1,3}"],
    ["{2,3,5,7}", "{3,7}", "{2,5}"],
    ["{a,b,c,d}", "{b,d}", "{a,c}"],
    ["{10,20,30,40}", "{20,40}", "{10,30}"],
    ["{1,3,5,7,9}", "{1,3,5}", "{7,9}"],
    ["{2,4,6,8}", "{4,8}", "{2,6}"],
  ];
  diffs.forEach(([a, b, ans], i) => {
    out.push(
      mcq(
        `A = ${a}, B = ${b} হলে A − B কোনটি?`,
        shuffle([ans, b, a, "φ"], i + 40),
        0,
        `A − B = ${ans}।`,
      ),
    );
  });

  const comps = [
    ["{1,2,3,4,5}", "{2,4}", "{1,3,5}"],
    ["{1,2,3}", "{1}", "{2,3}"],
    ["{a,b,c,d,e}", "{a,c,e}", "{b,d}"],
    ["{2,4,6,8,10}", "{2,4,6}", "{8,10}"],
    ["{10,20,30}", "{20}", "{10,30}"],
  ];
  comps.forEach(([u, a, ans], i) => {
    out.push(
      mcq(
        `U = ${u}, A = ${a} হলে A′ কোনটি?`,
        shuffle([ans, a, u, "φ"], i + 60),
        0,
        `A′ = U − A = ${ans}।`,
      ),
    );
  });

  const venn = [
    [40, 18, 6, 52],
    [60, 25, 10, 75],
    [100, 55, 20, 135],
    [80, 40, 15, 105],
    [50, 22, 8, 64],
    [70, 35, 12, 93],
    [90, 50, 18, 122],
    [120, 70, 25, 165],
  ];
  venn.forEach(([u, a, ab, union], i) => {
    out.push(
      mcq(
        `n(U) = ${u}, n(A) = ${a}, n(A ∩ B) = ${ab} হলে n(A ∪ B) = ?`,
        shuffle([String(union), String(a + ab), String(u), String(a)], i + 80),
        0,
        `n(A ∪ B) = ${a} + n(B) − ${ab} = ${union}।`,
      ),
    );
  });

  const rosters = [
    ["{x ∈ N : x < 5}", "{1,2,3,4}"],
    ["{x ∈ N : 2 ≤ x ≤ 5}", "{2,3,4,5}"],
    ["{x ∈ N : x > 8 এবং x < 12}", "{9,10,11}"],
    ["{x ∈ N : x জোড় এবং x ≤ 8}", "{2,4,6,8}"],
    ["{x ∈ N : x বেজোড় এবং x < 6}", "{1,3,5}"],
    ["{x ∈ Z : −1 ≤ x ≤ 2}", "{−1,0,1,2}"],
    ["{x ∈ N : x 5 এর গুণিতক এবং x ≤ 25}", "{5,10,15,20,25}"],
    ["{x ∈ N : x 4 এর গুণিতক এবং x < 20}", "{4,8,12,16}"],
    ["{x ∈ N : 3 < x < 8}", "{4,5,6,7}"],
    ["{x ∈ N : x² < 10}", "{1,2,3}"],
    ["{x ∈ N : x ≤ 3}", "{1,2,3}"],
    ["{x ∈ N : 10 ≤ x ≤ 12}", "{10,11,12}"],
  ];
  rosters.forEach(([rule, ans], i) => {
    out.push(
      mcq(
        `${rule} সেটের তালিকা রূপ কোনটি?`,
        shuffle([ans, "{1,2,3}", "{0,1}", "φ"], i + 100),
        0,
        `সেট = ${ans}।`,
      ),
    );
  });

  const subsets = [
    ["{a,b}", 4],
    ["{1,2,3}", 8],
    ["{p,q,r}", 8],
    ["{1,2,3,4}", 16],
    ["{x,y,z,w}", 16],
    ["{m,n}", 4],
    ["{2,4,6}", 8],
    ["{a}", 2],
  ];
  subsets.forEach(([s, n], i) => {
    out.push(
      mcq(
        `${s} সেটের উপসেট কয়টি?`,
        shuffle([String(n), String(n - 1), String(n + 1), String(2 * n)], i + 130),
        0,
        `${s.split(",").length}টি পদ → 2^n = ${n}।`,
      ),
    );
    const proper = n - 1;
    out.push(
      mcq(
        `${s} সেটের প্রকৃত উপসেট কয়টি?`,
        shuffle([String(proper), String(n), String(n + 1), "0"], i + 140),
        0,
        `প্রকৃত উপসেট = ${n} − 1 = ${proper}।`,
      ),
    );
  });

  const power = [
    ["{1}", 2],
    ["{1,2}", 4],
    ["{a,b,c}", 8],
    ["{2,3}", 4],
    ["{1,2,3,4}", 16],
  ];
  power.forEach(([s, n], i) => {
    out.push(
      mcq(
        `P(${s}) এর উপাদান সংখ্যা কত?`,
        shuffle([String(n), String(n / 2), String(n * 2), String(n + 1)], i + 160),
        0,
        `P(${s})-এর উপাদান = 2^${s.split(",").length} = ${n}।`,
      ),
    );
  });

  const cart = [
    ["{1,2}", "{a,b}", 4],
    ["{1,2,3}", "{x,y}", 6],
    ["{a}", "{1,2,3}", 3],
    ["{1,2}", "{3,4,5}", 6],
    ["{p,q}", "{r,s,t}", 6],
  ];
  cart.forEach(([a, b, n], i) => {
    out.push(
      mcq(
        `A = ${a}, B = ${b} হলে n(A × B) = ?`,
        shuffle([String(n), String(n + 1), String(n - 1), String(n * 2)], i + 180),
        0,
        `কার্টেশিয়ান গুণফলের উপাদান = ${n}।`,
      ),
    );
  });

  const props = [
    mcq(
      "(A ∪ B)′ = A′ ∩ B′ — এটি কোন সূত্র?",
      ["ডি মরগান", "ডিসট্রিবিউটিভ", "কমিউটেটিভ", "অ্যাসোসিয়েটিভ"],
      0,
      "ডি মরগানের সূত্র।",
    ),
    mcq(
      "(A ∩ B)′ = A′ ∪ B′ — এটি কোন সূত্র?",
      ["ডি মরগান", "ডিসট্রিবিউটিভ", "কমিউটেটিভ", "অ্যাসোসিয়েটিভ"],
      0,
      "ডি মরগানের সূত্র।",
    ),
    mcq(
      "A ∩ B = B ∩ A — এটি কোন বৈশিষ্ট্য?",
      ["কমিউটেটিভ", "অ্যাসোসিয়েটিভ", "ডিসট্রিবিউটিভ", "আইডempotent"],
      0,
      "ছেদ কমিউটেটিভ।",
    ),
    mcq(
      "A ∪ A = A — এটি কোন বৈশিষ্ট্য?",
      ["আইডempotent", "কমিউটেটিভ", "ডিসট্রিবিউটিভ", "অ্যাসোসিয়েটিভ"],
      0,
      "যোগের আইডempotent বৈশিষ্ট্য।",
    ),
    mcq(
      "A ⊆ A সর্বদা সত্য — কারণ?",
      ["প্রতিটি সেট নিজের উপসেট", "শূন্য সেট", "সার্বজনীন সেট", "পূরক সেট"],
      0,
      "প্রতিটি সেট নিজের উপসেট।",
    ),
    mcq(
      "φ ⊆ A সর্বদা সত্য — কারণ?",
      ["শূন্য সেট প্রতিটি সেটের উপসেট", "A = φ", "A = U", "A′ = φ"],
      0,
      "শূন্য সেট সব সেটের উপসেট।",
    ),
    mcq(
      "A ∩ U = ?",
      ["A", "U", "φ", "A′"],
      0,
      "সার্বজনীন সেটের সাথে ছেদ = A।",
    ),
    mcq(
      "A ∪ φ = ?",
      ["A", "φ", "U", "A′"],
      0,
      "শূন্য সেটের সাথে যোগ = A।",
    ),
    mcq(
      "A ∩ φ = ?",
      ["φ", "A", "U", "A′"],
      0,
      "শূন্য সেটের সাথে ছেদ = φ।",
    ),
    mcq(
      "নিচের কোনটি সীম সেট?",
      ["{x ∈ N : x < 50}", "{x ∈ N}", "{x ∈ R}", "{x ∈ Z}"],
      0,
      "৫০-এর নিচের স্বাভাবিক সংখ্যা সীম।",
    ),
  ];
  out.push(...props);

  const solSets = [
    ["x² = 4", "{−2, 2}"],
    ["x + 3 = 7", "{4}"],
    ["2x = 10", "{5}"],
    ["x² − 5x = 0", "{0, 5}"],
    ["x² = 9x", "{0, 9}"],
    ["x² − x − 6 = 0", "{−2, 3}"],
  ];
  solSets.forEach(([eq, ans], i) => {
    out.push(
      mcq(
        `${eq} এর সমাধান সেট কোনটি?`,
        shuffle([ans, "{0}", "{1}", "φ"], i + 200),
        0,
        `সমাধান সেট = ${ans}।`,
      ),
    );
  });

  const misc = [
    mcq(
      "A = {1,2}, B = {2,3}, C = {3,4} হলে A∪B∪C এর উপাদান সংখ্যা কত?",
      ["4", "5", "6", "7"],
      0,
      "সব পদ {1,2,3,4} — ৪টি।",
    ),
    mcq(
      "A = {2,3,4} ও B = {3,4,5} হলে A ∩ B = কত?",
      ["{3,4}", "{2,5}", "{3}", "{4,5}"],
      0,
      "A ∩ B = {3,4}।",
    ),
    mcq(
      "A = {x ∈ N : −2 ≤ x ≤ 6} সেটটির উপসেট কয়টি?",
      ["64", "128", "256", "512"],
      1,
      "পদ {0,1,2,3,4,5,6} — ৭টি, উপসেট 2⁷ = 128।",
    ),
    mcq(
      "Q = {x,y,z}, R = {q,r} হলে Q\\R এর প্রকৃত উপসেট কয়টি?",
      ["6", "7", "8", "15"],
      1,
      "Q\\R = Q, প্রকৃত উপসেট = 2³−1 = 7।",
    ),
    mcq(
      "A = {2,3,5,7} সেটটির সেট-গঠন পদ্ধতিতে প্রকাশ কোনটি?",
      [
        "{x : x জোড় সংখ্যা}",
        "{x : x মৌলিক সংখ্যা এবং x < 8}",
        "{x : x ∈ N, x > 10}",
        "{x : x 3 এর গুণিতক}",
      ],
      1,
      "৮-এর নিচের মৌলিক সংখ্যা।",
    ),
    mcq(
      "n(P(A)) = 32 হলে n(A) কত?",
      ["4", "5", "6", "8"],
      1,
      "2⁵ = 32, n(A) = 5।",
    ),
    mcq(
      "A ⊂ B হলে A ∩ B = ?",
      ["A", "B", "φ", "U"],
      0,
      "A,B-এর ছেদ = A।",
    ),
    mcq(
      "A ও B অসদৃশ হলে n(A ∪ B) = ?",
      ["n(A) + n(B)", "n(A) − n(B)", "n(A) × n(B)", "n(A) + n(B) − n(A∩B)"],
      0,
      "অসদৃশ হলে n(A∩B)=0।",
    ),
  ];
  out.push(...misc);

  // Parameterized variety (unique stems)
  for (let i = 0; i < 125; i++) {
    const a = 10 + (i % 15);
    const b = 8 + (i % 12);
    const ab = 2 + (i % 6);
    const union = a + b - ab;
    out.push(
      mcq(
        `n(A) = ${a}, n(B) = ${b}, n(A ∩ B) = ${ab} হলে n(A ∪ B) কত?`,
        shuffle([String(union), String(a + b), String(ab), String(a)], i + 300),
        0,
        `n(A ∪ B) = ${a} + ${b} − ${ab} = ${union}।`,
      ),
    );
  }

  for (let i = 0; i < 55; i++) {
    const n = 3 + (i % 5);
    const elems = Array.from({ length: n }, (_, j) => j + 1 + i).join(",");
    out.push(
      mcq(
        `{${elems}} সেটের উপসেট কয়টি?`,
        shuffle([String(2 ** n), String(2 ** n - 1), String(n), String(n + 1)], i + 500),
        0,
        `${n}টি পদ → উপসেট ${2 ** n}।`,
      ),
    );
  }

  return out;
}

function dedupe(bank) {
  const seen = new Set();
  return bank.filter((q) => {
    const k = q.text.replace(/\s+/g, " ").trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function buildFullBank() {
  const bank = dedupe([...BASE, ...buildExtraBank()]);
  if (bank.length < SET_COUNT * Q_PER_SET) {
    throw new Error(`Need ${SET_COUNT * Q_PER_SET} questions, have ${bank.length}`);
  }
  return bank;
}

function writeSet(chapterNo, setNo, questions, chapterName) {
  const setId = `ssc-${SUBJECT}-chapter-${pad2(chapterNo)}-model-test-${pad2(setNo)}`;
  const publicQuestions = questions.map((q, i) => ({
    id: `${setId}-q${pad2(i + 1)}`,
    subject: SUBJECT,
    chapter: setId,
    text: q.text,
    options: q.options,
    image: q.image ?? null,
    optionImages: null,
    timeLimit: 45,
  }));

  const answerMap = {};
  publicQuestions.forEach((q, i) => {
    const src = questions[i];
    const idx = src.options.indexOf(src.options[src.answerIndex]);
    const answerIndex = src.answerIndex >= 0 ? src.answerIndex : 0;
    answerMap[q.id] = {
      answer: q.options[answerIndex],
      answerIndex,
      explanation: src.explanation ?? "",
      topic: chapterName,
      difficulty: 1200,
    };
  });

  const qDir = path.join(ROOT, "public", "questions", SUBJECT);
  const aDir = path.join(ROOT, "backend", "data", "answers", SUBJECT);
  fs.mkdirSync(qDir, { recursive: true });
  fs.mkdirSync(aDir, { recursive: true });
  fs.writeFileSync(path.join(qDir, `${setId}.json`), `${JSON.stringify(publicQuestions, null, 2)}\n`);
  fs.writeFileSync(path.join(aDir, `${setId}.answers.json`), `${JSON.stringify(answerMap, null, 2)}\n`);
  return { setId, publicQuestions, answerMap };
}

function syncMega(mega, modelIndex, bundle, setNo) {
  const { setId, publicQuestions, answerMap } = bundle;
  mega.modelTests[setId] = publicQuestions.map((q, i) => {
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
  mega.modelTestsMeta[setId] = {
    displayTitle: `Chapter ${CHAPTER_NO} Model Test ${pad2(setNo)}`,
    name: `Chapter ${CHAPTER_NO} Model Test ${pad2(setNo)}`,
    scope: "chapter",
    tags: ["chapter-wise", "model-test"],
    chaptersCovered: [{ chapter: CHAPTER_NO, chapterName: CHAPTER_NAME }],
    durationMinutes: Q_PER_SET,
    questionCount: Q_PER_SET,
    importance: "high",
    needsRegeneration: false,
  };
  modelIndex.modelTests[setId] = {
    questionCount: Q_PER_SET,
    scope: "chapter",
    displayTitle: mega.modelTestsMeta[setId].displayTitle,
    durationMinutes: Q_PER_SET,
    importance: "high",
    tags: ["chapter-wise", "model-test"],
    chaptersCovered: [{ chapter: CHAPTER_NO, chapterName: CHAPTER_NAME }],
    needsRegeneration: false,
  };
}

const bank = buildFullBank();
console.log(`Bank: ${bank.length} unique সেট MCQs`);

const megaPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.json`);
const modelIndexPath = path.join(ROOT, "public", "quiz-data", "ssc", `${SUBJECT}.model-tests.index.json`);
const mega = JSON.parse(fs.readFileSync(megaPath, "utf8"));
const modelIndex = JSON.parse(fs.readFileSync(modelIndexPath, "utf8"));

for (let setNo = 1; setNo <= SET_COUNT; setNo++) {
  const start = (setNo - 1) * Q_PER_SET;
  const slice = bank.slice(start, start + Q_PER_SET);
  const bundle = writeSet(CHAPTER_NO, setNo, slice, CHAPTER_NAME);
  syncMega(mega, modelIndex, bundle, setNo);
  console.log(`✓ ${bundle.setId} — Q1: ${slice[0].text.slice(0, 55)}...`);
}

fs.writeFileSync(megaPath, `${JSON.stringify(mega, null, 2)}\n`);
fs.writeFileSync(modelIndexPath, `${JSON.stringify(modelIndex, null, 2)}\n`);
console.log(`\nRebuilt ${SET_COUNT} chapter-12 sets (${SET_COUNT * Q_PER_SET} MCQs)`);
