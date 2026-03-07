import Papa from 'papaparse';

self.onmessage = (e) => {
  const file = e.data;
  let totalLines = 0;
  const sampleData = [];

  // Usamos PapaParse no modo "chunk" para não estourar a memória RAM do utilizador
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    chunk: (results) => {
      totalLines += results.data.length;
      
      // Guarda apenas as primeiras 5 linhas para provarmos que lemos os dados corretos
      if (sampleData.length === 0 && results.data.length > 0) {
        sampleData.push(...results.data.slice(0, 5));
      }
      
      // Aqui, na Fase 2, faremos o filtro para guardar apenas os SNPs (Marcadores) que importam
    },
    complete: () => {
      self.postMessage({ 
        type: 'SUCCESS', 
        totalLines, 
        sample: sampleData 
      });
    },
    error: (err) => {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  });
};