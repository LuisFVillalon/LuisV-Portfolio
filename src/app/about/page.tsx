import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

// app/about/page.js
export default function AboutPage() {
    return (

    <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      
      <Navbar />

      <section className="flex w-full">
        <div className="text- mx-[20%] my-[1%] text-[#0A0A23]">
            <h1 className="underline underline-offset-2  text-4xl font-extrabold">About Luis Villalon</h1>
            <div>
                <p className="my-[10%] text-xl text-[#333333]">
                    Hi,<strong className="text-[#0A0A23]"> nice to meet you!</strong> My name is 
                    <strong className="text-[#0A0A23]"> Luis Villalon</strong>. I am from
                    <strong className="text-[#0A0A23]"> Southern California</strong>, where the sun never stops shining. 
                    I <strong className="text-[#0A0A23]">love to learn</strong> and <strong className="text-[#0A0A23]"> 
                    challenge myself</strong>.
                </p>
                <p className="my-[10%] text-xl text-[#333333]">
                    With my skills as a <strong className="text-[#0A0A23]"> full-stack developer</strong>, I can build 
                    web applications from the ground up, that deal with <strong className="text-[#0A0A23]"> complex data 
                    visualization and manipulation</strong>. Being a <strong className="text-[#0A0A23]"> 
                    front-end</strong>  and <strong>back-end developer</strong>, I specialize in creating <strong className="text-[#0A0A23]"> aesthetically pleasing
                    </strong> and <strong className="text-[#0A0A23]"> engaging user interfaces</strong> while dealing with both 
                    <strong className="text-[#0A0A23]"> SQL</strong> and <strong className="text-[#0A0A23]"> NoSQL databases</strong>.
                </p>
                <p  className="my-[10%] text-xl text-[#333333]">
                    Whenever I am not in front of a computer screen, I enjoy spending time outdoors—whether it is 
                    hiking, playing basketball, or going for a run.
                </p>
                <h1 className="underline underline-offset-2  text-4xl font-extrabold">The Evolution of My Coding Career</h1>
                <p className="my-[1%] text-xl text-[#333333]">
                    I was studying Environmental Engineering at the University of California, Riverside from 2016 to 2020. 
                    When the COVID-19 Pandemic hit, I realized life is too short to not persue a career that makes you feel 
                    fufilled. This is when I decided to drop out of college. 
                </p>
                <p className="my-[1%] text-xl text-[#333333]">
                    Lost and confused I decided it was best to take my talents to the Emergency Medical Service field. Working
                    as an Emergency Medical Technician on an ambulance taught me I loved solve complex problems through collaboration
                    and leadership. It also taught if I was able to save a life I could set out to accomplish anything. 
                </p>    
                <p className="my-[1%] text-xl text-[#333333]">
                    With the new found confidence and free time on my hands, I decided to teach myself how to code with free online
                    resources. Each day I found myself yearning to learn and get better at developing coding solutions, algorithms, 
                    and data structures. After buildiong several web applications for my personal use, I decided it was time to dedicate
                    my full time and energy into this new passion I have found in software development.
                </p> 
                <p className="my-[1%] text-xl text-[#333333]">
                    This is when I decided to go back to college to earn a B.S. in Computer Science to further develop my career as a
                    software engineer. With all the skills as a full-stack developer I learned on my own, college courses have been a breeze.
                    I recently acquired an Associate in Computer Science and I am currently waiting on decisions being made from Cal State
                    Uniersities. 
                </p>    
                <p className="my-[1%] text-xl text-[#333333]">
                    Thanks to my personal projects in web development and my college courses I have been blessed enough to work for wonderful
                    companies. I have worked as an Software Engineer Intern for Ectron, Inc. and as a Front Developer Intern for Sports Exictement.
                </p>                                                 
            </div>
        </div>
      </section>
      <Footer />

    </div>        

    );
  }
  