import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Desk from "./Desk.jsx";
import Laptop from "./Laptop.jsx";
import Student from "./Student.jsx";
import CameraRig from "./CameraRig.jsx";
import { sceneState } from "./sceneState.js";

/**
 * The scene itself: one student, one desk, one laptop, and the display doing
 * all the lighting work. Everything is positioned against a desk surface at
 * y = 0 with the laptop at the origin.
 */
export default function StudentDeskScene({ route, layerRef }) {
  const [started, setStarted] = useState(false);
  const root = useRef();

  // Hold the boot sequence until the first frame has actually rendered, so a
  // slow first paint never eats the opening beat.
  useFrame(() => {
    if (!started) setStarted(true);
  });

  return (
    <>
      <CameraRig route={route} layerRef={layerRef} />

      <fog attach="fog" args={["#000000", 2.8, 7.2]} />

      <ambientLight intensity={0.3} color="#8e9bba" />
      <hemisphereLight args={["#1e2740", "#06070b", 0.55]} />

      {/* cool rim from behind, the only thing separating hair from black */}
      <directionalLight
        position={[-1.9, 1.6, -1.35]}
        intensity={1.5}
        color="#b6c3e0"
      />
      {/* second edge from the far side so the silhouette reads on both sides */}
      <directionalLight
        position={[2.2, 1.3, -1.1]}
        intensity={0.75}
        color="#93a3c9"
      />
      {/* barely-there fill so the near shoulder does not go solid */}
      <directionalLight position={[1.7, 0.6, 1.8]} intensity={0.32} color="#ffffff" />

      <group ref={root}>
        <Desk />
        <Laptop started={started} />
        <Student />
        <ScreenSpill />
      </group>

      <ContactShadows
        position={[0, 0.003, -0.05]}
        scale={2.1}
        blur={2.4}
        far={0.5}
        opacity={0.75}
        resolution={512}
        frames={1}
      />
    </>
  );
}

/**
 * A soft pool of light thrown onto the desk in front of the laptop. It is a
 * plane rather than a light because a light cannot make that hard-edged
 * trapezoid the screen actually casts.
 */
function ScreenSpill() {
  const mat = useRef();

  useFrame(() => {
    if (!mat.current) return;
    mat.current.opacity = sceneState.glow * 0.09;
  });

  return (
    <mesh position={[0, 0.0022, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.34, 32]} />
      <meshBasicMaterial
        ref={mat}
        color="#9db4e6"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
