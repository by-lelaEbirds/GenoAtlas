import React, { useEffect, useMemo } from 'react';
import { APP_TIPS } from '../constants/appTips';

const ADSENSE_CLIENT_ID = 'ca-pub-0000000000000000';

export default function AdBanner({ dataAdSlot, isNativePlatform = false, isBatterySaverMode = false }) {
  const shouldShowFallback = isNativePlatform || isBatterySaverMode || ADSENSE_CLIENT_ID === 'ca-pub-0000000000000000';

  const tipOfTheDay = useMemo(() => {
    const dayIndex = Math.abs(new Date().getDate()) % APP_TIPS.length;
    return APP_TIPS[dayIndex];
  }, []);

  useEffect(() => {
    if (shouldShowFallback) {
      return;
    }

    try {
      if (window.adsbygoogle && typeof window !== 'undefined') {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('Erro ao carregar o AdSense:', e);
    }
  }, [shouldShowFallback]);

  if (shouldShowFallback) {
    return (
      <div className="w-full flex flex-col items-start justify-center bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5 my-2 relative overflow-hidden min-h-[120px]">
        <span className="absolute top-2 right-3 text-[9px] text-cyan-300 uppercase tracking-widest font-black pointer-events-none">
          Campo Base
        </span>
        <span className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-black mb-2">
          {isNativePlatform ? 'Modo App Nativo' : 'Modo Leve'}
        </span>
        <h3 className="text-white text-[18px] md:text-[22px] font-black uppercase tracking-tight mb-2">
          Dica do Dia
        </h3>
        <p className="text-slate-300 text-[13px] md:text-[15px] font-bold leading-snug max-w-2xl">
          {tipOfTheDay}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl p-2 border border-white/5 my-2 relative overflow-hidden min-h-[100px]">
      <span className="absolute top-1 text-[8px] text-zinc-500 uppercase tracking-widest font-black pointer-events-none">
        Publicidade
      </span>
      <ins
        className="adsbygoogle relative z-10"
        style={{ display: 'block', width: '100%', height: '100px' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
