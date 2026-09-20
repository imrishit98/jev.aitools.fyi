import { getCategory } from "@/data/categories";
import { getHandwrittenEditorialBlurb } from "@/data/editorial-blurbs";
import type { DirectoryItem } from "@/data/types";

/** Target unique body length on kept detail pages (description + notes + editorial). */
export const DETAIL_PAGE_MIN_BODY_CHARS = 400;

export type ContentPolicyStats = {
  catalogTotal: number;
  detailPageCount: number;
  indexOnlyCount: number;
  demotedDuplicates: number;
};

export type EnrichedDirectoryItem = DirectoryItem & {
  /** Resolved after policy: true means no category detail route (explore-only). */
  indexOnly: boolean;
  /** Auto or catalog editorial copy for thin but kept detail pages. */
  editorialBlurb?: string;
};

function richSignalScore(item: DirectoryItem): number {
  let score = 0;
  if (item.demoUrl) score += 2;
  if (item.repoUrl && item.repoUrl !== item.url) score += 1;
  if (item.postUrl) score += 1;
  if (item.updatedAt) score += 1;
  if ((item.badges?.length ?? 0) > 0) score += 1;
  if ((item.tags?.length ?? 0) >= 4) score += 1;
  return score;
}

function isHighSignal(item: DirectoryItem): boolean {
  return Boolean(
    item.featured ||
      item.badges?.includes("featured") ||
      item.badges?.includes("official") ||
      item.category === "official" ||
      (item.stars ?? 0) >= 400,
  );
}

function descriptionKey(description: string): string {
  return description.trim().toLowerCase().slice(0, 160);
}

function keeperScore(item: DirectoryItem): number {
  let score = (item.description ?? "").trim().length;
  score += richSignalScore(item) * 40;
  if (item.featured) score += 500;
  if (isHighSignal(item)) score += 200;
  score += Math.min(item.stars ?? 0, 5000);
  return score;
}

/** Slugs demoted because another listing shares the same overview text. */
export function buildDuplicateDemotionSet(source: DirectoryItem[]): Set<string> {
  const groups = new Map<string, DirectoryItem[]>();
  for (const item of source) {
    const key = descriptionKey(item.description ?? "");
    if (key.length < 24) continue;
    const bucket = groups.get(key) ?? [];
    bucket.push(item);
    groups.set(key, bucket);
  }

  const demote = new Set<string>();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => keeperScore(b) - keeperScore(a));
    for (let i = 1; i < sorted.length; i++) {
      demote.add(sorted[i]!.slug);
    }
  }
  return demote;
}

/**
 * Rubric (see docs/seo-content-policy.md):
 * Keep a detail page when copy or signals are strong enough to earn indexing.
 */
export function computeIndexOnly(
  item: DirectoryItem,
  duplicateDemotions: Set<string>,
): boolean {
  if (item.detailPage === true) return false;
  if (item.indexOnly === true) return true;

  if (duplicateDemotions.has(item.slug)) return true;

  const desc = (item.description ?? "").trim();
  const descLen = desc.length;

  if (item.featured || item.badges?.includes("featured")) {
    if (descLen >= 40) return false;
  }

  const rich = richSignalScore(item);
  const highSignal = isHighSignal(item);

  if (descLen >= 400) return false;
  if (descLen >= 200 && rich >= 2) return false;
  if (highSignal && descLen >= 80) return false;
  if (rich >= 3 && descLen >= 100) return false;
  if (item.demoUrl && descLen >= 80) return false;
  if (item.repoUrl && (item.stars ?? 0) >= 100 && descLen >= 90) return false;
  if (item.category === "sdks" && item.repoUrl && descLen >= 120) return false;
  if (descLen >= 150 && rich >= 1) return false;

  return true;
}

export function measureDetailBodyChars(item: DirectoryItem): number {
  return [item.description, item.editorialBlurb]
    .filter(Boolean)
    .join(" ")
    .trim().length;
}

function categoryEditorialTail(item: DirectoryItem): string {
  const tagHint =
    item.tags.length > 0
      ? ` Common tags: ${item.tags.slice(0, 3).join(", ")}.`
      : "";
  const repoHint = item.repoUrl
    ? " Grab the repo for install steps, env vars, and recent commits."
    : " Follow the primary link for the author's latest setup notes.";
  const demoHint = item.demoUrl
    ? " Open the demo when you want proof before you npm install anything."
    : "";

  switch (item.category) {
    case "official":
      return `${repoHint}${demoHint} Canonical TypeSafe docs for Choice, Score, Noul, and POST /v1/systemone.`;
    case "sdks":
      return `${repoHint}${demoHint} Same System One API, idiomatic wrappers in your language.${tagHint}`;
    case "integrations":
      return `${repoHint}${demoHint} Glue for gateways, agents, and platforms that should stay typed, not chatty.${tagHint}`;
    case "agent-tooling":
      return `${repoHint}${demoHint} Routers, MCP, compaction, and review gates where probabilities beat regex on LLM output.${tagHint}`;
    case "browser-computer-use":
      return `${repoHint}${demoHint} Next click or keypress as a Choice over a finite action list.${tagHint}`;
    case "applications":
      return `${repoHint}${demoHint} Shipped flows: moderation, triage, trading, verification, and other real traffic.${tagHint}`;
    case "games":
      return `${repoHint}${demoHint} Moves picked by Jev, confidence visible every turn. Great teaching demos.${tagHint}`;
    case "playgrounds":
      return `${repoHint}${demoHint} Click through Choice, Score, and Noul in the browser before you wire billing code.${tagHint}`;
    case "benchmarks":
      return `${repoHint}${demoHint} Harnesses and replicas for latency, calibration, and head-to-head baselines.${tagHint}`;
    case "guides":
      return `${repoHint} Essays and lists from builders. Link-first reading, not a substitute for docs.typesafe.ai.${tagHint}`;
    default:
      return `${repoHint}${demoHint} Jev is TypeSafe's System One decision model: structured state in, thresholdable probabilities out.${tagHint}`;
  }
}

export function buildEditorialBlurb(item: DirectoryItem): string {
  if (item.editorialBlurb?.trim()) return item.editorialBlurb.trim();

  const handwritten = getHandwrittenEditorialBlurb(item.slug);
  if (handwritten) return handwritten;

  const catTitle = getCategory(item.category)?.title ?? item.category;
  const lead = `${item.oneLiner} Listed under ${catTitle} in Jev Directory so you can compare repos, demos, and maintenance signals fast.`;
  return `${lead} ${categoryEditorialTail(item)}`.replace(/\s+/g, " ").trim();
}

export function resolveContentPolicy(
  source: DirectoryItem[],
): EnrichedDirectoryItem[] {
  const duplicateDemotions = buildDuplicateDemotionSet(source);

  return source.map((item) => {
    const indexOnly = computeIndexOnly(item, duplicateDemotions);
    if (indexOnly) {
      return { ...item, indexOnly: true };
    }

    let editorialBlurb = item.editorialBlurb;
    const bodyChars = measureDetailBodyChars({ ...item, editorialBlurb });
    if (bodyChars < DETAIL_PAGE_MIN_BODY_CHARS) {
      editorialBlurb = buildEditorialBlurb(item);
    }

    return {
      ...item,
      indexOnly: false,
      editorialBlurb,
    };
  });
}

export function itemHasDetailPage(
  item: Pick<EnrichedDirectoryItem, "indexOnly">,
): boolean {
  return !item.indexOnly;
}

export function summarizeContentPolicy(
  items: EnrichedDirectoryItem[],
  duplicateDemotions: Set<string>,
): ContentPolicyStats {
  return {
    catalogTotal: items.length,
    detailPageCount: items.filter((i) => !i.indexOnly).length,
    indexOnlyCount: items.filter((i) => i.indexOnly).length,
    demotedDuplicates: duplicateDemotions.size,
  };
}
