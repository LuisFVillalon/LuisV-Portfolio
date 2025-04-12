// components/Navbar.tsx
import Image from 'next/image';

export default function Homebody() {
    return (

        <div className="my-[5%] md:my-[1%] mx-[10%] md:mx-[20%] flex flex-col   h-[100%]">
            <div className="text-start text-[#333333] flex flex-col">
                <h1 className="my-[1%] text-4xl font-extrabold text-[#0A0A23]">Hi, I am Luis Villalon.💻📈</h1>
                <h2 className="my-[1%] bg-[#006400] text-[#FFFFFF] text-lg font-extrabold">I design, build, and optimize
                     full-stack web applications.
                </h2>
                <p className="my-[2.5%] md:my-[1%] text-lg">
                    I’m a <strong className="text-[#0A0A23]">self-taught</strong> 
                    <strong className="text-[#0A0A23]"> software engineer</strong> pursuing a 
                    <strong className="text-[#0A0A23]"> B.S. in Computer Science</strong> at{" "}
                    <a
                        href="https://cs.sdsu.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#006400] font-bold underline"
                    >
                        San Diego State University
                    </a>. I build 
                    <strong className="text-[#0A0A23]"> full-stack web apps</strong> focused on 
                    <strong className="text-[#0A0A23]"> performance</strong>, 
                    <strong className="text-[#0A0A23]"> UX</strong>, and 
                    <strong className="text-[#0A0A23]"> SEO</strong>. I write 
                    <strong className="text-[#0A0A23]"> clean</strong>, 
                    <strong className="text-[#0A0A23]"> maintainable code</strong> and collaborate in 
                    <strong className="text-[#0A0A23]"> Agile teams</strong> to deliver 
                    <strong className="text-[#0A0A23]"> impactful</strong> digital products.
                </p>
                <p className="my-[2.5%] md:my-[1%] text-lg">
                    Currently working as an <strong className="text-[#0A0A23]">SEO & Digital Marketing Strategist</strong> at <a 
                        href="https://nhclx.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#006400] font-bold underline"
                    >
                      Calexico Neighborhood House
                    </a>. 
                </p>   
                {/* <strong className="text-center md:text-start my-[5%] md:my-[1%] text-2xl text-[#0A0A23]">
                    Open for work.    
                </strong>                   */}
            </div>
            <div className="hidden w-full md:flex flex-col items-center justify-center">
                <Image 
                    src="/selfie.JPG"
                    alt="Selfie."
                    width="300"  // Specify the width and height for optimization
                    height="300"
                    className="rounded-full mt-[2.5%]"
                />
                <p className="text-center text-lg text-[#0A0A23] mt-[4%]">
                    &quot;Whatever the mind of man can conceive and believe, it can achieve.&quot;
                </p>
                <p className="text-center text-[#333333]">- Napoleon Hill</p>
            </div>
        </div>
    
      
    );
  }
  