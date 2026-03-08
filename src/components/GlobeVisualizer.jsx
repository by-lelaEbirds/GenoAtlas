import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

// React.memo impede que o globo recarregue a cada segundo do cronómetro
const GlobeVisualizer = React.memo(({ geoData, onCountryClick }) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableDamping = true; // Deixa o movimento de arrastar mais suave
      globeEl.current.pointOfView({ altitude: 1.8 });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        polygonsData={geoData}
        polygonAltitude={d => d === hoverD ? 0.06 : 0.01}
        polygonCapColor={d => d === hoverD ? 'rgba(0, 243, 255, 0.6)' : 'rgba(255, 255, 255, 0.0)'}
        polygonSideColor={() => 'rgba(0, 243, 255, 0.2)'}
        polygonStrokeColor={() => '#00f3ff'}
        polygonTransitionDuration={300} // Interpolação de quadros no hover!
        
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          if (onCountryClick) onCountryClick(polygon.properties.ADMIN);
        }}
      />
    </div>
  );
});

export default GlobeVisualizer;
