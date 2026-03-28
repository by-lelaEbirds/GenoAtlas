import React from 'react';
import { X, CheckCircle, ShieldAlert, Award, Trophy } from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../constants';

export function TutorialModal({ onClose }) {
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-6 animate-fade-in-up">
      <div className="bg-stone-900 border-[8px] border-stone-800 p-12 rounded-[4rem] max-w-2xl w-full relative shadow-2xl">
        <div className="w-32 h-32 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldAlert size={64} />
        </div>
        <h2 className="text-[52px] font-black text-white text-center tracking-tighter uppercase mb-10">Como Jogar</h2>
        
        <div className="space-y-6 mb-12">
          <div className="flex gap-6 items-start bg-stone-800 p-8 rounded-[2rem] shadow-inner">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 font-black text-[32px]">1</div>
            <p className="text-stone-300 text-[24px] font-medium leading-tight pt-2">Veja o nome do <strong className="text-white">País</strong> ou <strong className="text-white">Clube</strong> no centro da tela.</p>
          </div>
          <div className="flex gap-6 items-start bg-stone-800 p-8 rounded-[2rem] shadow-inner">
            <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 font-black text-[32px]">2</div>
            <p className="text-stone-300 text-[24px] font-medium leading-tight pt-2">Gire o globo e clique no território correto antes que o <strong className="text-white">tempo acabe</strong>.</p>
          </div>
          <div className="flex gap-6 items-start bg-stone-800 p-8 rounded-[2rem] shadow-inner">
            <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 font-black text-[32px]">3</div>
            <p className="text-stone-300 text-[24px] font-medium leading-tight pt-2">Cuidado! Você só tem <strong className="text-white">3 vidas</strong>. Erros custam caro.</p>
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-green-500 text-white py-8 rounded-[2.5rem] shadow-[0_12px_0_0_#15803d] font-black uppercase tracking-widest text-[32px] flex items-center justify-center gap-4 active:translate-y-[8px] active:shadow-none transition-all">
          Entendido <CheckCircle size={40} />
        </button>
      </div>
    </div>
  );
}

export function AchievementsModal({ onClose, unlockedIds }) {
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-6 animate-fade-in-up py-16">
      <div className="bg-white border-[12px] border-stone-200 p-10 rounded-[4rem] max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[85dvh]">
        
        <button onClick={onClose} className="absolute top-8 right-8 bg-stone-100 p-4 rounded-full text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-colors shadow-sm active:scale-95">
          <X size={36} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 border-b-[8px] border-amber-200">
            <Award size={64} />
          </div>
          <h2 className="text-[48px] font-black text-stone-800 tracking-tighter uppercase text-center leading-none mb-2">Conquistas</h2>
          <p className="text-stone-400 text-[18px] font-bold uppercase tracking-widest mt-2 bg-stone-100 px-6 py-2 rounded-full">
            {unlockedIds.length} / {ACHIEVEMENTS_LIST.length} Desbloqueadas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div key={ach.id} className={`p-8 rounded-[2.5rem] border-b-[10px] flex items-center gap-6 transition-all ${isUnlocked ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-200 opacity-60 grayscale'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner border-[4px] ${isUnlocked ? 'bg-amber-400 text-amber-900 border-amber-500' : 'bg-stone-200 text-stone-400 border-stone-300'}`}>
                  <Trophy size={36} strokeWidth={2.5}/>
                </div>
                <div className="flex-1">
                  <h4 className={`font-black uppercase tracking-tight text-[28px] ${isUnlocked ? 'text-amber-800' : 'text-stone-500'}`}>{ach.title}</h4>
                  <p className="text-[18px] text-stone-500 font-bold leading-tight mt-1">{ach.desc}</p>
                </div>
                {isUnlocked && <CheckCircle size={40} className="text-green-500 shrink-0 drop-shadow-sm" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
