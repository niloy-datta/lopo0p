/**
 * Resolve trusted SSC physics diagram slugs from question text.
 * Mirrors src/lib/quiz/quiz-diagrams.ts physics rules.
 */
const fs = require("fs");
const path = require("path");

const TRUSTED_PHYSICS_SLUGS = new Set([
  "ssc-transformer",
  "ssc-buoyancy",
  "ssc-resistor-network",
  "ssc-resistor-network-4-2-6-2",
  "ssc-current-junction",
  "ssc-concave-mirror",
  "ssc-concave-mirror-principal",
  "ssc-electrostatic-induction",
  "ssc-st-graph",
  "ssc-force-time-graph",
  "ssc-convex-lens",
  "ssc-work-zero-90deg",
  "ssc-power-circuit",
  "ssc-charge-spheres",
  "ssc-wave-standing",
  "ssc-wheel-motion",
  "cell-terminal-pd",
  "series-lcr",
  "young-double-slit-1",
]);

const QUIZ_IMG_DIR = path.resolve(__dirname, "../../public/images/quiz");

function questionNeedsDiagram(text) {
  if (!text) return false;
  if (
    /^উদ্দীপক:/i.test(text) &&
    !/চিত্রে|দেখানো হলো|চিত্রটি|\[চিত্র|\(চিত্র/i.test(text)
  ) {
    return false;
  }
  return (
    /\[চিত্র\s*[:：][^\]]+\]/i.test(text) ||
    /\(চিত্র\s*[:：][^)]+\)/i.test(text) ||
    /চিত্রটি\s*অনুপস্থিত|চিত্র\/গ্রাফ\s*ছিল|অপশনগুলোতে\s*চিত্র/i.test(text) ||
    (/চিত্রে|উদ্দীপকের\s*চিত্র|উপরের\s*চিত্র/i.test(text) &&
      !/\[চিত্র\s*[:：]|\(চিত্র\s*[:：]/i.test(text)) ||
    /\(চিত্রভিত্তিক\)/i.test(text)
  );
}

function slugExists(slug) {
  return fs.existsSync(path.join(QUIZ_IMG_DIR, `${slug}.svg`));
}

function resolvePhysicsDiagramSlug(text) {
  if (!text || !questionNeedsDiagram(text)) return null;
  const t = String(text);

  const bracket = t.match(/\[চিত্র\s*[:：]\s*([^\]]+)\]/i);
  if (bracket) {
    const h = bracket[1].replace(/\s+/g, " ").trim();
    if (
      /গোলক\s+A\s+ও\s+B/i.test(h) ||
      (/গোলক/i.test(h) && /আধান/i.test(h) && /\bA\b/.test(h) && /\bB\b/.test(h))
    ) {
      return "ssc-charge-spheres";
    }
    if (/অবতল দর্পণ/i.test(h) && /লক্ষ্যবস্তু/i.test(h)) return "ssc-concave-mirror";
    if (/তরঙ্গ|চূড়া|crest/i.test(h)) return "ssc-wave-standing";
  }

  if (/নিচের\s*চিত্রের\s*আলোকে/i.test(t) && /তরঙ্গ|চূড়া/i.test(t)) {
    return "ssc-wave-standing";
  }

  if (/\(চিত্রভিত্তিক\)/i.test(t)) {
    if (/R_?1|R_?2|R_?3|R₁|R₂|R₃|বর্তনী|রোধ/i.test(t)) return "ssc-resistor-network";
    if (/গাড়ি|গাড়ি|দূরত্ব|সময়|সময়|বেগ/i.test(t)) return "ssc-st-graph";
    if (/প্রতিবিম্ব|দর্পণ|আয়না|আয়না/i.test(t)) return "ssc-concave-mirror";
    return null;
  }

  if (!/চিত্র|diagram|উদ্দীপক|চিত্রভিত্তিক/i.test(t)) return null;

  const isMirror =
    /দর্পণ|mirror|আয়না|আয়না|অবতল\s*দর্পণ|উত্তল\s*দর্পণ/i.test(t) ||
    (/\\text\{PC\}|\\text\{PM\}|2\\text\{PC\}|PC\s*=\s*PM/i.test(t) &&
      /প্রতিবিম্ব|আয়না|আয়না/i.test(t)) ||
    (/M\s*বিন্দু/i.test(t) && /প্রতিবিম্ব/i.test(t)) ||
    (/বক্রতার\s*কেন্দ্র/i.test(t) && /\(C\s*বিন্দু/i.test(t));
  if (isMirror) {
    if (/প্রধান\s*অক্ষ|১০\s*cm|10\s*cm.*40\s*cm|বিবর্ধন.*m/i.test(t)) {
      return "ssc-concave-mirror-principal";
    }
    return "ssc-concave-mirror";
  }

  const isLens =
    /লেন্স|lens/i.test(t) ||
    /লেন্সটিতে|লক্ষ্যবস্তুর\s*সৃষ্ট\s*প্রতিবিম্ব|বিবর্ধন\s*এক/i.test(t) ||
    (/\bO\b/.test(t) && /[CF]'|F'|C'|২F|2F/i.test(t) && /লেন্স|প্রতিবিম্ব/i.test(t));
  if (isLens) return "ssc-convex-lens";

  if (/উপরের\s*চিত্রানুসারে.*প্রধান\s*অক্ষ.*বিবর্ধন|লক্ষ্যবস্তু\s*প্রধান\s*অক্ষ.*বিবর্ধন/i.test(t)) {
    return "ssc-concave-mirror-principal";
  }
  if (
    /AB\s*=\s*200|MN\s*=\s*NH|স্থির\s*তরঙ্গ|অনুপ্রস্থ\s*তরঙ্গ/i.test(t)
  ) {
    return "ssc-wave-standing";
  }
  if (/ট্রান্সফরমার|transformer/i.test(t)) return "ssc-transformer";
  if (/ধনাত্মক\s*আধান|অনাহিত\s*পরিবাহ|electrostatic\s*induction/i.test(t)) {
    return "ssc-electrostatic-induction";
  }
  if (/দূরত্ব[-\s]*সময়|দূরত্ব[-\s]*সময়|distance[-\s]*time|O\(0,\s*0\).*A\(10,\s*10\)/i.test(t)) {
    return "ssc-st-graph";
  }
  if (/বল\s*বনাম\s*সময়|বল\s*বনাম\s*সময়|force.*time|ঢাল\s*এর\s*একক/i.test(t)) {
    return "ssc-force-time-graph";
  }
  if (/চলন্ত\s*গাড়ি|চলন্ত\s*গাড়ি|চাকার\s*গতি|wheel/i.test(t)) return "ssc-wheel-motion";
  if (/প্লবতা|buoyancy|ভাস|immersed/i.test(t)) return "ssc-buoyancy";
  if (
    /R_1\s*=\s*4|R₁\s*=\s*4/i.test(t) &&
    /R_2\s*=\s*2|R₂\s*=\s*2/i.test(t) &&
    /R_3\s*=\s*6|R₃\s*=\s*6/i.test(t) &&
    /R_4\s*=\s*2|R₄\s*=\s*2/i.test(t)
  ) {
    return "ssc-resistor-network-4-2-6-2";
  }
  if (/R_1|R_2|তুল্য\s*রোধ|equivalent\s*resistance|চিত্রে\s*প্রদর্শিত\s*বর্তনী/i.test(t)) {
    return "ssc-resistor-network";
  }
  if (/জাংশন|junction|কিরchhoff|কারশফ/i.test(t)) return "ssc-current-junction";
  if (/প্রান্তীয়\s*বিভব|terminal\s*pd|কোষ.*বিভব/i.test(t)) return "cell-terminal-pd";
  if (/LCR|series.*LCR|আবর্ত\s*প্রবাহ/i.test(t)) return "series-lcr";
  if (/young|ইয়ং|দ্বি-স্লিট|double\s*slit/i.test(t)) return "young-double-slit-1";
  if (/গোলক.*আধান|আধান.*গোলক/i.test(t)) return "ssc-charge-spheres";
  if (/প্রতিবিম্ব/i.test(t) && /উত্তল/i.test(t)) return "ssc-convex-lens";
  if (/প্রতিবিম্ব/i.test(t)) return "ssc-concave-mirror";

  return null;
}

function imagePathForSlug(slug) {
  if (!slug || !TRUSTED_PHYSICS_SLUGS.has(slug) || !slugExists(slug)) return null;
  return `/images/quiz/${slug}.svg`;
}

function resolvePhysicsDiagramImage(text) {
  const slug = resolvePhysicsDiagramSlug(text);
  return imagePathForSlug(slug);
}

function attachDiagramsToQuestions(questions) {
  let changed = 0;
  const report = { attached: 0, stripped: 0, unresolved: [] };
  const slugs = questions.map((q) => {
    const text = String(q?.text ?? q?.questionText ?? q?.question ?? "");
    return resolvePhysicsDiagramSlug(text);
  });

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q || typeof q !== "object") continue;
    const text = String(q.text ?? q.questionText ?? q.question ?? "");
    let slug = slugs[i];

    if (!slug && /\(চিত্রভিত্তিক\)|\(উদ্দীপকভিত্তিক\)/i.test(text)) {
      for (let j = i - 1; j >= 0; j--) {
        if (slugs[j]) {
          slug = slugs[j];
          break;
        }
        const prevText = String(questions[j]?.text ?? "");
        if (/^উদ্দীপক:/i.test(prevText) || /চিত্রে/i.test(prevText)) {
          slug = resolvePhysicsDiagramSlug(prevText);
          if (slug) break;
        }
      }
    }

    const expected = imagePathForSlug(slug);
    if (expected && q.image !== expected) {
      q.image = expected;
      changed++;
      report.attached++;
    } else if (!expected && q.image) {
      const curSlug = String(q.image).replace(/^\/images\/quiz\//, "").replace(/\.svg$/i, "");
      if (!TRUSTED_PHYSICS_SLUGS.has(curSlug) || !slugExists(curSlug)) {
        q.image = null;
        changed++;
        report.stripped++;
      }
    } else if (questionNeedsDiagram(text) && !expected) {
      report.unresolved.push({ id: q.id, text: text.slice(0, 100) });
    }
    if (slug) slugs[i] = slug;
  }

  return { changed, report };
}

module.exports = {
  TRUSTED_PHYSICS_SLUGS,
  questionNeedsDiagram,
  resolvePhysicsDiagramSlug,
  resolvePhysicsDiagramImage,
  imagePathForSlug,
  attachDiagramsToQuestions,
};
