import { Project, applyCategoryOverrides } from '@/app/lib/projects';
import { BentoTile } from '../home/BentoTile';
import ProjectTile, { ProjectLinks, splitTech } from '../home/ProjectTile';
import CompactRow from './CompactRow';
import ShowMoreList from './ShowMoreList';
import { isFeatured } from './projectGroups';

interface GroupHeadingProps {
    id: string;
    title: string;
    count: string;
    blurb: string;
}

/** A full-width section heading that sits in the bento grid between groups. */
function GroupHeading({ id, title, count, blurb }: GroupHeadingProps) {
    return (
        <div id={id} className="scroll-mt-20 pt-4 md:col-span-2 md:pt-6 lg:col-span-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-sans text-xl font-extrabold text-[#0A0A23] md:text-2xl">{title}</h2>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#6e6e78]">{count}</span>
            </div>
            <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-[#333333]">{blurb}</p>
        </div>
    );
}

/** Group tiles: the lead project spans two columns, the rest one each. */
function GroupTiles({ projects }: { projects: Project[] }) {
    return (
        <>
            {projects.map((project, i) => (
                <ProjectTile
                    key={project.title}
                    project={project}
                    featured={i === 0}
                    featuredMark={isFeatured(project)}
                    imageClass={i === 0 ? 'h-[170px] lg:h-[150px]' : 'h-[150px] lg:h-[120px]'}
                    backendLink
                />
            ))}
        </>
    );
}

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export function AiGroup({ tiles, crossListed, count }: { tiles: Project[]; crossListed: Project[]; count: number }) {
    return (
        <>
            <GroupHeading
                id="ai"
                title="AI Applications"
                count={`${count} projects`}
                blurb="Agentic pipelines, LLMs, and retrieval, built into working tools."
            />
            <GroupTiles projects={tiles} />
            {/* Projects whose tile lives under Full-stack get one line here, using their AI-specific overrides. */}
            {crossListed.map((raw) => {
                const project = applyCategoryOverrides(raw, 'ai');
                return (
                    <BentoTile key={`${project.title}-ai`} className="md:col-span-2 lg:col-span-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <p className="text-[13px]">
                                <span className="font-sans font-bold text-[#0A0A23]">{project.title}</span> (featured under
                                Full-stack) also has an AI service: {lowerFirst(project.description)}{' '}
                                <span className="text-xs text-[#6e6e78]">{splitTech(project.tech).slice(0, 3).join(' · ')}</span>
                            </p>
                            <div className="shrink-0">
                                <ProjectLinks project={project} />
                            </div>
                        </div>
                    </BentoTile>
                );
            })}
        </>
    );
}

export function FullstackGroup({ projects, frontendCount }: { projects: Project[]; frontendCount: number }) {
    return (
        <>
            <GroupHeading
                id="fullstack"
                title="Full-stack Applications"
                count={`${projects.length} projects · +${frontendCount} earlier front-end`}
                blurb="A front end I built connected to a back end and database I built, deployed end to end."
            />
            <GroupTiles projects={projects} />
        </>
    );
}

/** The front-end-only projects as a compact list; inside Full-stack it spans 3 columns, on its own the full row. */
export function FrontendList({ projects, standalone = false }: { projects: Project[]; standalone?: boolean }) {
    return (
        <BentoTile
            className={`flex flex-col md:col-span-2 ${standalone ? 'lg:col-span-4' : 'lg:col-span-3'}`}
            label={`Earlier front-end work · ${projects.length}`}
        >
            <span id="frontend" className="absolute -top-20" aria-hidden="true" />
            <ShowMoreList initial={4} className="grid grid-cols-1 gap-x-6 lg:grid-cols-2" noun="more front-end projects">
                {projects.map((project) => (
                    <CompactRow key={project.title} project={project} thumb />
                ))}
            </ShowMoreList>
        </BentoTile>
    );
}

export function AcademicGroup({ projects }: { projects: Project[] }) {
    return (
        <>
            <GroupHeading
                id="academic"
                title="Academic Coursework"
                count={`${projects.length} courses & projects`}
                blurb="University coursework: systems, algorithms, architecture, and object-oriented programming."
            />
            <BentoTile className="md:col-span-2 lg:col-span-4">
                <ul className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                    {projects.map((project) => (
                        <CompactRow key={project.title} project={project} />
                    ))}
                </ul>
            </BentoTile>
        </>
    );
}
