import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; 
import { Analytics } from "@vercel/analytics/react"; 
import HomePage from "./components/homepage.jsx";
import AboutMe from "./components/aboutme.jsx";
import ContactMe from "./components/contactme.jsx";
import Navigation from "./components/Navigation.jsx";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
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

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <AnimatedRoutes />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
