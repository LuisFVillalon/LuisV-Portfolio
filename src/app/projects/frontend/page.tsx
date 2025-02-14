"use client";
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Link from 'next/link';
//import Image from 'next/image';
import {projectsFrontEnd} from '../../lib/projects';
import PanelTemplate from '../../components/PanelTemplate';
    
export default function FrontEnd() {
    return (

      <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
        
        <Navbar />
        <section className="flex flex-col w-full">
          <div className= "mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] border-b border-gray-500">
            <h1 className="text-3xl font-extrabold text-[#0A0A23]">Front-End Projects</h1>
            <p className="text-base">
              A collection of personal projects showcasing my skills and growth as a Front-End Developer. 
              Click on an image for the live application or the link to visit GitHub repository.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Link className="" href="/projects/">
              <button className= "text-xl text-[#0a0a23] p-[15%] md:p-[15%] bg-[#EEEEEE] rounded-lg border border-4 border-[#0A0A23] shadow-lg">
                  Back
              </button>
            </Link>
          </div>
          <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] grid md:grid-cols-3 md:gap-20 justify-center items-start ">
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
                />
              );
            })}
          </div>
        </section>
        <Footer />

      </div>        

    );
  }