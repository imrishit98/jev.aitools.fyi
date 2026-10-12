import type { AlternativesHub, AlternativesHubRankRow } from "@/data/alternatives-types";
import {
  alternativesLastVerified,
  alternativesMetrics as m,
  decisionIndexLabel,
  githubAdoption,
  hfAdoption,
  hostedPricePerM,
} from "@/data/alternatives-shared";
import { alternativeSlugs, alternativePath } from "@/data/alternatives-slugs";

const hubSeoDescription =
  "Eleven Jev alternatives with dated facts: Laya, Cloudflare Clef, Kev, OpenAI Decisions API, Von, and more. Adoption, licenses, prices, benchmarks.";

export const alternativesHub: AlternativesHub = {
  seoTitle: "Jev alternatives: 11 decision models compared",
  seoDescription: hubSeoDescription,
  h1: "Jev alternatives: 11 decision models compared",
  lastVerified: alternativesLastVerified,
  summary:
    "Hosted TypeSafe Jev is the default System One API for many agent stacks, but it is not the only way to score Choice, Score, and Noul questions in one forward pass. This hub lists eleven comparison pages we maintain in 2026: Laya on the existing learn hub plus ten dedicated /alternatives guides. The table order is editorial as of " +
    alternativesLastVerified +
    ", informed by GitHub stars, Hugging Face downloads, and on-site interest, but not a single-metric sort. Row eleven (Von) is an explicit editorial speed pick. We label vendor-reported benchmarks separately from independent Decision Index Full scores from the public snapshot regenerated on " +
    m.decisionIndex.generatedUtc.slice(0, 10) +
    ".",
  quickPicks: [
    {
      need: "Open weights you can fine-tune on your GPUs",
      pick: "Convai Laya or Jared Palmer Kev",
      href: "/learn/laya-vs-jev/compare",
    },
    {
      need: "Hosted API on infrastructure you already pay for",
      pick: "Cloudflare clef on Workers AI",
      href: alternativePath("cloudflare-clef"),
    },
    {
      need: "Highest public Decision Index score among listed open weights",
      pick: "Perplexity pplx-decider v1.1 (27B)",
      href: alternativePath("perplexity-pplx-decider"),
    },
    {
      need: "Editorial speed pick for local routing",
      pick: "wfzyx Von (row 11, adoption plus curator pick)",
      href: alternativePath("von"),
    },
    {
      need: "Stay on TypeSafe billing and gateway integrations",
      pick: "Keep hosted Jev",
      href: "/learn/jev-typesafe",
    },
  ],
  ranked: buildRanked(),
  faq: [
    {
      question: "What counts as a Jev alternative?",
      answer:
        "Any engine that answers typed decision questions (Choice, Score, Noul) over structured state without generating open-ended chat. That includes hosted System One APIs, open checkpoints with compatible HTTP servers, and research stacks like SemIf. General LLM classifiers are out of scope for this hub.",
    },
    {
      question: "Why is Laya first in the table if this site covers Jev?",
      answer:
        "Row one is an editorial choice: Laya has the largest GitHub and Hugging Face footprint among open decision models we track, and many teams evaluate it alongside hosted Jev. Our Laya vs Jev compare guide is independent writing; we are not Convai or TypeSafe.",
      links: [
        { match: "Laya vs Jev compare guide", href: "/learn/laya-vs-jev/compare" },
      ],
    },
    {
      question: "How should I read Decision Index numbers?",
      answer:
        "Decision Index is a third-party harness (edition " +
        m.decisionIndex.edition +
        ") that scores public benchmark slices. It is useful for directional ranking but not a substitute for your own labelled data. Vendor blog tables may use different splits; we mark those as vendor-reported in each alternative page.",
      links: [{ match: "Decision Index", href: "https://github.com/apolinario/decision-index" }],
    },
    {
      question: "Why is Von in the table as a runners-up?",
      answer:
        "Von sits at row eleven as an editorial speed pick with strong Hugging Face downloads, not because it outranked Liquid d1 on every signal we watch. Read the Von vs Jev page before you treat it as a full migration target.",
      links: [{ match: "Von vs Jev page", href: alternativePath("von") }],
    },
    {
      question: "Can I mix hosted Jev with an open model?",
      answer:
        "Yes. A common pattern is a local open model for high-volume pre-filters and hosted Jev for escalation, large option sets, or compliance workflows. See migration sections on Kev, decider, and Laya pages for minimal SDK diffs.",
    },
    {
      question: "Are Cloudflare clef and clef-flash the same product?",
      answer:
        "They are sibling Workers AI models with different price points and Decision Index scores. This hub's clef page focuses on the standard clef SKU; clef-flash is noted in facts when you need a cheaper flash tier.",
      links: [
        {
          match: "clef page",
          href: alternativePath("cloudflare-clef"),
        },
      ],
    },
    {
      question: "Is OpenAI Decisions API production ready?",
      answer:
        "OpenAI describes Decisions API as a public beta with a Luna-class decision model. Treat pricing, model names, and SLAs as vendor beta terms until your account team confirms otherwise.",
      links: [{ match: "OpenAI Decisions API", href: alternativePath("openai-decisions-api") }],
    },
    {
      question: "How often is this hub updated?",
      answer:
        "We refresh GitHub stars, Hugging Face downloads, hosted price list entries, and Decision Index snapshot scores on the date shown as last verified. Always confirm contracts and model cards before you ship.",
    },
  ],
  sources: [
    {
      label: "TypeSafe docs: System One / Jev",
      url: "https://docs.typesafe.ai",
    },
    {
      label: "Decision Index public data (edition " + m.decisionIndex.edition + ")",
      url: m.decisionIndex.sourceUrl,
    },
    {
      label: "Hugging Face: convaiinnovations/laya",
      url: "https://huggingface.co/convaiinnovations/laya",
    },
    {
      label: "GitHub: jaredpalmer/kev",
      url: "https://github.com/jaredpalmer/kev",
    },
    {
      label: "Cloudflare Workers AI: clef model",
      url: "https://developers.cloudflare.com/workers-ai/models/clef/",
    },
    {
      label: "OpenAI community: Decisions API beta",
      url: "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877",
    },
    {
      label: "Perplexity community: pplx-decider v1.1",
      url: "https://community.perplexity.ai/t/pplx-decider-v1-1-27b-our-updated-open-weights-multimodal-decision-model-is-now-available/6286",
    },
    {
      label: "GitHub: Mapika/decider",
      url: "https://github.com/Mapika/decider",
    },
    {
      label: "GitHub: wfzyx/von",
      url: "https://github.com/wfzyx/von",
    },
  ],
};

function buildRanked(): AlternativesHubRankRow[] {
  const rows: Omit<AlternativesHubRankRow, "rank" | "order">[] = [
    {
      name: "Laya",
      maker: "Convai Innovations",
      openWeights: "Apache 2.0 checkpoints",
      hostedApi: "Self-host only",
      jevCompatible: "Conceptual (Router API, not identical wire)",
      sizes: "English ~421M, multilingual ~322M (HF model card)",
      inputs: "Text / JSON state",
      decisionIndex: "Laya vs Jev benchmarks guide (vendor vs independent splits)",
      adoption: `${githubAdoption("NandhaKishorM/laya")}; ${hfAdoption("convaiinnovations/laya")}`,
      pagePath: "/learn/laya-vs-jev/compare",
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "Cloudflare clef",
      maker: "Cloudflare",
      openWeights: "Weights on HF; serve via Workers AI",
      hostedApi: hostedPricePerM("cloudflare-clef"),
      jevCompatible: "Workers AI System One style HTTP",
      sizes: "clef and clef-flash SKUs",
      inputs: "Text state",
      decisionIndex: decisionIndexLabel("cloudflare-clef"),
      adoption: hfAdoption("Cloudflare/clef"),
      pagePath: alternativePath("cloudflare-clef"),
      group: "hosted",
      orderingBasis: "editorial",
    },
    {
      name: "Kev",
      maker: "Jared Palmer",
      openWeights: "Apache 2.0",
      hostedApi: "Self-host (kev.serve)",
      jevCompatible: "POST /v1/systemone compatible",
      sizes: "0.8B to 27B",
      inputs: "Text state",
      decisionIndex: decisionIndexLabel("kev-27b"),
      adoption: `${githubAdoption("jaredpalmer/kev")}; ${hfAdoption("jaredpalmer/kev-4b")}`,
      pagePath: alternativePath("kev"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "OpenAI Decisions API",
      maker: "OpenAI",
      openWeights: "Hosted beta only",
      hostedApi: hostedPricePerM("openai-decisions-api"),
      jevCompatible: "Decisions API (beta contract)",
      sizes: "gpt-6-luna class (vendor)",
      inputs: "Structured decisions payload",
      decisionIndex: "Not on public Decision Index board in our snapshot",
      adoption: "Vendor beta (no public GitHub stars)",
      pagePath: alternativePath("openai-decisions-api"),
      group: "hosted",
      orderingBasis: "editorial",
    },
    {
      name: "Perplexity pplx-decider",
      maker: "Perplexity",
      openWeights: "Apache 2.0 weights",
      hostedApi: hostedPricePerM("perplexity-pplx-decider"),
      jevCompatible: "System One style serving options",
      sizes: "27B multimodal decider",
      inputs: "Text and image (vendor)",
      decisionIndex: decisionIndexLabel("perplexity-decider-v1.1"),
      adoption: hfAdoption("perplexity-ai/pplx-decider-v1.1-27b"),
      pagePath: alternativePath("perplexity-pplx-decider"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "Mapika decider",
      maker: "Mapika",
      openWeights: "Apache 2.0",
      hostedApi: "Self-host (decider.serve)",
      jevCompatible: "POST /v1/systemone compatible",
      sizes: "0.8B to 35B-A3b",
      inputs: "Text state",
      decisionIndex: decisionIndexLabel("decider-2b"),
      adoption: `${githubAdoption("Mapika/decider")}; ${hfAdoption("Mapika/decider-2b")}`,
      pagePath: alternativePath("mapika-decider"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "GLiNER2.5 Decide",
      maker: "Fastino",
      openWeights: "Apache 2.0",
      hostedApi: "Self-host",
      jevCompatible: "Decision head on GLiNER family",
      sizes: "Decide variant checkpoints",
      inputs: "Text spans / criteria",
      decisionIndex: decisionIndexLabel("gliner25-decide"),
      adoption: hfAdoption("fastino/GLiNER2.5-Decide"),
      pagePath: alternativePath("fastino-gliner-decide"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "SemIf",
      maker: "Theo Lee CJ",
      openWeights: "Open research weights",
      hostedApi: "Self-host (openjev.com demos)",
      jevCompatible: "System One shaped server",
      sizes: "Multiple community bridges",
      inputs: "Text / structured state",
      decisionIndex: "Not listed for SemIf in Decision Index snapshot",
      adoption: githubAdoption("TheoLeeCJ/SemIf-OpenJev"),
      pagePath: alternativePath("semif"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "CLM 8B",
      maker: "Contrastive LM",
      openWeights: "Apache 2.0",
      hostedApi: "Self-host",
      jevCompatible: "Qwen3 heads for decisions",
      sizes: "8B class",
      inputs: "Text state",
      decisionIndex: decisionIndexLabel("clm-v0.1-8b"),
      adoption: `${githubAdoption("Contrastive-LM/CLM")}; ${hfAdoption("Contrastive-LM/CLM-v0.1-8B")}`,
      pagePath: alternativePath("clm-8b"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "Liquid d1",
      maker: "Liquid AI",
      openWeights: "LFM license weights",
      hostedApi: "Self-host",
      jevCompatible: "Decision tuned LFM stack",
      sizes: "d1-3B featured",
      inputs: "Text state",
      decisionIndex: decisionIndexLabel("liquid-d1-3b"),
      adoption: hfAdoption("LiquidAI/d1-3B"),
      pagePath: alternativePath("liquid-d1"),
      group: "open",
      orderingBasis: "editorial",
    },
    {
      name: "Von",
      maker: "wfzyx",
      openWeights: "Apache 2.0",
      hostedApi: "Self-host",
      jevCompatible: "System One shaped local server",
      sizes: "395M class encoder (vendor README)",
      inputs: "Text state",
      decisionIndex: "Not listed on Decision Index public board in our snapshot",
      adoption: `${githubAdoption("wfzyx/von")}; ${hfAdoption("wfzyx/von")}`,
      pagePath: alternativePath("von"),
      group: "open",
      orderingBasis: "editorial-pick",
    },
  ];

  return rows.map((row, index) => ({
    rank: index + 1,
    order: index + 1,
    ...row,
  }));
}

/** Hub table rows must match Laya compare plus every /alternatives slug. */
export const alternativesHubRowCount = alternativesHub.ranked.length;
