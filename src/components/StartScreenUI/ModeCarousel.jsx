import React, { memo, useMemo } from 'react';
import { ChevronRight, Compass, Map, Star, Zap } from 'lucide-react';

const MODE_DEFINITIONS = [
  {
    id: 'daily',
    title: 'Diario',
    subtitle: 'Hoje',
    badge: '+500',
    badgeTone: 'rose',
    accentTone: 'rose',
    icon: 'Diar.png',
  },
  {
    id: 'football',
    title: 'Futebol',
    subtitle: 'Teste sua mira',
    badge: 'Desafio',
    badgeTone: 'cyan',
    accentTone: 'cyan',
    icon: 'Futb.png',
  },
  {
    id: 'study',
    title: 'Estudo',
    subtitle: 'Sem pressa',
    badge: 'Zen',
    badgeTone: 'emerald',
    accentTone: 'emerald',
    icon: 'Estud.png',
  },
];

function getToneClasses(tone, isDarkMode) {
  if (isDarkMode) {
    switch (tone) {
      case 'rose':
        return {
          badge: 'bg-rose-500/90 text-white border-white/15',
          card: 'glass-panel border-rose-500/20 hover:border-rose-400/40 hover:shadow-[0_24px_60px_rgba(244,63,94,0.18)]',
          title: 'text-rose-100',
          subtitle: 'text-rose-300',
          glow: 'bg-rose-500/30',
        };
      case 'cyan':
        return {
          badge: 'bg-cyan-500/90 text-white border-white/15',
          card: 'glass-panel border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-[0_24px_60px_rgba(34,211,238,0.18)]',
          title: 'text-cyan-100',
          subtitle: 'text-cyan-300',
          glow: 'bg-cyan-500/30',
        };
      default:
        return {
          badge: 'bg-emerald-500/90 text-white border-white/15',
          card: 'glass-panel border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-[0_24px_60px_rgba(16,185,129,0.18)]',
          title: 'text-emerald-100',
          subtitle: 'text-emerald-300',
          glow: 'bg-emerald-500/30',
        };
    }
  }

  switch (tone) {
    case 'rose':
      return {
        badge: 'bg-rose-500 text-white border-rose-300 shadow-lg',
        card: 'glass-panel-light border-rose-200 hover:border-rose-300 hover:shadow-[0_18px_40px_rgba(244,63,94,0.18)]',
        title: 'text-rose-800',
        subtitle: 'text-rose-500',
        glow: 'bg-rose-200/70',
      };
    case 'cyan':
      return {
        badge: 'bg-sky-500 text-white border-sky-300 shadow-lg',
        card: 'glass-panel-light border-sky-200 hover:border-sky-300 hover:shadow-[0_18px_40px_rgba(14,165,233,0.18)]',
        title: 'text-sky-800',
        subtitle: 'text-sky-500',
        glow: 'bg-sky-200/70',
      };
    default:
      return {
        badge: 'bg-emerald-500 text-white border-emerald-300 shadow-lg',
        card: 'glass-panel-light border-emerald-200 hover:border-emerald-300 hover:shadow-[0_18px_40px_rgba(16,185,129,0.18)]',
        title: 'text-emerald-800',
        subtitle: 'text-emerald-500',
        glow: 'bg-emerald-200/70',
      };
  }
}

const ModeCard = memo(function ModeCard({ card, isDarkMode }) {
  const tone = getToneClasses(card.accentTone, isDarkMode);
  const isDisabled = card.disabled;

  return (
    <button
      type="button"
      aria-label={card.ariaLabel}
      onClick={card.onClick}
      disabled={isDisabled}
      className={`snap-center relative flex min-h-[214px] w-[240px] shrink-0 flex-col items-center overflow-hidden rounded-[2rem] px-5 pb-6 pt-5 text-center transition-all active:scale-[0.98] md:min-h-[250px] md:w-[290px] md:px-6 ${
        isDisabled
          ? isDarkMode
            ? 'glass-panel cursor-not-allowed border-white/10 opacity-55'
            : 'glass-panel-light cursor-not-allowed border-stone-200 opacity-70'
          : tone.card
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/15 to-transparent" />
      </div>

      <div className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone.badge}`}>
        {isDisabled ? 'Concluido' : card.badge}
      </div>

      <div className="relative z-10 mt-2 flex flex-1 flex-col items-center justify-center">
        <div className={`absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full blur-[32px] md:h-32 md:w-32 ${isDisabled ? 'bg-slate-300/30' : tone.glow}`} />
        <img
          src={`${import.meta.env.BASE_URL}assets/icons/${card.icon}`}
          alt={card.title}
          className={`relative z-10 mb-4 h-[116px] w-[116px] object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.24)] transition-transform duration-500 md:h-[138px] md:w-[138px] ${isDisabled ? 'grayscale opacity-60' : 'group-hover:scale-[1.04]'}`}
          loading="lazy"
          decoding="async"
        />
        <span className={`text-[23px] font-black uppercase tracking-[0.12em] leading-none md:text-[27px] ${isDisabled ? (isDarkMode ? 'text-slate-500' : 'text-stone-400') : tone.title}`}>
          {card.title}
        </span>
        <span className={`mt-3 inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-[0.2em] md:text-[13px] ${isDisabled ? (isDarkMode ? 'text-slate-600' : 'text-stone-400') : tone.subtitle}`}>
          {card.id === 'daily' && !isDisabled ? <Star size={14} className="fill-current" /> : null}
          {card.id === 'football' ? <Zap size={14} className="fill-current" /> : null}
          {card.id === 'study' ? <Compass size={14} className="fill-current" /> : null}
          {isDisabled && card.id === 'daily' ? 'Feito hoje' : card.subtitle}
        </span>
      </div>
    </button>
  );
});

function ModeCarousel({ onDaily, onFootball, onStudy, dailyCompleted, isDarkMode }) {
  const cards = useMemo(() => {
    return MODE_DEFINITIONS.map((mode) => {
      if (mode.id === 'daily') {
        return {
          ...mode,
          disabled: dailyCompleted,
          onClick: dailyCompleted ? undefined : onDaily,
          ariaLabel: dailyCompleted ? 'Modo diario concluido hoje' : 'Iniciar modo diario',
        };
      }

      if (mode.id === 'football') {
        return {
          ...mode,
          disabled: false,
          onClick: onFootball,
          ariaLabel: 'Iniciar modo futebol',
        };
      }

      return {
        ...mode,
        disabled: false,
        onClick: onStudy,
        ariaLabel: 'Iniciar modo estudo',
      };
    });
  }, [dailyCompleted, onDaily, onFootball, onStudy]);

  return (
    <section
      className="relative z-10 animate-fade-in-up"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '320px' }}
    >
      <div className="mb-5 flex items-end justify-between px-5 md:px-8">
        <h2 className={`flex items-center gap-2 text-[20px] font-black uppercase tracking-[0.16em] md:text-[28px] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
          <Map size={22} className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} />
          Modos
        </h2>
        <span className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.18em] md:text-[12px] ${isDarkMode ? 'text-indigo-200/80' : 'text-sky-600'}`}>
          Deslize
          <ChevronRight size={16} />
        </span>
      </div>

      <div className="custom-scrollbar flex snap-x gap-4 overflow-x-auto px-5 pb-4 pt-2 md:px-8">
        {cards.map((card) => (
          <div key={card.id} className="group">
            <ModeCard card={card} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(ModeCarousel);
