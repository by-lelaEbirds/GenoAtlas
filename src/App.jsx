import React, { useState, useEffect, useCallback, useRef } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import { Timer, Trophy, Target, Heart, XOctagon, Lightbulb } from 'lucide-react';

export const MAP_THEMES = {
  satellite: {
    id: 'satellite',
    name: 'Satélite HD',
    globeUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bg: 'from-[#0f172a] to-[#020617]',
    textColor: 'text-white',
    hudBg: 'bg-slate-900/80',
    polyStroke: '#22d3ee',
    polyHover: 'rgba(34, 211, 238, 0.5)',
    polyGuessed: 'rgba(34, 197, 94, 0.5)',
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
    polyGuessed: 'rgba(34, 197, 94, 0.6)',
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
    polyStroke: '#d946ef',
    polyHover: 'rgba(217, 70, 239, 0.6)',
    polyGuessed: 'rgba(34, 197, 94, 0.6)',
    atmosphere: '#d946ef',
    bump: null
  }
};

export default function App() {
  const globeRef = useRef();
  const [geoData, setGeoData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [travelArcs, setTravelArcs] = useState([]);
  
  const [gameState, setGameState] = useState('start');
  const [endReason, setEndReason] = useState('');
  const [activeTheme, setActiveTheme] = useState(MAP_THEMES.satellite);
  const [themeAnimState, setThemeAnimState] = useState('idle'); 
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [targetCountry, setTargetCountry] = useState(null);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [targetStartTime, setTargetStartTime] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    const savedScore = localStorage.getItem('geoGuessBestScore');
    if (savedScore) setBestScore(parseInt(savedScore, 10));

    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        let userLang = navigator.language;
        if (!userLang.startsWith('pt')) userLang = 'pt-BR';
        
        const translator = new Intl.DisplayNames([userLang], { type: 'region' });
        
        const validCountries = [];
        const translatedFeatures = data.features.map(f => {
          let localName = f.properties.ADMIN;
          const isoCode = f.properties.ISO_A2;
          
          if (isoCode && isoCode !== '-99') {
            try { localName = translator.of(isoCode); } catch (error) {}
            const countryObj = { 
              name: localName, 
              iso: isoCode, 
              continent: f.properties.CONTINENT,
              lat: f.properties.LABEL_Y, // A MAGIA ACONTECE AQUI: Centro exato do país (Latitude)
              lng: f.properties.LABEL_X  // Centro exato do país (Longitude)
            };
            f.properties.LOCAL_NAME = localName;
            f.properties.COUNTRY_OBJ = countryObj;
            validCountries.push(countryObj);
          }
          return f;
        });

        setGeoData(translatedFeatures);
        setAllCountries(validCountries);
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

  const handleThemeChange = (newTheme) => {
    if (newTheme.id === activeTheme.id || themeAnimState !== 'idle') return;
    setThemeAnimState('out');
    
    setTimeout(() => {
      setActiveTheme(newTheme);
      setThemeAnimState('prepare-in');
      setTimeout(() => { setThemeAnimState('idle'); }, 50);
    }, 300);
  };

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
    setGuessedCountries([]);
    setTravelArcs([]);
    setRemainingCountries([...allCountries]);
    setGameState('playing');
    if (globeRef.current) globeRef.current.triggerStartAnimation();
    pickNextCountry([...allCountries]);
  };

  const goHome = () => {
    setGameState('start');
    setFeedback(null);
    setTargetCountry(null);
    setTimeLeft(60);
    setScore(0);
    setGuessedCountries([]);
    setTravelArcs([]);
  };

  const pickNextCountry = (pool) => {
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    const newPool = pool.filter(c => c.iso !== selected.iso);
    setRemainingCountries(newPool);
    setTargetCountry(selected);
    setTargetStartTime(Date.now());
    setFeedback(null);
    setHintUsed(false);
  };

  const useHint = () => {
    if (lives <= 1 || hintUsed || !targetCountry) return;
    setLives(prev => prev - 1);
    setHintUsed(true);
    setFeedback({ text: `📍 Continente: ${targetCountry.continent}`, color: 'text-amber-500' });
  };

  // Simplificámos a função: agora usamos as coordenadas do próprio objeto do país!
  const handleCountryClick = useCallback((polygon) => {
    if (gameState !== 'playing' || !targetCountry) return;

    const clickedCountryObj = polygon.properties.COUNTRY_OBJ;
    if (!clickedCountryObj) return;

    const timeTaken = (Date.now() - targetStartTime) / 1000;
    const isCombo = timeTaken <= 3;

    if (clickedCountryObj.iso === targetCountry.iso) {
      const points = isCombo ? 200 : 100;
      setScore(prev => prev + points);
      
      setGuessedCountries(prev => {
        if (prev.length > 0) {
          const lastGuess = prev[prev.length - 1];
          setTravelArcs(arcs => [...arcs, { 
            startLat: lastGuess.lat, startLng: lastGuess.lng, 
            endLat: clickedCountryObj.lat, endLng: clickedCountryObj.lng 
          }]);
        }
        return [...prev, clickedCountryObj];
      });

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
      setFeedback({ text: `❌ Esse é: ${clickedCountryObj.name}`, color: 'text-rose-500' });
    }
  }, [gameState, targetCountry, targetStartTime, remainingCountries, score, bestScore]);

  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none bg-gradient-to-br ${activeTheme.bg} transition-colors duration-700 ease-in-out`}>
      <GlobeVisualizer 
        ref={globeRef}
        geoData={geoData} 
        onCountryClick={handleCountryClick} 
        theme={activeTheme} 
        gameState={gameState}
        guessedCountries={guessedCountries}
        themeAnimState={themeAnimState}
        travelArcs={travelArcs}
      />
      
      {gameState === 'start' && <StartScreen onStart={startGame} bestScore={bestScore} currentTheme={activeTheme} setTheme={handleThemeChange} />}
      
      {gameState === 'result' && <ResultScreen score={score} reason={endReason} bestScore={bestScore} onRestart={startGame} onHome={goHome} theme={activeTheme} />}

      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 pointer-events-none flex flex-col md:flex-row justify-between items-start gap-4 z-10 animate-in fade-in duration-700">
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-3 pointer-events-auto">
              <button 
                onClick={() => endGame('lives')}
                className="w-max flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors backdrop-blur-md"
              >
                <XOctagon size={16} /> DESISTIR
              </button>
              
              <button 
                onClick={useHint}
                disabled={lives <= 1 || hintUsed}
                className={`w-max flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-bold transition-colors backdrop-blur-md ${lives <= 1 || hintUsed ? 'bg-slate-500/10 text-slate-500 border-slate-500/20 opacity-50 cursor-not-allowed' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'}`}
              >
                <Lightbulb size={16} /> {hintUsed ? 'DICA USADA' : 'DICA CONTINENTE (-1 Vida)'}
              </button>
            </div>

            <div className={`${activeTheme.hudBg} backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full md:w-96 shadow-xl transition-colors duration-500`}>
              <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">
                <Target size={14} style={{ color: activeTheme.polyStroke }} /> Destino Alvo
              </div>
              <div className={`text-3xl md:text-4xl font-black tracking-wide drop-shadow-sm ${activeTheme.textColor}`}>
                {targetCountry?.name || '...'}
              </div>
              
              <div className="h-6 mt-3 flex flex-col justify-center">
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
