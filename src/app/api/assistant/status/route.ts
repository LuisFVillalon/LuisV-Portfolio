// GET: whether the assistant can answer right now, and this visitor's remaining questions today
// (capped by what is left of its IP's daily ceiling). The chat calls it when it first opens, so
// this is where a new device gets its device cookie (see usage.ts).
import { NextResponse } from 'next/server';
import { ASSISTANT, isAssistantConfigured } from '@/app/lib/assistant/config';
import { deviceCookie, deviceIdOf, ipId, isOverBudget, newDeviceId, questionsRemaining, visitorId } from '@/app/lib/assistant/usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const base = { limit: ASSISTANT.dailyQuestionLimit, maxChars: ASSISTANT.maxQuestionChars };
    const headers = { 'Cache-Control': 'no-store' };
    if (!isAssistantConfigured()) return NextResponse.json({ ...base, available: false, reason: 'off', remaining: 0 }, { headers });
    const known = deviceIdOf(req);
    const device = known ?? newDeviceId();
    const withCookie = known ? headers : { ...headers, 'Set-Cookie': deviceCookie(device) };
    try {
        const [overBudget, remaining] = await Promise.all([
            isOverBudget(),
            questionsRemaining({ visitor: visitorId(req, device), ip: ipId(req) }),
        ]);
        return NextResponse.json(
            { ...base, available: !overBudget, reason: overBudget ? 'budget' : undefined, remaining },
            { headers: withCookie },
        );
    } catch (err) {
        console.error('Assistant: status check failed', err);
        return NextResponse.json({ ...base, available: false, reason: 'unavailable', remaining: 0 }, { headers: withCookie });
    }
}
