import { useEffect, useState } from "react";
import { profile, sections } from "../data/content";

const items = sections.filter((s) => s.id !== "top");

export default function Nav() {
  const [active, setActive] = useState("top");
  const [lifted, setLifted] = useState(false);

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

  return (
    <nav className={`nav${lifted ? " is-lifted" : ""}`} aria-label="Sections">
      <div className="nav-inner">
        <a className="nav-mark" href="#top" aria-label="Back to top">
          {profile.first[0]}
          {profile.last[0]}
        </a>

        <ul className="nav-list">
          {items.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? "is-active" : undefined}
                aria-current={active === id ? "true" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          className="nav-resume"
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
        >
          Résumé
        </a>
      </div>
    </nav>
  );
}
