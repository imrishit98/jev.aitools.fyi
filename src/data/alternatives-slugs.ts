export const alternativeSlugs = [
  "cloudflare-clef",
  "kev",
  "openai-decisions-api",
  "perplexity-pplx-decider",
  "mapika-decider",
  "fastino-gliner-decide",
  "semif",
  "clm-8b",
  "liquid-d1",
  "von",
] as const;

export type AlternativeSlug = (typeof alternativeSlugs)[number];

export function alternativePath(slug: AlternativeSlug): string {
  return `/alternatives/${slug}`;
}
