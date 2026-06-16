import React, { useMemo } from 'react';
import * as THREE from 'three';

interface RockProps {
  position: [number, number, number];
  color: string;
  scale: number;
  onClick?: () => void;
}

const Rock: React.FC<RockProps> = ({ position, color, scale, onClick }) => {
  const colors = useMemo(() => {
    const base = new THREE.Color(color);
    return {
      dark: base.clone().multiplyScalar(0.7),
      light: base.clone().lerp(new THREE.Color('#9e9e9e'), 0.3),
    };
  }, [color]);

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* main rock mass */}
      <mesh scale={[1.5, 0.8, 1.2]}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* secondary rock */}
      <mesh position={[0.5, -0.1, 0.3]} scale={[0.8, 0.5, 0.7]}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={colors.dark} roughness={0.9} />
      </mesh>
      {/* small boulder */}
      <mesh position={[-0.4, -0.15, -0.2]} scale={[0.5, 0.3, 0.4]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={colors.light} roughness={0.9} />
      </mesh>
      {/* surface detail */}
      <mesh position={[0.3, 0.25, 0.1]} scale={[0.3, 0.15, 0.25]}>
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshStandardMaterial color={colors.dark} roughness={0.95} />
      </mesh>

      {/* clickable indicator */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#7fdbff"
          emissive="#7fdbff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default Rock;
