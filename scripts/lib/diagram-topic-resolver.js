const LIBRARY_SLUGS = new Set([
  "ssc-charge-spheres", "ssc-concave-mirror", "ssc-convex-lens",
  "cell-division", "cell-wall", "sporangium", "plasmid", "fern-prothallus", "vascular-bundle", "dna-rna",
  "bio-nephron", "bio-neuron", "bio-eye", "bio-digestive", "bio-alveoli", "bio-xylem-phloem",
  "geo-circle-center-o", "geo-circle-equation", "geo-triangle-right", "geo-triangle-medians",
  "geo-triangle-altitudes", "geo-coord-triangle", "geo-trapezoid", "geo-cylinder-generator",
  "circuit-series", "circuit-parallel", "wave-transverse", "nor-gate",
  "photon-energy-1", "half-life-1", "electric-field-1", "pressure-depth-1",
  "heating-curve-1", "reaction-rate-1", "pv-cycle-1", "shm-graph-1", "vt-graph-1",
  "parabola-graph-1", "function-test-1",
  "cell-terminal-pd", "cell-terminal-pd-alt", "mass-spring",
  "parallel-dry-cells", "parallel-resistors", "pendulum", "resistor-voltage",
  "series-lcr", "young-double-slit-1", "young-double-slit-2", "young-double-slit-3",
  "young-double-slit-4", "ssc-transformer", "ssc-buoyancy", "ssc-resistor-network",
  "ssc-current-junction", "ssc-concave-mirror-principal",
  "ssc-electrostatic-induction", "ssc-st-graph", "ssc-force-time-graph",
  "ssc-myopia-eye", "ssc-work-zero-90deg", "ssc-power-circuit",
  "bio-mitochondria-chloroplast", "bio-recombinant-plasmid",
  "bio-dna-helix", "bio-trna", "bio-stomata", "bio-bacteriophage", "bio-golgi",
  "bio-cytokinesis", "bio-poaceae-root", "bio-endodermis", "bio-c4-kranz",
  "bio-tissue-culture", "bio-transcription-translation", "bio-crossing-over",
  "bio-meristem", "bio-parenchyma", "bio-chordata", "bio-resin-duct",
  "bio-mitosis-meiosis", "bio-heart", "bio-brain", "bio-skin", "geo-circle-pq-op",
  "geo-angle-bisectors", "geo-cyclic-quadrilateral", "geo-right-triangle-trig",
  "hm-parabola-y-x2", "hm-resultant-5n-7n-60", "hm-resultant-6n-8n-90",
  "hm-complex-locus", "hm-straight-line-slope", "ssc-wave-standing", "ssc-wheel-motion",
]);

function normalizeHint(h) {
  return String(h || "").replace(/\s+/g, " ").trim();
}

function safeId(id) {
  return String(id || "unknown").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").slice(0, 120);
}

function matchBracketChitra(text) {
  const m = text.match(/\[চিত্র\s*[:：]\s*([^\]]+)\]/i);
  if (!m) return null;
  const h = normalizeHint(m[1]);
  if (/গোলক/i.test(h) && /আধান/i.test(h) && /\bA\b/.test(h) && /\bB\b/.test(h)) return "ssc-charge-spheres";
  if (/তরঙ্গ/i.test(h) && / চূ/i.test(h)) return "ssc-wave-crests";
  if (/অবতল দর্পণ/i.test(h) && /লক্ষ্যবস্তু/i.test(h)) return "ssc-concave-mirror";
  if (/বেলন|cylinder/i.test(h)) return "geo-cylinder-generator";
  return null;
}

function matchParenChitra(text) {
  const m = text.match(/\(\s*চিত্র\s*[:：]\s*([^)]+)\s*\)/i);
  if (!m) return null;
  const l = normalizeHint(m[1]).toLowerCase();
  if (l === "কোষ বিভাজন" || l === "কোষ-বিভাজন") return "cell-division";
  if (l === "কোষপ্রাচীর" || l === "কোষ প্রাচীর") return "cell-wall";
  if (l.includes("স্পোরাঞ্জ")) return "sporangium";
  if (l === "প্লাজমিড" || l === "plasmid") return "plasmid";
  if (l.includes("ফার্ন")) return "fern-prothallus";
  if (l.includes("মুক্ত সমপার্শ্ব") || l.includes("ভাস্কুলার")) return "vascular-bundle";
  if (/dna/i.test(l) && /rna/i.test(l)) return "dna-rna";
  return null;
}

function matchPhysics(text) {
  if (!/চিত্র|diagram|উদ্দীপক|চিত্রভিত্তিক|বিক্রিয়া/i.test(text)) return null;

  // Chemistry specific matches
  if (/টাইট্রেশন|titration|কনিকেল\s*ফ্লাস্ক|conical\s*flask|বুরেট|burette|নির্দেশক|indicator/i.test(text)) {
    return "chem-titration";
  }
  if (
    /ব্রোমিন\s*পানি|bromine\s*water|Br₂.*লাল|লাল\s*বর্ণ.*বর্ণহীন/i.test(text) &&
    /অসম্পৃক্ত|unsaturated|অ্যালকিন|alkene|অ্যালকাইন|alkyne/i.test(text)
  ) {
    return "chem-bromine-test";
  }
  if (/সংযোজন\s*পলিমার|addition\s*polymer|পলিমারকরণ|polymerization|nCH₂=CH₂|ইথিন.*পলিথিন/i.test(text)) {
    return "chem-addition-polymer";
  }
  if (/অ্যালকাইন|alkyne|পানি\s*যোজন|hydration|মারকনিকভ|markovnikov|কিটোন|ketone|HgSO₄|H₂SO₄/i.test(text) && /প্রোপাইন|propyne|ইথাইন|ethyne/i.test(text)) {
    return "chem-alkyne-hydration";
  }

  // Physics specific matches
  const isMirror = /দর্পণ|mirror|局部|আয়না|আয়না|অবতল\s*দর্পণ|উত্তল\s*দর্পণ/i.test(text) ||
    (/\\text\{PC\}|\\text\{PM\}|2\\text\{PC\}|PC\s*=\s*PM/i.test(text) && /প্রতিবিম্ব|আয়না|আয়না/i.test(text)) ||
    (/M\s*বিন্দু/i.test(text) && /প্রতিবিম্ব/i.test(text)) ||
    (/বক্রতার\s*কেন্দ্র/i.test(text) && /\(C\s*বিন্দু/i.test(text));
  if (isMirror) {
    if (/প্রধান\s*অক্ষ|১০\s*cm|10\s*cm.*40\s*cm|বিবর্ধন.*m/i.test(text))
      return "ssc-concave-mirror-principal";
    return "ssc-concave-mirror";
  }
  const isLens = /লেন্স|lens/i.test(text) ||
    /লেন্সটিতে|লক্ষ্যবস্তুর\s*সৃষ্ট\s*প্রতিবিম্ব|বিবর্ধন\s*এক/i.test(text) ||
    (/\bO\b/.test(text) && /[CF]'|F'|C'|২F|2F/i.test(text) && /লেন্স|প্রতিবিম্ব/i.test(text));
  if (isLens) return "ssc-convex-lens";
  if (/উপরের\s*চিত্রানুসারে.*প্রধান\s*অক্ষ.*বিবর্ধন|লক্ষ্যবস্তু\s*প্রধান\s*অক্ষ.*বিবর্ধন/i.test(text))
    return "ssc-concave-mirror-principal";
  if (/AB\s*=\s*200|MN\s*=\s*MN|MN\s*=\s*NH|স্থির\s*তরঙ্গ/i.test(text)) return "ssc-wave-standing";
  if (/ট্রান্সফরমার|transformer/i.test(text)) return "ssc-transformer";
  if (/ধনাত্মক\s*আধান|অনাহিত\s*পরিবাহ|electrostatic\s*induction/i.test(text))
    return "ssc-electrostatic-induction";
  if (/দূরত্ব[-\s]*সময়|distance[-\s]*time|O\(0,\s*0\).*A\(10,\s*10\)/i.test(text))
    return "ssc-st-graph";
  if (/বল\s*বনাম\s*সময়|force.*time|ঢাল\s*এর\s*একক/i.test(text))
    return "ssc-force-time-graph";
  if (/চলন্ত\s*গাড়ি|চলন্ত\s*গাড়ি|চাকার\s*গতি|wheel/i.test(text))
    return "ssc-wheel-motion";
  if (/প্লবতা|buoyancy|ভাস|immersed/i.test(text)) return "ssc-buoyancy";
  if (/R_1|R_2|তুল্য\s*রোধ|equivalent\s*resistance/i.test(text))
    return "ssc-resistor-network";
  if (/জাংশন|junction|কিরchhoff|কারশফ/i.test(text)) return "ssc-current-junction";
  if (/প্রান্তীয়\s*বিভব|terminal\s*pd|কোষ.*বিভব/i.test(text)) return "cell-terminal-pd";
  if (/LCR|series.*LCR|আবর্ত\s*প্রবাহ/i.test(text)) return "series-lcr";
  if (/young|ইয়ং|দ্বি-স্লিট|double\s*slit/i.test(text)) return "young-double-slit-1";

  // Old physics matches
  if (/তড়িৎ\s*প্রাবল্য|electric\s*field/i.test(text)) return "electric-field-1";
  if (/ফোটন|photon|আলোক\s*তড়/i.test(text)) return "photon-energy-1";
  if (/অর্ধায়ু|half.?life|তেজস্ক্র/i.test(text)) return "half-life-1";
  if (/চাপ.*গভীরতা|pressure.*depth/i.test(text)) return "pressure-depth-1";
  if (/তাপীয়\s*বক্র|heating\s*curve|ঊর্ধ্বপাত/i.test(text)) return "heating-curve-1";
  if (/P-V|p-v\s*গ্রাফ|চক্রাকার/i.test(text)) return "pv-cycle-1";
  if (/সরল\s*ছন্দ|simple\s*harmonic|সরলদোলক/i.test(text)) return "shm-graph-1";
  if (/স্থির\s*চাপ|আদর্শ\s*গ্যাস|V-T|volume.*temperature/i.test(text)) return "vt-graph-1";
  if (/বর্তনী|circuit|রেজিস্ট|resistor|অ্যামিটার|voltmeter|V-I|I-V|VI\s*গ্রাফ/i.test(text)) return /সমান্তরাল|parallel/i.test(text) ? "circuit-parallel" : "circuit-series";
  return null;
}

function matchBiology(text) {
  if (!/চিত্র|diagram|উদ্দীপক/i.test(text)) return null;
  if (/নিউরন|neuron|স্নায়ু|snyapse|স্নায়ুকোষ|স্নায়ু|synapse|সংযোগস্থল/i.test(text))
    return "bio-neuron";
  if (/চক্ষু|retina|cornea|iris|চোখের|eyeball|অক্ষিক|অপটিক.*নার্ভ|রেটিনা|কর্নিয়া/i.test(text))
    return "bio-eye";
  if (/হৃৎপিণ্ড|হৃদযন্ত্র|heart|অলিন্দ|নিলয়|মহাধমনী|করোনারি/i.test(text))
    return "bio-heart";
  if (/মস্তিষ্ক|brain|সেরিব্রাম|সেরিবেলাম|থ্যালামাস|হাইপোথ্যালামাস/i.test(text))
    return "bio-brain";
  if (/ত্বক|skin|এপিডার্মিস|ডার্মিস|হাইপোডার্মিস|ঘর্মগ্রন্থি/i.test(text))
    return "bio-skin";
  if (/কোষ\s*বিভাজন|মাইটোসিস|মায়োসিস|মিয়োসিস|প্রোফেজ|মেটাফেজ|অ্যানাফেজ|টেলোফেজ|সাইটোকাইনেসিস/i.test(text))
    return "cell-division";
  if (/কোষপ্রাচীর|cell\s*wall|মধ্যপর্দা|প্লাজমোডেসমাটা|প্রাথমিক\s*প্রাচীর|গৌণ\s*প্রাচীর/i.test(text))
    return "cell-wall";
  if (/স্পোরাঞ্জি|sporangium|অ্যানুলাস|স্টোমিয়াম/i.test(text)) return "sporangium";
  if (/প্রোথ্যালাস|prothallus|ফার্ন|অ্যানথেরিডিয়া|আর্কিগোনিয়া/i.test(text))
    return "fern-prothallus";
  if (/DNA.*RNA|ডিএনএ.*আরএনএ|নিউক্লিক\s*অ্যাসিড|ডাবল.*হেলিক্স.*সিঙ্গেল|dna.*rna/i.test(text))
    return "dna-rna";
  if (/ভাস্কুলার\s*বান্ডল|vascular\s*bundle|সমপার্শ্বীয়|বিকর্ষ|ক্যাম্বিয়াম/i.test(text))
    return "vascular-bundle";
  if (/ক্রেবস\s*চক্র|krebs|গ্লাইকোলাইসিস|glycolysis/i.test(text))
    return "bio-mitochondria-chloroplast";

  // Old biology matches
  if (/নেফ্রন|glomerul|Ultrafiltration|ছাঁকনি/i.test(text)) return "bio-nephron";
  if (/নিউরন|neuron|স্নায়ু|synapse|সংযোগস্থল/i.test(text)) return "bio-neuron";
  if (/চক্ষু|retina|cornea|চোখ/i.test(text) && !/দর্পণ|লেন্স|mirror|lens/i.test(text)) return "bio-eye";
  if (/খাদ্যনাল|পাকস্থল|digestive/i.test(text)) return "bio-digestive";
  if (/অ্যালভিওল|alveoli/i.test(text)) return "bio-alveoli";
  if (/জাইলেম|ফ্লোয়েম|xylem|phloem/i.test(text)) return "bio-xylem-phloem";
  if (/\bGate\b|logic\s*gate|লজিক/i.test(text)) return "nor-gate";
  if (/\(\s*উদ্দীপক\s*[:：]\s*DNA\s*ও\s*RNA\s*\)/i.test(text)) return "dna-rna";
  return null;
}

function matchMathGeometry(text) {
  if (!/চিত্র|triangle|ত্রিভুজ|বৃত্ত|circle|coordinate|স্থানাঙ্ক|O\s*কেন্দ্র|angle|সমকোণ|median|মধ্যমা|altitude|লম্ব|orthocenter|trapezoid|ট্রাপিজ|parabola|graph|লেখচিত্র|গ্রাফ/i.test(text)) return null;
  if (/ট্রাপিজ|trapezoid|XY|মধ্যম\s*রেখা/i.test(text)) return "geo-trapezoid";
  if (/মধ্যমা|median/i.test(text)) return "geo-triangle-medians";
  if (/লম্ব|altitude|orthocenter|লম্ব\s*ত্র/i.test(text)) return "geo-triangle-altitudes";
  if (/স্থানাঙ্ক|coordinate|\(\s*\d+\s*,\s*\d+\s*\)/i.test(text)) return "geo-coord-triangle";
  if (/circle\s*equation|বৃত্ত.*সমীকরণ/i.test(text)) return "geo-circle-equation";
  if (/বৃত্ত|circle|কেন্দ্র\s*O|O\s*কেন্দ্র/i.test(text)) return "geo-circle-center-o";
  if (/সমকোণ|right\s*angle|90/i.test(text)) return "geo-triangle-right";
  if (/triangle|ত্রিভুজ|ABC/i.test(text)) return "geo-triangle-right";
  if (/parabola|প্যারাবোলা/i.test(text)) return "parabola-graph-1";
  if (/লেখচিত্র|graph|গ্রাফ|function|ফাংশন/i.test(text)) return "function-test-1";
  return null;
}

function resolveDiagramTopic(text, questionId) {
  const t = String(text || "");
  if (!t) return { slug: `generated/${safeId(questionId)}`, kind: "generated" };
  for (const fn of [matchBracketChitra, matchParenChitra, matchPhysics, matchBiology, matchMathGeometry]) {
    const slug = fn(t);
    if (slug && LIBRARY_SLUGS.has(slug)) return { slug, kind: "library" };
  }
  const hintMatch = t.match(/\[চিত্র\s*[:：]\s*([^\]]+)\]/i);
  const hint = hintMatch ? normalizeHint(hintMatch[1]).slice(0, 100) : normalizeHint(t).slice(0, 80);
  if (/বৃত্ত|circle|O\s*কেন্দ্র/i.test(t)) return { slug: "geo-circle-center-o", kind: "library" };
  if (/ত্রিভুজ|triangle/i.test(t)) return { slug: "geo-triangle-right", kind: "library" };
  if (/বর্তনী|circuit/i.test(t)) return { slug: "circuit-series", kind: "library" };
  if (/তরঙ্গ|wave/i.test(t)) return { slug: "wave-transverse", kind: "library" };
  if (/লেখচিত্র|graph|গ্রাফ/i.test(t)) return { slug: "function-test-1", kind: "library" };
  return { slug: `generated/${safeId(questionId)}`, kind: "generated", hint };
}

function imagePathForSlug(slug) {
  return `/images/quiz/${slug}.svg`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generatedReferenceSvg(hint, title = "Diagram") {
  const safeHint = escapeXml(String(hint || "Diagram"));
  const safeTitle = escapeXml(String(title || "Diagram"));
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="200" rx="12" fill="#0f172a"/><rect x="24" y="24" width="272" height="112" rx="8" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/><text x="160" y="90" fill="#e2e8f0" font-family="Arial,sans-serif" font-size="12" text-anchor="middle">${safeHint}</text><text x="160" y="170" fill="#94a3b8" font-family="Arial,sans-serif" font-size="11" text-anchor="middle">${safeTitle}</text></svg>`;
}

module.exports = {
  LIBRARY_SLUGS,
  resolveDiagramTopic,
  imagePathForSlug,
  generatedReferenceSvg,
  safeId,
};
