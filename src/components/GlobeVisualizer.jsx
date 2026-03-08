import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = React.memo(({ geoData, onCountryClick, theme }) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableDamping = true;
      globeEl.current.controls().dampingFactor = 0.05;
      globeEl.current.pointOfView({ altitude: 1.8 });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
      <Globe
        ref={globeEl}
        globeImageUrl={theme.globeUrl}
        bumpImageUrl={theme.bump}
        backgroundColor="rgba(0,0,0,0)" // Invisível para o gradiente CSS brilhar!
        
        showAtmosphere={true}
        atmosphereColor={theme.atmosphere}
        atmosphereAltitude={0.15}
        
        polygonsData={geoData}
        polygonAltitude={0.025} // CURA DO Z-FIGHTING: Mais alto para não colidir com o mapa
        polygonCapColor={d => d === hoverD ? theme.polyHover : 'rgba(255, 255, 255, 0.0)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.0)'}
        polygonStrokeColor={() => theme.polyStroke}
        polygonTransitionDuration={200}
        
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          if (onCountryClick) onCountryClick(polygon.properties.LOCAL_NAME || polygon.properties.ADMIN);
        }}
      />
    </div>
  );
});

export default GlobeVisualizer;
