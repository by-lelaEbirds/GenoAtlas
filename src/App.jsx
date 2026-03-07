import React, { useState } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import UploadPanel from './components/UploadPanel';
import LandingPage from './components/LandingPage';
import ResultsSidebar from './components/ResultsSidebar';
import { MATHEUS_DATA, generateStainPoints } from './data/matheusData';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const [globeData, setGlobeData] = useState({ arcs: [], points: [], rings: [] });

  const handleFileUpload = (file) => {
    setIsProcessing(true);
    setProcessStatus('A extrair marcadores de ancestralidade...');

    const worker = new Worker(new URL('./workers/dnaWorker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e) => {
      const { type, validSNPs, chromosomeCount, error } = e.data;

      if (type === 'SUCCESS') {
        setProcessStatus(`Identidade confirmada. Processando mapa de calor...`);
        
        setTimeout(() => {
          setIsProcessing(false);
          setProcessStatus('');
          setShowResults(true);
          
          const stains = generateStainPoints(MATHEUS_DATA.regioes);
          const epicenters = MATHEUS_DATA.regioes.map(reg => ({
            lat: reg.lat, lng: reg.lng, color: reg.cor
          }));
          const arcs = MATHEUS_DATA.regioes.map(reg => ({
            startLat: 0, startLng: 0, endLat: reg.lat, endLng: reg.lng, color: reg.cor
          }));

          setGlobeData({ arcs, points: stains, rings: epicenters });
        }, 3000);
      } else {
        setProcessStatus(`Erro na leitura: ${error}`);
        setIsProcessing(false);
      }
      worker.terminate();
    };

    worker.postMessage(file);
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-[#020205] via-[#050510] to-[#0a0f1c] overflow-hidden">
      {!isStarted ? (
        <LandingPage onStart={() => setIsStarted(true)} />
      ) : (
        <div className="absolute inset-0 transition-opacity duration-1000">
          <GlobeVisualizer arcsData={globeData.arcs} pointsData={globeData.points} ringsData={globeData.rings} />
          
          {!showResults && (
            <UploadPanel 
              onFileUpload={handleFileUpload} 
              isProcessing={isProcessing}
              processStatus={processStatus}
            />
          )}

          {showResults && <ResultsSidebar />}
        </div>
      )}
    </div>
  );
}
