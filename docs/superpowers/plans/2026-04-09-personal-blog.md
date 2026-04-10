# Personal Academic Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal academic website with About, Publications, Talks, and CV pages using Next.js 14, Sanity CMS, and GitHub Pages deployment.

**Architecture:** Next.js 14 App Router generates static HTML at build time by fetching content from Sanity CMS via GROQ queries. GitHub Actions deploys the static output to GitHub Pages on push and on Sanity webhook triggers. Tailwind CSS handles styling with dark mode support via class strategy.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Sanity v3, next-sanity, next-themes, GitHub Actions

---

## File Map

```
blog/
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript config
├── next.config.mjs                       # Next.js config (static export)
├── tailwind.config.ts                    # Tailwind config (dark mode: 'class')
├── postcss.config.mjs                    # PostCSS config for Tailwind
├── app/
│   ├── globals.css                       # Tailwind directives + base styles
│   ├── layout.tsx                        # Root layout: html, body, ThemeProvider, Navbar
│   ├── page.tsx                          # About / Home page
│   ├── publications/
│   │   └── page.tsx                      # Publications list page
│   ├── talks/
│   │   └── page.tsx                      # Talks list page
│   └── cv/
│       └── page.tsx                      # CV page
├── components/
│   ├── Navbar.tsx                        # Top navigation bar + mobile hamburger
│   ├── ProfileSidebar.tsx                # Left sidebar: photo, name, title, social links
│   ├── ThemeToggle.tsx                   # Dark mode sun/moon toggle
│   ├── ThemeProvider.tsx                 # next-themes provider wrapper (client component)
│   ├── PublicationEntry.tsx              # Single publication text entry
│   ├── TalkEntry.tsx                     # Single talk entry
│   └── PortableTextRenderer.tsx          # Renders Sanity blockContent to HTML
├── lib/
│   ├── sanity.client.ts                  # Sanity client instance
│   ├── sanity.queries.ts                 # All GROQ queries
│   └── sanity.types.ts                   # TypeScript types for Sanity documents
├── sanity/
│   ├── sanity.config.ts                  # Sanity Studio config
│   ├── sanity.cli.ts                     # Sanity CLI config
│   └── schemas/
│       ├── index.ts                      # Schema array export
│       ├── profile.ts                    # Profile singleton schema
│       ├── publication.ts                # Publication schema
│       ├── talk.ts                       # Talk schema
│       └── blockContent.ts              # Rich text block schema
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions: build + deploy to gh-pages
└── .env.local.example                    # Environment variable template
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, `.env.local.example`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/lixiuhong/workspace/blog
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

When prompted, accept all defaults. This creates the full Next.js project with App Router, TypeScript, Tailwind, and ESLint.

- [ ] **Step 2: Install Sanity and theme dependencies**

```bash
cd /Users/lixiuhong/workspace/blog
npm install next-sanity @sanity/image-url @portabletext/react next-themes sanity
```

- [ ] **Step 3: Configure Next.js for static export**

Replace `next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 4: Configure Tailwind for dark mode**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#8b0000",
          dark: "#ff6b6b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Set up global styles**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-200 transition-colors duration-200;
  }

  a {
    @apply text-accent dark:text-accent-dark hover:underline;
  }
}
```

- [ ] **Step 6: Create environment variable template**

Create `.env.local.example`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_token
```

- [ ] **Step 7: Verify the project builds**

```bash
cd /Users/lixiuhong/workspace/blog
npm run build
```

Expected: Build completes successfully with static export output in `out/`.

- [ ] **Step 8: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git init
git add -A
git commit -m "feat: scaffold Next.js 14 project with Tailwind and Sanity deps"
```

---

## Task 2: Sanity Schemas

**Files:**
- Create: `sanity/schemas/blockContent.ts`, `sanity/schemas/profile.ts`, `sanity/schemas/publication.ts`, `sanity/schemas/talk.ts`, `sanity/schemas/index.ts`, `sanity/sanity.config.ts`, `sanity/sanity.cli.ts`

- [ ] **Step 1: Create the blockContent schema**

Create `sanity/schemas/blockContent.ts`:

```ts
import { defineType, defineArrayMember } from "sanity";

export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    }),
  ],
});
```

- [ ] **Step 2: Create the profile schema**

Create `sanity/schemas/profile.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title / Affiliation",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "blockContent",
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  "Email",
                  "Twitter",
                  "Facebook",
                  "LinkedIn",
                  "GitHub",
                  "YouTube",
                  "Google Scholar",
                  "ORCID",
                ],
              },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({ allowRelative: false, scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "researchInterests",
      title: "Research Interests",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "awards",
      title: "Awards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "date", title: "Date", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: {
            select: { title: "description", subtitle: "date" },
          },
        },
      ],
    }),
    defineField({
      name: "news",
      title: "News",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "date", title: "Date", type: "date" }),
            defineField({ name: "text", title: "Text", type: "blockContent" }),
          ],
          preview: {
            select: { subtitle: "date" },
          },
        },
      ],
    }),
    defineField({
      name: "cvFile",
      title: "CV (PDF)",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
```

- [ ] **Step 3: Create the publication schema**

Create `sanity/schemas/publication.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "string",
      description: "Comma-separated author names",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) => Rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Full date for sorting within a year",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Conference", value: "conference" },
          { title: "Journal", value: "journal" },
          { title: "Preprint", value: "preprint" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "pdfUrl",
      title: "PDF URL",
      type: "url",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Link to publisher or arXiv page",
    }),
    defineField({
      name: "codeUrl",
      title: "Code URL",
      type: "url",
    }),
    defineField({
      name: "slidesUrl",
      title: "Slides URL",
      type: "url",
    }),
    defineField({
      name: "scholarUrl",
      title: "Google Scholar URL",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Year (Newest)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }, { field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "venue" },
  },
});
```

- [ ] **Step 4: Create the talk schema**

Create `sanity/schemas/talk.ts`:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "talk",
  title: "Talk",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "event",
      title: "Event",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Invited", value: "invited" },
          { title: "Conference", value: "conference" },
          { title: "Workshop", value: "workshop" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "slidesUrl",
      title: "Slides URL",
      type: "url",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),
    defineField({
      name: "eventUrl",
      title: "Event URL",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "event" },
  },
});
```

- [ ] **Step 5: Create schema index**

Create `sanity/schemas/index.ts`:

```ts
import blockContent from "./blockContent";
import profile from "./profile";
import publication from "./publication";
import talk from "./talk";

export const schemaTypes = [blockContent, profile, publication, talk];
```

- [ ] **Step 6: Create Sanity config files**

Create `sanity/sanity.config.ts`:

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Personal Blog",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
```

Create `sanity/sanity.cli.ts`:

```ts
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
```

- [ ] **Step 7: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add sanity/
git commit -m "feat: add Sanity schemas for profile, publication, talk"
```

---

## Task 3: Sanity Client and TypeScript Types

**Files:**
- Create: `lib/sanity.types.ts`, `lib/sanity.client.ts`, `lib/sanity.queries.ts`

- [ ] **Step 1: Create TypeScript types**

Create `lib/sanity.types.ts`:

```ts
import type { PortableTextBlock } from "@portabletext/types";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ResearchInterest {
  title: string;
  description: string;
}

export interface Award {
  date: string;
  description: string;
}

export interface NewsItem {
  date: string;
  text: PortableTextBlock[];
}

export interface Profile {
  _id: string;
  name: string;
  title: string;
  location: string;
  bio: PortableTextBlock[];
  photo?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  socialLinks: SocialLink[];
  researchInterests: ResearchInterest[];
  awards: Award[];
  news: NewsItem[];
  cvFile?: {
    asset: {
      url: string;
    };
  };
}

export interface Publication {
  _id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  date: string;
  type: "conference" | "journal" | "preprint";
  abstract?: string;
  pdfUrl?: string;
  externalUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  scholarUrl?: string;
}

export interface Talk {
  _id: string;
  title: string;
  event: string;
  date: string;
  location?: string;
  type?: "invited" | "conference" | "workshop";
  description?: string;
  slidesUrl?: string;
  videoUrl?: string;
  eventUrl?: string;
}
```

- [ ] **Step 2: Create Sanity client**

Create `lib/sanity.client.ts`:

```ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
```

- [ ] **Step 3: Create GROQ queries**

Create `lib/sanity.queries.ts`:

```ts
import { client } from "./sanity.client";
import type { Profile, Publication, Talk } from "./sanity.types";

export async function getProfile(): Promise<Profile> {
  return client.fetch(
    `*[_type == "profile"][0]{
      _id,
      name,
      title,
      location,
      bio,
      photo{
        asset->{_ref, url}
      },
      socialLinks[]{platform, url},
      researchInterests[]{title, description},
      awards[]{date, description},
      news[]{date, text},
      cvFile{
        asset->{url}
      }
    }`
  );
}

export async function getPublications(): Promise<Publication[]> {
  return client.fetch(
    `*[_type == "publication"] | order(year desc, date desc){
      _id,
      title,
      authors,
      venue,
      year,
      date,
      type,
      abstract,
      pdfUrl,
      externalUrl,
      codeUrl,
      slidesUrl,
      scholarUrl
    }`
  );
}

export async function getTalks(): Promise<Talk[]> {
  return client.fetch(
    `*[_type == "talk"] | order(date desc){
      _id,
      title,
      event,
      date,
      location,
      type,
      description,
      slidesUrl,
      videoUrl,
      eventUrl
    }`
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add lib/
git commit -m "feat: add Sanity client, GROQ queries, and TypeScript types"
```

---

## Task 4: Theme Provider and Dark Mode Toggle

**Files:**
- Create: `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`

- [ ] **Step 1: Create ThemeProvider**

Create `components/ThemeProvider.tsx`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Create ThemeToggle**

Create `components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add components/ThemeProvider.tsx components/ThemeToggle.tsx
git commit -m "feat: add dark mode theme provider and toggle"
```

---

## Task 5: Navbar Component

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create Navbar**

Create `components/Navbar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "About" },
  { href: "/publications", label: "Publications" },
  { href: "/talks", label: "Talks" },
];

export default function Navbar({ name, cvUrl }: { name: string; cvUrl?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg text-accent dark:text-accent-dark no-underline hover:no-underline">
            {name}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm no-underline hover:no-underline transition-colors ${
                  pathname === link.href
                    ? "text-accent dark:text-accent-dark font-medium"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-accent text-white px-3 py-1.5 rounded no-underline hover:no-underline hover:bg-accent/90 transition-colors"
              >
                Download CV
              </a>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-2 py-1.5 rounded text-sm no-underline hover:no-underline ${
                  pathname === link.href
                    ? "text-accent dark:text-accent-dark font-medium"
                    : "text-gray-600 dark:text-slate-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-2 py-1.5 text-sm text-accent dark:text-accent-dark no-underline hover:no-underline"
              >
                Download CV
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add components/Navbar.tsx
git commit -m "feat: add responsive navbar with mobile hamburger menu"
```

---

## Task 6: Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update root layout**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/sanity.queries";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Academic Website",
  description: "Academic research and publications",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar name={profile?.name || "My Site"} cvUrl={profile?.cvFile?.asset?.url} />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add app/layout.tsx
git commit -m "feat: set up root layout with theme provider and navbar"
```

---

## Task 7: Profile Sidebar and PortableText Components

**Files:**
- Create: `components/ProfileSidebar.tsx`, `components/PortableTextRenderer.tsx`

- [ ] **Step 1: Create PortableTextRenderer**

Create `components/PortableTextRenderer.tsx`:

```tsx
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
```

- [ ] **Step 2: Create ProfileSidebar**

Create `components/ProfileSidebar.tsx`:

```tsx
import type { Profile } from "@/lib/sanity.types";

const PLATFORM_ICONS: Record<string, string> = {
  Email: "✉",
  Twitter: "𝕏",
  Facebook: "f",
  LinkedIn: "in",
  GitHub: "⌨",
  YouTube: "▶",
  "Google Scholar": "🎓",
  ORCID: "iD",
};

export default function ProfileSidebar({ profile }: { profile: Profile }) {
  return (
    <aside className="w-full md:w-[280px] flex-shrink-0">
      <div className="text-center md:text-left">
        {profile.photo?.asset?.url && (
          <img
            src={profile.photo.asset.url}
            alt={profile.name}
            className="w-40 h-40 rounded-full mx-auto md:mx-0 object-cover"
          />
        )}
        <h3 className="mt-4 text-xl font-bold">{profile.name}</h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
          {profile.title}
        </p>
        {profile.location && (
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            📍 {profile.location}
          </p>
        )}

        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="mt-4 space-y-1">
            {profile.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent-dark no-underline hover:no-underline"
              >
                <span className="w-5 text-center text-xs">
                  {PLATFORM_ICONS[link.platform] || "🔗"}
                </span>
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add components/ProfileSidebar.tsx components/PortableTextRenderer.tsx
git commit -m "feat: add profile sidebar and portable text renderer"
```

---

## Task 8: About (Home) Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Build the About page**

Replace `app/page.tsx` with:

```tsx
import ProfileSidebar from "@/components/ProfileSidebar";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { getProfile } from "@/lib/sanity.queries";

export default async function HomePage() {
  const profile = await getProfile();

  if (!profile) {
    return <p>No profile data found. Please add a profile in Sanity Studio.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
      <ProfileSidebar profile={profile} />

      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold mb-6">About</h1>

        {profile.cvFile?.asset?.url && (
          <a
            href={profile.cvFile.asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white px-5 py-2.5 rounded mb-6 no-underline hover:no-underline hover:bg-accent/90 transition-colors"
          >
            📄 Download CV (PDF)
          </a>
        )}

        {profile.bio && (
          <div className="prose dark:prose-invert max-w-none mb-8">
            <PortableTextRenderer value={profile.bio} />
          </div>
        )}

        {profile.researchInterests && profile.researchInterests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Research Interests</h2>
            <ul className="space-y-2">
              {profile.researchInterests.map((interest, i) => (
                <li key={i} className="pl-4 border-l-2 border-gray-200 dark:border-slate-700">
                  <span className="font-semibold">{interest.title}:</span>{" "}
                  <span className="text-gray-600 dark:text-slate-400">
                    {interest.description}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.awards && profile.awards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Awards</h2>
            <ul className="space-y-2">
              {profile.awards.map((award, i) => (
                <li key={i}>
                  <span className="text-sm text-gray-500 dark:text-slate-500 mr-2">
                    {award.date}
                  </span>
                  {award.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.news && profile.news.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">News</h2>
            <ul className="space-y-3">
              {profile.news.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-sm text-gray-500 dark:text-slate-500 flex-shrink-0 w-24">
                    {item.date}
                  </span>
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <PortableTextRenderer value={item.text} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add app/page.tsx
git commit -m "feat: build About home page with profile sidebar, bio, interests, awards, news"
```

---

## Task 9: Publication Entry Component and Publications Page

**Files:**
- Create: `components/PublicationEntry.tsx`, `app/publications/page.tsx`

- [ ] **Step 1: Create PublicationEntry component**

Create `components/PublicationEntry.tsx`:

```tsx
import type { Publication } from "@/lib/sanity.types";

export default function PublicationEntry({ pub }: { pub: Publication }) {
  return (
    <div className="py-3">
      <p className="font-medium">{pub.title}</p>
      <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
        {pub.authors}. <span className="italic">{pub.venue} {pub.year}</span>
      </p>
      <div className="flex gap-2 mt-1 text-sm">
        {pub.pdfUrl && (
          <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">
            [PDF]
          </a>
        )}
        {pub.externalUrl && (
          <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer">
            [link]
          </a>
        )}
        {pub.codeUrl && (
          <a href={pub.codeUrl} target="_blank" rel="noopener noreferrer">
            [code]
          </a>
        )}
        {pub.slidesUrl && (
          <a href={pub.slidesUrl} target="_blank" rel="noopener noreferrer">
            [slides]
          </a>
        )}
        {pub.scholarUrl && (
          <a href={pub.scholarUrl} target="_blank" rel="noopener noreferrer">
            [Google Scholar]
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Publications page**

Create `app/publications/page.tsx`:

```tsx
import { getPublications } from "@/lib/sanity.queries";
import PublicationEntry from "@/components/PublicationEntry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
};

export default async function PublicationsPage() {
  const publications = await getPublications();

  const groupedByYear = publications.reduce<Record<number, typeof publications>>(
    (acc, pub) => {
      const year = pub.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    },
    {}
  );

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Publications</h1>

      {sortedYears.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No publications yet. Add them in Sanity Studio.
        </p>
      )}

      {sortedYears.map((year) => (
        <section key={year} className="mb-8">
          <h2 className="text-xl font-bold mb-2 pb-1 border-b border-gray-200 dark:border-slate-700">
            {year}
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {groupedByYear[year].map((pub) => (
              <PublicationEntry key={pub._id} pub={pub} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add components/PublicationEntry.tsx app/publications/
git commit -m "feat: add publications page with entries grouped by year"
```

---

## Task 10: Talk Entry Component and Talks Page

**Files:**
- Create: `components/TalkEntry.tsx`, `app/talks/page.tsx`

- [ ] **Step 1: Create TalkEntry component**

Create `components/TalkEntry.tsx`:

```tsx
import type { Talk } from "@/lib/sanity.types";

const TYPE_LABELS: Record<string, string> = {
  invited: "Invited",
  conference: "Conference",
  workshop: "Workshop",
};

export default function TalkEntry({ talk }: { talk: Talk }) {
  const formattedDate = talk.date
    ? new Date(talk.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="py-3">
      <div className="flex items-start gap-2">
        <p className="font-medium">{talk.title}</p>
        {talk.type && (
          <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
            {TYPE_LABELS[talk.type] || talk.type}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
        {talk.event}
        {talk.location && ` · ${talk.location}`}
        {formattedDate && ` · ${formattedDate}`}
      </p>
      {talk.description && (
        <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
          {talk.description}
        </p>
      )}
      <div className="flex gap-2 mt-1 text-sm">
        {talk.slidesUrl && (
          <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer">
            [slides]
          </a>
        )}
        {talk.videoUrl && (
          <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
            [video]
          </a>
        )}
        {talk.eventUrl && (
          <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer">
            [event]
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Talks page**

Create `app/talks/page.tsx`:

```tsx
import { getTalks } from "@/lib/sanity.queries";
import TalkEntry from "@/components/TalkEntry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talks",
};

export default async function TalksPage() {
  const talks = await getTalks();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Talks</h1>

      {talks.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500">
          No talks yet. Add them in Sanity Studio.
        </p>
      )}

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {talks.map((talk) => (
          <TalkEntry key={talk._id} talk={talk} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add components/TalkEntry.tsx app/talks/
git commit -m "feat: add talks page with talk entries and type badges"
```

---

## Task 11: CV Page

**Files:**
- Create: `app/cv/page.tsx`

- [ ] **Step 1: Create CV page**

Create `app/cv/page.tsx`:

```tsx
import { getProfile } from "@/lib/sanity.queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
};

export default async function CVPage() {
  const profile = await getProfile();
  const cvUrl = profile?.cvFile?.asset?.url;

  if (!cvUrl) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">CV</h1>
        <p className="text-gray-500 dark:text-slate-500">
          No CV uploaded yet. Upload a PDF in Sanity Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">CV</h1>

      <a
        href={cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-accent text-white px-5 py-2.5 rounded mb-6 no-underline hover:no-underline hover:bg-accent/90 transition-colors"
      >
        📄 Download CV (PDF)
      </a>

      <div className="w-full border border-gray-200 dark:border-slate-700 rounded overflow-hidden">
        <iframe
          src={cvUrl}
          title="CV"
          className="w-full h-[80vh]"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add app/cv/
git commit -m "feat: add CV page with PDF viewer and download button"
```

---

## Task 12: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  repository_dispatch:
    types: [sanity-webhook]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Add .nojekyll file**

Create `public/.nojekyll` (empty file, tells GitHub Pages to skip Jekyll processing):

```bash
cd /Users/lixiuhong/workspace/blog
touch public/.nojekyll
```

- [ ] **Step 3: Commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add .github/ public/.nojekyll
git commit -m "feat: add GitHub Actions workflow for static deploy to GitHub Pages"
```

---

## Task 13: Final Build Verification

- [ ] **Step 1: Create a `.env.local` with your Sanity credentials**

```bash
cd /Users/lixiuhong/workspace/blog
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual Sanity project ID, dataset, and API token. (You'll need to create a Sanity project at [sanity.io](https://www.sanity.io/) first if you haven't already.)

- [ ] **Step 2: Run the dev server to verify pages render**

```bash
cd /Users/lixiuhong/workspace/blog
npm run dev
```

Visit `http://localhost:3000` — you should see the About page (empty content until you add data in Sanity).
Visit `http://localhost:3000/publications` — Publications page.
Visit `http://localhost:3000/talks` — Talks page.
Visit `http://localhost:3000/cv` — CV page.

- [ ] **Step 3: Run a production build**

```bash
cd /Users/lixiuhong/workspace/blog
npm run build
```

Expected: Builds successfully, generates static files in `out/`.

- [ ] **Step 4: Verify dark mode toggle works**

Open the site at `http://localhost:3000`, click the sun/moon icon in the nav bar, and confirm the theme switches between light and dark.

- [ ] **Step 5: Verify mobile responsiveness**

Resize the browser to <768px. Confirm:
- Hamburger menu appears and works
- Sidebar stacks above content on the About page
- All pages render cleanly in single-column layout

- [ ] **Step 6: Final commit**

```bash
cd /Users/lixiuhong/workspace/blog
git add -A
git commit -m "chore: final verification pass — all pages build and render"
```
