// components/Navbar.tsx
import Image from 'next/image';

export default function Homebody() {
    return (

        <div className="my-[5%] md:my-[1%] mx-[10%] md:mx-[20%] flex flex-col md:flex-row  h-[100%]">
            <div className="text-start col-start-1 col-end-5 text-[#0A0A23] flex flex-col">
                <h1 className="my-[1%] text-5xl font-extrabold">Hi, I am Luis Villalon. </h1>
                <h2 className="my-[1%] bg-[#006400] text-[#EEEEEE] text-3xl font-extrabold">I build full-stack web applications. </h2>
                <p className="my-[5%] md:my-[1%] text-2xl text-[#333333]">
                    I am a <strong>software engineer</strong> specializing in building scalable <strong>full-stack </strong>web applications.
                    Self-taught and currently persuing a Bachelor&apos;s of Science in Computer Science.
                </p>
                <p className="my-[5%] md:my-[1%] text-2xl text-[#333333]">
                    I leverage my full-stack expertise to deliver <strong>clean</strong>, <strong>maintainable </strong> 
                    code while collaborating 
                    with product owners and scrum masters during <strong>sprint planning</strong> and <strong>stand-ups </strong>
                    to drive innovation and build impactful digital products.
                </p>  
                <p className="my-[5%] md:my-[1%] text-2xl text-[#333333]">
                    Currently working as <strong>Front-end Developer Intern</strong> at <a 
                        href="https://www.linkedin.com/company/sportsexcitement/posts/?feedView=all" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#006400] font-bold underline"
                    >
                      Sports Excitement
                    </a>. 
                </p>   
                <strong className="text-center md:text-start my-[5%] md:my-[1%] text-2xl text-[#333333]">
                    Open for work.    
                </strong>                  
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
  