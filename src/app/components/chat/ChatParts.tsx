'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { AlertTriangle, ArrowUp, Mail, RotateCcw } from 'lucide-react';
import { primaryButtonClass } from '@/app/components/home/BentoTile';
import { resume } from '@/app/lib/experience';
import { AssistantAvatar, brandGradient, focusRing } from './ChatBits';
import type { Msg, Phase, Source, Unavailable } from './useAssistantChat';

export { AssistantAvatar, brandGradient, Disclosure, focusRing, StarterChips } from './ChatBits';

const isExternal = (href: string) => /^https?:\/\//.test(href) || href.endsWith('.pdf');
const externalProps = { target: '_blank', rel: 'noopener noreferrer' } as const;
const smallButtonClass = `inline-flex items-center gap-1 rounded-lg border-2 border-[#0A0A23] bg-white px-2.5 py-1 font-sans text-xs font-bold text-[#0A0A23] hover:bg-[#0A0A23] hover:text-white ${focusRing}`;

/** Answer Markdown: paragraphs, bold/italic, short lists, inline code and links (site pages or https only). */
const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-bold text-[#0A0A23]">{children}</strong>,
    ul: ({ children }) => <ul className="mb-2 list-disc space-y-0.5 pl-4 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-decimal space-y-0.5 pl-4 last:mb-0">{children}</ol>,
    code: ({ children }) => <code className="rounded bg-white/70 px-1 font-mono text-[12px]">{children}</code>,
    a: ({ href = '', children }) => {
        const cls = `font-bold text-[#006400] underline underline-offset-4 hover:text-[#0A0A23] ${focusRing}`;
        if (href.startsWith('/') && !href.startsWith('//')) {
            return isExternal(href) ? (
                <a href={href} className={cls} {...externalProps}>
                    {children}
                </a>
            ) : (
                <Link href={href} className={cls}>
                    {children}
                </Link>
            );
        }
        if (/^https:\/\//.test(href)) {
            return (
                <a href={href} className={cls} {...externalProps}>
                    {children}
                </a>
            );
        }
        return <>{children}</>;
    },
};

const ALLOWED = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'br'];

function AnswerText({ text }: { text: string }) {
    return (
        <ReactMarkdown allowedElements={ALLOWED} unwrapDisallowed components={markdownComponents}>
            {text}
        </ReactMarkdown>
    );
}

function SourceChips({ sources }: { sources: Source[] }) {
    return (
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Sources">
            {sources.map((s) => {
                const external = isExternal(s.href);
                const cls = `inline-flex max-w-full items-center rounded-full border border-[#0A0A23]/10 bg-white px-2 py-0.5 text-[11px] font-bold text-[#333333] transition-colors hover:border-[#006400] hover:text-[#006400] ${focusRing}`;
                const label = <span className="truncate">{s.label}</span>;
                return (
                    <li key={`${s.label}|${s.href}`} className="max-w-full">
                        {external ? (
                            <a href={s.href} className={cls} {...externalProps}>
                                {label}
                                <span aria-hidden="true">&nbsp;↗</span>
                                <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                        ) : (
                            <Link href={s.href} className={cls}>
                                {label}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export function TypingDots() {
    return (
        <span className="inline-flex items-center gap-1 py-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6e6e78] motion-reduce:animate-none"
                    style={{ animationDelay: `${i * 140}ms` }}
                />
            ))}
        </span>
    );
}

/** Contact Luis + Message Luis, shown under answers that rest on no source. */
function ContactActions({ onMessage }: { onMessage: () => void }) {
    return (
        <div className="mt-2.5 flex flex-wrap gap-2">
            <Link href="/contact" className={`${primaryButtonClass} !px-3 !py-1.5 !text-xs ${focusRing}`}>
                Contact Luis →
            </Link>
            <button type="button" onClick={onMessage} className={smallButtonClass}>
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Message Luis
            </button>
        </div>
    );
}

function AssistantMessage({ msg, onRetry, onMessage }: { msg: Msg; onRetry: () => void; onMessage: () => void }) {
    if (msg.status === 'error') {
        return (
            <div className="flex items-start gap-2 rounded-xl border border-[#b91c1c]/25 bg-[#fef2f2] px-3 py-2.5 text-[13px] text-[#7f1d1d]">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                <div className="min-w-0">
                    <p className="font-bold">Couldn&apos;t get an answer.</p>
                    <p className="mt-0.5">
                        The assistant is unavailable right now.{msg.counted ? '' : " This didn't count toward your limit."}
                    </p>
                    <button
                        type="button"
                        onClick={onRetry}
                        className={`mt-2 inline-flex items-center gap-1 rounded-lg border-2 border-[#7f1d1d] bg-white px-2.5 py-1 font-sans text-xs font-bold text-[#7f1d1d] hover:bg-[#7f1d1d] hover:text-white ${focusRing}`}
                    >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    const done = msg.status === 'done';
    return (
        <div
            className={`max-w-[92%] break-words rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[13px] leading-relaxed text-[#333333] ${
                msg.fallback && done ? 'border border-dashed border-[#0A0A23]/20 bg-white' : 'bg-[#F3F3F5]'
            }`}
        >
            <AnswerText text={msg.text} />
            {msg.status === 'streaming' && (
                <span aria-hidden="true" className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#0A0A23]" />
            )}
            {done && msg.sources && msg.sources.length > 0 && <SourceChips sources={msg.sources} />}
            {done && msg.fallback && <ContactActions onMessage={onMessage} />}
        </div>
    );
}

/**
 * The scrolling conversation. Deliberately NOT a live region: streaming text into a live
 * region makes screen readers read every token. `LiveAnnouncer` speaks each finished answer once.
 */
export function MessageList({
    messages,
    phase,
    onRetry,
    onMessage,
    empty,
}: {
    messages: Msg[];
    phase: Phase;
    onRetry: () => void;
    onMessage: () => void;
    empty?: ReactNode;
}) {
    const endRef = useRef<HTMLLIElement>(null);
    const last = messages[messages.length - 1];
    useEffect(() => {
        // Scroll the panel's own scroller (not the page) to the newest content.
        const scroller = endRef.current?.closest<HTMLElement>('.overflow-y-auto');
        scroller?.scrollTo({ top: scroller.scrollHeight });
    }, [messages.length, last?.text, last?.status, phase]);

    if (messages.length === 0) return <>{empty}</>;

    return (
        <ol className="flex flex-col gap-3" aria-label="Conversation">
            {messages.map((m) =>
                m.role === 'user' ? (
                    <li key={m.id} className="flex justify-end">
                        <span className="sr-only">You said: </span>
                        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-md bg-[#0A0A23] px-3.5 py-2 text-[13px] leading-relaxed text-white">
                            {m.text}
                        </p>
                    </li>
                ) : (
                    <li key={m.id} className="flex items-end gap-2">
                        <AssistantAvatar size={24} />
                        <span className="sr-only">Assistant: </span>
                        <div className="min-w-0 flex-1">
                            <AssistantMessage msg={m} onRetry={onRetry} onMessage={onMessage} />
                        </div>
                    </li>
                ),
            )}
            {phase === 'thinking' && (
                <li className="flex items-end gap-2">
                    <AssistantAvatar size={24} />
                    <div className="rounded-2xl rounded-tl-md bg-[#F3F3F5] px-3.5 py-2">
                        <TypingDots />
                        <span className="sr-only">Assistant is typing</span>
                    </div>
                </li>
            )}
            <li ref={endRef} aria-hidden="true" />
        </ol>
    );
}

/** Visually hidden polite live region: announces "typing", each finished answer, errors and the limit. */
export function LiveAnnouncer({ text }: { text: string }) {
    return (
        <div className="sr-only" aria-live="polite" aria-atomic="true" data-chat-live="">
            {text}
        </div>
    );
}

/**
 * Message box: Enter sends, Shift+Enter adds a line, the field grows to 4 lines, and a counter
 * appears near the character cap. Disabled (not removed) while an answer is in flight.
 */
export function Composer({
    onSend,
    busy,
    remaining,
    limit,
    maxChars,
    inputRef,
}: {
    onSend: (text: string) => boolean;
    busy: boolean;
    remaining: number | null;
    limit: number;
    maxChars: number;
    inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
    const [value, setValue] = useState('');
    const near = value.length >= maxChars - 100;

    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    }, [value, inputRef]);

    const submit = () => {
        if (busy) return;
        if (onSend(value)) setValue('');
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submit();
            }}
        >
            <div className="flex items-end gap-2 rounded-xl border border-[#0A0A23]/15 bg-white p-1.5 pl-3 transition-colors focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20">
                <label className="sr-only" htmlFor="chat-composer">
                    Your question
                </label>
                <textarea
                    id="chat-composer"
                    ref={inputRef}
                    rows={1}
                    value={value}
                    maxLength={maxChars}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            submit();
                        }
                    }}
                    placeholder="Ask about Luis…"
                    aria-describedby="chat-composer-hint"
                    className="max-h-24 min-h-[28px] flex-1 resize-none bg-transparent py-1 text-[14px] text-[#0A0A23] outline-none placeholder:text-[#8e8e96]"
                />
                <button
                    type="submit"
                    disabled={busy || value.trim() === ''}
                    aria-label="Send"
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white transition-opacity disabled:opacity-35 ${brandGradient} ${focusRing}`}
                >
                    <ArrowUp className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </button>
            </div>
            <p id="chat-composer-hint" className="mt-1.5 flex justify-between gap-2 px-1 text-[11px] text-[#6e6e78]">
                <span>
                    {remaining === null ? `${limit} questions a day` : `${remaining} of ${limit} questions left today`}
                    <span className="hidden sm:inline"> · Enter to send, Shift+Enter for a new line</span>
                </span>
                {near && (
                    <span className={value.length >= maxChars ? 'font-bold text-[#b91c1c]' : ''}>
                        {value.length}/{maxChars}
                    </span>
                )}
            </p>
        </form>
    );
}

/** Replaces the composer when the visitor's questions are used up or the assistant is off. */
export function BlockedNotice({ reason, limit, onMessage }: { reason: 'limit' | NonNullable<Unavailable>; limit: number; onMessage: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    // The composer (which had focus) was just removed; keep focus inside the dialog.
    useEffect(() => {
        if (!document.activeElement || document.activeElement === document.body) ref.current?.focus();
    }, []);
    const copy = {
        limit: [`You've used today's ${limit} questions.`, 'Come back tomorrow, or reach Luis directly.'],
        budget: ['The assistant is taking a break until next month.', 'Luis is still easy to reach directly.'],
        off: ["The assistant isn't available right now.", 'You can still reach Luis directly.'],
        unavailable: ["The assistant isn't available right now.", 'Please try again later, or reach Luis directly.'],
    }[reason];
    return (
        <div ref={ref} tabIndex={-1} data-autofocus="" className="rounded-xl border border-[#0A0A23]/10 bg-[#F3F3F5] px-3.5 py-3 text-[13px] outline-none">
            <p className="font-sans font-extrabold text-[#0A0A23]">{copy[0]}</p>
            <p className="mt-0.5 text-[#333333]">{copy[1]}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
                <Link href="/contact" className={`${primaryButtonClass} !px-3 !py-1.5 !text-xs ${focusRing}`}>
                    Contact Luis →
                </Link>
                <button type="button" onClick={onMessage} className={smallButtonClass}>
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Message Luis
                </button>
                <a href={resume} {...externalProps} className={smallButtonClass}>
                    ↓ Résumé
                </a>
            </div>
        </div>
    );
}

/** The visible saving notice with its opt-out (and opt back in). */
export function SaveNotice({
    save,
    onChange,
    disabled = false,
    className = '',
}: {
    save: boolean;
    onChange: (save: boolean) => void;
    /** While an answer is in flight, so the choice applies to the next question and sticks. */
    disabled?: boolean;
    className?: string;
}) {
    const linkCls = `font-bold text-[#006400] underline underline-offset-2 hover:text-[#0A0A23] ${focusRing}`;
    return (
        <p className={`text-[11px] leading-snug text-[#6e6e78] ${className}`}>
            {save ? (
                <>
                    Chats are saved for 90 days so Luis can read them and improve the assistant.{' '}
                    <button type="button" onClick={() => onChange(false)} disabled={disabled} className={`${linkCls} disabled:cursor-not-allowed disabled:opacity-50`}>
                        Don&apos;t save my chat
                    </button>
                </>
            ) : (
                <>
                    This chat isn&apos;t saved.{' '}
                    <button type="button" onClick={() => onChange(true)} disabled={disabled} className={`${linkCls} disabled:cursor-not-allowed disabled:opacity-50`}>
                        Allow saving
                    </button>
                </>
            )}
        </p>
    );
}
