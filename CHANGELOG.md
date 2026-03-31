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
