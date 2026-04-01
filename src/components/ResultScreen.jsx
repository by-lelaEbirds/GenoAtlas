import React, { useState } from 'react';
import { RefreshCw, Home, Trophy, Coins, Clock, MapPin, Share2, Check, Sparkles } from 'lucide-react';
import AdBanner from './AdBanner';

export default function ResultScreen({ score, bestScore, guessedCount, reason, onRestart, onHome, coinsEarned, gameMode, isDarkMode }) {
  const [copied, setCopied] = useState(false);
  const isNewRecord = score > bestScore && score > 0 && (gameMode === 'normal' || gameMode === 'football');

  const getReasonText = () => {
    switch (reason) {
      case 'lives': return 'Fim da Linha!';
      case 'time': return 'Tempo Esgotado!';
      case 'win': return 'Globo Zerado!';
      case 'daily_win': return 'Desafio Concluído!';
      case 'daily_loss': return 'Falhou no Diário.';
      default: return 'Fim de Jogo';
    }
  };

  const getReasonIcon = () => {
    switch (reason) {
      case 'lives': return <MapPin className={isDarkMode ? 'text-rose-400' : 'text-rose-500'} size={48} strokeWidth={2.5} />;
      case 'time': return <Clock className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} size={48} strokeWidth={2.5} />;
      case 'win': case 'daily_win': return <Trophy className={isDarkMode ? 'text-amber-400' : 'text-amber-500'} size={48} strokeWidth={2.5} />;
      default: return <MapPin className={isDarkMode ? 'text-slate-400' : 'text-stone-500'} size={48} strokeWidth={2.5} />;
    }
  };

  const getHeaderColor = () => {
    if (reason === 'win' || reason === 'daily_win') return isDarkMode ? 'glass-panel neon-glow-amber border-amber-500/30' : 'glass-panel-light ring-4 ring-amber-200';
    if (reason === 'time') return isDarkMode ? 'glass-panel neon-glow-cyan border-cyan-500/30' : 'glass-panel-light ring-4 ring-sky-200';
    return isDarkMode ? 'glass-panel neon-glow-rose border-rose-500/30' : 'glass-panel-light ring-4 ring-rose-200';
  };

  const handleShare = async () => {
    const modeText = gameMode === 'football' ? 'clubes de futebol' : 'países';
    const shareText = `🌍 Fiz ${score} pontos e encontrei ${guessedCount} ${modeText} no GenoAtlas!\n\nConsegue bater o meu recorde? 🏆 jogue agora:`;
    const shareUrl = 'https://by-lelaebirds.github.io/GenoAtlas/';
    const fullText = `${shareText} ${shareUrl}`;

    if (navigator.share) {
      try { 
        await navigator.share({ title: 'Meu Recorde', text: shareText, url: shareUrl }); 
        return;
      } catch (err) { 
        if (err.name !== 'AbortError') console.log('API de Compartilhamento falhou, tentando Clipboard...', err);
        else return;
      }
    } 
    
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar para área de transferência', err);
    }
  };

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-stone-900/80'} px-4 md:px-6 animate-fade-in-up overflow-y-auto custom-scrollbar py-10`}>
      <section role="dialog" aria-modal="true" aria-labelledby="result-title" className={`${isDarkMode ? 'glass-panel shadow-[0_30px_60px_rgba(0,0,0,0.8)]' : 'glass-panel-light shadow-2xl'} p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] max-w-md w-full relative text-center my-auto flex flex-col`}>
        
        {isNewRecord && (
          <div role="status" className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 px-6 py-2 rounded-full text-sm md:text-base font-black tracking-widest uppercase border-[4px] border-white shadow-[0_0_20px_rgba(251,191,36,0.6)] whitespace-nowrap z-10 animate-bounce-short flex items-center gap-2">
            <Sparkles size={18} /> Novo Recorde! <Sparkles size={18} />
          </div>
        )}

        <header className="flex flex-col items-center mb-8 pt-4">
          <div aria-hidden="true" className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-[6px] shadow-inner ${getHeaderColor()}`}>
            {getReasonIcon()}
          </div>
          <h2 id="result-title" className={`text-[32px] md:text-[40px] font-black tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{getReasonText()}</h2>
        </header>

        <div className="space-y-4 mb-8">
          <div className={`rounded-[2rem] p-6 flex justify-between items-center transition-all ${isDarkMode ? 'glass-panel border-white/5' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
            <span className={`text-[16px] md:text-[20px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Pontuação</span>
            <span aria-label={`Sua pontuação foi de ${score} pontos`} className={`text-[36px] md:text-[48px] font-black tracking-tighter leading-none ${isNewRecord ? 'text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse-glow' : (isDarkMode ? 'text-white' : 'text-stone-800')}`}>{score}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-[2rem] p-4 flex flex-col items-center justify-center transition-all ${isDarkMode ? 'glass-panel border-white/5' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
              <span className={`text-[12px] md:text-[14px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Acertos</span>
              <span aria-label={`Você acertou ${guessedCount} vezes`} className={`text-[28px] md:text-[36px] leading-none font-bold ${isDarkMode ? 'text-white drop-shadow-sm' : 'text-stone-800'}`}>{guessedCount}</span>
            </div>
            <div className={`rounded-[2rem] p-4 flex flex-col items-center justify-center transition-all ${isDarkMode ? 'glass-panel border-white/5' : 'glass-panel-light border-stone-200 shadow-sm'}`}>
              <span className={`text-[12px] md:text-[14px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Moedas</span>
              <div className="flex items-center gap-2">
                <Coins aria-hidden="true" size={24} md:size={28} className="text-amber-400 drop-shadow-md" />
                <span aria-label={`Ganhou ${coinsEarned} moedas`} className="text-[28px] md:text-[36px] leading-none font-bold text-amber-500 drop-shadow-sm">+{coinsEarned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 w-full flex justify-center transform origin-top">
          <AdBanner dataAdSlot="RESULT_SCREEN_SLOT" />
        </div>

        <nav aria-label="Ações de fim de jogo" className="flex flex-col gap-4">
          <button onClick={handleShare} className="w-full bg-cyan-500/90 text-white neon-glow-cyan py-5 rounded-[2rem] font-black uppercase tracking-widest text-[18px] md:text-[22px] flex items-center justify-center gap-3 transition-all hover:bg-cyan-400">
            {copied ? <Check aria-hidden="true" size={28} className="fill-current" /> : <Share2 aria-hidden="true" size={28} className="fill-current" />}
            {copied ? 'Copiado!' : 'Desafiar Amigos'}
          </button>

          <div className="flex gap-4">
            {gameMode !== 'daily' && (
              <button onClick={onRestart} className="flex-1 bg-emerald-500/90 text-white neon-glow-emerald py-5 rounded-[2rem] font-black uppercase tracking-widest text-[16px] md:text-[20px] flex flex-col items-center justify-center gap-1 transition-all hover:bg-emerald-400">
                <RefreshCw aria-hidden="true" size={24} /> Rejogar
              </button>
            )}
            
            <button onClick={onHome} className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[16px] md:text-[20px] flex flex-col items-center justify-center gap-1 transition-all border ${isDarkMode ? 'glass-panel text-slate-300 hover:text-white hover:bg-white/10' : 'glass-panel-light text-stone-600 hover:bg-stone-100'}`}>
              <Home aria-hidden="true" size={24} /> Menu
            </button>
          </div>
        </nav>

      </section>
    </div>
  );
}
