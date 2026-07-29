'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop(): React.ReactElement {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`
        fixed bottom-6 left-6 z-50 p-3 rounded-full text-white shadow-lg
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        border-b-4 border-r-2 border-green-900
        active:scale-95 active:shadow-md active:border-b-2 active:translate-y-1
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      style={{ background: 'linear-gradient(to right, #22c55e, #3b82f6)' }}
    >
      <ArrowUp size={20} />
    </button>
  );
}
