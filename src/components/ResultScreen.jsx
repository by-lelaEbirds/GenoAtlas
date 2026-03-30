import React, { useState } from 'react';
import { RefreshCw, Home, Trophy, Coins, Clock, MapPin, Share2, Check } from 'lucide-react';
import AdBanner from './AdBanner';

export default function ResultScreen({ score, bestScore, guessedCount, reason, onRestart, onHome, coinsEarned, gameMode }) {
  const [copied, setCopied] = useState(false);
  const isNewRecord = score > bestScore && score > 0 && (gameMode === 'normal' || gameMode === 'football');

  const getReasonText = () => {
    switch (reason) {
      case 'lives': return 'Sem Vidas!';
      case 'time': return 'O Tempo Acabou!';
      case 'win': return 'Você Zerou o Globo!';
      case 'daily_win': return 'Desafio Diário Completo!';
      case 'daily_loss': return 'Falhou no Desafio Diário.';
      default: return 'Fim de Jogo';
    }
  };

  const getReasonIcon = () => {
    switch (reason) {
      case 'lives': return <MapPin className="text-rose-500" size={48} strokeWidth={2.5} />;
      case 'time': return <Clock className="text-sky-500" size={48} strokeWidth={2.5} />;
      case 'win': case 'daily_win': return <Trophy className="text-amber-500" size={48} strokeWidth={2.5} />;
      default: return <MapPin className="text-stone-500" size={48} strokeWidth={2.5} />;
    }
  };

  const getHeaderColor = () => {
    if (reason === 'win' || reason === 'daily_win') return 'bg-amber-100 border-amber-200';
    if (reason === 'time') return 'bg-sky-100 border-sky-200';
    return 'bg-rose-100 border-rose-200';
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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-md px-4 md:px-6 animate-fade-in-up overflow-y-auto custom-scrollbar pt-10 pb-10">
      <div className="bg-white border-b-[12px] md:border-b-[16px] border-stone-200 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] max-w-md w-full relative text-center shadow-2xl my-auto">
        
        {isNewRecord && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 px-6 py-2 rounded-full text-sm md:text-base font-black tracking-widest uppercase border-[4px] border-white shadow-lg whitespace-nowrap z-10 animate-bounce-short">
            ✨ Novo Recorde! ✨
          </div>
        )}

        <div className="flex flex-col items-center mb-8 pt-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-[6px] shadow-inner ${getHeaderColor()}`}>
            {getReasonIcon()}
          </div>
          <h2 className="text-[32px] md:text-[40px] font-black text-stone-800 tracking-tighter uppercase leading-none">{getReasonText()}</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-stone-50 rounded-[2rem] p-6 border-[4px] border-stone-100 flex justify-between items-center shadow-inner">
            <span className="text-stone-400 text-[16px] md:text-[20px] font-black uppercase tracking-widest">Pontuação</span>
            <span className={`text-[36px] md:text-[48px] font-black tracking-tighter leading-none ${isNewRecord ? 'text-amber-500' : 'text-stone-800'}`}>{score}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-[2rem] p-4 border-[4px] border-stone-100 flex flex-col items-center justify-center shadow-inner">
              <span className="text-stone-400 text-[12px] md:text-[14px] font-black uppercase tracking-widest mb-1">Acertos</span>
              <span className="text-[28px] md:text-[36px] leading-none font-bold text-stone-800">{guessedCount}</span>
            </div>
            <div className="bg-stone-50 rounded-[2rem] p-4 border-[4px] border-stone-100 flex flex-col items-center justify-center shadow-inner">
              <span className="text-stone-400 text-[12px] md:text-[14px] font-black uppercase tracking-widest mb-1">Moedas</span>
              <div className="flex items-center gap-2">
                <Coins size={24} md:size={28} className="text-amber-400" />
                <span className="text-[28px] md:text-[36px] leading-none font-bold text-amber-500">+{coinsEarned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 w-full flex justify-center transform origin-top">
          <AdBanner dataAdSlot="RESULT_SCREEN_SLOT" />
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={handleShare} className="w-full bg-sky-400 text-sky-950 py-5 rounded-[2rem] border-b-[8px] border-sky-500 font-black uppercase tracking-widest text-[18px] md:text-[22px] flex items-center justify-center gap-3 active:translate-y-[8px] active:border-b-0 transition-all">
            {copied ? <Check size={28} className="fill-current" /> : <Share2 size={28} className="fill-current" />}
            {copied ? 'Copiado!' : 'Desafiar Amigos'}
          </button>

          <div className="flex gap-4">
            {gameMode !== 'daily' && (
              <button onClick={onRestart} className="flex-1 bg-emerald-400 text-emerald-950 py-5 rounded-[2rem] border-b-[8px] border-emerald-500 font-black uppercase tracking-widest text-[16px] md:text-[20px] flex flex-col items-center justify-center gap-1 active:translate-y-[8px] active:border-b-0 transition-all">
                <RefreshCw size={24} /> Rejogar
              </button>
            )}
            
            <button onClick={onHome} className="flex-1 bg-stone-200 text-stone-600 py-5 rounded-[2rem] border-b-[8px] border-stone-300 font-black uppercase tracking-widest text-[16px] md:text-[20px] flex flex-col items-center justify-center gap-1 hover:bg-stone-300 hover:text-stone-700 active:translate-y-[8px] active:border-b-0 transition-all">
              <Home size={24} /> Menu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
