import Link from 'next/link';
import { FileDown, Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT_EMAIL, GITHUB_URL } from '../lib/contact';
import { resume } from '../lib/experience';
import { linkedinProfileUrl } from '../lib/linkedinPosts';

const pageLinks = [
    { href: '/about', label: 'About' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

const linkClass = 'font-bold text-[#333333] transition-colors hover:text-[#006400] hover:underline underline-offset-4';

const channelClass = `inline-flex items-center gap-1.5 font-bold text-[#333333] transition-colors
    hover:text-[#006400] hover:underline underline-offset-4`;

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto w-full border-t border-[#0A0A23]/10 bg-[#F5F5F7] font-[Monospace] text-[#333333]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-xs md:px-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <p className="font-sans text-sm font-extrabold text-[#0A0A23]">Luis Villalon</p>
                    <p className="text-[#6e6e78]">Early Career New Grad SWE</p>
                </div>

                <nav aria-label="Footer">
                    <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {pageLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link href={href} className={linkClass}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                    <li>
                        <a href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer" className={channelClass}>
                            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                            LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={channelClass}>
                            <Github className="h-3.5 w-3.5" aria-hidden="true" />
                            GitHub
                        </a>
                    </li>
                    <li>
                        <a href={`mailto:${CONTACT_EMAIL}`} className={channelClass}>
                            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                            Email
                        </a>
                    </li>
                    <li>
                        <a href={resume} target="_blank" rel="noopener noreferrer" className={channelClass}>
                            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                            Résumé
                        </a>
                    </li>
                </ul>

                <p className="text-[#6e6e78] lg:text-right">© {year} Luis Villalon</p>
            </div>
        </footer>
    );
}
