# Luis Villalon — Portfolio

Personal portfolio website built with Next.js 15 and React 19. Showcases projects, work experience, blog posts, and a working contact form.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 3 with CSS variable theming
- **Email:** Resend API (`/api/contact` route)
- **Icons:** Font Awesome, Lucide React, React Icons
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

Create a `.env.local` file in the project root:

```env
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev   # must be verified in Resend
TO_EMAIL=your@email.com
```

### Install & Run

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve production build
npm run lint     # ESLint
```

## Project Structure

All site content is TypeScript data in `src/app/lib/` — no CMS or database:

| File | Contents |
|---|---|
| `projects.ts` | Projects; filtered by `categories` array (`top`, `frontend`, `backend`, `academic`) |
| `blogs.ts` | Blog posts; numeric `id` is the URL slug (`/blog/1`) |
| `experience.ts` | Named arrays: `professionalExperience`, `education`, `currentlyDoing`, `leadership`, `certificates`, `techTools` |
| `testimonials.ts` | Testimonials |

Pages live under `src/app/` and follow Next.js App Router conventions. Components are organized by feature under `src/app/components/`.

## Adding Content

**New project** — add an entry to the relevant category array in `src/app/lib/projects.ts` and drop the image in `public/projects/`.

**New blog post** — add an entry to `src/app/lib/blogs.ts`. The `id` field becomes the URL (`/blog/<id>`). Content sections support types: `text`, `bullets`, `image`, `quote`, `references`.

**New experience entry** — add to the appropriate named array in `src/app/lib/experience.ts`.
