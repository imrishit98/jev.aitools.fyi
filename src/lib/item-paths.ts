import type { CategorySlug, DirectoryItem } from "@/data/types";
import { itemHasDetailPage } from "@/lib/content-policy";
import type { EnrichedDirectoryItem } from "@/lib/content-policy";

/**
 * URL segment for detail pages (pass 2 IA).
 * official + sdks share `/sdks/`; integrations + agent-tooling share `/tools/`;
 * browser-computer-use + applications + playgrounds share `/apps/`.
 */
export type ItemDetailSegment =
  | "sdks"
  | "tools"
  | "apps"
  | "games"
  | "benchmarks"
  | "guides";

const CATEGORY_TO_SEGMENT: Record<CategorySlug, ItemDetailSegment> = {
  official: "sdks",
  sdks: "sdks",
  integrations: "tools",
  "agent-tooling": "tools",
  "browser-computer-use": "apps",
  applications: "apps",
  playgrounds: "apps",
  games: "games",
  benchmarks: "benchmarks",
  guides: "guides",
};

export const ITEM_DETAIL_SEGMENTS: ItemDetailSegment[] = [
  "sdks",
  "tools",
  "apps",
  "games",
  "benchmarks",
  "guides",
];

export function getItemDetailSegment(
  category: CategorySlug,
): ItemDetailSegment {
  return CATEGORY_TO_SEGMENT[category];
}

export function getItemPath(
  item: Pick<DirectoryItem, "slug" | "category">,
): string {
  const segment = getItemDetailSegment(item.category);
  return `/${segment}/${item.slug}`;
}

export function hrefForListing(
  item: Pick<EnrichedDirectoryItem, "slug" | "category" | "url" | "indexOnly">,
): string {
  if (!itemHasDetailPage(item)) {
    return item.url;
  }
  return getItemPath(item);
}

export function legacyItemPath(slug: string): string {
  return `/items/${slug}`;
}

export function redirectTargetForLegacyItem(
  item: Pick<EnrichedDirectoryItem, "slug" | "category" | "url" | "indexOnly">,
): string {
  if (!itemHasDetailPage(item)) {
    return item.url;
  }
  return getItemPath(item);
}

export function itemBelongsOnSegment(
  item: Pick<DirectoryItem, "category">,
  segment: ItemDetailSegment,
): boolean {
  return getItemDetailSegment(item.category) === segment;
}
