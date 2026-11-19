// GET: whether the assistant can answer right now, and this visitor's remaining questions today.
import { NextResponse } from 'next/server';
import { ASSISTANT, isAssistantConfigured } from '@/app/lib/assistant/config';
import { isOverBudget, questionsUsed, visitorId } from '@/app/lib/assistant/usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const base = { limit: ASSISTANT.dailyQuestionLimit, maxChars: ASSISTANT.maxQuestionChars };
    const headers = { 'Cache-Control': 'no-store' };
    if (!isAssistantConfigured()) return NextResponse.json({ ...base, available: false, reason: 'off', remaining: 0 }, { headers });
    try {
        const [overBudget, used] = await Promise.all([isOverBudget(), questionsUsed(visitorId(req))]);
        const remaining = Math.max(0, ASSISTANT.dailyQuestionLimit - used);
        return NextResponse.json(
            { ...base, available: !overBudget, reason: overBudget ? 'budget' : undefined, remaining },
            { headers },
        );
    } catch (err) {
        console.error('Assistant: status check failed', err);
        return NextResponse.json({ ...base, available: false, reason: 'unavailable', remaining: 0 }, { headers });
    }
}
