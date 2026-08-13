/**
 * Curated board-style SSC Biology MCQs with verified answers.
 * Used when harvested pool is thin for a chapter.
 */
const fs = require("fs");
const path = require("path");
const { mapBiologyChapter } = require("./ssc-biology-chapter-map");
const { normalizeStemForDedup } = require("./ssc-biology-stem-utils");

const ROOT = path.resolve(__dirname, "..", "..");
const BOARD_FILES = [
  {
    q: path.join(
      ROOT,
      "data/backups/svg-fix-2026-06-28/public/questions/biology/ssc-biology-board-standard-model-test-01.json",
    ),
    a: path.join(ROOT, "backend/data/answers/biology/ssc-biology-board-standard-model-test-01.answers.json"),
  },
  {
    q: path.join(
      ROOT,
      "data/backups/svg-fix-2026-06-28/public/questions/biology/ssc-biology-board-standard-model-test-02.json",
    ),
    a: path.join(ROOT, "backend/data/answers/biology/ssc-biology-board-standard-model-test-02.answers.json"),
  },
];

const PREMIUM_BY_CHAPTER = {
  "01": [
    {
      text: "উদ্দীপক: শ্রেণি শিক্ষক বললেন, 'A' জীবের কোষে কোষপ্রাচীর আছে, ক্লোরোপ্লাস্ট আছে এবং চলন নেই। 'B' জীব চলন করতে পারে, অনুভূতি প্রদর্শন করে এবং কোষপ্রাচীর নেই। উদ্দীপক অনুযায়ী 'A' ও 'B' কোন রাজ্যের উদাহরণ?",
      options: ["A = Plantae, B = Animalia", "A = Animalia, B = Plantae", "A = Monera, B = Fungi", "A = Protista, B = Monera"],
      answerIndex: 0,
      explanation: "উদ্ভিদে কোষপ্রাচীর ও ক্লোরোপ্লাস্ট থাকে; প্রাণীতে চলন ও অনুভূতি থাকে।",
      topic: "শ্রেণিবিন্যাস",
    },
    {
      text: "দ্বিপদ নামকরণে Homo sapiens-এ Homo ও sapiens যথাক্রমে কী নির্দেশ করে?",
      options: ["গণ ও প্রজাতি", "প্রজাতি ও গণ", "বর্গ ও গণ", "পরিবার ও বর্গ"],
      answerIndex: 0,
      explanation: "দ্বিপদ নামকরণে প্রথম অংশ গণ, দ্বিতীয় অংশ প্রজাতি নির্দেশ করে।",
      topic: "নামকরণ",
    },
    {
      text: "উদ্দীপক: একটি অণুজীব DNA ও RNA উভয়ই ধারণ করে, কিন্তু কোষীয় গঠন নেই এবং এটি host কোষের ভিতরে সংখ্যাবৃদ্ধি করে। এটি কোন শ্রেণির জীব?",
      options: ["ভাইরাস", "ব্যাকটেরিয়া", "অ্যামিবা", "শৈবাল"],
      answerIndex: 0,
      explanation: "ভাইরাস অজীব ও জীবের মাঝামাঝি বৈশিষ্ট্য বহন করে।",
      topic: "ভাইরাস",
      image: "/images/quiz/bio-bacteriophage.svg",
    },
    {
      text: "জীবের প্রধান বৈশিষ্ট্য হিসেবে নিচের কোনটি সঠিক নয়?",
      options: ["সব জীব বাহ্যিক শক্তি উৎপাদন করে", "জীবে বৃদ্ধি ও বিকাশ ঘটে", "জীব প্রজনন করতে পারে", "জীবে বিপাক চলে"],
      answerIndex: 0,
      explanation: "জীব বাহ্যিক শক্তি উৎপাদন করে না; শক্তি গ্রহণ বা রূপান্তর করে।",
      topic: "জীবের বৈশিষ্ট্য",
    },
    {
      text: "Whittaker-এর পাঁচ রাজ্য শ্রেণিবিন্যাসে Monera, Protista, Fungi, Plantae, Animalia কী নির্দেশ করে?",
      options: ["পাঁচ রাজ্য শ্রেণিবিন্যাস", "পাঁচটি অঙ্গতন্ত্র", "পাঁচটি টিস্যু", "পাঁচটি খাদ্য শ্রেণি"],
      answerIndex: 0,
      explanation: "Whittaker-এর পাঁচ রাজ্য শ্রেণিবিন্যাস।",
      topic: "শ্রেণিবিন্যাস",
    },
  ],
  "03": [
    {
      text: "উদ্দীপক: শিক্ষক বললেন, আমাদের দেহে দুই ধরনের কোষ বিভাজন ঘটে। 'P' বিভাজনের মাধ্যমে জীবদেহের বৃদ্ধি ঘটে এবং ক্ষতস্থান পূরণ হয়, আর 'Q' বিভাজনের মাধ্যমে জননকোষ উৎপন্ন হয়। 'P' বিভাজনটি মূলত কী?",
      options: ["অ্যামাইটোসিস", "মাইটোসিস", "মিয়োসিস", "দ্বি-বিভাজন"],
      answerIndex: 1,
      explanation: "মাইটোসিস দেহকোষে ঘটে এবং বৃদ্ধি ও ক্ষত পূরণে সাহায্য করে।",
      topic: "কোষ বিভাজন",
      image: "/images/quiz/cell-division.svg",
    },
    {
      text: "উদ্দীপক: শিক্ষক বললেন, আমাদের দেহে দুই ধরনের কোষ বিভাজন ঘটে। 'P' বিভাজনের মাধ্যমে জীবদেহের বৃদ্ধি ঘটে এবং ক্ষতস্থান পূরণ হয়, আর 'Q' বিভাজনের মাধ্যমে জননকোষ উৎপন্ন হয়। 'Q' বিভাজনের (মিয়োসিস) ক্ষেত্রে নিচের কোন তথ্যটি সঠিক? i. ক্রোমোজোম সংখ্যা মাতৃকোষের অর্ধেক হয়ে যায় ii. এই বিভাজনে ক্রসিং ওভার ঘটে iii. এটি এককোষী জীবে বংশবৃদ্ধির প্রধান উপায় নিচের কোনটি সঠিক?",
      options: ["i ও ii", "i ও iii", "ii ও iii", "i, ii ও iii"],
      answerIndex: 0,
      explanation: "মিয়োসিসে ক্রোমোজোম অর্ধেক হয় ও ক্রসিং ওভার ঘটে; এককোষী জীবে সাধারণত মিয়োসিস হয় না।",
      topic: "মিয়োসিস",
      image: "/images/quiz/cell-division.svg",
    },
    {
      text: "মাইটোসিস কোষ বিভাজনের পর্যায়গুলোর সঠিক ক্রম কোনটি?",
      options: [
        "প্রোফেজ → মেটাফেজ → প্রো-মেটাফেজ → অ্যানাফেজ → টেলোফেজ",
        "প্রোফেজ → প্রো-মেটাফেজ → অ্যানাফেজ → মেটাফেজ → টেলোফেজ",
        "প্রোফেজ → প্রো-মেটাফেজ → মেটাফেজ → অ্যানাফেজ → টেলোফেজ",
        "মেটাফেজ → প্রোফেজ → প্রো-মেটাফেজ → অ্যানাফেজ → টেলোফেজ",
      ],
      answerIndex: 2,
      explanation: "মাইটোসিসের পাঁচটি ধাপের ধারাবাহিক ক্রম।",
      topic: "মাইটোসিস",
    },
    {
      text: "জীবের জিনগত বৈচিত্র্য বা ভ্যারিয়েশন (Variation) সৃষ্টিতে নিচের কোনটির ভূমিকা সবচেয়ে বেশি?",
      options: ["মাইটোসিস", "ক্রসিং ওভার", "অ্যামাইটোসিস", "সাইটোকাইনেসিস"],
      answerIndex: 1,
      explanation: "মিয়োসিসে ক্রসিং ওভারের ফলে জিনের নতুন সংমিশ্রণ তৈরি হয়।",
      topic: "ক্রসিং ওভার",
    },
    {
      text: "উদ্দীপক: একটি উদ্ভিদের মূল কোষে ক্রোমোজোম সংখ্যা ২৪। মাইটোসিস বিভাজনের পর প্রতিটি কণিকায় ক্রোমোজোম সংখ্যা কত হবে?",
      options: ["১২", "২৪", "৪৮", "৬"],
      answerIndex: 1,
      explanation: "মাইটোসিসে ক্রোমোজোম সংখ্যা অপরিবর্তিত থাকে।",
      topic: "মাইটোসিস",
    },
    {
      text: "মিয়োসিস বিভাজনের ফলে কয়টি হ্যাপ্লয়েড কণিকা উৎপন্ন হয়?",
      options: ["২", "৪", "৮", "১"],
      answerIndex: 1,
      explanation: "একটি ডিপ্লয়েড মাতৃকোষ থেকে মিয়োসিসে চারটি হ্যাপ্লয়েড কণিকা তৈরি হয়।",
      topic: "মিয়োসিস",
    },
    {
      text: "কোষ বিভাজনের কোন ধাপে ক্রোমোজোমগুলো সবচেয়ে বেশি খাটো ও মোটা দেখায়?",
      options: ["মেটাফেজ", "প্রোফেজ", "অ্যানাফেজ", "টেলোফেজ"],
      answerIndex: 1,
      explanation: "প্রোফেজে ক্রোমোজোম সুস্পষ্ট ও কন্ডেন্সড অবস্থায় দেখা যায়।",
      topic: "প্রোফেজ",
    },
    {
      text: "কোষ বিভাজনের কোন ধাপে স্পিন্ডল যন্ত্রের (Spindle Apparatus) সৃষ্টি হয়?",
      options: ["প্রোফেজ", "মেটাফেজ", "অ্যানাফেজ", "ইন্টারফেজ"],
      answerIndex: 0,
      explanation: "প্রোফেজে স্পিন্ডল যন্ত্র গঠিত হয়।",
      topic: "প্রোফেজ",
    },
    {
      text: "কোষ বিভাজনের কোন ধাপে নিউক্লিওলাসের সম্পূর্ণ বিলুপ্তি ঘটে?",
      options: ["প্রোফেজ", "মেটাফেজ", "টেলোফেজ", "অ্যানাফেজ"],
      answerIndex: 0,
      explanation: "প্রোফেজে নিউক্লিওলাস বিলুপ্ত হয়।",
      topic: "প্রোফেজ",
    },
    {
      text: "ব্যাকটেরিয়ার কোষ বিভাজন প্রধানত কোন পদ্ধতিতে ঘটে?",
      options: ["বাইনারি ফিশন", "মাইটোসিস", "মিয়োসিস", "বাডিং"],
      answerIndex: 0,
      explanation: "ব্যাকটেরিয়ায় সাধারণত বাইনারি ফিশন ঘটে।",
      topic: "ব্যাকটেরিয়া",
    },
    {
      text: "মিয়োসিস কোষ বিভাজন সাধারণত কোন কোষে ঘটে?",
      options: ["জনন মাতৃকোষে", "দেহকোষে", "মেরিস্টেমে", "ফ্লোয়েমে"],
      answerIndex: 0,
      explanation: "মিয়োসিস জনন মাতৃকোষে ঘটে।",
      topic: "মিয়োসিস",
    },
    {
      text: "মিয়োসিস ও মাইটোসিসের মধ্যে সঠিক পার্থক্য কোনটি?",
      options: [
        "মিয়োসিসে জননকোষ তৈরি হয়",
        "মাইটোসিসে ক্রোমোজোম অর্ধেক হয়",
        "মিয়োসিসে সবসময় ২টি অভিন্ন কোষ তৈরি হয়",
        "মাইটোসিস শুধু জননাঙ্গে হয়",
      ],
      answerIndex: 0,
      explanation: "মিয়োসিসে গ্যামেট তৈরি হয় এবং ক্রোমোজোম সংখ্যা অর্ধেক হয়।",
      topic: "পার্থক্য",
    },
    {
      text: "ইন্টারফেজে কোষে প্রধানত কী ঘটে?",
      options: ["DNA প্রতিলিপি ও বৃদ্ধি", "ক্রোমোজোম বিভাজন", "সাইটোকাইনেসিস", "ক্রসিং ওভার"],
      answerIndex: 0,
      explanation: "ইন্টারফেজে কোষ বৃদ্ধি পায় এবং DNA প্রতিলিপি হয়।",
      topic: "ইন্টারফেজ",
    },
    {
      text: "প্রো-মেটাফেজে কোন গঠন স্পষ্ট হয়?",
      options: ["স্পিন্ডল যন্ত্র", "ক্লোরোপ্লাস্ট", "রাইবোসোম", "গলজি বডি"],
      answerIndex: 0,
      explanation: "প্রো-মেটাফেজে স্পিন্ডল যন্ত্র সুস্পষ্ট হয়।",
      topic: "প্রো-মেটাফেজ",
    },
    {
      text: "মিয়োসিস-১ ও মিয়োসিস-২-এর মধ্যে প্রধান পার্থক্য কী?",
      options: [
        "মিয়োসিস-১-এ ক্রসিং ওভার ঘটে",
        "মিয়োসিস-২-এ ক্রসিং ওভার ঘটে",
        "মিয়োসিস-১-এ ক্রোমোজোম সংখ্যা অর্ধেক হয় না",
        "মিয়োসিস-২-এ কোষ বিভাজন হয় না",
      ],
      answerIndex: 0,
      explanation: "ক্রসিং ওভার মিয়োসিস-১-এর প্রোফেজ-১-এ ঘটে।",
      topic: "মিয়োসিস",
    },
  ],
  "09": [
    {
      text: "উদ্দীপক: রফিক ফুটবল খেলার সময় হাঁটু মুচড়ে যায়। ডাক্তার বললেন, হাড় নয় বরং হাড়ের মাঝে যে নমনীয় সংযোগস্থল আছে সেটি আহত হয়েছে। আহত অংশটি কী?",
      options: ["টেনডন", "লিগামেন্ট", "তরুণাস্থি", "পেশি"],
      answerIndex: 1,
      explanation: "লিগামেন্ট হাড়কে হাড়ের সাথে যুক্ত করে এবং সন্ধিতে স্থিতিশীলতা দেয়।",
      topic: "সন্ধি",
    },
    {
      text: "পেশি সংকোচনের জন্য প্রধানত কোন দুটি প্রোটিন দায়ী?",
      options: ["অ্যাক্টিন ও মায়োসিন", "কোলাজেন ও কেরাটিন", "হিমোগ্লোবিন ও অ্যালবুমিন", "ইনসুলিন ও গ্লুকাগন"],
      answerIndex: 0,
      explanation: "অ্যাক্টিন-মায়োসিন ফিলামেন্ট পেশি সংকোচন ঘটায়।",
      topic: "পেশি",
    },
    {
      text: "উদ্দীপক: মানবদেহে ২০৬টি অস্থি আছে। এর মধ্যে দীর্ঘতম অস্থি কোনটি?",
      options: ["হিউমেরাস", "ফিমুর", "রেডিয়াস", "টিবিয়া"],
      answerIndex: 1,
      explanation: "উরুর হাড় বা ফিমুর দেহের দীর্ঘতম অস্থি।",
      topic: "কঙ্কাল",
    },
    {
      text: "অস্থি ও পেশির মধ্যে সংযোগ স্থাপন করে কোনটি?",
      options: ["টেনডন", "লিগামেন্ট", "তরুণাস্থি", "পেরিকার্ডিয়াম"],
      answerIndex: 0,
      explanation: "টেনডন পেশিকে অস্থির সাথে যুক্ত করে।",
      topic: "টেনডন",
    },
    {
      text: "উদ্দীপক: একজন শিশুর দাঁত দুর্বল ও বাঁকা হচ্ছে। ডাক্তার বললেন ক্যালসিয়াম ও ভিটামিন ডি-এর অভাব রয়েছে। এটি কোন অঙ্গতন্ত্রের সমস্যার ইঙ্গিত?",
      options: ["পরিপাক", "কঙ্কাল", "রেচন", "শ্বাস"],
      answerIndex: 1,
      explanation: "ক্যালসিয়াম ও ভিটামিন ডি অস্থির গঠনে গুরুত্বপূর্ণ।",
      topic: "কঙ্কাল",
    },
  ],
  "14": [
    {
      text: "উদ্দীপক: একটি জীবপ্রযুক্তি কোম্পানি ব্যাকটেরিয়ার জিনে মানব ইনসুলিন জিন স্থাপন করে ইনসুলিন উৎপাদন করছে। এ প্রক্রিয়াকে কী বলা হয়?",
      options: ["জিন প্রকৌশল", "ক্লোনিং", "টিস্যু কালচার", "হাইব্রিডাইজেশন"],
      answerIndex: 0,
      explanation: "অন্য জীবের জিন স্থাপন করে পছন্দসই পণ্য উৎপাদনই জিন প্রকৌশল।",
      topic: "জিন প্রকৌশল",
    },
    {
      text: "উদ্দীপক: DNA-এর একটি খণ্ড ল্যাবে বহু কপি তৈরি করা হচ্ছে। এ প্রক্রিয়ার নাম কী?",
      options: ["PCR", "মাইটোসিস", "মিয়োসিস", "ফার্মেন্টেশন"],
      answerIndex: 0,
      explanation: "Polymerase Chain Reaction (PCR) DNA প্রতিলিপি তৈরির পদ্ধতি।",
      topic: "PCR",
    },
    {
      text: "ব্যাকটেরিয়ায় কৃত্রিমভাবে বৈদেশিক DNA বহন করে এমন ছোট বৃত্তাকার DNA কে কী বলে?",
      options: ["প্লাজমিড", "রাইবোসোম", "মাইটোকন্ড্রিয়া", "ক্রোমোজোম"],
      answerIndex: 0,
      explanation: "প্লাজমিড জিন প্রকৌশলে ভেক্টর হিসেবে ব্যবহৃত হয়।",
      topic: "প্লাজমিড",
    },
    {
      text: "উদ্দীপক: ১৯৯৬ সালে 'ডলি' নামক একটি মেষ ক্লোন তৈরি হয়। ক্লোনিং মূলত কী নির্দেশ করে?",
      options: ["জেনেটিকভাবে অভিন্ন প্রতিলিপি", "মাইটোসিস বন্ধ", "মিউটেশন বৃদ্ধি", "দুই প্রজাতির মিশ্রণ"],
      answerIndex: 0,
      explanation: "ক্লোনিং হলো একই জিনগত গঠনের জীব তৈরি করা।",
      topic: "ক্লোনিং",
    },
    {
      text: "জীবপ্রযুক্তির সুবিধা ও ঝুঁকি সম্পর্কে নিচের কোনটি সঠিক? i. চিকিৎসা ও কৃষিতে উন্নতি ঘটায় ii. অনিয়ন্ত্রিত ব্যবহারে পরিবেশ ঝুঁকি তৈরি হতে পারে iii. এটি সবসময় সম্পূর্ণ নিরাপদ নিচের কোনটি সঠিক?",
      options: ["i ও ii", "i ও iii", "ii ও iii", "i, ii ও iii"],
      answerIndex: 0,
      explanation: "জীবপ্রযুক্তি উপকারী হলেও নিয়ন্ত্রণ ও নৈতিকতা প্রয়োজন।",
      topic: "জীবপ্রযুক্তি",
    },
    {
      text: "ট্রান্সজেনিক ফসল বলতে বোঝায়—",
      options: ["অন্য জীবের জিনযুক্ত ফসল", "প্রাকৃতিক ফসল", "শুধু জৈব সারে উৎপাদিত ফসল", "বন্য ফসল"],
      answerIndex: 0,
      explanation: "ট্রান্সজেনিক অর্থাৎ অন্য জীবের জিন স্থানান্তরিত উদ্ভিদ।",
      topic: "ট্রান্সজেনিক",
    },
  ],
};

let boardStandardCache = null;

function loadBoardStandardItems() {
  if (boardStandardCache) return boardStandardCache;
  const byChapter = Object.fromEntries(
    Array.from({ length: 14 }, (_, i) => [String(i + 1).padStart(2, "0"), []]),
  );
  const seen = new Set();

  for (const { q: qPath, a: aPath } of BOARD_FILES) {
    if (!fs.existsSync(qPath) || !fs.existsSync(aPath)) continue;
    const questions = JSON.parse(fs.readFileSync(qPath, "utf8"));
    const answers = JSON.parse(fs.readFileSync(aPath, "utf8"));
    for (const q of questions) {
      const ans = answers[q.id];
      if (!ans?.correctOption) continue;
      const text = String(q.text ?? "").trim();
      const chapter = mapBiologyChapter(text);
      if (!chapter) continue;
      const options = (q.options ?? []).map(String);
      const answerIndex = options.findIndex((o) => o.trim() === String(ans.correctOption).trim());
      if (answerIndex < 0) continue;
      const key = normalizeStemForDedup(text);
      if (seen.has(key)) continue;
      seen.add(key);
      byChapter[chapter].push({
        text,
        options,
        answerIndex,
        explanation: String(ans.explanation ?? "").trim(),
        topic: "",
        image: q.image ?? null,
        quality: 5,
      });
    }
  }
  boardStandardCache = byChapter;
  return byChapter;
}

function getPremiumForChapter(chapterNo) {
  const ch = String(chapterNo).padStart(2, "0");
  const manual = (PREMIUM_BY_CHAPTER[ch] ?? []).map((q) => ({ ...q, quality: q.quality ?? 4 }));
  const board = loadBoardStandardItems()[ch] ?? [];
  const seen = new Set();
  const out = [];
  for (const q of [...manual, ...board]) {
    const key = normalizeStemForDedup(q.text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

module.exports = {
  PREMIUM_BY_CHAPTER,
  getPremiumForChapter,
};
