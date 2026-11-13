import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ProjectFilter from '../components/projects/ProjectFilter';
import { AcademicGroup, AiGroup, AwardsGroup, FrontendList, FullstackGroup } from '../components/projects/ProjectSections';
import { getProjectGroups } from '../components/projects/projectGroups';

export const dynamic = 'force-dynamic';

export default function ProjectsPage() {
    const { awards, aiTiles, aiCrossListed, fullstack, frontend, academic, counts } = getProjectGroups();

    const ai = <AiGroup tiles={aiTiles} crossListed={aiCrossListed} count={counts.ai} />;
    const academicGroup = <AcademicGroup projects={academic} />;
    const awardsGroup = <AwardsGroup projects={awards} />;

    return (
        <div className="flex min-h-screen flex-col items-center bg-[#F5F5F7] font-[Monospace]">
            <Navbar />
            <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
                {/* With "All" selected: award winners, AI, Full-stack (front-end work as a compact list inside it), then coursework.
                    Any other filter shows only its own group. */}
                <section className="grid grid-cols-1 gap-3 py-4 md:grid-cols-2 md:gap-4 md:py-6 lg:grid-cols-4">
                    <ProjectFilter
                        counts={counts}
                        intro={
                            <>
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e6e78]">Projects</p>
                                <h1 className="mt-1 font-sans text-2xl font-extrabold leading-tight text-[#0A0A23] md:text-3xl">
                                    What I&apos;ve built
                                </h1>
                                <p className="mt-2 text-[13px] leading-relaxed">
                                    {counts.all} projects, award winners first, then AI, Full-stack, and coursework. Featured
                                    work leads each group; open any app or jump straight to the code.
                                </p>
                            </>
                        }
                        views={{
                            all: (
                                <>
                                    {awardsGroup}
                                    {ai}
                                    <FullstackGroup projects={fullstack} frontendCount={frontend.length} />
                                    <FrontendList projects={frontend} />
                                    {academicGroup}
                                </>
                            ),
                            awards: awardsGroup,
                            ai,
                            fullstack: <FullstackGroup projects={fullstack} frontendCount={frontend.length} />,
                            frontend: <FrontendList projects={frontend} standalone />,
                            academic: academicGroup,
                        }}
                    />
                </section>
            </div>
            <Footer />
        </div>
    );
}
