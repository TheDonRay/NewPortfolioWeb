import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import StudentDeskScene from "./StudentDeskScene.jsx";
import { sceneState } from "./sceneState.js";
import "../styles/scene.css";

/**
 * Mounts the 3D scene once, behind everything, for the life of the session.
 *
 * Keeping a single canvas alive across routes is what lets the camera move
 * between pages instead of cutting; React Router swaps the copy on top while
 * the rig glides to the next framing.
 */
export default function SceneLayer({ route }) {
  const layerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const supported = useMemo(() => hasWebGL(), []);

  /* pointer, scroll and reduced-motion all feed the scene through module state */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => (sceneState.reducedMotion = mq.matches);
    applyMotion();
    mq.addEventListener("change", applyMotion);

    const onPointer = (e) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sceneState.scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    const onVisibility = () => setPaused(document.hidden);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();

    return () => {
      mq.removeEventListener("change", applyMotion);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* a route change resets scroll progress before the new page reports its own */
  useEffect(() => {
    sceneState.scroll = 0;
  }, [route]);

  if (!supported) return <SceneFallback />;

  return (
    <SceneBoundary fallback={<SceneFallback />}>
      <div className="scene-layer" ref={layerRef} aria-hidden="true">
        <Canvas
          frameloop={paused ? "never" : "always"}
          dpr={[1, 1.75]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          camera={{ fov: 46, near: 0.05, far: 12, position: [-1.55, 1.05, 2.25] }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.35;
          }}
        >
          <StudentDeskScene route={route} layerRef={layerRef} />
          <AdaptiveDpr pixelated />
          <Preload all />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}

/** No WebGL (or the context died): a still, lit desk in pure CSS. */
function SceneFallback() {
  return <div className="scene-fallback" aria-hidden="true" />;
}

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("3D scene disabled:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
