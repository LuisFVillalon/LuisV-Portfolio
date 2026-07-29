// app/page.tsx
import Navbar from './components/NavBar';
import Homebody from './components/home/HomeBody';
import Footer from './components/Footer';
import { getAllMarkdownBlogPosts } from './lib/markdownBlogs';

export default function Home() {
  const posts = getAllMarkdownBlogPosts();

  return (
    <div className=" flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <Homebody posts={posts} />
      <Footer />
    </div>
  );
}
