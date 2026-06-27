import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import "../styles/aboutme.css";

const skillCategories = [
  { label: "Languages",              skills: ["TypeScript", "JavaScript", "C++", "Python", "SQL", "HTML"] },
  { label: "Frameworks & Libraries", skills: ["React.js", "Node.js", "Express.js", "Vanta.js", "Jest", "Playwright", "Drupal CMS", "Tailwind CSS"] },
  { label: "Developer Tools",        skills: ["Git", "GitHub", "Docker", "NPM", "Postman", "HTTPie", "Jira", "Railway", "Vercel"] },
  { label: "Backend & APIs",         skills: ["REST APIs", "GraphQL", "OpenAI API", "Express Routing", "JWT", "CRUD Operations"] },
  { label: "Databases & Cloud",      skills: ["MongoDB", "MySQL", "GCP", "Cloud Run", "Artifact Registry", "IAM"] },
];

const stats = [
  { value: 2,    suffix: "+", label: "Years Coding"  },
  { value: 35,   suffix: "",  label: "Technologies"  },
  { value: 2027, suffix: "",  label: "Expected Grad" },
];

function Counter({ to, suffix = "" }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const from = to > 100 ? to - 8 : 0;
    const ctrl = animate(from, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => { node.textContent = Math.round(v) + suffix; },
    });
    return ctrl.stop;
  }, [to, suffix]);
  return <span ref={nodeRef}>{to > 100 ? to - 8 : 0}{suffix}</span>;
}

const up = (delay) => ({
  initial:    { opacity: 0, y: 22 },
  animate:    { opacity: 1, y: 0  },
  transition: { delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
});

export default function AboutMe() {
  const navigate = useNavigate();

  return (
    <main className="about">

      {/* Fixed vertical label */}
      <div className="about-sidenote" aria-hidden="true">
        PORTFOLIO&nbsp;·&nbsp;2026
      </div>

      {/* Masthead */}
      <motion.div className="masthead" {...up(0.05)}>
        <div className="mast-rule" />
        <div className="mast-bar">
          <span className="mast-tag">Developer</span>
          <span className="mast-sep" />
          <span className="mast-tag">Hunter College</span>
          <span className="mast-sep" />
          <span className="mast-tag">New York</span>
          <span className="mast-flex" />
          <span className="mast-tag mast-tag--right">Issue&nbsp;№&nbsp;01</span>
        </div>
        <div className="mast-rule" />
      </motion.div>

      {/* Hero title */}
      <motion.div className="about-hero" {...up(0.1)}>
        <h1 className="about-title">
          <span className="title-line">About</span>
          <span className="title-line title-line--ghost">Me</span>
        </h1>
        <p className="about-kicker">Junior&nbsp;·&nbsp;Computer Science&nbsp;·&nbsp;Backend Engineer</p>
      </motion.div>

      {/* Stats strip */}
      <motion.div className="stats-band" {...up(0.2)}>
        <div className="band-rule" />
        <div className="band-inner">
          {stats.map(({ value, suffix, label }, i) => (
            <div className="band-stat" key={label}>
              <p className="band-num"><Counter to={value} suffix={suffix} /></p>
              <p className="band-lbl">{label}</p>
              {i < stats.length - 1 && <span className="band-tick" aria-hidden="true" />}
            </div>
          ))}
        </div>
        <div className="band-rule" />
      </motion.div>

      {/* Two-column body */}
      <div className="about-grid">

        {/* Left — narrative */}
        <motion.div className="about-col about-col--main" {...up(0.28)}>

          <section className="ab-section" data-num="01">
            <header className="ab-section-head">
              <span className="ab-index">01</span>
              <h2 className="ab-heading">Who I Am</h2>
            </header>
            <p className="ab-text">
              I'm a rising senior at <strong>Hunter College</strong> pursuing a{" "}
              <strong>B.A. in Computer Science</strong> with a minor in{" "}
              <strong>Mathematics</strong>. I'm an aspiring backend developer with
              a passion for building scalable applications using{" "}
              <strong>Node.js</strong> and <strong>Express.js</strong>. I like to
              think of myself as a "bootleg" Tony Stark—minus the billion-dollar
              lab, but with the same drive to keep building, learning, and turning
              ideas into reality.
            </p>
            <p className="ab-text">
              Building wasn't something I originally planned on doing. It started
              as a way to solve my own problems, but along the way I realized the
              same solutions could help other people too. Since then, creating has
              become more than just writing code—it's how I learn, challenge
              myself, and make an impact. Whether the idea is simple, ambitious, or
              a little weird, if it has the potential to improve someone's everyday
              life, it's worth building.
            </p>
          </section>

          <section className="ab-section" data-num="04">
            <header className="ab-section-head">
              <span className="ab-index">04</span>
              <h2 className="ab-heading">Goals</h2>
            </header>
            <p className="ab-text">
              My goal is to build software that makes a{" "}
              <strong>real difference</strong> in people's everyday lives. I want
              to be part of a company where the work has a meaningful impact on the
              people who use it. One day, I'd love to join a{" "}
              <strong>startup</strong> in its early stages and help grow it from
              the ground up into a platform that reaches{" "}
              <strong>millions</strong>. Being part of that journey—building
              something from nothing, solving real problems, and helping people
              achieve their goals—is what motivates me. Along the way, I hope to
              become the software engineer I've always wanted to be, while making
              an impact to people's lives.
            </p>
          </section>

          <section className="ab-section" data-num="05">
            <header className="ab-section-head">
              <span className="ab-index">05</span>
              <h2 className="ab-heading">Interests</h2>
            </header>
            <p className="ab-text">
              When I'm not coding, you'll probably find me watching car repair
              videos on YouTube (shoutout to <strong>ChrisFix</strong>), reading
              documentation just because I enjoy learning, or out on late-night
              drives with my friends talking about cars and checking out each
              other's builds. If you couldn't tell already, I'm a huge{" "}
              <strong>car enthusiast</strong>. To me, cars are more than just
              machines—they're something that brings people together, and that's
              one of the reasons I love them.
            </p>
          </section>

        </motion.div>

        {/* Right — structured data */}
        <motion.div className="about-col about-col--side" {...up(0.36)}>

          <section className="ab-section" data-num="02">
            <header className="ab-section-head">
              <span className="ab-index">02</span>
              <h2 className="ab-heading">Education</h2>
            </header>

            <div className="edu-card">
              <span className="edu-corner edu-corner--tl" aria-hidden="true" />
              <span className="edu-corner edu-corner--br" aria-hidden="true" />

              <div className="edu-card-head">
                <p className="edu-school">Hunter College</p>
                <p className="edu-org">City University of New York</p>
              </div>

              <dl className="edu-rows">
                {[
                  ["Degree",   "B.A. Computer Science"],
                  ["Minor",    "Mathematics"],
                  ["Standing", "Junior"],
                  ["Expected", "2027"],
                ].map(([k, v]) => (
                  <div className="edu-row" key={k}>
                    <dt className="edu-key">{k}</dt>
                    <span className="edu-leader" aria-hidden="true" />
                    <dd className="edu-val">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="edu-progress">
                <span className="edu-prog-lbl">Progress</span>
                <div className="edu-prog-track">
                  <motion.div
                    className="edu-prog-fill"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: 0.9, duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <span className="edu-prog-pct">75%</span>
              </div>
            </div>
          </section>

          <section className="ab-section" data-num="03">
            <header className="ab-section-head">
              <span className="ab-index">03</span>
              <h2 className="ab-heading">Skills</h2>
            </header>
            <div className="skill-groups">
              {skillCategories.map(({ label, skills }) => (
                <div className="skill-group" key={label}>
                  <span className="skill-group-lbl">{label}</span>
                  <div className="skill-tags">
                    {skills.map((sk) => (
                      <motion.span
                        key={sk}
                        className="skill-tag"
                        whileHover={{ scale: 1.06, y: -2 }}
                        transition={{ type: "spring", stiffness: 380, damping: 20 }}
                      >
                        {sk}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </motion.div>
      </div>

      {/* CTA */}
      <motion.div className="about-cta" {...up(0.52)}>
        <div className="cta-rule" />
        <div className="cta-row">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--fill">
            View Resume
          </a>
          <button className="cta-btn cta-btn--ghost" onClick={() => navigate("/ContactMe")}>
            Contact Me
          </button>
        </div>
      </motion.div>

    </main>
  );
}
