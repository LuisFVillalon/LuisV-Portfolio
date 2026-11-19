import IntroTile from './IntroTile';
import ProjectTile, { isLiveApp } from './ProjectTile';
import { ExperienceTile, NowTile, StackTile, WritingTile, ContactTile } from './InfoTiles';
import LinkedInSection from './LinkedInSection';
import AskTile from '../chat/AskTile';
import GitHubStatsSection from '../github/GitHubStatsSection';
import { SectionCard } from '../Cards/SectionCard';
import { getProjectsByCategory } from '@/app/lib/projects';
import { MarkdownBlogPost } from '@/app/lib/markdownBlogs';
import { isAssistantConfigured } from '@/app/lib/assistant/config';

interface HomebodyProps {
    posts: MarkdownBlogPost[];
}

export default function Homebody({ posts }: HomebodyProps) {
    // Hero order: the live app first, then award winners, then the rest in projects.ts order
    // (kanso, ROSS, AACE today).
    const featured = getProjectsByCategory('top');
    const orderedProjects = [
        ...featured.filter(isLiveApp),
        ...featured.filter((p) => !isLiveApp(p) && p.award),
        ...featured.filter((p) => !isLiveApp(p) && !p.award),
    ];
    const topProjects = orderedProjects.slice(0, 3);
    const moreProjects = orderedProjects.slice(3);
    const assistant = isAssistantConfigured();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {/* ── Hero: everything a recruiter needs on the first screen ──
                DOM order is the mobile priority order (intro, AI assistant tile, then
                the top three projects). On lg it fits a 1280×800 laptop screen: the
                intro beside the AI tile (only rendered when the assistant is
                configured; the intro spans the row otherwise), then the three
                projects side by side as compact cards. */}
            <section
                className={`grid grid-cols-1 gap-3 pt-4 md:gap-4 md:pt-6 lg:pt-4 ${
                    assistant ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''
                }`}
            >
                <IntroTile />
                <AskTile className="lg:flex lg:flex-col lg:justify-center" />
                <div className="grid min-w-0 grid-cols-1 gap-3 md:gap-4 lg:col-span-full lg:grid-cols-3">
                    {topProjects.map((project) => (
                        <ProjectTile key={project.title} project={project} layout="compact" />
                    ))}
                </div>
            </section>

            {/* Any further featured projects, then the info tiles; on lg the dense grid packs the 1×1 tiles. */}
            <section className="grid grid-cols-1 gap-3 py-3 md:grid-cols-2 md:gap-4 md:py-4 lg:grid-cols-4 lg:grid-flow-dense">
                {moreProjects.map((project) => (
                    <ProjectTile key={project.title} project={project} />
                ))}
                <ExperienceTile />
                <NowTile />
                <StackTile />
                <WritingTile posts={posts} />
                <ContactTile />
            </section>

            {/* ── Deeper dives for anyone who keeps scrolling ── */}
            <section className="flex flex-col gap-6 pb-10 pt-4">
                <SectionCard>
                    <GitHubStatsSection />
                </SectionCard>
                <SectionCard>
                    <LinkedInSection />
                </SectionCard>
            </section>
        </div>
    );
}
