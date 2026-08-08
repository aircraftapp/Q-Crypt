import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(currentScroll > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Viewport Fixed Progress Bar Track & Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-950/60 backdrop-blur-sm pointer-events-none"
        aria-label="Reading progress bar"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-300 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(34,211,238,0.9)] relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Glowing tip light */}
          {scrollProgress > 0 && scrollProgress < 100 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-white blur-[1px] shadow-[0_0_8px_#38bdf8]" />
          )}
        </div>
      </div>

      {/* Floating Scroll Progress Pill Indicator (bottom-right above scroll-to-top) */}
      <div 
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-xl shadow-slate-950/80 backdrop-blur-md">
          {scrollProgress >= 98 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          )}
          <span>{Math.round(scrollProgress)}% Consumed</span>
        </div>
      </div>
    </>
  );
};
