import Papa from 'papaparse';

const REFERENCE_REGIONS = [
  { lat: 41.8719, lng: 12.5674, name: 'Europa do Sul', color: '#00f3ff' },
  { lat: 9.082, lng: 8.675, name: 'África Subsaariana', color: '#bc13fe' },
  { lat: 36.2048, lng: 138.2529, name: 'Leste Asiático', color: '#00ff00' },
  { lat: -14.235, lng: -51.925, name: 'América Nativa', color: '#ff00ff' }
];

self.onmessage = (e) => {
  const file = e.data;
  let totalLines = 0;
  let validSNPs = 0;
  const chromosomes = new Set();

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    chunk: (results) => {
      totalLines += results.data.length;
      results.data.forEach(row => {
        if (row.RSID && row.RESULT && row.RESULT !== '--') {
          validSNPs++;
          if (row.CHROMOSOME) chromosomes.add(row.CHROMOSOME);
        }
      });
    },
    complete: () => {
      const visualData = generateMigrationArcs();
      self.postMessage({
        type: 'SUCCESS',
        totalLines,
        validSNPs,
        chromosomeCount: chromosomes.size,
        visualData
      });
    },
    error: (err) => {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  });
};

function generateMigrationArcs() {
  const arcs = [];
  REFERENCE_REGIONS.forEach((region) => {
    const percentage = Math.floor(Math.random() * 30) + 10;
    arcs.push({
      startLat: 0,
      startLng: 37,
      endLat: region.lat,
      endLng: region.lng,
      color: region.color,
      label: `${region.name} (${percentage}%)`
    });
  });
  return arcs;
}
