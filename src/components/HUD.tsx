import React from 'react';

interface HUDProps {
  depth: number;
  position: [number, number, number];
}

const HUD: React.FC<HUDProps> = ({ depth, position }) => {
  return (
    <div className="hud-panel">
      <div className="hud-title">深度计</div>
      <div className="depth-value">{depth}m</div>
      <div className="hud-title" style={{ marginTop: '12px' }}>
        坐标位置
      </div>
      <div className="coord-label">X</div>
      <div className="coord-value">{position[0].toFixed(1)}</div>
      <div className="coord-label">Y</div>
      <div className="coord-value">{position[1].toFixed(1)}</div>
      <div className="coord-label">Z</div>
      <div className="coord-value">{position[2].toFixed(1)}</div>
    </div>
  );
};

export default HUD;
