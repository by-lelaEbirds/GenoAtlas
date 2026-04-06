import React from 'react';
import { X } from 'lucide-react';

const REGIONS = [
  { id: 'Americas', label: 'Americas', tone: 'emerald' },
  { id: 'Europe', label: 'Europa', tone: 'indigo' },
  { id: 'Asia', label: 'Asia', tone: 'rose' },
  { id: 'Africa', label: 'Africa', tone: 'amber' },
];

function getRegionClasses(tone, isDarkMode) {
  if (isDarkMode) {
    switch (tone) {
      case 'emerald':
        return 'glass-panel border-emerald-500/20 hover:border-emerald-400/50 hover:neon-glow-emerald';
      case 'indigo':
        return 'glass-panel border-indigo-500/20 hover:border-indigo-400/50 hover:neon-glow-fuchsia';
      case 'rose':
        return 'glass-panel border-rose-500/20 hover:border-rose-400/50 hover:neon-glow-rose';
      default:
        return 'glass-panel border-amber-500/20 hover:border-amber-400/50 hover:neon-glow-amber';
    }
  }

  switch (tone) {
    case 'emerald':
      return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:shadow-md';
    case 'indigo':
      return 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:shadow-md';
    case 'rose':
      return 'bg-rose-50 border-rose-200 hover:bg-rose-100 hover:shadow-md';
    default:
      return 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:shadow-md';
  }
}

export default function RegionModal({ showRegionModal, isClosingRegion, closeRegionModal, handleRegionSelect, isDarkMode }) {
  if (!showRegionModal) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:px-6 ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} backdrop-blur-md ${isClosingRegion ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div role="dialog" aria-label="Menu de selecao de regiao" className={`${isDarkMode ? 'glass-panel neon-glow-cyan' : 'glass-panel-light shadow-2xl'} relative flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-[2.5rem] p-6 md:max-h-[90dvh] md:rounded-[4rem] md:p-12 ${isClosingRegion ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        <div className="mb-6 flex items-center justify-between md:mb-8 shrink-0">
          <h2 className={`text-[32px] font-black uppercase tracking-tighter leading-none md:text-[48px] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
            Onde Pousar?
          </h2>
          <button aria-label="Fechar modal de regiao" onClick={closeRegionModal} className={`rounded-full border-2 p-3 transition-all active:scale-95 md:p-4 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-rose-400' : 'bg-stone-100 border-transparent text-stone-400 hover:bg-rose-100 hover:text-rose-500'}`}>
            <X className="h-6 w-6 md:h-10 md:w-10" strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pb-4 pr-1 md:gap-6 md:pr-2">
          <button
            onClick={() => handleRegionSelect('all')}
            className={`group col-span-2 relative overflow-hidden rounded-[1.5rem] border p-4 transition-all active:scale-95 md:rounded-[2.5rem] md:p-8 ${isDarkMode ? 'glass-panel border-cyan-500/30 neon-glow-cyan hover:bg-white/10' : 'bg-gradient-to-r from-sky-400 to-sky-500 border-sky-300 shadow-lg hover:shadow-xl'}`}
          >
            <div className="absolute inset-0 -translate-x-[150%] animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            <div className="relative z-10 flex flex-col items-center gap-2 md:gap-3">
              <span className="text-[12px] font-black uppercase tracking-[0.28em] text-white/80 md:text-[13px]">Rota Livre</span>
              <span className="text-[22px] font-black uppercase tracking-[0.16em] text-white md:text-[34px]">Mundo Todo</span>
            </div>
          </button>

          {REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              className={`group rounded-[1.5rem] border p-4 transition-all active:scale-95 md:rounded-[2.5rem] md:p-6 ${getRegionClasses(region.tone, isDarkMode)}`}
            >
              <div className="flex min-h-[112px] flex-col items-center justify-center gap-3 text-center md:min-h-[136px] md:gap-4">
                <span className={`h-3 w-3 rounded-full ${region.tone === 'emerald' ? 'bg-emerald-400' : region.tone === 'indigo' ? 'bg-indigo-400' : region.tone === 'rose' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                <span className={`text-[16px] font-black uppercase tracking-[0.18em] md:text-[22px] ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                  {region.label}
                </span>
              </div>
            </button>
          ))}

          <button
            onClick={() => handleRegionSelect('Oceania')}
            className={`group col-span-2 rounded-[1.5rem] border p-4 transition-all active:scale-95 md:rounded-[2.5rem] md:p-8 ${isDarkMode ? 'glass-panel border-cyan-500/20 hover:border-cyan-400/50 hover:neon-glow-cyan' : 'bg-teal-50 border-teal-200 hover:bg-teal-100 hover:shadow-md'}`}
          >
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <span className="h-3 w-3 rounded-full bg-teal-400" />
              <span className={`text-[20px] font-black uppercase tracking-[0.16em] md:text-[32px] ${isDarkMode ? 'text-teal-300' : 'text-teal-800'}`}>
                Oceania
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
