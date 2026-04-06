import React, { memo, useMemo } from 'react';
import { Cloud } from 'lucide-react';

function ParallaxBackground({ bgNebulaRef, bgLayer3Ref, bgStarsRef, isDarkMode, isMobile, isBatterySaverMode }) {
  const starPositions = useMemo(() => {
    const count = isBatterySaverMode ? 18 : isMobile ? 34 : 72;
    const darkColors = ['bg-white', 'bg-cyan-200', 'bg-fuchsia-200', 'bg-indigo-100', 'bg-amber-200'];
    const lightColors = ['bg-white', 'bg-amber-100', 'bg-sky-200', 'bg-white'];

    return [...Array(count)].map((_, index) => {
      const colors = isDarkMode ? darkColors : lightColors;
      return {
        color: colors[index % colors.length],
        size: (index % 5) * 0.75 + 1.5,
        left: (index * 17 + 31) % 100,
        top: (index * 23 + 7) % 100,
        duration: (index % 8) + 6.5,
        delay: (index % 5) * 1.15,
      };
    });
  }, [isBatterySaverMode, isDarkMode, isMobile]);

  const floatingParticles = useMemo(() => {
    const count = isBatterySaverMode ? 0 : isMobile ? 4 : 9;
    return [...Array(count)].map((_, index) => ({
      left: ((index * 19 + 13) % 90) + 5,
      size: (index % 3) + 2,
      delay: (index * 2.3) % 15,
      speed: index % 2 === 0 ? 'animate-drift-up' : 'animate-drift-up-slow',
    }));
  }, [isBatterySaverMode, isMobile]);

  const cloudPositions = useMemo(() => {
    return isDarkMode
      ? [
          { top: 10, left: 6, size: isMobile ? 82 : 112, opacity: 0.55 },
          { top: 24, right: 8, size: isMobile ? 64 : 88, opacity: 0.38 },
          { top: 58, left: 72, size: isMobile ? 50 : 70, opacity: 0.26 },
        ]
      : [
          { top: 11, left: 5, size: isMobile ? 88 : 118, opacity: 0.85 },
          { top: 20, right: 7, size: isMobile ? 70 : 96, opacity: 0.8 },
          { top: 52, left: 74, size: isMobile ? 54 : 74, opacity: 0.72 },
        ];
  }, [isDarkMode, isMobile]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-1000 ${isDarkMode ? 'bg-[#120a28]' : 'bg-[#dff4ff]'}`}>
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'linear-gradient(180deg, rgba(14,7,37,1) 0%, rgba(30,18,70,1) 44%, rgba(17,24,39,1) 100%)'
            : 'linear-gradient(180deg, rgba(232,247,255,1) 0%, rgba(192,234,255,1) 54%, rgba(219,245,255,1) 100%)',
        }}
      />

      <div ref={bgNebulaRef} aria-hidden="true" className="absolute inset-[-20%] h-[140%] w-[140%] opacity-90 will-change-transform">
        {isDarkMode ? (
          <>
            <div className="absolute left-[-12%] top-[-8%] h-[70vw] w-[70vw] max-h-[700px] max-w-[700px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.42) 0%, rgba(49,46,129,0.16) 42%, transparent 72%)' }} />
            <div className="absolute right-[-4%] top-[18%] h-[80vw] w-[80vw] max-h-[760px] max-w-[760px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.26) 0%, rgba(112,26,117,0.08) 46%, transparent 74%)', animationDelay: '2.1s' }} />
            <div className="absolute left-[4%] top-[58%] h-[56vw] w-[56vw] max-h-[520px] max-w-[520px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.24) 0%, transparent 72%)', animationDelay: '4.1s' }} />
            <div className="absolute bottom-[2%] right-[8%] h-[42vw] w-[42vw] max-h-[400px] max-w-[400px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 70%)', animationDelay: '5.8s' }} />
          </>
        ) : (
          <>
            <div className="absolute left-[-10%] top-[-6%] h-[62vw] w-[62vw] max-h-[640px] max-w-[640px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 32%, transparent 70%)' }} />
            <div className="absolute right-[-6%] top-[32%] h-[68vw] w-[68vw] max-h-[660px] max-w-[660px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(186,230,253,0.75) 0%, rgba(186,230,253,0.16) 44%, transparent 74%)', animationDelay: '2s' }} />
            <div className="absolute left-[12%] top-[70%] h-[40vw] w-[40vw] max-h-[340px] max-w-[340px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(253,230,138,0.42) 0%, transparent 70%)', animationDelay: '4s' }} />
          </>
        )}

        <div
          className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.04]' : 'opacity-[0.11]'}`}
          style={{
            backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(129,140,248,0.5)' : 'rgba(56,189,248,0.28)'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? 'rgba(129,140,248,0.5)' : 'rgba(56,189,248,0.28)'} 1px, transparent 1px)`,
            backgroundSize: '92px 92px',
          }}
        />
      </div>

      <div ref={bgLayer3Ref} aria-hidden="true" className="absolute inset-[-8%] h-[116%] w-[116%] will-change-transform pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute bottom-[7%] left-[-10%] h-[28vh] w-[65vw] rounded-[50%] bg-cyan-500/12 blur-[40px] md:h-[30vh] md:blur-[70px]" />
            <div className="absolute bottom-[-4%] right-[-8%] h-[30vh] w-[62vw] rounded-[50%] bg-indigo-500/14 blur-[46px] md:blur-[74px]" />
            <div className="absolute bottom-[12%] left-[18%] h-[14vh] w-[64vw] rounded-[100%] border border-white/6 bg-white/5 blur-[2px]" />
          </>
        ) : (
          <>
            <div className="absolute bottom-[10%] left-[-10%] h-[28vh] w-[68vw] rounded-[50%] bg-emerald-200/45 blur-[32px] md:blur-[52px]" />
            <div className="absolute bottom-[-2%] right-[-12%] h-[32vh] w-[72vw] rounded-[50%] bg-sky-100/90 blur-[32px] md:blur-[52px]" />
            <div className="absolute bottom-[8%] left-[15%] h-[12vh] w-[70vw] rounded-[100%] bg-white/35 blur-[14px]" />
          </>
        )}
      </div>

      <div ref={bgStarsRef} aria-hidden="true" className="absolute inset-[-12%] h-[124%] w-[124%] will-change-transform">
        {starPositions.map((star, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${star.color} animate-twinkle`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              willChange: 'opacity, transform',
              opacity: isDarkMode ? 0.75 : 0.65,
            }}
          />
        ))}
      </div>

      <div aria-hidden="true" className="absolute inset-0">
        {cloudPositions.map((cloud, index) => (
          <div
            key={`${cloud.top}-${index}`}
            className={`absolute ${isDarkMode ? 'text-white/70' : 'text-white'} ${isBatterySaverMode ? '' : 'animate-float'}`}
            style={{
              top: `${cloud.top}%`,
              left: cloud.left !== undefined ? `${cloud.left}%` : undefined,
              right: cloud.right !== undefined ? `${cloud.right}%` : undefined,
              opacity: cloud.opacity,
              animationDuration: `${12 + index * 3}s`,
              animationDelay: `${index * 0.8}s`,
            }}
          >
            <Cloud size={cloud.size} className={isDarkMode ? 'fill-white/10' : 'fill-white/90'} />
          </div>
        ))}

        {isDarkMode && !isBatterySaverMode && !isMobile && (
          <>
            <div className="absolute right-[16%] top-[9%] h-[2px] w-[120px] bg-gradient-to-r from-white to-transparent animate-shooting-star opacity-85" />
            <div className="absolute right-[60%] top-[34%] h-[2px] w-[86px] bg-gradient-to-r from-cyan-200 to-transparent animate-shooting-star opacity-65" style={{ animationDelay: '1.4s' }} />
          </>
        )}

        {floatingParticles.map((particle, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${particle.speed} will-change-transform ${isDarkMode ? 'bg-cyan-400/55' : 'bg-sky-400/35'}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(ParallaxBackground);
