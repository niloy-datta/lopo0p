/**
 * Stem normalization and duplicate detection for SSC Biology MCQs.
 */

function normalizeStemForDedup(text) {
  return String(text ?? "")
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[''‚'`]/g, "'")
    .replace(/[""]/g, '"')
    .replace(/য়/g, "য")
    .replace(/িয়/g, "িয")
    .replace(/হয়/g, "হয")
    .replace(/হয়/g, "হয")
    .replace(/মিয়/g, "মিয")
    .replace(/মিয়/g, "মিয")
    .replace(/\s*English meaning:.*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Shared উদ্দীপক block — limit repeats of the same long stimulus in one set. */
function extractSharedUddepokKey(text) {
  const t = String(text ?? "").trim();
  if (!t.startsWith("উদ্দীপক:")) return null;
  const body = t.replace(/^উদ্দীপক:\s*/i, "");
  const cut = body.search(
    /['']?[PQ]['']?\s*বিভাজন|নিচের কোন|i\.\s|সঠিক\?|কত হবে|কী\?|কোনটি\?/i,
  );
  const stimulus = (cut > 40 ? body.slice(0, cut) : body.slice(0, 140)).trim();
  return normalizeStemForDedup(stimulus);
}

function isBoilerplateStem(text) {
  const t = String(text ?? "").trim();
  if (/— সঠিক উত্তর কোনটি\?/.test(t)) return true;
  if (/English meaning:/i.test(t)) return true;
  if (/^সাধারণ ভুল:/i.test(t)) return true;
  return false;
}

function canAddQuestionToSet(text, usedStems, usedUddepok, { maxUddepokRepeats = 1 } = {}) {
  const key = normalizeStemForDedup(text);
  if (!key || usedStems.has(key)) return false;
  const uk = extractSharedUddepokKey(text);
  if (uk) {
    const count = usedUddepok.get(uk) ?? 0;
    if (count >= maxUddepokRepeats) return false;
  }
  return true;
}

function markQuestionUsed(text, usedStems, usedUddepok) {
  const key = normalizeStemForDedup(text);
  if (key) usedStems.add(key);
  const uk = extractSharedUddepokKey(text);
  if (uk) usedUddepok.set(uk, (usedUddepok.get(uk) ?? 0) + 1);
}

module.exports = {
  normalizeStemForDedup,
  extractSharedUddepokKey,
  isBoilerplateStem,
  canAddQuestionToSet,
  markQuestionUsed,
};
