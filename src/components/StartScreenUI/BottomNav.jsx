import React from 'react';
import { Home, Settings, ShoppingCart, Trophy } from 'lucide-react';

export default function BottomNav({ onOpenAchievements, onOpenSettings, setShowShop, isDarkMode }) {
  return (
    <nav aria-label="Navegacao Principal" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] md:px-8">
      <div className={`pointer-events-auto mx-auto flex w-full max-w-md items-center justify-between rounded-[2rem] border px-2 py-2.5 shadow-[0_24px_50px_rgba(15,23,42,0.18)] md:max-w-xl md:px-3 md:py-3 ${
        isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white/80'
      }`}>
        <button type="button" aria-label="Tela inicial atual" aria-current="page" disabled className={`group flex min-w-0 flex-1 flex-col items-center justify-center transition-all ${isDarkMode ? 'text-cyan-300' : 'text-sky-500'}`}>
          <div className={`mb-1.5 rounded-[1.2rem] p-2.5 transition-all md:mb-2 md:p-3 ${isDarkMode ? 'bg-cyan-500/20' : 'bg-sky-100 shadow-sm'}`}>
            <Home className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap md:text-[13px]">Inicio</span>
        </button>

        <button aria-label="Abrir Loja" onClick={() => setShowShop(true)} className={`group relative flex min-w-0 flex-1 flex-col items-center justify-center active:scale-95 transition-all rounded-xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'}`}>
          <div className={`absolute -top-3 text-[9px] font-black px-2 py-1 rounded-full border animate-pulse z-20 ${isDarkMode ? 'bg-amber-500/90 text-amber-950 border-amber-400/50 neon-glow-amber' : 'bg-amber-500 text-amber-950 border-amber-300 shadow-md'}`}>Ofertas</div>
          <div className={`relative z-10 mb-1.5 rounded-[1.2rem] p-2.5 transition-all md:mb-2 md:p-3 ${isDarkMode ? 'bg-emerald-500/20 group-hover:neon-glow-emerald' : 'bg-emerald-100 group-active:bg-emerald-200 shadow-sm'}`}>
            <ShoppingCart className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
          </div>
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap md:text-[13px]">Loja</span>
        </button>

        <button aria-label="Abrir Conquistas" onClick={onOpenAchievements} className={`group flex min-w-0 flex-1 flex-col items-center justify-center active:scale-95 transition-all ${isDarkMode ? 'text-slate-400 hover:text-amber-300' : 'text-stone-400 hover:text-amber-500'}`}>
          <div className={`mb-1.5 rounded-[1.2rem] p-2.5 transition-all md:mb-2 md:p-3 ${isDarkMode ? 'group-hover:bg-white/5' : 'group-active:bg-stone-100'}`}>
            <Trophy className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.16em] whitespace-nowrap md:text-[13px] ${isDarkMode ? 'group-hover:text-amber-300' : 'group-hover:text-amber-500'}`}>Conquistas</span>
        </button>

        <button aria-label="Abrir Configuracoes" onClick={onOpenSettings} className={`group flex min-w-0 flex-1 flex-col items-center justify-center active:scale-95 transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-stone-400 hover:text-stone-700'}`}>
          <div className={`mb-1.5 rounded-[1.2rem] p-2.5 transition-all md:mb-2 md:p-3 ${isDarkMode ? 'group-hover:bg-white/5' : 'group-active:bg-stone-100'}`}>
            <Settings className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap md:text-[13px] ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-stone-700'}`}>Ajustes</span>
        </button>
      </div>
    </nav>
  );
}
