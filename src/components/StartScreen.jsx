import React, { useState } from 'react';
import { Trophy, Earth, Save, Map, Info, Crown, Globe2 } from 'lucide-react';

export const GAME_REGIONS = [
  { id: 'all', name: '🌍 Global' },
  { id: 'Europe', name: '🏰 Europa' },
  { id: 'Americas', name: '🌎 Américas' },
  { id: 'Asia', name: '⛩️ Ásia' },
  { id: 'Africa', name: '🦁 África' },
  { id: 'Oceania', name: '🦘 Oceania' }
];

export default function StartScreen({ onStart, bestScore, currentTheme, setTheme, themes, activeRegion, setRegion }) {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-12 md:pt-16 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent">
      <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center transform transition-all">
        
        <div className="flex gap-6 mb-8 border-b border-slate-700/50 justify-center w-full">
          <button onClick={() => setActiveTab('main')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'main' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Missão</button>
          <button onClick={() => setActiveTab('rank')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'rank' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Rank Mundial</button>
          <button onClick={() => setActiveTab('about')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'about' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Sobre</button>
        </div>

        {activeTab === 'main' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center w-full">
            
            <div className="flex flex-col items-center mb-6 relative">
              <Earth className="text-cyan-400 w-14 h-14 mb-3 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" strokeWidth={1.5} />
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-widest drop-shadow-lg">
                GEO<span className="text-cyan-400">GUESS</span>
              </h1>
            </div>

            {/* NOVA ZONA: SELEÇÃO DE CONTINENTES */}
            <div className="mb-6 w-full max-w-lg bg-slate-900/60 backdrop-blur-md p-5 rounded-3xl border border-slate-700/50 shadow-xl">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <Globe2 size={14}/> Área de Exploração
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {GAME_REGIONS.map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeRegion === r.id ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SELEÇÃO DE MAPAS */}
            <div className="mb-8 w-full max-w-lg bg-slate-900/60 backdrop-blur-md p-5 rounded-3xl border border-slate-700/50 shadow-xl">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <Map size={14}/> Estilo do Mapa
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.values(themes).map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${currentTheme.id === t.id ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full mt-2">
              <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-amber-500/20 shadow-xl">
                <Trophy className="text-amber-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                <div className="text-left">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Recorde Pessoal</p>
                  <p className="text-2xl font-black text-white">{bestScore}</p>
                </div>
              </div>

              <button 
                onClick={onStart}
                className="group relative px-12 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(34,211,238,0.4)]"
              >
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 tracking-wider">INICIAR MISSÃO</span>
              </button>
            </div>

          </div>
        )}

        {activeTab === 'rank' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-20 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-700/50 w-full shadow-2xl">
            <Crown className="w-20 h-20 text-amber-400 mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-bounce" />
            <h2 className="text-3xl font-black text-white mb-3 tracking-wider">RANKING GLOBAL</h2>
            <p className="text-slate-300 text-center max-w-sm leading-relaxed">As tabelas de classificação globais chegam em breve.</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 text-slate-300 w-full">
            <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 text-left shadow-2xl">
              <div className="flex items-center gap-3 mb-6 text-cyan-400">
                <Info size={28} />
                <h2 className="text-2xl font-black tracking-wide">Sobre o Projeto</h2>
              </div>
              <p className="text-base leading-relaxed mb-6 font-medium">O GeoGuess 3D testa conhecimentos geográficos através de uma engine WebGL de alta performance, agora com mecânicas de Time Attack.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
