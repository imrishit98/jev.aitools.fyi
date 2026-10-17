import type { AlternativeFact } from "@/data/alternatives-types";
import type { AlternativeSlug } from "@/data/alternatives-slugs";
import { NOT_PUBLISHED_LABEL } from "@/lib/alternative-fact-display";
import {
  jevDecisionIndexSource,
  jevHostedPriceSource,
  alternativesMetrics,
  githubAdoption,
  hfAdoption,
  githubAndHfAdoption,
  decisionIndexLabel,
  hostedPricePerM,
  jevHostedPrice,
  jevDecisionIndex,
} from "@/data/alternatives-shared";

const TYPESAFE_PRIVACY = "https://docs.typesafe.ai/privacy";
const DI_JSON = alternativesMetrics.decisionIndex.sourceUrl;

type ProductSources = {
  vendorHome: string;
  vendorLabel: string;
  license?: { url: string; label: string };
  pricing?: { url: string; label: string };
  api?: { url: string; label: string };
  weights?: { url: string; label: string };
  github?: { url: string; label: string };
  adoption?: { url: string; label: string };
};

const ADOPTION_REPOS: Partial<
  Record<AlternativeSlug, { github: keyof typeof alternativesMetrics.github; hf: keyof typeof alternativesMetrics.huggingface }>
> = {
  kev: { github: "jaredpalmer/kev", hf: "jaredpalmer/kev-4b" },
  "mapika-decider": { github: "Mapika/decider", hf: "Mapika/decider-2b" },
  "clm-8b": { github: "Contrastive-LM/CLM", hf: "Contrastive-LM/CLM-v0.1-8B" },
  von: { github: "wfzyx/von", hf: "wfzyx/von" },
};

const FIRST_RELEASE_SOURCE: Partial<Record<AlternativeSlug, { url: string; label: string }>> = {
  "cloudflare-clef": {
    url: "https://developers.cloudflare.com/workers-ai/models/clef/",
    label: "Cloudflare clef model page",
  },
  semif: { url: "https://github.com/TheoLeeCJ/SemIf-OpenJev", label: "GitHub: SemIf-OpenJev README" },
  "openai-decisions-api": {
    url: "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877",
    label: "OpenAI Decisions API beta announcement",
  },
};

const BY_SLUG: Record<AlternativeSlug, ProductSources> = {
  "cloudflare-clef": {
    vendorHome: "https://developers.cloudflare.com/workers-ai/models/clef/",
    vendorLabel: "Cloudflare Workers AI: clef",
    license: { url: "https://huggingface.co/Cloudflare/clef", label: "Hugging Face: Cloudflare/clef" },
    pricing: { url: "https://developers.cloudflare.com/workers-ai/models/clef/", label: "Cloudflare clef pricing" },
    api: { url: "https://developers.cloudflare.com/workers-ai/models/clef/", label: "Cloudflare clef model page" },
    weights: { url: "https://huggingface.co/Cloudflare/clef", label: "Hugging Face weights card" },
    adoption: { url: "https://huggingface.co/Cloudflare/clef", label: "Hugging Face download stats" },
  },
  kev: {
    vendorHome: "https://github.com/jaredpalmer/kev",
    vendorLabel: "GitHub: jaredpalmer/kev",
    license: { url: "https://github.com/jaredpalmer/kev#license", label: "Kev README license" },
    api: { url: "https://github.com/jaredpalmer/kev#usage", label: "Kev README usage" },
    weights: { url: "https://huggingface.co/jaredpalmer/kev-4b", label: "Hugging Face: kev-4b" },
    github: { url: "https://github.com/jaredpalmer/kev", label: "GitHub: jaredpalmer/kev" },
    adoption: { url: "https://huggingface.co/jaredpalmer/kev-4b", label: "Hugging Face: kev-4b" },
  },
  "openai-decisions-api": {
    vendorHome: "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877",
    vendorLabel: "OpenAI community: Decisions API beta",
    pricing: {
      url: "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877",
      label: "OpenAI Decisions API beta post",
    },
    api: {
      url: "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877",
      label: "OpenAI Decisions API beta post",
    },
  },
  "perplexity-pplx-decider": {
    vendorHome: "https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b",
    vendorLabel: "Hugging Face: pplx-decider-v1.1-27b",
    license: { url: "https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b", label: "HF model card license" },
    pricing: {
      url: "https://community.perplexity.ai/t/pplx-decider-v1-1-27b-our-updated-open-weights-multimodal-decision-model-is-now-available/6286",
      label: "Perplexity community pricing thread",
    },
    api: { url: "https://docs.perplexity.ai/api-reference/decisions-post", label: "Perplexity Decisions API reference" },
    weights: { url: "https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b", label: "HF model card" },
    adoption: { url: "https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b", label: "HF model card stats" },
  },
  "mapika-decider": {
    vendorHome: "https://github.com/Mapika/decider",
    vendorLabel: "GitHub: Mapika/decider",
    license: { url: "https://github.com/Mapika/decider#license", label: "decider README" },
    api: { url: "https://github.com/Mapika/decider#serve", label: "decider.serve docs" },
    weights: { url: "https://huggingface.co/Mapika/decider-2b", label: "Hugging Face: decider-2b" },
    github: { url: "https://github.com/Mapika/decider", label: "GitHub: Mapika/decider" },
    adoption: { url: "https://huggingface.co/Mapika/decider-2b", label: "HF decider-2b stats" },
  },
  "fastino-gliner-decide": {
    vendorHome: "https://huggingface.co/fastino/GLiNER2.5-Decide",
    vendorLabel: "Hugging Face: GLiNER2.5-Decide",
    license: { url: "https://huggingface.co/fastino/GLiNER2.5-Decide", label: "HF model card" },
    api: { url: "https://huggingface.co/fastino/GLiNER2.5-Decide", label: "HF model card usage" },
    weights: { url: "https://huggingface.co/fastino/GLiNER2.5-Decide", label: "HF model card" },
    adoption: { url: "https://huggingface.co/fastino/GLiNER2.5-Decide", label: "HF download stats" },
  },
  semif: {
    vendorHome: "https://github.com/TheoLeeCJ/SemIf-OpenJev",
    vendorLabel: "GitHub: SemIf-OpenJev",
    license: { url: "https://github.com/TheoLeeCJ/SemIf-OpenJev", label: "SemIf README" },
    api: { url: "https://github.com/TheoLeeCJ/SemIf-OpenJev", label: "SemIf README" },
    github: { url: "https://github.com/TheoLeeCJ/SemIf-OpenJev", label: "GitHub stars" },
    adoption: { url: "https://github.com/TheoLeeCJ/SemIf-OpenJev", label: "GitHub stars" },
  },
  "clm-8b": {
    vendorHome: "https://github.com/Contrastive-LM/CLM",
    vendorLabel: "GitHub: Contrastive-LM/CLM",
    license: { url: "https://huggingface.co/Contrastive-LM/CLM-v0.1-8B", label: "HF CLM-v0.1-8B card" },
    api: { url: "https://github.com/Contrastive-LM/CLM", label: "CLM repository" },
    weights: { url: "https://huggingface.co/Contrastive-LM/CLM-v0.1-8B", label: "HF weights card" },
    github: { url: "https://github.com/Contrastive-LM/CLM", label: "GitHub: Contrastive-LM/CLM" },
    adoption: { url: "https://huggingface.co/Contrastive-LM/CLM-v0.1-8B", label: "HF stats" },
  },
  "liquid-d1": {
    vendorHome: "https://huggingface.co/LiquidAI/d1-3B",
    vendorLabel: "Hugging Face: LiquidAI/d1-3B",
    license: { url: "https://huggingface.co/LiquidAI/d1-3B", label: "HF model card (LFM license)" },
    api: { url: "https://huggingface.co/LiquidAI/d1-3B", label: "HF model card" },
    weights: { url: "https://huggingface.co/LiquidAI/d1-3B", label: "HF weights card" },
    adoption: { url: "https://huggingface.co/LiquidAI/d1-3B", label: "HF download stats" },
  },
  von: {
    vendorHome: "https://github.com/wfzyx/von",
    vendorLabel: "GitHub: wfzyx/von",
    license: { url: "https://huggingface.co/wfzyx/von", label: "HF von card" },
    api: { url: "https://github.com/wfzyx/von", label: "Von README" },
    weights: { url: "https://huggingface.co/wfzyx/von", label: "HF weights card" },
    github: { url: "https://github.com/wfzyx/von", label: "GitHub: wfzyx/von" },
    adoption: { url: "https://huggingface.co/wfzyx/von", label: "HF download stats" },
  },
};

export function isBareFactSource(url: string): boolean {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    if (!path || path === "") return true;
    if (u.hostname === "github.com" && path.split("/").filter(Boolean).length === 0) return true;
    if (u.hostname === "docs.typesafe.ai" && (path === "" || path === "/")) return true;
    return false;
  } catch {
    return true;
  }
}

/** Competitor-only rows must not cite bare TypeSafe docs root. */
export function isInvalidCompetitorFactSource(slug: AlternativeSlug, fact: AlternativeFact, url: string): boolean {
  if (isBareFactSource(url)) return true;
  try {
    const u = new URL(url);
    const jevOnlyRows = new Set([
      "Hosted price (input)",
      "Data handling",
    ]);
    const sharedRows = new Set(["Decision Index (public)"]);
    if (sharedRows.has(fact.row)) return false;
    if (jevOnlyRows.has(fact.row) && u.hostname === "docs.typesafe.ai") return false;
    if (u.hostname === "docs.typesafe.ai" && !jevOnlyRows.has(fact.row)) {
      const themLower = fact.them.toLowerCase();
      if (!themLower.includes("typesafe") && !themLower.includes("hosted jev")) {
        return pathIsTypesafeRoot(u);
      }
    }
  } catch {
    return true;
  }
  return false;
}

function pathIsTypesafeRoot(u: URL): boolean {
  const path = u.pathname.replace(/\/$/, "");
  return path === "" || path === "/";
}

function resolveRow(slug: AlternativeSlug, fact: AlternativeFact): AlternativeFact {
  const src = BY_SLUG[slug];
  const row = fact.row;
  let sourceUrl: string;
  let sourceLabel: string;
  let secondarySourceUrl: string | undefined;
  let secondarySourceLabel: string | undefined;
  let them = fact.them;
  let jev = fact.jev;

  const jevPrice = jevHostedPriceSource();
  const jevDi = jevDecisionIndexSource();

  if (row === "Maker") {
    sourceUrl = src.vendorHome;
    sourceLabel = src.vendorLabel;
  } else if (row === "License / access") {
    sourceUrl = src.license?.url ?? src.weights?.url ?? src.vendorHome;
    sourceLabel = src.license?.label ?? src.vendorLabel;
    if (row.includes("License") && !src.license && !src.weights) {
      them = NOT_PUBLISHED_LABEL;
    }
  } else if (row === "Hosted price (input)" || row.startsWith("clef-flash hosted price")) {
    if (row.startsWith("clef-flash")) {
      sourceUrl = "https://developers.cloudflare.com/workers-ai/models/clef-flash/";
      sourceLabel = "Cloudflare clef-flash pricing";
    } else if (src.pricing) {
      sourceUrl = src.pricing.url;
      sourceLabel = src.pricing.label;
    } else if (them.toLowerCase().includes("self-host") || them.toLowerCase().includes("self-host only")) {
      them = NOT_PUBLISHED_LABEL;
      sourceUrl = src.weights?.url ?? src.vendorHome;
      sourceLabel = src.weights?.label ?? src.vendorLabel;
    } else {
      them = NOT_PUBLISHED_LABEL;
      sourceUrl = src.vendorHome;
      sourceLabel = src.vendorLabel;
    }
    if (jev.includes("$0.042")) {
      sourceUrl = jevPrice.url;
      sourceLabel = "TypeSafe models price table (Jev column)";
    }
  } else if (row === "API shape" || row === "Question types" || row === "Inputs") {
    sourceUrl = src.api?.url ?? src.vendorHome;
    sourceLabel = src.api?.label ?? src.vendorLabel;
    if (jev.includes("/v1/systemone")) {
      // Keep competitor source for "them"; Jev claim backed by TypeSafe API page in label footnote
      if (row === "API shape") {
        sourceLabel = `${sourceLabel}; Jev: TypeSafe API reference`;
      }
    }
  } else if (row === "Model sizes") {
    if (!src.weights?.url) {
      them = NOT_PUBLISHED_LABEL;
      sourceUrl = src.vendorHome;
      sourceLabel = src.vendorLabel;
    } else {
      sourceUrl = src.weights.url;
      sourceLabel = src.weights.label;
    }
  } else if (row === "Latency") {
    them = NOT_PUBLISHED_LABEL;
    jev = NOT_PUBLISHED_LABEL;
    sourceUrl = src.vendorHome;
    sourceLabel = `${src.vendorLabel} (no published p95 SLA cited)`;
  } else if (row === "Decision Index (public)" || row.includes("Decision Index")) {
    sourceUrl = DI_JSON;
    sourceLabel = jevDi.label;
  } else if (row === "Data handling") {
    if (slug === "cloudflare-clef") {
      sourceUrl = "https://developers.cloudflare.com/workers-ai/privacy/";
      sourceLabel = "Cloudflare Workers AI privacy";
    } else if (slug === "openai-decisions-api") {
      sourceUrl = "https://openai.com/policies/privacy-policy";
      sourceLabel = "OpenAI privacy policy";
    } else if (
      ["kev", "mapika-decider", "semif", "clm-8b", "von", "fastino-gliner-decide", "liquid-d1"].includes(slug)
    ) {
      them = NOT_PUBLISHED_LABEL;
      sourceUrl = src.github?.url ?? src.vendorHome;
      sourceLabel = "Self-hosted data handling not published on a single vendor page";
    } else {
      sourceUrl = TYPESAFE_PRIVACY;
      sourceLabel = "TypeSafe privacy policy (Jev column)";
    }
  } else if (row === "SDKs") {
    sourceUrl = src.api?.url ?? src.github?.url ?? src.vendorHome;
    sourceLabel = src.api?.label ?? src.vendorLabel;
  } else if (row === "Adoption signal") {
    const dual = ADOPTION_REPOS[slug];
    if (dual) {
      them = githubAndHfAdoption(dual.github, dual.hf);
      sourceUrl = `https://github.com/${dual.github}`;
      sourceLabel = "GitHub repository (stars)";
      secondarySourceUrl = `https://huggingface.co/${dual.hf}`;
      secondarySourceLabel = "Hugging Face model card (downloads)";
    } else if (slug === "cloudflare-clef") {
      them = hfAdoption("Cloudflare/clef");
      sourceUrl = "https://huggingface.co/Cloudflare/clef";
      sourceLabel = "Hugging Face: Cloudflare/clef";
    } else if (slug === "perplexity-pplx-decider") {
      them = hfAdoption("perplexity-ai/pplx-decider-v1.1-27b");
      sourceUrl = "https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b";
      sourceLabel = "Hugging Face model card";
    } else if (slug === "fastino-gliner-decide") {
      them = hfAdoption("fastino/GLiNER2.5-Decide");
      sourceUrl = "https://huggingface.co/fastino/GLiNER2.5-Decide";
      sourceLabel = "Hugging Face model card";
    } else if (slug === "liquid-d1") {
      them = hfAdoption("LiquidAI/d1-3B");
      sourceUrl = "https://huggingface.co/LiquidAI/d1-3B";
      sourceLabel = "Hugging Face model card";
    } else if (slug === "semif") {
      them = githubAdoption("TheoLeeCJ/SemIf-OpenJev");
      sourceUrl = "https://github.com/TheoLeeCJ/SemIf-OpenJev";
      sourceLabel = "GitHub: SemIf-OpenJev (stars)";
    } else if (slug === "openai-decisions-api") {
      them = NOT_PUBLISHED_LABEL;
      sourceUrl = src.vendorHome;
      sourceLabel = src.vendorLabel;
    } else {
      sourceUrl = src.adoption?.url ?? src.github?.url ?? src.weights?.url ?? src.vendorHome;
      sourceLabel = src.adoption?.label ?? src.vendorLabel;
    }
    if (row === "Adoption signal" && jev.includes("Vendor hosted")) {
      jev = NOT_PUBLISHED_LABEL;
    }
  } else if (row === "First public release") {
    const release = FIRST_RELEASE_SOURCE[slug];
    if (release) {
      sourceUrl = release.url;
      sourceLabel = release.label;
    } else {
      sourceUrl = src.github?.url ?? src.weights?.url ?? src.vendorHome;
      sourceLabel = src.github?.label ?? src.vendorLabel;
    }
  } else if (!isBareFactSource(fact.sourceUrl) && !isInvalidCompetitorFactSource(slug, fact, fact.sourceUrl)) {
    return { ...fact, them, jev, sourceUrl: fact.sourceUrl, sourceLabel: fact.sourceLabel };
  } else {
    sourceUrl = src.vendorHome;
    sourceLabel = src.vendorLabel;
  }

  if (row === "Hosted price (input)" && jev.includes("TypeSafe")) {
    // Dual-topic row: prefer vendor pricing URL when "them" is priced
    if (src.pricing && !them.includes(NOT_PUBLISHED_LABEL)) {
      sourceUrl = src.pricing.url;
      sourceLabel = src.pricing.label;
    }
  }

  if (isBareFactSource(sourceUrl) || isInvalidCompetitorFactSource(slug, { ...fact, them, jev }, sourceUrl)) {
    sourceUrl = src.vendorHome;
    sourceLabel = src.vendorLabel;
  }

  // Sync hosted price / DI rows from metrics for Jev column consistency
  if (row === "Hosted price (input)" && jev.includes("$0.042")) {
    jev = jevHostedPrice();
    sourceUrl = jevPrice.url;
    sourceLabel = jevPrice.label;
  }
  if (row === "Decision Index (public)" || row.includes("Decision Index")) {
    const scoreKeys: Partial<Record<AlternativeSlug, keyof typeof alternativesMetrics.decisionIndexFullScores>> = {
      "cloudflare-clef": "cloudflare-clef",
      kev: "kev-27b",
      "perplexity-pplx-decider": "perplexity-decider-v1.1",
      "mapika-decider": "decider-2b",
      "fastino-gliner-decide": "gliner25-decide",
      "clm-8b": "clm-v0.1-8b",
      "liquid-d1": "liquid-d1-3b",
    };
    const key = scoreKeys[slug];
    if (key) them = decisionIndexLabel(key);
    jev = jevDecisionIndex();
    sourceUrl = DI_JSON;
    sourceLabel = jevDi.label;
  }
  if (row === "Hosted price (input)" && slug === "cloudflare-clef") {
    them = hostedPricePerM("cloudflare-clef");
  }
  if (row === "Hosted price (input)" && slug === "perplexity-pplx-decider") {
    them = hostedPricePerM("perplexity-pplx-decider");
  }
  if (row === "Hosted price (input)" && slug === "openai-decisions-api") {
    them = hostedPricePerM("openai-decisions-api");
  }

  return {
    ...fact,
    them,
    jev,
    sourceUrl,
    sourceLabel,
    secondarySourceUrl,
    secondarySourceLabel,
  };
}

export function resolveAlternativeFacts(slug: AlternativeSlug, facts: AlternativeFact[]): AlternativeFact[] {
  return facts.map((f) => resolveRow(slug, f));
}

export function resolveLayaFact(fact: AlternativeFact): AlternativeFact {
  const jevPrice = jevHostedPriceSource();
  const row = fact.row;
  if (row === "Hosted price (input)") {
    return { ...fact, sourceUrl: jevPrice.url, sourceLabel: jevPrice.label };
  }
  if (row === "Latency") {
    return {
      ...fact,
      them: NOT_PUBLISHED_LABEL,
      jev: NOT_PUBLISHED_LABEL,
      sourceUrl: "https://huggingface.co/convaiinnovations/laya",
      sourceLabel: "HF model card (no comparable SLA published)",
    };
  }
  if (row === "Data handling" && fact.sourceUrl.includes("docs.typesafe.ai") && pathIsTypesafeRoot(new URL(fact.sourceUrl))) {
    return { ...fact, sourceUrl: TYPESAFE_PRIVACY, sourceLabel: "TypeSafe privacy policy" };
  }
  if (isBareFactSource(fact.sourceUrl)) {
    return { ...fact, sourceUrl: "https://huggingface.co/convaiinnovations/laya", sourceLabel: "Hugging Face: convaiinnovations/laya" };
  }
  return fact;
}
