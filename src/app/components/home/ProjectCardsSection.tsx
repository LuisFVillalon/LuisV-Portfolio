'use client';

import React from 'react';
import { topProjects } from '@/app/lib/projects';
import PanelTemplate from '../Cards/PanelTemplate';
import Link from 'next/link';

// Main Projects Component
const ProjectCards: React.FC = () => {


  return (
      <div className="max-w-7xl mx-auto">
          <Link href="/projects">
              <p className="text-[#0A0A23] text-center font-sans font-bold
                hover:font-black 
                hover:cursor-pointer
                hover:underline
                hover:text-[#006400] transition-colors
                text-xl
                mt-[2%]
                mb-[2%]
              ">
                Projects: Academic & Personal
              </p>
          </Link> 
          <div className=" grid md:grid-cols-3 md:gap-20 justify-center items-start ">
            {topProjects.map((project, id) => {
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
    </div>
  );
};

export default ProjectCards;