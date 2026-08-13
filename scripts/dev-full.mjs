import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const isWin = process.platform === "win32";

function run(label, command, args, cwd = root) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: isWin,
    env: process.env,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[dev:full] ${label} exited with code ${code}`);
    }
  });

  return child;
}

console.log("[dev:full] Starting FastAPI on http://localhost:8000 …");
const venvUvicorn = path.join(root, ".venv", isWin ? "Scripts" : "bin", isWin ? "uvicorn.exe" : "uvicorn");
const uvicornCmd = fs.existsSync(venvUvicorn) ? venvUvicorn : "uvicorn";

const backend = run(
  "backend",
  uvicornCmd,
  ["app.main:app", "--reload", "--port", "8000"],
  path.join(root, "backend"),
);

console.log("[dev:full] Starting Next.js …");
const frontend = run("frontend", isWin ? "npm.cmd" : "npm", ["run", "dev:clean"], root);

function shutdown() {
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
