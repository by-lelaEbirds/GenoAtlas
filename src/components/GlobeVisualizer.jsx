import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeVisualizer({ arcsData = [], pointsData = [], ringsData = [] }) {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.pointOfView({ lat: 20, lng: -20, altitude: 2.5 }, 4000);
    }
  }, [pointsData]);

  return (
    <div className="absolute inset-0 z-0">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#00f3ff"
        atmosphereAltitude={0.15}
        
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2500}
        
        hexBinPointsData={pointsData}
        hexBinPointWeight="weight"
        hexBinResolution={4}
        hexMargin={0.2}
        hexTopColor={d => d.points[0].color}
        hexSideColor={() => 'rgba(0,0,0,0.8)'}
        hexBinMerge={true}
        
        ringsData={ringsData}
        ringColor="color"
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}
      />
    </div>
  );
}
