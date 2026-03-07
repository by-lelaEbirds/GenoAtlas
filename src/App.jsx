import React, { useState } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import UploadPanel from './components/UploadPanel';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

  const handleFileUpload = (file) => {
    setIsProcessing(true);
    setProcessStatus('A ler sequenciamento genético...');

    // Instancia o Worker usando a sintaxe nativa do Vite
    const worker = new Worker(new URL('./workers/dnaWorker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e) => {
      const { type, totalLines, sample, error } = e.data;

      if (type === 'SUCCESS') {
        console.log("Amostra dos dados lidos:", sample);
        setProcessStatus(`Sucesso! ${totalLines.toLocaleString()} marcadores processados.`);
        
        // Remove a mensagem de sucesso após 4 segundos
        setTimeout(() => {
          setIsProcessing(false);
          setProcessStatus('');
        }, 4000);
      } else {
        setProcessStatus(`Erro na leitura: ${error}`);
        setIsProcessing(false);
      }
      
      // Encerra o worker para libertar memória
      worker.terminate();
    };

    // Envia o ficheiro físico para a "segunda dimensão" processar
    worker.postMessage(file);
  };

  return (
    <div className="relative w-screen h-screen bg-black">
      <GlobeVisualizer />
      <UploadPanel 
        onFileUpload={handleFileUpload} 
        isProcessing={isProcessing}
        processStatus={processStatus}
      />
    </div>
  );
}
