import React, { useEffect, useMemo, useState } from 'react';
import { Compass, Sparkles, Star, Trophy } from 'lucide-react';

import AvatarIcon from '../shared/AvatarIcon';

const EXPERIENCE_SLIDES = [
  {
    title: 'Exploracao cinematica',
    subtitle: 'Entrada com presenca',
    detail: 'A home agora guia o olho melhor, valoriza o mapa e deixa o jogo com mais cara de produto premium.',
    accentDark: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-200',
    accentLight: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Compass,
  },
  {
    title: 'Fluxo mais legivel',
    subtitle: 'Tudo em blocos claros',
    detail: 'Modo, jornada, avatar e tema ganharam hierarquia mais forte sem esconder o que ja existia.',
    accentDark: 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200',
    accentLight: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
    icon: Sparkles,
  },
  {
    title: 'Jornada mais viva',
    subtitle: 'Profundidade visual',
    detail: 'Abertura forte em cima, mapa embaixo e leitura mais natural do progresso entre rotas.',
    accentDark: 'border-amber-500/25 bg-amber-500/10 text-amber-200',
    accentLight: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Trophy,
  },
];

export default function ExperienceShowcase({ coins, countryCount, currentTheme, activeAvatar, isDarkMode }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % EXPERIENCE_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  const slide = useMemo(() => EXPERIENCE_SLIDES[activeSlide], [activeSlide]);
  const Icon = slide.icon;
  const accentClasses = isDarkMode ? slide.accentDark : slide.accentLight;

  return (
    <section
      className={`relative overflow-hidden rounded-[2.5rem] border px-6 py-6 shadow-[0_30px_70px_rgba(15,23,42,0.18)] ${
        isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute right-0 top-0 h-44 w-44 rounded-full ${
          isDarkMode ? 'bg-cyan-400/10' : 'bg-sky-200/60'
        } blur-3xl`}
      />
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className={`flex flex-1 flex-col gap-2 rounded-[1.8rem] border px-5 py-4 ${accentClasses}`}>
            <div className="flex items-center gap-2">
              <Icon size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.28em]">{slide.subtitle}</span>
            </div>
            <span className="text-[25px] font-black uppercase leading-tight tracking-[0.08em] md:text-[32px]">
              {slide.title}
            </span>
            <span className="text-[12px] font-bold leading-relaxed text-current/80">{slide.detail}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[18rem] lg:grid-cols-1">
            <div className={`flex items-center gap-3 rounded-[1.6rem] border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-white/5 text-white/80' : 'border-white/80 bg-white/85 text-stone-700'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${isDarkMode ? 'bg-slate-900/70 text-amber-300' : 'bg-sky-50 text-sky-600'}`}>
                <AvatarIcon avatar={activeAvatar} size={26} />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-[0.26em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Veiculo</p>
                <p className="truncate text-[14px] font-black uppercase tracking-[0.08em]">{activeAvatar?.name || 'Pino Padrao'}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 rounded-[1.6rem] border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-white/5 text-white/80' : 'border-white/80 bg-white/85 text-stone-700'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${isDarkMode ? 'bg-slate-900/70 text-cyan-300' : 'bg-sky-50 text-sky-600'}`}>
                <Compass size={24} />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-[0.26em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Tema</p>
                <p className="truncate text-[14px] font-black uppercase tracking-[0.08em]">{currentTheme?.name || 'Explorador'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className={`rounded-[1.5rem] border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'}`}>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-400" />
              <span className={`text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Moedas</span>
            </div>
            <p className={`mt-2 text-[24px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
              {coins.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className={`rounded-[1.5rem] border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'}`}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Mapa</span>
            </div>
            <p className={`mt-2 text-[24px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
              {countryCount}
            </p>
          </div>

          <div className={`rounded-[1.5rem] border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'}`}>
            <div className="flex items-center gap-2">
              <Trophy size={16} className={isDarkMode ? 'text-fuchsia-300' : 'text-fuchsia-500'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Leitura</span>
            </div>
            <p className={`mt-2 text-[14px] font-black uppercase tracking-[0.12em] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
              Hero, modos e jornada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {EXPERIENCE_SLIDES.map((item, index) => (
            <span
              key={item.title}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? `w-10 ${isDarkMode ? 'bg-white' : 'bg-sky-500'}` : `w-7 ${isDarkMode ? 'bg-white/25' : 'bg-sky-200'}`
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
