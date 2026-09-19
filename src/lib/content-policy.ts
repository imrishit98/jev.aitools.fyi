import { getCategory } from "@/data/categories";
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
  if (item.verifiedNote || item.sourceNote) score += 1;
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
  return [
    item.description,
    item.verifiedNote,
    item.sourceNote,
    item.editorialBlurb,
  ]
    .filter(Boolean)
    .join(" ")
    .trim().length;
}

function categoryEditorialTail(item: DirectoryItem): string {
  const cat = getCategory(item.category);
  const tagHint =
    item.tags.length > 0
      ? ` Tags here skew toward ${item.tags.slice(0, 3).join(", ")}.`
      : "";
  const repoHint = item.repoUrl
    ? " Clone the repository for install steps, env vars, and issue history."
    : " Use the primary link for the author's current setup notes.";
  const demoHint = item.demoUrl
    ? " Try the live demo when you want to validate behavior before wiring Jev yourself."
    : "";

  switch (item.category) {
    case "official":
      return `${repoHint}${demoHint} Official TypeSafe surfaces document System One primitives (Choice, Score, Noul) and the POST /v1/systemone contract.`;
    case "sdks":
      return `${repoHint}${demoHint} Community SDKs wrap the same typed question API: structured state in, calibrated probabilities out.${tagHint}`;
    case "integrations":
      return `${repoHint}${demoHint} Integrations embed Jev into gateways, agents, or platforms so evaluate paths stay typed instead of free-form chat.${tagHint}`;
    case "agent-tooling":
      return `${repoHint}${demoHint} Agent tooling uses Jev for routing, compaction, MCP gates, or review loops where thresholds beat prose parsing.${tagHint}`;
    case "browser-computer-use":
      return `${repoHint}${demoHint} Browser and desktop automation listings pick actions with discrete Jev choices rather than open-ended generation.${tagHint}`;
    case "applications":
      return `${repoHint}${demoHint} Application listings ship user-facing flows where Jev handles moderation, triage, trading gates, or verification.${tagHint}`;
    case "games":
      return `${repoHint}${demoHint} Game and sim listings treat Jev as a move picker: parallel questions, fast turns, visible confidence.${tagHint}`;
    case "playgrounds":
      return `${repoHint}${demoHint} Playgrounds expose Choice, Score, and Noul in the browser so you can sanity-check probabilities quickly.${tagHint}`;
    case "benchmarks":
      return `${repoHint}${demoHint} Benchmark entries compare latency, calibration, or accuracy against other decision baselines.${tagHint}`;
    case "guides":
      return `${repoHint} Guides and essays add context around launches, comparisons, or workflows. They are link-first write-ups, not TypeSafe-authored docs.${tagHint}`;
    default:
      return `${repoHint}${demoHint} Jev is TypeSafe's System One model for software decisions, not a conversational LLM.${tagHint}`;
  }
}

export function buildEditorialBlurb(item: DirectoryItem): string {
  if (item.editorialBlurb?.trim()) return item.editorialBlurb.trim();

  const catTitle = getCategory(item.category)?.title ?? item.category;
  const lead = `"${item.title}" is catalogued under ${catTitle} on jev.aitools.fyi. ${item.oneLiner}`;
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
