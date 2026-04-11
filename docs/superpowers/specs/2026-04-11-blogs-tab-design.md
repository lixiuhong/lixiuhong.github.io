# Blogs Tab Design Spec

**Date:** 2026-04-11
**Status:** Draft

## Overview

Add a "Blogs" tab to the personal blog website (lixiuhong.github.io), at the same level as Talks in the navigation. Blog posts are authored as markdown files in `data/blogs/` with YAML frontmatter for metadata. The blog supports code syntax highlighting, images, tables, and math formulas.

## Data Layer

### Blog file structure

Each blog post is a markdown file at `data/blogs/<slug>.md`. The filename (without `.md`) serves as the URL slug.

```markdown
---
title: My First Blog Post
date: 2026-04-11
summary: A short description of the post
---

Post content here...
```

**Frontmatter fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Blog post title |
| date | string (YYYY-MM-DD) | yes | Publication date |
| summary | string | no | Short description for the list page; if omitted, first ~150 chars of content are used |

### Type definition

Add to `lib/sanity.types.ts`:

```ts
export interface Blog {
  slug: string;
  title: string;
  date: string;
  summary?: string;
}
```

### Data queries

Add to `lib/sanity.queries.ts`:

- `getBlogs(): Promise<Blog[]>` — Scans `data/blogs/*.md`, parses frontmatter with `gray-matter`, returns list sorted by date descending. Does not read full content.
- `getBlogBySlug(slug: string): Promise<{ meta: Blog; content: MDXRemoteSerializeResult } | null>` — Reads a single post, parses frontmatter, serializes markdown body with `next-mdx-remote/serialize` and remark/rehype plugins.

## Dependencies

New packages to install:

| Package | Purpose |
|---------|---------|
| `next-mdx-remote` | Runtime MDX rendering in Next.js server components |
| `gray-matter` | Parse YAML frontmatter from markdown files |
| `remark-gfm` | GitHub Flavored Markdown (tables, strikethrough, etc.) |
| `remark-math` | Parse math syntax ($...$, $$...$$) |
| `rehype-highlight` | Code syntax highlighting via highlight.js |
| `rehype-katex` | Render math formulas with KaTeX |
| `@tailwindcss/typography` | Prose styling for rendered markdown content |

## Pages & Routing

### Blog list page — `app/blogs/page.tsx`

- Route: `/blogs`
- Calls `getBlogs()` to get all posts
- Displays each post with: clickable title (links to `/blogs/<slug>`), date, summary
- Sorted by date descending
- Empty state: "No blog posts yet. Add markdown files to data/blogs/."
- Heading style matches existing pages (vertical bar + gradient)

### Blog detail page — `app/blogs/[slug]/page.tsx`

- Route: `/blogs/<slug>`
- Calls `getBlogBySlug(slug)` to get post metadata + serialized content
- Returns 404 via `notFound()` if slug doesn't match any file
- Layout: title (h1), date below title, then rendered markdown body
- Uses `<MDXRemote>` component to render the serialized content
- Generates static params via `generateStaticParams()` for static export

## Navigation

Add to `NAV_LINKS` in `components/Navbar.tsx`:

```ts
{ href: "/blogs", label: "Blogs" }
```

Positioned after Talks.

## Styling

- Blog content uses `@tailwindcss/typography` prose classes: `prose dark:prose-invert`
- Import `highlight.js` theme CSS (e.g., `highlight.js/styles/github.css` for light, `github-dark.css` for dark) in the blog detail page or globally
- Import `katex/dist/katex.min.css` for math formula rendering
- Dark mode handled via existing `prose-invert` + theme-aware highlight.js CSS
- List page styling consistent with Talks page (same spacing, dividers, text sizing)

## File Changes Summary

| Action | File |
|--------|------|
| Create | `data/blogs/` directory |
| Modify | `lib/sanity.types.ts` — add `Blog` interface |
| Modify | `lib/sanity.queries.ts` — add `getBlogs()`, `getBlogBySlug()` |
| Create | `app/blogs/page.tsx` — blog list page |
| Create | `app/blogs/[slug]/page.tsx` — blog detail page |
| Modify | `components/Navbar.tsx` — add Blogs nav link |
| Modify | `tailwind.config.ts` — add `@tailwindcss/typography` plugin |
| Modify | `package.json` — new dependencies |
