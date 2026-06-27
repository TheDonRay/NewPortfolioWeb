import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/navigation.css";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { path: "/",         label: "Home"    },
    { path: "/AboutMe",  label: "About"   },
    { path: "/ContactMe",label: "Contact" },
  ];

  return (
    <motion.nav
      className={`nav${scrolled ? " nav--scrolled" : ""}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate("/")}>
          <span className="nav-logo-text">RC</span>
        </button>

        <div className="nav-links">
          {navItems.map(({ path, label }) => (
            <button
              key={path}
              className={`nav-link${location.pathname === path ? " active" : ""}`}
              onClick={() => navigate(path)}
            >
              {label}
              {location.pathname === path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-resume">
          Resume
        </a>
      </div>
    </motion.nav>
  );
}
