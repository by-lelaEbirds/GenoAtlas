import React, { useRef, useState, useEffect } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import GameHUD from './components/GameHUD';
import { TutorialModal, AchievementsModal, ShopModal } from './components/Modals';
import { Trophy, Coins, Rocket, Film, X, Gift, Compass } from 'lucide-react';

import { useGeoGame } from './hooks/useGeoGame';
import { GAME_STATES, MAP_THEMES, GAME_MODES } from './constants';

export default function App() {
  const globeRef = useRef();
  const { state, actions } = useGeoGame(globeRef);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  
  const [isClosingSettings, setIsClosingSettings] = useState(false);
  const [isClosingStudyCard, setIsClosingStudyCard] = useState(false);
  
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);

  const { isDarkMode } = state;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setIsChangingTheme(true);
    const themeTimer = setTimeout(() => setIsChangingTheme(false), 800);
    return () => clearTimeout(themeTimer);
  }, [state.activeTheme.id, isLoaded]);

  const handleCloseSettings = (isSmooth) => {
    setIsClosingSettings(true);
    setTimeout(() => {
      actions.applySettings(isSmooth);
      setIsClosingSettings(false);
      setPromoFeedback(null); 
      setPromoInput('');
    }, 200); 
  };

  const handleDismissStudyCard = () => {
    setIsClosingStudyCard(true);
    setTimeout(() => {
      actions.dismissStudyCard();
      setIsClosingStudyCard(false);
    }, 200);
  };

  const handleRevive = () => {
    setIsClosingStudyCard(true);
    setTimeout(() => {
      actions.revive();
      setIsClosingStudyCard(false);
    }, 200);
  };

  const handleRedeemClick = () => {
    if(!promoInput) return;
    const result = actions.redeemCode(promoInput);
    setPromoFeedback(result);
    setPromoInput('');
    setTimeout(() => setPromoFeedback(null), 4000);
  };

  return (
    <main className={`relative w-full h-[100dvh] overflow-hidden select-none transition-all duration-1000 ease-out ${isDarkMode ? 'bg-indigo-950 text-slate-100' : 'bg-stone-50 text-stone-900'} ${isLoaded ? 'opacity-100' : 'opacity-0 scale-105'}`}>
      
      <div aria-hidden="true" className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-200 ${state.screenFlash === 'success' ? 'bg-green-500/20' : state.screenFlash === 'error' ? 'bg-rose-500/20' : state.timeLeft <= 10 && state.gameState === GAME_STATES.PLAYING && !state.studyCard && state.gameMode !== GAME_MODES.STUDY ? 'shadow-[inset_0_0_100px_rgba(244,63,94,0.2)]' : ''}`} />

      {state.achievementToast && (
        <div role="alert" className="absolute top-16 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up w-max max-w-[90vw]">
          <div className="bg-amber-400 p-[6px] rounded-full shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            <div className={`px-8 py-4 rounded-full flex items-center gap-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <Trophy className="text-amber-500 animate-bounce-short" size={32} strokeWidth={2.5}/>
              <div>
                <p className={`text-[16px] font-black uppercase tracking-widest leading-none mb-2 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Conquista Desbloqueada!</p>
                <p className={`text-[24px] font-black leading-none truncate ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.achievementToast.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.floatingPoints.map(point => (
        <div aria-hidden="true" key={point.id} className={`absolute z-50 pointer-events-none animate-float-point text-[32px] font-black drop-shadow-md ${point.colorClass}`} style={{ left: point.x - 30, top: point.y - 60, willChange: 'transform, opacity' }}>{point.text}</div>
      ))}

      <div aria-hidden={!isChangingTheme} className={`absolute inset-0 z-[150] ${isDarkMode ? 'bg-indigo-950/90' : 'bg-stone-900/90'} backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isChangingTheme ? 'opacity-100' : 'opacity-0'}`}>
         <Compass className="text-sky-400 w-16 h-16 animate-spin-slow mb-4" strokeWidth={2.5} />
         <p className="text-white font-black uppercase tracking-widest text-[18px]">Sincronizando Bioma...</p>
      </div>

      <GlobeVisualizer 
        ref={globeRef} geoData={state.geoData} onCountryClick={actions.handleCountryClick} 
        theme={state.activeTheme} gameState={state.gameState} guessedCountries={state.guessedCountries} 
        travelArcs={state.travelArcs} impactRings={state.impactRings} isMobile={state.isMobile} 
        isSmoothMode={state.isSmoothMode} isDarkMode={isDarkMode}
      />
      
      {state.showTutorial && <TutorialModal onClose={actions.closeTutorial} isDarkMode={isDarkMode} />}
      {state.showAchievements && <AchievementsModal onClose={() => actions.setShowAchievements(false)} unlockedIds={state.unlockedAchievements} isDarkMode={isDarkMode} />}
      
      {state.showShop && (
        <ShopModal 
          onClose={() => actions.setShowShop(false)}
          coins={state.coins}
          setCoins={actions.setCoins}
          unlockedAvatars={state.unlockedAvatars}
          setUnlockedAvatars={actions.setUnlockedAvatars}
          activeAvatar={state.activeAvatar}
          setActiveAvatar={actions.setActiveAvatar}
          powerUps={state.powerUps}
          setPowerUps={actions.setPowerUps}
          isDarkMode={isDarkMode}
        />
      )}

      {/* GLASSMORPHISM NAS CONFIGURAÇÕES */}
      {state.showSettingsPrompt && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 md:px-6 py-6">
          <div role="dialog" aria-modal="true" aria-labelledby="settings-title" className={`${isDarkMode ? 'bg-slate-900/70 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]' : 'bg-white/80 border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]'} backdrop-blur-2xl border-b-[4px] border-[2px] md:border-b-[6px] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative flex flex-col max-h-[85dvh] ${isClosingSettings ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <button aria-label="Fechar Ajustes" onClick={() => handleCloseSettings(state.isSmoothMode)} className={`absolute top-6 right-6 md:top-8 md:right-8 p-3 md:p-4 rounded-full transition-colors shadow-sm active:scale-95 z-10 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20 hover:text-rose-400' : 'bg-stone-900/10 text-stone-600 hover:bg-stone-900/20 hover:text-rose-500'}`}>
              <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
            </button>

            <h3 id="settings-title" className={`text-[32px] md:text-[48px] font-black mb-2 md:mb-4 text-center uppercase tracking-tighter leading-none mt-4 md:mt-0 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Ajustes</h3>
            <p className={`text-[16px] md:text-[20px] font-bold uppercase tracking-widest mb-6 md:mb-8 text-center py-2 rounded-full border-2 ${isDarkMode ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-stone-900/5 text-stone-500 border-stone-900/10'}`}>Como prefere explorar?</p>
            
            <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
              
              <button aria-pressed={!state.isSmoothMode} onClick={() => actions.applySettings(false)} className={`p-5 md:p-6 rounded-[2rem] border-b-[4px] flex items-center gap-4 md:gap-6 active:translate-y-[4px] active:border-b-0 transition-all text-left group ${!state.isSmoothMode ? (isDarkMode ? 'bg-indigo-500/80 text-white border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-sky-400/90 text-sky-950 border-sky-500/50') : (isDarkMode ? 'bg-white/5 text-indigo-200 border-white/10 hover:bg-white/10' : 'bg-stone-900/5 text-sky-900 border-stone-900/10 hover:bg-stone-900/10')}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner border-[4px] group-hover:scale-110 transition-transform ${!state.isSmoothMode ? 'bg-white text-indigo-500 border-indigo-100' : 'bg-white/20 text-indigo-400 border-transparent'}`}><Rocket size={28} className="md:w-8 md:h-8" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-[18px] md:text-[24px] whitespace-nowrap leading-none mb-1">Competitivo</div>
                  <div className={`text-[12px] md:text-[14px] font-bold leading-tight ${!state.isSmoothMode ? (isDarkMode ? 'text-indigo-100' : 'text-sky-900') : (isDarkMode ? 'text-indigo-300' : 'text-sky-700')}`}>Câmera rápida. Alta performance.</div>
                </div>
              </button>

              <button aria-pressed={state.isSmoothMode} onClick={() => actions.applySettings(true)} className={`p-5 md:p-6 rounded-[2rem] border-b-[4px] flex items-center gap-4 md:gap-6 active:translate-y-[4px] active:border-b-0 transition-all text-left group ${state.isSmoothMode ? (isDarkMode ? 'bg-emerald-500/80 text-white border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-emerald-400/90 text-emerald-950 border-emerald-500/50') : (isDarkMode ? 'bg-white/5 text-emerald-200 border-white/10 hover:bg-white/10' : 'bg-stone-900/5 text-emerald-900 border-stone-900/10 hover:bg-stone-900/10')}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner border-[4px] group-hover:scale-110 transition-transform ${state.isSmoothMode ? 'bg-white text-emerald-500 border-emerald-100' : 'bg-white/20 text-emerald-400 border-transparent'}`}><Film size={28} className="md:w-8 md:h-8" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-[18px] md:text-[24px] whitespace-nowrap leading-none mb-1">Cinematográfico</div>
                  <div className={`text-[12px] md:text-[14px] font-bold leading-tight ${state.isSmoothMode ? (isDarkMode ? 'text-emerald-100' : 'text-emerald-900') : (isDarkMode ? 'text-emerald-300' : 'text-emerald-700')}`}>Desliza suavemente. Foco visual.</div>
                </div>
              </button>

              <div className={`mt-2 border-t-[2px] pt-6 ${isDarkMode ? 'border-white/10' : 'border-stone-900/10'}`}>
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Gift className="text-amber-500 w-6 h-6 md:w-8 md:h-8 animate-pulse-glow" strokeWidth={2.5}/>
                  <h4 className={`text-[20px] md:text-[28px] font-black uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Código Promo</h4>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    aria-label="Introduzir código promocional"
                    type="text" 
                    value={promoInput} 
                    onChange={e => setPromoInput(e.target.value.toUpperCase())} 
                    placeholder="COLE O CÓDIGO" 
                    className={`flex-1 border-[2px] rounded-[1.5rem] px-4 py-3 md:py-4 font-black uppercase tracking-widest text-center focus:outline-none transition-colors backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-amber-400 focus:bg-white/10' : 'bg-stone-900/5 border-stone-900/10 text-stone-700 placeholder:text-stone-400 focus:border-amber-400 focus:bg-white/50'}`}
                  />
                  <button onClick={handleRedeemClick} className="bg-amber-400 text-amber-950 px-6 py-3 md:py-4 rounded-[1.5rem] border-b-[4px] border-amber-500 font-black uppercase tracking-widest active:translate-y-[4px] active:border-b-0 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    Resgatar
                  </button>
                </div>
                
                {promoFeedback && (
                  <p aria-live="polite" className={`mt-4 text-center font-black uppercase tracking-widest text-[14px] md:text-[16px] animate-fade-in-up ${promoFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {promoFeedback.message}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {state.gameState === GAME_STATES.START && (
        <StartScreen 
          onStart={(region) => actions.startGame('normal', region)} 
          onStudy={() => actions.startGame('study')}
          onFootball={() => actions.startGame('football')} 
          onDaily={() => actions.startGame('daily')} 
          onOpenAchievements={() => actions.setShowAchievements(true)}
          onOpenTutorial={() => actions.setShowTutorial(true)}
          onOpenSettings={() => actions.setShowSettingsPrompt(true)}
          coins={state.coins}
          setCoins={actions.setCoins}
          currentTheme={state.activeTheme}
          setTheme={actions.setActiveTheme}
          themes={MAP_THEMES}
          unlockedThemes={state.unlockedThemes}
          setUnlockedThemes={actions.setUnlockedThemes}
          dailyCompleted={state.lastDailyDate === state.todayStr} 
          
          activeAvatar={state.activeAvatar}
          setShowShop={actions.setShowShop}
          isDarkMode={isDarkMode}
          toggleDarkMode={actions.toggleDarkMode}
        />
      )}
      
      {state.gameState === GAME_STATES.RESULT && (
        <ResultScreen 
          score={state.score} reason={state.endReason} bestScore={state.bestScore} 
          guessedCount={state.guessedCountries.length} 
          coinsEarned={state.lastCoinsEarned} 
          gameMode={state.gameMode} onRestart={() => actions.startGame(state.gameMode)} 
          onHome={() => { actions.quitGame(); actions.resetGlobe(); }} 
          isDarkMode={isDarkMode}
        />
      )}

      <GameHUD state={state} actions={actions} isDarkMode={isDarkMode} />
      
      {/* GLASSMORPHISM NO ESTUDO */}
      {state.studyCard && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6 pointer-events-auto">
          <div role="dialog" aria-modal="true" aria-labelledby="study-title" className={`${isDarkMode ? 'bg-slate-900/70 border-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2)]' : 'bg-white/80 border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]'} backdrop-blur-2xl border-b-[8px] border-[2px] p-12 rounded-[4rem] max-w-2xl w-full relative pt-32 mt-16 ${isClosingStudyCard ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <div className="absolute -top-24 left-1/2 -translate-x-1/2">
              <img 
                src={`https://flagcdn.com/w320/${state.studyCard.iso.toLowerCase()}.png`} 
                alt={`Bandeira de ${state.studyCard.name}`} 
                className={`w-[260px] h-[160px] object-cover rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] border-[8px] ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-white bg-stone-100'}`} 
              />
            </div>
            
            <div className="text-center mt-4">
              <h3 id="study-title" className={`text-[48px] font-black mb-2 tracking-tighter uppercase whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.studyCard.name}</h3>
              {!state.studyCard.isCorrect && ( <p className={`text-[20px] mb-8 font-black uppercase tracking-widest inline-block px-8 py-3 rounded-full border-[2px] whitespace-nowrap backdrop-blur-md ${isDarkMode ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'}`}>Clicou em: {state.studyCard.clickedName}</p> )}
              {state.studyCard.isCorrect && ( <p className={`text-[20px] mb-8 font-black uppercase tracking-widest inline-block px-8 py-3 rounded-full border-[2px] whitespace-nowrap backdrop-blur-md ${isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'}`}>+{state.studyCard.pointsGained} Pontos!</p> )}

              <div className={`flex flex-col gap-6 text-left rounded-[2.5rem] p-10 mb-10 border-[2px] shadow-inner ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-stone-900/5 border-stone-900/10'}`}>
                <div className={`flex justify-between items-center border-b-[2px] pb-4 ${isDarkMode ? 'border-white/10' : 'border-stone-900/10'}`}>
                  <span className={`text-[20px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Capital</span>
                  <span className={`text-[28px] font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.studyCard.capital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[20px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Continente</span>
                  <span className={`text-[28px] font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.studyCard.continent}</span>
                </div>
              </div>

              {(!state.studyCard.isCorrect && state.studyCard.livesRemaining <= 0 && state.gameMode !== GAME_MODES.DAILY) ? (
                <div className="flex gap-4">
                  <button onClick={handleDismissStudyCard} className={`w-1/3 py-10 rounded-[2.5rem] border-b-[6px] font-black uppercase tracking-widest text-[28px] active:translate-y-[6px] active:border-b-0 transition-all whitespace-nowrap ${isDarkMode ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : 'bg-stone-900/10 text-stone-600 border-stone-900/20 hover:bg-stone-900/20'}`}>
                    Sair
                  </button>
                  <button onClick={handleRevive} disabled={state.coins < 100} className="w-2/3 bg-amber-400 text-amber-950 py-10 rounded-[2.5rem] border-b-[6px] border-amber-600 font-black uppercase tracking-widest text-[28px] flex justify-center items-center gap-4 active:translate-y-[6px] active:border-b-0 disabled:opacity-50 disabled:grayscale transition-all hover:bg-amber-500 whitespace-nowrap shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                    Reviver (100 <Coins size={36} />)
                  </button>
                </div>
              ) : (
                <button onClick={handleDismissStudyCard} className={`w-full py-10 rounded-[2.5rem] font-black uppercase tracking-widest text-[36px] flex items-center justify-center gap-4 active:translate-y-[6px] active:border-b-0 transition-all whitespace-nowrap border-b-[8px] ${state.studyCard.isCorrect ? 'bg-emerald-500 text-white border-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-rose-500 text-white border-rose-700 shadow-[0_0_20px_rgba(225,29,72,0.4)]'}`}>
                  Continuar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
