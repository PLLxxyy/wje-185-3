import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DolphinProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}

const Dolphin: React.FC<DolphinProps> = ({ position, color, scale, speed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const startTime = useRef(Math.random() * 100);
  const center = useRef(new THREE.Vector3(...position));
  const orbitR = useRef(8 + Math.random() * 5);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.3 + startTime.current;
    const r = orbitR.current;
    const p = phase.current;

    const x = center.current.x + Math.cos(t * 0.2 + p) * r;
    const z = center.current.z + Math.sin(t * 0.2 + p) * r;
    const y = center.current.y + Math.sin(t * 0.35) * 3;

    groupRef.current.position.set(x, y, z);

    const dx = -Math.sin(t * 0.2 + p) * r * 0.2;
    const dz = Math.cos(t * 0.2 + p) * r * 0.2;
    groupRef.current.rotation.y = Math.atan2(dx, dz);
    groupRef.current.rotation.z = Math.sin(t * 2) * 0.05;

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 3) * 0.25;
    }
  });

  const bellyColor = new THREE.Color(color).lerp(new THREE.Color('#e0e0e0'), 0.5);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* body */}
      <mesh scale={[2.5, 0.55, 0.55]}>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* belly */}
      <mesh scale={[2.0, 0.35, 0.45]} position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={bellyColor} roughness={0.3} />
      </mesh>
      {/* rostrum (beak) */}
      <mesh position={[0.95, -0.02, 0]} scale={[0.5, 0.2, 0.2]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* dorsal fin */}
      <mesh position={[-0.1, 0.4, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.12, 0.45, 4]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* pectoral fin L */}
      <mesh position={[0.15, -0.15, 0.3]} rotation={[0.6, 0, 0.5]} scale={[0.6, 0.1, 0.3]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* pectoral fin R */}
      <mesh position={[0.15, -0.15, -0.3]} rotation={[-0.6, 0, 0.5]} scale={[0.6, 0.1, 0.3]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* tail flukes */}
      <group ref={tailRef} position={[-1.1, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.08, 0.5, 0.3]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      </group>
      {/* eyes */}
      <mesh position={[0.55, 0.1, 0.28]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.55, 0.1, -0.28]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* smile line */}
      <mesh position={[0.8, -0.02, 0]} scale={[0.3, 0.02, 0.22]}>
        <torusGeometry args={[0.3, 0.01, 6, 12, Math.PI]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.6)} />
      </mesh>
    </group>
  );
};

export default Dolphin;
