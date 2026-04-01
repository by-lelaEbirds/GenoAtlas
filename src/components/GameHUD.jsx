import React from 'react';
import { Target, X, Trophy, Coins, SkipForward, Snowflake } from 'lucide-react';
import { GAME_STATES } from '../constants';

export default function GameHUD({ state, actions, isDarkMode }) {
  if (state.studyCard || state.gameState !== GAME_STATES.PLAYING) return null;

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const powerUps = state.powerUps || {};
  const extraLives = powerUps.extraLife || 0;
  const discountLevel = powerUps.discount || 0;
  
  const baseMaxLives = state.gameMode === 'daily' ? 1 : 3;
  const totalMaxLives = baseMaxLives + extraLives;
  const skipCost = 50 - (discountLevel * 5); 

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-8 md:p-8 md:pt-[calc(1.5rem+env(safe-area-inset-top))] z-20 ${state.isShaking ? 'animate-shake' : ''}`}>
      
      <div className="relative flex justify-center items-start w-full">
        <div className="absolute left-0 top-0 h-full flex items-start z-10 pt-1">
          <button aria-label="Sair do Jogo e Voltar ao Menu" onClick={actions.quitGame} className={`pointer-events-auto p-2.5 md:p-3 rounded-full shrink-0 transition-all border ${isDarkMode ? 'glass-panel hover:text-rose-400' : 'glass-panel-light hover:text-rose-500'}`}>
            <X size={20} className={isDarkMode ? 'text-white' : 'text-stone-800'} strokeWidth={3} />
          </button>
        </div>
        
        <div className="flex flex-col items-center w-full px-12 md:px-16" role="status" aria-live="polite">
          <div className={`px-4 md:px-8 py-2 md:py-3 rounded-[2rem] flex items-center justify-center gap-4 md:gap-8 pointer-events-auto transition-all duration-300 w-full max-w-fit shadow-2xl ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-stone-200'} ${state.timeLeft <= 10 && state.gameMode !== 'study' ? (isDarkMode ? 'neon-glow-rose ring-2 ring-rose-500/50 scale-105' : 'ring-2 ring-rose-400 bg-rose-50 scale-105') : ''}`}>
            
            <div aria-label={`${state.lives} Vidas Restantes`} className="flex gap-1 md:gap-2 shrink-0">
              {[...Array(totalMaxLives)].map((_, i) => (
                <div key={i} className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-500 shadow-inner ${i < state.lives ? (isDarkMode ? 'bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.8)]' : 'bg-rose-500 shadow-md') : (isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-stone-200 border border-stone-300')}`} />
              ))}
            </div>
            
            {state.gameMode !== 'study' && (
              <div className={`flex items-center gap-1 md:gap-2 font-mono border-l border-r px-4 md:px-8 relative shrink-0 ${isDarkMode ? 'border-white/10' : 'border-stone-200'}`}>
                <span aria-label={`Tempo restante: ${state.timeLeft} segundos`} className={`text-2xl md:text-3xl font-black tracking-tighter ${state.freezeTimeLeft > 0 ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : state.timeLeft <= 10 ? 'text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : (isDarkMode ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-amber-500 drop-shadow-sm')}`}>
                  {formatTime(state.timeLeft)}
                </span>
              </div>
            )}
            
            <div aria-label={`Pontuação atual: ${state.score}`} className={`text-xl md:text-3xl font-mono font-black tracking-tighter flex items-center gap-1 md:gap-2 shrink-0 ${isDarkMode ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'text-green-600'} ${state.gameMode === 'study' ? `ml-2 pl-2 md:ml-4 md:pl-4 border-l ${isDarkMode ? 'border-slate-700' : 'border-stone-200'}` : ''}`}>
              {state.score.toLocaleString()} <span aria-hidden="true" className={`text-xs md:text-base hidden sm:inline-block ${isDarkMode ? 'text-slate-500' : 'text-stone-400'}`}>PTS</span>
            </div>
          </div>
          
          {state.freezeTimeLeft > 0 && (
             <div aria-label="Tempo Congelado Ativo" className={`mt-3 px-4 py-1.5 rounded-full flex items-center gap-2 animate-fade-in-up pointer-events-auto ${isDarkMode ? 'glass-panel border-cyan-500/30 neon-glow-cyan' : 'glass-panel-light border-cyan-200 shadow-lg'}`}>
                <Snowflake size={14} className="text-cyan-400 animate-spin-slow drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]"/>
                <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-stone-200'}`}>
                  <div className="h-full bg-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_8px_#22d3ee]" style={{ width: `${(state.freezeTimeLeft / (10 + (powerUps.freezeTime || 0) * 2)) * 100}%` }}></div>
                </div>
                <span className={`font-black text-[11px] ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>{state.freezeTimeLeft}s</span>
             </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto pointer-events-none relative pt-10">
        <div className={`w-full px-5 py-5 md:px-8 md:py-8 rounded-[2.5rem] flex flex-col items-center transform transition-all relative overflow-hidden group pointer-events-auto ${state.streak > 2 ? (isDarkMode ? 'glass-panel neon-glow-amber scale-[1.02] border border-amber-500/40' : 'glass-panel-light ring-4 ring-amber-300 scale-[1.02]') : (isDarkMode ? 'glass-panel' : 'glass-panel-light shadow-2xl')}`}>
          
          <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end mb-2 gap-3 sm:gap-1">
            <span aria-live="assertive" className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black flex items-center gap-1.5 text-center w-full sm:w-auto justify-center ${state.streak > 2 ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') : (isDarkMode ? 'text-slate-400' : 'text-stone-400')}`}>
              {state.gameMode === 'football' ? <Trophy size={14}/> : <Target size={14} />} 
              {state.gameMode === 'football' ? 'ONDE FICA ESTE CLUBE?' : state.gameMode === 'daily' ? 'DESAFIO DIÁRIO:' : state.gameMode === 'study' ? 'ESTUDAR:' : state.streak > 2 ? 'COMBO QUENTE' : 'ACHE RÁPIDO:'}
            </span>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
              {state.gameMode !== 'study' && state.gameMode !== 'daily' && (
                <>
                  <button 
                    aria-label={`Congelar tempo. Custo: 75 moedas.`} 
                    aria-pressed={state.freezeTimeLeft > 0}
                    onClick={actions.freezeTime} 
                    disabled={state.coins < 75 || state.freezeTimeLeft > 0} 
                    className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-[1rem] text-[10px] sm:text-xs uppercase font-black tracking-widest transition-all z-10 whitespace-nowrap border border-transparent ${state.freezeTimeLeft > 0 ? (isDarkMode ? 'text-cyan-300 bg-cyan-950/50 border-cyan-800' : 'text-cyan-600 bg-cyan-50 border-cyan-200') : (isDarkMode ? 'text-slate-300 glass-panel hover:bg-white/10 hover:border-cyan-500/30 hover:neon-glow-cyan disabled:opacity-50' : 'text-stone-600 glass-panel-light hover:bg-slate-100 disabled:opacity-50')}`}
                  >
                    <Snowflake size={14} className="sm:w-3.5 sm:h-3.5 shrink-0"/> {state.freezeTimeLeft > 0 ? 'CONGELADO' : 'CONGELAR'} <span className="text-amber-500 flex items-center ml-1">75 <Coins size={12} className="ml-0.5 shrink-0"/></span>
                  </button>

                  <button 
                    aria-label={`Pular país. Custo: ${skipCost} moedas.`}
                    onClick={actions.skipCountry} 
                    disabled={state.coins < skipCost} 
                    className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-[1rem] text-[10px] sm:text-xs uppercase font-black tracking-widest disabled:opacity-50 transition-all z-10 whitespace-nowrap border border-transparent ${isDarkMode ? 'text-slate-300 glass-panel hover:bg-white/10 hover:border-slate-500/30' : 'text-stone-600 glass-panel-light hover:bg-slate-100'}`}
                  >
                    <SkipForward size={14} className="sm:w-3.5 sm:h-3.5 shrink-0"/> PULAR <span className="text-amber-500 flex items-center ml-1">{skipCost} <Coins size={12} className="ml-0.5 shrink-0"/></span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {state.gameMode === 'football' && state.targetClub ? (
            <div className="flex flex-col items-center mt-1 w-full" aria-live="assertive">
              <img aria-hidden="true" src={state.targetClub.logo} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2 drop-shadow-md" />
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tighter text-center leading-tight line-clamp-2 text-balance w-full px-1 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{state.targetClub.name}</h2>
            </div>
          ) : (
            <div className="w-full flex justify-center mt-1" aria-live="assertive">
              <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter transition-all duration-300 text-center leading-tight line-clamp-2 text-balance px-2 w-full ${state.streak > 2 ? (isDarkMode ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-amber-500') : (isDarkMode ? 'text-white' : 'text-stone-800')}`}>
                {state.targetCountry?.name || 'Aguarde...'}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
