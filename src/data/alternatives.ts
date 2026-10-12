import type { Alternative, AlternativesHub } from "@/data/alternatives-types";
import { alternativesHub } from "@/data/alternatives-hub";
import { layaCompareAsAlternative } from "@/data/alternatives-laya";
import { alternatives } from "@/data/alternatives-pages";
import {
  alternativePath,
  alternativeSlugs,
  type AlternativeSlug,
} from "@/data/alternatives-slugs";
import { alternativesLastVerified } from "@/data/alternatives-shared";
import { resolveAlternativeFacts, resolveLayaFact } from "@/data/alternative-fact-sources";
import { sanitizeAlternativeSections } from "@/lib/alternative-section-sanitize";

export { alternativesLastVerified, alternativeSlugs, alternativePath, type AlternativeSlug };
export { alternativesHub, alternatives, layaCompareAsAlternative };

function withFactDates(alt: Alternative): Alternative {
  return {
    ...alt,
    facts: alt.facts.map((fact) => ({
      ...fact,
      checkedAt: fact.checkedAt ?? alt.lastVerified,
    })),
  };
}

function prepareAlternative(alt: Alternative): Alternative {
  const slug = alt.slug as AlternativeSlug;
  const facts =
    slug === "laya"
      ? alt.facts.map((f) => resolveLayaFact(f))
      : resolveAlternativeFacts(slug, alt.facts);
  const sections = sanitizeAlternativeSections(slug, alt.summary, alt.sections);
  return withFactDates({ ...alt, facts, sections });
}

export function getAlternative(slug: string): Alternative | undefined {
  if (slug === "laya") return prepareAlternative(layaCompareAsAlternative());
  const alt = alternatives[slug as AlternativeSlug];
  return alt ? prepareAlternative(alt) : undefined;
}
