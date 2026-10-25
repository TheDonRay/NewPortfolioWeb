import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useGithubProjects from "../hooks/useGithubProjects";

// How far (px) a swipe has to travel before it counts as a slide change
const SWIPE = 60;
const MotionArticle = motion.article;

// Swipe only on touch; with a mouse, dragging would fight text selection
const touch =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

export default function Projects() {
  const projects = useGithubProjects();
  const reduce = useReducedMotion();
  const [[index, dir], setSlide] = useState([0, 0]);

  const count = projects.length;
  // The list can shrink when live data replaces the curated fallback
  const i = count ? index % count : 0;
  const p = projects[i];

  const go = (step) => setSlide([(i + step + count) % count, step]);
  const jump = (to) => setSlide([to, to > i ? 1 : -1]);

  const onKey = (e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const shift = reduce ? 0 : 48;
  const variants = {
    enter: (d) => ({ opacity: 0, x: d * shift }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -shift }),
  };

  return (
    <section className="section projects" id="projects">
      <div className="rail">
        <div className="section-head">
          <h2>Projects</h2>
          <p className="aside">Things I built end to end</p>
        </div>

        {p && (
          <div
            className="project-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Projects"
            tabIndex={0}
            onKeyDown={onKey}
          >
            {/* Above the card so the controls never move when slide height changes */}
            {count > 1 && (
              <div className="project-controls">
                <div className="project-dots">
                  {projects.map((proj, n) => (
                    <button
                      type="button"
                      key={proj.name}
                      className="project-dot"
                      aria-current={n === i}
                      aria-label={`Show ${proj.name}`}
                      onClick={() => jump(n)}
                    />
                  ))}
                </div>

                <div className="project-arrows">
                  <button
                    type="button"
                    className="project-arrow"
                    onClick={() => go(-1)}
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="project-arrow"
                    onClick={() => go(1)}
                    aria-label="Next project"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            <div className="project-viewport" aria-live="polite">
              <AnimatePresence initial={false} custom={dir} mode="wait">
                <MotionArticle
                  className="project"
                  key={p.name}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  drag={touch && count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -SWIPE) go(1);
                    else if (info.offset.x > SWIPE) go(-1);
                  }}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                >
                  <div className="project-top">
                    <h3 className="project-name">{p.name}</h3>
                    <div className="project-links">
                      {p.homepage && (
                        <a
                          className="project-link"
                          href={p.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live site
                        </a>
                      )}
                      <a
                        className="project-link"
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on GitHub
                      </a>
                    </div>
                  </div>

                  {p.blurb && <p className="project-blurb">{p.blurb}</p>}

                  {p.points.length > 0 && (
                    <ul className="project-points">
                      {p.points.map((pt, n) => (
                        <li key={n}>{pt}</li>
                      ))}
                    </ul>
                  )}

                  {p.stack.length > 0 && (
                    <ul className="project-stack">
                      {p.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                </MotionArticle>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
