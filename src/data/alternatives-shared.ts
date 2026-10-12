import metrics from "@/data/alternatives-metrics.json";
import type { AlternativeFact, AlternativeSource } from "@/data/alternatives-types";

export const alternativesMetrics = metrics;

export const alternativesLastVerified = metrics.snapshotDate;

export function alternativeHubLastVerified(): string {
  return metrics.pageLastVerified.hub;
}

export function alternativePageLastVerified(slug: keyof typeof metrics.pageLastVerified): string {
  const row = metrics.pageLastVerified[slug];
  if (!row) throw new Error(`alternatives-metrics pageLastVerified missing key: ${slug}`);
  return row;
}

const diEdition = metrics.decisionIndex.edition;
const diGenerated = metrics.decisionIndex.generatedUtc.slice(0, 10);

export function decisionIndexLabel(
  scoreKey: keyof typeof metrics.decisionIndexFullScores | null,
  fallback = "Not listed on Decision Index public board for this edition",
): string {
  if (!scoreKey) return fallback;
  const row = metrics.decisionIndexFullScores[scoreKey];
  return `${row.v} (Decision Index ${diEdition}, snapshot ${diGenerated}; independent harness, not vendor-only)`;
}

export function jevDecisionIndex(): string {
  return decisionIndexLabel("jev");
}

export function jevHostedPrice(): string {
  const row = metrics.hostedPricingPerMInputUsd["typesafe-jev"];
  return `$${row.value} per M input tokens (vendor list, ${row.checkedAt})`;
}

export function jevHostedPriceSource(): { label: string; url: string; checkedAt: string } {
  const row = metrics.hostedPricingPerMInputUsd["typesafe-jev"];
  return {
    label: "TypeSafe models page (jev-1.13.0 price table)",
    url: row.sourceUrl,
    checkedAt: row.checkedAt,
  };
}

export function jevDecisionIndexSource(): { label: string; url: string; checkedAt: string } {
  return {
    label: `Decision Index ${diEdition} public snapshot`,
    url: metrics.decisionIndex.sourceUrl,
    checkedAt: metrics.decisionIndex.checkedAt,
  };
}

export function hostedPricePerM(slug: keyof typeof metrics.hostedPricingPerMInputUsd): string {
  const row = metrics.hostedPricingPerMInputUsd[slug];
  const label = "label" in row && row.label ? `${row.label}: ` : "";
  const amount = Number(row.value);
  const formatted = Number.isFinite(amount) ? amount.toFixed(2) : String(row.value);
  return `${label}$${formatted} per M input tokens (vendor list, ${row.checkedAt})`;
}

export function githubAdoption(repo: keyof typeof metrics.github): string {
  const row = metrics.github[repo];
  return `${row.stars.toLocaleString("en-US")} GitHub stars (${row.checkedAt})`;
}

export function hfAdoption(repo: keyof typeof metrics.huggingface): string {
  const row = metrics.huggingface[repo];
  const license = "license" in row && row.license ? `, ${row.license}` : "";
  return `${row.downloads.toLocaleString("en-US")} HF downloads${license} (${row.checkedAt})`;
}

export const jevSystemOneFacts: AlternativeFact[] = [
  {
    row: "API shape",
    them: "Varies by product (see each page)",
    jev: "POST /v1/systemone with parallel Choice, Score, Noul questions",
    sourceLabel: "TypeSafe API reference",
    sourceUrl: "https://docs.typesafe.ai/api",
    checkedAt: alternativesLastVerified,
  },
  {
    row: "Hosted price (input)",
    them: "See each alternative",
    jev: jevHostedPrice(),
    sourceLabel: jevHostedPriceSource().label,
    sourceUrl: jevHostedPriceSource().url,
    checkedAt: jevHostedPriceSource().checkedAt,
  },
  {
    row: "Decision Index (public)",
    them: "See each alternative",
    jev: jevDecisionIndex(),
    sourceLabel: jevDecisionIndexSource().label,
    sourceUrl: jevDecisionIndexSource().url,
    checkedAt: jevDecisionIndexSource().checkedAt,
  },
];

export const jevMigrationSnippet = `// Before: hosted Jev
const client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });
await client.systemone({ model: "jev-latest", state, questions });

// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)
const client = new TypeSafe({ baseURL: "http://localhost:8000" });
await client.systemone({ model: "kev-latest", state, questions });`;

export const typesafeDocsSource: AlternativeSource = {
  label: "TypeSafe docs: System One / Jev API",
  url: "https://docs.typesafe.ai",
};

export const decisionIndexSource: AlternativeSource = {
  label: "Decision Index public snapshot (edition " + diEdition + ")",
  url: metrics.decisionIndex.sourceUrl,
};

export function siblingSlugs(all: readonly string[], slug: string): string[] {
  return all.filter((s) => s !== slug);
}
