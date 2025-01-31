// components/Navbar.tsx
'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [menuStatus, setMenuStatus] = useState(false);
  return (
      <nav className="sticky top-0 w-full shadow-md bg-[#EEEEEE] bg-opacity-70">
          <div
            className={`flex justify-between my-[1%] transition-all duration-300 
              ${menuStatus ? "mt-[0%] md:py-[1%] md:my-[0%] mr-[5%] md:mr-[0%]" : "mx-[10%] md:mx-[20%]"}`}
            style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}
          >
            <Link href="/">
              <i className="text-2xl text-[#0A0A23] fas fa-home"></i>
            </Link>
            <button onClick={() => setMenuStatus(!menuStatus)}>
              <i className="text-2xl text-[#0A0A23] fas fa-bars"></i>
            </button>

            <div className={`${menuStatus ? "block" : "hidden"} flex justify-start items-start md:items-center
              fixed inset-0 bg-[#0A0A23] h-screen md:h-full  w-[90%] md:w-[100%] text-white 
              bg-opacity-95 md:bg-opacity-100 
              `}>
               <div className="my-[5%] md:my-[0%] w-[90%] md:w-[100%] flex flex-col md:flex-row items-end md:justify-center space-x-5 space-y-5 md:space-y-0">
                  <p className="text-2xl text-[#EEEEEE]  
                    hover:font-black 
                    hover:cursor-pointer
                    hover:underline
                    hover:text-[#006400] transition-colors"
                    style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
                      <Link href="/about">About</Link>
                  </p>
                  <p className="text-2xl text-[#EEEEEE]  
                    hover:font-black 
                    hover:cursor-pointer
                    hover:underline
                    hover:text-[#006400] transition-colors"
                    style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
                      Experience
                  </p>
                  <p className="text-2xl text-[#EEEEEE]  
                    hover:font-black 
                    hover:cursor-pointer
                    hover:underline
                    hover:text-[#006400] transition-colors"
                    style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
                      Projects
                  </p>
                  <p className="text-2xl text-[#EEEEEE]  
                    hover:font-black 
                    hover:cursor-pointer
                    hover:underline
                    hover:text-[#006400] transition-colors"
                    style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
                      Blog
                  </p>                  
                  <button 
                    onClick={() => setMenuStatus(false)}
                    className="text-2xl text-[#EEEEEE]  
                    hover:font-black 
                    hover:cursor-pointer
                    hover:underline
                    hover:text-[#006400] transition-colors"
                    style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
                      X
                  </button>
                </div>
            </div>



          </div>

        <style>{`
         @keyframes fadeDown {
           0% {
             opacity: 0;
             transform: translateY(-20px);
           }
           100% {
             opacity: 1;
             transform: translateY(0);
           }        
         }
        
       `}</style>

      </nav>
    // <nav className="flex justify-between w-full shadow-md">

    // <div className="flex justify-between w-full mx-[20%] my-[1%]">
    //   <div className="flex justify-center" style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
    //     <Link href="/">
    //       <i className="cursor-pointer hover:text-[#006400] transition-colors text-2xl text-[#0A0A23] fas fa-home
    //         hover:animate-bounce"></i>
    //     </Link>
    //   </div>
    //   <div className="flex items-center space-x-6">
    //     <p className=" text-2xl text-[#0A0A23]  
    //       hover:font-black 
    //       hover:cursor-pointer
    //       hover:underline
    //       hover:text-[#006400] transition-colors"
    //       style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
    //         <Link href="/about">About</Link>
    //     </p>
    //     <p className=" text-2xl text-[#0A0A23]  
    //       hover:font-black 
    //       hover:cursor-pointer
    //       hover:underline
    //       hover:text-[#006400] transition-colors"
    //       style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
    //         Experience
    //     </p>
    //     <p className=" text-2xl text-[#0A0A23]  
    //       hover:font-black 
    //       hover:cursor-pointer
    //       hover:underline
    //       hover:text-[#006400] transition-colors"
    //       style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
    //         Projects
    //     </p>
    //     <p className=" text-2xl text-[#0A0A23]  
    //       hover:font-black 
    //       hover:cursor-pointer
    //       hover:underline
    //       hover:text-[#006400] transition-colors"
    //       style={{ animation: "fadeDown 0.5s ease-in 0s forwards" }}>
    //         Blog
    //     </p>
    //   </div>
    // </div>

    // <style>{`
    //     @keyframes fadeUp {
    //       0% {
    //         opacity: 0;
    //         transform: translateY(20px);
    //       }
    //       100% {
    //         opacity: 1;
    //         transform: translateY(0);
    //       }
    //     }

    //     @keyframes fadeDown {
    //       0% {
    //         opacity: 0;
    //         transform: translateY(-20px);
    //       }
    //       100% {
    //         opacity: 1;
    //         transform: translateY(0);
    //       }        
    //     }
        


    //   `}</style>

    // </nav>

  );
}
