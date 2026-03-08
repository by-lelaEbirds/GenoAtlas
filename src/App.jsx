import React, { useState, useEffect, useCallback } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import { Timer, Trophy, Target, Heart, XOctagon } from 'lucide-react';

export const MAP_THEMES = {
  satellite: {
    id: 'satellite',
    name: 'Satélite HD',
    globeUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bg: 'from-[#0f172a] to-[#020617]',
    textColor: 'text-white',
    hudBg: 'bg-slate-900/80',
    polyStroke: '#00f3ff',
    polyHover: 'rgba(0, 243, 255, 0.5)',
    atmosphere: '#38bdf8',
    bump: '//unpkg.com/three-globe/example/img/earth-topology.png'
  },
  cartographic: {
    id: 'cartographic',
    name: 'Cartográfico',
    globeUrl: '//unpkg.com/three-globe/example/img/earth-day.jpg',
    bg: 'from-[#dbeafe] to-[#93c5fd]',
    textColor: 'text-slate-900',
    hudBg: 'bg-white/90',
    polyStroke: '#2563eb',
    polyHover: 'rgba(255, 255, 255, 0.5)',
    atmosphere: '#bfdbfe',
    bump: null
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    globeUrl: '//unpkg.com/three-globe/example/img/earth-dark.jpg',
    bg: 'from-[#17052e] to-[#050014]',
    textColor: 'text-fuchsia-50',
    hudBg: 'bg-fuchsia-950/80',
    polyStroke: '#bc13fe',
    polyHover: 'rgba(188, 19, 254, 0.6)',
    atmosphere: '#bc13fe',
    bump: null
  }
};
  cartographic: {
    id: 'cartographic',
    name: 'Cartográfico',
    globeUrl: '//unpkg.com/three-globe/example/img/earth-water.png',
    bg: 'from-[#f0f9ff] to-[#bae6fd]', // Modo Claro Suave!
    textColor: 'text-slate-900',
    hudBg: 'bg-white/80',
    polyStroke: '#1e40af',
    polyHover: 'rgba(30, 64, 175, 0.4)',
    atmosphere: '#7dd3fc',
    bump: null
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    globeUrl: '//unpkg.com/three-globe/example/img/earth-dark.jpg',
    bg: 'from-[#17052e] to-[#050014]',
    textColor: 'text-fuchsia-50',
    hudBg: 'bg-fuchsia-950/80',
    polyStroke: '#bc13fe',
    polyHover: 'rgba(188, 19, 254, 0.6)',
    atmosphere: '#bc13fe',
    bump: null
  }
};

export default function App() {
  const [geoData, setGeoData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  
  const [gameState, setGameState] = useState('start');
  const [endReason, setEndReason] = useState('');
  const [activeTheme, setActiveTheme] = useState(MAP_THEMES.satellite);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [targetCountry, setTargetCountry] = useState('');
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [targetStartTime, setTargetStartTime] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const savedScore = localStorage.getItem('geoGuessBestScore');
    if (savedScore) setBestScore(parseInt(savedScore, 10));

    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        const userLang = navigator.language || 'pt-BR';
        const translator = new Intl.DisplayNames([userLang], { type: 'region' });
        
        const validNames = new Set();
        const translatedFeatures = data.features.map(f => {
          let localName = f.properties.ADMIN;
          const isoCode = f.properties.ISO_A2;
          if (isoCode && isoCode !== '-99') {
            try { localName = translator.of(isoCode); } catch (error) {}
          }
          f.properties.LOCAL_NAME = localName;
          validNames.add(localName);
          return f;
        });

        setGeoData(translatedFeatures);
        setAllCountries(Array.from(validNames));
      });
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame('time');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const endGame = (reason) => {
    setGameState('result');
    setEndReason(reason);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('geoGuessBestScore', score.toString());
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setLives(3);
    setRemainingCountries([...allCountries]);
    setGameState('playing');
    pickNextCountry([...allCountries]);
  };

  const goHome = () => {
    setGameState('start');
    setFeedback(null);
    setTargetCountry('');
    setTimeLeft(60);
    setScore(0);
  };

  const pickNextCountry = (pool) => {
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    const newPool = pool.filter(c => c !== selected);
    setRemainingCountries(newPool);
    setTargetCountry(selected);
    setTargetStartTime(Date.now());
    setFeedback(null);
  };

  const handleCountryClick = useCallback((clickedCountry) => {
    if (gameState !== 'playing') return;

    const timeTaken = (Date.now() - targetStartTime) / 1000;
    const isCombo = timeTaken <= 3;

    if (clickedCountry === targetCountry) {
      const points = isCombo ? 200 : 100;
      setScore(prev => prev + points);
      setFeedback({ 
        text: isCombo ? '🔥 COMBO! +200' : '✅ CORRETO! +100', 
        color: isCombo ? 'text-amber-500 scale-110' : 'text-emerald-500' 
      });
      setTimeout(() => pickNextCountry(remainingCountries), 800);
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) endGame('lives');
        return newLives;
      });
      setFeedback({ text: `❌ Esse é: ${clickedCountry}`, color: 'text-rose-500' });
    }
  }, [gameState, targetCountry, targetStartTime, remainingCountries, score, bestScore]);

  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none bg-gradient-to-br ${activeTheme.bg} transition-colors duration-1000`}>
      <GlobeVisualizer geoData={geoData} onCountryClick={handleCountryClick} theme={activeTheme} />
      
      {gameState === 'start' && <StartScreen onStart={startGame} bestScore={bestScore} currentTheme={activeTheme} setTheme={setActiveTheme} />}
      
      {gameState === 'result' && <ResultScreen score={score} reason={endReason} bestScore={bestScore} onRestart={startGame} onHome={goHome} theme={activeTheme} />}

      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 pointer-events-none flex flex-col md:flex-row justify-between items-start gap-4 z-10">
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button 
              onClick={() => endGame('lives')}
              className="pointer-events-auto w-max flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors backdrop-blur-md"
            >
              <XOctagon size={16} /> DESISTIR
            </button>

            <div className={`${activeTheme.hudBg} backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full md:w-96 shadow-xl transition-colors duration-500`}>
              <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">
                <Target size={14} style={{ color: activeTheme.polyStroke }} /> Destino Alvo
              </div>
              <div className={`text-3xl md:text-4xl font-black tracking-wide drop-shadow-sm ${activeTheme.textColor}`}>
                {targetCountry}
              </div>
              <div className="h-6 mt-3">
                {feedback && <div className={`font-black transform transition-all tracking-wide ${feedback.color}`}>{feedback.text}</div>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 w-full md:w-auto justify-end">
            <div className={`${activeTheme.hudBg} backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-2 shadow-lg pointer-events-auto transition-colors duration-500`}>
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`transition-all duration-300 ${i < lives ? "text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "text-slate-400/30 scale-75"}`} size={22} />
              ))}
            </div>

            <div className={`${activeTheme.hudBg} backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-3 transition-all duration-500 shadow-lg pointer-events-auto ${timeLeft <= 10 ? 'border-rose-500/50 bg-rose-900/30' : ''}`}>
              <Timer className={timeLeft <= 10 ? 'text-rose-500 animate-pulse' : ''} style={{ color: timeLeft > 10 ? activeTheme.polyStroke : undefined }} size={24} />
              <span className={`text-3xl font-mono font-black tracking-tight ${timeLeft <= 10 ? 'text-rose-500' : activeTheme.textColor}`}>
                {timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className={`${activeTheme.hudBg} backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg pointer-events-auto transition-colors duration-500`}>
              <Trophy className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" size={24} />
              <span className={`text-3xl font-mono font-black tracking-tight ${activeTheme.textColor}`}>{score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
