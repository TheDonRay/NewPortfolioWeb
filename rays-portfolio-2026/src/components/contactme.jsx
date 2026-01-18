import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Linkedin, Github, ArrowLeft } from "lucide-react";
import "../styles/contactme.css";

export default function ContactMe() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: "rayatchowdhury2005@gmail.com",
      href: "mailto:rayatchowdhury2005@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "rayatchowdhury2005",
      href: "https://www.linkedin.com/in/rayatchowdhury2005/",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "TheDonRay",
      href: "https://github.com/TheDonRay",
    },
  ];

  return (
    <main className="contact">
      <div className="contact-content">
        <motion.h1
          className="contact-title"
          {...fadeIn}
          transition={{ delay: 0.1 }}
        >
          Get in Touch
        </motion.h1>

        <motion.p
          className="contact-subtitle"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          I'm always open to new opportunities and interesting projects. Feel
          free to reach out.
        </motion.p>

        <motion.div
          className="contact-list"
          {...fadeIn}
          transition={{ delay: 0.3 }}
        >
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <Icon size={20} className="contact-icon" />
              <div className="contact-info">
                <span className="contact-label">{label}</span>
                <span className="contact-value">{value}</span>
              </div>
            </a>
          ))}
        </motion.div>

        <motion.div
          className="contact-footer"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          <button className="back-link" onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </motion.div>
      </div>
    </main>
  );
}
