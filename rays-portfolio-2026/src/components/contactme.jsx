import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Linkedin, Github, ArrowLeft } from "lucide-react";
import "../styles/contactme.css";

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

const section = (delay) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
});

export default function ContactMe() {
  const navigate = useNavigate();

  return (
    <main className="contact">
      <div className="contact-content">
        <motion.h1 className="contact-title" {...section(0.1)}>
          Get in Touch
        </motion.h1>

        <motion.p className="contact-subtitle" {...section(0.18)}>
          I'm always open to new opportunities and interesting projects. Feel
          free to reach out.
        </motion.p>

        <motion.div className="contact-list" {...section(0.26)}>
          {contacts.map(({ icon: Icon, label, value, href }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ x: 5 }}
            >
              <Icon size={20} className="contact-icon" />
              <div className="contact-info">
                <span className="contact-label">{label}</span>
                <span className="contact-value">{value}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div className="contact-footer" {...section(0.55)}>
          <button className="back-link" onClick={() => navigate("/")}>
            <ArrowLeft size={14} />
            Back to Home
          </button>
        </motion.div>
      </div>
    </main>
  );
}
