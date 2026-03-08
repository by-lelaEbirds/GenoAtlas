import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = React.memo(({ geoData, onCountryClick }) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3; // Mais devagar para facilitar o clique
      globeEl.current.controls().enableDamping = true;
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
        polygonAltitude={0.01} // A CURA DO LAG: Altitude cravada! Sem recálculos pesados.
        polygonCapColor={d => d === hoverD ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255, 255, 255, 0.0)'}
        polygonSideColor={() => 'rgba(0, 243, 255, 0.15)'}
        polygonStrokeColor={() => '#00f3ff'}
        polygonTransitionDuration={200}
        
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          if (onCountryClick) onCountryClick(polygon.properties.ADMIN);
        }}
      />
    </div>
  );
});

export default GlobeVisualizer;
