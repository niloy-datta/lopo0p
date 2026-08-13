# Maintenance Cleanup - 2026-06-29

## Current architecture

- `app/`: Next.js App Router pages, layouts, route handlers, and metadata routes.
- `src/`: shared frontend components, hooks, stores, quiz loaders, route helpers, and validation utilities.
- `backend/app/`: FastAPI backend, auth/session support, Firestore access, quiz routes, and scoring services.
- `public/quiz-data/` and `public/questions/`: public quiz metadata and question payloads.
- `backend/data/answers/`: private answer/explanation payloads used by backend services.
- `scripts/`: import, audit, sync, SVG, and data repair utilities.

## Cleanup completed

- Removed tracked local TypeScript scratch/error artifacts:
  - `tmp_chk.js`
  - `tsc-errors.txt`
- Removed tracked local Prisma SQLite database:
  - `packages/database/prisma/dev.db`
- Cleared ignored local runtime/build artifacts from the working tree:
  - `.next/`
  - `backend/.venv/`
  - Python `__pycache__/` folders under `backend/app/`

## Why these were safe

- The removed files are already covered by `.gitignore` patterns or are local runtime outputs.
- None of the removed files are active application source files.
- Quiz question data and answer-key changes were left untouched because the working tree already contains large uncommitted content changes.

## Next cleanup order

1. Review tracked files that match `.gitignore` and decide which are source-of-truth versus old imports/archives.
2. Move root-level source data packs into `data/imports/` or `data/archive/`, or untrack them if they are reproducible.
3. Keep only active runtime data in `public/quiz-data/`, `public/questions/`, and `backend/data/answers/`.
4. Split one-off scripts into `scripts/archive/` after confirming they are not referenced by `package.json`.
5. Run the quality gate after each cleanup batch:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`

## Do not delete yet

- Existing modified/deleted quiz and answer JSON files.
- New untracked generated quiz files.
- Data backups under `data/backups/`.
- Any file referenced by a `package.json` script.
