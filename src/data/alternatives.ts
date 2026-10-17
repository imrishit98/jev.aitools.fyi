import type { Alternative } from "@/data/alternatives-types";
import { alternativesHub } from "@/data/alternatives-hub";
import { layaCompareAsAlternative } from "@/data/alternatives-laya";
import { alternatives } from "@/data/alternatives-pages";
import {
  alternativePath,
  alternativeSlugs,
  type AlternativeSlug,
} from "@/data/alternatives-slugs";
import {
  alternativesLastVerified,
  alternativeHubLastVerified,
  alternativePageLastVerified,
} from "@/data/alternatives-shared";
import { resolveAlternativeFacts, resolveLayaFact } from "@/data/alternative-fact-sources";

export {
  alternativesLastVerified,
  alternativeHubLastVerified,
  alternativePageLastVerified,
  alternativeSlugs,
  alternativePath,
  type AlternativeSlug,
};
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

function prepareAlternative(alt: Alternative, lastVerified: string): Alternative {
  const slug = alt.slug as AlternativeSlug;
  const facts =
    slug === "laya"
      ? alt.facts.map((f) => resolveLayaFact(f))
      : resolveAlternativeFacts(slug, alt.facts);
  return withFactDates({ ...alt, facts, lastVerified });
}

export function lastVerifiedForAlternativeSlug(slug: string): string {
  if (slug === "laya") return alternativePageLastVerified("laya-compare");
  return alternativePageLastVerified(slug as keyof typeof import("@/data/alternatives-metrics.json").pageLastVerified);
}

export function getAlternative(slug: string): Alternative | undefined {
  if (slug === "laya") {
    return prepareAlternative(layaCompareAsAlternative(), alternativePageLastVerified("laya-compare"));
  }
  const alt = alternatives[slug as AlternativeSlug];
  return alt ? prepareAlternative(alt, alternativePageLastVerified(slug as AlternativeSlug)) : undefined;
}
