import "../styles/aboutme.css";
import { useNavigate } from 'react-router-dom'; 

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
      <div className="container">
        <div className="column aboutRayat">
          <h1>Who is Rayat?</h1>
          <p>
            Rayat (Ray) is a junior at Hunter College studying Computer Science
            with a minor in Mathematics. He is an aspiring backend developer
            with a strong focus on JavaScript and Express.js. Often describing
            himself as a “bootleg Tony Stark,” Ray enjoys solving real-world
            problems—his own and others’—through code. He is passionate about
            backend systems, quality engineering, and building reliable,
            user-focused projects that make a meaningful impact. Through
            hands-on development, Rayat has developed strong problem-solving
            skills and a deep commitment to writing clean, dependable software.
            He is constantly learning, experimenting, and pushing his technical
            abilities forward, embracing mistakes and bugs as part of the growth
            process.
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
          <h1>Hobbies/Interests</h1>
          <p>
            When I’m not coding or studying, you’ll probably find me scrolling
            through Facebook Marketplace admiring my favorite cars, especially
            the Infiniti Q60 and BMWs like the 330i, 335i, M5, and 540i. I’m
            also big into gaming, spending time in Fortnite’s Ballistic mode,
            which I enjoy for its Valorant-like strategy, coordination, and fast
            decision-making. Beyond gaming, I genuinely enjoy LeetCoding,
            treating it like a mental workout and a way to sharpen my
            problem-solving skills. To unwind, I love going on long night
            drives—just me, the road, and some music to clear my mind and reset
            before the next build or challenge.
          </p>
        </div>

        <div className="column goals">
          <h1>My Goals</h1>
          <p>
            My goals are simple: I want to build, and I want to build with
            purpose. I’ve realized that I’m really passionate about working in
            the medical space, using code to make healthcare more practical,
            accessible, and easier to use for everyday people. Creating
            technology that genuinely helps others both mentally and physically
            is something I truly care about. Alongside this, I aspire to become
            a successful software engineer and also a businessman, building
            meaningful ventures both in New York and in my home country,
            Bangladesh.
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
