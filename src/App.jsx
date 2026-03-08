import React, { useState, useEffect, useCallback } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import { Timer, Trophy, Target, Heart } from 'lucide-react';

export default function App() {
  const [geoData, setGeoData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'result'
  const [endReason, setEndReason] = useState(''); // 'time', 'lives'
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [targetCountry, setTargetCountry] = useState('');
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [targetStartTime, setTargetStartTime] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoData(data.features);
        const names = data.features.map(f => f.properties.ADMIN);
        setAllCountries(names);
      });
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('result');
      setEndReason('time');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setLives(3);
    setRemainingCountries([...allCountries]);
    setGameState('playing');
    pickNextCountry([...allCountries]);
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
        if (newLives <= 0) {
          setGameState('result');
          setEndReason('lives');
        }
        return newLives;
      });
      setFeedback({ text: `❌ Errou! Esse é: ${clickedCountry}`, color: 'text-red-500' });
    }
  }, [gameState, targetCountry, targetStartTime, remainingCountries]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <GlobeVisualizer geoData={geoData} onCountryClick={handleCountryClick} />
      
      {gameState === 'start' && <StartScreen onStart={startGame} />}
      
      {gameState === 'result' && <ResultScreen score={score} reason={endReason} onRestart={startGame} />}

      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex justify-between items-start z-10">
          
          <div className="bg-black/70 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">
              <Target size={14} className="text-dna-neon" /> Destino Alvo
            </div>
            <div className="text-3xl font-black text-white tracking-wide">
              {targetCountry}
            </div>
            
            <div className="h-6 mt-2">
              {feedback && (
                <div className={`font-black transform transition-all ${feedback.color}`}>
                  {feedback.text}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-black/70 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3 text-white">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={i < lives ? "text-red-500 fill-red-500" : "text-gray-600"} size={24} />
              ))}
            </div>

            <div className={`bg-black/70 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-white transition-colors ${timeLeft <= 10 ? 'border-red-500/50 bg-red-900/20' : ''}`}>
              <Timer className={timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-dna-neon'} />
              <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
                00:{timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="bg-black/70 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-white">
              <Trophy className="text-yellow-400" />
              <span className="text-3xl font-mono font-bold">{score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
