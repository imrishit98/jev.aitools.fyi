export type LearnGuide = {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  definition: string;
  headings: { h: string; body: string }[];
  exploreHref?: string;
};

export const learnGuideSlugs = [
  "jev-typesafe",
  "system-one",
  "jev-vs-llm-classification",
  "vercel-ai-gateway",
  "where-to-run-jev",
  "use-cases",
] as const;

export type LearnGuideSlug = (typeof learnGuideSlugs)[number];

export const learnGuides: Record<LearnGuideSlug, LearnGuide> = {
  "jev-typesafe": {
    slug: "jev-typesafe",
    title: "Jev & TypeSafe",
    description:
      "What Jev is, how System One fits your stack, and where this directory ends and TypeSafe docs begin.",
    seoTitle: "What is TypeSafe Jev? System One primer for builders",
    seoDescription:
      "Learn what Jev is, how System One returns typed probabilities, and where official TypeSafe docs beat this directory. A short primer before you browse SDKs and tools.",
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
        body: "Read the introduction at typesafe.ai, follow the quick start on docs.typesafe.ai, and poke the browser playground. For production, install @typesafe-ai/sdk or typesafe-sdk on Python and call POST /v1/systemone.",
      },
      {
        h: "Relationship to this directory",
        body: "jev.aitools.fyi is an independent curated directory by aitools.fyi. Listings link to third-party projects; only official TypeSafe properties are authored by TypeSafe AI.",
      },
      {
        h: "Choice, Score, and Noul",
        body: "Choice picks one label from a fixed set with explicit probabilities. Score returns a numeric rating with uncertainty you can map to bands. Noul answers structured true or false style questions with confidence. Compose these primitives instead of prompting for free text and regex-parsing the reply.",
      },
      {
        h: "Request shape in practice",
        body: "Production clients send JSON state plus an array of typed questions in one POST to /v1/systemone. The response carries aligned answers with per-question confidence. Your service layer applies thresholds, logs decisions, and triggers side effects. There is no hidden chain-of-thought stream to consume.",
      },
      {
        h: "When Jev is the wrong tool",
        body: "Skip Jev when you need long-form copy, open-ended brainstorming, or narrative reasoning. Reach for an LLM or a template engine there. Many teams pair both: Jev for gates and routing, generative models for user-visible language.",
      },
    ],
  },
  "system-one": {
    slug: "system-one",
    title: "System One model",
    description:
      "The model family behind Jev: parallel typed questions, one forward pass, probabilities you can threshold.",
    seoTitle: "System One model: parallel typed Jev questions explained",
    seoDescription:
      "Understand System One: batch typed questions in one forward pass, threshold calibrated probabilities, and patterns like routing and composite scoring. Not a chat LLM.",
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
      {
        h: "Batching questions",
        body: "System One shines when you ask many small questions about the same snapshot of state. One forward pass amortizes context loading and keeps latencies predictable compared with serial chat calls that repeat the same preamble.",
      },
      {
        h: "Calibration matters",
        body: "Probabilities are meant to be thresholded. If your pipeline needs a 0.95 bar for auto-approval, you can tune policies in code and measure drift over time. That is harder when a classifier returns unstructured text.",
      },
      {
        h: "Operational footprint",
        body: "Because outputs are discrete, logging and replay are straightforward: store the state hash, questions, and probability vector. Incident review does not require reading pages of generated prose.",
      },
    ],
  },
  "jev-vs-llm-classification": {
    slug: "jev-vs-llm-classification",
    title: "Jev vs LLM classification",
    description:
      "When to gate with System One probabilities instead of asking a chat model to label things.",
    seoTitle: "Jev vs LLM classification: when to gate with probabilities",
    seoDescription:
      "Compare Jev and chat classifiers for moderation, fraud, and routing. See when fixed option sets and thresholdable scores beat parsing YES/NO from generated text.",
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
      {
        h: "Cost and token math",
        body: "Generative classifiers often resend long instructions and examples on every call. System One calls keep prompts compact because questions are typed fields, not paragraphs of rubric text. For high-volume gates that difference shows up in both latency and spend.",
      },
      {
        h: "Evaluation and testing",
        body: "Fixed option sets make golden tests easier: feed recorded state, expect option B above 0.8. LLM label parsing tests brittle string contains checks. Teams migrating often keep LLM baselines while they calibrate Jev thresholds on production logs.",
      },
      {
        h: "Directory examples",
        body: "Browse moderation and routing listings in this directory for repos that publish benchmarks against chat baselines. Treat them as patterns, not endorsements. Always read the linked source for maintenance status.",
      },
    ],
  },
  "vercel-ai-gateway": {
    slug: "vercel-ai-gateway",
    title: "Vercel AI Gateway Jev",
    description:
      "Try typesafe-ai/jev through Vercel's gateway and the AI SDK evaluate path.",
    seoTitle: "Vercel AI Gateway Jev: AI SDK evaluate path setup",
    seoDescription:
      "Run typesafe-ai/jev through Vercel AI Gateway and eve's experimental evaluate APIs. Learn model ids, secrets hygiene, and when to move to direct TypeSafe credentials.",
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
      {
        h: "AI SDK evaluate path",
        body: "The experimental evaluate APIs in the AI SDK expect structured inputs and return typed results. Gateway-hosted Jev fits that shape without standing up a separate inference stack on day one. You still own application thresholds and audit logs.",
      },
      {
        h: "Model identifier",
        body: "Configure the gateway model id documented for TypeSafe Jev in your provider settings. Keep environment secrets in Vercel or your CI vault, not in client bundles. Rotate keys the same way you would for any hosted model route.",
      },
      {
        h: "Migration path",
        body: "Teams often prototype on the gateway, then move to direct TypeSafe credentials when they need private networking or custom quotas. SDK listings in this directory show both styles so you can compare wiring.",
      },
    ],
  },
  "where-to-run-jev": {
    slug: "where-to-run-jev",
    title: "Where to run Jev",
    description:
      "Compare official TypeSafe, Vercel AI Gateway, OpenRouter, Cloudflare Workers AI, and classifier.dev with a fact table.",
    seoTitle: "Where to run Jev: gateways, APIs, and classifier.dev",
    seoDescription:
      "Fact table of Jev inference surfaces: TypeSafe POST /v1/systemone, typesafe-ai/jev on Vercel AI Gateway, OpenRouter Decisions, Cloudflare Workers AI, and classifier.dev HTTP classification.",
    definition:
      "The same Jev model shows up on multiple gateways and APIs. Pick the surface that matches your auth, billing, and question shape.",
    exploreHref: "/explore?category=integrations",
    headings: [
      {
        h: "Official TypeSafe API",
        body: "POST https://api.typesafe.ai/v1/systemone with TYPESAFE_AI_API_KEY (or TYPESAFE_API_KEY on some community tools). TypeSafe's Sep 15, 2026 launch post lists $0.042 per million input tokens with output free. Model aliases on docs and SDKs include jev-latest and jev-1.13 family ids. Latency cited by TypeSafe: about 70 ms to 500 ms end to end for typical batches.",
      },
      {
        h: "Vercel AI Gateway",
        body: "Model id typesafe-ai/jev for AI SDK experimental_evaluate and gateway.evaluationModel('typesafe-ai/jev'). Vercel documents $0.042/M input, no output charge, and a 32,000 token context window. Gateway itself includes $5/month free credit then pay-as-you-go credits without markup on model rates.",
      },
      {
        h: "OpenRouter",
        body: "Model typesafe/jev-1.13 on the Decisions API (not chat completions). OpenRouter lists $0.042/M input, $0/M output, 32k context, with a Sep 18, 2026 release note on the model page.",
      },
      {
        h: "Cloudflare Workers AI",
        body: "Model id typesafe/jev via env.AI.run('typesafe/jev', { state, questions }). Cloudflare lists a 32,000 token context window; dollar rates are dashboard-priced on their side. TypeSafe's public list price still applies when you compare unit economics.",
      },
      {
        h: "classifier.dev (Jev for labels)",
        body: "Not the System One JSON API: classifier.dev is zero-shot text classification over HTTP with fast tier on Jev and smart tier escalation below 0.7 confidence. Free tier needs no API key; limits count classifications per IP. See classifier.dev/pricing and the classifier-dev listing in this directory.",
      },
      {
        h: "What we did not guess",
        body: "Rate limits like 250,000 tokens per second on the official API are omitted here unless docs.typesafe.ai/models states them in your checkout. Context limits vary by gateway (32k on Vercel, OpenRouter, and Cloudflare model pages). Always confirm aliases on the provider page you ship against.",
      },
    ],
  },
  "use-cases": {
    slug: "use-cases",
    title: "Jev use cases",
    description:
      "The patterns builders actually search for: moderation, routing, triage, RAG verify, and agent gates.",
    seoTitle: "Jev use cases: moderation, routing, triage, and agent gates",
    seoDescription:
      "Explore real Jev patterns: trust and safety gates, model routers, support triage, RAG verify, compaction, and browser automation. Jump to matching directory listings next.",
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
      {
        h: "Browser and desktop automation",
        body: "Computer-use demos treat the next click or keypress as a Choice over a finite action catalog. Jev scores candidate nodes quickly enough for interactive loops. Pair with vision or DOM snapshots as your state payload.",
      },
      {
        h: "Games and simulations",
        body: "Arcade demos prove System One latency in public. They are useful sandboxes before you wire the same primitives into billing or safety code paths.",
      },
      {
        h: "How to explore further",
        body: "Use category filters on Explore to narrow listings by pattern. Favor repos with demos or recent commits when you are evaluating fit. Submit your own project if you ship something missing here.",
      },
    ],
  },
};

export function getLearnGuide(slug: string): LearnGuide | undefined {
  return learnGuides[slug as LearnGuideSlug];
}
