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

  // STARTUP INICIAL
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // SISTEMA DE LOADING PARA TROCA DE BIOMAS (Otimização de GPU Android)
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
    <div className={`relative w-full h-[100dvh] overflow-hidden select-none bg-white transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0 scale-105'}`}>
      
      <div className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-200 ${state.screenFlash === 'success' ? 'bg-green-500/20' : state.screenFlash === 'error' ? 'bg-rose-500/20' : state.timeLeft <= 10 && state.gameState === GAME_STATES.PLAYING && !state.studyCard && state.gameMode !== GAME_MODES.STUDY ? 'shadow-[inset_0_0_100px_rgba(244,63,94,0.2)]' : ''}`} />

      {state.achievementToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up w-max max-w-[90vw]">
          <div className="bg-amber-400 p-[6px] rounded-full shadow-lg">
            <div className="bg-white px-8 py-4 rounded-full flex items-center gap-4">
              <Trophy className="text-amber-500 animate-bounce-short" size={32} strokeWidth={2.5}/>
              <div>
                <p className="text-[16px] text-stone-400 font-black uppercase tracking-widest leading-none mb-2">Conquista Desbloqueada!</p>
                <p className="text-[24px] font-black text-stone-800 leading-none truncate">{state.achievementToast.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.floatingPoints.map(point => (
        <div key={point.id} className={`absolute z-50 pointer-events-none animate-float-point text-[32px] font-black drop-shadow-md ${point.colorClass}`} style={{ left: point.x - 30, top: point.y - 60 }}>{point.text}</div>
      ))}

      {/* TELA DE LOADING AO TROCAR DE BIOMA (MASCARA O ENGASGO DO WEBGL) */}
      <div aria-hidden={!isChangingTheme} className={`absolute inset-0 z-[150] bg-stone-900 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isChangingTheme ? 'opacity-100' : 'opacity-0'}`}>
         <Compass className="text-sky-400 w-16 h-16 animate-spin-slow mb-4" strokeWidth={2.5} />
         <p className="text-white font-black uppercase tracking-widest text-[18px]">Sincronizando Bioma...</p>
      </div>

      <GlobeVisualizer 
        ref={globeRef} geoData={state.geoData} onCountryClick={actions.handleCountryClick} 
        theme={state.activeTheme} gameState={state.gameState} guessedCountries={state.guessedCountries} 
        travelArcs={state.travelArcs} impactRings={state.impactRings} isMobile={state.isMobile} 
        isSmoothMode={state.isSmoothMode} 
      />
      
      {state.showTutorial && <TutorialModal onClose={actions.closeTutorial} />}
      {state.showAchievements && <AchievementsModal onClose={() => actions.setShowAchievements(false)} unlockedIds={state.unlockedAchievements} />}
      
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
        />
      )}

      {state.showSettingsPrompt && (
        <div className={`absolute inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-6 ${isClosingSettings ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[85dvh] ${isClosingSettings ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <button onClick={() => handleCloseSettings(state.isSmoothMode)} className="absolute top-6 right-6 md:top-8 md:right-8 bg-stone-100 p-3 md:p-4 rounded-full text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-colors shadow-sm active:scale-95 z-10">
              <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
            </button>

            <h3 className="text-[32px] md:text-[48px] font-black text-stone-800 mb-2 md:mb-4 text-center uppercase tracking-tighter leading-none mt-4 md:mt-0">Ajustes</h3>
            <p className="text-stone-400 text-[16px] md:text-[20px] font-bold uppercase tracking-widest mb-6 md:mb-8 text-center bg-stone-50 py-2 rounded-full border-2 border-stone-100">Como prefere explorar?</p>
            
            <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
              
              <button onClick={() => actions.applySettings(false)} className={`p-5 md:p-6 rounded-[2rem] border-b-[8px] flex items-center gap-4 md:gap-6 active:translate-y-[8px] active:border-b-0 transition-all text-left group ${!state.isSmoothMode ? 'bg-sky-400 text-sky-950 border-sky-500' : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner border-[4px] group-hover:scale-110 transition-transform ${!state.isSmoothMode ? 'bg-white text-sky-500 border-sky-100' : 'bg-white text-sky-400 border-sky-100'}`}><Rocket size={28} className="md:w-8 md:h-8" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-[18px] md:text-[24px] whitespace-nowrap leading-none mb-1">Competitivo</div>
                  <div className={`text-[12px] md:text-[14px] font-bold leading-tight ${!state.isSmoothMode ? 'text-sky-900' : 'text-sky-700'}`}>Câmera rápida. Alta performance.</div>
                </div>
              </button>

              <button onClick={() => actions.applySettings(true)} className={`p-5 md:p-6 rounded-[2rem] border-b-[8px] flex items-center gap-4 md:gap-6 active:translate-y-[8px] active:border-b-0 transition-all text-left group ${state.isSmoothMode ? 'bg-emerald-400 text-emerald-950 border-emerald-500' : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner border-[4px] group-hover:scale-110 transition-transform ${state.isSmoothMode ? 'bg-white text-emerald-500 border-emerald-100' : 'bg-white text-emerald-400 border-emerald-100'}`}><Film size={28} className="md:w-8 md:h-8" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-[18px] md:text-[24px] whitespace-nowrap leading-none mb-1">Cinematográfico</div>
                  <div className={`text-[12px] md:text-[14px] font-bold leading-tight ${state.isSmoothMode ? 'text-emerald-900' : 'text-emerald-700'}`}>Desliza suavemente. Foco visual.</div>
                </div>
              </button>

              <div className="mt-2 border-t-[4px] border-stone-100 pt-6">
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Gift className="text-amber-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5}/>
                  <h4 className="text-[20px] md:text-[28px] font-black text-stone-800 uppercase tracking-tighter leading-none">Código Promo</h4>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    value={promoInput} 
                    onChange={e => setPromoInput(e.target.value.toUpperCase())} 
                    placeholder="COLE O CÓDIGO" 
                    className="flex-1 bg-stone-100 border-[4px] border-stone-200 rounded-[1.5rem] px-4 py-3 md:py-4 font-black text-stone-700 uppercase tracking-widest text-center focus:outline-none focus:border-amber-400 focus:bg-white transition-colors placeholder:text-stone-300"
                  />
                  <button onClick={handleRedeemClick} className="bg-amber-400 text-amber-950 px-6 py-3 md:py-4 rounded-[1.5rem] border-b-[6px] border-amber-500 font-black uppercase tracking-widest active:translate-y-[6px] active:border-b-0 transition-all flex items-center justify-center">
                    Resgatar
                  </button>
                </div>
                
                {promoFeedback && (
                  <p aria-live="polite" className={`mt-4 text-center font-black uppercase tracking-widest text-[14px] md:text-[16px] animate-fade-in-up ${promoFeedback.success ? 'text-emerald-500' : 'text-rose-500'}`}>
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
        />
      )}
      
      {state.gameState === GAME_STATES.RESULT && (
        <ResultScreen 
          score={state.score} reason={state.endReason} bestScore={state.bestScore} 
          guessedCount={state.guessedCountries.length} 
          coinsEarned={state.lastCoinsEarned} 
          gameMode={state.gameMode} onRestart={() => actions.startGame(state.gameMode)} 
          onHome={() => { actions.quitGame(); actions.resetGlobe(); }} 
        />
      )}

      <GameHUD state={state} actions={actions} />
      
      {state.studyCard && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center bg-stone-900/80 px-6 pointer-events-auto ${isClosingStudyCard ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white border-b-[16px] border-stone-200 p-12 rounded-[4rem] max-w-2xl w-full shadow-2xl relative pt-32 mt-16 ${isClosingStudyCard ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <div className="absolute -top-24 left-1/2 -translate-x-1/2">
              <img 
                src={`https://flagcdn.com/w320/${state.studyCard.iso.toLowerCase()}.png`} 
                alt={`Bandeira`} 
                className="w-[260px] h-[160px] object-cover rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] border-[12px] border-white bg-stone-100" 
              />
            </div>
            
            <div className="text-center mt-4">
              <h3 className="text-[48px] font-black text-stone-800 mb-2 tracking-tighter uppercase whitespace-nowrap">{state.studyCard.name}</h3>
              {!state.studyCard.isCorrect && ( <p className="text-[20px] text-rose-500 mb-8 font-black uppercase tracking-widest bg-rose-50 inline-block px-8 py-3 rounded-full border-[4px] border-rose-100 whitespace-nowrap">Clicou em: {state.studyCard.clickedName}</p> )}
              {state.studyCard.isCorrect && ( <p className="text-[20px] text-green-600 mb-8 font-black uppercase tracking-widest bg-green-50 inline-block px-8 py-3 rounded-full border-[4px] border-green-100 whitespace-nowrap">+{state.studyCard.pointsGained} Pontos!</p> )}

              <div className="flex flex-col gap-6 text-left bg-stone-50 rounded-[2.5rem] p-10 mb-10 border-4 border-stone-100 shadow-inner">
                <div className="flex justify-between items-center border-b-4 border-stone-200 pb-4">
                  <span className="text-stone-400 text-[20px] font-black uppercase tracking-widest whitespace-nowrap">Capital</span>
                  <span className="text-stone-800 text-[28px] font-bold whitespace-nowrap">{state.studyCard.capital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 text-[20px] font-black uppercase tracking-widest whitespace-nowrap">Continente</span>
                  <span className="text-stone-800 text-[28px] font-bold whitespace-nowrap">{state.studyCard.continent}</span>
                </div>
              </div>

              {(!state.studyCard.isCorrect && state.studyCard.livesRemaining <= 0 && state.gameMode !== GAME_MODES.DAILY) ? (
                <div className="flex gap-4">
                  <button onClick={handleDismissStudyCard} className="w-1/3 bg-stone-100 text-stone-500 py-10 rounded-[2.5rem] border-b-[10px] border-stone-200 font-black uppercase tracking-widest text-[28px] active:translate-y-[10px] active:border-b-0 transition-all hover:bg-stone-200 whitespace-nowrap">
                    Sair
                  </button>
                  <button onClick={handleRevive} disabled={state.coins < 100} className="w-2/3 bg-amber-400 text-amber-900 py-10 rounded-[2.5rem] border-b-[10px] border-amber-500 font-black uppercase tracking-widest text-[28px] flex justify-center items-center gap-4 active:translate-y-[10px] active:border-b-0 disabled:opacity-50 disabled:grayscale transition-all hover:bg-amber-500 whitespace-nowrap">
                    Reviver (100 <Coins size={36} />)
                  </button>
                </div>
              ) : (
                <button onClick={handleDismissStudyCard} className={`w-full py-10 rounded-[2.5rem] font-black uppercase tracking-widest text-[36px] flex items-center justify-center gap-4 active:translate-y-[10px] active:border-b-0 transition-all whitespace-nowrap ${state.studyCard.isCorrect ? 'bg-green-500 text-white border-b-[12px] border-green-700 hover:bg-green-600' : 'bg-rose-500 text-white border-b-[12px] border-rose-700 hover:bg-rose-600'}`}>
                  Continuar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
