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
