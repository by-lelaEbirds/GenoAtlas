import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  Coins,
  Compass,
  Film,
  Gift,
  Info,
  Rocket,
  Trophy,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

import StartScreen from './components/StartScreen';
import GameHUD from './components/GameHUD';
import { TutorialModal, AchievementsModal, ShopModal, CreditsModal } from './components/Modals';
import { useGeoGame } from './hooks/useGeoGame';
import { GAME_MODES, GAME_STATES, MAP_THEMES } from './constants';

const loadGlobeVisualizer = () => import('./components/GlobeVisualizer');
const loadResultScreen = () => import('./components/ResultScreen');

const GlobeVisualizer = lazy(loadGlobeVisualizer);
const ResultScreen = lazy(loadResultScreen);

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

  const { isDarkMode, isSoundEnabled, isVibrationEnabled } = state;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preloadScreens = () => {
      loadGlobeVisualizer();
      loadResultScreen();
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadScreens, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(preloadScreens, 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return undefined;
    }

    setIsChangingTheme(true);
    const themeTimer = window.setTimeout(() => setIsChangingTheme(false), 800);
    return () => window.clearTimeout(themeTimer);
  }, [isLoaded, state.activeTheme.id]);

  useEffect(() => {
    const backgroundColor = isDarkMode ? '#0f172a' : '#dff4ff';

    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
    document.body.classList.toggle('native-shell', state.isNativePlatform);
    document.body.classList.toggle('android-shell', state.isAndroidPlatform);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', backgroundColor);
    }
  }, [isDarkMode, state.isAndroidPlatform, state.isNativePlatform]);

  const showInteractiveGlobe = state.gameState === GAME_STATES.PLAYING;

  const handleCloseSettings = (isSmooth) => {
    setIsClosingSettings(true);
    window.setTimeout(() => {
      actions.applySettings(isSmooth);
      setIsClosingSettings(false);
      setPromoFeedback(null);
      setPromoInput('');
    }, 200);
  };

  const handleDismissStudyCard = () => {
    setIsClosingStudyCard(true);
    window.setTimeout(() => {
      actions.dismissStudyCard();
      setIsClosingStudyCard(false);
    }, 200);
  };

  const handleRevive = () => {
    setIsClosingStudyCard(true);
    window.setTimeout(() => {
      actions.revive();
      setIsClosingStudyCard(false);
    }, 200);
  };

  const handleRedeemClick = () => {
    if (!promoInput) {
      return;
    }

    const result = actions.redeemCode(promoInput);
    setPromoFeedback(result);
    setPromoInput('');
    window.setTimeout(() => setPromoFeedback(null), 4000);
  };

  return (
    <main
      className={`relative h-[100dvh] w-full overflow-hidden select-none transition-all duration-1000 ease-out ${
        isDarkMode ? 'bg-indigo-950 text-slate-100' : 'bg-sky-100 text-stone-900'
      } ${isLoaded ? 'opacity-100' : 'scale-105 opacity-0'}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-10 transition-colors duration-200 ${
          state.screenFlash === 'success'
            ? 'bg-green-500/20'
            : state.screenFlash === 'error'
              ? 'bg-rose-500/20'
              : state.timeLeft <= 10 &&
                  state.gameState === GAME_STATES.PLAYING &&
                  !state.studyCard &&
                  state.gameMode !== GAME_MODES.STUDY
                ? 'shadow-[inset_0_0_100px_rgba(244,63,94,0.2)]'
                : ''
        }`}
      />

      {state.achievementToast && (
        <div role="alert" className="absolute left-1/2 top-16 z-[200] w-max max-w-[90vw] -translate-x-1/2 animate-fade-in-up">
          <div className="rounded-full bg-amber-400 p-[6px] shadow-[0_0_20px_rgba(251,191,36,0.6)]">
            <div className={`flex items-center gap-4 rounded-full px-8 py-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <Trophy className="animate-bounce-short text-amber-500" size={32} strokeWidth={2.5} />
              <div>
                <p className={`mb-2 text-[16px] font-black uppercase leading-none tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>
                  Conquista desbloqueada!
                </p>
                <p className={`truncate text-[24px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                  {state.achievementToast.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.floatingPoints.map((point) => (
        <div
          key={point.id}
          aria-hidden="true"
          className={`pointer-events-none absolute z-50 text-[32px] font-black drop-shadow-md animate-float-point ${point.colorClass}`}
          style={{ left: point.x - 30, top: point.y - 60, willChange: 'transform, opacity' }}
        >
          {point.text}
        </div>
      ))}

      <div
        aria-hidden={!isChangingTheme}
        className={`pointer-events-none absolute inset-0 z-[150] flex flex-col items-center justify-center transition-opacity duration-300 ${
          isDarkMode ? 'bg-indigo-950' : 'bg-stone-900'
        } ${isChangingTheme ? 'opacity-100' : 'opacity-0'}`}
      >
        <Compass className="mb-4 h-16 w-16 animate-spin-slow text-sky-400" strokeWidth={2.5} />
        <p className="text-[18px] font-black uppercase tracking-widest text-white">Sincronizando bioma...</p>
      </div>

      {showInteractiveGlobe && (
        <Suspense fallback={<div aria-hidden="true" className="absolute inset-0 z-0" />}>
          <GlobeVisualizer
            ref={globeRef}
            geoData={state.geoData}
            onCountryClick={actions.handleCountryClick}
            theme={state.activeTheme}
            gameState={state.gameState}
            guessedCountries={state.guessedCountries}
            travelArcs={state.travelArcs}
            impactRings={state.impactRings}
            isMobile={state.isMobile}
            isSmoothMode={state.isSmoothMode}
            isBatterySaverMode={state.isBatterySaverMode}
            isDarkMode={isDarkMode}
          />
        </Suspense>
      )}

      {state.showTutorial && <TutorialModal onClose={actions.closeTutorial} isDarkMode={isDarkMode} />}
      {state.showAchievements && (
        <AchievementsModal
          onClose={() => actions.setShowAchievements(false)}
          unlockedIds={state.unlockedAchievements}
          isDarkMode={isDarkMode}
        />
      )}

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
        <div
          className={`absolute inset-0 z-[200] flex items-center justify-center px-4 py-6 backdrop-blur-md md:px-6 ${
            isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'
          } ${isClosingSettings ? 'animate-fade-out' : 'animate-fade-in'}`}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className={`relative flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-[2.5rem] p-8 md:rounded-[4rem] md:p-12 ${
              isDarkMode
                ? 'glass-panel neon-glow-cyan'
                : 'glass-panel-light ring-1 ring-black/5 shadow-[0_30px_60px_rgba(0,0,0,0.15)]'
            } ${isClosingSettings ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}
          >
            <button
              type="button"
              aria-label="Fechar ajustes"
              onClick={() => handleCloseSettings(state.isSmoothMode)}
              className={`absolute right-6 top-6 z-10 rounded-full p-3 shadow-sm transition-colors active:scale-95 md:right-8 md:top-8 md:p-4 ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-400'
                  : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-rose-500'
              }`}
            >
              <X size={28} className="md:h-9 md:w-9" strokeWidth={3} />
            </button>

            <h3
              id="settings-title"
              className={`mt-4 text-center text-[32px] font-black uppercase leading-none tracking-tighter md:mt-0 md:text-[48px] ${
                isDarkMode ? 'text-white' : 'text-stone-800'
              }`}
            >
              Ajustes
            </h3>
            <p
              className={`mb-6 mt-2 rounded-full border-2 py-2 text-center text-[16px] font-bold uppercase tracking-widest md:mb-8 md:text-[20px] ${
                isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-stone-100 bg-stone-50 text-stone-400'
              }`}
            >
              Como prefere explorar?
            </p>

            <div className="scroll-surface custom-scrollbar flex flex-col gap-4 overflow-y-auto pb-4 pr-2 md:gap-6">
              <button
                type="button"
                aria-pressed={!state.isSmoothMode}
                onClick={() => actions.applySettings(false)}
                className={`group flex items-center gap-4 rounded-[2rem] p-5 text-left transition-all md:gap-6 md:p-6 ${
                  !state.isSmoothMode
                    ? isDarkMode
                      ? 'border border-indigo-400 bg-indigo-500/20 text-white neon-glow-cyan'
                      : 'glass-panel-light border border-sky-400 bg-sky-100 shadow-md'
                    : isDarkMode
                      ? 'glass-panel hover:border-white/20 hover:bg-white/5'
                      : 'glass-panel-light border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-inner transition-transform group-hover:scale-110 md:h-16 md:w-16 ${
                    !state.isSmoothMode
                      ? 'bg-white text-indigo-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  <Rocket size={28} className="md:h-8 md:w-8" />
                </div>
                <div>
                  <div className="mb-1 whitespace-nowrap text-[18px] font-black uppercase leading-none tracking-widest md:text-[24px]">
                    Competitivo
                  </div>
                  <div
                    className={`text-[12px] font-bold leading-tight md:text-[14px] ${
                      !state.isSmoothMode
                        ? isDarkMode
                          ? 'text-indigo-200'
                          : 'text-sky-900'
                        : isDarkMode
                          ? 'text-slate-400'
                          : 'text-slate-500'
                    }`}
                  >
                    Camera rapida. Alta resposta.
                  </div>
                </div>
              </button>

              <button
                type="button"
                aria-pressed={state.isSmoothMode}
                onClick={() => actions.applySettings(true)}
                className={`group flex items-center gap-4 rounded-[2rem] p-5 text-left transition-all md:gap-6 md:p-6 ${
                  state.isSmoothMode
                    ? isDarkMode
                      ? 'border border-emerald-400 bg-emerald-500/20 text-white neon-glow-emerald'
                      : 'glass-panel-light border border-emerald-400 bg-emerald-100 shadow-md'
                    : isDarkMode
                      ? 'glass-panel hover:border-white/20 hover:bg-white/5'
                      : 'glass-panel-light border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-inner transition-transform group-hover:scale-110 md:h-16 md:w-16 ${
                    state.isSmoothMode
                      ? 'bg-white text-emerald-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  <Film size={28} className="md:h-8 md:w-8" />
                </div>
                <div>
                  <div className="mb-1 whitespace-nowrap text-[18px] font-black uppercase leading-none tracking-widest md:text-[24px]">
                    Cinematografico
                  </div>
                  <div
                    className={`text-[12px] font-bold leading-tight md:text-[14px] ${
                      state.isSmoothMode
                        ? isDarkMode
                          ? 'text-emerald-200'
                          : 'text-emerald-900'
                        : isDarkMode
                          ? 'text-slate-400'
                          : 'text-slate-500'
                    }`}
                  >
                    Deslize suave. Mais foco visual.
                  </div>
                </div>
              </button>

              <div className={`mt-2 border-t-[4px] pt-6 ${isDarkMode ? 'border-slate-700' : 'border-stone-100'}`}>
                <div className="mb-4 flex items-center justify-center gap-3">
                  <Gift className="h-6 w-6 text-amber-500 md:h-8 md:w-8" strokeWidth={2.5} />
                  <h4 className={`text-[20px] font-black uppercase leading-none tracking-tighter md:text-[28px] ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                    Codigo promo
                  </h4>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    aria-label="Digite um codigo promocional"
                    type="text"
                    value={promoInput}
                    onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                    placeholder="COLE O CODIGO"
                    className={`flex-1 rounded-[1.5rem] border-[4px] px-4 py-3 text-center font-black uppercase tracking-widest transition-colors focus:outline-none md:py-4 ${
                      isDarkMode
                        ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-amber-400 focus:bg-slate-900'
                        : 'border-stone-200 bg-stone-100 text-stone-700 placeholder:text-stone-300 focus:border-amber-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleRedeemClick}
                    className="flex items-center justify-center rounded-[1.5rem] bg-amber-400/90 px-6 py-3 font-black uppercase tracking-widest text-amber-950 transition-all hover:bg-amber-300 md:py-4 neon-glow-amber"
                  >
                    Resgatar
                  </button>
                </div>

                {promoFeedback && (
                  <p
                    aria-live="polite"
                    className={`mt-4 text-center text-[14px] font-black uppercase tracking-widest md:text-[16px] ${
                      promoFeedback.success ? 'text-emerald-500' : 'text-rose-500'
                    } animate-fade-in-up`}
                  >
                    {promoFeedback.message}
                  </p>
                )}
              </div>

              <div
                className={`mt-2 grid grid-cols-1 gap-4 border-t-[4px] pt-4 md:pt-6 sm:grid-cols-3 ${
                  isDarkMode ? 'border-slate-700' : 'border-stone-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    actions.toggleVibration();
                    actions.triggerHaptic();
                  }}
                  className={`group flex flex-1 items-center justify-center gap-2 rounded-[1.5rem] p-4 font-bold uppercase tracking-widest transition-all ${
                    isDarkMode ? 'glass-panel hover:bg-slate-800' : 'glass-panel-light hover:bg-slate-50'
                  }`}
                >
                  {isVibrationEnabled ? <Vibrate size={20} className="text-emerald-500" /> : <VibrateOff size={20} className="text-rose-500" />}
                  <span className={isDarkMode ? 'text-slate-300' : 'text-stone-600'}>
                    Vibracao: {isVibrationEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    actions.toggleSound();
                    actions.triggerHaptic();
                  }}
                  className={`group flex flex-1 items-center justify-center gap-2 rounded-[1.5rem] p-4 font-bold uppercase tracking-widest transition-all ${
                    isDarkMode ? 'glass-panel hover:bg-slate-800' : 'glass-panel-light hover:bg-slate-50'
                  }`}
                >
                  {isSoundEnabled ? <Volume2 size={20} className="text-emerald-500" /> : <VolumeX size={20} className="text-rose-500" />}
                  <span className={isDarkMode ? 'text-slate-300' : 'text-stone-600'}>Som: {isSoundEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    actions.triggerHaptic();
                    setShowCredits(true);
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[1.5rem] p-4 font-bold uppercase tracking-widest transition-all ${
                    isDarkMode
                      ? 'glass-panel text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-900/30'
                      : 'glass-panel-light border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <Info size={20} />
                  Creditos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCredits && (
        <CreditsModal
          onClose={() => {
            actions.triggerHaptic();
            setShowCredits(false);
          }}
          isDarkMode={isDarkMode}
        />
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
          dailyCompleted={state.playedDailyDates.includes(state.todayStr)}
          countryCount={state.countryCount}
          activeAvatar={state.activeAvatar}
          setShowShop={actions.setShowShop}
          isBatterySaverMode={state.isBatterySaverMode}
          isDarkMode={isDarkMode}
          toggleDarkMode={actions.toggleDarkMode}
        />
      )}

      {state.gameState === GAME_STATES.RESULT && (
        <Suspense fallback={null}>
          <ResultScreen
            score={state.score}
            reason={state.endReason}
            previousBestScore={state.previousBestScore}
            guessedCount={state.guessedCountries.length}
            coinsEarned={state.lastCoinsEarned}
            gameMode={state.gameMode}
            onRestart={() => actions.startGame(state.gameMode)}
            onHome={() => {
              actions.quitGame();
              actions.resetGlobe();
            }}
            isDarkMode={isDarkMode}
          />
        </Suspense>
      )}

      <GameHUD state={state} actions={actions} isDarkMode={isDarkMode} />

      {state.studyCard && (
        <div
          className={`pointer-events-auto absolute inset-0 z-50 flex items-center justify-center px-6 ${
            isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'
          } ${isClosingStudyCard ? 'animate-fade-out' : 'animate-fade-in'}`}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="study-title"
            className={`relative mt-16 w-full max-w-2xl rounded-[3.5rem] p-8 pt-32 md:rounded-[4rem] md:p-12 ${
              isDarkMode ? 'glass-panel neon-glow-emerald' : 'glass-panel-light shadow-2xl'
            } ${isClosingStudyCard ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}
          >
            <div className="absolute left-1/2 top-[-6rem] -translate-x-1/2">
              <img
                src={`https://flagcdn.com/w320/${state.studyCard.iso.toLowerCase()}.png`}
                alt={`Bandeira de ${state.studyCard.name}`}
                className={`h-[160px] w-[260px] rounded-3xl object-cover shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${
                  isDarkMode ? 'border-[4px] border-white/20' : 'border-[8px] border-white'
                }`}
              />
            </div>

            <div className="mt-4 text-center">
              <h3
                id="study-title"
                className={`mb-2 whitespace-nowrap text-[48px] font-black uppercase tracking-tighter ${
                  isDarkMode ? 'text-white' : 'text-stone-800'
                }`}
              >
                {state.studyCard.name}
              </h3>

              {!state.studyCard.isCorrect && (
                <p
                  className={`mb-8 inline-block whitespace-nowrap rounded-full border-[4px] px-8 py-3 text-[20px] font-black uppercase tracking-widest ${
                    isDarkMode ? 'border-rose-900 bg-rose-950/50 text-rose-400' : 'border-rose-100 bg-rose-50 text-rose-500'
                  }`}
                >
                  Clicou em: {state.studyCard.clickedName}
                </p>
              )}

              {state.studyCard.isCorrect && (
                <p
                  className={`mb-8 inline-block whitespace-nowrap rounded-full border-[4px] px-8 py-3 text-[20px] font-black uppercase tracking-widest ${
                    isDarkMode
                      ? 'border-emerald-900 bg-emerald-950/50 text-emerald-400'
                      : 'border-green-100 bg-green-50 text-green-600'
                  }`}
                >
                  +{state.studyCard.pointsGained} pontos!
                </p>
              )}

              <div
                className={`mb-10 flex flex-col gap-6 rounded-[2.5rem] border-4 p-10 text-left shadow-inner ${
                  isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-stone-100 bg-stone-50'
                }`}
              >
                <div className={`flex items-center justify-between border-b-4 pb-4 ${isDarkMode ? 'border-slate-700' : 'border-stone-200'}`}>
                  <span className={`whitespace-nowrap text-[20px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>
                    Capital
                  </span>
                  <span className={`whitespace-nowrap text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                    {state.studyCard.capital}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`whitespace-nowrap text-[20px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>
                    Continente
                  </span>
                  <span className={`whitespace-nowrap text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                    {state.studyCard.continent}
                  </span>
                </div>
              </div>

              {!state.studyCard.isCorrect &&
              state.studyCard.livesRemaining <= 0 &&
              state.gameMode !== GAME_MODES.DAILY ? (
                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={handleDismissStudyCard}
                    className={`w-1/3 whitespace-nowrap rounded-[2rem] border py-8 text-[24px] font-black uppercase tracking-widest transition-all ${
                      isDarkMode ? 'glass-panel hover:bg-white/10 hover:text-white' : 'glass-panel-light hover:bg-slate-100'
                    }`}
                  >
                    Sair
                  </button>
                  <button
                    type="button"
                    onClick={handleRevive}
                    disabled={state.coins < 100}
                    className="flex w-2/3 items-center justify-center gap-4 whitespace-nowrap rounded-[2rem] bg-amber-500/90 py-8 text-[24px] font-black uppercase tracking-widest text-amber-950 transition-all hover:bg-amber-400 disabled:grayscale disabled:opacity-50 neon-glow-amber"
                  >
                    Reviver (100 <Coins size={32} />)
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDismissStudyCard}
                  className={`mt-6 flex w-full items-center justify-center gap-4 whitespace-nowrap rounded-[2rem] py-8 text-[28px] font-black uppercase tracking-widest text-white transition-all ${
                    state.studyCard.isCorrect
                      ? 'bg-emerald-500/90 hover:bg-emerald-400 neon-glow-emerald'
                      : 'bg-rose-500/90 hover:bg-rose-400 neon-glow-rose'
                  }`}
                >
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
