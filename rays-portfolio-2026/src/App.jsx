import { Suspense, useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import HomePage from "./components/homepage.jsx";
import Navigation from "./components/Navigation.jsx";
import { AboutMe, BookCall, ContactMe, prefetchAllRoutes } from "./lib/routes.js";

/** Jump to the top on navigation — instantly, so smooth-scroll doesn't fight it. */
function useScrollReset(pathname) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
}

function RouteFallback() {
  return <div className="route-fallback" aria-live="polite" aria-busy="true" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();
  useScrollReset(location.pathname);

  const variants = reduced
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} className="route-shell" {...variants}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/AboutMe" element={<AboutMe />} />
            <Route path="/ContactMe" element={<ContactMe />} />
            <Route path="/BookCall" element={<BookCall />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    const schedule =
      window.requestIdleCallback ?? ((fn) => window.setTimeout(fn, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(prefetchAllRoutes, { timeout: 3000 });
    return () => cancel(id);
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <AnimatedRoutes />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
