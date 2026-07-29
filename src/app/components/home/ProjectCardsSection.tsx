'use client';

import React from 'react';
import { getProjectsByCategory } from '@/app/lib/projects';
import PanelTemplate from '../Cards/PanelTemplate';
import Link from 'next/link';

const ProjectCards: React.FC = () => {
  const topProjects = getProjectsByCategory('top');

  return (
      <div>
          <Link href="/projects">
              <p className="text-[#0A0A23] text-center font-sans font-bold
                hover:font-black
                hover:cursor-pointer
                hover:underline
                hover:text-[#006400] transition-colors
                text-xl
                mb-4
              ">
                Featured Projects
              </p>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
            {topProjects.map((project, id) => {
              return (
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
              );
            })}
          </div>
    </div>
  );
};

export default ProjectCards;