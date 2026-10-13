/** Editorial dates for sitemap lastmod and JSON-LD. Not filesystem mtimes. */

import metrics from "@/data/alternatives-metrics.json";
import type { AlternativeSlug } from "@/data/alternatives-slugs";

export const LISTING_LASTMOD_FALLBACK = "2026-09-19";
export const CONTENT_CHECKED = "2026-09-30";

const TOUCHED = "2026-09-30";
const GUIDE_PRIOR = "2026-09-26";
const STATIC_PRIOR = "2026-09-23";

export const staticRouteDates: Record<string, string> = {
  "/": TOUCHED,
  "/explore": STATIC_PRIOR,
  "/showcase": TOUCHED,
  "/learn": TOUCHED,
  "/guides": TOUCHED,
  "/submit": STATIC_PRIOR,
  "/about": STATIC_PRIOR,
  "/contact": STATIC_PRIOR,
  "/privacy": "2026-10-05",
  "/privacy/archive": "2026-09-22",
  "/terms": "2026-10-05",
  "/your-privacy-choices": "2026-10-05",
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

export function layaCompareLastVerified(): string {
  return metrics.pageLastVerified["laya-compare"];
}

export function layaGuideDate(slug: string): string {
  if (slug === "compare") return layaCompareLastVerified();
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

export function alternativeHubDate(): string {
  return metrics.pageLastVerified.hub;
}

export function alternativeGuideDate(slug: AlternativeSlug): string {
  const day = metrics.pageLastVerified[slug];
  if (!day) throw new Error(`pageLastVerified missing for alternative slug: ${slug}`);
  return day;
}

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
