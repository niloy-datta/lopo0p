/**
 * Detect low-quality / template-spam quiz sets (repeated stems, placeholder text).
 */
const { normalizeStemForDedup, extractSharedUddepokKey } = require("./ssc-biology-stem-utils");

function normalizeStem(text) {
  return normalizeStemForDedup(text);
}

function extractText(q) {
  return String(q?.text ?? q?.questionText ?? q?.question ?? "").trim();
}

function isGarbledBijoyText(text) {
  const t = String(text ?? "").trim();
  if (!t) return false;
  if (/[\u0980-\u09FF]/.test(t)) return false;
  return /[‡†©ÖÏ«»¤`‚]/.test(t) || /wb‡Pi|DÏxc|cÖ‡k|Av‡jv|Ki‡Z|jf¨|mieivn|†gvU|DËi/i.test(t);
}

function isJunkQuestionText(text, subject) {
  const t = String(text ?? "").trim();
  if (!t || t.length < 6) return true;
  if (isGarbledBijoyText(t)) return true;
  if (/ Q\d+$/i.test(t) && t.split(/\s+/).length <= 4) return true;
  if (/^Chemistry Q/i.test(t) || /^Physics Q/i.test(t) || /^Biology Q/i.test(t)) return true;
  if (/বোর্ড পরীক্ষার মতো প্রশ্ন-|বোর্ড স্ট্যান্ডার্ড:/i.test(t)) return true;
  if (/সম্পর্কে নিচের কোনটি সঠিক\?$/i.test(t) && !/ i\. /i.test(t)) return true;
  if (/^Higher Math Q/i.test(t)) return true;
  if (/^Metal\s/i.test(t) || /^Metal সাধারণত/i.test(t)) return true;
  if (/^Balancing equation/i.test(t)) return true;
  if (/^\d+ mol পদার্থে/i.test(t)) return true;
  if (/^সেট ও ফাংশন Q/i.test(t) || /^বীজগণিত Q/i.test(t) || /^ক্রম ও ধারা Q/i.test(t)) return true;
  if (/^x=\d+ হলে মান কত/i.test(t)) return true;
  if (subject === "higher-math" && /^x>\d+ smallest integer$/i.test(t)) return true;
  if (subject === "chemistry" && /তাপমুখ|লেইটেন্ট/.test(t)) return true;
  if (/ — MCQ \d+ \(সেট \d+\)\??/.test(t)) return true;
  if (/\s\[\d+\]\s*$/.test(t)) return true;
  if (/— সঠিক উত্তর কোনটি\?/.test(t)) return true;
  if (/English meaning:/i.test(t)) return true;
  if (/^সাধারণ ভুল:/i.test(t)) return true;
  if (subject === "physics" && isBrokenPhysicsImport(t)) return true;
  if (subject === "physics" && /^[\d০-৯]+\.\s/.test(t)) return true;
  if (subject === "physics" && /নং প্রশ্নের উত্তর|উদ্দীপকটি পড়|তথ্যের আলোকে/i.test(t)) return true;
  if (subject === "physics" && /^বিকৃতি—/i.test(t)) return true;
  if (subject === "physics" && /\(চিত্রভিত্তিক\)/i.test(t)) return true;
  return false;
}

/** Board PDF / Bijoy import corruption in SSC Physics stems. */
function isBrokenPhysicsImport(text) {
  const t = String(text ?? "").trim();
  if (!t) return true;
  if (/ext\{\s*ext\{|\\text\{\s*ext\{|হলÑ|শ–ন্য|য-1|š@|র–পা||Ñe|Ñ\s|Ñ$/.test(t)) return true;
  if (/English:/i.test(t)) return true;
  if (/\\implies\s*\\frac/.test(t) && t.length > 120) return true;
  return false;
}

/** Stem references a person but omits required case facts (e.g. blood group). */
function isIncompleteQuestionText(text, subject = "") {
  const t = String(text ?? "").trim();
  if (!t || t.startsWith("উদ্দীপক:")) return false;
  if (/তানিয়াকে|তানিয়াকে/.test(t) && !/রক্তের গ্রুপ|গ্রুপ\s*[ABO]/i.test(t)) return true;
  if (subject === "biology" && /^[অ-হ]{2,14}কে\s/.test(t) && /রক্ত|গ্রুপ|রোগ|হরমোন/.test(t)) {
    if (!/রক্তের গ্রুপ|বয়স|রোগ|হরমোন|উৎপন্ন|চিত্রে|উদ্দীপক/i.test(t)) return true;
  }
  return false;
}

function uniqueStemCount(questions) {
  const stems = new Set();
  for (const q of questions) {
    stems.add(normalizeStem(extractText(q)));
  }
  return stems.size;
}

function countDuplicateStems(questions) {
  const stems = new Set();
  let dupes = 0;
  for (const q of questions) {
    const key = normalizeStem(extractText(q));
    if (stems.has(key)) dupes++;
    else stems.add(key);
  }
  return dupes;
}

function countRepeatedUddepok(questions) {
  const counts = new Map();
  let repeats = 0;
  for (const q of questions) {
    const key = extractSharedUddepokKey(extractText(q));
    if (!key) continue;
    const n = (counts.get(key) ?? 0) + 1;
    counts.set(key, n);
    if (n > 1) repeats++;
  }
  return repeats;
}

function isLowQualitySet(questions, subject = "", chapterNo = null) {
  if (!Array.isArray(questions) || questions.length < 20) return true;

  const texts = questions.map(extractText);
  const junkHits = texts.filter((t) => isJunkQuestionText(t, subject)).length;
  const unique = uniqueStemCount(questions);

  if (junkHits >= 2) return true;
  if (texts.filter(isGarbledBijoyText).length >= 1) return true;
  if (unique < 12) return true;
  if (junkHits / questions.length > 0.15) return true;
  if (countDuplicateStems(questions) >= 1) return true;
  if (countRepeatedUddepok(questions) >= 1) return true;

  if (subject === "physics" && chapterNo === "01") {
    const wrongTopicRe =
      /ট্রান্সফরমার|দর্পণ|আয়না|আয়না|তেজস্ক্র|অ্যাঙ্গিও|আপতন কোণ|সংকট কোণ|প্রতিসৃত|ইলেকট্রিক ফিল্ড|বর্তনী|লেন্স|তরঙ্গ|নিউক্লিয়|রেডিও|হৃদপিণ্ড|নেফ্রন/i;
    const wrongHits = texts.filter((t) => wrongTopicRe.test(t)).length;
    if (wrongHits >= 2) return true;
  }

  if (subject === "biology") {
    const avgLen = texts.reduce((s, t) => s + t.length, 0) / texts.length;
    const uddepok = texts.filter((t) => t.includes("উদ্দীপক")).length;
    const awkward = texts.filter((t) => {
      if (/বোর্ড পরীক্ষার মতো প্রশ্ন-|বোর্ড স্ট্যান্ডার্ড:/i.test(t)) return true;
      if (/সম্পর্কে নিচের কোনটি সঠিক\?$/i.test(t) && !/ i\. /i.test(t)) return true;
      return false;
    }).length;
    const boilerplate = texts.filter((t) => /— সঠিক উত্তর কোনটি\?/.test(t)).length;
    const inc = texts.filter((t) => isIncompleteQuestionText(t, "biology")).length;
    if (unique >= 25 && countDuplicateStems(questions) === 0 && junkHits === 0 && countRepeatedUddepok(questions) === 0) {
      if (awkward >= 1 || boilerplate >= 2 || inc >= 1) return true;
      return false;
    }
    if (awkward >= 1) return true;
    if (boilerplate >= 2) return true;
    if (avgLen < 32 && uddepok < 3) return true;
    if (unique < 24) return true;
  }

  return false;
}

module.exports = {
  normalizeStem,
  extractText,
  isGarbledBijoyText,
  isBrokenPhysicsImport,
  isJunkQuestionText,
  isIncompleteQuestionText,
  isLowQualitySet,
  uniqueStemCount,
};
