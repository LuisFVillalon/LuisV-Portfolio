'use client';

import { Info, Sparkles } from 'lucide-react';

// Small pieces shared by the chat panel and its entry points (header button, home tile).
// Kept apart from ChatParts so the entry points don't pull in the panel's Markdown renderer.

export const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]';

/** Brand gradient used by the site's primary button and the active-nav underline. */
export const brandGradient = 'bg-[linear-gradient(to_right,#22c55e,#3b82f6)]';

/** Round brand-gradient badge with a white sparkle: "Luis's assistant", never Luis himself. */
export function AssistantAvatar({ size = 32 }: { size?: number }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex flex-none items-center justify-center rounded-full ${brandGradient}`}
            style={{ width: size, height: size }}
        >
            <Sparkles className="h-[55%] w-[55%] text-white" strokeWidth={2.25} />
        </span>
    );
}

export function StarterChips({ items, onPick, disabled = false }: { items: string[]; onPick: (q: string) => void; disabled?: boolean }) {
    return (
        <ul className="flex flex-wrap gap-1.5">
            {items.map((q) => (
                <li key={q}>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onPick(q)}
                        className={`rounded-full border border-[#0A0A23]/10 bg-white px-3 py-1.5 text-left text-xs font-bold text-[#0A0A23] transition-colors hover:border-[#22c55e] hover:bg-[#f0fdf4] disabled:opacity-50 ${focusRing}`}
                    >
                        {q}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export function Disclosure({ className = '' }: { className?: string }) {
    return (
        <p className={`flex items-start gap-1.5 text-[11px] leading-snug text-[#6e6e78] ${className}`}>
            <Info className="mt-px h-3 w-3 flex-none" aria-hidden="true" />
            <span>AI answers may be imperfect; check the linked sources.</span>
        </p>
    );
}
