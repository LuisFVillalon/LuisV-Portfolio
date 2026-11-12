import Link from 'next/link';
import { professionalExperience, currentlyDoing, techTools, resume } from '@/app/lib/experience';
import { linkedinProfileUrl } from '@/app/lib/linkedinPosts';
import { MarkdownBlogPost } from '@/app/lib/markdownBlogs';
import { BentoTile, primaryButtonClass } from './BentoTile';

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim();

// "Undergraduate Researcher: Adversarial Attacks…" -> "Undergraduate Researcher"
const shortPosition = (position: string) => tidy(position.split(':')[0]);
// "Calexico Neighborhood House – Mission Thrift Store…" -> "Calexico Neighborhood House"
const shortCompany = (company: string) => tidy(company.split(' – ')[0]);

export function ExperienceTile() {
    const years = professionalExperience.flatMap((role) => (role.time.match(/\d{4}/g) ?? []).map(Number));
    const since = years.length ? ` since ${Math.min(...years)}` : '';

    return (
        <BentoTile
            className="md:col-span-2"
            label={`Experience · ${professionalExperience.length} roles${since}`}
            more={{ href: '/experience', text: 'All experience →' }}
        >
            <ul>
                {professionalExperience.map((role) => (
                    <li
                        key={`${role.company}-${role.time}`}
                        className="flex justify-between gap-3 border-b border-[#0A0A23]/10 py-2 text-[13px] last:border-b-0"
                    >
                        <span className="min-w-0">
                            <span className="font-sans font-bold text-[#0A0A23]">{shortCompany(role.company)}</span>
                            {' · '}
                            {shortPosition(role.position)}
                        </span>
                        <span className="shrink-0 whitespace-nowrap text-xs text-[#6e6e78]">{tidy(role.time)}</span>
                    </li>
                ))}
            </ul>
        </BentoTile>
    );
}

export function NowTile() {
    return (
        <BentoTile label="Now">
            <ul className="list-disc space-y-2 pl-4 text-[13px]">
                {currentlyDoing.map((item) => (
                    <li key={`${item.company}-${item.position}`}>
                        <span className="font-sans font-bold text-[#0A0A23]">{tidy(item.company)}</span>
                        {', '}
                        {tidy(item.position)}
                        <span className="text-xs text-[#6e6e78]"> · {tidy(item.time)}</span>
                    </li>
                ))}
            </ul>
        </BentoTile>
    );
}

// Non-engineering groups are left off the homepage stack tile.
const HIDDEN_STACK_SUBJECTS = new Set(['Version Control & Project Management', 'Digital Marketing']);

export function StackTile() {
    const tools = techTools
        .filter((group) => !HIDDEN_STACK_SUBJECTS.has(group.subject))
        .flatMap((group) => group.tools);

    return (
        <BentoTile label="Stack">
            <div className="flex flex-wrap gap-1.5">
                {tools.map(({ tool, link }) => (
                    <a
                        key={tool}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#F3F3F5] px-2 py-0.5 text-xs text-[#0A0A23] hover:bg-[#0A0A23] hover:text-white transition-colors"
                    >
                        {tool}
                    </a>
                ))}
            </div>
        </BentoTile>
    );
}

const formatMonth = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function WritingTile({ posts }: { posts: MarkdownBlogPost[] }) {
    if (posts.length === 0) return null;

    return (
        <BentoTile className="md:col-span-2" label="Writing" more={{ href: '/blog', text: 'All posts →' }}>
            {posts.slice(0, 2).map((post) => (
                <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group block border-b border-[#0A0A23]/10 py-2 last:border-b-0"
                >
                    <p className="font-sans text-sm font-bold leading-snug text-[#0A0A23] group-hover:text-[#006400] group-hover:underline">
                        {post.title}
                    </p>
                    <p className="text-xs text-[#6e6e78]">
                        {formatMonth(post.date)}
                        {post.readTime ? ` · ${post.readTime}` : ''}
                    </p>
                </Link>
            ))}
        </BentoTile>
    );
}

const outlineLightButtonClass = `inline-flex items-center rounded-lg px-3.5 py-2 font-sans text-sm font-bold
    border-2 border-white/70 text-white transition-colors hover:bg-white hover:text-[#0A0A23]`;

export function ContactTile() {
    return (
        <div className="md:col-span-2 min-w-0 rounded-2xl bg-[#0A0A23] bg-[linear-gradient(to_bottom_right,#0A0A23,#1d2a6b)] p-4 md:p-5 text-white">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#aab]">Get in touch</p>
            <h2 className="mb-4 font-sans text-lg font-extrabold">Hiring a new-grad software engineer?</h2>
            <div className="flex flex-wrap gap-2">
                <Link href="/contact" className={primaryButtonClass}>
                    Contact me
                </Link>
                <a href={resume} target="_blank" rel="noopener noreferrer" className={outlineLightButtonClass}>
                    Résumé
                </a>
                <a href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer" className={outlineLightButtonClass}>
                    LinkedIn
                </a>
            </div>
        </div>
    );
}
