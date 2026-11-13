'use client';

import React, { useEffect, useState } from 'react';

/** Thin gradient bar pinned to the top of the viewport showing how far through the page the reader is. */
export default function ReadingProgress(): React.ReactElement {
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setPercent(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div className="fixed left-0 top-0 z-[60] h-1 w-full" aria-hidden>
            <div className="h-full bg-[linear-gradient(to_right,#22c55e,#3b82f6)]" style={{ width: `${percent}%` }} />
        </div>
    );
}
