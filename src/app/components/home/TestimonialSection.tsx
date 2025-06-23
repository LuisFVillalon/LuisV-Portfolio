'use client'
import React from 'react';
import { testimonialsArr } from '@/app/lib/testimonials';
import ReviewCard from '../Cards/ReviewCard';
import { useState } from 'react';

export default function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const goToPrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(currentIndex === 0 ? testimonialsArr.length - 1 : currentIndex - 1);
            setIsTransitioning(false);
        }, 150);
    };

    const goToNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(currentIndex >= testimonialsArr.length - 1 ? 0 : currentIndex + 1);
            setIsTransitioning(false);
        }, 150);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <p className="text-[#0A0A23] text-center dm-serif-text-regular text-lg">Testimonials:</p>
            {/* Carousel Container */}
            <div className="relative overflow-hidden">
                
                {/* Main Carousel Display */}
                <div className="relative grid grid-cols-3 md:flex justify-center items-center h-auto">
                    <div 
                        className={`grid grid-flow-col gap-6  w-full justify-center transition-all duration-300 ease-in-out ${
                            isTransitioning ? 'opacity-0 transform translate-x-2' : 'opacity-100 transform translate-x-0'
                        }`}
                    >
                      {testimonialsArr.map((testimonial, id) => {
                        return (
                           <ReviewCard
                              key={id}
                              quote={testimonial.quote}
                              name={testimonial.name}
                              job_title={testimonial.job_title}
                              company={testimonial.company}
                              fullQuote={false}
                            />   
                        );   
                      })}  
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    disabled={isTransitioning}
                    className="pt-8 pb-8 absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button
                    onClick={goToNext}
                    disabled={isTransitioning}
                    className="pt-8 pb-8 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}