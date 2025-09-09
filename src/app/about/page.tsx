import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from "next/image";
import Wrapper from '../components/Wrapper';
import CTASection from '../components/home/CTASection';

// app/about/page.js
export default function AboutPage() {
    return (
        <div className="flex font-[Monospace] flex-col  h-[100%] bg-[#FFFFFF]">
        <Navbar />
        <Wrapper>
            <section className="flex w-full">
                <div className="flex flex-col gap-2 my-[5%] md:my-[1%] text-[#0A0A23]">
                    <h1 className="dm-serif-text-regular text-center md:text-left text-2xl md:text-4xl font-extrabold">About Luis Villalon</h1>
                    {/* First Paragraph & CLX Image */}
                    <div className="md:grid md:grid-cols-2">
                        <p className="my-[2.5%] md:my-[1%] text-base md:text-lg text-[#333333]">
                            Hi, nice to meet you! I&apos;m <strong> Luis Villalon</strong>, a 
                            <strong> Software Engineer</strong> and <strong> Full-Stack Developer</strong> from{" "}
                            <a 
                                className="text-[#006400] underline font-bold" 
                                href="https://en.wikipedia.org/wiki/Calexico%2C_California" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Calexico, CA
                            </a>. I&apos;m dedicated to helping my <strong>community</strong> through my work as a full-stack developer!
                        </p>
                        <div className="flex justify-center items-center">
                                    <Image 
                                        src="/about/Calexico.webp"
                                        alt="Calexico border."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                    />   
                        </div>
                    </div>
                    {/* Second Paragrph & Job Logo Images */}
                    <div className="md:grid md:grid-cols-2 gap-4">
                        <div className="hidden md:flex flex-col space-y-5 justify-center items-center">
                                    <Image 
                                        src="/about/Ectron_logo.png"
                                        alt="Ectron logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />
                                    <Image 
                                        src="/about/sportexcitement_cover.jpg"
                                        alt="Sports Excitement logo."
                                        width={400}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                    />    
                                    <Image 
                                        src="/about/CNH-logo.png"
                                        alt="Sports Excitement logo."
                                        width={400}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                    />                                
                        </div>                            
                        <div className="flex justify-center items-center">
                                    <p className="my-[2.5%] md:my-[3%] text-base md:text-lg text-[#333333]">
                                        I have worked as an <strong>SEO & Digital Marketing Strategist</strong> at{" "}
                                        <a 
                                            className="text-[#006400] underline font-bold" 
                                            href="https://nhclx.org/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            Calexico Neighborhood House
                                        </a>, where I helped increase <strong>thrift store sales</strong> and <strong>preschool enrollment</strong> through 
                                        strategic <strong>digital campaigns</strong>. 

                                        Prior to this, I was a <strong>Front-End Developer Intern</strong> at{" "}
                                        <a 
                                            className="text-[#006400] underline font-bold" 
                                            href="https://www.linkedin.com/company/sportsexcitement/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            Sports Excitement
                                        </a>, contributing to the development of a <strong>global sports community platform</strong>. 

                                        Before that, I served as a <strong>Software Engineer Intern</strong> at{" "}
                                        <a 
                                            className="text-[#006400] underline font-bold" 
                                            href="https://ectron.com/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            Ectron Corporation
                                        </a>, where I helped build a <strong>full-stack asset tracking application</strong>.
                                    </p>                    
                        </div>
                    </div>
                    {/* Mobile Job Logo Images */}
                    <div className="md:hidden space-y-2 flex flex-col justify-center items-center w-full">                  
                                    <Image 
                                        src="/about/Ectron_logo.png"
                                        alt="Ectron logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />
                                    <Image 
                                        src="/about/sportexcitement_cover.jpg"
                                        alt="Sports Excitement logo."
                                        width={400}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                    />    
                                    <Image 
                                        src="/about/CNH-logo.png"
                                        alt="Sports Excitement logo."
                                        width={400}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                    />                  
                    </div>    
                    {/* Desktop Third Paragraph & School and Academy Logos */}
                    <div className="hidden md:grid md:grid-cols-3 justify-center items-center gap-4">
                                <div className="flex flex-col justify-center">
                                    <Image 
                                        src="/about/IVC_Logo.png"
                                        alt="IVC logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />  
                                    <Image 
                                        src="/about/San_Diego_State_Aztecs_logo.svg.png"
                                        alt="SDSU logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />  
                                </div>                      
                                <p className="my-[2.5%] md:my-[3%] text-base md:text-lg text-[#333333]">
                                    I learned <strong>front-end</strong>, <strong>back-end</strong>, and <strong>SEO development</strong> through free online resources like{" "}
                                    <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://www.theodinproject.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        The Odin Project
                                    </a>,{" "}
                                    <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://www.freecodecamp.org/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        freeCodeCamp
                                    </a> and                             <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://academy.hubspot.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        HubSpot Academy
                                    </a>. 

                                    To strengthen my theoretical computer science fundamentals, I am currently pursuing a 
                                    <strong> Bachelor of Science in Computer Science</strong> at <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://cs.sdsu.edu/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        San Diego State University
                                    </a>. 
                                    I also earned an <strong>Associate of Science in Computer Science</strong> from{" "}
                                    <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://www.imperial.edu/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Imperial Valley College
                                    </a>.
                                </p>
                                <div className="flex flex-col space-y-6 justify-center">
                                    <Image 
                                        src="/about/TOP_Logo.png"
                                        alt="The Odin Project logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />
                                    <Image 
                                        src="/about/FreeCodeCamp_logo.svg.png"
                                        alt="freeCodeCamp logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />  
                                    <Image 
                                        src="/about/HubSpot_Logo.png"
                                        alt="HubSpot logo."
                                        width={300}  // Specify the width and height for optimization
                                        height={300}
                                        className="rounded-lg shadow-lg"
                                        
                                    />                                    
                                </div>                     
                    </div>
                    {/* Mobile Third Paragraph */}
                    <p className="md:hidden mt-[5%] mb-[2.5%] md:my-[3%] text-base md:text-lg text-[#333333]">
                        I learned <strong>front-end</strong>, <strong>back-end</strong>, and <strong>SEO development</strong> through free online resources like{" "}
                        <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.theodinproject.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            The Odin Project
                        </a>,{" "}
                        <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.freecodecamp.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            freeCodeCamp
                        </a>, and <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://academy.hubspot.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        HubSpot Academy
                                    </a>. 

                        To strengthen my <strong>theoretical computer science fundamentals</strong>, I am currently pursuing a 
                        <strong> Bachelor of Science in Computer Science</strong> at <a 
                                        className="text-[#006400] underline font-bold" 
                                        href="https://cs.sdsu.edu/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        San Diego State University
                                    </a>. 
                        I also earned an <strong>Associate of Science in Computer Science</strong> from{" "}
                        <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.imperial.edu/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Imperial Valley College
                        </a>.
                    </p>
                    {/* Mobile Academy Logos */}
                    <div className="md:hidden flex items-center justify-evenly md:justify-evenly w-full">
                                <Image 
                                    src="/about/TOP_Logo.png"
                                    alt="The Odin Project logo."
                                    width={100}  // Specify the width and height for optimization
                                    height={100}
                                    className="rounded-lg shadow-lg"
                                    
                                />
                                    <Image 
                                        src="/about/FreeCodeCamp_logo.svg.png"
                                        alt="freeCodeCamp logo."
                                        width={100}  // Specify the width and height for optimization
                                        height={100}
                                        className="rounded-lg shadow-lg"
                                        
                                    />  
                                    <Image 
                                        src="/about/HubSpot_Logo.png"
                                        alt="HubSpot logo."
                                        width={100}  // Specify the width and height for optimization
                                        height={100}
                                        className="rounded-lg shadow-lg"
                                        
                                    />                             
                    </div> 
                    {/* Mobile School Logos */}
                    <div className="md:hidden flex items-center justify-evenly md:justify-evenly w-full">
                                <Image 
                                    src="/about/IVC_Logo.png"
                                    alt="IVC logo."
                                    width={100}  // Specify the width and height for optimization
                                    height={100}
                                    className="rounded-lg shadow-lg"
                                    
                                /> 
                                <Image 
                                        src="/about/San_Diego_State_Aztecs_logo.svg.png"
                                        alt="SDSU logo."
                                        width={100}  // Specify the width and height for optimization
                                        height={100}
                                        className="rounded-lg shadow-lg"
                                        
                                />                       
                    </div> 
                    {/* Fourth Paragraph */}
                    <p className="my-[2.5%] md:my-[3%] text-base md:text-lg text-[#333333]">
                        I consider myself fluent in <strong>Spanish</strong>, <strong>English</strong>, and <strong>JavaScript</strong>. 
                        When I&apos;m not working academically or professionally, I enjoy spending time <strong>outdoors</strong>—whether it 
                        is <strong>hiking</strong>, <strong>playing basketball</strong>, or <strong>going for a run</strong>. 
                        Alternatively, I love working on <strong>personal apps</strong> or watching a good show or movie like{" "}
                        <a 
                            className="text-[#006400] underline italic font-bold" 
                            href="https://www.imdb.com/title/tt0141842/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            the Sopranos
                        </a> or{" "}
                        <a 
                            className="text-[#006400] underline italic font-bold" 
                            href="https://www.imdb.com/title/tt3783958/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            La La Land
                        </a>.
                    </p>
                    {/* Chrissy GIF */}
                    <div className="flex justify-center items-center">
                            <Image 
                                    src="/about/Chrissy_GIF.webp"
                                    alt="Chrissy GIF."
                                    width={300}  // Specify the width and height for optimization
                                    height={300}
                                    className="rounded-lg shadow-lg"
                            />
                    </div>
                    {/* Basketball Selfie */}
                    <div className="flex justify-center items-center">
                            <Image 
                                src="/about/basketball_selfie.jpg"
                                alt="Basketball selfie."
                                width={300}  // Specify the width and height for optimization
                                height={300}
                                className="rounded-lg shadow-lg mt-[3%]"       
                            />     
                    </div>
                </div>
            </section>
            <CTASection/>
        </Wrapper>
        <Footer />
        </div>        
    );
  }
  