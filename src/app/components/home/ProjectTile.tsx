import Image from 'next/image';
import { Project } from '@/app/lib/projects';
import { BentoTile, inlineLinkClass } from './BentoTile';
import ExpandableDescription from './ExpandableDescription';

/** A project counts as "live" when its live_app is a real deployment rather than its GitHub repo. */
export const isLiveApp = (project: Project) =>
    Boolean(project.live_app && !project.live_app.includes('github.com'));

// Split a tech list on commas that are not inside parentheses,
// so "Claude (Opus 5.5, Haiku 4.5)" stays one item.
export const splitTech = (tech: string) =>
    tech.split(/,\s*(?![^()]*\))/).map((t) => t.trim()).filter(Boolean);

interface ProjectLinksProps {
    project: Project;
    /** Also link a separate back-end repo when the project has one. */
    backendLink?: boolean;
}

/** "Open app ↗" for live deployments, "Code ↗" for the repo, and optionally "Back-end ↗". */
export function ProjectLinks({ project, backendLink = false }: ProjectLinksProps) {
    const live = isLiveApp(project);
    const backend =
        backendLink && project.backend_repo && project.backend_repo !== project.github_repo
            ? project.backend_repo
            : undefined;

    return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {live && (
                <a href={project.live_app} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                    Open app ↗
                </a>
            )}
            <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                Code ↗
            </a>
            {backend && (
                <a href={backend} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                    Back-end ↗
                </a>
            )}
        </div>
    );
}

interface ProjectTileProps {
    project: Project;
    /** Spans two grid columns with a larger title and more tech. */
    featured?: boolean;
    /** Shows a "★ Featured" pill (the Projects page marks every top project). */
    featuredMark?: boolean;
    /** Height classes for the screenshot band; defaults to the homepage sizes. */
    imageClass?: string;
    backendLink?: boolean;
    /**
     * Home hero variants, both sized to fit the first screen on lg:
     * 'row' puts the screenshot beside the text (the lead project across the top)
     * and clamps the description to two lines; 'compact' is a short
     * stacked card (short screenshot band, two-line description on lg, no tech line).
     */
    layout?: 'stacked' | 'row' | 'compact';
    className?: string;
}

export default function ProjectTile({
    project,
    featured = false,
    featuredMark = false,
    imageClass,
    backendLink = false,
    layout = 'stacked',
    className = '',
}: ProjectTileProps) {
    const row = layout === 'row';
    const compact = layout === 'compact';
    const live = isLiveApp(project);
    const tech = splitTech(project.tech).join(' · ');
    const imageHeight =
        imageClass ??
        (row
            ? // Beside the text on lg: full tile height, a fixed share of the width.
              'h-[150px] lg:-mb-5 lg:mr-5 lg:h-auto lg:w-[36%] lg:flex-none lg:border-b-0 lg:border-r'
            : compact
              ? // A short, fixed band on lg so the hero's project row fits a laptop screen.
                'h-[150px] lg:h-[96px]'
              : `h-[150px] ${featured ? 'lg:h-[132px]' : 'lg:h-[92px]'}`);
    const titleSize = row
        ? featured
            ? 'text-xl lg:text-lg'
            : 'text-lg'
        : compact
          ? 'text-lg lg:text-[15px] lg:leading-tight'
          : featured
          ? 'text-xl lg:text-2xl'
          : 'text-lg lg:text-base';

    return (
        <BentoTile className={`flex flex-col ${row ? 'lg:flex-row' : ''} ${featured ? 'md:col-span-2' : ''} ${className}`}>
            <div className={`relative -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-3 border-b border-[#0A0A23]/10 bg-[#F3F3F5] ${imageHeight}`}>
                <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes={
                        row
                            ? '(min-width: 1024px) 220px, (min-width: 768px) 720px, 100vw'
                            : featured
                              ? '(min-width: 768px) 560px, 100vw'
                              : '(min-width: 1024px) 280px, (min-width: 768px) 360px, 100vw'
                    }
                    className="object-cover object-top"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap gap-2">
                    {featuredMark && (
                        <span className="inline-flex items-center rounded-full bg-[#0A0A23] px-2.5 py-1 font-sans text-xs font-bold text-white">
                            ★ Featured
                        </span>
                    )}
                    {project.award && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f1d27a] bg-[#fff6d6] px-2.5 py-1 font-sans text-xs font-bold text-[#7a4b00]">
                            🏆 {project.award.title} · {project.award.event}
                        </span>
                    )}
                    {project.capstone && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c7c9f5] bg-[#eef0ff] px-2.5 py-1 font-sans text-xs font-bold text-[#33368f]">
                            🎓 Capstone{project.capstone.program && ` · ${project.capstone.program}`}
                        </span>
                    )}
                    {live && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9edbb5] bg-[#e6f6ec] px-2.5 py-1 font-sans text-xs font-bold text-[#0c6b33]">
                            <span className="h-[7px] w-[7px] rounded-full bg-[#16a34a]" aria-hidden="true" />
                            Live
                        </span>
                    )}
                </div>

                <h3 className={`mt-2 font-sans font-extrabold leading-snug text-[#0A0A23] ${titleSize}`}>
                    {project.title}
                </h3>
                <ExpandableDescription
                    text={project.description}
                    clamp={row || compact ? 'line-clamp-3 lg:line-clamp-2' : undefined}
                />
                <p className={`mt-2 text-xs text-[#6e6e78] ${compact ? 'lg:hidden' : ''}`}>
                    {tech}
                </p>

                <div className={`mt-auto ${row || compact ? 'pt-3 lg:pt-2' : 'pt-3'}`}>
                    <ProjectLinks project={project} backendLink={backendLink} />
                </div>
            </div>
        </BentoTile>
    );
}
