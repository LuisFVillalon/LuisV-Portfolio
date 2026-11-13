import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { ContactTile } from '../components/home/InfoTiles';
import { BlogHeader, FeaturedPost, AllPosts } from '../components/blog/BlogIndexComponents';
import { getBlogPosts } from '../lib/markdownBlogs';
import { getBlogTopics } from '../lib/blogTypes';

export default function BlogPage(): React.ReactElement {
    const posts = getBlogPosts(); // published only, newest first
    const topics = getBlogTopics(posts);

    return (
        <div className="flex min-h-screen flex-col items-center bg-[#F5F5F7] font-[Monospace]">
            <Navbar />
            <main className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 md:gap-4 md:px-8 md:py-6">
                <BlogHeader posts={posts} topics={topics} />
                {posts.length > 0 && (
                    <>
                        <FeaturedPost post={posts[0]} />
                        <AllPosts posts={posts} topics={topics} />
                    </>
                )}
                <ContactTile />
            </main>
            <Footer />
        </div>
    );
}
