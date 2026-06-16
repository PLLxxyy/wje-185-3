import React, { useState, useCallback, useEffect } from 'react';
import OceanScene from './components/OceanScene';
import HUD from './components/HUD';
import InfoCard from './components/InfoCard';
import ControlsHint from './components/ControlsHint';
import { CreatureInfo } from './data/creatures';

interface InfoCardData {
  name: string;
  description?: string;
  bodySize?: string;
  habitat?: string;
  diet?: string;
  behavior?: string;
  protectionLevel?: string;
}

const App: React.FC = () => {
  const [depth, setDepth] = useState(0);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [cruiseMode, setCruiseMode] = useState(false);
  const [infoCard, setInfoCard] = useState<InfoCardData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleDepthChange = useCallback((d: number) => setDepth(d), []);
  const handlePositionChange = useCallback(
    (p: [number, number, number]) => setPosition(p),
    []
  );

  const handleCreatureClick = useCallback((info: CreatureInfo) => {
    setInfoCard({
      name: info.name,
      bodySize: info.bodySize,
      habitat: info.habitat,
      diet: info.diet,
      behavior: info.behavior,
      protectionLevel: info.protectionLevel,
    });
  }, []);

  const handleObjectClick = useCallback(
    (name: string, description: string) => {
      setInfoCard({ name, description });
    },
    []
  );

  const closeInfoCard = useCallback(() => setInfoCard(null), []);
  const toggleCruise = useCallback(() => setCruiseMode((v) => !v), []);

  return (
    <>
      <div className={`loading-screen ${loaded ? 'hidden' : ''}`}>
        <div className="loading-title">海底世界</div>
        <div className="loading-sub">OCEAN EXPLORER</div>
        <div className="loading-bar-outer">
          <div className="loading-bar-inner" />
        </div>
      </div>

      <OceanScene
        cruiseMode={cruiseMode}
        onDepthChange={handleDepthChange}
        onPositionChange={handlePositionChange}
        onCreatureClick={handleCreatureClick}
        onObjectClick={handleObjectClick}
      />

      <HUD depth={depth} position={position} />
      <ControlsHint cruiseMode={cruiseMode} />

      <button
        className={`cruise-btn ${cruiseMode ? 'active' : ''}`}
        onClick={toggleCruise}
      >
        {cruiseMode ? '停止巡航' : '自动巡航'}
      </button>

      {infoCard && <InfoCard data={infoCard} onClose={closeInfoCard} />}
    </>
  );
};

export default App;
