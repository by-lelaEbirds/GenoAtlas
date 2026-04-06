import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Award, ShoppingCart, Lock, ArrowUpCircle } from 'lucide-react';
import { AVATARS, POWER_UPS, ROUTE_UPGRADES } from '../constants/shop';
import { ACHIEVEMENTS_LIST } from '../constants/achievements';
import { saveNativeData } from '../utils/storage';

const EMOJI_FONT_STYLE = {
  fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
};

function resolveAvatarIcon(icon) {
  if (!icon) {
    return '';
  }

  if (/^(https?:)?\/\//.test(icon) || icon.startsWith('data:')) {
    return icon;
  }

  return `${import.meta.env.BASE_URL}${icon.replace(/^\//, '')}`;
}

function getOverlayClasses(isDarkMode, isClosing) {
  return `absolute inset-0 z-[200] flex items-center justify-center px-4 md:px-6 py-6 overflow-y-auto custom-scrollbar backdrop-blur-md ${
    isDarkMode ? 'bg-black/85' : 'bg-stone-900/80'
  } ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`;
}

function getPanelClasses(isDarkMode, isClosing, extraClasses = '') {
  return `relative w-full shadow-2xl ${extraClasses} ${
    isDarkMode
      ? 'bg-slate-900 border-[4px] border-slate-700 text-slate-200'
      : 'bg-white border-b-[12px] md:border-b-[16px] border-stone-200 text-stone-700'
  } ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`;
}

function getCloseButtonClasses(isDarkMode) {
  return `absolute top-6 right-6 md:top-8 md:right-8 p-3 md:p-4 rounded-full transition-colors shadow-sm active:scale-95 z-10 ${
    isDarkMode
      ? 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
      : 'bg-stone-100 text-stone-400 hover:text-rose-500 hover:bg-stone-200'
  }`;
}

function getCardClasses(isDarkMode, extraClasses = '') {
  return `${extraClasses} ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-stone-50 border-stone-100 text-stone-700'
  }`;
}

function getRarityBadgeClasses(isDarkMode, rarity) {
  if (isDarkMode) {
    if (rarity === 'Lendario') return 'bg-amber-500/15 border-amber-500/30 text-amber-200';
    if (rarity === 'Epico') return 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-200';
    if (rarity === 'Raro') return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200';
    if (rarity === 'Core') return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200';
    return 'bg-slate-700 border-slate-600 text-slate-200';
  }

  if (rarity === 'Lendario') return 'bg-amber-50 border-amber-200 text-amber-700';
  if (rarity === 'Epico') return 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700';
  if (rarity === 'Raro') return 'bg-cyan-50 border-cyan-200 text-cyan-700';
  if (rarity === 'Core') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  return 'bg-stone-100 border-stone-200 text-stone-600';
}

export function TutorialModal({ onClose, isDarkMode }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className={getOverlayClasses(isDarkMode, isClosing)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        className={getPanelClasses(isDarkMode, isClosing, 'max-w-2xl my-auto p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem]')}
      >
        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner border-[6px] md:border-[8px] ${
          isDarkMode ? 'bg-sky-950 border-sky-800 text-sky-300' : 'bg-sky-100 border-sky-200 text-sky-500'
        }`}>
          <ShieldAlert size={48} className="md:w-16 md:h-16" strokeWidth={2.5} />
        </div>

        <h2 id="tutorial-title" className={`text-[36px] md:text-[52px] font-black text-center tracking-tighter uppercase mb-8 md:mb-10 leading-none ${
          isDarkMode ? 'text-white' : 'text-stone-800'
        }`}>
          Como Jogar
        </h2>

        <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
          <div className={getCardClasses(isDarkMode, 'flex gap-4 md:gap-6 items-center border-[4px] p-6 md:p-8 rounded-[2rem] shadow-inner')}>
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 font-black text-[24px] md:text-[32px] border-[4px] ${
              isDarkMode ? 'bg-emerald-500 text-white border-emerald-300/40' : 'bg-emerald-400 text-white border-emerald-200'
            }`}>
              1
            </div>
            <p className={`text-[18px] md:text-[24px] font-bold leading-tight ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
              Veja o nome do <strong className={isDarkMode ? 'text-white' : 'text-stone-800'}>País</strong> ou <strong className={isDarkMode ? 'text-white' : 'text-stone-800'}>Clube</strong> no centro da tela.
            </p>
          </div>

          <div className={getCardClasses(isDarkMode, 'flex gap-4 md:gap-6 items-center border-[4px] p-6 md:p-8 rounded-[2rem] shadow-inner')}>
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 font-black text-[24px] md:text-[32px] border-[4px] ${
              isDarkMode ? 'bg-amber-500 text-white border-amber-300/40' : 'bg-amber-400 text-white border-amber-200'
            }`}>
              2
            </div>
            <p className={`text-[18px] md:text-[24px] font-bold leading-tight ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
              Gire o globo e toque no território correto antes que o <strong className={isDarkMode ? 'text-white' : 'text-stone-800'}>tempo acabe</strong>.
            </p>
          </div>

          <div className={getCardClasses(isDarkMode, 'flex gap-4 md:gap-6 items-center border-[4px] p-6 md:p-8 rounded-[2rem] shadow-inner')}>
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 font-black text-[24px] md:text-[32px] border-[4px] ${
              isDarkMode ? 'bg-rose-500 text-white border-rose-300/40' : 'bg-rose-400 text-white border-rose-200'
            }`}>
              3
            </div>
            <p className={`text-[18px] md:text-[24px] font-bold leading-tight ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
              Você só tem <strong className={isDarkMode ? 'text-white' : 'text-stone-800'}>3 vidas</strong>. Cada erro pesa na sua pontuação.
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-emerald-400 text-emerald-950 py-6 md:py-8 rounded-[2.5rem] border-b-[8px] md:border-b-[10px] border-emerald-500 font-black uppercase tracking-widest text-[24px] md:text-[32px] flex items-center justify-center gap-4 active:translate-y-[8px] active:border-b-0 transition-all hover:bg-emerald-500"
        >
          Entendido <CheckCircle size={36} className="md:w-10 md:h-10" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export function AchievementsModal({ onClose, unlockedIds, isDarkMode }) {
  const [isClosing, setIsClosing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const totalCoinsEarned = ACHIEVEMENTS_LIST.reduce((total, achievement) => {
    return unlockedIds.includes(achievement.id) ? total + achievement.reward : total;
  }, 0);

  const getColorStyles = (colorType, isUnlocked) => {
    if (!isUnlocked) {
      return isDarkMode
        ? 'bg-slate-800 border-slate-700 text-slate-500'
        : 'bg-stone-50 border-stone-200 text-stone-400';
    }

    if (isDarkMode) {
      switch (colorType) {
        case 'gold':
          return 'bg-amber-950/70 border-amber-500/50 text-amber-200 shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]';
        case 'silver':
          return 'bg-slate-800 border-slate-500/60 text-slate-100 shadow-[inset_0_0_15px_rgba(148,163,184,0.12)]';
        case 'bronze':
        default:
          return 'bg-orange-950/60 border-orange-500/50 text-orange-200 shadow-[inset_0_0_15px_rgba(251,146,60,0.15)]';
      }
    }

    switch (colorType) {
      case 'gold':
        return 'bg-amber-100 border-amber-400 text-amber-800 shadow-[inset_0_0_15px_rgba(251,191,36,0.3)]';
      case 'silver':
        return 'bg-slate-100 border-slate-400 text-slate-700 shadow-[inset_0_0_15px_rgba(148,163,184,0.3)]';
      case 'bronze':
      default:
        return 'bg-orange-50 border-orange-300 text-orange-800 shadow-[inset_0_0_15px_rgba(251,146,60,0.2)]';
    }
  };

  return (
    <div className={getOverlayClasses(isDarkMode, isClosing)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievements-title"
        className={getPanelClasses(isDarkMode, isClosing, 'max-w-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] flex flex-col max-h-[85dvh]')}
      >
        <button onClick={handleClose} className={getCloseButtonClasses(isDarkMode)} aria-label="Fechar conquistas">
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6 shrink-0">
          <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4 border-[6px] md:border-[8px] shadow-inner ${
            isDarkMode ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-500 border-amber-200'
          }`}>
            <Award size={40} className="md:w-16 md:h-16" strokeWidth={2.5} />
          </div>
          <h2 id="achievements-title" className={`text-[32px] md:text-[48px] font-black tracking-tighter uppercase text-center leading-none mb-4 ${
            isDarkMode ? 'text-white' : 'text-stone-800'
          }`}>
            Conquistas
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full justify-center">
            <div className={`px-6 py-2 rounded-full border-2 shadow-sm flex flex-col items-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-100 border-stone-200'
            }`}>
              <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>
                Desbloqueadas
              </span>
              <span className={`text-[16px] md:text-[20px] font-black ${isDarkMode ? 'text-white' : 'text-stone-700'}`}>
                {unlockedIds.length} / {ACHIEVEMENTS_LIST.length}
              </span>
            </div>
            <div className={`px-6 py-2 rounded-full border-2 shadow-sm flex flex-col items-center ${
              isDarkMode ? 'bg-amber-950/70 border-amber-700' : 'bg-amber-50 border-amber-200'
            }`}>
              <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest ${isDarkMode ? 'text-amber-300' : 'text-amber-500'}`}>
                Total Recebido
              </span>
              <span className={`text-[16px] md:text-[20px] font-black ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                {totalCoinsEarned} 🪙
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4 space-y-3 md:space-y-4">
          {ACHIEVEMENTS_LIST.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const isExpanded = expandedId === achievement.id;

            return (
              <div
                key={achievement.id}
                onClick={() => setExpandedId(isExpanded ? null : achievement.id)}
                className={`rounded-[1.5rem] md:rounded-[2rem] border-[4px] border-b-[6px] md:border-b-[8px] overflow-hidden transition-all cursor-pointer active:translate-y-[2px] active:border-b-[4px] ${
                  getColorStyles(achievement.color, isUnlocked)
                } ${!isUnlocked ? 'opacity-80 grayscale' : ''}`}
              >
                <div className="p-4 md:p-6 flex items-center gap-4">
                  <div className="text-[32px] md:text-[40px] drop-shadow-sm shrink-0 leading-none">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-black uppercase tracking-tight text-[18px] md:text-[22px] leading-none mb-1">{achievement.title}</h4>
                    <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      isUnlocked
                        ? 'bg-white/10 border-current/20 text-current'
                        : isDarkMode
                          ? 'bg-slate-900/60 border-slate-700 text-slate-500'
                          : 'bg-stone-200 border-stone-300'
                    }`}>
                      Nível {achievement.level}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center justify-center">
                    {isUnlocked ? (
                      <CheckCircle size={28} className={`rounded-full border-2 ${
                        isDarkMode ? 'text-emerald-400 bg-slate-900 border-emerald-500/30' : 'text-emerald-500 bg-white border-emerald-100'
                      }`} />
                    ) : (
                      <Lock size={24} className={isDarkMode ? 'text-slate-500' : 'text-stone-400'} />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className={`px-4 pb-4 md:px-6 md:pb-6 pt-2 border-t-[3px] animate-fade-in-down flex flex-col ${
                    isDarkMode ? 'border-white/10' : 'border-current/10'
                  }`}>
                    <p className="text-[14px] md:text-[16px] font-bold leading-snug mb-4 opacity-90">{achievement.desc}</p>
                    <div className={`flex justify-between items-center p-3 rounded-xl border ${
                      isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-white/40 border-white/50'
                    }`}>
                      <span className="font-black uppercase tracking-widest text-[12px] md:text-[14px]">Recompensa:</span>
                      <span className="font-black text-[16px] md:text-[20px] flex items-center gap-1">{achievement.reward} 🪙</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ShopModal({
  onClose,
  coins,
  setCoins,
  unlockedAvatars,
  setUnlockedAvatars,
  activeAvatar,
  setActiveAvatar,
  powerUps,
  setPowerUps,
  routeUpgrades,
  setRouteUpgrades,
  isDarkMode,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [tab, setTab] = useState('avatars');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const buyAvatar = (avatar) => {
    if (coins >= avatar.price && !unlockedAvatars.includes(avatar.id)) {
      const newCoins = coins - avatar.price;
      const newAvatars = [...unlockedAvatars, avatar.id];

      setCoins(newCoins);
      setUnlockedAvatars(newAvatars);
      saveNativeData('geoGuessCoins', newCoins);
      saveNativeData('geoGuessAvatars', JSON.stringify(newAvatars));

      setActiveAvatar(avatar);
      saveNativeData('geoGuessActiveAvatar', avatar.id);
    }
  };

  const equipAvatar = (avatar) => {
    if (unlockedAvatars.includes(avatar.id)) {
      setActiveAvatar(avatar);
      saveNativeData('geoGuessActiveAvatar', avatar.id);
    }
  };

  const upgradePowerUp = (powerUpKey, data) => {
    const currentLevel = powerUps[powerUpKey];
    if (currentLevel < data.maxLevel) {
      const cost = data.basePrice * (currentLevel + 1);
      if (coins >= cost) {
        const newCoins = coins - cost;
        const newPowerUps = { ...powerUps, [powerUpKey]: currentLevel + 1 };

        setCoins(newCoins);
        setPowerUps(newPowerUps);
        saveNativeData('geoGuessCoins', newCoins);
        saveNativeData('geoGuessPowerUps', JSON.stringify(newPowerUps));
      }
    }
  };

  const upgradeRoute = (routeKey, data) => {
    const currentLevel = routeUpgrades[routeKey];
    if (currentLevel < data.maxLevel) {
      const cost = data.basePrice * (currentLevel + 1);
      if (coins >= cost) {
        const newCoins = coins - cost;
        const newRouteUpgrades = { ...routeUpgrades, [routeKey]: currentLevel + 1 };

        setCoins(newCoins);
        setRouteUpgrades(newRouteUpgrades);
        saveNativeData('geoGuessCoins', newCoins);
        saveNativeData('geoGuessRouteUpgrades', JSON.stringify(newRouteUpgrades));
      }
    }
  };

  return (
    <div className={getOverlayClasses(isDarkMode, isClosing)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-title"
        className={getPanelClasses(isDarkMode, isClosing, 'max-w-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] flex flex-col max-h-[85dvh]')}
      >
        <button onClick={handleClose} className={getCloseButtonClasses(isDarkMode)} aria-label="Fechar loja">
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6 shrink-0">
          <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4 border-[6px] md:border-[8px] shadow-inner ${
            isDarkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-500 border-emerald-200'
          }`}>
            <ShoppingCart size={40} className="md:w-14 md:h-14" strokeWidth={2.5} />
          </div>
          <h2 id="shop-title" className={`text-[32px] md:text-[48px] font-black tracking-tighter uppercase text-center leading-none mb-4 ${
            isDarkMode ? 'text-white' : 'text-stone-800'
          }`}>
            Lojinha
          </h2>

          <div className={`w-full max-w-sm p-2 rounded-full border-2 flex ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-100 border-stone-200'
          }`}>
            <button
              onClick={() => setTab('avatars')}
              className={`flex-1 py-3 rounded-full font-black uppercase tracking-widest text-[14px] md:text-[16px] transition-all ${
                tab === 'avatars'
                  ? isDarkMode
                    ? 'bg-slate-700 text-white shadow-sm border-b-[4px] border-slate-500'
                    : 'bg-white text-stone-800 shadow-sm border-b-[4px] border-stone-200'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Veículos
            </button>
            <button
              onClick={() => setTab('powerups')}
              className={`flex-1 py-3 rounded-full font-black uppercase tracking-widest text-[14px] md:text-[16px] transition-all ${
                tab === 'powerups'
                  ? isDarkMode
                    ? 'bg-slate-700 text-white shadow-sm border-b-[4px] border-slate-500'
                    : 'bg-white text-stone-800 shadow-sm border-b-[4px] border-stone-200'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Melhorias
            </button>
            <button
              onClick={() => setTab('routes')}
              className={`flex-1 py-3 rounded-full font-black uppercase tracking-widest text-[14px] md:text-[16px] transition-all ${
                tab === 'routes'
                  ? isDarkMode
                    ? 'bg-slate-700 text-white shadow-sm border-b-[4px] border-slate-500'
                    : 'bg-white text-stone-800 shadow-sm border-b-[4px] border-stone-200'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Rotas
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4">
          {tab === 'avatars' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AVATARS.map((avatar) => {
                const isUnlocked = unlockedAvatars.includes(avatar.id);
                const isEquipped = activeAvatar.id === avatar.id;

                return (
                  <div
                    key={avatar.id}
                    className={`border-[4px] rounded-[2rem] p-4 flex flex-col items-center text-center transition-all ${
                      getCardClasses(isDarkMode)
                    } ${isEquipped ? (isDarkMode ? 'ring-4 ring-amber-400/60 bg-amber-950/30' : 'ring-4 ring-amber-400 bg-amber-50') : ''}`}
                  >
                    <div className="text-[48px] md:text-[64px] mb-2 leading-none drop-shadow-md">
                      {avatar.type === 'emoji' ? (
                        <span style={EMOJI_FONT_STYLE}>{avatar.icon}</span>
                      ) : (
                        <img
                          src={resolveAvatarIcon(avatar.icon)}
                          alt={avatar.name}
                          className="w-16 h-16 object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </div>
                    <span className={`font-bold uppercase text-[12px] md:text-[14px] mb-4 tracking-wider leading-tight line-clamp-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-stone-600'
                    }`}>
                      {avatar.name}
                    </span>
                    <span className={`mb-3 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getRarityBadgeClasses(isDarkMode, avatar.rarity)}`}>
                      {avatar.rarity}
                    </span>

                    {isUnlocked ? (
                      <button
                        onClick={() => equipAvatar(avatar)}
                        disabled={isEquipped}
                        className={`w-full py-2 rounded-xl font-black uppercase text-[12px] md:text-[14px] transition-all ${
                          isEquipped
                            ? isDarkMode
                              ? 'bg-slate-700 text-slate-400'
                              : 'bg-stone-200 text-stone-400'
                            : 'bg-emerald-400 text-emerald-900 border-b-[4px] border-emerald-500 active:translate-y-[4px] active:border-b-0'
                        }`}
                      >
                        {isEquipped ? 'Em Uso' : 'Equipar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => buyAvatar(avatar)}
                        disabled={coins < avatar.price}
                        className={`w-full py-2 rounded-xl font-black uppercase text-[12px] md:text-[14px] transition-all flex items-center justify-center gap-1 border-b-[4px] ${
                          coins >= avatar.price
                            ? 'bg-amber-400 text-amber-900 border-amber-500 active:translate-y-[4px] active:border-b-0'
                            : isDarkMode
                              ? 'bg-slate-700 text-slate-400 border-slate-600'
                              : 'bg-stone-200 text-stone-400 border-stone-300'
                        }`}
                      >
                        <Lock size={14} /> {avatar.price} 🪙
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'powerups' && (
            <div className="space-y-4">
              {POWER_UPS.map((powerUp) => {
                const currentLevel = powerUps[powerUp.id];
                const isMax = currentLevel >= powerUp.maxLevel;
                const cost = powerUp.basePrice * (currentLevel + 1);

                return (
                  <div
                    key={powerUp.id}
                    className={`border-[4px] rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6 ${getCardClasses(isDarkMode)}`}
                  >
                    <div className="text-[48px] leading-none drop-shadow-sm shrink-0">{powerUp.icon}</div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-1 gap-4">
                        <h4 className={`font-black uppercase tracking-tight text-[18px] md:text-[22px] ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                          {powerUp.name}
                        </h4>
                        <span className={`font-black text-[14px] px-3 py-1 rounded-full border ${
                          isDarkMode ? 'text-amber-200 bg-amber-950/70 border-amber-700' : 'text-amber-500 bg-amber-100 border-amber-200'
                        }`}>
                          NV {currentLevel}/{powerUp.maxLevel}
                        </span>
                      </div>
                      <span className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getRarityBadgeClasses(isDarkMode, powerUp.rarity)}`}>
                        {powerUp.rarity}
                      </span>
                      <p className={`text-[14px] md:text-[16px] font-bold leading-snug mb-4 ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
                        {powerUp.desc}
                      </p>

                      <div className="flex gap-2 mb-4 justify-center sm:justify-start">
                        {[...Array(powerUp.maxLevel)].map((_, index) => (
                          <div
                            key={index}
                            className={`h-3 flex-1 max-w-[40px] rounded-full ${
                              index < currentLevel
                                ? 'bg-emerald-400 shadow-inner'
                                : isDarkMode
                                  ? 'bg-slate-700'
                                  : 'bg-stone-200'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => upgradePowerUp(powerUp.id, powerUp)}
                        disabled={isMax || coins < cost}
                        className={`w-full sm:w-auto px-6 py-3 rounded-[1.5rem] font-black uppercase text-[14px] md:text-[16px] transition-all flex items-center justify-center sm:justify-start gap-2 border-b-[4px] ${
                          isMax
                            ? isDarkMode
                              ? 'bg-slate-700 text-slate-400 border-slate-600'
                              : 'bg-stone-200 text-stone-400 border-stone-300'
                            : coins >= cost
                              ? 'bg-sky-400 text-sky-950 border-sky-500 active:translate-y-[4px] active:border-b-0'
                              : isDarkMode
                                ? 'bg-slate-700 text-slate-400 border-slate-600'
                                : 'bg-stone-200 text-stone-400 border-stone-300'
                        }`}
                      >
                        {isMax ? 'Máximo' : <><ArrowUpCircle size={20} /> Melhorar ({cost}🪙)</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'routes' && (
            <div className="space-y-4">
              {ROUTE_UPGRADES.map((routeUpgrade) => {
                const currentLevel = routeUpgrades[routeUpgrade.id];
                const isMax = currentLevel >= routeUpgrade.maxLevel;
                const cost = routeUpgrade.basePrice * (currentLevel + 1);

                return (
                  <div
                    key={routeUpgrade.id}
                    className={`border-[4px] rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6 ${getCardClasses(isDarkMode)}`}
                  >
                    <div className="text-[48px] leading-none drop-shadow-sm shrink-0">{routeUpgrade.icon}</div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-1 gap-4">
                        <h4 className={`font-black uppercase tracking-tight text-[18px] md:text-[22px] ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                          {routeUpgrade.name}
                        </h4>
                        <span className={`font-black text-[14px] px-3 py-1 rounded-full border ${
                          isDarkMode ? 'text-amber-200 bg-amber-950/70 border-amber-700' : 'text-amber-500 bg-amber-100 border-amber-200'
                        }`}>
                          NV {currentLevel}/{routeUpgrade.maxLevel}
                        </span>
                      </div>
                      <span className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getRarityBadgeClasses(isDarkMode, routeUpgrade.rarity)}`}>
                        {routeUpgrade.rarity}
                      </span>
                      <p className={`text-[14px] md:text-[16px] font-bold leading-snug mb-4 ${isDarkMode ? 'text-slate-300' : 'text-stone-500'}`}>
                        {routeUpgrade.desc}
                      </p>

                      <div className="flex gap-2 mb-4 justify-center sm:justify-start">
                        {[...Array(routeUpgrade.maxLevel)].map((_, index) => (
                          <div
                            key={index}
                            className={`h-3 flex-1 max-w-[40px] rounded-full ${
                              index < currentLevel
                                ? 'bg-cyan-400 shadow-inner'
                                : isDarkMode
                                  ? 'bg-slate-700'
                                  : 'bg-stone-200'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => upgradeRoute(routeUpgrade.id, routeUpgrade)}
                        disabled={isMax || coins < cost}
                        className={`w-full sm:w-auto px-6 py-3 rounded-[1.5rem] font-black uppercase text-[14px] md:text-[16px] transition-all flex items-center justify-center sm:justify-start gap-2 border-b-[4px] ${
                          isMax
                            ? isDarkMode
                              ? 'bg-slate-700 text-slate-400 border-slate-600'
                              : 'bg-stone-200 text-stone-400 border-stone-300'
                            : coins >= cost
                              ? 'bg-cyan-400 text-cyan-950 border-cyan-500 active:translate-y-[4px] active:border-b-0'
                              : isDarkMode
                                ? 'bg-slate-700 text-slate-400 border-slate-600'
                                : 'bg-stone-200 text-stone-400 border-stone-300'
                        }`}
                      >
                        {isMax ? 'Maximo' : <><ArrowUpCircle size={20} /> Melhorar ({cost}🪙)</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreditsModal({ onClose, isDarkMode }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`absolute inset-0 z-[250] flex items-center justify-center px-4 md:px-6 py-6 overflow-y-auto custom-scrollbar backdrop-blur-md ${
      isDarkMode ? 'bg-black/85' : 'bg-stone-900/80'
    } ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="credits-title"
        className={getPanelClasses(isDarkMode, isClosing, 'max-w-2xl my-auto p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem]')}
      >
        <button onClick={handleClose} className={getCloseButtonClasses(isDarkMode)} aria-label="Fechar créditos">
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <h2 id="credits-title" className={`text-[32px] md:text-[40px] font-black tracking-tighter uppercase mb-2 text-center leading-none ${
          isDarkMode ? 'text-white' : 'text-stone-800'
        }`}>
          Créditos e Licenças
        </h2>
        <p className={`text-center font-bold uppercase tracking-widest text-[12px] md:text-[14px] mb-8 ${
          isDarkMode ? 'text-slate-400' : 'text-stone-400'
        }`}>
          Agradecimentos à comunidade open source
        </p>

        <div className="space-y-4 mb-8">
          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 ${getCardClasses(isDarkMode)}`}>
            <div className="flex-1">
              <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-indigo-300' : 'text-sky-600'}`}>
                React-Globe.gl & Three.js
              </h4>
              <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                Motor 3D e visualização do globo. Licença MIT.
              </p>
            </div>
            <button
              onClick={() => openLink('https://github.com/vasturiano/react-globe.gl')}
              className={`px-4 py-2 font-black uppercase text-[12px] rounded-xl transition-colors ${
                isDarkMode ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
              }`}
            >
              Visitar
            </button>
          </div>

          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm ${getCardClasses(isDarkMode)}`}>
            <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              FlagCDN
            </h4>
            <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
              Provedor de alta performance para imagens das bandeiras dos países.
            </p>
          </div>

          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm ${getCardClasses(isDarkMode)}`}>
            <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
              Natural Earth Data
            </h4>
            <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
              GeoJSON das bordas dos países proveniente de dados de domínio público.
            </p>
          </div>

          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm ${getCardClasses(isDarkMode)}`}>
            <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-rose-300' : 'text-rose-600'}`}>
              Lucide Icons & Fonts
            </h4>
            <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
              Ícones da interface em MIT e tipografia Outfit distribuída pelo Google Fonts em OFL.
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className={`w-full py-5 md:py-6 rounded-[2rem] text-[20px] md:text-[24px] font-black uppercase tracking-widest transition-transform active:scale-95 ${
            isDarkMode ? 'bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 text-white' : 'bg-stone-100 border-2 border-stone-200 hover:bg-stone-200 text-stone-800'
          }`}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
