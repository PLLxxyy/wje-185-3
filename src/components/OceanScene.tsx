import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import Fish from './Fish';
import Shark from './Shark';
import Turtle from './Turtle';
import Jellyfish from './Jellyfish';
import Ray from './Ray';
import Dolphin from './Dolphin';
import CoralGroup from './CoralGroup';
import Shipwreck from './Shipwreck';
import Rock from './Rock';
import Ruins from './Ruins';
import SeaFloor from './SeaFloor';
import Seaweed from './Seaweed';
import Bubbles from './Bubbles';
import LightRays from './LightRays';
import {
  creatures,
  environmentObjects,
  cruiseRoute,
  CreatureInfo,
  getBehaviorState,
  BehaviorState,
} from '../data/creatures';

interface OceanSceneProps {
  cruiseMode: boolean;
  onDepthChange: (depth: number) => void;
  onPositionChange: (pos: [number, number, number]) => void;
  onCreatureClick: (info: CreatureInfo, behaviorState: BehaviorState) => void;
  onObjectClick: (name: string, description: string) => void;
}

/* ---- camera + fog controller ---- */
const CameraController: React.FC<{
  cruiseMode: boolean;
  onDepthChange: (d: number) => void;
  onPositionChange: (p: [number, number, number]) => void;
}> = ({ cruiseMode, onDepthChange, onPositionChange }) => {
  const { camera, scene } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLocked = useRef(false);
  const cruiseIdx = useRef(0);
  const cruiseT = useRef(0);
  const prevTime = useRef(0);

  /* pointer lock */
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const onClick = () => {
      canvas.requestPointerLock();
    };
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      euler.current.y -= e.movementX * 0.002;
      euler.current.x -= e.movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
    };
    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  /* keyboard */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  /* cruise – catmull-rom through route points */
  const cruisePoints = useMemo(
    () => cruiseRoute.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    []
  );

  /* smoothing vector for movement */
  const smoothPos = useRef(new THREE.Vector3(0, 0, 0));
  const firstFrame = useRef(true);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const speed = 15;

    if (cruiseMode) {
      cruiseT.current += dt * 0.08;
      if (cruiseT.current >= 1) {
        cruiseT.current = 0;
        cruiseIdx.current = (cruiseIdx.current + 1) % (cruisePoints.length - 1);
      }
      const i = cruiseIdx.current;
      const p0 = cruisePoints[(i + cruisePoints.length - 1) % cruisePoints.length];
      const p1 = cruisePoints[i];
      const p2 = cruisePoints[(i + 1) % cruisePoints.length];
      const p3 = cruisePoints[(i + 2) % cruisePoints.length];
      const t = cruiseT.current;
      const t2 = t * t;
      const t3 = t2 * t;
      const target = new THREE.Vector3();
      target.x =
        0.5 *
        ((-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3 +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + p2.x) * t +
          2 * p1.x);
      target.y =
        0.5 *
        ((-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3 +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + p2.y) * t +
          2 * p1.y);
      target.z =
        0.5 *
        ((-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3 +
          (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
          (-p0.z + p2.z) * t +
          2 * p1.z);

      if (firstFrame.current) {
        smoothPos.current.copy(target);
        firstFrame.current = false;
      }
      smoothPos.current.lerp(target, 2 * dt);

      camera.position.copy(smoothPos.current);
      const lookTarget = new THREE.Vector3(
        smoothPos.current.x + Math.cos(euler.current.y) * 5,
        smoothPos.current.y + Math.sin(euler.current.x) * 3,
        smoothPos.current.z + Math.sin(euler.current.y) * 5
      );
      camera.lookAt(lookTarget);
    } else {
      firstFrame.current = true;
      const k = keys.current;
      const dir = new THREE.Vector3();
      const right = new THREE.Vector3();
      camera.getWorldDirection(dir);
      right.crossVectors(dir, camera.up).normalize();

      if (k['KeyW'] || k['ArrowUp']) camera.position.addScaledVector(dir, speed * dt);
      if (k['KeyS'] || k['ArrowDown']) camera.position.addScaledVector(dir, -speed * dt);
      if (k['KeyA'] || k['ArrowLeft']) camera.position.addScaledVector(right, -speed * dt);
      if (k['KeyD'] || k['ArrowRight']) camera.position.addScaledVector(right, speed * dt);
      if (k['Space']) camera.position.y += speed * dt;
      if (k['ShiftLeft'] || k['ShiftRight']) camera.position.y -= speed * dt;

      camera.rotation.copy(euler.current);
    }

    /* clamp camera to ocean */
    camera.position.y = Math.max(-32, Math.min(2, camera.position.y));

    /* depth based fog */
    const depthVal = -camera.position.y;
    const fogNear = Math.max(2, 30 - depthVal * 0.6);
    const fogFar = Math.max(10, 80 - depthVal * 1.2);
    if (scene.fog) {
      (scene.fog as THREE.Fog).near = fogNear;
      (scene.fog as THREE.Fog).far = fogFar;
    }

    const pos = camera.position;
    onDepthChange(Math.max(0, Math.round(depthVal)));
    onPositionChange([
      Math.round(pos.x * 10) / 10,
      Math.round(pos.y * 10) / 10,
      Math.round(pos.z * 10) / 10,
    ]);
  });

  return null;
};

/* ---- depth-adaptive lights ---- */
const DepthLights: React.FC = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambRef = useRef<THREE.AmbientLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    const depth = Math.max(0, -camera.position.y);
    const t = Math.min(depth / 30, 1);
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(1.2, 0.05, t);
      lightRef.current.color.setHSL(0.55, 0.3, THREE.MathUtils.lerp(0.8, 0.1, t));
    }
    if (ambRef.current) {
      ambRef.current.intensity = THREE.MathUtils.lerp(0.4, 0.02, t);
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[10, 30, 10]}
        intensity={1.2}
        color="#a0d8ef"
        castShadow={false}
      />
      <ambientLight ref={ambRef} intensity={0.4} color="#4a90a4" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#b3e5fc" distance={40} />
    </>
  );
};

/* ---- proximity detector for creatures ---- */
const ProximityDetector: React.FC<{
  onCreatureClick: (info: CreatureInfo, behaviorState: BehaviorState) => void;
}> = ({ onCreatureClick }) => {
  const { camera, clock } = useThree();
  const shownRef = useRef<string | null>(null);

  useFrame(() => {
    const pos = camera.position;
    let closestDist = Infinity;
    let closestCreature: (typeof creatures)[0] | null = null;

    for (const c of creatures) {
      const dx = pos.x - c.position[0];
      const dy = pos.y - c.position[1];
      const dz = pos.z - c.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closestCreature = c;
      }
    }

    if (closestCreature && closestDist < 6) {
      const behaviorState = getBehaviorState(
        closestCreature.behavior.type,
        clock.elapsedTime,
        closestCreature.speed
      );
      if (shownRef.current !== closestCreature.id) {
        shownRef.current = closestCreature.id;
        onCreatureClick(closestCreature.info, behaviorState);
      } else {
        onCreatureClick(closestCreature.info, behaviorState);
      }
    } else if (closestDist > 10) {
      if (shownRef.current !== null) {
        shownRef.current = null;
      }
    }
  });

  return null;
};

/* ---- creature label ---- */
const CreatureLabel: React.FC<{
  text: string;
  position: [number, number, number];
}> = ({ text, position }) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const dx = camera.position.x - position[0];
      const dy = camera.position.y - position[1];
      const dz = camera.position.z - position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      groupRef.current.visible = dist < 20;
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1] + 1.5, position[2]]}>
      <Text
        fontSize={0.35}
        color="#7fdbff"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#001a33"
      >
        {text}
      </Text>
    </group>
  );
};

/* ---- seaweed positions ---- */
const seaweedPositions: [number, number, number][] = [];
for (let i = 0; i < 40; i++) {
  seaweedPositions.push([
    (Math.random() - 0.5) * 80,
    -30,
    (Math.random() - 0.5) * 80,
  ]);
}

/* ---- main scene content ---- */
const SceneContent: React.FC<OceanSceneProps> = ({
  cruiseMode,
  onDepthChange,
  onPositionChange,
  onCreatureClick,
  onObjectClick,
}) => {
  return (
    <>
      <CameraController
        cruiseMode={cruiseMode}
        onDepthChange={onDepthChange}
        onPositionChange={onPositionChange}
      />
      <DepthLights />
      <ProximityDetector onCreatureClick={onCreatureClick} />

      {/* sea floor */}
      <SeaFloor />

      {/* seaweed */}
      {seaweedPositions.map((pos, i) => (
        <Seaweed key={`sw-${i}`} position={pos} height={1.5 + Math.random() * 2} />
      ))}

      {/* creatures */}
      {creatures.map((c) => {
        const Label = (
          <CreatureLabel
            key={`label-${c.id}`}
            text={c.info.name}
            position={c.position}
          />
        );
        switch (c.type) {
          case 'fish':
            return (
              <React.Fragment key={c.id}>
                <Fish position={c.position} color={c.color} scale={c.scale} speed={c.speed} behavior={c.behavior} />
                {Label}
              </React.Fragment>
            );
          case 'shark':
            return (
              <React.Fragment key={c.id}>
                <Shark position={c.position} color={c.color} scale={c.scale} speed={c.speed} behavior={c.behavior} />
                {Label}
              </React.Fragment>
            );
          case 'turtle':
            return (
              <React.Fragment key={c.id}>
                <Turtle position={c.position} color={c.color} scale={c.scale} speed={c.speed} behavior={c.behavior} />
                {Label}
              </React.Fragment>
            );
          case 'jellyfish':
            return (
              <React.Fragment key={c.id}>
                <Jellyfish position={c.position} color={c.color} scale={c.scale} speed={c.speed} behavior={c.behavior} />
                {Label}
              </React.Fragment>
            );
          case 'ray':
            return (
              <React.Fragment key={c.id}>
                <Ray position={c.position} color={c.color} scale={c.scale} speed={c.speed} behavior={c.behavior} />
                {Label}
              </React.Fragment>
            );
          case 'dolphin':
            return (
              <React.Fragment key={c.id}>
                <Dolphin position={c.position} color={c.color} scale={c.scale} speed={c.speed} behavior={c.behavior} />
                {Label}
              </React.Fragment>
            );
          default:
            return null;
        }
      })}

      {/* environment objects */}
      {environmentObjects.map((obj) => {
        switch (obj.type) {
          case 'coral':
            return (
              <CoralGroup
                key={obj.id}
                position={obj.position}
                color={obj.color}
                scale={obj.scale}
                onClick={() => onObjectClick(obj.name, obj.description)}
              />
            );
          case 'shipwreck':
            return (
              <Shipwreck
                key={obj.id}
                position={obj.position}
                color={obj.color}
                scale={obj.scale}
                rotation={obj.rotation || [0, 0, 0]}
                onClick={() => onObjectClick(obj.name, obj.description)}
              />
            );
          case 'rock':
            return (
              <Rock
                key={obj.id}
                position={obj.position}
                color={obj.color}
                scale={obj.scale}
                onClick={() => onObjectClick(obj.name, obj.description)}
              />
            );
          case 'ruins':
            return (
              <Ruins
                key={obj.id}
                position={obj.position}
                color={obj.color}
                scale={obj.scale}
                onClick={() => onObjectClick(obj.name, obj.description)}
              />
            );
          default:
            return null;
        }
      })}

      {/* particles */}
      <Bubbles />
      <LightRays />
    </>
  );
};

/* ---- exported canvas ---- */
const OceanScene: React.FC<OceanSceneProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 70, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog('#001a2e', 5, 60);
        scene.background = new THREE.Color('#000e1a');
      }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
};

export default OceanScene;
