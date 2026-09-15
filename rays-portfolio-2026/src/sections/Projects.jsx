import { projects } from "../data/content";

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="rail">
        <div className="section-head">
          <h2>Projects</h2>
          <p className="aside">Things I built end to end</p>
        </div>

        <div className="project-list">
          {projects.map((p) => (
            <article className="project" key={p.name}>
              <div className="project-top">
                <h3 className="project-name">{p.name}</h3>
                <a
                  className="project-link"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </div>

              <p className="project-blurb">{p.blurb}</p>

              <ul className="project-points">
                {p.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>

              <ul className="project-stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
