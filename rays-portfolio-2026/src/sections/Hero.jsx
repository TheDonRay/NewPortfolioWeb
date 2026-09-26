import { lazy, Suspense } from "react";
import { profile } from "../data/content";

const DeskScene = lazy(() => import("../three/DeskScene.jsx"));

export default function Hero() {
  return (
    <header className="hero" id="top">
      {/* The name is set behind the render; the desk and the student
          occlude it, which is the whole point of the composition. */}
      <h1 className="hero-name">
        <span>{profile.first}</span>
        <span>{profile.last}</span>
      </h1>

      <div className="hero-stage">
        <Suspense fallback={null}>
          <DeskScene />
        </Suspense>
      </div>

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
          </div>
        </div>
      </div>
    </header>
  );
}
