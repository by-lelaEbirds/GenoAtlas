import React, { useState, useEffect } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import { Play, Timer, Trophy } from 'lucide-react';

// Lista reduzida para testarmos o MVP (depois podemos extrair todos do GeoJSON)
const COUNTRIES_LIST = ["Brazil", "United States of America", "Japan", "Italy", "South Africa", "Australia", "India", "France", "Argentina", "Egypt"];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [targetCountry, setTargetCountry] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Lógica do cronómetro
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    pickNextCountry();
  };

  const pickNextCountry = () => {
    const randomCountry = COUNTRIES_LIST[Math.floor(Math.random() * COUNTRIES_LIST.length)];
    setTargetCountry(randomCountry);
    setFeedback(null);
  };

  const handleCountryClick = (clickedCountry) => {
    if (!isPlaying) return;

    if (clickedCountry === targetCountry) {
      setScore(prev => prev + 100);
      setFeedback({ text: 'CORRETO!', color: 'text-green-400' });
      setTimeout(pickNextCountry, 1000);
    } else {
      setScore(prev => Math.max(0, prev - 20)); // Perde pontos se errar
      setFeedback({ text: `Errou! Esse é: ${clickedCountry}`, color: 'text-red-400' });
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <GlobeVisualizer onCountryClick={handleCountryClick} />
      
      {/* Interface de Utilizador (HUD) */}
      <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex justify-between items-start z-10">
        
        {/* Painel Esquerdo: Jogo e Alvo */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl pointer-events-auto">
          <h1 className="text-3xl font-black text-white tracking-widest mb-4">
            GEO<span className="text-dna-neon">GUESS</span>
          </h1>
          
          {!isPlaying ? (
            <div className="text-center">
              <p className="text-gray-400 mb-6">Encontre o maior número de países em 60 segundos!</p>
              <button 
                onClick={startGame}
                className="w-full py-3 bg-dna-neon text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors"
              >
                <Play size={20} fill="currentColor" /> {timeLeft === 0 ? 'Jogar Novamente' : 'Iniciar Jogo'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-gray-400 uppercase tracking-widest text-sm font-bold">Encontre:</div>
              <div className="text-3xl font-black text-white bg-white/10 py-3 px-6 rounded-xl text-center border border-white/20">
                {targetCountry}
              </div>
              {feedback && (
                <div className={`text-center font-bold animate-pulse ${feedback.color}`}>
                  {feedback.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Painel Direito: Cronómetro e Pontuação */}
        <div className="flex gap-4">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-white">
            <Timer className={timeLeft <= 10 ? 'text-red-500 animate-bounce' : 'text-dna-neon'} />
            <span className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-white">
            <Trophy className="text-yellow-400" />
            <span className="text-3xl font-mono font-bold">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
