import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BehaviorConfig } from '../data/creatures';

interface RayProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  behavior: BehaviorConfig;
}

const Ray: React.FC<RayProps> = ({ position, color, scale, speed, behavior }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wingRef = useRef<THREE.Group>(null);
  const startTime = useRef(Math.random() * 100);
  const center = useRef(new THREE.Vector3(...position));
  const orbitR = useRef(6 + Math.random() * 5);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.25 + startTime.current;
    const r = orbitR.current;
    const p = phase.current;

    const x = center.current.x + Math.cos(t * 0.2 + p) * r;
    const z = center.current.z + Math.sin(t * 0.2 + p) * r;
    const y = center.current.y + Math.sin(t * 0.3) * 2;

    groupRef.current.position.set(x, y, z);
    const dx = -Math.sin(t * 0.2 + p) * r * 0.2;
    const dz = Math.cos(t * 0.2 + p) * r * 0.2;
    groupRef.current.rotation.y = Math.atan2(dx, dz);

    /* wing flapping */
    if (wingRef.current) {
      wingRef.current.rotation.z = Math.sin(t * 2) * 0.3;
    }
  });

  const bellyColor = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.3);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* body */}
      <mesh scale={[1.5, 0.2, 1.2]}>
        <sphereGeometry args={[0.5, 12, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* belly */}
      <mesh scale={[1.3, 0.15, 1.0]} position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={bellyColor} roughness={0.3} />
      </mesh>
      {/* wings */}
      <group ref={wingRef}>
        {/* left wing */}
        <mesh position={[0, 0, 0.6]} scale={[0.3, 0.05, 1.0]} rotation={[0, -0.2, 0]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        {/* right wing */}
        <mesh position={[0, 0, -0.6]} scale={[0.3, 0.05, 1.0]} rotation={[0, 0.2, 0]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      </group>
      {/* tail */}
      <mesh position={[-0.6, 0, 0]} scale={[0.6, 0.04, 0.06]}>
        <sphereGeometry args={[0.5, 6, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* eyes */}
      <mesh position={[0.4, 0.1, 0.2]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.4, 0.1, -0.2]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

export default Ray;
