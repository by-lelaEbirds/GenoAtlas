import React, { memo } from 'react';
import {
  ArrowUpCircle,
  Compass,
  Gem,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

function getToneClasses(tone, isDarkMode) {
  if (isDarkMode) {
    switch (tone) {
      case 'emerald':
        return 'border-emerald-500/25 text-emerald-200';
      case 'amber':
        return 'border-amber-500/25 text-amber-200';
      case 'rose':
        return 'border-rose-500/25 text-rose-200';
      case 'indigo':
        return 'border-indigo-500/25 text-indigo-200';
      default:
        return 'border-cyan-500/25 text-cyan-200';
    }
  }

  switch (tone) {
    case 'emerald':
      return 'border-emerald-200 text-emerald-700';
    case 'amber':
      return 'border-amber-200 text-amber-700';
    case 'rose':
      return 'border-rose-200 text-rose-700';
    case 'indigo':
      return 'border-indigo-200 text-indigo-700';
    default:
      return 'border-sky-200 text-sky-700';
  }
}

function UpgradeCapsule({ label, level, isDarkMode }) {
  return (
    <div
      className={`rounded-[1.35rem] border px-4 py-3 text-center ${
        isDarkMode ? 'glass-panel border-white/10 text-slate-200' : 'glass-panel-light border-white text-sky-800'
      }`}
    >
      <span className={`block text-[10px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
        {label}
      </span>
      <span className={`mt-1 block text-[22px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
        Nv {level}
      </span>
    </div>
  );
}

function MissionRow({ mission, isDarkMode }) {
  const progressPct = Math.min((mission.progress / mission.target) * 100, 100);

  return (
    <div
      className={`rounded-[1.6rem] border p-4 ${
        isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className={`text-[14px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
            {mission.title}
          </p>
          <p className={`mt-1 text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
            {mission.description}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getToneClasses(mission.tone, isDarkMode)}`}>
          +{mission.rewardCoins}
        </span>
      </div>

      <div className={`h-2 overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-sky-100'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            mission.completed ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]' : 'bg-sky-400'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
          {mission.progress}/{mission.target}
        </span>
        <span
          className={`text-[11px] font-black uppercase tracking-[0.16em] ${
            mission.completed
              ? 'text-emerald-500'
              : isDarkMode
                ? 'text-slate-400'
                : 'text-stone-500'
          }`}
        >
          {mission.completed ? 'Concluida' : `+${mission.rewardXp} XP`}
        </span>
      </div>
    </div>
  );
}

function MasteryBar({ entry, isDarkMode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-300' : 'text-sky-900'}`}>
          {entry.continent}
        </span>
        <span className={`text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
          {entry.discoveredCount}/{entry.nextMilestone}
        </span>
      </div>
      <div className={`h-2 overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-sky-100'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${isDarkMode ? 'bg-fuchsia-400' : 'bg-sky-500'}`}
          style={{ width: `${entry.progressPct}%` }}
        />
      </div>
    </div>
  );
}

function CommandCenter({
  seasonProgress,
  seasonXp,
  activeEvent,
  coachTip,
  weeklyMissions,
  masteryEntries,
  dailyWinStreak,
  weeklyVoyageStreak,
  routeUpgrades,
  isDarkMode,
  onOpenShop,
}) {
  const safeMissions = weeklyMissions || [];
  const safeRouteUpgrades = routeUpgrades || { atlasPass: 0, relayCore: 0, treasureRadar: 0 };
  const completedMissions = safeMissions.filter((mission) => mission.completed).length;

  return (
    <section className="relative z-10 px-5 pb-6 pt-2 md:px-8 md:pb-8 md:pt-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className={`rounded-[2.4rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-lg'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[12px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Temporada
                </p>
                <h2 className={`mt-2 text-[28px] font-black leading-none md:text-[34px] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                  Rotas do Horizonte
                </h2>
                <p className={`mt-2 max-w-xl text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Missões semanais, milestones continentais e upgrades persistentes impulsionam seu progresso.
                </p>
              </div>
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.6rem] border md:h-20 md:w-20 ${
                  isDarkMode ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-500'
                }`}
              >
                <Trophy size={30} strokeWidth={2.4} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className={`rounded-[1.5rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Nivel
                </span>
                <span className={`mt-2 block text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                  {seasonProgress.level}
                </span>
              </div>
              <div className={`rounded-[1.5rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  XP atual
                </span>
                <span className={`mt-2 block text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                  {seasonXp}
                </span>
              </div>
              <div className={`rounded-[1.5rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Streak diaria
                </span>
                <span className={`mt-2 block text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                  {dailyWinStreak}
                </span>
              </div>
              <div className={`rounded-[1.5rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Streak semanal
                </span>
                <span className={`mt-2 block text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                  {weeklyVoyageStreak}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Progresso do nivel
                </span>
                <span className={`text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  {seasonProgress.currentLevelXp}/{seasonProgress.currentLevelTarget}
                </span>
              </div>
              <div className={`h-3 overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-sky-100'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isDarkMode ? 'bg-amber-400' : 'bg-sky-500'}`}
                  style={{ width: `${seasonProgress.progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className={`rounded-[2.1rem] border p-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-lg'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-[12px] font-black uppercase tracking-[0.22em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Evento ativo
                  </p>
                  <h3 className={`mt-2 text-[22px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                    {activeEvent?.title || 'Janela de rota'}
                  </h3>
                </div>
                <div className={`rounded-full border p-3 ${getToneClasses(activeEvent?.tone, isDarkMode)}`}>
                  <Sparkles size={18} />
                </div>
              </div>
              <p className={`mt-3 text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                {activeEvent?.description || 'Bonificadores semanais aparecem aqui conforme a rotação global.'}
              </p>
              <div className={`mt-4 inline-flex rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${getToneClasses(activeEvent?.tone, isDarkMode)}`}>
                {activeEvent?.rewardLabel || 'Bonus semanal'}
              </div>
            </div>

            <div className={`rounded-[2.1rem] border p-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-lg'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-[12px] font-black uppercase tracking-[0.22em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Dica inteligente
                  </p>
                  <h3 className={`mt-2 text-[20px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                    {coachTip.title}
                  </h3>
                </div>
                <div className={`rounded-full border p-3 ${getToneClasses(coachTip.tone, isDarkMode)}`}>
                  <Radar size={18} />
                </div>
              </div>
              <p className={`mt-3 text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                {coachTip.description}
              </p>
              {(typeof coachTip.accuracy === 'number' || typeof coachTip.winRate === 'number') && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {typeof coachTip.accuracy === 'number' && (
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getToneClasses(coachTip.tone, isDarkMode)}`}>
                      Acerto {Math.round(coachTip.accuracy * 100)}%
                    </span>
                  )}
                  {typeof coachTip.winRate === 'number' && (
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'border-white/10 text-slate-300' : 'border-sky-100 text-sky-700'}`}>
                      Vitorias {Math.round(coachTip.winRate * 100)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className={`rounded-[2.2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-lg'}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`rounded-full border p-3 ${isDarkMode ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-600'}`}>
                  <Target size={18} />
                </div>
                <div>
                  <p className={`text-[12px] font-black uppercase tracking-[0.22em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Missoes da semana
                  </p>
                  <h3 className={`text-[20px] font-black ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                    {completedMissions}/3 concluidas
                  </h3>
                </div>
              </div>
              <div className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'border-white/10 text-slate-300' : 'border-sky-100 text-sky-700'}`}>
                Reset semanal
              </div>
            </div>

            <div className="grid gap-3">
              {safeMissions.map((mission) => (
                <MissionRow key={mission.id} mission={mission} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className={`rounded-[2.2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-lg'}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-full border p-3 ${isDarkMode ? 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300' : 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600'}`}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className={`text-[12px] font-black uppercase tracking-[0.22em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Dominio continental
                  </p>
                  <h3 className={`text-[20px] font-black ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                    Mastery viva
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {masteryEntries.map((entry) => (
                  <MasteryBar key={entry.continent} entry={entry} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>

            <div className={`rounded-[2.2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-lg'}`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full border p-3 ${isDarkMode ? 'border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-600'}`}>
                    <Gem size={18} />
                  </div>
                  <div>
                    <p className={`text-[12px] font-black uppercase tracking-[0.22em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                      Rota persistente
                    </p>
                    <h3 className={`text-[20px] font-black ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                      Upgrades
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenShop}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition-all active:scale-[0.98] ${
                    isDarkMode
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400/50'
                      : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <ArrowUpCircle size={14} />
                  Melhorar
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <UpgradeCapsule label="XP" level={safeRouteUpgrades.atlasPass} isDarkMode={isDarkMode} />
                <UpgradeCapsule label="Tempo" level={safeRouteUpgrades.relayCore} isDarkMode={isDarkMode} />
                <UpgradeCapsule label="Moedas" level={safeRouteUpgrades.treasureRadar} isDarkMode={isDarkMode} />
              </div>

              <div className={`mt-4 rounded-[1.5rem] border px-4 py-3 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <div className="flex items-center gap-2">
                  <Compass className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} size={16} />
                  <span className={`text-[11px] font-black uppercase tracking-[0.16em] ${isDarkMode ? 'text-slate-300' : 'text-sky-900'}`}>
                    Economia de longo prazo
                  </span>
                </div>
                <p className={`mt-2 text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Upgrades permanentes potencializam temporada, tempo inicial e ganho de moedas sem quebrar o loop atual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CommandCenter);
