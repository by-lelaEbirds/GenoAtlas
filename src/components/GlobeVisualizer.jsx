import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = forwardRef(({ geoData, onCountryClick, theme, gameState, guessedCountries, themeAnimState, travelArcs }, ref) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();
  const timeoutRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerStartAnimation: () => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ altitude: 2.2 }, 0);
        setTimeout(() => globeEl.current.pointOfView({ altitude: 1.6 }, 2500), 100);
      }
    }
  }));

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      // MAGIA AQUI: Damping = false. O globo agora pára de forma "seca" e imediata!
      controls.enableDamping = false; 
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 0.8;

      const handleInteractionStart = () => {
        controls.autoRotate = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };

      const handleInteractionEnd = () => {
        // Aumentado para 5 Segundos antes de voltar a girar automaticamente
        timeoutRef.current = setTimeout(() => { controls.autoRotate = true; }, 5000);
      };

      controls.addEventListener('start', handleInteractionStart);
      controls.addEventListener('end', handleInteractionEnd);

      if (gameState === 'start') globeEl.current.pointOfView({ altitude: 1.8 }, 1000);

      return () => {
        controls.removeEventListener('start', handleInteractionStart);
        controls.removeEventListener('end', handleInteractionEnd);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [gameState]);

  const createFlagElement = useCallback((d) => {
    const container = document.createElement('div');
    container.style.pointerEvents = 'none';
    
    const flagWrapper = document.createElement('div');
    flagWrapper.className = 'flag-marker'; 
    flagWrapper.innerHTML = `<img src="https://flagcdn.com/w40/${d.iso.toLowerCase()}.png" alt="${d.iso}" />`;
    
    container.appendChild(flagWrapper);
    return container;
  }, []);

  let themeTransform = '';
  let animDuration = '';
  let themeOpacity = '';

  if (themeAnimState === 'out') {
    themeTransform = '-translate-x-[100%] -rotate-[15deg] scale-75';
    themeOpacity = 'opacity-0';
    animDuration = 'duration-300 ease-in';
  } else if (themeAnimState === 'prepare-in') {
    themeTransform = 'translate-x-[100%] rotate-[15deg] scale-75';
    themeOpacity = 'opacity-0';
    animDuration = 'duration-0'; 
  } else {
    themeTransform = 'translate-x-0 rotate-0 scale-100';
    themeOpacity = 'opacity-100';
    animDuration = 'duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]'; 
  }

  return (
    <div className={`absolute inset-0 z-0 cursor-crosshair transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${gameState === 'start' ? 'translate-x-[50%] scale-[1.4]' : 'translate-x-0 scale-100'}`}>
      
      <div className={`w-full h-full transition-all ${animDuration} ${themeTransform} ${themeOpacity}`}>
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
          onPolygonClick={(polygon, event, coords) => {
            if (onCountryClick && coords) onCountryClick(polygon, coords.lat, coords.lng);
          }}
          
          arcsData={travelArcs}
          arcColor={() => theme.polyStroke}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcAltitudeAutoScale={0.3}

          htmlElementsData={guessedCountries}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.06}
          htmlElement={createFlagElement}
        />
      </div>
    </div>
  );
});

export default GlobeVisualizer;
