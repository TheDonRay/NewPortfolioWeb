import "../styles/aboutme.css";

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

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="container">
        <div className="column aboutRayat">
          <h1>Who is Rayat?</h1>
          <p>
            Rayat (Ray) is a junior at Hunter College studying Computer Science
            with a minor in Mathematics. He’s an aspiring Backend Developer with
            a love for JavaScript and Express.js. He likes to think of himself
            as a “bootleg Tony Stark,” solving his own problems and others’
            through a common solution: code. He’s passionate about backend
            development, quality engineering, and building reliable, relatable
            projects that help people in their day-to-day lives. Through
            hands-on projects, he’s developed strong problem-solving skills and
            a commitment to high-quality software. Rayat is always learning,
            experimenting, and pushing his technical abilities forward even if it comes with mistakes and bugs hes always commited to work.
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
            When I'm not coding, you'll find me gaming, exploring new tech, or
            working on side projects that excite me. I love diving into new
            frameworks and staying up to date with the latest in web
            development.
          </p>
        </div>

        <div className="column goals">
          <h1>My Goals</h1>
          <p>
            Build impactful projects, master full-stack development, and
            contribute to open-source communities. I want to create tools that
            help developers and solve real-world problems.
          </p>
        </div>
      </div>

      <div className="contact-button-container">
        <button onClick={scrollToContact} className="contact-button">
          Contact Me
        </button>
      </div>
    </>
  );
}
