import React, { useState } from 'react';
import { Crosshair, Zap, Trophy, Earth, Save, Map, Info, Crown } from 'lucide-react';
import { MAP_THEMES } from '../App';

export default function StartScreen({ onStart, bestScore, currentTheme, setTheme }) {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-start bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent">
      <div className="w-full max-w-xl pl-8 md:pl-16 transform transition-all">
        
        <div className="flex gap-6 mb-8 border-b border-slate-800">
          <button onClick={() => setActiveTab('main')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'main' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Missão</button>
          <button onClick={() => setActiveTab('rank')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'rank' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Rank Mundial</button>
          <button onClick={() => setActiveTab('about')} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'about' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Sobre</button>
        </div>

        {activeTab === 'main' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex flex-col items-start mb-10 relative">
              <Earth className="text-blue-400 w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]" strokeWidth={1.5} />
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-widest drop-shadow-sm">
                GEO<span className="text-blue-400">GUESS</span>
              </h1>
            </div>

            <div className="mb-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><Map size={14}/> Estilo do Mapa</p>
              <div className="flex gap-3">
                {Object.values(MAP_THEMES).map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme.id === t.id ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-10 text-xs font-semibold text-emerald-400/80 bg-emerald-400/5 py-2 px-4 rounded-full w-max border border-emerald-400/10">
              <Save size={14} /> Progresso e recordes guardados no navegador.
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <button 
                onClick={onStart}
                className="group relative w-full md:w-auto px-10 py-4 bg-blue-500 text-white font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 tracking-wider">INICIAR MISSÃO</span>
              </button>
              
              <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                <Trophy className="text-amber-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                <div className="text-left">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Recorde</p>
                  <p className="text-2xl font-black text-white">{bestScore}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rank' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
            <Crown className="w-16 h-16 text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-bounce" />
            <h2 className="text-2xl font-black text-white mb-2">RANKING GLOBAL</h2>
            <p className="text-slate-400 text-center max-w-xs">A nossa equipa está a preparar as tabelas de classificação globais. Prepara o teu treino!</p>
            <div className="mt-6 px-4 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold tracking-widest">EM BREVE</div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6 text-slate-300">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-3 mb-4 text-blue-400"><Info size={24} /><h2 className="text-xl font-black">Sobre o Projeto</h2></div>
              <p className="text-sm leading-relaxed mb-4">O GenoAtlas é um projeto interativo desenvolvido para testar os teus conhecimentos geográficos com uma engine WebGL de alta performance.</p>
              <p className="text-sm leading-relaxed text-slate-400">Foi construído com foco em UX moderna, otimização de renderização e acessibilidade visual. O idioma base respeita a configuração do sistema do utilizador (pt-BR).</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex items-center gap-3"><Crosshair className="text-dna-neon" size={20}/> <span className="text-xs font-bold">Modo 60 Segundos</span></div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex items-center gap-3"><Zap className="text-yellow-400" size={20}/> <span className="text-xs font-bold">Mult. de Velocidade</span></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
