"use client";
import Navbar from '../components/NavBar';
import Wrapper from '../components/Wrapper';
import Footer from '../components/Footer';
import Link from 'next/link';
import CTASection from '../components/CTASection';

export default function Projects() {
    return (

    <div className=" font-[Monospace] flex flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      
        <Navbar />
        <Wrapper>
            <section className="flex flex-col w-full">
                <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] border-b border-gray-500">
                        <h1 className="font-sans text-left text-3xl md:text-3xl font-extrabold text-[#0A0A23]">Project Gallery</h1>
                        <p className="text-base text-[#333333]">
                            Explore my personal and academic projects, including coursework and live applications. 
                            Use the buttons below to browse my code and demos organized by category.
                        </p>
                        <div className="flex flex-col md:flex-row  justify-center md:justify-evenly items-center space-y-[10%] md:space-y-[0%] 
                            md:space-x-[0%] text-[#0A0A23] my-[10%] md:my-[2%]"
                        >
                            <Link className="" href="/projects/frontend">
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
                                    style={{ 
                                        background: 'linear-gradient(to right, #22c55e, #3b82f6)'
                                    }}
                                >
                                    Front-end Applications
                                </button>
                            </Link>
                            <Link className="" href="/projects/backend">
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
                                    style={{ 
                                        background: 'linear-gradient(to right, #22c55e, #3b82f6)'
                                    }}
                                >
                                    Back-end Applications
                                </button>
                            </Link>
                            <Link className="" href="/projects/academic">
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
                                style={{ 
                                    background: 'linear-gradient(to right, #22c55e, #3b82f6)'
                                }}
                                >
                                    Academic Coursework
                                </button>
                            </Link>
                        </div>
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
  