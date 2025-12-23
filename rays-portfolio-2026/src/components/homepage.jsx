import { useEffect, useRef } from "react";
import "../styles/homepage.css";

export default function HomePage() {
  const titleRef = useRef(null);

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
    <div className="title">
      <h1 ref={titleRef}></h1>
      <div className="paragraph-box">
        <p1>
          Ideas Made Real isn't just a motto for me—it's how I build. I'm always
          thinking of fun and ambitious projects, whether to solve a particular
          problem or escape my own. Creating is where I find an escape. That's me — Rayat
          Chowdhury
        </p1>
      </div>
    </div>
  );
}
