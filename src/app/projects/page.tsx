"use client";
import Navbar from '../components/NavBar';
import Wrapper from '../components/Wrapper';
import Footer from '../components/Footer';
import Link from 'next/link';
import CTASection from '../components/CTASection';
import { getProjectsByCategory } from '@/app/lib/projects';
import PanelTemplate from '../components/Cards/PanelTemplate';
import { SectionCard } from '../components/Cards/SectionCard';

const categoryButtonClass = `
    text-2xl p-2 rounded-md
    text-white font-extrabold shadow-lg
    transition-all duration-150
    hover:shadow-xl hover:-translate-y-1
    border-b-4 border-r-2 border-green-900
    active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
    font-sans
`;

const categoryButtonStyle = {
    background: 'linear-gradient(to right, #22c55e, #3b82f6)'
};

export default function Projects() {
    const topProjects = getProjectsByCategory('top');

    return (

    <div className=" font-[Monospace] flex flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">

        <Navbar />
        <Wrapper>
            <section className="flex flex-col gap-6 py-8 md:py-12">

                {/* ── Title ── */}
                <div className="text-center md:text-left">
                    <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-[#0A0A23]">Project Gallery</h1>
                    <p className="mt-2 text-base md:text-lg text-[#B3B3B3] font-sans font-bold">
                        Personal and academic projects, coursework, and live applications
                    </p>
                </div>

                {/* ── Category picker ── */}
                <SectionCard>
                    <p className="text-base md:text-lg text-[#333333] leading-relaxed mb-6">
                        Explore my work by category, or browse the featured projects below.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2">
                        <Link href="/projects/frontend">
                            <button className={categoryButtonClass} style={categoryButtonStyle}>
                                Front-end Applications
                            </button>
                        </Link>
                        <Link href="/projects/fullstack">
                            <button className={categoryButtonClass} style={categoryButtonStyle}>
                                Full-stack Applications
                            </button>
                        </Link>
                        <Link href="/projects/ai">
                            <button className={categoryButtonClass} style={categoryButtonStyle}>
                                AI Applications
                            </button>
                        </Link>
                        <Link href="/projects/academic">
                            <button className={categoryButtonClass} style={categoryButtonStyle}>
                                Academic Coursework
                            </button>
                        </Link>
                    </div>
                </SectionCard>

                {/* ── Featured projects ── */}
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
                    {topProjects.map((project, id) => (
                        <div key={id} className="w-full sm:w-[340px]">
                            <PanelTemplate
                                title={project.title}
                                description={project.description}
                                tech={project.tech}
                                github_repo={project.github_repo}
                                frontend_repo={project.frontend_repo}
                                backend_repo={project.backend_repo}
                                live_app={project.live_app}
                                image={project.image}
                                mobileFriendly={project.mobileFriendly}
                            />
                        </div>
                    ))}
                </div>

            </section>
            <CTASection
              title={"Like What You See?"}
              description={"These projects showcase my approach to problem-solving and full-stack development. If you’re interested in building something together or have feedback, let’s talk."}
            />
        </Wrapper>
        <Footer />

    </div>

    );
  }
  