import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JellyfishProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}

const Jellyfish: React.FC<JellyfishProps> = ({ position, color, scale, speed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tentaclesRef = useRef<THREE.Mesh[]>([]);
  const startTime = useRef(Math.random() * 100);
  const center = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.3 + startTime.current;

    /* gentle drifting */
    const x = center.current.x + Math.sin(t * 0.4) * 3;
    const z = center.current.z + Math.cos(t * 0.3) * 3;
    const y = center.current.y + Math.sin(t * 0.6) * 2;

    groupRef.current.position.set(x, y, z);

    /* pulsing animation */
    const pulse = 1 + Math.sin(t * 3) * 0.1;
    groupRef.current.scale.set(pulse, 1 / pulse, pulse);

    /* tentacle sway */
    tentaclesRef.current.forEach((tent, i) => {
      if (tent) {
        const offset = i * 0.8;
        tent.position.x = Math.sin(t * 2 + offset) * 0.15;
        tent.position.z = Math.cos(t * 2 + offset) * 0.15;
      }
    });
  });

  const glowColor = new THREE.Color(color).multiplyScalar(1.3);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* bell (dome) */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.3}
          emissive={glowColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* inner glow */}
      <mesh scale={0.85} position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.5, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          emissive={glowColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* oral arms (short frilly parts) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`oral-${i}`}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.15,
            -0.2,
            Math.sin((i * Math.PI) / 2) * 0.15,
          ]}
        >
          <cylinderGeometry args={[0.03, 0.01, 0.4, 6]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.5}
            emissive={glowColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      {/* tentacles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`tent-${i}`}
          ref={(el) => {
            if (el) tentaclesRef.current[i] = el;
          }}
          position={[
            Math.cos((i * Math.PI) / 4) * 0.3,
            -0.3,
            Math.sin((i * Math.PI) / 4) * 0.3,
          ]}
        >
          <cylinderGeometry args={[0.02, 0.005, 1.0, 5]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.35}
            emissive={glowColor}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      {/* point light for glow effect */}
      <pointLight color={color} intensity={0.5} distance={4} />
    </group>
  );
};

export default Jellyfish;
