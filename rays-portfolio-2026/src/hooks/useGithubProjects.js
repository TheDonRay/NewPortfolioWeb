import { useEffect, useState } from "react";
import { projects as curated } from "../data/content";

// GitHub topics are kebab-case slugs; these read better as proper names.
const LABELS = {
  "rest-api": "REST API",
  restapi: "REST API",
  api: "API",
  aws: "AWS",
  "aws-s3": "AWS S3",
  gcp: "GCP",
  graphql: "GraphQL",
  "graphql-api": "GraphQL",
  "graphql-server": "GraphQL",
  mongodb: "MongoDB",
  "mongodb-atlas": "MongoDB Atlas",
  nodejs: "Node.js",
  expressjs: "Express.js",
  typescript: "TypeScript",
  javascript: "JavaScript",
  docker: "Docker",
  react: "React",
  openai: "OpenAI API",
  "ai-tools": "AI",
  "ai-assistant": "AI",
};

const label = (slug) =>
  LABELS[slug] ||
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

function toCard(repo) {
  const override = curated.find((p) => p.name === repo.name);
  const stack = [
    ...new Set([...repo.languages, ...repo.topics.map(label)]),
  ];
  return {
    name: repo.name,
    blurb: override?.blurb || repo.description,
    points: override?.points || [],
    stack: override?.stack || stack,
    href: repo.url,
    homepage: repo.homepage,
  };
}

/**
 * Projects tagged `portfolio` on GitHub, via the /api/projects Pages
 * Function. Starts from (and falls back to) the curated list in content.js.
 */
export default function useGithubProjects() {
  const [projects, setProjects] = useState(curated);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/projects", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((repos) => {
        if (Array.isArray(repos) && repos.length) {
          setProjects(repos.map(toCard));
        }
      })
      .catch(() => {
        // Plain `vite` dev has no /api, and GitHub can fail; keep curated.
      });
    return () => ctrl.abort();
  }, []);

  return projects;
}
