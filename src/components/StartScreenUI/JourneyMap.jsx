import React, { memo, useMemo } from 'react';
import { Cloud, Compass, Lock, Mountain, Sparkles, TreePine, Trophy } from 'lucide-react';

const EMOJI_FONT_STYLE = {
  fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
};

function resolveAvatarIcon(icon) {
  if (!icon) {
    return '';
  }

  if (/^(https?:)?\/\//.test(icon) || icon.startsWith('data:')) {
    return icon;
  }

  return `${import.meta.env.BASE_URL}${icon.replace(/^\//, '')}`;
}

function AvatarPin({ activeAvatar, isDarkMode }) {
  return (
    <div className="pointer-events-none absolute -top-1 left-1/2 z-30 flex -translate-x-1/2 -translate-y-full flex-col items-center">
      <div className={`relative flex h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-[26px] border-[7px] border-amber-400 bg-white shadow-[0_18px_28px_rgba(0,0,0,0.25)] md:h-[94px] md:w-[94px] md:rounded-[30px] ${isDarkMode ? 'shadow-[0_18px_32px_rgba(0,0,0,0.4)]' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-amber-50" />
        <div className="absolute inset-x-2 top-2 h-8 rounded-full bg-white/70 blur-md md:h-10" />
        {activeAvatar.type === 'emoji' ? (
          <span style={EMOJI_FONT_STYLE} className="relative z-10 text-[38px] leading-none drop-shadow-[0_10px_16px_rgba(15,23,42,0.18)] md:text-[46px]">
            {activeAvatar.icon}
          </span>
        ) : (
          <img
            src={resolveAvatarIcon(activeAvatar.icon)}
            alt={activeAvatar.name}
            className="relative z-10 h-12 w-12 object-contain drop-shadow-[0_10px_16px_rgba(15,23,42,0.18)] md:h-16 md:w-16"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="h-0 w-0 border-x-[14px] border-t-[18px] border-x-transparent border-t-amber-400 md:border-x-[16px] md:border-t-[20px]" />
      <div className={`mt-2 h-3 w-12 rounded-full blur-[4px] ${isDarkMode ? 'bg-black/70' : 'bg-stone-900/20'}`} />
    </div>
  );
}

function JourneyScenery({ index, isDarkMode, isMobile }) {
  const iconSize = isMobile ? 64 : 88;
  const secondarySize = isMobile ? 42 : 56;

  if (index % 3 === 0) {
    return (
      <>
        <div className={`absolute left-3 top-16 opacity-80 md:left-0 ${isDarkMode ? 'text-indigo-300/70' : 'text-white/90'}`}>
          <Cloud size={iconSize} className={isDarkMode ? 'fill-indigo-900/60' : 'fill-white/90'} />
        </div>
        <div className={`absolute right-4 top-[54%] opacity-70 md:right-2 ${isDarkMode ? 'text-cyan-200/70' : 'text-sky-300/80'}`}>
          <Sparkles size={secondarySize} className={isDarkMode ? 'fill-cyan-200/20' : 'fill-sky-100/90'} />
        </div>
      </>
    );
  }

  if (index % 3 === 1) {
    return (
      <>
        <div className={`absolute left-4 top-16 opacity-85 md:left-0 ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-500/70'}`}>
          <TreePine size={iconSize} className={isDarkMode ? 'fill-emerald-950/45' : 'fill-emerald-200/85'} />
        </div>
        <div className={`absolute right-5 top-[58%] opacity-70 ${isDarkMode ? 'text-indigo-200/60' : 'text-sky-200/90'}`}>
          <Cloud size={secondarySize} className={isDarkMode ? 'fill-indigo-950/45' : 'fill-white/90'} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`absolute left-4 top-16 opacity-80 md:left-0 ${isDarkMode ? 'text-slate-300/65' : 'text-stone-300/90'}`}>
        <Mountain size={iconSize} className={isDarkMode ? 'fill-slate-950/45' : 'fill-stone-100/95'} />
      </div>
      <div className={`absolute right-6 top-[58%] opacity-75 ${isDarkMode ? 'text-amber-200/65' : 'text-amber-300/80'}`}>
        <Sparkles size={secondarySize} className={isDarkMode ? 'fill-amber-200/20' : 'fill-amber-100/80'} />
      </div>
    </>
  );
}

const JourneyNode = memo(function JourneyNode({
  theme,
  index,
  isUnlocked,
  isCurrent,
  onPress,
  activeAvatar,
  isDarkMode,
  isMobile,
  isLast,
}) {
  const circleTone = isUnlocked
    ? isCurrent
      ? isDarkMode
        ? 'bg-amber-500 border-white shadow-[0_0_0_6px_rgba(251,191,36,0.18),0_24px_45px_rgba(251,191,36,0.25)]'
        : 'bg-amber-400 border-white shadow-[0_24px_40px_rgba(251,191,36,0.35)]'
      : isDarkMode
        ? 'glass-panel border-white/15 shadow-[0_18px_28px_rgba(2,6,23,0.45)]'
        : 'glass-panel-light border-white shadow-[0_18px_28px_rgba(14,165,233,0.16)]'
    : isDarkMode
      ? 'bg-slate-900/90 border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]'
      : 'bg-white/75 border-stone-300 shadow-[inset_0_0_20px_rgba(148,163,184,0.12)]';

  return (
    <div className="relative flex min-h-[270px] w-full flex-col items-center justify-start pt-20 md:min-h-[320px] md:pt-24">
      <JourneyScenery index={index} isDarkMode={isDarkMode} isMobile={isMobile} />

      {isCurrent && <AvatarPin activeAvatar={activeAvatar} isDarkMode={isDarkMode} />}

      <div className="relative z-20">
        {isCurrent && (
          <>
            <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-amber-400/45 animate-pulse-ring md:h-[216px] md:w-[216px]" />
            <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-amber-400/25 animate-pulse-ring md:h-[216px] md:w-[216px]" style={{ animationDelay: '0.9s' }} />
          </>
        )}

        <button
          type="button"
          aria-label={isUnlocked ? `Selecionar tema ${theme.name}` : `Desbloquear tema ${theme.name} por ${theme.price} moedas`}
          onClick={onPress}
          className={`relative flex h-[142px] w-[142px] items-center justify-center overflow-hidden rounded-full border-[7px] transition-all active:scale-[0.98] md:h-[176px] md:w-[176px] md:border-[8px] ${
            isUnlocked ? 'hover:scale-[1.03]' : ''
          } ${circleTone}`}
        >
          {isCurrent && <div className="absolute inset-0 -translate-x-[150%] animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />}
          {isUnlocked ? (
            <Compass className={`relative z-10 h-16 w-16 md:h-20 md:w-20 ${isCurrent ? 'text-amber-950' : isDarkMode ? 'text-cyan-300' : 'text-sky-600'}`} strokeWidth={2.5} />
          ) : (
            <Lock className={`relative z-10 h-14 w-14 md:h-16 md:w-16 ${isDarkMode ? 'text-slate-600' : 'text-stone-500'}`} strokeWidth={2.5} />
          )}
        </button>
      </div>

      <div className="relative z-20 mt-5 flex flex-col items-center gap-3 text-center">
        <span className={`rounded-full border px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] md:px-6 md:text-[12px] ${
          isDarkMode ? 'bg-slate-900/70 border-white/10 text-slate-300' : 'bg-white/85 border-sky-100 text-sky-700'
        }`}>
          {theme.name}
        </span>

        <button
          type="button"
          onClick={onPress}
          className={`rounded-full border px-7 py-3 text-[15px] font-black uppercase tracking-[0.12em] transition-all active:scale-[0.98] md:px-9 md:py-4 md:text-[17px] ${
            isUnlocked
              ? isCurrent
                ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-[0_16px_30px_rgba(251,191,36,0.3)]'
                : isDarkMode
                  ? 'glass-panel border-white/15 text-white hover:border-cyan-300/40 hover:bg-white/10'
                  : 'glass-panel-light border-white text-sky-800 hover:bg-white'
              : isDarkMode
                ? 'glass-panel border-white/10 text-slate-500'
                : 'glass-panel-light border-stone-200 text-stone-500'
          }`}
        >
          {isUnlocked ? (isCurrent ? 'Jogar Agora' : 'Selecionar') : 'Desbloquear'}
        </button>

        {!isUnlocked && (
          <span className={`rounded-full px-4 py-1.5 text-[12px] font-black uppercase tracking-[0.18em] ${
            isDarkMode ? 'text-amber-200' : 'text-amber-700'
          }`}>
            {theme.price} moedas
          </span>
        )}
      </div>

      {!isLast && (
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:-bottom-8 md:gap-4">
          {[0, 1, 2].map((dotIndex) => (
            <div
              key={dotIndex}
              className={`rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-sky-200'} ${
                dotIndex === 1 ? 'h-3.5 w-3.5 md:h-4 md:w-4' : 'h-2.5 w-2.5 md:h-3 md:w-3'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

function JourneyMap({
  themes,
  currentTheme,
  unlockedThemes,
  activeAvatar,
  onThemePress,
  isDarkMode,
  isMobile,
}) {
  const themeNodes = useMemo(() => Object.values(themes), [themes]);

  return (
    <div
      className="relative z-10 mx-auto w-full max-w-[28rem] px-2 md:max-w-[34rem] md:px-4"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '2200px' }}
    >
      <div
        aria-hidden="true"
        className={`absolute left-1/2 top-[154px] bottom-[168px] w-[6px] -translate-x-1/2 rounded-full md:top-[188px] md:bottom-[188px] ${
          isDarkMode
            ? 'bg-gradient-to-b from-amber-400/55 via-cyan-400/25 to-fuchsia-400/20'
            : 'bg-gradient-to-b from-amber-300 via-sky-200 to-sky-100'
        }`}
      />

      <div className="flex flex-col items-center gap-12 md:gap-16">
        {themeNodes.map((theme, index) => {
          const isUnlocked = unlockedThemes.includes(theme.id);
          const isCurrent = currentTheme.id === theme.id;

          return (
            <JourneyNode
              key={theme.id}
              theme={theme}
              index={index}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              onPress={() => onThemePress(theme, isUnlocked)}
              activeAvatar={activeAvatar}
              isDarkMode={isDarkMode}
              isMobile={isMobile}
              isLast={index === themeNodes.length - 1}
            />
          );
        })}

        <div className="relative flex min-h-[220px] w-full flex-col items-center justify-start pt-14 md:min-h-[260px] md:pt-16">
          <div className={`absolute left-4 top-12 opacity-75 ${isDarkMode ? 'text-rose-200/60' : 'text-rose-300/80'}`}>
            <Cloud size={isMobile ? 64 : 90} className={isDarkMode ? 'fill-rose-950/35' : 'fill-white/90'} />
          </div>
          <div className={`absolute right-5 top-[52%] opacity-70 ${isDarkMode ? 'text-amber-200/60' : 'text-amber-300/70'}`}>
            <Sparkles size={isMobile ? 44 : 58} className={isDarkMode ? 'fill-amber-200/20' : 'fill-amber-100/80'} />
          </div>

          <div className={`relative z-20 flex h-[132px] w-[132px] items-center justify-center rounded-full border-[7px] md:h-[160px] md:w-[160px] md:border-[8px] ${
            isDarkMode
              ? 'glass-panel border-rose-500/30 shadow-[0_24px_42px_rgba(15,23,42,0.45)]'
              : 'glass-panel-light border-rose-200 shadow-[0_18px_32px_rgba(244,63,94,0.12)]'
          }`}>
            <Trophy className={`h-16 w-16 md:h-20 md:w-20 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} strokeWidth={2.5} />
          </div>

          <div className="relative z-20 mt-5 flex flex-col items-center gap-3 text-center">
            <span className={`rounded-full border px-6 py-2 text-[11px] font-black uppercase tracking-[0.22em] md:text-[12px] ${
              isDarkMode ? 'bg-slate-900/70 border-white/10 text-slate-300' : 'bg-white/85 border-sky-100 text-sky-700'
            }`}>
              Proxima Rota
            </span>
            <div className={`rounded-full border px-7 py-3 text-[15px] font-black uppercase tracking-[0.12em] md:px-10 md:py-4 md:text-[17px] ${
              isDarkMode
                ? 'glass-panel border-rose-500/25 text-rose-100'
                : 'glass-panel-light border-rose-200 text-rose-700'
            }`}>
              A Lenda
            </div>
            <span className={`text-[12px] font-black uppercase tracking-[0.18em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
              Em breve
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(JourneyMap);
