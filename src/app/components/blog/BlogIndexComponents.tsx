import Image from 'next/image';
import Link from 'next/link';
import { BentoTile } from '../home/BentoTile';
import { BlogPost, BlogTopic, formatPostDate, getBlogStats } from '@/app/lib/blogTypes';
import TopicFilter from './TopicFilter';
import { chipClass, tileLabelClass } from './blogStyles';

// "Career Dev, Frontend, AI Dev" -> "Career Dev, Frontend and AI Dev"
const joinWithAnd = (items: string[]) =>
    items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** Page header: a one-line summary derived from the published posts. */
export function BlogHeader({ posts, topics }: { posts: BlogPost[]; topics: BlogTopic[] }) {
    const stats = getBlogStats(posts);
    return (
        <BentoTile className="lg:p-7">
            <p className={tileLabelClass}>Writing</p>
            <h1 className="mt-1 font-sans text-3xl md:text-4xl font-extrabold leading-tight text-[#0A0A23]">Blog</h1>
            {posts.length > 0 && (
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed">
                    {stats.count} {stats.count === 1 ? 'post' : 'posts'} on {joinWithAnd(topics.map((t) => t.name))} —{' '}
                    {stats.minutes} min of reading, {formatPostDate(stats.first, 'month')}
                    {stats.first !== stats.latest && ` – ${formatPostDate(stats.latest, 'month')}`}.
                </p>
            )}
        </BentoTile>
    );
}

/** The newest post, shown large with its cover and excerpt. */
export function FeaturedPost({ post }: { post: BlogPost }) {
    return (
        <Link
            href={`/blog/${post.id}`}
            className="group grid overflow-hidden rounded-2xl border border-[#0A0A23]/10 bg-white md:grid-cols-[300px_minmax(0,1fr)]"
        >
            <div className="relative aspect-[4/3] bg-[#F3F3F5] md:aspect-square">
                <Image
                    src={post.image_card}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-3 p-5 md:p-7">
                <p className={tileLabelClass}>Latest · {formatPostDate(post.date)}</p>
                <h2 className="font-sans text-xl md:text-2xl font-extrabold leading-snug text-[#0A0A23] group-hover:text-[#006400]">
                    {post.title}
                </h2>
                <p className="text-[13px] leading-relaxed text-[#333333]">{post.excerpt}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-[#6e6e78]">
                    <span className={chipClass}>{post.category}</span>
                    <span>{post.readTime} read</span>
                    <span className="ml-auto font-sans text-sm font-bold text-[#006400] group-hover:underline">Read post →</span>
                </div>
            </div>
        </Link>
    );
}

function PostRow({ post }: { post: BlogPost }) {
    return (
        <li data-topic={post.category} className="border-t border-[#0A0A23]/10 first:border-t-0">
            <Link
                href={`/blog/${post.id}`}
                className="group grid grid-cols-[minmax(0,1fr)_72px] gap-x-4 gap-y-1 py-4 md:grid-cols-[88px_minmax(0,1fr)_112px]"
            >
                <p className="hidden pt-0.5 text-xs text-[#6e6e78] md:block">{formatPostDate(post.date, 'month')}</p>
                <div className="min-w-0">
                    <h3 className="font-sans text-[15px] md:text-base font-bold leading-snug text-[#0A0A23] group-hover:text-[#006400] group-hover:underline">
                        {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[#555560]">{post.excerpt}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6e6e78]">
                        <span className={chipClass}>{post.category}</span>
                        <span className="md:hidden">{formatPostDate(post.date, 'month')} ·</span>
                        <span>{post.readTime}</span>
                    </p>
                </div>
                <div className="relative h-[72px] w-[72px] overflow-hidden rounded-lg border border-[#0A0A23]/10 bg-[#F3F3F5] md:h-[84px] md:w-[112px]">
                    <Image src={post.image_card} alt="" fill sizes="112px" className="object-cover" />
                </div>
            </Link>
        </li>
    );
}

/** Every post as a skimmable row, filterable by topic. */
export function AllPosts({ posts, topics }: { posts: BlogPost[]; topics: BlogTopic[] }) {
    return (
        <BentoTile label="All posts">
            <TopicFilter topics={topics} total={posts.length}>
                <ul className="mt-3">
                    {posts.map((post) => (
                        <PostRow key={post.id} post={post} />
                    ))}
                </ul>
            </TopicFilter>
        </BentoTile>
    );
}
