"use client";
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Wrapper from '@/app/components/Wrapper';
import {projectsFrontEnd} from '../../lib/projects';
import PanelTemplate from '../../components/Cards/PanelTemplate';
import CTASection from '@/app/components/home/CTASection';
    
export default function FrontEnd() {
    return (

      <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
        
        <Navbar />
        <Wrapper>
          <section className="flex flex-col w-full">
          <div className= "mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] border-b border-gray-500">
            <h1 className="dm-serif-text-regular text-2xl md:text-3xl font-extrabold text-[#0A0A23]">Front-End Projects</h1>
            <p className="text-base">
              A collection of personal projects showcasing my skills and growth as a Front-End Developer. 
              Click on an image for the live application or the link to visit GitHub repository.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Link className="" href="/projects/">
              <button
                className="
                  text-2xl p-2 m-2 rounded-md
                  text-white shadow-lg
                  transition-all duration-150
                  hover:shadow-xl hover:-translate-y-1
                  border-b-4 border-r-2 border-green-900
                  active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                  dm-serif-text-regular
                "
                style={{ 
                  background: 'linear-gradient(to right, #22c55e, #3b82f6)'
                }}
              >
                <i className="ml-[1%] fas fa-arrow-left"></i>
              </button>
            </Link>
          </div>
          <div className=" my-[5%] md:my-[1%] grid md:grid-cols-3 md:gap-20 justify-center items-start ">
            {projectsFrontEnd.map((project, id) => {
              return (
                <PanelTemplate
                  key={id}
                  title={project.title} 
                  description={project.description}
                  tech={project.tech}
                  github_repo={project.github_repo} 
                  live_app={project.live_app}
                  image={project.image}
                  mobileFriendly={project.mobileFriendly}
                />
              );
            })}
          </div>
          </section>
          <CTASection/>
        </Wrapper>
        <Footer />

      </div>        

    );
  }