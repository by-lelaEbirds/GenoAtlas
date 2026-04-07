import React, { memo, useMemo } from 'react';
import { Cloud } from 'lucide-react';

function ParallaxBackground({
  bgNebulaRef,
  bgCloudsRef,
  bgLayer3Ref,
  bgStarsRef,
  isDarkMode,
  isMobile,
  isBatterySaverMode,
  isReducedEffectsMode,
}) {
  const useLiteScene = isBatterySaverMode || isReducedEffectsMode || isMobile;

  const starPositions = useMemo(() => {
    const count = useLiteScene ? 20 : 88;
    const darkColors = ['bg-white', 'bg-cyan-200', 'bg-fuchsia-200', 'bg-indigo-100', 'bg-amber-200'];
    const lightColors = ['bg-white', 'bg-amber-100', 'bg-sky-200', 'bg-white', 'bg-cyan-100'];

    return [...Array(count)].map((_, index) => {
      const colors = isDarkMode ? darkColors : lightColors;
      return {
        color: colors[index % colors.length],
        size: (index % 6) * 0.8 + 1.2,
        left: (index * 17 + 31) % 100,
        top: (index * 23 + 7) % 100,
        duration: (index % 8) + 6.5,
        delay: (index % 5) * 1.15,
      };
    });
  }, [isDarkMode, useLiteScene]);

  const floatingParticles = useMemo(() => {
    const count = useLiteScene ? 0 : 12;
    return [...Array(count)].map((_, index) => ({
      left: ((index * 19 + 13) % 90) + 5,
      size: (index % 4) + 2,
      delay: (index * 2.1) % 16,
      speed: index % 2 === 0 ? 'animate-drift-up' : 'animate-drift-up-slow',
      top: (index * 11 + 18) % 72,
    }));
  }, [useLiteScene]);

  const cloudPositions = useMemo(() => {
    return isDarkMode
      ? [
          { top: 8, left: 4, size: useLiteScene ? 74 : 128, opacity: 0.54 },
          { top: 20, right: 8, size: useLiteScene ? 62 : 104, opacity: 0.4 },
          ...(useLiteScene ? [] : [
            { top: 38, left: 72, size: 80, opacity: 0.34 },
            { top: 58, left: 12, size: 90, opacity: 0.24 },
            { top: 70, right: 10, size: 74, opacity: 0.18 },
          ]),
        ]
      : [
          { top: 9, left: 4, size: useLiteScene ? 76 : 132, opacity: 0.84 },
          { top: 20, right: 6, size: useLiteScene ? 64 : 104, opacity: 0.74 },
          ...(useLiteScene ? [] : [
            { top: 36, left: 72, size: 82, opacity: 0.7 },
            { top: 56, left: 12, size: 94, opacity: 0.58 },
            { top: 69, right: 11, size: 78, opacity: 0.5 },
          ]),
        ];
  }, [isDarkMode, useLiteScene]);

  const ribbonBands = useMemo(() => {
    if (useLiteScene) {
      return isDarkMode
        ? [
            {
              top: '18%',
              left: '-4%',
              width: '72%',
              height: '14%',
              background: 'linear-gradient(90deg, rgba(99,102,241,0.16), rgba(34,211,238,0.05), transparent)',
              rotate: '-8deg',
            },
          ]
        : [
            {
              top: '20%',
              left: '-6%',
              width: '74%',
              height: '14%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(186,230,253,0.18), transparent)',
              rotate: '-8deg',
            },
          ];
    }

    if (isDarkMode) {
      return [
        {
          top: '12%',
          left: '-6%',
          width: '76%',
          height: '18%',
          background: 'linear-gradient(90deg, rgba(99,102,241,0.22), rgba(34,211,238,0.08), transparent)',
          rotate: '-10deg',
        },
        {
          top: '40%',
          right: '-8%',
          width: '72%',
          height: '16%',
          background: 'linear-gradient(90deg, transparent, rgba(217,70,239,0.18), rgba(99,102,241,0.1))',
          rotate: '9deg',
        },
      ];
    }

    return [
      {
        top: '14%',
        left: '-8%',
        width: '78%',
        height: '18%',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.72), rgba(186,230,253,0.22), transparent)',
        rotate: '-9deg',
      },
      {
        top: '42%',
        right: '-10%',
        width: '74%',
        height: '15%',
        background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.18), rgba(253,230,138,0.12))',
        rotate: '8deg',
      },
    ];
  }, [isDarkMode, useLiteScene]);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'bg-[#120a28]' : 'bg-[#dff4ff]'}`}>
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'linear-gradient(180deg, rgba(14,7,37,1) 0%, rgba(30,18,70,1) 44%, rgba(17,24,39,1) 100%)'
            : 'linear-gradient(180deg, rgba(232,247,255,1) 0%, rgba(192,234,255,1) 54%, rgba(219,245,255,1) 100%)',
        }}
      />

      <div ref={bgNebulaRef} aria-hidden="true" className="absolute inset-[-22%] h-[144%] w-[144%] opacity-95 will-change-transform">
        {isDarkMode ? (
          <>
            <div className={`absolute left-[-14%] top-[-9%] h-[74vw] w-[74vw] max-h-[720px] max-w-[720px] rounded-full ${useLiteScene ? '' : 'animate-pulse-slow'}`} style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.42) 0%, rgba(49,46,129,0.16) 42%, transparent 72%)' }} />
            <div className={`absolute right-[-6%] top-[16%] h-[82vw] w-[82vw] max-h-[780px] max-w-[780px] rounded-full ${useLiteScene ? '' : 'animate-pulse-slow'}`} style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.28) 0%, rgba(112,26,117,0.08) 46%, transparent 74%)', animationDelay: '2.1s' }} />
            {!useLiteScene && <div className="absolute left-[2%] top-[54%] h-[58vw] w-[58vw] max-h-[540px] max-w-[540px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.24) 0%, transparent 72%)', animationDelay: '4.1s' }} />}
            {!useLiteScene && <div className="absolute bottom-[2%] right-[8%] h-[44vw] w-[44vw] max-h-[420px] max-w-[420px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 70%)', animationDelay: '5.8s' }} />}
          </>
        ) : (
          <>
            <div className={`absolute left-[-10%] top-[-6%] h-[64vw] w-[64vw] max-h-[660px] max-w-[660px] rounded-full ${useLiteScene ? '' : 'animate-pulse-slow'}`} style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 32%, transparent 70%)' }} />
            <div className={`absolute right-[-6%] top-[30%] h-[70vw] w-[70vw] max-h-[680px] max-w-[680px] rounded-full ${useLiteScene ? '' : 'animate-pulse-slow'}`} style={{ background: 'radial-gradient(circle, rgba(186,230,253,0.78) 0%, rgba(186,230,253,0.16) 44%, transparent 74%)', animationDelay: '2s' }} />
            {!useLiteScene && <div className="absolute left-[10%] top-[68%] h-[42vw] w-[42vw] max-h-[360px] max-w-[360px] rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(253,230,138,0.42) 0%, transparent 70%)', animationDelay: '4s' }} />}
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

      <div ref={bgStarsRef} aria-hidden="true" className="absolute inset-[-14%] h-[128%] w-[128%] will-change-transform">
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
              opacity: isDarkMode ? 0.72 : 0.62,
            }}
          />
        ))}

        {isDarkMode && !useLiteScene && (
          <>
            <div className="absolute right-[16%] top-[9%] h-[2px] w-[120px] bg-gradient-to-r from-white to-transparent animate-shooting-star opacity-85" />
            <div className="absolute right-[60%] top-[34%] h-[2px] w-[86px] bg-gradient-to-r from-cyan-200 to-transparent animate-shooting-star opacity-65" style={{ animationDelay: '1.4s' }} />
            <div className="absolute left-[14%] top-[22%] h-[2px] w-[96px] bg-gradient-to-r from-fuchsia-100 to-transparent animate-shooting-star opacity-45" style={{ animationDelay: '2.8s' }} />
          </>
        )}
      </div>

      <div ref={bgCloudsRef} aria-hidden="true" className="absolute inset-[-10%] h-[120%] w-[120%] will-change-transform">
        {ribbonBands.map((band, index) => (
          <div
            key={index}
            className="absolute rounded-[999px] blur-[28px] md:blur-[42px]"
            style={{
              top: band.top,
              left: band.left,
              right: band.right,
              width: band.width,
              height: band.height,
              background: band.background,
              transform: `rotate(${band.rotate})`,
            }}
          />
        ))}

        <div className={`absolute inset-x-[6%] top-[18%] h-[18vh] rounded-[999px] ${useLiteScene ? 'blur-[24px]' : 'blur-[40px]'} ${isDarkMode ? 'bg-indigo-400/8' : 'bg-white/45'}`} />
        {!useLiteScene && <div className={`absolute inset-x-[14%] top-[48%] h-[16vh] rounded-[999px] blur-[38px] ${isDarkMode ? 'bg-cyan-300/7' : 'bg-sky-200/35'}`} />}

        {cloudPositions.map((cloud, index) => (
          <div
            key={`${cloud.top}-${index}`}
            className={`absolute ${isDarkMode ? 'text-white/70' : 'text-white'} ${useLiteScene ? '' : 'animate-float'}`}
            style={{
              top: `${cloud.top}%`,
              left: cloud.left !== undefined ? `${cloud.left}%` : undefined,
              right: cloud.right !== undefined ? `${cloud.right}%` : undefined,
              opacity: cloud.opacity,
              animationDuration: `${11 + index * 2.6}s`,
              animationDelay: `${index * 0.7}s`,
            }}
          >
            <Cloud size={cloud.size} className={isDarkMode ? 'fill-white/10' : 'fill-white/92'} />
          </div>
        ))}
      </div>

      <div ref={bgLayer3Ref} aria-hidden="true" className="absolute inset-[-8%] h-[116%] w-[116%] will-change-transform">
        {isDarkMode ? (
          <>
            <div className={`absolute bottom-[7%] left-[-10%] h-[28vh] w-[65vw] rounded-[50%] bg-cyan-500/12 ${useLiteScene ? 'blur-[24px]' : 'blur-[40px] md:blur-[70px]'}`} />
            <div className={`absolute bottom-[-4%] right-[-8%] h-[30vh] w-[62vw] rounded-[50%] bg-indigo-500/14 ${useLiteScene ? 'blur-[28px]' : 'blur-[46px] md:blur-[74px]'}`} />
            {!useLiteScene && <div className="absolute bottom-[12%] left-[18%] h-[14vh] w-[64vw] rounded-[100%] border border-white/6 bg-white/5 blur-[2px]" />}
            {!useLiteScene && <div className="absolute bottom-[18%] right-[16%] h-[8vh] w-[22vw] rounded-[100%] bg-fuchsia-400/10 blur-[18px]" />}
          </>
        ) : (
          <>
            <div className={`absolute bottom-[10%] left-[-10%] h-[28vh] w-[68vw] rounded-[50%] bg-emerald-200/45 ${useLiteScene ? 'blur-[20px]' : 'blur-[32px] md:blur-[52px]'}`} />
            <div className={`absolute bottom-[-2%] right-[-12%] h-[32vh] w-[72vw] rounded-[50%] bg-sky-100/90 ${useLiteScene ? 'blur-[20px]' : 'blur-[32px] md:blur-[52px]'}`} />
            {!useLiteScene && <div className="absolute bottom-[8%] left-[15%] h-[12vh] w-[70vw] rounded-[100%] bg-white/35 blur-[14px]" />}
            {!useLiteScene && <div className="absolute bottom-[18%] right-[18%] h-[8vh] w-[24vw] rounded-[100%] bg-amber-100/50 blur-[20px]" />}
          </>
        )}
      </div>

      <div aria-hidden="true" className="absolute inset-0">
        {floatingParticles.map((particle, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${particle.speed} will-change-transform ${isDarkMode ? 'bg-cyan-400/55' : 'bg-sky-400/35'}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(ParallaxBackground);
