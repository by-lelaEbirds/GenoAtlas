import React, { useEffect } from 'react';

export default function AdBanner({ dataAdSlot }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && typeof window !== 'undefined') {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Erro ao carregar o AdSense:", e);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl p-2 border border-white/5 my-2 relative overflow-hidden min-h-[100px]">
      <span className="absolute top-1 text-[8px] text-zinc-500 uppercase tracking-widest font-black pointer-events-none">
        Publicidade
      </span>
      {/* O data-ad-client DEVE SER O SEU ID DO ADSENSE DEPOIS */}
      <ins 
        className="adsbygoogle relative z-10"
        style={{ display: 'block', width: '100%', height: '100px' }}
        data-ad-client="ca-pub-0000000000000000" 
        data-ad-slot={dataAdSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
