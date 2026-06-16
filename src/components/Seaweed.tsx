import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SeaweedProps {
  position: [number, number, number];
  height?: number;
}

const Seaweed: React.FC<SeaweedProps> = ({ position, height = 2.5 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const segments = useMemo(() => Math.floor(3 + Math.random() * 3), []);
  const phase = useRef(Math.random() * Math.PI * 2);
  const green = useMemo(
    () =>
      `hsl(${120 + Math.random() * 30}, ${40 + Math.random() * 20}%, ${20 + Math.random() * 15}%)`,
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + phase.current;
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const sway = Math.sin(t * 0.8 + i * 0.5) * (i + 1) * 0.03;
        child.rotation.z = sway;
        child.rotation.x = Math.cos(t * 0.6 + i * 0.3) * (i + 1) * 0.02;
      }
    });
  });

  const segHeight = height / segments;

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh
          key={i}
          position={[0, segHeight * i + segHeight / 2, 0]}
        >
          <cylinderGeometry
            args={[
              0.04 - i * 0.004,
              0.05 - i * 0.002,
              segHeight,
              5,
            ]}
          />
          <meshStandardMaterial
            color={green}
            roughness={0.8}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Seaweed;
