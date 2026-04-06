import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App as CapApp } from '@capacitor/app';

import { playTone, playSound, setAudioEnabled, warmupAudio, playThemeCue, playModeCue, playComboStinger, playMissionCompleteCue } from '../utils/audio';
import { saveNativeData, getNativeData } from '../utils/storage';
import { GAME_STATES, GAME_MODES, MAP_THEMES } from '../constants';
import { FOOTBALL_CLUBS } from '../constants/football';
import { CAPITALS_MAP } from '../constants/capitals';
import { AVATARS } from '../constants/shop';
import { PROMO_CODES } from '../constants/promoCodes';
import { ACHIEVEMENTS_LIST } from '../constants/achievements';
import { MAX_IMPACT_RINGS, MAX_TRAVEL_ARCS, appendWithLimit, getDailyCountries, getLocalDateKey } from '../utils/gameplay';
import { isAndroidRuntime, isNativeRuntime } from '../utils/platform';
import { AD_PLACEMENTS, showInterstitialAd, showRewardedAd } from '../utils/ads';
import {
  applyRunToMetaProgress,
  applyEventBonuses,
  buildRunSummary,
  createDefaultMetaProgress,
  createDefaultRouteUpgrades,
  createDefaultSessionStats,
  ensureMetaProgress,
  getActiveEvent,
  getCoachTip,
  getStartTimeBonus,
  getWeeklyRotationPreview,
  getUpgradeAdjustedCoins,
  normalizeContinent,
} from '../utils/metaProgression';
import { createDefaultTelemetry, ensureTelemetry, getTelemetryInsight, recordRunTelemetry, recordTelemetryCounter } from '../utils/telemetry';

function resolveAvatarById(savedAvatarId) {
  return AVATARS.find((avatar) => avatar.id === savedAvatarId) || AVATARS[0];
}

function safeParseJson(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function useGeoGame(globeRef) {
  const nativePlatform = isNativeRuntime();
  const androidPlatform = isAndroidRuntime();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [geoData, setGeoData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [travelArcs, setTravelArcs] = useState([]);
  const [impactRings, setImpactRings] = useState([]);

  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [gameMode, setGameMode] = useState(GAME_MODES.NORMAL);
  const [endReason, setEndReason] = useState('');

  const [coins, setCoins] = useState(0);
  const [lastCoinsEarned, setLastCoinsEarned] = useState(0);
  const [unlockedThemes, setUnlockedThemes] = useState(['explorador']);
  const [activeTheme, setActiveTheme] = useState(MAP_THEMES.explorador);
  const [unlockedAvatars, setUnlockedAvatars] = useState(['pin']);
  const [activeAvatar, setActiveAvatar] = useState(AVATARS[0]);
  const [powerUps, setPowerUps] = useState({ extraLife: 0, freezeTime: 0, discount: 0 });
  const [routeUpgrades, setRouteUpgradesState] = useState(createDefaultRouteUpgrades);
  const [showShop, setShowShop] = useState(false);

  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [activeRegion, setActiveRegion] = useState('all');
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementToast, setAchievementToast] = useState(null);

  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerFrozen, setIsTimerFrozen] = useState(false);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(0);

  const [isSmoothMode, setIsSmoothMode] = useState(true);
  const [showSettingsPrompt, setShowSettingsPrompt] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isBatterySaverMode, setIsBatterySaverMode] = useState(prefersReducedMotion);
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  const [isLargeTextMode, setIsLargeTextMode] = useState(false);
  const [isColorAssistMode, setIsColorAssistMode] = useState(false);
  const [isReducedEffectsMode, setIsReducedEffectsMode] = useState(prefersReducedMotion);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [previousBestScore, setPreviousBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [dailyWinsCount, setDailyWinsCount] = useState(0);

  const [targetCountry, setTargetCountry] = useState(null);
  const [targetClub, setTargetClub] = useState(null);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [remainingClubs, setRemainingClubs] = useState([]);
  const [targetStartTime, setTargetStartTime] = useState(0);

  const [screenFlash, setScreenFlash] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const [studyCard, setStudyCard] = useState(null);
  const [sessionTargetCount, setSessionTargetCount] = useState(0);
  const [sessionRewardSummary, setSessionRewardSummary] = useState(null);

  const [adPrompt, setAdPrompt] = useState(null);
  const [isAdFlowActive, setIsAdFlowActive] = useState(false);
  const [rewardedReviveUsed, setRewardedReviveUsed] = useState(false);
  const [rewardedCoinsClaimed, setRewardedCoinsClaimed] = useState(false);

  const todayStr = getLocalDateKey();
  const [playedDailyDates, setPlayedDailyDates] = useState([]);
  const [metaProgress, setMetaProgress] = useState(() => ensureMetaProgress(createDefaultMetaProgress(), todayStr));
  const [telemetry, setTelemetry] = useState(() => ensureTelemetry(createDefaultTelemetry()));

  const capitals = CAPITALS_MAP;
  const floatingPointIdRef = useRef(0);
  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const guessedRef = useRef([]);
  const remainingCountriesRef = useRef([]);
  const remainingClubsRef = useRef([]);
  const timeLeftRef = useRef(timeLeft);
  const freezeTimeLeftRef = useRef(freezeTimeLeft);
  const isProcessingRef = useRef(false);
  const sessionStatsRef = useRef(createDefaultSessionStats(GAME_MODES.NORMAL));
  const completedRunsSinceInterstitialRef = useRef(0);
  const metaProgressRef = useRef(metaProgress);
  const telemetryRef = useRef(telemetry);
  const routeUpgradesRef = useRef(routeUpgrades);
  const endGameRef = useRef(null);

  const activeEvent = useMemo(() => metaProgress.weeklyRotation || getActiveEvent(todayStr), [metaProgress.weeklyRotation, todayStr]);
  const weeklyRotationPreview = useMemo(() => getWeeklyRotationPreview(todayStr, 8), [todayStr]);
  const telemetryInsight = useMemo(() => getTelemetryInsight(telemetry), [telemetry]);
  const coachTip = useMemo(
    () => getCoachTip({ telemetryInsight, metaProgress, activeEvent }),
    [activeEvent, metaProgress, telemetryInsight],
  );

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    guessedRef.current = guessedCountries;
  }, [guessedCountries]);

  useEffect(() => {
    remainingCountriesRef.current = remainingCountries;
  }, [remainingCountries]);

  useEffect(() => {
    remainingClubsRef.current = remainingClubs;
  }, [remainingClubs]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    freezeTimeLeftRef.current = freezeTimeLeft;
  }, [freezeTimeLeft]);

  useEffect(() => {
    metaProgressRef.current = metaProgress;
  }, [metaProgress]);

  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  useEffect(() => {
    routeUpgradesRef.current = routeUpgrades;
  }, [routeUpgrades]);

  const saveMetaProgress = useCallback((nextProgress) => {
    metaProgressRef.current = nextProgress;
    setMetaProgress(nextProgress);
    saveNativeData('geoGuessMetaProgress', JSON.stringify(nextProgress));
  }, []);

  const saveTelemetry = useCallback((nextTelemetry) => {
    telemetryRef.current = nextTelemetry;
    setTelemetry(nextTelemetry);
    saveNativeData('geoGuessTelemetry', JSON.stringify(nextTelemetry));
  }, []);

  const setRouteUpgrades = useCallback((nextValue) => {
    const nextRouteUpgrades =
      typeof nextValue === 'function' ? nextValue(routeUpgradesRef.current) : nextValue;
    routeUpgradesRef.current = nextRouteUpgrades;
    setRouteUpgradesState(nextRouteUpgrades);
    saveNativeData('geoGuessRouteUpgrades', JSON.stringify(nextRouteUpgrades));
  }, []);

  const recordTelemetry = useCallback((counterName, increment = 1) => {
    const nextTelemetry = recordTelemetryCounter(telemetryRef.current, counterName, increment);
    saveTelemetry(nextTelemetry);
  }, [saveTelemetry]);

  useEffect(() => {
    const syncedProgress = ensureMetaProgress(metaProgressRef.current, todayStr);
    if (
      syncedProgress.weekKey !== metaProgressRef.current.weekKey ||
      JSON.stringify(syncedProgress.weeklyMissions) !== JSON.stringify(metaProgressRef.current.weeklyMissions)
    ) {
      saveMetaProgress(syncedProgress);
    }
  }, [saveMetaProgress, todayStr]);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [
          savedScore,
          savedCoins,
          savedThemes,
          savedAchievements,
          hasSeenTuto,
          savedSmooth,
          savedDaily,
          savedDailyWins,
          savedAvatars,
          savedActiveAvatar,
          savedPowerUps,
          savedRedeemedCodes,
          savedActiveTheme,
          savedDarkMode,
          savedVibration,
          savedSound,
          savedRouteUpgrades,
          savedMetaProgress,
          savedTelemetry,
          savedHighContrast,
          savedLargeText,
          savedColorAssist,
          savedReducedEffects,
          savedBatterySaver,
        ] = await Promise.all([
          getNativeData('geoGuessBestScore'),
          getNativeData('geoGuessCoins'),
          getNativeData('geoGuessThemes'),
          getNativeData('geoGuessAchievements'),
          getNativeData('geoGuessTutorial'),
          getNativeData('geoGuessSmoothMode'),
          getNativeData('geoGuessDaily'),
          getNativeData('geoGuessDailyWinsCount'),
          getNativeData('geoGuessAvatars'),
          getNativeData('geoGuessActiveAvatar'),
          getNativeData('geoGuessPowerUps'),
          getNativeData('geoGuessRedeemedCodes'),
          getNativeData('geoGuessActiveTheme'),
          getNativeData('geoGuessDarkMode'),
          getNativeData('geoGuessVibration'),
          getNativeData('geoGuessSound'),
          getNativeData('geoGuessRouteUpgrades'),
          getNativeData('geoGuessMetaProgress'),
          getNativeData('geoGuessTelemetry'),
          getNativeData('geoGuessHighContrast'),
          getNativeData('geoGuessLargeText'),
          getNativeData('geoGuessColorAssist'),
          getNativeData('geoGuessReducedEffects'),
          getNativeData('geoGuessBatterySaver'),
        ]);

        if (savedScore !== null) setBestScore(parseInt(savedScore, 10) || 0);
        if (savedCoins !== null) setCoins(parseInt(savedCoins, 10) || 0);
        if (savedDailyWins !== null) setDailyWinsCount(parseInt(savedDailyWins, 10) || 0);

        if (savedThemes) {
          const savedIds = safeParseJson(savedThemes, []);
          const validIds = [...new Set(['explorador', ...savedIds])].filter((id) => id in MAP_THEMES);
          setUnlockedThemes(validIds);
        }

        if (savedAvatars) setUnlockedAvatars(safeParseJson(savedAvatars, ['pin']));
        if (savedActiveAvatar) setActiveAvatar(resolveAvatarById(savedActiveAvatar));
        if (savedActiveTheme && MAP_THEMES[savedActiveTheme]) setActiveTheme(MAP_THEMES[savedActiveTheme]);
        if (savedPowerUps) setPowerUps(safeParseJson(savedPowerUps, { extraLife: 0, freezeTime: 0, discount: 0 }));
        if (savedRedeemedCodes) setRedeemedCodes(safeParseJson(savedRedeemedCodes, []));
        if (savedAchievements) setUnlockedAchievements(safeParseJson(savedAchievements, []));
        if (!hasSeenTuto) setShowTutorial(true);
        if (savedDaily) setPlayedDailyDates(safeParseJson(savedDaily, []));

        if (savedSmooth === null) setShowSettingsPrompt(true);
        else setIsSmoothMode(savedSmooth === 'true');

        if (savedRouteUpgrades) {
          const nextRouteUpgrades = {
            ...createDefaultRouteUpgrades(),
            ...safeParseJson(savedRouteUpgrades, createDefaultRouteUpgrades()),
          };
          routeUpgradesRef.current = nextRouteUpgrades;
          setRouteUpgradesState(nextRouteUpgrades);
        }

        if (savedMetaProgress) {
          const nextProgress = ensureMetaProgress(safeParseJson(savedMetaProgress, createDefaultMetaProgress()), todayStr);
          metaProgressRef.current = nextProgress;
          setMetaProgress(nextProgress);
        }

        if (savedTelemetry) {
          const nextTelemetry = ensureTelemetry(safeParseJson(savedTelemetry, createDefaultTelemetry()));
          telemetryRef.current = nextTelemetry;
          setTelemetry(nextTelemetry);
        }

        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
        if (savedVibration !== null) setIsVibrationEnabled(savedVibration === 'true');
        if (savedSound !== null) setIsSoundEnabled(savedSound === 'true');
        if (savedHighContrast !== null) setIsHighContrastMode(savedHighContrast === 'true');
        if (savedLargeText !== null) setIsLargeTextMode(savedLargeText === 'true');
        if (savedColorAssist !== null) setIsColorAssistMode(savedColorAssist === 'true');
        if (savedReducedEffects !== null) setIsReducedEffectsMode(savedReducedEffects === 'true');
        if (savedBatterySaver !== null) setIsBatterySaverMode(savedBatterySaver === 'true');
      } catch (error) {
        console.warn('GenoAtlas - Erro recuperando salvamento:', error);
      }
    };

    const fetchGeoData = async () => {
      try {
        const module = await import('../constants/countries.json');
        const countriesData = module.default || module;
        const translator = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
        const validCountries = [];
        const translatedFeatures = countriesData.features.map((feature) => {
          let localName = feature.properties.ADMIN;
          let isoCode = feature.properties.ISO_A2;

          if (isoCode === '-99') {
            if (feature.properties.ADMIN === 'France') isoCode = 'FR';
            else if (feature.properties.ADMIN === 'Norway') isoCode = 'NO';
          }

          if (isoCode && isoCode !== '-99') {
            try {
              localName = translator.of(isoCode);
            } catch {}

            const countryObject = {
              name: localName,
              iso: isoCode,
              continent: normalizeContinent(feature.properties.CONTINENT),
              pop: feature.properties.POP_EST,
            };
            feature.properties.COUNTRY_OBJ = countryObject;
            validCountries.push(countryObject);
          }

          return feature;
        });

        setGeoData(translatedFeatures);
        setAllCountries(validCountries);
      } catch (error) {
        console.warn('GenoAtlas - Erro carregando mapa:', error);
      }
    };

    loadSavedData();
    fetchGeoData();
  }, [todayStr]);

  useEffect(() => {
    const handleAppState = ({ isActive }) => {
      if (!isActive && gameState === GAME_STATES.PLAYING && !studyCard) {
        setIsTimerFrozen(true);
      } else if (isActive && gameState === GAME_STATES.PLAYING && !studyCard) {
        setIsTimerFrozen(false);
      }
    };

    let listener;
    const bindListener = async () => {
      try {
        listener = await CapApp.addListener('appStateChange', handleAppState);
      } catch {}
    };

    bindListener();

    return () => {
      listener?.remove?.();
    };
  }, [gameState, studyCard]);

  useEffect(() => {
    let rafId;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsMobile(window.innerWidth < 768));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    setAudioEnabled(isSoundEnabled);
    if (isSoundEnabled) {
      warmupAudio();
    }
  }, [isSoundEnabled]);

  useEffect(() => {
    let timer;
    if (gameState === GAME_STATES.PLAYING && isGameActive && !isTimerFrozen) {
      timer = window.setInterval(() => {
        if (freezeTimeLeftRef.current > 0) {
          setFreezeTimeLeft((previous) => Math.max(previous - 1, 0));
          return;
        }

        if (gameMode === GAME_MODES.STUDY) {
          return;
        }

        if (timeLeftRef.current <= 0) {
          endGameRef.current?.('time');
          return;
        }

        setTimeLeft((previous) => {
          const nextTime = Math.max(previous - 1, 0);
          if (nextTime <= 6 && nextTime > 0) {
            playTone(800, 'sine', 0.1, 0.05);
          }

          if (nextTime === 0) {
            window.setTimeout(() => endGameRef.current?.('time'), 0);
          }

          return nextTime;
        });
      }, 1000);
    }

    return () => window.clearInterval(timer);
  }, [gameMode, gameState, isGameActive, isTimerFrozen]);

  const applySettings = useCallback((isSmooth) => {
    setIsSmoothMode(isSmooth);
    saveNativeData('geoGuessSmoothMode', isSmooth);
    setShowSettingsPrompt(false);
  }, []);

  const triggerHaptic = useCallback((style = ImpactStyle.Light) => {
    if (!isVibrationEnabled) {
      return;
    }

    try {
      Haptics.impact({ style });
    } catch {}
  }, [isVibrationEnabled]);

  const unlockAchievement = useCallback((achievementId) => {
    setUnlockedAchievements((previous) => {
      if (previous.includes(achievementId)) return previous;

      const achievement = ACHIEVEMENTS_LIST.find((item) => item.id === achievementId);
      if (!achievement) return previous;

      const nextAchievements = [...previous, achievementId];
      saveNativeData('geoGuessAchievements', JSON.stringify(nextAchievements));

      if (achievement.reward > 0) {
        setCoins((currentCoins) => {
          const nextCoins = currentCoins + achievement.reward;
          saveNativeData('geoGuessCoins', nextCoins);
          return nextCoins;
        });
      }

      setAchievementToast(achievement);
      triggerHaptic(ImpactStyle.Heavy);
      playSound('coin', 0.7);
      window.setTimeout(() => setAchievementToast(null), 4000);
      return nextAchievements;
    });
  }, [triggerHaptic]);

  useEffect(() => {
    if (coins >= 1000) unlockAchievement('wealthy_1');
    if (coins >= 5000) unlockAchievement('wealthy_2');
    if (coins >= 10000) unlockAchievement('wealthy_3');
  }, [coins, unlockAchievement]);

  const resetSessionStats = useCallback((mode) => {
    sessionStatsRef.current = createDefaultSessionStats(mode);
  }, []);

  const selectTheme = useCallback((theme) => {
    setActiveTheme(theme);
    saveNativeData('geoGuessActiveTheme', theme.id);
    playThemeCue(theme.id);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const nextValue = !isDarkMode;
    setIsDarkMode(nextValue);
    saveNativeData('geoGuessDarkMode', nextValue);
    triggerHaptic(ImpactStyle.Light);
  }, [isDarkMode, triggerHaptic]);

  const toggleVibration = useCallback(() => {
    const nextValue = !isVibrationEnabled;
    setIsVibrationEnabled(nextValue);
    saveNativeData('geoGuessVibration', nextValue);
    if (nextValue) {
      try {
        Haptics.impact({ style: ImpactStyle.Medium });
      } catch {}
    }
  }, [isVibrationEnabled]);

  const toggleSound = useCallback(() => {
    const nextValue = !isSoundEnabled;
    setIsSoundEnabled(nextValue);
    setAudioEnabled(nextValue);
    saveNativeData('geoGuessSound', nextValue);
    if (nextValue) {
      warmupAudio();
      playTone(660, 'sine', 0.08, 0.04);
    }
  }, [isSoundEnabled]);

  const toggleHighContrast = useCallback(() => {
    const nextValue = !isHighContrastMode;
    setIsHighContrastMode(nextValue);
    saveNativeData('geoGuessHighContrast', nextValue);
    triggerHaptic(ImpactStyle.Light);
  }, [isHighContrastMode, triggerHaptic]);

  const toggleLargeText = useCallback(() => {
    const nextValue = !isLargeTextMode;
    setIsLargeTextMode(nextValue);
    saveNativeData('geoGuessLargeText', nextValue);
    triggerHaptic(ImpactStyle.Light);
  }, [isLargeTextMode, triggerHaptic]);

  const toggleColorAssist = useCallback(() => {
    const nextValue = !isColorAssistMode;
    setIsColorAssistMode(nextValue);
    saveNativeData('geoGuessColorAssist', nextValue);
    triggerHaptic(ImpactStyle.Light);
  }, [isColorAssistMode, triggerHaptic]);

  const toggleReducedEffects = useCallback(() => {
    const nextValue = !isReducedEffectsMode;
    setIsReducedEffectsMode(nextValue);
    saveNativeData('geoGuessReducedEffects', nextValue);
    setIsBatterySaverMode(nextValue);
    saveNativeData('geoGuessBatterySaver', nextValue);
    triggerHaptic(ImpactStyle.Light);
  }, [isReducedEffectsMode, triggerHaptic]);

  const resetGlobe = useCallback(() => {
    globeRef.current?.resetPosition?.();
  }, [globeRef]);

  const pickNextCountry = useCallback((pool, currentMode = gameMode, currentStreak = streak, isFirst = false, clubPool = remainingClubsRef.current) => {
    let selectedCountry;

    if (currentMode === GAME_MODES.FOOTBALL) {
      if (clubPool.length === 0) {
        endGameRef.current?.('win');
        return;
      }

      const club = clubPool[0];
      setTargetClub(club);
      setRemainingClubs(clubPool.slice(1));
      selectedCountry = allCountries.find((country) => country.iso === club.iso) || allCountries[0];
    } else if (currentMode === GAME_MODES.DAILY) {
      setTargetClub(null);
      if (pool.length === 0) {
        endGameRef.current?.('daily_win');
        return;
      }

      selectedCountry = pool[0];
      setRemainingCountries(pool.slice(1));
    } else {
      setTargetClub(null);
      if (pool.length === 0) {
        endGameRef.current?.('win');
        return;
      }

      let availablePool = pool;
      if (currentStreak < 2) {
        const easyPool = pool.filter((country) => country.pop > 30000000);
        if (easyPool.length > 0) {
          availablePool = easyPool;
        }
      }

      selectedCountry = availablePool[Math.floor(Math.random() * availablePool.length)];
      setRemainingCountries(pool.filter((country) => country.iso !== selectedCountry.iso));
    }

    setTargetCountry(selectedCountry);
    if (!isFirst) {
      setTargetStartTime(Date.now());
    }
  }, [allCountries, gameMode, streak]);

  const closeAdPrompt = useCallback(() => {
    if (!isAdFlowActive) {
      setAdPrompt(null);
    }
  }, [isAdFlowActive]);

  const openRewardedRevivePrompt = useCallback(() => {
    if (
      rewardedReviveUsed ||
      !studyCard ||
      studyCard.isCorrect ||
      studyCard.livesRemaining > 0 ||
      gameMode === GAME_MODES.DAILY
    ) {
      return;
    }

    setAdPrompt({
      type: 'rewarded_revive',
      placement: AD_PLACEMENTS.REWARDED_REVIVE,
      title: 'Voltar ao mapa',
      description: 'Assista a um patrocinio curto para recuperar 1 vida e seguir para o proximo alvo sem perder a sessao.',
      rewardLabel: '1 vida extra',
    });
  }, [gameMode, rewardedReviveUsed, studyCard]);

  const openRewardedCoinsPrompt = useCallback(() => {
    if (gameState !== GAME_STATES.RESULT || rewardedCoinsClaimed || lastCoinsEarned <= 0) {
      return;
    }

    setAdPrompt({
      type: 'rewarded_double_coins',
      placement: AD_PLACEMENTS.REWARDED_DOUBLE_COINS,
      title: 'Dobrar recompensa',
      description: 'Veja um patrocinio curto para dobrar as moedas desta partida sem sair da tela de resultado.',
      rewardLabel: `+${lastCoinsEarned} moedas bonus`,
    });
  }, [gameState, lastCoinsEarned, rewardedCoinsClaimed]);

  const confirmAdPrompt = useCallback(async () => {
    if (!adPrompt || isAdFlowActive) {
      return false;
    }

    setIsAdFlowActive(true);
    const result = await showRewardedAd({ placement: adPrompt.placement });
    if (!result.rewardGranted) {
      setIsAdFlowActive(false);
      setAdPrompt(null);
      return false;
    }

    recordTelemetry('totalRewardedAds');

    if (adPrompt.type === 'rewarded_revive') {
      setRewardedReviveUsed(true);
      setLives(1);
      setStudyCard(null);
      setIsTimerFrozen(false);
      sessionStatsRef.current.reviveUses += 1;
      triggerHaptic(ImpactStyle.Heavy);
      playSound('success', 0.8);
      pickNextCountry(remainingCountriesRef.current, gameMode, streak, false, remainingClubsRef.current);
      recordTelemetry('totalRewardedRevives');
    }

    if (adPrompt.type === 'rewarded_double_coins') {
      const bonusCoins = Math.max(lastCoinsEarned, 0);
      if (bonusCoins > 0) {
        const nextCoins = coinsRef.current + bonusCoins;
        setCoins(nextCoins);
        setLastCoinsEarned((previous) => previous + bonusCoins);
        setRewardedCoinsClaimed(true);
        saveNativeData('geoGuessCoins', nextCoins);
        triggerHaptic(ImpactStyle.Medium);
        playSound('coin', 0.85);
        recordTelemetry('totalDoubleCoinClaims');
      }
    }

    setIsAdFlowActive(false);
    setAdPrompt(null);
    return true;
  }, [adPrompt, gameMode, isAdFlowActive, lastCoinsEarned, pickNextCountry, recordTelemetry, streak, triggerHaptic]);

  const maybeShowSessionInterstitial = useCallback(async () => {
    if (completedRunsSinceInterstitialRef.current < 3) {
      return false;
    }

    completedRunsSinceInterstitialRef.current = 0;
    const result = await showInterstitialAd({ placement: AD_PLACEMENTS.INTERSTITIAL_SESSION_BREAK });
    if (result.shown) {
      recordTelemetry('totalInterstitials');
    }
    return result.shown;
  }, [recordTelemetry]);

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);
    saveNativeData('geoGuessTutorial', 'done');
  }, []);

  const quitGame = useCallback(() => {
    setGameState(GAME_STATES.START);
    setIsGameActive(false);
    setStudyCard(null);
    setFreezeTimeLeft(0);
    setTargetCountry(null);
    setTargetClub(null);
    setSessionTargetCount(0);
    setAdPrompt(null);
    setIsAdFlowActive(false);
    setSessionRewardSummary(null);
    setScreenFlash('');
    setIsShaking(false);
  }, []);

  const endGame = useCallback((reason) => {
    setGameState(GAME_STATES.RESULT);
    setIsGameActive(false);
    setEndReason(reason);
    setStudyCard(null);
    setFreezeTimeLeft(0);
    setPreviousBestScore(bestScore);
    setAdPrompt(null);
    setIsAdFlowActive(false);
    setRewardedCoinsClaimed(false);
    setScreenFlash('');
    setIsShaking(false);

    let earnedCoins = Math.floor(scoreRef.current / 10);

    if (gameMode === GAME_MODES.DAILY) {
      setPlayedDailyDates((previous) => {
        const nextPlayedDates = [...new Set([...previous, todayStr])];
        saveNativeData('geoGuessDaily', JSON.stringify(nextPlayedDates));
        return nextPlayedDates;
      });

      if (reason === 'daily_win') {
        earnedCoins += 500;
        setDailyWinsCount((previous) => {
          const nextTotal = previous + 1;
          saveNativeData('geoGuessDailyWinsCount', nextTotal);
          if (nextTotal === 1) unlockAchievement('daily_win_1');
          if (nextTotal === 5) unlockAchievement('daily_win_5');
          if (nextTotal === 10) unlockAchievement('daily_win_10');
          return nextTotal;
        });
      }
    }

    earnedCoins = getUpgradeAdjustedCoins(earnedCoins, routeUpgradesRef.current);

    const summary = buildRunSummary({
      mode: gameMode,
      reason,
      score: scoreRef.current,
      lastCoinsEarned: earnedCoins,
      stats: sessionStatsRef.current,
    });

    const eventCoinResult = applyEventBonuses(earnedCoins, 0, summary, activeEvent);
    earnedCoins = eventCoinResult.finalCoins;

    const metaResult = applyRunToMetaProgress(
      metaProgressRef.current,
      summary,
      todayStr,
      routeUpgradesRef.current,
      activeEvent,
    );

    earnedCoins += metaResult.rewardSummary.missionCoinsBonus + metaResult.rewardSummary.milestoneCoinsBonus;
    setLastCoinsEarned(earnedCoins);

    if (gameMode !== GAME_MODES.DAILY) {
      completedRunsSinceInterstitialRef.current += 1;
    }

    const nextCoinsTotal = coinsRef.current + earnedCoins;
    setCoins(nextCoinsTotal);
    saveNativeData('geoGuessCoins', nextCoinsTotal);
    saveMetaProgress(metaResult.nextProgress);

    const nextTelemetry = recordRunTelemetry(telemetryRef.current, summary);
    saveTelemetry(nextTelemetry);

    setSessionRewardSummary({
      ...metaResult.rewardSummary,
      activeEvent,
      coachTip,
      eventCoinBonus: eventCoinResult.bonusCoins,
      accuracy:
        summary.correctAnswers + summary.wrongAnswers > 0
          ? Math.round((summary.correctAnswers / (summary.correctAnswers + summary.wrongAnswers)) * 100)
          : 0,
    });

    if (metaResult.rewardSummary.completedMissions.length > 0) playMissionCompleteCue();

    if (scoreRef.current > bestScore && (gameMode === GAME_MODES.NORMAL || gameMode === GAME_MODES.FOOTBALL)) {
      setBestScore(scoreRef.current);
      saveNativeData('geoGuessBestScore', scoreRef.current);
    }

    if (scoreRef.current >= 1000) unlockAchievement('score_1000');
    if (scoreRef.current >= 5000) unlockAchievement('score_5000');
    if (scoreRef.current >= 10000) unlockAchievement('score_10000');

    if (reason === 'daily_loss' || reason === 'time' || reason === 'lives') playSound('error', 0.6);
    else if (reason === 'daily_win' || reason === 'win') playSound('success', 0.8);

    if (earnedCoins > 0) window.setTimeout(() => playSound('coin', 0.8), 800);
  }, [activeEvent, bestScore, coachTip, gameMode, saveMetaProgress, saveTelemetry, todayStr, unlockAchievement]);

  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);

  const redeemCode = useCallback((rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return { success: false, message: 'Digite um código válido!' };

    if (redeemedCodes.includes(code)) {
      playSound('error', 0.6);
      return { success: false, message: 'Código já foi utilizado!' };
    }

    const promo = PROMO_CODES[code];
    if (!promo) {
      playSound('error', 0.6);
      return { success: false, message: 'Código inválido ou expirado.' };
    }

    const nextCodesList = [...redeemedCodes, code];
    setRedeemedCodes(nextCodesList);
    saveNativeData('geoGuessRedeemedCodes', JSON.stringify(nextCodesList));

    if (promo.type === 'coins') {
      const nextCoins = coinsRef.current + promo.reward;
      setCoins(nextCoins);
      saveNativeData('geoGuessCoins', nextCoins);
    }

    unlockAchievement('promo_code');
    triggerHaptic(ImpactStyle.Heavy);
    playSound('success', 0.8);
    window.setTimeout(() => playSound('coin', 0.9), 500);
    return { success: true, message: promo.message };
  }, [redeemedCodes, triggerHaptic, unlockAchievement]);

  const startGame = useCallback((mode = GAME_MODES.NORMAL, forcedRegion = null) => {
    if (allCountries.length === 0) return;

    const finalRegion = forcedRegion || activeRegion;
    if (forcedRegion) setActiveRegion(forcedRegion);

    playTone(600, 'square', 0.1);
    playModeCue(mode);
    resetSessionStats(mode);
    setScore(0);
    setStreak(0);
    setTimeLeft(60 + getStartTimeBonus(routeUpgradesRef.current));

    const baseLives = mode === GAME_MODES.DAILY ? 1 : 3;
    setLives(baseLives + powerUps.extraLife);

    setGuessedCountries([]);
    setTravelArcs([]);
    setImpactRings([]);
    setFloatingPoints([]);
    setIsTimerFrozen(false);
    setFreezeTimeLeft(0);
    setStudyCard(null);
    setTargetCountry(null);
    setTargetClub(null);
    setEndReason('');
    setLastCoinsEarned(0);
    setAdPrompt(null);
    setIsAdFlowActive(false);
    setRewardedReviveUsed(false);
    setRewardedCoinsClaimed(false);
    setSessionRewardSummary(null);
    setScreenFlash('');
    setIsShaking(false);
    setGameMode(mode);

    globeRef.current?.resetPosition?.();

    let pool = [];
    let initialClubPool = [];

    if (mode === GAME_MODES.DAILY) {
      pool = getDailyCountries(allCountries);
    } else if (mode === GAME_MODES.FOOTBALL) {
      initialClubPool = [...FOOTBALL_CLUBS].sort(() => Math.random() - 0.5);
      setRemainingClubs(initialClubPool);
      pool = allCountries;
    } else {
      pool =
        finalRegion === 'all'
          ? allCountries
          : allCountries.filter((country) => country.continent === finalRegion);
    }

    setRemainingCountries([...pool]);
    setSessionTargetCount(mode === GAME_MODES.FOOTBALL ? initialClubPool.length : pool.length);
    if (mode !== GAME_MODES.FOOTBALL) setRemainingClubs([]);
    setGameState(GAME_STATES.PLAYING);

    window.setTimeout(() => {
      globeRef.current?.triggerStartAnimation?.();
      pickNextCountry(pool, mode, 0, true, initialClubPool);
      setIsGameActive(true);
      setTargetStartTime(Date.now());
    }, 500);
  }, [activeRegion, allCountries, globeRef, pickNextCountry, powerUps.extraLife, resetSessionStats]);

  const skipCountry = useCallback(() => {
    const cost = 50 - ((powerUps.discount || 0) * 5);
    if (coinsRef.current < cost) return;

    const nextCoins = coinsRef.current - cost;
    setCoins(nextCoins);
    saveNativeData('geoGuessCoins', nextCoins);
    sessionStatsRef.current.skippedCount += 1;
    playSound('coin', 0.6);
    pickNextCountry(remainingCountriesRef.current, gameMode, streak, false, remainingClubsRef.current);
  }, [gameMode, pickNextCountry, powerUps.discount, streak]);

  const revive = useCallback(() => {
    if (coinsRef.current < 100) return;

    const nextCoins = coinsRef.current - 100;
    setCoins(nextCoins);
    saveNativeData('geoGuessCoins', nextCoins);
    sessionStatsRef.current.reviveUses += 1;
    playSound('success', 0.8);
    setLives(1);
    setStudyCard(null);
    setIsTimerFrozen(false);
    pickNextCountry(remainingCountriesRef.current, gameMode, streak, false, remainingClubsRef.current);
  }, [gameMode, pickNextCountry, streak]);

  const freezeTime = useCallback(() => {
    if (coinsRef.current < 75 || freezeTimeLeft > 0) return;

    const nextCoins = coinsRef.current - 75;
    setCoins(nextCoins);
    saveNativeData('geoGuessCoins', nextCoins);
    sessionStatsRef.current.freezeUses += 1;
    playSound('coin', 0.6);
    setFreezeTimeLeft(10 + ((powerUps.freezeTime || 0) * 2));
  }, [freezeTimeLeft, powerUps.freezeTime]);

  const spawnFloatingPoint = useCallback((text, x, y, colorClass) => {
    const nextId = floatingPointIdRef.current + 1;
    floatingPointIdRef.current = nextId;
    setFloatingPoints((previous) => [...previous, { id: nextId, text, x, y, colorClass }]);
    window.setTimeout(() => {
      setFloatingPoints((previous) => previous.filter((point) => point.id !== nextId));
    }, 800);
  }, []);

  const handleCountryClick = useCallback((polygon, lat, lng, event) => {
    if (gameState !== GAME_STATES.PLAYING || !targetCountry || !isGameActive || studyCard || isProcessingRef.current) return;

    const clickedCountry = polygon.properties.COUNTRY_OBJ;
    if (!clickedCountry) return;

    isProcessingRef.current = true;
    const timeTaken = (Date.now() - targetStartTime) / 1000;
    const isCombo = timeTaken <= 3 && !isTimerFrozen && freezeTimeLeft === 0;
    const clickX = event?.clientX || window.innerWidth / 2;
    const clickY = event?.clientY || window.innerHeight / 2;

    setImpactRings((previous) =>
      appendWithLimit(previous, { lat, lng, color: clickedCountry.iso === targetCountry.iso ? '#34d399' : '#f43f5e' }, MAX_IMPACT_RINGS),
    );

    if (clickedCountry.iso === targetCountry.iso) {
      const nextStreak = streak + 1;
      const pointsGained = (isCombo ? 200 : 100) + (nextStreak * 10);
      const continent = normalizeContinent(targetCountry.continent);

      setStreak(nextStreak);
      setScore((previous) => previous + pointsGained);
      sessionStatsRef.current.correctAnswers += 1;
      sessionStatsRef.current.maxStreak = Math.max(sessionStatsRef.current.maxStreak, nextStreak);
      if (isCombo) sessionStatsRef.current.comboHits += 1;
      sessionStatsRef.current.continentCorrect[continent] = (sessionStatsRef.current.continentCorrect[continent] || 0) + 1;
      sessionStatsRef.current.guessedCountryIsos.push({ iso: targetCountry.iso, continent });

      unlockAchievement('first_country');
      if (nextStreak === 3) unlockAchievement('combo_3');
      if (nextStreak === 5) unlockAchievement('combo_5');
      if (nextStreak === 10) unlockAchievement('combo_10');

      if (isCombo) {
        setTimeLeft((previous) => previous + 5);
        if (nextStreak >= 3) playComboStinger(nextStreak);
      }

      triggerHaptic(ImpactStyle.Light);

      if (gameMode === GAME_MODES.FOOTBALL) playSound('stadium', 0.8);
      else playSound('success', isCombo ? 0.9 : 0.6);

      const newGuess = { ...clickedCountry, lat, lng };
      const previousGuesses = guessedRef.current;
      if (previousGuesses.length > 0) {
        const lastGuess = previousGuesses[previousGuesses.length - 1];
        setTravelArcs((currentArcs) =>
          appendWithLimit(
            currentArcs,
            { startLat: lastGuess.lat, startLng: lastGuess.lng, endLat: lat, endLng: lng },
            MAX_TRAVEL_ARCS,
          ),
        );
      }

      setGuessedCountries((previous) => [...previous, newGuess]);
      setScreenFlash('success');
      spawnFloatingPoint(`+${pointsGained}`, clickX, clickY, isCombo ? 'text-amber-400 font-black scale-125' : 'text-emerald-400');

      if (gameMode === GAME_MODES.STUDY) {
        window.setTimeout(() => {
          setScreenFlash('');
          setIsTimerFrozen(true);
          setStudyCard({
            ...targetCountry,
            capital: capitals[targetCountry.iso] || 'Desconhecida',
            isCorrect: true,
            pointsGained,
            curStreak: nextStreak,
          });
          isProcessingRef.current = false;
        }, 300);
      } else {
        window.setTimeout(() => setScreenFlash(''), 300);
        window.setTimeout(() => {
          pickNextCountry(remainingCountriesRef.current, gameMode, nextStreak, false, remainingClubsRef.current);
          isProcessingRef.current = false;
        }, 300);
      }

      return;
    }

    sessionStatsRef.current.wrongAnswers += 1;
    setStreak(0);
    const nextLives = lives - 1;
    setLives(nextLives);
    triggerHaptic(ImpactStyle.Heavy);
    playSound('error', 0.6);
    setScreenFlash('error');
    setIsShaking(true);
    spawnFloatingPoint('ERRADO', clickX, clickY, 'text-rose-500 font-black');

    window.setTimeout(() => {
      setScreenFlash('');
      setIsShaking(false);
      if (gameMode === GAME_MODES.STUDY || nextLives <= 0) {
        setIsTimerFrozen(true);
        setStudyCard({
          ...targetCountry,
          clickedName: clickedCountry.name,
          capital: capitals[targetCountry.iso] || 'Desconhecida',
          isCorrect: false,
          livesRemaining: nextLives,
        });
      }
      isProcessingRef.current = false;
    }, 400);
  }, [capitals, freezeTimeLeft, gameMode, gameState, isGameActive, isTimerFrozen, lives, pickNextCountry, spawnFloatingPoint, streak, studyCard, targetCountry, targetStartTime, triggerHaptic, unlockAchievement]);

  const dismissStudyCard = useCallback(() => {
    playTone(500, 'square', 0.1);
    const wasCorrect = studyCard?.isCorrect;
    const livesRemaining = studyCard?.livesRemaining;
    const currentStreak = studyCard?.curStreak || 0;

    setStudyCard(null);
    setIsTimerFrozen(false);

    if (!wasCorrect && livesRemaining <= 0) {
      endGame(gameMode === GAME_MODES.DAILY ? 'daily_loss' : 'lives');
      return;
    }

    pickNextCountry(remainingCountriesRef.current, gameMode, currentStreak, false, remainingClubsRef.current);
  }, [endGame, gameMode, pickNextCountry, studyCard]);

  return {
    state: {
      isMobile,
      geoData,
      guessedCountries,
      travelArcs,
      impactRings,
      gameState,
      gameMode,
      endReason,
      coins,
      lastCoinsEarned,
      unlockedThemes,
      activeTheme,
      activeRegion,
      timeLeft,
      score,
      streak,
      bestScore,
      previousBestScore,
      lives,
      targetCountry,
      targetClub,
      screenFlash,
      isShaking,
      floatingPoints,
      todayStr,
      playedDailyDates,
      studyCard,
      unlockedAchievements,
      showTutorial,
      showAchievements,
      achievementToast,
      freezeTimeLeft,
      isSmoothMode,
      showSettingsPrompt,
      unlockedAvatars,
      activeAvatar,
      powerUps,
      routeUpgrades,
      showShop,
      redeemedCodes,
      isDarkMode,
      isVibrationEnabled,
      isSoundEnabled,
      isBatterySaverMode,
      isHighContrastMode,
      isLargeTextMode,
      isColorAssistMode,
      isReducedEffectsMode,
      isNativePlatform: nativePlatform,
      isAndroidPlatform: androidPlatform,
      sessionTargetCount,
      countryCount: allCountries.length,
      adPrompt,
      isAdFlowActive,
      canUseRewardedRevive:
        !rewardedReviveUsed &&
        Boolean(studyCard) &&
        !studyCard?.isCorrect &&
        studyCard?.livesRemaining <= 0 &&
        gameMode !== GAME_MODES.DAILY,
      canClaimRewardedCoins:
        gameState === GAME_STATES.RESULT && !rewardedCoinsClaimed && lastCoinsEarned > 0,
      metaProgress,
      activeEvent,
      weeklyRotationPreview,
      telemetry,
      telemetryInsight,
      coachTip,
      sessionRewardSummary,
      dailyWinsCount,
    },
    actions: {
      startGame,
      endGame,
      quitGame,
      resetGlobe,
      setCoins,
      setUnlockedThemes,
      setActiveTheme: selectTheme,
      setActiveRegion,
      handleCountryClick,
      dismissStudyCard,
      closeTutorial,
      setShowTutorial,
      setShowAchievements,
      setShowSettingsPrompt,
      skipCountry,
      revive,
      freezeTime,
      applySettings,
      setUnlockedAvatars,
      setActiveAvatar,
      setPowerUps,
      setRouteUpgrades,
      setShowShop,
      redeemCode,
      toggleDarkMode,
      toggleVibration,
      toggleSound,
      toggleHighContrast,
      toggleLargeText,
      toggleColorAssist,
      toggleReducedEffects,
      triggerHaptic,
      openRewardedRevivePrompt,
      openRewardedCoinsPrompt,
      closeAdPrompt,
      confirmAdPrompt,
      maybeShowSessionInterstitial,
    },
  };
}
