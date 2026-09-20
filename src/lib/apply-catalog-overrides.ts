import marketingOverrides from "@/data/catalog-marketing-overrides.json";
import type { DirectoryItem } from "@/data/types";

const ATTRIBUTION_RE = /awesomejev|indexed from|sourced from/i;

type MarketingPatch = Partial<
  Pick<DirectoryItem, "oneLiner" | "description" | "editorialBlurb" | "title">
>;

const overridesBySlug = marketingOverrides as Record<string, MarketingPatch>;

export function applyCatalogOverrides(source: DirectoryItem[]): DirectoryItem[] {
  return source.map((item) => {
    const next: DirectoryItem = { ...item };
    const patch = overridesBySlug[item.slug];
    if (patch) {
      Object.assign(next, patch);
    }

    if (next.verifiedNote && ATTRIBUTION_RE.test(next.verifiedNote)) {
      delete next.verifiedNote;
    }
    if (next.sourceNote && ATTRIBUTION_RE.test(next.sourceNote)) {
      delete next.sourceNote;
    }

    return next;
  });
}
