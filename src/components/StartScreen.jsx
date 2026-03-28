import React from 'react';
import { Trophy, Compass, Lock, Home, Settings, Shield, GraduationCap, Calendar, CheckCircle, Globe, MapPin } from 'lucide-react';
import AdBanner from './AdBanner';
import { saveNativeData } from '../utils/storage';

export default function StartScreen({ onStart, onStudy, onFootball, onDaily, onOpenAchievements, onOpenTutorial, onOpenSettings, coins, setCoins, currentTheme, setTheme, themes, unlockedThemes, setUnlockedThemes, dailyCompleted }) {
  
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

  const themeNodes = Object.values(themes);
  
  // AUMENTADO: posições ajustadas (right-24, left-24) e espaçamentos para acomodar botões maiores
  const sideMissions = [
    { label: 'Futebol', icon: <Shield size={28} className="text-white" strokeWidth={2.5} />, onClick: onFootball, bg: 'bg-[#4bbaff]', border: 'border-[#14adf8]', shadow: 'shadow-[0_5px_0_#00618f]', text: 'text-[#00618f]', pos: 'absolute -right-24 md:-right-32 top-4' },
    { label: 'Estudo', icon: <GraduationCap size={28} className="text-white" strokeWidth={2.5} />, onClick: onStudy, bg: 'bg-emerald-400', border: 'border-emerald-500', shadow: 'shadow-[0_5px_0_#047857]', text: 'text-emerald-800', pos: 'absolute -left-24 md:-left-32 top-4' },
    { label: 'Diário', icon: dailyCompleted ? <CheckCircle size={28} className="text-white" /> : <Calendar size={28} className="text-white" strokeWidth={2.5} />, onClick: dailyCompleted ? null : onDaily, bg: dailyCompleted ? 'bg-stone-400 grayscale' : 'bg-rose-500', border: dailyCompleted ? 'border-stone-500' : 'border-rose-600', shadow: dailyCompleted ? 'shadow-[0_5px_0_#78716c]' : 'shadow-[0_5px_0_#9f1239]', text: dailyCompleted ? 'text-stone-600' : 'text-rose-900', pos: 'absolute -right-24 md:-right-32 top-4', disabled: dailyCompleted }
  ];

  return (
    <div className="absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 via-sky-100 to-white overflow-y-auto overflow-x-hidden custom-scrollbar pb-36">
      
      {/* BACKGROUND MODERNO MANTIDO */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        <div className="absolute top-[5%] left-[-10%] w-[250px] h-[250px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-[20%] left-[20%] w-[200px] h-[200px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
      </div>
      
      {/* HEADER AUMENTADO */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-6 py-4 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 shadow-sm border-2 border-white ring-2 ring-sky-100">
            <Globe size={26} className="text-white md:w-8 md:h-8" strokeWidth={2.5} />
          </div>
          <h1 className="font-black italic tracking-tighter text-3xl md:text-4xl text-sky-900 drop-shadow-sm ml-1">GenoAtlas</h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-400 border-b-[4px] border-amber-600 px-5 py-2 md:py-2.5 rounded-full shadow-sm">
          <span className="text-amber-950 font-black text-base md:text-lg tracking-widest flex items-center gap-1.5 whitespace-nowrap">
            {coins} <span className="text-amber-100 text-lg">🪙</span>
          </span>
        </div>
      </header>

      {/* CABEÇALHO DA JORNADA AUMENTADO */}
      <div className="relative z-10 text-center mb-10 px-6 pt-32 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-sky-600 px-8 py-3 rounded-full text-white shadow-lg border-b-4 border-sky-800 mb-4">
          <Compass size={24} strokeWidth={2.5} />
          <span className="font-black text-xl md:text-2xl uppercase tracking-widest">Jornada</span>
        </div>
        <br/>
        <p className="text-sky-900 font-bold text-sm md:text-base tracking-wide bg-sky-50 inline-block px-5 py-1.5 rounded-full border border-sky-200 shadow-sm">Junte moedas e avance de bioma!</p>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 flex flex-col items-center min-h-[1200px] pt-10">
        
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[8px] border-l-[10px] border-dashed border-stone-200/60 opacity-60 z-0"></div>

        {themeNodes.map((t, index) => {
          const isUnlocked = unlockedThemes.includes(t.id);
          const isCurrent = currentTheme.id === t.id;
          const sideMission = sideMissions[index]; 

          return (
            <div key={t.id} className="relative flex flex-col items-center z-10 mb-40">
              
              {/* PINO DE "VOCÊ ESTÁ AQUI" AUMENTADO */}
              {isCurrent && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 animate-bounce-short">
                  <div className="relative flex flex-col items-center">
                    <div className="bg-white w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-xl border-[5px] border-amber-400 flex items-center justify-center">
                       <MapPin size={28} className="text-amber-500" strokeWidth={3} fill="currentColor" />
                    </div>
                    <div className="absolute -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-amber-400"></div>
                  </div>
                </div>
              )}

              {/* BOTÃO DO PLANETA AUMENTADO (de 90px para 104px) */}
              <button 
                aria-label={isUnlocked ? `Selecionar tema ${t.name}` : `Desbloquear tema ${t.name}`}
                onClick={() => {
                  if (isUnlocked) { setTheme(t); onStart(); } 
                  else { handleThemeSelect(t); }
                }}
                className={`w-[104px] h-[104px] md:w-[120px] md:h-[120px] rounded-full flex items-center justify-center border-[6px] relative transition-all group ${
                  isUnlocked 
                    ? isCurrent 
                      ? 'bg-amber-400 border-white shadow-[0_12px_0_#b45309,0_0_30px_rgba(251,191,36,0.6)] active:translate-y-[8px] active:shadow-[0_4px_0_#b45309]' 
                      : 'bg-white border-stone-300 shadow-[0_10px_0_#a8a29e] active:translate-y-[6px] active:shadow-[0_4px_0_#a8a29e] hover:scale-105'
                    : 'bg-stone-300 border-stone-400 shadow-[0_10px_0_#78716c] active:translate-y-[6px] active:shadow-[0_4px_0_#78716c] opacity-90'
                }`}
              >
                {isUnlocked ? (
                  <Compass size={54} className={isCurrent ? 'text-amber-800' : 'text-stone-400'} strokeWidth={2.5} />
                ) : (
                  <Lock size={46} className="text-stone-500" strokeWidth={2.5} />
                )}
              </button>

              {/* NOME DO PLANETA AUMENTADO */}
              <div className={`absolute -bottom-7 md:-bottom-8 px-6 py-2 md:py-2.5 rounded-full border-2 z-20 whitespace-nowrap scale-110 ${isUnlocked ? 'bg-white border-stone-300 shadow-md' : 'bg-stone-100 border-stone-300'}`}>
                <span className={`text-[12px] md:text-sm font-black uppercase tracking-widest ${isUnlocked ? 'text-stone-800' : 'text-stone-400'}`}>
                  {isUnlocked && isCurrent ? 'Jogar Agora' : t.name}
                </span>
              </div>

              {/* PREÇO AUMENTADO */}
              {!isUnlocked && (
                <div className="absolute -bottom-16 md:-bottom-20 flex flex-col items-center animate-pulse-slow">
                  <div className="bg-amber-400 px-5 py-2 rounded-full border border-amber-500 shadow-md flex items-center gap-1.5 scale-110 whitespace-nowrap min-w-max">
                    <Lock size={14} className="text-amber-900"/>
                    <span className="text-sm font-black text-amber-900">Desbloquear: {t.price} 🪙</span>
                  </div>
                </div>
              )}

              {/* MISSÕES SECUNDÁRIAS AUMENTADAS (de 60px para 76px) */}
              {sideMission && (
                <button aria-label={sideMission.label} onClick={sideMission.onClick} disabled={sideMission.disabled} className={`${sideMission.pos} flex flex-col items-center cursor-pointer group transition-all z-0 ${sideMission.disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}>
                  <div className={`w-[76px] h-[76px] md:w-[86px] md:h-[86px] rounded-[1.2rem] ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'} flex items-center justify-center border-[4px] shadow-lg ${sideMission.bg} ${sideMission.border} ${sideMission.shadow}`}>
                    {sideMission.icon}
                  </div>
                  <span className={`text-[11px] md:text-[12px] font-black mt-4 md:mt-5 bg-white px-4 py-1 md:py-1.5 rounded-full uppercase tracking-widest border border-stone-200 shadow-md whitespace-nowrap min-w-max ${sideMission.text}`}>{sideMission.label}</span>
                </button>
              )}
            </div>
          );
        })}

        {/* NÓ DO TROFÉU FINAL AUMENTADO */}
        <div className="relative flex flex-col items-center opacity-80 mt-16 mb-20">
          <div className="w-[124px] h-[124px] md:w-[140px] md:h-[140px] bg-gradient-to-b from-rose-500 to-rose-700 rounded-full flex items-center justify-center border-[8px] border-rose-300 shadow-[0_14px_0_#881337,0_0_50px_rgba(225,29,72,0.8)] z-10 relative cursor-not-allowed">
            <Trophy size={60} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-8 bg-rose-900 px-6 py-2.5 rounded-full border-2 border-rose-400 z-20 shadow-lg scale-110 whitespace-nowrap">
            <span className="text-xs font-black text-rose-100 uppercase tracking-widest">A Lenda (Em Breve)</span>
          </div>
        </div>

        <div className="w-full mt-8"><AdBanner dataAdSlot="START_SCREEN_SLOT" /></div>
      </div>

      {/* BARRA INFERIOR AUMENTADA E COM MAIS RESPIRO */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl flex justify-around items-center px-2 pb-8 pt-5 border-t border-stone-200 shadow-[0px_-20px_40px_rgba(0,0,0,0.03)] rounded-t-[2.5rem]">
        <button className="flex flex-col items-center justify-center text-sky-500 active:scale-95 transition-all group w-24">
          <div className="bg-sky-100 p-2.5 rounded-2xl mb-1.5 group-active:bg-sky-200 transition-colors"><Home size={26} strokeWidth={2.5} /></div>
          <span className="text-[11px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">Início</span>
        </button>
        <button onClick={onOpenAchievements} className="flex flex-col items-center justify-center text-stone-400 hover:text-amber-500 active:scale-95 transition-all group w-24">
          <div className="p-2.5 mb-1.5 group-active:bg-stone-100 rounded-2xl transition-colors"><Trophy size={26} strokeWidth={2.5} /></div>
          <span className="text-[11px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap group-hover:text-amber-500">Conquistas</span>
        </button>
        <button onClick={onOpenSettings} className="flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 active:scale-95 transition-all group w-24">
          <div className="p-2.5 mb-1.5 group-active:bg-stone-100 rounded-2xl transition-colors"><Settings size={26} strokeWidth={2.5} /></div>
          <span className="text-[11px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap group-hover:text-stone-700">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
