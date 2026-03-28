import React, { useState } from 'react';
import { Trophy, Compass, Lock, Home, Settings, Shield, GraduationCap, Calendar, CheckCircle, Globe, MapPin, X } from 'lucide-react';
import AdBanner from './AdBanner';
import { Preferences } from '@capacitor/preferences';

const saveNativeData = async (key, val) => {
  try { await Preferences.set({ key, value: val.toString() }); } catch (e) {}
};

export default function StartScreen({ onStart, onStudy, onFootball, onDaily, onOpenAchievements, onOpenTutorial, onOpenSettings, coins, setCoins, currentTheme, setTheme, themes, unlockedThemes, setUnlockedThemes, dailyCompleted }) {
  
  const [showRegionModal, setShowRegionModal] = useState(false);

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
    setShowRegionModal(false);
    onStart(regionId);
  };

  const themeNodes = Object.values(themes);
  
  // CORREÇÃO DEFINITIVA: Os botões foram jogados lá para baixo (top-[420px]) 
  // para flutuarem entre os planetas em vez de brigarem por espaço nas laterais.
  const sideMissions = [
    { label: 'Futebol', icon: <Shield size={56} className="text-white" strokeWidth={2.5} />, onClick: onFootball, bg: 'bg-[#4bbaff]', border: 'border-[#14adf8]', shadow: 'shadow-[0_10px_0_#00618f]', text: 'text-[#00618f]', pos: 'absolute -right-[20px] md:-right-[80px] top-[420px]' },
    { label: 'Estudo', icon: <GraduationCap size={56} className="text-white" strokeWidth={2.5} />, onClick: onStudy, bg: 'bg-emerald-400', border: 'border-emerald-500', shadow: 'shadow-[0_10px_0_#047857]', text: 'text-emerald-800', pos: 'absolute -left-[20px] md:-left-[80px] top-[420px]' },
    { label: 'Diário', icon: dailyCompleted ? <CheckCircle size={56} className="text-white" /> : <Calendar size={56} className="text-white" strokeWidth={2.5} />, onClick: dailyCompleted ? null : onDaily, bg: dailyCompleted ? 'bg-stone-400 grayscale' : 'bg-rose-500', border: dailyCompleted ? 'border-stone-500' : 'border-rose-600', shadow: dailyCompleted ? 'shadow-[0_10px_0_#78716c]' : 'shadow-[0_10px_0_#9f1239]', text: dailyCompleted ? 'text-stone-600' : 'text-rose-900', pos: 'absolute -right-[20px] md:-right-[80px] top-[420px]', disabled: dailyCompleted }
  ];

  return (
    <div className="absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 via-sky-100 to-white overflow-y-auto overflow-x-hidden custom-scrollbar pb-[500px]">
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 2px, transparent 2px)', backgroundSize: '96px 96px' }}></div>
      </div>
      
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-8 bg-white/80 backdrop-blur-md border-b-2 border-white/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 shadow-sm border-[4px] border-white ring-[4px] ring-sky-100">
            <Globe size={48} className="text-white md:w-14 md:h-14" strokeWidth={2.5} />
          </div>
          <h1 className="font-black italic tracking-tighter text-[40px] md:text-[50px] text-sky-900 drop-shadow-sm ml-2">GenoAtlas</h1>
        </div>
        <div className="flex items-center gap-4 bg-amber-400 border-b-[8px] border-amber-600 px-8 py-4 rounded-full shadow-sm">
          <span className="text-amber-950 font-black text-[24px] md:text-[28px] tracking-widest flex items-center gap-3 whitespace-nowrap">
            {coins} <span className="text-amber-100 text-[28px]">🪙</span>
          </span>
        </div>
      </header>

      <div className="relative z-10 text-center mb-16 px-12 pt-[220px] animate-fade-in-up">
        <div className="inline-flex items-center gap-4 bg-sky-600 px-12 py-6 rounded-full text-white shadow-lg border-b-[8px] border-sky-800 mb-6">
          <Compass size={48} strokeWidth={2.5} />
          <span className="font-black text-[32px] md:text-[40px] uppercase tracking-widest">Jornada</span>
        </div>
        <br/>
        <p className="text-sky-900 font-bold text-[24px] md:text-[28px] tracking-wide bg-sky-50 inline-block px-8 py-3 rounded-full border-2 border-sky-200 shadow-sm">Junte moedas e avance de bioma!</p>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center min-h-[5500px] pt-[450px]">
        
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[16px] border-l-[16px] border-dashed border-stone-200/60 opacity-60 z-0"></div>

        {themeNodes.map((t, index) => {
          const isUnlocked = unlockedThemes.includes(t.id);
          const isCurrent = currentTheme.id === t.id;
          const sideMission = sideMissions[index]; 

          return (
            <div key={t.id} className="relative flex flex-col items-center z-10 mb-[850px]">
              
              {isCurrent && (
                <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 z-20 animate-bounce-short">
                  <div className="relative flex flex-col items-center">
                    <div className="bg-white w-[112px] h-[112px] rounded-[32px] shadow-2xl border-[10px] border-amber-400 flex items-center justify-center">
                       <MapPin size={56} className="text-amber-500" strokeWidth={3} fill="currentColor" />
                    </div>
                    <div className="absolute -bottom-4 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-t-amber-400"></div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  if (isUnlocked) { 
                    setTheme(t); 
                    setShowRegionModal(true); 
                  } 
                  else { handleThemeSelect(t); }
                }}
                className={`w-[208px] h-[208px] rounded-full flex items-center justify-center border-[12px] relative transition-all group ${
                  isUnlocked 
                    ? isCurrent 
                      ? 'bg-amber-400 border-white shadow-[0_24px_0_#b45309,0_0_60px_rgba(251,191,36,0.6)] active:translate-y-[16px] active:shadow-[0_8px_0_#b45309]' 
                      : 'bg-white border-stone-300 shadow-[0_10px_0_#a8a29e] active:translate-y-[12px] active:shadow-[0_8px_0_#a8a29e] hover:scale-105'
                    : 'bg-stone-300 border-stone-400 shadow-[0_20px_0_#78716c] active:translate-y-[12px] active:shadow-[0_8px_0_#78716c] opacity-90'
                }`}
              >
                {isUnlocked ? (
                  <Compass size={108} className={isCurrent ? 'text-amber-800' : 'text-stone-400'} strokeWidth={2.5} />
                ) : (
                  <Lock size={92} className="text-stone-500" strokeWidth={2.5} />
                )}
              </button>

              <div className={`absolute -bottom-[60px] px-12 py-5 rounded-full border-[4px] z-20 whitespace-nowrap scale-110 ${isUnlocked ? 'bg-white border-stone-300 shadow-xl' : 'bg-stone-100 border-stone-300'}`}>
                <span className={`text-[24px] font-black uppercase tracking-widest ${isUnlocked ? 'text-stone-800' : 'text-stone-400'}`}>
                  {isUnlocked && isCurrent ? 'Jogar Agora' : t.name}
                </span>
              </div>

              {!isUnlocked && (
                <div className="absolute -bottom-[140px] flex flex-col items-center animate-pulse-slow">
                  <div className="bg-amber-400 px-10 py-4 rounded-full border-2 border-amber-500 shadow-xl flex items-center gap-3 scale-110 whitespace-nowrap min-w-max">
                    <Lock size={28} className="text-amber-900"/>
                    <span className="text-[24px] font-black text-amber-900">Desbloquear: {t.price} 🪙</span>
                  </div>
                </div>
              )}

              {/* O BOTÃO AGORA RENDERIZA MUITO MAIS PARA BAIXO */}
              {sideMission && (
                <button onClick={sideMission.onClick} disabled={sideMission.disabled} className={`${sideMission.pos} flex flex-col items-center cursor-pointer group transition-all z-0 ${sideMission.disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}>
                  <div className={`w-[152px] h-[152px] rounded-[2.4rem] ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'} flex items-center justify-center border-[8px] shadow-2xl ${sideMission.bg} ${sideMission.border} ${sideMission.shadow}`}>
                    {sideMission.icon}
                  </div>
                  <span className={`text-[22px] font-black mt-8 bg-white px-8 py-3 rounded-full uppercase tracking-widest border-2 border-stone-200 shadow-xl whitespace-nowrap min-w-max ${sideMission.text}`}>{sideMission.label}</span>
                </button>
              )}
            </div>
          );
        })}

        <div className="relative flex flex-col items-center opacity-80 mt-10 mb-40">
          <div className="w-[248px] h-[248px] bg-gradient-to-b from-rose-500 to-rose-700 rounded-full flex items-center justify-center border-[16px] border-rose-300 shadow-[0_28px_0_#881337,0_0_100px_rgba(225,29,72,0.8)] z-10 relative cursor-not-allowed">
            <Trophy size={120} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-16 bg-rose-900 px-12 py-5 rounded-full border-[4px] border-rose-400 z-20 shadow-2xl scale-110 whitespace-nowrap">
            <span className="text-[24px] font-black text-rose-100 uppercase tracking-widest">A Lenda (Em Breve)</span>
          </div>
        </div>

        <div className="w-full mt-16 scale-150 transform origin-top"><AdBanner dataAdSlot="START_SCREEN_SLOT" /></div>
      </div>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl flex justify-around items-center px-4 pb-12 pt-8 border-t-2 border-stone-200 shadow-[0px_-40px_80px_rgba(0,0,0,0.03)] rounded-t-[4rem]">
        <button className="flex flex-col items-center justify-center text-sky-500 active:scale-95 transition-all group w-40">
          <div className="bg-sky-100 p-5 rounded-[2rem] mb-3 group-active:bg-sky-200 transition-colors"><Home size={52} strokeWidth={2.5} /></div>
          <span className="text-[22px] font-black uppercase tracking-widest whitespace-nowrap">Início</span>
        </button>
        <button onClick={onOpenAchievements} className="flex flex-col items-center justify-center text-stone-400 hover:text-amber-500 active:scale-95 transition-all group w-40">
          <div className="p-5 mb-3 group-active:bg-stone-100 rounded-[2rem] transition-colors"><Trophy size={52} strokeWidth={2.5} /></div>
          <span className="text-[22px] font-black uppercase tracking-widest whitespace-nowrap group-hover:text-amber-500">Conquistas</span>
        </button>
        <button onClick={onOpenSettings} className="flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 active:scale-95 transition-all group w-40">
          <div className="p-5 mb-3 group-active:bg-stone-100 rounded-[2rem] transition-colors"><Settings size={52} strokeWidth={2.5} /></div>
          <span className="text-[22px] font-black uppercase tracking-widest whitespace-nowrap group-hover:text-stone-700">Ajustes</span>
        </button>
      </nav>

      {showRegionModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-sky-900/80 backdrop-blur-md animate-fade-in pb-0">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform animate-fade-in-up">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-sky-900 uppercase tracking-tighter">Onde Pousar?</h2>
              <button onClick={() => setShowRegionModal(false)} className="bg-stone-100 p-3 rounded-full text-stone-500 active:scale-90 transition-transform">
                <X size={28} strokeWidth={3} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleRegionSelect('all')} className="col-span-2 bg-gradient-to-r from-sky-400 to-sky-500 rounded-[1.5rem] p-5 flex items-center justify-center gap-4 shadow-[0_8px_0_#0369a1] active:translate-y-[6px] active:shadow-[0_2px_0_#0369a1] transition-all">
                <span className="text-4xl">🌍</span>
                <span className="text-2xl font-black text-white uppercase tracking-widest">Mundo Todo</span>
              </button>
              
              <button onClick={() => handleRegionSelect('Americas')} className="bg-emerald-100 border-[6px] border-emerald-400 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 shadow-[0_8px_0_#34d399] active:translate-y-[6px] active:shadow-[0_2px_0_#34d399] transition-all">
                <span className="text-4xl">🌎</span>
                <span className="text-lg font-black text-emerald-800 uppercase tracking-widest">Américas</span>
              </button>

              <button onClick={() => handleRegionSelect('Europe')} className="bg-indigo-100 border-[6px] border-indigo-400 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 shadow-[0_8px_0_#818cf8] active:translate-y-[6px] active:shadow-[0_2px_0_#818cf8] transition-all">
                <span className="text-4xl">🏰</span>
                <span className="text-lg font-black text-indigo-800 uppercase tracking-widest">Europa</span>
              </button>
              
              <button onClick={() => handleRegionSelect('Asia')} className="bg-rose-100 border-[6px] border-rose-400 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 shadow-[0_8px_0_#fb7185] active:translate-y-[6px] active:shadow-[0_2px_0_#fb7185] transition-all">
                <span className="text-4xl">⛩️</span>
                <span className="text-lg font-black text-rose-800 uppercase tracking-widest">Ásia</span>
              </button>

              <button onClick={() => handleRegionSelect('Africa')} className="bg-amber-100 border-[6px] border-amber-400 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 shadow-[0_8px_0_#fbbf24] active:translate-y-[6px] active:shadow-[0_2px_0_#fbbf24] transition-all">
                <span className="text-4xl">🦁</span>
                <span className="text-lg font-black text-amber-800 uppercase tracking-widest">África</span>
              </button>

              <button onClick={() => handleRegionSelect('Oceania')} className="col-span-2 bg-teal-100 border-[6px] border-teal-400 rounded-[1.5rem] p-5 flex items-center justify-center gap-4 shadow-[0_8px_0_#2dd4bf] active:translate-y-[6px] active:shadow-[0_2px_0_#2dd4bf] transition-all mt-2">
                <span className="text-4xl">🦘</span>
                <span className="text-2xl font-black text-teal-800 uppercase tracking-widest">Oceania</span>
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
