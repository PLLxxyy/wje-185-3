import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RuinsProps {
  position: [number, number, number];
  color: string;
  scale: number;
  onClick?: () => void;
}

const Ruins: React.FC<RuinsProps> = ({ position, color, scale, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  const stoneColor = new THREE.Color(color);
  const stoneDark = new THREE.Color(color).multiplyScalar(0.6);

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* pillars */}
      <mesh position={[-0.5, 0.6, -0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 1.2, 8]} />
        <meshStandardMaterial color={stoneColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.5, 0.4, -0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
        <meshStandardMaterial color={stoneColor} roughness={0.95} />
      </mesh>
      <mesh position={[-0.5, 0.3, 0.4]}>
        <cylinderGeometry args={[0.1, 0.13, 0.6, 8]} />
        <meshStandardMaterial color={stoneDark} roughness={0.95} />
      </mesh>
      <mesh position={[0.6, 0.7, 0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 1.4, 8]} />
        <meshStandardMaterial color={stoneDark} roughness={0.95} />
      </mesh>

      {/* fallen column */}
      <mesh position={[0, 0.08, 0.8]} rotation={[0, 0.3, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 1.0, 8]} />
        <meshStandardMaterial color={stoneColor} roughness={0.95} />
      </mesh>

      {/* stone slabs */}
      <mesh position={[0, 0.05, 0]} scale={[2, 0.1, 1.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.15, -0.5]} scale={[0.8, 0.08, 0.6]} rotation={[0, 0.2, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={stoneDark} roughness={0.9} />
      </mesh>

      {/* broken steps */}
      <mesh position={[-0.8, 0.08, 0.2]} scale={[0.3, 0.15, 0.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 0.2, 0.0]} scale={[0.3, 0.15, 0.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} />
      </mesh>

      {/* coral and life growing on ruins */}
      <mesh position={[0.2, 0.3, 0.6]} scale={[0.2, 0.12, 0.2]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#e57373" roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.2, 0.1]} scale={[0.15, 0.1, 0.15]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#66bb6a" roughness={0.7} />
      </mesh>

      {/* clickable indicator */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ffd740"
          emissive="#ffd740"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

export default Ruins;
