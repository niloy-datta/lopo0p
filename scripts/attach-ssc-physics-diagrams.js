/**
 * Attach high-quality trusted physics SVGs to questions that need diagrams.
 * Usage: node scripts/attach-ssc-physics-diagrams.js [--dry-run]
 */
const fs = require("fs");
const path = require("path");
const { attachDiagramsToQuestions } = require("./lib/ssc-physics-diagram-resolver");

const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions", "physics");
const MEGA_PATH = path.join(ROOT, "public", "quiz-data", "ssc", "physics.json");
const DRY_RUN = process.argv.includes("--dry-run");
const BOARD_FILE_RE =
  /(?:barishal|barisal|chattogram|cumilla|dhaka|dinajpur|jashore|jessore|mymensingh|rajshahi|sylhet)-20\d{2}\.json$/;

function isBoardQuestionFile(filePath) {
  const base = path.basename(filePath);
  return BOARD_FILE_RE.test(base) || /board/i.test(base);
}

function patchFile(filePath, stats) {
  if (isBoardQuestionFile(filePath)) {
    stats.skippedBoard++;
    return;
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(raw)) return;
  const { changed, report } = attachDiagramsToQuestions(raw);
  if (changed > 0) {
    stats.files++;
    stats.attached += report.attached;
    stats.stripped += report.stripped;
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
    }
    console.log(`  ${path.basename(filePath)}: +${report.attached} -${report.stripped}`);
  }
  for (const u of report.unresolved) {
    stats.unresolved.push({ file: path.basename(filePath), ...u });
  }
}

function syncMega() {
  if (!fs.existsSync(MEGA_PATH) || DRY_RUN) return 0;
  const mega = JSON.parse(fs.readFileSync(MEGA_PATH, "utf8"));
  if (!mega.modelTests) return 0;
  let synced = 0;
  for (const [setId, questions] of Object.entries(mega.modelTests)) {
    const pubPath = path.join(QUESTIONS_DIR, `${setId}.json`);
    if (!fs.existsSync(pubPath)) continue;
    const pub = JSON.parse(fs.readFileSync(pubPath, "utf8"));
    const byId = new Map(pub.map((q) => [q.id, q]));
    mega.modelTests[setId] = questions.map((q) => {
      const src = byId.get(q.id);
      if (src && src.image !== q.image) {
        synced++;
        return { ...q, image: src.image ?? null };
      }
      return q;
    });
  }
  if (synced) fs.writeFileSync(MEGA_PATH, `${JSON.stringify(mega, null, 2)}\n`, "utf8");
  return synced;
}

function main() {
  const files = fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith(".json") && f !== "index.json");
  const stats = { files: 0, attached: 0, stripped: 0, unresolved: [], skippedBoard: 0 };
  console.log(DRY_RUN ? "Dry run — no files written" : "Attaching SSC physics diagrams...");
  for (const f of files) patchFile(path.join(QUESTIONS_DIR, f), stats);
  const megaSynced = syncMega();
  console.log(
    `Done. ${stats.attached} attached, ${stats.stripped} stripped in ${stats.files} files. Board files skipped: ${stats.skippedBoard}. Mega synced: ${megaSynced}.`,
  );
  if (stats.unresolved.length) {
    console.log(`Unresolved (${stats.unresolved.length}):`);
    stats.unresolved.slice(0, 10).forEach((u) => console.log(`  ${u.file} ${u.id}: ${u.text}`));
  }
}

main();
