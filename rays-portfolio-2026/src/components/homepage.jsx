import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "../styles/homepage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <div className="home-content">
        <motion.p
          className="home-greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Hello, I'm
        </motion.p>

        <motion.h1
          className="home-name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Rayat Chowdhury
        </motion.h1>

        <motion.p
          className="home-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Software Engineer & Node.js Enthusiast
        </motion.p>

        <motion.p
          className="home-bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          I build with passion. Whether it’s exploring new ideas, debugging
          complex problems, or learning something new, building is my escape.
        </motion.p>

        <motion.div
          className="home-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className="btn btn-primary"
            onClick={() => navigate("/AboutMe")}
          >
            About Me
            <ArrowRight size={16} />
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/ContactMe")}
          >
            Get in Touch
          </button>
        </motion.div>

        <motion.div
          className="home-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="https://github.com/TheDonRay"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="link-dot" />
          <a
            href="https://www.linkedin.com/in/rayatchowdhury2005/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <span className="link-dot" />
          <a href="mailto:rayatchowdhury2005@gmail.com">Email</a>
        </motion.div>
      </div>

      {/* Decorative line */}
      <div className="home-line" />
    </main>
  );
}
