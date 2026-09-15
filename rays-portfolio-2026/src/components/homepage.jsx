import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "../styles/homepage.css";

const fadeUp = (i) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.15 + i * 0.09, duration: 0.55, ease: [0.4, 0, 0.2, 1] },
});

/**
 * The hero is deliberately only half the page: the right-hand column is left
 * empty so the persistent 3D scene (the student at his desk, mounted in App)
 * has somewhere to sit without fighting the copy.
 */
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <div className="home-spotlight" aria-hidden="true" />
      <div className="home-grid" aria-hidden="true" />

      <div className="home-inner">
        <div className="home-content">
          <motion.p className="home-greeting" {...fadeUp(0)}>
            Hello, I'm
          </motion.p>

          <motion.h1 className="home-name" {...fadeUp(1)}>
            Rayat Chowdhury
          </motion.h1>

          <motion.p className="home-role" {...fadeUp(2)}>
            Software Engineer
          </motion.p>

          <motion.p className="home-bio" {...fadeUp(3)}>
            Building is my escape. CS&nbsp;+&nbsp;Math @ Hunter College, and
            most evenings you'll find me exactly like this — heads down, mid
            keystroke.
          </motion.p>

          <motion.div className="home-buttons" {...fadeUp(4)}>
            <button className="btn btn-primary" onClick={() => navigate("/AboutMe")}>
              About Me <ArrowRight size={15} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/ContactMe")}
            >
              Get in Touch
            </button>
          </motion.div>

          <motion.div className="home-links" {...fadeUp(5)}>
            <a
              href="https://github.com/TheDonRay"
              target="_blank"
              rel="noopener noreferrer"
              className="home-link"
            >
              GitHub
            </a>
            <span className="link-sep" />
            <a
              href="https://www.linkedin.com/in/rayatchowdhury2005/"
              target="_blank"
              rel="noopener noreferrer"
              className="home-link"
            >
              LinkedIn
            </a>
            <span className="link-sep" />
            <a href="mailto:rayatchowdhury2005@gmail.com" className="home-link">
              Email
            </a>
          </motion.div>
        </div>

        {/* Reserved room for the 3D scene. Empty by design — the canvas behind
            the page draws into this space. */}
        <div className="home-stage" aria-hidden="true" />
      </div>

      <motion.div
        className="home-scroll-line"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
      />
    </main>
  );
}
