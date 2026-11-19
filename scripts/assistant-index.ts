// Builds the AI assistant's retrieval corpus and syncs it to the Upstash Vector index.
//
//   npm run assistant:index              sync the index (runs before every `npm run build`)
//   npm run assistant:chunks             print the chunks without any API keys or writes
//   npm run assistant:chunks -- --no-github   same, skipping GitHub
//
// Without VOYAGE_API_KEY and the Upstash Vector variables the sync is skipped, and a failed
// sync never fails the build: the daily cron job retries it.
import { buildCorpus } from '../src/app/lib/assistant/chunks';
import { isIndexingConfigured } from '../src/app/lib/assistant/config';
import { syncIndex } from '../src/app/lib/assistant/indexer';

async function main() {
    const args = new Set(process.argv.slice(2));
    const github = !args.has('--no-github');

    if (args.has('--dry-run')) {
        const chunks = await buildCorpus({ github });
        const bySource = chunks.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.sourceType]: (acc[c.sourceType] ?? 0) + 1 }), {});
        for (const c of chunks) {
            console.log(`\n── ${c.id}  (${c.label} → ${c.href})\n${c.header}\n${c.text.slice(0, args.has('--full') ? Infinity : 300)}`);
        }
        console.log(`\n${chunks.length} chunks`, bySource);
        return;
    }

    if (!isIndexingConfigured()) {
        console.log('[assistant] index sync skipped: VOYAGE_API_KEY / UPSTASH_VECTOR_REST_URL / UPSTASH_VECTOR_REST_TOKEN not set');
        return;
    }
    try {
        const report = await syncIndex(await buildCorpus({ github }));
        console.log('[assistant] index synced', report);
    } catch (err) {
        console.warn('[assistant] index sync failed (the build continues; the daily cron job will retry):', err);
    }
}

main();
