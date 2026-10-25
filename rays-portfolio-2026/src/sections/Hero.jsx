import { ArrowDown } from "lucide-react";
import SignalField from "../components/SignalField.jsx";
import { profile, education } from "../data/content";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <SignalField className="hero-field" />

      <div className="hero-inner rail">
        {/* The name split across the frame, caption tucked under the first line */}
        <div className="hero-title">
          <h1 className="hero-name">
            <span className="hero-line hero-line--first">
              <span>{profile.first}</span>
            </span>
            <span className="hero-line hero-line--last">
              <span>{profile.last}</span>
            </span>
          </h1>
          <p className="hero-role">
            {profile.role}, {profile.location}.
            <br />
            {education.school}, class of {education.graduation.split(" ")[1]}.
          </p>
        </div>

        <div className="hero-foot">
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a className="pill pill--solid" href="#projects">
              See my work
            </a>
            <a
              className="pill"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read my resume
            </a>
          </div>
        </div>
      </div>

      <a className="hero-cue" href="#about" aria-label="Scroll to About">
        <ArrowDown size={16} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </header>
  );
}
