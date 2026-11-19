'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Source = { label: string; href: string };

export type Msg = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    sources?: Source[];
    /** The answer rests on no source (don't-know or decline): show the Contact Luis actions. */
    fallback?: boolean;
    /** streaming: text still arriving; error: the request failed (shows Retry). */
    status: 'done' | 'streaming' | 'error';
    /** On an error: the failed try still counted toward today's limit (Claude had already answered part of it). */
    counted?: boolean;
};

/** thinking = request sent, no tokens yet (typing dots); streaming = tokens arriving. */
export type Phase = 'idle' | 'thinking' | 'streaming';

/** Why the assistant can't answer at all: not configured, monthly budget used, or a server problem. */
export type Unavailable = 'off' | 'budget' | 'unavailable' | null;

const SAVE_KEY = 'assistant:save';

let seq = 0;
const nextId = () => `m${Date.now().toString(36)}${++seq}`;
const newConversationId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

/** Replaces the message with the same id, or appends it. */
const upsert = (list: Msg[], msg: Msg) =>
    list.some((m) => m.id === msg.id) ? list.map((m) => (m.id === msg.id ? msg : m)) : [...list, msg];

/** Strips Markdown marks for screen-reader announcements. */
export const plainText = (text: string) =>
    text
        .replace(/\*\*|__|`/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*[-*]\s+/gm, '');

type Event =
    | { t: 'start'; remaining: number }
    | { t: 'text'; v: string }
    | { t: 'replace'; v: string }
    | { t: 'done'; sources: Source[]; fallback: boolean; remaining: number }
    | { t: 'error'; remaining: number; refunded: boolean };

function readSavePreference(): boolean {
    try {
        return window.localStorage.getItem(SAVE_KEY) !== '0';
    } catch {
        return true;
    }
}

/**
 * Chat state for the assistant panel: sends questions to /api/assistant/chat, streams the
 * answer in and tracks the visitor's remaining questions (the server refunds failed requests that
 * Claude hadn't answered yet; the count shown always comes from the server).
 */
export function useAssistantChat(page: string) {
    const [messages, setMessages] = useState<Msg[]>([]);
    const [phase, setPhase] = useState<Phase>('idle');
    const [remaining, setRemaining] = useState<number | null>(null);
    const [limit, setLimit] = useState(15);
    const [maxChars, setMaxChars] = useState(500);
    const [unavailable, setUnavailable] = useState<Unavailable>(null);
    const [announcement, setAnnouncement] = useState('');
    const [save, setSaveState] = useState(true);
    const conversationId = useRef<string>('');
    const abort = useRef<AbortController | null>(null);
    const statusLoaded = useRef(false);

    useEffect(() => {
        conversationId.current = newConversationId();
        setSaveState(readSavePreference());
        return () => abort.current?.abort();
    }, []);

    /** Loads availability and today's remaining questions (once, when the panel first opens). */
    const loadStatus = useCallback(async () => {
        if (statusLoaded.current) return;
        statusLoaded.current = true;
        try {
            const res = await fetch('/api/assistant/status', { cache: 'no-store' });
            const s = (await res.json()) as { available: boolean; reason?: Unavailable; remaining: number; limit: number; maxChars: number };
            setLimit(s.limit);
            setMaxChars(s.maxChars);
            setRemaining(s.remaining);
            setUnavailable(s.available ? null : (s.reason ?? 'unavailable'));
        } catch {
            statusLoaded.current = false; // try again next time
        }
    }, []);

    const setSave = useCallback((value: boolean) => {
        setSaveState(value);
        try {
            window.localStorage.setItem(SAVE_KEY, value ? '1' : '0');
        } catch {
            // Private mode: the choice still applies to this page view.
        }
        // Opting out deletes anything already saved from this chat.
        if (!value) {
            fetch('/api/assistant/chat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId: conversationId.current }),
            }).catch(() => undefined);
        }
    }, []);

    const ask = useCallback(
        async (question: string, history: Msg[]) => {
            const controller = new AbortController();
            abort.current?.abort();
            abort.current = controller;
            setPhase('thinking');
            setAnnouncement('Assistant is typing');
            const answerId = nextId();
            let text = '';

            const fail = (left?: number, counted = false) => {
                if (typeof left === 'number') setRemaining(left);
                setMessages((m) => [...m.filter((x) => x.id !== answerId), { id: answerId, role: 'assistant', text: '', status: 'error', counted }]);
                setPhase('idle');
                setAnnouncement(
                    `Error: the assistant couldn't answer.${counted ? '' : " This didn't count toward your limit."} Retry is available.`,
                );
            };

            try {
                const res = await fetch('/api/assistant/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        question,
                        history: history
                            .filter((m) => m.status === 'done' && m.text)
                            .map((m) => ({ role: m.role, text: m.text })),
                        conversationId: conversationId.current,
                        save,
                        page,
                    }),
                });

                if (!res.ok || !res.body) {
                    const err = (await res.json().catch(() => ({}))) as { code?: string };
                    if (err.code === 'limit') {
                        setRemaining(0);
                        setPhase('idle');
                        setAnnouncement("You've used today's questions.");
                        return;
                    }
                    if (err.code === 'budget' || err.code === 'off') {
                        setUnavailable(err.code);
                        setPhase('idle');
                        setAnnouncement('The assistant is unavailable right now. Contact Luis directly.');
                        return;
                    }
                    fail();
                    return;
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let finished = false;
                const apply = (e: Event) => {
                    if (e.t === 'start') {
                        setRemaining(e.remaining);
                    } else if (e.t === 'text' || e.t === 'replace') {
                        text = e.t === 'text' ? text + e.v : e.v;
                        const msg: Msg = { id: answerId, role: 'assistant', text, status: 'streaming', fallback: e.t === 'replace' };
                        setMessages((m) => upsert(m, msg));
                        setPhase('streaming');
                    } else if (e.t === 'done') {
                        finished = true;
                        setRemaining(e.remaining);
                        const msg: Msg = { id: answerId, role: 'assistant', text, sources: e.sources, fallback: e.fallback, status: 'done' };
                        setMessages((m) => upsert(m, msg));
                        setPhase('idle');
                        setAnnouncement(
                            `Assistant: ${plainText(text)}${e.sources.length ? ` Sources: ${e.sources.map((s) => s.label).join(', ')}.` : ''}${
                                e.remaining === 0 ? ' You have reached the question limit for today.' : ''
                            }`,
                        );
                    } else if (e.t === 'error') {
                        finished = true;
                        fail(e.remaining, !e.refunded);
                    }
                };

                for (;;) {
                    const { value, done } = await reader.read();
                    if (value) buffer += decoder.decode(value, { stream: true });
                    let nl: number;
                    while ((nl = buffer.indexOf('\n')) >= 0) {
                        const line = buffer.slice(0, nl).trim();
                        buffer = buffer.slice(nl + 1);
                        if (line) apply(JSON.parse(line) as Event);
                    }
                    if (done) break;
                }
                if (!finished) fail(undefined, text.length > 0);
            } catch (err) {
                if ((err as Error).name === 'AbortError') return;
                fail(undefined, text.length > 0);
            }
        },
        [page, save],
    );

    const send = useCallback(
        (raw: string) => {
            const question = raw.trim().slice(0, maxChars);
            if (!question || phase !== 'idle' || remaining === 0 || unavailable) return false;
            const history = messages;
            setMessages((m) => [...m, { id: nextId(), role: 'user', text: question, status: 'done' }]);
            void ask(question, history);
            return true;
        },
        [ask, maxChars, messages, phase, remaining, unavailable],
    );

    /** Drops the failed answer and asks the last question again. */
    const retry = useCallback(() => {
        const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user');
        if (lastUserIndex < 0 || phase !== 'idle' || remaining === 0) return;
        const history = messages.slice(0, lastUserIndex);
        setMessages((m) => m.filter((x) => x.status !== 'error'));
        void ask(messages[lastUserIndex].text, history);
    }, [ask, messages, phase, remaining]);

    const clear = useCallback(() => {
        abort.current?.abort();
        conversationId.current = newConversationId();
        setMessages([]);
        setPhase('idle');
        setAnnouncement('Conversation cleared');
    }, []);

    return {
        messages,
        phase,
        remaining,
        limit,
        maxChars,
        unavailable,
        announcement,
        save,
        setSave,
        loadStatus,
        send,
        retry,
        clear,
        limited: remaining === 0 && phase === 'idle',
        /** Visitor questions so far, for the "Message Luis" context. */
        questions: messages.filter((m) => m.role === 'user').map((m) => m.text),
    };
}

export type AssistantChat = ReturnType<typeof useAssistantChat>;
