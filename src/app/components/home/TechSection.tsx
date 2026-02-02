'use client';
import { useState, useEffect, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TechCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const techStack = [
        {
            name: 'Python',
            logo: '/tech_logos/python.png',
            href: 'https://www.python.org/'
        },
        {
            name: 'C++',
            logo: '/tech_logos/C++.png',
            href: 'https://cplusplus.com/'
        },
        {
            name: 'Java',
            logo: '/tech_logos/java.png',
            href: 'https://www.java.com/'
        },
        {
            name: 'JavaScript',
            logo: '/tech_logos/javascript.png',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
        },
        {
            name: 'TypeScript',
            logo: '/tech_logos/typescript.png',
            href: 'https://www.typescriptlang.org/'
        },
        {
            name: 'HTML',
            logo: '/tech_logos/html.png',
            href: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
        },
        {
            name: 'CSS',
            logo: '/tech_logos/css.png',
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
        },
        {
            name: 'Tailwind CSS',
            logo: '/tech_logos/tailwind.png',
            href: 'https://tailwindcss.com/'
        },
        {
            name: 'Next.js',
            logo: '/tech_logos/next.png',
            href: 'https://nextjs.org/'
        },
        {
            name: 'React.js',
            logo: '/tech_logos/react.png',
            href: 'https://react.dev/'
        },
        {
            name: 'React Native',
            logo: '/tech_logos/react-native.png',
            href: 'https://reactnative.dev/'
        },        
        {
            name: 'Node.js',
            logo: '/tech_logos/node.png',
            href: 'https://nodejs.org/'
        },
        // {
        //     name: 'Express.js',
        //     logo: '/tech_logos/express.png',
        //     href: 'https://expressjs.com/'
        // },
        {
            name: 'FastAPI',
            logo: '/tech_logos/fastapi.png',
            href: 'https://fastapi.tiangolo.com/'
        },        
        {
            name: 'MongoDB',
            logo: '/tech_logos/mongodb.png',
            href: 'https://www.mongodb.com/'
        },
        {
            name: 'Google Firebase',
            logo: '/tech_logos/firebase.png',
            href: 'https://firebase.google.com/'
        },
        // {
        //     name: 'Microsoft Azure SQL DB',
        //     logo: '/tech_logos/azure.png',
        //     href: 'https://azure.microsoft.com/en-us/products/azure-sql/database/'
        // },
        {
            name: 'PostgreSQL',
            logo: '/tech_logos/postgresql.png',
            href: 'https://www.postgresql.org/'
        },        
        {
            name: 'Github',
            logo: '/tech_logos/github.png',
            href: 'https://github.com/'
        },
        {
            name: 'Google Analytics',
            logo: '/tech_logos/googleanal.png',
            href: 'https://analytics.google.com/'
        }
    ];

    // Auto-scroll functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex >= techStack.length - 1 ? 0 : prevIndex + 1
                );
                setIsTransitioning(false);
            }, 150);
        }, 3000);

        return () => clearInterval(interval);
    }, [techStack.length]);

    const goToPrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(currentIndex === 0 ? techStack.length - 1 : currentIndex - 1);
            setIsTransitioning(false);
        }, 150);
    };

    const goToNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(currentIndex >= techStack.length - 1 ? 0 : currentIndex + 1);
            setIsTransitioning(false);
        }, 150);
    };

    const goToIndex = (index: SetStateAction<number>) => {
        if (isTransitioning || index === currentIndex) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 150);
    };

    // Calculate how many items to show based on screen size
    const getVisibleItems = () => {
        // Show different amounts based on container width
        return window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    };

    const [visibleItems, setVisibleItems] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setVisibleItems(getVisibleItems());
        };

        // Set initial value
        if (typeof window !== 'undefined') {
            setVisibleItems(getVisibleItems());
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Get the items to display
    const getDisplayedItems = () => {
        const items = [];
        for (let i = 0; i < visibleItems; i++) {
            const index = (currentIndex + i) % techStack.length;
            items.push(techStack[index]);
        }
        return items;
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <p className="text-[#0A0A23] text-center font-sans font-bold
                text-xl
            ">
                Tech Stack
            </p>
            {/* Carousel Container */}
            <div className="relative overflow-hidden">
                
                {/* Main Carousel Display */}
                <div className="relative h-32 md:h-40 flex items-center justify-center">
                    <div 
                        className={`flex gap-4 md:gap-8 w-full justify-center transition-all duration-300 ease-in-out ${
                            isTransitioning ? 'opacity-0 transform translate-x-2' : 'opacity-100 transform translate-x-0'
                        }`}
                    >
                        {getDisplayedItems().map((tech, index) => (
                            <div 
                                key={`${tech.name}-${index}`}
                                className={`flex flex-col items-center justify-center min-w-0 flex-1 max-w-xs transition-all duration-300 ease-in-out ${
                                    isTransitioning ? 'scale-95' : 'scale-100'
                                }`}
                            >
                                <Link href={tech.href} target="_blank" rel="noopener noreferrer">
                                    <Image
                                        src={tech.logo}
                                        alt={`${tech.name} logo`}
                                        width={90}
                                        height={60}
                                        className="mb-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    disabled={isTransitioning}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button
                    onClick={goToNext}
                    disabled={isTransitioning}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center pb-4 space-x-2 mt-4">
                    {techStack.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            disabled={isTransitioning}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                                index === currentIndex 
                                    ? 'bg-blue-600 scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}