import React, { useState, useEffect } from 'react';
import { Trophy, Compass, Lock, Home, Settings, Shield, GraduationCap, Calendar, CheckCircle, Globe, X, ChevronRight, ShoppingCart, Cloud, TreePine, Mountain, Sparkles, Map, Star, Zap, Moon, Sun } from 'lucide-react';
import AdBanner from './AdBanner';
import { saveNativeData } from '../utils/storage';

export default function StartScreen({ onStart, onStudy, onFootball, onDaily, onOpenAchievements, onOpenTutorial, onOpenSettings, coins, setCoins, currentTheme, setTheme, themes, unlockedThemes, setUnlockedThemes, dailyCompleted, activeAvatar, setShowShop, isDarkMode, toggleDarkMode }) {
  
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [isClosingRegion, setIsClosingRegion] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  const themeNodes = Object.values(themes);
  const currentIndex = themeNodes.findIndex(t => t.id === currentTheme.id);
  
  const stepHeight = isMobile ? 610 : 808; 
  const pinOffset = currentIndex * stepHeight;

  return (
    <div className={`absolute inset-0 z-40 overflow-y-auto overflow-x-hidden custom-scrollbar pb-[400px] ${isDarkMode ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 via-sky-100 to-white'}`}>
      
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
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
        
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-1000px) translateY(1000px) rotate(-45deg); opacity: 0; }
        }
        .animate-shooting-star { animation: shooting-star 4s linear infinite; }
      `}</style>

      {/* FUNDO MÁGICO: Dia vs Noite Galáctica */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        {isDarkMode ? (
          <>
             <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse-slow"></div>
             <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-700 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
             <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
             {/* Estrelas Cadentes (Exclusivo Modo Escuro) */}
             <div className="absolute top-10 right-[20%] w-1 h-20 bg-gradient-to-b from-white to-transparent animate-shooting-star opacity-80 blur-[1px]"></div>
             <div className="absolute top-[40%] right-[10%] w-1 h-20 bg-gradient-to-b from-white to-transparent animate-shooting-star opacity-60 blur-[1px]" style={{animationDelay: '2s'}}></div>
          </>
        ) : (
          <>
             <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
             <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          </>
        )}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-100'}`} style={{ backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'} 2px, transparent 2px), linear-gradient(90deg, ${isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'} 2px, transparent 2px)`, backgroundSize: '96px 96px' }}></div>
      </div>

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        {[...Array(60)].map((_, i) => {
          const colors = isDarkMode ? ['bg-white', 'bg-cyan-200', 'bg-fuchsia-200', 'bg-indigo-300'] : ['bg-white', 'bg-amber-200', 'bg-sky-200', 'bg-emerald-200'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const isLarge = Math.random() > 0.8;
          return (
            <div 
              key={i}
              className={`absolute rounded-full animate-float ${color} animate-twinkle ${isLarge ? 'blur-[2px]' : 'blur-[1px]'}`}
              style={{
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDuration: Math.random() * 15 + 10 + 's',
                animationDelay: Math.random() * 5 + 's',
                boxShadow: `0 0 ${isLarge ? 15 : 8}px currentColor`
              }}
            ></div>
          );
        })}
      </div>
      
      {/* HEADER: Removido GenoAtlas, Adicionado Toggle Dark Mode */}
      <header className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 pt-[calc(1rem+env(safe-area-inset-top))] ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-white/50'} backdrop-blur-md border-b-2 shadow-sm transition-colors`}>
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg border-[3px] md:border-[4px] relative overflow-hidden group transition-all ${isDarkMode ? 'bg-gradient-to-br from-indigo-500 to-purple-700 border-indigo-300 ring-[3px] ring-indigo-900 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-gradient-to-br from-sky-400 to-sky-600 border-white ring-[3px] ring-sky-100'}`}>
            <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"></div>
            <Globe className="w-8 h-8 md:w-12 md:h-12 text-white relative z-10" strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={toggleDarkMode} className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-[3px] md:border-[4px] shadow-sm transition-all active:scale-95 ${isDarkMode ? 'bg-slate-800 border-slate-600 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-sky-100 border-sky-300 text-sky-600'}`}>
            {isDarkMode ? <Moon size={24} className="md:w-8 md:h-8" fill="currentColor"/> : <Sun size={24} className="md:w-8 md:h-8" fill="currentColor" />}
          </button>

          <div className={`border-b-[6px] md:border-b-[8px] px-4 md:px-8 py-2 md:py-3 rounded-full shadow-sm relative overflow-hidden ${isDarkMode ? 'bg-amber-500 border-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-amber-400 border-amber-600'}`} aria-label={`Você tem ${coins} moedas`}>
            <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" style={{animationDelay: '1.5s'}}></div>
            <span className="text-amber-950 font-black text-[18px] md:text-[24px] tracking-widest flex items-center gap-2 md:gap-3 whitespace-nowrap relative z-10">
              {coins} <span aria-hidden="true" className="text-amber-100 text-[20px] md:text-[24px] drop-shadow-md">🪙</span>
            </span>
          </div>
        </div>
      </header>

      {/* CARROSSEL DE MODOS EXTRAS */}
      <div className="relative z-10 pt-[calc(140px+env(safe-area-inset-top))] pb-8 animate-fade-in-up">
        <div className="px-4 md:px-12 mb-4 flex justify-between items-end">
          <h2 className={`text-[20px] md:text-[32px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-indigo-100' : 'text-sky-900'}`}><Map size={28} className={isDarkMode ? 'text-indigo-400' : 'text-sky-500'}/> Modos Extras</h2>
          <span className={`font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-1 ${isDarkMode ? 'text-indigo-400' : 'text-sky-600'}`}>Deslize <ChevronRight size={16}/></span>
        </div>
        
        <div className="flex gap-4 md:gap-8 overflow-x-auto px-4 md:px-12 pb-6 snap-x custom-scrollbar">
          <button aria-label="Modo de Jogo Diário" onClick={dailyCompleted ? null : onDaily} className={`snap-center shrink-0 w-[240px] md:w-[320px] p-6 rounded-[2.5rem] flex flex-col items-center justify-center border-[6px] md:border-[8px] transition-all group relative overflow-hidden ${dailyCompleted ? (isDarkMode ? 'bg-slate-800 border-slate-700 opacity-60' : 'bg-stone-300 border-stone-400 opacity-80 cursor-not-allowed') : (isDarkMode ? 'bg-rose-950/40 border-rose-900 hover:bg-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.2)]' : 'bg-rose-50 border-rose-200 hover:bg-rose-100 active:scale-95 shadow-lg')}`}>
            {!dailyCompleted && <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"></div>}
            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-4 border-[6px] shadow-inner relative z-10 ${dailyCompleted ? (isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-stone-400 border-stone-500 text-stone-200') : (isDarkMode ? 'bg-rose-600 border-rose-800 text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(225,29,72,0.6)]' : 'bg-rose-500 border-rose-600 text-white group-hover:scale-110 transition-transform')}`}>
              {dailyCompleted ? <CheckCircle size={40} strokeWidth={2.5}/> : <Calendar size={40} strokeWidth={2.5} />}
            </div>
            <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none relative z-10 ${dailyCompleted ? (isDarkMode ? 'text-slate-500' : 'text-stone-500') : (isDarkMode ? 'text-rose-200' : 'text-rose-800')}`}>Diário</span>
            <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 relative z-10 flex items-center gap-1 ${dailyCompleted ? (isDarkMode ? 'text-slate-600' : 'text-stone-400') : (isDarkMode ? 'text-rose-400' : 'text-rose-500')}`}>{dailyCompleted ? 'Feito hoje!' : <><Star size={14} className="fill-current"/> Recompensa 500🪙</>}</span>
          </button>

          <button aria-label="Modo de Jogo Futebol" onClick={onFootball} className={`snap-center shrink-0 w-[240px] md:w-[320px] border-[6px] md:border-[8px] p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all active:scale-95 group shadow-lg relative overflow-hidden ${isDarkMode ? 'bg-sky-950/40 border-sky-900 hover:bg-sky-900/50 shadow-[0_0_20px_rgba(14,165,233,0.2)]' : 'bg-sky-50 border-sky-200 hover:bg-sky-100'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"></div>
            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] border-[6px] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner relative z-10 ${isDarkMode ? 'bg-sky-600 border-sky-800 shadow-[0_0_15px_rgba(14,165,233,0.6)]' : 'bg-sky-500 border-sky-600'}`}>
              <Shield size={40} strokeWidth={2.5} />
            </div>
            <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none relative z-10 ${isDarkMode ? 'text-sky-200' : 'text-sky-800'}`}>Futebol</span>
            <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 relative z-10 flex items-center gap-1 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`}><Zap size={14} className="fill-current"/> Ache o Clube</span>
          </button>

          <button aria-label="Modo de Estudo" onClick={onStudy} className={`snap-center shrink-0 w-[240px] md:w-[320px] border-[6px] md:border-[8px] p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all active:scale-95 group shadow-lg relative overflow-hidden ${isDarkMode ? 'bg-emerald-950/40 border-emerald-900 hover:bg-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"></div>
            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] border-[6px] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner relative z-10 ${isDarkMode ? 'bg-emerald-600 border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-emerald-400 border-emerald-500 text-emerald-900'}`}>
              <GraduationCap size={40} strokeWidth={2.5} />
            </div>
            <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none relative z-10 ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Estudo</span>
            <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 relative z-10 flex items-center gap-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`}><Compass size={14} className="fill-current"/> Sem pressa</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 text-center mb-16 px-6 md:px-12 animate-fade-in-up mt-8">
        <div className={`inline-flex items-center gap-3 md:gap-4 px-8 py-3 md:px-12 md:py-4 rounded-full text-white shadow-lg border-b-[6px] md:border-b-[8px] relative overflow-hidden ${isDarkMode ? 'bg-indigo-600 border-indigo-800 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-sky-600 border-sky-800'}`}>
          <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
          <Compass className="w-6 h-6 md:w-10 md:h-10 relative z-10" strokeWidth={2.5} />
          <span className="font-black text-[20px] md:text-[32px] uppercase tracking-widest relative z-10">Sua Jornada</span>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center min-h-[4500px] pt-10">
        
        {/* AVATAR DESLIZANTE COM SOMBRA DINÂMICA */}
        <div 
          aria-hidden="true"
          className="absolute z-30 left-1/2 -translate-x-1/2 transition-all duration-[1200ms] ease-in-out flex flex-col items-center"
          style={{ transform: `translate(-50%, ${pinOffset}px)`, top: isMobile ? '-90px' : '-120px' }}
        >
          <div className={`bg-white w-[80px] h-[80px] md:w-[112px] md:h-[112px] rounded-[24px] md:rounded-[32px] border-[8px] md:border-[10px] border-amber-400 flex items-center justify-center animate-bounce-short relative z-10 ${isDarkMode ? 'shadow-[0_0_30px_rgba(251,191,36,0.6)]' : 'shadow-[0_15px_30px_rgba(0,0,0,0.2)]'}`}>
             {activeAvatar.type === 'emoji' ? (
                <span className="text-[40px] md:text-[56px] leading-none drop-shadow-sm">{activeAvatar.icon}</span>
             ) : (
                <img src={activeAvatar.icon} alt={activeAvatar.name} className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-sm" />
             )}
          </div>
          <div className="absolute -bottom-3 md:-bottom-4 w-0 h-0 border-l-[16px] md:border-l-[20px] border-l-transparent border-r-[16px] md:border-r-[20px] border-r-transparent border-t-[20px] md:border-t-[24px] border-t-amber-400 animate-bounce-short z-10"></div>
          
          <div className={`w-[40px] md:w-[60px] h-[10px] md:h-[15px] rounded-full mt-2 md:mt-4 blur-[2px] animate-shadow-scale ${isDarkMode ? 'bg-black/60' : 'bg-stone-900/20'}`}></div>
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
                className={`w-[160px] h-[160px] md:w-[208px] md:h-[208px] rounded-full flex items-center justify-center border-[10px] md:border-[12px] relative transition-all group z-20 overflow-hidden ${
                  isUnlocked 
                    ? isCurrent 
                      ? 'bg-amber-400 border-white shadow-[0_16px_0_#b45309,0_0_40px_rgba(251,191,36,0.8)] md:shadow-[0_24px_0_#b45309,0_0_60px_rgba(251,191,36,0.8)] active:translate-y-[12px] md:active:translate-y-[16px] active:shadow-[0_6px_0_#b45309]' 
                      : (isDarkMode ? 'bg-slate-800 border-slate-600 shadow-[0_8px_0_#334155,0_0_15px_rgba(255,255,255,0.1)] active:translate-y-[8px] hover:scale-105 active:shadow-none' : 'bg-white border-stone-300 shadow-[0_8px_0_#a8a29e] active:translate-y-[8px] active:shadow-none hover:scale-105')
                    : (isDarkMode ? 'bg-slate-900 border-slate-800 shadow-[0_14px_0_#0f172a] active:translate-y-[8px] active:shadow-none opacity-80' : 'bg-stone-300 border-stone-400 shadow-[0_14px_0_#78716c] active:translate-y-[8px] active:shadow-none opacity-90')
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
                className={`absolute -bottom-[40px] md:-bottom-[60px] px-8 py-3 md:px-12 md:py-5 rounded-full border-[3px] md:border-[4px] z-30 whitespace-nowrap scale-100 md:scale-110 transition-all active:scale-95 overflow-hidden ${isUnlocked ? (isDarkMode ? 'bg-slate-800 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-slate-700' : 'bg-white border-stone-300 shadow-xl hover:bg-stone-50') : (isDarkMode ? 'bg-slate-900 border-slate-800 cursor-not-allowed' : 'bg-stone-100 border-stone-300 cursor-not-allowed')}`}
              >
                {isUnlocked && isCurrent && <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0" style={{ animationDelay: '0.5s' }}></div>}
                <span className={`text-[18px] md:text-[24px] font-black uppercase tracking-widest relative z-10 flex items-center gap-2 ${isUnlocked ? (isDarkMode ? 'text-white' : 'text-stone-800') : (isDarkMode ? 'text-slate-600' : 'text-stone-400')}`}>
                  {isUnlocked && isCurrent ? <><Sparkles size={20} className="text-amber-500"/> Jogar Agora</> : t.name}
                </span>
              </button>

              {!isUnlocked && (
                <div aria-hidden="true" className="absolute -bottom-[100px] md:-bottom-[140px] flex flex-col items-center animate-pulse-slow pointer-events-none z-30">
                  <div className={`px-6 py-2 md:px-10 md:py-4 rounded-full border-2 shadow-xl flex items-center gap-2 md:gap-3 scale-100 md:scale-110 whitespace-nowrap min-w-max ${isDarkMode ? 'bg-amber-600 border-amber-800 shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'bg-amber-400 border-amber-500'}`}>
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
                      className={`w-4 h-4 md:w-6 md:h-6 rounded-full transition-colors duration-500 relative ${isNextUnlocked ? 'bg-amber-300 shadow-[inset_0_3px_6px_rgba(180,83,9,0.3),0_4px_15px_rgba(251,191,36,0.6)]' : (isDarkMode ? 'bg-slate-700 shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)]' : 'bg-stone-300 shadow-[inset_0_3px_6px_rgba(0,0,0,0.1)]')}`}
                      style={{ transform: `translateX(${offsetX}px)` }}
                    ></div>
                  );
                })}

                <div className={`absolute top-[15%] ${index % 2 === 0 ? 'left-[-60px] md:left-[-160px]' : 'right-[-60px] md:right-[-160px]'} animate-float opacity-80 drop-shadow-lg flex items-end`}>
                  {index % 3 === 0 ? (
                    <>
                      <Cloud size={isMobile ? 90 : 140} className={`absolute -top-4 -left-4 z-0 opacity-70 ${isDarkMode ? 'text-indigo-800 fill-indigo-950' : 'text-sky-200 fill-sky-50'}`} strokeWidth={2}/>
                      <Cloud size={isMobile ? 110 : 170} className={`z-10 ${isDarkMode ? 'text-indigo-700 fill-indigo-900' : 'text-sky-300 fill-sky-100'}`} strokeWidth={2}/>
                    </>
                  ) : index % 3 === 1 ? (
                    <>
                      <TreePine size={isMobile ? 80 : 120} className={`absolute -right-6 z-0 opacity-70 ${isDarkMode ? 'text-emerald-900 fill-emerald-950' : 'text-emerald-300 fill-emerald-100'}`} strokeWidth={2}/>
                      <TreePine size={isMobile ? 110 : 160} className={`z-10 ${isDarkMode ? 'text-emerald-800 fill-emerald-900' : 'text-emerald-400 fill-emerald-200'}`} strokeWidth={2}/>
                    </>
                  ) : (
                    <>
                      <Mountain size={isMobile ? 100 : 150} className={`absolute -right-4 z-0 opacity-70 ${isDarkMode ? 'text-slate-800 fill-slate-900' : 'text-stone-300 fill-stone-100'}`} strokeWidth={2}/>
                      <Mountain size={isMobile ? 120 : 180} className={`z-10 ${isDarkMode ? 'text-slate-700 fill-slate-800' : 'text-stone-400 fill-stone-200'}`} strokeWidth={2}/>
                    </>
                  )}
                </div>

                <div className={`absolute top-[70%] ${index % 2 === 0 ? 'right-[-40px] md:right-[-120px]' : 'left-[-40px] md:left-[-120px]'} animate-float opacity-70 drop-shadow-md`} style={{ animationDelay: '2s' }}>
                  {index % 2 === 0 ? <Cloud size={isMobile ? 70 : 110} className={isDarkMode ? 'text-indigo-800 fill-indigo-950' : 'text-sky-200 fill-sky-50'} strokeWidth={2}/> : <Sparkles size={isMobile ? 60 : 90} className="text-amber-200 fill-amber-50" strokeWidth={2}/>}
                </div>

              </div>
            </div>
          );
        })}

        <div aria-hidden="true" className="relative flex flex-col items-center opacity-80 mt-10 mb-40">
          <div className={`w-[180px] h-[180px] md:w-[248px] md:h-[248px] rounded-full flex items-center justify-center border-[12px] md:border-[16px] z-10 relative cursor-not-allowed ${isDarkMode ? 'bg-gradient-to-b from-rose-900 to-rose-950 border-rose-800 shadow-[0_20px_0_#4c0519,0_0_60px_rgba(225,29,72,0.2)]' : 'bg-gradient-to-b from-rose-500 to-rose-700 border-rose-300 shadow-[0_20px_0_#881337,0_0_60px_rgba(225,29,72,0.8)]'}`}>
            <Trophy className={`w-20 h-20 md:w-32 md:h-32 ${isDarkMode ? 'text-rose-400' : 'text-white'}`} strokeWidth={2.5} />
          </div>
          <div className={`absolute -bottom-10 md:-bottom-16 px-8 py-3 md:px-12 md:py-5 rounded-full border-[3px] md:border-[4px] z-20 shadow-2xl scale-100 md:scale-110 whitespace-nowrap ${isDarkMode ? 'bg-black border-rose-900' : 'bg-rose-900 border-rose-400'}`}>
            <span className="text-[16px] md:text-[24px] font-black text-rose-100 uppercase tracking-widest">A Lenda (Em Breve)</span>
          </div>
        </div>

        <div className="w-full mt-16 scale-125 md:scale-150 transform origin-top"><AdBanner dataAdSlot="START_SCREEN_SLOT" /></div>
      </div>

      <nav aria-label="Navegação Principal" className={`fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 md:px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 md:pt-6 border-t-2 rounded-t-[2.5rem] md:rounded-t-[4rem] transition-colors ${isDarkMode ? 'bg-slate-900/95 backdrop-blur-xl border-slate-800 shadow-[0px_-40px_80px_rgba(0,0,0,0.5)]' : 'bg-white/95 backdrop-blur-xl border-stone-200 shadow-[0px_-40px_80px_rgba(0,0,0,0.03)]'}`}>
        <button aria-label="Ir para Início" className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`}>
          <div className={`p-2.5 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] mb-1.5 md:mb-3 transition-colors ${isDarkMode ? 'bg-sky-950 group-active:bg-sky-900' : 'bg-sky-100 group-active:bg-sky-200'}`}><Home className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className="text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap">Início</span>
        </button>
        
        <button aria-label="Abrir Loja" onClick={() => setShowShop(true)} className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 relative overflow-hidden rounded-xl ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`}>
          <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0" style={{ animationDelay: '2s' }}></div>
          <div className={`p-2.5 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] mb-1.5 md:mb-3 transition-colors shadow-sm relative z-10 ${isDarkMode ? 'bg-emerald-950 group-active:bg-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-emerald-100 group-active:bg-emerald-200'}`}><ShoppingCart className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className="text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap relative z-10">Loja</span>
        </button>

        <button aria-label="Abrir Conquistas" onClick={onOpenAchievements} className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 ${isDarkMode ? 'text-slate-400 hover:text-amber-400' : 'text-stone-400 hover:text-amber-500'}`}>
          <div className={`p-2.5 md:p-4 mb-1.5 md:mb-3 rounded-[1.2rem] md:rounded-[1.8rem] transition-colors ${isDarkMode ? 'group-active:bg-slate-800' : 'group-active:bg-stone-100'}`}><Trophy className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className={`text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'group-hover:text-amber-400' : 'group-hover:text-amber-500'}`}>Conquistas</span>
        </button>
        
        <button aria-label="Abrir Configurações" onClick={onOpenSettings} className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-stone-400 hover:text-stone-700'}`}>
          <div className={`p-2.5 md:p-4 mb-1.5 md:mb-3 rounded-[1.2rem] md:rounded-[1.8rem] transition-colors ${isDarkMode ? 'group-active:bg-slate-800' : 'group-active:bg-stone-100'}`}><Settings className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className={`text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-stone-700'}`}>Ajustes</span>
        </button>
      </nav>

      {showRegionModal && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} backdrop-blur-md px-4 md:px-6 py-6 ${isClosingRegion ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div role="dialog" aria-label="Menu de Seleção de Região" className={`${isDarkMode ? 'bg-slate-900 border-slate-700 shadow-[0_0_30px_rgba(14,165,233,0.3)]' : 'bg-white border-stone-200 shadow-2xl'} border-b-[12px] md:border-b-[16px] p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative flex flex-col max-h-[85dvh] md:max-h-[90dvh] ${isClosingRegion ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
              <h2 className={`text-[32px] md:text-[48px] font-black uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>Onde Pousar?</h2>
              <button aria-label="Fechar Modal de Região" onClick={closeRegionModal} className={`p-3 md:p-4 rounded-full transition-all active:scale-95 ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-400' : 'bg-stone-100 text-stone-400 hover:bg-rose-100 hover:text-rose-500'}`}>
                <X className="w-6 h-6 md:w-10 md:h-10" strokeWidth={3} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-6 overflow-y-auto custom-scrollbar pb-4 pr-1 md:pr-2">
              <button onClick={() => handleRegionSelect('all')} className={`col-span-2 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center justify-center gap-3 md:gap-6 border-b-[8px] md:border-b-[10px] active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-0 transition-all relative overflow-hidden group ${isDarkMode ? 'bg-gradient-to-r from-sky-600 to-blue-700 border-sky-800 shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'bg-gradient-to-r from-sky-400 to-sky-500 border-sky-600 shadow-lg'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0"></div>
                <span aria-hidden="true" className="text-[40px] md:text-[64px] leading-none drop-shadow-md relative z-10">🌍</span>
                <span className="text-[20px] md:text-[32px] font-black text-white uppercase tracking-widest mt-1 md:mt-2 drop-shadow-sm relative z-10">Mundo Todo</span>
              </button>
              
              <button onClick={() => handleRegionSelect('Americas')} className={`border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all relative overflow-hidden group ${isDarkMode ? 'bg-emerald-950/40 border-emerald-900 hover:bg-emerald-900/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 shadow-sm'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-0"></div>
                <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">🌎</span>
                <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Américas</span>
              </button>

              <button onClick={() => handleRegionSelect('Europe')} className={`border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all relative overflow-hidden group ${isDarkMode ? 'bg-indigo-950/40 border-indigo-900 hover:bg-indigo-900/60 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-sm'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-0"></div>
                <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">🏰</span>
                <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>Europa</span>
              </button>
              
              <button onClick={() => handleRegionSelect('Asia')} className={`border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all relative overflow-hidden group ${isDarkMode ? 'bg-rose-950/40 border-rose-900 hover:bg-rose-900/60 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'bg-rose-50 border-rose-200 hover:bg-rose-100 shadow-sm'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-0"></div>
                <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">⛩️</span>
                <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-rose-200' : 'text-rose-800'}`}>Ásia</span>
              </button>

              <button onClick={() => handleRegionSelect('Africa')} className={`border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all relative overflow-hidden group ${isDarkMode ? 'bg-amber-950/40 border-amber-900 hover:bg-amber-900/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-amber-50 border-amber-200 hover:bg-amber-100 shadow-sm'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-0"></div>
                <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">🦁</span>
                <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>África</span>
              </button>

              <button onClick={() => handleRegionSelect('Oceania')} className={`col-span-2 border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center justify-center gap-3 md:gap-6 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all mt-1 md:mt-2 relative overflow-hidden group ${isDarkMode ? 'bg-teal-950/40 border-teal-900 hover:bg-teal-900/60 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'bg-teal-50 border-teal-200 hover:bg-teal-100 shadow-sm'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-0"></div>
                <span aria-hidden="true" className="text-[40px] md:text-[64px] leading-none drop-shadow-sm relative z-10">🦘</span>
                <span className={`text-[20px] md:text-[32px] font-black uppercase tracking-widest mt-1 md:mt-2 relative z-10 ${isDarkMode ? 'text-teal-200' : 'text-teal-800'}`}>Oceania</span>
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
