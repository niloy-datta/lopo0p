/**
 * Map SSC Biology question text to trusted /images/quiz/*.svg assets.
 */
const BIOLOGY_DIAGRAM_RULES = [
  { re: /নিউরন|neuron|স্নায়ু|স্নায়ু|synapse|সংযোগস্থল/i, image: "/images/quiz/bio-neuron.svg" },
  { re: /মাইটোকন্ড্রিয়া|মাইটোকন্ড্রিয়া|mitochondria/i, image: "/images/quiz/bio-mitochondria-chloroplast.svg", also: /ক্লোরো|chloroplast/i },
  { re: /প্লাজমিড|plasmid/i, image: "/images/quiz/plasmid.svg" },
  { re: /recombinant|রিকম্বিনেন্ট/i, image: "/images/quiz/bio-recombinant-plasmid.svg" },
  { re: /DNA.*helix|ডিএনএ.*ডবল|double\s*helix|ওয়াটসন|ওয়াটসন/i, image: "/images/quiz/bio-dna-helix.svg" },
  { re: /tRNA|টিআরএনএ/i, image: "/images/quiz/bio-trna.svg" },
  { re: /স্টোমাটা|stomata|পত্ররন্ধ্র/i, image: "/images/quiz/bio-stomata.svg" },
  { re: /bacteriophage|ব্যাকটেরিওফেজ|ভাইরাস.*DNA/i, image: "/images/quiz/bio-bacteriophage.svg" },
  { re: /গলজি|golgi/i, image: "/images/quiz/bio-golgi.svg" },
  { re: /ক্রসিং\s*ওভার|crossing\s*over/i, image: "/images/quiz/bio-crossing-over.svg" },
  { re: /নেফ্রন|glomerul|বৃক্ক|kidney|রেনাল/i, image: "/images/quiz/bio-nephron.svg" },
  { re: /হৃৎপিণ্ড|হৃদযন্ত্র|heart|মায়োকার্ডিয়াম/i, image: "/images/quiz/bio-heart.svg" },
  { re: /খাদ্যনাল|পাকস্থলী|পরিপাকতন্ত্র|ক্ষুদ্রান্ত্র/i, image: "/images/quiz/bio-digestive.svg" },
  { re: /অ্যালভিওল|alveoli|ফুসফুস/i, image: "/images/quiz/bio-alveoli.svg" },
  { re: /জাইলেম|ফ্লোয়েম|xylem|phloem/i, image: "/images/quiz/bio-xylem-phloem.svg" },
  { re: /কোষ\s*বিভাজন|মাইটোসিস|মায়োসিস|মিয়োসিস|প্রোফেজ|মেটাফেজ/i, image: "/images/quiz/cell-division.svg" },
  { re: /কোষপ্রাচীর|cell\s*wall/i, image: "/images/quiz/cell-wall.svg" },
  { re: /DNA.*RNA|ডিএনএ.*আরএনএ/i, image: "/images/quiz/dna-rna.svg" },
  { re: /চিত্রে|দেখানো হলো|চিত্রটি/i, image: null, needsChitra: true },
];

function inferBiologyImage(text) {
  const t = String(text ?? "");
  if (!t) return null;

  for (const rule of BIOLOGY_DIAGRAM_RULES) {
    if (rule.needsChitra) continue;
    if (rule.also) {
      if (rule.re.test(t) && rule.also.test(t)) return rule.image;
      continue;
    }
    if (rule.re.test(t)) return rule.image;
  }

  if (/চিত্রে|দেখানো হলো/i.test(t)) {
    for (const rule of BIOLOGY_DIAGRAM_RULES) {
      if (rule.needsChitra || !rule.image) continue;
      if (rule.also) {
        if (rule.re.test(t) && rule.also.test(t)) return rule.image;
        continue;
      }
      if (rule.re.test(t)) return rule.image;
    }
  }

  return null;
}

/** উদ্দীপক prefix is for scenario/diagram questions — not bare definitions. */
function normalizeBiologyStem(text, image) {
  let t = String(text ?? "").trim();
  if (!t) return t;

  const hasDiagram = Boolean(image) || /চিত্রে|দেখানো হলো|\[চিত্র|\(চিত্র/i.test(t);
  if (t.startsWith("উদ্দীপক:") && !hasDiagram) {
    t = t.replace(/^উদ্দীপক:\s*/i, "").trim();
  }
  return t;
}

function finalizeBiologyQuestion(q) {
  const image = q.image ?? inferBiologyImage(q.text);
  const text = normalizeBiologyStem(q.text, image);
  return { ...q, text, image };
}

module.exports = {
  BIOLOGY_DIAGRAM_RULES,
  inferBiologyImage,
  normalizeBiologyStem,
  finalizeBiologyQuestion,
};
