import { ArrowUpRight } from "lucide-react";
import SignalField from "../components/SignalField.jsx";
import { profile } from "../data/content";

// Email is already the headline link below, so it isn't repeated here.
const links = [
  { label: "LinkedIn", value: "My Linkedn!", href: profile.linkedin },
  { label: "GitHub", value: profile.githubHandle, href: profile.github },
  { label: "Resume", value: "My Resume", href: profile.resume },
];

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      {/* The hero's field returns, quieter, to close the page */}
      <SignalField className="contact-field" intensity={0.55} lens={0.8} />

      <div className="rail contact-inner">
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
                <span className="cl-value">
                  {value}
                  <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="foot">
          <p>
            {profile.name} — {profile.location}
          </p>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </footer>
      </div>
    </section>
  );
}
