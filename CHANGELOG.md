# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Project documentation (`AGENTS.md`) with full MVP spec, design tokens, component specs, and development workflow
- `.gitignore` for Next.js/Node.js project
- `CHANGELOG.md` following Keep a Changelog format
- Next.js 16 project scaffold with App Router, TypeScript, Tailwind CSS v4
  - `src/app/` with root layout, global CSS, and placeholder home page
  - ESLint (eslint-config-next with core-web-vitals + typescript)
  - PostCSS configured with `@tailwindcss/postcss`
  - TypeScript strict mode, bundler module resolution, `@/*` import alias
- `.env.example` with `NEXT_PUBLIC_API_BASE_URL` documented
- Design tokens configured in `globals.css` via Tailwind v4 `@theme`:
  - Background colors: `bg-primary`, `bg-surface`, `bg-elevated`, `bg-codeblock`
  - Text colors: `text-primary`, `text-secondary`, `text-tertiary`
  - Accent: `accent-primary` (#8B5CF6)
  - Border: `border` (#4A4A4A)
  - Diff colors: `diff-add-bg/text`, `diff-remove-bg/text`
  - Severity colors: `severity-low`, `severity-medium`, `severity-high`, `severity-critical`
  - Syntax highlight tokens: `syntax-keyword`, `syntax-string`, `syntax-type`, `syntax-param`, `syntax-punctuation`
- Custom fonts via `next/font/google`:
  - JetBrains Mono (`--font-jetbrains-mono`) — titles, labels, badges, buttons, code
  - IBM Plex Mono (`--font-ibm-plex-mono`) — body text, explanations, descriptions
  - Mapped to Tailwind: `font-sans`/`font-mono` (JetBrains Mono), `font-body` (IBM Plex Mono)
- highlight.js token CSS overrides (custom dark theme matching design palette)
- Base body styles: dark background (`#2B2B2B`), light text (`#FAFAFA`), monospace font
- Base UI components (`src/components/ui/`):
  - `Button` — Primary (accent-purple fill) and Secondary (bg-primary fill) variants, terminal `$` prefix, disabled state, focus ring
  - `Select` — Dark styled select for language picker, bg-surface, border, label + inline error support
  - `Textarea` — Dark code input with bg-codeblock, monospace font, label + inline error support
  - `Badge` — Severity badges (low/medium/high/critical with semantic colors) and category badges (quality/security/performance)
  - `Navbar` — Logo `> code_reviewer` (> in purple), nav links with active state detection via `usePathname`, CTA button (`$ start_review` / `$ new_review` on result page), bottom border
  - Barrel export (`index.ts`) for clean imports
  - All components use `tailwind-merge` (`twMerge`) for safe class merging and conflict resolution
- `CodeBlock` component (`src/components/ui/CodeBlock.tsx`):
  - Syntax highlighting via `highlight.js` (core + individual language imports: typescript, python, go, java)
  - Line numbers column with tertiary color (`#6B6B6B`)
  - Diff mode (`diff={true}`): lines prefixed with `+` get green bg/text, `-` get red bg/text
  - Truncation support: `maxLines` (default 500), `maxLength` (character limit)
  - `maxHeight` prop for scroll containment
  - Dark codeblock background (`#1E1B2E`), rounded border, horizontal scroll for long lines
  - No CSS imported from highlight.js — uses custom token styles from `globals.css`
- `CodeEditor` component (`src/components/ui/CodeEditor.tsx`):
  - Interactive code editor powered by CodeMirror 6 (`@uiw/react-codemirror`)
  - Custom dark theme matching design tokens (bg-codeblock, accent-primary caret, syntax colors)
  - Language support: JavaScript, TypeScript, Python, Go, Java (via `@codemirror/lang-*`)
  - Line numbers, bracket matching, auto-close brackets, indent on input
  - Controlled component: `value` + `onChange` props
  - `readOnly`, `disabled`, `placeholder`, `height` props
- Preview page (`page.tsx`) showcasing all components: Navbar, Button, Badge, Select, CodeEditor, Textarea, CodeBlock, CodeBlock diff
- Home page (`/`) with landing page layout matching Pencil design:
  - Hero section: purple tag badge (`// ai-powered code review`), terminal-style title, description, CTA buttons (`$ start_review` + `// learn_more`), `CodeBlock` preview on the right
  - Feature cards section: 3 cards (`[>]`, `[+/-]`, `[5]`) with `gap-10` matching design spacing
  - Preview section (`// veja como funciona`): mock `review_result` card with SVG donut score chart (6/10), high/security badges, issue preview, `>>` recommendation, diff `CodeBlock`
  - Bottom CTA: `$ testar agora` button linking to `/review`
  - Smooth scroll anchor from `// learn_more` to `#como-funciona` section
- API client (`src/lib/`):
  - `api-error.ts`: `ApiError` class with status code and user-friendly messages
  - `client.ts`: generic `request<T>()` fetch wrapper with 15s timeout, `AbortController`, network/HTTP error handling
  - `reviews.ts`: `createReview(data)` — `POST /reviews`, `getReview(id)` — `GET /reviews/:id`
  - `index.ts`: barrel export
- Type contracts (`src/types/`):
  - `language.ts`: `Language` type, `LANGUAGES` constant array
  - `review-enums.ts`: `Severity` + `SEVERITIES`, `Category` + `CATEGORIES` (const arrays + derived union types)
  - `review.ts`: `CreateReviewRequest`, `CreateReviewResponse`, `GetReviewResponse`, `ReviewResult`
  - `index.ts`: barrel export for all types
- Review page (`/review`) matching Pencil design:
  - Header: `$ new_review` title + subtitle
  - Language `Select`, `CodeEditor` (CodeMirror 6) for code input, `Textarea` for optional context
  - Inline validation: language required, code cannot be empty
  - Submit button `$ revisar_codigo` aligned right, disabled when invalid
  - Loading state: `$ analisando...`, form fields with `opacity-40` and `pointer-events-none`
  - Error display: styled error banner for API/network failures
  - On success: navigates to `/result/{id}` via `useRouter`
- React Query (`@tanstack/react-query`):
  - `QueryClientProvider` in root layout (`src/lib/query-client.tsx`)
  - Singleton `QueryClient` pattern for SSR/browser (no re-creation on re-render)
  - Default `staleTime: 60s` for queries, no retry on mutations
- `ScoreDonut` component (`src/components/ui/ScoreDonut.tsx`):
  - Reusable SVG donut chart with `score` and `max` props
  - Purple arc proportional to score, `score/max` label centered in purple
  - Used in Home page preview and Result page header
- Result page (`/result/[id]`) matching Pencil design:
  - `useQuery` to fetch `GET /reviews/:id` with automatic loading/error states
  - Header: `$ review_result` title, metadata (language, status), `ScoreDonut` chart
  - Summary section (`// summary`): card with bordered text
  - Positives section (`// positives`): cards with `[+]` prefix in purple
  - Issues section (`// issues [N]`): severity + category badges, title, explanation, `>>` recommendation in purple, `CodeBlock` with `diff={true}`
  - Suggestions section (`// suggestions`): cards with `>>` prefix in purple
  - Questions section (`// questions`): cards with `?` prefix in yellow (`#F59E0B`)
  - Loading skeleton with pulse animation
  - Error state with retry button and link to `/review`

### Changed
- Review page (`/review`): migrated from manual `useState` (`isSubmitting`, `error`) to React Query `useMutation` for `createReview`
  - Destructured `{ mutate, isPending, error }` from `useMutation`
  - No more manual state management for async submission
- Home page (`/`): replaced inline SVG donut chart with reusable `ScoreDonut` component
- State components (`src/components/states/`):
  - `LoadingState` — centered spinner with terminal-style title and optional description
  - `ErrorState` — error message with optional retry button and navigation link, configurable labels
  - `EmptyState` — empty/no-data message with optional navigation link
  - Barrel export (`index.ts`) for clean imports

### Changed
- Result page (`/result/[id]`): replaced inline `ResultSkeleton` and `ResultError` with reusable `LoadingState` and `ErrorState` components

### Added (tests)
- Test infrastructure: Vitest 4.x with jsdom environment, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`
  - `vitest.config.ts` with globals, `@/` alias resolution, setup file, `clearMocks`/`restoreMocks`
  - `src/__tests__/setup.ts` importing `@testing-library/jest-dom/vitest` matchers
  - `test` and `test:watch` scripts in `package.json`
- Unit tests for API client (`src/__tests__/lib/client.test.ts`): 7 tests covering GET/POST requests, HTTP errors, network failures, timeout/abort, unknown errors, `ApiError` class
- Unit tests for review functions (`src/__tests__/lib/reviews.test.ts`): 2 tests covering `createReview` POST and `getReview` GET
- Unit tests for state components:
  - `LoadingState.test.tsx`: 5 tests — default/custom title, description, spinner
  - `ErrorState.test.tsx`: 8 tests — message, title, retry button, link, custom labels, omitted props
  - `EmptyState.test.tsx`: 7 tests — default/custom title, description, link, custom label, omitted link

### Changed (docs)
- `AGENTS.md` updated with final setup instructions:
  - Added development workflow section (commit rules, conventions, changelog format, pre-commit checklist)
  - Updated technology versions to actual installed: Next.js 16, React 19, Tailwind CSS v4, Vitest 4, CodeMirror 6
  - Replaced "planned" folder structure with actual final tree (all files with descriptions)
  - Added complete "Como rodar" with `git clone` setup, verify steps, and all npm scripts
  - Updated components section to reflect all 8 UI components + 3 state components with descriptions
  - Updated networking section with React Query details (`useMutation`/`useQuery`, `QueryClientProvider`)
  - Updated architecture notes for Next.js 16 (`params` as `Promise`, `use()` hook)
  - Updated CodeEditor section (CodeMirror 6 instead of textarea)
  - Updated test section with actual tooling (Vitest 4.x, RTL, jest-dom) and 31 tests across 5 files
  - Updated ScoreDonut reference in result page header
