import React from 'react';

const PROGRESS_BORDER = {
  light: 'border-stone-200 bg-white/80 text-stone-700',
  dark: 'border-white/10 bg-white/5 text-white/80',
};

export default function WeeklyPulseCard({ activeEvent, missions = [], isDarkMode }) {
  const availableMissions = missions.length ? missions.slice(0, 4) : [];

  return (
    <section
      className={`relative overflow-hidden rounded-[2.5rem] border px-5 py-6 shadow-[0_30px_60px_rgba(2,6,23,0.15)] ${
        isDarkMode ? 'glass-panel border-white/15' : 'glass-panel-light border-white/70'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-slate-400">Rotação semanal</p>
          <h3 className={`text-[28px] font-black uppercase tracking-[0.08em] ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
            {activeEvent?.title ?? 'Radar semanal'}
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.32em] ${
            isDarkMode ? 'border-white/20 text-white/80' : 'border-stone-200 text-stone-500'
          }`}
        >
          {activeEvent?.focus ?? 'Foco livre'}
        </span>
      </div>

      <p className={`mt-3 text-[13px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
        {activeEvent?.description ?? 'Acompanhe os desafios abertos e garanta bônus extras ao fechar a semana.'}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(activeEvent?.bestModes || ['Normal']).map((mode) => (
          <span
            key={mode}
            className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 border-sky-300 bg-sky-50"
          >
            {mode}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {availableMissions.length ? (
          availableMissions.map((mission) => {
            const pct = mission.target
              ? Math.min((mission.progress / mission.target) * 100, 100)
              : mission.completed
                ? 100
                : 0;

            return (
              <div
                key={mission.id}
                className={`flex flex-col gap-2 rounded-[1.8rem] border px-4 py-3 ${isDarkMode ? PROGRESS_BORDER.dark : PROGRESS_BORDER.light}`}
              >
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em]">
                  <span>{mission.title}</span>
                  <span>{mission.completed ? 'Concluída' : `${Math.round(pct)}%`}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] leading-snug text-current/70">{mission.description}</p>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                  +{mission.rewardCoins ?? 0} moedas
                </span>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 rounded-[1.8rem] border p-4 text-center text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">
            Missões carregando...
          </div>
        )}
      </div>
    </section>
  );
}
