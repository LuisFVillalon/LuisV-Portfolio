import React from 'react';

export const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-[#0A0A23]/10 p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-sans text-xl md:text-2xl font-extrabold text-[#0A0A23] mb-4">
    {children}
  </h2>
);
