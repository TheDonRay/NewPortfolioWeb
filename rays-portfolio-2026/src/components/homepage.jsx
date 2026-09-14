import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prefetchRoute } from "../lib/routes.js";
import "../styles/homepage.css";

/* ─── Laptop Scene ───────────────────────────────────────────── */
function LaptopScene() {
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState("off");

  useEffect(() => {
    if (reduced) return;
    const t1 = setTimeout(() => setBooted("powering"), 750);
    const t2 = setTimeout(() => setBooted("loading"),  1550);
    const t3 = setTimeout(() => setBooted("ready"),    3900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [reduced]);

  // Reduced motion skips the boot theatre and lands on the finished screen.
  const stage = reduced ? "ready" : booted;

  return (
    <div className="lp-scene">
      <div className="lp">

        {/* ── LID ── */}
        <div className="lp-lid">
          <div className="lp-camera" aria-hidden="true" />
          <div className="lp-bezel">
            <div className={`lp-display lp-display--${stage}`}>

              {/* always-on scanlines */}
              <div className="lp-scanlines" aria-hidden="true" />

              {/* inner ambient glow */}
              <div className="lp-inner-glow" aria-hidden="true" />

              {/* BOOT stage */}
              <div className={`lp-boot${stage === "loading" ? " is-on" : ""}`} aria-hidden={stage !== "loading"}>
                <div className="lp-boot-header">
                  <span className="lp-boot-os">RAYAT OS</span>
                  <span className="lp-boot-ver">v2026.1</span>
                </div>
                <p className="lp-boot-status">INITIALIZING SYSTEM...</p>
                <div className="lp-bar-track">
                  <div className="lp-bar-fill" />
                </div>
                <div className="lp-boot-log">
                  <span>Loading kernel modules...</span>
                  <span>Mounting filesystem...</span>
                  <span>Starting runtime services...</span>
                  <span>System ready.</span>
                </div>
              </div>

              {/* READY stage */}
              <div className={`lp-ready${stage === "ready" ? " is-on" : ""}`}>
                <p className="lp-ready-eyebrow">
                  <span className="lp-ready-dot" aria-hidden="true" />
                  SYSTEM ONLINE
                </p>
                <h1 className="lp-ready-name">Rayat Chowdhury</h1>
                <p className="lp-ready-role">Software Engineer</p>
                <div className="lp-ready-hr" aria-hidden="true" />
                <p className="lp-ready-terminal">
                  <span className="lp-prompt">~/rayat</span>
                  <span className="lp-cursor" aria-hidden="true">▋</span>
                </p>
              </div>

            </div>
          </div>
          {/* screen glow bloom */}
          <div
            className={`lp-bloom${stage === "loading" || stage === "ready" ? " is-on" : ""}`}
            aria-hidden="true"
          />
        </div>

        {/* ── HINGE ── */}
        <div className="lp-hinge" aria-hidden="true" />

        {/* ── BASE ── */}
        <div className="lp-base" aria-hidden="true">
          <div className="lp-keys" />
          <div className="lp-pad" />
        </div>
      </div>

      {/* floor reflection */}
      <div
        className={`lp-floor${stage === "ready" ? " is-on" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}

/* ─── Floating shapes ────────────────────────────────────────── */
const FloatingShape = ({ className, delay = 0, duration = 9, still = false }) =>
  still ? (
    <div className={`shape ${className}`} />
  ) : (
    <motion.div
      className={`shape ${className}`}
      animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );

const fadeUp = (i) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
});

/* ─── HomePage ───────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const heroRef  = useRef(null);
  const reduced  = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 48, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 48, damping: 18 });

  const glowX    = useTransform(springX, [-1, 1], ["-18%", "18%"]);
  const glowY    = useTransform(springY, [-1, 1], ["-12%", "12%"]);
  const contentX = useTransform(springX, [-1, 1], [-6, 6]);
  const contentY = useTransform(springY, [-1, 1], [-3, 3]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduced) return;
    // Pointer parallax is a mouse affordance: a touch device can never drive
    // it, so binding the listener there is pure battery and main-thread cost.
    if (!window.matchMedia?.("(pointer: fine)").matches) return;

    let frame = 0;
    let next = null;
    const apply = () => {
      frame = 0;
      if (!next) return;
      rawX.set(next.x);
      rawY.set(next.y);
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      next = {
        x: (e.clientX - (r.left + r.width / 2)) / (r.width / 2),
        y: (e.clientY - (r.top + r.height / 2)) / (r.height / 2),
      };
      // Coalesce to one update per frame — mousemove fires far faster than paint.
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const leave = () => { next = null; rawX.set(0); rawY.set(0); };

    el.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", leave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [rawX, rawY, reduced]);

  return (
    <main className="home" ref={heroRef}>
      <motion.div className="home-spotlight" style={{ x: glowX, y: glowY }} />

      <div className="home-shapes" aria-hidden="true">
        <FloatingShape className="shape-circle-lg" delay={0}   duration={10} still={reduced} />
        <FloatingShape className="shape-circle-sm" delay={2.5} duration={8}  still={reduced} />
        <FloatingShape className="shape-square"    delay={4}   duration={11} still={reduced} />
        <FloatingShape className="shape-ring"      delay={1.5} duration={13} still={reduced} />
      </div>

      <div className="home-grid" aria-hidden="true" />

      <motion.div className="home-content" style={{ x: contentX, y: contentY }}>

        <motion.p className="home-greeting" {...fadeUp(0)}>
          Hello, I'm
        </motion.p>

        {/* 3-D Laptop */}
        <motion.div
          className="home-laptop-wrap"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          <LaptopScene />
        </motion.div>

        <motion.p className="home-bio" {...fadeUp(3)}>
        Building is my escape. Im Rayat, CS + Math @ Hunter College.

        </motion.p>
        <motion.div className="home-buttons" {...fadeUp(4)}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/BookCall")}
            onMouseEnter={() => prefetchRoute("/BookCall")}
            onTouchStart={() => prefetchRoute("/BookCall")}
          >
            <CalendarClock size={15} /> Book a 30-Min Call
          </button>
          <div className="home-buttons-sub">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/AboutMe")}
              onMouseEnter={() => prefetchRoute("/AboutMe")}
              onTouchStart={() => prefetchRoute("/AboutMe")}
            >
              About Me <ArrowRight size={15} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/ContactMe")}
              onMouseEnter={() => prefetchRoute("/ContactMe")}
              onTouchStart={() => prefetchRoute("/ContactMe")}
            >
              Get in Touch
            </button>
          </div>
        </motion.div>

        <motion.div className="home-links" {...fadeUp(5)}>
          <a href="https://github.com/TheDonRay" target="_blank" rel="noopener noreferrer" className="home-link">GitHub</a>
          <span className="link-sep" />
          <a href="https://www.linkedin.com/in/rayatchowdhury2005/" target="_blank" rel="noopener noreferrer" className="home-link">LinkedIn</a>
          <span className="link-sep" />
          <a href="mailto:rayatchowdhury2005@gmail.com" className="home-link">Email</a>
        </motion.div>

      </motion.div>

      <motion.div
        className="home-scroll-line"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
      />
    </main>
  );
}
