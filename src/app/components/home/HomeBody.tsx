import IntroTile from './IntroTile';
import ProjectTile from './ProjectTile';
import { ExperienceTile, NowTile, StackTile, WritingTile, ContactTile } from './InfoTiles';
import LinkedInSection from './LinkedInSection';
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

    return (
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {/* ── Bento: everything a recruiter needs on the first screen ──
                DOM order is the mobile priority order; on lg the dense grid
                packs intro (2×2), the award project (2×1), then two 1×1 projects. */}
            <section className="grid grid-cols-1 gap-3 py-4 md:grid-cols-2 md:gap-4 md:py-6 lg:grid-cols-4 lg:grid-flow-dense">
                <IntroTile />
                {orderedProjects.map((project, i) => (
                    <ProjectTile key={project.title} project={project} featured={i === 0} />
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
