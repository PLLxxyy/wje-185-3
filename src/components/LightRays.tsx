import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RAY_COUNT = 5;

const LightRays: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const rays = useMemo(() => {
    return Array.from({ length: RAY_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      width: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <LightRay key={i} {...ray} />
      ))}
    </group>
  );
};

const LightRay: React.FC<{
  x: number;
  z: number;
  width: number;
  phase: number;
  speed: number;
}> = ({ x, z, width, phase, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const opacity = 0.03 + Math.sin(t * speed + phase) * 0.02;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = opacity;
  });

  return (
    <mesh
      ref={meshRef}
      position={[x, -10, z]}
      rotation={[0, 0, 0]}
      scale={[width, 35, width * 0.3]}
    >
      <cylinderGeometry args={[0.5, 1.5, 1, 6, 1, true]} />
      <meshStandardMaterial
        color="#b3e5fc"
        transparent
        opacity={0.04}
        emissive="#b3e5fc"
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export default LightRays;
