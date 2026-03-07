import React, { useState } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import UploadPanel from './components/UploadPanel';
import LandingPage from './components/LandingPage';
import ResultsSidebar from './components/ResultsSidebar';

const generateStainPoints = (regioes) => {
  const points = [];
  regioes.forEach(reg => {
    const numPoints = reg.percent * 25;
    for (let i = 0; i < numPoints; i++) {
      const radius = reg.percent > 10 ? 8 : 4;
      points.push({
        lat: reg.lat + (Math.random() - 0.5) * radius,
        lng: reg.lng + (Math.random() - 0.5) * radius,
        color: reg.cor
      });
    }
  });
  return points;
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState(null);
  const [globeData, setGlobeData] = useState({ arcs: [], points: [], rings: [] });

  const handleFileUpload = (file) => {
    setIsProcessing(true);
    setProcessStatus('A extrair e descompactar marcadores genéticos...');

    const worker = new Worker(new URL('./workers/dnaWorker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e) => {
      const { type, validSNPs, userProfile, error } = e.data;

      if (type === 'SUCCESS') {
        setProcessStatus(`Mapeados ${validSNPs.toLocaleString()} SNPs. Renderizando o mapa...`);
        
        setTimeout(() => {
          setIsProcessing(false);
          setProcessStatus('');
          setUserData(userProfile);
          setShowResults(true);
          
          const stains = generateStainPoints(userProfile.regioes);
          const epicenters = userProfile.regioes.map(reg => ({
            lat: reg.lat, lng: reg.lng, color: reg.cor
          }));
          const arcs = userProfile.regioes.map(reg => ({
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

          {showResults && <ResultsSidebar userData={userData} />}
        </div>
      )}
    </div>
  );
}
