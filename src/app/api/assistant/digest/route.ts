// Weekly Vercel Cron job (Mondays, see vercel.json): emails Luis every conversation saved in the
// past 7 days. The handler lives in lib/assistant/digest.ts, so the digest eval can run it directly.
import { digestHandler } from '@/app/lib/assistant/digest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = digestHandler();
