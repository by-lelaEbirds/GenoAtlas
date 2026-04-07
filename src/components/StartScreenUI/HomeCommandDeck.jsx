import React from 'react';
import { Coins, Compass, Sparkles, Trophy } from 'lucide-react';

import AvatarIcon from '../shared/AvatarIcon';

function getThemeTone(themeId, isDarkMode) {
  if (themeId === 'noturno') {
    return isDarkMode
      ? 'from-cyan-400/25 via-indigo-500/18 to-fuchsia-500/18'
      : 'from-sky-200 via-indigo-100 to-fuchsia-100';
  }

  if (themeId === 'ouro') {
    return isDarkMode
      ? 'from-amber-400/28 via-orange-500/18 to-rose-500/14'
      : 'from-amber-100 via-orange-50 to-rose-50';
  }

  return isDarkMode
    ? 'from-emerald-400/20 via-cyan-500/16 to-sky-500/14'
    : 'from-emerald-100 via-cyan-50 to-sky-100';
}

export default function HomeCommandDeck({ activeAvatar, currentTheme, coins, dailyCompleted, isDarkMode }) {
  const themeTone = getThemeTone(currentTheme?.id, isDarkMode);

  return (
    <div
      className={`relative overflow-hidden rounded-[2.4rem] border p-6 shadow-[0_30px_60px_rgba(2,6,23,0.25)] ${
        isDarkMode ? 'glass-panel border-white/15' : 'glass-panel-light border-white/70'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${themeTone}`} />
      <div
        aria-hidden="true"
        className={`absolute -right-12 top-10 h-48 w-48 rounded-full border ${
          isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/35'
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute -left-10 bottom-6 h-28 w-28 rounded-full ${
          isDarkMode ? 'bg-cyan-400/12' : 'bg-sky-200/60'
        } blur-2xl`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-[11px] font-black uppercase tracking-[0.34em] ${isDarkMode ? 'text-cyan-200/80' : 'text-sky-700/80'}`}>
              Centro de voo
            </p>
            <h3 className={`mt-2 text-[28px] font-black uppercase leading-none tracking-[0.08em] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
              Tudo pronto
            </h3>
            <p className={`mt-3 max-w-[22rem] text-[13px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-stone-600'}`}>
              Sua home agora destaca o que ja importa no jogo: visual ativo, veiculo equipado e o melhor ponto de entrada para a proxima rodada.
            </p>
          </div>

          <div className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'border-white/10 bg-white/5 text-amber-200' : 'border-white/80 bg-white/80 text-amber-700'}`}>
            {dailyCompleted ? 'Diario feito' : 'Diario aberto'}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] border ${isDarkMode ? 'border-white/10 bg-slate-950/65' : 'border-white/80 bg-white/90'}`}>
            <div className={`absolute inset-2 rounded-[1.4rem] ${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-sky-50 via-white to-sky-100'}`} />
            <div className={`absolute inset-x-3 top-2 h-6 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-white/80'} blur-md`} />
            <div className={`relative z-10 ${isDarkMode ? 'text-amber-300' : 'text-sky-600'}`}>
              <AvatarIcon avatar={activeAvatar} size={48} className="drop-shadow-[0_8px_14px_rgba(15,23,42,0.18)]" />
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <div className={`rounded-[1.4rem] border px-4 py-3 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'}`}>
              <div className="flex items-center gap-2">
                <Compass size={16} className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} />
                <span className={`text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Tema</span>
              </div>
              <p className={`mt-2 text-[15px] font-black uppercase tracking-[0.08em] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                {currentTheme?.name || 'Explorador'}
              </p>
            </div>

            <div className={`rounded-[1.4rem] border px-4 py-3 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'}`}>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className={isDarkMode ? 'text-fuchsia-300' : 'text-fuchsia-500'} />
                <span className={`text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Veiculo</span>
              </div>
              <p className={`mt-2 text-[15px] font-black uppercase tracking-[0.08em] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                {activeAvatar?.name || 'Pino Padrao'}
              </p>
            </div>

            <div className={`rounded-[1.4rem] border px-4 py-3 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'}`}>
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-amber-400" />
                <span className={`text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Carteira</span>
              </div>
              <p className={`mt-2 text-[15px] font-black uppercase tracking-[0.08em] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                {coins.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'border-white/10 bg-white/5 text-slate-200' : 'border-white/80 bg-white/80 text-stone-600'}`}>
            <Trophy size={14} className={isDarkMode ? 'text-amber-300' : 'text-amber-500'} />
            Jornada vertical viva
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'border-white/10 bg-white/5 text-slate-200' : 'border-white/80 bg-white/80 text-stone-600'}`}>
            <Sparkles size={14} className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} />
            Home mais cinematica
          </div>
        </div>
      </div>
    </div>
  );
}
