import React, { useMemo } from 'react';

export default function ParallaxBackground({ bgNebulaRef, bgLayer3Ref, bgStarsRef, isDarkMode, isMobile, isBatterySaverMode }) {
  const starPositions = useMemo(() => {
    const count = isBatterySaverMode ? 16 : isMobile ? 28 : 80;
    const darkColors = ['bg-white', 'bg-cyan-200', 'bg-fuchsia-200', 'bg-indigo-100', 'bg-amber-200'];
    const lightColors = ['bg-white', 'bg-amber-100', 'bg-sky-200', 'bg-white'];
    return [...Array(count)].map((_, i) => {
      const colors = isDarkMode ? darkColors : lightColors;
      return {
        color: colors[i % colors.length],
        size: (i % 5) * 0.8 + 1.5,
        left: ((i * 17 + 31) % 100),
        top: ((i * 23 + 7) % 100),
        duration: (i % 8) + 6,
        delay: (i % 5) * 1.2,
      };
    });
  }, [isBatterySaverMode, isMobile, isDarkMode]);

  const floatingParticles = useMemo(() => {
    const count = isBatterySaverMode ? 0 : isMobile ? 4 : 12;
    return [...Array(count)].map((_, i) => ({
      left: ((i * 19 + 13) % 90) + 5,
      size: (i % 3) + 2,
      delay: (i * 2.3) % 15,
      speed: i % 2 === 0 ? 'animate-drift-up' : 'animate-drift-up-slow',
    }));
  }, [isBatterySaverMode, isMobile]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 ${isDarkMode ? 'bg-indigo-950' : 'bg-sky-200'}`}>
      
      {/* LAYER 1: NEBULOSAS PROFUNDAS (Mais Lento - 10%) */}
      <div ref={bgNebulaRef} aria-hidden="true" className="absolute inset-[-20%] w-[140%] h-[140%] opacity-80 will-change-transform">
        {isDarkMode ? (
          <>
             <div className="absolute top-[-5%] left-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(79,70,229,0.40) 0%, rgba(49,46,129,0.15) 40%, transparent 70%)'}}></div>
             <div className="absolute top-[25%] right-[-5%] w-[85vw] h-[85vw] max-w-[800px] max-h-[800px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(162,28,175,0.30) 0%, rgba(112,26,117,0.10) 45%, transparent 70%)', animationDelay: '2s'}}></div>
             <div className="absolute top-[55%] left-[5%] w-[65vw] h-[65vw] max-w-[600px] max-h-[600px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(8,145,178,0.30) 0%, transparent 70%)', animationDelay: '4s'}}></div>
             <div className="absolute top-[80%] right-[10%] w-[50vw] h-[50vw] max-w-[450px] max-h-[450px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)', animationDelay: '6s'}}></div>
          </>
        ) : (
          <>
             <div className="absolute top-[-5%] left-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'}}></div>
             <div className="absolute top-[35%] right-[-5%] w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(186,230,253,0.6) 0%, transparent 70%)', animationDelay: '2s'}}></div>
             <div className="absolute top-[70%] left-[10%] w-[50vw] h-[50vw] max-w-[450px] max-h-[450px] rounded-full animate-pulse-slow" style={{background: 'radial-gradient(circle, rgba(253,230,138,0.4) 0%, transparent 70%)', animationDelay: '4s'}}></div>
          </>
        )}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.15]'}`} style={{ backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(129,140,248,0.6)' : 'rgba(56,189,248,0.4)'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? 'rgba(129,140,248,0.6)' : 'rgba(56,189,248,0.4)'} 1px, transparent 1px)`, backgroundSize: '80px 80px' }}></div>
      </div>

      {/* LAYER 1.5: POEIRA CÓSMICA / GALÁXIAS (NOVO PLANO DE FUNDO - Médio 18%) */}
      <div ref={bgLayer3Ref} aria-hidden="true" className="absolute inset-[-20%] w-[140%] h-[140%] opacity-70 will-change-transform mix-blend-screen pointer-events-none">
        {isDarkMode ? (
          <>
            {/* Esferas com altíssimo desfoque para criar volume sem bordas duras */}
            <div className="absolute top-[15%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-fuchsia-600/30 blur-[80px] md:blur-[120px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-[60%] right-[15%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-cyan-600/30 blur-[80px] md:blur-[120px] animate-pulse-slow" style={{animationDelay: '3s'}}></div>
          </>
        ) : (
          <>
            <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-white/60 blur-[60px] md:blur-[100px] animate-pulse-slow"></div>
            <div className="absolute top-[65%] right-[20%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-sky-100/60 blur-[60px] md:blur-[100px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          </>
        )}
      </div>

      {/* LAYER 2: CAMPO DE ESTRELAS (Rápido - 25%) */}
      <div ref={bgStarsRef} aria-hidden="true" className="absolute inset-[-20%] w-[140%] h-[140%] will-change-transform">
        {starPositions.map((star, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${star.color} animate-twinkle`}
            style={{
              width: `${star.size}px`, height: `${star.size}px`,
              left: `${star.left}%`, top: `${star.top}%`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              willChange: 'opacity, transform',
              opacity: 0.7,
            }}
          ></div>
        ))}
      </div>

      {/* PARTÍCULAS E ESTRELAS CADENTES */}
      <div aria-hidden="true" className="absolute inset-0">
        {isDarkMode && !isMobile && !isBatterySaverMode && (
          <>
             <div className="absolute top-[8%] right-[15%] w-[140px] h-[2px] bg-gradient-to-r from-white to-transparent animate-shooting-star opacity-90"></div>
             <div className="absolute top-[35%] right-[60%] w-[90px] h-[2px] bg-gradient-to-r from-cyan-200 to-transparent animate-shooting-star opacity-70" style={{animationDelay: '1.5s'}}></div>
             <div className="absolute top-[65%] right-[30%] w-[70px] h-[1px] bg-gradient-to-r from-fuchsia-200 to-transparent animate-shooting-star opacity-50" style={{animationDelay: '3s'}}></div>
          </>
        )}
        {floatingParticles.map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${p.speed} will-change-transform ${isDarkMode ? 'bg-cyan-400/60' : 'bg-sky-400/40'}`}
            style={{
              width: `${p.size}px`, height: `${p.size}px`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
