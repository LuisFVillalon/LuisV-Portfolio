import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Wrapper from '../../components/Wrapper';
import Link from 'next/link';
import { getProjectsByCategory, applyCategoryOverrides } from '../../lib/projects';
import PanelTemplate from '../../components/Cards/PanelTemplate';
import CTASection from '@/app/components/CTASection';
import { notFound } from 'next/navigation';

const categoryContent = {
  frontend: {
    category: 'frontend' as const,
    heading: 'Front-End Projects',
    description:
      'A collection of personal projects showcasing my skills and growth as a Front-End Developer. Click on an image for the live application or the link to visit GitHub repository.',
  },
  fullstack: {
    category: 'fullstack' as const,
    heading: 'Full-stack Applications',
    description:
      'A collection of projects pairing a custom front-end with a custom back-end I built and connected myself. Click on an image or the link to visit the GitHub repository.',
  },
  ai: {
    category: 'ai' as const,
    heading: 'AI Applications',
    description:
      'A collection of projects combining agentic pipelines, LLMs, and full-stack engineering. Click on an image or the link to visit the GitHub repository.',
  },
  academic: {
    category: 'academic' as const,
    heading: 'Academic Coursework',
    description:
      'A collection of my academic projects showcasing my skills and growth as a well-rounded software engineer. Click on an image or the link to visit the GitHub repository.',
  },
};

export type ProjectCategory = keyof typeof categoryContent;

export function generateStaticParams() {
  return Object.keys(categoryContent).map((category) => ({ category }));
}

export default async function ProjectCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const content = categoryContent[category as ProjectCategory];

  if (!content) {
    notFound();
  }

  const projects = getProjectsByCategory(content.category);

  return (
    <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <Wrapper>
        <section className="flex flex-col gap-6 py-8 md:py-12">

          {/* ── Title ── */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {/* ── Back to all projects ── */}
            <Link href="/projects/" className="shrink-0">
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
                <i className="ml-[1%] fas fa-arrow-left"></i>
              </button>
            </Link>

            <div className="text-center md:text-left">
              <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-[#0A0A23]">{content.heading}</h1>
              <p className="mt-2 text-base md:text-lg text-[#B3B3B3] font-sans font-bold">
                {content.description}
              </p>
            </div>
          </div>

          {/* ── Project grid ── */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
            {projects.map((rawProject, id) => {
              const project = applyCategoryOverrides(rawProject, content.category);
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

        </section>

        <CTASection
          title={"Like What You See?"}
          description={"These projects showcase my approach to problem-solving and full-stack development. If you're interested in building something together or have feedback, let's talk."}
        />
      </Wrapper>
      <Footer />
    </div>
  );
}
