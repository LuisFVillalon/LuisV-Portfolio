'use client'

import Link from 'next/link';
import { useState } from 'react';

const navLinkClass = `text-2xl md:text-3xl font-sans font-bold
    hover:font-black hover:cursor-pointer hover:underline
    hover:text-[#006400] transition-colors`;

const navAnimation = { animation: "fadeDown 0.5s ease-in 0s forwards" };

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <p className={navLinkClass} style={navAnimation}>
        <Link href={href}>{label}</Link>
    </p>
);

export default function Navbar() {
    const [menuStatus, setMenuStatus] = useState(false);
    return (
        <nav className="z-50 sticky top-0 w-full shadow-md bg-[#EEEEEE] bg-opacity-70">
            <div
                className={`text-2xl md:text-4xl text-[#0A0A23] flex justify-between my-[1%] transition-all duration-300
                  ${menuStatus ? "mt-[0%] md:py-[1%] md:my-[0%] mr-[5%] md:mr-[0%]" : "mx-[10%] md:mx-[20%]"}`}
                style={navAnimation}
            >
                <Link href="/">
                    <i className="fas fa-home"></i>
                </Link>
                <button onClick={() => setMenuStatus(!menuStatus)}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className={`${menuStatus ? "block" : "hidden"} flex justify-start items-start md:items-center
                  fixed inset-0 bg-[#0A0A23] h-screen md:h-full w-[90%] md:w-[100%] text-[#FFFFFF]
                  bg-opacity-95 md:bg-opacity-100`}>
                    <div className="my-[5%] md:my-[0%] w-[90%] md:w-[100%] flex flex-col md:flex-row items-end md:justify-center space-x-5 space-y-5 md:space-y-0">
                        <p className="text-2xl md:text-3xl hover:font-black hover:cursor-pointer hover:underline hover:text-[#006400] transition-colors" style={navAnimation}>
                            <Link href="/"><i className="fas fa-home"></i></Link>
                        </p>
                        <NavLink href="/about" label="About" />
                        <NavLink href="/experience" label="Experience" />
                        <NavLink href="/projects" label="Projects" />
                        <NavLink href="/blog" label="Blog" />
                        <NavLink href="/contact" label="Contact" />
                        <button
                            onClick={() => setMenuStatus(false)}
                            className="text-2xl md:text-3xl text-[#EEEEEE] hover:font-black hover:cursor-pointer hover:underline hover:text-[#006400] transition-colors"
                            style={navAnimation}>
                            X
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeDown {
                    0%   { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
}
