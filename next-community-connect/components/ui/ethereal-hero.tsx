'use client';

import { EtherealShadow } from './ethereal-shadow';

interface EtherealHeroProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function EtherealHero({ title, subtitle, children }: EtherealHeroProps) {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-deep via-green-mid to-green-light">
      {/* Ethereal Shadow Effect Background */}
      <div className="absolute inset-0">
        <EtherealShadow
          color="rgba(45, 74, 40, 0.8)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.8, scale: 1 }}
          sizing="fill"
          className="h-full w-full"
        />
      </div>
      
      {/* Additional gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(145,176,138,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(45,74,40,0.6)_0%,transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {children || (
          <>
            <h1 className="font-space text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-2px' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="font-outfit text-lg sm:text-xl text-white/75 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50">
        <div className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center">
          <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <span className="text-[11px] uppercase tracking-[1.5px]">Scroll</span>
      </div>
    </section>
  );
}

