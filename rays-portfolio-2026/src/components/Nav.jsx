import { useEffect, useRef, useState } from "react";
import { profile, sections } from "../data/content";

const items = sections.filter((s) => s.id !== "top");
// "Book a call" lives in the pill on wide screens, not the link row
const rowItems = items.filter((s) => s.id !== "book");

export default function Nav() {
  const [active, setActive] = useState("top");
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Derived from scroll position rather than IntersectionObserver: an
  // observer only reports the sections whose visibility changed in that
  // batch, which leaves the wrong item lit after a jump to an anchor.
  useEffect(() => {
    let frame = 0;

    const pick = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0].id;

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      }

      // the last section can never reach the line at the end of the page
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The phone menu covers the page: lock scroll, close on Escape or on
  // growing past the breakpoint, and hand focus back to the toggle.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    menuRef.current?.querySelector("a")?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 900px)");
    const onWide = (e) => e.matches && setOpen(false);

    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const link = (id) => ({
    href: `#${id}`,
    className: active === id ? "is-active" : undefined,
    "aria-current": active === id ? "true" : undefined,
  });

  return (
    <nav
      className={`nav${lifted ? " is-lifted" : ""}${open ? " is-open" : ""}`}
      aria-label="Sections"
    >
      <div className="nav-inner">
        <a className="nav-mark" href="#top" aria-label="Back to top">
          <span className="nav-monogram" aria-hidden="true">
            {profile.first[0]}
            {profile.last[0]}
          </span>
          <span className="nav-name">{profile.name}</span>
        </a>

        <ul className="nav-list">
          {rowItems.map(({ id, label }) => (
            <li key={id}>
              <a {...link(id)}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-end">
          <a
            className="nav-resume"
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            className={`pill nav-book${active === "book" ? " is-active" : ""}`}
            href="#book"
            aria-current={active === "book" ? "true" : undefined}
          >
            <span className="dot" aria-hidden="true" />
            Book a call
          </a>
          <button
            type="button"
            ref={toggleRef}
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav-toggle-bars" aria-hidden="true" />
            <span className="nav-toggle-label">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      <div
        id="nav-menu"
        className="nav-menu"
        ref={menuRef}
        hidden={!open}
      >
        <ul>
          {items.map(({ id, label }) => (
            <li key={id}>
              <a {...link(id)} onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-menu-foot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
