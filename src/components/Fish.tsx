import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FishProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}

const Fish: React.FC<FishProps> = ({ position, color, scale, speed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Math.random() * 100);
  const orbitRadius = useRef(3 + Math.random() * 5);
  const orbitCenter = useRef(new THREE.Vector3(...position));
  const yWobble = useRef(Math.random() * 0.5);
  const phaseOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.3 + startTime.current;
    const r = orbitRadius.current;
    const phase = phaseOffset.current;

    /* swimming orbit */
    const x = orbitCenter.current.x + Math.cos(t * 0.5 + phase) * r;
    const z = orbitCenter.current.z + Math.sin(t * 0.5 + phase) * r;
    const y = orbitCenter.current.y + Math.sin(t * 0.8) * yWobble.current;

    groupRef.current.position.set(x, y, z);

    /* face direction of movement */
    const dx = -Math.sin(t * 0.5 + phase) * r * 0.5;
    const dz = Math.cos(t * 0.5 + phase) * r * 0.5;
    const angle = Math.atan2(dx, dz);
    groupRef.current.rotation.y = angle;

    /* body sway */
    groupRef.current.rotation.z = Math.sin(t * 3) * 0.08;

    /* tail swing */
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 6) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* body */}
      <mesh>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* body elongation */}
      <mesh scale={[1.8, 0.8, 0.7]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* tail */}
      <group ref={tailRef} position={[-0.6, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0.15, 0]}>
          <coneGeometry args={[0.25, 0.5, 4]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, -0.15, 0]}>
          <coneGeometry args={[0.25, 0.5, 4]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      </group>
      {/* dorsal fin */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.8)}
          roughness={0.4}
        />
      </mesh>
      {/* eye L */}
      <mesh position={[0.35, 0.1, 0.25]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.38, 0.1, 0.27]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* eye R */}
      <mesh position={[0.35, 0.1, -0.25]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.38, 0.1, -0.27]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

export default Fish;
