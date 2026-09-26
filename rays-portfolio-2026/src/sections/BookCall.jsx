import { useEffect, useRef, useState } from "react";
import { profile } from "../data/content";

const NAMESPACE = "book-call";
const EMBED_SRC = "https://app.cal.com/embed/embed.js";

// Cal.com's own loader snippet: queues calls on window.Cal until embed.js
// arrives, and only injects the script once however often it runs.
function loadCal() {
  const w = window;
  if (w.Cal) return w.Cal;
  const push = (api, args) => api.q.push(args);
  w.Cal = function () {
    const cal = w.Cal;
    const args = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      document.head.appendChild(document.createElement("script")).src =
        EMBED_SRC;
      cal.loaded = true;
    }
    if (args[0] === "init") {
      const api = function () {
        push(api, arguments);
      };
      const ns = args[1];
      api.q = api.q || [];
      if (typeof ns === "string") {
        cal.ns[ns] = cal.ns[ns] || api;
        push(cal.ns[ns], args);
        push(cal, ["initNamespace", ns]);
      } else push(cal, args);
      return;
    }
    push(cal, args);
  };
  return w.Cal;
}

export default function BookCall() {
  const sectionRef = useRef(null);
  const [near, setNear] = useState(false);

  // The embed is a heavy iframe; wait until the section is close to the
  // viewport so it never competes with the 3D hero on first paint.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    const Cal = loadCal();
    // StrictMode runs effects twice; one inline embed is enough.
    if (Cal.ns?.[NAMESPACE]) return;
    Cal("init", NAMESPACE, { origin: "https://app.cal.com" });
    Cal.ns[NAMESPACE]("inline", {
      elementOrSelector: "#cal-inline",
      calLink: profile.calLink,
      config: { layout: "month_view", theme: "light" },
    });
    Cal.ns[NAMESPACE]("ui", {
      theme: "light",
      cssVarsPerTheme: { light: { "cal-brand": "#ff6a1a" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, [near]);

  const bookingUrl = `https://cal.com/${profile.calLink}`;

  return (
    <section className="section book" id="book" ref={sectionRef}>
      <div className="rail">
        <div className="section-head">
          <h2>Book a call</h2>
          <p className="aside">30 minutes, on me</p>
        </div>

        <p className="book-sub">
          Want to talk about a role, a project, or just trade backend war
          stories? Grab a 30-minute slot below and it lands straight on my
          calendar.
        </p>

        <div className="book-frame">
          <div id="cal-inline" className="book-embed" />
        </div>

        <p className="book-fallback">
          Calendar not loading?{" "}
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            Book on Cal.com
          </a>
        </p>
      </div>
    </section>
  );
}
