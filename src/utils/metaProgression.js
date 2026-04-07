import {
  CONTINENT_KEYS,
  CONTINENT_MILESTONES,
  DEFAULT_ROUTE_UPGRADES,
  WEEKLY_ROTATION_BLUEPRINTS,
} from '../constants/metaProgression';

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function parseLocalDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map((part) => Number(part));
  return new Date(year, month - 1, day);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekRange(dateKey) {
  const date = parseLocalDateKey(dateKey);
  const normalizedDay = date.getDay() === 0 ? 7 : date.getDay();
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - normalizedDay + 1);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

function formatWeekRangeLabel(dateKey) {
  const { weekStart, weekEnd } = getWeekRange(dateKey);
  const monthLabels = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const startDay = String(weekStart.getDate()).padStart(2, '0');
  const endDay = String(weekEnd.getDate()).padStart(2, '0');
  const startMonth = monthLabels[weekStart.getMonth()];
  const endMonth = monthLabels[weekEnd.getMonth()];

  if (startMonth === endMonth) {
    return `${startDay}-${endDay} ${startMonth}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
}

function shiftDateKeyByWeeks(dateKey, weeksToAdd) {
  const date = parseLocalDateKey(dateKey);
  date.setDate(date.getDate() + (weeksToAdd * 7));
  return formatDateKey(date);
}

function parseWeekKey(weekKey) {
  const [year, rawWeek] = weekKey.split('-W');
  return {
    year: Number(year),
    week: Number(rawWeek),
  };
}

function getAbsoluteWeekIndex(weekKey) {
  const parsed = parseWeekKey(weekKey);
  return (parsed.year * 53) + parsed.week;
}

function createEmptyContinentMastery() {
  return CONTINENT_KEYS.reduce((accumulator, continent) => {
    accumulator[continent] = {
      discovered: [],
      totalCorrect: 0,
      milestonesClaimed: [],
    };
    return accumulator;
  }, {});
}

function getMissionRewardMultiplier(routeUpgrades) {
  return 1;
}

function formatContinentLabel(continent) {
  switch (continent) {
    case 'Americas':
      return 'Américas';
    case 'Europe':
      return 'Europa';
    case 'Africa':
      return 'África';
    case 'Asia':
      return 'Ásia';
    case 'Oceania':
      return 'Oceania';
    default:
      return continent;
  }
}

function getMissionTypeConfig(type) {
  switch (type) {
    case 'combo_chain':
    case 'score_peak':
      return { progressMode: 'max' };
    default:
      return { progressMode: 'sum' };
  }
}

function buildMissionCopy(type, target, continent) {
  switch (type) {
    case 'complete_runs':
      return {
        title: 'Feche partidas',
        description: `Conclua ${target} partidas em qualquer modo.`,
      };
    case 'correct_answers':
      return {
        title: 'Empilhe acertos',
        description: `Some ${target} acertos ao longo da semana.`,
      };
    case 'study_sessions':
      return {
        title: 'Treino guiado',
        description: `Finalize ${target} sessões no modo estudo.`,
      };
    case 'daily_wins':
      return {
        title: 'Pulso diário',
        description: `Vença o desafio diário ${target} vez${target > 1 ? 'es' : ''}.`,
      };
    case 'football_wins':
      return {
        title: 'Gramados no radar',
        description: `Conclua ${target} corrida${target > 1 ? 's' : ''} no modo futebol.`,
      };
    case 'perfect_runs':
      return {
        title: 'Rota limpa',
        description: `Feche ${target} partida${target > 1 ? 's' : ''} sem errar.`,
      };
    case 'combo_chain':
      return {
        title: 'Combo da semana',
        description: `Alcance combo ${target} em uma única partida.`,
      };
    case 'continent_hits':
      return {
        title: `${formatContinentLabel(continent)} em foco`,
        description: `Acumule ${target} acertos em ${formatContinentLabel(continent)}.`,
      };
    case 'disciplined_runs':
      return {
        title: 'Sem pular rota',
        description: `Conclua ${target} partida${target > 1 ? 's' : ''} sem usar PULAR.`,
      };
    case 'no_revive_runs':
      return {
        title: 'Sem segunda chance',
        description: `Finalize ${target} partida${target > 1 ? 's' : ''} sem reviver.`,
      };
    case 'score_peak':
      return {
        title: 'Marca de pontuação',
        description: `Atinga ${target.toLocaleString('pt-BR')} pontos em uma única partida.`,
      };
    case 'coin_haul':
      return {
        title: 'Coleta semanal',
        description: `Ganhe ${target.toLocaleString('pt-BR')} moedas ao longo da semana.`,
      };
    default:
      return {
        title: 'Missão ativa',
        description: 'Avance jogando para completar esta missão.',
      };
  }
}

function getMissionRewardCoins(type, target, index) {
  const baseMap = {
    complete_runs: 150,
    correct_answers: 180,
    study_sessions: 160,
    daily_wins: 220,
    football_wins: 210,
    perfect_runs: 240,
    combo_chain: 230,
    continent_hits: 170,
    disciplined_runs: 190,
    no_revive_runs: 210,
    score_peak: 240,
    coin_haul: 260,
  };

  const baseValue = baseMap[type] || 160;
  const scaling = Math.round(target * 4.5);
  return baseValue + scaling + (index * 18);
}

function createMissionProgressEntry(mission) {
  return {
    ...mission,
    progress: 0,
    completed: false,
    completedAt: null,
  };
}

function buildMissionFromSlot(rotation, slot, slotIndex, weekKey) {
  const seed = hashString(`${rotation.id}-${weekKey}-${slotIndex}`);
  const targetOptions = slot.targetOptions || [1];
  const target = targetOptions[seed % targetOptions.length];
  const { title, description } = buildMissionCopy(slot.type, target, slot.continent);

  return createMissionProgressEntry({
    id: `${rotation.id}-${slot.type}-${slot.continent || 'global'}-${slotIndex}`,
    type: slot.type,
    target,
    continent: slot.continent,
    title,
    description,
    rewardCoins: getMissionRewardCoins(slot.type, target, slotIndex),
    progressMode: getMissionTypeConfig(slot.type).progressMode,
    tone: rotation.tone,
  });
}

function buildWeeklyRotation(weekKey) {
  const blueprintIndex = getAbsoluteWeekIndex(weekKey) % WEEKLY_ROTATION_BLUEPRINTS.length;
  const blueprint = WEEKLY_ROTATION_BLUEPRINTS[blueprintIndex];

  return {
    id: `${blueprint.id}-${weekKey}`,
    title: blueprint.title,
    description: blueprint.description,
    tone: blueprint.tone,
    rewardLabel: blueprint.rewardLabel,
    focus: blueprint.focus,
    bestModes: blueprint.bestModes || [],
    guide: blueprint.guide || [],
    ...blueprint.bonusProfile,
    missions: blueprint.missionSlots.map((slot, slotIndex) => buildMissionFromSlot(blueprint, slot, slotIndex, weekKey)),
  };
}

export function createDefaultMetaProgress() {
  return {
    dailyWinStreak: 0,
    weeklyVoyageStreak: 0,
    lastDailyWinDate: null,
    lastActiveWeek: null,
    weekKey: null,
    weeklyMissions: [],
    weeklyRotation: null,
    continentMastery: createEmptyContinentMastery(),
  };
}

export function createDefaultRouteUpgrades() {
  return { ...DEFAULT_ROUTE_UPGRADES };
}

export function createDefaultSessionStats(mode) {
  return {
    mode,
    startedAt: Date.now(),
    correctAnswers: 0,
    wrongAnswers: 0,
    comboHits: 0,
    maxStreak: 0,
    skippedCount: 0,
    freezeUses: 0,
    reviveUses: 0,
    continentCorrect: {},
    guessedCountryIsos: [],
  };
}

export function normalizeContinent(continent) {
  if (!continent) return 'Americas';
  if (continent.includes('America')) return 'Americas';
  if (CONTINENT_KEYS.includes(continent)) return continent;
  return 'Americas';
}

export function getWeekKey(dateKey) {
  const date = parseLocalDateKey(dateKey);
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export function ensureWeeklyMissions(progress, dateKey) {
  const weekKey = getWeekKey(dateKey);
  if (progress.weekKey === weekKey && progress.weeklyMissions.length > 0 && progress.weeklyRotation) {
    return progress;
  }

  const rotation = buildWeeklyRotation(weekKey);
  return {
    ...progress,
    weekKey,
    weeklyRotation: {
      id: rotation.id,
      title: rotation.title,
      description: rotation.description,
      tone: rotation.tone,
      rewardLabel: rotation.rewardLabel,
      focus: rotation.focus,
      bestModes: rotation.bestModes,
      guide: rotation.guide,
      coinMultiplier: rotation.coinMultiplier,
      modeCoinMultipliers: rotation.modeCoinMultipliers,
      continentBonuses: rotation.continentBonuses,
      winBonusCoins: rotation.winBonusCoins,
    },
    weeklyMissions: rotation.missions,
  };
}

export function ensureMetaProgress(rawProgress, dateKey) {
  const base = createDefaultMetaProgress();
  const progress = {
    ...base,
    ...rawProgress,
    continentMastery: {
      ...base.continentMastery,
      ...(rawProgress?.continentMastery || {}),
    },
  };

  CONTINENT_KEYS.forEach((continent) => {
    const entry = progress.continentMastery[continent] || {};
    progress.continentMastery[continent] = {
      discovered: Array.isArray(entry.discovered) ? entry.discovered : [],
      totalCorrect: typeof entry.totalCorrect === 'number' ? entry.totalCorrect : 0,
      milestonesClaimed: Array.isArray(entry.milestonesClaimed) ? entry.milestonesClaimed : [],
    };
  });

  return ensureWeeklyMissions(progress, dateKey);
}

export function getActiveEvent(dateKey) {
  return ensureWeeklyMissions(createDefaultMetaProgress(), dateKey).weeklyRotation;
}

export function getWeeklyRotationPreview(dateKey, count = 8) {
  return Array.from({ length: count }, (_, index) => {
    const previewDateKey = shiftDateKeyByWeeks(dateKey, index);
    const weekKey = getWeekKey(previewDateKey);
    const rotation = getActiveEvent(previewDateKey);

    return {
      weekKey,
      title: rotation.title,
      description: rotation.description,
      tone: rotation.tone,
      focus: rotation.focus,
      rewardLabel: rotation.rewardLabel,
      bestModes: rotation.bestModes,
      guide: rotation.guide,
      rangeLabel: formatWeekRangeLabel(previewDateKey),
      positionLabel:
        index === 0
          ? 'Semana atual'
          : index === 1
            ? 'Proxima semana'
            : `Em ${index} semanas`,
      isCurrent: index === 0,
    };
  });
}

function getMissionIncrement(mission, summary) {
  switch (mission.type) {
    case 'complete_runs':
      return summary.correctAnswers > 0 ? 1 : 0;
    case 'correct_answers':
      return summary.correctAnswers;
    case 'study_sessions':
      return summary.mode === 'study' ? 1 : 0;
    case 'daily_wins':
      return summary.reason === 'daily_win' ? 1 : 0;
    case 'football_wins':
      return summary.mode === 'football' && summary.reason === 'win' ? 1 : 0;
    case 'perfect_runs':
      return summary.correctAnswers > 0 && summary.wrongAnswers === 0 ? 1 : 0;
    case 'combo_chain':
      return summary.maxStreak;
    case 'continent_hits':
      return summary.continentCorrect?.[mission.continent] || 0;
    case 'disciplined_runs':
      return summary.correctAnswers > 0 && summary.skippedCount === 0 ? 1 : 0;
    case 'no_revive_runs':
      return summary.correctAnswers > 0 && summary.reviveUses === 0 ? 1 : 0;
    case 'score_peak':
      return summary.score;
    case 'coin_haul':
      return summary.coinsEarned;
    default:
      return 0;
  }
}

export function applyMissionProgress(weeklyMissions, summary, completedAt, routeUpgrades) {
  let rewardCoins = 0;
  const completedNow = [];
  const rewardMultiplier = getMissionRewardMultiplier(routeUpgrades);

  const nextWeeklyMissions = weeklyMissions.map((mission) => {
    if (mission.completed) {
      return mission;
    }

    const increment = getMissionIncrement(mission, summary);
    const progress =
      mission.progressMode === 'max'
        ? Math.max(mission.progress, increment)
        : Math.min(mission.progress + increment, mission.target);
    const completed = progress >= mission.target;

    if (completed) {
      rewardCoins += Math.round(mission.rewardCoins * rewardMultiplier);
      completedNow.push({ ...mission, progress, completed: true });
    }

    return {
      ...mission,
      progress,
      completed,
      completedAt: completed ? completedAt : null,
    };
  });

  return {
    weeklyMissions: nextWeeklyMissions,
    rewardCoins,
    completedNow,
  };
}

export function applyEventBonuses(baseCoins, baseXp, summary, activeEvent) {
  if (!activeEvent) {
    return {
      finalCoins: baseCoins,
      finalXp: baseXp,
      bonusCoins: 0,
      bonusXp: 0,
    };
  }

  let bonusCoins = 0;

  if (activeEvent.coinMultiplier) {
    bonusCoins += Math.round(baseCoins * (activeEvent.coinMultiplier - 1));
  }

  if (activeEvent.modeCoinMultipliers?.[summary.mode]) {
    bonusCoins += Math.round(baseCoins * (activeEvent.modeCoinMultipliers[summary.mode] - 1));
  }

  if (activeEvent.continentBonuses) {
    Object.entries(activeEvent.continentBonuses).forEach(([continent, values]) => {
      const hits = summary.continentCorrect?.[continent] || 0;
      if (hits > 0) {
        bonusCoins += hits * (values.coinsPerHit || 0);
      }
    });
  }

  if ((summary.reason === 'win' || summary.reason === 'daily_win') && activeEvent.winBonusCoins) {
    bonusCoins += activeEvent.winBonusCoins;
  }

  return {
    finalCoins: baseCoins + bonusCoins,
    finalXp: baseXp,
    bonusCoins,
    bonusXp: 0,
  };
}

export function getUpgradeAdjustedCoins(baseCoins, routeUpgrades) {
  const multiplier = 1 + ((routeUpgrades?.treasureRadar || 0) * 0.06) + ((routeUpgrades?.atlasPass || 0) * 0.04);
  return Math.round(baseCoins * multiplier);
}

export function getUpgradeAdjustedXp(baseXp) {
  return baseXp;
}

export function getStartTimeBonus(routeUpgrades) {
  return (routeUpgrades?.relayCore || 0) * 2;
}

export function buildRunSummary({ mode, reason, score, lastCoinsEarned, stats }) {
  return {
    mode,
    reason,
    score,
    coinsEarned: lastCoinsEarned,
    correctAnswers: stats.correctAnswers,
    wrongAnswers: stats.wrongAnswers,
    comboHits: stats.comboHits,
    maxStreak: stats.maxStreak,
    skippedCount: stats.skippedCount,
    freezeUses: stats.freezeUses,
    reviveUses: stats.reviveUses,
    continentCorrect: stats.continentCorrect,
    guessedCountryIsos: stats.guessedCountryIsos,
    durationMs: Date.now() - stats.startedAt,
  };
}

export function applyRunToMetaProgress(progress, summary, dateKey, routeUpgrades, activeEvent) {
  const nextProgress = ensureWeeklyMissions({ ...progress }, dateKey);
  const missionReward = applyMissionProgress(nextProgress.weeklyMissions, summary, dateKey, routeUpgrades);
  nextProgress.weeklyMissions = missionReward.weeklyMissions;

  const nextWeekKey = getWeekKey(dateKey);
  if (nextProgress.lastActiveWeek) {
    if (nextProgress.lastActiveWeek !== nextWeekKey) {
      const previousIndex = getAbsoluteWeekIndex(nextProgress.lastActiveWeek);
      const currentIndex = getAbsoluteWeekIndex(nextWeekKey);
      nextProgress.weeklyVoyageStreak = currentIndex - previousIndex === 1 ? nextProgress.weeklyVoyageStreak + 1 : 1;
    }
  } else {
    nextProgress.weeklyVoyageStreak = 1;
  }
  nextProgress.lastActiveWeek = nextWeekKey;

  if (summary.reason === 'daily_win') {
    if (nextProgress.lastDailyWinDate) {
      const previousDate = parseLocalDateKey(nextProgress.lastDailyWinDate);
      const currentDate = parseLocalDateKey(dateKey);
      const diffDays = Math.round((currentDate - previousDate) / 86400000);
      nextProgress.dailyWinStreak = diffDays === 1 ? nextProgress.dailyWinStreak + 1 : 1;
    } else {
      nextProgress.dailyWinStreak = 1;
    }
    nextProgress.lastDailyWinDate = dateKey;
  }

  const nextMastery = { ...nextProgress.continentMastery };
  const continentMilestones = [];

  CONTINENT_KEYS.forEach((continent) => {
    const existingEntry = nextMastery[continent];
    const sessionHits = summary.continentCorrect?.[continent] || 0;
    const discoveredIsos = summary.guessedCountryIsos
      .filter((entry) => entry.continent === continent)
      .map((entry) => entry.iso);
    const discoveredSet = new Set([...(existingEntry.discovered || []), ...discoveredIsos]);
    const milestoneTargets = CONTINENT_MILESTONES[continent] || [];
    const milestonesClaimed = [...(existingEntry.milestonesClaimed || [])];

    milestoneTargets.forEach((target) => {
      if (discoveredSet.size >= target && !milestonesClaimed.includes(target)) {
        milestonesClaimed.push(target);
        continentMilestones.push({
          continent,
          target,
          rewardCoins: target * 12,
        });
      }
    });

    nextMastery[continent] = {
      discovered: [...discoveredSet],
      totalCorrect: (existingEntry.totalCorrect || 0) + sessionHits,
      milestonesClaimed,
    };
  });

  nextProgress.continentMastery = nextMastery;

  return {
    nextProgress,
    rewardSummary: {
      missionCoinsBonus: missionReward.rewardCoins,
      milestoneCoinsBonus: continentMilestones.reduce((total, item) => total + item.rewardCoins, 0),
      completedMissions: missionReward.completedNow,
      continentMilestones,
      activeEvent,
    },
  };
}

export function getContinentMasteryEntries(continentMastery) {
  return CONTINENT_KEYS.map((continent) => {
    const entry = continentMastery?.[continent] || {};
    const discoveredCount = entry.discovered?.length || 0;
    const nextMilestone = (CONTINENT_MILESTONES[continent] || []).find((target) => target > discoveredCount) || discoveredCount;

    return {
      continent,
      discoveredCount,
      totalCorrect: entry.totalCorrect || 0,
      nextMilestone,
      progressPct: nextMilestone > 0 ? Math.min((discoveredCount / nextMilestone) * 100, 100) : 100,
    };
  });
}

export function getCoachTip({ telemetryInsight, metaProgress, activeEvent }) {
  if (telemetryInsight) {
    return telemetryInsight;
  }

  if ((metaProgress?.dailyWinStreak || 0) >= 3) {
    return {
      title: 'Sequência viva',
      description: 'Sua streak diária está forte. Vale priorizar o desafio diário logo no começo da sessão.',
      tone: 'amber',
    };
  }

  return {
    title: activeEvent?.title || 'Radar semanal',
    description: activeEvent?.description || 'Complete as missões semanais e deixe a rotação trabalhar a seu favor.',
    tone: activeEvent?.tone || 'sky',
  };
}
