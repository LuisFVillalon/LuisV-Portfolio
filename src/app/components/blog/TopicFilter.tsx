'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BlogTopic } from '@/app/lib/blogTypes';

interface TopicFilterProps {
    topics: BlogTopic[];
    total: number;
    /** Server-rendered rows; any descendant with data-topic="<category>" is filtered. */
    children: React.ReactNode;
}

/** Topic chips that show only the rows whose data-topic matches the selected topic. */
export default function TopicFilter({ topics, total, children }: TopicFilterProps): React.ReactElement {
    const [active, setActive] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.querySelectorAll<HTMLElement>('[data-topic]').forEach((el) => {
            el.style.display = active !== null && el.dataset.topic !== active ? 'none' : '';
        });
    }, [active]);

    const pillClass = (isOn: boolean) =>
        `rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
            isOn
                ? 'border-[#0A0A23] bg-[#0A0A23] text-white'
                : 'border-[#0A0A23]/15 bg-white text-[#0A0A23] hover:border-[#0A0A23]'
        }`;

    return (
        <>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by topic">
                <button type="button" aria-pressed={active === null} className={pillClass(active === null)} onClick={() => setActive(null)}>
                    All · {total}
                </button>
                {topics.map((topic) => (
                    <button
                        key={topic.name}
                        type="button"
                        aria-pressed={active === topic.name}
                        className={pillClass(active === topic.name)}
                        onClick={() => setActive(topic.name)}
                    >
                        {topic.name} · {topic.count}
                    </button>
                ))}
            </div>
            <div ref={listRef}>{children}</div>
        </>
    );
}
