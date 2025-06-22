"use client";
import { useState } from "react";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import {CurrentlyDoing, Education, 
    ProfessionalExperience, Certificates, 
    TechTools, ExperienceBeyondTech} from '../components/experience/ExperienceComponents';
import { Download } from "lucide-react";
import CTASection from "../components/home/CTASection";

export default function ExperiencePage() {
    const [selectedValue, setSelectedValue] = useState("currently doing");
    return (

    <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
            <section className="flex flex-col w-full">
              <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] border-b border-gray-500">
                <div className="flex flex-col md:flex-row justify-center md:justify-between  items-center">
                  <h1 className="text-[#0A0A23] dm-serif-text-regular text-3xl md:text-4xl font-extrabold">My Career Path</h1>
                  <a href="/luis_fernando_villalon_professional_resume.pdf" download>
                    <button className="text-xl md:text-2xl p-2 m-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-[#ffffff] shadow-lg transform active:scale-95 
                        active:shadow-md transition-all duration-150 hover:shadow-xl hover:-translate-y-1 border-b-4 border-r-2 border-[#004d00] 
                        active:border-b-2 active:translate-y-1"
                    >
                      <div className="font-bold flex gap-2">
                        <p>Resume</p>
                        <Download/>
                      </div>
                    </button>                  
                  </a>
                </div>
                <div className="flex flex-col my-[5%] md:my-[1%] ">
                    <p className="text-base">This is how I&apos;ve dedicated years to honing my skills, overcoming challenges, 
                        and evolving as a developer. Tap the button below to explore my experience! 
                    </p>
                    <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} 
                        className="mt-[3%] md:mt-[1%] font-bold text-base bg-[#0A0A23] text-[#EEEEEE] w-full rounded-lg py-1 border-2 border-gray-500"
                    >
                        <option value="currently doing">Currently Doing</option>
                        <option value="professional experience">Professional Experience</option>
                        <option value="education">Education</option>
                        <option value="certificates">Certificates</option>
                        <option value="tech tools">Tech Tools</option>                        
                        <option value="experience beyond tech">Experience Beyond Tech</option>                        
                    </select>
                </div>
              </div>
              <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] ">
                {selectedValue === "currently doing" && <CurrentlyDoing />}
                {selectedValue === "education" && <Education />}
                {selectedValue === "professional experience" && <ProfessionalExperience />}
                {selectedValue === "certificates" && <Certificates />}
                {selectedValue === "tech tools" && <TechTools />}
                {selectedValue === "experience beyond tech" && <ExperienceBeyondTech />}
              </div>
            </section>
            <CTASection/>
      <Footer />

    </div>        

    );
  }
  