import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/navigation.css";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/AboutMe", label: "About" },
    { path: "/ContactMe", label: "Contact" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate("/")}>
          RC
        </button>

        <div className="nav-links">
          {navItems.map(({ path, label }) => (
            <button
              key={path}
              className={`nav-link ${location.pathname === path ? "active" : ""}`}
              onClick={() => navigate(path)}
            >
              {label}
              {location.pathname === path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <a href="/resume.pdf" target="_blank" className="nav-resume">
          Resume
        </a>
      </div>
    </nav>
  );
}
