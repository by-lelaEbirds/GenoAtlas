import {
  CONTINENT_KEYS,
  CONTINENT_MILESTONES,
  DEFAULT_ROUTE_UPGRADES,
  ROTATING_EVENTS,
  SEASON_CONFIG,
  WEEKLY_MISSION_POOL,
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

function parseWeekKey(weekKey) {
  const [year, rawWeek] = weekKey.split('-W');
  return {
    year: Number(year),
    week: Number(rawWeek),
  };
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

function createMissionProgressEntry(mission) {
  return {
    ...mission,
    progress: 0,
    completed: false,
    completedAt: null,
  };
}

export function createDefaultMetaProgress() {
  return {
    seasonId: SEASON_CONFIG.id,
    seasonXp: 0,
    lifetimeXp: 0,
    dailyWinStreak: 0,
    weeklyVoyageStreak: 0,
    lastDailyWinDate: null,
    lastActiveWeek: null,
    weekKey: null,
    weeklyMissions: [],
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
    newlyDiscoveredByContinent: {},
    guessedCountryIsos: [],
  };
}

export function normalizeContinent(continent) {
  if (!continent) {
    return 'Americas';
  }

  if (continent.includes('America')) {
    return 'Americas';
  }

  if (CONTINENT_KEYS.includes(continent)) {
    return continent;
  }

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

function getMissionSeedsForWeek(weekKey) {
  const seed = hashString(weekKey);
  const pool = [...WEEKLY_MISSION_POOL];
  const picks = [];

  while (pool.length > 0 && picks.length < 3) {
    const index = (seed + picks.length * 7 + pool.length) % pool.length;
    picks.push(pool.splice(index, 1)[0]);
  }

  return picks;
}

export function ensureWeeklyMissions(progress, dateKey) {
  const weekKey = getWeekKey(dateKey);
  if (progress.weekKey === weekKey && progress.weeklyMissions.length > 0) {
    return progress;
  }

  return {
    ...progress,
    weekKey,
    weeklyMissions: getMissionSeedsForWeek(weekKey).map(createMissionProgressEntry),
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

  if (progress.seasonId !== SEASON_CONFIG.id) {
    progress.seasonId = SEASON_CONFIG.id;
    progress.seasonXp = 0;
    progress.weeklyMissions = [];
    progress.weekKey = null;
  }

  return ensureWeeklyMissions(progress, dateKey);
}

export function getSeasonLevelFromXp(xp) {
  let level = 1;
  let remainingXp = Math.max(0, xp);
  let threshold = SEASON_CONFIG.baseXpPerLevel;

  while (remainingXp >= threshold) {
    remainingXp -= threshold;
    level += 1;
    threshold += SEASON_CONFIG.xpCurvePerLevel;
  }

  return level;
}

export function getSeasonProgress(xp) {
  const level = getSeasonLevelFromXp(xp);
  let xpSpent = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    xpSpent += SEASON_CONFIG.baseXpPerLevel + ((currentLevel - 1) * SEASON_CONFIG.xpCurvePerLevel);
  }

  const currentLevelTarget = SEASON_CONFIG.baseXpPerLevel + ((level - 1) * SEASON_CONFIG.xpCurvePerLevel);
  const currentLevelXp = Math.max(0, xp - xpSpent);

  return {
    level,
    currentLevelXp,
    currentLevelTarget,
    progressPct: Math.min((currentLevelXp / currentLevelTarget) * 100, 100),
  };
}

export function getActiveEvent(dateKey) {
  const weekKey = getWeekKey(dateKey);
  const index = hashString(weekKey) % ROTATING_EVENTS.length;
  return ROTATING_EVENTS[index];
}

function getMissionIncrement(mission, summary) {
  switch (mission.type) {
    case 'complete_runs':
      return 1;
    case 'correct_answers':
      return summary.correctAnswers;
    case 'study_sessions':
      return summary.mode === 'study' ? 1 : 0;
    case 'daily_wins':
      return summary.reason === 'daily_win' ? 1 : 0;
    case 'football_wins':
      return summary.mode === 'football' && summary.reason === 'win' ? 1 : 0;
    case 'perfect_runs':
      return summary.wrongAnswers === 0 ? 1 : 0;
    case 'combo_chain':
      return summary.maxStreak;
    case 'continent_hits':
      return summary.continentCorrect?.[mission.continent] || 0;
    default:
      return 0;
  }
}

export function applyMissionProgress(weeklyMissions, summary, completedAt) {
  let rewardCoins = 0;
  let rewardXp = 0;
  const completedNow = [];

  const nextWeeklyMissions = weeklyMissions.map((mission) => {
    if (mission.completed) {
      return mission;
    }

    const increment = getMissionIncrement(mission, summary);
    const progress =
      mission.type === 'combo_chain'
        ? Math.max(mission.progress, increment)
        : Math.min(mission.progress + increment, mission.target);
    const completed = progress >= mission.target;

    if (completed) {
      rewardCoins += mission.rewardCoins;
      rewardXp += mission.rewardXp;
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
    rewardXp,
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
  let bonusXp = 0;

  if (activeEvent.coinMultiplier) {
    bonusCoins += Math.round(baseCoins * (activeEvent.coinMultiplier - 1));
  }

  if (activeEvent.comboXpBonus && summary.comboHits > 0) {
    bonusXp += summary.comboHits * activeEvent.comboXpBonus;
  }

  if (activeEvent.modeXpMultipliers?.[summary.mode]) {
    bonusXp += Math.round(baseXp * (activeEvent.modeXpMultipliers[summary.mode] - 1));
  }

  if (activeEvent.continentBonuses) {
    Object.entries(activeEvent.continentBonuses).forEach(([continent, values]) => {
      const hits = summary.continentCorrect?.[continent] || 0;
      if (hits <= 0) {
        return;
      }

      bonusCoins += hits * (values.coinsPerHit || 0);
      bonusXp += hits * (values.xpPerHit || 0);
    });
  }

  if ((summary.reason === 'win' || summary.reason === 'daily_win') && activeEvent.winBonusCoins) {
    bonusCoins += activeEvent.winBonusCoins;
  }

  if ((summary.reason === 'win' || summary.reason === 'daily_win') && activeEvent.winBonusXp) {
    bonusXp += activeEvent.winBonusXp;
  }

  return {
    finalCoins: baseCoins + bonusCoins,
    finalXp: baseXp + bonusXp,
    bonusCoins,
    bonusXp,
  };
}

export function getUpgradeAdjustedCoins(baseCoins, routeUpgrades) {
  const multiplier = 1 + ((routeUpgrades.treasureRadar || 0) * 0.06);
  return Math.round(baseCoins * multiplier);
}

export function getUpgradeAdjustedXp(baseXp, routeUpgrades) {
  const multiplier = 1 + ((routeUpgrades.atlasPass || 0) * 0.08);
  return Math.round(baseXp * multiplier);
}

export function getStartTimeBonus(routeUpgrades) {
  return (routeUpgrades.relayCore || 0) * 2;
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
  const previousLevel = getSeasonLevelFromXp(nextProgress.seasonXp);

  const baseXp =
    (summary.correctAnswers * 26) +
    (summary.comboHits * 14) +
    (summary.wrongAnswers === 0 && summary.correctAnswers > 0 ? 80 : 0) +
    ((summary.reason === 'win' || summary.reason === 'daily_win') ? 160 : 0);

  const adjustedBaseXp = getUpgradeAdjustedXp(baseXp, routeUpgrades);
  const eventReward = applyEventBonuses(0, adjustedBaseXp, summary, activeEvent);

  const missionReward = applyMissionProgress(nextProgress.weeklyMissions, summary, dateKey);

  nextProgress.weeklyMissions = missionReward.weeklyMissions;
  nextProgress.seasonXp += eventReward.finalXp + missionReward.rewardXp;
  nextProgress.lifetimeXp += eventReward.finalXp + missionReward.rewardXp;

  const nextWeekKey = getWeekKey(dateKey);
  if (nextProgress.lastActiveWeek) {
    if (nextProgress.lastActiveWeek !== nextWeekKey) {
      const previousWeek = parseWeekKey(nextProgress.lastActiveWeek);
      const currentWeek = parseWeekKey(nextWeekKey);
      const previousWeekIndex = (previousWeek.year * 53) + previousWeek.week;
      const currentWeekIndex = (currentWeek.year * 53) + currentWeek.week;
      nextProgress.weeklyVoyageStreak =
        currentWeekIndex - previousWeekIndex === 1 ? nextProgress.weeklyVoyageStreak + 1 : 1;
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

  const continentMilestones = [];
  const nextMastery = { ...nextProgress.continentMastery };

  CONTINENT_KEYS.forEach((continent) => {
    const existingEntry = nextMastery[continent];
    const sessionHits = summary.continentCorrect?.[continent] || 0;
    const discoveredIsos = summary.guessedCountryIsos.filter((entry) => entry.continent === continent).map((entry) => entry.iso);
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
          rewardXp: target * 10,
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

  const milestoneRewardCoins = continentMilestones.reduce((total, item) => total + item.rewardCoins, 0);
  const milestoneRewardXp = continentMilestones.reduce((total, item) => total + item.rewardXp, 0);

  nextProgress.seasonXp += milestoneRewardXp;
  nextProgress.lifetimeXp += milestoneRewardXp;

  const currentLevel = getSeasonLevelFromXp(nextProgress.seasonXp);

  return {
    nextProgress,
    rewardSummary: {
      seasonXpEarned: eventReward.finalXp + missionReward.rewardXp + milestoneRewardXp,
      eventXpBonus: eventReward.bonusXp,
      missionXpBonus: missionReward.rewardXp,
      milestoneXpBonus: milestoneRewardXp,
      missionCoinsBonus: missionReward.rewardCoins,
      milestoneCoinsBonus: milestoneRewardCoins,
      completedMissions: missionReward.completedNow,
      continentMilestones,
      previousLevel,
      currentLevel,
      leveledUp: currentLevel > previousLevel,
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

  if (metaProgress.dailyWinStreak >= 3) {
    return {
      title: 'Sequencia viva',
      description: 'Sua streak diaria esta forte. Vale encaixar o desafio diario antes de fechar o mapa.',
      tone: 'amber',
    };
  }

  return {
    title: activeEvent?.title || 'Central de voo',
    description: activeEvent?.description || 'Complete missoes semanais para acelerar a temporada e liberar milestones continentais.',
    tone: activeEvent?.tone || 'sky',
  };
}
