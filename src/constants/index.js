export const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  RESULT: 'result'
};

export const GAME_MODES = {
  NORMAL: 'normal',
  STUDY: 'study',
  FOOTBALL: 'football',
  DAILY: 'daily'
};

export const ACHIEVEMENTS_LIST = [
  { id: 'first_country', title: 'Primeiro Passo', desc: 'Acertou o seu primeiro país.', reward: 50 },
  { id: 'combo_3', title: 'Combo x3', desc: 'Acertou 3 países seguidos rapidamente.', reward: 100 },
  { id: 'combo_5', title: 'Explorador Ágil', desc: 'Acertou 5 países seguidos rapidamente.', reward: 200 },
  { id: 'wealthy', title: 'Magnata', desc: 'Acumulou 1.000 moedas no total.', reward: 0 },
  { id: 'daily_win', title: 'Trabalho Diário', desc: 'Completou um Desafio Diário.', reward: 100 }
];

// Usa o caminho dinâmico do Vite para não quebrar no GitHub Pages!
const basePath = import.meta.env.BASE_URL;

export const MAP_THEMES = {
  explorador: {
    name: 'Explorador (Básico)',
    price: 0,
    id: 'explorador',
    globeUrl: `${basePath}assets/globes/earth-blue-marble.jpg`,
    // Fundo estrelado ativado para o modo padrão!
    bgImageUrl: `${basePath}assets/globes/night-sky.png`, 
    bump: `${basePath}assets/globes/earth-topology.png`,
    polyHover: 'rgba(251, 191, 36, 0.7)', 
    polyGuessed: 'rgba(34, 197, 94, 0.9)', 
    polyStroke: 'rgba(255, 255, 255, 0.5)',
    arcsColor: '#15803d', 
    ringsColor: '#fbbf24', 
  },
  noturno: {
    name: 'Voo Noturno',
    price: 500,
    id: 'noturno',
    globeUrl: `${basePath}assets/globes/earth-dark.jpg`,
    bgImageUrl: `${basePath}assets/globes/night-sky.png`,
    bump: `${basePath}assets/globes/earth-topology.png`,
    polyHover: 'rgba(34, 211, 238, 0.6)',
    polyGuessed: 'rgba(168, 85, 247, 0.8)',
    polyStroke: 'rgba(255, 255, 255, 0.3)',
    arcsColor: '#a855f7',
    ringsColor: '#22d3ee',
  },
  ouro: {
    name: 'Era de Ouro',
    price: 1500,
    id: 'ouro',
    globeUrl: `${basePath}assets/globes/earth-day.jpg`,
    // Fundo estrelado ativado para o modo de ouro!
    bgImageUrl: `${basePath}assets/globes/night-sky.png`,
    bump: `${basePath}assets/globes/earth-topology.png`,
    polyHover: 'rgba(255, 255, 255, 0.9)',
    polyGuessed: 'rgba(251, 191, 36, 0.9)',
    polyStroke: 'rgba(120, 113, 108, 0.5)',
    arcsColor: '#fbbf24',
    ringsColor: '#ffffff',
  }
};
