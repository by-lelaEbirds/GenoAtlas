import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = forwardRef(({ geoData, onCountryClick, theme, gameState, guessedCountries }, ref) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();
  const timeoutRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerStartAnimation: () => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ altitude: 2.5 }, 0);
        setTimeout(() => {
          globeEl.current.pointOfView({ altitude: 1.5 }, 2500);
        }, 100);
      }
    }
  }));

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 0.8;

      const handleInteractionStart = () => {
        controls.autoRotate = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };

      const handleInteractionEnd = () => {
        timeoutRef.current = setTimeout(() => {
          controls.autoRotate = true;
        }, 3000);
      };

      controls.addEventListener('start', handleInteractionStart);
      controls.addEventListener('end', handleInteractionEnd);

      if (gameState === 'start') {
        globeEl.current.pointOfView({ altitude: 1.8 }, 1000);
      }

      return () => {
        controls.removeEventListener('start', handleInteractionStart);
        controls.removeEventListener('end', handleInteractionEnd);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [gameState]);

  return (
    <div className={`absolute inset-0 z-0 cursor-crosshair transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${gameState === 'start' ? 'translate-x-1/4 scale-90' : 'translate-x-0 scale-100'}`}>
      <Globe
        ref={globeEl}
        globeImageUrl={theme.globeUrl}
        bumpImageUrl={theme.bump}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={theme.atmosphere}
        atmosphereAltitude={0.15}
        polygonsData={geoData}
        polygonAltitude={d => guessedCountries.some(c => c.iso === d.properties.ISO_A2) ? 0.03 : 0.015}
        polygonCapColor={d => {
          if (guessedCountries.some(c => c.iso === d.properties.ISO_A2)) return theme.polyGuessed || 'rgba(34, 197, 94, 0.4)';
          if (d === hoverD) return theme.polyHover;
          return 'rgba(255, 255, 255, 0.0)';
        }}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.0)'}
        polygonStrokeColor={() => theme.polyStroke}
        polygonTransitionDuration={300}
        onPolygonHover={setHoverD}
        onPolygonClick={(polygon) => {
          if (onCountryClick) onCountryClick(polygon);
        }}
        htmlElementsData={guessedCountries}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = `<img src="https://flagcdn.com/24x18/${d.iso.toLowerCase()}.png" class="rounded-sm shadow-lg pointer-events-none" />`;
          return el;
        }}
        htmlAltitude={0.05}
      />
    </div>
  );
});

export default GlobeVisualizer;
