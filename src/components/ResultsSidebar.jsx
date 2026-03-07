import React from 'react';

export default function ResultsSidebar({ userData }) {
  if (!userData) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-[400px] bg-black/60 backdrop-blur-xl border-l border-white/10 z-20 overflow-y-auto transform transition-transform duration-700">
      <div className="p-8">
        <h2 className="text-sm text-dna-neon font-bold tracking-widest uppercase mb-2">Relatório Genético</h2>
        <h1 className="text-2xl text-white font-black mb-8">{userData.nome}</h1>

        <div className="space-y-4 mb-10">
          {userData.grupos.map((grupo, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <span className="text-white font-medium">{grupo.nome}</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold" style={{ color: grupo.cor }}>{grupo.percentagem}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <h3 className="text-lg text-white font-semibold border-b border-white/10 pb-2">Marcadores Detalhados</h3>
          {userData.regioes.map((regiao, idx) => (
            <div key={idx} className="relative pl-6 border-l-2" style={{ borderColor: regiao.cor }}>
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-black border-2" style={{ borderColor: regiao.cor }}></div>
              <div className="flex justify-between items-end mb-2">
                <h4 className="text-white font-bold text-lg">{regiao.nome}</h4>
                <span className="text-sm font-bold" style={{ color: regiao.cor }}>{regiao.percent}%</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed text-justify">
                {regiao.historia}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
