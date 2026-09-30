/** Editorial dates for sitemap lastmod and JSON-LD. Not filesystem mtimes. */

export const LISTING_LASTMOD_FALLBACK = "2026-09-19";
export const CONTENT_CHECKED = "2026-09-30";

const TOUCHED = "2026-09-30";
const GUIDE_PRIOR = "2026-09-26";
const STATIC_PRIOR = "2026-09-23";

export const staticRouteDates: Record<string, string> = {
  "/": STATIC_PRIOR,
  "/explore": STATIC_PRIOR,
  "/showcase": TOUCHED,
  "/learn": TOUCHED,
  "/guides": TOUCHED,
  "/submit": STATIC_PRIOR,
  "/about": STATIC_PRIOR,
  "/contact": STATIC_PRIOR,
  "/privacy": STATIC_PRIOR,
  "/developers": STATIC_PRIOR,
  "/for-agents": STATIC_PRIOR,
  "/demos/my-first-million": STATIC_PRIOR,
};

export function learnGuideDate(_slug: string): string {
  return TOUCHED;
}

const LAYA_TOUCHED = new Set([
  "compare",
  "what-is-laya",
  "migration-and-coexistence",
]);

export function layaGuideDate(slug: string): string {
  return LAYA_TOUCHED.has(slug) ? TOUCHED : GUIDE_PRIOR;
}

export const layaHubDate = TOUCHED;

const AGENT_TOUCHED = new Set([
  "hermes",
  "claude-code-desktop-cowork",
  "codex-and-opencode",
  "langchain-langgraph",
  "browser-computer-use",
]);

export function agentGuideDate(slug: string): string {
  return AGENT_TOUCHED.has(slug) ? TOUCHED : GUIDE_PRIOR;
}

export const agentHubDate = TOUCHED;

const CATEGORY_TOUCHED = new Set([
  "sdks",
  "integrations",
  "agent-tooling",
  "browser-computer-use",
  "playgrounds",
  "guides",
  "applications",
]);

export function categoryEditorialDate(slug: string): string {
  return CATEGORY_TOUCHED.has(slug) ? TOUCHED : STATIC_PRIOR;
}

export function parseIsoDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

export function formatIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
