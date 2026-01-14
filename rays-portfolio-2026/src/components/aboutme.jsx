import "../styles/aboutme.css";
import { useNavigate } from "react-router-dom";

export default function AboutMe() {
  const skills = [
    // Languages
    {
      name: "TypeScript",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    },
    {
      name: "JavaScript",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
    },
    {
      name: "C++",
      icon: "https://cdn-icons-png.flaticon.com/512/6132/6132222.png",
    },
    {
      name: "Python",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
    },
    {
      name: "SQL",
      icon: "https://cdn-icons-png.flaticon.com/512/4492/4492311.png",
    },
    {
      name: "HTML",
      icon: "https://cdn-icons-png.flaticon.com/512/732/732212.png",
    },
    {
      name: "CSS",
      icon: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    },

    // Frameworks & Libraries
    {
      name: "React.js",
      icon: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
    },
    {
      name: "Node.js",
      icon: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    },
    {
      name: "Express.js",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968322.png",
    },
    {
      name: "TailWind CSS",
      icon: "https://cdn-icons-png.flaticon.com/512/8099/8099234.png",
    },
    {
      name: "Vanta.js",
      icon: "https://cdn-icons-png.flaticon.com/512/1005/1005141.png",
    },

    // Developer Tools
    {
      name: "Git",
      icon: "https://cdn-icons-png.flaticon.com/512/2111/2111288.png",
    },
    {
      name: "GitHub",
      icon: "https://cdn-icons-png.flaticon.com/512/733/733553.png",
    },
    {
      name: "Docker",
      icon: "https://cdn-icons-png.flaticon.com/512/919/919853.png",
    },
    {
      name: "npm",
      icon: "https://cdn-icons-png.flaticon.com/512/919/919827.png",
    },
    {
      name: "Jupyter",
      icon: "https://cdn-icons-png.flaticon.com/512/5969/5969294.png",
    },
    {
      name: "Playwright",
      icon: "https://cdn-icons-png.flaticon.com/512/8099/8099173.png",
    },
    {
      name: "Jest",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968358.png",
    },
    {
      name: "Postman",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968525.png",
    },
    {
      name: "Jira",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",
    },

    // Backend & API
    {
      name: "REST API",
      icon: "https://cdn-icons-png.flaticon.com/512/2165/2165004.png",
    },
    {
      name: "JSON",
      icon: "https://cdn-icons-png.flaticon.com/512/136/136525.png",
    },

    // Databases
    {
      name: "MongoDB",
      icon: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    },
    {
      name: "MySQL",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968313.png",
    },
  ];

  const navigate = useNavigate();

  function Contactme() {
    navigate("/ContactMe");
  }

  function mygithub() {
    window.open(
      "https://github.com/TheDonRay",
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      {/* Animated background gradient - matching homepage */}
      <div className="gradient-bg"></div>
      <div className="noise-overlay"></div>

      <div className="container">
        <div className="aboutRayat">
          {/* Floating orbs decoration */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          
          <h1>Who is Rayat?</h1>
          <p>
            I'm a junior at Hunter College studying Computer Science with a
            minor in Mathematics. I'm an aspiring backend developer with a
            strong focus on JavaScript and Express.js. I enjoy solving
            real-world problems through code and building reliable, user-focused
            systems. I'm passionate about backend engineering, quality software,
            and continuously learning—embracing challenges, bugs, and mistakes
            as part of the growth process.
          </p>

          {/* Scrolling Skills Strip */}
          <div className="skills-marquee">
            <div className="skills-track">
              {/* Duplicate the skills array for seamless loop */}
              {[...skills, ...skills].map((skill, index) => (
                <div key={index} className="skill-item">
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="skill-icon"
                  />
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="column hobbies">
          <div className="orb orb-3"></div>
          <h1>Hobbies/Interests</h1>
          <p>
            When I'm not coding, I'm usually scrolling through Facebook
            Marketplace admiring cars—especially the Infiniti Q60 and BMWs. I'm
            big into gaming, particularly Fortnite's Ballistic mode for its
            fast, strategy-driven gameplay. I also enjoy LeetCoding as a mental
            workout, and I like to unwind with long night drives, music on,
            clearing my head before the next challenge.
          </p>
        </div>

        <div className="column goals">
          <div className="orb orb-4"></div>
          <h1>My Goals</h1>
          <p>
            My goal is simple: to build with purpose. I'm especially passionate
            about working in the medical space, using technology to make
            healthcare more accessible and practical for everyday people. I
            aspire to grow as a software engineer and a businessman, creating
            meaningful ventures in New York and in my home country, Bangladesh.
          </p>
        </div>
      </div>

      <div className="contact-button-container">
        <button onClick={Contactme} className="contact-button">
          Contact Me
        </button>

        <button onClick={mygithub} className="github-btn">
          My Github
        </button>
      </div>
    </>
  );
}