import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = React.memo(({ geoData, onCountryClick, theme }) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 1.2;
      controls.zoomSpeed = 0.8;
      globeEl.current.pointOfView({ altitude: 1.8 });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
      <Globe
        ref={globeEl}
        globeImageUrl={theme.globeUrl}
        bumpImageUrl={theme.bump}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={theme.atmosphere}
        atmosphereAltitude={0.15}
        polygonsData={geoData}
        polygonAltitude={0.025}
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
