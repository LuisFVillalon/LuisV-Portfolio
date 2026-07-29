'use client'

import Link from 'next/link';
import { useState } from 'react';

const navLinkClass = `text-2xl font-sans font-bold
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
                  ${menuStatus ? "mt-[0%] md:py-[1%] md:my-[0%] mr-[5%] md:mr-[0%]" : "mx-auto max-w-4xl px-6"}`}
                style={navAnimation}
            >
                <Link href="/">
                    <i className="fas fa-home"></i>
                </Link>
                <div className="hidden md:flex md:items-center md:justify-center md:space-x-5">
                    <NavLink href="/about" label="About" />
                    <NavLink href="/experience" label="Experience" />
                    <NavLink href="/projects" label="Projects" />
                    <NavLink href="/blog" label="Blog" />
                    <NavLink href="/contact" label="Contact" />
                </div>
                <button className="md:hidden" onClick={() => setMenuStatus(!menuStatus)}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className={`${menuStatus ? "block" : "hidden"} md:hidden flex justify-start items-start
                  fixed inset-0 bg-[#0A0A23] h-screen w-[90%] text-[#FFFFFF]
                  bg-opacity-95`}>
                    <div className="my-[5%] w-[90%] flex flex-col items-end space-x-5 space-y-5">
                        <p className="text-2xl hover:font-black hover:cursor-pointer hover:underline hover:text-[#006400] transition-colors" style={navAnimation}>
                            <Link href="/"><i className="fas fa-home"></i></Link>
                        </p>
                        <NavLink href="/about" label="About" />
                        <NavLink href="/experience" label="Experience" />
                        <NavLink href="/projects" label="Projects" />
                        <NavLink href="/blog" label="Blog" />
                        <NavLink href="/contact" label="Contact" />
                        <button
                            onClick={() => setMenuStatus(false)}
                            className="text-2xl text-[#EEEEEE] hover:font-black hover:cursor-pointer hover:underline hover:text-[#006400] transition-colors"
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
