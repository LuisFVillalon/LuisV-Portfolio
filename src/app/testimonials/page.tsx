"use client";
import Navbar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import Wrapper from '@/app/components/Wrapper';
import { testimonialsArr } from '../lib/testimonials';
import ReviewCard from '../components/Cards/ReviewCard';
import CTASection from '@/app/components/CTASection';
    
export default function Testimonials() {
    return (

      <div className="flex font-[Monospace] flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
        
        <Navbar />
        <Wrapper>
            <div className="mt-6 text-center mb-3">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 dm-serif-text-regular">What People Say</h1>
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                    Testimonials from employers, mentors, and collaborators.
                </p>
            </div>
            <div className=" grid md:grid-cols-3 md:gap-10 justify-center items-start ">
                {testimonialsArr.map((testimonial, id) => {
                return (
                    <ReviewCard
                    key={id}
                    quote={testimonial.quote}
                    name={testimonial.name}
                    job_title={testimonial.job_title}
                    company={testimonial.company}
                    fullQuote={true}
                    />
                );
                })}
            </div>
          <CTASection/>
        </Wrapper>
        <Footer />

      </div>        

    );
  }