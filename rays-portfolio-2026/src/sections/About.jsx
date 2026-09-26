import { about, education } from "../data/content";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="rail">
        <div className="section-head">
          <h2>About</h2>
          <p className="aside">
            {education.degree}, minor in {education.minor}
          </p>
        </div>

        <div className="about-body">
          <div className="about-prose">
            {about.map(({ id, heading, body }) => (
              <article key={id} className="prose-block">
                <h3>{heading}</h3>
                {body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </article>
            ))}
          </div>

          <aside className="about-card">
            <p className="card-school">{education.school}</p>
            <p className="card-city">{education.city}</p>

            <dl className="card-rows">
              <div>
                <dt>Degree</dt>
                <dd>{education.degree}</dd>
              </div>
              <div>
                <dt>Minor</dt>
                <dt>Minor</dt>
                <dd>{education.minor}</dd>
              </div>
              <div>
                <dt>Standing</dt>
                <dd>{education.standing}</dd>
              </div>
              <div>
                <dt>Graduating</dt>
                <dd>{education.graduation}</dd>
              </div>
            </dl>

            <p className="card-label">Coursework</p>
            <ul className="card-course">
              {education.coursework.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
