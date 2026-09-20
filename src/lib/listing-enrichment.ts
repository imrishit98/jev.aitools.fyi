import {
  listingEnrichmentBySlug,
  type ListingEnrichment,
} from "@/data/listing-enrichment";

export function getListingEnrichment(slug: string): ListingEnrichment | undefined {
  return listingEnrichmentBySlug[slug];
}

export function measureListingEnrichmentChars(slug: string): number {
  const e = getListingEnrichment(slug);
  if (!e) return 0;
  const parts = [
    e.jevUsageSummary ?? "",
    e.setupNotes ?? "",
    e.caveats ?? "",
    ...e.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ...(e.faq ?? []).flatMap((f) => [f.question, f.answer]),
  ];
  return parts.join(" ").trim().length;
}
