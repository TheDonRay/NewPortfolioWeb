import { profile } from "../data/content";

// Email is already the headline link below, so it isn't repeated here.
const links = [
  { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin },
  { label: "GitHub", value: profile.githubHandle, href: profile.github },
  { label: "Résumé", value: "PDF, one page", href: profile.resume },
];

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="rail">
        <h2 className="contact-head">
          Looking for a backend intern who ships?
        </h2>
        <p className="contact-sub">
          I'm open to internships and new-grad roles starting {" "}
          {new Date().getFullYear() + 1}. The fastest way to reach me is email —
          I answer everything.
        </p>

        <a className="contact-primary" href={`mailto:${profile.email}`}>
          {/* on a phone the address wraps at the @, not mid-word */}
          {profile.email.split("@")[0]}
          <wbr />@{profile.email.split("@")[1]}
        </a>

        <ul className="contact-links">
          {links.map(({ label, value, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <span className="cl-label">{label}</span>
                <span className="cl-value">{value}</span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="foot">
          <p>
            {profile.name} — {profile.location}
          </p>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </footer>
      </div>
    </section>
  );
}
