import { getCategory } from "@/data/categories";
import type { DirectoryItem } from "@/data/types";
import { hrefForListing } from "@/lib/item-paths";
import type { EnrichedDirectoryItem } from "@/lib/content-policy";

export type SearchIndexEntry = {
  slug: string;
  title: string;
  oneLiner: string;
  description: string;
  tags: string[];
  category: string;
  categoryLabel: string;
  creatorHandle: string | null;
  href: string;
  featured: boolean;
};

export function buildSearchIndexEntries(
  source: EnrichedDirectoryItem[],
): SearchIndexEntry[] {
  return source.map((item) => ({
    slug: item.slug,
    title: item.title,
    oneLiner: item.oneLiner,
    description: item.description,
    tags: item.tags ?? [],
    category: item.category,
    categoryLabel: getCategory(item.category)?.title ?? item.category,
    creatorHandle: item.creatorHandle ?? null,
    href: hrefForListing(item),
    featured: Boolean(item.featured || item.badges?.includes("featured")),
  }));
}

function entryHaystack(entry: SearchIndexEntry): string {
  return [
    entry.title,
    entry.oneLiner,
    entry.description,
    entry.category,
    entry.categoryLabel,
    entry.creatorHandle,
    ...entry.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function searchIndexEntries(
  entries: SearchIndexEntry[],
  query: string,
  limit = 12,
): SearchIndexEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const matches = entries.filter((entry) => {
    const haystack = entryHaystack(entry);
    return tokens.every((token) => haystack.includes(token));
  });

  matches.sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    return a.title.localeCompare(b.title);
  });

  return matches.slice(0, limit);
}

/** Shared text match for explore filters (same fields as the search index). */
export function listingMatchesQuery(
  item: Pick<
    DirectoryItem,
    "title" | "oneLiner" | "description" | "tags" | "category" | "creatorHandle"
  >,
  query: string,
): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const categoryLabel = getCategory(item.category)?.title ?? item.category;
  const haystack = [
    item.title,
    item.oneLiner,
    item.description,
    item.category,
    categoryLabel,
    item.creatorHandle,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}
