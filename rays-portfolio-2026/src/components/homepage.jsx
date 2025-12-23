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

  // this is for the text for like the title
  useEffect(() => {
    const title = "Ideas Made Real";
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

  return (
    <>
      <div className="title">
        <h1 ref={titleRef}></h1>
        <div className="paragraph-box">
          <p>
            Ideas Made Real isn't just a motto for me—it's how I build. I'm
            always thinking of fun and ambitious projects, whether to solve a
            particular problem or escape my own. Creating is where I find an
            escape. That's me — Rayat Chowdhury, Welcome to my Portfolio!
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
        </div>
      </div>
    </>
  );
}