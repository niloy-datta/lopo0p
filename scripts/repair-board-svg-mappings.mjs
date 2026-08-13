/**
 * Replace generic wrong SVG mappings across board question files.
 *
 * Fixes:
 * - circuit-series.svg on questions with specific R1/R2/R3 uddepok → per-question circuit SVG
 * - Generic parabola option SVGs when options are plain unit symbols → text-only options
 *
 * Run: node scripts/repair-board-svg-mappings.mjs
 * Dry: node scripts/repair-board-svg-mappings.mjs --dry-run
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { circuitFromQuestionText, unitSymbolOption } from "./lib/board-svg-generators.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QUESTIONS = path.join(ROOT, "public", "questions");
const PREMIUM = path.join(ROOT, "public", "images", "quiz", "premium");
const DRY_RUN = process.argv.includes("--dry-run");

const BOARD_FILE_RE =
  /(?:barishal|barisal|chattogram|cumilla|comilla|dhaka|dinajpur|jashore|jessore|mymensingh|rajshahi|sylhet)-20\d{2}\.json$/i;

const GENERIC_OPTION_SVG_RE =
  /<text[^>]*>(?:ক|খ|গ|ঘ|Option [কখগঘ])<\/text>[\s\S]*<path d="M 80 300/s;

function listQuestionFiles() {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const fp = path.join(dir, name);
      if (fs.statSync(fp).isDirectory()) walk(fp);
      else if (name.endsWith(".json") && name !== "index.json") out.push(fp);
    }
  }
  walk(QUESTIONS);
  return out;
}

function isGenericOptionSvg(webPath) {
  const abs = path.join(ROOT, "public", webPath.replace(/^\//, ""));
  if (!fs.existsSync(abs)) return false;
  const c = fs.readFileSync(abs, "utf8");
  return GENERIC_OPTION_SVG_RE.test(c) || /সঠিক সম্পর্ক অনুযায়ী সরলরেখা/.test(c);
}

function needsCustomCircuit(q) {
  const t = String(q.text ?? "");
  if (q.image !== "/images/quiz/circuit-series.svg") return false;
  if (/NOR|গেইট|এনট্রপি|entropy/i.test(t)) return false;
  return /বর্তনী|উদ্দীপক|R[_\s]*[123]|Ω|ওহম|তড়িৎ প্রবাহ|তুল্যরোধ|ধারকত্ব/i.test(t);
}

function wrongCircuitImage(q) {
  const t = String(q.text ?? "");
  if (q.image !== "/images/quiz/circuit-series.svg") return false;
  return /NOR|গেইট/i.test(t);
}

function writePremiumSvg(questionId, suffix, content) {
  const fileName = suffix ? `${questionId}-${suffix}.svg` : `${questionId}.svg`;
  const webPath = `/images/quiz/premium/${fileName}`;
  if (!DRY_RUN) {
    fs.mkdirSync(PREMIUM, { recursive: true });
    fs.writeFileSync(path.join(PREMIUM, fileName), content, "utf8");
  }
  return webPath;
}

function repairQuestion(q) {
  const next = { ...q };
  let changed = false;
  const id = String(q.id ?? "");

  if (needsCustomCircuit(q)) {
    const newPath = writePremiumSvg(
      id,
      "circuit",
      circuitFromQuestionText(q.text, "উদ্দীপক বর্তনী"),
    );
    if (next.image !== newPath) {
      next.image = newPath;
      changed = true;
    }
  }

  if (wrongCircuitImage(q)) {
    next.image = "/images/quiz/nor-gate.svg";
    changed = true;
  }

  if (Array.isArray(next.optionImages) && /মৌলিক একক/.test(next.text ?? "")) {
    const allGeneric = next.optionImages.every(isGenericOptionSvg);
    if (allGeneric) {
      next.options = ["N", "J", "Pa", "K"];
      next.image = null;
      next.optionImages = null;
      changed = true;
    }
  }

  if (next.image && isGenericOptionSvg(next.image) && /মৌলিক একক/.test(next.text ?? "")) {
    next.image = null;
    changed = true;
  }

  // Text-only vector MCQ: drop misleading vector diagram
  if (
    next.image?.includes("cumilla-ts-3") &&
    /ভেক্টর রাশি/.test(next.text ?? "") &&
    next.options?.some((o) => /ত্বরণ|সরণ|ভর/.test(String(o)))
  ) {
    next.image = null;
    changed = true;
  }

  return { question: next, changed };
}

function main() {
  let filesChanged = 0;
  let questionsChanged = 0;

  for (const fp of listQuestionFiles()) {
    if (fp.endsWith("cumilla-2024.json") && fp.includes("/physics/")) continue;

    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch {
      continue;
    }
    const questions = Array.isArray(raw) ? raw : raw.questions;
    if (!Array.isArray(questions)) continue;

    let fileChanged = false;
    const repaired = questions.map((q) => {
      const { question, changed } = repairQuestion(q);
      if (changed) {
        fileChanged = true;
        questionsChanged++;
      }
      return question;
    });

    if (!fileChanged) continue;
    filesChanged++;
    if (!DRY_RUN) {
      const out = Array.isArray(raw) ? repaired : { ...raw, questions: repaired };
      fs.writeFileSync(fp, `${JSON.stringify(out, null, 2)}\n`, "utf8");
    }
    console.log(`${DRY_RUN ? "would fix" : "fixed"}: ${path.relative(ROOT, fp)}`);
  }

  console.log(
    `${DRY_RUN ? "Would change" : "Changed"} ${questionsChanged} question(s) in ${filesChanged} file(s).`,
  );
}

main();
