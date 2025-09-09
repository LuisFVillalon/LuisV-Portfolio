// components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
    const [displayText, setDisplayText] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        const words = [
            'Software Engineer',
            'Problem Solver',
            'Full-stack Developer',
            'Collaborator',
            'Front-end Specialist',
            'Learner',
            'Back-end Programmer',
            'Visionary',
            'SEO Strategist',
            'Descision Maker'
        ];

        const typeWriter = () => {
            const currentWord = words[currentWordIndex];
            
            if (!isDeleting) {
                // Typing
                setDisplayText(currentWord.substring(0, currentCharIndex + 1));
                setCurrentCharIndex(prev => prev + 1);
                
                if (currentCharIndex + 1 === currentWord.length) {
                    // Finished typing, wait then start deleting
                    setTimeout(() => {
                        setIsDeleting(true);
                    }, 2000);
                    return;
                }
            } else {
                // Deleting
                setDisplayText(currentWord.substring(0, currentCharIndex));
                setCurrentCharIndex(prev => prev - 1);
                
                if (currentCharIndex === 0) {
                    // Finished deleting, move to next word
                    setIsDeleting(false);
                    setCurrentWordIndex(prev => (prev + 1) % words.length);
                    setCurrentCharIndex(0);
                    
                    // Small pause before typing next word
                    setTimeout(() => {
                        // This will trigger the next cycle
                    }, 500);
                    return;
                }
            }
        };

        const typingSpeed = isDeleting ? 25 : 50;
        const timer = setTimeout(typeWriter, typingSpeed);
        
        return () => clearTimeout(timer);
    }, [currentCharIndex, currentWordIndex, isDeleting]);
    return (
            <div className="gap-4 text-start justify-center items-center text-[#333333] flex flex-col  dm-serif-text-regular">
                <h1 className="text-center my-[1%] text-6xl md:text-8xl font-extrabold text-[#0A0A23]">Luis Fernando Villalón.</h1>
                <h2 className="min-w-[280px] md:min-w-[400px] text-center flex flex-col font-bold text-[#0A0A23] min-h-[2rem] md:min-h-[3rem] justify-center items-center">
                    <p className='text-xl md:text-3xl text-[#B3B3B3]'>I bring experience as a...</p>
                    {displayText ? (
                        <span className="text-2xl md:text-4xl typewriter-text border-r-2 border-[#0A0A23] pr-2 animate-pulse">
                            {displayText}
                        </span>
                    ) : (
                        <div className="text-2xl md:text-4xl invisible">SPACE</div>
                    )}
                </h2>
                <Link href="/contact">
                    <button className="text-xl md:text-2xl p-2 m-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-[#ffffff] shadow-lg transform active:scale-95 
                        active:shadow-md transition-all duration-150 hover:shadow-xl hover:-translate-y-1 border-b-4 border-r-2 border-[#004d00] 
                        active:border-b-2 active:translate-y-1"
                    >
                    Let&apos;s Connect!
                    </button>
                </Link>
            </div>
    );
}