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
            'Software',
            'Agentic AI',
            'Full-stack',
            'Back-end',
            'Front-end',
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
            <div className="gap-4 text-start justify-center items-center text-[#333333] flex flex-col  font-sans">
                <h1 className="text-center my-[1%] text-6xl md:text-6xl font-bold text-[#0A0A23]">Luis Fernando Villalón</h1>
                <h2 className="min-w-[280px] md:min-w-[400px] text-center flex flex-col font-bold text-[#0A0A23] min-h-[2rem] md:min-h-[3rem] justify-center items-center">
                    <p className='text-xl md:text-3xl font-normal text-[#B3B3B3]'>I bring experience as a(n)...</p>
                        <div className="flex text-2xl md:text-4xl">
                            {displayText ? (
                                <span className="typewriter-text border-r-2 border-[#0A0A23] pr-1 animate-pulse italic">
                                    {displayText}
                                </span>
                            ) : (
                                <div className="text-2xl md:text-4xl invisible">SPACE</div>
                            )}
                            <p className='pl-2'>Engineer</p>
                        </div>
                </h2>
                <Link href="/contact">
                    <button
                    className="
                        text-2xl p-2 m-2 rounded-md
                        text-white shadow-lg
                        transition-all duration-150
                        hover:shadow-xl hover:-translate-y-1
                        border-b-4 border-r-2 border-green-900
                        active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
                        font-sans font-extrabold 
                    "
                    style={{ 
                        background: 'linear-gradient(to right, #22c55e, #3b82f6)'
                    }}
                    >
                    Let&apos;s Connect!
                    </button>
                </Link>
            </div>
    );
}