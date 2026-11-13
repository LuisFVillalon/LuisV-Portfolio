'use client';

import React, { useEffect, useState } from 'react';
import { TocItem } from '@/app/lib/blogTypes';

/** Slug of the last heading that has scrolled above the sticky navbar. */
function useActiveHeading(items: TocItem[]): string | undefined {
    const [active, setActive] = useState(items[0]?.slug);

    useEffect(() => {
        const onScroll = () => {
            let current = items[0]?.slug;
            for (const item of items) {
                const el = document.getElementById(item.slug);
                if (el && el.getBoundingClientRect().top < 140) current = item.slug;
            }
            setActive(current);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [items]);

    return active;
}

interface PostTocProps {
    items: TocItem[];
    /** Show the h3s of the section being read (sidebar). Off for the compact phone list. */
    showSubsections?: boolean;
}

/** Scroll-spy table of contents: every h2, plus the h3s of the current section only. */
export default function PostToc({ items, showSubsections = true }: PostTocProps): React.ReactElement {
    const active = useActiveHeading(items);

    const sectionOf = new Map<string, string>();
    let currentSection = '';
    items.forEach((item) => {
        if (item.level === 2) currentSection = item.slug;
        sectionOf.set(item.slug, item.level === 2 ? item.slug : currentSection);
    });
    const activeSection = active ? sectionOf.get(active) : undefined;
    const visible = items.filter(
        (item) => item.level === 2 || (showSubsections && sectionOf.get(item.slug) === activeSection),
    );

    return (
        <ol className="space-y-0.5 border-l border-[#0A0A23]/10">
            {visible.map((item) => {
                const isActive = item.slug === active;
                return (
                    <li key={item.slug}>
                        <a
                            href={`#${item.slug}`}
                            aria-current={isActive ? 'location' : undefined}
                            className={`-ml-px block border-l-2 py-1 text-[12.5px] leading-snug transition-colors ${
                                item.level === 3 ? 'pl-6' : 'pl-3'
                            } ${
                                isActive
                                    ? 'border-[#006400] font-bold text-[#0A0A23]'
                                    : 'border-transparent text-[#555560] hover:text-[#0A0A23]'
                            }`}
                        >
                            {item.text}
                        </a>
                    </li>
                );
            })}
        </ol>
    );
}
