import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TurtleProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}

const Turtle: React.FC<TurtleProps> = ({ position, color, scale, speed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const flippersRef = useRef<THREE.Group[]>([]);
  const startTime = useRef(Math.random() * 100);
  const center = useRef(new THREE.Vector3(...position));
  const orbitR = useRef(5 + Math.random() * 4);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.15 + startTime.current;
    const r = orbitR.current;
    const p = phase.current;

    const x = center.current.x + Math.cos(t * 0.25 + p) * r;
    const z = center.current.z + Math.sin(t * 0.25 + p) * r;
    const y = center.current.y + Math.sin(t * 0.4) * 1;

    groupRef.current.position.set(x, y, z);
    const dx = -Math.sin(t * 0.25 + p) * r * 0.25;
    const dz = Math.cos(t * 0.25 + p) * r * 0.25;
    groupRef.current.rotation.y = Math.atan2(dx, dz);

    /* flippers */
    flippersRef.current.forEach((flipper, i) => {
      if (flipper) {
        const dir = i < 2 ? 1 : -1;
        flipper.rotation.x = Math.sin(t * 2) * 0.5 * dir;
      }
    });
  });

  const shellColor = new THREE.Color(color).multiplyScalar(0.7);
  const skinColor = new THREE.Color(color).lerp(new THREE.Color('#a0d0a0'), 0.5);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* shell */}
      <mesh scale={[1.3, 0.6, 1.1]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={shellColor} roughness={0.6} />
      </mesh>
      {/* shell pattern */}
      <mesh scale={[1.1, 0.55, 0.95]} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* head */}
      <mesh position={[0.5, 0, 0]} scale={[0.4, 0.3, 0.3]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      {/* front flipper L */}
      <group
        ref={(el) => {
          if (el) flippersRef.current[0] = el;
        }}
        position={[0.3, 0, 0.35]}
      >
        <mesh rotation={[0, 0, 0.5]} scale={[0.8, 0.15, 0.4]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      </group>
      {/* front flipper R */}
      <group
        ref={(el) => {
          if (el) flippersRef.current[1] = el;
        }}
        position={[0.3, 0, -0.35]}
      >
        <mesh rotation={[0, 0, 0.5]} scale={[0.8, 0.15, 0.4]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      </group>
      {/* rear flipper L */}
      <group
        ref={(el) => {
          if (el) flippersRef.current[2] = el;
        }}
        position={[-0.45, 0, 0.25]}
      >
        <mesh scale={[0.5, 0.1, 0.3]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      </group>
      {/* rear flipper R */}
      <group
        ref={(el) => {
          if (el) flippersRef.current[3] = el;
        }}
        position={[-0.45, 0, -0.25]}
      >
        <mesh scale={[0.5, 0.1, 0.3]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      </group>
      {/* tail */}
      <mesh position={[-0.55, 0, 0]} scale={[0.3, 0.08, 0.08]}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* eyes */}
      <mesh position={[0.65, 0.08, 0.18]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.65, 0.08, -0.18]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

export default Turtle;
