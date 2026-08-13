/**
 * Fix SSC Physics Cumilla Board 2024 — text, options, and SVG diagrams.
 * Source: official board MCQ structure + Satt Academy solution key.
 *
 * Run: node scripts/fix-cumilla-2024-board-pack.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  cumilla2024CircuitR123,
  cumilla2024VoltageDivider,
  unitSymbolOption,
} from "./lib/board-svg-generators.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PREMIUM = path.join(ROOT, "public", "images", "quiz", "premium");
const TARGET = path.join(ROOT, "public", "questions", "physics", "cumilla-2024.json");

const ID = (n) => `physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-${n}`;

function writeSvg(relPath, content) {
  const abs = path.join(ROOT, "public", relPath.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
  return relPath;
}

function buildQuestions() {
  const circuitImg = writeSvg(
    `/images/quiz/premium/${ID(15)}-circuit.svg`,
    cumilla2024CircuitR123(),
  );
  const vdivImg = writeSvg(
    `/images/quiz/premium/${ID(4)}-voltage.svg`,
    cumilla2024VoltageDivider(),
  );

  const unitOpts = ["N", "J", "Pa", "K"].map((sym, i) =>
    writeSvg(
      `/images/quiz/premium/${ID(1)}-option-${i + 1}.svg`,
      unitSymbolOption(sym, sym),
    ),
  );

  return [
    {
      id: ID(0),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১. উদ্ভিদের বৃদ্ধি রেকর্ড করার যন্ত্রের নাম?",
      options: ["ক্রেস্কোগ্রাফ", "সিসমোগ্রাফ", "টমোগ্রাফি", "এনজিওগ্রাফি"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(1),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২. নিচের কোনটি মৌলিক একক?",
      options: ["N", "J", "Pa", "K"],
      image: null,
      optionImages: unitOpts,
      timeLimit: 45,
    },
    {
      id: ID(2),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৩. $2 \\times 10^{-6}\\,\\text{F}$ ধারকত্বের কোনো ধারকের বিভব পার্থক্য $200\\,\\text{V}$ হলে সঞ্চিত চার্জের পরিমাণ কত?",
      options: [
        "$1 \\times 10^{-4}\\,\\text{C}$",
        "$4 \\times 10^{-4}\\,\\text{C}$",
        "$4 \\times 10^{-3}\\,\\text{C}$",
        "$1 \\times 10^{-2}\\,\\text{C}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: "physics-ssc-science-physics-board-questions-year-wise-2024-cumilla-ts-2-nuclear",
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৪. সবল নিউক্লিয় বলের পালল্য কত?",
      options: [
        "$10^{-15}\\,\\text{m}$",
        "$10^{-14}\\,\\text{m}$",
        "$10^{-13}\\,\\text{m}$",
        "$10^{-12}\\,\\text{m}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(3),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৫. নিচের কোন রাশিদ্বয় ভেক্টর রাশি?",
      options: ["ত্বরণ, দ্রুতি", "ভর, সময়", "সরণ, বেগ", "চাপ, দীপন তীব্রতা"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(4),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৬. চিত্র অনুযায়ী $V_s$ কত বিভব?",
      options: ["$4500\\,\\text{V}$", "$5500\\,\\text{V}$", "$6000\\,\\text{V}$", "$6500\\,\\text{V}$"],
      image: vdivImg,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(5),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৭. $1$ ন্যানো সেকেন্ড সমান কত সেকেন্ড?",
      options: ["$10^{-9}$", "$10^{-6}$", "$10^{6}$", "$10^{9}$"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(6),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৮. বাষ্পায়ন সর্বাধিক হবে—\nর. তরলের উপরিভাগের ক্ষেত্রফল বেশি হলে\nরর. তরল এবং তরলের কাছাকাছি বাতাসের উষ্ণতা কম হলে\nররর. তরলের স্ফুটনাঙ্ক কম হলে\n\nনিচের কোনটি সঠিক?",
      options: ["র ও রর", "র ও ররর", "রর ও ররর", "র, রর ও ররর"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(7),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "৯. $100\\,\\text{m}$ উচ্চতা থেকে একটি বস্তুকে নিচে ফেলা হলে এটি কত বেগে ভূ-পৃষ্ঠে আঘাত করবে?",
      options: [
        "$44.27\\,\\text{ms}^{-1}$",
        "$43.27\\,\\text{ms}^{-1}$",
        "$42.27\\,\\text{ms}^{-1}$",
        "$41.27\\,\\text{ms}^{-1}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(8),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১০. আমাদের শরীরে কোন মৌল বেশি?",
      options: ["পটাশিয়াম", "ম্যাগনেশিয়াম", "সোডিয়াম", "কার্বন"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(9),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১১. কোন তাপমাত্রায় গ্যাসের আয়তন প্রসারণ সহগ বেশি?",
      options: ["$10^{\\circ}\\text{C}$", "$20^{\\circ}\\text{C}$", "$30^{\\circ}\\text{C}$", "$40^{\\circ}\\text{C}$"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(10),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১২. একটি বস্তু $20\\,\\text{m}$ উচ্চতা থেকে ভূমিতে পড়লো। পড়ার অবস্থায় ভূমি হতে $5\\,\\text{m}$ উঁচুতে বিভবশক্তি ও গতিশক্তির অনুপাত কোনটি?",
      options: ["$1:3$", "$1:2$", "$2:1$", "$3:1$"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(11),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৩. নিচের কোনটির তরঙ্গদৈর্ঘ্য বেশি?",
      options: ["ইনফ্রারেড", "লাল", "অতিবেগুনি", "বেগুনি"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(12),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৪. সাইড ক্যালিপার্স দ্বারা ন্যূনতম কত দূরত্ব মাপা যায়?",
      options: ["$0.1\\,\\text{mm}$", "$0.01\\,\\text{mm}$", "$1\\,\\text{mm}$", "ভার্নিয়ার ধ্রুবক স্কেল"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(13),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৫. ইউরেনিয়ামের একটি আইসোটোপ কোন রশ্মি বিকিরণ করে থোরিয়ামের একটি আইসোটোপে পরিণত হয়?",
      options: ["এক্স-রে", "বিটা", "আলফা", "গামা"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(14),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৬. যদি চ শূন্য মাধ্যম হয়, এবং $n = 2.6$ হয়",
      options: [
        "চ মাধ্যমে আলোর বেগ বেশি",
        "চ হলো হালকা মাধ্যম",
        "ছ মাধ্যমে আলোর বেগ বেশি",
        "আপতন কোণ ও প্রতিসরণ কোণ সমান",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(15),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৭. নিচের উদ্দীপকের আলোকে ১৭ ও ১৮ নং প্রশ্নের উত্তর দাও:\n$R_1 = 5\\,\\Omega$, $R_2 = 10\\,\\Omega$, $R_3 = 20\\,\\Omega$, $12\\,\\text{V}$\n\nর. বর্তনীর তড়িৎ ক্ষমতা $16.80\\,\\text{W}$\nরর. বর্তনীর তাপক্ষয়ের হার $16.80\\,\\text{W}$\nররর. বর্তনীর তুল্যরোধ $8.75\\,\\Omega$\n\nনিচের কোনটি সঠিক?",
      options: ["র ও রর", "র ও ররর", "রর ও ররর", "র, রর ও ররর"],
      image: circuitImg,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(16),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৮. বর্তনীটিতে $2.80\\,\\text{A}$ তড়িৎ প্রবাহমাত্রা পাওয়া যাবে যখন—\nর. $R_2$, $R_3$ শ্রেণিতে যুক্ত করে $R_1$ এর সাথে সমান্তরালে যুক্ত করলে\nরর. $R_1$, $R_2$ শ্রেণিতে যুক্ত করে $R_3$ এর সাথে সমান্তরালে যুক্ত করলে\nররর. $R_1$, $R_2$ ও $R_3$ সমান্তরালে যুক্ত করলে\n\nনিচের কোনটি সঠিক?",
      options: ["র ও রর", "র ও ররর", "রর ও ররর", "র, রর ও ররর"],
      image: circuitImg,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(17),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "১৯. সার্বজনীন গ্যাস ধ্রুবক (R) এর মান কত?",
      options: [
        "$8.314\\,\\text{J mol}^{-1}\\text{K}^{-1}$",
        "$8.414\\,\\text{J mol}^{-1}\\text{K}^{-1}$",
        "$8.514\\,\\text{J mol}^{-1}\\text{K}^{-1}$",
        "$8.614\\,\\text{J mol}^{-1}\\text{K}^{-1}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(18),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২০. আপেক্ষিক তাপের একক কোনটি?",
      options: [
        "$\\text{J kg}^{-1}\\text{K}^{-1}$",
        "$\\text{J kg}^{-2}\\text{K}^{-1}$",
        "$\\text{J kg}^{-1}\\text{K}^{-2}$",
        "$\\text{J kg}^{-2}\\text{K}^{-2}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(19),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২১. স্প্রিং ধ্রুবকের একক?",
      options: [
        "$\\text{N m}^{-1}$",
        "$\\text{J kg}^{-1}$",
        "$\\text{J s}^{-2}$",
        "$\\text{N m kg}^{-2}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(20),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২২. $5\\,\\text{cm}$ এর একটি বস্তুকে একটি অবতল আয়নার সামনে রাখলে এর প্রতিবিম্ব $2\\,\\text{cm}$ হলে, বস্তুটির বিবর্ধন কত?",
      options: ["$0.1$", "$0.2$", "$0.3$", "$0.4$"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(21),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২৩. পাহাড়ি রাস্তার অদৃশ্য বাঁকগুলোতে কত ডিগ্রি কোণে বড় আকারের সমতল আয়না বসানো হয়?",
      options: ["$30^{\\circ}$", "$40^{\\circ}$", "$45^{\\circ}$", "$60^{\\circ}$"],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(22),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২৪. প্রোটনের চার্জ কত?",
      options: [
        "$+1.6 \\times 10^{-19}\\,\\text{C}$",
        "$-1.6 \\times 10^{-19}\\,\\text{C}$",
        "$+1.6 \\times 10^{-18}\\,\\text{C}$",
        "$+1.6 \\times 10^{-17}\\,\\text{C}$",
      ],
      image: null,
      optionImages: null,
      timeLimit: 45,
    },
    {
      id: ID(23),
      subject: "physics",
      chapter: "Cumilla Board 2024",
      text: "২৫. একটি উত্তল লেন্সের ফোকাস দূরত্ব $10\\,\\text{cm}$। কোনো বস্তুকে প্রধান অক্ষের উপর মেরু থেকে $18\\,\\text{cm}$ দূরে রাখা হলে, প্রতিবিম্ব হবে—\nর. বাস্তব ও উল্টা\nরর. বস্তুর আকার থেকে ছোট\nররর. প্রতিবিম্বের অবস্থান ফোকাস দূরত্বের বাইরে\n\nনিচের কোনটি সঠিক?",
      options: ["র ও রর", "র ও ররর", "রর ও ররর", "র, রর ও ররর"],
      image: "/images/quiz/ssc-convex-lens.svg",
      optionImages: null,
      timeLimit: 45,
    },
  ];
}

const questions = buildQuestions();
fs.writeFileSync(TARGET, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
console.log(`Wrote ${questions.length} questions to ${path.relative(ROOT, TARGET)}`);
console.log("SVG fixes: unit options N/J/Pa/K, voltage divider, R1/R2/R3 circuit");
