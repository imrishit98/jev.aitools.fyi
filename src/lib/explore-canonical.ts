import { CATEGORY_SLUGS, type CategorySlug } from "@/data/types";

/**
 * When explore is filtered only by category (and optional page), canonical should match `/categories/<slug>`.
 */
export function categoryCanonicalFromExploreParams(
  params: URLSearchParams,
): string | null {
  const category = params.get("category");
  if (!category || !CATEGORY_SLUGS.includes(category as CategorySlug)) {
    return null;
  }
  for (const [key, value] of params.entries()) {
    if (key === "category" || key === "page") continue;
    if (value) return null;
  }
  return `/categories/${category}`;
}
