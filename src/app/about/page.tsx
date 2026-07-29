import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from "next/image";
import Wrapper from '../components/Wrapper';
import CTASection from '../components/CTASection';
import { SectionCard, SectionHeading } from '../components/Cards/SectionCard';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  italic?: boolean;
}
interface LogoBadgeProps {
  src: string;
  alt: string;
}

// Shared style for every external link
const linkClass = "text-[#006400] underline font-bold";

// Generic external link wrapper
const ExternalLink = ({ href, children, italic = false }: ExternalLinkProps) => (
  <a
    className={`${linkClass} ${italic ? "italic" : ""}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

// Small rounded card that houses a single logo — used for the "learned from" and "school" rows
const LogoBadge = ({ src, alt }: LogoBadgeProps) => (
  <div className="flex items-center justify-center bg-[#EEEEEE] border border-[#0A0A23]/10 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-3 w-20 h-20 md:w-24 md:h-24">
    <Image src={src} alt={alt} width={64} height={64} className="object-contain max-w-full max-h-full" />
  </div>
);

// app/about/page.js
export default function AboutPage() {
    return (
        <div className="flex font-[Monospace] flex-col h-[100%] bg-[#FFFFFF]">
        <Navbar />
        <Wrapper>
            <section className="flex flex-col gap-6 py-8 md:py-12">

            {/* ── Title ── */}
            <div className="text-center md:text-left">
                <h1 className="font-sans text-3xl md:text-5xl font-extrabold text-[#0A0A23]">
                About Luis Villalon
                </h1>
                <p className="mt-2 text-base md:text-lg text-[#B3B3B3] font-sans font-bold">
                Software Engineer &middot; Full-Stack &middot; Agentic Systems
                </p>
            </div>

            {/* ── Hero: Introduction + Calexico Image ── */}
            <SectionCard className="grid md:grid-cols-2 gap-6 items-center">
                <p className="text-base md:text-lg text-[#333333] leading-relaxed">
                Hi, I&apos;m <strong>Luis Villalon</strong>, a <strong>Software Engineer</strong> from{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Calexico%2C_California">
                    Calexico, California
                </ExternalLink>
                , a small border town next to Mexico. Growing up in a tight-knit community taught me
                the value of connection and inspired me to use technology to make a positive impact.
                </p>
                <div className="flex justify-center">
                <Image
                    src="/about/Calexico.webp"
                    alt="Calexico border."
                    width={340}
                    height={340}
                    className="rounded-xl shadow-md w-full max-w-[340px] h-auto"
                />
                </div>
            </SectionCard>

            {/* ── Background: Education + resources that shaped it ── */}
            <SectionCard>
                <SectionHeading>Background</SectionHeading>
                <p className="text-base md:text-lg text-[#333333] leading-relaxed">
                I began teaching myself <strong>front-end</strong>, <strong>back-end</strong>, and{" "}
                <strong>SEO development</strong> through free online resources like{" "}
                <ExternalLink href="https://www.theodinproject.com/">The Odin Project</ExternalLink>,{" "}
                <ExternalLink href="https://www.freecodecamp.org/">freeCodeCamp</ExternalLink>, and{" "}
                <ExternalLink href="https://academy.hubspot.com/">HubSpot Academy</ExternalLink>. To
                strengthen my theoretical computer science fundamentals, I am currently pursuing a{" "}
                <strong>Bachelor of Science in Computer Science</strong> at{" "}
                <ExternalLink href="https://cs.sdsu.edu/">San Diego State University</ExternalLink>. I am
                currently exploring careers in <strong>Full-Stack</strong> and{" "}
                <strong>Agentic Systems</strong> development and <strong>Development Operations</strong>.
                </p>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm font-sans font-bold text-[#B3B3B3] mb-3 uppercase tracking-wide">
                    Schools
                    </p>
                    <div className="flex flex-wrap gap-3">
                    <LogoBadge src="/about/IVC_Logo.png" alt="IVC logo." />
                    <LogoBadge src="/about/San_Diego_State_Aztecs_logo.svg.png" alt="SDSU logo." />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-sans font-bold text-[#B3B3B3] mb-3 uppercase tracking-wide">
                    Learned From
                    </p>
                    <div className="flex flex-wrap gap-3">
                    <LogoBadge src="/about/TOP_Logo.png" alt="The Odin Project logo." />
                    <LogoBadge src="/about/FreeCodeCamp_logo.svg.png" alt="freeCodeCamp logo." />
                    <LogoBadge src="/about/HubSpot_Logo.png" alt="HubSpot logo." />
                    </div>
                </div>
                </div>
            </SectionCard>

            {/* ── Outside of Work ── */}
            <SectionCard className="grid md:grid-cols-2 gap-6 items-center">
                <div className="order-2 md:order-1">
                <SectionHeading>Outside of Work</SectionHeading>
                <p className="text-base md:text-lg text-[#333333] leading-relaxed">
                    I am fluent in <strong>Spanish</strong> and <strong>English</strong>. When I&apos;m not
                    working academically or professionally, I enjoy spending time <strong>outdoors</strong>
                    —whether it is <strong>working out</strong>, <strong>playing basketball</strong>, or{" "}
                    <strong>going for a run</strong>. Alternatively, I love working on{" "}
                    <strong>personal apps</strong> or watching a good show or movie like{" "}
                    <ExternalLink href="https://www.imdb.com/title/tt0141842/" italic>the Sopranos</ExternalLink>{" "}
                    or{" "}
                    <ExternalLink href="https://www.imdb.com/title/tt3783958/" italic>La La Land</ExternalLink>.
                </p>
                </div>
                <div className="order-1 md:order-2 grid grid-cols-2 gap-3">
                <Image
                    src="/about/Chrissy_GIF.webp"
                    alt="Chrissy GIF."
                    width={200}
                    height={200}
                    className="rounded-xl shadow-md w-full h-full object-cover"
                />
                <Image
                    src="/about/basketball_selfie.jpg"
                    alt="Basketball selfie."
                    width={200}
                    height={200}
                    className="rounded-xl shadow-md w-full h-full object-cover"
                />
                </div>
            </SectionCard>

            </section>
            <CTASection
                title={"Interested in Collaborating?"}
                description={"Whether you’re a recruiter, founder, or fellow developer, I’m always open to meaningful conversations and new opportunities. Feel free to reach out."}
            />
        </Wrapper>
        <Footer />
        </div>
    );
  }
