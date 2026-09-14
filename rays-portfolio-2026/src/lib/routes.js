import { lazy } from "react";

/* Route chunks. The home page is bundled eagerly (it's the landing view and
   the LCP that matters); everything else splits out and is warmed on idle, so
   a click never waits on a network round-trip. */
const loaders = {
  "/AboutMe": () => import("../components/aboutme.jsx"),
  "/ContactMe": () => import("../components/contactme.jsx"),
  "/BookCall": () => import("../components/bookcall.jsx"),
};

export const AboutMe = lazy(loaders["/AboutMe"]);
export const ContactMe = lazy(loaders["/ContactMe"]);
export const BookCall = lazy(loaders["/BookCall"]);

const warmed = new Set();

/** Pull a route's chunk ahead of navigation. Safe to call repeatedly. */
export function prefetchRoute(path) {
  if (warmed.has(path)) return;
  const load = loaders[path];
  if (!load) return;
  warmed.add(path);
  load();
}

/** Warm every route once the main thread is free. */
export function prefetchAllRoutes() {
  for (const path of Object.keys(loaders)) prefetchRoute(path);
}
