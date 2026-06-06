"use client";
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getProjectsByCategory } from '../../lib/projects';
import PanelTemplate from '../../components/Cards/PanelTemplate';
import CTASection from '@/app/components/CTASection';

export default function BackEnd() {
    const projects = getProjectsByCategory('backend');
    return (
      <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
        <Navbar />
        <section className="flex flex-col w-full">
          <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] text-[#333333] border-b border-gray-500">
            <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-[#0A0A23]">Back-End Projects</h1>
            <p className="text-base">
              A collection of personal projects showcasing my skills and growth as a Back-End Developer.
              Click on an image or the link to visit the GitHub repository.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Link href="/projects/">
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
                <i className="ml-[1%] fas fa-arrow-left"></i>
              </button>
            </Link>
          </div>
          <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] grid md:grid-cols-3 md:gap-20 justify-center items-start">
            {projects.map((project, id) => (
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
            ))}
          </div>
        </section>
        <CTASection
          title={"Like What You See?"}
          description={"These projects showcase my approach to problem-solving and full-stack development. If you're interested in building something together or have feedback, let's talk."}
        />
        <Footer />
      </div>
    );
}
