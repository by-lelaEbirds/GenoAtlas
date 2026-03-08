import React, { useState, useEffect, useCallback } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import { Timer, Trophy, Target, Heart, XOctagon } from 'lucide-react';

export default function App() {
  const [geoData, setGeoData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  
  const [gameState, setGameState] = useState('start');
  const [endReason, setEndReason] = useState('');
  
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
            try {
              localName = translator.of(isoCode);
            } catch (error) {}
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
        text: isCombo ? '🔥 COMBO PERFEITO! +200' : '✅ CORRETO! +100', 
        color: isCombo ? 'text-yellow-400 scale-110' : 'text-green-400' 
      });
      setTimeout(() => pickNextCountry(remainingCountries), 800);
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) endGame('lives');
        return newLives;
      });
      setFeedback({ text: `❌ Errou! Esse é: ${clickedCountry}`, color: 'text-red-500' });
    }
  }, [gameState, targetCountry, targetStartTime, remainingCountries, score, bestScore]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <GlobeVisualizer geoData={geoData} onCountryClick={handleCountryClick} />
      
      {gameState === 'start' && <StartScreen onStart={startGame} bestScore={bestScore} />}
      
      {gameState === 'result' && <ResultScreen score={score} reason={endReason} bestScore={bestScore} onRestart={startGame} onHome={goHome} />}

      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 pointer-events-none flex flex-col md:flex-row justify-between items-start gap-4 z-10">
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            {/* Botão de Desistir */}
            <button 
              onClick={() => endGame('lives')}
              className="pointer-events-auto w-max flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors backdrop-blur-md"
            >
              <XOctagon size={16} /> DESISTIR
            </button>

            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full md:w-96 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">
                <Target size={14} className="text-dna-neon" /> Destino Alvo
              </div>
              <div className="text-3xl md:text-4xl font-black text-white tracking-wide drop-shadow-md">
                {targetCountry}
              </div>
              
              <div className="h-6 mt-3">
                {feedback && (
                  <div className={`font-black transform transition-all tracking-wide ${feedback.color}`}>
                    {feedback.text}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 w-full md:w-auto justify-end">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-2 text-white shadow-lg pointer-events-auto">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`transition-all duration-300 ${i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-gray-700 scale-75"}`} size={22} />
              ))}
            </div>

            <div className={`bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-3 text-white transition-all duration-500 shadow-lg pointer-events-auto ${timeLeft <= 10 ? 'border-red-500/50 bg-red-900/30' : ''}`}>
              <Timer className={timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-dna-neon'} size={24} />
              <span className={`text-3xl font-mono font-black tracking-tight ${timeLeft <= 10 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ''}`}>
                {timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3 text-white shadow-lg pointer-events-auto">
              <Trophy className="text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" size={24} />
              <span className="text-3xl font-mono font-black tracking-tight">{score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
