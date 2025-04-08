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
                                Currently, I’m an SEO & Digital Marketing Specialist at <a 
                                    className="text-[#006400] underline font-bold" 
                                    href="https://nhclx.org/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >Calexico Neighborhood House</a>, where I help increase thrift store sales and preschool enrollment
                                through strategic digital campaings. Prior to this, I was a Front-End Developer Intern at <a 
                                    className="text-[#006400] underline font-bold" 
                                    href="https://www.linkedin.com/company/sportsexcitement/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >Sports Excitement</a>, contributing to the development of
                                a global sports community platform. Before that, I served a Software Engineer Intern at <a 
                                    className="text-[#006400] underline font-bold" 
                                    href="https://ectron.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >Ectron Corporation</a>, 
                                where I helped build a full-stack asset tracking application.
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
                I’m an SEO-focused full-stack web developer who builds scalable, 
                high-performance web applications. I design clean, engaging user 
                interfaces and work with both SQL and NoSQL databases to manage complex data. 
                My goal is to create fast, accessible, and search-optimized digital experiences.
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
                        <p  className="my-[10%] md:my-[3%] text-xl text-[#333333]">
                            I learned full-stack development through free online resources like, <a 
                                className="text-[#006400] underline font-bold" 
                                href="https://www.theodinproject.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >The Odin Project</a>, <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.freecodecamp.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            >freeCodeCamp</a> and HubSpot.
                            To strengthen my theoretical computer science fundamentals, I am pursuing a Bachelor of Science in Computer
                            Science at San Diego State University. I recently earned my Associate of  Science in Computer Science from <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.imperial.edu/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            >Imperial Valley College</a>. 
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
            <p  className="md:hidden my-[10%] md:my-[3%] text-xl text-[#333333]">
                        I learned full-stack and SEO development through free online resources like, <a 
                            className="text-[#006400] underline font-bold" 
                            href="https://www.theodinproject.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >The Odin Project</a>, <a 
                        className="text-[#006400] underline font-bold" 
                        href="https://www.freecodecamp.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >freeCodeCamp</a> and HubSpot.
                        To strengthen my theoretical computer science fundamentals, I am pursuing a Bachelor of Science in Computer
                        Science at San Diego State University. I recently earned my Associate of  Science in Computer Science from <a 
                        className="text-[#006400] underline font-bold" 
                        href="https://www.imperial.edu/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >Imperial Valley College</a>. 
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
  