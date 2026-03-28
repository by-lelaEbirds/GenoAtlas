import React from 'react';
import { Target, X, Trophy, Coins, SkipForward, Snowflake } from 'lucide-react';
import { GAME_STATES } from '../constants';

export default function GameHUD({ state, actions }) {
  if (state.studyCard || state.gameState !== GAME_STATES.PLAYING) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pt-[60px] pb-8 md:p-8 md:pt-8 z-20 ${state.isShaking ? 'animate-shake' : ''}`}>
      
      <div className="relative flex justify-center items-start w-full">
        <button onClick={actions.quitGame} className="absolute left-0 top-0 pointer-events-auto bg-white border-b-4 border-stone-200 p-2.5 md:p-3 rounded-full text-stone-400 hover:text-rose-500 shrink-0 active:translate-y-1 active:border-b-0 transition-all z-10">
          <X size={20} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col items-center w-full px-12 md:px-16">
          <div className={`bg-white border-b-4 border-stone-200 px-3 md:px-6 py-2 md:py-3 rounded-full flex items-center justify-center gap-2 md:gap-8 pointer-events-auto shadow-lg transition-all duration-300 w-full max-w-fit ${state.timeLeft <= 10 && state.gameMode !== 'study' ? 'border-rose-300 bg-rose-50 scale-105' : ''}`}>
            
            <div className="flex gap-1 md:gap-1.5 shrink-0">
              {[...Array(state.gameMode === 'daily' ? 1 : 3)].map((_, i) => (
                <div key={i} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500 ${i < state.lives ? 'bg-rose-500 shadow-inner' : 'bg-stone-200'}`} />
              ))}
            </div>
            
            {state.gameMode !== 'study' && (
              <div className="flex items-center gap-1 md:gap-2 font-mono border-l border-r border-stone-200 px-2 md:px-6 relative shrink-0">
                <span className={`text-xl md:text-3xl font-black tracking-tighter ${state.freezeTimeLeft > 0 ? 'text-cyan-500 drop-shadow-sm' : state.timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>
                  00:{state.timeLeft.toString().padStart(2, '0')}
                </span>
              </div>
            )}
            
            <div className={`text-xl md:text-3xl font-mono font-black text-green-600 tracking-tighter flex items-center gap-1 md:gap-2 shrink-0 ${state.gameMode === 'study' ? 'ml-2 pl-2 md:ml-4 md:pl-4 border-l border-stone-200' : ''}`}>
              {state.score.toLocaleString()} <span className="text-stone-400 text-xs md:text-base hidden sm:inline-block">PTS</span>
            </div>
          </div>
          
          {state.freezeTimeLeft > 0 && (
             <div className="mt-2 bg-white px-3 py-1 rounded-full border-b-2 border-stone-200 flex items-center gap-2 animate-fade-in-up pointer-events-auto">
                <Snowflake size={14} className="text-cyan-500 animate-spin-slow"/>
                <div className="w-20 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-1000 ease-linear" style={{ width: `${(state.freezeTimeLeft / 10) * 100}%` }}></div>
                </div>
                <span className="text-cyan-600 font-black text-[10px]">{state.freezeTimeLeft}s</span>
             </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto pointer-events-none relative pt-10">
        <div className={`w-full px-4 py-4 md:px-6 md:py-6 rounded-3xl flex flex-col items-center transform transition-all relative overflow-hidden group pointer-events-auto border-b-[6px] shadow-lg ${state.streak > 2 ? 'bg-amber-50 border-amber-300 scale-[1.02]' : 'bg-white border-stone-200'}`}>
          
          <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end mb-2 gap-3 sm:gap-1">
            <span className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black flex items-center gap-1.5 ${state.streak > 2 ? 'text-amber-600' : 'text-stone-400'}`}>
              {state.gameMode === 'football' ? <Trophy size={14}/> : <Target size={14} />} 
              {state.gameMode === 'football' ? 'ONDE FICA ESTE CLUBE?' : state.gameMode === 'daily' ? 'DESAFIO DIÁRIO:' : state.gameMode === 'study' ? 'ESTUDAR:' : state.streak > 2 ? 'COMBO QUENTE' : 'ACHE RÁPIDO:'}
            </span>

            <div className="flex gap-2 w-full sm:w-auto justify-center">
              {state.gameMode !== 'study' && state.gameMode !== 'daily' && (
                <>
                  <button onClick={actions.freezeTime} disabled={state.coins < 75 || state.freezeTimeLeft > 0} className={`flex-1 sm:flex-none justify-center flex items-center gap-1 bg-stone-100 border-b-2 border-stone-300 px-3 py-2.5 sm:py-2 rounded-xl text-xs uppercase font-black tracking-widest active:translate-y-1 active:border-b-0 transition-all z-10 whitespace-nowrap ${state.freezeTimeLeft > 0 ? 'text-cyan-600 bg-cyan-50 border-cyan-200' : 'text-stone-500 hover:bg-stone-200 disabled:opacity-50'}`}>
                    <Snowflake size={14} className="sm:w-3 sm:h-3"/> {state.freezeTimeLeft > 0 ? 'CONGELADO' : 'CONGELAR'} <span className="text-amber-500 flex items-center ml-1">75 <Coins size={12} className="ml-0.5 sm:w-2.5 sm:h-2.5"/></span>
                  </button>
                  <button onClick={actions.skipCountry} disabled={state.coins < 50} className="flex-1 sm:flex-none justify-center flex items-center gap-1 text-stone-500 bg-stone-100 hover:bg-stone-200 border-b-2 border-stone-300 px-3 py-2.5 sm:py-2 rounded-xl text-xs uppercase font-black tracking-widest active:translate-y-1 active:border-b-0 disabled:opacity-50 transition-all z-10 whitespace-nowrap">
                    <SkipForward size={14} className="sm:w-3 sm:h-3"/> PULAR <span className="text-amber-500 flex items-center ml-1">50 <Coins size={12} className="ml-0.5 sm:w-2.5 sm:h-2.5"/></span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {state.gameMode === 'football' && state.targetClub ? (
            <div className="flex flex-col items-center mt-1 w-full">
              <img src={state.targetClub.logo} alt={state.targetClub.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2 drop-shadow-md" />
              <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-stone-800 text-center leading-tight truncate w-full">{state.targetClub.name}</h2>
            </div>
          ) : (
            <div className="w-full flex justify-center mt-1">
              <h2 className={`text-3xl sm:text-5xl font-black tracking-tighter transition-all duration-300 text-center leading-tight truncate px-2 ${state.streak > 2 ? 'text-amber-500' : 'text-stone-800'}`}>
                {state.targetCountry?.name || 'Aguarde...'}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
