import "../styles/contactme.css";

export default function ContactMe() {
  return (
    <>
      {/* Animated background gradient - matching homepage */}
      <div className="gradient-bg"></div>
      <div className="noise-overlay"></div>

      <div className="container" id="contact">
        <div className="Contactmebox">
          {/* Border sweep animation */}
          <div className="border-sweep"></div>
          
          <h1>Let's Connect</h1>
          <p className="contact-intro">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>

          <div className="contact-methods">
            {/* Email */}
            <a href="mailto:rayatchowdhury2005@gmail.com" className="contact-card">
              <div className="contact-icon">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
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
              className="contact-card linkedin-card"
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
              {/* Robot pointer */}
              <div className="robot-pointer">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt="Robot"
                  className="robot-icon"
                />
              </div>
            </a>
          </div>

          <div className="contact-footer">
            <p>Looking forward to hearing from you</p>
          </div>
        </div>
      </div>
    </>
  );
}