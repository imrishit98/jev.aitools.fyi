import { categories as base } from "./categories-data";

export { CATEGORY_SLUGS } from "./types";
export type { CategoryMeta } from "./types";
export const categories = base;

export function getCategory(slug: string) {
  return base.find((c) => c.slug === slug);
}
