import React, { Suspense, lazy, useRef, useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameHUD from './components/GameHUD';
import { TutorialModal, AchievementsModal, ShopModal, CreditsModal } from './components/Modals';
import { Trophy, Coins, Rocket, Film, X, Gift, Compass, Vibrate, VibrateOff, Info, Volume2, VolumeX, BatteryCharging, Smartphone } from 'lucide-react';

import { useGeoGame } from './hooks/useGeoGame';
import { GAME_STATES, MAP_THEMES, GAME_MODES } from './constants';

const GlobeVisualizer = lazy(() => import('./components/GlobeVisualizer'));
const ResultScreen = lazy(() => import('./components/ResultScreen'));

export default function App() {
  const globeRef = useRef();
  const { state, actions } = useGeoGame(globeRef);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  
  const [isClosingSettings, setIsClosingSettings] = useState(false);
  const [isClosingStudyCard, setIsClosingStudyCard] = useState(false);
  
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);
  
  const [showCredits, setShowCredits] = useState(false);

  const { isDarkMode, isVibrationEnabled, isSoundEnabled, isBatterySaverMode } = state;

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

  useEffect(() => {
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    document.body.classList.toggle('native-shell', state.isNativePlatform);
    document.body.classList.toggle('android-shell', state.isAndroidPlatform);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDarkMode ? '#0f172a' : '#38bdf8');
    }
  }, [isDarkMode, state.isAndroidPlatform, state.isNativePlatform]);

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
    <main className={`relative w-full h-[100dvh] overflow-hidden select-none transition-all duration-1000 ease-out ${isDarkMode ? 'bg-indigo-950 text-slate-100' : 'bg-white text-stone-900'} ${isLoaded ? 'opacity-100' : 'opacity-0 scale-105'}`}>
      
      <div aria-hidden="true" className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-200 ${state.screenFlash === 'success' ? 'bg-green-500/20' : state.screenFlash === 'error' ? 'bg-rose-500/20' : state.timeLeft <= 10 && state.gameState === GAME_STATES.PLAYING && !state.studyCard && state.gameMode !== GAME_MODES.STUDY ? 'shadow-[inset_0_0_100px_rgba(244,63,94,0.2)]' : ''}`} />

      {state.achievementToast && (
        <div role="alert" className="absolute top-16 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up w-max max-w-[90vw]">
          <div className="bg-amber-400 p-[6px] rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)]">
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

      {/* OPTIMIZATION: will-change-transform garante 60FPS nas animações flutuantes */}
      {state.floatingPoints.map(point => (
        <div aria-hidden="true" key={point.id} className={`absolute z-50 pointer-events-none animate-float-point text-[32px] font-black drop-shadow-md ${point.colorClass}`} style={{ left: point.x - 30, top: point.y - 60, willChange: 'transform, opacity' }}>{point.text}</div>
      ))}

      <div aria-hidden={!isChangingTheme} className={`absolute inset-0 z-[150] ${isDarkMode ? 'bg-indigo-950' : 'bg-stone-900'} flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isChangingTheme ? 'opacity-100' : 'opacity-0'}`}>
         <Compass className="text-sky-400 w-16 h-16 animate-spin-slow mb-4" strokeWidth={2.5} />
         <p className="text-white font-black uppercase tracking-widest text-[18px]">Sincronizando Bioma...</p>
      </div>

      <Suspense fallback={<div aria-hidden="true" className="absolute inset-0 z-0" />}>
        <GlobeVisualizer 
          ref={globeRef} geoData={state.geoData} onCountryClick={actions.handleCountryClick} 
          theme={state.activeTheme} gameState={state.gameState} guessedCountries={state.guessedCountries} 
          travelArcs={state.travelArcs} impactRings={state.impactRings} isMobile={state.isMobile} 
          isSmoothMode={state.isSmoothMode}
          isBatterySaverMode={state.isBatterySaverMode}
          isDarkMode={isDarkMode}
        />
      </Suspense>
      
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

      {state.showSettingsPrompt && (
        <div className={`absolute inset-0 z-[200] flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} backdrop-blur-md px-4 md:px-6 py-6 ${isClosingSettings ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div role="dialog" aria-modal="true" aria-labelledby="settings-title" className={`${isDarkMode ? 'glass-panel neon-glow-cyan' : 'glass-panel-light shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5'} p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative flex flex-col max-h-[85dvh] ${isClosingSettings ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <button aria-label="Fechar Ajustes" onClick={() => handleCloseSettings(state.isSmoothMode)} className={`absolute top-6 right-6 md:top-8 md:right-8 p-3 md:p-4 rounded-full transition-colors shadow-sm active:scale-95 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-400' : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-rose-500'}`}>
              <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
            </button>

            <h3 id="settings-title" className={`text-[32px] md:text-[48px] font-black mb-2 md:mb-4 text-center uppercase tracking-tighter leading-none mt-4 md:mt-0 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Ajustes</h3>
            <p className={`text-[16px] md:text-[20px] font-bold uppercase tracking-widest mb-6 md:mb-8 text-center py-2 rounded-full border-2 ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-stone-50 text-stone-400 border-stone-100'}`}>Como prefere explorar?</p>
            
            <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
              
              <button aria-pressed={!state.isSmoothMode} onClick={() => actions.applySettings(false)} className={`p-5 md:p-6 rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all text-left group ${!state.isSmoothMode ? (isDarkMode ? 'bg-indigo-500/20 border border-indigo-400 neon-glow-cyan text-white' : 'glass-panel-light bg-sky-100 border border-sky-400 shadow-md') : (isDarkMode ? 'glass-panel hover:bg-white/5 hover:border-white/20' : 'glass-panel-light border border-slate-200 hover:bg-slate-50')}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${!state.isSmoothMode ? 'bg-white text-indigo-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/10 text-slate-300'}`}><Rocket size={28} className="md:w-8 md:h-8" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-[18px] md:text-[24px] whitespace-nowrap leading-none mb-1">Competitivo</div>
                  <div className={`text-[12px] md:text-[14px] font-bold leading-tight ${!state.isSmoothMode ? (isDarkMode ? 'text-indigo-200' : 'text-sky-900') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>Câmera rápida. Alta performance.</div>
                </div>
              </button>

              <button aria-pressed={state.isSmoothMode} onClick={() => actions.applySettings(true)} className={`p-5 md:p-6 rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all text-left group ${state.isSmoothMode ? (isDarkMode ? 'bg-emerald-500/20 border border-emerald-400 neon-glow-emerald text-white' : 'glass-panel-light bg-emerald-100 border border-emerald-400 shadow-md') : (isDarkMode ? 'glass-panel hover:bg-white/5 hover:border-white/20' : 'glass-panel-light border border-slate-200 hover:bg-slate-50')}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${state.isSmoothMode ? 'bg-white text-emerald-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/10 text-slate-300'}`}><Film size={28} className="md:w-8 md:h-8" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-[18px] md:text-[24px] whitespace-nowrap leading-none mb-1">Cinematográfico</div>
                  <div className={`text-[12px] md:text-[14px] font-bold leading-tight ${state.isSmoothMode ? (isDarkMode ? 'text-emerald-200' : 'text-emerald-900') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>Desliza suavemente. Foco visual.</div>
                </div>
              </button>

              <div className={`rounded-[2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-slate-700' : 'glass-panel-light border-slate-200'}`}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} size={24} />
                    <div>
                      <h4 className={`text-[20px] md:text-[24px] font-black uppercase tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Android & Energia</h4>
                      <p className={`text-[12px] md:text-[14px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Pronto para WebView, toque e economia de bateria.</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-widest border ${
                    state.isAndroidPlatform
                      ? isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : state.isNativePlatform
                        ? isDarkMode ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-sky-100 text-sky-700 border-sky-300'
                        : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}>
                    {state.isAndroidPlatform ? 'Android Nativo' : state.isNativePlatform ? 'App Nativo' : 'Web First'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={() => { actions.toggleBatterySaver(); actions.triggerHaptic(); }} className={`p-4 rounded-[1.5rem] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isBatterySaverMode
                      ? isDarkMode ? 'bg-amber-500/20 border border-amber-400 text-amber-200' : 'bg-amber-100 border border-amber-300 text-amber-800'
                      : isDarkMode ? 'glass-panel hover:bg-slate-800' : 'glass-panel-light hover:bg-slate-50 border border-slate-200'
                  }`}>
                    <BatteryCharging size={20} className={isBatterySaverMode ? 'text-amber-400' : isDarkMode ? 'text-slate-300' : 'text-stone-500'} />
                    Economia: {isBatterySaverMode ? 'ON' : 'OFF'}
                  </button>

                  <button onClick={() => { actions.toggleSound(); actions.triggerHaptic(); }} className={`p-4 rounded-[1.5rem] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'glass-panel hover:bg-slate-800' : 'glass-panel-light hover:bg-slate-50 border border-slate-200'}`}>
                    {isSoundEnabled ? <Volume2 size={20} className="text-emerald-500" /> : <VolumeX size={20} className="text-rose-500" />}
                    <span className={isDarkMode ? 'text-slate-300' : 'text-stone-600'}>Som: {isSoundEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              <div className={`mt-2 border-t-[4px] pt-6 ${isDarkMode ? 'border-slate-700' : 'border-stone-100'}`}>
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Gift className="text-amber-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5}/>
                  <h4 className={`text-[20px] md:text-[28px] font-black uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Código Promo</h4>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    aria-label="Introduzir código promocional"
                    type="text" 
                    value={promoInput} 
                    onChange={e => setPromoInput(e.target.value.toUpperCase())} 
                    placeholder="COLE O CÓDIGO" 
                    className={`flex-1 border-[4px] rounded-[1.5rem] px-4 py-3 md:py-4 font-black uppercase tracking-widest text-center focus:outline-none transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:bg-slate-900' : 'bg-stone-100 border-stone-200 text-stone-700 placeholder:text-stone-300 focus:border-amber-400 focus:bg-white'}`}
                  />
                  <button onClick={handleRedeemClick} className="bg-amber-400/90 text-amber-950 px-6 py-3 md:py-4 rounded-[1.5rem] font-black uppercase tracking-widest transition-all flex items-center justify-center hover:bg-amber-300 neon-glow-amber">
                    Resgatar
                  </button>
                </div>
                
                {promoFeedback && (
                  <p aria-live="polite" className={`mt-4 text-center font-black uppercase tracking-widest text-[14px] md:text-[16px] animate-fade-in-up ${promoFeedback.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {promoFeedback.message}
                  </p>
                )}
              </div>

              <div className={`mt-2 border-t-[4px] pt-4 md:pt-6 flex flex-col sm:flex-row gap-4 ${isDarkMode ? 'border-slate-700' : 'border-stone-100'}`}>
                  <button onClick={() => { actions.toggleVibration(); actions.triggerHaptic(); }} className={`flex-1 p-4 rounded-[1.5rem] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all group ${isDarkMode ? 'glass-panel hover:bg-slate-800' : 'glass-panel-light hover:bg-slate-50'}`}>
                    {isVibrationEnabled ? <Vibrate size={20} className="text-emerald-500" /> : <VibrateOff size={20} className="text-rose-500" />}
                    <span className={isDarkMode ? 'text-slate-300' : 'text-stone-600'}>Vibração: {isVibrationEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                  <button onClick={() => { actions.triggerHaptic(); setShowCredits(true); }} className={`flex-1 p-4 rounded-[1.5rem] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'glass-panel text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-500/50' : 'glass-panel-light text-indigo-700 hover:bg-indigo-50 border-indigo-200'}`}>
                    <Info size={20} /> Créditos
                  </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {showCredits && <CreditsModal onClose={() => { actions.triggerHaptic(); setShowCredits(false); }} isDarkMode={isDarkMode} />}

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
          dailyCompleted={state.playedDailyDates.includes(state.todayStr)} 
          countryCount={state.countryCount}
          
          activeAvatar={state.activeAvatar}
          setShowShop={actions.setShowShop}
          isBatterySaverMode={state.isBatterySaverMode}
          isNativePlatform={state.isNativePlatform}
          isDarkMode={isDarkMode}
          toggleDarkMode={actions.toggleDarkMode}
        />
      )}
      
      {state.gameState === GAME_STATES.RESULT && (
        <Suspense fallback={null}>
          <ResultScreen 
            score={state.score} reason={state.endReason} previousBestScore={state.previousBestScore}
            guessedCount={state.guessedCountries.length} 
            coinsEarned={state.lastCoinsEarned} 
            gameMode={state.gameMode} onRestart={() => actions.startGame(state.gameMode)} 
            onHome={() => { actions.quitGame(); actions.resetGlobe(); }} 
            isDarkMode={isDarkMode}
          />
        </Suspense>
      )}

      <GameHUD state={state} actions={actions} isDarkMode={isDarkMode} />
      
      {state.studyCard && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} px-6 pointer-events-auto ${isClosingStudyCard ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div role="dialog" aria-modal="true" aria-labelledby="study-title" className={`${isDarkMode ? 'glass-panel neon-glow-emerald' : 'glass-panel-light shadow-2xl'} p-8 md:p-12 rounded-[3.5rem] md:rounded-[4rem] max-w-2xl w-full relative pt-32 mt-16 ${isClosingStudyCard ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
            
            <div className="absolute -top-24 left-1/2 -translate-x-1/2">
              <img 
                src={`https://flagcdn.com/w320/${state.studyCard.iso.toLowerCase()}.png`} 
                alt={`Bandeira de ${state.studyCard.name}`} 
                className={`w-[260px] h-[160px] object-cover rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${isDarkMode ? 'border-[4px] border-white/20' : 'border-[8px] border-white'}`} 
              />
            </div>
            
            <div className="text-center mt-4">
              <h3 id="study-title" className={`text-[48px] font-black mb-2 tracking-tighter uppercase whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.studyCard.name}</h3>
              {!state.studyCard.isCorrect && ( <p className={`text-[20px] mb-8 font-black uppercase tracking-widest inline-block px-8 py-3 rounded-full border-[4px] whitespace-nowrap ${isDarkMode ? 'text-rose-400 bg-rose-950/50 border-rose-900' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>Clicou em: {state.studyCard.clickedName}</p> )}
              {state.studyCard.isCorrect && ( <p className={`text-[20px] mb-8 font-black uppercase tracking-widest inline-block px-8 py-3 rounded-full border-[4px] whitespace-nowrap ${isDarkMode ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900' : 'text-green-600 bg-green-50 border-green-100'}`}>+{state.studyCard.pointsGained} Pontos!</p> )}

              <div className={`flex flex-col gap-6 text-left rounded-[2.5rem] p-10 mb-10 border-4 shadow-inner ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
                <div className={`flex justify-between items-center border-b-4 pb-4 ${isDarkMode ? 'border-slate-700' : 'border-stone-200'}`}>
                  <span className={`text-[20px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Capital</span>
                  <span className={`text-[28px] font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.studyCard.capital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[20px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Continente</span>
                  <span className={`text-[28px] font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.studyCard.continent}</span>
                </div>
              </div>

              {(!state.studyCard.isCorrect && state.studyCard.livesRemaining <= 0 && state.gameMode !== GAME_MODES.DAILY) ? (
                <div className="flex gap-4 mt-6">
                  <button onClick={handleDismissStudyCard} className={`w-1/3 py-8 rounded-[2rem] font-black uppercase tracking-widest text-[24px] transition-all whitespace-nowrap border ${isDarkMode ? 'glass-panel hover:bg-white/10 hover:text-white' : 'glass-panel-light hover:bg-slate-100'}`}>
                    Sair
                  </button>
                  <button onClick={handleRevive} disabled={state.coins < 100} className="w-2/3 bg-amber-500/90 text-amber-950 py-8 rounded-[2rem] font-black uppercase tracking-widest text-[24px] flex justify-center items-center gap-4 disabled:opacity-50 disabled:grayscale transition-all hover:bg-amber-400 whitespace-nowrap neon-glow-amber">
                    Reviver (100 <Coins size={32} />)
                  </button>
                </div>
              ) : (
                <button onClick={handleDismissStudyCard} className={`w-full mt-6 py-8 rounded-[2rem] font-black uppercase tracking-widest text-[28px] flex items-center justify-center gap-4 transition-all whitespace-nowrap ${state.studyCard.isCorrect ? 'bg-emerald-500/90 text-white neon-glow-emerald hover:bg-emerald-400' : 'bg-rose-500/90 text-white neon-glow-rose hover:bg-rose-400'}`}>
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
