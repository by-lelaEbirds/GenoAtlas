import React from 'react';
import { X, CheckCircle, ShieldAlert, Award, Trophy } from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../constants';

export function TutorialModal({ onClose }) {
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 animate-fade-in-up">
      <div className="bg-stone-900 border-4 border-stone-800 p-8 rounded-[2.5rem] max-w-sm w-full relative shadow-2xl">
        <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-3xl font-black text-white text-center tracking-tighter uppercase mb-6">Como Jogar</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 items-start bg-stone-800 p-4 rounded-2xl shadow-inner">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 font-black">1</div>
            <p className="text-stone-300 text-sm font-medium">Veja o nome do <strong className="text-white">País</strong> ou <strong className="text-white">Clube</strong> no centro da tela.</p>
          </div>
          <div className="flex gap-4 items-start bg-stone-800 p-4 rounded-2xl shadow-inner">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 font-black">2</div>
            <p className="text-stone-300 text-sm font-medium">Gire o globo e clique no território correto antes que o <strong className="text-white">tempo acabe</strong>.</p>
          </div>
          <div className="flex gap-4 items-start bg-stone-800 p-4 rounded-2xl shadow-inner">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 font-black">3</div>
            <p className="text-stone-300 text-sm font-medium">Cuidado! Você só tem <strong className="text-white">3 vidas</strong>. Erros custam caro.</p>
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-green-500 text-white py-4 rounded-2xl shadow-[0_5px_0_0_#15803d] font-black uppercase tracking-widest text-lg flex items-center justify-center gap-2 active:translate-y-[5px] active:shadow-none transition-all">
          Entendido <CheckCircle size={22} />
        </button>
      </div>
    </div>
  );
}

export function AchievementsModal({ onClose, unlockedIds }) {
  return (
    // CORREÇÃO: z-[200] para garantir que abre por cima da Navbar do StartScreen
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 animate-fade-in-up py-10">
      <div className="bg-white border-[6px] border-stone-200 p-6 md:p-8 rounded-[2.5rem] max-w-md w-full relative shadow-2xl flex flex-col max-h-[85dvh]">
        
        <button onClick={onClose} className="absolute top-4 right-4 bg-stone-100 p-2 rounded-full text-stone-400 hover:text-rose-500 hover:bg-stone-200 transition-colors shadow-sm">
          <X size={20} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-2 border-b-4 border-amber-200">
            <Award size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tighter uppercase text-center">Conquistas</h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1 bg-stone-100 px-3 py-1 rounded-full">
            {unlockedIds.length} / {ACHIEVEMENTS_LIST.length} Desbloqueadas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div key={ach.id} className={`p-4 rounded-2xl border-b-[5px] flex items-center gap-4 transition-all ${isUnlocked ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-200 opacity-60 grayscale'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner border-2 ${isUnlocked ? 'bg-amber-400 text-amber-900 border-amber-500' : 'bg-stone-200 text-stone-400 border-stone-300'}`}>
                  <Trophy size={20} strokeWidth={2.5}/>
                </div>
                <div className="flex-1">
                  <h4 className={`font-black uppercase tracking-tight text-sm ${isUnlocked ? 'text-amber-800' : 'text-stone-500'}`}>{ach.title}</h4>
                  <p className="text-[10px] text-stone-500 font-bold leading-tight mt-0.5">{ach.desc}</p>
                </div>
                {isUnlocked && <CheckCircle size={24} className="text-green-500 shrink-0 drop-shadow-sm" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
