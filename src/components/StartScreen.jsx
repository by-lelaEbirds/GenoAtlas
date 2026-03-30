import React, { useState, useEffect } from 'react';
import { Trophy, Compass, Lock, Home, Settings, Shield, GraduationCap, Calendar, CheckCircle, Globe, MapPin, X, ChevronRight, ShoppingCart } from 'lucide-react';
import AdBanner from './AdBanner';
import { Preferences } from '@capacitor/preferences';

const saveNativeData = async (key, val) => {
  try { await Preferences.set({ key, value: val.toString() }); } catch (e) {}
};

export default function StartScreen({ onStart, onStudy, onFootball, onDaily, onOpenAchievements, onOpenTutorial, onOpenSettings, coins, setCoins, currentTheme, setTheme, themes, unlockedThemes, setUnlockedThemes, dailyCompleted, activeAvatar, setShowShop }) {
  
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
    <div className="absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 via-sky-100 to-white overflow-y-auto overflow-x-hidden custom-scrollbar pb-[400px]">
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 2px, transparent 2px)', backgroundSize: '96px 96px' }}></div>
      </div>
      
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 pt-[calc(1rem+env(safe-area-inset-top))] bg-white/80 backdrop-blur-md border-b-2 border-white/50 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 shadow-sm border-[3px] md:border-[4px] border-white ring-[3px] md:ring-[4px] ring-sky-100">
            <Globe className="w-7 h-7 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-black italic tracking-tighter text-[24px] md:text-[40px] text-sky-900 drop-shadow-sm ml-1 md:ml-2">GenoAtlas</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4 bg-amber-400 border-b-[6px] md:border-b-[8px] border-amber-600 px-4 md:px-8 py-2 md:py-3 rounded-full shadow-sm">
          <span className="text-amber-950 font-black text-[18px] md:text-[24px] tracking-widest flex items-center gap-2 md:gap-3 whitespace-nowrap">
            {coins} <span className="text-amber-100 text-[20px] md:text-[24px]">🪙</span>
          </span>
        </div>
      </header>

      <div className="relative z-10 pt-[calc(140px+env(safe-area-inset-top))] pb-8 animate-fade-in-up">
        <div className="px-4 md:px-12 mb-4 flex justify-between items-end">
          <h2 className="text-[20px] md:text-[32px] font-black uppercase tracking-widest text-sky-900">Modos de Jogo</h2>
          <span className="text-sky-600 font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-1">Deslize <ChevronRight size={16}/></span>
        </div>
        
        <div className="flex gap-4 md:gap-8 overflow-x-auto px-4 md:px-12 pb-6 snap-x custom-scrollbar">
          
          <button onClick={dailyCompleted ? null : onDaily} className={`snap-center shrink-0 w-[240px] md:w-[320px] p-6 rounded-[2.5rem] flex flex-col items-center justify-center border-[6px] md:border-[8px] transition-all group ${dailyCompleted ? 'bg-stone-300 border-stone-400 opacity-80 cursor-not-allowed' : 'bg-rose-50 border-rose-200 hover:bg-rose-100 active:scale-95 shadow-lg'}`}>
            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-4 border-[6px] shadow-inner ${dailyCompleted ? 'bg-stone-400 border-stone-500 text-stone-200' : 'bg-rose-500 border-rose-600 text-white group-hover:scale-110 transition-transform'}`}>
              {dailyCompleted ? <CheckCircle size={40} strokeWidth={2.5}/> : <Calendar size={40} strokeWidth={2.5} />}
            </div>
            <span className={`text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none ${dailyCompleted ? 'text-stone-500' : 'text-rose-800'}`}>Diário</span>
            <span className={`text-[12px] md:text-[16px] font-bold uppercase mt-2 ${dailyCompleted ? 'text-stone-400' : 'text-rose-500'}`}>{dailyCompleted ? 'Feito hoje!' : 'Recompensa 500🪙'}</span>
          </button>

          <button onClick={onFootball} className="snap-center shrink-0 w-[240px] md:w-[320px] bg-sky-50 border-[6px] md:border-[8px] border-sky-200 hover:bg-sky-100 p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all active:scale-95 group shadow-lg">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] bg-sky-500 border-[6px] border-sky-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <Shield size={40} strokeWidth={2.5} />
            </div>
            <span className="text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none text-sky-800">Futebol</span>
            <span className="text-[12px] md:text-[16px] font-bold uppercase mt-2 text-sky-500">Ache o Clube</span>
          </button>

          <button onClick={onStudy} className="snap-center shrink-0 w-[240px] md:w-[320px] bg-emerald-50 border-[6px] md:border-[8px] border-emerald-200 hover:bg-emerald-100 p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all active:scale-95 group shadow-lg">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] bg-emerald-400 border-[6px] border-emerald-500 text-emerald-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <GraduationCap size={40} strokeWidth={2.5} />
            </div>
            <span className="text-[20px] md:text-[28px] font-black uppercase tracking-widest leading-none text-emerald-800">Estudo</span>
            <span className="text-[12px] md:text-[16px] font-bold uppercase mt-2 text-emerald-500">Sem pressa</span>
          </button>

        </div>
      </div>

      <div className="relative z-10 text-center mb-16 px-6 md:px-12 animate-fade-in-up mt-8">
        <div className="inline-flex items-center gap-3 md:gap-4 bg-sky-600 px-8 py-3 md:px-12 md:py-4 rounded-full text-white shadow-lg border-b-[6px] md:border-b-[8px] border-sky-800">
          <Compass className="w-6 h-6 md:w-10 md:h-10" strokeWidth={2.5} />
          <span className="font-black text-[20px] md:text-[32px] uppercase tracking-widest">Sua Jornada</span>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center min-h-[4500px] pt-10">
        
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[12px] md:w-[16px] border-l-[12px] md:border-l-[16px] border-dashed border-stone-200/60 opacity-60 z-0"></div>

        {/* O AVATAR VOADOR DINÂMICO! */}
        <div 
          className="absolute z-30 left-1/2 -translate-x-1/2 transition-all duration-[1200ms] ease-in-out flex flex-col items-center"
          style={{ transform: `translate(-50%, ${pinOffset}px)`, top: isMobile ? '-90px' : '-120px' }}
        >
          <div className="bg-white w-[80px] h-[80px] md:w-[112px] md:h-[112px] rounded-[24px] md:rounded-[32px] shadow-2xl border-[8px] md:border-[10px] border-amber-400 flex items-center justify-center animate-bounce-short">
             {activeAvatar.type === 'emoji' ? (
                <span className="text-[40px] md:text-[56px] leading-none drop-shadow-sm">{activeAvatar.icon}</span>
             ) : (
                <img src={activeAvatar.icon} alt={activeAvatar.name} className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-sm" />
             )}
          </div>
          <div className="absolute -bottom-3 md:-bottom-4 w-0 h-0 border-l-[16px] md:border-l-[20px] border-l-transparent border-r-[16px] md:border-r-[20px] border-r-transparent border-t-[20px] md:border-t-[24px] border-t-amber-400 animate-bounce-short"></div>
        </div>

        {themeNodes.map((t, index) => {
          const isUnlocked = unlockedThemes.includes(t.id);
          const isCurrent = currentTheme.id === t.id;

          return (
            <div key={t.id} className="relative flex flex-col items-center z-10 mb-[450px] md:mb-[600px] w-full max-w-[320px]">
              
              <button 
                onClick={() => {
                  if (isUnlocked) { 
                    setTheme(t); 
                    setShowRegionModal(true); 
                  } 
                  else { handleThemeSelect(t); }
                }}
                className={`w-[160px] h-[160px] md:w-[208px] md:h-[208px] rounded-full flex items-center justify-center border-[10px] md:border-[12px] relative transition-all group ${
                  isUnlocked 
                    ? isCurrent 
                      ? 'bg-amber-400 border-white shadow-[0_16px_0_#b45309,0_0_40px_rgba(251,191,36,0.6)] md:shadow-[0_24px_0_#b45309,0_0_60px_rgba(251,191,36,0.6)] active:translate-y-[12px] md:active:translate-y-[16px] active:shadow-[0_6px_0_#b45309]' 
                      : 'bg-white border-stone-300 shadow-[0_8px_0_#a8a29e] md:shadow-[0_10px_0_#a8a29e] active:translate-y-[8px] md:active:translate-y-[12px] active:shadow-[0_4px_0_#a8a29e] hover:scale-105'
                    : 'bg-stone-300 border-stone-400 shadow-[0_14px_0_#78716c] md:shadow-[0_20px_0_#78716c] active:translate-y-[8px] md:active:translate-y-[12px] active:shadow-[0_6px_0_#78716c] opacity-90'
                }`}
              >
                {isUnlocked ? (
                  <Compass className={`w-20 h-20 md:w-28 md:h-28 ${isCurrent ? 'text-amber-800' : 'text-stone-400'}`} strokeWidth={2.5} />
                ) : (
                  <Lock className="w-16 h-16 md:w-24 md:h-24 text-stone-500" strokeWidth={2.5} />
                )}
              </button>

              <button 
                onClick={() => {
                  if (isUnlocked) { setTheme(t); setShowRegionModal(true); } 
                  else { handleThemeSelect(t); }
                }}
                className={`absolute -bottom-[40px] md:-bottom-[60px] px-8 py-3 md:px-12 md:py-5 rounded-full border-[3px] md:border-[4px] z-20 whitespace-nowrap scale-100 md:scale-110 transition-all active:scale-95 ${isUnlocked ? 'bg-white border-stone-300 shadow-xl cursor-pointer hover:bg-stone-50' : 'bg-stone-100 border-stone-300 cursor-not-allowed'}`}
              >
                <span className={`text-[18px] md:text-[24px] font-black uppercase tracking-widest ${isUnlocked ? 'text-stone-800' : 'text-stone-400'}`}>
                  {isUnlocked && isCurrent ? 'Jogar Agora' : t.name}
                </span>
              </button>

              {!isUnlocked && (
                <div className="absolute -bottom-[100px] md:-bottom-[140px] flex flex-col items-center animate-pulse-slow pointer-events-none">
                  <div className="bg-amber-400 px-6 py-2 md:px-10 md:py-4 rounded-full border-2 border-amber-500 shadow-xl flex items-center gap-2 md:gap-3 scale-100 md:scale-110 whitespace-nowrap min-w-max">
                    <Lock className="w-5 h-5 md:w-7 md:h-7 text-amber-900"/>
                    <span className="text-[18px] md:text-[24px] font-black text-amber-900">Desbloquear: {t.price} 🪙</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="relative flex flex-col items-center opacity-80 mt-10 mb-40">
          <div className="w-[180px] h-[180px] md:w-[248px] md:h-[248px] bg-gradient-to-b from-rose-500 to-rose-700 rounded-full flex items-center justify-center border-[12px] md:border-[16px] border-rose-300 shadow-[0_20px_0_#881337,0_0_60px_rgba(225,29,72,0.8)] md:shadow-[0_28px_0_#881337,0_0_100px_rgba(225,29,72,0.8)] z-10 relative cursor-not-allowed">
            <Trophy className="w-20 h-20 md:w-32 md:h-32 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-10 md:-bottom-16 bg-rose-900 px-8 py-3 md:px-12 md:py-5 rounded-full border-[3px] md:border-[4px] border-rose-400 z-20 shadow-2xl scale-100 md:scale-110 whitespace-nowrap">
            <span className="text-[16px] md:text-[24px] font-black text-rose-100 uppercase tracking-widest">A Lenda (Em Breve)</span>
          </div>
        </div>

        <div className="w-full mt-16 scale-125 md:scale-150 transform origin-top"><AdBanner dataAdSlot="START_SCREEN_SLOT" /></div>
      </div>

      {/* NAV BAR: Agora com o Botão da Lojinha! */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl flex justify-around items-center px-1 md:px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 md:pt-6 border-t-2 border-stone-200 shadow-[0px_-40px_80px_rgba(0,0,0,0.03)] rounded-t-[2.5rem] md:rounded-t-[4rem]">
        <button className="flex flex-col items-center justify-center text-sky-500 active:scale-95 transition-all group w-20 md:w-32">
          <div className="bg-sky-100 p-2.5 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] mb-1.5 md:mb-3 group-active:bg-sky-200 transition-colors"><Home className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className="text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap">Início</span>
        </button>
        
        {/* BOTÃO DA LOJA */}
        <button onClick={() => setShowShop(true)} className="flex flex-col items-center justify-center text-emerald-500 active:scale-95 transition-all group w-20 md:w-32">
          <div className="bg-emerald-100 p-2.5 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] mb-1.5 md:mb-3 group-active:bg-emerald-200 transition-colors shadow-sm"><ShoppingCart className="w-7 h-7 md:w-10 md:h-10 text-emerald-600" strokeWidth={2.5} /></div>
          <span className="text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap">Loja</span>
        </button>

        <button onClick={onOpenAchievements} className="flex flex-col items-center justify-center text-stone-400 hover:text-amber-500 active:scale-95 transition-all group w-20 md:w-32">
          <div className="p-2.5 md:p-4 mb-1.5 md:mb-3 group-active:bg-stone-100 rounded-[1.2rem] md:rounded-[1.8rem] transition-colors"><Trophy className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className="text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap group-hover:text-amber-500">Conquistas</span>
        </button>
        <button onClick={onOpenSettings} className="flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 active:scale-95 transition-all group w-20 md:w-32">
          <div className="p-2.5 md:p-4 mb-1.5 md:mb-3 group-active:bg-stone-100 rounded-[1.2rem] md:rounded-[1.8rem] transition-colors"><Settings className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} /></div>
          <span className="text-[12px] md:text-[18px] font-black uppercase tracking-widest whitespace-nowrap group-hover:text-stone-700">Ajustes</span>
        </button>
      </nav>

      {showRegionModal && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-6 ${isClosingRegion ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[85dvh] md:max-h-[90dvh] ${isClosingRegion ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
              <h2 className="text-[32px] md:text-[48px] font-black text-sky-900 uppercase tracking-tighter leading-none">Onde Pousar?</h2>
              <button onClick={closeRegionModal} className="bg-stone-100 p-3 md:p-4 rounded-full text-stone-400 hover:bg-rose-100 hover:text-rose-500 active:scale-95 transition-all">
                <X className="w-6 h-6 md:w-10 md:h-10" strokeWidth={3} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-6 overflow-y-auto custom-scrollbar pb-4 pr-1 md:pr-2">
              <button onClick={() => handleRegionSelect('all')} className="col-span-2 bg-gradient-to-r from-sky-400 to-sky-500 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center justify-center gap-3 md:gap-6 border-b-[8px] md:border-b-[10px] border-sky-600 shadow-lg active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-0 transition-all">
                <span className="text-[40px] md:text-[64px] leading-none drop-shadow-md">🌍</span>
                <span className="text-[20px] md:text-[32px] font-black text-white uppercase tracking-widest mt-1 md:mt-2 drop-shadow-sm">Mundo Todo</span>
              </button>
              
              <button onClick={() => handleRegionSelect('Americas')} className="bg-emerald-50 border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] border-emerald-200 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 shadow-sm hover:bg-emerald-100 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all">
                <span className="text-[36px] md:text-[56px] leading-none drop-shadow-sm">🌎</span>
                <span className="text-[14px] md:text-[20px] font-black text-emerald-800 uppercase tracking-widest">Américas</span>
              </button>

              <button onClick={() => handleRegionSelect('Europe')} className="bg-indigo-50 border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] border-indigo-200 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 shadow-sm hover:bg-indigo-100 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all">
                <span className="text-[36px] md:text-[56px] leading-none drop-shadow-sm">🏰</span>
                <span className="text-[14px] md:text-[20px] font-black text-indigo-800 uppercase tracking-widest">Europa</span>
              </button>
              
              <button onClick={() => handleRegionSelect('Asia')} className="bg-rose-50 border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] border-rose-200 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 shadow-sm hover:bg-rose-100 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all">
                <span className="text-[36px] md:text-[56px] leading-none drop-shadow-sm">⛩️</span>
                <span className="text-[14px] md:text-[20px] font-black text-rose-800 uppercase tracking-widest">Ásia</span>
              </button>

              <button onClick={() => handleRegionSelect('Africa')} className="bg-amber-50 border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] border-amber-200 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 shadow-sm hover:bg-amber-100 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all">
                <span className="text-[36px] md:text-[56px] leading-none drop-shadow-sm">🦁</span>
                <span className="text-[14px] md:text-[20px] font-black text-amber-800 uppercase tracking-widest">África</span>
              </button>

              <button onClick={() => handleRegionSelect('Oceania')} className="col-span-2 bg-teal-50 border-[4px] border-b-[8px] md:border-[6px] md:border-b-[10px] border-teal-200 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center justify-center gap-3 md:gap-6 shadow-sm hover:bg-teal-100 active:translate-y-[6px] md:active:translate-y-[8px] active:border-b-[4px] md:active:border-b-[6px] transition-all mt-1 md:mt-2">
                <span className="text-[40px] md:text-[64px] leading-none drop-shadow-sm">🦘</span>
                <span className="text-[20px] md:text-[32px] font-black text-teal-800 uppercase tracking-widest mt-1 md:mt-2">Oceania</span>
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
