import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Skills from "./sections/Skills.jsx";
import Experience from "./sections/Experience.jsx";
import Projects from "./sections/Projects.jsx";
import Contact from "./sections/Contact.jsx";
import "./styles/site.css";

function Page() {
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Nav />
      <Hero />
      <main id="content">
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        {/* The old multi-page routes are now sections; keep the links alive. */}
        <Route path="/AboutMe" element={<Navigate to="/#about" replace />} />
        <Route path="/ContactMe" element={<Navigate to="/#contact" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
