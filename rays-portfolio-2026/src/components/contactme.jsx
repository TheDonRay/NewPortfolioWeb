import "../styles/contactme.css";

export default function ContactMe() {
  return (
    <div className="container" id="contact">
      <div className="Contactmebox">
        <h1>Let's Connect</h1>
        <p className="contact-intro">
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>

        <div className="contact-methods">
          {/* Email */}
          <a href="mailto:your.email@example.com" className="contact-card">
            <div className="contact-icon">
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                alt="Email"
              />
            </div>
            <div className="contact-info">
              <h3>Email</h3>
              <p>rayatchowdhury2005@gmail.com</p>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/rayatchowdhury2005/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <div className="contact-icon">
              <img
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                alt="LinkedIn"
              />
            </div>
            <div className="contact-info">
              <h3>LinkedIn</h3>
              <p>Connect with me</p>
            </div>
          </a>
        </div>

        <div className="contact-footer">
          <p>
            I typically respond within the same business day, usually within 2–3
            hours.
          </p>
        </div>
      </div>
    </div>
  );
}
