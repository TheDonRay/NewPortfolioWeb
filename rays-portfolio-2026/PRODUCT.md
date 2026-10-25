# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- Recruiters and engineering managers hiring for backend internships and new-grad roles. They skim experience, projects, and skills, then reach out or book a call.
- Prospective freelance clients who want something built. They look at shipped projects and book a call.

## Product Purpose

Personal portfolio for Rayat Chowdhury, a CS senior at Hunter College (graduating May 2027) focused on backend engineering: Node/Express services, REST APIs, Docker, GCP. Success is a visitor booking a call, emailing, or opening the resume or a GitHub project.

## Positioning

A backend engineer with real production internship work (FlowState, NBCUniversal) and deployed, documented APIs, presented by the person himself in his own voice ("bootleg Tony Stark").

## Capabilities and Constraints

- Single-page React 19 + Vite site, hosted on Cloudflare Pages. Server code lives in Pages Functions (`functions/api/projects.js`), not Vercel `/api`.
- Projects are pulled live from GitHub repos tagged `portfolio` via `/api/projects`, with curated copy in `src/data/content.js` as override and fallback.
- Book a call uses a Cal.com inline embed (`rayat/meeting`, 30 min), lazy-loaded near the viewport, with a direct Cal.com fallback link.
- All copy lives in `src/data/content.js`; skills, experience and projects mirror `public/resume.pdf`.
- Legacy routes `/AboutMe` and `/ContactMe` redirect to section anchors.
- Sections: About, Skills, Experience, Projects, Book a call, Contact; sticky nav with active-section tracking; resume link.

## Brand Commitments

- Visual references the user made binding for the 2026 redesign live in `reference/` (untracked): a dark cinematic stage, huge uppercase grotesk headline split across the frame, refined small UI with a pill CTA carrying a status dot, and a generative dotted line field.
- First-person, casual, a little self-deprecating voice.

## Evidence on Hand

- Resume: `public/resume.pdf`. Portrait/avatar: `public/man.png`.
- Two internships and two curated projects (PropertyAnalyzer, CheckPoint). No testimonials, client logos, or metrics beyond those in the resume; do not invent any.

## Product Principles

1. Every path ends in a way to reach Rayat: call, email, resume, GitHub.
2. Real work over adjectives: show the shipped thing and what it did.
3. Fast first paint; heavy embeds load only when needed.
