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
      case 'lives': return <MapPin className="text-rose-100" size={40} />;
      case 'time': return <Clock className="text-sky-100" size={40} />;
      case 'win': case 'daily_win': return <Trophy className="text-amber-100" size={40} />;
      default: return <MapPin className="text-zinc-100" size={40} />;
    }
  };

  const getHeaderColor = () => {
    if (reason === 'win' || reason === 'daily_win') return 'bg-amber-500';
    if (reason === 'time') return 'bg-sky-500';
    return 'bg-rose-500';
  };

  const handleShare = async () => {
    const modeText = gameMode === 'football' ? 'clubes de futebol' : 'países';
    const shareText = `🌍 Fiz ${score} pontos e encontrei ${guessedCount} ${modeText} no GenoAtlas!\n\nConsegue bater o meu recorde? 🏆 jogue agora:`;
    const shareUrl = 'https://by-lelaebirds.github.io/GenoAtlas/';
    const fullText = `${shareText} ${shareUrl}`;

    // Tenta usar a API nativa de compartilhamento se o navegador suportar
    if (navigator.share) {
      try { 
        await navigator.share({ title: 'Meu Recorde', text: shareText, url: shareUrl }); 
        return; // Interrompe a execução caso o usuário tenha compartilhado com sucesso nativamente
      } catch (err) { 
        // Se o usuário abortar, nós não fazemos o fallback. Apenas logamos.
        if (err.name !== 'AbortError') {
          console.log('API de Compartilhamento falhou, tentando Clipboard...', err);
        } else {
          return;
        }
      }
    } 
    
    // Fallback: Copia o link se a API nativa não estiver presente ou falhar
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar para área de transferência', err);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 px-4 animate-fade-in-up overflow-y-auto custom-scrollbar pt-10 pb-10">
      <div className="bg-zinc-900 border-[6px] border-zinc-800 rounded-[2.5rem] max-w-sm w-full relative text-center shadow-2xl my-auto overflow-hidden">
        
        {/* Cabeçalho Colorido Gamificado */}
        <div className={`w-full ${getHeaderColor()} pt-8 pb-12 relative`}>
          {isNewRecord && (
            <div className="absolute top-0 left-0 w-full bg-white text-black py-1.5 text-xs font-black tracking-widest uppercase">
              ✨ Novo Recorde Pessoal! ✨
            </div>
          )}
          <div className="mx-auto w-20 h-20 bg-black/20 rounded-full flex items-center justify-center mb-2 shadow-inner">
            {getReasonIcon()}
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase drop-shadow-md">{getReasonText()}</h2>
        </div>

        <div className="px-6 pb-6 pt-6 -mt-8 relative z-10 bg-zinc-900 rounded-t-3xl">
          
          <div className="space-y-3 mb-6">
            <div className="bg-zinc-800 rounded-2xl p-4 flex justify-between items-center shadow-inner">
              <span className="text-zinc-400 text-sm font-black uppercase tracking-widest">Pontuação</span>
              <span className={`text-4xl font-black tracking-tighter ${isNewRecord ? 'text-amber-400' : 'text-white'}`}>{score}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Acertos</span>
                <span className="text-2xl font-bold text-white">{guessedCount}</span>
              </div>
              <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Moedas</span>
                <div className="flex items-center gap-1">
                  <Coins size={18} className="text-amber-400" />
                  <span className="text-2xl font-bold text-amber-400">+{coinsEarned}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <AdBanner dataAdSlot="RESULT_SCREEN_SLOT" />
          </div>

          {/* Botões 3D Estilo Candy */}
          <button onClick={handleShare} className="w-full bg-gradient-to-b from-sky-400 to-blue-500 text-sky-950 py-4 rounded-2xl shadow-[0_5px_0_0_#1d4ed8] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:translate-y-[5px] active:shadow-none transition-all mb-3">
            {copied ? <Check size={20} className="fill-current" /> : <Share2 size={20} className="fill-current" />}
            {copied ? 'Copiado!' : 'Desafiar Amigos'}
          </button>

          <div className="flex gap-3">
            {gameMode !== 'daily' && (
              <button onClick={onRestart} className="flex-1 bg-gradient-to-b from-emerald-400 to-teal-500 text-emerald-950 py-4 rounded-2xl shadow-[0_5px_0_0_#0f766e] font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-1 active:translate-y-[5px] active:shadow-none transition-all">
                <RefreshCw size={20} /> Rejogar
              </button>
            )}
            
            <button onClick={onHome} className="flex-1 bg-zinc-200 text-zinc-900 py-4 rounded-2xl shadow-[0_5px_0_0_#a1a1aa] font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-1 active:translate-y-[5px] active:shadow-none transition-all">
              <Home size={20} /> Menu
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
