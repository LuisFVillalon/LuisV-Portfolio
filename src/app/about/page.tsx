import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from "next/image";

// app/about/page.js
export default function AboutPage() {
    return (

    <div className="flex font-[Monospace] flex-col items-center justify-start h-[100%] bg-[#FFFFFF]">
      
      <Navbar />
      <section className="flex w-full">
        <div className=" mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] text-[#0A0A23]">
            <h1 className="text-4xl font-extrabold">About Luis Villalon</h1>
            <div className="md:grid md:grid-cols-2">
                <p className="my-[10%] md:my-[1%] text-xl text-[#333333]">
                    Hi, nice to meet you! I&apos;m <strong> Luis Villalon</strong>, a 
                    <strong> Software Engineer</strong> and <strong> Full-Stack Developer</strong> from{" "}
                    <a 
                        className="text-[#006400] underline font-bold" 
                        href="https://en.wikipedia.org/wiki/Calexico%2C_California" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Calexico, CA
                    </a>. I&apos;m passionate about <strong>learning</strong> and constantly 
                    challenging myself to <strong>grow</strong>!
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
                            <p className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                                Currently, I’m an <strong>SEO & Digital Marketing Strategist</strong> at{" "}
                                <a 
                                    className="text-[#006400] underline font-bold" 
                                    href="https://nhclx.org/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Calexico Neighborhood House
                                </a>, where I help increase <strong>thrift store sales</strong> and <strong>preschool enrollment</strong> through 
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
            <div className="md:hidden flex flex-col justify-center items-center w-full">                  
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
            <p className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                I’m an <strong>SEO-focused full-stack web developer</strong> who builds 
                <strong> scalable</strong>, <strong> high-performance web applications</strong>. 
                I design <strong>clean, engaging user interfaces</strong> and work with both 
                <strong> SQL</strong> and <strong> NoSQL</strong> databases to manage complex data. 
                My goal is to create <strong>fast</strong>, <strong>accessible</strong>, and 
                <strong> search-optimized digital experiences</strong>.
            </p>
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
                        <p className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                            I learned <strong>full-stack development</strong> through free online resources like{" "}
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
                                href="https://www.imperial.edu/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                HubSpot
                            </a>. 

                            To strengthen my theoretical computer science fundamentals, I am pursuing a 
                            <strong> Bachelor of Science in Computer Science</strong> at <a 
                                className="text-[#006400] underline font-bold" 
                                href="https://cs.sdsu.edu/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                San Diego State University
                            </a>. 
                            I recently earned my <strong>Associate of Science in Computer Science</strong> from{" "}
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
            <p className="md:hidden my-[10%] md:my-[3%] text-xl text-[#333333]">
                I learned <strong>full-stack</strong> and <strong>SEO development</strong> through free online resources like{" "}
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
                </a>, and <strong>HubSpot</strong>. 

                To strengthen my <strong>theoretical computer science fundamentals</strong>, I am pursuing a 
                <strong> Bachelor of Science in Computer Science</strong> at <a 
                                className="text-[#006400] underline font-bold" 
                                href="https://cs.sdsu.edu/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                San Diego State University
                            </a>. 
                I recently earned my <strong>Associate of Science in Computer Science</strong> from{" "}
                <a 
                    className="text-[#006400] underline font-bold" 
                    href="https://www.imperial.edu/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Imperial Valley College
                </a>.
            </p>
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
            <p className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                I consider myself fluent in <strong>Spanish</strong>, <strong>English</strong>, and <strong>JavaScript</strong>. 
                When I&apos;m not working academically or professionally, I enjoy spending time <strong>outdoors</strong>—whether it is 
                <strong>hiking</strong>, <strong>playing basketball</strong>, or <strong>going for a run</strong>. 
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
                    href="https://www.imdb.com/title/tt0816692/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Interstellar
                </a>.
                </p>
  
            <div className="flex justify-center items-center">
                    <Image 
                            src="/about/Chrissy_GIF.webp"
                            alt="Chrissy GIF."
                            width={300}  // Specify the width and height for optimization
                            height={300}
                            className="rounded-lg shadow-lg"
                    />
            </div>
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
      <Footer />

    </div>        

    );
  }
  