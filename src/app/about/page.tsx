import Image from 'next/image';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { BentoTile } from '../components/home/BentoTile';
import { ContactTile } from '../components/home/InfoTiles';
import { ExternalLink, tileLabelClass } from '../components/about/AboutParts';
import StoryTimeline from '../components/about/StoryTimeline';

export default function AboutPage() {
    return (
        <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#F5F5F7]">
            <Navbar />
            <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
                <div className="mx-auto max-w-4xl py-4 md:py-6">
                    {/* ── Origin ── */}
                    <BentoTile className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-center lg:p-7">
                        <div>
                            <p className={`mb-2 ${tileLabelClass}`}>About · Calexico, CA</p>
                            <h1 className="font-sans text-3xl font-extrabold leading-tight text-[#0A0A23] md:text-4xl">
                                From a border town to building agentic AI.
                            </h1>
                            <p className="mt-1 font-sans text-sm font-bold text-[#006400]">
                                Software Engineer · Full-Stack · Agentic AI
                            </p>
                            <p className="mt-3 text-sm leading-relaxed md:text-base">
                                Hi, I&apos;m <strong>Luis Villalon</strong>, a <strong>Software Engineer</strong> from{' '}
                                <ExternalLink href="https://en.wikipedia.org/wiki/Calexico%2C_California">Calexico, California</ExternalLink>,
                                a small border town next to Mexico. Growing up in a tight-knit community taught me the value of
                                connection and inspired me to use technology to make a positive impact.
                            </p>
                        </div>
                        <Image
                            src="/about/Calexico.webp"
                            alt="The Calexico border"
                            width={1000}
                            height={562}
                            priority
                            className="h-[200px] w-full rounded-xl object-cover md:h-[240px]"
                        />
                    </BentoTile>

                    {/* ── How I got here ── */}
                    <StoryTimeline />

                    {/* ── Outside of work ── */}
                    <BentoTile className="mt-8 lg:p-7" label="Outside of work">
                        <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
                            <p className="text-sm leading-relaxed md:text-base">
                                I am fluent in <strong>Spanish</strong> and <strong>English</strong>. When I&apos;m not working
                                academically or professionally, I enjoy spending time <strong>outdoors</strong>, whether it is{' '}
                                <strong>working out</strong>, <strong>playing basketball</strong>, or <strong>going for a run</strong>.
                                Alternatively, I love working on <strong>personal apps</strong> or watching a good show or movie like{' '}
                                <ExternalLink href="https://www.imdb.com/title/tt0141842/" italic>the Sopranos</ExternalLink> or{' '}
                                <ExternalLink href="https://www.imdb.com/title/tt3783958/" italic>La La Land</ExternalLink>.
                            </p>
                            <Image
                                src="/about/basketball_selfie.jpg"
                                alt="Luis playing basketball"
                                width={540}
                                height={810}
                                className="h-[240px] w-full rounded-xl object-cover object-[center_25%] md:h-[260px]"
                            />
                        </div>
                    </BentoTile>

                    <div className="mt-4 pb-10">
                        <ContactTile />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
