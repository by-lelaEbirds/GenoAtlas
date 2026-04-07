import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Coins, Flame, Globe, Moon, Sun, TrendingUp } from 'lucide-react';

import { saveNativeData } from '../utils/storage';
import AdBanner from './AdBanner';
import BottomNav from './StartScreenUI/BottomNav';
import ExperienceShowcase from './StartScreenUI/ExperienceShowcase';
import JourneyMap from './StartScreenUI/JourneyMap';
import ModeCarousel from './StartScreenUI/ModeCarousel';
import ParallaxBackground from './StartScreenUI/ParallaxBackground';
import RegionModal from './StartScreenUI/RegionModal';
import WeeklyPulseCard from './StartScreenUI/WeeklyPulseCard';

export default function StartScreen({
  onStart,
  onStudy,
  onFootball,
  onDaily,
  onOpenAchievements,
  onOpenTutorial,
  onOpenSettings,
  coins,
  setCoins,
  currentTheme,
  setTheme,
  themes,
  unlockedThemes,
  setUnlockedThemes,
  dailyCompleted,
  countryCount,
  activeAvatar,
  setShowShop,
  isBatterySaverMode,
  isReducedEffectsMode,
  isDarkMode,
  toggleDarkMode,
  activeEvent,
  weeklyMissions,
  isNativePlatform,
}) {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [isClosingRegion, setIsClosingRegion] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const bgNebulaRef = useRef(null);
  const bgCloudsRef = useRef(null);
  const bgLayer3Ref = useRef(null);
  const bgStarsRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const pendingScrollRef = useRef(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => () => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isMobile && !isBatterySaverMode) {
      return;
    }

    [bgNebulaRef, bgCloudsRef, bgLayer3Ref, bgStarsRef].forEach((layerRef) => {
      if (layerRef.current) {
        layerRef.current.style.transform = '';
      }
    });
  }, [isBatterySaverMode, isMobile]);

  const handleThemeUnlock = useCallback((theme) => {
    if (coins < theme.price) {
      return;
    }

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
  }, [coins, setCoins, setTheme, setUnlockedThemes, unlockedThemes]);

  const handleThemePress = useCallback((theme, isUnlocked) => {
    if (isUnlocked) {
      setTheme(theme);
      setShowRegionModal(true);
      return;
    }

    handleThemeUnlock(theme);
  }, [handleThemeUnlock, setTheme]);

  const handleRegionSelect = useCallback((regionId) => {
    setIsClosingRegion(true);
    window.setTimeout(() => {
      setShowRegionModal(false);
      setIsClosingRegion(false);
      onStart(regionId);
    }, 200);
  }, [onStart]);

  const closeRegionModal = useCallback(() => {
    setIsClosingRegion(true);
    window.setTimeout(() => {
      setShowRegionModal(false);
      setIsClosingRegion(false);
    }, 200);
  }, []);

  const handleScroll = useCallback((event) => {
    if (isBatterySaverMode || isMobile) {
      return;
    }

    pendingScrollRef.current = event.target.scrollTop;
    if (scrollFrameRef.current) {
      return;
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      const scrollY = pendingScrollRef.current;
      const speeds = isMobile
        ? { nebula: 0.025, clouds: 0.045, layer: 0.07, stars: 0.095 }
        : { nebula: 0.06, clouds: 0.11, layer: 0.16, stars: 0.22 };

      if (bgNebulaRef.current) {
        bgNebulaRef.current.style.transform = `translateY(${-scrollY * speeds.nebula}px)`;
      }

      if (bgCloudsRef.current) {
        bgCloudsRef.current.style.transform = `translateY(${-scrollY * speeds.clouds}px)`;
      }

      if (bgLayer3Ref.current) {
        bgLayer3Ref.current.style.transform = `translateY(${-scrollY * speeds.layer}px)`;
      }

      if (bgStarsRef.current) {
        bgStarsRef.current.style.transform = `translateY(${-scrollY * speeds.stars}px)`;
      }

      scrollFrameRef.current = null;
    });
  }, [isBatterySaverMode, isMobile]);

  const isPerformanceMode = isBatterySaverMode || isReducedEffectsMode || isMobile;

  const availableCountries = countryCount > 0 ? countryCount : '--';

  return (
    <div className={`absolute inset-0 z-40 overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <ParallaxBackground
        bgNebulaRef={bgNebulaRef}
        bgCloudsRef={bgCloudsRef}
        bgLayer3Ref={bgLayer3Ref}
        bgStarsRef={bgStarsRef}
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        isBatterySaverMode={isBatterySaverMode}
        isReducedEffectsMode={isReducedEffectsMode}
      />

      <div
        className="scroll-surface custom-scrollbar relative z-10 h-full w-full overflow-y-auto overflow-x-hidden touch-pan-y overscroll-y-none pb-[calc(7.75rem+env(safe-area-inset-bottom))] md:pb-[calc(8.5rem+env(safe-area-inset-bottom))]"
        onScroll={handleScroll}
      >
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pb-3 pt-[calc(0.85rem+env(safe-area-inset-top))] md:px-8">
          <div className="mx-auto flex max-w-6xl justify-end">
            <div className="pointer-events-auto flex items-center gap-2.5 md:gap-4">
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all active:scale-95 md:h-12 md:w-12 ${
                  isDarkMode
                    ? 'border-white/10 bg-slate-950/70 text-amber-300 shadow-[0_12px_30px_rgba(2,6,23,0.45)]'
                    : 'border-sky-100 bg-white/85 text-sky-600 shadow-[0_12px_25px_rgba(14,165,233,0.08)]'
                }`}
              >
                {isDarkMode ? <Moon size={20} fill="currentColor" /> : <Sun size={20} fill="currentColor" />}
              </button>

              <div
                aria-label={`Voce tem ${coins} moedas`}
                className={`relative overflow-hidden rounded-full border px-4 py-2.5 md:px-5 ${
                  isDarkMode
                    ? 'border-amber-400/40 bg-amber-500/18 text-amber-300 shadow-[0_12px_30px_rgba(2,6,23,0.45)]'
                    : 'border-amber-100 bg-white/90 text-amber-700 shadow-[0_12px_25px_rgba(251,191,36,0.12)]'
                }`}
              >
                <div className="absolute inset-0 -translate-x-[150%] skew-x-12 animate-sweep bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap text-[16px] font-black tracking-[0.14em] md:text-[18px]">
                  {coins}
                  <Coins aria-hidden="true" className="h-[18px] w-[18px] text-amber-400 md:h-[20px] md:w-[20px]" />
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pb-10 pt-4 md:px-8">
          <section className="relative z-10 overflow-hidden rounded-[3rem] border border-white/30 bg-white/80 px-5 pb-8 pt-[calc(6.8rem+env(safe-area-inset-top))] shadow-[0_30px_70px_rgba(2,6,23,0.2)] dark:border-slate-800 dark:bg-slate-900/70">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className={`absolute left-1/2 top-0 -translate-x-1/2 h-[320px] w-[320px] rounded-full blur-[120px] ${isDarkMode ? 'bg-cyan-500/20' : 'bg-sky-300/40'}`} />
            </div>

            <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] lg:items-start">
              <div className="space-y-6">
                <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1 flex justify-center">
                    <div className={`h-[290px] w-[290px] rounded-full blur-3xl md:h-[360px] md:w-[360px] ${isDarkMode ? 'bg-fuchsia-500/16' : 'bg-white/70'}`} />
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`relative mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2.25rem] border-[5px] md:h-36 md:w-36 md:rounded-[2.8rem] ${
                        isDarkMode
                          ? 'border-indigo-400/25 bg-slate-900/60 shadow-[0_24px_40px_rgba(15,23,42,0.45)]'
                          : 'border-sky-200 bg-white/95 shadow-[0_22px_34px_rgba(56,189,248,0.15)]'
                      }`}
                    >
                      <div className="absolute inset-0 -translate-x-[150%] skew-x-12 animate-sweep bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                      <img
                        src={`${import.meta.env.BASE_URL}assets/icon.png`}
                        alt="Logo do GenoAtlas"
                        className="relative z-10 h-full w-full object-cover"
                        decoding="async"
                        fetchPriority="high"
                      />
                    </div>

                    <h1 className={`text-[52px] font-black uppercase leading-[0.86] tracking-tight md:text-[78px] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                      Geno<span className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'}>Atlas</span>
                    </h1>
                    <p className={`mt-3 text-[13px] font-black uppercase tracking-[0.34em] md:text-[16px] ${isDarkMode ? 'text-indigo-200/80' : 'text-sky-700/80'}`}>
                      Explore / Aprenda / Domine
                    </p>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-3 md:gap-4">
                  <div className={`rounded-[1.5rem] border px-3 py-4 text-center md:px-4 md:py-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'}`}>
                    <Globe className={`mx-auto mb-2 h-6 w-6 md:h-7 md:w-7 ${isDarkMode ? 'text-cyan-300' : 'text-sky-500'}`} strokeWidth={2.5} />
                    <span className={`block text-[24px] font-black leading-none md:text-[30px] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>{availableCountries}</span>
                    <span className={`mt-1 block text-[10px] font-black uppercase tracking-[0.18em] md:text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Paises</span>
                  </div>
                  <div className={`rounded-[1.5rem] border px-3 py-4 text-center md:px-4 md:py-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'}`}>
                    <Flame className={`mx-auto mb-2 h-6 w-6 md:h-7 md:w-7 ${isDarkMode ? 'text-amber-300' : 'text-amber-500'}`} strokeWidth={2.5} />
                    <span className={`block text-[24px] font-black leading-none md:text-[30px] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>4</span>
                    <span className={`mt-1 block text-[10px] font-black uppercase tracking-[0.18em] md:text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Modos</span>
                  </div>
                  <div className={`rounded-[1.5rem] border px-3 py-4 text-center md:px-4 md:py-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'}`}>
                    <TrendingUp className={`mx-auto mb-2 h-6 w-6 md:h-7 md:w-7 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'}`} strokeWidth={2.5} />
                    <span className={`block text-[24px] font-black leading-none md:text-[30px] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>MAX</span>
                    <span className={`mt-1 block text-[10px] font-black uppercase tracking-[0.18em] md:text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Jornada</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenTutorial}
                    className={`rounded-full border px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition-all active:scale-[0.98] md:text-[12px] ${
                      isDarkMode
                        ? 'glass-panel border-white/10 text-slate-200 hover:border-cyan-300/30 hover:bg-white/10'
                        : 'glass-panel-light border-white text-sky-700 hover:bg-white'
                    }`}
                  >
                    Como jogar
                  </button>
                </div>
              </div>

              <div className={`relative rounded-[2.4rem] border p-6 shadow-[0_30px_60px_rgba(2,6,23,0.25)] ${isDarkMode ? 'glass-panel border-white/15' : 'glass-panel-light border-white/70'}`}>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500">Ciclo ativo</p>
                <h3 className={`mt-2 text-[30px] font-black uppercase tracking-[0.08em] ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
                  {activeEvent?.title ?? 'Rotação semanal'}
                </h3>
                <p className={`mt-2 text-[13px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
                  {activeEvent?.description ?? 'Complete rotas e empilhe recompensas antes do fim do ciclo.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(activeEvent?.bestModes || ['Normal']).map((mode) => (
                    <span key={mode} className="rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-sky-600 border-sky-300 bg-sky-50">
                      {mode}
                    </span>
                  ))}
                </div>
                {activeEvent?.guide?.length ? (
                  <div className="mt-4 space-y-2 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {activeEvent.guide.slice(0, 2).map((tip, index) => (
                      <div key={`${tip}-${index}`} className="flex items-start gap-2">
                        <span className={`mt-1 inline-flex h-2 w-2 rounded-full ${isDarkMode ? 'bg-cyan-300' : 'bg-sky-500'}`} />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-stone-500'}>{tip}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {activeEvent?.rewardLabel && (
                  <p className="mt-5 text-[12px] font-black uppercase tracking-[0.32em] text-amber-400">
                    {activeEvent.rewardLabel}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
            <div className="space-y-6 order-2 lg:order-1">
              <WeeklyPulseCard activeEvent={activeEvent} missions={weeklyMissions} isDarkMode={isDarkMode} />
              <ExperienceShowcase coins={coins} countryCount={availableCountries} isDarkMode={isDarkMode} />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <ModeCarousel
                onDaily={onDaily}
                onFootball={onFootball}
                onStudy={onStudy}
                dailyCompleted={dailyCompleted}
                isDarkMode={isDarkMode}
                isPerformanceMode={isPerformanceMode}
              />
              <AdBanner
                dataAdSlot="5555555555"
                isNativePlatform={isNativePlatform}
                isBatterySaverMode={isBatterySaverMode}
              />
            </div>
          </div>

          <section className="relative z-10 px-5 pb-10 pt-6 md:px-8 md:pb-14 md:pt-10">
            <div className="mb-8 text-center md:mb-10">
              <div className={`inline-flex items-center gap-3 rounded-full border px-7 py-3 md:px-10 md:py-4 ${isDarkMode ? 'glass-panel border-fuchsia-500/25' : 'glass-panel-light border-white text-sky-800'}`}>
                <span className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.75)]' : 'bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.35)]'}`} />
                <span className={`text-[20px] font-black uppercase tracking-[0.18em] md:text-[28px] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>Sua jornada</span>
              </div>
            </div>

            <JourneyMap
              themes={themes}
              currentTheme={currentTheme}
              unlockedThemes={unlockedThemes}
              activeAvatar={activeAvatar}
              onThemePress={handleThemePress}
              isDarkMode={isDarkMode}
              isMobile={isMobile}
              isPerformanceMode={isPerformanceMode}
            />
          </section>
        </div>
      </div>

      <BottomNav
        onOpenAchievements={onOpenAchievements}
        onOpenSettings={onOpenSettings}
        setShowShop={setShowShop}
        isDarkMode={isDarkMode}
      />

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
