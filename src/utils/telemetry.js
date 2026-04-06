export function createDefaultTelemetry() {
  return {
    totalSessions: 0,
    totalWins: 0,
    totalLosses: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalSkips: 0,
    totalFreezes: 0,
    totalRevives: 0,
    totalRewardedRevives: 0,
    totalDoubleCoinClaims: 0,
    totalInterstitials: 0,
    totalRewardedAds: 0,
    totalSessionTimeMs: 0,
    recentRuns: [],
  };
}

function clampRecentRuns(recentRuns) {
  return recentRuns.slice(-8);
}

export function ensureTelemetry(rawTelemetry) {
  return {
    ...createDefaultTelemetry(),
    ...rawTelemetry,
    recentRuns: Array.isArray(rawTelemetry?.recentRuns) ? clampRecentRuns(rawTelemetry.recentRuns) : [],
  };
}

export function recordRunTelemetry(telemetry, summary) {
  const nextTelemetry = ensureTelemetry(telemetry);
  const won = ['win', 'daily_win'].includes(summary.reason);

  nextTelemetry.totalSessions += 1;
  nextTelemetry.totalWins += won ? 1 : 0;
  nextTelemetry.totalLosses += won ? 0 : 1;
  nextTelemetry.totalCorrect += summary.correctAnswers;
  nextTelemetry.totalWrong += summary.wrongAnswers;
  nextTelemetry.totalSkips += summary.skippedCount;
  nextTelemetry.totalFreezes += summary.freezeUses;
  nextTelemetry.totalRevives += summary.reviveUses;
  nextTelemetry.totalSessionTimeMs += summary.durationMs;
  nextTelemetry.recentRuns = clampRecentRuns([
    ...nextTelemetry.recentRuns,
    {
      mode: summary.mode,
      reason: summary.reason,
      correctAnswers: summary.correctAnswers,
      wrongAnswers: summary.wrongAnswers,
      maxStreak: summary.maxStreak,
      durationMs: summary.durationMs,
      timestamp: Date.now(),
    },
  ]);

  return nextTelemetry;
}

export function recordTelemetryCounter(telemetry, counterName, increment = 1) {
  const nextTelemetry = ensureTelemetry(telemetry);
  nextTelemetry[counterName] = (nextTelemetry[counterName] || 0) + increment;
  return nextTelemetry;
}

export function getTelemetryInsight(telemetry) {
  const safeTelemetry = ensureTelemetry(telemetry);
  const totalAttempts = safeTelemetry.totalCorrect + safeTelemetry.totalWrong;
  const accuracy = totalAttempts > 0 ? safeTelemetry.totalCorrect / totalAttempts : 0;
  const winRate = safeTelemetry.totalSessions > 0 ? safeTelemetry.totalWins / safeTelemetry.totalSessions : 0;
  const recentRun = safeTelemetry.recentRuns[safeTelemetry.recentRuns.length - 1];

  if (safeTelemetry.totalSessions < 3) {
    return {
      title: 'Primeiras rotas',
      description: 'Use o modo estudo para aquecer memoria visual e ganhar consistencia antes das corridas completas.',
      tone: 'sky',
      accuracy,
      winRate,
    };
  }

  if (accuracy < 0.55) {
    return {
      title: 'Janela de treino',
      description: 'Sua taxa de acerto ainda esta baixa. Vale alternar 1 rodada de estudo para cada 2 rodadas normais.',
      tone: 'rose',
      accuracy,
      winRate,
    };
  }

  if (recentRun?.maxStreak >= 6 || accuracy >= 0.8) {
    return {
      title: 'Motor aquecido',
      description: 'Seu ritmo esta forte. Priorize missoes de combo e rotas continentais para maximizar moedas e progresso semanal.',
      tone: 'emerald',
      accuracy,
      winRate,
    };
  }

  return {
    title: 'Ritmo consistente',
    description: 'Voce esta evoluindo bem. Misture futebol e diario para diversificar missoes e aproveitar melhor cada semana.',
    tone: 'amber',
    accuracy,
    winRate,
  };
}
