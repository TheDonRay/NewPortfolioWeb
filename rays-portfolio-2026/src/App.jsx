// import the components here as such
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage.jsx";
import AboutMe from "./components/aboutme.jsx";
import ContactMe from "./components/contactme.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AboutMe" element={<AboutMe />} />
          <Route path="/ContactMe" element={<ContactMe />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
