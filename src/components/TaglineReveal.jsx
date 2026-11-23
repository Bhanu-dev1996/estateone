import React, { useEffect, useRef, useState } from 'react';

export default function TaglineReveal() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mandatory tagline copy per B11 (minimum 2 lines, outcome driven, zero hyphens)
  const statement = "Direct verified property connections with zero hidden fees. Discover authentic homes without the noise of duplicate listings.";
  const words = statement.split(' ');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          const start = windowHeight * 0.85;
          const end = windowHeight * 0.25;
          
          let progress = (start - rect.top) / (start - end);
          progress = Math.max(0, Math.min(1, progress));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-28 md:py-36 px-4 bg-brand-navy/95 backdrop-blur-3xl border-y border-white/10 text-white text-center flex flex-col items-center justify-center my-16 shadow-[0_25px_60px_rgba(0,0,0,0.3)] relative overflow-hidden"
    >
      {/* Subtle Apple Ambient Light Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[65ch] mx-auto relative z-10">
        <span className="caption-3 uppercase tracking-widest text-brand-gold mb-4 inline-block px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          The EstateOne Promise
        </span>

        {/* Heading 2 with word-by-word reveal */}
        <h2 className="text-h3 md:text-h2 tracking-tight text-balance leading-snug">
          {words.map((word, index) => {
            const wordThreshold = (index + 0.5) / words.length;
            const isRevealed = prefersReducedMotion || scrollProgress >= wordThreshold;

            return (
              <span
                key={`${word}-${index}`}
                className="inline-block mx-1 transition-all"
                style={{
                  color: isRevealed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.28)',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDuration: '500ms',
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Floating Glass Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 mkt-inline-stat">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-slate-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            <span>RERA verified documentation</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-slate-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            <span>Direct owner and agent channels</span>
          </div>
        </div>
      </div>
    </section>
  );
}
