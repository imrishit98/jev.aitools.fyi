import {
  categoryEnrichmentBySlug,
  type CategoryEnrichment,
} from "@/data/category-enrichment";
import type { CategorySlug } from "@/data/types";

export function getCategoryEnrichment(
  slug: CategorySlug,
): CategoryEnrichment | undefined {
  return categoryEnrichmentBySlug[slug];
}

export function measureCategoryEnrichmentChars(slug: CategorySlug): number {
  const e = getCategoryEnrichment(slug);
  if (!e) return 0;
  const parts = [
    e.whoItsFor,
    e.howToChoose,
    ...e.sections.flatMap((s) => [s.heading, s.body]),
    ...e.highlights.flatMap((h) => [h.blurb]),
    ...(e.startHere?.links.flatMap((l) => [l.label, l.suffix]) ?? []),
    ...e.faq.flatMap((f) => [f.question, f.answer]),
  ];
  return parts.join(" ").trim().length;
}
