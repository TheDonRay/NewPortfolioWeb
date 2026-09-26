/**
 * Single source of truth for every word on the site.
 * Skills, experience and projects mirror public/resume.pdf exactly.
 */

export const profile = {
  name: "Rayat Chowdhury",
  first: "Rayat",
  last: "Chowdhury",
  role: "Backend-leaning software engineer",
  location: "New York",
  email: "rayatchowdhury2005@gmail.com",
  github: "https://github.com/TheDonRay",
  githubHandle: "TheDonRay",
  linkedin: "https://www.linkedin.com/in/rayatchowdhury2005/",
  linkedinHandle: "rayatchowdhury2005",
  resume: "/resume.pdf",
  // Cal.com username/event slug — cal.com/rayat/meeting (30 min)
  calLink: "rayat/meeting",
  intro:
    "Hey! I’m Rayat, a Software Engineer passionate about building backend systems, designing REST APIs, and learning System Design. I’m also on a never-ending journey to tolerate LeetCode.",
};

export const education = {
  school: "CUNY Hunter College",
  city: "New York, NY",
  degree: "B.A. Computer Science",
  minor: "Mathematics",
  graduation: "May 2027",
  standing: "Senior",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming I & II",
    "Software Analysis & Design III",
  ],
};

export const about = [
  {
    id: "who",
    heading: "Who Am I?",
    body: [
      "I'm a senior at Hunter College pursuing a B.A. in Computer Science with a minor in Mathematics. I'm an aspiring backend developer with a passion for building scalable applications using Node.js and Express.js. I like to think of myself as a “bootleg” Tony Stark — minus the billion-dollar lab, but with the same drive to keep building, learning, and turning ideas into reality.",
      "Building wasn't something I originally planned on doing. It started as a way to solve my own problems, but along the way I realized the same solutions could help other people too. Since then, creating has become more than just writing code — it's how I learn, challenge myself, and make an impact. Whether the idea is simple, ambitious, or a little weird, if it has the potential to improve someone's everyday life, it's worth building.",
    ],
  },
  {
    id: "goals",
    heading: "Where I'm going",
    body: [
      "My goal is to build software that makes a real difference in people's everyday lives. I want to be part of a company where the work has a meaningful impact on the people who use it. One day, I'd love to join a startup in its early stages and help grow it from the ground up into a platform that reaches millions.",
      "Being part of that journey — building something from nothing, solving real problems, and helping people achieve their goals — is what motivates me. Along the way, I hope to become the software engineer I've always wanted to be.",
    ],
  },
  {
    id: "interests",
    heading: "When I'm not coding",
    body: [
      "When I’m not coding, you can find me hanging out with my friends and enjoying the night, whether we’re cruising down Astoria Boulevard or taking a late night drive along the Belt Parkway. And if I’m not there, you can definitely find me at one of my favorite spots, Roosevelt Island, just enjoying the view and taking in the city.",
    ],
  },
];

/** Verbatim from the Technical Skills section of the resume. */
export const skills = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "C++", "Python", "SQL", "HTML"],
  },
  {
    label: "Frameworks & libraries",
    items: [
      "React.js",
      "Node.js",
      "Express.js",
      "Jest",
      "Playwright",
      "Drupal CMS",
      "Tailwind CSS",
    ],
  },
  {
    label: "Developer tools",
    items: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Docker",
      "NPM",
      "Postman",
      "HTTPie",
      "Jira",
      "QMetry",
      "Railway",
      "Vercel", 
      "CloudFlare"
    ],
  },
  {
    label: "Backend & APIs",
    items: [
      "REST APIs",
      "GraphQL",
      "OpenAI API",
      "Express Routing",
      "JWT",
      "CRUD Operations",
    ],
  },
  {
    label: "Databases & cloud",
    items: [
      "MongoDB",
      "MySQL",
      "GCP", 
      "Cloud Run", 
      "Artifact Registry",
      "IAM",
    ],
  },
];

export const experience = [
  {
    role: "Software Engineer Intern",
    company: "FlowState LLC",
    city: "New York, NY",
    start: "Oct 2025",
    end: "Present",
    current: true,
    points: [
      "Built a backend Node service with 11 Express endpoints for AI question generation, answer grading, and job matching, helping users prepare for interviews.",
      "Streamlined backend error handling by consolidating validation, upstream, and parsing failures into a single shared error handler, improving consistency across Express endpoints.",
      "Launched paid checkout with Stripe, enabling secure transaction processing through authenticated sessions and webhook fulfillment.",
      "Containerized Node.js and Python FastAPI services using Docker Compose, cutting dev setup to one command.",
    ],
  },
  {
    role: "Software Quality Engineer Intern",
    company: "NBCUniversal",
    city: "Stamford, CT",
    start: "Sep 2025",
    end: "Aug 2026",
    current: false,
    points: [
      "Drove every pre- and post-release smoke and regression cycle using QMetry on Android and Roku, certifying 3 apps across 4 release trains at 100% pass and catching 8+ defects.",
      "Audited 6+ CMS-driven pages against backend configuration using staging checks, preventing misconfigured content from reaching production.",
      "Debugged streaming playback failures using Charles Proxy and HTTP log analysis, preventing playback issues across 3 NBC releases.",
      "Consolidated 35+ legacy test cases into 17 authored QMetry test plans, cutting regression maintenance 50%.",
    ],
  },
];

export const projects = [
  {
    name: "PropertyAnalyzer",
    blurb:
      "A property lookup API that turns a street address into structured market data, with an AI layer on top.",
    stack: [
      "TypeScript",
      "Node.js",
      "Express.js",
      "Docker",
      "GCP Cloud Run",
      "OpenAI API",
      "RentCast API",
    ],
    points: [
      "Built a property lookup API using a typed TypeScript service layer over RentCast, returning 15+ structured data points.",
      "Automated CI/CD using Cloud Build and commit-tagged Docker images, deploying to GCP Cloud Run on every push.",
      "Reduced invalid-input failures reaching the paid RentCast and OpenAI APIs by adding request-parameter validation and layered error handling across the analysis controller and external API service.",
    ],
    href: "https://github.com/TheDonRay/PropertyAnalyzer",
  },
  {
    name: "CheckPoint",
    blurb:
      "A request validation layer for Express — parse, sanitize, load, and authorize before anything touches the database.",
    stack: ["Node.js", "Express.js", "NPM", "Docker", "Postman", "MongoDB"],
    points: [
      "Built a Node.js data validation layer with custom middleware for parsing, sanitization, data loading, and authorization, ensuring requests are validated before database access.",
      "Generated MongoDB seed data to test custom middleware across endpoint requests and query types, confirming API validation behaved as expected through Postman.",
      "Implemented GitHub Actions CI with Node 22 and npm caching, improving build consistency and efficiency.",
    ],
    href: "https://github.com/TheDonRay/CheckPoint",
  },
];

export const sections = [
  { id: "top", label: "Top" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "book", label: "Book a call" },
  { id: "contact", label: "Contact" },
];
