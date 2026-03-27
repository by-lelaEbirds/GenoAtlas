import React from 'react';
import { Trophy, Compass, Lock, Home, Settings, Shield, GraduationCap, Calendar, CheckCircle } from 'lucide-react';
import AdBanner from './AdBanner';
import { saveNativeData } from '../utils/storage';

export default function StartScreen({ onStart, onStudy, onFootball, onDaily, onOpenAchievements, onOpenTutorial, onOpenSettings, coins, setCoins, currentTheme, setTheme, themes, unlockedThemes, setUnlockedThemes, dailyCompleted }) {
  
  const basePath = import.meta.env.BASE_URL;

  const handleThemeSelect = (theme) => {
    if (coins >= theme.price) {
      const newCoins = coins - theme.price;
      
      // Validação de unicidade para evitar duplicações no array de temas
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

  const themeNodes = Object.values(themes);
  
  const sideMissions = [
    { label: 'Futebol', icon: <Shield size={24} className="text-white" strokeWidth={2.5} />, onClick: onFootball, bg: 'bg-[#4bbaff]', border: 'border-[#14adf8]', shadow: 'shadow-[0_5px_0_#00618f]', text: 'text-[#00618f]', pos: 'absolute -right-20 md:-right-28 top-4' },
    { label: 'Estudo', icon: <GraduationCap size={24} className="text-white" strokeWidth={2.5} />, onClick: onStudy, bg: 'bg-emerald-400', border: 'border-emerald-500', shadow: 'shadow-[0_5px_0_#047857]', text: 'text-emerald-800', pos: 'absolute -left-20 md:-left-28 top-4' },
    { label: 'Diário', icon: dailyCompleted ? <CheckCircle size={24} className="text-white" /> : <Calendar size={24} className="text-white" strokeWidth={2.5} />, onClick: dailyCompleted ? null : onDaily, bg: dailyCompleted ? 'bg-stone-400 grayscale' : 'bg-rose-500', border: dailyCompleted ? 'border-stone-500' : 'border-rose-600', shadow: dailyCompleted ? 'shadow-[0_5px_0_#78716c]' : 'shadow-[0_5px_0_#9f1239]', text: dailyCompleted ? 'text-stone-600' : 'text-rose-900', pos: 'absolute -right-20 md:-right-28 top-4', disabled: dailyCompleted }
  ];

  return (
    <div className="absolute inset-0 z-40 bg-gradient-to-b from-sky-100 to-white overflow-y-auto overflow-x-hidden custom-scrollbar pb-32">
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <div className="absolute top-[15%] left-[10%] w-[120px] h-[40px] bg-white rounded-full blur-[2px]"></div>
        <div className="absolute top-[25%] right-[5%] w-[180px] h-[60px] bg-white rounded-full blur-[3px]"></div>
        <div className="absolute top-[50%] left-[15%] w-[100px] h-[35px] bg-white rounded-full blur-[2px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
      </div>
      
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-6 py-3 bg-white/70 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-sky-400 bg-white shadow-sm">
            <img className="w-full h-full object-cover scale-110 translate-y-1" alt="Explorer Hero" src={`${basePath}icon.png`} />
          </div>
          <h1 className="font-black italic tracking-tighter text-2xl text-sky-900 drop-shadow-sm">GenoAtlas</h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-400 border-b-[3px] border-amber-600 px-4 py-1.5 rounded-full shadow-sm">
          <span className="text-amber-950 font-black text-sm tracking-widest flex items-center gap-1.5 whitespace-nowrap">
            {coins} <span className="text-amber-100">🪙</span>
          </span>
        </div>
      </header>

      <div className="relative z-10 text-center mb-6 px-6 pt-24 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-sky-600 px-6 py-2.5 rounded-full text-white shadow-lg border-b-4 border-sky-800 mb-3">
          <Compass size={20} strokeWidth={2.5} />
          <span className="font-black text-lg uppercase tracking-widest">Jornada</span>
        </div>
        <p className="text-sky-900 font-bold text-sm tracking-wide bg-sky-50 inline-block px-4 py-1 rounded-full border border-sky-100 shadow-inner">Junte moedas e avance de bioma!</p>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 flex flex-col items-center min-h-[1200px] pt-10">
        
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[6px] border-l-[8px] border-dashed border-stone-200 opacity-60 z-0"></div>

        {themeNodes.map((t, index) => {
          const isUnlocked = unlockedThemes.includes(t.id);
          const isCurrent = currentTheme.id === t.id;
          const sideMission = sideMissions[index]; 

          return (
            <div key={t.id} className="relative flex flex-col items-center z-10 mb-32">
              
              {isCurrent && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 animate-bounce-short">
                  <div className="relative">
                    <div className="bg-white p-1.5 rounded-xl shadow-xl border-4 border-amber-400">
                      <img className="w-10 h-10 rounded-lg object-cover scale-110" alt="Você está aqui" src={`${basePath}icon.png`} />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white"></div>
                  </div>
                </div>
              )}

              <button 
                aria-label={isUnlocked ? `Selecionar tema ${t.name}` : `Desbloquear tema ${t.name}`}
                onClick={() => {
                  if (isUnlocked) { setTheme(t); onStart(); } 
                  else { handleThemeSelect(t); }
                }}
                className={`w-[90px] h-[90px] rounded-full flex items-center justify-center border-[6px] relative transition-all group ${
                  isUnlocked 
                    ? isCurrent 
                      ? 'bg-amber-400 border-white shadow-[0_12px_0_#b45309,0_0_30px_rgba(251,191,36,0.6)] active:translate-y-[8px] active:shadow-[0_4px_0_#b45309]' 
                      : 'bg-white border-stone-300 shadow-[0_10px_0_#a8a29e] active:translate-y-[6px] active:shadow-[0_4px_0_#a8a29e] hover:scale-105'
                    : 'bg-stone-300 border-stone-400 shadow-[0_10px_0_#78716c] active:translate-y-[6px] active:shadow-[0_4px_0_#78716c] opacity-90'
                }`}
              >
                {isUnlocked ? (
                  <Compass size={45} className={isCurrent ? 'text-amber-800' : 'text-stone-400'} strokeWidth={2.5} />
                ) : (
                  <Lock size={40} className="text-stone-500" strokeWidth={2.5} />
                )}
              </button>

              <div className={`absolute -bottom-6 px-5 py-2 rounded-full border-2 z-20 whitespace-nowrap scale-110 ${isUnlocked ? 'bg-white border-stone-300 shadow-md' : 'bg-stone-100 border-stone-300'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-stone-800' : 'text-stone-400'}`}>
                  {isUnlocked && isCurrent ? 'Jogar Agora' : t.name}
                </span>
              </div>

              {!isUnlocked && (
                <div className="absolute -bottom-16 flex flex-col items-center animate-pulse-slow">
                  <div className="bg-amber-400 px-4 py-1.5 rounded-full border border-amber-500 shadow-md flex items-center gap-1 scale-110 whitespace-nowrap min-w-max">
                    <Lock size={12} className="text-amber-900"/>
                    <span className="text-[12px] font-black text-amber-900">Desbloquear: {t.price} 🪙</span>
                  </div>
                </div>
              )}

              {sideMission && (
                <button aria-label={sideMission.label} onClick={sideMission.onClick} disabled={sideMission.disabled} className={`${sideMission.pos} flex flex-col items-center cursor-pointer group transition-all z-0 ${sideMission.disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}>
                  <div className={`w-[60px] h-[60px] rounded-2xl ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'} flex items-center justify-center border-[3px] ${sideMission.bg} ${sideMission.border} ${sideMission.shadow}`}>
                    {sideMission.icon}
                  </div>
                  <span className={`text-[9px] font-black mt-3 bg-white px-3 py-0.5 rounded-full uppercase tracking-widest border shadow-sm whitespace-nowrap min-w-max ${sideMission.text}`}>{sideMission.label}</span>
                </button>
              )}
            </div>
          );
        })}

        <div className="relative flex flex-col items-center opacity-80 mt-10 mb-10">
          <div className="w-[110px] h-[110px] bg-gradient-to-b from-rose-500 to-rose-700 rounded-full flex items-center justify-center border-[8px] border-rose-300 shadow-[0_14px_0_#881337,0_0_50px_rgba(225,29,72,0.8)] z-10 relative cursor-not-allowed">
            <Trophy size={50} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-6 bg-rose-900 px-5 py-2 rounded-full border-2 border-rose-400 z-20 shadow-lg scale-110 whitespace-nowrap">
            <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest">A Lenda (Em Breve)</span>
          </div>
        </div>

        <div className="w-full mt-4"><AdBanner dataAdSlot="START_SCREEN_SLOT" /></div>
      </div>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl flex justify-around items-end px-2 pb-6 pt-3 border-t-2 border-stone-200 shadow-[0px_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <button className="flex flex-col items-center justify-center bg-sky-500 text-white rounded-2xl px-6 py-2.5 shadow-[0_5px_0_#0369a1] active:translate-y-[5px] active:shadow-none transition-all">
          <Home size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-1 whitespace-nowrap">Início</span>
        </button>
        <button onClick={onOpenAchievements} className="flex flex-col items-center justify-center text-stone-400 hover:text-amber-500 active:scale-95 transition-all pb-1">
          <Trophy size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-1 whitespace-nowrap">Conquistas</span>
        </button>
        <button onClick={onOpenSettings} className="flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 active:scale-95 transition-all pb-1">
          <Settings size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-1 whitespace-nowrap">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
