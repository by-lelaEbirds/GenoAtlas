import React from 'react';
import { Globe2, Crosshair, Zap } from 'lucide-react';

export default function StartScreen({ onStart }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0f1c] border border-dna-neon/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.1)] max-w-lg w-full mx-4 text-center transform transition-all">
        <div className="flex justify-center mb-6">
          <Globe2 className="text-dna-neon w-20 h-20 animate-pulse" strokeWidth={1} />
        </div>
        
        <h1 className="text-5xl font-black text-white tracking-widest mb-2">
          GEO<span className="text-dna-neon">GUESS</span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">Consegues dominar o mapa-múndi?</p>

        <div className="space-y-6 text-left mb-10 bg-white/5 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4 text-gray-300">
            <div className="bg-dna-neon/20 p-3 rounded-xl text-dna-neon"><Crosshair size={24} /></div>
            <p>Encontra o país indicado no topo do ecrã.</p>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400"><Zap size={24} /></div>
            <p>Acertos rápidos valem o <b>dobro de pontos</b>!</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="group relative w-full py-5 bg-dna-neon text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10">INICIAR EXPLORAÇÃO (60s)</span>
        </button>
      </div>
    </div>
  );
}
