import React from 'react';
import { Dna, ArrowRight, ShieldCheck, Globe2 } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-white bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050510] to-black px-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Dna className="text-dna-neon" size={28} />
        <span className="text-xl font-bold tracking-wider">GENOATLAS</span>
      </div>

      <div className="max-w-5xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dna-neon/30 bg-dna-neon/10 text-dna-neon text-sm font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dna-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-dna-neon"></span>
          </span>
          Motor WebGL 100% Client-Side
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-100 to-gray-500 bg-clip-text text-transparent pb-2">
          O Futuro da Sua <br />
          <span className="bg-gradient-to-r from-dna-neon to-dna-purple bg-clip-text text-transparent">Ancestralidade</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Transformamos o seu ficheiro de DNA num globo interativo. Sem logins, sem mensalidades e com privacidade total. O seu código genético nunca sai do seu navegador.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-dna-neon/20 to-dna-purple/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              Iniciar Exploração <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 mt-12">
          <div className="flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-dna-neon/10 flex items-center justify-center text-dna-neon">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-semibold text-lg">Privacidade Máxima</h3>
            <p className="text-gray-500 text-sm">Todo o processamento ocorre no seu dispositivo. Não guardamos dados.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-dna-purple/10 flex items-center justify-center text-dna-purple">
              <Globe2 size={24} />
            </div>
            <h3 className="font-semibold text-lg">WebGL Interativo</h3>
            <p className="text-gray-500 text-sm">Renderização 3D de alta performance fluida em qualquer ecrã.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Dna size={24} />
            </div>
            <h3 className="font-semibold text-lg">Padrão da Indústria</h3>
            <p className="text-gray-500 text-sm">Compatível com arquivos Genera, 23andMe, MyHeritage e AncestryDNA.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
