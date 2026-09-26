import { lazy, Suspense, useEffect, useState } from "react";
import { profile } from "../data/content";

const DeskScene = lazy(() => import("../three/DeskScene.jsx"));

// If the scene is slow (or never arrives), don't hold the intro hostage.
const READY_FALLBACK_MS = 2500;

export default function Hero() {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSceneReady(true), READY_FALLBACK_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="hero" id="top">
      {/* Name, then render, stacked in flow on the same rail as the intro. */}
      <div className="hero-scene rail">
        <h1 className="hero-name">
          <span>{profile.first}</span>
          <span>{profile.last}</span>
        </h1>

        <div className="hero-stage">
          <Suspense fallback={null}>
            <DeskScene onReady={() => setSceneReady(true)} />
          </Suspense>
        </div>
      </div>

      <div className={`hero-foot${sceneReady ? " is-ready" : ""}`}>
        <div className="rail">
          <div className="hero-foot-inner">
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="#projects">
                See my work
              </a>
              <a
                className="btn btn-line"
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read my resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
