import Image from 'next/image';
import Link from 'next/link';
import { BentoTile } from '../home/BentoTile';
import { BlogPost, formatPostDate } from '@/app/lib/blogTypes';
import PostToc from './PostToc';
import { backLinkClass, chipClass, tileLabelClass } from './blogStyles';

export function BackToBlog() {
    return (
        <Link href="/blog" className={backLinkClass}>
            ← All posts
        </Link>
    );
}

/** Desktop-only sticky rail: back link, post facts and the scroll-spy table of contents. */
export function PostSidebar({ post }: { post: BlogPost }) {
    const facts = [
        { label: 'Topic', value: post.category },
        { label: 'Published', value: formatPostDate(post.date) },
        { label: 'Reading time', value: post.readTime },
    ];
    return (
        <aside className="hidden lg:block">
            {/* top offset clears the sticky navbar */}
            <div className="sticky top-[86px] flex max-h-[calc(100vh-100px)] flex-col gap-3">
                <BentoTile className="!p-4">
                    <BackToBlog />
                    <dl className="mt-4 space-y-2 text-xs">
                        {facts.map((fact) => (
                            <div key={fact.label} className="flex justify-between gap-2">
                                <dt className="text-[#6e6e78]">{fact.label}</dt>
                                <dd className="text-right font-bold text-[#0A0A23]">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                </BentoTile>
                {post.toc.length > 0 && (
                    <nav aria-label="On this page" className="flex min-h-0 flex-col">
                        <BentoTile className="!p-4 min-h-0 !overflow-y-auto" label="On this page">
                            <PostToc items={post.toc} />
                        </BentoTile>
                    </nav>
                )}
            </div>
        </aside>
    );
}

export function PostHeader({ post }: { post: BlogPost }) {
    return (
        <header className="flex gap-5 rounded-2xl border border-[#0A0A23]/10 bg-white p-5 md:p-8">
            <div className="min-w-0 flex-1">
                <div className="mb-3 lg:hidden">
                    <BackToBlog />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e6e78]">
                    <span className={chipClass}>{post.category}</span>
                    <span>{formatPostDate(post.date)}</span>
                    <span aria-hidden>·</span>
                    <span>{post.readTime} read</span>
                </div>
                <h1 className="mt-3 font-sans text-[26px] md:text-[36px] font-extrabold leading-[1.15] text-[#0A0A23]">
                    {post.title}
                </h1>
                <p className="mt-2 text-[13px] text-[#555560]">By {post.author}</p>
            </div>
            <div className="relative hidden h-[132px] w-[132px] flex-none overflow-hidden rounded-xl border border-[#0A0A23]/10 bg-[#F3F3F5] md:block">
                <Image src={post.image_card} alt="" fill priority sizes="132px" className="object-cover" />
            </div>
        </header>
    );
}

/** Phone/tablet table of contents, collapsed above the article. */
export function PostTocDisclosure({ post }: { post: BlogPost }) {
    const sections = post.toc.filter((item) => item.level === 2).length;
    if (sections === 0) return null;
    return (
        <details className="rounded-2xl border border-[#0A0A23]/10 bg-white px-4 py-3 lg:hidden">
            <summary className={`${tileLabelClass} cursor-pointer`}>
                On this page · {sections} {sections === 1 ? 'section' : 'sections'}
            </summary>
            <nav aria-label="On this page" className="mt-3">
                <PostToc items={post.toc} showSubsections={false} />
            </nav>
        </details>
    );
}

/** Older / newer post tiles under the article. */
export function PostNeighbors({ newer, older }: { newer: BlogPost | null; older: BlogPost | null }) {
    const links = [
        { post: older, label: '← Older' },
        { post: newer, label: 'Newer →' },
    ].filter((link): link is { post: BlogPost; label: string } => link.post !== null);
    if (links.length === 0) return null;

    return (
        <nav className="grid gap-3 md:grid-cols-2 md:gap-4" aria-label="Newer and older posts">
            {links.map(({ post, label }) => (
                <Link
                    key={label}
                    href={`/blog/${post.id}`}
                    className="group flex gap-3 rounded-2xl border border-[#0A0A23]/10 bg-white p-3"
                >
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-[#F3F3F5]">
                        <Image src={post.image_card} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <p className={tileLabelClass}>{label}</p>
                        <p className="mt-1 line-clamp-2 font-sans text-sm font-bold leading-snug text-[#0A0A23] group-hover:text-[#006400]">
                            {post.title}
                        </p>
                    </div>
                </Link>
            ))}
        </nav>
    );
}

/** The rest of the published posts. */
export function MoreWriting({ posts }: { posts: BlogPost[] }) {
    if (posts.length === 0) return null;
    return (
        <BentoTile label="More writing" more={{ href: '/blog', text: 'All posts →' }}>
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className="border-b border-[#0A0A23]/10 last:border-b-0">
                        <Link href={`/blog/${post.id}`} className="group flex items-baseline justify-between gap-3 py-2">
                            <span className="min-w-0 font-sans text-sm font-bold text-[#0A0A23] group-hover:text-[#006400] group-hover:underline">
                                {post.title}
                            </span>
                            <span className="shrink-0 text-xs text-[#6e6e78]">{formatPostDate(post.date, 'month')}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </BentoTile>
    );
}
