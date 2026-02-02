// Define the prop types for the PanelTemplate component
import Image from 'next/image';
import Link from 'next/link';
import { Github, Smartphone, ExternalLink } from 'lucide-react';

interface PanelTemplateProps {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    live_app: string;
    image: string;
    mobileFriendly: boolean;
}

const PanelTemplate: React.FC<PanelTemplateProps> = ({ 
    title, 
    description, 
    tech, 
    github_repo, 
    live_app, 
    image, 
    mobileFriendly 
}) => {
    if (live_app === "") {
        live_app = github_repo
    }
    
    return (
        <div className="bg-[#EEEEEE] rounded-2xl shadow-2xl border border-2 border-[#0A0A23] overflow-hidden text-[#333333] my-[5%] md:my-[1%] max-w-screen-md w-full border rounded-lg relative">
            {/* Mobile-friendly badge */}
            {mobileFriendly && (
                <div className="opacity-[50%] absolute top-3 right-3 z-10 bg-[#006400] text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                    <Smartphone className="w-3 h-3" />
                    <span className="">Responsive</span>
                </div>
            )}
            
            <a
                href={live_app}
                target="_blank" 
                rel="noopener noreferrer"
                className="block overflow-hidden relative group"
            >
                <Image 
                    className="w-full transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                    src={image}
                    alt="Screenshot."
                    width="300"  // Specify the width and height for optimization
                    height="300"
                />
                {/* Link indicator icon */}
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white p-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                    <ExternalLink className="w-4 h-4" />
                </div>
            </a>
            
            <div className="flex flex-col border-t-2 border-[#333333] p-4 p-[5%]">
                <p className="font-sans font-extrabold text-[#0A0A23] text-lg md:text-xl">{title}</p>
                <p className="text-base break-words">{description}</p>
                <p className="text-base break-words"><strong className="font-sans">Tech:</strong> {tech}</p>
                <div className="grid">
                    <Link className="flex items-center justify-end font-bold text-[#006400] text-xs break-words" href={github_repo}>
                        <Github className="w-3 h-3"/>
                        <p className="font-sans underline">Github Repo</p>
                        <i className="ml-[1%] fas fa-arrow-right"></i>
                    </Link>
                </div>                                          
            </div>
        </div>
    );
};

export default PanelTemplate;