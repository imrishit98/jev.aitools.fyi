import {
  getProductProfile as getProfile,
  measureProductProfileBodyChars,
  productProfilesBySlug,
  type ProductProfile,
  type ProductProfileFaq,
} from "@/data/product-profiles";
import type { LearnGuideSlug } from "@/data/learn-guides";
import { getDemoById, type ShowcaseDemo } from "@/data/showcase-demos";
import type { DirectoryItem } from "@/data/types";

export type { ProductProfile, ProductProfileFaq };

function stripEmDash(text: string): string {
  return text
    .replace(/\u2014/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getProductProfile(slug: string): ProductProfile | undefined {
  return getProfile(slug);
}

export { measureProductProfileBodyChars };

export function hasProductProfile(slug: string): boolean {
  return Boolean(productProfilesBySlug[slug]);
}

export function getAllProductProfileSlugs(): string[] {
  return Object.keys(productProfilesBySlug).filter(
    (slug) => productProfilesBySlug[slug]?.status === "published",
  );
}

export function getProductProfilesForItems(
  source: DirectoryItem[] = [],
): { item: DirectoryItem; profile: ProductProfile }[] {
  const slugs = new Set(getAllProductProfileSlugs());
  return source
    .filter((item) => slugs.has(item.slug))
    .map((item) => ({
      item,
      profile: productProfilesBySlug[item.slug]!,
    }));
}

export function getFeaturedProductSlugs(limit = 6): string[] {
  const ordered = [
    "classifier-dev",
    "browser-use-jev-ultrafast",
    "ploy-ai",
    "tanstack-ai-decide",
    "vercel-eve",
    "tamaratran-fast-jev-compaction",
    "kushwho-jev-codes",
  ];
  return ordered.filter((s) => productProfilesBySlug[s]).slice(0, limit);
}

export function getDemosForProfile(profile: ProductProfile): ShowcaseDemo[] {
  const ids = profile.demoIds ?? [];
  return ids
    .map((id) => getDemoById(id))
    .filter((d): d is ShowcaseDemo => Boolean(d));
}

export function productProfileSeoDescription(profile: ProductProfile): string {
  if (profile.metaDescription) {
    return stripEmDash(profile.metaDescription);
  }
  return stripEmDash(
    `${profile.overview} ${profile.howJevIsUsed}`.replace(/\s+/g, " ").trim(),
  );
}

export function productProfileSeoTitle(
  item: DirectoryItem,
  profile: ProductProfile,
): string {
  if (profile.metaTitle) return stripEmDash(profile.metaTitle);
  return stripEmDash(`${item.title}: Jev product profile`);
}

export function getRelatedLearnSlugs(
  profile: ProductProfile,
): LearnGuideSlug[] {
  return profile.relatedLearnSlugs ?? [];
}
