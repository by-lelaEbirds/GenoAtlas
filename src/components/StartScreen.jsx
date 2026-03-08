import React from 'react';
import { Crosshair, Zap, Trophy, Earth, Save, Map } from 'lucide-react';
import { MAP_THEMES } from '../App';

export default function StartScreen({ onStart, bestScore, currentTheme, setTheme }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-700/50 p-1 rounded-[2rem] shadow-2xl max-w-2xl w-full mx-4 transform transition-all">
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[1.9rem] p-8 md:p-10">
          
          <div className="flex flex-col items-center mb-6 relative">
            <Earth className="text-blue-400 w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]" strokeWidth={1.2} />
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-widest drop-shadow-sm">
              GEO<span className="text-blue-400">GUESS</span>
            </h1>
          </div>

          {/* Seletor de Tema (A Cura para os Olhos) */}
          <div className="mb-8">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 justify-center"><Map size={14}/> Estilo do Mapa</p>
            <div className="flex justify-center gap-3">
              {Object.values(MAP_THEMES).map(t => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentTheme.id === t.id ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-semibold text-emerald-400/80 bg-emerald-400/10 py-2 px-4 rounded-full w-max mx-auto border border-emerald-400/20">
            <Save size={14} /> O teu recorde é guardado em segurança.
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl">
                <Trophy className="text-amber-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Recorde Atual</p>
                <p className="text-3xl font-black text-white">{bestScore}</p>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="group relative w-full md:w-auto px-12 py-5 bg-blue-500 text-white font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 tracking-wider">INICIAR MISSÃO</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
