import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, memo } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = memo(forwardRef(({ geoData, onCountryClick, theme, gameState, guessedCountries, travelArcs, impactRings, isMobile, isSmoothMode }, ref) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();
  const interactionTimeoutRef = useRef(null);

  const onStartRef = useRef(null);
  const onEndRef = useRef(null);

  const getIdealAltitude = () => isMobile ? 2.4 : 1.8;

  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: 20, lng: -20, altitude: getIdealAltitude() }, 1000);
      }
    },
    triggerStartAnimation: () => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ altitude: getIdealAltitude() + 0.3 }, 0);
        setTimeout(() => globeEl.current.pointOfView({ altitude: getIdealAltitude() }, 800), 50);
      }
    }
  }));

  useEffect(() => {
    let controlsToCleanup = null;
    let safetyTimeout;

    const initControls = () => {
      if (!globeEl.current) return;
      const renderer = globeEl.current.renderer();
      
      // PROTEÇÃO DE PERFORMANCE ANDROID: Limita o pixelRatio a no máximo 2 para evitar OOM (Out Of Memory)
      if (renderer) {
        renderer.setPixelRatio(window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2) : 1);
      }

      const controls = globeEl.current.controls?.();
      if (!controls) return;
      
      controlsToCleanup = controls; 

      controls.enableDamping = isSmoothMode; 
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = isMobile ? 0.6 : 0.8; 
      controls.zoomSpeed = 1.0;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;

      if (onStartRef.current) controls.removeEventListener('start', onStartRef.current);
      if (onEndRef.current) controls.removeEventListener('end', onEndRef.current);

      onStartRef.current = () => {
        controls.autoRotate = false;
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
      };

      onEndRef.current = () => {
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
          controls.autoRotate = true;
        }, 3500);
      };

      controls.addEventListener('start', onStartRef.current);
      controls.addEventListener('end', onEndRef.current);
    };

    initControls();
    safetyTimeout = setTimeout(initControls, 300);

    if (gameState === 'start' && globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: -20, altitude: getIdealAltitude() }, 1000);
    }

    return () => {
      clearTimeout(safetyTimeout);
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
      
      if (controlsToCleanup) {
        if (onStartRef.current) controlsToCleanup.removeEventListener('start', onStartRef.current);
        if (onEndRef.current) controlsToCleanup.removeEventListener('end', onEndRef.current);
      }
    };
  }, [gameState, isMobile, isSmoothMode]); 

  const startScreenTransform = isMobile 
    ? 'translate-y-[25%] scale-[1.1]' 
    : 'translate-x-[15%] scale-100'; 

  return (
    // A11Y: role="application" avisa leitores de tela que este é o elemento interativo principal
    <div 
      role="application" 
      aria-label="Globo terrestre interativo 3D"
      className={`absolute inset-0 z-0 cursor-crosshair transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${gameState === 'start' ? startScreenTransform : 'translate-x-0 translate-y-0 scale-100'}`}
    >
      <div className={`w-full h-full transition-all duration-300`}>
        <Globe
          ref={globeEl}
          // PERFORMANCE: antialias desativado em mobile reduz gargalos severos de GPU Mali
          rendererConfig={{ antialias: !isMobile, powerPreference: 'high-performance' }}
          
          globeImageUrl={theme.globeUrl}
          backgroundImageUrl={theme.bgImageUrl}
          bumpImageUrl={isMobile ? null : theme.bump}
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere={false} 
          
          // PERFORMANCE: Polígonos de resolução menor em mobile
          polygonsData={geoData}
          polygonResolution={isMobile ? 1 : 2} 
          
          polygonAltitude={d => guessedCountries.some(c => c.iso === d.properties.ISO_A2) ? 0.02 : (!isMobile && hoverD === d) ? 0.02 : 0.005}
          polygonCapColor={d => {
            if (guessedCountries.some(c => c.iso === d.properties.ISO_A2)) return theme.polyGuessed || 'rgba(34, 197, 94, 0.4)';
            if (!isMobile && d === hoverD) return theme.polyHover;
            return 'rgba(255, 255, 255, 0.0)';
          }}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.0)'}
          polygonStrokeColor={() => theme.polyStroke}
          
          polygonTransitionDuration={250} 
          
          onPolygonHover={isMobile ? undefined : setHoverD}
          onPolygonClick={(polygon, event, coords) => {
            if (onCountryClick && coords) onCountryClick(polygon, coords.lat, coords.lng, event);
          }}
          
          arcsData={travelArcs}
          arcColor={() => theme.polyStroke}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1000} 
          arcAltitudeAutoScale={0.3}

          ringsData={impactRings}
          ringColor={d => d.color}
          ringMaxRadius={isMobile ? 3 : 5}
          ringPropagationSpeed={3}
        />
      </div>
    </div>
  );
}));

GlobeVisualizer.displayName = 'GlobeVisualizer';

export default GlobeVisualizer;
