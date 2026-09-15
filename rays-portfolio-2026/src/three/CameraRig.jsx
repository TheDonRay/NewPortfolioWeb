import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState.js";

/**
 * Every camera move in the site goes through here.
 *
 * Each route names a framing; the rig damps position, aim, focal length, lens
 * shift and layer opacity toward it, so navigating between pages reads as one
 * continuous camera move rather than three separate scenes. Pointer parallax
 * and scroll drift are added on top of whatever the route asked for.
 */

/* shift / shiftY: fraction of the viewport the subject is nudged right of and
   below centre. On narrow screens the copy stacks on top of the scene, so the
   mobile framings push the subject down out from behind the text. */
const DESKTOP = {
  /* Home: over the open lid, so the display — and what he is typing into it —
     reads, with his head and hands framing it. */
  "/": {
    pos: [-1.56, 1.12, 2.48],
    look: [0.0, 0.13, 0.22],
    fov: 24,
    shift: 0.17,
    opacity: 1,
  },
  /* About: the camera orbits round to his left and holds well back — this page
     is dense with copy, so the scene has to stay a backdrop. */
  "/AboutMe": {
    pos: [-2.85, 1.15, 1.75],
    look: [0.0, 0.08, 0.32],
    fov: 22,
    shift: 0.12,
    opacity: 0.26,
  },
  /* Contact: all the way out to a wide, cold silhouette of the whole desk. */
  "/ContactMe": {
    pos: [1.95, 1.28, 2.95],
    look: [0.0, 0.0, 0.12],
    fov: 30,
    shift: 0.08,
    opacity: 0.34,
  },
};

const MOBILE = {
  "/": {
    pos: [-1.4, 1.0, 2.6],
    look: [0.0, 0.12, 0.22],
    fov: 30,
    shift: 0,
    shiftY: 0.26,
    opacity: 0.6,
  },
  "/AboutMe": {
    pos: [-2.9, 1.2, 1.95],
    look: [0.0, 0.08, 0.32],
    fov: 26,
    shift: 0,
    opacity: 0.18,
  },
  "/ContactMe": {
    pos: [1.95, 1.28, 3.2],
    look: [0.0, 0.0, 0.12],
    fov: 34,
    shift: 0,
    opacity: 0.26,
  },
};

/* Where the camera flies in from on first load. */
const INTRO_POS = [-2.35, 1.75, 3.6];
const INTRO_FOV = 32;

export default function CameraRig({ route, layerRef }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const state = useRef({
    pos: new THREE.Vector3(...INTRO_POS),
    look: new THREE.Vector3(0, 0.08, 0.14),
    fov: INTRO_FOV,
    shift: 0,
    shiftY: 0,
    opacity: 0,
    parallaxX: 0,
    parallaxY: 0,
    intro: 0,
    ready: false,
  });

  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const s = state.current;
    const mobile = size.width < 900;
    const table = mobile ? MOBILE : DESKTOP;
    const frame = table[route] ?? table["/"];

    if (!s.ready) {
      s.ready = true;
      camera.position.copy(s.pos);
    }

    // The intro eases the damping in, so the first move is a slow push rather
    // than a snap, and every later route change is crisp.
    s.intro = Math.min(1, s.intro + d * 0.5);
    const ease = 0.9 + easeInOut(s.intro) * 2.0;

    tmpPos.current.set(...frame.pos);
    tmpLook.current.set(...frame.look);

    // Long pages drift the camera as you scroll — depth without a scroll-jack.
    if (route !== "/") {
      tmpPos.current.y += sceneState.scroll * 0.34;
      tmpPos.current.z += sceneState.scroll * 0.22;
    }

    damp3(s.pos, tmpPos.current, ease, d);
    damp3(s.look, tmpLook.current, ease, d);

    s.fov = THREE.MathUtils.damp(s.fov, frame.fov, ease, d);
    s.shift = THREE.MathUtils.damp(s.shift, frame.shift, ease, d);
    s.shiftY = THREE.MathUtils.damp(s.shiftY, frame.shiftY ?? 0, ease, d);
    s.opacity = THREE.MathUtils.damp(s.opacity, frame.opacity, ease * 1.3, d);

    // pointer parallax, damped separately so it stays loose and slow
    const px = sceneState.reducedMotion ? 0 : sceneState.pointerX;
    const py = sceneState.reducedMotion ? 0 : sceneState.pointerY;
    s.parallaxX = THREE.MathUtils.damp(s.parallaxX, px, 1.8, d);
    s.parallaxY = THREE.MathUtils.damp(s.parallaxY, py, 1.8, d);

    camera.position.set(
      s.pos.x + s.parallaxX * 0.1,
      s.pos.y - s.parallaxY * 0.06,
      s.pos.z + Math.abs(s.parallaxX) * 0.015,
    );
    camera.lookAt(
      s.look.x + s.parallaxX * 0.022,
      s.look.y - s.parallaxY * 0.014,
      s.look.z,
    );

    // Lens shift keeps the subject clear of the copy without swinging the
    // camera off its framing.
    const offX = -s.shift * size.width;
    const offY = -s.shiftY * size.height;
    camera.fov = s.fov;
    camera.setViewOffset(
      size.width,
      size.height,
      offX,
      offY,
      size.width,
      size.height,
    );

    if (layerRef?.current) {
      layerRef.current.style.opacity = s.opacity.toFixed(3);
    }
  });

  return null;
}

function damp3(current, target, lambda, dt) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, dt);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, dt);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, dt);
}

function easeInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
