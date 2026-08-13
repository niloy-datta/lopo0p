# Project Maintainability Plan

This document keeps the project structure stable and production-friendly.

## Core principles

1. Do not rebuild the project from zero.
2. Do not delete existing quiz questions.
3. Do not add ICT subject or ICT questions.
4. Keep public question data separate from backend answer keys.
5. Keep import scripts idempotent where possible.
6. Every automated change must generate a report under `data/reports/`.
7. Every data mutation must have a backup under `data/backups/`.
8. Keep generated imports, reports, archives, and runtime assets in their owned folders.
9. Run filename audits before large content imports.

## Current architecture

| Area | Path | Notes |
| --- | --- | --- |
| Next.js app routes | `app/` | App Router frontend pages |
| Shared frontend logic | `src/` | Components, route helpers, loaders |
| FastAPI backend | `backend/app/` | API routes, auth, Firestore REST |
| Vercel API entry | `api/index.py` | Imports FastAPI app from backend |
| Public quiz data | `public/quiz-data/` | Public metadata/model-test JSON |
| Public question files | `public/questions/` | Public question payloads without answer keys |
| Backend answer keys | `backend/data/answers/` | Private answer/explanation maps |
| Data scripts | `scripts/` | Audit/import/fix utilities |
| Reports | `data/reports/` | Generated audit/fix reports |
| Backups | `data/backups/` | Before-change backups |

## File naming policy

- Use `docs/NAMING_RULES.md` as the naming source of truth.
- Use `npm run lint:filenames` before and after bulk imports.
- Normalize generated filenames before importing them into `public/questions/` or `backend/data/answers/`.
- Never import files with copy suffixes like `(1)` or repeated suffix chains like `-split-01-split-01-split-01`.
- Keep root-level files limited to app config, package metadata, and canonical docs.

## Data safety rules

### Questions

- Never delete question files as a first fix.
- Prefer quarantine/report over deletion.
- If a question is invalid, mark it in report first.
- If cleanup is required, create a backup first.

### Answers

- Public files must not expose final answer keys.
- Backend answer files must stay synced with public question IDs.
- If answer is uncertain, mark `answer_review_needed: true` instead of guessing.

### ICT

- ICT must not appear as a live subject.
- ICT data found in live paths must be quarantined or reported.
- No ICT questions should be added.

## Deployment workflow

Recommended order:

1. Backup data.
2. Run audit commands.
3. Fix integrity issues.
4. Import verified missing sources only.
5. Validate MCQ data.
6. Run filename audit.
7. Run typecheck, tests, and build.
8. Deploy to Vercel.
9. Verify live routes.

## Required reports before launch

- `data/reports/phase0_backup_report.md`
- `data/reports/phase1_ict_status_report.md`
- `data/reports/phase2_source_discovery_report.md`
- `data/reports/phase2_import_log.csv`
- `data/reports/final_launch_report.md`

## Launch readiness score rule

| Score | Meaning |
| --- | --- |
| 90-100 | GO |
| 75-89 | CONDITIONAL GO |
| Below 75 | NO-GO |

A launch score must not be assigned without audit/build evidence.
