/**
 * Board-harvested + curated high-probability SSC Physics MCQs per chapter.
 */
const fs = require("fs");
const path = require("path");
const { mapPhysicsChapter } = require("./ssc-physics-chapter-map");
const { normalizeStemForDedup } = require("./ssc-biology-stem-utils");
const { isBrokenPhysicsImport, isJunkQuestionText } = require("./ssc-set-quality");

const ROOT = path.resolve(__dirname, "..", "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions", "physics");
const ANSWERS_DIR = path.join(ROOT, "backend", "data", "answers", "physics");

/** Exam-critical curated MCQs (board pattern, high repeat probability). */
const CURATED_BY_CHAPTER = {
  "01": [
    { text: "SI পদ্ধতিতে বলের একক কোনটি?", options: ["নিউটন", "জুল", "ওয়াট", "প্যাসকেল"], answerIndex: 0, topic: "একক" },
    { text: "নিচের কোনটি ভেক্টর রাশি?", options: ["বেগ", "দ্রুতি", "কাজ", "তাপ"], answerIndex: 0, topic: "ভেক্টর" },
    { text: "ক্ষমতার মাত্রা কোনটি?", options: ["$\\text{ML}^2\\text{T}^{-3}$", "$\\text{MLT}^{-1}$", "$\\text{ML}^2\\text{T}^{-2}$", "$\\text{ML}^{-1}\\text{T}^{-2}$"], answerIndex: 0, topic: "মাত্রা" },
    { text: "পদার্থবিজ্ঞানে মৌলিক রাশির সংখ্যা কত?", options: ["৭", "৫", "৩", "৯"], answerIndex: 0, topic: "মৌলিক রাশি" },
    { text: "যান্ত্রিক ত্রুটি—", options: ["ধনাত্মক বা ঋণাত্মক হতে পারে", "সবসময় ধনাত্মক", "শূন্য হতে পারে না", "শতকরায় প্রকাশ করা যায় না"], answerIndex: 0, topic: "ত্রুটি" },
    { text: "পরিমাপে সিস্টেম্যাটিক ত্রুটি মূলত কিসের জন্য ঘটে?", options: ["যন্ত্রের ক্যালিব্রেশনজনিত", "এলোমেলো", "এককহীন", "শূন্য হতে পারে না"], answerIndex: 0, topic: "ত্রুটি" },
    { text: "দ্রুতির মাত্রা কোনটি?", options: ["$\\text{LT}^{-1}$", "$\\text{L}^2\\text{T}^{-2}$", "$\\text{MLT}^{-2}$", "$\\text{T}^{-1}$"], answerIndex: 0, topic: "মাত্রা" },
    { text: "চাপের মাত্রা কোনটি?", options: ["$\\text{ML}^{-1}\\text{T}^{-2}$", "$\\text{MLT}^{-2}$", "$\\text{ML}^2\\text{T}^{-3}$", "$\\text{MLT}^{-1}$"], answerIndex: 0, topic: "মাত্রা" },
  ],
  "02": [
    { text: "সমবেগে চলমান বস্তুর ত্বরণ কত?", options: ["শূন্য", "9.8 m/s²", "বেগের সমান", "ঋণাত্মক"], answerIndex: 0, topic: "গতি" },
    { text: "মুক্ত পতনে বস্তুর ত্বরণ প্রায় কত?", options: ["9.8 m/s²", "10 m/s", "1 m/s²", "98 m/s"], answerIndex: 0, topic: "মুক্ত পতন" },
    { text: "u=10 m/s, a=2 m/s², t=5 s হলে v=?", options: ["20 m/s", "10 m/s", "25 m/s", "50 m/s"], answerIndex: 0, topic: "সমীকরণ" },
    { text: "একটি বস্তু 20 m/s বেগে 4 s সময় ধরে সমবেগে চললে অতিক্রান্ত দূরত্ব কত?", options: ["80 m", "5 m", "24 m", "16 m"], answerIndex: 0, topic: "দূরত্ব" },
  ],
  "03": [
    { text: "নিউটনের দ্বিতীয় সূত্র অনুযায়ী F=?", options: ["ma", "mv", "mg", "m/a"], answerIndex: 0, topic: "নিউটন" },
    { text: "m=4 kg, a=2.5 m/s² হলে বল F=?", options: ["10 N", "6.5 N", "1.6 N", "8 N"], answerIndex: 0, topic: "F=ma" },
    { text: "নিউটনের তৃতীয় সূত্র অনুযায়ী—", options: ["F₁₂=-F₂₁", "F=ma", "p=mv", "W=Fs"], answerIndex: 0, topic: "নিউটন" },
    { text: "ভরবেগের একক কোনটি?", options: ["kg·m/s", "N", "J", "W"], answerIndex: 0, topic: "ভরবেগ" },
  ],
  "04": [
    { text: "F=50 N, s=4 m হলে কৃতকাজ W=?", options: ["200 J", "54 J", "12.5 J", "46 J"], answerIndex: 0, topic: "কাজ" },
    { text: "m=2 kg, v=10 m/s হলে গতিশক্তি কত?", options: ["100 J", "20 J", "200 J", "50 J"], answerIndex: 0, topic: "গতিশক্তি" },
    { text: "1 kW = ? W", options: ["1000", "100", "10", "10000"], answerIndex: 0, topic: "ক্ষমতা" },
    { text: "নিচের কোনটি অনবায়নযোগ্য শক্তি?", options: ["বায়ু", "কয়লা", "পেট্রোল", "প্রাকৃতিক গ্যাস"], answerIndex: 0, topic: "শক্তি" },
    { text: "m=1 kg, g=9.8 m/s², h=10 m হলে স্থিতিশক্তি কত?", options: ["98 J", "9.8 J", "10 J", "980 J"], answerIndex: 0, topic: "স্থিতিশক্তি" },
    { text: "P=500 W, t=2 min হলে শক্তি (জুলে) কত?", options: ["60000 J", "1000 J", "250 J", "5000 J"], answerIndex: 0, topic: "ক্ষমতা" },
    { text: "500 N ওজনের বস্তুকে 2 m উঁচুতে তুলতে কৃতকাজ কত?", options: ["1000 J", "502 J", "498 J", "250 J"], answerIndex: 0, topic: "কাজ" },
    { text: "গতিশক্তির মাত্রা কোনটি?", options: ["$\\text{ML}^2\\text{T}^{-2}$", "$\\text{MLT}^{-2}$", "$\\text{LT}^{-1}$", "$\\text{MLT}^{-1}$"], answerIndex: 0, topic: "মাত্রা" },
    { text: "ক্ষমতার একক কোনটি?", options: ["ওয়াট", "জুল", "নিউটন", "প্যাসকেল"], answerIndex: 0, topic: "ক্ষমতা" },
    { text: "সংকুচিত স্প্রিংয়ের ভেতর কোন শক্তি লুকিয়ে থাকে?", options: ["স্থিতিশক্তি", "গতিশক্তি", "তাপ শক্তি", "রাসায়নিক শক্তি"], answerIndex: 0, topic: "স্থিতিশক্তি" },
  ],
  "05": [
    { text: "সমুদ্রপৃষ্ঠে বায়ুর চাপ প্রায় কত?", options: ["101325 Pa", "7600 Pa", "100 Pa", "1013 Pa"], answerIndex: 0, topic: "চাপ" },
    { text: "আর্কিমিডিসের সূত্র F=?", options: ["ρgV", "mg", "PA", "mv"], answerIndex: 0, topic: "প্লবতা" },
    { text: "প্লবতা সূত্র অনুযায়ী F=?", options: ["ρgV", "mg", "PA", "mv"], answerIndex: 0, topic: "প্লবতা" },
  ],
  "06": [
    { text: "পানির সর্বোচ্চ ঘনত্ব কোন তাপমাত্রায়?", options: ["4°C", "0°C", "100°C", "-4°C"], answerIndex: 0, topic: "তাপ" },
    { text: "তাপ পরিবহনে তাপ কোন দিকে প্রবাহিত হয়?", options: ["উচ্চ তাপমাত্রা থেকে নিম্ন", "নিম্ন থেকে উচ্চ", "যেকোনো", "স্থির"], answerIndex: 0, topic: "তাপ পরিবহন" },
    { text: "m=1 kg, c=4200 J/kg·K, ΔT=10 K হলে Q=?", options: ["42000 J", "420 J", "4200 J", "420000 J"], answerIndex: 0, topic: "তাপ" },
    { text: "তাপের SI একক কোনটি?", options: ["জুল", "কেলভিন", "ক্যালরি", "ওয়াট"], answerIndex: 0, topic: "তাপ" },
    { text: "তাপমাত্রার SI একক কোনটি?", options: ["কেলভিন", "সেলসিয়াস", "ফারেনহাইট", "জুল"], answerIndex: 0, topic: "তাপমাত্রা" },
    { text: "কঠিন পদার্থের প্রসারণ সাধারণত কোন তাপমাত্রার সাথে বৃদ্ধি পায়?", options: ["তাপমাত্রা বৃদ্ধির সাথে", "তাপমাত্রা হ্রাসের সাথে", "চাপ বৃদ্ধির সাথে", "ঘনত্ব বৃদ্ধির সাথে"], answerIndex: 0, topic: "প্রসারণ" },
    { text: "তাপ পরিবহন, পরিবহন ও বিকিরণ— কোনটি মাধ্যম ছাড়াই তাপ স্থানান্তর করে?", options: ["বিকিরণ", "পরিবহন", "পরিবহন", "সবগুলো"], answerIndex: 0, topic: "তাপ" },
    { text: "বরফ গলে পানি হলে তাপ শোষিত হয়— এটি কোন প্রক্রিয়া?", options: ["গলন", "বাষ্পীভবন", "প্রসারণ", "প্রতিসরণ"], answerIndex: 0, topic: "পরিবর্তন অবস্থা" },
    { text: "পানি 100°C-এ ফুটলে কোন পরিবর্তন ঘটে?", options: ["বাষ্পীভবন", "গলন", "জমাট বাঁধা", "প্রসারণ"], answerIndex: 0, topic: "পরিবর্তন অবস্থা" },
    { text: "তাপ গ্রহণ করে পদার্থের তাপমাত্রা বৃদ্ধি— এ প্রক্রিয়ায় শক্তি কোথায় যায়?", options: ["অণুগুলোর গতিশক্তিতে", "স্থিতিশক্তিতে", "রাসায়নিক বন্ধনে", "আলোক শক্তিতে"], answerIndex: 0, topic: "তাপগতি" },
  ],
  "07": [
    { text: "শব্দের বেগ বায়ুতে প্রায় কত?", options: ["343 m/s", "3×10⁸ m/s", "1500 m/s", "100 m/s"], answerIndex: 0, topic: "শব্দ" },
    { text: "f=340 Hz, λ=1 m হলে শব্দের বেগ v=?", options: ["340 m/s", "341 m/s", "339 m/s", "680 m/s"], answerIndex: 0, topic: "তরঙ্গ" },
    { text: "শব্দ তরঙ্গ কোন ধরনের?", options: ["অগুণিত", "অক্ষীয়", "তাড়িত", "স্থির"], answerIndex: 0, topic: "তরঙ্গ" },
  ],
  "08": [
    { text: "আলোর প্রতিফলনে আপতন কোণ ও প্রতিফলন কোণ—", options: ["সমান", "অসমান", "যোগ 90°", "যোগ 180°"], answerIndex: 0, topic: "প্রতিফলন" },
    { text: "একটি অবতল দর্পণের ফোকাস দূরত্ব 10 cm হলে বক্রতার ব্যাসার্ধ কত?", options: ["20 cm", "5 cm", "10 cm", "40 cm"], answerIndex: 0, topic: "দর্পণ" },
    { text: "আয়নায় প্রতিবিম্ব কোন ধরনের?", options: ["ভার্চুয়াল", "বাস্তব", "উল্টো বাস্তব", "কোনোটিই নয়"], answerIndex: 0, topic: "দর্পণ" },
  ],
  "09": [
    { text: "n₁sinθ₁=n₂sinθ₂ কোন সূত্র?", options: ["Snell", "Newton", "Ohm", "Coulomb"], answerIndex: 0, topic: "প্রতিসরণ" },
    { text: "আলো শূন্য মাধ্যমে গেলে বেগ—", options: ["সর্বোচ্চ", "সর্বনিম্ন", "শূন্য", "অপরিবর্তিত"], answerIndex: 0, topic: "আলো" },
    { text: "লেন্সের ক্ষমতার একক কোনটি?", options: ["ডায়োপ্টার", "মিটার", "জুল", "ওয়াট"], answerIndex: 0, topic: "লেন্স" },
    { text: "সংকট কোণে কী ঘটে?", options: ["পূর্ণ অভ্যন্তরীণ প্রতিফলন", "প্রতিসরণ বন্ধ", "বিচ্ছুরণ", "পোলারাইজেশন"], answerIndex: 0, topic: "প্রতিসরণ" },
    { text: "অপটিক্যাল ফাইবারে আলো ধরে রাখে কোন নীতিতে?", options: ["পূর্ণ অভ্যন্তরীণ প্রতিফলন", "প্রতিসরণ", "প্রতিফলন", "বিচ্ছুরণ"], answerIndex: 0, topic: "ফাইবার" },
    { text: "বায়ু থেকে কাচে আলো যাওয়ার সময় আপতন কোণ 0° হলে প্রতিসরণ কোণ—", options: ["0°", "90°", "45°", "অসীম"], answerIndex: 0, topic: "প্রতিসরণ" },
    { text: "উত্তল লেন্স দ্বারা সৃষ্ট প্রতিবিম্ব সাধারণত—", options: ["ভার্চুয়াল ও সোজা", "বাস্তব ও উল্টো", "বাস্তব ও সোজা", "অসীম"], answerIndex: 0, topic: "লেন্স" },
    { text: "অবতল লেন্স দ্বারা সৃষ্ট প্রতিবিম্ব সাধারণত—", options: ["ভার্চুয়াল ও সোজা", "বাস্তব ও উল্টো", "বাস্তব ও সোজা", "অসীম"], answerIndex: 0, topic: "লেন্স" },
    { text: "P=1/f হলে f=20 cm লেন্সের ক্ষমতা কত?", options: ["5 D", "20 D", "0.05 D", "2 D"], answerIndex: 0, topic: "লেন্স" },
    { text: "পানির প্রতিসরাঙ্ক প্রায় 4/3 হলে শূন্য মাধ্যমে আলোর বেগ 3×10⁸ m/s হলে পানিতে বেগ প্রায়—", options: ["2.25×10⁸ m/s", "3×10⁸ m/s", "4×10⁸ m/s", "1.5×10⁸ m/s"], answerIndex: 0, topic: "প্রতিসরণ" },
  ],
  "10": [
    { text: "কুলম্ব সূত্র F=?", options: ["kq₁q₂/r²", "ma", "qV", "IR"], answerIndex: 0, topic: "স্থির বিদ্যুৎ" },
    { text: "স্থির বিদ্যুৎ ক্ষেত্রে E=?", options: ["F/q", "IR", "qV", "P/V"], answerIndex: 0, topic: "ক্ষেত্র" },
    { text: "q=2 C, V=10 V হলে শক্তি W=qV=?", options: ["20 J", "12 J", "5 J", "0.2 J"], answerIndex: 0, topic: "শক্তি" },
  ],
  "11": [
    { text: "ওহমের সূত্র V=?", options: ["IR", "I/R", "R/I", "I+R"], answerIndex: 0, topic: "ওহম" },
    { text: "I=3 A, R=4 Ω হলে V=?", options: ["12 V", "7 V", "1.33 V", "12 Ω"], answerIndex: 0, topic: "ওহম" },
    { text: "5Ω ও 10Ω রোধ শ্রেণিতে যুক্ত হলে তুল্য রোধ কত?", options: ["15 Ω", "3.33 Ω", "50 Ω", "5 Ω"], answerIndex: 0, topic: "রোধ" },
    { text: "6Ω ও 3Ω রোধ সমান্তরালে যুক্ত হলে তুল্য রোধ কত?", options: ["2 Ω", "9 Ω", "18 Ω", "3 Ω"], answerIndex: 0, topic: "রোধ" },
    { text: "তড়িৎ আধানের একক কী?", options: ["কুলম্ব", "ওহম", "ভোল্ট", "অ্যাম্পিয়ার"], answerIndex: 0, topic: "চার্জ" },
  ],
  "12": [
    { text: "চৌম্বক ক্ষেত্রের SI একক কোনটি?", options: ["টesla", "ওয়েবার", "অ্যাম্পিয়ার", "হেনরি"], answerIndex: 0, topic: "চৌম্বক" },
    { text: "ফ্লেমিংয়ের বামহস্ত নিয়ম কিসের দিক নির্ণয় করে?", options: ["বল", "বিভব", "তাপ", "চাপ"], answerIndex: 0, topic: "চৌম্বক" },
    { text: "ট্রান্সফরমারের মুখ্য ও গৌণ কুণ্ডলীর পাকসংখ্যার অনুপাত ১:১০। মুখ্য ভোল্টেজ ১০ ভোল্ট হলে গৌণ ভোল্টেজ কত?", options: ["100 V", "1 V", "10 V", "1000 V"], answerIndex: 0, topic: "ট্রান্সফরমার" },
    { text: "তড়িৎ চুম্বকীয় আবেশের নীতি কোন যন্ত্রে ব্যবহৃত হয়?", options: ["জেনারেটর", "ট্রান্সফরমার", "ফিউজ", "রেজিস্টর"], answerIndex: 0, topic: "আবেশ" },
    { text: "ডাইনামো বা জেনারেটর কী রূপান্তর করে?", options: ["যান্ত্রিক শক্তি → বিদ্যুৎ", "বিদ্যুৎ → যান্ত্রিক", "তাপ → বিদ্যুৎ", "আলো → বিদ্যুৎ"], answerIndex: 0, topic: "জেনারেটর" },
    { text: "ইলেকট্রিক মোটরে বিদ্যুৎ শক্তি কিসে রূপান্তরিত হয়?", options: ["যান্ত্রিক শক্তি", "তাপ শক্তি", "আলোক শক্তি", "রাসায়নিক শক্তি"], answerIndex: 0, topic: "মোটর" },
    { text: "চৌম্বক ক্ষেত্রের দিক নির্ণয়ে ব্যবহৃত হয়—", options: ["কম্পাস", "ভোল্টমিটার", "অ্যামিটার", "গ্যালভানোমিটার"], answerIndex: 0, topic: "চৌম্বক" },
    { text: "স্থায়ী চুম্বকের চৌম্বক ধাতু কোনটি?", options: ["ইস্পাত", "তামা", "অ্যালুমিনিয়াম", "সোনা"], answerIndex: 0, topic: "চুম্বক" },
    { text: "ফ্লেমিংয়ের ডানহস্ত নিয়ম কিসের দিক নির্ণয় করে?", options: ["তড়িৎ প্রবাহ", "চৌম্বক ক্ষেত্র", "বল", "তাপ"], answerIndex: 0, topic: "চৌম্বক" },
    { text: "ট্রান্সফরমার শুধু কোন বিদ্যুৎতে কাজ করে?", options: ["AC", "DC", "উভয়", "কোনোটিই নয়"], answerIndex: 0, topic: "ট্রান্সফরমার" },
  ],
  "13": [
    { text: "ট্রানজিস্টর কোন ধরনের যন্ত্র?", options: ["সেমিকন্ডাক্টর", "ভ্যাকিউম টিউব", "গ্যাস টিউব", "ধাতব"], answerIndex: 0, topic: "ইলেকট্রনিক্স" },
    { text: "e/m অনুপাত আবিষ্কার করেন—", options: ["থমসন", "রাদারফোর্ড", "বোর", "চাদউইক"], answerIndex: 0, topic: "আধুনিক পদার্থ" },
    { text: "রেডিওঅ্যাক্টিভ বিকিরণে আলফা রশ্মি কী?", options: ["হিলিয়াম নিউক্লিয়াস", "ইলেকট্রন", "ফোটন", "প্রোটন"], answerIndex: 0, topic: "রেডিওঅ্যাক্টিভ" },
    { text: "বিটা রশ্মি কী?", options: ["ইলেকট্রন", "হিলিয়াম নিউক্লিয়াস", "ফোটন", "নিউট্রন"], answerIndex: 0, topic: "রেডিওঅ্যাক্টিভ" },
    { text: "গামা রশ্মি কী?", options: ["উচ্চ শক্তির ফোটন", "ইলেকট্রন", "প্রোটন", "আলফা কণা"], answerIndex: 0, topic: "রেডিওঅ্যাক্টিভ" },
    { text: "আইসোটোপের সংজ্ঞা—", options: ["প্রোটন সংখ্যা সমান, নিউট্রন সংখ্যা ভিন্ন", "নিউট্রন সমান, প্রোটন ভিন্ন", "ইলেকট্রন সমান", "ভর সমান"], answerIndex: 0, topic: "আইসোটোপ" },
    { text: "p-n junction diode-এর প্রধান কাজ—", options: ["rectification", "amplification", "oscillation", "storage"], answerIndex: 0, topic: "ডায়োড" },
    { text: "ফটোইলেকট্রিক ক্রিয়ায় নির্গত হয়—", options: ["ইলেকট্রন", "প্রোটন", "নিউট্রন", "আলফা"], answerIndex: 0, topic: "ফটোইলেকট্রিক" },
    { text: "রেডিও তরঙ্গ কোন ধরনের তরঙ্গ?", options: ["তড়িৎচুম্বকীয়", "অগুণিত", "অক্ষীয়", "স্থির"], answerIndex: 0, topic: "রেডিও" },
    { text: "LED-এ আলো উৎপাদনের মূল কারণ—", options: ["electron-hole recombination", "তাপ", "প্রতিফলন", "প্রতিসরণ"], answerIndex: 0, topic: "LED" },
  ],
  "14": [
    { text: "X-ray ব্যবহৃত হয়—", options: ["ভেঙে পড়া হাড় দেখতে", "রক্তচাপ মাপতে", "শব্দ তৈরি", "তাপ মাপতে"], answerIndex: 0, topic: "প্রয়োগ" },
    { text: "অগ্নিনির্বাপক কাজে ব্যবহৃত গ্যাস—", options: ["CO₂", "O₂", "H₂", "N₂O"], answerIndex: 0, topic: "প্রয়োগ" },
    { text: "আল্ট্রাসাউন্ড ব্যবহৃত হয়—", options: ["অভ্যন্তরীণ অঙ্গের ইমেজিং", "হাড় ভাঙা নির্ণয়", "রক্ত গ্রুপ", "চোখের দৃষ্টি"], answerIndex: 0, topic: "চিকিৎসা" },
    { text: "ECG যন্ত্র দ্বারা পরীক্ষা করা হয়—", options: ["হৃদপিণ্ডের কার্যক্রম", "ফুসফুস", "বৃক্ক", "যকৃত"], answerIndex: 0, topic: "চিকিৎসা" },
    { text: "সোনার যন্ত্র কোন তরঙ্গ ব্যবহার করে?", options: ["আল্ট্রাসাউন্ড", "রেডিও", "X-ray", "গামা"], answerIndex: 0, topic: "সোনার" },
    { text: "MRI যন্ত্রে ব্যবহৃত হয়—", options: ["চৌম্বক ক্ষেত্র ও রেডিও তরঙ্গ", "X-ray", "আল্ট্রাভায়োলেট", "ইনফ্রারেড"], answerIndex: 0, topic: "MRI" },
    { text: "রক্তচাপ মাপার যন্ত্র—", options: ["স্ফাইগমোম্যানোমিটার", "থার্মোমিটার", "ব্যারোমিটার", "অ্যামিটার"], answerIndex: 0, topic: "চিকিৎসা" },
    { text: "লিফটে ভারসাম্য রাখতে ব্যবহৃত হয়—", options: ["কাউন্টারওয়েট", "স্প্রিং", "বেল্ট", "গিয়ার"], answerIndex: 0, topic: "প্রয়োগ" },
  ],
};

let _harvestedByChapter = null;
let _boardPaperPool = null;

function stripBoardNumberPrefix(text) {
  return String(text ?? "")
    .replace(/^[\d০-৯]+[.।]\s*/, "")
    .trim();
}

function readBoardAnswers(setId) {
  const ansPath = path.join(ANSWERS_DIR, `${setId}.answers.json`);
  try {
    return JSON.parse(fs.readFileSync(ansPath, "utf8"));
  } catch {
    return {};
  }
}

function normalizeOptionText(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .replace(/×/g, "x")
    .trim()
    .toLowerCase();
}

function resolveAnswerIndex(options, ans) {
  if (!ans) return 0;
  if (typeof ans.answerIndex === "number" && ans.answerIndex >= 0) return ans.answerIndex;
  const target = String(ans.correctOption ?? ans.answer ?? "").trim();
  if (!target) return 0;
  const opts = (options ?? []).map(String);
  let idx = opts.findIndex((o) => String(o).trim() === target);
  if (idx >= 0) return idx;
  idx = opts.findIndex((o) => normalizeOptionText(o) === normalizeOptionText(target));
  return idx >= 0 ? idx : 0;
}

/** Real board MCQ: self-contained, Bengali prose, not formula spam or orphan উদ্দীপক. */
function isStandaloneBoardMcq(text) {
  const t = stripBoardNumberPrefix(String(text ?? "").trim());
  if (!t || t.length < 25) return false;
  if (!/[\u0980-\u09FF]{6,}/.test(t)) return false;
  if (isOrphanBoardFragment(t)) return false;
  if (isParametricBoilerplate(t)) return false;
  if (/নং প্রশ্নের উত্তর|তথ্যের আলোকে/i.test(t)) return false;
  if (/^উদ্দীপক:/i.test(t)) return false;
  if (/^i\.\s/i.test(t) && /ii\.\s/i.test(t)) return false;
  if (/i\.\s/i.test(t) && /ii\.\s/i.test(t) && /নিচের কোন/i.test(t)) return false;
  if (/^P বস্তুটির-/i.test(t)) return false;
  if (/^বর্তনীটির ক্ষেত্রে-/i.test(t)) return false;
  if (/\\implies|imes ১০|K - 1\.6||প গ \+/i.test(t)) return false;
  if (/[A-Za-z]\s*-\s*1\.6\s*imes/i.test(t)) return false;
  if (/ধঃস|স–ত্র|চৌম্বক|রর\.|ররর\.|থোরিয়াম|উত্তর ২/.test(t)) return false;
  if (/---\s*$/.test(t)) return false;
  if (/উদ্দীপকের আলোকে/i.test(t)) return false;
  if (/C₁|ঋ₁|ঋ₂|10\^\{০\}/.test(t)) return false;
  if (/বিম্ব অসদ ও —/i.test(t)) return false;
  if (!/\?/.test(t) && t.length > 50) return false;
  if (/ব্\s*$|শতাংশ ব্/.test(t)) return false;
  if (/—\s*$/.test(t) && !/\?/.test(t)) return false;
  if (/^F=\d+\s*N,\s*s=\d/i.test(t)) return false;
  if (/^P=\d+\s*W,\s*t=/i.test(t)) return false;
  if (/^f=\d+\s*Hz,\s*λ=/i.test(t) && t.length < 55) return false;
  if (/^আলোর প্রতিফলনে আপতন কোণ—\s*$/.test(t)) return false;
  if (/^আলো শূন্য মাধ্যমে গেলে বেগ—\s*$/.test(t)) return false;
  return true;
}

function isBoardPaperQuality(item) {
  if (!isUsablePhysicsQuestion(item)) return false;
  if (!isStandaloneBoardMcq(item.text)) return false;
  return true;
}

function isUsablePhysicsQuestion(q) {
  const text = String(q.text ?? "").trim();
  if (!text || text.length < 18) return false;
  if (isBrokenPhysicsImport(text)) return false;
  if (isJunkQuestionText(text, "physics")) return false;
  if (/^\d+ km = \? m$/i.test(text)) return false;
  if (/^বিকৃতি—$/.test(text)) return false;
  if (/^যান্ত্রিক ত্রুটি—$/.test(text)) return false;
  if (/^আপেক্ষিক ত্রুটি—$/.test(text)) return false;
  if (/\+ \d+ = \?$/.test(text)) return false;
  if (!q.options || q.options.filter(Boolean).length < 4) return false;
  if (q.options.some((o) => /\+\s*\d+\s*$/.test(String(o).trim()))) return false;
  if (isParametricBoilerplate(text)) return false;
  if (isOrphanBoardFragment(text)) return false;
  return true;
}

/** Broken board import fragments, orphaned উদ্দীপক pairs, garbled stems. */
function isOrphanBoardFragment(text) {
  const t = String(text ?? "").trim();
  if (!t) return true;
  if (/^[\d০-৯]+\.\s/.test(t)) return true;
  if (/নং প্রশ্নের উত্তর|উদ্দীপকটি পড়|তথ্যের আলোকে/i.test(t)) return true;
  if (/^বিকৃতি—/i.test(t)) return true;
  if (/\(চিত্রভিত্তিক\)/i.test(t)) return true;
  if (/[¤š¯@]|স¤ক্স|¯@ম্ভ|হল|রাখা হল|msযোগ|দ–রে|imes ১০|\s*ঘ/i.test(t)) return true;
  if (/^i\.\s/i.test(t) && /ii\.\s/i.test(t) && !/^উদ্দীপক/i.test(t)) return true;
  if (/^[\u0980-\u09FF]{1,12}-$/m.test(t) && /i\.\s/i.test(t)) return true;
  return false;
}

/** Auto-generated paper-set spam (not real board MCQs). */
function isParametricBoilerplate(text) {
  const t = String(text ?? "").trim();
  if (!t) return false;
  if (/একটি বস্তুর আদিবেগ \d+ m\/s এবং শেষবেগ \d+ m\/s/.test(t)) return true;
  if (/\d+ kg ভরের বস্তুর উপর \d+ N বল প্রয়োগ করলে ত্বরণ/.test(t)) return true;
  if (/সমমানের দুটি রোধ \d+ Ω ও \d+ Ω সমান্তরালে/.test(t)) return true;
  if (/কম্পাঙ্ক \d+ Hz এবং তরঙ্গদৈর্ঘ্য \d+ m হলে তরঙ্গবেগ/.test(t)) return true;
  if (/\d+ C আধানকে \d+ V বিভব পার্থক্যে সরালে কাজ/.test(t)) return true;
  if (/\d+ kg ভরের বস্তু \d+ m উচ্চতায় তুললে বিভব শক্তি/.test(t)) return true;
  if (/\d+ W ক্ষমতার যন্ত্র \d+ s চললে শক্তি ব্যয়/.test(t)) return true;
  if (/^i,\s*ii,\s*iii বিবেচনা করো:/i.test(t)) return true;
  return false;
}

function isFakePaperPremiumImage(image) {
  const s = String(image ?? "").trim();
  if (!s) return false;
  return /\/ssc-physics-paper-set-\d+-q\d+\.svg$/i.test(s)
    || /\/hsc-physics-2nd-paper-set-\d+-q\d+\.svg$/i.test(s);
}

function sanitizePhysicsQuestion(q) {
  const image = sanitizePhysicsImage(q.image ?? null, q.text ?? "");
  return {
    ...q,
    image,
    options: (q.options ?? []).map((o) => String(o).trim()),
  };
}

const TRUSTED_PHYSICS_DIAGRAM_RE =
  /^\/images\/quiz\/(ssc-[a-z0-9-]+|cell-terminal-pd|series-lcr|young-double-slit-1)\.svg$/i;

function sanitizePhysicsImage(image, text) {
  if (!image || isFakePaperPremiumImage(image)) return null;
  const s = String(image);
  if (/\/premium\//i.test(s)) return null;
  if (/\/circuit-series\.svg|\/circuit-parallel\.svg|\/wave-transverse\.svg/i.test(s)) {
    return null;
  }
  if (TRUSTED_PHYSICS_DIAGRAM_RE.test(s)) {
    if (
      /চিত্রে|উদ্দীপকের\s*চিত্র|উপরের\s*চিত্র|\(চিত্রভিত্তিক\)|\[চিত্র|\(চিত্র/i.test(
        String(text),
      )
    ) {
      return s;
    }
    return null;
  }
  if (!/চিত্র|চিত্রভিত্তিক|উদ্দীপক:|লেখচিত্র|\(চিত্র/i.test(String(text))) {
    return null;
  }
  return image;
}

/** Same board formula with different numbers counts as one template. */
function templateKeyForDedup(text) {
  return String(text ?? "")
    .replace(/\$[^$]+\$/g, " ")
    .replace(/[০-৯0-9]+(?:[.,][০-৯0-9]+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function canAddToPhysicsSet(item, seen, templateSeen, usedGlobal = null) {
  const key = normalizeStemForDedup(item.text);
  const template = templateKeyForDedup(item.text);
  if (seen.has(key)) return false;
  if (templateSeen.has(template)) return false;
  if (usedGlobal?.has(key)) return false;
  return true;
}

function markPhysicsQuestionUsed(item, seen, templateSeen, usedGlobal = null) {
  const key = normalizeStemForDedup(item.text);
  const template = templateKeyForDedup(item.text);
  seen.add(key);
  templateSeen.add(template);
  if (usedGlobal) usedGlobal.add(key);
}

function harvestBoardQuestions() {
  if (_harvestedByChapter) return _harvestedByChapter;
  const byChapter = {};
  for (let ch = 1; ch <= 14; ch++) {
    byChapter[String(ch).padStart(2, "0")] = [];
  }

  if (!fs.existsSync(QUESTIONS_DIR)) {
    _harvestedByChapter = byChapter;
    return byChapter;
  }

  const seen = new Set();
  for (const file of fs.readdirSync(QUESTIONS_DIR)) {
    if (!/^[a-z]+-\d{4}\.json$/.test(file)) continue;
    const setId = file.replace(".json", "");
    const ansPath = path.join(ANSWERS_DIR, `${setId}.answers.json`);
    if (!fs.existsSync(ansPath)) continue;
    const answers = readBoardAnswers(setId);
    const raw = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), "utf8"));
    raw.forEach((q, i) => {
      const text = stripBoardNumberPrefix(String(q.text ?? "").trim());
      const key = normalizeStemForDedup(text);
      if (seen.has(key)) return;
      const qid = q.id ?? `${setId}-q${String(i + 1).padStart(2, "0")}`;
      const ans = answers[qid];
      const options = (q.options ?? []).map(String);
      const item = {
        text,
        options,
        answerIndex: resolveAnswerIndex(options, ans),
        explanation: ans?.explanation ?? "",
        image: q.image ?? null,
        topic: ans?.topic ?? "",
        source: setId,
      };
      if (!isUsablePhysicsQuestion(item)) return;
      seen.add(key);
      const ch = mapPhysicsChapter(text) ?? "01";
      byChapter[ch].push(item);
    });
  }

  _harvestedByChapter = byChapter;
  return byChapter;
}

function getPhysicsChapterPool(chapterNo) {
  const ch = String(chapterNo).padStart(2, "0");
  const harvested = harvestBoardQuestions()[ch] ?? [];
  const curated = CURATED_BY_CHAPTER[ch] ?? [];
  const seen = new Set();
  const pool = [];
  for (const q of [...harvested, ...curated]) {
    const key = normalizeStemForDedup(q.text);
    if (seen.has(key)) continue;
    seen.add(key);
    pool.push({ ...q, topic: q.topic || "" });
  }
  return pool;
}

function buildPhysicsSet(chapterNo, chapterName, setNo, existingQuestions = []) {
  const pool = getPhysicsChapterPool(chapterNo);
  const seen = new Set();
  const out = [];

  for (const q of existingQuestions) {
    const item = sanitizePhysicsQuestion(q);
    if (!isUsablePhysicsQuestion(item)) continue;
    const key = normalizeStemForDedup(item.text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      text: item.text,
      options: item.options,
      answerIndex: item.answerIndex ?? 0,
      explanation: item.explanation ?? "",
      topic: item.topic ?? chapterName,
      image: item.image ?? null,
    });
    if (out.length >= 25) break;
  }

  const offset = (setNo - 1) * 31;
  let scan = 0;
  while (out.length < 25 && scan < pool.length * 4 + 50) {
    if (!pool.length) break;
    const q = pool[(offset + scan) % pool.length];
    scan++;
    if (!q) continue;
    const item = sanitizePhysicsQuestion(q);
    if (!isUsablePhysicsQuestion(item)) continue;
    const key = normalizeStemForDedup(item.text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      text: item.text,
      options: item.options,
      answerIndex: item.answerIndex ?? 0,
      explanation: item.explanation ?? "",
      topic: item.topic || chapterName,
      image: item.image ?? null,
    });
  }

  return out.slice(0, 25);
}

function getBoardPaperPool() {
  if (_boardPaperPool) return _boardPaperPool;
  const seen = new Set();
  const pool = [];

  if (!fs.existsSync(QUESTIONS_DIR)) {
    _boardPaperPool = pool;
    return pool;
  }

  for (const file of fs.readdirSync(QUESTIONS_DIR)) {
    if (!/^[a-z]+-\d{4}\.json$/.test(file)) continue;
    const setId = file.replace(".json", "");
    const ansPath = path.join(ANSWERS_DIR, `${setId}.answers.json`);
    if (!fs.existsSync(ansPath)) continue;
    const answers = readBoardAnswers(setId);
    const raw = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), "utf8"));
    raw.forEach((q, i) => {
      const text = stripBoardNumberPrefix(String(q.text ?? "").trim());
      const key = normalizeStemForDedup(text);
      if (seen.has(key)) return;
      const qid = q.id ?? `${setId}-q${String(i + 1).padStart(2, "0")}`;
      const options = (q.options ?? []).map(String);
      const ans = answers[qid];
      const item = sanitizePhysicsQuestion({
        text,
        options,
        answerIndex: resolveAnswerIndex(options, ans),
        explanation: ans?.explanation ?? "",
        image: q.image ?? null,
        topic: ans?.topic ?? mapPhysicsChapter(text) ?? "",
        source: setId,
        chapter: mapPhysicsChapter(text) ?? "01",
      });
      if (!isBoardPaperQuality(item)) return;
      seen.add(key);
      pool.push(item);
    });
  }

  _boardPaperPool = pool;
  return pool;
}

function getFullPhysicsPaperPool() {
  return getBoardPaperPool();
}

/** Full SSC Physics paper — board questions only (real exam style). */
function buildPhysicsPaperSet(setNo, usedGlobal = new Set()) {
  const TARGET = 25;
  const allowCrossSetReuse = setNo >= 14;
  const boardPool = getBoardPaperPool();
  const byChapter = {};
  for (let ch = 1; ch <= 14; ch++) {
    byChapter[String(ch).padStart(2, "0")] = [];
  }
  for (const q of boardPool) {
    const ch = String(q.chapter ?? mapPhysicsChapter(q.text) ?? "01").padStart(2, "0");
    byChapter[ch].push(q);
  }

  const out = [];
  const seen = new Set();
  const templateSeen = new Set();

  function tryAdd(q) {
    const item = sanitizePhysicsQuestion(q);
    if (!isBoardPaperQuality(item)) return false;
    const key = normalizeStemForDedup(item.text);
    const template = templateKeyForDedup(item.text);
    if (seen.has(key) || templateSeen.has(template)) return false;
    if (!allowCrossSetReuse && usedGlobal.has(key)) return false;
    seen.add(key);
    templateSeen.add(template);
    if (!allowCrossSetReuse) usedGlobal.add(key);
    out.push(item);
    return true;
  }

  for (let round = 0; round < 2 && out.length < TARGET; round++) {
    for (let ch = 1; ch <= 14 && out.length < TARGET; ch++) {
      const chKey = String(ch).padStart(2, "0");
      const pool = byChapter[chKey] ?? [];
      if (!pool.length) continue;
      const start = (setNo - 1) * 13 + ch * 5 + round * 3;
      for (let j = 0; j < pool.length; j++) {
        if (tryAdd(pool[(start + j) % pool.length])) break;
      }
    }
  }

  let scan = 0;
  while (out.length < TARGET && scan < boardPool.length * 3 + 100) {
    const q = boardPool[(setNo * 53 + scan * 11) % Math.max(boardPool.length, 1)];
    scan++;
    if (q) tryAdd(q);
  }

  return out.slice(0, TARGET);
}

module.exports = {
  CURATED_BY_CHAPTER,
  harvestBoardQuestions,
  getBoardPaperPool,
  getPhysicsChapterPool,
  getFullPhysicsPaperPool,
  buildPhysicsSet,
  buildPhysicsPaperSet,
  isUsablePhysicsQuestion,
  isBoardPaperQuality,
  isStandaloneBoardMcq,
  resolveAnswerIndex,
  isParametricBoilerplate,
  isOrphanBoardFragment,
  isFakePaperPremiumImage,
  templateKeyForDedup,
  sanitizePhysicsQuestion,
  sanitizePhysicsImage,
};
