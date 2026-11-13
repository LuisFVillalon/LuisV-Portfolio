import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { ContactTile } from '@/app/components/home/InfoTiles';
import PostMarkdown from '@/app/components/blog/PostMarkdown';
import ReadingProgress from '@/app/components/blog/ReadingProgress';
import {
    PostSidebar,
    PostHeader,
    PostTocDisclosure,
    PostNeighbors,
    MoreWriting,
} from '@/app/components/blog/PostComponents';
import { getBlogPostWithNeighbors } from '@/app/lib/markdownBlogs';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Post({ params }: PageProps): Promise<React.ReactElement> {
    const { slug } = await params;
    const found = getBlogPostWithNeighbors(Number(slug));
    if (!found) notFound();
    const { post, newer, older, others } = found;

    return (
        <div className="flex min-h-screen flex-col items-center bg-[#F5F5F7] font-[Monospace]">
            <ReadingProgress />
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 md:px-8">
                {/* DOM order is the phone order. On lg the sticky rail sits left of the reading column. */}
                <section className="grid grid-cols-1 gap-3 py-4 md:gap-4 md:py-6 lg:grid-cols-[250px_minmax(0,780px)] lg:justify-center">
                    <PostSidebar post={post} />

                    <div className="flex min-w-0 flex-col gap-3 md:gap-4">
                        <PostHeader post={post} />
                        <PostTocDisclosure post={post} />

                        <article className="rounded-2xl border border-[#0A0A23]/10 bg-white px-5 py-6 md:px-10 md:py-10">
                            <div className="mx-auto max-w-[68ch]">
                                <PostMarkdown source={post.body} />
                            </div>
                        </article>

                        <PostNeighbors newer={newer} older={older} />
                        <MoreWriting posts={others} />
                        <ContactTile />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
