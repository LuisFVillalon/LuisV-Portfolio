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

- `projects.ts` — project entries; each entry has a `categories` array of `'top' | 'frontend' | 'backend' | 'academic'`; `'top'` marks a project as featured on the homepage
- `markdownBlogs.ts` — reads blog posts from Markdown files instead of typed data; see "Blog posts" below
- `experience.ts` — exports separate named arrays: `professionalExperience`, `education`, `currentlyDoing`, `leadership`, `certificates`, `techTools`
- `testimonials.ts` — testimonial entries

### Blog posts (Markdown-based)

Unlike other content, blog posts are **not** defined in `src/app/lib/` as typed data. Each post lives in its own folder under `public/blog/blog_<n>/` containing a `.md` file with YAML frontmatter (`id`, `title`, `author`, `date`, `readTime`, `category`, `image_card`) followed by the Markdown body. `src/app/lib/markdownBlogs.ts` reads and parses these files server-side with `gray-matter` at request time:

- `getAllMarkdownBlogPosts()` — returns all posts, newest first, used by the blog listing page and the homepage's "Latest Blog Posts" section
- `getMarkdownBlogPostById(id)` — returns a single post by its frontmatter `id`, used by `blog/[slug]/page.tsx`

The Markdown body is rendered with `react-markdown` + `remark-gfm` on the post detail page. Only posts with a corresponding `.md` file appear on the site.

### Pages follow Next.js App Router conventions

```
src/app/
├── page.tsx                    # Home (assembles home section components)
├── about/page.tsx
├── experience/page.tsx
├── contact/page.tsx
├── testimonials/page.tsx
├── projects/page.tsx           # Projects hub
├── projects/frontend/page.tsx
├── projects/backend/page.tsx
├── projects/academic/page.tsx
├── blog/page.tsx
├── blog/[slug]/page.tsx        # Dynamic route — slug matches blog entry id
└── api/contact/route.ts        # POST handler; sends email via Resend
```

### Components are organized by page/feature

```
src/app/components/
├── home/          # HeroSection, TechSection, ExperienceSection, ProjectCardsSection, BlogSection, TestimonialSection, SelfieSection, HomeBody
├── blog/          # BlogList
├── experience/    # ExperienceComponents
├── Cards/         # PanelTemplate, ReviewCard
├── NavBar.tsx     # Responsive nav with mobile hamburger menu
├── Footer.tsx
├── Wrapper.tsx    # Page-width container
└── CTASection.tsx
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

- **New project:** Add an entry to the appropriate typed array in `src/app/lib/projects.ts` and place images in `public/projects/`
- **New blog post:** Create `public/blog/blog_<n>/blog_<n>.md` with frontmatter (`id`, `title`, `author`, `date`, `readTime`, `category`, `image_card`) plus the Markdown body, and place any referenced images alongside it in the same folder; the `id` is used as the URL segment in `/blog/[slug]`
- **Images:** Static assets live in `public/` organized by section (`/about/`, `/blog/`, `/projects/`)
