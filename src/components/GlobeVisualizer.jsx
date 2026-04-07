import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, memo, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualizer = memo(forwardRef(({
  geoData,
  onCountryClick,
  theme,
  gameState,
  guessedCountries,
  travelArcs,
  impactRings,
  isMobile,
  isSmoothMode,
  isBatterySaverMode,
  isDarkMode,
}, ref) => {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();
  const guessedIsoSet = useMemo(() => new Set(guessedCountries.map((country) => country.iso)), [guessedCountries]);
  const useLiteRenderer = isBatterySaverMode || isMobile;
  const showRouteEffects = !useLiteRenderer;

  const getIdealAltitude = useCallback(() => (isMobile ? 2.3 : 1.78), [isMobile]);

  const configureScene = useCallback(() => {
    if (!globeEl.current) {
      return;
    }

    const renderer = globeEl.current.renderer?.();
    if (renderer) {
      const maxPixelRatio = useLiteRenderer ? 0.9 : 1.25;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    }

    const controls = globeEl.current.controls?.();
    if (!controls) {
      return;
    }

    controls.enableDamping = isSmoothMode && !useLiteRenderer;
    controls.dampingFactor = useLiteRenderer ? 0.04 : 0.055;
    controls.rotateSpeed = useLiteRenderer ? 0.5 : 0.72;
    controls.zoomSpeed = 0.95;
    controls.enablePan = false;
    controls.autoRotate = false;
  }, [isSmoothMode, useLiteRenderer]);

  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: 20, lng: -20, altitude: getIdealAltitude() }, 700);
      }
    },
    triggerStartAnimation: () => {
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: 20, lng: -20, altitude: getIdealAltitude() + 0.24 }, 0);
        setTimeout(() => {
          globeEl.current?.pointOfView({ lat: 20, lng: -20, altitude: getIdealAltitude() }, isSmoothMode ? 900 : 500);
        }, 50);
      }
    },
  }), [getIdealAltitude, isSmoothMode]);

  useEffect(() => {
    configureScene();
  }, [configureScene]);

  useEffect(() => {
    if (gameState !== 'playing' || !globeEl.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      globeEl.current?.pointOfView({ lat: 20, lng: -20, altitude: getIdealAltitude() }, 0);
    }, 40);

    return () => window.clearTimeout(timer);
  }, [gameState, getIdealAltitude]);

  const getPolyAltitude = useCallback((polygon) => {
    if (guessedIsoSet.has(polygon.properties.ISO_A2)) {
      return 0.02;
    }

    if (!isMobile && hoverD === polygon) {
      return 0.02;
    }

    return 0.005;
  }, [guessedIsoSet, hoverD, isMobile]);

  const getPolyCapColor = useCallback((polygon) => {
    if (guessedIsoSet.has(polygon.properties.ISO_A2)) {
      return theme.polyGuessed || 'rgba(34, 197, 94, 0.4)';
    }

    if (!isMobile && polygon === hoverD) {
      return theme.polyHover;
    }

    return 'rgba(255, 255, 255, 0)';
  }, [guessedIsoSet, hoverD, isMobile, theme]);

  const getPolySideColor = useCallback(() => 'rgba(0, 0, 0, 0)', []);
  const getPolyStrokeColor = useCallback(() => theme.polyStroke, [theme.polyStroke]);
  const getArcColor = useCallback(() => theme.arcsColor || theme.polyStroke, [theme.arcsColor, theme.polyStroke]);
  const getRingColor = useCallback((ring) => ring.color, []);

  const handlePolygonHover = useCallback((polygon) => {
    if (!isMobile) {
      setHoverD(polygon);
    }
  }, [isMobile]);

  const handlePolygonClick = useCallback((polygon, event, coords) => {
    onCountryClick?.(polygon, coords.lat, coords.lng, event);
  }, [onCountryClick]);

  return (
    <div
      role="application"
      aria-label="Globo terrestre interativo 3D"
      className={`globe-touch-surface absolute inset-0 z-0 ${gameState === 'playing' ? 'cursor-crosshair' : 'cursor-grab'}`}
    >
      <Globe
        ref={globeEl}
        rendererConfig={{
          antialias: false,
          powerPreference: useLiteRenderer ? 'low-power' : 'high-performance',
        }}
        onGlobeReady={configureScene}
        globeImageUrl={theme.globeUrl}
        backgroundImageUrl={useLiteRenderer ? null : theme.bgImageUrl}
        bumpImageUrl={useLiteRenderer ? null : theme.bump}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={!useLiteRenderer}
        atmosphereColor={isDarkMode ? '#6366f1' : '#38bdf8'}
        atmosphereAltitude={useLiteRenderer ? 0.06 : 0.13}
        polygonsData={geoData}
        polygonResolution={useLiteRenderer ? 1 : 2}
        polygonAltitude={getPolyAltitude}
        polygonCapColor={getPolyCapColor}
        polygonSideColor={getPolySideColor}
        polygonStrokeColor={getPolyStrokeColor}
        polygonTransitionDuration={useLiteRenderer ? 0 : 220}
        onPolygonHover={isMobile ? undefined : handlePolygonHover}
        onPolygonClick={handlePolygonClick}
        arcsData={showRouteEffects ? travelArcs : []}
        arcColor={getArcColor}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={showRouteEffects ? 1000 : 0}
        arcAltitudeAutoScale={0.3}
        ringsData={showRouteEffects ? impactRings : []}
        ringColor={getRingColor}
        ringMaxRadius={useLiteRenderer ? 2.2 : 5}
        ringPropagationSpeed={3}
      />
    </div>
  );
}));

GlobeVisualizer.displayName = 'GlobeVisualizer';

export default GlobeVisualizer;
