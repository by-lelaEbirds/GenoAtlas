import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Award, Trophy, ShoppingCart, Lock, ArrowUpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AVATARS, POWER_UPS } from '../constants/shop';
import { ACHIEVEMENTS_LIST } from '../constants/achievements';
import { saveNativeData } from '../utils/storage';

export function TutorialModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200); 
  };

  return (
    <div className={`absolute inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-6 overflow-y-auto custom-scrollbar ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative shadow-2xl my-auto ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        
        <div className="w-24 h-24 md:w-32 md:h-32 bg-sky-100 border-[6px] md:border-[8px] border-sky-200 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
          <ShieldAlert size={48} className="md:w-16 md:h-16" strokeWidth={2.5} />
        </div>
        <h2 className="text-[36px] md:text-[52px] font-black text-stone-800 text-center tracking-tighter uppercase mb-8 md:mb-10 leading-none">Como Jogar</h2>
        
        <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
          <div className="flex gap-4 md:gap-6 items-center bg-stone-50 border-[4px] border-stone-100 p-6 md:p-8 rounded-[2rem] shadow-inner">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-400 flex items-center justify-center text-white shrink-0 font-black text-[24px] md:text-[32px] border-[4px] border-emerald-200 shadow-sm">1</div>
            <p className="text-stone-500 text-[18px] md:text-[24px] font-bold leading-tight">Veja o nome do <strong className="text-stone-800">País</strong> ou <strong className="text-stone-800">Clube</strong> no centro da tela.</p>
          </div>
          <div className="flex gap-4 md:gap-6 items-center bg-stone-50 border-[4px] border-stone-100 p-6 md:p-8 rounded-[2rem] shadow-inner">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-400 flex items-center justify-center text-white shrink-0 font-black text-[24px] md:text-[32px] border-[4px] border-amber-200 shadow-sm">2</div>
            <p className="text-stone-500 text-[18px] md:text-[24px] font-bold leading-tight">Gire o globo e clique no território correto antes que o <strong className="text-stone-800">tempo acabe</strong>.</p>
          </div>
          <div className="flex gap-4 md:gap-6 items-center bg-stone-50 border-[4px] border-stone-100 p-6 md:p-8 rounded-[2rem] shadow-inner">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-rose-400 flex items-center justify-center text-white shrink-0 font-black text-[24px] md:text-[32px] border-[4px] border-rose-200 shadow-sm">3</div>
            <p className="text-stone-500 text-[18px] md:text-[24px] font-bold leading-tight">Cuidado! Você só tem <strong className="text-stone-800">3 vidas</strong>. Erros custam caro.</p>
          </div>
        </div>

        <button onClick={handleClose} className="w-full bg-emerald-400 text-emerald-950 py-6 md:py-8 rounded-[2.5rem] border-b-[8px] md:border-b-[10px] border-emerald-500 font-black uppercase tracking-widest text-[24px] md:text-[32px] flex items-center justify-center gap-4 active:translate-y-[8px] active:border-b-0 transition-all hover:bg-emerald-500">
          Entendido <CheckCircle size={36} className="md:w-10 md:h-10" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export function AchievementsModal({ onClose, unlockedIds }) {
  const [isClosing, setIsClosing] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // Controla o Accordion

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Calcula o total de moedas ganhas
  const totalCoinsEarned = ACHIEVEMENTS_LIST.reduce((total, ach) => {
    return unlockedIds.includes(ach.id) ? total + ach.reward : total;
  }, 0);

  // Define as cores baseadas no nível (Bronze, Prata, Ouro)
  const getColorStyles = (colorType, isUnlocked) => {
    if (!isUnlocked) return 'bg-stone-50 border-stone-200 text-stone-400';
    switch (colorType) {
      case 'gold': return 'bg-amber-100 border-amber-400 text-amber-800 shadow-[inset_0_0_15px_rgba(251,191,36,0.3)]';
      case 'silver': return 'bg-slate-100 border-slate-400 text-slate-700 shadow-[inset_0_0_15px_rgba(148,163,184,0.3)]';
      case 'bronze': default: return 'bg-orange-50 border-orange-300 text-orange-800 shadow-[inset_0_0_15px_rgba(251,146,60,0.2)]';
    }
  };

  return (
    <div className={`absolute inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-10 md:py-16 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[85dvh] ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        
        <button onClick={handleClose} className="absolute top-6 right-6 md:top-8 md:right-8 bg-stone-100 p-3 md:p-4 rounded-full text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-colors shadow-sm active:scale-95 z-10">
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6 shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4 border-[6px] md:border-[8px] border-amber-200 shadow-inner">
            <Award size={40} className="md:w-16 md:h-16" strokeWidth={2.5} />
          </div>
          <h2 className="text-[32px] md:text-[48px] font-black text-stone-800 tracking-tighter uppercase text-center leading-none mb-4">Conquistas</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full justify-center">
            <div className="bg-stone-100 px-6 py-2 rounded-full border-2 border-stone-200 shadow-sm flex flex-col items-center">
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-stone-400">Desbloqueadas</span>
              <span className="text-[16px] md:text-[20px] font-black text-stone-700">{unlockedIds.length} / {ACHIEVEMENTS_LIST.length}</span>
            </div>
            <div className="bg-amber-50 px-6 py-2 rounded-full border-2 border-amber-200 shadow-sm flex flex-col items-center">
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-amber-500">Total Recebido</span>
              <span className="text-[16px] md:text-[20px] font-black text-amber-600">{totalCoinsEarned} 🪙</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4 space-y-3 md:space-y-4">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            const isExpanded = expandedId === ach.id;
            const styleClass = getColorStyles(ach.color, isUnlocked);
            
            return (
              <div 
                key={ach.id} 
                onClick={() => toggleExpand(ach.id)}
                className={`rounded-[1.5rem] md:rounded-[2rem] border-[4px] border-b-[6px] md:border-[4px] md:border-b-[8px] overflow-hidden transition-all cursor-pointer active:translate-y-[2px] active:border-b-[4px] ${styleClass} ${!isUnlocked ? 'opacity-80 grayscale' : ''}`}
              >
                {/* Header Visível sempre */}
                <div className="p-4 md:p-6 flex items-center gap-4">
                  <div className="text-[32px] md:text-[40px] drop-shadow-sm shrink-0 leading-none">{ach.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black uppercase tracking-tight text-[18px] md:text-[22px] leading-none mb-1">{ach.title}</h4>
                    </div>
                    <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${isUnlocked ? 'bg-white/50 border-white text-current' : 'bg-stone-200 border-stone-300'}`}>Nível {ach.level}</span>
                  </div>
                  <div className="shrink-0 flex items-center justify-center">
                    {isUnlocked ? (
                       <CheckCircle size={28} className="text-emerald-500 drop-shadow-sm bg-white rounded-full border-2 border-emerald-100" />
                    ) : (
                       <Lock size={24} className="text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Conteúdo Expandido (Accordion) */}
                {isExpanded && (
                  <div className="px-4 pb-4 md:px-6 md:pb-6 pt-2 border-t-[3px] border-current/10 animate-fade-in-down flex flex-col">
                    <p className="text-[14px] md:text-[16px] font-bold leading-snug mb-4 opacity-90">{ach.desc}</p>
                    <div className="flex justify-between items-center bg-white/40 p-3 rounded-xl border border-white/50">
                      <span className="font-black uppercase tracking-widest text-[12px] md:text-[14px]">Recompensa:</span>
                      <span className="font-black text-[16px] md:text-[20px] flex items-center gap-1">{ach.reward} 🪙</span>
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

export function ShopModal({ onClose, coins, setCoins, unlockedAvatars, setUnlockedAvatars, activeAvatar, setActiveAvatar, powerUps, setPowerUps }) {
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

  return (
    <div className={`absolute inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-10 md:py-16 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[85dvh] ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        
        <button onClick={handleClose} className="absolute top-6 right-6 md:top-8 md:right-8 bg-stone-100 p-3 md:p-4 rounded-full text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-colors shadow-sm active:scale-95 z-10">
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6 shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 border-[6px] md:border-[8px] border-emerald-200 shadow-inner">
            <ShoppingCart size={40} className="md:w-14 md:h-14" strokeWidth={2.5} />
          </div>
          <h2 className="text-[32px] md:text-[48px] font-black text-stone-800 tracking-tighter uppercase text-center leading-none mb-4">Lojinha</h2>
          
          <div className="flex bg-stone-100 p-2 rounded-full border-2 border-stone-200 w-full max-w-sm">
            <button onClick={() => setTab('avatars')} className={`flex-1 py-3 rounded-full font-black uppercase tracking-widest text-[14px] md:text-[16px] transition-all ${tab === 'avatars' ? 'bg-white text-stone-800 shadow-sm border-b-[4px] border-stone-200' : 'text-stone-400 hover:text-stone-600'}`}>Veículos</button>
            <button onClick={() => setTab('powerups')} className={`flex-1 py-3 rounded-full font-black uppercase tracking-widest text-[14px] md:text-[16px] transition-all ${tab === 'powerups' ? 'bg-white text-stone-800 shadow-sm border-b-[4px] border-stone-200' : 'text-stone-400 hover:text-stone-600'}`}>Melhorias</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4">
          
          {tab === 'avatars' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AVATARS.map(avatar => {
                const isUnlocked = unlockedAvatars.includes(avatar.id);
                const isEquipped = activeAvatar.id === avatar.id;
                
                return (
                  <div key={avatar.id} className={`bg-stone-50 border-[4px] border-stone-100 rounded-[2rem] p-4 flex flex-col items-center text-center transition-all ${isEquipped ? 'ring-4 ring-amber-400 bg-amber-50' : ''}`}>
                    <div className="text-[48px] md:text-[64px] mb-2 leading-none drop-shadow-md">
                      {avatar.type === 'emoji' ? avatar.icon : <img src={avatar.icon} alt={avatar.name} className="w-16 h-16 object-contain"/>}
                    </div>
                    <span className="font-bold text-stone-600 uppercase text-[12px] md:text-[14px] mb-4 tracking-wider leading-tight line-clamp-2">{avatar.name}</span>
                    
                    {isUnlocked ? (
                      <button 
                        onClick={() => equipAvatar(avatar)}
                        disabled={isEquipped}
                        className={`w-full py-2 rounded-xl font-black uppercase text-[12px] md:text-[14px] transition-all ${isEquipped ? 'bg-stone-200 text-stone-400' : 'bg-emerald-400 text-emerald-900 border-b-[4px] border-emerald-500 active:translate-y-[4px] active:border-b-0'}`}
                      >
                        {isEquipped ? 'Em Uso' : 'Equipar'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => buyAvatar(avatar)}
                        disabled={coins < avatar.price}
                        className={`w-full py-2 rounded-xl font-black uppercase text-[12px] md:text-[14px] transition-all flex items-center justify-center gap-1 border-b-[4px] ${coins >= avatar.price ? 'bg-amber-400 text-amber-900 border-amber-500 active:translate-y-[4px] active:border-b-0' : 'bg-stone-200 text-stone-400 border-stone-300'}`}
                      >
                        <Lock size={14}/> {avatar.price} 🪙
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'powerups' && (
            <div className="space-y-4">
              {POWER_UPS.map(up => {
                const currentLvl = powerUps[up.id];
                const isMax = currentLvl >= up.maxLevel;
                const cost = up.basePrice * (currentLvl + 1);

                return (
                  <div key={up.id} className="bg-stone-50 border-[4px] border-stone-100 rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6">
                    <div className="text-[48px] leading-none drop-shadow-sm shrink-0">{up.icon}</div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black uppercase tracking-tight text-[18px] md:text-[22px] text-stone-800">{up.name}</h4>
                        <span className="text-amber-500 font-black text-[14px] bg-amber-100 px-3 py-1 rounded-full border border-amber-200">NV {currentLvl}/{up.maxLevel}</span>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-stone-500 font-bold leading-snug mb-4">{up.desc}</p>
                      
                      <div className="flex gap-2 mb-4 justify-center sm:justify-start">
                        {[...Array(up.maxLevel)].map((_, i) => (
                          <div key={i} className={`h-3 flex-1 max-w-[40px] rounded-full ${i < currentLvl ? 'bg-emerald-400 shadow-inner' : 'bg-stone-200'}`} />
                        ))}
                      </div>

                      <button 
                        onClick={() => upgradePowerUp(up.id, up)}
                        disabled={isMax || coins < cost}
                        className={`w-full sm:w-auto px-6 py-3 rounded-[1.5rem] font-black uppercase text-[14px] md:text-[16px] transition-all flex items-center justify-center sm:justify-start gap-2 border-b-[4px] ${isMax ? 'bg-stone-200 text-stone-400 border-stone-300' : coins >= cost ? 'bg-sky-400 text-sky-950 border-sky-500 active:translate-y-[4px] active:border-b-0' : 'bg-stone-200 text-stone-400 border-stone-300'}`}
                      >
                        {isMax ? 'Máximo' : <><ArrowUpCircle size={20}/> Melhorar ({cost}🪙)</>}
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
    window.open(url, '_blank');
  };

  return (
    <div className={`absolute inset-0 z-[250] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-6 overflow-y-auto custom-scrollbar ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative shadow-2xl my-auto ${isDarkMode ? 'bg-slate-900 border-[4px] border-slate-700 text-slate-200' : 'bg-white border-b-[12px] md:border-b-[16px] border-stone-200 text-stone-600'} ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        
        <button onClick={handleClose} className={`absolute top-6 right-6 md:top-8 md:right-8 p-3 md:p-4 rounded-full transition-colors shadow-sm active:scale-95 z-10 ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700' : 'bg-stone-100 text-stone-400 hover:text-rose-500 hover:bg-stone-200'}`}>
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <h2 className={`text-[32px] md:text-[40px] font-black tracking-tighter uppercase mb-2 text-center leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Créditos e Licenças</h2>
        <p className={`text-center font-bold uppercase tracking-widest text-[12px] md:text-[14px] mb-8 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Agradecimentos à comunidade Open-Source</p>
        
        <div className="space-y-4 mb-8">
          
          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
            <div className="flex-1">
              <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-sky-600'}`}>React-Globe.gl & Three.js</h4>
              <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Motor 3D e visualização do globo. (Licença MIT)</p>
            </div>
            <button onClick={() => openLink('https://github.com/vasturiano/react-globe.gl')} className={`px-4 py-2 font-black uppercase text-[12px] rounded-xl transition-colors ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}>Visitar</button>
          </div>

          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
            <div className="flex-1">
              <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>FlagCDN</h4>
              <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Provedor de alta performance para imagens das bandeiras dos países.</p>
            </div>
          </div>

          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
            <div className="flex-1">
              <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Natural Earth Data</h4>
              <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Borda dos países (GeoJSON) proveniente de dados de domínio público.</p>
            </div>
          </div>

          <div className={`p-5 md:p-6 rounded-[2rem] border-[4px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
            <div className="flex-1">
              <h4 className={`text-[20px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>Lucide Icons & Fonts</h4>
              <p className={`text-[14px] font-bold leading-tight ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Ícones da interface (MIT) e tipografia "Outfit" pelo Google Fonts (OFL).</p>
            </div>
          </div>

        </div>

        <button onClick={handleClose} className={`w-full py-5 md:py-6 rounded-[2rem] text-[20px] md:text-[24px] font-black uppercase tracking-widest transition-transform active:scale-95 ${isDarkMode ? 'bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 text-white' : 'bg-stone-100 border-2 border-stone-200 hover:bg-stone-200 text-stone-800'}`}>
          Fechar
        </button>
      </div>
    </div>
  );
}
