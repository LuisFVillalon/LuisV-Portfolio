// Weekly Vercel Cron job: emails Luis every conversation saved in the past 7 days, via Resend.
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { redisEnv } from '@/app/lib/assistant/config';
import { conversationsSince, type SavedConversation } from '@/app/lib/assistant/conversations';
import { isAuthorizedCron } from '@/app/lib/assistant/cron';
import { escapeHtml } from '@/app/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function renderConversation(c: SavedConversation): string {
    const turns = c.turns
        .map(
            (t) => `
        <p style="margin:12px 0 4px"><b>Visitor:</b> ${escapeHtml(t.q)}</p>
        <p style="margin:0 0 4px;white-space:pre-wrap"><b>Assistant${t.fallback ? ' (no source)' : ''}:</b> ${escapeHtml(t.a)}</p>
        ${t.sources.length ? `<p style="margin:0;color:#6e6e78;font-size:12px">Sources: ${escapeHtml(t.sources.join(', '))}</p>` : ''}`,
        )
        .join('');
    return `
      <div style="border-top:1px solid #ddd;padding-top:12px;margin-top:16px">
        <p style="margin:0;color:#6e6e78;font-size:12px">Started ${escapeHtml(c.startedAt)} on ${escapeHtml(c.page)} · ${c.turns.length} question(s)</p>
        ${turns}
      </div>`;
}

export async function GET(req: Request) {
    if (!isAuthorizedCron(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    if (!redisEnv() || !process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
        return NextResponse.json({ ok: true, skipped: 'digest is not configured' });
    }
    try {
        const convos = await conversationsSince(Date.now() - WEEK_MS);
        if (convos.length === 0) return NextResponse.json({ ok: true, sent: false, conversations: 0 });
        const questions = convos.reduce((n, c) => n + c.turns.length, 0);
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: [process.env.TO_EMAIL],
            subject: `AI assistant weekly digest: ${convos.length} chat(s), ${questions} question(s)`,
            html: `
              <h2>Your portfolio AI assistant this week</h2>
              <p>${convos.length} saved conversation(s) and ${questions} question(s) in the past 7 days.
              Visitors who opted out of saving are not included. Chats are deleted after 90 days.</p>
              ${convos.map(renderConversation).join('')}`,
        });
        if (error) throw new Error(error.message);
        return NextResponse.json({ ok: true, sent: true, conversations: convos.length });
    } catch (err) {
        console.error('Assistant digest failed', err);
        return NextResponse.json({ ok: false, error: 'digest failed' }, { status: 500 });
    }
}
