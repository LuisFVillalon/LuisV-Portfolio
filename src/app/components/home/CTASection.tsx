import React from 'react';
import Link from 'next/link';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  contactPath?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

const CTASection: React.FC<CTAProps> = ({
  title = "Let’s Build Something Great Together",
  description = "Whether you need a sleek website, a custom web app, or a complete digital solution — I’m here to bring your vision to life. Reach out today and let’s make it happen.",
  className = "",
}) => {

  return (
    <div className={`bg-[#B3B3B3] rounded-xl bg-gray-50 py-12 m-4 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-[#0A0A23] dm-serif-text-regular text-3xl font-extrabold sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
        <Link href="/contact">
          <button className="text-2xl p-2 m-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-[#ffffff] shadow-lg transform active:scale-95 
              active:shadow-md transition-all duration-150 hover:shadow-xl hover:-translate-y-1 border-b-4 border-r-2 border-[#004d00] 
              active:border-b-2 active:translate-y-1 dm-serif-text-regular"
          >
            Let&apos;s Connect
          </button>        
        </Link>
      </div>
    </div>
  );
};

export default CTASection;