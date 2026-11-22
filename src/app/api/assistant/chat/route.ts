// The Ask AI chat endpoint. The handlers (and the streamed event format) live in
// lib/assistant/chatHandlers.ts, so the limit and logging evals can run them directly.
import { chatHandlers } from '@/app/lib/assistant/chatHandlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const chat = chatHandlers();

/** Answer one visitor question, streamed as NDJSON. */
export function POST(req: Request) {
    return chat.POST(req);
}

/** Forget a saved conversation (the visitor opted out of saving). */
export function DELETE(req: Request) {
    return chat.DELETE(req);
}
