import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PerspectiveCamera,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

/* ── Palette ──────────────────────────────────────────────────
   Mirrors the CSS tokens so page and render read as one object. */
const PAL = {
  ink: "#151b24",
  hoodie: "#273241",
  hoodieDeep: "#1b2430",
  hair: "#12161d",
  skin: "#e2a97f",
  skinShade: "#c98f66",
  deskTop: "#e9e1d4",
  deskEdge: "#d5cbba",
  metal: "#c5cbd4",
  metalDark: "#9aa3ae",
  amber: "#ff6a1a",
  glow: "#ffc48a",
  paper: "#ffffff",
  mist: "#e7ebf0",
};

/* ── Limb helper ──────────────────────────────────────────────
   Builds a capsule spanning two points, so arm/leg poses are
   authored as joint coordinates instead of hand-tuned Euler angles. */
function Limb({ from, to, radius = 0.085, color, roughness = 0.75 }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return {
      position: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5),
      quaternion: q,
      length: Math.max(len - radius * 2, 0.01),
    };
  }, [from, to, radius]);

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <capsuleGeometry args={[radius, length, 6, 16]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

function Box({ size, radius = 0.03, color, roughness = 0.7, metalness = 0, ...rest }) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={4} castShadow receiveShadow {...rest}>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  );
}

/* ── Desk ─────────────────────────────────────────────────── */
function Desk() {
  return (
    <group>
      <Box size={[2.2, 0.07, 1.0]} radius={0.025} color={PAL.deskTop} position={[0, 0.76, -0.05]} roughness={0.85} />
      {[
        [-1.01, 0.36],
        [1.01, 0.36],
        [-1.01, -0.46],
        [1.01, -0.46],
      ].map(([x, z]) => (
        <Box key={`${x}${z}`} size={[0.055, 0.76, 0.055]} radius={0.018} color={PAL.deskEdge} position={[x, 0.38, z]} />
      ))}
    </group>
  );
}

/* ── Chair ────────────────────────────────────────────────── */
function Chair() {
  return (
    <group position={[0, 0, -0.74]}>
      <Box size={[0.58, 0.09, 0.54]} radius={0.045} color={PAL.hoodieDeep} position={[0, 0.44, 0]} />
      <Box size={[0.56, 0.6, 0.08]} radius={0.05} color={PAL.hoodieDeep} position={[0, 0.79, -0.26]} rotation={[-0.13, 0, 0]} />
      <mesh position={[0, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.42, 16]} />
        <meshStandardMaterial color={PAL.metalDark} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.05, 24]} />
        <meshStandardMaterial color={PAL.metalDark} roughness={0.45} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Student ──────────────────────────────────────────────────
   Seated at the far edge, leaning in, hands at the keyboard. */
function Student() {
  return (
    <group>
      {/* hips + torso */}
      <Box size={[0.56, 0.26, 0.44]} radius={0.11} color={PAL.hoodieDeep} position={[0, 0.56, -0.66]} />
      <Box
        size={[0.6, 0.64, 0.42]}
        radius={0.14}
        color={PAL.hoodie}
        position={[0, 0.94, -0.64]}
        rotation={[0.2, 0, 0]}
        roughness={0.9}
      />
      {/* hood bunched at the neck */}
      <Box size={[0.44, 0.18, 0.34]} radius={0.09} color={PAL.hoodieDeep} position={[0, 1.19, -0.72]} rotation={[0.25, 0, 0]} />

      {/* neck + head */}
      <mesh position={[0, 1.24, -0.58]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.12, 16]} />
        <meshStandardMaterial color={PAL.skinShade} roughness={0.8} />
      </mesh>
      <Box
        size={[0.38, 0.42, 0.36]}
        radius={0.15}
        color={PAL.skin}
        position={[0, 1.44, -0.55]}
        rotation={[0.26, 0, 0]}
        roughness={0.82}
      />
      {/* Hair: crown, a fringe above the brow, and sides past the ears.
          The group is pivoted on the head's own centre — rotating it about
          the world origin swings the fringe down over the face. */}
      <group position={[0, 1.44, -0.55]} rotation={[0.26, 0, 0]}>
        <Box
          size={[0.43, 0.34, 0.42]}
          radius={0.16}
          color={PAL.hair}
          position={[0, 0.09, -0.04]}
          roughness={0.95}
        />
        {/* fringe, stopping well clear of the glasses */}
        <Box
          size={[0.4, 0.13, 0.22]}
          radius={0.055}
          color={PAL.hair}
          position={[0, 0.15, 0.1]}
          roughness={0.95}
        />
        {/* sides, cut short at ear level rather than down to the jaw */}
        {[-0.177, 0.177].map((x) => (
          <Box
            key={x}
            size={[0.068, 0.16, 0.3]}
            radius={0.032}
            color={PAL.hair}
            position={[x, 0.06, -0.04]}
            roughness={0.95}
          />
        ))}
      </group>

      {/* full-rim glasses: lenses, bridge, and temples back to the ears */}
      <group position={[0, 1.42, -0.38]} rotation={[0.26, 0, 0]}>
        {[-0.082, 0.082].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.055, 0.011, 10, 24]} />
              <meshStandardMaterial color={PAL.ink} roughness={0.3} metalness={0.35} />
            </mesh>
            <mesh position={[0, 0, -0.002]}>
              <circleGeometry args={[0.055, 24]} />
              <meshStandardMaterial
                color="#cfe3f2"
                roughness={0.08}
                metalness={0.1}
                transparent
                opacity={0.45}
              />
            </mesh>
          </group>
        ))}
        {/* bridge */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.008, 0.038, 4, 10]} />
          <meshStandardMaterial color={PAL.ink} roughness={0.3} metalness={0.35} />
        </mesh>
        {/* temples, angled back along the sides of the head */}
        <Limb from={[-0.135, 0.012, -0.004]} to={[-0.185, 0.0, -0.17]} radius={0.009} color={PAL.ink} roughness={0.3} />
        <Limb from={[0.135, 0.012, -0.004]} to={[0.185, 0.0, -0.17]} radius={0.009} color={PAL.ink} roughness={0.3} />
      </group>

      {/* arms: shoulder → elbow → wrist, reaching the keyboard */}
      <Limb from={[-0.31, 1.12, -0.6]} to={[-0.47, 0.9, -0.3]} radius={0.085} color={PAL.hoodie} />
      <Limb from={[-0.47, 0.9, -0.3]} to={[-0.26, 0.83, -0.02]} radius={0.072} color={PAL.hoodie} />
      <Limb from={[0.31, 1.12, -0.6]} to={[0.47, 0.9, -0.3]} radius={0.085} color={PAL.hoodie} />
      <Limb from={[0.47, 0.9, -0.3]} to={[0.26, 0.83, -0.02]} radius={0.072} color={PAL.hoodie} />

      {/* hands resting on the deck */}
      <Box size={[0.15, 0.06, 0.17]} radius={0.03} color={PAL.skin} position={[-0.23, 0.835, 0.0]} rotation={[0, 0.3, 0]} />
      <Box size={[0.15, 0.06, 0.17]} radius={0.03} color={PAL.skin} position={[0.23, 0.835, 0.0]} rotation={[0, -0.3, 0]} />

      {/* legs, mostly read as silhouette under the desk */}
      <Limb from={[-0.17, 0.5, -0.66]} to={[-0.18, 0.45, -0.26]} radius={0.1} color={PAL.hoodieDeep} />
      <Limb from={[-0.18, 0.45, -0.26]} to={[-0.18, 0.08, -0.22]} radius={0.085} color={PAL.hoodieDeep} />
      <Limb from={[0.17, 0.5, -0.66]} to={[0.18, 0.45, -0.26]} radius={0.1} color={PAL.hoodieDeep} />
      <Limb from={[0.18, 0.45, -0.26]} to={[0.18, 0.08, -0.22]} radius={0.085} color={PAL.hoodieDeep} />
      <Box size={[0.14, 0.07, 0.24]} radius={0.03} color={PAL.ink} position={[-0.18, 0.045, -0.14]} />
      <Box size={[0.14, 0.07, 0.24]} radius={0.03} color={PAL.ink} position={[0.18, 0.045, -0.14]} />
    </group>
  );
}

/* ── Laptop ───────────────────────────────────────────────────
   Hinge at the far edge; lid tilts back toward the student, so
   the screen light falls on the face rather than at the camera. */
function Laptop() {
  return (
    <group position={[0, 0.795, -0.05]}>
      <Box size={[0.76, 0.026, 0.5]} radius={0.012} color={PAL.metal} position={[0, 0.013, 0]} roughness={0.35} metalness={0.55} />
      {/* keyboard well */}
      <Box size={[0.62, 0.004, 0.3]} radius={0.004} color={PAL.metalDark} position={[0, 0.028, -0.06]} roughness={0.6} />
      <Box size={[0.2, 0.004, 0.12]} radius={0.004} color={PAL.metalDark} position={[0, 0.028, 0.14]} roughness={0.5} />

      <group position={[0, 0.02, 0.25]} rotation={[-0.36, 0, 0]}>
        <Box size={[0.76, 0.48, 0.02]} radius={0.012} color={PAL.metal} position={[0, 0.24, 0]} roughness={0.32} metalness={0.6} />
        <mesh position={[0, 0.24, 0.011]}>
          <circleGeometry args={[0.052, 24]} />
          <meshStandardMaterial color={PAL.metalDark} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* the lit panel, facing the student */}
        <mesh position={[0, 0.24, -0.013]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.68, 0.4]} />
          <meshStandardMaterial
            color={PAL.glow}
            emissive={PAL.glow}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ── Desk lamp — the source of the amber ────────────────────
   An angle-poise at the left of the desk: upright post, arm reaching
   in over the work, shade aimed down at the keyboard. */
function Lamp() {
  return (
    <group position={[-0.86, 0.795, -0.24]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.11, 0.12, 0.026, 24]} />
        <meshStandardMaterial color={PAL.ink} roughness={0.5} />
      </mesh>
      <Box size={[0.028, 0.52, 0.028]} radius={0.012} color={PAL.ink} position={[0, 0.27, 0]} roughness={0.5} />
      {/* arm reaching right, over the desk */}
      <Box
        size={[0.42, 0.028, 0.028]}
        radius={0.012}
        color={PAL.ink}
        position={[0.19, 0.5, 0.035]}
        rotation={[0, -0.18, -0.1]}
      />
      {/* shade: cone apex up, open mouth down over the work */}
      <group position={[0.38, 0.43, 0.07]}>
        <mesh castShadow rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.155, 0.17, 24, 1, true]} />
          <meshStandardMaterial color={PAL.ink} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.078, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.146, 24]} />
          <meshStandardMaterial
            color="#ffd9a8"
            emissive="#ffb066"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ── Desk props ───────────────────────────────────────────── */
function Props() {
  return (
    <group>
      {/* mug */}
      <group position={[0.66, 0.85, 0.12]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.075, 0.068, 0.11, 20]} />
          <meshStandardMaterial color={PAL.paper} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.048, 0]}>
          <circleGeometry args={[0.062, 20]} />
          <meshStandardMaterial color="#6b4630" roughness={0.25} />
        </mesh>
        <mesh position={[0.093, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.042, 0.012, 10, 24, Math.PI]} />
          <meshStandardMaterial color={PAL.paper} roughness={0.4} />
        </mesh>
      </group>

      {/* book stack */}
      <group position={[0.98, 0.8, -0.22]}>
        <Box size={[0.34, 0.045, 0.26]} radius={0.008} color={PAL.amber} position={[0, 0.022, 0]} rotation={[0, 0.12, 0]} />
        <Box size={[0.33, 0.04, 0.25]} radius={0.008} color={PAL.ink} position={[0.01, 0.064, 0]} rotation={[0, -0.08, 0]} />
        <Box size={[0.32, 0.042, 0.24]} radius={0.008} color={PAL.mist} position={[-0.01, 0.105, 0.01]} rotation={[0, 0.05, 0]} />
      </group>

      {/* loose page */}
      <Box size={[0.3, 0.006, 0.22]} radius={0.004} color={PAL.paper} position={[-0.44, 0.798, 0.16]} rotation={[0, 0.34, 0]} roughness={0.9} />

    </group>
  );
}

/* ── The one floating element ─────────────────────────────────
   The screen faces away from camera by design, so the work in
   progress lifts off it as a panel the viewer can actually see. */
function CodePanel() {
  const bars = [0.5, 0.34, 0.42, 0.24, 0.38];
  return (
    <Float speed={1.3} rotationIntensity={0.16} floatIntensity={0.45}>
      {/* rotation-y turns the face toward the camera, compensating for
          the rig's own 0.2 rad offset — otherwise it reads edge-on. */}
      <group position={[1.02, 1.52, 0.46]} rotation={[-0.04, 0.6, 0.03]} scale={0.78}>
        <Box size={[0.64, 0.46, 0.014]} radius={0.026} color={PAL.paper} roughness={0.22} />
        <group position={[-0.24, 0.14, 0.009]}>
          {bars.map((w, i) => (
            <mesh key={i} position={[w / 2, -i * 0.066, 0]}>
              <planeGeometry args={[w, 0.022]} />
              <meshStandardMaterial
                color={i === 0 || i === 3 ? PAL.amber : PAL.mist}
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

/* ── Framing ──────────────────────────────────────────────────
   Holds the viewing angle constant and moves the camera along it until
   the desk fits the viewport, so the scene never crops on a phone. */
const VIEW_DIR = new THREE.Vector3(3.05, 1.03, 3.32).normalize();
const VIEW_TARGET = new THREE.Vector3(0, 0.92, -0.12);

// The media query that stacks the hero in site.css. When it matches, the
// canvas is its own band under the name, so the subject is fitted and
// centred rather than set off to the right of the headline.
const STACKED_QUERY =
  "(max-width: 700px), (max-width: 900px) and (orientation: portrait), (max-height: 500px) and (orientation: landscape)";

// Share of the full frame cut off the top. The subject fills the lower part
// of the frame (hair ~30% down), so the band above it is dropped and the
// canvas is that much shorter. Keep in sync with .hero-stage in site.css.
const CROP_TOP = { wide: 0.275, stacked: 0.25 };

function Frame({ offsetRef }) {
  const camRef = useRef();
  const size = useThree((s) => s.size);

  // size changes on every resize, so this is re-read whenever it matters
  const narrow = size.width < 760 || window.matchMedia(STACKED_QUERY).matches;
  // The camera is fitted to the full frame, then only the band under the
  // crop is rendered, so the student stays the same size on screen.
  const crop = narrow ? CROP_TOP.stacked : CROP_TOP.wide;
  const fullHeight = Math.max(size.height, 1) / (1 - crop);
  const aspect = size.width / fullHeight;
  const fov = narrow ? 40 : 34;

  const position = useMemo(() => {
    const tanV = Math.tan((fov * Math.PI) / 360);
    // Half-extents of the subject, measured from the look target.
    const halfH = 1.05;
    const halfW = 1.2;
    const dist = narrow
      ? Math.max(halfH / tanV, halfW / (tanV * aspect)) * 1.06
      : 4.62;
    return VIEW_DIR.clone().multiplyScalar(dist).add(VIEW_TARGET).toArray();
  }, [fov, narrow, aspect]);

  useLayoutEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    cam.aspect = aspect;
    cam.setViewOffset(
      size.width,
      fullHeight,
      0,
      fullHeight - size.height,
      size.width,
      size.height,
    );
    cam.lookAt(VIEW_TARGET);
    // Centre the subject on narrow screens; on wide ones it sits right of
    // the headline.
    offsetRef.current = narrow ? 0 : 0.34;
  }, [position, narrow, offsetRef, aspect, fullHeight, size.width, size.height]);

  // manual: aspect is the full frame's, set above, not the canvas's.
  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      manual
      fov={fov}
      position={position}
      near={0.1}
      far={60}
    />
  );;
}

/* ── Rig: one orchestrated settle on load, then pointer parallax ── */
function Rig({ children, reduced, offsetRef }) {
  const group = useRef();
  const settle = useRef(0);
  // The canvas sits above the headline with pointer-events disabled, so
  // parallax is tracked on the window rather than through R3F's raycaster.
  const ptr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    // ease 0 → 1 once, on mount
    settle.current = Math.min(settle.current + delta / (reduced ? 0.001 : 1.1), 1);
    const e = 1 - Math.pow(1 - settle.current, 4);

    // +0.2 puts the camera about 32° off the student's eyeline: a 3/4
    // front view, so the screen-lit face reads instead of their back.
    const targetY = reduced ? 0.2 : 0.2 + ptr.current.x * 0.26;
    const targetX = reduced ? 0 : -ptr.current.y * 0.07;

    g.rotation.y += (targetY * e - g.rotation.y) * Math.min(delta * 3, 1);
    g.rotation.x += (targetX * e - g.rotation.x) * Math.min(delta * 3, 1);
    g.position.x += (offsetRef.current - g.position.x) * Math.min(delta * 4, 1);
    g.position.y = 0.06 + (1 - e) * -0.55;
    g.scale.setScalar(0.76 + 0.05 * e);
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ reduced }) {
  const offsetRef = useRef(0.34);
  return (
    <>
      <Frame offsetRef={offsetRef} />
      <ambientLight intensity={0.9} />
      {/* key */}
      <directionalLight
        position={[4.5, 7, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={4}
        shadow-bias={-0.0005}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      {/* cold fill — the room the warm light sits inside */}
      <directionalLight position={[-5, 3, 2]} intensity={0.42} color="#cfe0ff" />
      {/* screen spill onto the face */}
      <pointLight position={[0, 1.06, -0.14]} intensity={3.2} distance={1.9} decay={2} color="#ffb066" />
      {/* lamp pool */}
      <pointLight position={[-0.48, 1.16, -0.17]} intensity={3.6} distance={2.1} decay={2} color="#ff8c33" />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 5, -4]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 2, 3]} scale={[6, 6, 1]} rotation-y={Math.PI / 3} />
        <Lightformer form="rect" intensity={1.4} position={[5, 3, 3]} scale={[6, 6, 1]} rotation-y={-Math.PI / 3} />
      </Environment>

      <Rig reduced={reduced} offsetRef={offsetRef}>
        <Desk />
        <Chair />
        <Student />
        <Laptop />
        <Lamp />
        <Props />
        <CodePanel />

        {/* Shadow-only floor. An opaque plane would hide the headline set
            behind the render; this catches the key light and nothing else. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial transparent opacity={0.1} color="#151b24" />
        </mesh>

        <ContactShadows
          position={[0, 0.014, 0]}
          opacity={0.22}
          scale={9}
          blur={2.6}
          far={3}
          resolution={512}
          color="#151b24"
        />
      </Rig>
    </>
  );
}

/* Mounts only once everything inside the scene's Suspense has resolved. */
function Ready({ onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function DeskScene({ onReady }) {
  const [failed, setFailed] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (failed) return <div className="scene-fallback" aria-hidden="true" />;

  return (
    <Canvas
      className="scene-canvas"
      shadows="soft"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      camera={{ position: [3.05, 1.95, 3.2], fov: 34 }}
      onError={() => {
        setFailed(true);
        onReady?.();
      }}
    >
      <Suspense fallback={null}>
        <Scene reduced={reduced} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
