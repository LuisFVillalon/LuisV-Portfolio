import Image from 'next/image';
import { Project } from '@/app/lib/projects';
import { BentoTile, inlineLinkClass } from './BentoTile';

/** A project counts as "live" when its live_app is a real deployment rather than its GitHub repo. */
export const isLiveApp = (project: Project) =>
    Boolean(project.live_app && !project.live_app.includes('github.com'));

// Split a tech list on commas that are not inside parentheses,
// so "Claude (Opus 5.5, Haiku 4.5)" stays one item.
const splitTech = (tech: string) =>
    tech.split(/,\s*(?![^()]*\))/).map((t) => t.trim()).filter(Boolean);

interface ProjectTileProps {
    project: Project;
    featured?: boolean;
}

export default function ProjectTile({ project, featured = false }: ProjectTileProps) {
    const live = isLiveApp(project);
    const tech = splitTech(project.tech).slice(0, featured ? 4 : 3).join(' · ');

    return (
        <BentoTile className={`flex flex-col ${featured ? 'md:col-span-2' : ''}`}>
            <div className={`relative -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-3 border-b border-[#0A0A23]/10 bg-[#F3F3F5] h-[150px] ${featured ? 'lg:h-[132px]' : 'lg:h-[92px]'}`}>
                <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes={featured ? '(min-width: 768px) 560px, 100vw' : '(min-width: 1024px) 280px, (min-width: 768px) 360px, 100vw'}
                    className="object-cover object-top"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {project.award && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f1d27a] bg-[#fff6d6] px-2.5 py-1 font-sans text-xs font-bold text-[#7a4b00]">
                        🏆 {project.award.title} · {project.award.event}
                    </span>
                )}
                {live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9edbb5] bg-[#e6f6ec] px-2.5 py-1 font-sans text-xs font-bold text-[#0c6b33]">
                        <span className="h-[7px] w-[7px] rounded-full bg-[#16a34a]" aria-hidden="true" />
                        Live
                    </span>
                )}
            </div>

            <h3 className={`mt-2 font-sans font-extrabold leading-snug text-[#0A0A23] ${featured ? 'text-xl lg:text-2xl' : 'text-lg lg:text-base'}`}>
                {project.title}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed line-clamp-3 lg:line-clamp-2">{project.description}</p>
            {project.outcome && (
                <p className="mt-2 border-l-[3px] border-[#22c55e] bg-[#f4fbf6] px-3 py-1.5 text-[13px]">
                    <span className="font-sans font-bold text-[#0A0A23]">Outcome:</span> {project.outcome}
                </p>
            )}
            <p className="mt-2 text-xs text-[#6e6e78]">{tech}</p>

            <div className="mt-auto flex gap-4 pt-3 text-xs">
                {live && (
                    <a href={project.live_app} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                        Open app ↗
                    </a>
                )}
                <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                    Code ↗
                </a>
            </div>
        </BentoTile>
    );
}
