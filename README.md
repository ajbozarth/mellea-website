# Mellea Blog

Developer blog and landing page for **Mellea** — a composable, multi-agent framework for building reliable AI agents at production scale.

Built with Next.js, statically exported, and deployed to GitHub Pages.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero banner + recent blog posts |
| `/blogs` | Full list of all blog posts |
| `/blogs/[slug]` | Individual blog post (rendered from Markdown) |

---

## Adding a Blog Post

1. Create a new `.md` file in `content/blogs/`. The filename becomes the URL slug.

   ```
   content/blogs/my-new-post.md  →  /blogs/my-new-post
   ```

2. Add frontmatter at the top of the file:

   ```md
   ---
   title: "Your Post Title"
   date: "2025-04-01"
   author: "Your Name"
   excerpt: "A one-sentence summary shown on blog cards and the listing page."
   tags: ["tag1", "tag2"]
   coverImage: "/images/blog/my-post.png"  # optional
   ---

   Your Markdown content starts here...
   ```

3. Commit and push to `main`. GitHub Actions builds and deploys automatically.

That's it — no config changes, no rebuilds, no code edits required.

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `date` | Yes | Publication date (`YYYY-MM-DD`), used for sorting |
| `author` | Yes | Author display name |
| `excerpt` | Yes | Short summary shown on cards |
| `tags` | No | Array of tag strings |
| `coverImage` | No | Path to cover image (relative to `public/`) |

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:4000](http://localhost:4000).

### Build (static export)

```bash
npm run build
```

Output is written to `./out/`. This is what gets deployed to GitHub Pages.

---

## Deployment

Deployment is fully automated via GitHub Actions (`.github/workflows/nextjs.yml`).

Any push to `main` triggers a build and deploys the static output to GitHub Pages. Make sure GitHub Pages is enabled in your repo settings and set to use **GitHub Actions** as the source.

---

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router, static export
- [react-markdown](https://github.com/remarkjs/react-markdown) — Markdown rendering
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — Frontmatter parsing
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown (tables, strikethrough, etc.)
- IBM Plex Sans & IBM Plex Mono — typography
