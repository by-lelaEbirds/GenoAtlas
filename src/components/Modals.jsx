import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Award, Trophy } from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../constants';

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className={`absolute inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 py-10 md:py-16 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[85dvh] ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}>
        
        <button onClick={handleClose} className="absolute top-6 right-6 md:top-8 md:right-8 bg-stone-100 p-3 md:p-4 rounded-full text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-colors shadow-sm active:scale-95 z-10">
          <X size={28} className="md:w-9 md:h-9" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-8 md:mb-10 shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4 md:mb-6 border-[6px] md:border-[8px] border-amber-200 shadow-inner">
            <Award size={48} className="md:w-16 md:h-16" strokeWidth={2.5} />
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black text-stone-800 tracking-tighter uppercase text-center leading-none mb-3 md:mb-4">Conquistas</h2>
          <p className="text-stone-400 text-[14px] md:text-[18px] font-bold uppercase tracking-widest bg-stone-100 px-6 py-2 rounded-full border-2 border-stone-200 shadow-sm">
            {unlockedIds.length} / {ACHIEVEMENTS_LIST.length} Desbloqueadas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4 space-y-4 md:space-y-6">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div key={ach.id} className={`p-6 md:p-8 rounded-[2rem] border-b-[8px] flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6 transition-all ${isUnlocked ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-200 opacity-60 grayscale'}`}>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner border-[4px] ${isUnlocked ? 'bg-amber-400 text-amber-900 border-amber-500' : 'bg-stone-200 text-stone-400 border-stone-300'}`}>
                  <Trophy size={28} className="md:w-9 md:h-9" strokeWidth={2.5}/>
                </div>
                <div className="flex-1">
                  <h4 className={`font-black uppercase tracking-tight text-[22px] md:text-[28px] leading-tight ${isUnlocked ? 'text-amber-800' : 'text-stone-500'}`}>{ach.title}</h4>
                  <p className="text-[14px] md:text-[18px] text-stone-500 font-bold leading-snug mt-1 md:mt-2">{ach.desc}</p>
                </div>
                {isUnlocked && (
                   <div className="sm:self-center shrink-0">
                     <CheckCircle size={32} className="md:w-10 md:h-10 text-emerald-500 drop-shadow-sm" strokeWidth={2.5} />
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
