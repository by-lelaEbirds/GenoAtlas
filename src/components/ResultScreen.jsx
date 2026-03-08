import React from 'react';
import { Trophy, AlertTriangle, RotateCcw } from 'lucide-react';

export default function ResultScreen({ score, reason, onRestart }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0f1c] border border-dna-neon/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.1)] max-w-lg w-full mx-4 text-center transform transition-all">
        <div className="flex justify-center mb-6">
          {reason === 'lives' ? (
            <AlertTriangle className="text-red-500 w-20 h-20 animate-pulse" />
          ) : (
            <Trophy className="text-yellow-400 w-20 h-20 animate-pulse" />
          )}
        </div>
        
        <h1 className="text-4xl font-black text-white tracking-widest mb-2">
          {reason === 'lives' ? 'FIM DE JOGO!' : 'TEMPO ESGOTADO!'}
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          {reason === 'lives' ? 'Perdeste as tuas 3 vidas.' : 'O teu minuto de exploração acabou.'}
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <p className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Pontuação Final</p>
          <p className="text-6xl font-black text-dna-neon">{score}</p>
        </div>

        <button 
          onClick={onRestart}
          className="group relative w-full py-5 bg-dna-neon text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-3"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 flex items-center gap-2"><RotateCcw size={24} /> JOGAR NOVAMENTE</span>
        </button>
      </div>
    </div>
  );
}
