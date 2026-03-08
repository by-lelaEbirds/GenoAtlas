import React from 'react';
import { Globe2, Crosshair, Zap, Trophy, Earth } from 'lucide-react';

export default function StartScreen({ onStart, bestScore }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-gradient-to-b from-[#0a0f1c] to-black border border-white/10 p-1 rounded-3xl shadow-[0_0_80px_rgba(0,243,255,0.15)] max-w-2xl w-full mx-4 transform transition-all">
        <div className="bg-[#050505] rounded-[22px] p-8 md:p-12">
          
          <div className="flex flex-col items-center mb-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-dna-neon/20 rounded-full blur-3xl"></div>
            <Earth className="text-dna-neon w-20 h-20 mb-4 relative z-10" strokeWidth={1.5} />
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-dna-neon tracking-widest">
              GEO<span className="text-dna-neon">GUESS</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">O DESAFIO GLOBAL DE GEOGRAFIA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
              <div className="bg-dna-neon/20 p-3 rounded-xl text-dna-neon shrink-0"><Crosshair size={24} /></div>
              <div>
                <h3 className="text-white font-bold mb-1">Precisão</h3>
                <p className="text-gray-400 text-sm">Encontra o país no globo 3D antes que o tempo acabe.</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
              <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400 shrink-0"><Zap size={24} /></div>
              <div>
                <h3 className="text-white font-bold mb-1">Multiplicador</h3>
                <p className="text-gray-400 text-sm">Acertos em menos de 3 segundos valem pontos a dobrar.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
              <div className="bg-black border border-yellow-500/30 p-3 rounded-xl">
                <Trophy className="text-yellow-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Recorde Pessoal</p>
                <p className="text-2xl font-black text-white">{bestScore}</p>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="group relative w-full md:w-auto px-12 py-5 bg-gradient-to-r from-dna-neon to-blue-500 text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,243,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 tracking-wider">INICIAR MISSÃO</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
