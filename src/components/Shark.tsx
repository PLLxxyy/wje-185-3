import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BehaviorConfig } from '../data/creatures';

interface SharkProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  behavior: BehaviorConfig;
}

const Shark: React.FC<SharkProps> = ({ position, color, scale, speed, behavior }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const startTime = useRef(Math.random() * 100);
  const center = useRef(new THREE.Vector3(...position));
  const phase = useRef(Math.random() * Math.PI * 2);

  const minDepth = behavior.minDepth ?? -25;
  const maxDepth = behavior.maxDepth ?? -10;
  const cruiseRadius = useMemo(() => 12 + Math.random() * 8, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.2 + startTime.current;
    const p = phase.current;

    let x, z, y;

    if (behavior.type === 'deep-cruise') {
      x = center.current.x + Math.cos(t * 0.15 + p) * cruiseRadius;
      z = center.current.z + Math.sin(t * 0.15 + p) * cruiseRadius * 0.7;

      const depthCycle = Math.sin(t * 0.08 + p * 0.5);
      const depthRange = (maxDepth - minDepth) / 2;
      const depthMid = (maxDepth + minDepth) / 2;
      y = depthMid + depthCycle * depthRange;
    } else {
      const r = 8 + Math.random() * 6;
      x = center.current.x + Math.cos(t * 0.3 + p) * r;
      z = center.current.z + Math.sin(t * 0.3 + p) * r;
      y = center.current.y + Math.sin(t * 0.2) * 2;
    }

    groupRef.current.position.set(x, y, z);

    const dx = -Math.sin(t * (behavior.type === 'deep-cruise' ? 0.15 : 0.3) + p) *
      (behavior.type === 'deep-cruise' ? cruiseRadius : 8) *
      (behavior.type === 'deep-cruise' ? 0.15 : 0.3);
    const dz = Math.cos(t * (behavior.type === 'deep-cruise' ? 0.15 : 0.3) + p) *
      (behavior.type === 'deep-cruise' ? cruiseRadius * 0.7 : 8) *
      (behavior.type === 'deep-cruise' ? 0.15 : 0.3);
    groupRef.current.rotation.y = Math.atan2(dx, dz);
    groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.04;

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 2) * 0.3;
    }
  });

  const darkColor = new THREE.Color(color).multiplyScalar(0.7);
  const bellyColor = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.4);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* main body */}
      <mesh scale={[3, 0.6, 0.8]}>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* belly */}
      <mesh scale={[2.5, 0.35, 0.7]} position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={bellyColor} roughness={0.4} />
      </mesh>
      {/* nose */}
      <mesh position={[0.9, 0, 0]} scale={[0.6, 0.4, 0.4]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* dorsal fin */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.15, 0.6, 4]} />
        <meshStandardMaterial color={darkColor} roughness={0.5} />
      </mesh>
      {/* pectoral fin L */}
      <mesh position={[0.1, -0.15, 0.35]} rotation={[0.5, 0, 0.4]}>
        <coneGeometry args={[0.12, 0.5, 4]} />
        <meshStandardMaterial color={darkColor} roughness={0.5} />
      </mesh>
      {/* pectoral fin R */}
      <mesh position={[0.1, -0.15, -0.35]} rotation={[-0.5, 0, 0.4]}>
        <coneGeometry args={[0.12, 0.5, 4]} />
        <meshStandardMaterial color={darkColor} roughness={0.5} />
      </mesh>
      {/* tail */}
      <group ref={tailRef} position={[-1.1, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 3]} position={[0, 0.3, 0]}>
          <coneGeometry args={[0.2, 0.8, 4]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 6]} position={[0, -0.1, 0]}>
          <coneGeometry args={[0.15, 0.5, 4]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} />
        </mesh>
      </group>
      {/* eyes */}
      <mesh position={[0.55, 0.12, 0.25]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.55, 0.12, -0.25]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

export default Shark;
