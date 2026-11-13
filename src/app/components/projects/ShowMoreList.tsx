'use client';

import { Children, useState } from 'react';
import { inlineLinkClass } from '../home/BentoTile';

interface ShowMoreListProps {
    children: React.ReactNode;
    /** How many items show before "Show N more". */
    initial: number;
    className?: string;
    /** Completes the button text: "Show 4 {noun}". */
    noun?: string;
}

/** A <ul> that shows its first few items, with a toggle for the rest. */
export default function ShowMoreList({ children, initial, className = '', noun = 'more' }: ShowMoreListProps) {
    const items = Children.toArray(children);
    const [open, setOpen] = useState(false);
    const hidden = items.length - initial;

    return (
        <>
            <ul className={className}>{open ? items : items.slice(0, initial)}</ul>
            {hidden > 0 && (
                <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className={`mt-2 self-start text-xs ${inlineLinkClass}`}
                >
                    {open ? 'Show fewer' : `Show ${hidden} ${noun}`}
                </button>
            )}
        </>
    );
}
