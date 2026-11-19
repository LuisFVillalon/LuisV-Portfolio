'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { BentoTile } from '@/app/components/home/BentoTile';
import { useAssistant } from './AssistantProvider';
import { AssistantAvatar, brandGradient, Disclosure, focusRing, StarterChips } from './ChatBits';
import { startersFor } from './starters';

/** The home page's "Ask about Luis" bento tile: a real input plus starter chips that open the chat. */
export default function AskTile() {
    const { enabled, openWith } = useAssistant();
    const [value, setValue] = useState('');
    if (!enabled) return null;

    return (
        <BentoTile className="md:col-span-2" label="Ask about Luis · AI">
            <div className="flex items-start gap-3">
                <AssistantAvatar size={40} />
                <div className="min-w-0">
                    <p className="font-sans text-lg font-extrabold leading-tight text-[#0A0A23]">Short on time? Just ask.</p>
                    <p className="mt-0.5 text-[13px] lg:text-xs">An AI assistant that answers from Luis&apos;s projects, roles and writing.</p>
                </div>
            </div>
            <form
                className="mt-3 lg:mt-2.5"
                onSubmit={(e) => {
                    e.preventDefault();
                    openWith(value);
                    setValue('');
                }}
            >
                <div className="flex items-center gap-2 rounded-xl border border-[#0A0A23]/15 bg-white p-1.5 pl-3 focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20">
                    <label htmlFor="ask-tile-input" className="sr-only">
                        Ask a question about Luis
                    </label>
                    <input
                        id="ask-tile-input"
                        value={value}
                        maxLength={500}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. What did ROSS win?"
                        className="min-w-0 flex-1 bg-transparent py-1 text-[14px] text-[#0A0A23] outline-none placeholder:text-[#8e8e96]"
                    />
                    <button
                        type="submit"
                        aria-label="Ask"
                        aria-haspopup="dialog"
                        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white ${brandGradient} ${focusRing}`}
                    >
                        <ArrowUp className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                    </button>
                </div>
            </form>
            <div className="mt-2.5 lg:mt-2">
                <StarterChips items={startersFor('/').slice(0, 3)} onPick={(q) => openWith(q)} />
            </div>
            <Disclosure className="mt-2.5 lg:mt-2" />
        </BentoTile>
    );
}
