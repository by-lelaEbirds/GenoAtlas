import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Compass, Lock, Globe, ChevronRight, Cloud, TreePine, Mountain, Sparkles, Map, Star, Zap, Moon, Sun, Flame, TrendingUp } from 'lucide-react';
import AdBanner from './AdBanner';
import { saveNativeData } from '../utils/storage';

// Importando os componentes divididos
import ParallaxBackground from './StartScreenUI/ParallaxBackground';
import BottomNav from './StartScreenUI/BottomNav';
import RegionModal from './StartScreenUI/RegionModal';

export default function StartScreen({ onStart, onStudy, onFootball, onDaily, onOpenAchievements, onOpenSettings, coins, setCoins, currentTheme, setTheme, themes, unlockedThemes, setUnlockedThemes, dailyCompleted, activeAvatar, setShowShop, isDarkMode, toggleDarkMode }) {
  
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [isClosingRegion, setIsClosingRegion] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const bgNebulaRef = useRef(null);
  const bgStarsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeSelect = (theme) => {
    if (coins >= theme.price) {
      const newCoins = coins - theme.price;
      let newThemes = unlockedThemes;
      if (!unlockedThemes.includes(theme.id)) {
        newThemes = [...unlockedThemes, theme.id];
        setUnlockedThemes(newThemes);
        saveNativeData('geoGuessThemes', JSON.stringify(newThemes));
      }
      setCoins(newCoins); 
      saveNativeData('geoGuessCoins', newCoins);
      setTheme(theme);
    }
  };

  const handleRegionSelect = (regionId) => {
    setIsClosingRegion(true);
    setTimeout(() => {
      setShowRegionModal(false);
      setIsClosingRegion(false);
      onStart(regionId);
    }, 200);
  };

  const closeRegionModal = () => {
    setIsClosingRegion(true);
    setTimeout(() => {
      setShowRegionModal(false);
      setIsClosingRegion(false);
    }, 200);
  };

  const handleScroll = (e) => {
    const scrollY = e.target.scrollTop;
    if (bgNebulaRef.current) {
      bgNebulaRef.current.style.transform = `translateY(${-scrollY * 0.10}px)`;
    }
    if (bgStarsRef.current) {
      bgStarsRef.current.style.transform = `translateY(${-scrollY * 0.25}px)`;
    }
  };

  const themeNodes = Object.values(themes);
  const currentIndex = themeNodes.findIndex(t => t.id === currentTheme.id);
  
  const stepHeight = isMobile ? 610 : 808; 
  const pinOffset = currentIndex * stepHeight;

  return (
    <div className="absolute inset-0 z-40 overflow-hidden bg-black">
      
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50%, 100% { transform: translateX(150%) skewX(-15deg); }
        }
        .animate-sweep { animation: sweep 3s infinite; }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        
        @keyframes shadow-scale {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(0.6); opacity: 0.2; }
        }
        .animate-shadow-scale { animation: shadow-scale 2s infinite; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
        
        @keyframes shooting-star {
          0% { transform: rotate(135deg) translateX(0); opacity: 1; }
          100% { transform: rotate(135deg) translateX(150vw); opacity: 0; }
        }
        .animate-shooting-star { animation: shooting-star 4s linear infinite; }
      `}</style>

      {/* COMPONENTE DE FUNDO EXTRAÍDO */}
      <ParallaxBackground 
        bgNebulaRef={bgNebulaRef} 
        bgStarsRef={bgStarsRef} 
        isDarkMode={isDarkMode} 
        isMobile={isMobile} 
      />
      
      <div 
        className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-[400px]"
        onScroll={handleScroll}
      >

        {/* HEADER GLASS PREMIUM - AGORA APENAS COM MOEDAS E DARK MODE NA DIREITA */}
        {/* Adicionado pointer-events-none na barra para evitar bloqueio de touch no Android, 
            e pointer-events-auto apenas nos botões. */}
        <header className={`fixed top-0 w-full z-50 flex justify-end items-center px-4 md:px-12 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] transition-all pointer-events-none`}>
          <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <button onClick={toggleDarkMode} className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border transition-all active:scale-95 ${isDarkMode ? 'bg-black/40 backdrop-blur-md border-white/10 text-amber-300 hover:bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-white/80 backdrop-blur-md border-sky-200 text-sky-600 hover:bg-sky-100 shadow-sm'}`}>
              {isDarkMode ? <Moon size={20} className="md:w-6 md:h-6" fill="currentColor"/> : <Sun size={20} className="md:w-6 md:h-6" fill="currentColor" />}
            </button>

            <div className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full relative overflow-hidden border transition-all ${isDarkMode ? 'bg-amber-500/20 backdrop-blur-md border-amber-400/50 neon-glow-amber shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-white/90 backdrop-blur-md border-amber-200 shadow-md'}`} aria-label={`Você tem ${coins} moedas`}>
              <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" style={{animationDelay: '1.5s'}}></div>
              <span className={`font-black text-[16px] md:text-[22px] tracking-wider flex items-center gap-1.5 md:gap-2 whitespace-nowrap relative z-10 ${isDarkMode ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-amber-700'}`}>
                {coins} <span aria-hidden="true" className="text-[18px] md:text-[24px]">🪙</span>
              </span>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="relative z-10 pt-[calc(100px+env(safe-area-inset-top))] pb-6 animate-fade-in-up">
          <div className="relative w-full flex flex-col items-center justify-center py-8 md:py-14">
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className={`w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full border animate-orbit will-change-transform ${isDarkMode ? 'border-indigo-500/20' : 'border-sky-300/30'}`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full ${isDarkMode ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]'}`}></div>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.6)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}></div>
              </div>
              <div className={`absolute inset-0 w-[220px] h-[220px] md:w-[340px] md:h-[340px] rounded-full border animate-orbit-reverse will-change-transform m-auto ${isDarkMode ? 'border-fuchsia-500/15' : 'border-amber-300/25'}`}>
                <div className={`absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isDarkMode ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}></div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">
              {/* ÍCONE OFICIAL DO JOGO NO CENTRO (Substituindo o antigo Globe) */}
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 border-4 animate-float-cinematic overflow-hidden relative ${isDarkMode ? 'bg-indigo-900/40 border-indigo-400/40 neon-glow-fuchsia' : 'bg-white border-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.4)]'}`}>
                <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-20"></div>
                <img 
                  src={`${import.meta.env.BASE_URL}assets/icon.png`} 
                  alt="GenoAtlas Logo Oficial" 
                  className="w-full h-full object-cover relative z-10" 
                />
              </div>
              <h1 className={`text-[48px] md:text-[72px] font-black uppercase tracking-tighter leading-[0.85] mb-3 ${isDarkMode ? 'text-white animate-text-glow' : 'text-sky-900 animate-text-glow-light'}`}>
                Geno<span className={isDarkMode ? 'text-cyan-400' : 'text-sky-500'}>Atlas</span>
              </h1>
              <p className={`text-[14px] md:text-[18px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-indigo-300/80' : 'text-sky-600/80'}`}>
                Explore • Aprenda • Domine
              </p>
            </div>

            <div className="flex gap-3 md:gap-5 mt-8 md:mt-12 w-full max-w-sm md:max-w-lg px-4">
              <div className={`flex-1 rounded-[1.2rem] p-3 md:p-4 flex flex-col items-center border transition-all animate-slide-in-left ${isDarkMode ? 'glass-panel border-white/10 hover:neon-glow-cyan' : 'glass-panel-light border-stone-200 hover:shadow-md'}`} style={{animationDelay: '0.2s'}}>
                <Globe className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${isDarkMode ? 'text-cyan-400' : 'text-sky-500'}`} strokeWidth={2.5}/>
                <span className={`text-[20px] md:text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>195</span>
                <span className={`text-[9px] md:text-[11px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Países</span>
              </div>
              <div className={`flex-1 rounded-[1.2rem] p-3 md:p-4 flex flex-col items-center border transition-all animate-fade-in-up ${isDarkMode ? 'glass-panel border-white/10 hover:neon-glow-amber' : 'glass-panel-light border-stone-200 hover:shadow-md'}`} style={{animationDelay: '0.4s'}}>
                <Flame className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} strokeWidth={2.5}/>
                <span className={`text-[20px] md:text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>3</span>
                <span className={`text-[9px] md:text-[11px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Modos</span>
              </div>
              <div className={`flex-1 rounded-[1.2rem] p-3 md:p-4 flex flex-col items-center border transition-all animate-slide-in-right ${isDarkMode ? 'glass-panel border-white/10 hover:neon-glow-emerald' : 'glass-panel-light border-stone-200 hover:shadow-md'}`} style={{animationDelay: '0.6s'}}>
                <TrendingUp className={`w-5 h-5 md:w-6 md:h-6 mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} strokeWidth={2.5}/>
                <span className={`text-[20px] md:text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>∞</span>
                <span className={`text-[9px] md:text-[11px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Diversão</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARROSSEL DE MODOS */}
        <div className="relative z-10 pb-8 animate-fade-in-up">
          <div className="px-4 md:px-12 mb-4 flex justify-between items-end">
            <h2 className={`text-[20px] md:text-[32px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-sky-900'}`}><Map size={24} className={isDarkMode ? 'text-cyan-400' : 'text-sky-500'}/> Modos de Jogo</h2>
            <span className={`font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-1 ${isDarkMode ? 'text-indigo-300' : 'text-sky-600'}`}>Deslize <ChevronRight size={16}/></span>
          </div>
          
          <div className="flex gap-4 md:gap-8 overflow-x-auto px-4 md:px-12 pb-12 snap-x custom-scrollbar pt-10">
            <button aria-label="Modo de Jogo Diário" onClick={dailyCompleted ? null : onDaily} className={`snap-center shrink-0 w-[240px] md:w-[320px] p-6 rounded-[2rem] flex flex-col items-center justify-center transition-all group relative overflow-visible ${dailyCompleted ? (isDarkMode ? 'glass-panel opacity-60 cursor-not-allowed' : 'bg-stone-300/80 border border-stone-400 opacity-80 cursor-not-allowed') : (isDarkMode ? 'glass-panel hover:neon-glow-rose hover:border-rose-500/50' : 'glass-panel-light border-rose-200 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:border-rose-400 active:scale-95')}`}>
              {!dailyCompleted && <div className={`absolute -top-5 -right-4 text-[12px] md:text-[14px] font-black px-4 py-1.5 rounded-full border border-white/20 animate-bounce-short z-20 ${isDarkMode ? 'bg-rose-500/90 backdrop-blur-md text-white neon-glow-rose' : 'bg-rose-500 text-white shadow-lg'}`}>💎 +500</div>}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                {!dailyCompleted && <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>}
              </div>
              <div className="relative text-rose-300 animate-float-cinematic will-change-transform z-10 w-[140px] h-[140px] md:w-[180px] md:h-[180px] flex items-center justify-center -mt-16 mb-2">
                 <div className={`absolute inset-0 rounded-full blur-[30px] opacity-40 z-0 ${dailyCompleted ? 'bg-slate-500' : 'bg-rose-500'}`}></div>
                 <img src={`${import.meta.env.BASE_URL}assets/icons/Diar.png`} alt="Diário" className={`relative z-10 w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 ${dailyCompleted ? 'grayscale opacity-70' : ''}`} />
              </div>
              <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none relative z-10 mt-2 ${dailyCompleted ? (isDarkMode ? 'text-slate-500' : 'text-stone-500') : (isDarkMode ? 'text-rose-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-rose-800')}`}>Diário</span>
              <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 relative z-10 flex items-center gap-1 ${dailyCompleted ? (isDarkMode ? 'text-slate-600' : 'text-stone-400') : (isDarkMode ? 'text-rose-300' : 'text-rose-500')}`}>{dailyCompleted ? 'Feito hoje!' : <><Star size={14} className="fill-current"/> Hoje</>}</span>
            </button>

            <button aria-label="Modo de Jogo Futebol" onClick={onFootball} className={`snap-center shrink-0 w-[240px] md:w-[320px] p-6 rounded-[2rem] flex flex-col items-center justify-center transition-all active:scale-95 group relative overflow-visible ${isDarkMode ? 'glass-panel hover:neon-glow-cyan hover:border-cyan-500/50' : 'glass-panel-light border-sky-200 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:border-sky-400'}`}>
              <div className={`absolute -top-5 -right-4 text-[12px] md:text-[14px] font-black px-4 py-1.5 rounded-full border border-white/20 z-20 ${isDarkMode ? 'bg-cyan-500/90 backdrop-blur-md text-white neon-glow-cyan' : 'bg-sky-500 text-white shadow-lg'}`}>🔥 DESAFIO</div>
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </div>
              <div className="relative text-cyan-300 animate-float-cinematic will-change-transform z-10 w-[140px] h-[140px] md:w-[180px] md:h-[180px] flex items-center justify-center -mt-16 mb-2" style={{ animationDelay: '0.5s' }}>
                 <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[30px] opacity-40 z-0"></div>
                 <img src={`${import.meta.env.BASE_URL}assets/icons/Futb.png`} alt="Futebol" className="relative z-10 w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
              </div>
              <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none relative z-10 mt-2 ${isDarkMode ? 'text-cyan-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-sky-800'}`}>Futebol</span>
              <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 relative z-10 flex items-center gap-1 ${isDarkMode ? 'text-cyan-300' : 'text-sky-500'}`}><Zap size={14} className="fill-current"/> Teste sua mira</span>
            </button>

            <button aria-label="Modo de Estudo" onClick={onStudy} className={`snap-center shrink-0 w-[240px] md:w-[320px] p-6 rounded-[2rem] flex flex-col items-center justify-center transition-all active:scale-95 group relative overflow-visible ${isDarkMode ? 'glass-panel hover:neon-glow-emerald hover:border-emerald-500/50' : 'glass-panel-light border-emerald-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-emerald-400'}`}>
              <div className={`absolute -top-5 -right-4 text-[12px] md:text-[14px] font-black px-4 py-1.5 rounded-full border border-white/20 z-20 ${isDarkMode ? 'bg-emerald-500/90 backdrop-blur-md text-white neon-glow-emerald' : 'bg-emerald-500 text-white shadow-lg'}`}>🧘 ZEN</div>
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </div>
              <div className="relative text-emerald-300 animate-float-cinematic will-change-transform z-10 w-[140px] h-[140px] md:w-[180px] md:h-[180px] flex items-center justify-center -mt-16 mb-2" style={{ animationDelay: '1s' }}>
                 <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[30px] opacity-40 z-0"></div>
                 <img src={`${import.meta.env.BASE_URL}assets/icons/Estud.png`} alt="Estudo" className="relative z-10 w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
              </div>
              <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none relative z-10 mt-2 ${isDarkMode ? 'text-emerald-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-emerald-800'}`}>Estudo</span>
              <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 relative z-10 flex items-center gap-1 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'}`}><Compass size={14} className="fill-current"/> Sem pressa</span>
            </button>
          </div>
        </div>

        {/* MAPA DA JORNADA */}
        <div className="relative z-10 text-center mb-10 px-6 md:px-12 animate-fade-in-up mt-2">
          <div className={`inline-flex items-center gap-3 md:gap-4 px-8 py-3 md:px-12 md:py-5 rounded-full text-white relative overflow-hidden border ${isDarkMode ? 'glass-panel border-indigo-500/30 neon-glow-fuchsia' : 'glass-panel-light border-sky-300 text-sky-800 shadow-[0_0_20px_rgba(14,165,233,0.2)]'}`}>
            <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            <Compass className={`w-7 h-7 md:w-10 md:h-10 relative z-10 ${isDarkMode ? 'text-cyan-300' : 'text-sky-600'}`} strokeWidth={2.5} />
            <span className={`font-black text-[22px] md:text-[36px] uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-white' : 'text-sky-800'}`}>Sua Jornada</span>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center min-h-[4500px] pt-[120px] md:pt-[160px]">
          
          <div 
            aria-hidden="true"
            className="absolute z-30 left-1/2 -translate-x-1/2 transition-all duration-[1200ms] ease-in-out flex flex-col items-center"
            style={{ transform: `translate(-50%, ${pinOffset}px)`, top: '0px' }}
          >
            <div className={`bg-white w-[80px] h-[80px] md:w-[112px] md:h-[112px] rounded-[24px] md:rounded-[32px] border-[8px] md:border-[10px] border-amber-400 flex items-center justify-center animate-bounce-short relative z-10 ${isDarkMode ? 'shadow-[0_0_40px_rgba(251,191,36,0.8)]' : 'shadow-[0_15px_30px_rgba(0,0,0,0.3)]'}`}>
               {activeAvatar.type === 'emoji' ? (
                  <span className="text-[40px] md:text-[56px] leading-none drop-shadow-md">{activeAvatar.icon}</span>
               ) : (
                  <img src={activeAvatar.icon} alt={activeAvatar.name} className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-md" />
               )}
            </div>
            <div className="absolute -bottom-3 md:-bottom-4 w-0 h-0 border-l-[16px] md:border-l-[20px] border-l-transparent border-r-[16px] md:border-r-[20px] border-r-transparent border-t-[20px] md:border-t-[24px] border-t-amber-400 animate-bounce-short z-10"></div>
            <div className={`w-[40px] md:w-[60px] h-[10px] md:h-[15px] rounded-full mt-2 md:mt-4 blur-[3px] animate-shadow-scale ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/30'}`}></div>
          </div>

          {themeNodes.map((t, index) => {
            const isUnlocked = unlockedThemes.includes(t.id);
            const isCurrent = currentTheme.id === t.id;
            const nextTheme = themeNodes[index + 1];
            const isNextUnlocked = nextTheme ? unlockedThemes.includes(nextTheme.id) : false;

            return (
              <div key={t.id} className="relative flex flex-col items-center z-10 mb-[450px] md:mb-[600px] w-full max-w-[320px]">
                
                {isCurrent && (
                  <div className="absolute top-[80px] md:top-[104px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="absolute inset-0 rounded-full border-[8px] border-amber-400/50 w-[160px] h-[160px] md:w-[208px] md:h-[208px] -translate-x-1/2 -translate-y-1/2 animate-pulse-ring"></div>
                    <div className="absolute inset-0 rounded-full border-[8px] border-amber-400/30 w-[160px] h-[160px] md:w-[208px] md:h-[208px] -translate-x-1/2 -translate-y-1/2 animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
                  </div>
                )}

                <button 
                  aria-label={isUnlocked ? `Tema ${t.name} Desbloqueado` : `Desbloquear tema ${t.name} por ${t.price} moedas`}
                  onClick={() => {
                    if (isUnlocked) { 
                      setTheme(t); 
                      setShowRegionModal(true); 
                    } 
                    else { handleThemeSelect(t); }
                  }}
                  className={`w-[160px] h-[160px] md:w-[208px] md:h-[208px] rounded-full flex items-center justify-center border-[6px] md:border-[8px] relative transition-all group z-20 overflow-hidden ${
                    isUnlocked 
                      ? isCurrent 
                        ? `bg-amber-500 border-white neon-glow-amber hover:scale-105 z-30` 
                        : (isDarkMode ? 'glass-panel border-white/20 hover:neon-glow-cyan hover:border-cyan-400/50 hover:scale-105' : 'glass-panel-light border-stone-200 hover:shadow-xl hover:scale-105')
                      : (isDarkMode ? 'bg-slate-900 border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] opacity-60' : 'bg-stone-300 border-stone-400 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] opacity-70')
                  }`}
                >
                  {isUnlocked && isCurrent && <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-0"></div>}
                  
                  {isUnlocked ? (
                    <Compass className={`w-20 h-20 md:w-28 md:h-28 relative z-10 ${isCurrent ? 'text-amber-800' : (isDarkMode ? 'text-slate-400' : 'text-stone-400')}`} strokeWidth={2.5} />
                  ) : (
                    <Lock className={`w-16 h-16 md:w-24 md:h-24 relative z-10 ${isDarkMode ? 'text-slate-700' : 'text-stone-500'}`} strokeWidth={2.5} />
                  )}
                </button>

                <button 
                  aria-hidden="true"
                  tabIndex={-1}
                  onClick={() => {
                    if (isUnlocked) { setTheme(t); setShowRegionModal(true); } 
                    else { handleThemeSelect(t); }
                  }}
                  className={`absolute -bottom-[30px] md:-bottom-[45px] px-8 py-3 md:px-12 md:py-5 rounded-full border z-30 whitespace-nowrap scale-100 md:scale-110 transition-transform duration-300 active:scale-95 overflow-hidden ${isUnlocked ? (isCurrent ? 'bg-amber-500/90 border-amber-300 neon-glow-amber cursor-pointer animate-pulse-glow backdrop-blur-md' : (isDarkMode ? 'glass-panel border-white/20 hover:bg-white/10 cursor-pointer shadow-lg' : 'glass-panel-light border-stone-200 hover:bg-white cursor-pointer shadow-xl')) : (isDarkMode ? 'glass-panel opacity-50 cursor-not-allowed' : 'glass-panel-light opacity-50 cursor-not-allowed')}`}
                >
                  {isUnlocked && isCurrent && <div className="absolute inset-0 -translate-x-[150%] animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 z-0"></div>}
                  <span className={`text-[18px] md:text-[24px] font-black uppercase tracking-widest relative z-10 flex items-center gap-2 ${isUnlocked ? (isCurrent ? 'text-amber-950' : (isDarkMode ? 'text-white' : 'text-stone-800')) : (isDarkMode ? 'text-slate-600' : 'text-stone-400')}`}>
                    {isUnlocked && isCurrent ? <><Sparkles size={20} className="text-amber-950"/> <span className="drop-shadow-sm">Jogar Agora</span></> : t.name}
                  </span>
                </button>

                {!isUnlocked && (
                  <div aria-hidden="true" className="absolute -bottom-[100px] md:-bottom-[140px] flex flex-col items-center animate-pulse-slow pointer-events-none z-30">
                    <div className={`px-6 py-2 md:px-10 md:py-4 rounded-full border-2 shadow-xl flex items-center gap-2 md:gap-3 scale-100 md:scale-110 whitespace-nowrap min-w-max ${isDarkMode ? 'bg-amber-600 border-amber-800 shadow-[0_0_20px_rgba(217,119,6,0.4)]' : 'bg-amber-400 border-amber-500'}`}>
                      <Lock className={`w-5 h-5 md:w-7 md:h-7 ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}/>
                      <span className={`text-[18px] md:text-[24px] font-black ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}>Desbloquear: {t.price} 🪙</span>
                    </div>
                  </div>
                )}

                <div aria-hidden="true" className="absolute top-[160px] md:top-[208px] left-1/2 -translate-x-1/2 h-[450px] md:h-[600px] w-full flex flex-col items-center justify-evenly py-10 md:py-16 z-0 pointer-events-none">
                  {[...Array(isMobile ? 4 : 5)].map((_, i) => {
                    const totalStones = isMobile ? 4 : 5;
                    const progress = (i + 1) / (totalStones + 1);
                    const offsetBase = isMobile ? 60 : 100;
                    const curveDirection = index % 2 === 0 ? 1 : -1;
                    const offsetX = Math.sin(progress * Math.PI) * offsetBase * curveDirection;

                    return (
                      <div 
                        key={i} 
                        className={`w-4 h-4 md:w-6 md:h-6 rounded-full transition-colors duration-500 relative ${isNextUnlocked ? (isDarkMode ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8),inset_0_3px_6px_rgba(180,83,9,0.5)]' : 'bg-amber-300 shadow-[inset_0_3px_6px_rgba(180,83,9,0.3),0_4px_15px_rgba(251,191,36,0.6)]') : (isDarkMode ? 'bg-slate-700 shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)]' : 'bg-stone-300 shadow-[inset_0_3px_6px_rgba(0,0,0,0.1)]')}`}
                        style={{ transform: `translateX(${offsetX}px)` }}
                      ></div>
                    );
                  })}

                  <div className={`absolute top-[15%] ${index % 2 === 0 ? 'left-[-60px] md:left-[-160px]' : 'right-[-60px] md:right-[-160px]'} animate-float opacity-90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex items-end`}>
                    {index % 3 === 0 ? (
                      <>
                        <Cloud size={isMobile ? 90 : 140} className={`absolute -top-4 -left-4 z-0 opacity-80 ${isDarkMode ? 'text-indigo-600 fill-indigo-900' : 'text-sky-200 fill-sky-50'}`} strokeWidth={2}/>
                        <Cloud size={isMobile ? 110 : 170} className={`z-10 ${isDarkMode ? 'text-indigo-400 fill-indigo-700' : 'text-sky-300 fill-sky-100'}`} strokeWidth={2}/>
                      </>
                    ) : index % 3 === 1 ? (
                      <>
                        <TreePine size={isMobile ? 80 : 120} className={`absolute -right-6 z-0 opacity-80 ${isDarkMode ? 'text-emerald-700 fill-emerald-950' : 'text-emerald-300 fill-emerald-100'}`} strokeWidth={2}/>
                        <TreePine size={isMobile ? 110 : 160} className={`z-10 ${isDarkMode ? 'text-emerald-500 fill-emerald-800' : 'text-emerald-400 fill-emerald-200'}`} strokeWidth={2}/>
                      </>
                    ) : (
                      <>
                        <Mountain size={isMobile ? 100 : 150} className={`absolute -right-4 z-0 opacity-80 ${isDarkMode ? 'text-slate-600 fill-slate-900' : 'text-stone-300 fill-stone-100'}`} strokeWidth={2}/>
                        <Mountain size={isMobile ? 120 : 180} className={`z-10 ${isDarkMode ? 'text-slate-400 fill-slate-700' : 'text-stone-400 fill-stone-200'}`} strokeWidth={2}/>
                      </>
                    )}
                  </div>

                  <div className={`absolute top-[70%] ${index % 2 === 0 ? 'right-[-40px] md:right-[-120px]' : 'left-[-40px] md:left-[-120px]'} animate-float opacity-90 drop-shadow-lg`} style={{ animationDelay: '2s' }}>
                    {index % 2 === 0 ? <Cloud size={isMobile ? 70 : 110} className={isDarkMode ? 'text-indigo-500 fill-indigo-800' : 'text-sky-200 fill-sky-50'} strokeWidth={2}/> : <Sparkles size={isMobile ? 60 : 90} className="text-amber-300 fill-amber-100" strokeWidth={2}/>}
                  </div>

                </div>
              </div>
            );
          })}

          <div aria-hidden="true" className="relative flex flex-col items-center opacity-90 mt-10 mb-40">
            <div className={`w-[180px] h-[180px] md:w-[248px] md:h-[248px] rounded-full flex items-center justify-center border-[6px] md:border-[8px] z-10 relative cursor-not-allowed overflow-hidden ${isDarkMode ? 'glass-panel border-rose-500/50 neon-glow-rose' : 'glass-panel-light border-rose-300 ring-4 ring-rose-200'}`}>
              <div className="absolute inset-0 bg-rose-500/20 rounded-full"></div>
              <Trophy className={`w-20 h-20 md:w-32 md:h-32 mb-4 relative z-10 ${isDarkMode ? 'text-rose-400 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]' : 'text-rose-500 drop-shadow-md'}`} strokeWidth={2.5} />
            </div>
            <div className={`absolute -bottom-8 md:-bottom-12 px-8 py-3 md:px-12 md:py-5 rounded-full border z-20 shadow-2xl scale-100 md:scale-110 whitespace-nowrap ${isDarkMode ? 'bg-black/80 backdrop-blur-md border border-rose-500/50 neon-glow-rose' : 'bg-rose-900 border border-rose-400 shadow-[0_15px_30px_rgba(225,29,72,0.4)]'}`}>
              <span className="text-[16px] md:text-[24px] font-black text-rose-100 uppercase tracking-widest">A Lenda (Em Breve)</span>
            </div>
          </div>

          <div className="w-full mt-16 scale-125 md:scale-150 transform origin-top"><AdBanner dataAdSlot="START_SCREEN_SLOT" /></div>
        </div>

      </div>

      {/* COMPONENTE DE NAVEGAÇÃO EXTRAÍDO */}
      <BottomNav 
        onOpenAchievements={onOpenAchievements}
        onOpenSettings={onOpenSettings}
        setShowShop={setShowShop}
        isDarkMode={isDarkMode}
      />

      {/* COMPONENTE DE MODAL EXTRAÍDO */}
      <RegionModal 
        showRegionModal={showRegionModal}
        isClosingRegion={isClosingRegion}
        closeRegionModal={closeRegionModal}
        handleRegionSelect={handleRegionSelect}
        isDarkMode={isDarkMode}
      />
      
    </div>
  );
}
