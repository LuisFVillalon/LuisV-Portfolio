# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Stack

- **Framework:** Next.js 15 with App Router, React 19, TypeScript 5
- **Styling:** Tailwind CSS 3 with CSS variable-based theming (`--background`, `--foreground`)
- **Icons:** Font Awesome, Lucide React, React Icons
- **Email:** Resend (primary), Nodemailer (secondary) via `/api/contact`
- **Path alias:** `@/*` maps to `./src/*`

## Architecture

### Data lives in `src/app/lib/`

All site content is defined as typed TypeScript data — not fetched from a CMS or database. To add or update content, edit the relevant file:

- `projects.ts` — project entries; each entry has a `categories` array of `'top' | 'frontend' | 'fullstack' | 'ai' | 'academic'`; `'top'` marks a project as featured (homepage tiles, and a "★ Featured" tile leading its group on /projects). An entry can also define `categoryOverrides` — a per-category partial override (description, tech, repo links) applied via `applyCategoryOverrides`; the Projects page uses the `ai` override for the AI cross-reference line of a project whose tile lives under Full-stack. Optional `award` (`{ title, event }`) and `outcome` (one-line result) render on project tiles only when set
- `markdownBlogs.ts` / `blogTypes.ts` — reads blog posts from Markdown files instead of typed data; see "Blog posts" below
- `experience.ts` — exports separate named arrays: `professionalExperience`, `education`, `currentlyDoing`, `leadership`, `certificates`, `techTools`, `beyondTech` (non-engineering roles shown last, collapsed, on the Experience page); plus `profile` (optional `openTo` line shown in the homepage intro) and `resume` (path to the résumé PDF in `public/resumes/`)
- `testimonials.ts` — testimonial entries
- `linkedinPosts.ts` — embedded LinkedIn post URLs shown in `LinkedInSection`; to add one, open the post on LinkedIn → Send → Embed this post, and copy the iframe `src` into `embedUrl`

### Blog posts (Markdown-based)

Unlike other content, blog posts are **not** defined in `src/app/lib/` as typed data. Each post lives in its own folder under `public/blog/blog_<n>/` containing a `.md` file with YAML frontmatter (`id`, `title`, `author`, `date`, `readTime`, `category`, `image_card`) followed by the Markdown body. `src/app/lib/markdownBlogs.ts` reads and parses these files server-side with `gray-matter` at request time:

- `getAllMarkdownBlogPosts()` — returns all posts, newest first, used by the homepage's Writing tile
- `getBlogPosts()` — the same posts plus fields derived from the body (`body` without the authored TOC block, `toc` from the body's real `##`/`###` headings, `excerpt` from the first prose paragraph), used by the blog index
- `getBlogPostWithNeighbors(id)` — one post by its frontmatter `id` plus its newer/older posts and the rest, used by `blog/[slug]/page.tsx`

The Markdown body is rendered with `react-markdown` + `remark-gfm` by `components/blog/PostMarkdown.tsx`; heading ids use `blogTypes.ts`'s `slugifyHeading` so they match the sticky scroll-spy TOC. Topics on the index are the frontmatter `category` values. Only posts with a corresponding `.md` file appear on the site (`.md.draft` files stay hidden).

### Pages follow Next.js App Router conventions

```
src/app/
├── page.tsx                    # Home (bento grid of tiles, then GitHub stats + LinkedIn posts)
├── about/page.tsx
├── experience/page.tsx         # Career timeline: header/education/skills/certificates sidebar beside the role timeline
├── contact/page.tsx            # Contact bento: dark hero, one-click channel tiles (résumé/LinkedIn/GitHub/projects), form tile
├── testimonials/page.tsx
├── projects/page.tsx           # Projects: header + filter chips (?type=), AI / Full-stack (+ earlier front-end list) / Coursework groups
├── projects/[category]/page.tsx  # Legacy URLs — 308-redirects /projects/<category> to /projects?type=<category>
├── blog/page.tsx               # Blog index: header summary, featured latest post, topic-filterable post list
├── blog/[slug]/page.tsx        # Dynamic route — slug matches blog entry id; sticky TOC rail beside the article
└── api/contact/route.ts        # POST handler; sends email via Resend
```

`projects/page.tsx` is a server component: `components/projects/projectGroups.ts` buckets the projects (featured first, award winners leading) and computes the chip counts, and the small client `ProjectFilter` renders the header chips and swaps which group is shown, mirroring the choice in `?type=` (`all`, `ai`, `fullstack`, `frontend`, `academic`). Projects in the `frontend` category render as compact rows in an "Earlier front-end work" list inside Full-stack; coursework renders as an image-free list.

### Components are organized by page/feature

```
src/app/components/
├── home/          # HomeBody (bento grid), BentoTile, IntroTile, ProjectTile (also used on /projects), ExpandableDescription (Read more), InfoTiles (experience/now/stack/writing/contact), LinkedInSection, TechSection (unused)
├── blog/          # BlogIndexComponents, PostComponents, PostMarkdown, PostToc, TopicFilter, ReadingProgress, blogStyles
├── contact/       # ContactForm (client form posting to /api/contact) and CopyEmailButton
├── experience/    # ExperienceComponents (header, role timelines, beyond tech, education/skills/certificates tiles)
├── projects/      # ProjectFilter (client chips), ProjectSections (groups), CompactRow, ShowMoreList, projectGroups/projectFilters helpers
├── Cards/         # ReviewCard, SectionCard, LinkedInPostCard
├── NavBar.tsx     # Responsive nav with mobile hamburger menu
├── Footer.tsx
└── Wrapper.tsx    # Page-width container
```

### Styling conventions

- Tailwind utility classes throughout; no CSS modules
- `globals.css` defines CSS variables and base styles
- Monospace font used site-wide
- Responsive design via Tailwind breakpoint prefixes (`sm:`, `md:`, `lg:`)

### Environment variables

The contact form requires these vars in `.env.local`:

```
RESEND_API_KEY=   # Resend API key
FROM_EMAIL=       # Sender address (must be verified in Resend)
TO_EMAIL=         # Recipient address
```

### Adding content

- **New project:** Add an entry to `src/app/lib/projects.ts` with the appropriate `categories`, and place images in `public/projects/`
- **New blog post:** Create `public/blog/blog_<n>/blog_<n>.md` with frontmatter (`id`, `title`, `author`, `date`, `readTime`, `category`, `image_card`) plus the Markdown body, and place any referenced images alongside it in the same folder; the `id` is used as the URL segment in `/blog/[slug]`
- **New LinkedIn post:** Add an entry to `src/app/lib/linkedinPosts.ts` with the embed URL copied from LinkedIn's "Embed this post" dialog
- **Images:** Static assets live in `public/` organized by section (`/about/`, `/blog/`, `/projects/`)
