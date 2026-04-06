import React from 'react';
import { Home, ShoppingCart, Trophy, Settings } from 'lucide-react';

export default function BottomNav({ onOpenAchievements, onOpenSettings, setShowShop, isDarkMode }) {
  return (
    <nav aria-label="Navegação Principal" className={`fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 md:px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 md:pt-5 border-t rounded-t-[2rem] md:rounded-t-[3rem] transition-all ${isDarkMode ? 'glass-panel border-white/5 shadow-[0px_-20px_60px_rgba(0,0,0,0.6)]' : 'glass-panel-light border-stone-200/50 shadow-[0px_-20px_40px_rgba(0,0,0,0.04)]'}`}>
      <button type="button" aria-label="Tela inicial atual" aria-current="page" disabled className={`flex flex-col items-center justify-center transition-all group w-20 cursor-default md:w-32 ${isDarkMode ? 'text-cyan-300' : 'text-sky-500'}`}>
        <div className={`p-2.5 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] mb-1.5 md:mb-3 transition-all ${isDarkMode ? 'bg-cyan-500/20' : 'bg-sky-100 shadow-sm'}`}>
          <Home className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
        </div>
        <span className="text-[11px] md:text-[16px] font-black uppercase tracking-widest whitespace-nowrap">Início</span>
      </button>
      
      <button aria-label="Abrir Loja" onClick={() => setShowShop(true)} className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 relative overflow-visible rounded-xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'}`}>
        <div className={`absolute -top-3 -right-2 text-[9px] font-black px-2 py-1 rounded-full border animate-pulse z-20 ${isDarkMode ? 'bg-amber-500/90 text-amber-950 border-amber-400/50 neon-glow-amber' : 'bg-amber-500 text-amber-950 border-amber-300 shadow-md'}`}>OFERTAS</div>
        <div className={`p-2.5 md:p-4 rounded-[1.2rem] md:rounded-[1.8rem] mb-1.5 md:mb-3 transition-all relative z-10 ${isDarkMode ? 'bg-emerald-500/20 group-hover:neon-glow-emerald' : 'bg-emerald-100 group-active:bg-emerald-200 shadow-sm'}`}>
          <ShoppingCart className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
        </div>
        <span className="text-[11px] md:text-[16px] font-black uppercase tracking-widest whitespace-nowrap relative z-10">Loja</span>
      </button>

      <button aria-label="Abrir Conquistas" onClick={onOpenAchievements} className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 ${isDarkMode ? 'text-slate-400 hover:text-amber-300' : 'text-stone-400 hover:text-amber-500'}`}>
        <div className={`p-2.5 md:p-4 mb-1.5 md:mb-3 rounded-[1.2rem] md:rounded-[1.8rem] transition-all ${isDarkMode ? 'group-hover:bg-white/5' : 'group-active:bg-stone-100'}`}>
          <Trophy className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
        </div>
        <span className={`text-[11px] md:text-[16px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'group-hover:text-amber-300' : 'group-hover:text-amber-500'}`}>Conquistas</span>
      </button>
      
      <button aria-label="Abrir Configurações" onClick={onOpenSettings} className={`flex flex-col items-center justify-center active:scale-95 transition-all group w-20 md:w-32 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-stone-400 hover:text-stone-700'}`}>
        <div className={`p-2.5 md:p-4 mb-1.5 md:mb-3 rounded-[1.2rem] md:rounded-[1.8rem] transition-all ${isDarkMode ? 'group-hover:bg-white/5' : 'group-active:bg-stone-100'}`}>
          <Settings className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2.5} />
        </div>
        <span className={`text-[11px] md:text-[16px] font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-stone-700'}`}>Ajustes</span>
      </button>
    </nav>
  );
}
