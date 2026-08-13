#!/usr/bin/env node
/**
 * God-tier corpus purge:
 * - Remove fake / junk / garbled questions
 * - Strip wrong placeholder SVGs where text-only is OK
 * - Quarantine entire sets with >2 unfixable bad SVGs
 * - Quarantine auto-junk split imports and low-quality sets
 *
 * Usage:
 *   node scripts/purge-fake-and-bad-svg-sets.js --dry-run
 *   node scripts/purge-fake-and-bad-svg-sets.js --apply
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const {
  isFakeQuestion,
  stripBadSvgFields,
  countUnfixableBadSvg,
  isProtectedSetId,
  isAutoQuarantineFile,
} = require("./lib/question-quality-audit");
const {
  isGarbledBijoyText,
  isJunkQuestionText,
  isLowQualitySet,
  extractText,
} = require("./lib/ssc-set-quality");

const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_ROOT = path.join(ROOT, "public", "questions");
const QUIZ_DATA = path.join(ROOT, "public", "quiz-data");
const QUARANTINE_ROOT = path.join(ROOT, "data", "quarantine", `purge-${new Date().toISOString().slice(0, 10)}`);
const REPORT_PATH = path.join(ROOT, "data", "reports", "purge-fake-bad-svg-report.json");
const APPLY = process.argv.includes("--apply");
const MAX_UNFIXABLE_SVG_PER_SET = 2;

const auditFns = { extractText, isJunkQuestionText, isGarbledBijoyText };

function listQuestionFiles() {
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const fp = path.join(dir, name);
      if (fs.statSync(fp).isDirectory()) walk(fp);
      else if (name.endsWith(".json") && name !== "index.json") out.push(fp);
    }
  }
  walk(QUESTIONS_ROOT);
  return out;
}

function subjectFromPath(fp) {
  return path.relative(QUESTIONS_ROOT, fp).split(path.sep)[0] ?? "";
}

function setIdFromPath(fp) {
  return path.basename(fp, ".json");
}

function isBoardYearFile(setId) {
  return /-(20\d{2}|2026)$/.test(setId);
}

function minQuestionsForSet(setId) {
  if (isBoardYearFile(setId)) return 12;
  return 18;
}

function quarantineFile(fp) {
  const rel = path.relative(QUESTIONS_ROOT, fp);
  const dest = path.join(QUARANTINE_ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(fp)) {
    if (!fs.existsSync(dest)) fs.renameSync(fp, dest);
    else {
      fs.copyFileSync(fp, dest);
      fs.unlinkSync(fp);
    }
  }
}

function removeFromMega(setId, subjectSlug) {
  for (const level of ["ssc", "hsc"]) {
    const megaPath = path.join(QUIZ_DATA, level, `${subjectSlug}.json`);
    if (!fs.existsSync(megaPath)) continue;
    const mega = JSON.parse(fs.readFileSync(megaPath, "utf8"));
    let changed = false;
    if (mega.modelTests?.[setId]) {
      delete mega.modelTests[setId];
      changed = true;
    }
    if (mega.modelTestsMeta?.[setId]) {
      delete mega.modelTestsMeta[setId];
      changed = true;
    }
    if (changed && APPLY) {
      fs.writeFileSync(megaPath, `${JSON.stringify(mega, null, 2)}\n`, "utf8");
    }

    const idxPath = path.join(QUIZ_DATA, level, `${subjectSlug}.model-tests.index.json`);
    if (fs.existsSync(idxPath) && APPLY) {
      const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
      if (idx.modelTests?.[setId]) {
        delete idx.modelTests[setId];
        fs.writeFileSync(idxPath, `${JSON.stringify(idx, null, 2)}\n`, "utf8");
      }
    }
  }

  const indexPath = path.join(QUESTIONS_ROOT, subjectSlug, "index.json");
  if (fs.existsSync(indexPath) && APPLY) {
    const idx = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    if (Array.isArray(idx.modelTests)) {
      const next = idx.modelTests.filter((m) => m.id !== setId);
      if (next.length !== idx.modelTests.length) {
        idx.modelTests = next;
        fs.writeFileSync(indexPath, `${JSON.stringify(idx, null, 2)}\n`, "utf8");
      }
    }
  }
}

function processFile(fp) {
  const setId = setIdFromPath(fp);
  const subject = subjectFromPath(fp);
  const rel = path.relative(ROOT, fp);

  if (isProtectedSetId(setId)) {
    return { action: "skipped_protected", rel };
  }

  let questions;
  try {
    questions = JSON.parse(fs.readFileSync(fp, "utf8"));
  } catch {
    return { action: "corrupt_json", rel };
  }
  if (!Array.isArray(questions) || !questions.length) {
    return { action: "empty_file", rel };
  }

  if (isAutoQuarantineFile(setId)) {
    if (APPLY) {
      quarantineFile(fp);
      removeFromMega(setId, subject);
    }
    return { action: "quarantined_auto_junk", rel, before: questions.length };
  }

  const texts = questions.map((q) => extractText(q));
  const garbledHits = texts.filter(isGarbledBijoyText).length;
  if (garbledHits >= Math.ceil(questions.length * 0.35)) {
    if (APPLY) {
      quarantineFile(fp);
      removeFromMega(setId, subject);
    }
    return { action: "quarantined_garbled", rel, garbledHits, before: questions.length };
  }

  let removedFake = 0;
  let strippedSvg = 0;
  const kept = [];

  for (const q of questions) {
    const fakeIssues = isFakeQuestion(q, subject, auditFns);
    if (fakeIssues.length) {
      removedFake++;
      continue;
    }

    const { question, changed } = stripBadSvgFields(q);
    if (changed) strippedSvg++;
    kept.push(question);
  }

  const unfixableBadSvg = countUnfixableBadSvg(kept);
  const junkAfter = kept.filter((q) => isJunkQuestionText(extractText(q), subject)).length;
  const boardYear = isBoardYearFile(setId);
  const lowQuality = !boardYear && isLowQualitySet(kept, subject);
  const tooFew = kept.length < minQuestionsForSet(setId);

  const shouldQuarantine =
    unfixableBadSvg > MAX_UNFIXABLE_SVG_PER_SET ||
    junkAfter >= 3 ||
    lowQuality ||
    (tooFew && !boardYear);

  if (shouldQuarantine) {
    if (APPLY) {
      quarantineFile(fp);
      removeFromMega(setId, subject);
    }
    return {
      action: "quarantined_quality",
      rel,
      before: questions.length,
      after: kept.length,
      removedFake,
      strippedSvg,
      unfixableBadSvg,
      junkAfter,
      lowQuality,
      tooFew,
    };
  }

  const changed = removedFake > 0 || strippedSvg > 0 || kept.length !== questions.length;
  if (changed && APPLY) {
    fs.writeFileSync(fp, `${JSON.stringify(kept, null, 2)}\n`, "utf8");
  }

  return {
    action: changed ? "cleaned" : "ok",
    rel,
    before: questions.length,
    after: kept.length,
    removedFake,
    strippedSvg,
    unfixableBadSvg,
  };
}

function main() {
  const report = {
    generatedAt: new Date().toISOString(),
    mode: APPLY ? "apply" : "dry-run",
    summary: {
      files: 0,
      cleaned: 0,
      quarantined: 0,
      removedFakeQuestions: 0,
      strippedSvgQuestions: 0,
      skippedProtected: 0,
    },
    details: [],
  };

  for (const fp of listQuestionFiles()) {
    const result = processFile(fp);
    report.details.push(result);
    report.summary.files++;

    if (result.action === "skipped_protected") report.summary.skippedProtected++;
    if (result.action === "cleaned") {
      report.summary.cleaned++;
      report.summary.removedFakeQuestions += result.removedFake ?? 0;
      report.summary.strippedSvgQuestions += result.strippedSvg ?? 0;
    }
    if (result.action.startsWith("quarantined")) {
      report.summary.quarantined++;
      report.summary.removedFakeQuestions += result.removedFake ?? 0;
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`${APPLY ? "APPLIED" : "DRY-RUN"} purge complete`);
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);

  if (APPLY) {
    console.log("\nSyncing sidecars → mega JSON...");
    execSync("node scripts/sync-fixes-to-mega.js", { cwd: ROOT, stdio: "inherit" });
    console.log("\nValidating SVG links...");
    execSync("node scripts/validate-svg-links.js", { cwd: ROOT, stdio: "inherit" });
  } else {
    console.log("\nRe-run with --apply to execute changes.");
  }
}

main();
