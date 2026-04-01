import React from 'react';
import { X } from 'lucide-react';

export default function RegionModal({ showRegionModal, isClosingRegion, closeRegionModal, handleRegionSelect, isDarkMode }) {
  if (!showRegionModal) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} backdrop-blur-md px-4 md:px-6 py-6 ${isClosingRegion ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div role="dialog" aria-label="Menu de Seleção de Região" className={`${isDarkMode ? 'glass-panel neon-glow-cyan' : 'glass-panel-light shadow-2xl'} p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative flex flex-col max-h-[85dvh] md:max-h-[90dvh] ${isClosingRegion ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        
        <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
          <h2 className={`text-[32px] md:text-[48px] font-black uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-sky-900'}`}>Onde Pousar?</h2>
          <button aria-label="Fechar Modal de Região" onClick={closeRegionModal} className={`p-3 md:p-4 rounded-full transition-all active:scale-95 border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-rose-400' : 'bg-stone-100 border-transparent text-stone-400 hover:bg-rose-100 hover:text-rose-500'}`}>
            <X className="w-6 h-6 md:w-10 md:h-10" strokeWidth={3} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:gap-6 overflow-y-auto custom-scrollbar pb-4 pr-1 md:pr-2">
          <button onClick={() => handleRegionSelect('all')} className={`col-span-2 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center justify-center gap-3 md:gap-6 transition-all active:scale-95 relative overflow-hidden group border ${isDarkMode ? 'glass-panel border-cyan-500/30 neon-glow-cyan hover:bg-white/10' : 'bg-gradient-to-r from-sky-400 to-sky-500 border-sky-300 shadow-lg hover:shadow-xl'}`}>
            <div className="absolute inset-0 -translate-x-[150%] animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-0"></div>
            <span aria-hidden="true" className="text-[40px] md:text-[64px] leading-none drop-shadow-md relative z-10">🌍</span>
            <span className="text-[20px] md:text-[32px] font-black text-white uppercase tracking-widest mt-1 md:mt-2 drop-shadow-sm relative z-10">Mundo Todo</span>
          </button>
          
          <button onClick={() => handleRegionSelect('Americas')} className={`rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 transition-all active:scale-95 relative overflow-hidden group border ${isDarkMode ? 'glass-panel border-emerald-500/20 hover:neon-glow-emerald hover:border-emerald-400/50' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 shadow-sm hover:shadow-md'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
            <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">🌎</span>
            <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Américas</span>
          </button>

          <button onClick={() => handleRegionSelect('Europe')} className={`rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 transition-all active:scale-95 relative overflow-hidden group border ${isDarkMode ? 'glass-panel border-indigo-500/20 hover:neon-glow-fuchsia hover:border-indigo-400/50' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-sm hover:shadow-md'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
            <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">🏰</span>
            <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>Europa</span>
          </button>
          
          <button onClick={() => handleRegionSelect('Asia')} className={`rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 transition-all active:scale-95 relative overflow-hidden group border ${isDarkMode ? 'glass-panel border-rose-500/20 hover:neon-glow-rose hover:border-rose-400/50' : 'bg-rose-50 border-rose-200 hover:bg-rose-100 shadow-sm hover:shadow-md'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
            <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">⛩️</span>
            <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-rose-300' : 'text-rose-800'}`}>Ásia</span>
          </button>

          <button onClick={() => handleRegionSelect('Africa')} className={`rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 transition-all active:scale-95 relative overflow-hidden group border ${isDarkMode ? 'glass-panel border-amber-500/20 hover:neon-glow-amber hover:border-amber-400/50' : 'bg-amber-50 border-amber-200 hover:bg-amber-100 shadow-sm hover:shadow-md'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
            <span aria-hidden="true" className="text-[36px] md:text-[56px] leading-none drop-shadow-sm relative z-10">🦁</span>
            <span className={`text-[14px] md:text-[20px] font-black uppercase tracking-widest relative z-10 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>África</span>
          </button>

          <button onClick={() => handleRegionSelect('Oceania')} className={`col-span-2 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center justify-center gap-3 md:gap-6 transition-all active:scale-95 mt-1 md:mt-2 relative overflow-hidden group border ${isDarkMode ? 'glass-panel border-cyan-500/20 hover:neon-glow-cyan hover:border-cyan-400/50' : 'bg-teal-50 border-teal-200 hover:bg-teal-100 shadow-sm hover:shadow-md'}`}>
            <div className="absolute inset-0 -translate-x-[150%] group-hover:animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
            <span aria-hidden="true" className="text-[40px] md:text-[64px] leading-none drop-shadow-sm relative z-10">🦘</span>
            <span className={`text-[20px] md:text-[32px] font-black uppercase tracking-widest mt-1 md:mt-2 relative z-10 ${isDarkMode ? 'text-teal-300' : 'text-teal-800'}`}>Oceania</span>
          </button>
        </div>
      </div>
    </div>
  );
}
