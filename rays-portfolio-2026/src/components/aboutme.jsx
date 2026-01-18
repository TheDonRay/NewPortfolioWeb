import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/aboutme.css";

const skills = [
  "JavaScript",
  "TypeScript",
  "Python",
  "C++",
  "SQL",
  "React",
  "Node.js",
  "Express",
  "Tailwind CSS",
  "GitHub",
  "Git",
  "GitHub",
  "Docker",
  "MongoDB",
  "MySQL",
  "Jest",
  "Postman",
  "HTTPie",
  "Jira",
  "Railway",
  "Express Routing",
  "REST APIs",
  "PlayWright",
];

export default function AboutMe() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <main className="about">
      <div className="about-content">
        <motion.section
          className="about-section"
          {...fadeIn}
          transition={{ delay: 0.1 }}
        >
          <h1 className="about-title">About Me</h1>
          <p className="about-text">
            I’m a junior at Hunter College studying Computer Science with a
            minor in Mathematics. I’m an aspiring backend developer with a
            strong focus on Node.js and Express.js. I like to think of myself as
            a “bootleg” Tony Stark—minus the AI lab, but surrounded by projects
            with a mix of simple and absurd ideas, but also a mind that wants to
            continously build and learn.
          </p>
          <p className="about-text">
            Building wasn’t always something I planned on doing. I began by
            solving my own problems, but quickly realized the potential to help
            others too. Making an impact that improves everyday life is what I
            strive for
          </p>
        </motion.section>

        <motion.section
          className="about-section"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          <h2 className="section-title">Education</h2>
          <div className="education-card">
            <p className="education-school">Hunter College, CUNY</p>
            <p className="education-degree">
              B.A. Computer Science, Minor in Mathematics
            </p>
            <p className="education-status">Junior · Expected 2027</p>
          </div>
        </motion.section>

        <motion.section
          className="about-section"
          {...fadeIn}
          transition={{ delay: 0.3 }}
        >
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="about-section"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title">Goals</h2>
          <p className="about-text">
            My goal is to build with purpose. I’m driven to use technology to
            make healthcare more accessible, whether through medical solutions
            or tools that support people emotionally and mentally. I aim to grow
            as a software engineer while building meaningful ventures in New
            York and Bangladesh.
          </p>
        </motion.section>

        <motion.section
          className="about-section"
          {...fadeIn}
          transition={{ delay: 0.5 }}
        >
          <h2 className="section-title">Interests</h2>
          <p className="about-text">
            When I’m not coding, you’ll usually find me scrolling through
            Facebook Marketplace admiring cars, especially the Infiniti Q60 and
            BMWs. I also enjoy gaming, playing basketball, and Fortnite’s
            Ballistic mode, a fast-paced, strategy-driven first-person shooter
          </p>
        </motion.section>

        <motion.div
          className="about-cta"
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          <a href="/resume.pdf" target="_blank" className="btn btn-primary">
            View Resume
          </a>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/ContactMe")}
          >
            Contact Me
          </button>
        </motion.div>
      </div>
    </main>
  );
}
