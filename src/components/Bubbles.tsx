import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BUBBLE_COUNT = 80;

const Bubbles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 100,
      y: -30 + Math.random() * 35,
      z: (Math.random() - 0.5) * 100,
      speed: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.3 + Math.random() * 0.6,
      scale: 0.02 + Math.random() * 0.06,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    data.forEach((b, i) => {
      /* rise */
      let y = b.y + t * b.speed;
      y = ((y + 30) % 35) - 30;

      const x = b.x + Math.sin(t * 0.5 + b.phase) * b.wobble;
      const z = b.z + Math.cos(t * 0.4 + b.phase) * b.wobble;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BUBBLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#a0d8ef"
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.2}
      />
    </instancedMesh>
  );
};

export default Bubbles;
