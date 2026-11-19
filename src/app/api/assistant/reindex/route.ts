// Daily Vercel Cron job: rebuilds the corpus (site data, résumé, LinkedIn file, public GitHub
// repos) and syncs the vector index, re-embedding only chunks whose content changed.
import { NextResponse } from 'next/server';
import { isIndexingConfigured } from '@/app/lib/assistant/config';
import { isAuthorizedCron } from '@/app/lib/assistant/cron';
import { syncIndex } from '@/app/lib/assistant/indexer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Hobby plan ceiling; only changed chunks are re-embedded

export async function GET(req: Request) {
    if (!isAuthorizedCron(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    if (!isIndexingConfigured()) return NextResponse.json({ ok: true, skipped: 'indexing is not configured' });
    try {
        const report = await syncIndex();
        console.log('Assistant reindex:', report);
        return NextResponse.json({ ok: true, ...report });
    } catch (err) {
        console.error('Assistant reindex failed', err);
        return NextResponse.json({ ok: false, error: 'reindex failed' }, { status: 500 });
    }
}
