export const CONTINENT_KEYS = ['Americas', 'Europe', 'Africa', 'Asia', 'Oceania'];

export const DEFAULT_ROUTE_UPGRADES = {
  atlasPass: 0,
  relayCore: 0,
  treasureRadar: 0,
};

export const CONTINENT_MILESTONES = {
  Americas: [6, 14, 24, 36],
  Europe: [6, 14, 24, 36],
  Africa: [5, 12, 20, 30],
  Asia: [6, 14, 24, 36],
  Oceania: [3, 7, 12, 18],
};

export const WEEKLY_ROTATION_BLUEPRINTS = [
  {
    id: 'operacao-bussola-global',
    title: 'Bussola Global',
    description: 'Semana para afinar precisao, limpar erros e fechar rotas com ritmo.',
    tone: 'sky',
    rewardLabel: 'Mais valor para acertos limpos e combos fortes.',
    focus: 'Precisao e combo',
    bestModes: ['Normal', 'Diario'],
    guide: [
      'Comece por 1 rodada de aquecimento no modo normal.',
      'Busque limpar erros cedo e proteja o combo depois do terceiro acerto.',
      'Se a mira cair, troque 1 rodada por estudo e volte para fechar a missao de combo.',
    ],
    missionSlots: [
      { type: 'complete_runs', targetOptions: [3, 4, 5] },
      { type: 'correct_answers', targetOptions: [18, 22, 26, 30] },
      { type: 'perfect_runs', targetOptions: [1, 2, 3] },
      { type: 'combo_chain', targetOptions: [5, 7, 9, 11] },
    ],
    bonusProfile: { coinMultiplier: 1.12 },
  },
  {
    id: 'operacao-laboratorio',
    title: 'Laboratorio Cartografico',
    description: 'Foco total em estudo, leitura rapida e memorizacao de mapa.',
    tone: 'indigo',
    rewardLabel: 'Modo estudo rende mais e acelera dominio tecnico.',
    focus: 'Treino guiado',
    bestModes: ['Estudo', 'Normal'],
    guide: [
      'Abra a semana com 2 sessoes de estudo para ganhar leitura de mapa.',
      'Aproveite o treino para memorizar capital e continente antes de cada toque.',
      'Depois converta esse ritmo em 1 rodada normal para fechar pontos altos.',
    ],
    missionSlots: [
      { type: 'study_sessions', targetOptions: [2, 3, 4] },
      { type: 'correct_answers', targetOptions: [14, 18, 22, 26] },
      { type: 'disciplined_runs', targetOptions: [1, 2, 3] },
      { type: 'score_peak', targetOptions: [1200, 1800, 2400, 3000] },
    ],
    bonusProfile: { modeCoinMultipliers: { study: 1.18 } },
  },
  {
    id: 'operacao-americas',
    title: 'Circuito das Americas',
    description: 'Semana de expansao pelas Americas com foco em consistencia e coleta.',
    tone: 'emerald',
    rewardLabel: 'Acertos nas Americas geram bonus adicional.',
    focus: 'Continente em foco',
    bestModes: ['Normal', 'Diario'],
    guide: [
      'Priorize rotas abertas para acumular hits nas Americas logo no inicio.',
      'Evite revive para transformar partidas limpas em moedas extras.',
      'Feche a semana com corrida de coleta para bater a meta de moedas.',
    ],
    missionSlots: [
      { type: 'continent_hits', continent: 'Americas', targetOptions: [10, 14, 18, 22] },
      { type: 'complete_runs', targetOptions: [3, 4, 5] },
      { type: 'no_revive_runs', targetOptions: [1, 2, 3] },
      { type: 'coin_haul', targetOptions: [500, 700, 900, 1100] },
    ],
    bonusProfile: {
      continentBonuses: {
        Americas: { coinsPerHit: 4 },
      },
    },
  },
  {
    id: 'operacao-gramados',
    title: 'Rota dos Gramados',
    description: 'Semana dedicada ao modo futebol, leitura de escudos e resposta rapida.',
    tone: 'amber',
    rewardLabel: 'Partidas de futebol contam mais para recompensas semanais.',
    focus: 'Especial futebol',
    bestModes: ['Futebol', 'Normal'],
    guide: [
      'Alterne futebol com partidas normais para manter acertos em alta.',
      'Use a semana para treinar resposta rapida sem depender de pular.',
      'Quando fechar a vitoria no futebol, aproveite e empilhe combo na rodada seguinte.',
    ],
    missionSlots: [
      { type: 'football_wins', targetOptions: [1, 2, 3] },
      { type: 'correct_answers', targetOptions: [16, 20, 24, 28] },
      { type: 'combo_chain', targetOptions: [4, 6, 8, 10] },
      { type: 'disciplined_runs', targetOptions: [1, 2, 3] },
    ],
    bonusProfile: { modeCoinMultipliers: { football: 1.16 }, winBonusCoins: 60 },
  },
  {
    id: 'operacao-euro-africa',
    title: 'Travessia EuroAfrica',
    description: 'Semana de rota dupla, equilibrando Europa e Africa com calma e limpeza.',
    tone: 'rose',
    rewardLabel: 'Semana ideal para ampliar dominio continental em dois fronts.',
    focus: 'Dupla continental',
    bestModes: ['Normal', 'Estudo'],
    guide: [
      'Use estudo para reconhecer capitais e depois leve esse repertorio para a corrida.',
      'Divida a sessao em blocos: primeiro Europa, depois Africa.',
      'Partidas limpas valem mais aqui do que volume puro.',
    ],
    missionSlots: [
      { type: 'continent_hits', continent: 'Europe', targetOptions: [8, 12, 16, 20] },
      { type: 'continent_hits', continent: 'Africa', targetOptions: [6, 10, 14, 18] },
      { type: 'perfect_runs', targetOptions: [1, 2, 3] },
      { type: 'complete_runs', targetOptions: [3, 4, 5] },
    ],
    bonusProfile: {
      continentBonuses: {
        Europe: { coinsPerHit: 2 },
        Africa: { coinsPerHit: 3 },
      },
    },
  },
  {
    id: 'operacao-diario',
    title: 'Pulso Diario',
    description: 'Semana para consolidar presenca, fazer o diario e manter frequencia alta.',
    tone: 'cyan',
    rewardLabel: 'Desafio diario e rotas completas rendem melhor.',
    focus: 'Frequencia e constancia',
    bestModes: ['Diario', 'Normal'],
    guide: [
      'Comece cada dia pelo diario para proteger a streak.',
      'Complete ao menos 1 corrida extra depois do diario para empurrar o volume da semana.',
      'Evite revive quando a meta for constancia limpa.',
    ],
    missionSlots: [
      { type: 'daily_wins', targetOptions: [1, 2, 3] },
      { type: 'complete_runs', targetOptions: [4, 5, 6] },
      { type: 'no_revive_runs', targetOptions: [1, 2, 3] },
      { type: 'coin_haul', targetOptions: [600, 850, 1100, 1350] },
    ],
    bonusProfile: { modeCoinMultipliers: { daily: 1.18 }, winBonusCoins: 80 },
  },
  {
    id: 'operacao-asia-oceania',
    title: 'Eixo Asia Oceania',
    description: 'Semana de leitura veloz em rotas distantes, com foco em combos e mira.',
    tone: 'fuchsia',
    rewardLabel: 'Acertos em Asia e Oceania sobem o retorno da semana.',
    focus: 'Velocidade e alcance',
    bestModes: ['Normal', 'Estudo'],
    guide: [
      'Abra em estudo para refrescar bandeiras e capitais menos familiares.',
      'Na corrida, jogue por velocidade e proteja combos longos.',
      'Oceania costuma decidir a semana, entao aproveite as rodadas favoraveis para fechar essa meta cedo.',
    ],
    missionSlots: [
      { type: 'continent_hits', continent: 'Asia', targetOptions: [10, 14, 18, 22] },
      { type: 'continent_hits', continent: 'Oceania', targetOptions: [4, 6, 8, 10] },
      { type: 'combo_chain', targetOptions: [6, 8, 10, 12] },
      { type: 'score_peak', targetOptions: [1800, 2600, 3400, 4200] },
    ],
    bonusProfile: {
      continentBonuses: {
        Asia: { coinsPerHit: 2 },
        Oceania: { coinsPerHit: 5 },
      },
    },
  },
  {
    id: 'operacao-grande-tour',
    title: 'Grande Tour',
    description: 'Semana completa para misturar modos, empilhar acertos e maximizar moedas.',
    tone: 'orange',
    rewardLabel: 'Semana premium para fechar varias rotas e acumular carteira.',
    focus: 'Volume e recompensa',
    bestModes: ['Normal', 'Futebol', 'Diario'],
    guide: [
      'Misture modos na mesma semana para aproveitar todas as metas abertas.',
      'Comece com o modo em que voce acerta mais para ganhar folego de moedas.',
      'Quando a carteira estiver forte, feche as missoes de volume e coleta em sequencia.',
    ],
    missionSlots: [
      { type: 'complete_runs', targetOptions: [5, 6, 7] },
      { type: 'correct_answers', targetOptions: [24, 30, 36, 42] },
      { type: 'disciplined_runs', targetOptions: [2, 3, 4] },
      { type: 'coin_haul', targetOptions: [900, 1200, 1500, 1800] },
    ],
    bonusProfile: { coinMultiplier: 1.18 },
  },
];
