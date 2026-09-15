import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import HomePage from "./components/homepage.jsx";
import AboutMe from "./components/aboutme.jsx";
import ContactMe from "./components/contactme.jsx";
import Navigation from "./components/Navigation.jsx";

/* three.js is most of the bundle. Split it out so the copy paints first and
   the scene fades in behind it a moment later. */
const SceneLayer = lazy(() => import("./three/SceneLayer.jsx"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="route"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/AboutMe" element={<AboutMe />} />
          <Route path="/ContactMe" element={<ContactMe />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * The 3D scene lives outside AnimatePresence on purpose: the canvas must
 * survive route changes so the camera can travel between framings while the
 * copy above it cross-fades.
 */
function Shell() {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={null}>
        <SceneLayer route={location.pathname} />
      </Suspense>
      <Navigation />
      <AnimatedRoutes />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
