import React from 'react';
import { Coins, Gift, PlayCircle, ShieldPlus, Sparkles, X } from 'lucide-react';

const PROMPT_VISUALS = {
  rewarded_revive: {
    icon: ShieldPlus,
    accent: 'emerald',
    title: 'Segunda Chance',
  },
  rewarded_double_coins: {
    icon: Coins,
    accent: 'amber',
    title: 'Moedas em Dobro',
  },
};

function getAccentClasses(accent, isDarkMode) {
  if (accent === 'amber') {
    return isDarkMode
      ? {
          panel: 'border-amber-500/25 text-amber-100',
          ring: 'bg-amber-500/15 border-amber-400/35 text-amber-300',
          button: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
        }
      : {
          panel: 'border-amber-200 text-amber-900',
          ring: 'bg-amber-100 border-amber-300 text-amber-600',
          button: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
        };
  }

  return isDarkMode
    ? {
        panel: 'border-emerald-500/25 text-emerald-100',
        ring: 'bg-emerald-500/15 border-emerald-400/35 text-emerald-300',
        button: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300',
      }
    : {
        panel: 'border-emerald-200 text-emerald-900',
        ring: 'bg-emerald-100 border-emerald-300 text-emerald-600',
        button: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300',
      };
}

export default function MonetizationModal({ prompt, isDarkMode, isLoading, onConfirm, onClose }) {
  if (!prompt) {
    return null;
  }

  const visual = PROMPT_VISUALS[prompt.placement] || PROMPT_VISUALS.rewarded_revive;
  const Icon = visual.icon;
  const accent = getAccentClasses(visual.accent, isDarkMode);

  return (
    <div className={`absolute inset-0 z-[260] flex items-center justify-center px-4 py-6 backdrop-blur-md ${isDarkMode ? 'bg-black/85' : 'bg-stone-900/80'}`}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="monetization-title"
        className={`relative flex w-full max-w-md flex-col rounded-[2.5rem] border p-6 text-center shadow-[0_30px_60px_rgba(0,0,0,0.35)] md:max-w-lg md:rounded-[3rem] md:p-8 ${
          isDarkMode ? 'glass-panel border-white/10 text-white' : 'glass-panel-light border-white/80 text-stone-800'
        } ${accent.panel}`}
      >
        <button
          type="button"
          aria-label="Fechar oferta patrocinada"
          onClick={onClose}
          disabled={isLoading}
          className={`absolute right-5 top-5 rounded-full p-3 transition-all active:scale-95 ${
            isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-700'
          } ${isLoading ? 'opacity-40' : ''}`}
        >
          <X size={22} />
        </button>

        <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border shadow-inner md:h-24 md:w-24 ${accent.ring}`}>
          <Icon size={38} strokeWidth={2.5} />
        </div>

        <span className={`mx-auto mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] ${
          isDarkMode ? 'border-white/10 bg-white/5 text-slate-300' : 'border-stone-200 bg-white/70 text-stone-500'
        }`}>
          <Sparkles size={14} />
          Patrocinado
        </span>

        <h2 id="monetization-title" className={`mb-3 text-[28px] font-black uppercase leading-none tracking-tight md:text-[34px] ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
          {prompt.title || visual.title}
        </h2>

        <p className={`mb-5 text-[15px] font-bold leading-relaxed md:text-[17px] ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
          {prompt.description}
        </p>

        <div className={`mb-6 rounded-[1.75rem] border px-5 py-4 ${isDarkMode ? 'border-white/10 bg-slate-900/60' : 'border-stone-200 bg-white/75'}`}>
          <div className={`mb-1 text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>
            Recompensa
          </div>
          <div className="flex items-center justify-center gap-2 text-[22px] font-black tracking-tight md:text-[26px]">
            <Gift size={22} className={visual.accent === 'amber' ? 'text-amber-400' : 'text-emerald-400'} />
            {prompt.rewardLabel}
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex items-center justify-center gap-3 rounded-[1.75rem] py-4 text-[16px] font-black uppercase tracking-[0.16em] transition-all md:text-[18px] ${accent.button} ${isLoading ? 'opacity-80' : 'active:scale-[0.99]'}`}
        >
          {isLoading ? <Coins size={20} className="animate-spin-slow" /> : <PlayCircle size={20} />}
          {isLoading ? 'Carregando patrocinio...' : 'Assistir e liberar'}
        </button>
      </section>
    </div>
  );
}
