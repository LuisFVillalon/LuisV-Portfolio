"use client";
//import { useState } from "react";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Link from 'next/link';


// app/about/page.js
export default function Projects() {
    //const [selectedValue, setSelectedValue] = useState("currently doing");
    return (

    <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      
      <Navbar />

    <section className="flex flex-col w-full">
        <div className="mx-[10%] md:mx-[20%] my-[5%] md:my-[1%]  text-[#333333] border-b border-gray-500">
                <h1 className="text-center text-xl md:text-3xl font-extrabold text-[#0A0A23]">Project Gallery</h1>
                <p className="text-base text-[#333333]">
                    Explore my personal projects and academic coursework. Click a button below to browse 
                    my code and live applications by category.
                </p>
                <div className="flex flex-col md:flex-row  justify-center md:justify-evenly items-center space-y-[10%] md:space-y-[0%] 
                    md:space-x-[0%] font-extrabold text-[#0A0A23] my-[10%] md:my-[2%]"
                >
                    <Link className="" href="/projects/frontend">
                        <button className="text-base  p-[5%] bg-[#EEEEEE] rounded-lg border border-4 border-[#0A0A23] shadow-lg ">
                            Front-End
                        </button>
                    </Link>
                    <Link className="" href="/projects/backend">
                        <button className="text-base  p-[5%] bg-[#EEEEEE] rounded-lg border border-4 border-[#0A0A23] shadow-lg  ">
                            Back-End
                        </button>
                    </Link>
                    <Link className="" href="/projects/academic">
                        <button className= "text-base p-[5%] bg-[#EEEEEE] rounded-lg border border-4 border-[#0A0A23] shadow-lg ">
                            Academic
                        </button>
                    </Link>
                </div>
        </div>        
    </section>


      <Footer />

    </div>        

    );
  }
  