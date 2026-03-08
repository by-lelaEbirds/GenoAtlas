import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = React.memo(({ geoData, onCountryClick }) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableDamping = true;
      globeEl.current.controls().dampingFactor = 0.05; // Rotação super suave
      globeEl.current.pointOfView({ altitude: 1.8 });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
      <Globe
        ref={globeEl}
        // Texturas de altíssima resolução
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Atmosfera Premium
        showAtmosphere={true}
        atmosphereColor="#00f3ff"
        atmosphereAltitude={0.2}
        
        // Polígonos Otimizados
        polygonsData={geoData}
        polygonAltitude={0.01}
        polygonCapColor={d => d === hoverD ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255, 255, 255, 0.0)'}
        polygonSideColor={() => 'rgba(0, 243, 255, 0.1)'}
        polygonStrokeColor={() => 'rgba(0, 243, 255, 0.8)'}
        polygonTransitionDuration={300}
        
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          if (onCountryClick) onCountryClick(polygon.properties.LOCAL_NAME || polygon.properties.ADMIN);
        }}
      />
    </div>
  );
});

export default GlobeVisualizer;
