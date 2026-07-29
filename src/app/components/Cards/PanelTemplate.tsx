import Image from 'next/image';
import Link from 'next/link';
import { Github, Smartphone, ExternalLink } from 'lucide-react';

interface PanelTemplateProps {
    title: string;
    description: string;
    tech: string;
    github_repo: string;
    frontend_repo?: string;
    backend_repo?: string;
    live_app?: string;
    image: string;
    mobileFriendly: boolean;
}

const PanelTemplate: React.FC<PanelTemplateProps> = ({
    title,
    description,
    tech,
    github_repo,
    frontend_repo,
    backend_repo,
    live_app,
    image,
    mobileFriendly
}) => {
    const appUrl = live_app || github_repo;
    const hasSplitRepos = Boolean(frontend_repo && backend_repo);

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-[#0A0A23]/10 overflow-hidden text-[#333333] w-full h-full relative flex flex-col transition-shadow duration-300">
            {mobileFriendly && (
                <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur text-[#006400] px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-sm border border-[#006400]/20">
                    <Smartphone className="w-3 h-3" />
                    <span>Responsive</span>
                </div>
            )}
            <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden relative"
            >
                <Image
                    className="w-full h-40 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    src={image}
                    alt={`${title} screenshot`}
                    width="400"
                    height="225"
                />
                <div className="absolute inset-0 bg-[#0A0A23]/0 group-hover:bg-[#0A0A23]/10 transition-colors duration-300" />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-[#006400] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                    <ExternalLink className="w-4 h-4" />
                </div>
            </a>
            <div className="flex flex-col gap-2 p-5 flex-1">
                <p className="font-sans font-bold text-[#0A0A23] text-lg group-hover:text-[#006400] transition-colors">{title}</p>
                <p className="text-sm text-[#333333]/80 leading-relaxed break-words">{description}</p>
                <p className="text-xs text-[#333333]/60 break-words"><span className="font-sans font-semibold text-[#333333]/80">Tech:</span> {tech}</p>
                <div className="mt-auto pt-3 flex flex-col gap-1.5 border-t border-[#0A0A23]/10">
                    {hasSplitRepos ? (
                        <div className="flex items-center justify-between">
                            <Link className="flex items-center gap-1.5 font-medium text-[#333333]/70 hover:text-[#006400] text-xs transition-colors" href={frontend_repo!} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3.5 h-3.5"/>
                                <span className="font-sans">Frontend Repo</span>
                            </Link>
                            <Link className="flex items-center gap-1.5 font-medium text-[#333333]/70 hover:text-[#006400] text-xs transition-colors" href={backend_repo!} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3.5 h-3.5"/>
                                <span className="font-sans">Backend Repo</span>
                            </Link>
                        </div>
                    ) : (
                        <Link className="flex items-center justify-end gap-1.5 font-medium text-[#333333]/70 hover:text-[#006400] text-xs transition-colors" href={github_repo} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3.5 h-3.5"/>
                            <span className="font-sans">Github Repo</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PanelTemplate;
