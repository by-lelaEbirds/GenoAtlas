import React, { useState } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import UploadPanel from './components/UploadPanel';

export default function App() {
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (file) => {
    setFileData(file);
  };

  return (
    <div className="relative w-screen h-screen bg-black">
      <GlobeVisualizer />
      <UploadPanel onFileUpload={handleFileUpload} />
    </div>
  );
}
