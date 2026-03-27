import React from 'react';
import { Target, X, Trophy, Coins, SkipForward, Snowflake } from 'lucide-react';
import { GAME_STATES } from '../constants';

export default function GameHUD({ state, actions }) {
  if (state.studyCard || state.gameState !== GAME_STATES.PLAYING) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pt-[60px] pb-8 md:p-8 md:pt-8 z-20">
      
      <div className="flex justify-between items-start w-full">
        <button onClick={actions.quitGame} className="pointer-events-auto bg-white border-b-4 border-stone-200 p-2.5 md:p-3 rounded-full text-stone-400 hover:text-rose-500 shrink-0 active:translate-y-1 active:border-b-0 transition-all"><X size={20} strokeWidth={3} /></button>
        
        <div className="flex flex-col items-center">
          <div className={`bg-white border-b-4 border-stone-200 px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-4 md:gap-8 pointer-events-auto shadow-lg transition-all duration-300 ${state.timeLeft <= 10 && state.gameMode !== 'study' ? 'border-rose-300 bg-rose-50 scale-105' : ''}`}>
            
            <div className="flex gap-1.5">
              {[...Array(state.gameMode === 'daily' ? 1 : 3)].map((_, i) => (
                <div key={i} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500 ${i < state.lives ? 'bg-rose-500 shadow-inner' : 'bg-stone-200'}`} />
              ))}
            </div>
            
            {state.gameMode !== 'study' && (
              <div className="flex items-center gap-2 font-mono border-l border-r border-stone-200 px-4 md:px-6 relative">
                <span className={`text-2xl md:text-3xl font-black tracking-tighter ${state.freezeTimeLeft > 0 ? 'text-cyan-500 drop-shadow-sm' : state.timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>
                  00:{state.timeLeft.toString().padStart(2, '0')}
                </span>
              </div>
            )}
            
            <div className={`text-2xl md:text-3xl font-mono font-black text-green-600 tracking-tighter flex items-center gap-2 ${state.gameMode === 'study' ? 'ml-4 pl-4 border-l border-stone-200' : ''}`}>
              {state.score.toLocaleString()} <span className="text-stone-400 text-sm md:text-base">PTS</span>
            </div>
          </div>
          
          {state.freezeTimeLeft > 0 && (
             <div className="mt-2 bg-white px-3 py-1 rounded-full border-b-2 border-stone-200 flex items-center gap-2 animate-fade-in-up">
                <Snowflake size={14} className="text-cyan-500 animate-spin-slow"/>
                <div className="w-20 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-1000 ease-linear" style={{ width: `${(state.freezeTimeLeft / 10) * 100}%` }}></div>
                </div>
                <span className="text-cyan-600 font-black text-[10px]">{state.freezeTimeLeft}s</span>
             </div>
          )}
        </div>

        <div className="w-[38px] md:w-[46px] shrink-0" />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto pointer-events-none relative pt-10">
        
        <div className="absolute -left-10 bottom-[90%] -z-10 animate-fade-in">
          <img src="./icon.png" alt="Guia In-Game" className="w-[80px] h-auto drop-shadow-md rotate-[-5deg] scale-110" />
        </div>

        <div className={`w-full px-6 py-5 md:py-6 rounded-3xl flex flex-col items-center transform transition-all relative overflow-hidden group pointer-events-auto border-b-[6px] shadow-lg ${state.streak > 2 ? 'bg-amber-50 border-amber-300 scale-[1.02]' : 'bg-white border-stone-200'}`}>
          
          <div className="w-full flex justify-between items-center mb-1">
            <span className={`text-xs uppercase tracking-[0.2em] font-black flex items-center gap-1.5 ${state.streak > 2 ? 'text-amber-600' : 'text-stone-400'}`}>
              {state.gameMode === 'football' ? <Trophy size={14}/> : <Target size={14} />} 
              {state.gameMode === 'football' ? 'ONDE FICA ESTE CLUBE?' : state.gameMode === 'daily' ? 'DESAFIO DIÁRIO:' : state.gameMode === 'study' ? 'ESTUDAR:' : state.streak > 2 ? 'COMBO QUENTE' : 'ACHE RÁPIDO:'}
            </span>

            <div className="flex gap-2">
              {state.gameMode !== 'study' && state.gameMode !== 'daily' && (
                <>
                  <button onClick={actions.freezeTime} disabled={state.coins < 75 || state.freezeTimeLeft > 0} className={`flex items-center gap-1 bg-stone-100 border-b-2 border-stone-300 px-3 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest active:translate-y-1 active:border-b-0 transition-all z-10 whitespace-nowrap min-w-max ${state.freezeTimeLeft > 0 ? 'text-cyan-600 bg-cyan-50 border-cyan-200' : 'text-stone-500 hover:bg-stone-200 disabled:opacity-50'}`}>
                    <Snowflake size={12}/> {state.freezeTimeLeft > 0 ? 'CONGELADO' : 'CONGELAR'} <span className="text-amber-500 flex items-center ml-1">75 <Coins size={10} className="ml-0.5"/></span>
                  </button>
                  <button onClick={actions.skipCountry} disabled={state.coins < 50} className="flex items-center gap-1 text-stone-500 bg-stone-100 hover:bg-stone-200 border-b-2 border-stone-300 px-3 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest active:translate-y-1 active:border-b-0 disabled:opacity-50 transition-all z-10 whitespace-nowrap min-w-max">
                    <SkipForward size={12}/> PULAR <span className="text-amber-500 flex items-center ml-1">50 <Coins size={10} className="ml-0.5"/></span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {state.gameMode === 'football' && state.targetClub ? (
            <div className="flex flex-col items-center mt-2 w-full">
              <img src={state.targetClub.logo} alt={state.targetClub.name} className="w-16 h-16 object-contain mb-2 drop-shadow-md" />
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-stone-800 text-center leading-tight truncate w-full">{state.targetClub.name}</h2>
            </div>
          ) : (
            <div className="w-full flex justify-center mt-2">
              <h2 className={`text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300 text-center leading-tight truncate ${state.streak > 2 ? 'text-amber-500' : 'text-stone-800'}`}>
                {state.targetCountry?.name || 'Aguarde...'}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
