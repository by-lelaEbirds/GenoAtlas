import React from 'react';
import { Crosshair, Zap, Trophy, Earth, Save } from 'lucide-react';

export default function StartScreen({ onStart, bestScore }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="bg-gradient-to-b from-gray-900/90 to-black border border-white/10 p-1 rounded-[2rem] shadow-[0_0_80px_rgba(0,243,255,0.15)] max-w-2xl w-full mx-4 transform transition-all">
        <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-[1.9rem] p-8 md:p-12">
          
          <div className="flex flex-col items-center mb-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-dna-neon/10 rounded-full blur-3xl"></div>
            <Earth className="text-dna-neon w-20 h-20 mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" strokeWidth={1.2} />
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-dna-neon tracking-widest drop-shadow-sm">
              GEO<span className="text-dna-neon">GUESS</span>
            </h1>
            <p className="text-gray-400 mt-3 font-medium tracking-widest text-sm uppercase">O Desafio Global de Geografia</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-semibold text-dna-neon/70 bg-dna-neon/5 py-2 px-4 rounded-full w-max mx-auto border border-dna-neon/10">
            <Save size={14} /> O teu recorde é guardado automaticamente neste navegador.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-all duration-300">
              <div className="bg-dna-neon/10 p-3 rounded-xl text-dna-neon shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.2)]"><Crosshair size={24} /></div>
              <div>
                <h3 className="text-white font-bold mb-1">Precisão</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Encontra o país no globo 3D antes que o tempo acabe.</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-all duration-300">
              <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-400 shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.2)]"><Zap size={24} /></div>
              <div>
                <h3 className="text-white font-bold mb-1">Multiplicador</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Acertos em menos de 3 segundos valem pontos a dobrar.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <div className="bg-black border border-yellow-500/30 p-4 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <Trophy className="text-yellow-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Recorde Atual</p>
                <p className="text-3xl font-black text-white">{bestScore}</p>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="group relative w-full md:w-auto px-12 py-5 bg-gradient-to-r from-dna-neon to-blue-400 text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,243,255,0.3)] hover:shadow-[0_0_60px_rgba(0,243,255,0.5)]"
            >
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 tracking-wider">INICIAR MISSÃO</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
