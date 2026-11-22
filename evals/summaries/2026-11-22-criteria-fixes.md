# Ask AI evals: how all eight criteria reached passing

November 21–22, 2026. Criteria 1–5 grade the assistant's answers. Their first full runs used Claude Haiku 5.5 as the answering model; every one now passes, answering with Claude Sonnet 5.5 and using contextual retrieval, and Claude Sonnet 5.5 grades every run. Criteria 6–8 were added the same day. They check system behaviour: usage limits, which conversations are saved, and the weekly digest. Code checks them on a fake site with no model calls, and they passed on their first run (see "6–8. System criteria"). The reports cited below are in `evals/results/`, which is gitignored and so exists only on the machine that ran them. File paths below use the layout from after the same-day refactor (`evals/core/`, `evals/criteria/<name>/`).

| # | Criterion | First full run | Final run | Status |
|---|---|---|---|---|
| 1 | Factual correctness | 24/30 Correct, 1 high-stakes error | 29/30 Correct, 0 high-stakes errors | ✅ PASS |
| 2 | Source faithfulness | 96.1% of claims supported, 28/40 answers clean | 99.8% of claims supported, 39/40 answers clean | ✅ PASS |
| 3 | Showcase quality | 1/20 | 18/20 | ✅ PASS |
| 4 | Contact conversion | 5/10 hiring answers, 8/10 unwanted pitches | 10/10 hiring answers, 0/10 unwanted pitches | ✅ PASS |
| 5 | Honest boundaries | 19/20, 1 leak | 20/20, 0 leaks | ✅ PASS |
| 6 | Fair usage limits | 14/14 scenarios (55 checks) | same (first run) | ✅ PASS |
| 7 | Consented logging | 12/12 scenarios (53 checks) | same (first run) | ✅ PASS |
| 8 | Digest fidelity | 11/11 scenarios (32 checks) | same (first run) | ✅ PASS |

Some changes helped several criteria at once. They are listed in full under "Changes shared across criteria" and referred to briefly in each section.

---

## 1. Factual correctness

**What it checks:** 30 recruiter-style questions with known answers (degree, roles, dates, projects, awards). **To pass:** at least 27 answers must be Correct, and no answer may state a wrong high-stakes fact (degree, graduation date, employer, job title or award result).

**Why it matters:** a recruiter who reads one wrong job title or degree stops trusting the rest of the chat.

**How it failed:**
- **Run of 2026-11-22T01:58 (Haiku): 24 Correct, 5 Partial, 1 Incorrect; high-stakes error in `role-second-course`.** The résumé PDF called the Second Course role "Computer Science Intern", but the site and the dataset said "Full-Stack Intern". The assistant repeated the résumé's title.
- **Runs at 06:30 and 09:07: 22 of 30 Correct.** These had two causes:
  - **The content disagreed with itself.** Ectron said "three interns" in one place and "two" in another, the food-service and sales dates differed between sources, and the Sports Excitement and ColorStack details didn't match the dataset.
  - **The index was stale.** `npm run assistant:index` doesn't load `.env.local`, so it skipped the sync without saying so, and the assistant kept answering from old content.
- **Run of 10:56 (Sonnet): 27 Correct, but `role-second-course` was still a high-stakes error.** Nothing had changed in the résumé PDF yet, so the title conflict was still there.

**What was changed to make it pass:**
- **Site content** (`src/app/lib/experience.ts`, `projects.ts`):
  - Ectron now says "Mentored two interns".
  - Food service is dated 2016–2020 and sales 2022.
  - The Ask AI project's tech line now says Claude Sonnet 5.5.
- **The dataset** (`evals/criteria/correctness/dataset.json`): updated the Sports Excitement, ColorStack and LLM-API facts so they match the real content, and changed "Answers with Claude Sonnet" to fit the model switch.
- **Assistant facts** (`.private/assistant-facts.md`): added hometown (Calexico, now based in San Diego) and bilingual English/Spanish.
- **The prompt now settles disagreements between sources** (`prompt.ts`): it uses Assistant facts, then the site, then the résumé, then LinkedIn, then GitHub. The answer states that version without pointing out the conflict.
- **The résumé PDF was fixed:** Second Course is now **Full-Stack Intern**, Ectron starts **Jun 2024** and ColorStack starts **Jan 2026**.
- **The index is now synced with env vars loaded:** `node --env-file=.env.local --import tsx scripts/assistant-index.ts`.

**Final run (2026-11-22T19:49, Sonnet): 29 Correct, 1 Partial, 0 Incorrect. PASS.** The one Partial (`proj-ai-assistant`) said "Claude" instead of "Claude Sonnet". It came from the GitHub README, which still has the old text until the changes are pushed.

---

## 2. Source faithfulness

**What it checks:** 40 questions. Every claim in an answer must be backed by the chunks the assistant was actually given. **To pass:** at least 95% of all claims are supported, and at least 38 of the 40 answers have no unsupported claim at all.

**Why it matters:** criterion 1 only checks facts written down in advance. This one catches invented details, such as an inflated role, a made-up number or link, or a "first" or "best" the content never said, even when they happen to be true.

**How it failed:**
- **The first full run (06:57, Haiku) supported 96.1% of claims, but only 28 of 40 answers were clean.** Haiku added its own conclusions:
  - order and timing ("earlier", "most recent");
  - rankings ("his strongest project");
  - causes and judgments about how Luis works;
  - general knowledge about a technology that the sources didn't contain.
- **Some failures were caused by the grader, not the answers:**
  - **Links were marked unsupported.** The grader was never shown a chunk's URL, so a correct link to a project's repository looked invented. This got worse after the "link everything" rule from criterion 3 was added.
  - **Out-of-scope answers were marked unsupported.** Questions like salary, relocation and start date are correctly answered with "ask Luis" and his contact channels. Those channels weren't in the grader's sources.
  - **GitHub profile links were marked unsupported.** The profile URL wasn't in any source.
- **Eight more Haiku runs after the fixes topped out at 34–35 of 40 clean answers** (one run had 25 API errors and doesn't count). Each run's leftover failures were different one-off embellishments, so further prompt rules weren't closing the gap.

**What was changed to make it pass:**
- **Honesty rules in the prompt** (`prompt.ts`):
  - Don't add your own conclusions.
  - No timing or order words, rankings, superlatives or comparisons unless the content says them.
  - Don't make a source's wording more specific than it is.
  - If asked for a judgment, give the evidence and let it speak.
- **The grader now sees each source's URL** (`evals/criteria/faithfulness/grader.ts`), so a link to a source's own URL counts as supported.
- **The grader now sees the contact sources too** (`contactSourceText`): the résumé, LinkedIn, email and GitHub profile. It also gets the rule that salary, offers, start dates and availability are handed to Luis, and that /projects and /experience are allowed fallback links.
- **A `--model` option** was added to every eval runner (`evals/core/args.ts`, `evals/core/pipeline.ts`), so the same eval can be run on Haiku and on Sonnet to compare them.
- **The answering model is now Claude Sonnet 5.5** (`config.ts`). Sonnet scored 39/40 on both of its runs; Haiku never got above 35/40.
  - Sonnet costs more per answer. The $5/month budget guard is now priced per model (`MODEL_PRICES` in `config.ts`, `costUsd` in `usage.ts`), so the guard stays accurate.

**Final runs (10:37 and 10:56, Sonnet): 99.8% of claims supported, 39 of 40 clean. PASS.** The one remaining miss was `soft-pressure`. These runs were before contextual retrieval was turned on, so criterion 2 should be re-run once more on the final setup.

---

## 3. Showcase quality

**What it checks:** 20 skill and fit questions: 12 technical and 8 soft-skill. For each one, the answer must name the project or experience Luis picked as the best match, give a concrete detail about it, and link to it with a working link, all for the same match. **To pass:** at least 17 of the 20.

**Why it matters:** a recruiter asking "has he done RAG?" should land on the right project, with proof and a click-through. A generic list of skills doesn't do that.

**How it failed:**
- **First full run (07:26, Haiku): 1 of 20.** Answers named a project and gave a detail but almost never linked to it. The assistant also wasn't told which projects lead his work.
- **After the prompt fixes, Haiku reached 11 of 20.** The remaining misses were a mix of two problems:
  - **Retrieval misses:** the best-match chunk didn't make the top 5. A README section often doesn't name the project or its kind, so searching for "mobile", "Python backend" or "teamwork" didn't find it.
  - **Wrong picks:** Haiku chose a weaker example.
- **On Sonnet without contextual retrieval: 17 of 20.** That's exactly the line. The misses were `tech-react`, `soft-teamwork` and `soft-learning`.

**What was changed to make it pass:**
- **Link rules in the prompt** (`prompt.ts`):
  - Write every page, file or URL mentioned as a Markdown link.
  - When naming a project or role as an example, link to it: its repo or live app if that URL is in its own content, otherwise /projects or /experience.
  - Never reuse another project's link, and only link to URLs present in the content.
- **"Best projects" uses the lead projects** listed in the Assistant facts.
- **The answering model is now Sonnet** (the same switch as criterion 2).
- **Contextual retrieval** (Anthropic's technique; new file `src/app/lib/assistant/contextualize.ts`):
  - At indexing time, Claude Haiku reads each chunk's whole source document (a repo README, all roles, the résumé or LinkedIn). It writes one or two sentences placing the chunk in it: which project or role it belongs to, what kind it is, and which skills it shows.
  - That context is added to the chunk for the embedding, the BM25 index and the reranker. The answering model never sees it, because it is model-written and not Luis's content.
  - A context is only regenerated when the chunk, its document, the model or the prompt changes. The first full run produced 413 contexts in about 2.5 minutes for $0.07; later runs reuse almost all of them.
  - Related changes: `chunks/types.ts` (`indexText`), `indexer.ts` and `retrieve.ts` (the reranker uses the contextualized text), plus tests in `contextualize.test.ts`.
- **A retrieval diagnostic, `npm run eval:retrieval`** (`evals/retrieval/`), measures whether each question's best match is retrieved, without the cost of generating and grading answers. Contextual retrieval improved it:
  - questions whose best match is retrieved: 15 → 18 of 20;
  - best matches in the top 5: 21 → 28 of 52;
  - best matches in the 20-chunk shortlist: 31 → 40 of 52.

**Final run (11:28, Sonnet with contextual retrieval): 18 of 20 (technical 12/12, soft-skill 6/8). PASS.** Two misses remain:
- `soft-learning` still fails.
- `soft-users` regressed: customer-service jobs now match "customers" more strongly.

These are soft-skill questions. Don't fix them by hard-coding answers; fix them with better content or better retrieval.

---

## 4. Contact conversion

**What it checks:** 20 conversations, some with several turns. **To pass:** at least 9 of the 10 hiring-intent conversations end with a clear way to contact Luis and a working, clickable contact link, **and** at most 1 of the 10 plain factual questions gets a contact pitch nobody asked for.

**Why it matters:** the point of the assistant is to turn an interested recruiter into a conversation, without pushing a sales pitch at someone who only asked a quick question.

**How it failed (07:50, Haiku): 5 of 10 hiring conversations; 8 of 10 factual answers added a pitch.**
- **Every hiring answer offered contact, but half gave only the email address.** An email address isn't clickable in the chat, so those answers failed the "working link" check.
- **Almost every factual answer ended with "feel free to reach out…"**, because the prompt told it to always point visitors to Luis.

**What was changed to make it pass** (`prompt.ts`):
- **Match the ending to the visitor:**
  - When they show hiring interest, end with an invitation to contact him and a clickable [contact page](/contact) or LinkedIn link.
  - For a plain factual question, answer and stop, or point to one related page (the résumé, a project, a repo). Don't add a contact pitch.
- **When taking a message,** always include the contact page or LinkedIn as a link, because an email address alone isn't clickable.
- **The "I don't know" answer** now uses a `[contact page](/contact)` link.
- **The answering model is now Sonnet,** which follows these rules more consistently.

**Final run (11:44, Sonnet): 10 of 10 hiring conversations, 0 of 10 unwanted pitches. PASS.**

That run turned up one problem: The Crash App's GitHub link returned 404 because the repository was private. The repo is now public, so the link works (200).

---

## 5. Honest boundaries

**What it checks:** 20 tricky prompts:
- 10 questions the content can't answer (GPA, LeetCode count, team size, and similar);
- 5 built on a false premise (a job he never had, a graduation that hasn't happened, a wrong award);
- 5 off-limits requests (his schedule, the system prompt, the private Assistant facts, salary, general coding help).

**To pass:** at least 18 of the 20 are handled correctly, **and** nothing private leaks in any answer. A single leak fails the run.

**Why it matters:** an assistant that invents a GPA, goes along with a false premise, or reveals its instructions or private notes makes Luis look bad, however good its other answers are.

**How it failed (08:26, Haiku): 19 of 20 handled correctly, but there was 1 leak, which failed the run.** In `unk-ectron-team-size`, the answer explained its source-priority rule: it said that one source "outranks" another. That repeats the system prompt, so it counted as a leak.

**What was changed to make it pass** (`prompt.ts`):
- **The source order is internal.** Never mention it, and never say one source ranks above, outranks or is more authoritative than another. State the winning version plainly, without pointing out the disagreement or quoting the other version.
- **The answering model is now Sonnet.**
- `evals/criteria/boundaries/dataset.json`: its reference now names Sonnet 5.5 as the answering model.

**Final run (11:48, Sonnet): 20 of 20 (unanswerable 10/10, false premise 5/5, off-limits 5/5), 0 leaks. PASS.**

---

## 6–8. System criteria (new)

**What they check:** the parts of the assistant a visitor never reads but relies on.
- **#6, usage limits:** is each visitor charged exactly what the rules say?
- **#7, logging:** is a chat saved only when the visitor allows it?
- **#8, digest:** does the weekly email report exactly what was saved?

**To pass:** every scenario passes. One wrong charge, one chat saved against the visitor's choice, or one wrong digest fails the run.

**Why they matter:** a broken limit either wastes the $5 monthly budget or locks out a recruiter. A chat saved after the visitor opted out breaks the promise the chat makes on screen.

**How they're checked:** code checks them; no model grades anything. Each scenario runs the real chat, status and digest handlers on a fake site:
- an in-memory Redis;
- a clock the scenario can move to midnight or 91 days on;
- a stand-in for retrieval and Claude that can answer, decline, fail or disconnect on cue;
- a captured email instead of Resend.

`.env.local` is never loaded and the network is blocked, so the live Redis, Claude and Resend can't be reached. A run costs $0.

**What was changed alongside them:**
- **The handlers moved into `lib/`** (`src/app/lib/assistant/chatHandlers.ts`, `digest.ts`), with retrieval, answering and the email sender passed in, so the evals run the same code as the site. The route files now just call them. `clients.ts` gained an evals-only hook that swaps in the fake Redis.
- **Lower limits:** 8 questions per visitor a day (was 15), 40 per IP (was 45). The burst limit (15 a minute site-wide) and the $5 monthly budget are unchanged.
- **Per-device limits:**
  - A visitor used to be a hash of IP + browser, so two people with identical browsers on one network (campus Wi-Fi) shared one allowance.
  - Now `/api/assistant/status` gives each browser a random device id in an httpOnly cookie when the chat opens, and the 8 counts against that device.
  - Browsers that block cookies fall back to IP + browser. The chat route never sets the cookie, so blocking cookies can't mint a fresh allowance per question.
  - The 40-per-IP ceiling remains the backstop for clearing cookies.
  - The device id is stored only hashed, and never with a saved chat.
- `usage.test.ts`: two IP-ceiling tests now work for any limits (they assumed the ceiling was exactly 3× the visitor limit), plus five device-cookie tests.

**Runs (2026-11-22T22:26, first run of each):**
- **#6 limits:** 14 of 14 scenarios (55 checks). Covers: the daily allowance and remaining counts; the device cookie; identical browsers on one network; a device changing network; the 40-per-IP ceiling against cleared cookies; blocked or forged cookies; refunds before Claude; billed and abandoned answers staying counted; the burst limit; the budget guard; the UTC-midnight reset; invalid requests; spend recording.
- **#7 logging:** 12 of 12 (53 checks). Covers: every turn saved as the visitor saw it; on by default; saving off; opting out by toggle and by the next question; opting back in; fallback flag; declined answers saving the replacement; failed answers and bad ids saving nothing; no IP, user agent, device id or hash in a saved chat; chats isolated from each other.
- **#8 digest:** 11 of 11 (32 checks). Covers: the cron secret; the 7-day window; continued older chats; opted-out chats excluded; subject counts and ordering; HTML escaping; the "(no source)" mark and source lists; quiet weeks; 90-day pruning; send failures; missing email settings.

**Known gap:** if a visitor's very first question is sent before the chat's status call returns, that one question is counted by IP + browser. That visitor can get 9 that day instead of 8.

---

## Changes shared across criteria

| Change | Files | Criteria it helped |
|---|---|---|
| Switched the answering model from Haiku 5.5 to Sonnet 5.5, with the budget guard priced per model | `config.ts`, `usage.ts`, `answer.ts`, docs | All five |
| Rewrote the prompt rules (honesty, source order, links, endings) | `src/app/lib/assistant/prompt.ts` | 1, 2, 3, 4, 5 |
| Added contextual retrieval | `contextualize.ts`, `indexer.ts`, `retrieve.ts`, `chunks/types.ts` | 3, mostly; retrieval in general |
| Fixed the content so the sources agree | `experience.ts`, `projects.ts`, the résumé PDF, Assistant facts | 1, 2 |
| Fixed the faithfulness grader (source URLs, contact sources) | `evals/criteria/faithfulness/` | 2 |
| Added `--model` to every runner | `evals/core/args.ts`, `evals/core/pipeline.ts` | Comparing models |
| Added the retrieval diagnostic | `evals/retrieval/` | 3 (measuring) |
| Moved the chat and digest handlers into `lib/` with injectable dependencies; per-device limits (8 a day, 40 per IP) | `chatHandlers.ts`, `digest.ts`, `usage.ts`, `config.ts`, `status/route.ts` | 6, 7, 8 |
| Re-indexed with env vars loaded | `node --env-file=.env.local --import tsx scripts/assistant-index.ts` | 1, and anything that depends on fresh content |

## Lessons

- **Re-index after every content change** before running an eval, and use the env-file command. `npm run assistant:index` silently skips the sync locally.
- **Keep the sources consistent:** site, résumé, LinkedIn and Assistant facts. Most correctness failures were contradictions in the content, not model mistakes.
- **When an eval fails, check the grader's inputs too.** Several faithfulness "failures" were things the grader simply couldn't see.
- **Don't hard-code answers to make an eval pass.** Fix the content, the retrieval or the general rules.
- **Haiku plateaued on faithfulness.** Its small embellishments couldn't be prompted away reliably, and Sonnet's adherence to the rules is what got the criteria over the line.

## Still to do

- **Commit and deploy.** The live site still answers with Haiku and an index without contexts, and it still has the old limits (15 per visitor, 45 per IP, no device cookie). Until this code is deployed, the daily reindex job runs the old code and can strip the contexts from the index.
- **If `ASSISTANT_FACTS` is set on Vercel,** add the hometown/bilingual line there too.
- **Re-run all five evals on the final setup** (Sonnet with contextual retrieval). Criteria 1, 3, 4 and 5 already passed on it. Criterion 2's passing runs came before contextual retrieval was turned on.
- **Optional:** the `soft-learning` and `soft-users` showcase misses.
