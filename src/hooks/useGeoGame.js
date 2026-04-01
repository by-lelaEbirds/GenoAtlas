import { useState, useEffect, useCallback, useRef } from 'react';
import { playTone, playSound } from '../utils/audio';
import { saveNativeData, getNativeData } from '../utils/storage';
import { GAME_STATES, GAME_MODES, MAP_THEMES } from '../constants';
import { FOOTBALL_CLUBS } from '../constants/football';
import { CAPITALS_MAP } from '../constants/capitals';
import { AVATARS } from '../constants/shop';
import { PROMO_CODES } from '../constants/promoCodes';
import { ACHIEVEMENTS_LIST } from '../constants/achievements';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App as CapApp } from '@capacitor/app';

const getDailyCountries = (pool) => {
  const today = new Date();
  let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const random = () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  const filtered = pool.filter(c => c.pop > 10000000);
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 5);
};

export function useGeoGame(globeRef) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [geoData, setGeoData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [travelArcs, setTravelArcs] = useState([]);
  const [impactRings, setImpactRings] = useState([]);
  const capitals = CAPITALS_MAP;

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
  
  // NOVO: ESTADO DO MODO ESCURO E VIBRAÇÃO
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [dailyWinsCount, setDailyWinsCount] = useState(0);

  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const guessedRef = useRef([]);
  const isProcessingRef = useRef(false);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { coinsRef.current = coins; }, [coins]);
  useEffect(() => { guessedRef.current = guessedCountries; }, [guessedCountries]);

  const [targetCountry, setTargetCountry] = useState(null);
  const [targetClub, setTargetClub] = useState(null); 
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [remainingClubs, setRemainingClubs] = useState([]);
  const [targetStartTime, setTargetStartTime] = useState(0);

  const [screenFlash, setScreenFlash] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const [studyCard, setStudyCard] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [playedDailyDates, setPlayedDailyDates] = useState([]);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedScore = await getNativeData('geoGuessBestScore');
        const savedCoins = await getNativeData('geoGuessCoins');
        const savedThemes = await getNativeData('geoGuessThemes');
        const savedAchievements = await getNativeData('geoGuessAchievements');
        const hasSeenTuto = await getNativeData('geoGuessTutorial');
        const savedSmooth = await getNativeData('geoGuessSmoothMode');
        const savedDaily = await getNativeData('geoGuessDaily');
        const savedDailyWins = await getNativeData('geoGuessDailyWinsCount');
        const savedAvatars = await getNativeData('geoGuessAvatars');
        const savedActiveAvatar = await getNativeData('geoGuessActiveAvatar');
        const savedPowerUps = await getNativeData('geoGuessPowerUps');
        const savedRedeemedCodes = await getNativeData('geoGuessRedeemedCodes');
        const savedDarkMode = await getNativeData('geoGuessDarkMode'); // NOVO
        const savedVibration = await getNativeData('geoGuessVibration');

        if (savedScore) setBestScore(parseInt(savedScore, 10));
        if (savedCoins) setCoins(parseInt(savedCoins, 10));
        if (savedDailyWins) setDailyWinsCount(parseInt(savedDailyWins, 10));
        
        if (savedThemes) {
          const savedIds = JSON.parse(savedThemes);
          const validIds = [...new Set(['explorador', ...savedIds])].filter(id => id in MAP_THEMES);
          setUnlockedThemes(validIds);
        }
        
        if (savedAvatars) setUnlockedAvatars(JSON.parse(savedAvatars));
        if (savedActiveAvatar) {
          const found = AVATARS.find(a => a.id === savedActiveAvatar);
          if (found) setActiveAvatar(found);
        }
        if (savedPowerUps) setPowerUps(JSON.parse(savedPowerUps));
        if (savedRedeemedCodes) setRedeemedCodes(JSON.parse(savedRedeemedCodes));
        if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements));
        if (!hasSeenTuto) setShowTutorial(true);
        if (savedDaily) setPlayedDailyDates(JSON.parse(savedDaily));

        if (savedSmooth === null) setShowSettingsPrompt(true);
        else setIsSmoothMode(savedSmooth === 'true');

        // Carrega a preferência de Modo Escuro e Vibração
        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
        if (savedVibration !== null) setIsVibrationEnabled(savedVibration === 'true');

      } catch(e) {
        console.warn("GenoAtlas - Erro recuperando salvamento:", e);
      }
    };

    const fetchGeoData = async () => {
      try {
        const module = await import('../constants/countries.json');
        const countriesData = module.default || module;
        const translator = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
        const valid = [];
        const translatedFeatures = countriesData.features.map(f => {
          let localName = f.properties.ADMIN;
          let isoCode = f.properties.ISO_A2;
          if (isoCode === '-99') {
            if (f.properties.ADMIN === 'France') isoCode = 'FR';
            else if (f.properties.ADMIN === 'Norway') isoCode = 'NO';
          }
          if (isoCode && isoCode !== '-99') {
            try { localName = translator.of(isoCode); } catch (e) {}
            const countryObj = { name: localName, iso: isoCode, continent: f.properties.CONTINENT, pop: f.properties.POP_EST };
            f.properties.COUNTRY_OBJ = countryObj;
            valid.push(countryObj);
          }
          return f;
        });
        setGeoData(translatedFeatures);
        setAllCountries(valid);
      } catch (e) {}
    };

    loadSavedData();
    fetchGeoData();
  }, []);

  useEffect(() => {
    const handleAppState = ({ isActive }) => {
      if (!isActive && gameState === GAME_STATES.PLAYING && !studyCard) setIsTimerFrozen(true);
      else if (isActive && gameState === GAME_STATES.PLAYING && !studyCard) setIsTimerFrozen(false);
    };
    let appListener;
    try { appListener = CapApp.addListener('appStateChange', handleAppState); } catch(e){}
    return () => { if(appListener) appListener.remove(); }
  }, [gameState, studyCard]);

  useEffect(() => {
    let rafId;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsMobile(window.innerWidth < 768));
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(rafId); };
  }, []);

  const timeLeftRef = useRef(timeLeft);
  const freezeTimeLeftRef = useRef(freezeTimeLeft);
  const endGameRef = useRef();

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { freezeTimeLeftRef.current = freezeTimeLeft; }, [freezeTimeLeft]);

  useEffect(() => {
    let timer;
    if (gameState === GAME_STATES.PLAYING && isGameActive && !isTimerFrozen) {
      timer = setInterval(() => {
        if (freezeTimeLeftRef.current > 0) {
          setFreezeTimeLeft(prev => prev - 1);
        } else if (gameMode !== GAME_MODES.STUDY) {
          if (timeLeftRef.current > 0) {
            setTimeLeft(prev => {
              const nextTime = prev - 1;
              if (nextTime <= 6 && nextTime > 0) playTone(800, 'sine', 0.1, 0.05);
              return nextTime;
            });
          } else if (timeLeftRef.current <= 0) {
            if (endGameRef.current) endGameRef.current('time');
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, isGameActive, isTimerFrozen, gameMode]);

  const applySettings = (isSmooth) => {
    setIsSmoothMode(isSmooth);
    saveNativeData('geoGuessSmoothMode', isSmooth);
    setShowSettingsPrompt(false);
  };

  const triggerHaptic = useCallback((style = ImpactStyle.Light) => {
    if (isVibrationEnabled) {
      try { Haptics.impact({ style }); } catch(e) {}
    }
  }, [isVibrationEnabled]);

  // Função para alternar o Modo Escuro
  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    saveNativeData('geoGuessDarkMode', nextMode);
    triggerHaptic(ImpactStyle.Light);
  };

  // Função para alternar a Vibração
  const toggleVibration = () => {
    const nextMode = !isVibrationEnabled;
    setIsVibrationEnabled(nextMode);
    saveNativeData('geoGuessVibration', nextMode);
    if (nextMode) {
      try { Haptics.impact({ style: ImpactStyle.Medium }); } catch(e) {}
    }
  };

  const unlockAchievement = useCallback((id) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;
      const achievementData = ACHIEVEMENTS_LIST.find(a => a.id === id);
      if (!achievementData) return prev;

      const newUnlocked = [...prev, id];
      saveNativeData('geoGuessAchievements', JSON.stringify(newUnlocked));
      
      if (achievementData.reward > 0) {
        setCoins(c => {
          const nextCoins = c + achievementData.reward;
          saveNativeData('geoGuessCoins', nextCoins);
          return nextCoins;
        });
      }
      
      setAchievementToast(achievementData);
      triggerHaptic(ImpactStyle.Heavy);
      playSound('coin', 0.7);
      setTimeout(() => setAchievementToast(null), 4000);
      return newUnlocked;
    });
  }, []);

  useEffect(() => {
    if (coins >= 1000) unlockAchievement('wealthy_1');
    if (coins >= 5000) unlockAchievement('wealthy_2');
    if (coins >= 10000) unlockAchievement('wealthy_3');
  }, [coins, unlockAchievement]);

  const endGame = useCallback((reason) => {
    setGameState(GAME_STATES.RESULT);
    setIsGameActive(false);
    setEndReason(reason);
    setStudyCard(null); 
    setFreezeTimeLeft(0);

    let earnedCoins = Math.floor(scoreRef.current / 10);
    if (gameMode === GAME_MODES.DAILY) {
      const newPlayed = [...new Set([...playedDailyDates, todayStr])];
      setPlayedDailyDates(newPlayed);
      saveNativeData('geoGuessDaily', JSON.stringify(newPlayed));
      
      if (reason === 'daily_win') {
        earnedCoins += 500;
        setDailyWinsCount(prev => {
          const newTotal = prev + 1;
          saveNativeData('geoGuessDailyWinsCount', newTotal);
          if (newTotal === 1) unlockAchievement('daily_win_1');
          if (newTotal === 5) unlockAchievement('daily_win_5');
          if (newTotal === 10) unlockAchievement('daily_win_10');
          return newTotal;
        });
      }
    }

    setLastCoinsEarned(earnedCoins);
    const newCoinsTotal = coinsRef.current + earnedCoins;
    setCoins(newCoinsTotal);
    saveNativeData('geoGuessCoins', newCoinsTotal);

    if (scoreRef.current > bestScore && (gameMode === GAME_MODES.NORMAL || gameMode === GAME_MODES.FOOTBALL)) {
      setBestScore(scoreRef.current);
      saveNativeData('geoGuessBestScore', scoreRef.current);
    }
    
    if (scoreRef.current >= 1000) unlockAchievement('score_1000');
    if (scoreRef.current >= 5000) unlockAchievement('score_5000');
    if (scoreRef.current >= 10000) unlockAchievement('score_10000');

    if (reason === 'daily_loss' || reason === 'time') playSound('error', 0.6);
    else if (reason === 'daily_win' || reason === 'win') playSound('success', 0.8);
    
    if (earnedCoins > 0) setTimeout(() => playSound('coin', 0.8), 800);
  }, [gameMode, todayStr, bestScore, unlockAchievement]);

  useEffect(() => { endGameRef.current = endGame; }, [endGame]);

  const closeTutorial = () => {
    setShowTutorial(false);
    saveNativeData('geoGuessTutorial', 'done');
  };

  const quitGame = () => {
    setGameState(GAME_STATES.START);
    setIsGameActive(false);
    setStudyCard(null);
    setFreezeTimeLeft(0);
  };

  const resetGlobe = useCallback(() => {
    if (globeRef.current) globeRef.current.resetPosition();
  }, [globeRef]);

  const redeemCode = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return { success: false, message: 'Digite um código válido!' };
    if (redeemedCodes.includes(code)) {
      playSound('error', 0.6);
      return { success: false, message: 'Código já foi utilizado!' };
    }
    const promo = PROMO_CODES[code];
    if (promo) {
      const newCodesList = [...redeemedCodes, code];
      setRedeemedCodes(newCodesList);
      saveNativeData('geoGuessRedeemedCodes', JSON.stringify(newCodesList));

      if (promo.type === 'coins') {
        const nextCoins = coinsRef.current + promo.reward;
        setCoins(nextCoins);
        saveNativeData('geoGuessCoins', nextCoins);
      }
      unlockAchievement('promo_code');
      triggerHaptic(ImpactStyle.Heavy);
      playSound('success', 0.8);
      setTimeout(() => playSound('coin', 0.9), 500);
      return { success: true, message: promo.message };
    }
    playSound('error', 0.6);
    return { success: false, message: 'Código inválido ou expirado.' };
  };

  const pickNextCountry = useCallback((pool, currentMode = gameMode, currentStreak = streak, isFirst = false, clubPool = remainingClubs) => {
    let selectedCountry;
    if (currentMode === GAME_MODES.FOOTBALL) {
      if (clubPool.length === 0) return endGame('win');
      const club = clubPool[0];
      setTargetClub(club);
      setRemainingClubs(clubPool.slice(1)); 
      selectedCountry = allCountries.find(c => c.iso === club.iso) || allCountries[0];
    } else if (currentMode === GAME_MODES.DAILY) {
      if (pool.length === 0) return endGame('daily_win');
      selectedCountry = pool[0];
      setRemainingCountries(pool.slice(1));
    } else {
      if (pool.length === 0) return endGame('win');
      let availablePool = pool;
      if (currentStreak < 2) {
        const easyPool = pool.filter(c => c.pop > 30000000);
        if (easyPool.length > 0) availablePool = easyPool;
      }
      selectedCountry = availablePool[Math.floor(Math.random() * availablePool.length)];
      setRemainingCountries(pool.filter(c => c.iso !== selectedCountry.iso));
    }
    setTargetCountry(selectedCountry);
    if (!isFirst) setTargetStartTime(Date.now());
  }, [allCountries, endGame, gameMode, remainingClubs, streak]);

  const startGame = useCallback((mode = GAME_MODES.NORMAL, forcedRegion = null) => {
    if (allCountries.length === 0) return;
    const finalRegion = forcedRegion || activeRegion;
    if (forcedRegion) setActiveRegion(forcedRegion);

    playTone(600, 'square', 0.1); 
    setScore(0); setStreak(0); setTimeLeft(60); 
    const baseLives = mode === GAME_MODES.DAILY ? 1 : 3;
    setLives(baseLives + powerUps.extraLife);

    setGuessedCountries([]); setTravelArcs([]); setImpactRings([]); setFloatingPoints([]);
    setIsTimerFrozen(false);
    setFreezeTimeLeft(0);
    setStudyCard(null);
    setGameMode(mode);

    if (globeRef.current) globeRef.current.resetPosition();

    let pool = [];
    let initialClubPool = [];

    if (mode === GAME_MODES.DAILY) {
      pool = getDailyCountries(allCountries);
    } else if (mode === GAME_MODES.FOOTBALL) {
      initialClubPool = [...FOOTBALL_CLUBS].sort(() => Math.random() - 0.5);
      setRemainingClubs(initialClubPool);
      pool = allCountries; 
    } else {
      pool = finalRegion === 'all' ? allCountries : allCountries.filter(c => c.continent === finalRegion || (finalRegion === 'Americas' && c.continent.includes('America')));
    }

    setRemainingCountries([...pool]);
    setGameState(GAME_STATES.PLAYING);

    setTimeout(() => {
      if (globeRef.current) globeRef.current.triggerStartAnimation();
      pickNextCountry(pool, mode, 0, true, initialClubPool);
      setIsGameActive(true);
      setTargetStartTime(Date.now());
    }, 500);
  }, [activeRegion, allCountries, globeRef, pickNextCountry, powerUps.extraLife]);

  const skipCountry = () => {
    const cost = 50 - (powerUps.discount * 5); 
    if (coinsRef.current >= cost) {
      const nextCoins = coinsRef.current - cost;
      setCoins(nextCoins);
      saveNativeData('geoGuessCoins', nextCoins);
      playSound('coin', 0.6);
      pickNextCountry(remainingCountries, gameMode, streak, false, remainingClubs);
    }
  };

  const revive = () => {
    if (coinsRef.current >= 100) {
      const nextCoins = coinsRef.current - 100;
      setCoins(nextCoins);
      saveNativeData('geoGuessCoins', nextCoins);
      playSound('success', 0.8);
      setLives(1);
      setStudyCard(null);
      setIsTimerFrozen(false);
      pickNextCountry(remainingCountries, gameMode, streak, false, remainingClubs);
    }
  };

  const freezeTime = () => {
    if (coinsRef.current >= 75 && freezeTimeLeft === 0) {
      const nextCoins = coinsRef.current - 75;
      setCoins(nextCoins);
      saveNativeData('geoGuessCoins', nextCoins);
      playSound('coin', 0.6); 
      setFreezeTimeLeft(10 + (powerUps.freezeTime * 2)); 
    }
  };

  const spawnFloatingPoint = (text, x, y, colorClass) => {
    const id = Date.now();
    setFloatingPoints(prev => [...prev, { id, text, x, y, colorClass }]);
    setTimeout(() => setFloatingPoints(prev => prev.filter(p => p.id !== id)), 800);
  };

  const handleCountryClick = useCallback((polygon, lat, lng, event) => {
    if (gameState !== GAME_STATES.PLAYING || !targetCountry || !isGameActive || studyCard || isProcessingRef.current) return;

    const clicked = polygon.properties.COUNTRY_OBJ;
    if (!clicked) return;

    isProcessingRef.current = true;
    const timeTaken = (Date.now() - targetStartTime) / 1000;
    const isCombo = timeTaken <= 3 && (!isTimerFrozen && freezeTimeLeft === 0);
    const clickX = event?.clientX || window.innerWidth / 2;
    const clickY = event?.clientY || window.innerHeight / 2;

    setImpactRings(prev => [...prev, { lat, lng, color: clicked.iso === targetCountry.iso ? '#34d399' : '#f43f5e' }]);

    if (clicked.iso === targetCountry.iso) {
      const curStreak = streak + 1;
      setStreak(curStreak);

      const pointsGained = (isCombo ? 200 : 100) + (curStreak * 10);
      setScore(s => s + pointsGained);

      unlockAchievement('first_country');
      if (curStreak === 3) unlockAchievement('combo_3');
      if (curStreak === 5) unlockAchievement('combo_5');
      if (curStreak === 10) unlockAchievement('combo_10'); 

      if (isCombo) setTimeLeft(t => t + 5);
      
      triggerHaptic(ImpactStyle.Light);
      
      if (gameMode === GAME_MODES.FOOTBALL) playSound('stadium', 0.8);
      else playSound('success', isCombo ? 0.9 : 0.6);

      const newGuess = { ...clicked, lat, lng };
      const prevGuessed = guessedRef.current;
      
      if (prevGuessed.length > 0) {
        const last = prevGuessed[prevGuessed.length - 1];
        setTravelArcs(arcs => [...arcs, { startLat: last.lat, startLng: last.lng, endLat: lat, endLng: lng }]);
      }
      setGuessedCountries(g => [...g, newGuess]);

      setScreenFlash('success');
      spawnFloatingPoint(`+${pointsGained}`, clickX, clickY, isCombo ? 'text-amber-400 font-black scale-125' : 'text-emerald-400');

      if (gameMode === GAME_MODES.STUDY) {
        setTimeout(() => {
          setScreenFlash('');
          setIsTimerFrozen(true); 
          setStudyCard({ ...targetCountry, capital: capitals[targetCountry.iso] || 'Desconhecida', isCorrect: true, pointsGained, curStreak });
          isProcessingRef.current = false;
        }, 300);
      } else {
        setTimeout(() => setScreenFlash(''), 300);
        setTimeout(() => {
          pickNextCountry(remainingCountries, gameMode, curStreak, false, remainingClubs);
          isProcessingRef.current = false;
        }, 300); 
      }
    } else {
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);

      triggerHaptic(ImpactStyle.Heavy);
      
      playSound('error', 0.6);
      setScreenFlash('error');
      setIsShaking(true);
      spawnFloatingPoint('ERRADO', clickX, clickY, 'text-rose-500 font-black');

      setTimeout(() => {
        setScreenFlash('');
        setIsShaking(false);
        if (gameMode === GAME_MODES.STUDY || newLives <= 0) {
          setIsTimerFrozen(true);
          setStudyCard({ ...targetCountry, clickedName: clicked.name, capital: capitals[targetCountry.iso] || 'Desconhecida', isCorrect: false, livesRemaining: newLives });
        }
        isProcessingRef.current = false;
      }, 400);
    }
  }, [gameState, isGameActive, targetCountry, targetStartTime, remainingCountries, remainingClubs, isTimerFrozen, freezeTimeLeft, gameMode, capitals, studyCard, pickNextCountry, unlockAchievement, streak, lives]);

  const dismissStudyCard = () => {
    playTone(500, 'square', 0.1);
    const wasCorrect = studyCard.isCorrect;
    const livesLeft = studyCard.livesRemaining;
    const curStreak = studyCard.curStreak || 0;

    setStudyCard(null);
    setIsTimerFrozen(false);

    if (!wasCorrect && livesLeft <= 0) {
      endGame(gameMode === GAME_MODES.DAILY ? 'daily_loss' : 'lives');
    } else {
      pickNextCountry(remainingCountries, gameMode, curStreak, false, remainingClubs);
    }
  };

  return {
    state: {
      isMobile, geoData, guessedCountries, travelArcs, impactRings,
      gameState, gameMode, endReason, coins, lastCoinsEarned, unlockedThemes,
      activeTheme, activeRegion, timeLeft, score, streak,
      bestScore, lives, targetCountry, targetClub, screenFlash, isShaking,
      floatingPoints, todayStr, playedDailyDates, studyCard,
      unlockedAchievements, showTutorial, showAchievements, achievementToast,
      freezeTimeLeft, isSmoothMode, showSettingsPrompt,
      unlockedAvatars, activeAvatar, powerUps, showShop, redeemedCodes,
      isDarkMode, isVibrationEnabled
    },
    actions: {
      startGame, endGame, quitGame, resetGlobe, setCoins, setUnlockedThemes,
      setActiveTheme, setActiveRegion, handleCountryClick, dismissStudyCard,
      closeTutorial, setShowTutorial, setShowAchievements, setShowSettingsPrompt,
      skipCountry, revive, freezeTime, applySettings, 
      setUnlockedAvatars, setActiveAvatar, setPowerUps, setShowShop, redeemCode,
      toggleDarkMode, toggleVibration, triggerHaptic
    }
  };
}
