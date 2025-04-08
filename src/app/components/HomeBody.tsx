// components/Navbar.tsx
import Image from 'next/image';

export default function Homebody() {
    return (

        <div className="my-[5%] md:my-[1%] mx-[10%] md:mx-[20%] flex flex-col md:flex-row  h-[100%]">
            <div className="text-start text-[#333333] flex flex-col">
                <h1 className="my-[1%] text-5xl font-extrabold text-[#0A0A23]">Hi, I am Luis Villalon. </h1>
                <h2 className="my-[1%] bg-[#006400] text-[#FFFFFF] text-3xl font-extrabold">I design, build, and optimize
                     full-stack web applications.</h2>
                <p className="my-[5%] md:my-[1%] text-2xl">
                    I am a <strong className="text-[#0A0A23]">software engineer</strong> specializing in building <strong 
                    className="text-[#0A0A23]">scalable full-stack web applications</strong> optimized for performance, <strong 
                    className="text-[#0A0A23]">user experience</strong>, and <strong 
                    className="text-[#0A0A23]">search engine visibility</strong>.
                    I am a <strong className="text-[#0A0A23]">self-taught developer</strong> currently pursuing a <strong 
                    className="text-[#0A0A23]">Bachelor of Science in Computer Science</strong> at <strong 
                    className="text-[#0A0A23]">
                        <a 
                        href="https://cs.sdsu.edu/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#006400] font-bold underline"
                        >
                            San Diego State University
                        </a>
                    </strong>.
                </p>
                <p className="my-[5%] md:my-[1%] text-2xl">
                    I leverage my <strong className="text-[#0A0A23]">full-stack expertise</strong> to deliver <strong className="text-[#0A0A23]">clean</strong>
                    , <strong className="text-[#0A0A23]">maintainable solutions</strong> solutions while collaborating 
                    with <strong className="text-[#0A0A23]">project leads</strong> and <strong className="text-[#0A0A23]">stakeholders</strong> during <strong 
                    className="text-[#0A0A23]">Agile development meetings</strong> to <strong className="text-[#0A0A23]">drive innovation</strong> and <strong 
                    className="text-[#0A0A23]">build impactful digital products</strong>.
                </p>  
                <p className="my-[5%] md:my-[1%] text-2xl">
                    Currently working as an <strong className="text-[#0A0A23]">SEO & Digital Marketing Specialist</strong> at <a 
                        href="https://nhclx.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#006400] font-bold underline"
                    >
                      Calexico Neighborhood House – Mission Thrift Store & Happy Kids Preschool and Daycare
                    </a>. 
                </p>   
                {/* <strong className="text-center md:text-start my-[5%] md:my-[1%] text-2xl text-[#0A0A23]">
                    Open for work.    
                </strong>                   */}
            </div>
            <div className="w-full flex items-center justify-center">
                <Image 
                    src="/selfie.JPG"
                    alt="Selfie."
                    width="300"  // Specify the width and height for optimization
                    height="300"
                    className="rounded-full"
                />
            </div>
        </div>
    
      
    );
  }
  