/**
 * Shared question + SVG quality audit helpers.
 */
const fs = require("fs");
const path = require("path");

const {
  imagePath,
  fileExists,
  needsDiagram,
  optionsNeedGraph,
  getOptions,
} = require("./svg-audit-shared");

const PLACEHOLDER_OPT_RE = /^(?:ঘ\/A|ঘ\/a|চধ|[কখগঘKJ]|[A-Da-d])$/;

const BAD_SVG_CONTENT_RE =
  /bgGrad|Auto-generated|Question-specific reference|valid SVG placeholder|সঠিক সম্পর্ক অনুযায়ী সরলরেখা|সিরিজ বর্তনী|Option [কখগঘ]|লেখচিত্র<\/text>/i;

function readSvg(webPath) {
  if (!webPath || !fileExists(webPath)) return null;
  const abs = path.join(process.cwd(), "public", webPath.replace(/^\//, ""));
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return null;
  }
}

function isBadSvgWebPath(webPath) {
  if (!webPath) return { bad: false };
  if (!fileExists(webPath)) return { bad: true, reason: "missing" };
  const content = readSvg(webPath);
  if (!content) return { bad: true, reason: "unreadable" };
  if (content.length < 150) return { bad: true, reason: "tiny" };
  if (BAD_SVG_CONTENT_RE.test(content)) return { bad: true, reason: "placeholder" };
  if (
    /#0f172a/.test(content) &&
    /#1e293b/.test(content) &&
    /Question-specific|placeholder/i.test(content)
  ) {
    return { bad: true, reason: "placeholder" };
  }
  return { bad: false };
}

function isFakeQuestion(q, subject, auditFns) {
  const { extractText, isJunkQuestionText, isGarbledBijoyText } = auditFns;
  const text = extractText(q);
  const issues = [];

  if (!text || text.length < 6) issues.push("empty_stem");
  if (isGarbledBijoyText(text)) issues.push("garbled");
  if (isJunkQuestionText(text, subject)) issues.push("junk");
  if (/replace with Bengali|image-based question missing|\[diagram required\]|চিত্র\/ডায়াগ্রাম প্রয়োজন$/i.test(text)) {
    issues.push("placeholder_stem");
  }
  if (/^q\d+$/i.test(text) || /^question\s*\d+$/i.test(text)) issues.push("placeholder_stem");
  if (/^Chemistry Q\d|^Physics Q\d|^Biology Q\d/i.test(text)) issues.push("template_stem");

  const opts = getOptions(q);
  const filled = opts.filter((o) => String(o ?? "").trim());
  if (filled.length < 4) issues.push("bad_options");

  const allPlaceholderOpts =
    filled.length >= 4 && filled.every((o) => PLACEHOLDER_OPT_RE.test(String(o).trim()));
  if (allPlaceholderOpts) {
    const hasValidOptionImages =
      Array.isArray(q.optionImages) &&
      q.optionImages.length >= 4 &&
      q.optionImages.every((p) => p && !isBadSvgWebPath(p).bad);
    if (!hasValidOptionImages) issues.push("fake_options");
  }

  return issues;
}

function auditQuestionSvg(q) {
  const issues = [];
  const img = imagePath(q);
  if (img) {
    const s = isBadSvgWebPath(img);
    if (s.bad) issues.push({ field: "image", reason: s.reason, path: img });
  }
  if (Array.isArray(q.optionImages)) {
    q.optionImages.forEach((p, i) => {
      if (!p) return;
      const s = isBadSvgWebPath(p);
      if (s.bad) issues.push({ field: `optionImages[${i}]`, reason: s.reason, path: p });
    });
  }
  return issues;
}

function stripBadSvgFields(q) {
  const next = { ...q };
  let changed = false;
  const svgIssues = auditQuestionSvg(next);

  for (const issue of svgIssues) {
    const requiresVisual = needsDiagram(next) || optionsNeedGraph(next);
    if (issue.field === "image") {
      if (!requiresVisual || issue.reason === "placeholder") {
        next.image = null;
        changed = true;
      }
    }
    if (issue.field.startsWith("optionImages")) {
      if (!optionsNeedGraph(next) || issue.reason === "placeholder") {
        if (Array.isArray(next.optionImages)) {
          const idx = parseInt(issue.field.match(/\d+/)?.[0] ?? "-1", 10);
          if (idx >= 0) {
            next.optionImages = [...next.optionImages];
            next.optionImages[idx] = null;
            changed = true;
          }
        }
      }
    }
  }

  if (Array.isArray(next.optionImages) && next.optionImages.every((p) => !p)) {
    next.optionImages = null;
    changed = true;
  }

  return { question: next, changed, remainingSvgIssues: auditQuestionSvg(next) };
}

function countUnfixableBadSvg(questions) {
  let count = 0;
  for (const q of questions) {
    const issues = auditQuestionSvg(q);
    const unfixable = issues.filter((issue) => {
      if (issue.field === "image" && needsDiagram(q)) return true;
      if (issue.field.startsWith("optionImages") && optionsNeedGraph(q)) return true;
      return false;
    });
    count += unfixable.length;
  }
  return count;
}

function isProtectedSetId(setId) {
  const s = String(setId).toLowerCase();
  return (
    s.includes("tier-a-hot") ||
    s.includes("hyper-mega-hot") ||
    s.includes("high-priority") ||
    s.includes("board-analyzed-premium") ||
    /chapter-\d{2}-model-test-0[67]$/.test(s) ||
    s === "cumilla-2024"
  );
}

function isAutoQuarantineFile(setId) {
  const s = String(setId).toLowerCase();
  return (
    /split-01-split/.test(s) ||
    /^physicsfirstpaper/.test(s) ||
    /^chemistryset\d/.test(s) ||
    s.includes("killer-set") ||
    /-split-\d+-split-\d+/.test(s)
  );
}

module.exports = {
  isBadSvgWebPath,
  isFakeQuestion,
  auditQuestionSvg,
  stripBadSvgFields,
  countUnfixableBadSvg,
  isProtectedSetId,
  isAutoQuarantineFile,
  PLACEHOLDER_OPT_RE,
};
