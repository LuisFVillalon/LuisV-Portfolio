'use client';

import { useSearchParams } from 'next/navigation';
import { BentoTile } from '../home/BentoTile';
import { PROJECT_FILTERS, ProjectFilter as Filter, filterLabel, parseProjectFilter } from './projectFilters';

interface ProjectFilterProps {
    counts: Record<Filter, number>;
    /** Header copy rendered above the chips. */
    intro: React.ReactNode;
    /** What each filter shows; 'all' is the full three-group page. */
    views: Record<Filter, React.ReactNode>;
}

/**
 * The Projects page header and filter chips. Filtering happens in place; the choice is
 * mirrored in ?type= so links (and the old /projects/<category> URLs) can open a filtered view.
 */
export default function ProjectFilter({ counts, intro, views }: ProjectFilterProps) {
    const filter = parseProjectFilter(useSearchParams().getAll('type'));

    const select = (next: Filter) => {
        const url = new URL(window.location.href);
        if (next === 'all') url.searchParams.delete('type');
        else url.searchParams.set('type', next);
        window.history.replaceState(null, '', url);
    };

    return (
        <>
            <BentoTile className="md:col-span-2 lg:col-span-4">
                {intro}
                <div role="group" aria-label="Filter projects" className="mt-4 flex flex-wrap gap-2">
                    {PROJECT_FILTERS.map((f) => {
                        const active = f === filter;
                        return (
                            <button
                                key={f}
                                type="button"
                                aria-pressed={active}
                                onClick={() => select(f)}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e] ${
                                    active
                                        ? 'border-[#0A0A23] bg-[#0A0A23] text-white'
                                        : 'border-[#0A0A23]/15 bg-white text-[#0A0A23] hover:border-[#0A0A23]'
                                }`}
                            >
                                {filterLabel[f]}
                                <span className={active ? 'text-white/70' : 'text-[#6e6e78]'}>{counts[f]}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="sr-only" aria-live="polite">
                    {filter === 'all' ? `Showing all ${counts.all} projects` : `Showing ${counts[filter]} ${filterLabel[filter]} projects`}
                </p>
            </BentoTile>
            {views[filter]}
        </>
    );
}
