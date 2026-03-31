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
    if (reason === 'win' || reason === 'daily_win') return isDarkMode ? 'bg-amber-950/50 border-amber-900 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-amber-100 border-amber-200';
    if (reason === 'time') return isDarkMode ? 'bg-sky-950/50 border-sky-900 shadow-[0_0_30px_rgba(14,165,233,0.2)]' : 'bg-sky-100 border-sky-200';
    return isDarkMode ? 'bg-rose-950/50 border-rose-900 shadow-[0_0_30px_rgba(225,29,72,0.2)]' : 'bg-rose-100 border-rose-200';
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
    <div className={`absolute inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/90' : 'bg-stone-900/80'} px-4 md:px-6 animate-fade-in-up overflow-y-auto custom-scrollbar py-10`}>
      <section role="dialog" aria-modal="true" aria-labelledby="result-title" className={`${isDarkMode ? 'bg-slate-900 border-slate-700 shadow-[0_0_50px_rgba(14,165,233,0.15)]' : 'bg-white border-stone-200 shadow-2xl'} border-b-[12px] md:border-b-[16px] p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] max-w-md w-full relative text-center my-auto flex flex-col`}>
        
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
          <div className={`rounded-[2rem] p-6 border-[4px] flex justify-between items-center shadow-inner ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
            <span className={`text-[16px] md:text-[20px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Pontuação</span>
            <span aria-label={`Sua pontuação foi de ${score} pontos`} className={`text-[36px] md:text-[48px] font-black tracking-tighter leading-none ${isNewRecord ? 'text-amber-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : (isDarkMode ? 'text-white' : 'text-stone-800')}`}>{score}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-[2rem] p-4 border-[4px] flex flex-col items-center justify-center shadow-inner ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
              <span className={`text-[12px] md:text-[14px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Acertos</span>
              <span aria-label={`Você acertou ${guessedCount} vezes`} className={`text-[28px] md:text-[36px] leading-none font-bold ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{guessedCount}</span>
            </div>
            <div className={`rounded-[2rem] p-4 border-[4px] flex flex-col items-center justify-center shadow-inner ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-100'}`}>
              <span className={`text-[12px] md:text-[14px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-stone-400'}`}>Moedas</span>
              <div className="flex items-center gap-2">
                <Coins aria-hidden="true" size={24} md:size={28} className="text-amber-400" />
                <span aria-label={`Ganhou ${coinsEarned} moedas`} className="text-[28px] md:text-[36px] leading-none font-bold text-amber-500">+{coinsEarned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 w-full flex justify-center transform origin-top">
          <AdBanner dataAdSlot="RESULT_SCREEN_SLOT" />
        </div>

        <nav aria-label="Ações de fim de jogo" className="flex flex-col gap-4">
          <button onClick={handleShare} className="w-full bg-sky-500 text-white py-5 rounded-[2rem] border-b-[8px] border-sky-700 font-black uppercase tracking-widest text-[18px] md:text-[22px] flex items-center justify-center gap-3 active:translate-y-[8px] active:border-b-0 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            {copied ? <Check aria-hidden="true" size={28} className="fill-current" /> : <Share2 aria-hidden="true" size={28} className="fill-current" />}
            {copied ? 'Copiado!' : 'Desafiar Amigos'}
          </button>

          <div className="flex gap-4">
            {gameMode !== 'daily' && (
              <button onClick={onRestart} className="flex-1 bg-emerald-500 text-white py-5 rounded-[2rem] border-b-[8px] border-emerald-700 font-black uppercase tracking-widest text-[16px] md:text-[20px] flex flex-col items-center justify-center gap-1 active:translate-y-[8px] active:border-b-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <RefreshCw aria-hidden="true" size={24} /> Rejogar
              </button>
            )}
            
            <button onClick={onHome} className={`flex-1 py-5 rounded-[2rem] border-b-[8px] font-black uppercase tracking-widest text-[16px] md:text-[20px] flex flex-col items-center justify-center gap-1 active:translate-y-[8px] active:border-b-0 transition-all ${isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-900 hover:bg-slate-600' : 'bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300'}`}>
              <Home aria-hidden="true" size={24} /> Menu
            </button>
          </div>
        </nav>

      </section>
    </div>
  );
}
