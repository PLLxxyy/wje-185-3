import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShipwreckProps {
  position: [number, number, number];
  color: string;
  scale: number;
  rotation: [number, number, number];
  onClick?: () => void;
}

const Shipwreck: React.FC<ShipwreckProps> = ({
  position,
  color,
  scale,
  rotation,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  const woodColor = new THREE.Color(color);
  const woodDark = new THREE.Color(color).multiplyScalar(0.6);
  const woodLight = new THREE.Color(color).lerp(new THREE.Color('#a08060'), 0.3);

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* hull - main body */}
      <mesh scale={[3, 0.8, 1]} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} />
      </mesh>
      {/* hull curved bottom */}
      <mesh scale={[2.8, 0.5, 0.9]} position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.5, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={woodDark} roughness={0.9} />
      </mesh>
      {/* deck planks */}
      <mesh scale={[2.5, 0.1, 0.8]} position={[0, 0.45, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={woodLight} roughness={0.8} />
      </mesh>
      {/* mast (broken) */}
      <mesh position={[-0.3, 1.0, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.05, 0.08, 1.5, 6]} />
        <meshStandardMaterial color={woodDark} roughness={0.9} />
      </mesh>
      {/* broken plank */}
      <mesh position={[0.5, 0.8, 0.1]} rotation={[0.2, 0.1, 0.8]}>
        <boxGeometry args={[0.8, 0.08, 0.15]} />
        <meshStandardMaterial color={woodLight} roughness={0.9} />
      </mesh>
      {/* porthole */}
      <mesh position={[0.8, 0.1, 0.51]}>
        <ringGeometry args={[0.1, 0.15, 12]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[-0.3, 0.1, 0.51]}>
        <ringGeometry args={[0.1, 0.15, 12]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* anchor */}
      <mesh position={[-1.2, -0.2, 0.3]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#546e7a" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* coral growth on hull */}
      <mesh position={[0.5, 0.3, -0.5]} scale={[0.3, 0.2, 0.3]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#e57373" roughness={0.7} />
      </mesh>
      <mesh position={[-0.8, 0.2, 0.4]} scale={[0.25, 0.15, 0.25]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#81c784" roughness={0.7} />
      </mesh>
      {/* seaweed on mast */}
      <mesh position={[-0.3, 0.6, 0.05]} scale={[0.05, 0.5, 0.05]}>
        <cylinderGeometry args={[1, 0.5, 1, 6]} />
        <meshStandardMaterial color="#4caf50" roughness={0.8} />
      </mesh>

      {/* clickable indicator */}
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
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

export default Shipwreck;
