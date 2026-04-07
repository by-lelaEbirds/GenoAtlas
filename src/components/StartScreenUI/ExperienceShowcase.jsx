import React, { useEffect, useMemo, useState } from 'react';
import { Airplay, CalendarDays, Compass, Sparkles, Star } from 'lucide-react';

const EXPERIENCE_SLIDES = [
  {
    title: 'Rotas com alma',
    subtitle: 'Mapa dinâmico',
    detail: 'As opções de hoje surgem em sequência ao deslizar.',
    accent: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    icon: Compass,
  },
  {
    title: 'Pulso diário',
    subtitle: 'Consistência no radar',
    detail: 'Termine pelo menos 1 rodada diária para manter a vibe.',
    accent: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    icon: CalendarDays,
  },
  {
    title: 'Tripla energia',
    subtitle: 'Moedas + combo',
    detail: 'Coins, streak e precisão compõem sua próxima missão.',
    accent: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    icon: Sparkles,
  },
  {
    title: 'Ritmo esportivo',
    subtitle: 'Modo futebol',
    detail: 'Use o impacto dos gramados pra descolar bônus rápidos.',
    accent: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    icon: Airplay,
  },
];

export default function ExperienceShowcase({ coins, countryCount, isDarkMode }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % EXPERIENCE_SLIDES.length);
    }, 7500);
    return () => window.clearInterval(id);
  }, []);

  const slide = useMemo(() => EXPERIENCE_SLIDES[activeSlide], [activeSlide]);

  return (
    <section className="relative z-10 mx-auto mb-8 w-full max-w-5xl overflow-hidden rounded-[2.5rem] border-[1px] px-6 py-6 text-left shadow-[0_30px_70px_rgba(15,23,42,0.4)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/0" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <div className={`flex flex-1 flex-col gap-1 rounded-[1.8rem] border px-5 py-4 text-sm font-black uppercase tracking-[0.2em] ${slide.accent}`}>
          <span className="text-[10px] text-current">{slide.subtitle}</span>
          <span className="text-[26px] leading-tight md:text-[32px]">{slide.title}</span>
          <span className="text-[11px] font-bold tracking-[0.18em] text-current/80">{slide.detail}</span>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center justify-center rounded-[1.4rem] border border-white/40 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            <Star size={22} className="text-amber-300" />
            {coins.toLocaleString()}
            <span className="text-[10px]">Moedas</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[1.4rem] border border-white/40 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            <Sparkles size={22} className={`text-${isDarkMode ? 'cyan' : 'sky'}-300`} />
            {countryCount}
            <span className="text-[10px]">Paises</span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2">
        {EXPERIENCE_SLIDES.map((_, index) => (
          <span
            key={_.title}
            className={`h-1.5 w-8 rounded-full transition-all duration-300 ${index === activeSlide ? 'bg-white' : 'bg-white/40'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
