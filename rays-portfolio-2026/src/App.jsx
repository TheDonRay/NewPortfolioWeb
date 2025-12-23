// import the components here as such 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from "./components/homepage.jsx";

function App() {
  return (
    <BrowserRouter> 
      <Routes> 
        <Route path='/' element={<HomePage />} /> 
        <Route path='/AboutMe' element={<AboutMe />} /> 
        <Route path='/ContactMe' element={<ContactMe />} /> 
        <Route path='/GitHub' element={<Projects />} /> 
        <Route path='/CurrentProject' element={<CurrProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
