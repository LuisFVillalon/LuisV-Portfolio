'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { inlineLinkClass } from './BentoTile';

interface ExpandableDescriptionProps {
    text: string;
}

/**
 * A project description clamped to a few lines, with a Read more / Read less
 * toggle that only appears when the clamped text is actually cut off.
 */
export default function ExpandableDescription({ text }: ExpandableDescriptionProps) {
    const ref = useRef<HTMLParagraphElement>(null);
    const id = useId();
    const [expanded, setExpanded] = useState(false);
    const [truncated, setTruncated] = useState(false);

    // Measure only while clamped; re-measure whenever the element resizes
    // (viewport changes swap the clamp between 3 and 2 lines as well).
    useEffect(() => {
        const el = ref.current;
        if (!el || expanded) return;
        const measure = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [expanded, text]);

    return (
        <>
            <p
                id={id}
                ref={ref}
                className={`mt-1 text-[13px] leading-relaxed ${expanded ? '' : 'line-clamp-3 lg:line-clamp-2'}`}
            >
                {text}
            </p>
            {(truncated || expanded) && (
                <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setExpanded((v) => !v)}
                    className={`mt-1 self-start text-xs ${inlineLinkClass}`}
                >
                    {expanded ? 'Read less' : 'Read more'}
                </button>
            )}
        </>
    );
}
