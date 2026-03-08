import React, { useState } from 'react';
import { Crosshair, Zap, Trophy, Earth, Save, Map, Info, Crown } from 'lucide-react';

export default function StartScreen({ onStart, bestScore, currentTheme, setTheme, themes }) {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-12 md:pt-20 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent">
      <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center transform transition-all">
        
        <div className="flex gap-6 mb-10 border-b border-slate-700/50 justify-center w-full">
          <button onClick={() => setActiveTab('main')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'main' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Missão</button>
          <button onClick={() => setActiveTab('rank')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'rank' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Rank Mundial</button>
          <button onClick={() => setActiveTab('about')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'about' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Sobre</button>
        </div>

        {activeTab === 'main' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center w-full">
            
            <div className="flex flex-col items-center mb-10 relative">
              <Earth className="text-cyan-400 w-16 h-16 mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" strokeWidth={1.5} />
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-widest drop-shadow-lg">
                GEO<span className="text-cyan-400">GUESS</span>
              </h1>
            </div>

            <div className="mb-10 w-full max-w-md bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
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
            
            <div className="flex items-center justify-center gap-2 mt-8 text-xs font-semibold text-emerald-400/80 bg-emerald-400/10 py-2 px-5 rounded-full border border-emerald-400/20 backdrop-blur-sm">
              <Save size={14} /> Progresso guardado na cloud local.
            </div>

          </div>
        )}

        {activeTab === 'rank' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-20 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-700/50 w-full shadow-2xl">
            <Crown className="w-20 h-20 text-amber-400 mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-bounce" />
            <h2 className="text-3xl font-black text-white mb-3 tracking-wider">RANKING GLOBAL</h2>
            <p className="text-slate-300 text-center max-w-sm leading-relaxed">A nossa equipa está a preparar as tabelas de classificação globais. Prepara o teu treino e domina o mapa!</p>
            <div className="mt-8 px-6 py-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full text-sm font-black tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.2)]">EM BREVE</div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 text-slate-300 w-full">
            <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 text-left shadow-2xl">
              <div className="flex items-center gap-3 mb-6 text-cyan-400">
                <Info size={28} />
                <h2 className="text-2xl font-black tracking-wide">Sobre o Projeto</h2>
              </div>
              <p className="text-base leading-relaxed mb-6 font-medium">O GeoGuess é um projeto interativo de alta performance desenvolvido para testar conhecimentos geográficos através de uma engine WebGL 3D otimizada.</p>
              <p className="text-sm leading-relaxed text-slate-400">Construído com foco em usabilidade moderna, adaptabilidade visual e gamificação. O idioma e as nomenclaturas respeitam nativamente o <i>fingerprint</i> do dispositivo do jogador (ex: pt-BR).</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
