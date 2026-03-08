import React, { useEffect, useState, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeVisualizer({ onCountryClick }) {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    // Ficheiro público e gratuito com as fronteiras de todos os países!
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      // Posiciona a câmara mais perto para parecer um mapa
      globeEl.current.pointOfView({ altitude: 1.8 });
    }
  }, []);

  const handlePolygonClick = useCallback((polygon) => {
    if (onCountryClick) {
      // Passa o nome do país (em inglês, conforme o ficheiro padrão) para o jogo
      onCountryClick(polygon.properties.ADMIN);
    }
  }, [onCountryClick]);

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Configuração dos Polígonos (Países)
        polygonsData={countries.features}
        polygonAltitude={d => d === hoverD ? 0.06 : 0.01}
        polygonCapColor={d => d === hoverD ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255, 255, 255, 0.0)'}
        polygonSideColor={() => 'rgba(0, 243, 255, 0.15)'}
        polygonStrokeColor={() => '#00f3ff'}
        
        onPolygonHover={setHoverD}
        onPolygonClick={handlePolygonClick}
      />
    </div>
  );
}
