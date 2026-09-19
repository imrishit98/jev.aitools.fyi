import { items } from "@/data/items/index";
import type { CategorySlug, DirectoryItem, ItemBadge } from "@/data/types";

export type SortOption = "featured" | "stars" | "newest" | "title";

export type ExploreFilters = {
  category?: CategorySlug;
  language?: string;
  hasDemo?: boolean;
  hasRepo?: boolean;
  hasMcp?: boolean;
  officialOnly?: boolean;
  featuredOnly?: boolean;
  sourcePlatform?: DirectoryItem["sourcePlatform"];
  q?: string;
  sort?: SortOption;
};

export const EXPLORE_PAGE_SIZE = 48;

export function getAllItems(): DirectoryItem[] {
  return items;
}

export function getItemBySlug(slug: string): DirectoryItem | undefined {
  return items.find((i) => i.slug === slug);
}

export function getItemsByCategory(category: CategorySlug): DirectoryItem[] {
  return items.filter((i) => i.category === category);
}

export function getFeaturedItems(limit = 12): DirectoryItem[] {
  return items.filter((i) => i.featured || i.badges?.includes("featured")).slice(0, limit);
}

export function getRelatedItems(item: DirectoryItem, limit = 4): DirectoryItem[] {
  return items
    .filter(
      (i) =>
        i.slug !== item.slug &&
        (i.category === item.category ||
          i.tags.some((t) => item.tags.includes(t))),
    )
    .slice(0, limit);
}

export function getCategoryCounts(): Record<CategorySlug, number> {
  const counts = {} as Record<CategorySlug, number>;
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  return counts;
}

export function getDirectoryStats() {
  const all = items;
  const totalStars = all.reduce((sum, i) => sum + (i.stars ?? 0), 0);
  return {
    total: all.length,
    withRepo: all.filter((i) => i.repoUrl).length,
    withDemo: all.filter((i) => i.demoUrl).length,
    withMcp: all.filter((i) => i.badges?.includes("mcp")).length,
    categories: new Set(all.map((i) => i.category)).size,
    featured: all.filter((i) => i.featured || i.badges?.includes("featured")).length,
    languages: getUniqueLanguages().length,
    totalStars,
  };
}

export function getUniqueLanguages(): string[] {
  const langs = new Set<string>();
  for (const item of items) {
    if (item.language) langs.add(item.language);
  }
  return [...langs].sort((a, b) => a.localeCompare(b));
}

export function hasBadge(item: DirectoryItem, badge: ItemBadge) {
  return item.badges?.includes(badge) ?? false;
}

export function filterItems(
  filters: ExploreFilters,
  source: DirectoryItem[] = items,
): DirectoryItem[] {
  let result = [...source];
  const q = filters.q?.trim().toLowerCase();

  if (filters.category) {
    result = result.filter((i) => i.category === filters.category);
  }
  if (filters.language) {
    result = result.filter(
      (i) => i.language?.toLowerCase() === filters.language?.toLowerCase(),
    );
  }
  if (filters.hasDemo) {
    result = result.filter((i) => Boolean(i.demoUrl));
  }
  if (filters.hasRepo) {
    result = result.filter((i) => Boolean(i.repoUrl));
  }
  if (filters.hasMcp) {
    result = result.filter((i) => hasBadge(i, "mcp"));
  }
  if (filters.officialOnly) {
    result = result.filter(
      (i) => i.category === "official" || hasBadge(i, "official"),
    );
  }
  if (filters.featuredOnly) {
    result = result.filter((i) => i.featured || hasBadge(i, "featured"));
  }
  if (filters.sourcePlatform) {
    result = result.filter((i) => i.sourcePlatform === filters.sourcePlatform);
  }
  if (q) {
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.oneLiner.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.creatorHandle?.toLowerCase().includes(q),
    );
  }

  const sort = filters.sort ?? "featured";
  result.sort((a, b) => {
    if (sort === "featured") {
      const af = a.featured || hasBadge(a, "featured") ? 1 : 0;
      const bf = b.featured || hasBadge(b, "featured") ? 1 : 0;
      if (af !== bf) return bf - af;
      return (b.stars ?? 0) - (a.stars ?? 0);
    }
    if (sort === "stars") return (b.stars ?? 0) - (a.stars ?? 0);
    if (sort === "newest") {
      return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
    }
    return a.title.localeCompare(b.title);
  });

  return result;
}

export function searchItems(query: string, limit = 12): DirectoryItem[] {
  return filterItems({ q: query, sort: "featured" }).slice(0, limit);
}

export function parseExploreFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): ExploreFilters {
  const get = (k: string) => {
    const v = params instanceof URLSearchParams ? params.get(k) : params[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const category = get("category") as CategorySlug | undefined;
  return {
    category,
    language: get("language") ?? undefined,
    hasDemo: get("demo") === "1",
    hasRepo: get("repo") === "1",
    hasMcp: get("mcp") === "1",
    officialOnly: get("official") === "1",
    featuredOnly: get("featured") === "1",
    sourcePlatform: get("platform") as ExploreFilters["sourcePlatform"],
    q: get("q") ?? undefined,
    sort: (get("sort") as SortOption) ?? "featured",
  };
}
