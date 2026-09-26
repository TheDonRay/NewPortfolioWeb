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
      {/* The render gets its own block; nothing but the name shares it. */}
      <div className="hero-scene">
        {/* The name is set behind the render; the desk and the student
            occlude it, which is the whole point of the composition. */}
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

<<<<<<< HEAD
      <div className="hero-foot">
        <div className="rail hero-foot-inner">
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
=======
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
                Read my résumé
              </a>
            </div>
>>>>>>> 181ac2ca8cbe6578794fec0bdb70c47950263b46
          </div>
        </div>
      </div>
    </header>
  );
}
