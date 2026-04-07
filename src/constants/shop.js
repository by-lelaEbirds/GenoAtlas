export const AVATARS = [
  { id: 'pin', name: 'Pino Padrao', icon: '\u{1F4CD}', type: 'emoji', price: 0, rarity: 'Base' },
  { id: 'plane', name: 'Aviao de Papel', icon: '\u2708\uFE0F', type: 'emoji', price: 1000, rarity: 'Comum' },
  { id: 'balloon', name: 'Balao Quente', icon: '\u{1F388}', type: 'emoji', price: 3000, rarity: 'Raro' },
  { id: 'heli', name: 'Helicoptero', icon: '\u{1F681}', type: 'emoji', price: 5000, rarity: 'Raro' },
  { id: 'ufo', name: 'Disco Voador', icon: '\u{1F6F8}', type: 'emoji', price: 10000, rarity: 'Epico' },
  { id: 'rocket', name: 'Foguete', icon: '\u{1F680}', type: 'emoji', price: 25000, rarity: 'Lendario' },
];

export const POWER_UPS = [
  {
    id: 'extraLife',
    name: 'Coracao de Ferro',
    desc: 'Comece com mais vidas',
    icon: '\u2764\uFE0F',
    maxLevel: 2,
    basePrice: 3000,
    rarity: 'Core',
  },
  {
    id: 'freezeTime',
    name: 'Zero Absoluto',
    desc: '+2s de tempo congelado',
    icon: '\u2744\uFE0F',
    maxLevel: 3,
    basePrice: 2000,
    rarity: 'Core',
  },
  {
    id: 'discount',
    name: 'Labia de Mercador',
    desc: 'Pular paises fica mais barato',
    icon: '\u{1F3F7}\uFE0F',
    maxLevel: 4,
    basePrice: 1500,
    rarity: 'Core',
  },
];

export const ROUTE_UPGRADES = [
  {
    id: 'atlasPass',
    name: 'Bussola de Elite',
    desc: '+4% moedas por corrida por nivel.',
    icon: '\u{1F9ED}',
    maxLevel: 5,
    basePrice: 2200,
    rarity: 'Epico',
  },
  {
    id: 'relayCore',
    name: 'Nucleo de Reentrada',
    desc: '+2s no cronometro inicial por nivel.',
    icon: '\u26A1',
    maxLevel: 4,
    basePrice: 2600,
    rarity: 'Raro',
  },
  {
    id: 'treasureRadar',
    name: 'Radar de Tesouros',
    desc: '+6% moedas por partida por nivel.',
    icon: '\u{1F4B0}',
    maxLevel: 5,
    basePrice: 2400,
    rarity: 'Lendario',
  },
];
