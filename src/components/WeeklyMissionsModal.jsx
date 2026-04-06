import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Coins, Compass, Flame, Sparkles, Target, TrendingUp, X } from 'lucide-react';

function getToneClasses(tone, isDarkMode) {
  if (isDarkMode) {
    switch (tone) {
      case 'emerald':
        return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200';
      case 'amber':
      case 'orange':
        return 'border-amber-500/25 bg-amber-500/10 text-amber-200';
      case 'rose':
        return 'border-rose-500/25 bg-rose-500/10 text-rose-200';
      case 'indigo':
        return 'border-indigo-500/25 bg-indigo-500/10 text-indigo-200';
      case 'fuchsia':
        return 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200';
      default:
        return 'border-cyan-500/25 bg-cyan-500/10 text-cyan-200';
    }
  }

  switch (tone) {
    case 'emerald':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'amber':
    case 'orange':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'rose':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case 'indigo':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700';
    case 'fuchsia':
      return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700';
    default:
      return 'border-sky-200 bg-sky-50 text-sky-700';
  }
}

function MissionCard({ mission, isDarkMode }) {
  const progressPct = Math.min((mission.progress / mission.target) * 100, 100);

  return (
    <article className={`rounded-[1.8rem] border p-4 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className={`text-[14px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
            {mission.title}
          </p>
          <p className={`mt-1 text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
            {mission.description}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${getToneClasses(mission.tone, isDarkMode)}`}>
          +{mission.rewardCoins}
        </span>
      </div>

      <div className={`h-2 overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-sky-100'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${mission.completed ? 'bg-emerald-400' : 'bg-sky-500'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[11px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
          {mission.progress}/{mission.target}
        </span>
        <span className={`text-[11px] font-black uppercase tracking-[0.14em] ${mission.completed ? 'text-emerald-500' : isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
          {mission.completed ? 'Concluida' : 'Em andamento'}
        </span>
      </div>
    </article>
  );
}

export default function WeeklyMissionsModal({
  onClose,
  weeklyRotation,
  weeklyMissions,
  weeklyRotationPreview,
  dailyWinStreak,
  weeklyVoyageStreak,
  coachTip,
  isDarkMode,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const safeMissions = weeklyMissions || [];
  const safePreview = weeklyRotationPreview || [];

  const missionStats = useMemo(() => {
    const completed = safeMissions.filter((mission) => mission.completed).length;
    const remainingCoins = safeMissions
      .filter((mission) => !mission.completed)
      .reduce((total, mission) => total + (mission.rewardCoins || 0), 0);

    return {
      total: safeMissions.length,
      completed,
      remaining: Math.max(safeMissions.length - completed, 0),
      remainingCoins,
    };
  }, [safeMissions]);

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(onClose, 200);
  };

  return (
    <div
      className={`absolute inset-0 z-[220] flex items-center justify-center overflow-y-auto px-4 py-6 custom-scrollbar backdrop-blur-md ${
        isDarkMode ? 'bg-black/85' : 'bg-stone-900/80'
      } ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="weekly-missions-title"
        className={`relative flex max-h-[88dvh] w-full max-w-4xl flex-col rounded-[2.8rem] p-6 md:rounded-[4rem] md:p-10 ${
          isDarkMode ? 'glass-panel border border-white/10' : 'glass-panel-light border border-white shadow-2xl'
        } ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar missoes semanais"
          className={`absolute right-6 top-6 rounded-full p-3 transition-colors md:right-8 md:top-8 ${
            isDarkMode
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-400'
              : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-rose-500'
          }`}
        >
          <X size={28} strokeWidth={3} />
        </button>

        <div className="mb-6 flex items-start justify-between gap-4 pr-14 md:mb-8">
          <div>
            <p className={`text-[12px] font-black uppercase tracking-[0.28em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
              Centro semanal
            </p>
            <h2 id="weekly-missions-title" className={`mt-2 text-[30px] font-black leading-none tracking-tight md:text-[42px] ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
              Missoes da semana
            </h2>
            <p className={`mt-3 max-w-2xl text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
              Aqui fica toda a rotacao semanal. Toda segunda entra uma nova operacao com 4 missoes, o progresso salva sozinho e o foco muda para manter o jogo variado.
            </p>
          </div>

          <div className={`hidden h-20 w-20 shrink-0 items-center justify-center rounded-[1.8rem] border md:flex ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}>
            <Target size={30} strokeWidth={2.4} />
          </div>
        </div>

        <div className="scroll-surface custom-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto pr-1 md:pr-2">
          <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className={`rounded-[2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}>
                    Operacao ativa
                  </div>
                  <h3 className={`mt-3 text-[24px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                    {weeklyRotation?.title || 'Rotacao semanal'}
                  </h3>
                  <p className={`mt-2 text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    {weeklyRotation?.description || 'As missoes desta semana aparecem aqui.'}
                  </p>
                </div>
                <div className={`rounded-full border p-3 ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}>
                  <Compass size={18} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={`rounded-[1.4rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Foco
                  </span>
                  <span className={`mt-2 block text-[16px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                    {weeklyRotation?.focus || 'Rotina'}
                  </span>
                </div>

                <div className={`rounded-[1.4rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Concluidas
                  </span>
                  <span className={`mt-2 block text-[16px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                    {missionStats.completed}/{missionStats.total}
                  </span>
                </div>

                <div className={`rounded-[1.4rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Moedas abertas
                  </span>
                  <span className={`mt-2 block text-[16px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                    +{missionStats.remainingCoins}
                  </span>
                </div>

                <div className={`rounded-[1.4rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Abertas
                  </span>
                  <span className={`mt-2 block text-[16px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                    {missionStats.remaining}
                  </span>
                </div>
              </div>

              <div className={`mt-4 rounded-[1.6rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Como funciona
                </span>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <CalendarDays className={isDarkMode ? 'text-cyan-300' : 'text-sky-500'} size={18} />
                    <p className={`text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-300' : 'text-stone-600'}`}>
                      A operacao vira automaticamente toda semana.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={isDarkMode ? 'text-emerald-300' : 'text-emerald-500'} size={18} />
                    <p className={`text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-300' : 'text-stone-600'}`}>
                      Cada missao concluida entrega moedas direto na conta.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className={isDarkMode ? 'text-amber-300' : 'text-amber-500'} size={18} />
                    <p className={`text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-300' : 'text-stone-600'}`}>
                      Cada semana muda o estilo ideal de jogo para evitar repeticao.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className={`rounded-[2rem] border p-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                      Leitura rapida
                    </p>
                    <h3 className={`mt-2 text-[20px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                      {coachTip?.title || 'Radar da semana'}
                    </h3>
                  </div>
                  <div className={`rounded-full border p-3 ${getToneClasses(coachTip?.tone, isDarkMode)}`}>
                    <TrendingUp size={18} />
                  </div>
                </div>
                <p className={`mt-3 text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  {coachTip?.description || 'Seu progresso e a melhor direcao da semana aparecem aqui em linguagem simples.'}
                </p>
              </div>

              <div className={`rounded-[2rem] border p-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                      Bonus da semana
                    </p>
                    <h3 className={`mt-2 text-[20px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                      {weeklyRotation?.rewardLabel || 'Semana viva'}
                    </h3>
                  </div>
                  <div className={`rounded-full border p-3 ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}>
                    <Flame size={18} />
                  </div>
                </div>
                <p className={`mt-3 text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Alem das missoes, esta operacao favorece um estilo de jogo especifico. Se voce seguir esse foco, conclui mais rapido e ganha mais moeda.
                </p>
              </div>

              <div className={`rounded-[2rem] border p-5 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                      Sinais da conta
                    </p>
                    <h3 className={`mt-2 text-[20px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                      Diario: {dailyWinStreak} | Semana: {weeklyVoyageStreak}
                    </h3>
                  </div>
                  <div className={`rounded-full border p-3 ${isDarkMode ? 'border-white/10 text-slate-300' : 'border-sky-100 text-sky-700'}`}>
                    <Coins size={18} />
                  </div>
                </div>
                <p className={`mt-3 text-[13px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Sua streak diaria mostra constancia. O ritmo semanal mostra quantas semanas voce manteve atividade sem quebrar a jornada.
                </p>
              </div>
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Plano simples
                </p>
                <h3 className={`mt-1 text-[22px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                  Como fechar esta semana sem duvida
                </h3>
              </div>
              <div className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}>
                {weeklyRotation?.focus || 'Rota ativa'}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className={`rounded-[1.6rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Modos que mais ajudam
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(weeklyRotation?.bestModes || ['Normal']).map((mode) => (
                    <span
                      key={mode}
                      className={`rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`rounded-[1.6rem] border p-4 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-sky-100'}`}>
                <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Roteiro recomendado
                </span>
                <div className="mt-3 grid gap-3">
                  {(weeklyRotation?.guide || []).map((step, index) => (
                    <div key={`${index}-${step}`} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${getToneClasses(weeklyRotation?.tone, isDarkMode)}`}>
                        {index + 1}
                      </div>
                      <p className={`text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-300' : 'text-stone-600'}`}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={`rounded-[2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Missoes ativas
                </p>
                <h3 className={`mt-1 text-[22px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                  4 objetivos claros e acumulativos
                </h3>
              </div>
              <div className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'border-white/10 text-slate-300' : 'border-sky-100 text-sky-700'}`}>
                Auto salvo
              </div>
            </div>

            {safeMissions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {safeMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} isDarkMode={isDarkMode} />
                ))}
              </div>
            ) : (
              <div className={`rounded-[1.6rem] border p-5 text-center ${isDarkMode ? 'bg-slate-900/70 border-white/10 text-slate-300' : 'bg-white/80 border-sky-100 text-stone-600'}`}>
                As missoes desta semana vao aparecer aqui assim que a operacao for carregada.
              </div>
            )}
          </section>

          <section className={`rounded-[2rem] border p-5 md:p-6 ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-white shadow-sm'}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  Agenda de rotacao
                </p>
                <h3 className={`mt-1 text-[22px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-sky-950'}`}>
                  8 semanas planejadas
                </h3>
              </div>
              <div className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${isDarkMode ? 'border-white/10 text-slate-300' : 'border-sky-100 text-sky-700'}`}>
                Longa rotacao
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {safePreview.map((rotation) => (
                <article
                  key={rotation.weekKey}
                  className={`rounded-[1.5rem] border p-4 ${
                    rotation.isCurrent
                      ? getToneClasses(rotation.tone, isDarkMode)
                      : isDarkMode
                        ? 'glass-panel border-white/10 text-slate-200'
                        : 'glass-panel-light border-white text-sky-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                      {rotation.positionLabel}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                      {rotation.rangeLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-[16px] font-black leading-tight">{rotation.title}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] opacity-80">{rotation.focus}</p>
                  <p className={`mt-2 text-[12px] font-bold leading-snug ${rotation.isCurrent ? 'opacity-90' : isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    {rotation.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
