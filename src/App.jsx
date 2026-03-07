import React, { useState } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import UploadPanel from './components/UploadPanel';
import LandingPage from './components/LandingPage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

  const handleFileUpload = (file) => {
    setIsProcessing(true);
    setProcessStatus('A ler sequenciamento genético...');

    const worker = new Worker(new URL('./workers/dnaWorker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e) => {
      const { type, totalLines, sample, error } = e.data;

      if (type === 'SUCCESS') {
        setProcessStatus(`Sucesso! ${totalLines.toLocaleString()} marcadores processados.`);
        setTimeout(() => {
          setIsProcessing(false);
          setProcessStatus('');
        }, 4000);
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
          <GlobeVisualizer />
          <UploadPanel 
            onFileUpload={handleFileUpload} 
            isProcessing={isProcessing}
            processStatus={processStatus}
          />
        </div>
      )}
    </div>
  );
}
