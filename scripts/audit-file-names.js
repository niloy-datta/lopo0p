#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const reportDir = path.join(root, 'data', 'reports');
const strict = process.argv.includes('--strict');

const ignoredDirs = new Set([
  '.git',
  '.github',
  '.next',
  'node_modules',
  'data/backups',
  'docs/raw-questions',
  'tmp',
  'scratch',
]);

const legacyRootFiles = new Set([
  'AGENTS.md',
  'README.md',
  'SECURITY.md',
]);


const allowedRootFiles = new Set([
  ...legacyRootFiles,
  '.cursorignore',
  '.env.example',
  '.env.local',
  '.env.local.example',
  '.eslintrc.json',
  '.gitignore',
  '.vercelignore',
  'firebase.json',
  'firestore.rules',
  'middleware.ts',
  'next-env.d.ts',
  'next.config.mjs',
  'package-lock.json',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'postcss.config.js',
  'requirements.txt',
  'tailwind.config.ts',
  'tsconfig.json',
  'tsconfig.typecheck.json',
  'turbo.json',
  'vercel.json',
  'vitest.config.ts',
]);

const componentDirs = [
  'src/components/',
  'src/context/',
  'src/hooks/',
  'src/store/',
  'app/hsc-board-questions/',
  'app/ssc-board-questions/',
];

const validKebab = /^[a-z0-9]+(?:-[a-z0-9]+)*(\.[a-z0-9]+)*$/;
const validRouteSegment = /^\[[a-zA-Z][a-zA-Z0-9]*\]$/;
const validPascalFile = /^[A-Z][A-Za-z0-9]*(\.[a-z]+)?\.(tsx|ts)$/;

function shouldIgnore(rel) {
  return rel.split('/').some((part, index, parts) => {
    const prefix = parts.slice(0, index + 1).join('/');
    return ignoredDirs.has(prefix) || ignoredDirs.has(part);
  });
}

function walk(dir = '.', out = []) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/').replace(/^\.\//, '');
    if (shouldIgnore(rel)) continue;
    if (entry.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

function isComponentFile(rel) {
  return componentDirs.some((dir) => rel.startsWith(dir)) && /\.(tsx|ts)$/.test(rel);
}

function badNameReason(rel) {
  const name = path.basename(rel);
  if (/\s/.test(name)) return 'contains spaces';
  if (/[()]/.test(name)) return 'contains parentheses';
  if (/-split-\d{2}(?:-split-\d{2}){2,}/.test(name)) return 'repeated split suffix';
  if (
    /_/.test(name)
    && (
      !rel.includes('/')
      || rel.startsWith('public/questions/')
      || rel.startsWith('backend/data/answers/')
      || rel.startsWith('data/imports/')
    )
  ) {
    return 'contains underscores';
  }
  return null;
}

function isAcceptedCodeName(rel) {
  const name = path.basename(rel);
  if (name === 'page.tsx' || name === 'layout.tsx' || name === 'loading.tsx' || name === 'error.tsx' || name === 'route.ts') {
    return true;
  }
  if (/^[a-z][a-z0-9_]*\.py$/.test(name)) return true;
  if (isComponentFile(rel)) return validPascalFile.test(name) || validKebab.test(name);
  return validKebab.test(name);
}

const files = walk();
const issues = [];

for (const rel of files) {
  const name = path.basename(rel);
  const dir = path.dirname(rel);
  const rootFile = !rel.includes('/');
  const reason = badNameReason(rel);

  if (rootFile && !allowedRootFiles.has(rel)) {
    issues.push({
      severity: 'warning',
      file: rel,
      reason: 'root data/archive file should live under data/, docs/, resources/, or public/',
    });
  }

  if (reason) {
    issues.push({
      severity: rel.startsWith('public/questions/') || rel.startsWith('backend/data/answers/') ? 'error' : 'warning',
      file: rel,
      reason,
    });
  }

  if (
    /^(app|src|scripts|tests)\//.test(rel)
    && !rel.includes('/raw-questions/')
    && !legacyRootFiles.has(name)
    && !validRouteSegment.test(name)
    && !isAcceptedCodeName(rel)
  ) {
    issues.push({
      severity: 'warning',
      file: rel,
      reason: `does not match documented naming convention in ${dir}`,
    });
  }
}

fs.mkdirSync(reportDir, { recursive: true });

const errorCount = issues.filter((issue) => issue.severity === 'error').length;
const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
const lines = [
  '# File Name Audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Errors: ${errorCount}`,
  `Warnings: ${warningCount}`,
  '',
  '| Severity | File | Reason |',
  '| --- | --- | --- |',
  ...issues.map((issue) => `| ${issue.severity} | \`${issue.file}\` | ${issue.reason} |`),
  '',
  'Rules: runtime data should use lowercase kebab-case, generated duplicates like `(1)` are not accepted, repeated `-split-01` suffixes must be normalized before import, and root-level data/archive files should be moved to an owned folder.',
].join('\n');

fs.writeFileSync(path.join(reportDir, 'file-name-audit.md'), `${lines}\n`, 'utf8');

console.log('File name audit');
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);
console.log('Report: data/reports/file-name-audit.md');

if (strict && issues.length > 0) {
  process.exit(1);
}
