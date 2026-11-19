'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Loader2, Send, X } from 'lucide-react';
import { brandGradient, focusRing } from './ChatBits';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const field = `w-full rounded-lg border border-[#0A0A23]/15 bg-white px-2.5 py-1.5 text-[13px] text-[#0A0A23] placeholder:text-[#9a9aa3] focus:border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20`;
const label = 'mb-1 block font-sans text-[12px] font-bold text-[#0A0A23]';

/**
 * "Message Luis" form card inside the chat. The visitor fills it in and presses Send
 * themselves; the assistant never sends anything on its own. Posts to /api/contact.
 */
export default function LeadCard({ questions, onClose }: { questions: string[]; onClose: () => void }) {
    const id = useId();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [includeQuestions, setIncludeQuestions] = useState(true);
    const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState<string | null>(null);
    const first = useRef<HTMLInputElement>(null);
    const doneRef = useRef<HTMLDivElement>(null);

    useEffect(() => first.current?.focus(), []);
    useEffect(() => {
        if (state === 'sent') doneRef.current?.focus();
    }, [state]);

    const submit = async () => {
        if (!name.trim() || !email.trim() || !message.trim()) return setError('Please fill in your name, email and message.');
        if (!EMAIL.test(email.trim())) return setError('Please enter a valid email address.');
        setError(null);
        setState('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                    source: 'chat',
                    context: includeQuestions ? questions.map((q) => `- ${q}`).join('\n') : '',
                }),
            });
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
            if (!res.ok || !data.ok) throw new Error(data.error || "Your message couldn't be sent. Please try the contact page.");
            setState('sent');
        } catch (e) {
            setState('idle');
            setError((e as Error).message);
        }
    };

    if (state === 'sent') {
        return (
            <div ref={doneRef} tabIndex={-1} role="status" className="rounded-xl border border-[#22c55e]/40 bg-[#f0fdf4] px-3.5 py-3 text-[13px] outline-none">
                <p className="flex items-center gap-1.5 font-sans font-extrabold text-[#0A0A23]">
                    <Check className="h-4 w-4 text-[#15803d]" aria-hidden="true" /> Sent to Luis.
                </p>
                <p className="mt-0.5 text-[#333333]">He&apos;ll reply to {email.trim()}.</p>
                <button type="button" onClick={onClose} className={`mt-2 text-[12px] font-bold text-[#006400] underline underline-offset-2 ${focusRing}`}>
                    Back to the chat
                </button>
            </div>
        );
    }

    return (
        <form
            aria-labelledby={`${id}-title`}
            className="rounded-xl border border-[#0A0A23]/15 bg-white px-3.5 py-3"
            onSubmit={(e) => {
                e.preventDefault();
                void submit();
            }}
        >
            <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                    <p id={`${id}-title`} className="font-sans text-[14px] font-extrabold text-[#0A0A23]">
                        Message Luis
                    </p>
                    <p className="text-[11px] text-[#6e6e78]">Goes straight to his inbox. Nothing is sent until you press Send.</p>
                </div>
                <button type="button" onClick={onClose} aria-label="Close the message form" className={`rounded-md p-1 text-[#6e6e78] hover:bg-[#F3F3F5] ${focusRing}`}>
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
            <div className="grid gap-2">
                <div>
                    <label htmlFor={`${id}-name`} className={label}>
                        Name
                    </label>
                    <input id={`${id}-name`} ref={first} value={name} maxLength={100} autoComplete="name" onChange={(e) => setName(e.target.value)} className={field} />
                </div>
                <div>
                    <label htmlFor={`${id}-email`} className={label}>
                        Email
                    </label>
                    <input
                        id={`${id}-email`}
                        type="email"
                        value={email}
                        maxLength={200}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={field}
                    />
                </div>
                <div>
                    <label htmlFor={`${id}-message`} className={label}>
                        Message
                    </label>
                    <textarea
                        id={`${id}-message`}
                        rows={3}
                        value={message}
                        maxLength={2000}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. We're hiring new-grad engineers and would love to talk."
                        className={`${field} resize-none`}
                    />
                </div>
                {questions.length > 0 && (
                    <label className="flex items-start gap-2 text-[12px] text-[#333333]">
                        <input
                            type="checkbox"
                            checked={includeQuestions}
                            onChange={(e) => setIncludeQuestions(e.target.checked)}
                            className="mt-0.5 accent-[#15803d]"
                        />
                        Include the questions I asked here, so Luis has context
                    </label>
                )}
            </div>
            {error && (
                <p role="alert" className="mt-2 text-[12px] font-bold text-[#b91c1c]">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={state === 'sending'}
                className={`mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-extrabold text-white disabled:opacity-60 ${brandGradient} ${focusRing}`}
            >
                {state === 'sending' ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Send className="h-3.5 w-3.5" aria-hidden="true" />}
                {state === 'sending' ? 'Sending…' : 'Send'}
            </button>
        </form>
    );
}
