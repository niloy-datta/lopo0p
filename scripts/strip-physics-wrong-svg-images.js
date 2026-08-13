/**
 * Remove wrong/placeholder SVG image links from SSC Physics question JSON.
 * Premium board SVGs are text-only placeholders — not real diagrams.
 */
const fs = require("fs");
const path = require("path");
const { sanitizePhysicsImage } = require("./lib/ssc-physics-premium-bank");

const ROOT = path.resolve(__dirname, "..");
const QUESTIONS_DIR = path.join(ROOT, "public", "questions", "physics");
const ANSWERS_DIR = path.join(ROOT, "backend", "data", "answers", "physics");
const MEGA_PATH = path.join(ROOT, "public", "quiz-data", "ssc", "physics.json");

function stripFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(raw)) return { changed: 0, total: 0 };
  let changed = 0;
  const out = raw.map((q) => {
    const text = String(q.text ?? "").trim();
    const nextImage = sanitizePhysicsImage(q.image ?? null, text);
    if (nextImage !== (q.image ?? null)) changed++;
    return { ...q, image: nextImage };
  });
  if (changed) fs.writeFileSync(filePath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  return { changed, total: raw.length };
}

function syncMega() {
  if (!fs.existsSync(MEGA_PATH)) return;
  const mega = JSON.parse(fs.readFileSync(MEGA_PATH, "utf8"));
  if (!mega.modelTests) return;
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
  const files = fs.readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith(".json") && f !== "index.json");
  let totalChanged = 0;
  for (const f of files) {
    const { changed } = stripFile(path.join(QUESTIONS_DIR, f));
    if (changed) console.log(`  ${f}: stripped ${changed} image(s)`);
    totalChanged += changed;
  }
  const megaSynced = syncMega() ?? 0;
  console.log(`Done. Stripped ${totalChanged} wrong image link(s). Mega synced: ${megaSynced}.`);
}

main();
