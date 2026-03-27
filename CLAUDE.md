# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on http://localhost:4000
npm run build     # Static export to ./out/ (required before deploying)
npm run lint      # ESLint
```

There are no tests. The build (`npm run build`) is the primary correctness check — always run it after making changes.

## Deployment

Pushing to `main` triggers `.github/workflows/nextjs.yml`, which builds and deploys to GitHub Pages. The workflow expects `./out/` as the artifact, produced by `next build` with `output: 'export'` in `next.config.mjs`. The workflow sets `NEXT_PUBLIC_BASE_PATH=/blog`, which drives `basePath` in the Next.js config.

## Architecture

**Next.js 14 App Router, fully static** (`output: 'export'`). No server-side code runs at request time — everything is either build-time (SSG) or client-side.

### Key constraints from static export
- No `next/headers`, no route handlers, no server actions
- `Image` component requires `unoptimized: true` (already set in `next.config.mjs`)
- `trailingSlash: true` is set in `next.config.mjs`
- `basePath` is set from the `NEXT_PUBLIC_BASE_PATH` env var (set to `/blog` in CI)
- Any data fetching at build time must use Node.js APIs (fs, path) inside Server Components only
- Client components that call browser APIs (fetch, localStorage) must be `'use client'` and handle SSR gracefully

### Blog content system
- Posts live in `content/blogs/*.md` as Markdown with YAML frontmatter
- `src/lib/blogs.ts` reads and parses them at build time using `gray-matter` — this is a **Server Component only** utility (uses `fs`)
- Adding a post = drop a `.md` file; the filename becomes the URL slug (`/blogs/[slug]`)
- Required frontmatter: `title`, `date` (YYYY-MM-DD, used for sort order), `author`, `excerpt`
- Optional frontmatter: `tags` (array), `coverImage` (path relative to `public/`)

### Data flow
- **Build-time** (Server Components): `getAllBlogs()` → landing page + blogs list; `getAllBlogSlugs()` inside `generateStaticParams()` + `getBlog(slug)` → individual post pages
- **Client-side** (Client Components): GitHub API stats fetched in `useGitHubStats` hook on mount; image compare slider via `react-compare-slider`

### Styling
- Single global CSS file: `src/app/globals.css`
- IBM Plex Sans + IBM Plex Mono fonts (Google Fonts)
- Theme via CSS custom properties on `:root` (dark) with `@media (prefers-color-scheme: light)` override — no JS theming
- No CSS modules, no Tailwind

### Site configuration
`src/config/site.ts` is the single source of truth for the GitHub repo slug (`githubRepo: 'owner/repo'`), site name, and external URLs. Update this when the project details change.
