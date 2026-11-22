// The weekly digest (app/api/assistant/digest/route.ts calls this; Vercel Cron runs it every
// Monday, see vercel.json): emails Luis every conversation saved in the past 7 days, via Resend.
// The sender is passed in so the digest eval (evals/criteria/digest) can capture the email.
import { Resend } from 'resend';
import { isAuthorizedCron } from './cron';
import { redisEnv } from './config';
import { conversationsSince, type SavedConversation } from './conversations';
import { escapeHtml } from '../email';

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type DigestEmail = { from: string; to: string[]; subject: string; html: string };
export type SendEmail = (email: DigestEmail) => Promise<{ error: { message: string } | null }>;

const sendWithResend: SendEmail = async (email) => {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send(email);
    return { error: error ? { message: error.message } : null };
};

const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

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

export function digestHandler(send: SendEmail = sendWithResend) {
    return async function GET(req: Request): Promise<Response> {
        if (!isAuthorizedCron(req)) return json({ ok: false, error: 'unauthorized' }, 401);
        if (!redisEnv() || !process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
            return json({ ok: true, skipped: 'digest is not configured' });
        }
        try {
            const convos = await conversationsSince(Date.now() - WEEK_MS);
            if (convos.length === 0) return json({ ok: true, sent: false, conversations: 0 });
            const questions = convos.reduce((n, c) => n + c.turns.length, 0);
            const { error } = await send({
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
            return json({ ok: true, sent: true, conversations: convos.length });
        } catch (err) {
            console.error('Assistant digest failed', err);
            return json({ ok: false, error: 'digest failed' }, 500);
        }
    };
}
