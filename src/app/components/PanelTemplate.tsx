// Define the prop types for the PanelTemplate component
import Image from 'next/image';


interface PanelTemplateProps {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    live_app: string;
    image: string
  }
  
  const PanelTemplate: React.FC<PanelTemplateProps> = ({ title, description, tech, github_repo, live_app, image }) => {
    if (live_app === "") {
      live_app = github_repo
    }
    return (
      <div className="bg-[#EEEEEE] rounded shadow-lg overflow-hidden text-[#333333] mx-auto md:mx-8 my-[5%] md:my-[1%] max-w-screen-md w-full border border-4 border-[#0A0A23]">
        <a  
            href={live_app}
            target="_blank" 
            rel="noopener noreferrer"
        >
            <Image 
                className="w-full"
                src={image}
                alt="Screenshot."
                width="300"  // Specify the width and height for optimization
                height="300"
            />
        </a>
        <div className="border-t-4 border-[#333333] p-4 p-[5%]">
            <p className="font-extrabold text-[#0A0A23] text-xl">{title}</p>
            <p className="text-base break-words">{description}</p>
            <p className="text-base break-words"><strong>Tech:</strong> {tech}</p>
            <a className="underline" 
                href={github_repo}
                target="_blank" 
                rel="noopener noreferrer"
            >
                <p className="flex  items-center justify-end font-bold text-[#006400] text-base break-words">Go to repo <i className="ml-[1%] fas fa-arrow-right"></i></p>
            </a>
        </div>
      </div>
    );
  };
  
  
  export default PanelTemplate;
  