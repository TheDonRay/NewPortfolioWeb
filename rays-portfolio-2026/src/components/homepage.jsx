import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "../styles/homepage.css";

/* ─── Laptop Scene ───────────────────────────────────────────── */
function LaptopScene() {
  const [stage, setStage] = useState("off");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("powering"), 750);
    const t2 = setTimeout(() => setStage("loading"),  1550);
    const t3 = setTimeout(() => setStage("ready"),    3900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

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
const FloatingShape = ({ className, delay = 0, duration = 9 }) => (
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
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      rawX.set((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2));
      rawY.set((e.clientY - (r.top  + r.height / 2)) / (r.height / 2));
    };
    const leave = () => { rawX.set(0); rawY.set(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [rawX, rawY]);

  return (
    <main className="home" ref={heroRef}>
      <motion.div className="home-spotlight" style={{ x: glowX, y: glowY }} />

      <div className="home-shapes" aria-hidden="true">
        <FloatingShape className="shape-circle-lg" delay={0}   duration={10} />
        <FloatingShape className="shape-circle-sm" delay={2.5} duration={8}  />
        <FloatingShape className="shape-square"    delay={4}   duration={11} />
        <FloatingShape className="shape-ring"      delay={1.5} duration={13} />
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
          <button className="btn btn-primary" onClick={() => navigate("/AboutMe")}>
            About Me <ArrowRight size={15} />
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/ContactMe")}>
            Get in Touch
          </button>
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
