# Ask AI evals

Local checks of the site's Ask AI assistant against agreed criteria. Only criterion #1, Factual Correctness, is built so far.

## Criterion #1: Factual Correctness

**Pass line:** at least 27 of the 30 recruiter-style questions in `correctness.json` (90%) are answered **Correct**, and **no** answer states a wrong high-stakes fact (degree, graduation date, employer, job title, award result).

Each answer gets one label from the grader:

| Label | Meaning |
|---|---|
| **Correct** | Every required key fact is present, and nothing contradicts them. |
| **Partial** | Nothing is wrong, but at least one required key fact is missing (this includes "I don't have that information"). |
| **Incorrect** | At least one fact is wrong: a key fact is contradicted, or the answer says something that conflicts with the reference facts. |

The grader also marks each key fact `present`, `missing` or `contradicted`, and lists any wrong statements, flagging those about a degree, graduation date, employer, job title or award result as high-stakes. A high-stakes wrong statement fails the whole run, on any question. The final label is the stricter of the grader's own label and the one its per-fact verdicts imply, so a lenient label can't pass a missing or contradicted fact. A question that errors (API failure, unparseable grade) counts as not Correct and fails the run.

### Files

| File | What it is |
|---|---|
| `correctness.json` | The 30 questions: `id`, `question`, `keyFacts`, `highStakes`, `category`, and an optional reviewer `note` (never shown to the grader). **Draft:** drafted from the public site data and résumé; the site owner corrects it before the first run. |
| `lib/grader.ts` | **The grader in one place:** model (`claude-sonnet-5-5`), effort, prompt, JSON output schema, and the parsing and label rules. |
| `lib/score.ts` | The pass/fail rule and the high-stakes check. |
| `correctness.ts` | The runner: answers each question with the real pipeline, grades it, writes the reports. |

### Running it

Put the keys in `.env.local` at the repo root (gitignored; see `.env.example`). The eval needs `ANTHROPIC_API_KEY`, `VOYAGE_API_KEY`, `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN`, and reads the index the site uses, so run `npm run assistant:index` first if site content changed.

```bash
npm run eval:correctness                          # all 30 questions
npm run eval:correctness -- --limit 3             # the first 3, for a cheap check
npm run eval:correctness -- --id edu-graduation   # one question
npm run eval:correctness -- --max-cost 0.5        # stop starting questions past $0.50 (default $1)
```

Each question runs the same `retrieve()` + `streamAnswer()` path the chat route uses: single-turn, no history, with the Assistant facts loaded from `ASSISTANT_FACTS` or `.private/` as on the site. The script prints the Correct/Partial/Incorrect counts, any high-stakes errors and PASS or FAIL, and writes a Markdown and a JSON report to `evals/results/` (gitignored). The reports include each question, answer, cited sources, retrieved chunks, the grader's verdict per fact, latency and estimated cost. A run of fewer than 30 questions applies the same 90% rule to the questions run and is marked partial. The exit code is 0 on PASS, 1 on FAIL and 2 on a setup error.

**Cost:** about $0.01-0.02 per question (Claude Haiku 5.5 answer plus Claude Sonnet 5.5 grade), so roughly $0.30-0.60 for all 30. Voyage embedding and rerank calls aren't counted; they cost a fraction of a cent.

**Live site state:** the run never touches the site's Upstash Redis, so no question counters, monthly spend or saved conversations are written, and the monthly budget isn't charged. Those writes live in the chat route, not in `retrieve()` or `streamAnswer()`, and the script also removes the Redis variables from its own environment before loading the pipeline.

`npm test` covers the pure parts (grader-output parsing, labels, the pass/fail rule, flags) without calling any API.
