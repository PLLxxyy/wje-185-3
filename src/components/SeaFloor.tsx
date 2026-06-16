import React from 'react';

const SeaFloor: React.FC = () => {
  return (
    <group>
      {/* main sea floor plane */}
      <mesh position={[0, -30.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200, 40, 40]} />
        <meshStandardMaterial
          color="#1a3a2a"
          roughness={1}
          metalness={0}
          side={2}
        />
      </mesh>

      {/* sandy patches */}
      {[
        [10, -30.3, -15],
        [-20, -30.3, 10],
        [5, -30.3, 20],
        [-15, -30.3, -20],
        [25, -30.3, 5],
      ].map((pos, i) => (
        <mesh
          key={`sand-${i}`}
          position={pos as [number, number, number]}
          rotation={[-Math.PI / 2, 0, i * 1.2]}
        >
          <circleGeometry args={[3 + i * 0.5, 12]} />
          <meshStandardMaterial color="#3a5a4a" roughness={1} />
        </mesh>
      ))}

      {/* small rocks scattered on floor */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        const s = 0.2 + Math.random() * 0.5;
        return (
          <mesh
            key={`floor-rock-${i}`}
            position={[x, -30.3, z]}
            scale={[s, s * 0.4, s]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#4a5a50" roughness={0.95} />
          </mesh>
        );
      })}

      {/* scattered shells */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;
        return (
          <mesh
            key={`shell-${i}`}
            position={[x, -30.2, z]}
            rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
            scale={[0.15, 0.15, 0.08]}
          >
            <sphereGeometry args={[0.5, 6, 4, 0, Math.PI]} />
            <meshStandardMaterial
              color="#d4c4a8"
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default SeaFloor;
