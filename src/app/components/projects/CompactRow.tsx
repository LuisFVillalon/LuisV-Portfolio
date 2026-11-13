import Image from 'next/image';
import { Project } from '@/app/lib/projects';
import ExpandableDescription from '../home/ExpandableDescription';
import { ProjectLinks, isLiveApp, splitTech } from '../home/ProjectTile';

interface CompactRowProps {
    project: Project;
    /** Show a small screenshot thumbnail (off for coursework, whose images are README captures). */
    thumb?: boolean;
}

/** One dense line per project, for the long tail: earlier front-end work and coursework. */
export default function CompactRow({ project, thumb = false }: CompactRowProps) {
    const tech = splitTech(project.tech).slice(0, 4).join(' · ');

    return (
        <li className="flex min-w-0 gap-3 border-b border-[#0A0A23]/10 py-3 last:border-b-0">
            {thumb && (
                <div className="relative mt-0.5 h-[44px] w-[64px] shrink-0 overflow-hidden rounded-md border border-[#0A0A23]/10 bg-[#F3F3F5]">
                    <Image src={project.image} alt="" fill sizes="64px" className="object-cover object-top" />
                </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h4 className="font-sans text-sm font-extrabold text-[#0A0A23]">{project.title}</h4>
                    {project.award && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#f1d27a] bg-[#fff6d6] px-2 py-px font-sans text-[11px] font-bold text-[#7a4b00]">
                            🏆 {project.award.title} · {project.award.event}
                        </span>
                    )}
                    {isLiveApp(project) && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0c6b33]">
                            <span className="h-[6px] w-[6px] rounded-full bg-[#16a34a]" aria-hidden="true" />
                            Live
                        </span>
                    )}
                </div>
                <ExpandableDescription text={project.description} clamp="line-clamp-2" className="mt-0.5" />
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-xs text-[#6e6e78]">{tech}</p>
                    <ProjectLinks project={project} backendLink />
                </div>
            </div>
        </li>
    );
}
