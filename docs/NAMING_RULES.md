# Naming Rules

Use predictable names so agents and scripts can find the right files without guessing.

## Folders

- Use lowercase kebab-case: `public/questions`, `data/imports`, `hsc-board-questions`.
- Dynamic Next.js route folders keep App Router syntax: `[level]`, `[subject]`, `[year]`.
- Year folders are numeric only: `2024`, `2025`, not `year-2024`.

## Code Files

- Route files use Next.js reserved names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`.
- Shared utility files use lowercase kebab-case: `quiz-server-loader.ts`, `diagram-topic-resolver.js`.
- React component files may use PascalCase when they export one component: `QuizRunner.tsx`, `BoardYearsSection.tsx`.
- Exports use `camelCase`; types and interfaces use `PascalCase`.

## Data Files

- Public question and answer sidecar files use lowercase kebab-case: `ssc-physics-chapter-01-model-test-01.json`.
- Do not use spaces, underscores, parentheses, or generated copy suffixes like `(1)`.
- Do not keep broken generated names with repeated suffixes such as `-split-01-split-01-split-01`.
- Board files use canonical board spellings: `dhaka`, `cumilla`, `barishal`, `chattogram`, `jashore`, `rajshahi`, `sylhet`, `dinajpur`, `mymensingh`.

## Root Directory

- Runtime code/config can stay at the root.
- Data imports go under `data/imports/`.
- Generated reports go under `data/reports/`.
- Source PDFs/images go under `resources/`.
- Public runtime assets go under `public/`.

Run `npm run lint:filenames` to generate `data/reports/file-name-audit.md`.
