import React, { useState } from 'react';
import { Trophy, AlertTriangle, RotateCcw, Home, Share2, Check } from 'lucide-react';

export default function ResultScreen({ score, reason, bestScore, onRestart, onHome }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareText = `🌍 GEO GUESS 🌍\n💥 Fiz ${score} pontos a explorar o mapa 3D!\n🏆 O meu recorde é ${bestScore}.\n\nConsegues bater-me? Joga em: ${window.location.href}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900/90 to-black border border-white/10 p-1 rounded-[2rem] shadow-[0_0_80px_rgba(34,211,238,0.1)] max-w-lg w-full mx-4 text-center transform transition-all">
        <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-[1.9rem] p-10">
          <div className="flex justify-center mb-6">
            {reason === 'lives' ? (
              <AlertTriangle className="text-red-500 w-24 h-24 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            ) : (
              <Trophy className="text-amber-400 w-24 h-24 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            )}
          </div>
          
          <h1 className="text-4xl font-black text-white tracking-widest mb-2 drop-shadow-md">
            {reason === 'lives' ? 'FIM DE JOGO!' : 'TEMPO ESGOTADO!'}
          </h1>
          <p className="text-slate-400 mb-8 text-lg font-medium">
            {reason === 'lives' ? 'Perdeste as tuas 3 vidas.' : 'O teu minuto de exploração acabou.'}
          </p>

          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 mb-8 shadow-inner">
            <p className="text-slate-500 uppercase tracking-widest text-sm font-bold mb-3">Pontuação Final</p>
            <p className="text-7xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">{score}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleShare}
              className="w-full py-4 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/30 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1DA1F2]/20 transition-colors"
            >
              {copied ? <><Check size={20} /> COPIADO PARA PARTILHAR!</> : <><Share2 size={20} /> DESAFIAR AMIGOS</>}
            </button>

            <button 
              onClick={onRestart}
              className="group relative w-full py-4 bg-cyan-400 text-black font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 flex items-center gap-2"><RotateCcw size={22} /> JOGAR NOVAMENTE</span>
            </button>

            <button 
              onClick={onHome}
              className="w-full py-4 text-slate-400 hover:text-white font-bold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Home size={18} /> Voltar ao Menu Principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
