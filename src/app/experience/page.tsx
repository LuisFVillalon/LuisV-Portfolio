"use client";
import { useState } from "react";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Wrapper from '../components/Wrapper';
import {
    CurrentlyDoing,
    Leadership,
    ProfessionalExperience,
    Education,
    Certificates,
    TechTools,
    ExperienceBeyondTech,
} from '../components/experience/ExperienceComponents';
import { Download } from "lucide-react";
import CTASection from "../components/CTASection";
import { SectionCard, SectionHeading } from "../components/Cards/SectionCard";

const SECTIONS = [
    { value: "currently doing",         label: "Currently Doing",          Component: CurrentlyDoing },
    { value: "education",               label: "Education",                Component: Education },
    { value: "tech tools",              label: "Tech Tools",               Component: TechTools },
    { value: "professional experience", label: "Professional Experience",  Component: ProfessionalExperience },
    { value: "leadership",              label: "Leadership",               Component: Leadership },
    { value: "certificates",            label: "Certificates",             Component: Certificates },
    { value: "experience beyond tech",  label: "Experience Beyond Tech",   Component: ExperienceBeyondTech },
];

export default function ExperiencePage() {
    const [selectedValue, setSelectedValue] = useState("currently doing");

    const activeSection = SECTIONS.find(s => s.value === selectedValue);
    const ActiveSection = activeSection?.Component;

    return (
        <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
            <Navbar />

            <Wrapper>
                <section className="flex flex-col gap-6 py-8 md:py-12">

                    {/* ── Title ── */}
                    <div className="text-center md:text-left">
                        <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-[#0A0A23]">Career Path</h1>
                        <p className="mt-2 text-base md:text-lg text-[#B3B3B3] font-sans font-bold">
                        Where I&apos;ve been and where I&apos;m headed
                        </p>
                    </div>

                    {/* ── Overview + section picker ── */}
                    <SectionCard>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-base md:text-lg text-[#333333] leading-relaxed">
                                This is how I&apos;ve dedicated years to honing my skills, overcoming challenges,
                                and evolving as a developer. Pick a category below to explore my experience!
                            </p>
                            <div className="flex flex-col gap-3 shrink-0">
                                <a href="/resumes/Fullstack_Software_Engineering_Luis_Villalon_Resume.pdf" download>
                                    <button
                                        className="
                                            text-xl p-2 rounded-md
                                            text-white shadow-lg
                                            transition-all duration-150
                                            hover:shadow-xl hover:-translate-y-1
                                            border-b-4 border-r-2 border-green-900
                                            active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                                            font-sans
                                        "
                                        style={{ background: 'linear-gradient(to right, #22c55e, #3b82f6)' }}
                                    >
                                        <div className="font-bold flex items-center gap-2">
                                            <p>Fullstack Resume</p>
                                            <Download className="w-5 h-5" />
                                        </div>
                                    </button>
                                </a>
                                <a href="/resumes/AI_LLM_Luis_Villalon_Resume.pdf" download>
                                    <button
                                        className="
                                            text-xl p-2 rounded-md
                                            text-white shadow-lg
                                            transition-all duration-150
                                            hover:shadow-xl hover:-translate-y-1
                                            border-b-4 border-r-2 border-green-900
                                            active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                                            font-sans
                                        "
                                        style={{ background: 'linear-gradient(to right, #22c55e, #3b82f6)' }}
                                    >
                                        <div className="font-bold flex items-center gap-2">
                                            <p>AI/LLM Resume</p>
                                            <Download className="w-5 h-5" />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                            {SECTIONS.map((section) => {
                                const isActive = selectedValue === section.value;
                                return (
                                    <button
                                        key={section.value}
                                        onClick={() => setSelectedValue(section.value)}
                                        className={`font-sans text-sm md:text-base font-bold rounded-full px-4 py-2 transition-all duration-150 ${
                                            isActive
                                                ? "text-white shadow-lg border-b-4 border-r-2 border-green-900 hover:shadow-xl hover:-translate-y-1 active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1"
                                                : "bg-white text-[#0A0A23] border-2 border-[#0A0A23]/20 hover:border-[#0A0A23]/60 hover:-translate-y-1"
                                        }`}
                                        style={isActive ? { background: 'linear-gradient(to right, #22c55e, #3b82f6)' } : undefined}
                                    >
                                        {section.label}
                                    </button>
                                );
                            })}
                        </div>
                    </SectionCard>

                    {/* ── Active section content ── */}
                    <SectionCard>
                        <SectionHeading>{activeSection?.label}</SectionHeading>
                        <div className="text-[#333333]">
                            {ActiveSection && <ActiveSection />}
                        </div>
                    </SectionCard>

                </section>

                <CTASection
                    title={"Think I'd Be a Good Fit?"}
                    description={"I'm currently looking for internships, projects, and roles where I can contribute and grow as a developer. If my experience aligns with what you need, I'd love to connect."}
                />
            </Wrapper>

            <Footer />
        </div>
    );
}
