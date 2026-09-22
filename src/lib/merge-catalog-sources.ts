import type { DirectoryItem } from "@/data/types";

/**
 * Merge primary catalog rows with supplement rows (cool-finds, manual adds).
 * Same slug in both layers becomes one listing; supplement fields win on conflict.
 */
export function mergeCatalogSources(
  primary: DirectoryItem[],
  supplement: DirectoryItem[],
): DirectoryItem[] {
  const bySlug = new Map<string, DirectoryItem>();

  for (const item of primary) {
    bySlug.set(item.slug, item);
  }
  for (const item of supplement) {
    const existing = bySlug.get(item.slug);
    bySlug.set(item.slug, existing ? { ...existing, ...item } : item);
  }

  const seen = new Set<string>();
  const merged: DirectoryItem[] = [];

  for (const item of primary) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    merged.push(bySlug.get(item.slug)!);
  }
  for (const item of supplement) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    merged.push(bySlug.get(item.slug)!);
  }

  return merged;
}
