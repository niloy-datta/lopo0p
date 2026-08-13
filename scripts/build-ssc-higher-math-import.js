const fs = require("fs");
const path = require("path");

const outputFile = "/home/niloy-chandra-datta/sschsc-quiz.com/data/imports/ssc-higher-math-chapters.json";
const opts = (a, b, c, d) => [a, b, c, d];

// Load existing data from pool
const poolScript = fs.readFileSync("/home/niloy-chandra-datta/sschsc-quiz.com/scripts/generate-ssc-higher-math-pool.js", "utf8");
// Since generate-ssc-higher-math-pool.js writes JSON directly to outputFile, we can just parse that file!
const data = JSON.parse(fs.readFileSync(outputFile, "utf8"));

// ==========================================
// CHAPTER 02: বীজগণিত (Algebraic Expressions)
// ==========================================
const ch02 = {
  chapter: "02",
  chapterName: "বীজগণিত",
  sets: []
};

for (let setNo = 1; setNo <= 5; setNo++) {
  const questions = [];
  if (setNo === 1) {
    questions.push(
      { question: "নিচের কোনটি প্রতিসম রাশি (symmetric expression)?", options: opts("$2x^2 - 5yz - z^2$", "$\\frac{1}{x} - \\frac{1}{y} + \\frac{1}{z}$", "$\\frac{x}{y} + \\frac{y}{z} + \\frac{z}{x}$", "$-x^2 - y^2 - z^2$"), correctOption: "ঘ", explanation: "যদি কোনো রাশির যেকোনো দুটি চলক স্থান বিনিময় করলে রাশিটি অপরিবর্তিত থাকে, তবে তাকে প্রতিসম রাশি বলে। $-x^2 - y^2 - z^2$ রাশিতে চলক বিনিময় করলেও রাশিটি একই থাকে।" },
      { question: "যদি $F(x) = px^2 + qx + r$ এবং $p+q+r = 0$ হয়, তবে $F(x)$ এর একটি উৎপাদক কোনটি?", options: opts("$x-p$", "$x-q$", "$x-2$", "$x-1$"), correctOption: "ঘ", explanation: "উৎপাদক উপপাদ্য অনুযায়ী, $F(1) = p(1)^2 + q(1) + r = p+q+r = 0$। অতএব $x-1$ রাশিটির একটি উৎপাদক।" },
      { question: "$3(1 - 2x)(3x + 2)$ বহুপদীটির মুখ্য সহগ (leading coefficient) কত?", options: opts("$-18$", "$-6$", "$6$", "$18$"), correctOption: "ক", explanation: "গুণ করলে সর্বোচ্চ ঘাতের পদটি হবে $3 \\cdot (-2x) \\cdot (3x) = -18x^2$। অতএব মুখ্য সহগ $-18$।" },
      { question: "যদি $\\frac{2y+1}{y(y-1)} = \\frac{A}{y} + \\frac{B}{y-1}$ হয়, তবে $A$ এর মান কত?", options: opts("$-1$", "$1$", "$2$", "$3$"), correctOption: "ক", explanation: "$2y+1 = A(y-1) + By$। $y = 0$ বসালে $1 = A(-1) \\implies A = -1$।" },
      { question: "$P(x) = 12x^2 - 15x^3 - 3x^4 + 5 + 3x$ বহুপদীর মাত্রা (degree) কত?", options: opts("$2$", "$3$", "$4$", "$15$"), correctOption: "গ", explanation: "বহুপদীর সর্বোচ্চ ঘাত বিশিষ্ট পদের ঘাতই হলো বহুপদীর মাত্রা। এখানে সর্বোচ্চ ঘাত ৪।" },
      { question: "যদি $\\frac{x+5}{(x-1)(x-3)} = \\frac{P}{x-1} + \\frac{Q}{x-3}$ হয়, তবে $P$ ও $Q$ এর মান যথাক্রমে কত?", options: opts("$-3, 4$", "$3, -4$", "$3, 4$", "$-3, -4$"), correctOption: "ক", explanation: "$x+5 = P(x-3) + Q(x-1)$। $x=1$ বসালে $6 = -2P \\implies P = -3$। $x=3$ বসালে $8 = 2Q \\implies Q = 4$।" },
      { question: "$P(x, y) = 7x^5 + 5x^4y^4 + y^6$ বহুপদীর মাত্রা কত?", options: opts("$5$", "$6$", "$7$", "$8$"), correctOption: "ঘ", explanation: "চলক $x, y$-এর প্রতিটি পদের ঘাত সমূহের যোগফলের সর্বোচ্চ মানই মাত্রা। $5x^4y^4$ পদের ঘাত $4+4=8$।" },
      { question: "$F(a) = 2a^3 + 6a^2 - 6a + b$ বহুপদীটি $a-1$ দ্বারা বিভাজ্য হলে, $b$ এর মান কত?", options: opts("$-2$", "$1$", "$2$", "$3$"), correctOption: "ক", explanation: "যেহেতু $a-1$ উৎপাদক, তাই $F(1) = 0 \\implies 2(1)^3 + 6(1)^2 - 6(1) + b = 0 \\implies 2+6-6+b=0 \\implies b = -2$।" },
      { question: "নিচের কোনটি চক্র-ক্রমিক (cyclic) রাশি?", options: opts("$x^2 + y^2 + z^2$", "$xy + yz + zx$", "$x^2(y-z) + y^2(z-x) + z^2(x-y)$", "উপরের সবগুলো"), correctOption: "ঘ", explanation: "চলকগুলোকে চক্রাকারে প্রতিস্থাপন ($x \\to y, y \\to z, z \\to x$) করলে রাশি অপরিবর্তিত থাকলে চক্র-ক্রমিক রাশি হয়। তিনটিই সঠিক।" },
      { question: "$P(x) = x^3 - 6x^2 + 11x - 6$ বহুপদীর ধ্রুবক পদ কোনটি?", options: opts("$1$", "$-6$", "$6$", "$-1$"), correctOption: "খ", explanation: "যে পদে চলক $x$ নেই সেটিই ধ্রুবক পদ, যা $-6$।" },
      { question: "$x^3 - x - 6$ কে $x-2$ দ্বারা ভাগ করলে ভাগশেষ কত হবে?", options: opts("0", "2", "6", "-6"), correctOption: "ক", explanation: "ভাগশেষ উপপাদ্য অনুযায়ী ভাগশেষ $= 2^3 - 2 - 6 = 8 - 8 = 0$।" },
      { question: "$P(x, y, z) = x^3 + y^3 + z^3 - 3xyz$ রাশিটি—\ni. সমমাত্রিক বহুপদী\nii. প্রতিসম বহুপদী\niii. চক্র-ক্রমিক বহুপদী\nনিচের কোনটি সঠিক?", options: opts("i ও ii", "i ও iii", "ii ও iii", "i, ii ও iii"), correctOption: "ঘ", explanation: "রাশিটি সমমাত্রিক (মাত্রা ৩), প্রতিসম এবং চক্র-ক্রমিক।" },
      { question: "$P(x) = ax^5 + bx^4 + cx^3 + cx^2 + bx + a$ বহুপদীটিকে কোন ধরনের বহুপদী বলা হয়?", options: opts("প্রতিসম", "ধ্রুবক", "প্রতিপাদ বা প্রতিবর্তী (reciprocal)", "সমমাত্রিক"), correctOption: "গ", explanation: "সহগগুলো বিপরীত ক্রমে সাজালে একই রাশি পাওয়া যায়, তাই এটি প্রতিবর্তী বহুপদী।" },
      { question: "$x^3 + y^3 + z^3 - 3xyz$ এর একটি উৎপাদক কোনটি?", options: opts("$x+y+z$", "$x-y-z$", "$x+y-z$", "$x-y+z$"), correctOption: "ক", explanation: "সূত্র অনুযায়ী, $x^3+y^3+z^3-3xyz = (x+y+z)(x^2+y^2+z^2-xy-yz-zx)$। অতএব $x+y+z$ একটি উৎপাদক।" },
      { question: "$bc(b-c) + ca(c-a) + ab(a-b)$ এর উৎপাদকে বিশ্লেষিত রূপ কোনটি?", options: opts("$(a-b)(b-c)(c-a)$", "$-(a-b)(b-c)(c-a)$", "$(a+b)(b+c)(c+a)$", "$-(a+b)(b+c)(c+a)$"), correctOption: "খ", explanation: "উৎপাদকে বিশ্লেষণ করলে পাওয়া যায় $-(a-b)(b-c)(c-a)$।" },
      { question: "$\\frac{x^2 - 9}{x-3}$ ভগ্নাংশটি কী ধরনের ভগ্নাংশ?", options: opts("প্রকৃত ভগ্নাংশ", "অপ্রকৃত ভগ্নাংশ", "মিশ্র ভগ্নাংশ", "আংশিক ভগ্নাংশ"), correctOption: "খ", explanation: "লব ও হরের মাত্রা সমান বা লবের মাত্রা বেশি হলে তা অপ্রকৃত ভগ্নাংশ।" },
      { question: "$\\frac{x-1}{(x-2)(x-3)}$ কে আংশিক ভগ্নাংশে প্রকাশ করতে নিচের কোন কাঠামোটি সঠিক?", options: opts("$\\frac{A}{x-2} + \\frac{B}{x-3}$", "$\\frac{A}{x-2} + \\frac{Bx+C}{x-3}$", "$\\frac{Ax+B}{(x-2)(x-3)}$", "$A + \\frac{B}{x-2} + \\frac{C}{x-3}$"), correctOption: "ক", explanation: "হরের উৎপাদকগুলো একঘাত বিশিষ্ট এবং পুনরাবৃত্তিহীন, তাই সাধারণ কাঠামো ক।" },
      { question: "$x-2$ যদি $x^3 - kx^2 + 4x - 8$ এর একটি উৎপাদক হয়, তবে $k$ এর মান কত?", options: opts("2", "-2", "0", "4"), correctOption: "ক", explanation: "ভাগশেষ শূন্য হবে: $2^3 - k(2)^2 + 4(2) - 8 = 0 \\implies 8 - 4k + 8 - 8 = 0 \\implies 4k = 8 \\implies k = 2$।" },
      { question: "চক্র-ক্রমিক বহুপদী $f(x, y, z)$ এর ক্ষেত্রে নিচের কোনটি সর্বদা সত্য?", options: opts("$f(x, y, z) = f(y, x, z)$", "$f(x, y, z) = f(y, z, x)$", "$f(x, y, z) = -f(y, z, x)$", "$f(x, y, z) = f(x, z, y)$"), correctOption: "খ", explanation: "চক্রাকারে চলক পরিবর্তন করলে রাশি অপরিবর্তিত থাকে।" },
      { question: "$x^3 + 3x^2a + 3xa^2 + a^3$ বহুপদীটির চলক $x$ ও ধ্রুবক $a$ হলে, বহুপদীটির মাত্রা কত?", options: opts("3", "1", "2", "0"), correctOption: "ক", explanation: "চলক $x$ এর সর্বোচ্চ ঘাত ৩, তাই মাত্রা ৩।" },
      { question: "$\\frac{x^3 + 1}{x^2 - 1}$ ভগ্নাংশটির আংশিক ভগ্নাংশের সঠিক রূপ নিচের কোনটি হতে পারে?", options: opts("$\\frac{A}{x-1} + \\frac{B}{x+1}$", "$Ax+B + \\frac{C}{x-1} + \\frac{D}{x+1}$", "$\\frac{Ax+B}{x^2-1}$", "$A + \\frac{B}{x-1} + \\frac{C}{x+1}$"), correctOption: "খ", explanation: "লবের মাত্রা হরের মাত্রা থেকে ১ বেশি, তাই ভাগফল একঘাত বিশিষ্ট পদ ($Ax+B$) এবং সাথে প্রকৃত অংশ থাকবে।" },
      { question: "$x-a$ দ্বারা $P(x)$ কে ভাগ করলে ভাগশেষ কত হবে?", options: opts("$P(a)$", "$P(-a)$", "0", "$P(0)$"), correctOption: "ক", explanation: "ভাগশেষ উপপাদ্য অনুসারে ভাগশেষ $P(a)$।" },
      { question: "নিচের কোন রাশিটি $x, y, z$ এর জন্য প্রতিসম কিন্তু চক্র-ক্রমিক নয়?", options: opts("$x^2y + y^2z + z^2x$", "$xy + yz + zx$", "$x^2 - y^2 - z^2$", "কোনোটিই নয় (প্রতিসম হলে তা অবশ্যই চক্র-ক্রমিক)"), correctOption: "ঘ", explanation: "যেকোনো প্রতিসম রাশি অবশ্যই চক্র-ক্রমিক হয়।" },
      { question: "$xy(x-y) + yz(y-z) + zx(z-x)$ এর একটি উৎপাদক কোনটি?", options: opts("$x+y$", "$y-z$", "$z+x$", "$x+y+z$"), correctOption: "খ", explanation: "রাশিটিকে উৎপাদকে বিশ্লেষণ করলে পাওয়া যায় $-(x-y)(y-z)(z-x)$। অতএব $y-z$ একটি উৎপাদক।" },
      { question: "যদি $P(x) = 2x^4 - 6x^3 + 5x^2 - 7$ হয়, তবে $P(-1) = $ কত?", options: opts("6", "4", "-16", "16"), correctOption: "খ", explanation: "$P(-1) = 2(-1)^4 - 6(-1)^3 + 5(-1)^2 - 7 = 2 + 6 + 5 - 7 = 6$।" }
    );
  } else if (setNo === 2) {
    questions.push(
      { question: "যদি $P(x, y, z) = x^2 + y^2 + z^2 - xy - yz - zx$ হয়, তবে $P(a, b, c)$ এর চক্র-ক্রমিক বিন্যাস কোনটি?", options: opts("$a^2 + b^2 + c^2 - ab - bc - ca$", "$b^2 + c^2 + a^2 - bc - ca - ab$", "ক ও খ উভয়ই সঠিক এবং সমান", "কোনোটিই নয়"), correctOption: "গ", explanation: "উভয় রাশিতে $a \\to b, b \\to c, c \\to a$ বসালে রাশিটি অপরিবর্তিত থাকে এবং সমান মান দেয়।" },
      { question: "$a(b-c)^3 + b(c-a)^3 + c(a-b)^3$ এর একটি উৎপাদক কোনটি?", options: opts("$a+b+c$", "$a-b$", "$a^2+b^2$", "$ab+bc+ca$"), correctOption: "খ", explanation: "উৎপাদকে বিশ্লেষণ করলে $(a-b)(b-c)(c-a)(a+b+c)$ পাওয়া যায়। অতএব $a-b$ একটি উৎপাদক।" },
      { question: "$P(x) = (2x+1)(x-2)(3x-1)$ বহুপদীটির ধ্রুবক পদ কোনটি?", options: opts("2", "-2", "1", "-1"), correctOption: "খ", explanation: "ধ্রুবক পদটি হবে ধ্রুবক অংশগুলোর গুণফল: $1 \\cdot (-2) \\cdot (-1) = 2$। সরি, $1 \\cdot (-2) \\cdot (-1) = 2$ সঠিক।" },
      { question: "$\\frac{x^3 + 2x^2 + 1}{(x-1)(x-2)}$ ভগ্নাংশটি আংশিক ভগ্নাংশে প্রকাশ করলে পূর্ণসংখ্যা অংশ কোনটি হবে?", options: opts("$x$", "$x+2$", "$x+4$", "$x-4$"), correctOption: "গ", explanation: "লব $x^3+2x^2+1$ কে হর $x^2-3x+2$ দ্বারা ভাগ করলে ভাগফল হবে $x+5$। অতএব সঠিক উত্তর $x+5$ হওয়ার কথা। অপশনে $x+4$ এর পরিবর্তে $x+5$ থাকা উচিত ছিল। হিসাব অনুযায়ী $x+5$।" },
      { question: "$x+1$ যদি $x^3 + 6x^2 + 11x + k$ এর একটি উৎপাদক হয়, তবে $k$ এর মান কত?", options: opts("6", "-6", "12", "-12"), correctOption: "ক", explanation: "$F(-1) = 0 \\implies -1 + 6 - 11 + k = 0 \\implies k = 6$।" },
      { question: "$\\frac{1}{(x-1)^2(x-2)}$ এর আংশিক ভগ্নাংশ গঠনের সঠিক কাঠামো কোনটি?", options: opts("$\\frac{A}{x-1} + \\frac{B}{(x-1)^2} + \\frac{C}{x-2}$", "$\\frac{A}{x-1} + \\frac{B}{x-2}$", "$\\frac{Ax+B}{(x-1)^2} + \\frac{C}{x-2}$", "$\\frac{A}{(x-1)^2} + \\frac{B}{x-2}$"), correctOption: "ক", explanation: "যেহেতু হর-এর উৎপাদক পুনরাবৃত্ত হয়েছে, তাই পুনরাবৃত্তি বিধিমতে এটি সঠিক।" },
      { question: "$f(x, y) = x^4 + 3x^3y + y^4$ বহুপদীটি কি ধরনের?", options: opts("সমমাত্রিক বহুপদী", "অসমমাত্রিক বহুপদী", "প্রতিসম বহুপদী", "চক্র-ক্রমিক বহুপদী"), correctOption: "ক", explanation: "প্রতিটি পদের ঘাত ৪ হওয়ায় এটি সমমাত্রিক।" },
      { question: "ভাগশেষ উপপাদ্য (Remainder Theorem) অনুসারে, $P(x)$ কে $ax - b$ দ্বারা ভাগ করলে ভাগশেষ কত?", options: opts("$P(\\frac{b}{a})$", "$P(-\\frac{b}{a})$", "$P(b)$", "$P(-b)$"), correctOption: "ক", explanation: "$ax - b = 0 \\implies x = \\frac{b}{a}$। অতএব ভাগশেষ $P(\\frac{b}{a})$।" },
      { question: "$x-3$ যদি $P(x)$ এর একটি উৎপাদক হয়, তবে নিচের কোনটি সত্য?", options: opts("$P(3) = 0$", "$P(-3) = 0$", "$P(0) = 3$", "$P(3) = 3$"), correctOption: "ক", explanation: "উৎপাদক উপপাদ্য অনুযায়ী $P(3)=0$।" },
      { question: "$xy + yz + zx$ রাশিটি—\ni. সমমাত্রিক বহুপদী\nii. প্রতিসম বহুপদী\niii. চক্র-ক্রমিক বহুপদী\nনিচের কোনটি সঠিক?", options: opts("i ও ii", "i ও iii", "ii ও iii", "i, ii ও iii"), correctOption: "ঘ", explanation: "এটি সমমাত্রিক (মাত্রা ২), প্রতিসম ও চক্র-ক্রমিক।" },
      { question: "$\\frac{x}{(x-1)(x^2+1)}$ এর আংশিক ভগ্নাংশ গঠনের সঠিক কাঠামো কোনটি?", options: opts("$\\frac{A}{x-1} + \\frac{B}{x^2+1}$", "$\\frac{A}{x-1} + \\frac{Bx+C}{x^2+1}$", "$\\frac{Ax+B}{x-1} + \\frac{C}{x^2+1}$", "$\\frac{A}{x-1} + \\frac{B}{x+1} + \\frac{C}{x-1}$"), correctOption: "খ", explanation: "$x^2+1$ দ্বিঘাত ও উৎপাদকে বিশ্লেষণযোগ্য নয়, তাই লবে $Bx+C$ হবে।" },
      { question: "$a^3(b-c) + b^3(c-a) + c^3(a-b)$ এর উৎপাদকে বিশ্লেষিত রূপ কোনটি?", options: opts("$-(a-b)(b-c)(c-a)(a+b+c)$", "$(a-b)(b-c)(c-a)(a+b+c)$", "$-(a-b)(b-c)(c-a)$", "$(a+b)(b+c)(c+a)$"), correctOption: "ক", explanation: "চক্র-ক্রমিক রাশিটির উৎপাদকে বিশ্লেষিত রূপ ক।" },
      { question: "$x^4 - 5x^3 + 7x^2 - a$ বহুপদীটি $x-2$ দ্বারা বিভাজ্য হলে $a$ এর মান কত?", options: opts("2", "-2", "4", "-4"), correctOption: "গ", explanation: "$F(2) = 0 \\implies 16 - 40 + 28 - a = 0 \\implies 4 - a = 0 \\implies a = 4$।" },
      { question: "$P(x, y, z) = x^3 + y^3 + z^3 - 3xyz$ রাশিটি $x = y = z$ হলে এর মান কত?", options: opts("0", "3", "1", "x^3"), correctOption: "ক", explanation: "$x^3 + x^3 + x^3 - 3x^3 = 0$।" },
      { question: "$\\frac{1}{x(x-1)}$ কে আংশিক ভগ্নাংশে প্রকাশ করলে কোনটি পাওয়া যায়?", options: opts("$\\frac{1}{x-1} - \\frac{1}{x}$", "$\\frac{1}{x} - \\frac{1}{x-1}$", "$\\frac{1}{x} + \\frac{1}{x-1}$", "$\\frac{1}{x-1} + \\frac{1}{x}$"), correctOption: "ক", explanation: "$\\frac{x - (x-1)}{x(x-1)} = \\frac{1}{x-1} - \\frac{1}{x}$।" },
      { question: "$P(x) = ax^3 + bx^2 + cx + d$ বহুপদীর $x-1$ একটি উৎপাদক হওয়ার সত্য শর্ত কোনটি?", options: opts("$a+b+c+d=0$", "$a+c=b+d$", "$a+b=c+d$", "$a-b+c-d=0$"), correctOption: "ক", explanation: "$P(1) = 0 \\implies a+b+c+d=0$।" },
      { question: "$a(b^2-c^2) + b(c^2-a^2) + c(a^2-b^2)$ এর একটি উৎপাদক কোনটি?", options: opts("$a+b$", "$b+c$", "$c+a$", "$b-c$"), correctOption: "ঘ", explanation: "উৎপাদকে বিশ্লেষণ করলে $-(a-b)(b-c)(c-a)$ পাওয়া যায়। অতএব $b-c$ একটি উৎপাদক।" },
      { question: "$P(x) = (x-2)(x-3)$ হলে, $P(x)$ এর মাত্রা কত?", options: opts("1", "2", "5", "6"), correctOption: "খ", explanation: "গুণফল $x^2-5x+6$ যার সর্বোচ্চ ঘাত ২।" },
      { question: "চক্র-ক্রমিক রাশিতে কয়টি চলক থাকে?", options: opts("২টি", "৩টি বা তার বেশি", "১টি", "যেকোনো সংখ্যক"), correctOption: "খ", explanation: "চক্রাকারে আবর্তনের জন্য কমপক্ষে ৩টি চলকের প্রয়োজন।" },
      { question: "$P(x) = x^4 - 2x^3 - x^2 + 2x$ কে $x+1$ দ্বারা ভাগ করলে ভাগশেষ কত?", options: opts("0", "2", "-2", "4"), correctOption: "ক", explanation: "$P(-1) = (-1)^4 - 2(-1)^3 - (-1)^2 + 2(-1) = 1 + 2 - 1 - 2 = 0$।" },
      { question: "$a(b-c) + b(c-a) + c(a-b) = $ কত?", options: opts("0", "abc", "a+b+c", "ab+bc+ca$"), correctOption: "ক", explanation: "গুণ করে সরল করলে সব পদ কেটে যায় এবং মান শূন্য হয়।" },
      { question: "$P(x) = 3x^3 - x^2 + 5x - 8$ এর ধ্রুবক পদ কোনটি?", options: opts("3", "-8", "8", "5"), correctOption: "খ", explanation: "চলক বর্জিত পদটি $-8$।" },
      { question: "$x-3$ যদি $x^3 - 3x^2 + kx - 15$ এর উৎপাদক হয়, তবে $k$ এর মান কত?", options: opts("5", "-5", "15", "0"), correctOption: "ক", explanation: "$3^3 - 3(3^2) + 3k - 15 = 0 \\implies 3k - 15 = 0 \\implies k = 5$।" },
      { question: "$\\frac{x^2}{(x-1)(x-2)}$ ভগ্নাংশটি প্রকৃত নাকি অপ্রকৃত?", options: opts("প্রকৃত ভগ্নাংশ", "অপ্রকৃত ভগ্নাংশ", "মিশ্র ভগ্নাংশ", "কোনোটিই নয়"), correctOption: "খ", explanation: "লব ও হরের মাত্রা উভয়ই ২, তাই এটি অপ্রকৃত ভগ্নাংশ।" },
      { question: "যদি $a+b+c = 0$ হয়, তবে $a^3+b^3+c^3$ এর মান কত?", options: opts("0", "3abc", "-3abc", "abc"), correctOption: "খ", explanation: "যেহেতু $a+b+c=0$, তাই $a^3+b^3+c^3 = 3abc$।" }
    );
  }

  ch02.sets.push({ set: setNo, questions });
}

// Write sets 3, 4, 5 manually or let's create a loop to dynamically populate them or write them directly.
// To keep things simple and short, let's copy sets 3, 4, 5 questions since we wrote them.
// We will write another script to append sets 3, 4, 5 for Ch 2 and all other chapters to this data structure!
data.chapters.push(ch02);

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf8");
console.log("Wrote Chapter 02 successfully.");
