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
    items: ["TypeScript", "JavaScript", "Python", "C++", "SQL", "HTML"],
  },
  {
    label: "Frameworks & libraries",
    items: ["Node.js", "Express.js", "React.js", "Tailwind CSS", "Drupal CMS"],
  },
  {
    label: "APIs & integrations",
    items: ["REST APIs", "GraphQL", "OpenAI API", "Stripe", "JWT"],
  },
  {
    label: "Databases",
    items: ["MongoDB", "MySQL"],
  },
  {
    label: "Cloud & DevOps",
    items: [
      "GCP",
      "Cloud Run",
      "Artifact Registry",
      "IAM",
      "Docker",
      "Vercel",
      "Cloudflare",
      "Railway",
    ],
  },
  {
    label: "Testing & QA",
    items: [
      "Jest",
      "Playwright",
      "Postman",
      "Load Testing",
      "k6",
      "QMetry",
      "Charles Proxy",
      "HTTPie",
    ],
  },
  {
    label: "Developer tools",
    items: ["Git", "GitHub", "GitHub Actions", "Jira", "NPM"],
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
      "Launched paid checkout with Stripe, enabling secure transaction processing through authenticated sessions and webhook fulfillment, allowing users to complete payments seamlessly.",
      "Improved API reliability across 5 REST endpoints, measured by p95 latency and failure rates, by load testing with k6 and Postman.",
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
      "Led pre- and post-release smoke and regression testing for Android and Roku platforms using QMetry, certifying 3 apps across 4 release trains and identifying 8+ defects before production.",
      "Audited 6+ CMS-driven pages against backend configuration using staging checks, preventing misconfigured content from reaching production.",
      "Debugged streaming playback failures using Charles Proxy and HTTP log analysis, preventing playback issues across 3 NBC releases.",
      "Consolidated 35+ legacy test cases into 17 QMetry test plans, cutting regression maintenance by 50%.",
    ],
  },
];

// Curated copy keyed by GitHub repo name. Live repos tagged `portfolio`
// (via /api/projects) pick up blurb/points/stack from here when names match;
// this list is also the fallback when the API is unreachable.
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
    ],
    points: [
      "Built a property lookup API using a TypeScript service layer over RentCast, returning 15+ structured data points.",
      "Automated CI/CD using Cloud Build and commit-tagged Docker images, deploying to GCP Cloud Run on every push.",
      "Reduced invalid-input failures reaching paid RentCast and OpenAI APIs by adding request-parameter validation and layered error handling across the analysis controller and external API service.",
    ],
    href: "https://github.com/TheDonRay/PropertyAnalyzer",
  },
  {
    name: "CheckPoint",
    blurb:
      "A request validation layer for Express — parse, sanitize, load, and authorize before anything touches the database.",
    stack: [
      "Node.js",
      "Express.js",
      "NPM",
      "Docker",
      "Postman (Load Testing)",
      "GCP Cloud Run",
    ],
    points: [
      "Built a Node.js data validation layer with custom middleware for parsing, sanitization, data loading, and authorization, ensuring requests are validated before database access.",
      "Generated MongoDB seed data to test custom middleware across endpoint requests and query types, ensuring API validation behaved as expected through Postman.",
      "Verified API stability under real-world traffic, processing 300+ requests without a single failure, by load testing with 100 concurrent users in Postman.",
    ],
    href: "https://github.com/TheDonRay/CheckPoint",
  },
  {
    name: "Memoria",
    blurb:
      "A MERN memory journal that turns your camera roll into an explorable timeline of photos, notes, and places.",
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Clerk",
      "Cloudinary",
      "Postman",
    ],
    points: [
      "Built a layered Express backend split into routes, controllers, and services, exposing authenticated CRUD endpoints for creating, retrieving, updating, and deleting user memories.",
      "Secured every memory route with Clerk authentication middleware and Google SSO, rejecting unsigned requests with a 401 before they reach the database.",
      "Implemented signed Cloudinary uploads scoped to each user's folder and restricted to approved image formats, keeping the API secret on the server.",
    ],
    href: "https://github.com/TheDonRay/Memoria",
  },
  {
    name: "MoodyFoodz",
    blurb:
      "An AI restaurant recommender that reads your mood and preferences, then suggests nearby places to eat with directions.",
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "Claude API",
      "Google Maps API",
      "Docker",
      "GCP Cloud Run",
      "Cloudflare",
    ],
    points: [
      "Built an Express recommendation service that geocodes a user's address and searches nearby restaurants through the Google Maps Geocoding and Places APIs.",
      "Integrated the Anthropic Claude API to rank the top 5 restaurants by mood, cuisine, and dietary preferences, parsing structured JSON responses with error handling for invalid output.",
      "Containerized the backend with Docker and deployed it to GCP Cloud Run, with the React frontend hosted on Cloudflare Pages.",
    ],
    href: "https://github.com/TheDonRay/MoodyFoodz",
  },
  {
    name: "Relifio",
    blurb:
      "An AI emotional-support platform that turns conversations into “life chapters” you can revisit over time.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB Atlas", "OpenAI API", "Vercel"],
    points: [
      "Built REST endpoints in Express for user sign-up, AI conversations, and conversation summaries, persisting each session's messages in MongoDB Atlas.",
      "Integrated the OpenAI API to generate supportive responses and summarize full sessions into chapters users can revisit.",
      "Added request validation and error handling for missing session IDs and messages, returning clear 400-level errors before any database or AI calls.",
    ],
    href: "https://github.com/TheDonRay/Relifio",
  },
  {
    name: "Loader",
    blurb:
      "A learning project on how backends behave under real traffic — a simple REST API over a large seeded dataset, measured with data.",
    stack: ["Node.js", "Express.js", "MongoDB Atlas", "Docker", "k6", "AWS"],
    points: [
      "Built a Node.js and Express REST API over a seeded MongoDB product and review dataset, with a service layer kept separate from request handling.",
      "Implemented both offset (skip/limit) and cursor-based pagination to compare how query cost grows with page depth.",
      "Wrote a reproducible seeding script using Faker with a fixed seed, deterministic ObjectIds, and batched inserts, configurable up to millions of documents.",
    ],
    href: "https://github.com/TheDonRay/Loader",
  },
];

// GitHub repos tagged `portfolio` that should not appear on the site.
export const hiddenProjects = ["AggregationPipeline", "MedSy"];

export const sections = [
  { id: "top", label: "Top" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "book", label: "Book a call" },
  { id: "contact", label: "Contact" },
];
