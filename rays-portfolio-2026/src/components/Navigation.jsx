import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, Menu, X } from "lucide-react";
import { prefetchRoute } from "../lib/routes.js";
import "../styles/navigation.css";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/AboutMe", label: "About" },
  { path: "/ContactMe", label: "Contact" },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    // rAF-throttled so scrolling never queues more work than it can paint.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet whenever the route changes — including on browser
  // back/forward. Adjusting during render (rather than in an effect) means
  // the sheet never paints once against the new page.
  const [renderedPath, setRenderedPath] = useState(location.pathname);
  if (renderedPath !== location.pathname) {
    setRenderedPath(location.pathname);
    setMenuOpen(false);
  }

  // While the sheet is open: lock the page, close on Escape or outside tap.
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e) => {
      if (panelRef.current?.contains(e.target) || toggleRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const go = useCallback(
    (path) => {
      setMenuOpen(false);
      if (location.pathname !== path) navigate(path);
    },
    [location.pathname, navigate],
  );

  /** Warm the chunk on intent so the click itself never waits. */
  const warm = (path) => ({
    onMouseEnter: () => prefetchRoute(path),
    onFocus: () => prefetchRoute(path),
    onTouchStart: () => prefetchRoute(path),
  });

  return (
    <motion.nav
      className={`nav${scrolled ? " nav--scrolled" : ""}`}
      initial={reduced ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => go("/")} aria-label="Home">
          <span className="nav-logo-text">RC</span>
        </button>

        <div className="nav-links">
          {NAV_ITEMS.map(({ path, label }) => (
            <button
              key={path}
              className={`nav-link${location.pathname === path ? " active" : ""}`}
              onClick={() => go(path)}
              {...warm(path)}
            >
              {label}
              {location.pathname === path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                />
              )}
            </button>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link--out"
          >
            Resume
          </a>
        </div>

        <div className="nav-right">
          <button
            className={`nav-cta${location.pathname === "/BookCall" ? " active" : ""}`}
            onClick={() => go("/BookCall")}
            {...warm("/BookCall")}
          >
            <CalendarClock size={13} />
            <span className="nav-cta-full">Book a Call</span>
            <span className="nav-cta-short">Book</span>
          </button>

          <button
            ref={toggleRef}
            className="nav-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-sheet"
            ref={panelRef}
            className="nav-sheet"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_ITEMS.map(({ path, label }) => (
              <button
                key={path}
                className={`nav-sheet-link${location.pathname === path ? " active" : ""}`}
                onClick={() => go(path)}
                {...warm(path)}
              >
                {label}
              </button>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-sheet-link"
              onClick={() => setMenuOpen(false)}
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
