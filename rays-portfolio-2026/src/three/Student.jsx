import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { sceneState } from "./sceneState.js";

/**
 * The student: a stylised seated figure, hunched a little over the keyboard.
 *
 * The arms are solved rather than posed — a two-bone IK puts the wrists on the
 * keyboard every frame, so the shoulders can breathe and sway without the
 * hands sliding off the keys.
 */

/** Bones are modelled running down their group's -Y axis. */
const DOWN = new THREE.Vector3(0, -1, 0);

const UPPER_ARM = 0.25;
const FOREARM = 0.24;

/** Where the student sits, relative to the laptop at the origin. Close enough
    that the elbows keep a bend when his hands are on the keys. */
const SEAT_Z = 0.52;

/* Wrist rest positions, in scene space — right at the near edge of the keys. */
const WRIST_L = new THREE.Vector3(-0.085, 0.046, 0.078);
const WRIST_R = new THREE.Vector3(0.085, 0.046, 0.078);

/* Elbows swing out and back from the body. */
const POLE_L = new THREE.Vector3(-1, -0.62, 0.42);
const POLE_R = new THREE.Vector3(1, -0.62, 0.42);

const SKIN = "#6f635a";
const HOODIE = "#21242b";

export default function Student() {
  const torso = useRef();
  const head = useRef();
  const clock = useRef(0);

  return (
    <group position={[0, 0, SEAT_Z]}>
      <Seat />
      <Legs />

      {/* torso pivots at the hips so the whole upper body leans and breathes */}
      <group ref={torso} position={[0, -0.26, 0]} rotation={[-0.17, 0, 0]}>
        <Hoodie />
        <Neck />
        <group ref={head} position={[0, 0.545, 0.018]}>
          <Head />
        </group>

        <Arm
          side={-1}
          shoulder={[-0.178, 0.345, 0.01]}
          wrist={WRIST_L}
          pole={POLE_L}
          torso={torso}
          fingerBase={0}
        />
        <Arm
          side={1}
          shoulder={[0.178, 0.345, 0.01]}
          wrist={WRIST_R}
          pole={POLE_R}
          torso={torso}
          fingerBase={4}
        />
      </group>

      <Idle torso={torso} head={head} clock={clock} />
    </group>
  );
}

/* ── Idle motion ──────────────────────────────────────────────────────────
   Breathing, a slow sway, and a head that lifts off the keyboard whenever the
   typing pauses. Split into its own component so the pose maths lives in one
   place instead of being smeared across every mesh. */
function Idle({ torso, head, clock }) {
  useFrame((_, dt) => {
    if (sceneState.reducedMotion) return;
    const d = Math.min(dt, 0.05);
    clock.current += d;
    const t = clock.current;
    const typing = sceneState.typing;

    if (torso.current) {
      const breath = Math.sin(t * 1.15) * 0.008;
      torso.current.scale.set(1, 1 + breath, 1 + breath * 0.6);
      torso.current.position.y = -0.26 + Math.sin(t * 1.15) * 0.004;
      // leans in while typing, eases back on the pauses
      torso.current.rotation.x = THREE.MathUtils.damp(
        torso.current.rotation.x,
        -0.17 - typing * 0.035,
        2.2,
        d,
      );
      torso.current.rotation.y = Math.sin(t * 0.37) * 0.028;
      torso.current.rotation.z = Math.sin(t * 0.29) * 0.014;
    }

    if (head.current) {
      // eyes down on the keys while typing, up at the screen while thinking
      const look = -0.16 * typing + 0.06 * (1 - typing);
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        look + Math.sin(t * 0.9) * 0.012,
        3,
        d,
      );
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        Math.sin(t * 0.44) * 0.06 + sceneState.pointerX * 0.05,
        2.4,
        d,
      );
      head.current.rotation.z = Math.sin(t * 0.51) * 0.02;
    }
  });
  return null;
}

/* ── Arm ──────────────────────────────────────────────────────────────── */
function Arm({ side, shoulder, wrist, pole, torso, fingerBase }) {
  const upper = useRef();
  const fore = useRef();
  const hand = useRef();
  const fingers = useRef([]);
  const clock = useRef(0);

  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      shoulder: new THREE.Vector3(...shoulder),
      dir: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      bend: new THREE.Vector3(),
      elbow: new THREE.Vector3(),
      wrist: new THREE.Vector3(),
      pole: pole.clone().normalize(),
    }),
    [shoulder, pole],
  );

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    clock.current += d;
    const t = clock.current;
    const s = scratch;

    if (!torso.current || !upper.current || !fore.current || !hand.current) return;

    // Wrists drift over the keys, then get converted into the torso's frame so
    // the IK stays correct while the body sways.
    s.target.copy(wrist);
    if (!sceneState.reducedMotion) {
      const drift = sceneState.typing;
      s.target.x += Math.sin(t * 1.9 + side) * 0.012 * drift;
      s.target.z += Math.sin(t * 1.3 + side * 2) * 0.008 * drift;
      s.target.y += Math.sin(t * 2.7 + side) * 0.003 * drift;
    }
    torso.current.updateWorldMatrix(true, false);
    torso.current.worldToLocal(s.target);

    // ── two-bone IK ──
    s.dir.subVectors(s.target, s.shoulder);
    const reach = THREE.MathUtils.clamp(
      s.dir.length(),
      0.02,
      UPPER_ARM + FOREARM - 0.004,
    );
    s.dir.normalize();
    // The wrist the bones can actually reach — never the raw target, or the
    // hand floats off the end of the forearm when the arm is at full stretch.
    s.wrist.copy(s.shoulder).addScaledVector(s.dir, reach);

    const cos = THREE.MathUtils.clamp(
      (UPPER_ARM * UPPER_ARM + reach * reach - FOREARM * FOREARM) /
        (2 * UPPER_ARM * reach),
      -1,
      1,
    );
    const bendAngle = Math.acos(cos);

    s.normal.crossVectors(s.dir, s.pole);
    if (s.normal.lengthSq() < 1e-6) s.normal.set(0, 0, 1);
    s.normal.normalize();

    s.bend.copy(s.dir).applyAxisAngle(s.normal, bendAngle);
    s.elbow.copy(s.shoulder).addScaledVector(s.bend, UPPER_ARM);

    upper.current.position.copy(s.shoulder);
    upper.current.quaternion.setFromUnitVectors(DOWN, s.bend);

    fore.current.position.copy(s.elbow);
    s.dir.subVectors(s.wrist, s.elbow).normalize();
    fore.current.quaternion.setFromUnitVectors(DOWN, s.dir);

    // Palms stay level with the desk, which means undoing the torso's lean.
    hand.current.position.copy(s.wrist);
    hand.current.rotation.set(0.17 - 0.06, -side * 0.16, 0);

    // fingers land on the beat the keyboard broadcasts
    for (let i = 0; i < 4; i++) {
      const knuckle = fingers.current[i];
      if (!knuckle) continue;
      const age = t - sceneState.strokes[fingerBase + i];
      let amt = 0;
      if (!sceneState.reducedMotion && age >= 0 && age < 0.24) {
        amt = age < 0.09 ? age / 0.09 : Math.max(0, 1 - (age - 0.09) / 0.15);
      }
      knuckle.rotation.x = amt * 0.62;
    }
  });

  return (
    <>
      <group ref={upper}>
        <Bone length={UPPER_ARM} radius={0.046} color={HOODIE} roughness={0.95} />
      </group>
      <group ref={fore}>
        <Bone length={FOREARM} radius={0.036} color={HOODIE} roughness={0.95} />
        {/* cuff where the sleeve ends */}
        <mesh position={[0, -FOREARM + 0.03, 0]}>
          <cylinderGeometry args={[0.038, 0.035, 0.028, 14]} />
          <meshStandardMaterial color="#191b21" roughness={0.9} />
        </mesh>
      </group>

      <group ref={hand}>
        {/* palm */}
        <RoundedBox args={[0.062, 0.024, 0.072]} radius={0.011} smoothness={3}>
          <meshStandardMaterial color={SKIN} roughness={0.72} />
        </RoundedBox>
        {[0, 1, 2, 3].map((i) => (
          <group
            key={i}
            ref={(el) => (fingers.current[i] = el)}
            position={[(i - 1.5) * 0.0155 * -side, -0.004, -0.03]}
          >
            <mesh position={[0, -0.004, -0.021]} rotation={[0.35, 0, 0]}>
              <capsuleGeometry args={[0.0062, 0.034, 3, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.72} />
            </mesh>
          </group>
        ))}
        {/* thumb */}
        <mesh
          position={[side * 0.032, -0.006, -0.008]}
          rotation={[0.5, 0, side * 0.7]}
        >
          <capsuleGeometry args={[0.0072, 0.024, 3, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.72} />
        </mesh>
      </group>
    </>
  );
}

/** A bone that runs from the group origin down its own -Y axis. */
function Bone({ length, radius, color, roughness }) {
  return (
    <mesh position={[0, -length / 2, 0]}>
      <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 4, 14]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

/* ── Body parts ───────────────────────────────────────────────────────── */
function Hoodie() {
  return (
    <group>
      <RoundedBox
        args={[0.385, 0.45, 0.235]}
        radius={0.085}
        smoothness={4}
        position={[0, 0.195, 0]}
      >
        <meshStandardMaterial color={HOODIE} roughness={0.96} />
      </RoundedBox>

      {/* deltoids � without these the shoulder line is a slab corner */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.182, 0.335, 0.005]} scale={[1, 0.95, 1]}>
          <sphereGeometry args={[0.066, 18, 14]} />
          <meshStandardMaterial color={HOODIE} roughness={0.96} />
        </mesh>
      ))}

      {/* hood bunched behind the neck */}
      <mesh position={[0, 0.4, -0.085]} rotation={[1.3, 0, 0]}>
        <torusGeometry args={[0.088, 0.042, 10, 22]} />
        <meshStandardMaterial color="#1c1e24" roughness={0.97} />
      </mesh>

      {/* front pocket seam */}
      <mesh position={[0, 0.1, 0.1185]}>
        <planeGeometry args={[0.2, 0.09]} />
        <meshStandardMaterial color="#1b1d23" roughness={0.98} />
      </mesh>
    </group>
  );
}

function Neck() {
  return (
    <mesh position={[0, 0.443, 0.012]} rotation={[0.12, 0, 0]}>
      <cylinderGeometry args={[0.036, 0.044, 0.095, 16]} />
      <meshStandardMaterial color="#5f554d" roughness={0.8} />
    </mesh>
  );
}

function Head() {
  return (
    <group>
      {/* skull */}
      <mesh scale={[1, 1.07, 0.97]}>
        <sphereGeometry args={[0.095, 28, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.74} />
      </mesh>

      {/* hair cap */}
      <mesh position={[0, 0.004, -0.006]} scale={[1.03, 1.06, 1.04]}>
        <sphereGeometry args={[0.0965, 26, 22, 0, Math.PI * 2, 0, 1.12]} />
        <meshStandardMaterial color="#15161a" roughness={0.92} />
      </mesh>
      {/* back of the hair */}
      <mesh position={[0, -0.004, -0.026]} scale={[0.97, 0.9, 0.72]}>
        <sphereGeometry args={[0.095, 20, 18]} />
        <meshStandardMaterial color="#15161a" roughness={0.92} />
      </mesh>

      {/* ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.091, -0.008, 0.004]} scale={[0.5, 1, 0.75]}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshStandardMaterial color={SKIN} roughness={0.78} />
        </mesh>
      ))}

      {/* glasses — they pick up the screen the way nothing else on the face does */}
      <group position={[0, -0.016, 0.078]}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.034, 0, 0]} rotation={[0.06, 0, 0]}>
            <torusGeometry args={[0.026, 0.0032, 8, 22]} />
            <meshStandardMaterial
              color="#3a3d45"
              roughness={0.25}
              metalness={0.85}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.004, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0028, 0.0028, 0.02, 8]} />
          <meshStandardMaterial color="#3a3d45" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* lenses catch the display */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.034, 0, 0.001]}>
            <circleGeometry args={[0.0242, 20]} />
            <meshStandardMaterial
              color="#8aa4d8"
              roughness={0.05}
              metalness={0.6}
              transparent
              opacity={0.16}
            />
          </mesh>
        ))}
        {/* temples */}
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            position={[s * 0.06, 0.003, -0.04]}
            rotation={[0, s * 0.3, 0]}
          >
            <boxGeometry args={[0.0035, 0.0035, 0.076]} />
            <meshStandardMaterial
              color="#3a3d45"
              roughness={0.25}
              metalness={0.85}
            />
          </mesh>
        ))}
      </group>

      {/* brows and eyes, kept to the barest marks */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.034, 0.023, 0.085]} scale={[1, 0.35, 0.3]}>
          <sphereGeometry args={[0.012, 10, 8]} />
          <meshStandardMaterial color="#15161a" roughness={0.9} />
        </mesh>
      ))}

      {/* nose � the one feature that makes the profile read as a face */}
      <mesh position={[0, -0.022, 0.088]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.016, 0.042, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>

      <Headphones />
    </group>
  );
}

function Headphones() {
  return (
    <group>
      <mesh position={[0, 0.005, -0.007]} rotation={[0.06, 0, 0]}>
        <torusGeometry args={[0.1, 0.0075, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#25272e" roughness={0.55} metalness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.097, -0.014, -0.002]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.029, 0.029, 0.021, 20]} />
            <meshStandardMaterial color="#22242a" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.011, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.004, 20]} />
            <meshStandardMaterial color="#34373f" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Legs() {
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s}>
          {/* thigh, running forward under the desk */}
          <mesh position={[s * 0.085, -0.31, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.058, 0.2, 4, 12]} />
            <meshStandardMaterial color="#1a1c21" roughness={0.95} />
          </mesh>
          {/* shin */}
          <mesh position={[s * 0.085, -0.46, -0.25]}>
            <capsuleGeometry args={[0.046, 0.19, 4, 12]} />
            <meshStandardMaterial color="#1a1c21" roughness={0.95} />
          </mesh>
          {/* shoe */}
          <mesh position={[s * 0.085, -0.585, -0.29]}>
            <boxGeometry args={[0.078, 0.045, 0.16]} />
            <meshStandardMaterial color="#101115" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Seat() {
  return (
    <group position={[0, 0, 0.05]}>
      {/* cushion */}
      <RoundedBox
        args={[0.42, 0.05, 0.4]}
        radius={0.018}
        smoothness={3}
        position={[0, -0.36, 0.02]}
      >
        <meshStandardMaterial color="#141519" roughness={0.9} />
      </RoundedBox>
      {/* back rest */}
      <RoundedBox
        args={[0.37, 0.4, 0.045]}
        radius={0.02}
        smoothness={3}
        position={[0, -0.145, 0.235]}
        rotation={[0.13, 0, 0]}
      >
        <meshStandardMaterial color="#141519" roughness={0.9} />
      </RoundedBox>
      {/* stem */}
      <mesh position={[0, -0.56, 0.02]}>
        <cylinderGeometry args={[0.028, 0.034, 0.36, 14]} />
        <meshStandardMaterial color="#0f1013" roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}
