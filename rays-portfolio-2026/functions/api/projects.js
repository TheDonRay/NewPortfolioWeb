/**
 * Cloudflare Pages Function — GET /api/projects
 * Lists TheDonRay's public repos tagged with the `portfolio` topic,
 * with their top languages. Cached at the edge for an hour.
 */

const USER = "TheDonRay";
const TAG = "portfolio";
const TTL = 3600;

export async function onRequestGet({ request, env, waitUntil }) {
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return hit;

  const headers = {
    Accept: "application/vnd.github+json",
    // GitHub rejects requests without a User-Agent
    "User-Agent": "rayat-portfolio",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

  const gh = (path) =>
    fetch(`https://api.github.com${path}`, { headers }).then((r) => {
      if (!r.ok) throw new Error(`GitHub ${r.status} on ${path}`);
      return r.json();
    });

  try {
    const repos = await gh(`/users/${USER}/repos?per_page=100&sort=pushed`);
    const tagged = repos.filter(
      (r) => !r.fork && (r.topics || []).includes(TAG),
    );

    const projects = await Promise.all(
      tagged.map(async (r) => {
        const langs = await gh(`/repos/${USER}/${r.name}/languages`);
        return {
          name: r.name,
          description: r.description || "",
          url: r.html_url,
          homepage: r.homepage || "",
          topics: r.topics.filter((t) => t !== TAG),
          languages: Object.entries(langs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name]) => name),
          stars: r.stargazers_count,
          pushedAt: r.pushed_at,
        };
      }),
    );

    const res = Response.json(projects, {
      headers: { "Cache-Control": `public, max-age=${TTL}` },
    });
    waitUntil(cache.put(request, res.clone()));
    return res;
  } catch (err) {
    // Not cached, so the next request retries GitHub
    return Response.json({ error: err.message }, { status: 502 });
  }
}
