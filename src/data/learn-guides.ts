export type LearnGuide = {
  slug: string;
  title: string;
  description: string;
  definition: string;
  headings: { h: string; body: string }[];
  exploreHref?: string;
};

export const learnGuideSlugs = [
  "jev-typesafe",
  "system-one",
  "jev-vs-llm-classification",
  "vercel-ai-gateway",
  "use-cases",
] as const;

export type LearnGuideSlug = (typeof learnGuideSlugs)[number];

export const learnGuides: Record<LearnGuideSlug, LearnGuide> = {
  "jev-typesafe": {
    slug: "jev-typesafe",
    title: "Jev & TypeSafe",
    description:
      "TypeSafe AI builds System One models like Jev: machine-native intelligence for software, not chat.",
    definition:
      "Jev is TypeSafe's System One decision model for software: structured state in, typed parallel questions, probability-backed answers out.",
    exploreHref: "/explore?category=official",
    headings: [
      {
        h: "What is Jev?",
        body: "Jev is TypeSafe's flagship System One model. You send structured state and typed questions; the API returns discrete answers with per-option probabilities and confidence scores. Your application code applies thresholds and executes side effects.",
      },
      {
        h: "Where to start",
        body: "Read the official introduction at typesafe.ai, follow the quick start in docs.typesafe.ai, and try the browser playground. Install @typesafe-ai/sdk or typesafe-sdk on Python for production calls to POST /v1/systemone.",
      },
      {
        h: "Relationship to this directory",
        body: "jev.aitools.fyi is an independent curated directory by aitools.fyi. Listings link to third-party projects; only official TypeSafe properties are authored by TypeSafe AI.",
      },
    ],
  },
  "system-one": {
    slug: "system-one",
    title: "System One model",
    description:
      "System One models evaluate parallel typed questions over shared context in one forward pass.",
    definition:
      "System One is TypeSafe's model family for parallel typed evaluation: many questions, one forward pass, calibrated probabilities.",
    exploreHref: "/learn/jev-typesafe",
    headings: [
      {
        h: "Not a chat model",
        body: "System One models do not freely generate prose. They answer constrained questions (which option, what score, or how true) with calibrated probabilities suitable for routing and gates.",
      },
      {
        h: "Latency and cost profile",
        body: "TypeSafe publishes end-to-end latencies on the order of tens to hundreds of milliseconds for typical parallel question batches, with pricing oriented toward high-volume decision workloads rather than long completions.",
      },
      {
        h: "Patterns",
        body: "Official docs describe speculative fan-out, confidence-gated routing, composite scoring, and hierarchical classification. All of that maps cleanly to Choice, Score, and Noul primitives.",
      },
    ],
  },
  "jev-vs-llm-classification": {
    slug: "jev-vs-llm-classification",
    title: "Jev vs LLM classification",
    description:
      "Compare generative classification with structured System One decisions.",
    definition:
      "Use Jev when you need thresholdable probabilities over a fixed option set; use LLMs when you need open-ended language generation.",
    exploreHref: "/explore?q=moderation",
    headings: [
      {
        h: "Probabilities you can threshold",
        body: "Jev returns explicit probability mass over options. Instead of parsing YES/NO from chat output, you set if (confidence > 0.9) in code. That matters for moderation, fraud, and safety pipelines.",
      },
      {
        h: "Parallel questions",
        body: "Ask many typed questions in one request over the same state. LLM classification often serializes prompts or pays for redundant context tokens.",
      },
      {
        h: "When LLMs still win",
        body: "Open-ended drafting, long reasoning chains, and novel text generation remain LLM territory. Many production stacks use Jev for discrete decisions and LLMs for language-heavy steps. Browser Use Ultrafast is a well-known hybrid.",
      },
    ],
  },
  "vercel-ai-gateway": {
    slug: "vercel-ai-gateway",
    title: "Vercel AI Gateway Jev",
    description:
      "Access typesafe-ai/jev through Vercel for AI SDK evaluate flows.",
    definition:
      "Vercel AI Gateway exposes typesafe-ai/jev so AI SDK apps can run System One evaluate paths without wiring a separate TypeSafe stack first.",
    exploreHref: "/explore?category=integrations",
    headings: [
      {
        h: "Gateway model id",
        body: "Vercel AI Gateway exposes TypeSafe's Jev for developers using the AI SDK, including experimental_evaluate paths documented on vercel.com. This can reduce friction compared to a separate waitlist-only workflow for some teams.",
      },
      {
        h: "eve integration",
        body: "Vercel's open agent framework eve ships Jev as a default evaluation model on its experimental evaluate path. Handy reference for agent scoring and gates in TypeScript.",
      },
      {
        h: "Learn more",
        body: "See the official gateway docs and explore eve on GitHub for production-shaped examples.",
      },
    ],
  },
  "use-cases": {
    slug: "use-cases",
    title: "Jev use cases",
    description:
      "Popular patterns people search for in the Jev ecosystem.",
    definition:
      "Common Jev use cases include moderation gates, model routing, support triage, RAG verify, and agent tool approval.",
    exploreHref: "/explore?category=applications",
    headings: [
      {
        h: "Moderation & trust/safety",
        body: "Discord bots, comment guard demos, indie media trust gates, and scam filters use parallel Noul and Choice questions to escalate or block content with explicit confidence.",
      },
      {
        h: "Model & tool routing",
        body: "jev-router, tiershift, hono-jev-router, and gateway routers pick models or tools from structured catalogs, often sub-200ms decisions per turn.",
      },
      {
        h: "Support triage & chargeback gates",
        body: "LaneBreak, CartShield, and typesafe-triage-guard demonstrate ticket priority, refund disposition, and deploy-risk gates without generative summaries.",
      },
      {
        h: "RAG verify & rerank",
        body: "llama-index-jev, jev-rerank, and citation-verifier projects use Score and Noul to rerank or verify claims cheaper than LLM-as-judge.",
      },
      {
        h: "Agent auto-mode & compaction",
        body: "fast-jev-compaction and pi-jev-auto-mode score tool results and approvals so agents keep verbatim context or auto-approve safe tool calls.",
      },
    ],
  },
};

export function getLearnGuide(slug: string): LearnGuide | undefined {
  return learnGuides[slug as LearnGuideSlug];
}
