# File Name Audit

Generated: 2026-08-20T18:58:23.148Z

Errors: 0
Warnings: 21

| Severity | File | Reason |
| --- | --- | --- |
| warning | `frontend_all_code.md` | root data/archive file should live under data/, docs/, resources/, or public/ |
| warning | `frontend_all_code.md` | contains underscores |
| warning | `scripts/RESET-VSCODE.bat` | does not match documented naming convention in scripts |
| warning | `scripts/check_page_text.js` | does not match documented naming convention in scripts |
| warning | `scripts/clone_board_images.js` | does not match documented naming convention in scripts |
| warning | `scripts/extract_board_questions.js` | does not match documented naming convention in scripts |
| warning | `scripts/find_all_sitemap_links.js` | does not match documented naming convention in scripts |
| warning | `scripts/probe_lekhaporabd_urls.js` | does not match documented naming convention in scripts |
| warning | `scripts/scan_for_fake_questions.js` | does not match documented naming convention in scripts |
| warning | `scripts/scan_mega_quiz_data.js` | does not match documented naming convention in scripts |
| warning | `scripts/scrape_and_clone_2025.js` | does not match documented naming convention in scripts |
| warning | `scripts/tmp-lekhaporabd-ocr/01-HSC-Physics-2nd-MCQ.png` | does not match documented naming convention in scripts/tmp-lekhaporabd-ocr |
| warning | `scripts/tmp-lekhaporabd-ocr/HSC-Physics-2nd-MCQ.png` | does not match documented naming convention in scripts/tmp-lekhaporabd-ocr |
| warning | `src/hooks/useDebounce.ts` | does not match documented naming convention in src/hooks |
| warning | `src/hooks/useSavedQuestions.ts` | does not match documented naming convention in src/hooks |
| warning | `src/hooks/useWrongAnswers.ts` | does not match documented naming convention in src/hooks |
| warning | `src/lib/mockData.ts` | does not match documented naming convention in src/lib |
| warning | `src/lib/moldeTestPhyicsFirstPaperHSC.text` | does not match documented naming convention in src/lib |
| warning | `src/store/quizStore.ts` | does not match documented naming convention in src/store |
| warning | `ssc_board_questions.md` | root data/archive file should live under data/, docs/, resources/, or public/ |
| warning | `ssc_board_questions.md` | contains underscores |

Rules: runtime data should use lowercase kebab-case, generated duplicates like `(1)` are not accepted, repeated `-split-01` suffixes must be normalized before import, and root-level data/archive files should be moved to an owned folder.
