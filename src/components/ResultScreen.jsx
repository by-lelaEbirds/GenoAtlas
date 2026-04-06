import React, { useState } from 'react';
import { RefreshCw, Home, Trophy, Coins, Clock, MapPin, Share2, Check, Sparkles } from 'lucide-react';

export default function ResultScreen({
  score,
  previousBestScore,
  guessedCount,
  reason,
  onRestart,
  onHome,
  onClaimDoubleCoins,
  canClaimDoubleCoins,
  coinsEarned,
  gameMode,
  sessionRewardSummary,
  isDarkMode,
}) {
  const [copied, setCopied] = useState(false);
  const isNewRecord = score > previousBestScore && score > 0 && (gameMode === 'normal' || gameMode === 'football');

  const getReasonText = () => {
    switch (reason) {
      case 'lives':
        return 'Fim da Linha!';
      case 'time':
        return 'Tempo Esgotado!';
      case 'win':
        return 'Globo Zerado!';
      case 'daily_win':
        return 'Desafio Concluido!';
      case 'daily_loss':
        return 'Falhou no Diario.';
      default:
        return 'Fim de Jogo';
    }
  };

  const getReasonIcon = () => {
    switch (reason) {
      case 'lives':
        return <MapPin className={isDarkMode ? 'text-rose-400' : 'text-rose-500'} size={48} strokeWidth={2.5} />;
      case 'time':
        return <Clock className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} size={48} strokeWidth={2.5} />;
      case 'win':
      case 'daily_win':
        return <Trophy className={isDarkMode ? 'text-amber-400' : 'text-amber-500'} size={48} strokeWidth={2.5} />;
      default:
        return <MapPin className={isDarkMode ? 'text-slate-400' : 'text-stone-500'} size={48} strokeWidth={2.5} />;
    }
  };

  const getHeaderColor = () => {
    if (reason === 'win' || reason === 'daily_win') {
      return isDarkMode ? 'glass-panel neon-glow-amber border-amber-500/30' : 'glass-panel-light ring-4 ring-amber-200';
    }

    if (reason === 'time') {
      return isDarkMode ? 'glass-panel neon-glow-cyan border-cyan-500/30' : 'glass-panel-light ring-4 ring-sky-200';
    }

    return isDarkMode ? 'glass-panel neon-glow-rose border-rose-500/30' : 'glass-panel-light ring-4 ring-rose-200';
  };

  const handleShare = async () => {
    const modeText = gameMode === 'football' ? 'clubes de futebol' : 'paises';
    const shareText = `Fiz ${score} pontos e encontrei ${guessedCount} ${modeText} no GenoAtlas!`;
    const shareUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href;
    const fullText = `${shareText} ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Meu Recorde', text: shareText, url: shareUrl });
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Falha ao copiar para a area de transferencia', error);
    }
  };

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center overflow-y-auto custom-scrollbar px-4 py-10 md:px-6 ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} animate-fade-in-up`}>
      <section role="dialog" aria-modal="true" aria-labelledby="result-title" className={`${isDarkMode ? 'glass-panel shadow-[0_30px_60px_rgba(0,0,0,0.8)]' : 'glass-panel-light shadow-2xl'} relative my-auto flex w-full max-w-lg flex-col rounded-[3rem] p-6 text-center md:rounded-[4rem] md:p-10`}>
        {isNewRecord && (
          <div role="status" className="absolute -top-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border-[4px] border-white bg-amber-400 px-6 py-2 text-sm font-black uppercase tracking-widest text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] md:text-base animate-bounce-short">
            <Sparkles size={18} />
            Novo Recorde!
            <Sparkles size={18} />
          </div>
        )}

        <header className="mb-8 flex flex-col items-center pt-4">
          <div aria-hidden="true" className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full border-[6px] shadow-inner ${getHeaderColor()}`}>
            {getReasonIcon()}
          </div>
          <h2 id="result-title" className={`text-[32px] font-black uppercase tracking-tighter leading-none md:text-[40px] ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
            {getReasonText()}
          </h2>
        </header>

        <div className="mb-8 space-y-4">
          <div className={`flex items-center justify-between rounded-[2rem] p-6 transition-all ${isDarkMode ? 'glass-panel border-white/5' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
            <span className={`text-[16px] font-black uppercase tracking-widest md:text-[20px] ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Pontuacao</span>
            <span aria-label={`Sua pontuacao foi de ${score} pontos`} className={`text-[36px] font-black tracking-tighter leading-none md:text-[48px] ${isNewRecord ? 'text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse-glow' : (isDarkMode ? 'text-white' : 'text-stone-800')}`}>
              {score}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`flex flex-col items-center justify-center rounded-[2rem] p-4 transition-all ${isDarkMode ? 'glass-panel border-white/5' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
              <span className={`mb-1 text-[12px] font-black uppercase tracking-widest md:text-[14px] ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Acertos</span>
              <span aria-label={`Voce acertou ${guessedCount} vezes`} className={`text-[28px] font-bold leading-none md:text-[36px] ${isDarkMode ? 'text-white drop-shadow-sm' : 'text-stone-800'}`}>
                {guessedCount}
              </span>
            </div>

            <div className={`flex flex-col items-center justify-center rounded-[2rem] p-4 transition-all ${isDarkMode ? 'glass-panel border-white/5' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
              <span className={`mb-1 text-[12px] font-black uppercase tracking-widest md:text-[14px] ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Moedas</span>
              <div className="flex items-center gap-2">
                <Coins aria-hidden="true" size={24} className="text-amber-400 drop-shadow-md md:h-7 md:w-7" />
                <span aria-label={`Ganhou ${coinsEarned} moedas`} className="text-[28px] font-bold leading-none text-amber-500 drop-shadow-sm md:text-[36px]">
                  +{coinsEarned}
                </span>
              </div>
            </div>
          </div>

          {sessionRewardSummary && (
            <div className={`rounded-[2rem] border p-5 text-left ${isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <span className={`block text-[12px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>
                    Resumo semanal
                  </span>
                  <span className={`mt-2 block text-[24px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                    +{(sessionRewardSummary.missionCoinsBonus || 0) + (sessionRewardSummary.milestoneCoinsBonus || 0)} moedas extras
                  </span>
                </div>
                <div className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-700 shadow-[0_0_16px_rgba(34,211,238,0.16)]">
                  {sessionRewardSummary.completedMissions?.length || 0} missões
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className={`rounded-[1.35rem] border p-3 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-stone-100'}`}>
                  <span className={`block text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Operacao da semana
                  </span>
                  <span className={`mt-1 block text-[15px] font-black leading-snug ${isDarkMode ? 'text-cyan-300' : 'text-sky-700'}`}>
                    {sessionRewardSummary.activeEvent?.title || 'Rota estavel'}
                  </span>
                  <span className={`mt-1 block text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    {sessionRewardSummary.eventCoinBonus > 0
                      ? `+${sessionRewardSummary.eventCoinBonus} moedas da operacao`
                      : sessionRewardSummary.activeEvent?.rewardLabel || 'Sem bonus rotativo nesta sessao.'}
                  </span>
                </div>

                <div className={`rounded-[1.35rem] border p-3 ${isDarkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/80 border-stone-100'}`}>
                  <span className={`block text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    Precisao
                  </span>
                  <span className={`mt-1 block text-[15px] font-black leading-snug ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    {sessionRewardSummary.accuracy}%
                  </span>
                  <span className={`mt-1 block text-[12px] font-bold leading-snug ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                    {sessionRewardSummary.coachTip?.title || 'Rotina de navegacao'}
                  </span>
                </div>
              </div>

              {(sessionRewardSummary.completedMissions?.length > 0 || sessionRewardSummary.continentMilestones?.length > 0) && (
                <div className="mt-4 space-y-2">
                  {sessionRewardSummary.completedMissions?.map((mission) => (
                    <div key={mission.id} className={`rounded-[1.1rem] border px-4 py-3 ${isDarkMode ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                      <span className="block text-[11px] font-black uppercase tracking-widest">Missao concluida</span>
                      <span className="mt-1 block text-[14px] font-black leading-snug">{mission.title}</span>
                    </div>
                  ))}

                  {sessionRewardSummary.continentMilestones?.map((milestone) => (
                    <div key={`${milestone.continent}-${milestone.target}`} className={`rounded-[1.1rem] border px-4 py-3 ${isDarkMode ? 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200' : 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'}`}>
                      <span className="block text-[11px] font-black uppercase tracking-widest">Milestone continental</span>
                      <span className="mt-1 block text-[14px] font-black leading-snug">
                        {milestone.continent} alcancou {milestone.target} descobertas
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <nav aria-label="Acoes de fim de jogo" className="flex flex-col gap-4">
          {canClaimDoubleCoins && (
            <button
              onClick={onClaimDoubleCoins}
              className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-amber-400 py-5 text-[17px] font-black uppercase tracking-widest text-amber-950 transition-all hover:bg-amber-300 md:text-[20px] neon-glow-amber"
            >
              <Coins aria-hidden="true" size={24} />
              Assistir e dobrar moedas
            </button>
          )}

          <button onClick={handleShare} className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-cyan-500/90 py-5 text-[18px] font-black uppercase tracking-widest text-white transition-all hover:bg-cyan-400 md:text-[22px] neon-glow-cyan">
            {copied ? <Check aria-hidden="true" size={28} className="fill-current" /> : <Share2 aria-hidden="true" size={28} className="fill-current" />}
            {copied ? 'Copiado!' : 'Desafiar Amigos'}
          </button>

          <div className="flex gap-4">
            {gameMode !== 'daily' && (
              <button onClick={onRestart} className="flex flex-1 flex-col items-center justify-center gap-1 rounded-[2rem] bg-emerald-500/90 py-5 text-[16px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-400 md:text-[20px] neon-glow-emerald">
                <RefreshCw aria-hidden="true" size={24} />
                Rejogar
              </button>
            )}

            <button onClick={onHome} className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-[2rem] border py-5 text-[16px] font-black uppercase tracking-widest transition-all md:text-[20px] ${isDarkMode ? 'glass-panel text-slate-300 hover:bg-white/10 hover:text-white' : 'glass-panel-light text-stone-600 hover:bg-stone-100'}`}>
              <Home aria-hidden="true" size={24} />
              Menu
            </button>
          </div>
        </nav>
      </section>
    </div>
  );
}
