import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoralGroupProps {
  position: [number, number, number];
  color: string;
  scale: number;
  onClick?: () => void;
}

const CoralGroup: React.FC<CoralGroupProps> = ({ position, color, scale, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      /* subtle swaying */
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.01;
    }
  });

  const colorDark = new THREE.Color(color).multiplyScalar(0.7);
  const colorLight = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.3);

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
      {/* main coral branch 1 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.0, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={colorLight} roughness={0.5} />
      </mesh>

      {/* branch 2 */}
      <mesh position={[0.3, 0.35, 0.15]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.1, 0.18, 0.7, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.7, 0.15]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={colorLight} roughness={0.5} />
      </mesh>

      {/* branch 3 */}
      <mesh position={[-0.25, 0.4, -0.1]} rotation={[0.2, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.15, 0.6, 8]} />
        <meshStandardMaterial color={colorDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.35, 0.75, -0.1]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* small coral bumps on ground */}
      <mesh position={[0.15, 0.08, 0.2]} scale={[0.6, 0.3, 0.6]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color={colorDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.2, 0.06, 0.15]} scale={[0.5, 0.25, 0.5]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color={colorDark} roughness={0.7} />
      </mesh>

      {/* base rock */}
      <mesh position={[0, -0.1, 0]} scale={[0.8, 0.25, 0.8]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>

      {/* glow indicator */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default CoralGroup;
