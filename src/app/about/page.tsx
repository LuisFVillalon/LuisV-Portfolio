import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from "next/image";
import Wrapper from '../components/Wrapper';
import CTASection from '../components/CTASection';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  italic?: boolean;
}
interface AboutImageProps {
  src: string;
  alt: string;
  size?: number;
  extraClass?: string;
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

// Generic image wrapper — keeps size, rounding, and shadow consistent
const AboutImage = ({ src, alt, size = 300, extraClass = "" }: AboutImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={`rounded-lg shadow-lg ${extraClass}`}
  />
);

const EducationParagraph = () => (
  <p className="my-[2.5%] md:my-[3%] text-base md:text-lg text-[#333333]">
    I began teaching myself <strong>front-end</strong>, <strong>back-end</strong>, and{" "}
    <strong>SEO development</strong> through free online resources like{" "}
    <ExternalLink href="https://www.theodinproject.com/">The Odin Project</ExternalLink>,{" "}
    <ExternalLink href="https://www.freecodecamp.org/">freeCodeCamp</ExternalLink>, and{" "}
    <ExternalLink href="https://academy.hubspot.com/">HubSpot Academy</ExternalLink>. To
    strengthen my theoretical computer science fundamentals, I am currently pursuing a{" "}
    <strong>Bachelor of Science in Computer Science</strong> at{" "}
    <ExternalLink href="https://cs.sdsu.edu/">San Diego State University</ExternalLink>. I am 
    currently exploring careers in <strong>Full-Stack</strong> and <strong>Agentic Systems</strong>  development and <strong>Development Operations</strong>.
  </p>
);

// app/about/page.js
export default function AboutPage() {
    return (
        <div className="flex font-[Monospace] flex-col  h-[100%] bg-[#FFFFFF]">
        <Navbar />
        <Wrapper>
            <section className="flex w-full">
            <div className="flex flex-col gap-2 my-[5%] md:my-[1%] text-[#0A0A23]">

                {/* ── Title ── */}
                <h1 className="font-sans text-center md:text-left text-2xl md:text-4xl font-extrabold">
                About Luis Villalon
                </h1>

                {/* ── Introduction + Calexico Image ── */}
                <div className="md:grid md:grid-cols-2">
                <p className="my-[2.5%] md:my-[1%] text-base md:text-lg text-[#333333]">
                    Hi, I&apos;m <strong>Luis Villalon</strong>, a <strong>Software Engineer</strong> from{" "}
                    <ExternalLink href="https://en.wikipedia.org/wiki/Calexico%2C_California">
                    Calexico, California
                    </ExternalLink>
                    , a small border town next to Mexico. Growing up in a tight-knit community taught me
                    the value of connection and inspired me to use technology to make a positive impact.
                </p>

                <div className="flex justify-center items-center">
                    <AboutImage src="/about/Calexico.webp" alt="Calexico border." />
                </div>
                </div>

                {/* ── Education — Desktop: text flanked by logo columns ── */}
                <div className="hidden md:grid md:grid-cols-3 justify-center items-center gap-4">
                {/* Left column: school logos */}
                <div className="flex flex-col justify-center">
                    <AboutImage src="/about/IVC_Logo.png" alt="IVC logo." />
                    <AboutImage src="/about/San_Diego_State_Aztecs_logo.svg.png" alt="SDSU logo." />
                </div>

                {/* Center column: education paragraph */}
                <EducationParagraph />

                {/* Right column: resource logos */}
                <div className="flex flex-col space-y-6 justify-center">
                    <AboutImage src="/about/TOP_Logo.png" alt="The Odin Project logo." />
                    <AboutImage src="/about/FreeCodeCamp_logo.svg.png" alt="freeCodeCamp logo." />
                    <AboutImage src="/about/HubSpot_Logo.png" alt="HubSpot logo." />
                </div>
                </div>

                {/* ── Education — Mobile: paragraph then logo rows ── */}
                <div className="md:hidden">
                <EducationParagraph />

                {/* Resource logos row */}
                <div className="flex items-center justify-evenly w-full">
                    <AboutImage src="/about/TOP_Logo.png" alt="The Odin Project logo." size={100} />
                    <AboutImage src="/about/FreeCodeCamp_logo.svg.png" alt="freeCodeCamp logo." size={100} />
                    <AboutImage src="/about/HubSpot_Logo.png" alt="HubSpot logo." size={100} />
                </div>

                {/* School logos row */}
                <div className="flex items-center justify-evenly w-full">
                    <AboutImage src="/about/IVC_Logo.png" alt="IVC logo." size={100} />
                    <AboutImage src="/about/San_Diego_State_Aztecs_logo.svg.png" alt="SDSU logo." size={100} />
                </div>
                </div>

                {/* ── Personal Interests ── */}
                <p className="my-[2.5%] md:my-[3%] text-base md:text-lg text-[#333333]">
                I am fluent in <strong>Spanish</strong> and <strong>English</strong>. When I&apos;m not
                working academically or professionally, I enjoy spending time <strong>outdoors</strong>
                —whether it is <strong>working out</strong>, <strong>playing basketball</strong>, or{" "}
                <strong>going for a run</strong>. Alternatively, I love working on{" "}
                <strong>personal apps</strong> or watching a good show or movie like{" "}
                <ExternalLink href="https://www.imdb.com/title/tt0141842/" italic>the Sopranos</ExternalLink>{" "}
                or{" "}
                <ExternalLink href="https://www.imdb.com/title/tt3783958/" italic>La La Land</ExternalLink>.
                </p>

                {/* ── Chrissy GIF ── */}
                <div className="flex justify-center items-center">
                <AboutImage src="/about/Chrissy_GIF.webp" alt="Chrissy GIF." />
                </div>

                {/* ── Basketball Selfie ── */}
                <div className="flex justify-center items-center">
                <AboutImage src="/about/basketball_selfie.jpg" alt="Basketball selfie." extraClass="mt-[3%]" />
                </div>

            </div>
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
  