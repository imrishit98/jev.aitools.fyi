/** Editorial dates for sitemap lastmod and JSON-LD. Not filesystem mtimes. */

import metrics from "@/data/alternatives-metrics.json";
import manifestJson from "@/data/lastmod-manifest.json";
import type { AlternativeSlug } from "@/data/alternatives-slugs";
import {
  LEGAL_LAST_UPDATED_ISO,
  PRIVACY_POLICY_LAST_UPDATED_ISO,
} from "@/lib/legal";

export const LISTING_LASTMOD_FALLBACK = "2026-09-19";
export const CONTENT_CHECKED = "2026-09-30";

const TOUCHED = "2026-09-30";
const GUIDE_PRIOR = "2026-09-26";
const STATIC_PRIOR = "2026-09-23";

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

type ManifestEntry = { hash: string; lastmod: string };

const manifest = manifestJson as Record<string, ManifestEntry>;
const pageLastVerified = metrics.pageLastVerified as Record<string, string>;

/**
 * Sitemap and JSON-LD dates for the policy pages. The manifest still stores
 * the content hash. The served lastmod is the same ISO constant as the
 * visible "Last updated" line.
 */
export const legalLockedLastmod: Record<string, string> = {
  "/privacy": PRIVACY_POLICY_LAST_UPDATED_ISO,
  "/terms": LEGAL_LAST_UPDATED_ISO,
  "/your-privacy-choices": LEGAL_LAST_UPDATED_ISO,
};

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

const LAYA_TOUCHED = new Set([
  "compare",
  "what-is-laya",
  "migration-and-coexistence",
]);

const AGENT_TOUCHED = new Set([
  "hermes",
  "claude-code-desktop-cowork",
  "codex-and-opencode",
  "langchain-langgraph",
  "browser-computer-use",
]);

/** Refresh dates for guides edited after the shared TOUCHED day. Other slugs stay on TOUCHED or GUIDE_PRIOR. */
const AGENT_GUIDE_DATE_OVERRIDES: Record<string, string> = {
  hermes: "2026-10-17",
  "github-copilot-agent": "2026-10-17",
};

/** Manifest date for a sitemap path, or undefined when the path is absent or the day is invalid. */
export function manifestLastmod(path: string): string | undefined {
  const key = path === "" ? "/" : path;
  const entry = manifest[key];
  if (!entry || typeof entry.lastmod !== "string") return undefined;
  if (!ISO_DAY.test(entry.lastmod)) return undefined;
  return entry.lastmod;
}

/**
 * Previous editorial dates. Used when a path is missing from the manifest.
 * Does not read the clock.
 */
export function fallbackLastmod(path: string): string {
  const normalized = path === "" ? "/" : path;
  if (Object.prototype.hasOwnProperty.call(staticRouteDates, normalized)) {
    return staticRouteDates[normalized]!;
  }
  if (normalized === "/learn/laya-vs-jev") return TOUCHED;
  if (normalized.startsWith("/learn/laya-vs-jev/")) {
    const slug = normalized.slice("/learn/laya-vs-jev/".length);
    if (slug === "compare") return pageLastVerified["laya-compare"]!;
    return LAYA_TOUCHED.has(slug) ? TOUCHED : GUIDE_PRIOR;
  }
  if (normalized.startsWith("/learn/")) return TOUCHED;
  if (normalized === "/guides/jev-with-ai-agents") return TOUCHED;
  if (normalized.startsWith("/guides/jev-with-ai-agents/")) {
    const slug = normalized.slice("/guides/jev-with-ai-agents/".length);
    return (
      AGENT_GUIDE_DATE_OVERRIDES[slug] ??
      (AGENT_TOUCHED.has(slug) ? TOUCHED : GUIDE_PRIOR)
    );
  }
  if (normalized === "/alternatives") return pageLastVerified.hub!;
  if (normalized.startsWith("/alternatives/")) {
    const slug = normalized.slice("/alternatives/".length);
    const day = pageLastVerified[slug];
    if (!day) throw new Error(`pageLastVerified missing for alternative slug: ${slug}`);
    return day;
  }
  if (normalized.startsWith("/categories/")) {
    return categoryEditorialDate(normalized.slice("/categories/".length));
  }
  return STATIC_PRIOR;
}

function dated(path: string): string {
  const normalized = path === "" ? "/" : path;
  const locked = legalLockedLastmod[normalized];
  if (locked) return locked;
  return manifestLastmod(normalized) ?? fallbackLastmod(normalized);
}

export function staticPageDate(path: string): string {
  return dated(path === "" ? "/" : path);
}

export function learnGuideDate(slug: string): string {
  return dated(`/learn/${slug}`);
}

export function layaCompareLastVerified(): string {
  return pageLastVerified["laya-compare"]!;
}

export function layaGuideDate(slug: string): string {
  return dated(`/learn/laya-vs-jev/${slug}`);
}

export const layaHubDate = dated("/learn/laya-vs-jev");

export function agentGuideDate(slug: string): string {
  return dated(`/guides/jev-with-ai-agents/${slug}`);
}

export const agentHubDate = dated("/guides/jev-with-ai-agents");

export function alternativeHubDate(): string {
  return dated("/alternatives");
}

export function alternativeGuideDate(slug: AlternativeSlug): string {
  return dated(`/alternatives/${slug}`);
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

export function categoryPageDate(slug: string): string {
  return dated(`/categories/${slug}`);
}

export function parseIsoDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

export function formatIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
