"use client";
import { useState } from "react";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
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

    const ActiveSection = SECTIONS.find(s => s.value === selectedValue)?.Component;

    return (
        <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
            <Navbar />

            <section className="flex flex-col w-full">
                <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] text-[#333333] border-b border-gray-500">
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
                        <h1 className="text-[#0A0A23] font-sans text-3xl md:text-4xl font-extrabold">My Career Path</h1>
                        <a href="/sdsu_luis_villalon_tech_online_resume.pdf" download>
                            <button
                                className="
                                    text-2xl p-2 m-2 rounded-md
                                    text-white shadow-lg
                                    transition-all duration-150
                                    hover:shadow-xl hover:-translate-y-1
                                    border-b-4 border-r-2 border-green-900
                                    active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                                    font-sans
                                "
                                style={{ background: 'linear-gradient(to right, #22c55e, #3b82f6)' }}
                            >
                                <div className="font-bold flex gap-2">
                                    <p>Resume</p>
                                    <Download />
                                </div>
                            </button>
                        </a>
                    </div>

                    <div className="flex flex-col my-[5%] md:my-[1%]">
                        <p className="text-base">
                            This is how I&apos;ve dedicated years to honing my skills, overcoming challenges,
                            and evolving as a developer. Tap the button below to explore my experience!
                        </p>
                        <select
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            className="font-sans mt-[3%] md:mt-[1%] font-bold text-base bg-[#0A0A23] text-[#EEEEEE] w-full rounded-lg py-1 border-2 border-gray-500"
                        >
                            {SECTIONS.map((section) => (
                                <option key={section.value} value={section.value}>{section.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] text-[#333333]">
                    {ActiveSection && <ActiveSection />}
                </div>
            </section>

            <CTASection
                title={"Think I'd Be a Good Fit?"}
                description={"I'm currently looking for internships, projects, and roles where I can contribute and grow as a developer. If my experience aligns with what you need, I'd love to connect."}
            />

            <Footer />
        </div>
    );
}