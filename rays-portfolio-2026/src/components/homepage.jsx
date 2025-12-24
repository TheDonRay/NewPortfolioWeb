import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

export default function HomePage() {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  function AboutMe() {
    navigate("/AboutMe");
  }

  function ContactMe() {
    navigate("/ContactMe");
  } 

  function MyGithub() { 
    window.open('https://github.com/TheDonRay', '_blank', 'noopener,noreferrer');
  } 

  function RecentProj() { 
    navigate("/CurrentProject"); 
  }

  // this is for the text for like the title
  useEffect(() => {
    const title = "Rayat Chowdhury";
    const titleElement = titleRef.current;

    if (titleElement) {
      // Clear any existing content
      titleElement.innerHTML = "";

      // Split text into characters and wrap each in a span
      title.split("").forEach((char, index) => {
        const span = document.createElement("span");

        if (char === " ") {
          span.className = "space";
        } else {
          span.className = "char";
          span.textContent = char;
          span.style.animationDelay = `${index * 0.05}s`;
        }

        titleElement.appendChild(span);
      });
    }
  }, []);

  //TODO:  <span></span> need to add to highlight welcome to my Portfolio.

  return (
    <>
      <div className="title">
        <h1 ref={titleRef}></h1>
        <div className="paragraph-box">
          <p>
            I live by a simple motto: Ideas Made Real. It’s more than words, it’s
            how I build. I’m always exploring ambitious, creative projects,
            whether to solve real problems or escape my own thoughts. Building
            is where creativity meets purpose. That’s me — Rayat Chowdhury.
            Welcome to my portfolio.
          </p>
        </div>

        {/*For the buttons here below */}
        <div className="button-container">
          <button className="Aboutmebtn" onClick={AboutMe}>
            About me
          </button>

          <button className="Contactmebtn" onClick={ContactMe}>
            Contact me
          </button> 

          <button className="mygithubbtn" onClick={MyGithub}>
            My GitHub
          </button>  

          <button className="recentProj" onClick={RecentProj}>
            Recent Project
          </button>  

        </div>
      </div>
    </>
  );
}
