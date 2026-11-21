# Luis Villalon — Portfolio

Personal portfolio website built with Next.js 15 and React 19. Showcases projects, work experience, blog posts, and a working contact form.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 3 with CSS variable theming
- **Email:** Resend API (`/api/contact` route)
- **AI assistant:** Claude Haiku 5.5 (Anthropic SDK), Voyage AI, Upstash Vector + Redis, Vercel Cron
- **Icons:** Lucide React, React Icons
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

Create a `.env.local` file in the project root (`.env.example` lists every variable):

```env
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev   # must be verified in Resend
TO_EMAIL=your@email.com
```

The AI assistant's variables are optional: without them the "Ask AI" chat stays hidden and the
build skips indexing. See [AI assistant](#ai-assistant-ask-ai) below.

### Install & Run

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve production build
npm run lint     # ESLint
npm test         # assistant limit tests and eval scoring tests (node:test via tsx)
npm run eval:correctness   # Ask AI factual-correctness eval (real API calls; see evals/README.md)
```

## Project Structure

All site content is TypeScript data in `src/app/lib/` — no CMS or database:

| File | Contents |
|---|---|
| `projects.ts` | Projects; filtered by `categories` array (`top`, `frontend`, `fullstack`, `ai`, `academic`) |
| `markdownBlogs.ts` | Reads blog posts from Markdown files in `public/blog/blog_<n>/`; frontmatter `id` is the URL slug (`/blog/<id>`) |
| `experience.ts` | Named arrays: `professionalExperience`, `education`, `currentlyDoing`, `leadership`, `certificates`, `techTools`, `beyondTech`; plus `profile` (homepage intro `openTo` line) and `resume` (résumé PDF path in `public/resumes/`) |
| `testimonials.ts` | Testimonials |

Pages live under `src/app/` and follow Next.js App Router conventions. Components are organized by feature under `src/app/components/`.

## Adding Content

**New project** — add an entry to the relevant category array in `src/app/lib/projects.ts` and drop the image in `public/projects/`.

**New blog post** — create `public/blog/blog_<n>/blog_<n>.md` with YAML frontmatter (`id`, `title`, `author`, `date`, `readTime`, `category`, `image_card`) followed by the Markdown body, and put any referenced images in the same folder. The `id` becomes the URL (`/blog/<id>`).

**New experience entry** — add to the appropriate named array in `src/app/lib/experience.ts`.

## AI assistant ("Ask AI")

"Luis's Personal AI Assistant" answers visitors' questions about Luis from his own content. Entry
points: the header's **Ask AI** button (every page) and the **Ask about Luis** tile on the home page.
Both open one chat panel (`src/app/components/chat/`, mounted once in `layout.tsx`).

**How an answer is made** (`src/app/lib/assistant/`):

1. `retrieve.ts` rewrites a follow-up into a standalone query (a small Claude call, only when earlier
   turns exist), runs a hybrid search in Upstash Vector (Voyage `voyage-4` query embedding + BM25
   sparse terms, fused with RRF, with a light boost for higher-priority sources), and reranks the ~20
   results with Voyage `rerank-2.5`, keeping the top 5 above a relevance cutoff.
2. `answer.ts` streams Claude Haiku 5.5 (effort `low`) with a prompt-cached system block (persona,
   rules and the private Assistant facts, `prompt.ts`) and the chunks as `search_result` blocks, so
   Claude's native citations become the source chips. A `refusal` stop reason shows a polite fallback.
3. `api/assistant/chat` enforces 15 questions per visitor per day (salted hash of IP + user agent),
   45 per IP address per day, 15 per minute site-wide, a 500-character cap, and a $5/month Anthropic
   budget (all tracked in Upstash Redis, rewrite calls included). Answers that fail before Claude
   starts refund the question; cut-off answers are billed. `/api/contact` (also used by the chat's
   "Message Luis" card) allows 5 messages per IP per hour when Redis is configured.

`retrieve()` and `streamAnswer()` can be called on their own, and chunk ids are stable, so an
evaluation can score retrieval and answers separately.

**Content and indexing.** `chunks/` builds structure-aware chunks: one per project, role, education
entry, certificate and skill group (`projects.ts`, `experience.ts`), blog posts and GitHub READMEs
split at headings, résumé entries (`unpdf`; phone and email removed), and LinkedIn positions. Each
chunk has a context header and a content hash. `npm run assistant:index` (also run before every
`npm run build`, and daily by Vercel Cron via `/api/assistant/reindex`) re-embeds only changed chunks.
`npm run assistant:chunks` prints the chunks without any keys.

**Private content.** The curated LinkedIn profile and the Assistant facts are never committed. Set
`ASSISTANT_LINKEDIN_PROFILE` and `ASSISTANT_FACTS` on Vercel; locally, put the files in the gitignored
`.private/` folder (`linkedin-profile.md`, `assistant-facts.md`).

**Saved chats.** Conversations are saved for 90 days unless the visitor opts out in the chat (opting
out deletes what was saved). A weekly Vercel Cron job (`/api/assistant/digest`) emails every saved chat
from the past week through Resend. The "Message Luis" card in the chat is filled in and sent by the
visitor through `/api/contact` (`source: "chat"`); the assistant never sends anything itself.

**Setup on Vercel:** create an Upstash Redis database and an Upstash Vector index (hybrid, 1024
dimensions, cosine, custom dense + custom sparse vectors) through the Marketplace, add the variables
from `.env.example`, and set a $5 spend limit on the Anthropic Console workspace as a second guard.
Crons are in `vercel.json`.

