"use client";
import { useState } from "react";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import {CurrentlyDoing, Education, ProfessionalExperience, Certificates} from '../components/Experience';


// app/about/page.js
export default function ExperiencePage() {
    const [selectedValue, setSelectedValue] = useState("currently doing");
    return (

    <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      
      <Navbar />

            <section className="flex flex-col w-full">
              <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] border-b border-gray-500">
                <h1 className="underline underline-offset-2  text-3xl font-extrabold">My Career Path</h1>
                <div className="flex flex-col text-l my-[5%] md:my-[1%] ">
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
              </div>
            </section>

      <Footer />

    </div>        

    );
  }
  