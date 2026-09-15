import { skills } from "../data/content";

const total = skills.reduce((n, g) => n + g.items.length, 0);

/**
 * A spec sheet, not a card grid: category in the left column, the
 * things themselves in the right, one hairline per row.
 */
export default function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="rail">
        <div className="section-head">
          <h2>Skills</h2>
          <p className="aside">{total} tools across five areas</p>
        </div>

        <dl className="spec">
          {skills.map(({ label, items }) => (
            <div className="spec-row" key={label}>
              <dt className="spec-label">{label}</dt>
              <dd className="spec-items">
                {items.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
