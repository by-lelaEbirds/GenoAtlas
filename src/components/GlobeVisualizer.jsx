import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
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
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 0.8;

      const handleInteractionStart = () => {
        controls.autoRotate = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };

      const handleInteractionEnd = () => {
        timeoutRef.current = setTimeout(() => { controls.autoRotate = true; }, 3000);
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

  // Animação Snappy e Rápida de Troca de Tema
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
    <div className={`absolute inset-0 z-0 cursor-crosshair transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${gameState === 'start' ? 'translate-y-[45%] scale-[1.4]' : 'translate-y-0 scale-100'}`}>
      
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
          // CAPTURA A COORDENADA EXATA DO CLIQUE DO RATO
          onPolygonClick={(polygon, event, { lat, lng }) => {
            if (onCountryClick) onCountryClick(polygon, lat, lng);
          }}
          
          // Arcos de Viagem
          arcsData={travelArcs}
          arcColor={() => theme.polyStroke}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcAltitudeAutoScale={0.3}

          // Bandeiras Cravadas
          htmlElementsData={guessedCountries}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.06}
          htmlElement={d => {
            const el = document.createElement('div');
            el.style.width = '32px';
            el.style.height = '24px';
            el.style.pointerEvents = 'none';
            // Animação CSS para a bandeira dar um "Pop" ao nascer
            el.innerHTML = `
              <div style="animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; width: 100%; height: 100%;">
                <img src="https://flagcdn.com/w40/${d.iso.toLowerCase()}.png" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px; border: 2px solid white; box-shadow: 0 8px 16px rgba(0,0,0,0.8);" />
              </div>
              <style>@keyframes popIn { 0% { transform: scale(0) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }</style>
            `;
            return el;
          }}
        />
      </div>
    </div>
  );
});

export default GlobeVisualizer;
