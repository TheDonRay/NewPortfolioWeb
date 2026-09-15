import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { sceneState } from "./sceneState.js";

/**
 * The desk and the clutter on it. The surface top sits exactly at y = 0, so
 * everything else in the scene can be positioned against a flat zero.
 */
export default function Desk() {
  return (
    <group>
      {/* surface */}
      <RoundedBox
        args={[1.75, 0.038, 0.74]}
        radius={0.006}
        smoothness={3}
        position={[0, -0.019, -0.07]}
        receiveShadow
      >
        <meshStandardMaterial color="#15161b" roughness={0.95} metalness={0.02} />
      </RoundedBox>

      {/* side panels, just enough to read as furniture in the dark */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.8, -0.42, -0.07]}>
          <boxGeometry args={[0.03, 0.78, 0.6]} />
          <meshStandardMaterial color="#0e0f13" roughness={0.95} />
        </mesh>
      ))}

      {/* desk mat under the laptop */}
      <mesh position={[0, 0.0012, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.66, 0.36]} />
        <meshStandardMaterial color="#101116" roughness={0.99} />
      </mesh>

      <Mug position={[0.35, 0, 0.03]} />
      <Books position={[-0.44, 0, -0.06]} />
      <Notebook position={[-0.3, 0, 0.14]} />

      {/* phone, face down next to the trackpad */}
      <RoundedBox
        args={[0.072, 0.008, 0.145]}
        radius={0.006}
        smoothness={3}
        position={[0.25, 0.005, 0.18]}
        rotation={[0, -0.32, 0]}
      >
        <meshStandardMaterial color="#0d0e12" roughness={0.35} metalness={0.5} />
      </RoundedBox>
    </group>
  );
}

function Mug({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.047, 0]}>
        <cylinderGeometry args={[0.042, 0.037, 0.094, 24, 1, true]} />
        <meshStandardMaterial color="#23252c" roughness={0.55} side={2} />
      </mesh>
      {/* coffee */}
      <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.04, 24]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.15} metalness={0.3} />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.037, 24]} />
        <meshStandardMaterial color="#1b1d23" roughness={0.7} />
      </mesh>
      {/* handle */}
      <mesh position={[0.05, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.022, 0.006, 8, 18, Math.PI * 1.25]} />
        <meshStandardMaterial color="#23252c" roughness={0.55} />
      </mesh>
      <Steam />
    </group>
  );
}

/** Slow wisps off the coffee — the one soft thing in a hard-edged scene. */
function Steam() {
  const puffs = useRef([]);
  const clock = useRef(0);
  const COUNT = 7;
  const LIFE = 3.4;

  useFrame((_, dt) => {
    if (sceneState.reducedMotion) return;
    clock.current += Math.min(dt, 0.05);
    const t = clock.current;

    for (let i = 0; i < COUNT; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = ((t / LIFE + i / COUNT) % 1);
      m.position.y = 0.1 + p * 0.2;
      m.position.x = Math.sin(p * 5 + i) * 0.018 * p;
      m.position.z = Math.cos(p * 4.2 + i * 1.7) * 0.014 * p;
      const s = 0.4 + p * 1.9;
      m.scale.setScalar(s);
      m.material.opacity = Math.sin(p * Math.PI) * 0.052;
    }
  });

  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} ref={(el) => (puffs.current[i] = el)} position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.016, 10, 8]} />
          <meshBasicMaterial
            color="#cfdcf5"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Books({ position }) {
  const stack = [
    { h: 0.026, w: 0.17, d: 0.235, r: 0.04, c: "#1c1e25" },
    { h: 0.021, w: 0.163, d: 0.225, r: -0.07, c: "#16181d" },
    { h: 0.03, w: 0.175, d: 0.24, r: 0.02, c: "#1f2129" },
  ];
  let y = 0;
  return (
    <group position={position}>
      {stack.map((b, i) => {
        const at = y + b.h / 2;
        y += b.h;
        return (
          <group key={i} position={[0, at, 0]} rotation={[0, b.r, 0]}>
            <RoundedBox args={[b.w, b.h, b.d]} radius={0.002} smoothness={2}>
              <meshStandardMaterial color={b.c} roughness={0.92} />
            </RoundedBox>
            {/* page block */}
            <mesh position={[b.w * 0.47, 0, 0]}>
              <boxGeometry args={[0.004, b.h * 0.72, b.d * 0.94]} />
              <meshStandardMaterial color="#4a4b52" roughness={0.95} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Notebook({ position }) {
  return (
    <group position={position} rotation={[0, 0.22, 0]}>
      <RoundedBox args={[0.16, 0.008, 0.21]} radius={0.003} smoothness={2} position={[0, 0.004, 0]}>
        <meshStandardMaterial color="#1a1c22" roughness={0.94} />
      </RoundedBox>
      {/* pen */}
      <mesh position={[0.02, 0.012, 0.01]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.004, 0.004, 0.13, 10]} />
        <meshStandardMaterial color="#2c2f37" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}
