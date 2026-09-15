import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { createScreen } from "./screen.js";
import { sceneState, emitKeystroke } from "./sceneState.js";

/* Laptop dimensions, metres. */
const BASE_W = 0.36;
const BASE_D = 0.25;
const BASE_H = 0.016;
const LID_H = 0.235;
const LID_T = 0.009;
const HINGE_Z = -BASE_D / 2;

const LID_CLOSED = Math.PI / 2 - 0.03;
const LID_OPEN = -0.26;

const COLS = 13;
const ROWS = 5;
const PITCH_X = 0.0216;
const PITCH_Z = 0.0225;
const KEY = 0.0172;
const KEY_H = 0.0035;
const KEY_DIP = 0.0022;
const KEY_BASE_Y = BASE_H + KEY_H / 2;
const PRESS_TIME = 0.11;

/**
 * The laptop: lid that swings open on intro, a screen driven by the canvas
 * texture, and a keyboard that fires one keypress per typed character.
 */
export default function Laptop({ started }) {
  const screen = useMemo(() => createScreen(), []);
  useEffect(() => () => screen.dispose(), [screen]);

  const lid = useRef();
  const screenLight = useRef();
  const screenMat = useRef();
  const t0 = useRef(null);
  const settled = useRef(false);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    // The boot sequence is a timeline, not physics: run it off the wall clock
    // so a slow first frame cannot stretch it out.
    if (t0.current === null && started) t0.current = performance.now();
    const t = t0.current === null ? 0 : (performance.now() - t0.current) / 1000;

    if (sceneState.reducedMotion) {
      // Reduced motion gets the finished scene, not a blank one: lid open,
      // display painted once, nothing moving.
      if (!settled.current) {
        screen.settle();
        settled.current = true;
      }
      if (lid.current) lid.current.rotation.x = LID_OPEN;
      sceneState.glow = 1;
      sceneState.typing = 0;
    } else {
      settled.current = false;
      screen.update(t);
      sceneState.typing = screen.state.typing;
      sceneState.glow = screen.state.glow;

      // Lid swings open just ahead of the boot sequence.
      if (lid.current) {
        const target = t > 0.15 ? LID_OPEN : LID_CLOSED;
        lid.current.rotation.x = THREE.MathUtils.damp(
          lid.current.rotation.x,
          target,
          2.6,
          d,
        );
      }
    }

    // Screen spill: brightness tracks the boot sequence, with a light flicker
    // while characters are landing so the face lighting feels alive.
    const flicker =
      sceneState.reducedMotion || sceneState.typing < 0.1
        ? 1
        : 1 + Math.sin(t * 41) * 0.018 + Math.sin(t * 13.7) * 0.012;
    if (screenLight.current) {
      screenLight.current.intensity = sceneState.glow * 3.6 * flicker;
    }
    if (screenMat.current) {
      screenMat.current.opacity = Math.min(1, 0.15 + sceneState.glow);
    }
  });

  return (
    <group>
      {/* ── base ── */}
      <RoundedBox
        args={[BASE_W, BASE_H, BASE_D]}
        radius={0.005}
        smoothness={4}
        position={[0, BASE_H / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#1b1d23" roughness={0.42} metalness={0.78} />
      </RoundedBox>

      {/* keyboard well */}
      <mesh position={[0, BASE_H + 0.0002, -0.006]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.31, 0.135]} />
        <meshStandardMaterial color="#0b0c10" roughness={0.9} />
      </mesh>

      <Keyboard />

      {/* trackpad */}
      <mesh position={[0, BASE_H + 0.0004, 0.082]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.096, 0.058]} />
        <meshStandardMaterial color="#16181e" roughness={0.22} metalness={0.5} />
      </mesh>

      {/* hinge barrel */}
      <mesh position={[0, BASE_H, HINGE_Z + 0.004]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, BASE_W * 0.62, 16]} />
        <meshStandardMaterial color="#0e1014" roughness={0.35} metalness={0.85} />
      </mesh>

      {/* ── lid ── */}
      <group ref={lid} position={[0, BASE_H, HINGE_Z]} rotation={[LID_CLOSED, 0, 0]}>
        <RoundedBox
          args={[BASE_W, LID_H, LID_T]}
          radius={0.005}
          smoothness={4}
          position={[0, LID_H / 2, -LID_T / 2]}
          castShadow
        >
          <meshStandardMaterial color="#1b1d23" roughness={0.45} metalness={0.78} />
        </RoundedBox>

        {/* bezel */}
        <mesh position={[0, LID_H / 2, 0.0006]}>
          <planeGeometry args={[BASE_W - 0.012, LID_H - 0.012]} />
          <meshStandardMaterial color="#07080b" roughness={0.6} />
        </mesh>

        {/* display */}
        <mesh position={[0, LID_H / 2 + 0.004, 0.0016]}>
          <planeGeometry args={[0.328, 0.202]} />
          <meshBasicMaterial
            ref={screenMat}
            map={screen.texture}
            toneMapped={false}
            transparent
            opacity={0}
          />
        </mesh>

        {/* webcam */}
        <mesh position={[0, LID_H - 0.009, 0.0018]}>
          <circleGeometry args={[0.0016, 12]} />
          <meshStandardMaterial color="#2a2d35" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* the display is the scene's key light */}
        <pointLight
          ref={screenLight}
          position={[0, LID_H / 2, 0.1]}
          color="#cadaff"
          intensity={0}
          distance={2.1}
          decay={2}
        />
      </group>
    </group>
  );
}

/* ── Keyboard ─────────────────────────────────────────────────────────────
   One instanced mesh for every key. While the screen is typing we fire a
   keypress at the same cadence as the characters, dip that key, and tell the
   matching finger to tap. */
function Keyboard() {
  const keys = useMemo(() => {
    const out = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({
          x: (c - (COLS - 1) / 2) * PITCH_X,
          z: -0.066 + r * PITCH_Z,
          col: c,
        });
      }
    }
    return out;
  }, []);

  const refs = useRef([]);
  const press = useRef(new Float32Array(keys.length));
  const nextStroke = useRef(0.08);
  const clock = useRef(0);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    clock.current += d;

    if (!sceneState.reducedMotion && sceneState.typing > 0.2) {
      nextStroke.current -= d * sceneState.typing;
      if (nextStroke.current <= 0) {
        const i = (Math.random() * keys.length) | 0;
        press.current[i] = PRESS_TIME;
        emitKeystroke(fingerForColumn(keys[i].col), clock.current);
        // 27 chars/sec with a human wobble
        nextStroke.current = 0.037 + Math.random() * 0.036;
        if (Math.random() < 0.06) nextStroke.current += 0.22; // a beat to think
      }
    }

    for (let i = 0; i < keys.length; i++) {
      const o = refs.current[i];
      if (!o) continue;
      if (press.current[i] > 0) press.current[i] = Math.max(0, press.current[i] - d);
      const p = press.current[i] / PRESS_TIME;
      // quick down, softer release
      const dip = p > 0.72 ? (1 - p) / 0.28 : p / 0.72;
      o.position.y = KEY_BASE_Y - dip * KEY_DIP;
    }
  });

  return (
    <Instances limit={keys.length} range={keys.length} castShadow>
      <boxGeometry args={[KEY, KEY_H, KEY * 0.92]} />
      <meshStandardMaterial color="#0f1115" roughness={0.78} metalness={0.2} />
      {keys.map((k, i) => (
        <Instance
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[k.x, KEY_BASE_Y, k.z]}
        />
      ))}
    </Instances>
  );
}

/** Keyboard column → which of the eight typing fingers reaches for it. */
function fingerForColumn(col) {
  const t = col / (COLS - 1);
  return Math.min(7, Math.floor(t * 8));
}
