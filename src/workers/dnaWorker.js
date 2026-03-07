import Papa from 'papaparse';
import pako from 'pako';

const REGIONS_DB = [
  { id: "iberia", nome: "Ibéria", lat: 40.46, lng: -3.75, cor: "#00f3ff", historia: "Região histórica com forte influência genética na formação das populações ocidentais modernas." },
  { id: "italia", nome: "Itália", lat: 41.87, lng: 12.56, cor: "#00f3ff", historia: "Ponto central de rotas de migração antigas no Mar Mediterrâneo, conectando diversos povos." },
  { id: "europa_ocidental", nome: "Europa Ocidental", lat: 46.22, lng: 2.21, cor: "#00f3ff", historia: "Território ancestral marcado pela presença milenar de tribos celtas e germânicas." },
  { id: "costa_mina", nome: "Costa da Mina", lat: 6.52, lng: 3.37, cor: "#bc13fe", historia: "Berço de civilizações formidáveis e um dos maiores polos de diversidade genética da humanidade." },
  { id: "oeste_africa", nome: "Oeste da África", lat: -1.0, lng: 11.0, cor: "#bc13fe", historia: "Região de origem dos povos Bantu, cuja expansão moldou o mapa demográfico do continente." },
  { id: "amazonia", nome: "Amazônia", lat: -3.46, lng: -62.21, cor: "#ff00ff", historia: "Ancestralidade enraizada nas populações nativas com adaptações únicas ao clima tropical." },
  { id: "magrebe", nome: "Magrebe", lat: 31.79, lng: -7.09, cor: "#00ff00", historia: "Ponte genética milenar que conecta as populações da África Subsaariana com o sul da Europa." }
];

self.onmessage = async (e) => {
  const file = e.data;
  let totalLines = 0;
  let validSNPs = 0;
  let rawText = "";

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (file.name.endsWith('.gz')) {
      rawText = pako.ungzip(new Uint8Array(arrayBuffer), { to: 'string' });
    } else {
      rawText = new TextDecoder().decode(arrayBuffer);
    }

    let seedString = "";

    Papa.parse(rawText, {
      header: true,
      skipEmptyLines: true,
      worker: false,
      step: (results) => {
        const row = results.data;
        totalLines++;
        if (row.RSID && row.RESULT && row.RESULT !== '--') {
          validSNPs++;
          if (validSNPs < 100) {
            seedString += row.RESULT;
          }
        }
      },
      complete: () => {
        const hash = generateHash(seedString);
        const userProfile = generateDeterministicProfile(hash);

        self.postMessage({
          type: 'SUCCESS',
          totalLines,
          validSNPs,
          userProfile
        });
      }
    });

  } catch (err) {
    self.postMessage({ type: 'ERROR', error: err.message });
  }
};

function generateHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateDeterministicProfile(seed) {
  let random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let remaining = 100;
  const profileRegions = [];
  const shuffledRegions = [...REGIONS_DB].sort(() => random() - 0.5);

  const numRegions = Math.floor(random() * 3) + 3;

  for (let i = 0; i < numRegions; i++) {
    const region = shuffledRegions[i];
    let percent = i === numRegions - 1 ? remaining : Math.floor(random() * (remaining * 0.6)) + 5;
    
    if (percent > remaining) percent = remaining;
    remaining -= percent;

    if (percent > 0) {
      profileRegions.push({ ...region, percent });
    }
  }

  profileRegions.sort((a, b) => b.percent - a.percent);

  const gruposMap = {};
  profileRegions.forEach(reg => {
    let grupo = "Outros";
    if (reg.cor === "#00f3ff") grupo = "Europa";
    if (reg.cor === "#bc13fe") grupo = "África";
    if (reg.cor === "#ff00ff") grupo = "Américas";
    if (reg.cor === "#00ff00") grupo = "Oriente Médio";

    if (!gruposMap[grupo]) gruposMap[grupo] = { nome: grupo, percentagem: 0, cor: reg.cor };
    gruposMap[grupo].percentagem += reg.percent;
  });

  return {
    nome: "Explorador Genético",
    grupos: Object.values(gruposMap).sort((a, b) => b.percentagem - a.percentagem),
    regioes: profileRegions
  };
}
