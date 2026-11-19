'use client';

import { Sparkles } from 'lucide-react';
import { useAssistant } from './AssistantProvider';
import { focusRing } from './ChatBits';

/** The header's "Ask AI" button (icon-only on phones). Renders nothing when the assistant is off. */
export default function AskAIButton() {
    const { enabled, open, openWith } = useAssistant();
    if (!enabled) return null;
    return (
        <button
            type="button"
            onClick={() => openWith()}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Ask AI about Luis"
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border-2 border-[#0A0A23] bg-white px-2 font-sans text-sm font-bold text-[#0A0A23] transition-colors hover:bg-[#0A0A23] hover:text-white sm:px-3 ${focusRing}`}
        >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Ask AI</span>
        </button>
    );
}
