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

export function getAlternative(slug: string): Alternative | undefined {
  if (slug === "laya") return withFactDates(layaCompareAsAlternative());
  const alt = alternatives[slug as AlternativeSlug];
  return alt ? withFactDates(alt) : undefined;
}
