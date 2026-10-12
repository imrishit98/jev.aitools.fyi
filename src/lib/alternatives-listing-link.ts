import { alternativePath, type AlternativeSlug } from "@/data/alternatives-slugs";

const LISTING_TO_ALTERNATIVE: Record<string, AlternativeSlug | "/alternatives"> = {
  "cloudflare-clef": "cloudflare-clef",
  "jaredpalmer-kev": "kev",
  "perplexity-pplx-decider": "perplexity-pplx-decider",
  "fastino-gliner-decide": "fastino-gliner-decide",
  "contrastive-lm-clm-8b": "clm-8b",
  "liquidai-d1-3b": "liquid-d1",
  "openai-decisions-api": "openai-decisions-api",
  "mapika-decider": "mapika-decider",
  "theoleecj-semif": "semif",
  "wfzyx-von": "von",
  "tianyucodings-nanojev": "/alternatives",
  "nokia-applied-research-anyjev": "/alternatives",
  "featherless-simple-jev": "/alternatives",
  "posthog-jeeves": "/alternatives",
};

const DISTINCT_LABELS: Record<string, string> = {
  "cloudflare-clef": "Clef vs Jev: Workers AI pricing and Decision Index",
  "jaredpalmer-kev": "Kev vs Jev comparison (migration and benchmarks)",
  "perplexity-pplx-decider": "pplx-decider vs Jev: 27B open weights and hosted API",
  "fastino-gliner-decide": "GLiNER Decide vs Jev: compact encoder routing",
  "contrastive-lm-clm-8b": "CLM-8B vs Jev: contrastive Qwen3 decision heads",
  "liquidai-d1-3b": "Liquid d1 vs Jev: LFM decision checkpoints",
  "openai-decisions-api": "OpenAI Decisions API vs TypeSafe Jev (beta)",
  "mapika-decider": "Decider vs Jev: Mapika checkpoints and serve path",
  "theoleecj-semif": "SemIf vs Jev: open-model logit server",
  "wfzyx-von": "Von vs Jev: local encoder comparison",
  "tianyucodings-nanojev": "Browse ranked Jev alternatives (NanoJev is a runners-up)",
  "nokia-applied-research-anyjev": "Jev alternatives hub (AnyJev is a toolkit, not a single model page)",
  "featherless-simple-jev": "Jev alternatives hub (compare hosted Jev to open classifiers)",
  "posthog-jeeves": "Jev alternatives hub (Jeeves is a separate open checkpoint)",
};

export function alternativeComparisonHref(listingSlug: string): string | undefined {
  const target = LISTING_TO_ALTERNATIVE[listingSlug];
  if (!target) return undefined;
  if (target === "/alternatives") return target;
  return alternativePath(target);
}

export function alternativeComparisonLabel(listingSlug: string): string {
  return DISTINCT_LABELS[listingSlug] ?? "See Jev alternatives ranked";
}
