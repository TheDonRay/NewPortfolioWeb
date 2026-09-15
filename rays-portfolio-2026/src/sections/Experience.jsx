import { experience } from "../data/content";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="rail">
        <div className="section-head">
          <h2>Experience</h2>
          <p className="aside">Backend engineering and release quality</p>
        </div>

        <ol className="timeline">
          {experience.map((job) => (
            <li className="job" key={job.company}>
              <div className="job-when">
                <span className="job-dates">
                  {job.start} – {job.end}
                </span>
                {job.current && <span className="job-now">Current</span>}
              </div>

              <div className="job-what">
                <h3 className="job-role">{job.role}</h3>
                <p className="job-org">
                  {job.company}, {job.city}
                </p>
                <ul className="job-points">
                  {job.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
