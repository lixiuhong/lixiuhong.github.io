# Personal Academic Blog Website — Design Spec

## Overview

A personal academic/research website inspired by [sizezheng.github.io](https://sizezheng.github.io/), built with Next.js 14, Sanity CMS, and deployed to GitHub Pages. The site features a clean academic aesthetic with dark mode support.

## Architecture

```
┌─────────────┐     webhook      ┌──────────────┐     static      ┌──────────────┐
│   Sanity     │ ──────────────→ │  GitHub       │ ─────────────→ │  GitHub      │
│   Studio     │  (triggers      │  Actions      │  (deploys       │  Pages       │
│  (CMS UI)    │   rebuild)      │  (next build) │   output/)      │  (hosting)   │
└─────────────┘                  └──────────────┘                  └──────────────┘
```

- **Framework:** Next.js 14 with App Router
- **CMS:** Sanity (free tier — 100K API calls/month)
- **Hosting:** GitHub Pages (static export via `output: 'export'`)
- **CI/CD:** GitHub Actions — triggered by git push and Sanity webhook
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Pages

### 1. About (Home) — `/`

**Layout:** Left sidebar + main content area

**Sidebar (left, ~280px):**
- Profile photo (circular crop)
- Name (heading)
- Title/affiliation (e.g., "PhD@PKU. High-performance computing and compiler design.")
- Location with icon
- Social links with icons: Email, Twitter, Facebook, LinkedIn, GitHub, YouTube, Google Scholar, ORCID (configurable list)

**Main content (right):**
- "About" heading
- Download CV button (prominent, styled)
- Bio text (rich text from Sanity, supports links)
- "Research Interests" section — list of interest areas, each with a bold title and description
- "Awards" section — date + description list
- "News" section — chronological list of news items (date + text, supports links)

### 2. Publications — `/publications`

**Layout:** Full-width content area (no sidebar)

**Content:** List of publications grouped by year (most recent first)

**Each publication entry (text-based, not cards):**
- Title (bold)
- Authors (comma-separated, plain text)
- Venue + year
- Inline links: `[PDF]` `[link]` (and optionally `[code]` `[slides]` `[Google Scholar]`)

**Example entry:**
```
FlexTensor: An Automatic Schedule Exploration and Optimization Framework
Size Zheng, Yun Liang, Shuo Wang, Renze Chen, Kaiwen Sheng. ASPLOS 2020 [PDF] [link]
```

### 3. Talks — `/talks`

**Layout:** Full-width content area (no sidebar)

**Content:** Chronological list (most recent first)

**Each talk entry:**
- Title (bold)
- Event name, date, location
- Type badge (invited / conference / workshop)
- Description (optional, short text)
- Links: slides, video, event page

### 4. CV — `/cv`

**Layout:** Full-width content area (no sidebar)

**Content:**
- Download CV button (prominent)
- Embedded PDF viewer (using `<iframe>` or `<embed>` with the PDF from Sanity)
- Fallback: direct download link if viewer is unsupported

## Sanity Content Models (Schemas)

### `profile` (singleton document)

| Field | Type | Description |
|-------|------|-------------|
| name | string | Full name |
| title | string | Title/affiliation line |
| location | string | City, Country |
| bio | blockContent (rich text) | About section bio text |
| photo | image | Profile photo |
| socialLinks | array of { platform: string, url: string } | Social media links |
| researchInterests | array of { title: string, description: string } | Research interest areas |
| awards | array of { date: string, description: string } | Awards list |
| news | array of { date: date, text: blockContent } | News items |
| cvFile | file | Uploadable CV PDF |

### `publication`

| Field | Type | Description |
|-------|------|-------------|
| title | string | Paper title |
| authors | string | Comma-separated author names |
| venue | string | Conference/journal name |
| year | number | Publication year |
| date | date | Full publication date (for sorting) |
| type | string (enum) | "conference" / "journal" / "preprint" |
| abstract | text | Optional abstract |
| pdfUrl | url | Link to PDF |
| externalUrl | url | Link to publisher/arXiv page |
| codeUrl | url | Optional link to code repository |
| slidesUrl | url | Optional link to slides |
| scholarUrl | url | Optional Google Scholar link |

### `talk`

| Field | Type | Description |
|-------|------|-------------|
| title | string | Talk title |
| event | string | Event/conference name |
| date | date | Date of talk |
| location | string | City, Country or "Virtual" |
| type | string (enum) | "invited" / "conference" / "workshop" |
| description | text | Optional description |
| slidesUrl | url | Link to slides |
| videoUrl | url | Link to video recording |
| eventUrl | url | Link to event page |

## Visual Design

### Theme

- **Light mode (default):** White/off-white background (#fafafa), dark text (#1a1a1a), accent color matching the reference site's dark red (#8b0000)
- **Dark mode:** Dark background (#0f172a), light text (#e2e8f0), adjusted accent color for contrast
- **Typography:** System font stack for body, clean sans-serif headings
- **Spacing:** Generous whitespace, academic/readable feel

### Navigation

- Top navigation bar, fixed
- Left: Site owner's name (link to home)
- Right: Page links (About, Publications, Talks) + "Download CV" button (styled/highlighted) + dark mode toggle (sun/moon icon)
- Mobile: Hamburger menu

### Dark Mode

- Toggle button in navigation bar (sun/moon icon)
- Persisted in `localStorage`
- Respects `prefers-color-scheme` on first visit
- Smooth transition between modes

### Responsive Design

- **Desktop (>1024px):** Full layout with sidebar on About page
- **Tablet (768-1024px):** Sidebar collapses above main content
- **Mobile (<768px):** Single column, hamburger nav, stacked layout

## Deployment Pipeline

### GitHub Actions Workflow

1. **Trigger:** Push to `main` branch OR Sanity webhook (via `repository_dispatch`)
2. **Steps:**
   - Checkout repo
   - Install dependencies (`npm ci`)
   - Build (`next build`) — fetches content from Sanity at build time
   - Deploy static output to `gh-pages` branch

### Sanity Webhook

- Configured in Sanity project settings
- On content publish → sends POST to GitHub Actions `repository_dispatch` endpoint
- Triggers a site rebuild with fresh content

### Environment

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset name (default: "production")
- `SANITY_API_TOKEN` — Read token for fetching content at build time (stored as GitHub secret)

## Project Structure

```
blog/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (nav, theme provider)
│   ├── page.tsx                # About / Home page
│   ├── publications/
│   │   └── page.tsx            # Publications list page
│   ├── talks/
│   │   └── page.tsx            # Talks list page
│   └── cv/
│       └── page.tsx            # CV page
├── components/
│   ├── Navbar.tsx              # Top navigation bar
│   ├── ProfileSidebar.tsx      # Left sidebar with profile info
│   ├── ThemeToggle.tsx         # Dark mode toggle
│   ├── PublicationEntry.tsx    # Single publication text entry
│   ├── TalkEntry.tsx           # Single talk entry
│   └── Footer.tsx              # Optional footer
├── lib/
│   ├── sanity.ts               # Sanity client configuration
│   └── queries.ts              # GROQ queries for fetching content
├── sanity/
│   ├── schemas/
│   │   ├── profile.ts          # Profile schema
│   │   ├── publication.ts      # Publication schema
│   │   └── talk.ts             # Talk schema
│   └── sanity.config.ts        # Sanity Studio configuration
├── public/                     # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── tailwind.config.ts
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Out of Scope

- Blog/article writing section
- Teaching section
- Open Source Projects section
- Comments/interaction features
- Analytics (can be added later)
- Search functionality
- i18n / multi-language support
