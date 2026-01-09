import { useEffect, useRef, useState } from "react";
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
    window.open(
      "https://github.com/TheDonRay",
      "_blank",
      "noopener,noreferrer",
    );
  }

  function OpenPDF() {
    const pdfURL = "/resume.pdf";
    window.open(pdfURL, "_blank");
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
          span.className = "char char-anim";
          span.textContent = char;
          span.style.animationDelay = `${index * 0.1}s`;
        }

        titleElement.appendChild(span);
      });

      // Helper to re-trigger the animation on demand (used on resize)
      const triggerAnimation = () => {
        const chars = titleElement.querySelectorAll(".char");
        chars.forEach((el) => {
          el.classList.remove("char-anim");
          // force reflow
          void el.offsetWidth;
          el.classList.add("char-anim");
        });
      };

      // If viewport becomes small, re-trigger the blur animation
      let lastSmall = window.innerWidth <= 600;
      const onResize = () => {
        const isSmall = window.innerWidth <= 600;
        if (isSmall && !lastSmall) {
          triggerAnimation();
        }
        lastSmall = isSmall;
      };

      window.addEventListener("resize", onResize);
      // Clean up
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, []);

  return (
    <>
      <div className="title">
        <h1 ref={titleRef}></h1>
        <div className="paragraph-box">
          <p>
            I live by a simple motto: Ideas Made Real. It's more than words,
            it's how I build. I'm always exploring ambitious, creative projects,
            whether to solve real problems or escape my own thoughts. Building
            is where creativity meets purpose. That's me — Rayat Chowdhury.
            Welcome to my portfolio.
          </p>
        </div>

        {/* Magnetic glassy icon buttons with tooltips */}
        <div className="button-container">
          <MagneticButton onClick={AboutMe} label="About Me">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </MagneticButton>

          <MagneticButton onClick={ContactMe} label="Let's Connect">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </MagneticButton>

          <MagneticButton onClick={MyGithub} label="GitHub">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </MagneticButton>

          <MagneticButton onClick={OpenPDF} label="Resume">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </MagneticButton>
        </div>
      </div>
    </>
  );
}

// Magnetic Button Component with Tooltip
function MagneticButton({ children, onClick, label }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;

      // Calculate distance from center
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = 100; // Magnetic effect radius

      if (distance < maxDistance) {
        // Apply magnetic effect - stronger when closer
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = distanceX * strength * 0.3;
        const moveY = distanceY * strength * 0.3;
        setPosition({ x: moveX, y: moveY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div className="button-wrapper">
      <button
        ref={buttonRef}
        className="icon-btn glass-btn magnetic-btn"
        onClick={onClick}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translateY(${isHovered ? "-4px" : "0"})`,
        }}
      >
        {children}
      </button>
      <span className={`button-label ${isHovered ? "visible" : ""}`}>
        {label}
      </span>
    </div>
  );
}
