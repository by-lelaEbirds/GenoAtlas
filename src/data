export const MATHEUS_DATA = {
  nome: "Matheus Peres Da Silva",
  grupos: [
    { nome: "Europa", percentagem: 73, cor: "#00f3ff" },
    { nome: "África", percentagem: 14, cor: "#bc13fe" },
    { nome: "Américas", percentagem: 8, cor: "#ff00ff" },
    { nome: "Oriente Médio e Magrebe", percentagem: 5, cor: "#00ff00" }
  ],
  regioes: [
    { id: "iberia", nome: "Ibéria", percent: 28, lat: 40.46, lng: -3.75, cor: "#00f3ff", historia: "Os primeiros achados arqueológicos na Ibéria datam do período paleolítico. A região sofreu influências de povos como judeus e muçulmanos." },
    { id: "italia", name: "Itália", percent: 26, lat: 41.87, lng: 12.56, cor: "#00f3ff", historia: "Ponto de cruzamento entre povos e culturas. Seres humanos modernos já habitavam a península em 35.000 AEC." },
    { id: "europa_ocidental", name: "Europa Ocidental", percent: 7, lat: 46.22, lng: 2.21, cor: "#00f3ff", historia: "Abrange França, Alemanha, Áustria, Suíça, Bélgica, Reino Unido, etc. Fortemente habitada por tribos celtas e germânicas." },
    { id: "basco", name: "Basco", percent: 6, lat: 43.0, lng: -2.0, cor: "#00f3ff", historia: "Descendem de uma população ibérica que permaneceu relativamente isolada desde a pré-história." },
    { id: "judeus", name: "Judeus Sefaradim", percent: 6, lat: 31.76, lng: 35.21, cor: "#00f3ff", historia: "Descendem dos judeus que habitaram Portugal e a Espanha durante a Idade Média." },
    { id: "costa_mina", name: "Costa da Mina", percent: 9, lat: 6.52, lng: 3.37, cor: "#bc13fe", historia: "Engloba os países Nigéria, Gana, Togo e Benim. O local já era habitado por povos desde 10.000 AEC." },
    { id: "oeste_africa", name: "Oeste da África", percent: 3, lat: -1.0, lng: 11.0, cor: "#bc13fe", historia: "Lar dos povos Bantu, cuja origem remonta a cerca de 2 mil anos AEC na Bacia do Rio Congo." },
    { id: "amazonia", name: "Amazônia", percent: 6, lat: -3.46, lng: -62.21, cor: "#ff00ff", historia: "Existem vestígios de presença humana na Amazônia datando de 11 mil anos atrás. Uma das últimas regiões a ser povoada." },
    { id: "magrebe", name: "Magrebe", percent: 5, lat: 31.79, lng: -7.09, cor: "#00ff00", historia: "Noroeste da África, parte do mundo árabe, incluindo Marrocos, Tunísia e Argélia. Registros humanos desde 10.000 AEC." }
  ]
};

export const generateStainPoints = (regioes) => {
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
