import React, { useState } from 'react';
import { UploadCloud, Dna } from 'lucide-react';

export default function UploadPanel({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full md:w-1/3 z-10 flex flex-col justify-center p-8 pointer-events-none">
      <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Dna className="text-dna-neon" size={32} />
          <h1 className="text-3xl font-bold text-white tracking-wider">
            ANCESTRAL<span className="text-dna-neon">.3D</span>
          </h1>
        </div>
        
        <p className="text-gray-400 mb-8">
          Mapeia a tua jornada genética num globo interativo. Totalmente privado.
        </p>

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging ? 'border-dna-neon bg-dna-neon/10' : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'
          }`}
        >
          <UploadCloud className={`mb-4 ${isDragging ? 'text-dna-neon' : 'text-gray-400'}`} size={48} />
          <p className="text-white font-medium text-center">
            Arrasta o teu ficheiro raw de DNA aqui
          </p>
          
          <input 
            type="file" 
            className="hidden" 
            id="file-upload" 
            accept=".csv,.txt,.gz"
            onChange={(e) => onFileUpload(e.target.files[0])}
          />
          <label 
            htmlFor="file-upload"
            className="mt-6 px-6 py-2 bg-dna-neon/20 text-dna-neon rounded-full border border-dna-neon hover:bg-dna-neon hover:text-black transition-colors cursor-pointer font-semibold"
          >
            Procurar Ficheiro
          </label>
        </div>
      </div>
    </div>
  );
}
