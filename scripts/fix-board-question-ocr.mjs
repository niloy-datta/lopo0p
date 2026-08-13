/**
 * Repair OCR-corrupted board year-wise question JSON files.
 * Run: node scripts/fix-board-question-ocr.mjs
 * Dry: node scripts/fix-board-question-ocr.mjs --dry-run
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  repairBoardOcr,
  sanitizeQuestionText,
  sanitizeOptionText,
  isImagePlaceholderOption,
} from "../src/lib/sanitize-quiz-text.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QUESTIONS = path.join(ROOT, "public", "questions");
const DRY_RUN = process.argv.includes("--dry-run");

const BOARD_FILE_RE =
  /(?:barishal|barisal|chattogram|cumilla|comilla|dhaka|dinajpur|jashore|jessore|mymensingh|rajshahi|sylhet)-20\d{2}\.json$/i;

/** Hand-curated fixes where OCR repair alone is not enough. */
const QUESTION_OVERRIDES = {
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-3": {
    text: "৪. নিচের কোন রাশিদ্বয় ভেক্টর রাশি?",
    options: ["ত্বরণ, দ্রুতি", "ভর, সময়", "সরণ, বেগ", "চাপ, দীপন তীব্রতা"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-4": {
    text: "৫. চিত্র অনুযায়ী $V_s$ কত বিভব?",
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-7": {
    text: "৮. ১০ m উচ্চতা থেকে একটি বস্তুকে নিচে ফেলা হলে এটি কত বেগে ভূ-পৃষ্ঠে আঘাত করবে?",
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-8": {
    text: "৯. আমাদের শরীরে কোন মৌল বেশি?",
    options: ["কার্বন", "অক্সিজেন", "নাইট্রোজেন", "হাইড্রোজেন"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-9": {
    text: "১০. কোন তাপমাত্রায় গ্যাসের আয়তন প্রসারণ সহগ বেশি?",
    options: ["১০°C", "২০°C", "৩০°C", "৪০°C"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-10": {
    text: "১১. একটি বস্তু ২০ m উচ্চতা থেকে ভূমিতে পড়লো। পড়ার অবস্থায় ভূমি হতে ৫ m উঁচুতে বিভবশক্তি ও গতিশক্তির অনুপাত কোনটি?",
    options: ["১ : ৩", "১ : ২", "২ : ১", "৩ : ১"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-11": {
    text: "১২. নিচের কোনটির তরঙ্গদৈর্ঘ্য বেশি?",
    options: ["ইনফ্রারেড", "লাল", "অতিবেগুনি", "বেগুনি"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-12": {
    text: "১৩. সাইড ক্যালিপার্স দ্বারা ন্যূনতম কত দূরত্ব মাপা যায়?",
    options: ["০.১ mm", "০.০১ mm", "১ mm", "ভার্নিয়ার ধ্রুবক স্কেল"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-13": {
    text: "১৪. ইউরেনিয়ামের একটি আইসোটোপ কোন রশ্মি বিকিরণ করে থোরিয়ামের একটি আইসোটোপে পরিণত হয়?",
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-14": {
    text: "১৫. যদি চ শূন্য মাধ্যম হয়, এবং n = ২.৬ হয়",
    options: [
      "চ মাধ্যমে আলোর বেগ বেশি",
      "চ হলো হালকা মাধ্যম",
      "ছ মাধ্যমে আলোর বেগ বেশি",
      "আপতন কোণ ও প্রতিসরণ কোণ সমান",
    ],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-16": {
    text: "১৮. বর্তনীটিতে ২.৮০ A তড়িৎ প্রবাহমাত্রা পাওয়া যাবে যখন—\nর. $R_2$, $R_3$ শ্রেণিতে যুক্ত করে $R_1$ এর সাথে সমান্তরালে যুক্ত করলে\nরর. $R_1$, $R_2$ শ্রেণিতে যুক্ত করে $R_3$ এর সাথে সমান্তরালে যুক্ত করলে\nররর. $R_1$, $R_2$ ও $R_3$ সমান্তরালে যুক্ত করলে\n\nনিচের কোনটি সঠিক?",
    options: ["র ও রর", "র ও ররর", "রর ও ররর", "র, রর ও ররর"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-17": {
    text: "১৯. সার্বজনীন গ্যাস ধ্রুবক (R) এর মান কত?",
    options: [
      "৮.৩১৪ J mol$^{-1}$ K$^{-1}$",
      "৮.৪১৪ J mol$^{-1}$ K$^{-1}$",
      "৮.৫১৪ J mol$^{-1}$ K$^{-1}$",
      "৮.৬১৪ J mol$^{-1}$ K$^{-1}$",
    ],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-18": {
    text: "২০. আপেক্ষিক তাপের একক কোনটি?",
    options: [
      "J kg$^{-1}$ K$^{-1}$",
      "J kg$^{-2}$ K$^{-1}$",
      "J kg$^{-1}$ K$^{-2}$",
      "J kg$^{-2}$ K$^{-2}$",
    ],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-19": {
    text: "২১. স্প্রিং ধ্রুবকের একক?",
    options: ["N m$^{-1}$", "J kg$^{-1}$", "J s$^{-2}$", "N m kg$^{-2}$"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-15": {
    text: "১৭. নিচের উদ্দীপকের আলোকে ১৭ ও ১৮ নং প্রশ্নের উত্তর দাও:\n$R_1 = 5\\,\\Omega$, $R_2 = 10\\,\\Omega$, $R_3 = 20\\,\\Omega$, ১২ V\n\nর. বর্তনীর তড়িৎ ক্ষমতা ১৬.৮০ W\nরর. বর্তনীর তাপক্ষয়ের হার ১৬.৮০ W\nররর. বর্তনীর তুল্যরোধ ৮.৭৫ Ω\n\nনিচের কোনটি সঠিক?",
    options: ["র ও রর", "র ও ররর", "রর ও ররর", "র, রর ও ররর"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-21": {
    text: "২২. পাহাড়ি রাস্তার অদৃশ্য বাঁকগুলোতে কত ডিগ্রি কোণে বড় আকারের সমতল আয়না বসানো হয়?",
    options: ["৩০°", "৪০°", "৪৫°", "৬০°"],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-22": {
    text: "২৩. প্রোটনের চার্জ কত?",
    options: [
      "+ ১.৬ \\times ১০^{-১৯} C",
      "- ১.৬ \\times ১০^{-১৯} C",
      "+ ১.৬ \\times ১০^{-১৮} C",
      "+ ১.৬ \\times ১০^{-১৭} C",
    ],
  },
  "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-23": {
    text: "২৪. একটি উত্তল লেন্সের ফোকাস দূরত্ব ১০ cm। কোনো বস্তুকে প্রধান অক্ষের উপর মেরু থেকে ১৮ cm দূরে রাখা হলে, প্রতিবিম্ব হবে—\nর. বাস্তব ও উল্টা\nরর. বস্তুর আকার থেকে ছোট\nররর. প্রতিবিম্বের অবস্থান ফোকাস দূরত্বের বাইরে\n\nনিচের কোনটি সঠিক?",
  },
};

const LABEL_LINE_RE = /^(?:[Kক]|খ|গ|ঘ)\s+(.+)$/;

function listBoardFiles() {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const fp = path.join(dir, name);
      if (fs.statSync(fp).isDirectory()) walk(fp);
      else if (BOARD_FILE_RE.test(name)) out.push(fp);
    }
  }
  walk(QUESTIONS);
  return out;
}

function allOptionsPlaceholder(options) {
  if (!Array.isArray(options) || options.length < 4) return false;
  return options.every((o) => isImagePlaceholderOption(String(o ?? "")));
}

function extractLeakedOptions(text) {
  const lines = String(text ?? "").split("\n");
  const kept = [];
  const extracted = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const m = trimmed.match(LABEL_LINE_RE);
    if (m) {
      extracted.push(m[1].trim());
      continue;
    }
    if (trimmed) kept.push(trimmed);
  }

  return { stem: kept.join("\n"), options: extracted };
}

function repairQuestion(q) {
  const next = { ...q };
  let changed = false;

  const override = QUESTION_OVERRIDES[next.id];
  if (override) {
    if (override.text && override.text !== next.text) {
      next.text = override.text;
      changed = true;
    }
    if (override.options && JSON.stringify(override.options) !== JSON.stringify(next.options)) {
      next.options = override.options;
      changed = true;
    }
  }

  if (typeof next.text === "string") {
    const repaired = sanitizeQuestionText(next.text);
    if (repaired !== next.text) {
      next.text = repaired;
      changed = true;
    }
  }

  if (Array.isArray(next.options)) {
    const repairedOpts = next.options.map((o) => sanitizeOptionText(String(o ?? "")));

    if (allOptionsPlaceholder(next.options) && !next.optionImages?.length) {
      const { stem, options } = extractLeakedOptions(next.text);
      if (options.length >= 4) {
        next.text = sanitizeQuestionText(stem);
        next.options = options.slice(0, 4).map(sanitizeOptionText);
        changed = true;
      } else if (repairedOpts.some((o, i) => o !== next.options[i])) {
        next.options = repairedOpts;
        changed = true;
      }
    } else {
      const cleared = repairedOpts.map((o, i) => {
        if (next.optionImages?.[i] && isImagePlaceholderOption(next.options[i])) return "";
        return o;
      });
      if (cleared.some((o, i) => o !== next.options[i])) {
        next.options = cleared;
        changed = true;
      }
    }
  }

  return { question: next, changed };
}

function main() {
  const files = listBoardFiles();
  let filesChanged = 0;
  let questionsChanged = 0;

  for (const fp of files) {
    const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
    const questions = Array.isArray(raw) ? raw : raw.questions;
    if (!Array.isArray(questions)) continue;

    let fileChanged = false;
    const repaired = questions.map((q) => {
      const { question, changed } = repairQuestion(q);
      if (changed) {
        fileChanged = true;
        questionsChanged++;
      }
      return question;
    });

    if (!fileChanged) continue;
    filesChanged++;

    if (!DRY_RUN) {
      const out = Array.isArray(raw) ? repaired : { ...raw, questions: repaired };
      fs.writeFileSync(fp, `${JSON.stringify(out, null, 2)}\n`, "utf8");
    }
    console.log(`${DRY_RUN ? "would fix" : "fixed"}: ${path.relative(ROOT, fp)}`);
  }

  console.log(
    `${DRY_RUN ? "Would change" : "Changed"} ${questionsChanged} question(s) in ${filesChanged} file(s).`,
  );
}

main();
