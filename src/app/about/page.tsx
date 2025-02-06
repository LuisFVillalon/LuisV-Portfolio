import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from "next/image";

// app/about/page.js
export default function AboutPage() {
    return (

    <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      
      <Navbar />

      <section className="flex w-full">
        <div className=" mx-[10%] md:mx-[20%] my-[5%] md:my-[1%] text-[#0A0A23]">
            <h1 className="text-4xl font-extrabold">About Luis Villalon</h1>
            <div className="md:grid md:grid-cols-2">
                        <p className="my-[10%] md:my-[1%] text-xl text-[#333333]">
                        Hi, nice to meet you! I&apos;m  Luis Villalon, a 
                        Software Engineer and Full-Stack Developer from <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://en.wikipedia.org/wiki/Calexico%2C_California" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                        Calexico, CA</a>. I&apos;m passionate
                        about learning and constatnly challenging myself to grow!
                        </p>
                        <div className="flex justify-center items-center">
                            <Image 
                                src="/Calexico.webp"
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
                                src="/Ectron_logo.png"
                                alt="Ectron logo."
                                width={300}  // Specify the width and height for optimization
                                height={300}
                                className="rounded-lg shadow-lg hidden md:block"
                                
                            />
                            <Image 
                                src="/sportexcitement_cover.jpg"
                                alt="Sports Excitement logo."
                                width={400}  // Specify the width and height for optimization
                                height={300}
                                className="rounded-lg shadow-lg"
                            />                                
                        </div>                            
                        <div className="flex justify-center items-center">
                            <p className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                                Currently, I’m a Front-End Developer Intern at <a 
                                    className="text-[#006400] underline font-bold" 
                                    href="https://www.linkedin.com/company/sportsexcitement/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >Sports Excitement</a>, helping build
                                a global sports community platform that connects athletes, parents, and fans in 
                                one dynamic space. Previously, I was a Software Engineer Intern at <a 
                                    className="text-[#006400] underline font-bold" 
                                    href="https://ectron.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >Ectron Corporation</a>, 
                                where I helped develop a full-stack asset tracking application.
                            </p>                    
                        </div>
            </div>
            <div className="md:hidden flex justify-center items-center w-full">                  
                            <Image 
                                src="/sportexcitement_cover.jpg"
                                alt="Sports Excitement logo."
                                width={400}  // Specify the width and height for optimization
                                height={300}
                                className="rounded-lg shadow-lg"
                            />              
            </div>          
            <p className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                        With my skills as a <strong className="text-[#0A0A23]"> full-stack developer</strong>, I can build 
                        web applications from the ground up, that deal with <strong className="text-[#0A0A23]"> complex data 
                        visualization and manipulation</strong>. Being a <strong className="text-[#0A0A23]"> 
                        front-end</strong>  and <strong className="text-[#0A0A23]">back-end developer</strong>, I specialize in creating <strong className="text-[#0A0A23]"> aesthetically pleasing
                        </strong> and <strong className="text-[#0A0A23]"> engaging user interfaces</strong> while dealing with both 
                        <strong className="text-[#0A0A23]"> SQL</strong> and <strong className="text-[#0A0A23]"> NoSQL databases</strong>.
            </p>
            <div className="hidden md:grid md:grid-cols-3 justify-center items-center gap-4">
                        <div className="flex justify-center">
                            <Image 
                                src="/IVC_Logo.png"
                                alt="IVC logo."
                                width={300}  // Specify the width and height for optimization
                                height={300}
                                className="rounded-lg shadow-lg"
                                
                            />  
                        </div>                      
                        <p  className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                            I learned full-stack development through free online resources like, <a 
                                className="text-[#006400] underline font-bold" 
                                href="https://www.theodinproject.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >The Odin Project</a> and <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.freecodecamp.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            >freeCodeCamp</a>.
                            To strengthen my theoretical computer science fundamentals, I am pursuing a Bachelor of Science in Computer
                            Science. I recently earned my Associate of  Science in Computer Science from <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.imperial.edu/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            >Imperial Valley College</a> and am currently in the process of transferring to a four-year university. 
                        </p>
                        <div className="flex justify-center">
                            <Image 
                                src="/TOP_Logo.png"
                                alt="The Odin Project logo."
                                width={300}  // Specify the width and height for optimization
                                height={300}
                                className="rounded-lg shadow-lg"
                                
                            />   
                        </div>                     
            </div>
            <p  className="md:hidden my-[10%] md:my-[3%] text-xl text-[#333333]">
                        I learned full-stack development through free online resources like, <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.theodinproject.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >The Odin Project</a> and <a 
                        className="text-[#006400] underline font-bold" 
                        href="https://www.freecodecamp.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >freeCodeCamp</a>.
                        To strengthen my theoretical computer science fundamentals, I am pursuing a Bachelor of Science in Computer
                        Science. I recently earned my Associate of  Science in Computer Science from <a 
                        className="text-[#006400] underline font-bold" 
                        href="https://www.imperial.edu/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >Imperial Valley College</a> and am currently in the process of transferring to a four-year university. 
            </p>
            <div className="md:hidden flex items-center justify-evenly md:justify-evenly w-full">
                        <Image 
                            src="/IVC_Logo.png"
                            alt="IVC logo."
                            width={100}  // Specify the width and height for optimization
                            height={100}
                            className="rounded-lg shadow-lg"
                            
                        /> 
                        <Image 
                            src="/TOP_Logo.png"
                            alt="The Odin Project logo."
                            width={100}  // Specify the width and height for optimization
                            height={100}
                            className="rounded-lg shadow-lg"
                            
                        />
            </div>                                         
            <p  className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                        I consider myself fluent in Spanish, English, and JavaScript. When I&apos;m not in working academically
                        or professionally, I enjoy spending time outdoors—whether it is hiking, playing basketball, or going for a run.
                        Alternatively, I love working on personal apps or watching a good show or movie like, <a 
                        className="text-[#006400] underline italic font-bold" 
                        href="https://www.imdb.com/title/tt0141842/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >the Sopranos</a> or <a 
                        className="text-[#006400] underline italic font-bold" 
                        href="https://www.imdb.com/title/tt0816692/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >Interstellar</a>. 
            </p>    
            <div className="flex justify-center items-center">
                    <Image 
                            src="/Chrissy_GIF.webp"
                            alt="Chrissy GIF."
                            width={300}  // Specify the width and height for optimization
                            height={300}
                            className="rounded-lg shadow-lg"
                    />
            </div>
            <div className="flex justify-center items-center">
                    <Image 
                        src="/basketball_selfie.jpg"
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
  