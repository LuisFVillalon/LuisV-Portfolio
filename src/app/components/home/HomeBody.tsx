import IntroTile from './IntroTile';
import ProjectTile from './ProjectTile';
import { ExperienceTile, NowTile, StackTile, WritingTile, ContactTile } from './InfoTiles';
import LinkedInSection from './LinkedInSection';
import AskTile from '../chat/AskTile';
import GitHubStatsSection from '../github/GitHubStatsSection';
import { SectionCard } from '../Cards/SectionCard';
import { getProjectsByCategory } from '@/app/lib/projects';
import { MarkdownBlogPost } from '@/app/lib/markdownBlogs';

interface HomebodyProps {
    posts: MarkdownBlogPost[];
}

export default function Homebody({ posts }: HomebodyProps) {
    // Award-winning featured projects lead; the rest keep their order in projects.ts.
    const featured = getProjectsByCategory('top');
    const orderedProjects = [...featured.filter((p) => p.award), ...featured.filter((p) => !p.award)];
    const topProjects = orderedProjects.slice(0, 3);
    const moreProjects = orderedProjects.slice(3);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {/* ── Hero: everything a recruiter needs on the first screen ──
                DOM order is the mobile priority order (intro, AI assistant tile,
                then the top three projects). On lg it splits into two columns that
                fit a 1280×800 laptop screen: intro above the AI tile (only rendered
                when the assistant is configured) on the left, and a pyramid of
                projects on the right: the lead project across the top, the next
                two side by side beneath it as compact cards. */}
            <section className="grid grid-cols-1 gap-3 pt-4 md:gap-4 md:pt-6 lg:grid-cols-2 lg:pt-4">
                <div className="flex min-w-0 flex-col gap-3 md:gap-4">
                    <IntroTile />
                    <AskTile />
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-rows-[auto_1fr]">
                    {topProjects.map((project, i) => (
                        <ProjectTile
                            key={project.title}
                            project={project}
                            featured={i === 0}
                            layout={i === 0 ? 'row' : 'compact'}
                        />
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
