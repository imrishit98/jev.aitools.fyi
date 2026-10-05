import type { LearnGuideSlug } from "@/data/learn-guides";

export type JevPrimitive = "Choice" | "Score" | "Noul";

export type ProductProfileFaq = {
  question: string;
  answer: string;
};

export type ProductCreator = {
  name: string;
  handle?: string;
  xUrl?: string;
  githubUrl?: string;
  company?: string;
  companyUrl?: string;
};

export type SourcedMetric = {
  claim: string;
  source: string;
};

export type ProductJevUsage = {
  /** Where in the product loop Jev runs (gate, routing, ranking, moderation, compaction, etc.). */
  flowRole: string;
  primitives: JevPrimitive[];
  stateIn: string;
  decisionOut: string;
  /** Ordered steps in the hot path, when documented. */
  flowSteps?: string[];
  sourcedMetrics?: SourcedMetric[];
};

export type ProductLinks = {
  website?: string;
  repo?: string;
  docs?: string;
  demo?: string;
  post?: string;
};

export type ProductProfile = {
  slug: string;
  /** published profiles render rich detail pages; draft profiles are omitted from the index. */
  status: "published" | "draft";
  problem: string;
  targetUser: string;
  overview: string;
  creator: ProductCreator;
  creatorQuote?: {
    text: string;
    attributedTo: string;
    sourceUrl: string;
  };
  jevUsage: ProductJevUsage;
  /** Long-form narrative for crawlers; must align with jevUsage facts. */
  howJevIsUsed: string;
  keyFeatures: string[];
  stack: string[];
  links: ProductLinks;
  pricingNote?: string;
  /** ISO date or human date when the listing first appeared in public demos or docs. */
  firstSeen?: string;
  demoIds?: string[];
  relatedSlugs?: string[];
  relatedLearnSlugs?: LearnGuideSlug[];
  faq?: ProductProfileFaq[];
  metaTitle?: string;
  metaDescription?: string;
};

export function getProductProfile(slug: string): ProductProfile | undefined {
  const profile = productProfilesBySlug[slug];
  if (!profile || profile.status !== "published") return undefined;
  return profile;
}

export function measureProductProfileBodyChars(slug: string): number {
  const profile = productProfilesBySlug[slug];
  if (!profile || profile.status !== "published") return 0;
  const j = profile.jevUsage;
  const chunks = [
    profile.problem,
    profile.targetUser,
    profile.overview,
    profile.howJevIsUsed,
    j.flowRole,
    j.stateIn,
    profile.creator.name,
    j.decisionOut,
    ...(j.flowSteps ?? []),
    ...(j.primitives ?? []),
    ...(j.sourcedMetrics ?? []).flatMap((m) => [m.claim, m.source]),
    ...(profile.keyFeatures ?? []),
    ...(profile.stack ?? []),
    profile.pricingNote ?? "",
    profile.creatorQuote?.text ?? "",
    ...(profile.faq ?? []).flatMap((f) => [f.question, f.answer]),
  ];
  return chunks.join(" ").trim().length;
}

export const productProfilesBySlug: Record<string, ProductProfile> = {
  "classifier-dev": {
    slug: "classifier-dev",
    status: "published",
    problem:
      "Teams still route moderation, support, and analytics labels through chat models that return prose instead of thresholdable scores.",
    targetUser:
      "Engineers who want HTTP-first zero-shot labels without hosting their own classifier stack.",
    overview:
      "classifier.dev is a zero-shot text classification API on a single Cloudflare Worker. Plain text and label lists go in; the service returns a label and calibrated confidence. The fast tier runs TypeSafe Jev from src/jev.ts; uncertain rows can escalate to a smart tier when confidence falls below 0.7.",
    creator: {
      name: "Michael Chomsky",
      handle: "michael_chomsky",
      company: "classifier.dev",
      companyUrl: "https://classifier.dev",
      githubUrl: "https://github.com/mrmps/classifier-dev",
    },
    jevUsage: {
      flowRole: "Classification core (fast tier) plus confidence-gated escalation to smart tier",
      primitives: ["Choice", "Score"],
      stateIn:
        "Batched {id, text} inputs plus per-item questions. Multi-label uses one yes/no Score-style question per label on the same state (documented in src/jev.ts).",
      decisionOut:
        "Calibrated probability per label or option; callers threshold confidence. Smart tier re-asks only rows below ESCALATE_BELOW (0.7 in src/index.ts).",
      flowSteps: [
        "Pack many items into one POST /v1/systemone request on the fast tier",
        "Read per-label probabilities from Jev",
        "Re-run only sub-0.7 confidence rows on the smart tier chain",
      ],
      sourcedMetrics: [
        {
          claim: "Smart tier escalates when fast-tier confidence is below 0.7 (ESCALATE_BELOW).",
          source: "github.com/mrmps/classifier-dev src/index.ts",
        },
        {
          claim: "Multi-label F1 0.879 vs 0.799 for the LLM cascade it replaces, ~200ms on a seven-case eval set.",
          source: "github.com/mrmps/classifier-dev src/jev.ts header comments",
        },
      ],
    },
    howJevIsUsed:
      "The Worker routes classification through src/jev.ts, which calls TypeSafe POST /v1/systemone (model jev-latest) or Vercel AI Gateway evaluation-model when a gateway key is set. Jev is described in-repo as a decision model that returns calibrated probabilities, not prompted classification prose. Multi-label is implemented as parallel per-label questions on shared state. The smart tier is a separate model chain that runs only on answers the fast tier marks uncertain via the 0.7 gate, which keeps average cost down while preserving accuracy on edge cases documented in the repository eval notes.",
    keyFeatures: [
      "curl-friendly HTTP API with up to 1,000 texts per request (README)",
      "Fast Jev tier plus smart re-ask tier below 0.7 confidence",
      "No API key required for light use (catalog listing and site docs)",
      "CLI npm package classifier-dev mirrors the HTTP API",
      "feedback.now agent feedback endpoints on the same host",
    ],
    stack: [
      "Cloudflare Worker",
      "TypeSafe System One (jev-latest)",
      "Optional Vercel AI Gateway evaluation-model",
      "esbuild, no database",
    ],
    links: {
      website: "https://classifier.dev",
      repo: "https://github.com/mrmps/classifier-dev",
      docs: "https://classifier.dev",
      demo: "https://classifier.dev",
    },
    pricingNote:
      "Public rate-limit headers document fast vs smart tiers (see repository API notes). Confirm live limits on classifier.dev before production traffic.",
    firstSeen: "2026-09-19",
    demoIds: [],
    relatedSlugs: ["classifier-dev-mcp", "browser-use-jev-ultrafast", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Which Jev primitives does classifier.dev use?",
        answer:
          "Source comments in src/jev.ts describe single-label Choice-style picks and multi-label yes/no questions read from probabilities. The implementation packs many items per System One request.",
      },
      {
        question: "When does the smart tier run?",
        answer:
          "Only when fast-tier confidence is below 0.7, per ESCALATE_BELOW in src/index.ts. Read eval/fallback_bench.py in the repo before quoting production accuracy.",
      },
    ],
    metaTitle: "classifier.dev: Jev fast tier and smart escalation API",
    metaDescription:
      "Hosted zero-shot labels with Jev on the fast tier, 0.7 confidence escalation, and HTTP plus CLI. Sourced from the classifier.dev Worker repo.",
  },

  "classifier-dev-mcp": {
    slug: "classifier-dev-mcp",
    status: "published",
    problem:
      "Agents need classify tools that return structured probabilities instead of markdown tables in chat.",
    targetUser:
      "MCP hosts wiring streamable HTTP tools for moderation, routing, and analytics agents.",
    overview:
      "The classifier.dev MCP server exposes the same classification backend as the HTTP API through streamable HTTP tools such as classify_texts. Setup documentation lives on classifier.dev/mcp-setup.",
    creator: {
      name: "Michael Chomsky",
      handle: "michael_chomsky",
      company: "classifier.dev",
      companyUrl: "https://classifier.dev",
      githubUrl: "https://github.com/mrmps/classifier-dev",
    },
    jevUsage: {
      flowRole: "Agent tool transport to the same Jev classification core as classifier.dev",
      primitives: ["Choice", "Score"],
      stateIn: "Tool payloads with texts and label dimensions (per MCP tool schema on classifier.dev).",
      decisionOut:
        "Same probability vectors as the HTTP API; MCP is transport only.",
      flowSteps: [
        "Agent calls MCP classify_texts (or related tools)",
        "Server forwards to classifier.dev Jev tiers",
        "Agent thresholds probabilities in code",
      ],
    },
    howJevIsUsed:
      "MCP does not change the System One question shapes: tools call into the classifier.dev Worker stack documented in the main repository. Agents should still think in terms of fast Jev probabilities and optional smart-tier escalation rather than parsing model prose from tool results.",
    keyFeatures: [
      "Streamable HTTP MCP documented on classifier.dev/mcp-setup",
      "Free tier without API key for light experiments (catalog listing)",
      "Multi-label and dimension aware tools",
      "Pairs with the classifier.dev HTTP product profile",
    ],
    stack: ["MCP streamable HTTP", "classifier.dev Worker", "TypeSafe System One"],
    links: {
      website: "https://classifier.dev/mcp",
      repo: "https://github.com/mrmps/classifier-dev",
      docs: "https://classifier.dev/mcp-setup",
      demo: "https://classifier.dev/mcp-setup",
    },
    pricingNote: "Matches classifier.dev tier limits.",
    firstSeen: "2026-09-19",
    relatedSlugs: ["classifier-dev", "kushwho-jev-codes"],
    relatedLearnSlugs: ["jev-typesafe", "use-cases"],
    faq: [
      {
        question: "Do MCP tools use a different model than curl?",
        answer: "No. They hit the same classifier.dev backend described in the main repository.",
      },
    ],
    metaTitle: "classifier.dev MCP: Jev classify tools for agents",
    metaDescription:
      "Streamable HTTP MCP for classify_texts on classifier.dev. Same Jev fast and smart tiers as the HTTP API.",
  },

  "browser-use-jev-ultrafast": {
    slug: "browser-use-jev-ultrafast",
    status: "published",
    problem:
      "LLM-in-the-loop browser agents spend too long and too much per click when every step is open-ended generation.",
    targetUser:
      "Teams building Browser Use style agents who want a reference hybrid policy with documented timings.",
    overview:
      "Jev Ultrafast is Browser Use's open agent where TypeSafe Jev picks an operation (CLICK, TYPE_TEXT, SELECT, SCROLL, WAIT, DONE, BLOCKED) and a numbered DOM target from a fresh element table each step. A small LLM only runs when the operation is TYPE_TEXT.",
    creator: {
      name: "Gregor Zunic",
      handle: "gregpr07",
      xUrl: "https://x.com/gregpr07/status/2100411066966749359",
      githubUrl: "https://github.com/browser-use/jev-ultrafast",
      company: "Browser Use",
      companyUrl: "https://browser-use.com",
    },
    creatorQuote: {
      text:
        "Seven seconds, four tenths of a cent, and Jev clicks the right DOM node while a tiny LLM only types when it must.",
      attributedTo: "Gregor Zunic",
      sourceUrl: "https://x.com/gregpr07/status/2100411066966749359",
    },
    jevUsage: {
      flowRole: "Per-step browser control routing (operation + target selection)",
      primitives: ["Choice"],
      stateIn:
        "Structured element table from a single browser snapshot (role, name, value, numeric index). No screenshots in the default agent loop per README.",
      decisionOut:
        "Operation head plus speculative target heads (click_target, type_text_target, select_target) resolved in one TypeSafe request; only the matching target executes.",
      flowSteps: [
        "Snapshot page into indexed element table",
        "One Jev request chooses operation and compatible target",
        "CLICK/SELECT execute directly; TYPE_TEXT triggers small LLM for string then browser input",
      ],
      sourcedMetrics: [
        {
          claim: "Google Flights Zürich to London task completed in 7.073s at 1× in the published recording.",
          source: "github.com/browser-use/jev-ultrafast docs/performance.md",
        },
        {
          claim: "Median Jev latency 178ms across 17 requests in that recording.",
          source: "github.com/browser-use/jev-ultrafast docs/performance.md",
        },
        {
          claim: "Median optimized runtime 7.092s vs 9.450s original arm in three matched pairs.",
          source: "github.com/browser-use/jev-ultrafast docs/performance.md",
        },
      ],
    },
    howJevIsUsed:
      "Each observation rebuilds a finite action space. Jev consumes structured state, not pixels, and returns operation and target probabilities in one round trip per decision cycle. Target questions are speculative: if the operation is CLICK, only click_target can fire. TYPE_TEXT is the only branch that calls a separate text model (Mercury in the documented demo configuration). This split is why public clips show sub-second decisions with occasional LLM latency only on typing steps.",
    keyFeatures: [
      "Local inspector UI on port 8766 with Choose next stepping",
      "Browser Harness integration for Chrome debugging",
      "Documented flight, Wikipedia, and hotel fixture benchmarks",
      "Python library API via jev_ultrafast.Agent",
    ],
    stack: [
      "Python",
      "Browser Harness",
      "TypeSafe Jev (jev-1.13.0 in benchmark doc)",
      "OpenRouter text helper for TYPE_TEXT",
    ],
    links: {
      website: "https://browser-use.com",
      repo: "https://github.com/browser-use/jev-ultrafast",
      docs: "https://github.com/browser-use/jev-ultrafast/blob/main/docs/performance.md",
      demo: "https://browser-use.com",
      post: "https://x.com/gregpr07/status/2100411066966749359",
    },
    pricingNote:
      "Open source agent; TypeSafe and text-model keys are bring-your-own. Recording notes ~$0.00006272 OpenRouter for two text calls only.",
    firstSeen: "2026-09-19",
    demoIds: ["browser-ultrafast-gregpr07", "computer-use-speed-savboj"],
    relatedSlugs: ["vercel-eve", "tamaratran-fast-jev-compaction", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev see screenshots?",
        answer:
          "The default agent loop uses structured DOM state per README. The inspector can opt into screenshots for humans; the benchmark video uses a separate screencast.",
      },
    ],
    metaTitle: "Browser Use Jev Ultrafast: Choice per browser step",
    metaDescription:
      "Documented hybrid browser agent: Jev Choice for operation and target in one request, LLM only for TYPE_TEXT. 7.07s Flights demo per performance.md.",
  },

  "vercel-eve": {
    slug: "vercel-eve",
    status: "published",
    problem:
      "Durable agent frameworks need evaluation hooks that stay testable instead of free-form judge prompts.",
    targetUser:
      "TypeScript teams building filesystem-first agents on Vercel who want structured evaluation alongside tools and skills.",
    overview:
      "eve is Vercel's open, filesystem-first agent framework (agent/instructions.md, tools/, skills/, channels/). This directory indexes it because public eve materials describe Jev on the experimental evaluate path for typed scoring; confirm shapes on eve.dev for your pinned version.",
    creator: {
      name: "Vercel",
      company: "Vercel",
      companyUrl: "https://vercel.com",
      githubUrl: "https://github.com/vercel/eve",
    },
    jevUsage: {
      flowRole: "Agent evaluation (experimental evaluate path per listing and eve marketing)",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Structured evaluation payloads as documented on eve.dev for the evaluate integration (verify in your version pin).",
      decisionOut:
        "Thresholdable evaluation scores used in agent workflows instead of unparsed judge prose.",
      flowSteps: [
        "Author agent under agent/ layout",
        "Call evaluate path with structured questions",
        "Apply thresholds in TypeScript policy code",
      ],
    },
    howJevIsUsed:
      "eve keeps orchestration in conventional files while evaluation can call System One through the experimental path described in this site's catalog listing and on eve.dev. This profile does not duplicate eve's full evaluate API: read Vercel's docs for the exact question schema, models, and gateway configuration in the release you deploy.",
    keyFeatures: [
      "npx eve@latest init scaffolding",
      "Filesystem-first agent layout",
      "Channels and schedules for durable agents",
      "Hosted docs at eve.dev",
    ],
    stack: ["TypeScript", "Vercel AI Gateway compatible flows", "TypeSafe System One evaluate path"],
    links: {
      website: "https://eve.dev",
      repo: "https://github.com/vercel/eve",
      docs: "https://eve.dev/docs",
      demo: "https://eve.dev",
    },
    firstSeen: "2026-09-17",
    relatedSlugs: ["tanstack-ai-decide", "browser-use-jev-ultrafast"],
    relatedLearnSlugs: ["vercel-ai-gateway", "system-one"],
    faq: [
      {
        question: "Where is Jev configured in eve?",
        answer:
          "Follow eve.dev/docs for evaluate integration in your release. This directory listing summarizes Jev as the default evaluation model on the experimental evaluate path.",
      },
    ],
    metaTitle: "Vercel eve: filesystem agents with Jev evaluate path",
    metaDescription:
      "Vercel eve agent framework with documented Jev evaluate integration. eve.dev docs, GitHub source, and structured evaluation hooks.",
  },

  "tamaratran-fast-jev-compaction": {
    slug: "tamaratran-fast-jev-compaction",
    status: "published",
    problem:
      "LLM-written compaction summaries drop exact errors, paths, and constraints from agent transcripts.",
    targetUser:
      "Claude Code users who want compaction that deletes stale tool rows without rewriting user or assistant text.",
    overview:
      "fast-jev-compaction is an npm package and Claude Code plugin that replaces summarization with Jev keep-or-drop decisions on paired tool_use and tool_result messages.",
    creator: {
      name: "Tamara Tran",
      handle: "tamarajtran",
      xUrl: "https://x.com/tamarajtran/status/2100694549362553153",
      githubUrl: "https://github.com/tamaratran/fast-jev-compaction",
    },
    creatorQuote: {
      text:
        "Shrink a messy thread before your agent drowns in tokens. Jev keeps the plot, drops the fanfic.",
      attributedTo: "Tamara Tran",
      sourceUrl: "https://x.com/tamarajtran/status/2100694549362553153",
    },
    jevUsage: {
      flowRole: "Context compaction gate on agent tool history",
      primitives: ["Noul"],
      stateIn:
        "Full conversation with tool results replaced by short notes, fitted into maxStateTokens (25k default) using staged truncation described in README.",
      decisionOut:
        "Per tool call: keep result verbatim, keep call with truncated result, or drop call and result based on keepThreshold.",
      flowSteps: [
        "Pair tool_use with tool_result; pin recent and first messages",
        "For each non-pinned call, ask two noul questions (keep call?, keep result verbatim?)",
        "Shard questions across concurrent requests under maxRequestTokens (30k)",
        "Rebuild message list without summarizing user or assistant text",
      ],
      sourcedMetrics: [
        {
          claim: "Default keep threshold applied to keepResult and keepCall noul answers.",
          source: "github.com/tamaratran/fast-jev-compaction README",
        },
      ],
    },
    howJevIsUsed:
      "Compaction never paraphrases content. Jev only answers whether a tool call or its result still matters given the entire transcript state. Noul questions are explicitly documented in the README, including parallel requests when state plus questions would exceed Jev request limits. Failures throw so the Claude Code hook can fall back to default behavior.",
    keyFeatures: [
      "npm library plus Claude Code plugin hooks",
      "Preserves user and assistant messages verbatim",
      "Concurrent shard requests under Jev limits",
      "Configurable preserveRecentMessages and thresholds",
    ],
    stack: ["TypeScript", "Claude Code plugin", "TypeSafe System One", "npm"],
    links: {
      repo: "https://github.com/tamaratran/fast-jev-compaction",
      docs: "https://github.com/tamaratran/fast-jev-compaction#how-it-works",
      post: "https://x.com/tamarajtran/status/2100694549362553153",
    },
    pricingNote: "Bring your own TYPESAFE_API_KEY per README install section.",
    firstSeen: "2026-09-19",
    demoIds: ["context-compaction-tamarajtran"],
    relatedSlugs: ["kushwho-jev-codes", "devagrawal09-jev-review"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Which primitive does compaction use?",
        answer:
          "The README specifies two noul questions per non-pinned tool call: whether to keep the call and whether to keep the result verbatim.",
      },
    ],
    metaTitle: "fast-jev-compaction: Noul gates for Claude Code context",
    metaDescription:
      "Claude Code plugin using parallel Jev noul decisions to drop stale tool rows without LLM summaries. Documented in the fast-jev-compaction README.",
  },

  "hemanth-pkg-gate": {
    slug: "hemanth-pkg-gate",
    status: "published",
    problem:
      "npm lifecycle scripts can exfiltrate or install before humans read package.json hooks.",
    targetUser:
      "Node developers who want a pre-install gate with structured allow, warn, and block verdicts.",
    overview:
      "pkg-gate evaluates package names or raw install scripts with TypeSafe System One before npm hooks run. It exposes TUI and JSON structured output for CI.",
    creator: {
      name: "Hemanth HM",
      handle: "GNUmanth",
      xUrl: "https://x.com/GNUmanth/status/2100405456187564201",
      githubUrl: "https://github.com/hemanth/pkg-gate",
    },
    creatorQuote: {
      text:
        "Intent-aware package installs: block the dependency you did not mean before npm writes to disk.",
      attributedTo: "Hemanth HM",
      sourceUrl: "https://x.com/GNUmanth/status/2100405456187564201",
    },
    jevUsage: {
      flowRole: "Pre-install security gate on lifecycle scripts",
      primitives: ["Choice", "Score"],
      stateIn:
        "Package metadata or raw shell script strings passed to pkgGate(); hooks extracted from package.json for local paths.",
      decisionOut:
        "report.action allow | warn | block with structured intent.choice and probability fields (README structured output example).",
      flowSteps: [
        "Extract preinstall, install, postinstall scripts",
        "Evaluate each script in parallel via System One",
        "Route low confidence to human review per README confidence gate",
      ],
      sourcedMetrics: [
        {
          claim: "Low confidence (conf < 0.50) routes to human review instead of automatic block.",
          source: "github.com/hemanth/pkg-gate README",
        },
      ],
    },
    howJevIsUsed:
      "pkg-gate treats install intent as a Choice problem (example structured field intent.choice: credential_access) and uses Score-style probabilities such as accessesSecrets.probability in documented JSON output. Without TYPESAFE_API_KEY the README documents an offline calibrated simulator fallback.",
    keyFeatures: [
      "pkgGate() API plus CLI",
      "Structured JSON for agents and CI",
      "Raw script evaluation mode",
      "Interactive demo site",
    ],
    stack: ["Node.js", "TypeSafe System One", "npm lifecycle hooks"],
    links: {
      website: "https://hemanth.github.io/pkg-gate/",
      repo: "https://github.com/hemanth/pkg-gate",
      docs: "https://github.com/hemanth/pkg-gate",
      demo: "https://hemanth.github.io/pkg-gate/",
      post: "https://x.com/GNUmanth/status/2100405456187564201",
    },
    pricingNote: "Requires TYPESAFE_API_KEY for live Jev; offline simulator without key per README.",
    firstSeen: "2026-09-19",
    demoIds: ["pkg-gate-gnumanth"],
    relatedSlugs: ["kushwho-jev-codes", "classifier-dev"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Does pkg-gate replace npm audit?",
        answer: "No. It judges install script intent, not CVE databases.",
      },
    ],
    metaTitle: "pkg-gate: Choice and Score npm install gate",
    metaDescription:
      "Pre-install System One gate with structured allow, warn, and block verdicts. Hemanth pkg-gate README plus live demo.",
  },

  "devagrawal09-jev-review": {
    slug: "devagrawal09-jev-review",
    status: "published",
    problem:
      "Monolithic LLM code reviews are slow and non-deterministic compared to staged structured judgments.",
    targetUser:
      "Developers running local diff or full-repo reviews with a dashboard on localhost.",
    overview:
      "jev-review orchestrates a staged review pipeline in TypeScript and uses Jev for bounded judgments, presenting reports in a local dashboard on 127.0.0.1:4317.",
    creator: {
      name: "Dev Agrawal",
      githubUrl: "https://github.com/devagrawal09",
      company: "Independent",
    },
    jevUsage: {
      flowRole: "Multi-stage code review and codebase scan judgments",
      primitives: ["Noul", "Choice", "Score"],
      stateIn:
        "Git diffs or discovered source files plus selected evidence hunks and test context per README workflow.",
      decisionOut:
        "Staged risk matrix, file profiles, evidence selection, mechanism classification, severity scores, and reviewer routing decisions.",
      flowSteps: [
        "Noul risk matrix",
        "Choice + Score file profiles",
        "Choice evidence selection",
        "Choice mechanism classification",
        "Score severity",
        "Conditional Choice reviewer routing",
      ],
    },
    howJevIsUsed:
      "The README documents an explicit pipeline where each stage is a focused Jev call type. Policy thresholds live in TypeScript, not in model prose. The dashboard binds to localhost and never serves .env files, which makes the tool suitable for experimenting with parallel questions before wiring CI gates.",
    keyFeatures: [
      "review:changes and review:codebase modes",
      "Local dashboard with collapsible sections",
      "Requires Node.js 24+ and TYPESAFE_API_KEY",
      "Dependency-layer enforcement via scripts/check-dependencies.ts",
    ],
    stack: ["TypeScript", "Node.js 24+", "Git", "TypeSafe System One"],
    links: {
      repo: "https://github.com/devagrawal09/jev-review",
      docs: "https://github.com/devagrawal09/jev-review#how-it-works",
    },
    pricingNote: "Uses TypeSafe API key from console.typesafe.ai per README.",
    firstSeen: "2026-09-19",
    demoIds: ["code-review-gate-kunal"],
    relatedSlugs: ["kushwho-jev-codes", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "How is this different from jev-codes?",
        answer:
          "jev-review is a staged review dashboard. jev-codes audits diffs against YAML standards packs with per-hunk parallel calls.",
      },
    ],
    metaTitle: "jev-review: staged Noul, Choice, and Score reviews",
    metaDescription:
      "Local Jev review pipeline with documented stages from risk matrix through severity Score. GitHub README and dashboard on localhost.",
  },

  "ploy-ai": {
    slug: "ploy-ai",
    status: "published",
    problem:
      "Marketing teams run heavy A/B programs to test headlines and layouts for each visitor segment.",
    targetUser:
      "Growth teams using Ploy's AI-native site builder for funnel personalization.",
    overview:
      "Ploy (ploy.ai) is an AI-native site builder. The public Bryant Chou showcase clip describes Jev choosing headline, layout, and copy per visitor segment.",
    creator: {
      name: "Bryant Chou",
      handle: "bryantchou",
      xUrl: "https://x.com/bryantchou/status/2101485995669770522",
      company: "Ploy",
      companyUrl: "https://ploy.ai",
    },
    creatorQuote: {
      text:
        "Ploy reads your funnel, Jev picks headline and layout for each segment in about twenty-five milliseconds. A/B tests without the all-hands.",
      attributedTo: "Bryant Chou",
      sourceUrl: "https://x.com/bryantchou/status/2101485995669770522",
    },
    jevUsage: {
      flowRole: "On-page personalization routing (headline, layout, copy selection)",
      primitives: ["Choice"],
      stateIn:
        "Visitor or segment context plus variant catalog (inferred from showcase description; no open-source schema on this directory).",
      decisionOut:
        "Selected headline and layout variant per visitor according to the launch clip.",
      sourcedMetrics: [
        {
          claim: "About twenty-five millisecond decisions per visitor in the launch clip.",
          source: "Jev Directory showcase blurb citing Bryant Chou post",
        },
      ],
    },
    howJevIsUsed:
      "Ploy uses Jev for discrete variant selection rather than generating entire pages from scratch on every request, per the attributed launch clip. This profile does not claim internal Ploy schemas beyond what Bryant Chou published; treat ploy.ai as the product source of truth for funnels and analytics.",
    keyFeatures: [
      "AI-native site builder at ploy.ai",
      "Segment-aware copy and layout selection in public demo",
      "Featured homepage showcase embed",
    ],
    stack: ["Ploy hosted platform", "TypeSafe System One (per builder clip)"],
    links: {
      website: "https://ploy.ai",
      post: "https://x.com/bryantchou/status/2101485995669770522",
    },
    firstSeen: "2026-09-19",
    demoIds: ["ploy-jev-websites-bryantchou"],
    relatedSlugs: ["classifier-dev", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Can I verify latency independently?",
        answer:
          "The ~25ms figure comes from the attributed X clip on this site's showcase. Measure on your own funnel inside Ploy for production SLOs.",
      },
    ],
    metaTitle: "Ploy: Choice-driven funnel personalization",
    metaDescription:
      "ploy.ai marketing builder with Jev picking headline and layout per segment. Sourced from Bryant Chou showcase clip on Jev Directory.",
  },

  "kushwho-jev-codes": {
    slug: "kushwho-jev-codes",
    status: "published",
    problem:
      "Agent-written diffs need merge gates that stay consistent across repos and agents.",
    targetUser:
      "Teams using Claude Code, Cursor, Codex, opencode, or Antigravity with YAML standards packs.",
    overview:
      "jev-codes audits git diffs hunk-by-hunk against editable YAML standards. Jev answers typed questions; it never writes code.",
    creator: {
      name: "Kushal Agarwal",
      handle: "kushwho11146",
      xUrl: "https://x.com/kushwho11146/status/2101103318386758011",
      githubUrl: "https://github.com/kushwho/jev-codes",
    },
    creatorQuote: {
      text:
        "Point Jev at your diff and a YAML standards pack. Your agent gets a merge opinion that is not vibes-only.",
      attributedTo: "Kushal Agarwal",
      sourceUrl: "https://x.com/kushwho11146/status/2101103318386758011",
    },
    jevUsage: {
      flowRole: "Pre-merge audit gate on changed hunks",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Per-hunk state {file, language, hunk, context_before, context_after} under 24k token budget per README.",
      decisionOut:
        "Thresholded pass or fail per pack question; JSON or TTY report with fail-on levels.",
      flowSteps: [
        "git diff to hunks, filter ignores",
        "One parallel Jev call per hunk (eight in flight)",
        "Apply thresholds and min_confidence from YAML pack",
      ],
      sourcedMetrics: [
        {
          claim: "Eval runner reports HIGH gate precision 1.000 on six cases at ~$0.0006 for 17 calls.",
          source: "github.com/kushwho/jev-codes README eval section",
        },
      ],
    },
    howJevIsUsed:
      "Packs are YAML question definitions including noul items that skip the confidence gate by design. The CLI caches answers by hash of state plus question text so reruns only re-score changed hunks. Agents invoke audit --json and fix only high or medium findings at reported lines per harness adapters.",
    keyFeatures: [
      "npx @kushwho/jev-codes audit with --json for agents",
      "Bundled core pack plus per-repo .jev-codes/standards.yaml",
      "Harness plugins for Claude, Cursor, Codex, opencode, Antigravity",
      "jev-codes-eval labeled diff suite in repo",
    ],
    stack: ["TypeScript CLI", "YAML standards packs", "Git", "TypeSafe System One"],
    links: {
      repo: "https://github.com/kushwho/jev-codes",
      docs: "https://github.com/kushwho/jev-codes#how-it-works",
      post: "https://x.com/kushwho11146/status/2101103318386758011",
    },
    pricingNote: "Live Jev calls require TYPESAFE_API_KEY; README cites fraction-of-a-cent per audit.",
    firstSeen: "2026-09-19",
    demoIds: ["jev-codes-kushwho"],
    relatedSlugs: ["devagrawal09-jev-review", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev edit my code?",
        answer: "No. README states Jev only answers typed questions; agents apply fixes.",
      },
    ],
    metaTitle: "jev-codes: YAML standards audit gate with Jev",
    metaDescription:
      "Parallel per-hunk Jev audits against YAML packs. Kushal jev-codes README, eval metrics, and showcase clip.",
  },

  "tanstack-ai-decide": {
    slug: "tanstack-ai-decide",
    status: "published",
    problem:
      "TypeScript apps need typed decision helpers instead of raw System One HTTP for every agent feature.",
    targetUser:
      "Developers using TanStack AI who want decide() for structured agent control flow.",
    overview:
      "TanStack AI adds decide() for typed Choice, Score, and boolean paths. Documentation lives on tanstack.com/ai with source in github.com/TanStack/ai.",
    creator: {
      name: "TanStack",
      handle: "tan_stack",
      xUrl: "https://x.com/tan_stack/status/2101659024890765819",
      company: "TanStack",
      companyUrl: "https://tanstack.com",
      githubUrl: "https://github.com/TanStack/ai",
    },
    creatorQuote: {
      text:
        "TanStack ships decide() for typed choices, scores, and booleans so your agent loop stops faking it as a chatbot.",
      attributedTo: "TanStack",
      sourceUrl: "https://x.com/tan_stack/status/2101659024890765819",
    },
    jevUsage: {
      flowRole: "Application and agent routing via decide() API",
      primitives: ["Choice", "Score", "Noul"],
      stateIn: "Typed decide() inputs as defined in TanStack AI docs for your runtime.",
      decisionOut: "Structured decision results consumable in TypeScript control flow.",
      flowSteps: [
        "Call decide() from TanStack AI",
        "Map to System One semantics",
        "Threshold probabilities in app code",
      ],
    },
    howJevIsUsed:
      "decide() is TanStack's ergonomic surface for System One style questions. The launch clip on Jev Directory shows agent code using decide() instead of parsing chat completions. Pair TanStack AI with gateway or TypeSafe keys per TanStack docs for your deployment target.",
    keyFeatures: [
      "decide() API for choices, scores, and booleans",
      "Official docs at tanstack.com/ai",
      "Open source monorepo on GitHub",
      "Homepage showcase clip",
    ],
    stack: ["TypeScript", "TanStack AI", "TypeSafe System One"],
    links: {
      website: "https://tanstack.com/ai/latest",
      repo: "https://github.com/TanStack/ai",
      docs: "https://tanstack.com/ai/latest",
      post: "https://x.com/tan_stack/status/2101659024890765819",
    },
    firstSeen: "2026-09-19",
    demoIds: ["tanstack-ai-decide-tanstack"],
    relatedSlugs: ["vercel-eve", "classifier-dev"],
    relatedLearnSlugs: ["vercel-ai-gateway", "jev-typesafe"],
    faq: [
      {
        question: "Is decide() only for React?",
        answer: "TanStack AI documents multiple runtimes; read tanstack.com/ai for your stack.",
      },
    ],
    metaTitle: "TanStack AI decide(): Choice, Score, Noul in TypeScript",
    metaDescription:
      "TanStack AI decide() exposes System One primitives in TypeScript. Official docs, GitHub repo, and TanStack launch clip.",
  },

  "dub-co": {
    slug: "dub-co",
    status: "published",
    problem:
      "Free short links attract lead gen traffic and abusive actors who paste phishing URLs through the same dub.sh funnel.",
    targetUser:
      "Teams running Dub link campaigns who need scalable abuse detection without paying chat-model prices per click.",
    overview:
      "Dub (dub.co) is a link management and analytics platform. Steven Tey's weekend project clip describes building a malicious URL scanner for dub.sh using Jev, trained on ten thousand plus malicious domains Dub already caught historically.",
    creator: {
      name: "Steven Tey",
      handle: "steventey",
      xUrl: "https://x.com/steventey/status/2101706435898069093",
      company: "Dub",
      companyUrl: "https://dub.co",
    },
    creatorQuote: {
      text:
        "Feed malicious domains into Jev, train it to flag malicious-looking URLs, and keep scanning cost negligible thanks to token-efficient Jev.",
      attributedTo: "Steven Tey",
      sourceUrl: "https://x.com/steventey/status/2101706435898069093",
    },
    jevUsage: {
      flowRole: "Abuse detection gate on new short links",
      primitives: ["Noul", "Score"],
      stateIn:
        "Candidate URL text plus historical malicious domain patterns described in the launch thread (ten thousand plus known bad domains).",
      decisionOut:
        "Malicious or suspicious URL flag before the link spreads on dub.sh, per the attributed build clip.",
      flowSteps: [
        "Collect historical malicious domains from Dub abuse operations",
        "Train or calibrate Jev scoring on malicious-looking URL features",
        "Run cheap Jev checks on incoming dub.sh links at creation time",
      ],
      sourcedMetrics: [
        {
          claim: "Built and shipped the scanner in about two hours after wrestling with abuse since day one.",
          source: "Steven Tey X thread on malicious link scanner",
        },
      ],
    },
    howJevIsUsed:
      "Instead of calling a general LLM on every new short link, Dub's clip uses Jev as a fast structured classifier over URL text informed by prior abuse data. Token efficiency keeps marginal scan cost near zero at link volume. This profile does not claim undisclosed Dub internal APIs beyond Steven Tey's public post.",
    keyFeatures: [
      "Branded links and analytics at dub.co",
      "dub.sh free tier lead gen with abuse risk",
      "Jev-backed malicious URL scanner from public demo",
    ],
    stack: ["Dub platform", "dub.sh short links", "TypeSafe System One"],
    links: {
      website: "https://dub.co",
      post: "https://x.com/steventey/status/2101706435898069093",
    },
    firstSeen: "2026-09-20",
    demoIds: ["dub-malicious-urls-steventey"],
    relatedSlugs: ["classifier-dev", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Is the scanner live for all dub.sh links?",
        answer:
          "This directory documents the pattern from Steven Tey's public clip. Confirm rollout scope on dub.co or Dub changelogs.",
      },
    ],
    metaTitle: "Dub: Jev malicious URL scanner for dub.sh",
    metaDescription:
      "Dub link platform abuse detection with Jev trained on historical malicious domains. Steven Tey showcase clip on Jev Directory.",
  },

  "avec-ai": {
    slug: "avec-ai",
    status: "published",
    problem:
      "Email clients default to reverse chronological inboxes, burying urgent threads under newsletter noise.",
    targetUser:
      "Knowledge workers who want incoming mail re-ranked by importance in real time.",
    overview:
      "Avec (avec.ai) is an email product teased by Jonathan Unikowski with live inbox prioritization powered by Jev instead of static chronological sorting.",
    creator: {
      name: "Jonathan Unikowski",
      handle: "jnnnthnn",
      xUrl: "https://x.com/jnnnthnn/status/2101399331115077760",
      company: "Avec",
      companyUrl: "https://avec.ai",
    },
    creatorQuote: {
      text:
        "What if your inbox was live prioritized by importance instead of reverse chronological order? Built with Jev.",
      attributedTo: "Jonathan Unikowski",
      sourceUrl: "https://x.com/jnnnthnn/status/2101399331115077760",
    },
    jevUsage: {
      flowRole: "Live importance ranking as messages arrive",
      primitives: ["Score", "Choice"],
      stateIn:
        "Incoming message metadata and body snippets plus current inbox context (inferred from showcase; no public schema beyond the clip).",
      decisionOut:
        "Dynamic ordering or priority labels so important threads surface immediately.",
      flowSteps: [
        "Ingest new mail events",
        "Jev scores importance relative to user context",
        "Reorder or highlight inbox UI live",
      ],
    },
    howJevIsUsed:
      "The showcase positions Jev as the fast structured ranker that can run continuously on mail streams without rewriting the whole message in an LLM on every ping. Avec is marked coming soon in the source post; treat feature availability on avec.ai as the source of truth.",
    keyFeatures: [
      "Live prioritization instead of reverse chronology",
      "Public teaser at avec.ai",
      "Homepage showcase embed",
    ],
    stack: ["Avec email client", "TypeSafe System One"],
    links: {
      website: "https://avec.ai",
      post: "https://x.com/jnnnthnn/status/2101399331115077760",
    },
    firstSeen: "2026-09-20",
    demoIds: ["avec-email-priority-jnnnthnn"],
    relatedSlugs: ["classifier-dev", "ploy-ai"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Can I sign up today?",
        answer:
          "The attributed clip says coming to Avec soon. Check avec.ai for current access.",
      },
    ],
    metaTitle: "Avec: Jev live email importance ranking",
    metaDescription:
      "Avec email client teaser with Jev prioritizing inbox threads in real time. Jonathan Unikowski showcase on Jev Directory.",
  },

  "pixelml-com": {
    slug: "pixelml-com",
    status: "published",
    problem:
      "Agentic video Q&A over long files is slow and expensive when every retrieval hop uses a large multimodal model.",
    targetUser:
      "Teams indexing enterprise video libraries with many queries over the same corpus.",
    overview:
      "PixelML (pixelml.com) ships pixelml-av, the open-source library behind Composer and Sentinel agents that index video to text for LLM reasoning. Sean Phan's clip benchmarks Grok plus Jev against Gemini Flash native video on a seventy-five minute file.",
    creator: {
      name: "Sean Phan",
      handle: "seanphan",
      xUrl: "https://x.com/seanphan/status/2101398226654171359",
      company: "PixelML",
      companyUrl: "https://pixelml.com",
    },
    creatorQuote: {
      text:
        "pixelml-av plus Grok plus Jev: about two tenths of a cent per query and four seconds on eight questions over seventy-five minutes of video.",
      attributedTo: "Sean Phan",
      sourceUrl: "https://x.com/seanphan/status/2101398226654171359",
    },
    jevUsage: {
      flowRole: "Relevance filter before Grok answers and support check after",
      primitives: ["Noul", "Score"],
      stateIn:
        "Retrieved candidate evidence with pixelml-av local temporal grouping bound to each query.",
      decisionOut:
        "Relevance pass on candidates, Grok answer, then support check with optional frame reinspection when confidence is low.",
      flowSteps: [
        "Query retrieves candidate evidence from indexed video",
        "Jev checks relevance with av local temporal context",
        "Grok generates answer",
        "Jev support check; low confidence triggers frame inspection",
      ],
      sourcedMetrics: [
        {
          claim: "Eight questions on a seventy-five minute video: about $0.0022 per query and 4.0s for av plus Grok plus Jev vs $0.2253 and 39.9s for Gemini 3.8 Flash native in the clip.",
          source: "Sean Phan X benchmark post",
        },
        {
          claim: "Described as about 100x cheaper and 10x faster than Gemini Flash native in the same post.",
          source: "Sean Phan X benchmark post",
        },
      ],
    },
    howJevIsUsed:
      "Jev acts as a System One refiner on the search path: fast cheap gates on whether evidence matters and whether Grok's answer is supported, reserving heavier vision calls for low-confidence reinspection. This matches PixelML's stated move away from using the LLM alone to verify every retrieval.",
    keyFeatures: [
      "pixelml-av open-source video indexing library",
      "Composer and Sentinel agents at pixelml.com",
      "Grok plus Jev refiner pipeline in public demo",
    ],
    stack: ["pixelml-av", "Grok", "TypeSafe System One", "PixelML agents"],
    links: {
      website: "https://pixelml.com",
      post: "https://x.com/seanphan/status/2101398226654171359",
    },
    firstSeen: "2026-09-20",
    demoIds: ["pixelml-av-grok-jev-seanphan"],
    relatedSlugs: ["browser-use-jev-ultrafast", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is pixelml-av open source?",
        answer:
          "Sean Phan's post describes pixelml-av as the open-source library behind PixelML agents. Confirm repo links on pixelml.com.",
      },
    ],
    metaTitle: "PixelML: Grok plus Jev video Q&A with pixelml-av",
    metaDescription:
      "pixelml-av indexes video; Jev filters relevance and checks answer support before costly vision calls. Sean Phan benchmark clip.",
  },

  "hypit-ai": {
    slug: "hypit-ai",
    status: "published",
    problem:
      "Marketers need many distinct AI UGC creators without copy-paste faces or manual art direction for every variant.",
    targetUser:
      "Growth and creative teams using Hypit for AI UGC avatar campaigns.",
    overview:
      "Hypit (hypit.ai) generates unique AI UGC creators with natural expressions. The launch clip uses Jev to pick style combinations from product, audience, and vibe inputs before Hypit renders one hundred creators in about thirteen seconds.",
    creator: {
      name: "Hypit",
      handle: "hypitai",
      xUrl: "https://x.com/hypitai/status/2101686320909426977",
      company: "Hypit",
      companyUrl: "https://hypit.ai",
    },
    creatorQuote: {
      text:
        "Drop product, audience, and vibe into Jev. It picks styles that fit, then Hypit remixes them into fresh randomized combinations.",
      attributedTo: "Hypit",
      sourceUrl: "https://x.com/hypitai/status/2101686320909426977",
    },
    jevUsage: {
      flowRole: "Creative style and persona mix selection",
      primitives: ["Choice"],
      stateIn:
        "Marketer brief: product description, target audience, and desired vibe from the launch post.",
      decisionOut:
        "Selected UGC style combinations Hypit renders into distinct creators.",
      sourcedMetrics: [
        {
          claim: "One hundred unique AI UGC creators in about 13.07 seconds in the launch clip.",
          source: "Hypit X launch post",
        },
      ],
    },
    howJevIsUsed:
      "Jev chooses which creative styles fit the brief so Hypit is not brute-forcing random faces. Discrete Choice routing keeps generation fast enough for interactive campaign tooling. Confirm Hypit product UI details on hypit.ai.",
    keyFeatures: [
      "AI UGC creators with distinct looks and personalities",
      "Brief-driven style selection via Jev",
      "Public launch clip with timing claim",
    ],
    stack: ["Hypit platform", "TypeSafe System One"],
    links: {
      website: "https://hypit.ai",
      post: "https://x.com/hypitai/status/2101686320909426977",
    },
    firstSeen: "2026-09-20",
    demoIds: ["hypit-ugc-styles-hypitai"],
    relatedSlugs: ["ploy-ai", "dub-co"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Jev generate the video avatars?",
        answer:
          "The post describes Jev picking styles while Hypit renders creators. Generation stack details live on hypit.ai.",
      },
    ],
    metaTitle: "Hypit: Jev style picks for AI UGC creators",
    metaDescription:
      "Hypit UGC studio uses Jev to choose creative mixes from marketer briefs. Launch clip on Jev Directory.",
  },

  "egghead-smart-procurement": {
    slug: "egghead-smart-procurement",
    status: "published",
    problem:
      "Manufacturing procurement teams lose hours on repetitive ERP data entry into SAP, Oracle, and similar systems.",
    targetUser:
      "Japanese manufacturers and integrators deploying Egghead Smart AI procurement with forward-deployed engineering.",
    overview:
      "Egghead Inc. (egghead.co.jp) offers Smart AI procurement for manufacturing. A sakai_1910 showcase clip praises Jev browser operation speed for ERP busywork and argues combining FDE services with Jev beats narrow SaaS alone.",
    creator: {
      name: "sakai",
      handle: "sakai_1910",
      xUrl: "https://x.com/sakai_1910/status/2101536551360704770",
      company: "Egghead Inc.",
      companyUrl: "https://www.egghead.co.jp",
    },
    creatorQuote: {
      text:
        "Jev browser ops are overwhelmingly fast for manufacturing procurement, including tedious input into SAP and Oracle core systems.",
      attributedTo: "sakai",
      sourceUrl: "https://x.com/sakai_1910/status/2101536551360704770",
    },
    jevUsage: {
      flowRole: "Fast browser automation routing for ERP form workflows",
      primitives: ["Choice"],
      stateIn:
        "Browser snapshots and procurement task context for SAP, Oracle, and similar web or terminal-adjacent UIs (per clip examples).",
      decisionOut:
        "Next browser operation targets for data entry and procurement steps without slow LLM planning on every click.",
      flowSteps: [
        "Observe ERP or procurement UI state",
        "Jev chooses next browser operation",
        "Execute entry steps across systems PC operators already use",
      ],
    },
    howJevIsUsed:
      "The clip highlights Jev's speed on browser-use style routing for manufacturing back-office tasks. Egghead positions Smart AI procurement as a domain-specific deployment with integrator support rather than generic RPA alone. Detailed schemas are not public in the X post; confirm implementation docs with Egghead.",
    keyFeatures: [
      "Smart AI procurement product on egghead.co.jp",
      "Manufacturing-focused procurement automation",
      "Jev-speed browser ops in public Japanese showcase",
    ],
    stack: ["Egghead Smart AI procurement", "SAP and Oracle UIs", "TypeSafe System One", "Browser automation"],
    links: {
      website: "https://www.egghead.co.jp",
      post: "https://x.com/sakai_1910/status/2101536551360704770",
    },
    firstSeen: "2026-09-20",
    demoIds: ["egghead-procurement-sakai1910"],
    relatedSlugs: ["browser-use-jev-ultrafast", "rtrvr-ai"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is the demo in English?",
        answer:
          "The source clip is Japanese commentary about manufacturing procurement. Product pages on egghead.co.jp carry official language.",
      },
    ],
    metaTitle: "Egghead Smart AI procurement with Jev browser ops",
    metaDescription:
      "Egghead manufacturing procurement uses fast Jev browser routing for ERP entry. sakai_1910 showcase on Jev Directory.",
  },

  docjev: {
    slug: "docjev",
    status: "published",
    problem:
      "Document pipelines need fast category labels and split boundaries without paying chat-model prices on every page.",
    targetUser:
      "Teams building ingestion, RAG, or compliance flows over PDFs and scans who want rule-driven classify and split steps.",
    overview:
      "DocJev is an open-source library from Jerry Liu (github.com/jerryjliu/docjev) for document classification and splitting with TypeSafe Jev. Supply natural-language category rules alongside document text; Jev returns a predicted category or sub-document boundaries.",
    creator: {
      name: "Jerry Liu",
      handle: "jerryjliu0",
      xUrl: "https://x.com/jerryjliu0/status/2101738281046294552",
      githubUrl: "https://github.com/jerryjliu/docjev",
      company: "LlamaIndex",
      companyUrl: "https://www.llamaindex.ai",
    },
    creatorQuote: {
      text:
        "Give a document alongside natural language category rules. Jev will predict the document category or the boundaries between sub-documents.",
      attributedTo: "Jerry Liu",
      sourceUrl: "https://x.com/jerryjliu0/status/2101738281046294552",
    },
    jevUsage: {
      flowRole: "Document classification and split-boundary prediction",
      primitives: ["Choice", "Score"],
      stateIn:
        "Parsed document text from liteparse or LlamaParse plus user-authored natural-language category or split rules from the DocJev API.",
      decisionOut:
        "Predicted document category for classify mode, or boundary decisions between sub-documents for split mode.",
      flowSteps: [
        "Parse document with liteparse (OSS) or LlamaParse (VLM preprocessing)",
        "Format rules and text for Jev System One calls",
        "Jev classifies or marks split boundaries per DocJev configuration",
      ],
      sourcedMetrics: [
        {
          claim: "About six times faster than gpt-5.6-luna with equivalent accuracy in the launch benchmark (liteparse timings included).",
          source: "Jerry Liu DocJev announcement on X",
        },
      ],
    },
    howJevIsUsed:
      "DocJev wraps Jev as the decision core for both classify and split workflows so teams express policy in natural language instead of brittle regex. liteparse is the default fast OSS parser for digital documents; LlamaParse adds VLM preprocessing latency but suits cached digitization for downstream LlamaIndex tasks. Confirm latest benchmarks and APIs in the DocJev repository.",
    keyFeatures: [
      "Open source at github.com/jerryjliu/docjev",
      "Classify and split modes with natural-language rules",
      "liteparse integration (github.com/run-llama/liteparse)",
      "Optional LlamaParse via cloud.llamaindex.ai",
    ],
    stack: ["DocJev", "TypeSafe System One", "liteparse", "LlamaParse", "LlamaIndex ecosystem"],
    links: {
      repo: "https://github.com/jerryjliu/docjev",
      website: "https://www.llamaindex.ai",
      docs: "https://github.com/jerryjliu/docjev",
      post: "https://x.com/jerryjliu0/status/2101738281046294552",
    },
    firstSeen: "2026-09-20",
    demoIds: ["docjev-jerryjliu0"],
    relatedSlugs: ["wiktorb2004-llama-index-jev", "classifier-dev", "marissafamularo-citation-verifier"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is DocJev part of LlamaIndex core?",
        answer:
          "DocJev is a standalone OSS repo from Jerry Liu. It integrates optional LlamaParse and liteparse from the Run Llama ecosystem; treat github.com/jerryjliu/docjev as the source of truth.",
      },
    ],
    metaTitle: "DocJev: Jev document classify and split",
    metaDescription:
      "Jerry Liu DocJev uses Jev for fast document classification and splitting with natural-language rules. Launch clip and GitHub repo on Jev Directory.",
  },

  "socai-io-jev-social": {
    slug: "socai-io-jev-social",
    status: "published",
    problem:
      "Social research agents often free-form shell commands or opaque browser macros, which is risky on logged-in Instagram, TikTok, and LinkedIn sessions.",
    targetUser:
      "Analysts and builders who want local-first social evidence gathering with auditable steps and cited Markdown output.",
    overview:
      "Jev Social pairs a System One decision provider with the socai CLI. You state a research goal; each loop rebuilds a finite menu of read-only socai commands (search, open a discovered profile or post, read comments, inspect state, finish, or download selected TikTok media only when the goal explicitly requests it). The provider selects the next operation; socai executes in the user's Chrome and returns structured observations. The UI stores choice, confidence, command, summary, and timing per step, then compiles cards, tables, and an evidence report with source links.",
    creator: {
      name: "socai",
      handle: "Asklv123123123",
      xUrl: "https://x.com/Asklv123123123",
      githubUrl: "https://github.com/socai-io/jev-social",
      company: "socai",
      companyUrl: "https://socai.io",
    },
    jevUsage: {
      flowRole: "Per-step routing over a dynamic catalog of socai CLI operations",
      primitives: ["Choice"],
      stateIn:
        "User goal, platform context, history of prior operations with observed summaries, and enumerated command targets derived from captured results or explicit URLs.",
      decisionOut:
        "Next allowed socai command or finish; confidence recorded per README. Unsupported, malformed, and low-confidence decisions do not run; failed ops are removed from the next choice set.",
      flowSteps: [
        "Build bounded operation list from socai capabilities and prior results",
        "Jev Choice picks platform (auto mode) then next operation",
        "socai CLI runs read-only command in Chrome",
        "Append observation and repeat until finish or max-steps",
        "Compile cited Markdown report from captured text and links",
      ],
    },
    howJevIsUsed:
      "Jev never emits arbitrary shell commands or DOM coordinates. It only chooses among commands the app exposes, matching the Browser Use pattern of finite actions over structured state. Confidence and policy live in application code: sub-threshold or invalid picks are dropped before socai runs. The released provider boundary supports OpenRouter Jev or an explicit loopback /v1/systemone endpoint; the local path rejects redirects and never receives the OpenRouter key. Step limits (--max-steps, default 12) bound cost while partial results remain honest when login walls or decision failures appear.",
    keyFeatures: [
      "Instagram, TikTok, and LinkedIn operation tables in README",
      "Release-pinned npx github:socai-io/jev-social#v0.1.8 onboarding without cloning",
      "Loopback web UI at 127.0.0.1:8766 plus CLI search mode",
      "Per-step telemetry: choice, confidence, command, elapsed time",
      "Marketing site and GIF demos linked from repository",
    ],
    stack: [
      "Node 20+",
      "socai CLI (Chrome automation)",
      "System One via OpenRouter Jev or an explicit loopback endpoint",
      "JavaScript",
    ],
    links: {
      website: "https://socai-io.github.io/jev-social/",
      repo: "https://github.com/socai-io/jev-social",
      docs: "https://github.com/socai-io/jev-social",
      demo: "https://socai-io.github.io/jev-social/",
      post: "https://socai.io/blog/jev-social-media-automation/",
    },
    pricingNote:
      "Open source; OpenRouter usage bills to your key when selected. A compatible loopback provider needs no OpenRouter key, while browser and social-platform access still apply. No mock result is substituted when the decision provider is unavailable.",
    firstSeen: "2026-09-20",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
      "jkudish-jev-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev Social run in the cloud?",
        answer:
          "No. The app is local-first with a loopback UI. socai drives your Chrome; README states reports compile from captured evidence without handing browsing to another agent.",
      },
      {
        question: "What happens on low confidence?",
        answer:
          "README: unsupported, malformed, and low-confidence decisions do not execute. The next choice set also omits previously attempted operations.",
      },
      {
        question: "Which platforms are supported?",
        answer:
          "Instagram, TikTok, and LinkedIn via socai commands documented in the Available operations table. Only installed socai CLI commands appear as Jev choices.",
      },
      {
        question: "How do I try it quickly?",
        answer:
          "Run npx github:socai-io/jev-social#v0.1.8 onboard, then npx github:socai-io/jev-social#v0.1.8, or clone the repo and use npm start. You need Node 20+, a current socai CLI, signed-in Chrome access, and either OpenRouter Jev or a compatible loopback System One endpoint.",
      },
    ],
    metaTitle: "Jev Social: typed socai CLI loops for social research",
    metaDescription:
      "Local Jev Choice router over read-only socai commands in Chrome. Instagram, TikTok, LinkedIn evidence to cited Markdown. Open source with live demo site.",
  },

  "mfm-jev-search": {
    slug: "mfm-jev-search",
    status: "published",
    problem:
      "YouTube channel search is either generic Google results or endless scrolling the uploads tab. Founders want \"that episode where they talked about X\" without memorizing titles.",
    targetUser:
      "My First Million listeners, indie hackers, and Jev builders who want a reference channel-search stack with typed gates instead of vibes-only reranking.",
    overview:
      "My First Million × Jev scopes retrieval to @MyFirstMillionPod. Try the live demo at /demos/my-first-million/: hybrid recall plus one Gateway evaluate pass with exists, relevance, topic, and hit questions, then a pile UI with FLIP rise, debug sheet, and caption mention chips with &t= jump links.",
    creator: {
      name: "Rishit Patel",
      handle: "imrishit98",
      xUrl: "https://x.com/imrishit98",
      githubUrl: "https://github.com/imrishit98",
      company: "Southern East Inc.",
      companyUrl: "https://aitools.fyi",
    },
    jevUsage: {
      flowRole: "Query understanding, hybrid shortlist rerank, and per-video match gates",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "User query, channel metadata, and a shortlist of candidate videos with title, description, tags, chapters, and transcript snippets pulled from the local catalog.",
      decisionOut:
        "Intent Choice for query understanding; boolean exists gate; per-candidate relevance, topic, and hit Score/Noul blend with configurable thresholds before results render.",
      flowSteps: [
        "Local lexicon expansion plus Jev Choice intent (guest, series, game, vibe, other)",
        "Hybrid recall: BM25, TF-IDF, fuzzy, and caption-proximity lanes fused with weighted RRF (~12)",
        "Single experimental_evaluate: exists, rel_*, topic_*, hit_* with transcript snippets in state",
        "Weighted blend (0.4 / 0.25 / 0.35) with exists and combined match gates",
        "UI pile, FLIP rise, debug sheet, Mentioned in captions with YouTube &t= links",
      ],
    },
    howJevIsUsed:
      "Jev is not a chat wrapper here. Cloudflare Pages Functions call AI SDK experimental_evaluate with typesafe-ai/jev through the Vercel AI Gateway. One Choice classifies query intent before hybrid recall expands BM25 terms; re-rank still uses the original user query. A single evaluate batches exists, per-candidate relevance and topic booleans, and hit score rubric (off-topic, partial, direct hit) with transcript snippets in state. Application code blends 0.4 / 0.25 / 0.35 and applies exists and match gates. Hybrid recall (including caption-proximity lane) stays local; Jev only sees the shortlist metadata blob.",
    keyFeatures: [
      "Hybrid recall (BM25, TF-IDF, fuzzy to RRF) in hybrid-recall.mjs",
      "Query understanding before BM25 expansion",
      "Multi-question Jev with exists and match confidence gates",
      "Caption mention timestamps and Jump to mention links",
      "Flat-playlist ingest and optional yt-dlp enrichment for captions",
      "Debug sheet with understand, shortlist lanes, and full JSON",
    ],
    stack: [
      "Cloudflare Pages Functions",
      "Vercel AI SDK + AI Gateway",
      "typesafe-ai/jev",
      "Hybrid BM25 / TF-IDF / fuzzy / caption RRF",
    ],
    links: {
      repo: "https://github.com/imrishit98/jev.aitools.fyi",
      docs: "https://jev.aitools.fyi/demos/my-first-million/",
      demo: "https://jev.aitools.fyi/demos/my-first-million/",
    },
    pricingNote:
      "Open source demo. Live Jev calls bill to your AI Gateway key; mock mode skips network.",
    firstSeen: "2026-09-20",
    relatedSlugs: ["classifier-dev", "tanstack-ai-decide", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does this search the whole internet?",
        answer:
          "No. Retrieval and scoring are scoped to the My First Million uploads catalog bundled at src/data/mfm-channel-catalog.json.",
      },
      {
        question: "Can I run it without a Gateway key?",
        answer:
          "Yes. Set JEV_MOCK=true in Cloudflare Pages env vars (or .dev.vars for wrangler pages dev). Mock mode skips Gateway calls and uses deterministic scores.",
      },
      {
        question: "Where do caption jump links come from?",
        answer:
          "When catalog videos include SRT/VTT caption text, the demo finds mention windows and builds YouTube &t= URLs in the feature card.",
      },
    ],
    metaTitle: "My First Million × Jev: search what was said",
    metaDescription:
      "Hybrid recall, Jev multi-question re-rank, and jump-to-caption timestamps for @MyFirstMillionPod. Live demo on jev.aitools.fyi.",
  },

  "shubhankar-jev-fifa": {
    slug: "shubhankar-jev-fifa",
    status: "published",
    problem:
      "Soccer games usually hard-code bot logic or bolt a chat model on top, which is too slow and too vague for eleven independent players plus live presentation layers.",
    targetUser:
      "Builders studying real-time sports sims, Browserbase engineers experimenting with System One, and fans who want proof that Jev can sit inside a 150 ms control loop.",
    overview:
      "Shubhankar Srivastava (Browserbase, shubhankar.xyz) published a FIFA-style rebuild where every outfield player runs its own Jev loop on roughly a 150 millisecond cadence. Each cycle decides tackle, pass, or shoot plus speed and heading. The same build routes commentary and soundtrack choices through Jev rather than a separate generative audio pipeline. The launch clip on X is the primary public artifact; no repo or hosted play link appeared in the thread as of September 2026.",
    creator: {
      name: "Shubhankar Srivastava",
      handle: "_shubhankar",
      xUrl: "https://x.com/_shubhankar/status/2101830589620056160",
      company: "Browserbase",
      companyUrl: "https://www.browserbase.com",
      githubUrl: "https://github.com/shubh24",
    },
    creatorQuote: {
      text:
        "I rebuilt FIFA with Jev! Each player has a Jev loop running every ~150ms, deciding whether it should tackle, pass, shoot, and with what speed/direction. Heck, even the commentary/soundtracks are Jev!",
      attributedTo: "Shubhankar Srivastava",
      sourceUrl: "https://x.com/_shubhankar/status/2101830589620056160",
    },
    jevUsage: {
      flowRole: "Per-player real-time action selection plus presentation routing (commentary and soundtrack)",
      primitives: ["Choice"],
      stateIn:
        "Per-player match state at each tick (positions, ball context, and other fields implied by the clip; exact schema not published outside the build).",
      decisionOut:
        "Discrete soccer actions (tackle, pass, shoot) with speed and direction parameters; separate Jev choices for commentary lines and soundtrack selection per the launch post.",
      flowSteps: [
        "Simulation advances on a sub-second game clock",
        "Each player issues a Jev request about every 150 ms",
        "Engine applies returned actions to movement and ball interaction",
        "Presentation layer queries Jev for commentary and music choices",
      ],
      sourcedMetrics: [
        {
          claim: "Each player runs a Jev loop about every 150 ms.",
          source: "x.com/_shubhankar/status/2101830589620056160",
        },
      ],
    },
    howJevIsUsed:
      "The match treats Jev as the reflex layer for every athlete instead of one monolithic bot brain. That matches the System One pattern: structured state in, typed Choice out, no play-by-play prose between ticks. Shubhankar's post also extends the same primitive to broadcast flavor (commentary and soundtracks), which is unusual for sports demos and shows how sidecar presentation systems can share one fast model. Peyton Casper quoted an earlier shootout goalie prototype from the same author; this profile focuses on the full-pitch FIFA rebuild in Shubhankar's September 2026 clip while the Peyton post remains a related showcase embed on this directory.",
    keyFeatures: [
      "Eleven independent per-player Jev loops at ~150 ms cadence (attributed post)",
      "Tackle, pass, and shoot decisions with speed and direction",
      "Commentary and soundtrack selection also driven by Jev (attributed post)",
      "Featured homepage showcase video embed on Jev Directory",
      "Creator site at shubhankar.xyz and GitHub shubh24 for other experiments",
    ],
    stack: [
      "TypeSafe System One (Jev)",
      "Custom FIFA-style sim (details not open-sourced in the launch thread)",
    ],
    links: {
      website: "https://shubhankar.xyz/",
      post: "https://x.com/_shubhankar/status/2101830589620056160",
      demo: "https://x.com/_shubhankar/status/2101830589620056160",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jev-fifa-rebuild-shubhankar", "jev-shootout-goalie-peytoncasper"],
    relatedSlugs: [
      "fhshaik-typesafe-mario",
      "enoyola-jev-grand-prix",
      "lukaske-jev-doom-agent",
      "jev-arcade",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is there a public repo or playable URL?",
        answer:
          "Not in the September 2026 launch thread. This directory lists the attributed X clip and showcase embed until Shubhankar publishes a repo or demo link.",
      },
      {
        question: "How does the Peyton Casper goalie clip relate?",
        answer:
          "Peyton Casper posted that @_shubhankar built a Jev-powered goalie for a shootout-style soccer game before the full FIFA rebuild. We host both videos as showcases but keep one product profile for the full-match build Shubhankar described.",
      },
      {
        question: "Which Jev primitives are documented?",
        answer:
          "The public post describes discrete action picks (tackle, pass, shoot, speed, direction) and presentation choices. Treat those as Choice-style decisions; no Score or Noul usage was claimed in the thread.",
      },
    ],
    metaTitle: "Shubhankar Jev FIFA rebuild: 150 ms player loops",
    metaDescription:
      "Browserbase builder Shubhankar's FIFA-style sim with per-player Jev loops, commentary, and soundtracks. Facts sourced from the September 2026 launch clip on X.",
  },

  "enoyola-jev-grand-prix": {
    slug: "enoyola-jev-grand-prix",
    status: "published",
    problem:
      "Racing AI that steers the wheel directly from slow model replies weaves off track; F1 speeds cover twenty meters before an answer returns.",
    targetUser:
      "Developers learning the goal-versus-actuator split for real-time sims and hobbyists who want a local Jev race engineer.",
    overview:
      "Jev Grand Prix is an open F1 toy from enoyola. A Python server turns car telemetry into engineer prose, batches three System One questions (line Choice, pedal Choice, trouble Noul), and lets browser physics steer toward the chosen line at 120 Hz. Between laps, code compares sector notes and asks Jev once per corner whether to push, hold, or back off on a grip-percent ladder documented in the README.",
    creator: {
      name: "enoyola",
      handle: "enoyola",
      githubUrl: "https://github.com/enoyola",
    },
    jevUsage: {
      flowRole: "High-level racing line and pedal selection; separate lap-level corner pace planner",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Speed, track position, corner context, and natural-language sector notes generated from lap timing (see server.py and README tables).",
      decisionOut:
        "Target line across five lateral buckets, pedal mode among throttle/brake steps, and trouble probability; per-corner faster/same/slower plan between laps.",
      flowSteps: [
        "Browser sends telemetry several times per second",
        "Server composes engineer text and batches three questions per request (~0.27 s cited)",
        "Client steers and applies brake-by-wire toward targets at 120 Hz",
        "At lap end, code summarizes sectors and asks Jev for per-corner pace adjustments",
      ],
      sourcedMetrics: [
        {
          claim: "Typical Jev answer latency about 0.27 s; direct wheel steering caused nine off-tracks in the first test lap.",
          source: "github.com/enoyola/jev-grand-prix README",
        },
        {
          claim: "Eight-lap test improved best lap from 59.2 s (standing start) to 50.9 s with real Jev calls.",
          source: "github.com/enoyola/jev-grand-prix README lap table",
        },
      ],
    },
    howJevIsUsed:
      "The README is explicit that Jev picks goals while code executes them, matching the Pokemon and Minecraft patterns TypeSafe cites. Noul powers the Trouble meter so the model can express leave-the-track risk without free text. The race-engineer ladder is a teaching tool: memory lives in deterministic lap analytics, while Jev only judges the next incremental pace change per corner. You can race Jev or drive yourself with arrow keys on localhost:8765 after uv run server.py.",
    keyFeatures: [
      "Local browser client plus Python server (uv run server.py)",
      "Three batched questions per driving decision",
      "Optional human driver with camera toggle",
      "Race engineer panel with per-corner history",
      "Documented eight-lap improvement curve with real API calls",
    ],
    stack: ["Python", "uv", "Browser client", "TypeSafe System One API"],
    links: {
      repo: "https://github.com/enoyola/jev-grand-prix",
      docs: "https://github.com/enoyola/jev-grand-prix",
      demo: "http://localhost:8765",
    },
    pricingNote: "Requires your TypeSafe API key; README uses console.typesafe.ai early access.",
    firstSeen: "2026-09-21",
    relatedSlugs: ["shubhankar-jev-fifa", "fhshaik-typesafe-mario", "thumay9700-jev-plays"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Why not steer the wheel directly from Jev?",
        answer:
          "README reports weaving and nine off-tracks when Jev commanded the wheel; line plus pedal targets with fast local steering fixed clean laps.",
      },
      {
        question: "Which primitives are used?",
        answer: "Choice for line and pedals, Noul for trouble probability, per README question table.",
      },
    ],
    metaTitle: "Jev Grand Prix: F1 line and pedal Choice loops",
    metaDescription:
      "Open F1 sim where Jev picks racing lines and pedals while code steers at 120 Hz. Lap engineer and benchmarks from github.com/enoyola/jev-grand-prix.",
  },

  "muhammadaq1-before-the-fall-jev": {
    slug: "muhammadaq1-before-the-fall-jev",
    status: "published",
    problem:
      "Rescue puzzles often cheat with hidden hints in prompts; players want tension without trusting a chat model to improvise physics.",
    targetUser:
      "Indie devs building narrative micro-games and Jev learners who want validation loops separate from model prose.",
    overview:
      "Before the Fall is a 2D rescue game starring robot S-01. Six victims, thirty-five seconds, three junctions per rescue, five-second room collapse timers. Jev reads text descriptions of obstacles and robot capabilities, then picks a door and action. The engine checks answers against rules without telling Jev which door is correct.",
    creator: {
      name: "muhammadaq1",
      handle: "muhammadaq1",
      githubUrl: "https://github.com/muhammadaq1",
    },
    jevUsage: {
      flowRole: "Door and maneuver selection under time pressure",
      primitives: ["Choice"],
      stateIn:
        "Natural-language descriptions of each door blockage, rescue goal, and allowed robot actions (push aside, lift aside, duck under, step through).",
      decisionOut: "Chosen door plus action; game validates against scene rules and advances or rejects.",
      flowSteps: [
        "Room collapse timer starts",
        "Engine sends junction descriptions to Jev",
        "Jev returns door and action Choice",
        "Physics validates; on success, fresh descriptions for next junction",
      ],
      sourcedMetrics: [
        {
          claim: "Recorded run: six rescues in 28.4 s, 18/18 applied decisions, ~352 ms average response.",
          source: "github.com/muhammadaq1/before-the-fall-jev README results screenshot",
        },
      ],
    },
    howJevIsUsed:
      "Jev never sees pixels, only text derived from the scene, which mirrors TypeSafe's structured-state guidance. Free wheels on a trolley still fail if there is nowhere to push, so the model must read constraints, not keywords. README stresses 100 percent decision accuracy on the showcased run while noting variance across live API calls. Clone the repo and follow run-locally instructions with your TypeSafe key.",
    keyFeatures: [
      "Six people, 35 second mission clock",
      "Three doors per junction with timed collapses",
      "Text-only state to Jev; viewer sees art",
      "Bundled demo video in README",
      "Documented latency and accuracy metrics for a sample run",
    ],
    stack: ["JavaScript", "TypeSafe Jev API"],
    links: {
      repo: "https://github.com/muhammadaq1/before-the-fall-jev",
      docs: "https://github.com/muhammadaq1/before-the-fall-jev",
    },
    firstSeen: "2026-09-21",
    relatedSlugs: ["shubhankar-jev-fifa", "muratcanberber-jev-the-fish-game"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Jev see the artwork?",
        answer:
          "No. README states Jev receives text descriptions while players see the 2D scene.",
      },
      {
        question: "Are metrics guaranteed?",
        answer:
          "README documents one recorded run; live latency and success rates can vary with API load.",
      },
    ],
    metaTitle: "Before the Fall: Jev rescue choices under a 35 s clock",
    metaDescription:
      "Cinematic rescue game where Jev picks doors and actions from text. Sample run metrics from the open GitHub README.",
  },

  "muratcanberber-jev-the-fish-game": {
    slug: "muratcanberber-jev-the-fish-game",
    status: "published",
    problem:
      "Multiplayer fish games often fake AI with scripts or parse LLM chatter that drifts under load.",
    targetUser:
      "Engineers who want a reference multiplayer loop with batched Choice and Noul calls and a live Q&A inspector.",
    overview:
      "JEV: The Fish Game is an authoritative Node server with a Three.js client. AI fish batch three questions per decision: action Choice, target Choice, and panic Noul. Humans steer with the mouse; spectators read per-fish Q&A panels with confidence bars.",
    creator: {
      name: "muratcanberber",
      handle: "muratcanberber",
      githubUrl: "https://github.com/muratcanberber",
    },
    jevUsage: {
      flowRole: "Per-fish tactical routing every few seconds",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Nearby threats, prey, food pellets, spikes, energy, and mass telemetry summarized for each fish (see README question table).",
      decisionOut:
        "action choice (flee, hunt, eat_food, roam), target object id, panic noul for sprinting.",
      flowSteps: [
        "30 Hz simulation on server",
        "Each AI fish schedules Jev calls every ~4-8 s, up to three concurrent",
        "Server applies thresholds, walls, spikes, and metabolism in code",
        "10 Hz WebSocket broadcast with client interpolation to 60 fps",
      ],
      sourcedMetrics: [
        {
          claim: "About 300 ms per fish decision; five AI fish ≈ 70 decisions/min (~$0.10/hour cited).",
          source: "github.com/muratcanberber/JEV-TheFishGame README",
        },
      ],
    },
    howJevIsUsed:
      "The README argues for AI as a programming primitive: JSON decisions, not chat. Policy stays in TypeScript so the same model weights behave per host configuration. A local fallback brain keeps fish moving if Jev is unreachable, but the showcase value is the inspector that exposes questions and probabilities to spectators. npm start serves localhost:8787; cloudflared tunnel instructions included for quick shares.",
    keyFeatures: [
      "Up to five players plus unlimited spectators",
      "Live Q&A inspector per fish",
      "Metabolism, spikes, and mass-scaled speed",
      "Server-side API key only",
      "Auto-reload clients on deploy",
    ],
    stack: ["Node.js", "Three.js r160", "WebSockets", "TypeSafe Jev"],
    links: {
      repo: "https://github.com/muratcanberber/JEV-TheFishGame",
      docs: "https://github.com/muratcanberber/JEV-TheFishGame",
    },
    pricingNote: "README cites ~$0.10/hour for five AI fish at listed Jev rates; verify on console.typesafe.ai.",
    firstSeen: "2026-09-21",
    relatedSlugs: ["icohen007-jev-play-ping-pong", "hollow-creek", "jev-arcade"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Do browsers call Jev directly?",
        answer: "No. README states the API key lives only in server .env.",
      },
      {
        question: "What if Jev is down?",
        answer: "A documented local fallback brain keeps fish playable without remote calls.",
      },
    ],
    metaTitle: "JEV The Fish Game: multiplayer Choice and Noul fish AI",
    metaDescription:
      "Real-time multiplayer aquarium with batched Jev questions and a live Q&A inspector. Metrics and setup from the open GitHub repo.",
  },

  "thumay9700-jev-plays": {
    slug: "thumay9700-jev-plays",
    status: "published",
    problem:
      "Retro game agents built on LLMs burn budget and latency parsing text about button presses.",
    targetUser:
      "Streamers, researchers, and emulator hackers who want a modular PyBoy harness for Pokemon Red today and more titles later.",
    overview:
      "jev-plays connects TypeSafe Jev to PyBoy with typed RAM maps, Pydantic state, and per-game tactic modules. Pokemon Red is the first shipped world, with navigator and battle Choice schemas documented in the repository layout.",
    creator: {
      name: "thumay9700",
      handle: "thumay9700",
      githubUrl: "https://github.com/thumay9700",
    },
    jevUsage: {
      flowRole: "Emulator tick decision layer for navigation and battle",
      primitives: ["Choice", "Noul", "Score"],
      stateIn:
        "Parsed Game Boy RAM via ram_map.py into structured models (party, map, battle context).",
      decisionOut:
        "Typed controller or battle actions from Choice/Noul/Score questions defined per tactics.py.",
      flowSteps: [
        "PyBoy advances frames",
        "state.py builds structured observation",
        "jev_client issues parallel System One questions",
        "Agent applies inputs and logs telemetry metrics",
      ],
      sourcedMetrics: [
        {
          claim: "README cites 50 to 150 ms per decision and sub-dollar full-game cost vs $200+ LLM playthroughs.",
          source: "github.com/thumay9700/jev-plays README",
        },
      ],
    },
    howJevIsUsed:
      "The framework treats Jev as System One instinct: no tokenized play-by-play, only schemas the emulator can execute. README outlines a YouTube roadmap for Mario, Zelda, and Mega Man using the same BaseGame interface. Bring your own legally obtained Pokemon Red ROM and TYPESAFE_API_KEY, then run the documented CLI entrypoints with uv.",
    keyFeatures: [
      "Modular games/ package with Pokemon Red shipped",
      "Telemetry for latency, HUD, and cost",
      "Smart mock engine for offline dev",
      "pytest suite in repository",
      "Documented roadmap for additional consoles",
    ],
    stack: ["Python 3.11+", "uv", "PyBoy", "TypeSafe SDK"],
    links: {
      repo: "https://github.com/thumay9700/jev-plays",
      docs: "https://github.com/thumay9700/jev-plays",
    },
    firstSeen: "2026-09-21",
    relatedSlugs: ["fhshaik-typesafe-mario", "enoyola-jev-grand-prix"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Which game works today?",
        answer: "Pokemon Red via PyBoy is the first implemented world per README roadmap checkboxes.",
      },
      {
        question: "Does the repo include ROMs?",
        answer: "No. README requires a legally obtained PokemonRed.gb file.",
      },
    ],
    metaTitle: "jev-plays: PyBoy Pokemon agent with typed Jev tactics",
    metaDescription:
      "Open emulator framework for System One decisions in Pokemon Red. Architecture and cost notes from github.com/thumay9700/jev-plays.",
  },

  "fhshaik-typesafe-mario": {
    slug: "fhshaik-typesafe-mario",
    status: "published",
    problem:
      "Vision pipelines for NES agents are heavy; Mario needs fast discrete inputs from reliable state, not screenshot captions.",
    targetUser:
      "Python developers benchmarking Jev on World 1-1 and anyone comparing RAM-first harness design.",
    overview:
      "typesafe-mario lets Jev choose NES controller actions for Super Mario Bros from structured JSON built out of emulator telemetry and RAM. Faadil Shaik's launch clip shows real-time play without pixels in the prompt. The repo ships CLI tools, a live dashboard, and jsonl artifacts for overlays.",
    creator: {
      name: "Faadil Shaik",
      handle: "faadilhshaik",
      xUrl: "https://x.com/faadilhshaik/status/2100086301894881578",
      githubUrl: "https://github.com/fhshaik",
    },
    creatorQuote: {
      text:
        "got @typesafeai's new model Jev to play Super Mario Bros. fast inference + structured outputs makes it surprisingly good for real time use cases.",
      attributedTo: "Faadil Shaik",
      sourceUrl: "https://x.com/faadilhshaik/status/2100086301894881578",
    },
    jevUsage: {
      flowRole: "Per-step controller Choice from structured world model",
      primitives: ["Choice"],
      stateIn:
        "player, trajectory, hazard, terrain, reaction_timing, and episode fields parsed from RAM (README architecture).",
      decisionOut:
        "One of noop, right, right_jump, right_run, right_run_jump, jump, left with probability distribution logged.",
      flowSteps: [
        "NES emulator advances frames",
        "Parser builds JSON state without screenshots",
        "Jev Choice selects controller action",
        "Harness applies input for configured frames-per-decision (default 8 steps)",
      ],
    },
    howJevIsUsed:
      "The harness keeps cardinality small and legal actions explicit, which is how Jev avoids hallucinated buttons. reaction_timing fields document observation-to-action delay for benchmarking. typesafe-mario state-demo prints payloads without launching the game. Play mode records artifacts/run-*.jsonl for clips and telemetry. You must supply your own lawful ROM and TYPESAFE_API_KEY.",
    keyFeatures: [
      "Python 3.13 CLI typesafe-mario play and state-demo",
      "Live dashboard with probabilities and latency",
      "jsonl decision logs for overlays",
      "Documented action set and parser fields",
      "Hundreds of GitHub stars in the public catalog snapshot",
    ],
    stack: ["Python 3.13", "NES emulator harness", "TypeSafe Jev"],
    links: {
      repo: "https://github.com/fhshaik/typesafe-mario",
      docs: "https://github.com/fhshaik/typesafe-mario",
      post: "https://x.com/faadilhshaik/status/2100086301894881578",
    },
    firstSeen: "2026-09-16",
    demoIds: ["typesafe-mario-faadilhshaik"],
    relatedSlugs: ["thumay9700-jev-plays", "lukaske-jev-doom-agent", "shubhankar-jev-fifa"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Jev see the screen?",
        answer: "No. README states the model receives structured JSON from telemetry and RAM, not screenshots.",
      },
      {
        question: "How often does it decide?",
        answer: "Default play command uses one decision every eight emulator steps; adjust --frames-per-decision for benchmarks.",
      },
    ],
    metaTitle: "typesafe-mario: Jev NES controller from RAM JSON",
    metaDescription:
      "Faadil Shaik harness for Super Mario Bros with structured state and Choice actions. README architecture plus launch clip on Jev Directory.",
  },

  "kylejeong-jev-as-judge": {
    slug: "kylejeong-jev-as-judge",
    status: "published",
    problem:
      "Legal learners and builders lack a fast way to see how a structured decision model would rule on a case record without paying for a full LLM brief each time.",
    targetUser:
      "Developers curious about Jev on long-form text, legal hobbyists, and anyone benchmarking System One on adversarial reading comprehension.",
    overview:
      "Jev as a Judge (judge.kylejeong.com) lets you browse famous matters or ask the court to rule from the case record. Kyle Jeong reports benchmarking 100 plus well-known decisions and finding Jev disagreed with the historical outcome about 13 percent of the time. The UI shows confidence and labels the experience as an experiment, not legal advice.",
    creator: {
      name: "Kyle Jeong",
      handle: "kylejeong",
      xUrl: "https://x.com/kylejeong/status/2101832317862056149",
    },
    creatorQuote: {
      text:
        "I built Jev-as-a-Judge, give context on a court case and see how Jev would have ruled it. I ran it on 100+ well-known court cases + their rulings, and it disagreed with 13% of them.",
      attributedTo: "Kyle Jeong",
      sourceUrl: "https://x.com/kylejeong/status/2101832317862056149",
    },
    jevUsage: {
      flowRole: "Outcome prediction from case record text (gallery browse or ad hoc ruling request)",
      primitives: ["Choice"],
      stateIn: "Case record text presented to the court UI (per site flows: gallery cases or user-submitted context).",
      decisionOut: "Ruling with confidence; site copy states outputs come from TypeSafe Jev on the record alone.",
      sourcedMetrics: [
        {
          claim: "About 13% disagreement vs historical outcomes across 100+ well-known cases in the launch post.",
          source: "x.com/kylejeong/status/2101832317862056149",
        },
      ],
    },
    howJevIsUsed:
      "The product treats Jev as a judge-shaped Choice problem instead of asking a chat model to draft an opinion essay. You read cases in the gallery or prompt a ruling, and the app renders Jev's structured answer with confidence. Kyle's disagreement rate is a sanity metric for how often System One diverges from precedent on famous facts, not a claim about courtroom readiness. Use judge.kylejeong.com for live behavior; this directory does not host case corpora.",
    keyFeatures: [
      "Courtroom, gallery, and search flows on judge.kylejeong.com",
      "Confidence surfaced with each ruling",
      "Disclaimer that outputs are experimental, not legal advice",
      "Featured homepage showcase embed",
    ],
    stack: ["TypeSafe Jev", "Web app at judge.kylejeong.com"],
    links: {
      website: "https://judge.kylejeong.com",
      demo: "https://judge.kylejeong.com",
      post: "https://x.com/kylejeong/status/2101832317862056149",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jev-as-judge-kylejeong"],
    relatedSlugs: ["jacoblincool-jev-paper-judge", "danielgshea-jev-as-a-judge", "bunsdev-clarity-judge"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is this legal advice?",
        answer:
          "No. Site copy states rulings are generated by TypeSafe Jev from the case record alone as an experiment, not legal advice.",
      },
      {
        question: "Where does the 13% figure come from?",
        answer: "Kyle Jeong's September 2026 launch post on X, cited in this profile.",
      },
    ],
    metaTitle: "Jev as a Judge: Kyle Jeong case ruling experiment",
    metaDescription:
      "judge.kylejeong.com feeds case records to Jev with confidence scores. 13% disagreement benchmark from the attributed launch post.",
  },

  "carolmonroe-jevrls": {
    slug: "carolmonroe-jevrls",
    status: "published",
    problem:
      "Supabase Row Level Security policies are easy to miswrite and expensive to audit with a full LLM call per policy line.",
    targetUser:
      "Supabase developers and security reviewers who want side-by-side model comparisons on the same RLS rubric.",
    overview:
      "JevRLS (jevrls.lovable.app) accepts pasted pg_policies output and scores each policy for leaks. Carol Monroe's showcase runs Jev beside GPT and Gemini with the same decision rule, surfacing who flags issues, latency, and cost together.",
    creator: {
      name: "Carol Monroe",
      handle: "CarolMonroe",
      xUrl: "https://x.com/carolmonroe/status/2101747586126557230",
    },
    creatorQuote: {
      text:
        "Paste your @supabase RLS policies and watch Jev race gpt and gemini on them. Same rubric, same decision rule, side by side: who flags the leaks, how fast, at what cost.",
      attributedTo: "Carol Monroe",
      sourceUrl: "https://x.com/carolmonroe/status/2101747586126557230",
    },
    jevUsage: {
      flowRole: "Per-policy security verdict on pasted Supabase RLS text",
      primitives: ["Choice"],
      stateIn: "pg_policies style policy dump pasted into the Lovable app.",
      decisionOut:
        "Plain-words verdict per policy; site meta cites about one second per policy with Jev (marketing copy on jevrls.lovable.app).",
      flowSteps: [
        "Paste policies into JevRLS",
        "Run identical rubric across Jev, GPT, and Gemini",
        "Compare leak flags, latency, and cost columns",
      ],
    },
    howJevIsUsed:
      "Carol's demo is a benchmarking UI, not a hosted database scanner. Jev handles the fast structured judgment while GPT and Gemini run under the same decision rule so differences show up in flags and price, not prompt hacks. Treat Lovable deployment as the product home until a repo is published separately.",
    keyFeatures: [
      "Side-by-side Jev vs GPT vs Gemini on one rubric",
      "Supabase RLS focused paste workflow",
      "Public demo at jevrls.lovable.app",
      "Showcase video embed on Jev Directory",
    ],
    stack: ["Lovable app", "TypeSafe Jev", "Comparison models per UI"],
    links: {
      website: "https://jevrls.lovable.app",
      demo: "https://jevrls.lovable.app",
      post: "https://x.com/carolmonroe/status/2101747586126557230",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jevrls-supabase-carolmonroe"],
    relatedSlugs: ["caiovicentino-jev-shield", "hemanth-pkg-gate", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does JevRLS connect to my Supabase project?",
        answer:
          "The public app evaluates pasted policy text. It does not require live database credentials in the showcase flow Carol described.",
      },
      {
        question: "Which primitives does Jev use?",
        answer:
          "Carol's clip describes leak flags on a shared rubric; site marketing cites fast per-policy verdicts. Treat outputs as structured policy judgments rather than free-form essays.",
      },
    ],
    metaTitle: "JevRLS: Supabase RLS policy races with Jev",
    metaDescription:
      "Carol Monroe JevRLS compares Jev, GPT, and Gemini on pasted pg_policies with latency and cost. Live demo at jevrls.lovable.app.",
  },

  "iurysza-logview-jev": {
    slug: "iurysza-logview-jev",
    status: "published",
    problem:
      "Android log triage still relies on regex greps that miss paraphrased errors agents care about.",
    targetUser:
      "Mobile engineers and agent authors who need keyboard-first log review with optional semantic filters and headless replay.",
    overview:
      "logview is Iury Souza's open-source Android log viewer built on Bun. Semantic mode swaps the slash field to a natural-language query; Jev scores whether each retained line matches the filter while capture or replay continues.",
    creator: {
      name: "Iury Souza",
      handle: "IurySza",
      xUrl: "https://x.com/iurysza/status/2101770705155010568",
      githubUrl: "https://github.com/iurysza",
    },
    creatorQuote: {
      text:
        "First experiment with @typesafeai's Jev: a semantic log filter (with a CLI that lets my agent use it too). Ofc, I had to overdo it and build a TUI around it :)",
      attributedTo: "Iury Souza",
      sourceUrl: "https://x.com/iurysza/status/2101770705155010568",
    },
    jevUsage: {
      flowRole: "Streaming relevance classification on retained log lines",
      primitives: ["Noul"],
      stateIn:
        "Developer filter text plus per-line tag, level, and message for up to semantic.historyEvents (default 100) locally eligible rows.",
      decisionOut:
        "Relevance probability per log key; rows below semantic.threshold (default 0.5) dim in the TUI.",
      flowSteps: [
        "Local tag/level/text filters run first",
        "SemanticCoordinator batches classify requests via Jev",
        "New eligible lines classify while query is active",
        "Headless mode skips remote calls entirely",
      ],
      sourcedMetrics: [
        {
          claim: "Default semantic threshold 0.5; default model jev-1.13.0; prompt log-relevance-noul-v1.",
          source: "github.com/iurysza/logview packages/engine/src/semantic/contracts.ts",
        },
      ],
    },
    howJevIsUsed:
      "logview keeps Jev behind a classifier interface so core parsing stays pure. Noul questions ask whether a line matches the developer filter even when wording differs (see relevanceInstructions in source). Semantic work never blocks ingestion; older rows stay visible with an unrequested icon if they arrived before a query. Agents can use the same Session API headlessly while humans use the ANSI TUI.",
    keyFeatures: [
      "live, record, and replay commands with shared byte pipeline",
      "logview.json config plus --semantic flag",
      "Bun 1.4+ toolchain with extensive headless tests",
      "MIT licensed monorepo on GitHub",
    ],
    stack: ["Bun", "TypeScript", "TypeSafe Jev API", "ADB capture"],
    links: {
      repo: "https://github.com/iurysza/logview",
      docs: "https://github.com/iurysza/logview",
      post: "https://x.com/iurysza/status/2101770705155010568",
    },
    firstSeen: "2026-09-21",
    demoIds: ["logview-semantic-iurysza"],
    relatedSlugs: ["socai-io-jev-social", "browser-use-jev-ultrafast"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does semantic mode call Jev in headless tests?",
        answer: "README states headless tests never call Jev.",
      },
      {
        question: "Which environment variables are required?",
        answer: "TYPESAFE_API_KEY for semantic mode; optional TYPESAFE_DEFAULT_MODEL overrides jev-1.13.0.",
      },
    ],
    metaTitle: "logview: Jev Noul semantic filter for Android logs",
    metaDescription:
      "Iury Souza logview adds natural-language Android log triage with Jev Noul scoring. Open source on GitHub with CLI and TUI.",
  },

  "thisiskp-jevarcade": {
    slug: "thisiskp-jevarcade",
    status: "published",
    problem:
      "Builders need playful proof that Jev plus a gateway can power multiple interactive UX patterns without one-off LLM prompts per mode.",
    targetUser:
      "Netlify developers, community builders, and anyone comparing structured AI mini-apps in one cabinet.",
    overview:
      "KP (thisiskp_, Head of Community at Netlify) shipped Jev Arcade at jevarcade.netlify.app after early Jev access through Netlify AI Gateway. The site advertises seven interactive modes plus an explainer: color blobs, mood piano, pictionary, puppet theatre, movie guesser, things icons, and an info panel on how Jev and Netlify power the demos. Inputs support talk or type per public meta tags.",
    creator: {
      name: "KP",
      handle: "thisiskp_",
      xUrl: "https://x.com/thisiskp_/status/2101846703091376219",
      company: "Netlify",
      companyUrl: "https://www.netlify.com",
    },
    creatorQuote: {
      text:
        "Luckily I had early access to Jev via @Netlify AI Gateway. So traded some sleep and built an arcade for @typesafeai's Jev this weekend. Not 1 but 7 interactive games with Jev that shows its power.",
      attributedTo: "KP",
      sourceUrl: "https://x.com/thisiskp_/status/2101846703091376219",
    },
    jevUsage: {
      flowRole: "Per-mode structured decisions behind talk-or-type mini experiences",
      primitives: ["Choice"],
      stateIn:
        "Mode-specific user text or voice input plus in-app context (per jevarcade.netlify.app mode descriptions).",
      decisionOut:
        "Typed picks that drive each mini game UI (colors, piano mood, guesses, icons, etc.) without long-form replies.",
      flowSteps: [
        "User selects a cabinet mode in the arcade shell",
        "Client sends structured state to Netlify AI Gateway backed Jev routes",
        "Jev returns decisions consumed directly by the mode renderer",
      ],
    },
    howJevIsUsed:
      "This arcade is separate from the Krunker-style jev-arcade.vercel.app FPS elsewhere in the catalog. KP's build is a marketing-friendly cabinet proving gateway latency across seven playful surfaces. Without a linked repository, this profile sticks to jevarcade.netlify.app meta tags, the launch clip, and KP's stated Netlify AI Gateway path. Play each mode locally to judge responsiveness on your network.",
    keyFeatures: [
      "Seven interactive modes plus info explainer",
      "Talk or type input per site description",
      "Hosted on jevarcade.netlify.app",
      "Featured homepage showcase embed",
    ],
    stack: ["Netlify AI Gateway", "TypeSafe Jev", "Static arcade shell"],
    links: {
      website: "https://jevarcade.netlify.app",
      demo: "https://jevarcade.netlify.app",
      post: "https://x.com/thisiskp_/status/2101846703091376219",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jevarcade-seven-games-thisiskp"],
    relatedSlugs: ["jev-arcade", "openrouter-typesafe-jev-1-13", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same as jev-arcade.vercel.app?",
        answer:
          "No. The Vercel FPS duel listing tracks a different Neel490 project. KP's Netlify cabinet lives at jevarcade.netlify.app with seven casual modes.",
      },
      {
        question: "Where is the source code?",
        answer:
          "No public repository was linked in the September 2026 launch thread. Use the hosted arcade and showcase clip as references.",
      },
    ],
    metaTitle: "KP Jev Arcade: seven Netlify gateway mini games",
    metaDescription:
      "jevarcade.netlify.app hosts seven Jev-powered modes via Netlify AI Gateway. Distinct from the Vercel FPS Jev Arcade listing.",
  },

  "virlo-ai": {
    slug: "virlo-ai",
    status: "published",
    problem:
      "Short-form research feeds drown teams in off-niche clips, hashtag stuffing, and videos that look viral but miss the brief.",
    targetUser:
      "TikTok and Reels marketers, agencies, and creators using Virlo to benchmark hooks and formats against a large viral corpus.",
    overview:
      "Virlo (virlo.ai, dev.virlo.ai) is a short-form social listening and content research platform spanning TikTok, Instagram Reels, and YouTube Shorts. Public positioning cites more than twelve million indexed viral videos and over one hundred thousand users. Co-founder jaffa (@dsqjaffa, @virlomain) wired TypeSafe Jev into a Clearance layer that must pass before Virlo's eighty-signal tagging panel scores hooks, formats, angles, and production cues.",
    creator: {
      name: "jaffa",
      handle: "dsqjaffa",
      xUrl: "https://x.com/dsqjaffa/status/2102090111198363988",
      company: "Virlo",
      companyUrl: "https://virlo.ai",
    },
    creatorQuote: {
      text:
        "Jev is INSANE for Marketing: Clearance decides what enters the benchmark sample before Virlo tags the rest.",
      attributedTo: "jaffa",
      sourceUrl: "https://x.com/i/article/2102004103240904704",
    },
    jevUsage: {
      flowRole:
        "Clearance gate plus marketing-agent packs before eighty-signal viral tagging",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Caption, hashtags, transcript text, and niche brief context for each candidate short-form video entering the Virlo pipeline.",
      decisionOut:
        "Clearance Noul on niche match and stuffing or mismatch flags; parallel Choice, Score, and Noul on hook type, format, angle, and worth-scripting with confidence thresholds for auto-act versus escalate.",
      flowSteps: [
        "Ingest candidate clip metadata and transcript from Virlo search or watchlists",
        "Jev Clearance: niche match and hashtag or topic mismatch nouls with confidence",
        "On pass, Virlo runs eighty-signal visual and production tagging (outside Jev)",
        "Marketing agent loops use parallel Choice, Score, and Noul packs on script angles",
        "Calibration UI A/B tests Jev Clearance against the legacy judge on labeled sets",
      ],
      sourcedMetrics: [
        {
          claim:
            "Early human-labeled head-to-head: Jev Clearance thirty-three of forty-four versus legacy judge thirty of forty-four.",
          source: "jaffa X Article Jev is INSANE for Marketing and launch clip",
        },
        {
          claim:
            "Virlo indexes twelve point eight million plus viral videos and tags eighty signals per accepted clip.",
          source: "Virlo public marketing and jaffa article",
        },
      ],
    },
    howJevIsUsed:
      "Virlo treats Jev as the typed judgment layer on text and brief fit, not as a replacement for computer vision. Clearance is Noul-forward: does this clip belong in the niche given caption, hashtags, and transcript, and is the topic consistent or stuffed? Confidence gates route high-certainty accepts straight into the eighty-signal benchmark sample; uncertain rows escalate to stronger models or human review instead of polluting trend charts. Separate parallel packs score marketing-agent outputs such as hook archetype, format, angle, and whether the clip is worth scripting, using Choice and Score where the product needs ranked options. Virlo still performs visual and production tagging; Jev only controls whether a row earns a seat at that table. Operators wire TypeSafe with a dedicated API key while Virlo product keys use the virlo_tkn_* format documented on dev.virlo.ai, including MCP at dev.virlo.ai/api/mcp/mcp for agent integrations. Open-source Vee (github.com/Virlo-AI/vee) reuses Virlo data for marketing agents; this profile focuses on the shipped SaaS Clearance path from the September 2026 launch.",
    keyFeatures: [
      "Clearance gate before eighty-signal viral tagging",
      "Calibration A/B versus legacy judge with published early win rate",
      "MCP and API surfaces on dev.virlo.ai",
      "Featured showcase clip with remote X video embed",
      "Cross-links to Vee open-source marketing agent",
    ],
    stack: [
      "Virlo SaaS (virlo.ai)",
      "TypeSafe System One",
      "Virlo MCP (dev.virlo.ai)",
    ],
    links: {
      website: "https://virlo.ai",
      docs: "https://dev.virlo.ai",
      demo: "https://dev.virlo.ai",
      post: "https://x.com/dsqjaffa/status/2102090111198363988",
      repo: "https://github.com/Virlo-AI/vee",
    },
    pricingNote:
      "Virlo product billing uses virlo_tkn_* keys; System One calls require a separate TypeSafe API key per dev.virlo.ai docs.",
    firstSeen: "2026-09-21",
    demoIds: ["virlo-clearance-dsqjaffa"],
    relatedSlugs: ["stealads-ai", "ploy-ai", "hypit-ai", "socai-io-jev-social"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev replace Virlo's eighty-signal panel?",
        answer:
          "No. Jev Clearance filters which clips enter the tagged benchmark sample. Virlo still runs visual and production tagging on accepted rows.",
      },
      {
        question: "Where is the long-form write-up?",
        answer:
          "jaffa published an X Article titled Jev is INSANE for Marketing at x.com/i/article/2102004103240904704 with Clearance and Calibration detail.",
      },
      {
        question: "What is Vee?",
        answer:
          "Vee is Virlo's open-source marketing agent repo at github.com/Virlo-AI/vee. It consumes Virlo research data; Clearance behavior on virlo.ai may differ from Vee defaults.",
      },
    ],
    metaTitle: "Virlo: Jev Clearance for TikTok and Reels research",
    metaDescription:
      "Virlo content research uses TypeSafe Jev Clearance before eighty-signal tagging. Noul niche gates, Calibration A/B, and MCP on dev.virlo.ai.",
  },

  "stealads-ai": {
    slug: "stealads-ai",
    status: "published",
    problem:
      "Media buyers need structured labels across hundreds of competitor ads without manually opening every creative and landing page.",
    targetUser:
      "Performance marketers and founders using StealAds to reverse-engineer competitor Meta libraries.",
    overview:
      "StealAds (stealads.ai) tears down live competitor ad libraries with Jev on the labeling hot path. Matthew Berman's (@TheMattBerman) launch clip shows seven hundred twenty-four ads across thirty-seven brands analyzed in about forty seconds for roughly nine cents of tokens, emitting hook, format, offer, CTA, awareness stage, and landing-page mismatch fields.",
    creator: {
      name: "Matthew Berman",
      handle: "TheMattBerman",
      xUrl: "https://x.com/TheMattBerman/status/2100654891756589230",
      company: "StealAds",
      companyUrl: "https://stealads.ai",
    },
    creatorQuote: {
      text:
        "In forty seconds Jev broke down seven hundred twenty-four live ads from thirty-seven brands for about nine cents.",
      attributedTo: "Matthew Berman",
      sourceUrl: "https://x.com/TheMattBerman/status/2100654891756589230",
    },
    jevUsage: {
      flowRole: "Batch structured labeling over live ad creatives and landing pairs",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Ad creative text, visuals metadata, and landing URLs from StealAds ingestion of live competitor libraries (per launch clip).",
      decisionOut:
        "Per-ad labels for hook, format, offer, CTA, awareness stage, and landing mismatch signals suitable for filtering and swipe files.",
      flowSteps: [
        "StealAds pulls live ads for selected brands",
        "Jev classifies each creative against marketing taxonomy fields in parallel batches",
        "Operators browse labeled sets in StealAds UI or upcoming MCP tools",
      ],
      sourcedMetrics: [
        {
          claim:
            "Seven hundred twenty-four live ads, thirty-seven brands, about forty seconds, about nine cents of tokens in the attributed clip.",
          source: "Matthew Berman X post 2100654891756589230",
        },
      ],
    },
    howJevIsUsed:
      "StealAds uses Jev where a general chat model would drown in token-heavy JSON improvisation. Each ad becomes a compact state object; Jev returns typed marketing labels so the UI can sort, filter, and export patterns without regex on model prose. Choice and Score style questions cover categorical fields like hook archetype and awareness stage, while Noul-style checks flag landing-page mismatches between promise and destination. The builder noted StealAds product and MCP availability in the same thread; madewithjev.com/builds/competitor-ad-teardown documents the pattern for teams reproducing the workflow. Try app.stealads.ai/demo for the interactive surface; this profile does not claim undisclosed StealAds schemas beyond the public clip.",
    keyFeatures: [
      "Large-batch competitor ad labeling",
      "Public demo at app.stealads.ai/demo",
      "Made with Jev build write-up",
      "Upcoming @stealads MCP integration per launch post",
    ],
    stack: ["StealAds hosted app", "TypeSafe System One"],
    links: {
      website: "https://stealads.ai",
      demo: "https://app.stealads.ai/demo",
      post: "https://x.com/TheMattBerman/status/2100654891756589230",
    },
    firstSeen: "2026-09-17",
    demoIds: ["stealads-ad-teardown-mattberman"],
    relatedSlugs: ["virlo-ai", "dub-co", "ploy-ai"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is the nine cent figure reproducible?",
        answer:
          "It comes from Matthew Berman's September 2026 clip on seven hundred twenty-four ads. Re-run on your brand set inside StealAds for production budgeting.",
      },
      {
        question: "Where is the build guide?",
        answer:
          "madewithjev.com/builds/competitor-ad-teardown summarizes the competitor teardown pattern shown in the showcase clip.",
      },
    ],
    metaTitle: "StealAds: Jev labels for competitor ad libraries",
    metaDescription:
      "StealAds uses Jev to label hooks, offers, CTAs, and mismatches across hundreds of competitor ads. Demo at app.stealads.ai/demo.",
  },

  "marcelpociot-wordshift": {
    slug: "marcelpociot-wordshift",
    status: "published",
    problem:
      "Typing games reward raw speed, not whether players understand semantic relationships between words.",
    targetUser:
      "Developers and players exploring Jev-powered game loops from Marcel Pociot's community experiments.",
    overview:
      "Wordshift is a semantic typing racer Marcel Pociot (@marcelpociot) demoed on X as a game where Jev from TypeSafe judges comparison prompts. The bigger the semantic difference between the typed pair, the farther the car moves along the track.",
    creator: {
      name: "Marcel Pociot",
      handle: "marcelpociot",
      xUrl: "https://x.com/marcelpociot/status/2100715684732801095",
      company: "beyondcode",
      companyUrl: "https://beyondcode.com",
    },
    creatorQuote: {
      text:
        "Slower than a jet, bigger than an elephant, faster than a cheetah. The bigger the difference, the farther your car moves.",
      attributedTo: "Marcel Pociot",
      sourceUrl: "https://x.com/marcelpociot/status/2100715684732801095",
    },
    jevUsage: {
      flowRole: "Per-prompt semantic distance scoring for game physics",
      primitives: ["Score"],
      stateIn:
        "Player-typed comparison phrases against challenge prompts shown in the racer UI (per launch clip).",
      decisionOut:
        "Semantic distance score mapped to car advancement distance on the track.",
      flowSteps: [
        "Present comparison challenge to the player",
        "Player types candidate phrase",
        "Jev scores semantic distance versus reference concepts",
        "Game engine moves car proportional to score",
      ],
    },
    howJevIsUsed:
      "Wordshift treats Jev as the referee for meaning instead of string equality. Each keystroke finishes a comparison the game can score with System One: how much slower, bigger, or faster is the typed phrase relative to the anchor nouns in the prompt? Score outputs drive physics so players optimize for conceptual distance, not dictionary overlap. Marcel framed the project as proof that Jev opens gaming loops beyond moderation and routing. No hosted play URL shipped in the September 2026 thread; use the showcase clip until a public build appears.",
    keyFeatures: [
      "Semantic typing racer mechanic",
      "Score-driven movement based on meaning",
      "Launch clip on Jev Directory showcase",
    ],
    stack: ["Browser game shell", "TypeSafe System One"],
    links: {
      post: "https://x.com/marcelpociot/status/2100715684732801095",
    },
    firstSeen: "2026-09-18",
    demoIds: ["wordshift-semantic-racer-marcelpociot"],
    relatedSlugs: ["fhshaik-typesafe-mario", "thisiskp-jevarcade"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Where can I play Wordshift?",
        answer:
          "Marcel's launch thread did not include a stable public URL. Watch the showcase embed and follow @marcelpociot for a hosted build.",
      },
    ],
    metaTitle: "Wordshift: semantic typing racer with Jev Score",
    metaDescription:
      "Marcel Pociot's Wordshift uses Jev to score semantic distance and drive a typing racer car. Clip on Jev Directory showcase.",
  },

  "box-jev-incident-triage": {
    slug: "box-jev-incident-triage",
    status: "published",
    problem:
      "Enterprise teams store incident reports in Box but still manually triage severity, customer impact, and folder routing.",
    targetUser:
      "Box customers experimenting with AI classification on content in Box hubs, security, and operations workflows.",
    overview:
      "Aaron Levie (@levie) demoed Box plus Jev for incident triage: pull a report from Box, ask whether it is customer-facing and how severe it is, move the file into escalate, monitor, or review folders, and write metadata template fields with the result.",
    creator: {
      name: "Aaron Levie",
      handle: "levie",
      xUrl: "https://x.com/levie/status/2101007708044574906",
      company: "Box",
      companyUrl: "https://www.box.com",
    },
    creatorQuote: {
      text:
        "Pull an incident from Box, ask customer-facing and severity, route to folders, set metadata. Nearly instantly and at almost no cost.",
      attributedTo: "Aaron Levie",
      sourceUrl: "https://x.com/levie/status/2101007708044574906",
    },
    jevUsage: {
      flowRole: "Content classification and routing gate on Box files",
      primitives: ["Noul", "Choice", "Score"],
      stateIn:
        "Incident report body and metadata retrieved from Box content APIs in the demo workflow.",
      decisionOut:
        "Customer-facing judgment, severity band, target folder (escalate, monitor, review), and metadata template instance values.",
      flowSteps: [
        "Fetch incident file from Box",
        "Jev asks customer-facing and severity questions with confidence",
        "Automation moves file to escalate, monitor, or review folder",
        "Apply Box metadata template instance with structured results",
      ],
    },
    howJevIsUsed:
      "The Box demo mirrors how enterprises want agents to behave on governed content: read structured state from the system of record, decide with typed questions, then write deterministic outcomes back as folder moves and metadata instead of chat summaries nobody audits. Jev supplies fast Noul and Choice answers on customer impact and severity so the workflow can branch without calling a large generative model on every PDF. Levie named insurance claims, contract management, loan processing, security reviews, and customer log analysis as adjacent patterns using the same shape. Production Box deployments need your tenant's security review; this profile documents only the public X demonstration on Jev Directory.",
    keyFeatures: [
      "Box file ingest and folder routing",
      "Metadata template writes after Jev classification",
      "Enterprise-oriented launch clip from Box CEO",
    ],
    stack: ["Box Content Cloud", "TypeSafe System One"],
    links: {
      website: "https://www.box.com",
      post: "https://x.com/levie/status/2101007708044574906",
    },
    firstSeen: "2026-09-19",
    demoIds: ["box-incident-triage-levie"],
    relatedSlugs: ["classifier-dev", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is this a shipped Box SKU?",
        answer:
          "The directory indexes Levie's public demonstration clip. Confirm product availability with Box for your tenant.",
      },
    ],
    metaTitle: "Box × Jev: incident triage on Content Cloud",
    metaDescription:
      "Aaron Levie's Box demo uses Jev for customer-facing and severity gates, folder routing, and metadata on incident reports. Enterprise showcase on Jev Directory.",
  },

  "lahfir-agent-desktop": {
    slug: "lahfir-agent-desktop",
    status: "published",
    problem:
      "Desktop agents that read pixels or brittle DOM dumps waste tokens and mis-click when UI refs shift between snapshots.",
    targetUser:
      "Agent builders on macOS who want native accessibility-tree computer use with typed next-action routing.",
    overview:
      "agent-desktop (github.com/lahfir/agent-desktop) is a Rust-native CLI distributed on npm. It snapshots any app's accessibility tree, returns compact skeleton overviews with drill-down refs, and executes headless-safe clicks, typing, scrolling, and window management. Your harness calls TypeSafe Jev to choose the next ref action from structured JSON, the same pattern Muhammad Aayan (@socialwithaayan) summarized as Jev picks the next button or input.",
    creator: {
      name: "lahfir",
      handle: "lahfir",
      githubUrl: "https://github.com/lahfir/agent-desktop",
    },
    creatorQuote: {
      text:
        "Desktop automation on the accessibility tree. Jev picks the next button or input.",
      attributedTo: "Muhammad Aayan",
      sourceUrl: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    jevUsage: {
      flowRole: "Choice over the next desktop ref action in the observe-act loop",
      primitives: ["Choice"],
      stateIn:
        "agent-desktop snapshot JSON: skeleton regions, qualified refs (@snapshot:eN), roles, names, and values from macOS accessibility APIs.",
      decisionOut:
        "Selected command family (click, type, scroll, etc.) and target ref from the current finite action menu.",
      flowSteps: [
        "agent-desktop snapshot --skeleton (or find) returns refs and snapshot_id",
        "Harness builds allowed actions from refs and safety policy",
        "Jev Choice picks operation and ref in one System One call",
        "agent-desktop executes via accessibility APIs; loop until goal or budget",
      ],
      sourcedMetrics: [
        {
          claim:
            "Progressive skeleton traversal reports seventy-eight to ninety-six percent token reduction on dense apps versus flat snapshots in README examples.",
          source: "github.com/lahfir/agent-desktop README",
        },
      ],
    },
    howJevIsUsed:
      "agent-desktop deliberately does not embed an LLM. It is the hands and eyes: structured observation in, deterministic CLI commands out. Jev sits in the calling agent exactly like Browser Use Ultrafast: rebuild the action space from fresh state, ask one typed question, threshold confidence, then act. Refs stay stable across steps because they are accessibility identities, not coordinates. Pair with Hermes, Claude Code, or custom harnesses via npm global install, npx, or the C-ABI cdylib for in-process calls. Chromium apps can mix CDP for web content with native AX for menus and dialogs. This profile does not claim a bundled Jev binary inside agent-desktop; wire console.typesafe.ai credentials in your agent layer.",
    keyFeatures: [
      "Rust CLI with fifty-eight command names and structured JSON errors",
      "Skeleton snapshots with drill-down refs for Slack, Finder, Xcode, and more",
      "npm and npx install with prebuilt macOS binaries",
      "ClawHub and skills.sh agent-desktop skill docs",
      "Featured in Aayan top-ten Jev repos thread",
    ],
    stack: ["Rust", "macOS Accessibility APIs", "TypeSafe System One (in agent harness)"],
    links: {
      website: "https://github.com/lahfir/agent-desktop",
      repo: "https://github.com/lahfir/agent-desktop",
      docs: "https://github.com/lahfir/agent-desktop/tree/main/skills/agent-desktop",
      post: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    pricingNote:
      "Open source Apache-2.0; TypeSafe API usage is bring-your-own when your agent calls Jev.",
    firstSeen: "2026-09-21",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
      "jkudish-jev-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does agent-desktop include Jev?",
        answer:
          "No. It exposes desktop actions. Your agent or skill harness calls Jev separately to pick the next safe action from snapshot output.",
      },
      {
        question: "Which platforms are supported?",
        answer:
          "macOS thirteen plus is production-ready per README. Windows and Linux adapters are planned with the same core contracts.",
      },
    ],
    metaTitle: "agent-desktop: Jev Choice over macOS accessibility refs",
    metaDescription:
      "lahfir/agent-desktop Rust CLI for AX-tree desktop automation. Pair with Jev for next-action Choice. Listed from Muhammad Aayan top-ten Jev repos.",
  },

  "kerpopule-hermes-jev-skills": {
    slug: "kerpopule-hermes-jev-skills",
    status: "published",
    problem:
      "Hermes and IDE agents burn frontier tokens on routing, memory hygiene, skill pick, and GUI steps that are decisions, not essays.",
    targetUser:
      "Hermes Agent operators plus Claude Code and Codex users installing the kerpopule skill pack.",
    overview:
      "hermes-jev-skills (github.com/kerpopule/hermes-jev-skills) packages nine Jev-powered skills as plain SKILL.md files and a Hermes plugin that can shadow or enable routing, skill suggestion, memory filtering, compaction selection, triage, mailbox sorting, and computer or browser action Choice. README documents sub-second latencies and sub-cent costs per decision class. Distinct from fast-jev-compaction (Claude-only context trim), hermes-jev-approvals (shell auxiliary), and keeltrace/hermes-jev (async supervision).",
    creator: {
      name: "kerpopule",
      handle: "kerpopule",
      githubUrl: "https://github.com/kerpopule/hermes-jev-skills",
    },
    creatorQuote: {
      text:
        "Jev routing, memory, compaction, skill pick, and computer use for Hermes, Claude Code, and Codex.",
      attributedTo: "Muhammad Aayan",
      sourceUrl: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    jevUsage: {
      flowRole:
        "Multi-skill decision layer: routing, retrieval, compaction, skill pick, triage, and GUI or browser Choice",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Redacted user turns, passage batches, skill name lists, inbox messages, or safe action tables per skill README privacy rules.",
      decisionOut:
        "Model tier Choice, keep or drop turns, ranked passages, skill id or none, triage labels, next GUI or browser action with confidence.",
      flowSteps: [
        "python3 install.py registers Hermes, Claude Code, and Codex when present",
        "jev setup-key stores TypeSafe credentials outside chat",
        "/jev routing shadow logs decisions before switching models",
        "Plugin tools jev_memory_filter, jev_compact_select, jev_choose_action expose hot paths",
      ],
      sourcedMetrics: [
        {
          claim: "Model routing about 0.4 s per turn; skill selection across 377 skills in about 2.8 s per README table.",
          source: "github.com/kerpopule/hermes-jev-skills README",
        },
        {
          claim:
            "Compaction eval: 58.7% recall alone and 75.0% with one search vs 37.5% and 68.3% baseline per SCORECARD-2026-09-20.md.",
          source: "kerpopule/hermes-jev-skills evals/compaction",
        },
      ],
    },
    howJevIsUsed:
      "Each skill sends only the minimum redacted state Jev needs for a typed question: never full transcripts on routing, never screenshots on computer use, local injection screens before memory calls. Shadow mode lets operators compare Jev routing logs against incumbent models without switching production traffic. Computer and browser skills mirror the directory pattern of finite safe actions with Jev Choice per step. Compaction and handoff skills use parallel Score or keep or drop nouls instead of asking a frontier model to summarize tool noise. If you only need Claude Code context trimming, use tamaratran-fast-jev-compaction; if you need Hermes shell APPROVE gates, use anpicasso-hermes-jev-approvals. This repo is the broad everyday skill router Muhammad Aayan placed ninth on his September 2026 list.",
    keyFeatures: [
      "Nine skills as portable SKILL.md files",
      "Hermes plugin with shadow routing and dashboard",
      "jev CLI for mail sorting, doctor, and model pool setup",
      "Documented redaction and private profile rules",
      "Featured in Aayan top-ten Jev repos thread",
    ],
    stack: [
      "Python 3.9+ installer",
      "Hermes Agent plugin API",
      "TypeSafe System One",
    ],
    links: {
      website: "https://github.com/kerpopule/hermes-jev-skills",
      repo: "https://github.com/kerpopule/hermes-jev-skills",
      docs: "https://github.com/kerpopule/hermes-jev-skills/blob/main/README.md",
      post: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    pricingNote:
      "Open source; TypeSafe keys via jev setup-key. README lists per-skill approximate dollar costs per thousand operations.",
    firstSeen: "2026-09-21",
    demoIds: ["socialwithaayan-ten-jev-repos"],
    relatedSlugs: [
      "tamaratran-fast-jev-compaction",
      "anpicasso-hermes-jev-approvals",
      "keeltrace-hermes-jev",
      "typesafe-ai-skills",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same as fast-jev-compaction?",
        answer:
          "No. tamaratran/fast-jev-compaction is a Claude Code plugin for tool-row keep or drop. hermes-jev-skills is a multi-skill Hermes plus IDE pack with routing, memory, GUI, and more.",
      },
      {
        question: "How do I try routing safely?",
        answer:
          "Start with /jev routing shadow on Hermes. It logs Jev decisions without switching models until you trust the pools.",
      },
    ],
    metaTitle: "Hermes Jev Skills: routing, memory, and GUI Choice",
    metaDescription:
      "kerpopule/hermes-jev-skills wires Jev into Hermes, Claude Code, and Codex. Not fast-jev-compaction or hermes-jev-approvals. Aayan top-ten listing.",
  },

  "jarrodwatts-jev-trader": {
    slug: "jarrodwatts-jev-trader",
    status: "published",
    problem:
      "On-chain market makers need a discrete buy or sell decision every block without paying for open-ended market commentary on each tick.",
    targetUser:
      "Developers experimenting with Monad trading bots and anyone studying Jev Choice on live order books rather than paper sims.",
    overview:
      "jev-trader (github.com/jarrodwatts/jev-trader, jev-trader.vercel.app) is Jarrod Watts's (@jarrodwatts) Monad trading demo. Jev reads the MON-USDC price feed state and chooses buy or sell on each roughly three hundred millisecond block; the bot places real orders on Kuru's on-chain MON-USDC order book. The public launch clip stresses live execution, not a backtest dashboard.",
    creator: {
      name: "Jarrod Watts",
      handle: "jarrodwatts",
      xUrl: "https://x.com/jarrodwatts/status/2100356151468585346",
      githubUrl: "https://github.com/jarrodwatts",
      companyUrl: "https://jev-trader.vercel.app",
    },
    creatorQuote: {
      text:
        "Jev decides if it should buy or sell given the price feed, and executes real trades on Kuru's on-chain order book every three hundred millisecond block.",
      attributedTo: "Jarrod Watts",
      sourceUrl: "https://x.com/jarrodwatts/status/2100356151468585346",
    },
    jevUsage: {
      flowRole: "Per-block buy versus sell Choice from live price-feed state",
      primitives: ["Choice"],
      stateIn:
        "Asset pair price feed and position context on Monad, refreshed each block (per launch clip and repo README).",
      decisionOut:
        "Typed buy or sell Choice that triggers order placement on Kuru MON-USDC.",
      flowSteps: [
        "Ingest latest MON-USDC price feed on each Monad block (~300 ms cadence in the clip)",
        "Jev Choice: buy or sell given current state",
        "Submit order to Kuru on-chain order book",
        "Repeat on the next block with updated feed",
      ],
      sourcedMetrics: [
        {
          claim:
            "Orders fire on every three hundred millisecond Monad block in the attributed demo clip.",
          source: "Jarrod Watts X post 2100356151468585346",
        },
        {
          claim:
            "Public GitHub repo jarrodwatts/jev-trader had about one thousand eight hundred fifty-one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-trader treats Jev as a throttle-friendly decision head on a hot loop. Instead of prompting a chat model for paragraphs about macro trends, the bot passes compact market state into a single Choice primitive each block. That keeps latency aligned with Monad block time and makes the policy auditable: you can log every buy or sell gate with confidence. Kuru handles settlement; Jev only answers whether to lean long or short on the next tick. The Vercel demo and open-source repo document wiring TypeSafe credentials and Monad RPC endpoints. This profile tracks the shipped trader pattern from the September 2026 clip, not generic DeFi advice.",
    keyFeatures: [
      "Live Kuru MON-USDC orders, not paper trading",
      "Per-block Jev Choice on price-feed state",
      "Open-source TypeScript repo and Vercel demo",
      "Featured showcase clip with remote X video",
    ],
    stack: ["Monad", "Kuru order book", "TypeSafe System One", "Vercel demo"],
    links: {
      website: "https://jev-trader.vercel.app",
      repo: "https://github.com/jarrodwatts/jev-trader",
      demo: "https://jev-trader.vercel.app",
      post: "https://x.com/jarrodwatts/status/2100356151468585346",
    },
    pricingNote:
      "Open source; live trading spends real funds and TypeSafe API usage on each block.",
    firstSeen: "2026-09-17",
    demoIds: ["jev-trader-jarrodwatts"],
    relatedSlugs: [
      "moongotchi-trading-bot-moongotchi",
      "virlo-ai",
      "realzachi-pg-jev",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this a paper trading simulator?",
        answer:
          "No. Jarrod Watts's launch post describes real trades on Kuru's on-chain MON-USDC book. Budget for gas, slippage, and API cost before you point it at mainnet.",
      },
      {
        question: "Which Jev primitive runs each block?",
        answer:
          "A Choice between buy and sell from the current price-feed state. There is no separate Score or Noul layer documented in the public clip.",
      },
      {
        question: "Where do I run it?",
        answer:
          "Clone github.com/jarrodwatts/jev-trader or open jev-trader.vercel.app for the hosted demo linked in the showcase.",
      },
    ],
    metaTitle: "jev-trader: Jev buy or sell every Monad block on Kuru",
    metaDescription:
      "Jarrod Watts jev-trader uses Jev Choice on MON-USDC price state each Monad block and places real Kuru orders. Repo, demo, and launch clip on Jev Directory.",
  },

  "nutlope-1kpapers": {
    slug: "nutlope-1kpapers",
    status: "published",
    problem:
      "Research atlases need stable topic labels across hundreds of papers without paying frontier-model prices per row or waiting on slow batch jobs.",
    targetUser:
      "ML researchers, technical writers, and builders curating large paper sets who want cheap, fast topic routing with typed Jev labels.",
    overview:
      "1kpapers (1kpapers.com) is Hassan El Mghari's (@nutlope) live atlas of AI research papers. A September 2026 clip describes classifying one thousand eighteen papers for about eight cents total with roughly two hundred fifty six millisecond median end-to-end latency per paper. DeepSeek V4 Flash summarizes each PDF; Jev Choice picks one of twenty four topics from title plus summary. The site may still show editorial topics while experimental Jev labels are evaluated, per the builder thread.",
    creator: {
      name: "Hassan El Mghari",
      handle: "nutlope",
      xUrl: "https://x.com/nutlope/status/2100426999546184123",
      company: "Together",
      companyUrl: "https://together.ai",
    },
    creatorQuote: {
      text:
        "I used Jev to classify 1,018 AI research papers. The result: $0.08 total cost and 256ms median end-to-end latency per paper.",
      attributedTo: "Hassan El Mghari",
      sourceUrl: "https://x.com/nutlope/status/2100426999546184123",
    },
    jevUsage: {
      flowRole: "Topic Choice after cheap summarization on each paper row",
      primitives: ["Choice"],
      stateIn:
        "Paper title plus DeepSeek V4 Flash summary text and a fixed menu of twenty four topic labels (per launch clip).",
      decisionOut:
        "Single topic Choice per paper for atlas filtering and map placement.",
      flowSteps: [
        "Summarize each paper with DeepSeek V4 Flash",
        "Send title, summary, and twenty four topic options to Jev",
        "Jev Choice selects the best-matching topic",
        "Publish labels to the 1kpapers atlas UI",
      ],
      sourcedMetrics: [
        {
          claim:
            "One thousand eighteen papers classified for about eight cents total; about two hundred fifty six millisecond median latency per paper.",
          source: "nutlope X post 2100426999546184123",
        },
        {
          claim: "Twenty four candidate topics per classification call.",
          source: "nutlope X post pipeline description",
        },
      ],
    },
    howJevIsUsed:
      "1kpapers separates cheap text generation from typed routing. Summaries can drift; Jev Choice forces each paper into one of twenty four explicit topics so the atlas stays sortable and filterable without embedding indexes. Parallel batches keep median latency near a quarter second per row at micro-dollar prices in the attributed clip. Hassan noted the Jev labels are still experimental: readers may see editorial topics on the live site while evals run. Treat the X thread and 1kpapers.com as canonical for current behavior, not a frozen schema export.",
    keyFeatures: [
      "Live paper atlas at 1kpapers.com",
      "DeepSeek V4 Flash summaries plus Jev topic Choice",
      "Sub-dollar batch cost on one thousand plus papers in the clip",
      "Featured showcase video from @nutlope",
    ],
    stack: ["1kpapers.com", "DeepSeek V4 Flash", "TypeSafe System One"],
    links: {
      website: "https://1kpapers.com",
      demo: "https://1kpapers.com",
      post: "https://x.com/nutlope/status/2100426999546184123",
    },
    pricingNote:
      "Public atlas browsing is free; rebuilding the pipeline spends summarization and System One tokens per paper.",
    firstSeen: "2026-09-21",
    demoIds: ["1kpapers-nutlope"],
    relatedSlugs: [
      "virlo-ai",
      "classifier-dev",
      "egghead-smart-procurement",
      "eliot5566-jev-paper-radar",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Are Jev topics live on every paper card?",
        answer:
          "Hassan's thread says Jev labels are experimental. The site may still display editorial topics while evaluations finish. Refresh 1kpapers.com for the latest UI.",
      },
      {
        question: "Why Choice instead of embeddings?",
        answer:
          "The launch pipeline sends explicit topic strings to Jev Choice after summarization, avoiding vector indexes for the first pass at atlas scale.",
      },
      {
        question: "Can I reproduce the eight cent figure?",
        answer:
          "It comes from the September 2026 clip on one thousand eighteen papers. Re-run on your corpus with current Together and TypeSafe pricing for production budgeting.",
      },
    ],
    metaTitle: "1kpapers: Jev topic Choice on a thousand AI papers",
    metaDescription:
      "nutlope 1kpapers atlas uses DeepSeek summaries and Jev Choice across twenty four topics. About eight cents for 1,018 papers in the launch clip.",
  },

  "realzachi-pg-jev": {
    slug: "realzachi-pg-jev",
    status: "published",
    problem:
      "Teams want natural-language filters over Postgres rows without standing up embeddings, vector indexes, or a separate inference service.",
    targetUser:
      "Backend engineers and data folks who already trust SQL and want Jev Noul, Choice, or Score predicates inside WHERE clauses.",
    overview:
      "pg-jev (github.com/realZachi/pg-jev, pgjev.com) is Zachi's (@iam_zachi) PostgreSQL extension exposing jev() for per-row judgments in plain language. Example patterns from the launch clip include WHERE jev(people, 'could work from home') without embeddings. Zachi reported one hundred twenty nine rows judged in about one second for about $0.0009, with cache hits near six milliseconds on a second run. This listing is the database extension only, not the separate Chrome ad-blocker demo elsewhere in the showcase.",
    creator: {
      name: "Zachi",
      handle: "iam_zachi",
      xUrl: "https://x.com/iam_zachi/status/2100679300756435135",
      githubUrl: "https://github.com/realZachi",
      companyUrl: "https://pgjev.com",
    },
    creatorQuote: {
      text:
        "jev(): a PostgreSQL extension that searches your whole database in natural language. No index, no embeddings, just one function.",
      attributedTo: "Zachi",
      sourceUrl: "https://x.com/iam_zachi/status/2100679300756435135",
    },
    jevUsage: {
      flowRole: "Per-row Jev predicates inside SQL filters",
      primitives: ["Noul", "Choice", "Score"],
      stateIn:
        "Row JSON or table columns passed into jev() plus a plain-language question string (per launch clip and pgjev.com docs).",
      decisionOut:
        "Boolean or typed judgment per row used directly in WHERE clauses.",
      flowSteps: [
        "Install pg-jev extension in Postgres",
        "Write SQL with jev(table_or_row, 'plain language criteria')",
        "Extension calls TypeSafe per row (with caching on repeats)",
        "Return matching rows to the application",
      ],
      sourcedMetrics: [
        {
          claim:
            "One hundred twenty nine rows judged in about one second for about $0.0009; second run about six milliseconds from cache.",
          source: "iam_zachi X post 2100679300756435135",
        },
        {
          claim:
            "Public GitHub repo realZachi/pg-jev had about two hundred eighty three stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "pg-jev pushes Jev to the data plane. Application code stays SQL-native: analysts phrase constraints in English, the extension maps each row through System One, and the planner filters like any other predicate. Caching repeated questions is what drives single-digit millisecond hits on warm rows in the clip. You can mix Noul-style yes or no gates, Choice among small enums, and Score thresholds depending on how you phrase the function call in SQL. The showcase ad-blocker clip for @iam_zachi is a different Chrome extension product; do not conflate it with this Postgres extension.",
    keyFeatures: [
      "jev() SQL function without vector indexes",
      "Documented latency and cost figures from launch clip",
      "pgjev.com site and open-source extension repo",
      "Distinct from ad-blocker-iam-zachi showcase",
    ],
    stack: ["PostgreSQL extension", "TypeSafe System One", "pgjev.com"],
    links: {
      website: "https://pgjev.com",
      repo: "https://github.com/realZachi/pg-jev",
      docs: "https://pgjev.com",
      demo: "https://pgjev.com",
      post: "https://x.com/iam_zachi/status/2100679300756435135",
    },
    pricingNote:
      "Open source extension; TypeSafe usage bills per row judged unless cache hits apply.",
    firstSeen: "2026-09-18",
    demoIds: ["pg-jev-iam-zachi"],
    relatedSlugs: [
      "jarrodwatts-jev-trader",
      "virlo-ai",
      "carolmonroe-jevrls",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same as the ad-blocker showcase?",
        answer:
          "No. ad-blocker-iam-zachi is a Chrome extension demo. pg-jev is a PostgreSQL extension for SQL filters at pgjev.com.",
      },
      {
        question: "Do I need embeddings?",
        answer:
          "Zachi's launch clip emphasizes no embeddings and no special indexes for the jev() function path shown.",
      },
      {
        question: "What primitives does SQL expose?",
        answer:
          "Marketing and docs describe Noul, Choice, and Score style questions depending on how you phrase the plain-language predicate per row.",
      },
    ],
    metaTitle: "pg-jev: Jev predicates inside PostgreSQL",
    metaDescription:
      "realZachi pg-jev adds jev() for natural-language WHERE clauses without embeddings. Launch metrics, pgjev.com, and SQL extension repo.",
  },

  "kraayenjon-ai-slop-detector": {
    slug: "kraayenjon-ai-slop-detector",
    status: "published",
    problem:
      "Buyers and readers need a fast signal that a landing page was assembled from generic AI layout patterns, not a careful human edit.",
    targetUser:
      "Marketers, founders, and designers auditing competitor sites or their own drafts before launch.",
    overview:
      "AI Slop Detector is Jon Kraayenbrink's (@kraayenJon) free URL scanner. A September 2026 clip shows Jev checking a site for thirty five parallel tells of AI slop, including purple gradients, emoji headers, seamlessly phrasing, fake testimonials, and bento grids, in about two hundred forty three milliseconds for about $0.00015 of tokens. Headless Chrome captures the page; vision describes visuals; Jev answers parallel Noul questions plus a whole-page score; DeepSeek writes the verdict text from found tells. The live tool allows two scans per day without signup on the public free-tools URL linked in the post.",
    creator: {
      name: "Jon Kraayenbrink",
      handle: "kraayenJon",
      xUrl: "https://x.com/kraayenJon/status/2101157548346794059",
    },
    creatorQuote: {
      text:
        "In 243 ms it checked a website for 35 tells of ai slop. Paste any url, get a slop score.",
      attributedTo: "Jon Kraayenbrink",
      sourceUrl: "https://x.com/kraayenJon/status/2101157548346794059",
    },
    jevUsage: {
      flowRole: "Parallel Noul tells plus page-level Score after vision description",
      primitives: ["Noul", "Score"],
      stateIn:
        "Rendered page screenshot or vision-derived description from headless Chrome (per launch clip).",
      decisionOut:
        "Per-tell Noul flags, aggregate slop score, and DeepSeek-generated verdict copy listing matched patterns.",
      flowSteps: [
        "Fetch and render target URL in headless Chrome",
        "Vision model describes layout and copy cues",
        "Jev runs about thirty five parallel Noul questions on tells",
        "Whole-page Score summarizes slop level",
        "DeepSeek writes human-readable verdict from hits",
      ],
      sourcedMetrics: [
        {
          claim:
            "About two hundred forty three milliseconds and about $0.00015 of tokens for thirty five tells in the launch clip.",
          source: "kraayenJon X post 2101157548346794059",
        },
        {
          claim: "Free tier: two scans per day without signup (per launch post).",
          source: "kraayenJon X post linked free tool",
        },
      ],
    },
    howJevIsUsed:
      "The slop detector keeps expensive vision and cheap judgment separate. Chrome plus a vision description produces structured state; Jev fires dozens of tiny Noul questions in parallel so each tell is typed instead of buried in one chat essay. A Score primitive rolls the tells into a single slop number suitable for sorting URLs. DeepSeek only narrates the evidence Jev already flagged, which keeps latency sub-second in the attributed clip. Operators paste any public URL into the free tool linked from Kraayenbrink's post. This profile cites the X launch and live scanner, not third-party directories.",
    keyFeatures: [
      "Thirty five parallel slop tells per URL",
      "Sub-second Jev pass in the public clip",
      "Free daily scans on the linked tool",
      "Showcase video embed from @kraayenJon",
    ],
    stack: [
      "Headless Chrome capture",
      "Vision description",
      "TypeSafe System One",
      "DeepSeek verdict copy",
    ],
    links: {
      website: "https://madewithjev.com/free-tools/ai-slop-detector",
      demo: "https://madewithjev.com/free-tools/ai-slop-detector",
      post: "https://x.com/kraayenJon/status/2101157548346794059",
    },
    pricingNote: "Two free scans per day on the public tool; additional usage not documented in the clip.",
    firstSeen: "2026-09-21",
    demoIds: ["ai-slop-detector-kraayenjon"],
    relatedSlugs: ["stealads-ai", "ploy-ai", "hypit-ai", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev write the final paragraph?",
        answer:
          "Jev answers the parallel tell questions and scores the page. DeepSeek generates the readable verdict from the tells Jev flagged, per the launch thread.",
      },
      {
        question: "What counts as a tell?",
        answer:
          "The clip names patterns like purple gradients, emoji headers, seamlessly phrasing, fake testimonials, and bento grids among thirty five parallel checks.",
      },
      {
        question: "Is there an API?",
        answer:
          "This listing documents the free URL tool linked in the X post. No public API was claimed in the September 2026 clip.",
      },
    ],
    metaTitle: "AI Slop Detector: parallel Jev tells on any URL",
    metaDescription:
      "kraayenJon free AI Slop Detector uses vision plus thirty five Jev Noul tells and a page score in about 243 ms. Launch clip and tool link.",
  },

  "robj3d3-superx-post-scoring": {
    slug: "robj3d3-superx-post-scoring",
    status: "published",
    problem:
      "Creators need to know whether a draft will outperform their own baseline post before spending reach on reply bait or weak hooks.",
    targetUser:
      "X creators, growth operators, and agents drafting social copy who want a fast viral score loop with rewrite until peak.",
    overview:
      "SuperX post scoring is Rob Hallam's (@robj3d3) Jev classifier for X drafts. His September 2026 clip claims sixty one parallel questions in about one second for about $0.0004, fitted on nine thousand four hundred eighty one real posts from two hundred seven creators, picking the more viral post about two thirds of the time while avoiding reply-bait rewards. The free Tweet Tester at superx.so scores drafts without signup; the same engine ships inside SuperX via API, MCP, and CLI per the thread.",
    creator: {
      name: "Rob Hallam",
      handle: "robj3d3",
      xUrl: "https://x.com/robj3d3/status/2100722975645598191",
      company: "SuperX",
      companyUrl: "https://superx.so",
    },
    creatorQuote: {
      text:
        "Every post gets 61 questions in ~1s for $0.0004. Write, score, rewrite, stop when it peaks.",
      attributedTo: "Rob Hallam",
      sourceUrl: "https://x.com/robj3d3/status/2100722975645598191",
    },
    jevUsage: {
      flowRole: "Parallel question pack per draft plus rewrite loop until score peaks",
      primitives: ["Noul", "Score"],
      stateIn:
        "Draft post text only (per launch thread); population model uses nine thousand four hundred eighty one labeled posts from two hundred seven creators.",
      decisionOut:
        "Relative viral score versus creator baseline, help or hurt reasons, and guidance to rewrite until score peaks without rewarding reply bait.",
      flowSteps: [
        "Author drafts post text in Tweet Tester or SuperX",
        "Jev answers sixty one parallel questions in about one second",
        "Score compared to fitted creator baseline",
        "Rewrite loop until score peaks or reply-bait flags fire",
        "Optional agent skill runs the same loop via MCP",
      ],
      sourcedMetrics: [
        {
          claim:
            "Sixty one questions in about one second for about $0.0004 per draft in the launch clip.",
          source: "robj3d3 X post 2100722975645598191",
        },
        {
          claim:
            "Model fitted on nine thousand four hundred eighty one posts from two hundred seven creators; picks the viral post about two in three times.",
          source: "robj3d3 X post and thread",
        },
        {
          claim:
            "About six thousand free demo runs cost the builder about one dollar and four cents total (follow-up post).",
          source: "robj3d3 X post 2100879539257938355",
        },
      ],
    },
    howJevIsUsed:
      "SuperX treats each draft as a bundle of parallel Noul and Score style probes instead of one monolithic LLM rubric. Training data from thousands of real posts sets the baseline so the score means better or worse than this creator's normal, not a universal like count. The rewrite loop is explicit in the clip: draft, score, edit, stop at the peak. Reply-bait patterns are penalized rather than rewarded. Free users can try superx.so/tweet-tester without login; paid SuperX plans expose POST /v1/posts/viral-score, an MCP predict_viral_score tool, and superx posts:viral-score CLI per Rob's thread. This directory entry focuses on the shipped scoring path and attributed metrics, not unaudited accuracy guarantees.",
    keyFeatures: [
      "Free Tweet Tester without signup",
      "Sixty one parallel Jev questions per draft",
      "Rewrite-until-peak workflow in launch clip",
      "SuperX API, MCP, and CLI for the same scorer",
    ],
    stack: ["superx.so Tweet Tester", "SuperX API", "TypeSafe System One"],
    links: {
      website: "https://superx.so/tweet-tester",
      demo: "https://superx.so/tweet-tester",
      post: "https://x.com/robj3d3/status/2100722975645598191",
    },
    pricingNote:
      "Tweet Tester is free with a five-post browser limit before SuperX upsell; in-product API billing follows SuperX plans.",
    firstSeen: "2026-09-17",
    demoIds: ["superx-post-scoring-robj3d3"],
    relatedSlugs: ["virlo-ai", "ploy-ai", "hypit-ai", "kraayenjon-ai-slop-detector"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Where is the free tool?",
        answer:
          "superx.so/tweet-tester scores drafts in a simulated feed without signup, linked from Rob Hallam's launch thread.",
      },
      {
        question: "Does the score predict global virality?",
        answer:
          "SuperX docs emphasize scoring relative to your own normal post at your follower size, not a universal like target.",
      },
      {
        question: "How do agents call the scorer?",
        answer:
          "Rob's thread lists SuperX MCP predict_viral_score and CLI superx posts:viral-score alongside POST /v1/posts/viral-score.",
      },
    ],
    metaTitle: "SuperX post scoring: sixty one Jev questions per draft",
    metaDescription:
      "robj3d3 SuperX viral scorer runs sixty one parallel Jev probes in about one second. Free Tweet Tester, launch metrics, and showcase clip.",
  },

  "kitfunso-hippo-memory": {
    slug: "kitfunso-hippo-memory",
    status: "published",
    problem:
      "Agent memory tools retrieve by embedding similarity alone, so the first hit is often related noise instead of the fact you actually needed.",
    targetUser:
      "Builders who want a local-first memory CLI and optional Jev reranking when recall quality matters more than raw speed.",
    overview:
      "Hippo Memory is kitfunso's open memory layer with a hippo recall CLI, local storage, and an opt-in TypeSafe Jev reranker. Default recall stays cheap and offline-friendly; add --reranker jev when you want structured ranking judgments on candidate memories before results print.",
    creator: {
      name: "kitfunso",
      handle: "kitfunso",
      githubUrl: "https://github.com/kitfunso",
      companyUrl: "https://hippo-memory.com",
    },
    jevUsage: {
      flowRole: "Optional reranker on memory recall (ranking only, not generation)",
      primitives: ["Score", "Noul"],
      stateIn:
        "User query plus a bounded set of candidate memory rows retrieved by the local index before reranking runs.",
      decisionOut:
        "Reordered recall list where Jev scores or keeps-drop judgments elevate the best matching memory to rank one.",
      flowSteps: [
        "Run hippo recall \"<query>\" to fetch local candidates",
        "Pass --reranker jev to enable TypeSafe Jev on the candidate set",
        "Jev applies ranking judgments per README schema (not summarization)",
        "Return reranked rows to the caller; reranker stays off unless opted in",
      ],
      sourcedMetrics: [
        {
          claim:
            "Private eval on three hundred queries: recall at one reportedly moves from 0.41 to 0.62 with Jev reranker enabled (docs/evals/2026-09-19-jev-reranker.md).",
          source: "github.com/kitfunso/hippo-memory eval doc",
        },
        {
          claim: "Documented ballpark ~$0.0004 per recall when reranker is on.",
          source: "github.com/kitfunso/hippo-memory README",
        },
      ],
    },
    howJevIsUsed:
      "Hippo does not ask Jev to write memories or paraphrase notes. The hot path is recall: local retrieval proposes candidates, then Jev answers structured questions about which rows best satisfy the query. That is classic ranking work for Score and Noul style probes instead of a chat completion. The reranker ships off by default so scripts and agents keep predictable latency; turn it on when your eval says first-result quality is worth a fraction of a cent. Read the published eval markdown in the repo before you quote the 0.41 to 0.62 recall-at-one jump in a slide deck; it is the author's private set, not a third-party benchmark leaderboard.",
    keyFeatures: [
      "CLI hippo recall with optional --reranker jev",
      "Local memory store with ranking-only Jev path",
      "Published eval notes for reranker impact",
      "TypeSafe API key required only when reranker runs",
    ],
    stack: ["TypeScript", "CLI", "TypeSafe System One", "local memory index"],
    links: {
      website: "https://hippo-memory.com",
      repo: "https://github.com/kitfunso/hippo-memory",
      docs: "https://github.com/kitfunso/hippo-memory/tree/main/docs",
    },
    pricingNote:
      "Local recall is yours to host; Jev reranker bills per TypeSafe usage (~$0.0004/recall per README order of magnitude).",
    firstSeen: "2026-09-22",
    relatedSlugs: ["docjev", "tamaratran-fast-jev-compaction", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev rewrite stored memories?",
        answer:
          "No. README positions Jev as a reranker on recall candidates only. Ingest and storage stay outside the Jev path unless you add your own hooks.",
      },
      {
        question: "How do I enable reranking?",
        answer:
          "Use hippo recall \"<query>\" --reranker jev with TYPESAFE_API_KEY configured per install docs.",
      },
    ],
    metaTitle: "Hippo Memory: optional Jev reranker on agent recall",
    metaDescription:
      "kitfunso Hippo Memory CLI with opt-in Jev reranking on recall. Published eval notes, ~$0.0004/recall ballpark, ranking-only TypeSafe path.",
  },

  "juspay-neurolink": {
    slug: "juspay-neurolink",
    status: "published",
    problem:
      "Agent frameworks treat chat and embeddings as the only inference modes, so routing, budgeting, and tool picks still devolve into JSON parsing games.",
    targetUser:
      "Teams building on NeuroLink who want decide() beside generate and embed, with typed booleans and choices in production control flow.",
    overview:
      "NeuroLink is Juspay's open agent SDK (neurolink.ink). It adds a third inference type, decide, exposed as tryDecide() in application code. Under the hood that path uses TypeSafe Jev via documented gateway wiring so you get calibrated Choice, Score, and boolean answers for routing without inventing another HTTP client.",
    creator: {
      name: "Juspay",
      handle: "juspay",
      company: "Juspay",
      companyUrl: "https://juspay.in",
      githubUrl: "https://github.com/juspay/neurolink",
    },
    jevUsage: {
      flowRole: "Structured decide inference for routing, budgeting, compaction, and tool selection",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Typed decide inputs per NeuroLink schema: candidate sets for Choice, rubric state for Score, yes-no propositions for boolean/Noul paths.",
      decisionOut:
        "Calibrated structured results consumed directly in TypeScript control flow (pick model, drop context chunk, allow tool, etc.).",
      flowSteps: [
        "Configure TYPESAFE_API_KEY and gateway per NeuroLink docs",
        "Call tryDecide() with the schema for your routing or gate question",
        "NeuroLink forwards to TypeSafe Jev semantics",
        "App thresholds probabilities; on missing key the SDK fail-opens per README",
      ],
    },
    howJevIsUsed:
      "NeuroLink is not wrapping Jev as a chat persona. decide is a first-class inference type next to chat and embed, which matters for payment-grade agents that cannot afford ambiguous prose. Documented uses include picking among models, trimming context when relevance scores fall, compacting transcripts with structured keep or drop signals, and routing tools. tryDecide() returns the same primitive families you would hand-roll against System One, but with NeuroLink's agent lifecycle and observability hooks. If the TypeSafe key is absent, the framework is explicit about failing open so dev laptops still run; production should set keys and monitor decide latency like any other dependency.",
    keyFeatures: [
      "tryDecide() third inference type beside chat and embed",
      "Choice, Score, and boolean/Noul schemas in one SDK",
      "Documented model routing and context budgeting patterns",
      "Fail-open behavior without TYPESAFE_API_KEY",
    ],
    stack: ["TypeScript", "NeuroLink SDK", "Vercel AI Gateway", "TypeSafe System One"],
    links: {
      website: "https://neurolink.ink",
      repo: "https://github.com/juspay/neurolink",
      docs: "https://docs.neurolink.ink",
    },
    pricingNote: "Jev decide calls bill through your TypeSafe or gateway account; NeuroLink itself is open source.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["tanstack-ai-decide", "vercel-eve", "classifier-dev"],
    relatedLearnSlugs: ["vercel-ai-gateway", "jev-typesafe"],
    faq: [
      {
        question: "Is decide separate from chat completions?",
        answer:
          "Yes. NeuroLink docs describe decide as its own inference type with tryDecide(), not a prompt hack on top of generate().",
      },
      {
        question: "What happens without a TypeSafe key?",
        answer:
          "README documents fail-open behavior so local dev does not hard crash; production agents should configure TYPESAFE_API_KEY.",
      },
    ],
    metaTitle: "NeuroLink: Juspay agent SDK with tryDecide() and Jev",
    metaDescription:
      "juspay/neurolink adds decide inference via TypeSafe Jev for routing, compaction, and tool picks. Docs at docs.neurolink.ink.",
  },

  "uehaj-jev-semgrep": {
    slug: "uehaj-jev-semgrep",
    status: "published",
    problem:
      "Regex grep misses intent (find the line that handles refunds) and LLM grep burns budget reading whole files into chat.",
    targetUser:
      "Developers who want line-level semantic filters in CI or ad hoc audits with composable boolean meaning expressions.",
    overview:
      "jev-semgrep is uehaj's meaning grep CLI. You state a natural-language proposition; the tool batches lines from stdin or files and asks Jev whether each line satisfies that meaning above a threshold. AND, OR, and NOT compose propositions; file language and query language can differ.",
    creator: {
      name: "uehaj",
      handle: "uehaj",
      githubUrl: "https://github.com/uehaj",
    },
    jevUsage: {
      flowRole: "Per-line semantic match filter (batched Noul questions)",
      primitives: ["Noul"],
      stateIn:
        "One text line (or batch) plus the active meaning proposition from the CLI expression tree.",
      decisionOut:
        "Binary keep or drop for each line based on calibrated probability against threshold; composed trees for AND/OR/NOT.",
      flowSteps: [
        "Parse CLI meaning expression (possibly nested boolean ops)",
        "Stream or batch file lines to Jev with the active proposition",
        "Threshold Noul outputs to emit matching lines only",
        "Cross-language: proposition can be Japanese while the file is English, per author writeup",
      ],
    },
    howJevIsUsed:
      "This is grep-shaped, not agent-shaped. Every emitted line earned its place because Jev answered a Noul question: does this line entail the meaning you asked for? Batching keeps latency tolerable on large repos. Boolean composition lets you build mini policies (error handling AND not test fixture) without learning another query DSL beyond words. The Zenn article walks through real examples and contrasts the approach with classic semgrep rules that die on paraphrase. Bring a TypeSafe key; there is no cloud-hosted meaning grep service in the repo.",
    keyFeatures: [
      "Natural-language propositions instead of regex",
      "AND, OR, NOT composition in the CLI",
      "Cross-language matching between query and file",
      "Line-at-a-time threshold filtering",
    ],
    stack: ["TypeScript", "CLI", "TypeSafe System One"],
    links: {
      repo: "https://github.com/uehaj/jev-semgrep",
      docs: "https://github.com/uehaj/jev-semgrep#readme",
      post: "https://zenn.dev/uehaj/articles/jev-semgrep-grep-by-meaning",
    },
    pricingNote: "Per-line Jev calls; tune batch size and threshold to control cost on big trees.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["hemanth-pkg-gate", "kushwho-jev-codes", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is this the Semgrep security product?",
        answer:
          "No. The name is a pun on grep-by-meaning. This repo is uehaj's Jev CLI, not semgrep.dev rule packs.",
      },
      {
        question: "Which primitive does each line use?",
        answer:
          "The README and Zenn post describe a probability that the proposition holds, which maps to Noul semantics in Jev vocabulary.",
      },
    ],
    metaTitle: "jev-semgrep: meaning grep with Jev Noul per line",
    metaDescription:
      "uehaj jev-semgrep filters files by natural-language propositions with Jev. Boolean composition, cross-language lines, Zenn writeup.",
  },

  "tamaratran-jev-pruner": {
    slug: "tamaratran-jev-pruner",
    status: "published",
    problem:
      "Agent shells return megabytes of build logs and test output; stuffing it all into context drowns the model before anyone reads the failure line.",
    targetUser:
      "Claude Code and Codex users who want Bash hook compaction on command stdout without summarizing away stack traces.",
    overview:
      "jev-pruner is Tamara Tran's hook that sits between shell completion and the LLM. It chunks stdout, asks Jev a Noul question per chunk about whether any line must remain visible, keeps chunks above threshold, and archives the full output locally for forensics.",
    creator: {
      name: "Tamara Tran",
      handle: "tamaratran",
      githubUrl: "https://github.com/tamaratran/jev-pruner",
    },
    jevUsage: {
      flowRole: "Bash hook compaction on command stdout before tool results return",
      primitives: ["Noul"],
      stateIn:
        "Chunked stdout from the finished command plus hook context about what the agent was trying to learn.",
      decisionOut:
        "Trimmed stdout for the model with full transcript archived; chunks dropped only when Jev says nothing important remains.",
      flowSteps: [
        "Command runs to completion in Claude Code or Codex Bash tool",
        "Hook intercepts stdout before the LLM receives it",
        "Split into chunks; parallel Noul: does any line in this chunk need to stay?",
        "Emit surviving chunks; store complete stdout in archive per README",
      ],
    },
    howJevIsUsed:
      "jev-pruner complements fast-jev-compaction, it does not replace it. Compaction attacks long-lived tool rows in the transcript; pruner attacks one-shot terminal floods right after they happen. Jev never rewrites log lines into summaries. It only votes keep or drop at chunk granularity, which preserves exact error strings when they matter. If you already run tamaratran/fast-jev-compaction for history hygiene, add pruner when npm test or cargo build spews more text than your context budget allows. Same TypeSafe key story as Tamara's other plugins.",
    keyFeatures: [
      "Claude Code and Codex Bash hook integration",
      "Chunk-level Noul gates, not LLM summaries",
      "Full stdout archive alongside trimmed view",
      "Sibling project to fast-jev-compaction (different repo)",
    ],
    stack: ["TypeScript", "Claude Code hooks", "Codex", "TypeSafe System One"],
    links: {
      repo: "https://github.com/tamaratran/jev-pruner",
      docs: "https://github.com/tamaratran/jev-pruner#readme",
    },
    pricingNote: "Bring your own TYPESAFE_API_KEY; cost scales with chunk count per command.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["tamaratran-fast-jev-compaction", "kushwho-jev-codes", "kerpopule-hermes-jev-skills"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "How is this different from fast-jev-compaction?",
        answer:
          "fast-jev-compaction trims paired tool_use and tool_result rows in the transcript. jev-pruner trims fresh shell stdout in the Bash hook path. Different repos, same Noul philosophy.",
      },
      {
        question: "Do I lose the full log?",
        answer:
          "README describes archiving complete stdout while only the Jev-approved chunks return to the model.",
      },
    ],
    metaTitle: "jev-pruner: Noul chunk gates for shell output",
    metaDescription:
      "tamaratran/jev-pruner Bash hook uses Jev Noul per stdout chunk for Claude Code and Codex. Archives full output, distinct from fast-jev-compaction.",
  },

  "hyperspaceai-jevcache": {
    slug: "hyperspaceai-jevcache",
    status: "published",
    problem:
      "Agents replay identical decide questions on unchanged state, paying inference micro-dollars for deterministic answers they already bought.",
    targetUser:
      "Operators who want a local ledger for Jev-class decisions with CLI audit trails, not another hosted proxy holding their keys.",
    overview:
      "jevcache from hyperspaceai memoizes structured Jev answers keyed by model, schema, and state hash. The jev backend talks to TypeSafe with your local API key; decide, recall, replay, and serve commands expose hits, misses, and replays for debugging spend.",
    creator: {
      name: "hyperspaceai",
      handle: "hyperspaceai",
      githubUrl: "https://github.com/hyperspaceai",
      companyUrl: "https://jevcache.sh",
    },
    jevUsage: {
      flowRole: "Local cache and replay layer in front of TypeSafe Jev calls",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Tuple of model id, JSON schema fingerprint, and canonical serialized state presented to decide.",
      decisionOut:
        "Cached structured answer on hit; on miss, forward to Jev, persist, then return. replay reproduces prior decisions for audits.",
      flowSteps: [
        "CLI or serve endpoint receives decide with schema + state",
        "jevcache hashes inputs and checks the local ledger",
        "On miss, call TypeSafe Jev and store response with metadata",
        "recall and replay commands inspect history without re-spend",
      ],
    },
    howJevIsUsed:
      "jevcache is infrastructure, not a new primitive. Whatever schema you pass (Choice among tools, Score for risk, Noul for allow) is what gets cached. The project is explicit that it is not reselling inference: your key stays on the machine running jevcache. That makes it attractive for agent loops that re-read the same repository snapshot or policy table every turn. Use serve when multiple workers should share one ledger; use replay when finance asks why the bot flipped a gate last Tuesday.",
    keyFeatures: [
      "Memoize (model, schema, state) to Jev answers",
      "CLI decide, recall, replay, and serve",
      "Local TypeSafe key, not a proxy reseller",
      "Works with any primitive your schema defines",
    ],
    stack: ["TypeScript", "CLI", "local ledger store", "TypeSafe System One"],
    links: {
      website: "https://jevcache.sh",
      repo: "https://github.com/hyperspaceai/jevcache",
      docs: "https://github.com/hyperspaceai/jevcache#readme",
    },
    pricingNote: "Cache hits avoid repeat Jev charges; misses bill normally through TypeSafe.",
    firstSeen: "2026-09-22",
    relatedSlugs: [
      "tomerglick57-jevstiller",
      "tanstack-ai-decide",
      "juspay-neurolink",
      "classifier-dev",
    ],
    relatedLearnSlugs: ["jev-typesafe", "system-one"],
    faq: [
      {
        question: "Does jevcache host my API key in the cloud?",
        answer:
          "No. README positions the tool as a local decision ledger with your TypeSafe credentials on the operator machine.",
      },
      {
        question: "Which primitives can I cache?",
        answer:
          "Any structured decide schema you define: Choice, Score, or Noul shaped questions all serialize into the same cache key pattern.",
      },
    ],
    metaTitle: "jevcache: local ledger for TypeSafe Jev decisions",
    metaDescription:
      "hyperspaceai jevcache memoizes Jev decide calls with CLI recall and replay. Local key, no proxy resale, jevcache.sh docs.",
  },

  "thruwire-foreman": {
    slug: "thruwire-foreman",
    status: "published",
    problem:
      "Coding agents can churn for hours while humans guess whether work is done, tests are enough, or someone should intervene.",
    targetUser:
      "Teams experimenting with software factory layouts where Codex or OpenCode workers implement tickets and a separate supervisor must steer without rewriting every line.",
    overview:
      "foreman (github.com/thruwire/foreman, thruwire.ai) is Josh Rosen's (@JoshARosen) native Python asyncio runtime for semantic supervision. Workers in the coding agent loop produce factory evidence; Foreman runs a parallel assess loop that feeds that evidence to TypeSafe Jev and reads calibrated scores across responsibility buckets: completion, verification, worker health, repository instruction drift, and human escalation. Routing then picks continue, steer, stop, retry, verify, or finish. The README frames Foreman as an architectural experiment, not a claim that it already beats every conventional harness.",
    creator: {
      name: "Josh Rosen",
      handle: "JoshARosen",
      xUrl: "https://x.com/JoshARosen/status/2100573432089866717",
      githubUrl: "https://github.com/thruwire",
      companyUrl: "https://thruwire.ai",
    },
    creatorQuote: {
      text:
        "Generative models work. Foreman watches the work.",
      attributedTo: "Josh Rosen",
      sourceUrl: "https://github.com/thruwire/foreman",
    },
    jevUsage: {
      flowRole:
        "Parallel supervision loop scoring factory responsibilities from worker evidence",
      primitives: ["Score", "Noul"],
      stateIn:
        "Factory events from Codex or OpenCode runs: implementation progress, test output, requirement signals, and worker telemetry described in Foreman docs.",
      decisionOut:
        "Calibrated responsibility scores (for example implementation_complete, requirements_satisfied, needs_verification, worker_stuck, needs_human) that drive steering actions.",
      flowSteps: [
        "Worker loop: reason, tool, observe while emitting factory events",
        "Foreman loop ingests evidence on each assess tick",
        "Jev evaluates configured responsibilities with typed scores",
        "Router maps responsibility pattern to continue, steer, stop, retry, verify, or finish",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo thruwire/foreman had about five hundred six stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Foreman does not ask Jev to write patches. The coding agent does software engineering; Jev answers fast structured questions about whether the factory is healthy. README diagrams show responsibility groups with example probabilities (implementation_complete near 0.91 while ready_to_finish stays low until verification catches up). That is Score and Noul shaped supervision: thresholds become policy without parsing chat prose. Operators configure responsibilities and routing in repo docs (theory, runtime, steering, workers). Bring a TypeSafe key for live assess calls. Pair Foreman with ordinary agent harnesses when you want a second opinion that only watches evidence.",
    keyFeatures: [
      "Dual asyncio loops: coding agent plus Foreman assess",
      "Responsibility buckets for completion, verification, health, escalation",
      "Codex and OpenCode worker backends documented",
      "Open Python repo and thruwire.ai product site",
    ],
    stack: ["Python", "asyncio", "Codex", "OpenCode", "TypeSafe System One"],
    links: {
      website: "https://thruwire.ai",
      repo: "https://github.com/thruwire/foreman",
      docs: "https://github.com/thruwire/foreman/tree/main/docs",
      post: "https://x.com/JoshARosen/status/2100573432089866717",
    },
    pricingNote:
      "Open source runtime; TypeSafe usage bills per assess call configured in your factory.",
    firstSeen: "2026-09-17",
    relatedSlugs: [
      "lahfir-agent-desktop",
      "kerpopule-hermes-jev-skills",
      "tamaratran-fast-jev-compaction",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Foreman replace Codex or OpenCode?",
        answer:
          "No. README positions workers as the implementers and Foreman as the watcher that scores responsibilities and steers the factory.",
      },
      {
        question: "Which Jev primitives appear in the loop?",
        answer:
          "Responsibility outputs are calibrated scores over completion, verification, health, and escalation questions. Treat them as Score and Noul style gates in routing docs, not free-form chat.",
      },
      {
        question: "Where is the announce thread?",
        answer:
          "Josh Rosen's X post at x.com/JoshARosen/status/2100573432089866717 introduces the factory foreman concept; deep wiring lives in github.com/thruwire/foreman docs.",
      },
    ],
    metaTitle: "foreman: Jev supervisor for Codex and OpenCode factories",
    metaDescription:
      "thruwire foreman watches factory evidence with TypeSafe Jev, then continue, steer, verify, or escalate. Repo, thruwire.ai, and launch post.",
  },

  "dicklesworthstone-skillranker": {
    slug: "dicklesworthstone-skillranker",
    status: "published",
    problem:
      "Large skill libraries look interchangeable in prose, so agents load the wrong procedure and burn context three turns later.",
    targetUser:
      "Claude Code and compatible harness users who want sr to rank skills from live session context with abstention when nothing fits.",
    overview:
      "skillranker (github.com/Dicklesworthstone/skillranker) is Dicklesworthstone's Rust CLI (sr) built around TypeSafe Jev. It reads recent conversation, the current request, workspace signals, and the harness skill inventory, then asks Jev to compare candidates including a real none of these option. Large rosters can pre-filter with Quill from FrankenSearch before Jev runs; explicit skill requests resolve locally first. Hooks, JSON output, replay, and local feedback ship for production agents. A TypeSafe API key is mandatory: there is no bundled local model.",
    creator: {
      name: "Dicklesworthstone",
      handle: "Dicklesworthstone",
      githubUrl: "https://github.com/Dicklesworthstone",
    },
    jevUsage: {
      flowRole: "Two-stage skill fit ranking with abstention over the visible inventory",
      primitives: ["Choice", "Score"],
      stateIn:
        "Session transcript slice, active user request, workspace metadata, and eligible skill records (full roster or Quill-narrowed shortlist per README).",
      decisionOut:
        "Ranked skill recommendations with none of these when Jev rejects the field; advisory output for the agent, not a forced load.",
      flowSteps: [
        "Establish session context and eligible skills (local resolution for explicit picks)",
        "Optionally narrow very large libraries with Quill before Jev",
        "Jev broad comparison then richer excerpt evaluation on a shortlist",
        "Emit ranked skills, abstention, and inspectable JSON or hook payload",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo Dicklesworthstone/skillranker had about one hundred thirteen stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "SkillRanker treats Jev as the evaluation engine, not the transport layer. Local code gathers candidates and safeguards; Jev answers which skill fits the next step and whether the set should be rejected entirely. Choice semantics cover picking among named skills plus none of these, which is how abstention stays typed instead of a hand-wavy maybe later. Score-style comparisons show up in the two-pass flow (broad compare, then deeper excerpt read). Operators run sr rank --allow-network with hooks wired in Claude Code when they want automatic nudges. Budget TypeSafe spend on busy sessions; README documents replay and local calibration tooling for when rankings drift.",
    keyFeatures: [
      "Rust sr CLI with JSON, hooks, and TUI surfaces",
      "Jev comparisons include none of these abstention",
      "Quill pre-filter for libraries above two hundred fifty four skills",
      "Requires TypeSafe API key (no substitute provider)",
    ],
    stack: ["Rust", "CLI", "Claude Code hooks", "TypeSafe System One"],
    links: {
      repo: "https://github.com/Dicklesworthstone/skillranker",
      docs: "https://github.com/Dicklesworthstone/skillranker#how-ranking-works",
    },
    pricingNote:
      "Open source CLI; every rank call uses your TypeSafe account. Quill narrowing is local; Jev evaluations bill per README.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "kerpopule-hermes-jev-skills",
      "kitfunso-hippo-memory",
      "tanstack-ai-decide",
      "juspay-neurolink",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Can SkillRanker run without TypeSafe?",
        answer:
          "No. README states ranking requires your own TypeSafe account and API key; local retrieval only prepares candidates.",
      },
      {
        question: "What is none of these?",
        answer:
          "Jev can reject the whole candidate set when nothing fits, so the agent is not forced to load a plausible-but-wrong skill.",
      },
      {
        question: "How do I try it offline first?",
        answer:
          "Run sr demo --case useful for fixtures, then sr rank --allow-network when you are ready to connect a live session.",
      },
    ],
    metaTitle: "skillranker: Jev ranks agent skills with abstention",
    metaDescription:
      "Dicklesworthstone skillranker sr CLI uses TypeSafe Jev to rank Claude Code skills from live context, with none of these and hooks. Rust repo on Jev Directory.",
  },

  "mrnugget-jev-shell-history": {
    slug: "mrnugget-jev-shell-history",
    status: "published",
    problem:
      "Plain prefix history search suggests the most recent literal match, not the command you meant when typing fuzzy intent.",
    targetUser:
      "zsh users who want Fish-style grey autosuggestions ranked by Jev instead of dumb substring order.",
    overview:
      "jev-shell-history (github.com/mrnugget/jev-shell-history) is mrnugget's zsh plugin. On each buffer change it asynchronously runs a small Node CLI that reads up to one hundred distinct history entries, then asks TypeSafe Jev which entry you are completing. Prefix mode filters literals before the model; fuzzy mode leans on calibrated Choice and Noul gates. Accept with arrow right, Ctrl+E, or End. Latency is roughly seven tenths to nine tenths of a second per request per README, mostly API time.",
    creator: {
      name: "mrnugget",
      handle: "mrnugget",
      githubUrl: "https://github.com/mrnugget",
    },
    jevUsage: {
      flowRole: "Per-keystroke history completion Choice with Noul gate for fuzzy mode",
      primitives: ["Choice", "Noul"],
      stateIn:
        "typed_so_far plus ID-tagged candidate commands from zsh history (prefix-filtered or full set).",
      decisionOut:
        "Top Choice candidate with probability score; fuzzy mode only surfaces when Noul and score thresholds pass.",
      flowSteps: [
        "line-pre-redraw hook starts cli.ts without blocking the prompt",
        "Load recent distinct history; prefix mode if any entry starts with typed text",
        "Single TypeSafe request: Choice over candidate IDs plus Noul whether any completes input",
        "Apply JEV_THRESHOLD, JEV_MIN_SCORE, JEV_STRONG_SCORE gates; discard stale responses if buffer changed",
      ],
      sourcedMetrics: [
        {
          claim:
            "Roughly 0.7 to 0.9 seconds per suggestion request, mostly API latency (README).",
          source: "github.com/mrnugget/jev-shell-history README",
        },
        {
          claim:
            "Public GitHub repo mrnugget/jev-shell-history had about one hundred one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "The plugin keeps deterministic shell rules in zsh and delegates judgment to Jev. Choice picks which history ID best continues what you typed; Noul catches cases where nothing in the set actually completes the buffer, which matters in fuzzy mode when the model might otherwise spread probability across noise. README explains why both signals exist: Noul under-fires on tiny histories where Choice is decisive, while nonsense inputs spread Choice mass but leave Noul near zero. Privacy is straightforward: candidate commands and your partial line are sent to TypeSafe on each ranked request (skip the network when a single prefix match is obvious). Configure limits and thresholds with JEV_HISTORY_LIMIT, JEV_MIN_CHARS, JEV_THRESHOLD, and friends before sourcing the plugin.",
    keyFeatures: [
      "Fish-style grey suggestions in zsh 5.9+",
      "Prefix fast path without API when one literal match exists",
      "Choice plus Noul in one request per keystroke batch",
      "Documented env vars for thresholds and history window",
    ],
    stack: ["TypeScript", "zsh", "Node 22+", "TypeSafe System One"],
    links: {
      repo: "https://github.com/mrnugget/jev-shell-history",
      docs: "https://github.com/mrnugget/jev-shell-history#how-it-works",
    },
    pricingNote:
      "Plugin is open source; each ranked keystroke uses TypeSafe API credits. Tune JEV_MIN_CHARS and history limit to control spend.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "realzachi-pg-jev",
      "uehaj-jev-semgrep",
      "classifier-dev",
      "tamaratran-jev-pruner",
    ],
    relatedLearnSlugs: ["use-cases", "jev-typesafe"],
    faq: [
      {
        question: "Does my shell history leave my machine?",
        answer:
          "When Jev ranks candidates, typed text and up to JEV_HISTORY_LIMIT recent commands are sent to TypeSafe. Single obvious prefix matches can skip the API. Read README before enabling on shared machines.",
      },
      {
        question: "Which primitives run per request?",
        answer:
          "One request with Choice over history IDs and a Noul asking whether any candidate completes the typed buffer.",
      },
      {
        question: "Why are suggestions sometimes empty?",
        answer:
          "Fuzzy mode requires top score and Noul or strong score thresholds. Nonsense input should yield no suggestion instead of a random history line.",
      },
    ],
    metaTitle: "jev-shell-history: Jev-ranked zsh autosuggestions",
    metaDescription:
      "mrnugget jev-shell-history uses Jev Choice and Noul on zsh history for Fish-style completions. Thresholds, privacy notes, and install docs.",
  },

  "jexp-neo4jev": {
    slug: "jexp-neo4jev",
    status: "published",
    problem:
      "Graph walks with chat models waste tokens narrating edges instead of returning a calibrated distribution over next hops.",
    targetUser:
      "Neo4j developers and ML engineers who want a reproducible demo of beam search navigation with one structured call per hop.",
    overview:
      "neo4jev (github.com/jexp/neo4jev) is Michael Hunger's (jexp) graph navigation demo using TypeSafe system_one. Each hop lists outgoing relationships as Choice options (type, properties, target labels) and asks a Noul whether the navigation goal is reached in the same call. Beam search keeps top branches ranked by sum of log probabilities to avoid float underflow. Streamlit app, notebooks, and neo4j-viz rendering target the public companies2 graph by default but introspect schema live for other instances.",
    creator: {
      name: "Michael Hunger",
      handle: "jexp",
      githubUrl: "https://github.com/jexp",
    },
    jevUsage: {
      flowRole: "Single-hop navigator: Choice over edges plus goal Noul in one system_one round trip",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Current node context, capped outgoing relationship candidates from Neo4j, and GoalSpec text from the UI or notebook.",
      decisionOut:
        "Probability mass over next relationships plus goal-reached signal; beam search aggregates log-probs along paths.",
      flowSteps: [
        "Introspect labels and indexes; search a start node",
        "Fetch outgoing relationship candidates for the active node",
        "system_one with Choice over NavCandidate edges and Noul for goal reached",
        "Beam search expands top branches; viz highlights chosen paths vs neighborhood",
      ],
      sourcedMetrics: [
        {
          claim:
            "Each hop costs exactly one system_one round trip for both Choice and Noul (README architecture).",
          source: "github.com/jexp/neo4jev README",
        },
        {
          claim:
            "Public GitHub repo jexp/neo4jev had about eighty nine stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "neo4jev is a teaching stack for structured graph policies. Instead of prompting an LLM to ramble about Cypher, navigator.py sends typed state to system_one and reads a full distribution over legal next edges. Noul goal detection riding in the same call keeps hop cost predictable for beam search. Notebooks and Streamlit wire the same library; without TYPESAFE_API_KEY the UI shows failures verbatim and uses labeled stand-ins so pipelines still demo. That honesty matters for evals: never present synthetic probabilities as live Jev output. Point .env at your own Neo4j URI when you outgrow the Labs companies2 sandbox.",
    keyFeatures: [
      "Schema-agnostic Neo4j introspection",
      "Choice plus Noul per hop in one system_one call",
      "Beam search ranked by log probability sums",
      "Streamlit app and Jupyter notebooks share neo4jev core",
    ],
    stack: ["Python", "Neo4j", "Streamlit", "typesafe-sdk", "neo4j-viz"],
    links: {
      repo: "https://github.com/jexp/neo4jev",
      docs: "https://github.com/jexp/neo4jev#architecture-overview",
      post: "https://x.com/jexp/status/2100478725393686556",
    },
    pricingNote:
      "Open source demo; live hops bill TypeSafe per system_one call. Public Neo4j Labs endpoint is free to try with documented credentials.",
    firstSeen: "2026-09-17",
    relatedSlugs: ["classifier-dev", "mfm-jev-search", "realzachi-pg-jev", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does it work without TypeSafe credentials?",
        answer:
          "Code runs, but README states live system_one calls need TYPESAFE_API_KEY. Without it you see explicit stand-in answers, not fake model output.",
      },
      {
        question: "Which graph does the default demo use?",
        answer:
          "Public Neo4j Labs companies2 database per README, with schema-agnostic code for other URIs via .env.",
      },
      {
        question: "Why log probabilities for beam search?",
        answer:
          "README cites sum of log-probs to reduce float underflow and length bias when comparing multi-hop paths.",
      },
    ],
    metaTitle: "neo4jev: Jev Choice beam search on Neo4j graphs",
    metaDescription:
      "jexp neo4jev navigates Neo4j one hop at a time with system_one Choice and Noul, beam search, Streamlit UI, and notebooks.",
  },

  "chetaslua-jevmeter": {
    slug: "chetaslua-jevmeter",
    status: "published",
    problem:
      "Long talking-head videos hide evasive lines in volume; viewers need sentence-level BS signals, not a vibe check after forty minutes.",
    targetUser:
      "Creators, researchers, and terminal-friendly editors who want open-source overlays that score every sentence with Jev and export a postable clip.",
    overview:
      "jevmeter (github.com/ChetasLua/jevmeter) is chetaslua's Python CLI. Whisper timestamps sentences, then parallel Jev Noul probes (per preset questions on evasion, spin, hot takes, or hype) score each line. Pillow draws 1920x1080 frames into ffmpeg for a 16:9 jevmeter.mp4 beside your source. Presets cover debates, earnings calls, podcasts, and launch hype. README badges quote about five cents for a full debate render on the battle demo thread and held-out preset accuracy claims in eval/RESULTS.md.",
    creator: {
      name: "chetaslua",
      handle: "chetaslua",
      xUrl: "https://x.com/chetaslua/status/2100602714204049588",
      githubUrl: "https://github.com/ChetasLua",
    },
    creatorQuote: {
      text:
        "Every sentence scored. Every dodge flagged. Rendered as a 16:9 edit you can post.",
      attributedTo: "chetaslua",
      sourceUrl: "https://github.com/ChetasLua/jevmeter",
    },
    jevUsage: {
      flowRole: "Per-sentence BS and spin scoring with parallel Noul probes after Whisper segmentation",
      primitives: ["Noul", "Score"],
      stateIn:
        "Sentence text, speaker context, preset rubric questions, and prior lines per README pipeline (Whisper word alignment optional with transcript file).",
      decisionOut:
        "Calibrated per-sentence scores driving on-screen meters and highlight edits in the rendered video.",
      flowSteps: [
        "Transcribe with Whisper timestamps (optional transcript alignment)",
        "Fire parallel POST /v1/systemone Noul questions per sentence and preset",
        "Aggregate scores for highlight or full-length edit modes",
        "Render 1920x1080 frames via Pillow into ffmpeg output",
      ],
      sourcedMetrics: [
        {
          claim:
            "README badge cites about five cents for a full debate render (battle demo post).",
          source: "github.com/ChetasLua/jevmeter README and x.com/chetaslua/status/2100473581251748216",
        },
        {
          claim:
            "Public GitHub repo ChetasLua/jevmeter had about eighty one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jevmeter is a batch media pipeline, not a chat wrapper. Whisper handles audio; Jev handles judgment. Each sentence triggers structured Noul questions drawn from the preset (evasive, dodged the question, hype, and similar flags in the wizard copy). README documents parallel Jev threads and render workers so long videos stay practical. The open-source BS meter clip on X shows the overlay in motion; this directory embeds that remote video in the showcase (referrerPolicy no-referrer so twimg playback works in Chromium). API keys live in user settings per install.sh, not in the repo. Mention the optional battle post only as cost context; the featured embed follows the open-source launch post.",
    keyFeatures: [
      "Terminal wizard for presets, speakers, and highlight vs full render",
      "Whisper transcription plus parallel Jev scoring",
      "16:9 ffmpeg output ready to post",
      "Featured showcase clip with remote X video",
    ],
    stack: ["Python", "Whisper", "ffmpeg", "Pillow", "TypeSafe System One"],
    links: {
      repo: "https://github.com/ChetasLua/jevmeter",
      docs: "https://github.com/ChetasLua/jevmeter#-new-here-3-steps-no-coding",
      post: "https://x.com/chetaslua/status/2100602714204049588",
    },
    pricingNote:
      "Open source; TypeSafe spend scales with sentence count and --threads. README cites micro-dollar debate totals for the sample battle.",
    firstSeen: "2026-09-17",
    demoIds: ["jevmeter-chetaslua"],
    relatedSlugs: [
      "kraayenjon-ai-slop-detector",
      "robj3d3-superx-post-scoring",
      "nutlope-1kpapers",
      "virlo-ai",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Which primitive scores each sentence?",
        answer:
          "README pipeline uses Noul questions per preset flag via systemone, with parallel requests per sentence.",
      },
      {
        question: "Do I need to commit videos to GitHub?",
        answer:
          "No. Run the CLI locally; this directory only hotlinks the X/Twitter mp4 for the showcase player.",
      },
      {
        question: "What does the five cent badge mean?",
        answer:
          "It comes from the jevmeter README battle demo badge referencing the full debate render. Your cost scales with length, preset, and thread settings.",
      },
    ],
    metaTitle: "jevmeter: Jev BS meter overlays for any video",
    metaDescription:
      "chetaslua jevmeter transcribes with Whisper, scores sentences via parallel Jev Noul probes, and renders 16:9 edits. Repo plus showcase clip.",
  },

  "theoleecj-semif": {
    slug: "theoleecj-semif",
    status: "published",
    problem:
      "Teams want System One shaped APIs and calibrated option probabilities without routing every gate through a closed hosted model.",
    targetUser:
      "Researchers and hackers self-hosting open weights who need Choice, Score, and Noul style batches on hardware they control.",
    overview:
      "SemIf (github.com/TheoLeeCJ/SemIf, openjev.com) is Theo Lee CJ's independent decision server formerly marketed as OpenJev on the site. It reads shared state once, asks many typed questions, and returns option probabilities from open models in a single forward pass. The project explicitly disclaims affiliation with TypeSafe: same interface ideas, different weights and training. WebGPU browser demos and PyTorch/MPS paths ship in-repo for replayable evidence.",
    creator: {
      name: "Theo Lee CJ",
      handle: "TheoLeeCJ",
      githubUrl: "https://github.com/TheoLeeCJ",
      companyUrl: "https://openjev.com",
    },
    jevUsage: {
      flowRole: "Self-hosted System One compatible decision server over open model logits",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Shared text or structured state plus runtime-defined question schemas (criteria maps, rubric scores, boolean nouls) documented in SemIf harnesses.",
      decisionOut:
        "Per-question probability vectors read directly from logits without generating answer prose or JSON repair loops.",
      flowSteps: [
        "Pack state and typed questions into one model forward pass",
        "Read option logits for each Choice, Score, or Noul head",
        "Return calibrated-style scores (operators should run local calibration per README)",
        "Downstream code thresholds probabilities like any System One client",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo TheoLeeCJ/SemIf had about three thousand eight hundred forty four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
        {
          claim:
            "README positions SemIf as reproducing the interface pattern, not TypeSafe's undisclosed model or training.",
          source: "github.com/TheoLeeCJ/SemIf README",
        },
      ],
    },
    howJevIsUsed:
      "SemIf is the open alternative when you want semantic ifs without TypeSafe inference bills. Agent code still writes thresholds; the server answers which branch wins, how risky a state feels, or whether evidence supports a claim. Because probabilities come from logits, you skip the usual chat completion detour. Treat scores as research baselines: README adds temperature calibration work and warns that home GPU numbers are not production SLAs. Pair SemIf with hosted classifier.dev when you want a managed fast tier beside your own hardware experiments.",
    keyFeatures: [
      "openjev.com browser demos plus local PyTorch and MPS scoring",
      "Independent disclaimer and renamed SemIf branding in README",
      "Batch many Choice, Score, and Noul questions on one state",
      "Community bridges for additional open weight families",
    ],
    stack: ["Python", "PyTorch", "WebGPU demo", "Open weights", "Self-hosted inference"],
    links: {
      website: "https://openjev.com",
      repo: "https://github.com/TheoLeeCJ/SemIf",
      docs: "https://github.com/TheoLeeCJ/SemIf#semif-formerly-openjev",
      demo: "https://openjev.com",
    },
    pricingNote:
      "Open source software; you pay for GPUs, electricity, and any cloud you rent. Not a TypeSafe substitute for compliance-sensitive hosted gates.",
    firstSeen: "2026-09-17",
    relatedSlugs: [
      "classifier-dev",
      "vinnylarouge-jevlike",
      "browser-use-jev-ultrafast",
      "openrouter-typesafe-jev-1-13",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is SemIf the same as TypeSafe Jev?",
        answer:
          "No. README states SemIf is independent research that mimics the API shape with open models, not TypeSafe's closed service.",
      },
      {
        question: "Can I trust the default probabilities out of the box?",
        answer:
          "README documents calibration passes and workload-specific temperature tuning. Run the bundled eval harnesses on your hardware before hard gates.",
      },
      {
        question: "Where did the OpenJev name go?",
        answer:
          "The project rebranded to SemIf while keeping openjev.com as the demo home. This listing uses catalog slug theoleecj-semif.",
      },
    ],
    metaTitle: "SemIf: self-hosted System One style decisions on open models",
    metaDescription:
      "TheoLeeCJ SemIf (openjev.com) batches Choice, Score, and Noul from open weights in one pass. Independent of TypeSafe; GitHub repo and browser demos.",
  },

  "featherless-simple-jev": {
    slug: "featherless-simple-jev",
    status: "published",
    problem:
      "Teams want Jev-shaped classifier HTTP without training a separate head or parsing model-generated JSON blobs.",
    targetUser:
      "ML engineers standardizing on Hugging Face weights who need a /v1/classifier surface for agents and eval scripts.",
    overview:
      "Simple Jev (github.com/featherless-ai/simple-jev) from Featherless AI turns compatible open models into structured decision endpoints. Clients send shared state plus typed questions; the server reads next-token logits and assembles JSON for Choice, Score, and Noul answers. The model never free-writes JSON. A public demo API at simple-jev-demo-api.featherless.ai allows two requests per second with a two thousand token context cap and no API key; production paths run on Featherless plans or your own HF server from the repo.",
    creator: {
      name: "Featherless AI",
      handle: "featherless-ai",
      githubUrl: "https://github.com/featherless-ai",
      company: "Featherless AI",
      companyUrl: "https://featherless.ai",
    },
    jevUsage: {
      flowRole: "Hosted or self-hosted classifier API built from HF model logits",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Shared context string plus questions map with type choice, score, or noul criteria per OpenAPI examples in the repo.",
      decisionOut:
        "Structured JSON response with probabilities per option; assembled server-side from logits.",
      flowSteps: [
        "Validate request against shared common/ schemas",
        "Run one forward pass over state and question prompts",
        "Score each criterion token from logits",
        "Return versioned JSON without decoding a completion",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo featherless-ai/simple-jev had about four hundred eighty four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
        {
          claim:
            "Demo API documents 2k token context and 2 RPS limits without authentication.",
          source: "github.com/featherless-ai/simple-jev README",
        },
      ],
    },
    howJevIsUsed:
      "Simple Jev is the bring-your-own-weights cousin of hosted classifier.dev. Agents keep the same mental model: pack state once, fan out questions, threshold probabilities in code. Featherless hosts a playground and demo API so you can curl a Gemma classifier ID before you sync weights locally. The common/ Python package holds validation and scoring rules so alternate inference backends can share behavior. Mention OpenRouter or TypeSafe hosted routes only when you compare latency; this repo is for open HF pipelines.",
    keyFeatures: [
      "POST /v1/classifier compatible HTTP surface",
      "Public no-login demo API with documented rate limits",
      "Playground and docs at simple-jev.featherless.ai",
      "Self-host path with Hugging Face Transformers server",
    ],
    stack: [
      "Python",
      "PyTorch",
      "Hugging Face Transformers",
      "Featherless inference",
    ],
    links: {
      website: "https://simple-jev.featherless.ai",
      repo: "https://github.com/featherless-ai/simple-jev",
      docs: "https://simple-jev.featherless.ai",
      demo: "https://simple-jev-demo-api.featherless.ai/v1/classifier",
    },
    pricingNote:
      "Demo tier is free with tight limits; Featherless paid plans raise caps per featherless.ai pricing.",
    firstSeen: "2026-09-22",
    relatedSlugs: [
      "classifier-dev",
      "tanstack-ai-decide",
      "openrouter-typesafe-jev-1-13",
      "vinnylarouge-jevlike",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does the model emit JSON?",
        answer:
          "No. README states the server constructs JSON from logits; the model does not complete a JSON string.",
      },
      {
        question: "Which models work?",
        answer:
          "GET /v1/models on the demo API lists served classifier IDs such as featherless-ai/gemma-4-26B-A4B-classifier; self-host docs cover adding weights.",
      },
      {
        question: "Is this TypeSafe hosted Jev?",
        answer:
          "No. Simple Jev runs open models on Featherless or your hardware. Use classifier.dev or TypeSafe keys when you want the closed jev model.",
      },
    ],
    metaTitle: "Simple Jev: HF models as Choice and Score classifier APIs",
    metaDescription:
      "Featherless Simple Jev serves /v1/classifier from open weights with logits-built JSON. Demo API, playground, and GitHub server.",
  },

  "awlevin-typesafe-computer-use": {
    slug: "awlevin-typesafe-computer-use",
    status: "published",
    problem:
      "Screenshot-first computer use agents burn dollars and seconds on steps that are really one click from a short list.",
    targetUser:
      "macOS builders who want a dry-run friendly clicker with TypeSafe Jev routing and a small writer only when typing matters.",
    overview:
      "typesafe-computer-use (github.com/awlevin/typesafe-computer-use) is Aaron Levin's Python clicker for real desktop automation. OCR and accessibility APIs turn the screen into numbered actions; each step sends one TypeSafe Jev Choice for operation and target; TYPE_TEXT, URL proposals, and final answers delegate to a compact writer model. Default runs are dry-run; pass --act to drive mouse and keyboard. README comparison tables claim about 155x lower per-step cost and 14x to 40x faster model latency versus Claude Opus 5 on a bare screenshot for the same decision (author measured; rerun locally).",
    creator: {
      name: "Aaron Levin",
      handle: "awlevin",
      xUrl: "https://x.com/awlevin/status/2100262612428894676",
      githubUrl: "https://github.com/awlevin",
    },
    creatorQuote: {
      text:
        "Most steps do not need a plan. They need one choice from a short list, made quickly and cheaply, with a confidence number you can gate on.",
      attributedTo: "Aaron Levin",
      sourceUrl: "https://github.com/awlevin/typesafe-computer-use",
    },
    jevUsage: {
      flowRole: "Per-step macOS computer-use Choice over OCR and accessibility action lists",
      primitives: ["Choice", "Score"],
      stateIn:
        "Structured screen capture: element indices, roles, text, and deterministic date parsing helpers described in README (not raw pixels for the classifier path).",
      decisionOut:
        "Next operation and target index with calibrated confidence; writer model only on TYPE_TEXT or answer paths.",
      flowSteps: [
        "Capture screen via accessibility plus OCR into finite actions",
        "One Jev Choice selects operation and compatible target",
        "Execute click, scroll, or navigation directly when safe",
        "Invoke writer model for free-text fields or final natural-language answers",
      ],
      sourcedMetrics: [
        {
          claim:
            "README table cites about $0.0002 per decision versus about $0.032 for Opus 5 on the same screenshot step.",
          source: "github.com/awlevin/typesafe-computer-use README",
        },
        {
          claim:
            "README cites 0.13 to 0.38 s model latency versus 5.2 s for Opus 5 on the measured step.",
          source: "github.com/awlevin/typesafe-computer-use README",
        },
        {
          claim:
            "Public GitHub repo awlevin/typesafe-computer-use had about eight hundred twenty eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Aaron's loop is the anti-screenshot pattern: deterministic parsers build state, Jev picks among finite UI actions, and only the exceptions touch a chat model. That is why related browser-use listings feel slower by comparison: they still ship pixels to frontier models every step. Dry-run mode lets you watch decisions without touching the cursor; --act is explicitly beta because real mice are scary. The showcase clip on X walks through TechCrunch ticket checkout style goals; embed uses remote twimg with referrerPolicy no-referrer like other directory videos. Do not confuse this repo with Milind's CoreML madewithjev computer-use build; this listing tracks awlevin's GitHub and Aaron's post only.",
    keyFeatures: [
      "clicker CLI with dry-run default and --act for live control",
      "TypeSafe Jev every step; Anthropic writer optional for text",
      "Documented cost and latency tables versus Opus screenshot baseline",
      "macOS first with experimental Windows notes in README",
    ],
    stack: [
      "Python",
      "macOS accessibility",
      "OCR",
      "TypeSafe Jev",
      "Anthropic writer models",
    ],
    links: {
      repo: "https://github.com/awlevin/typesafe-computer-use",
      docs: "https://github.com/awlevin/typesafe-computer-use#why",
      post: "https://x.com/awlevin/status/2100262612428894676",
    },
    pricingNote:
      "Open source; TypeSafe per-step fees plus optional writer model usage per README measurements.",
    firstSeen: "2026-09-17",
    demoIds: ["typesafe-computer-use-awlevin"],
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "lahfir-agent-desktop",
      "classifier-dev",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev see screenshots?",
        answer:
          "The classifier path uses structured OCR and accessibility state per README. Writer models may use vision for final answers when enabled.",
      },
      {
        question: "Is --act safe on day one?",
        answer:
          "README warns the tool is beta and drives your real mouse. Start with dry runs until thresholds look sane.",
      },
      {
        question: "Where are the speedup numbers from?",
        answer:
          "They come from Aaron's README comparison table on the same goal and screenshot. Reproduce with the documented harness before quoting in prod decks.",
      },
    ],
    metaTitle: "typesafe-computer-use: macOS Jev clicker, no screenshot tax",
    metaDescription:
      "awlevin typesafe-computer-use uses TypeSafe Jev Choices on OCR action lists, dry-run clicker, author cost tables, and X demo clip.",
  },

  "moritzkremb-jev-voice-browser": {
    slug: "moritzkremb-jev-voice-browser",
    status: "published",
    problem:
      "Voice UIs either hallucinate actions in an LLM monologue or lag so badly that you finish the sentence before anything happens.",
    targetUser:
      "Hackers experimenting with headed Chromium plus Web Speech who want batched Jev gates on every partial transcript.",
    overview:
      "jev-voice-browser (github.com/moritzkremb/jev-voice-browser) wires Playwright, a localhost control page, and TypeSafe Jev into a voice-driven browser. Partial transcripts debounce every two hundred milliseconds; the server snapshots up to one hundred elements, then asks nine to eleven typed questions in one System One call returning in about two hundred fifty to three hundred fifty milliseconds. Policy code decides act, wait, ask, or ignore. Search queries, typed text, and URLs are candidate spans chosen by Choice and copied verbatim; Jev never generates natural language.",
    creator: {
      name: "Moritz Kremb",
      handle: "moritzkremb",
      githubUrl: "https://github.com/moritzkremb",
    },
    jevUsage: {
      flowRole: "Voice debounce loop with batched intent, target, safety, and scroll Score questions",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Partial transcript text plus numbered DOM snapshot (roles, names, indices) and lightweight session context from constants.js.",
      decisionOut:
        "Intent operation, element target, site routing, command completeness, addressee checks, destructive flags, and scroll amount probabilities consumed by policy thresholds.",
      flowSteps: [
        "Web Speech streams partials over websocket to Node server",
        "Debounce and snapshot controlled Chromium window",
        "Single Jev request with parallel questions (intent, target, safety, scroll)",
        "Playwright executes clicks, navigation, or scroll; destructive paths require spoken confirm",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cites about $0.0002 per real API call and two hundred fifty to three hundred fifty ms Jev latency per debounced transcript.",
          source: "github.com/moritzkremb/jev-voice-browser README",
        },
        {
          claim:
            "Public GitHub repo moritzkremb/jev-voice-browser had about two hundred forty four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Voice browsers fail when you treat speech as chat completion. Moritz batches a dozen binary and Choice questions so one forward pass answers whether you meant the browser, which numbered overlay to click, and whether scroll should be a little or a lot. Ignored chit-chat stays near zero is_command probability per README table. Destructive clicks raise a confirm toast instead of trusting a single threshold. The API key never reaches the browser control page; only the Node process calls TypeSafe. No public X video was available when this batch shipped, so the product page stands on README architecture and the madewithjev build write-up linked from catalog.",
    keyFeatures: [
      "Headed Chromium with live probability bars on control UI",
      "Batched Jev questions per partial transcript",
      "Destructive action confirm flow",
      "Text command fallback when microphone unavailable",
    ],
    stack: [
      "Node.js",
      "Playwright",
      "Web Speech API",
      "TypeSafe Jev jev-1.13.0",
    ],
    links: {
      repo: "https://github.com/moritzkremb/jev-voice-browser",
      docs: "https://github.com/moritzkremb/jev-voice-browser#run-it",
      demo: "https://madewithjev.com/builds/jev-voice-browser",
    },
    pricingNote:
      "Open source; README estimates fractions of a cent per Jev call with your TypeSafe key.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "lahfir-agent-desktop",
      "awlevin-typesafe-computer-use",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev write search queries?",
        answer:
          "No. README states code extracts candidate spans and Jev picks one verbatim via Choice.",
      },
      {
        question: "Which browser supplies the microphone?",
        answer:
          "You open the control page in Chrome or Edge; Web Speech is unavailable in Firefox or Safari per README.",
      },
      {
        question: "Can I attach to my own Chrome?",
        answer:
          "Yes. ./run.sh --cdp http://127.0.0.1:9222 attaches to an existing debugging port.",
      },
    ],
    metaTitle: "jev-voice-browser: batched Jev for voice-driven Playwright",
    metaDescription:
      "moritzkremb jev-voice-browser debounces speech into one TypeSafe call for intent, targets, and safety before Playwright acts. GitHub README and build page.",
  },

  "romanslack-jev-drone": {
    slug: "romanslack-jev-drone",
    status: "published",
    problem:
      "Pure geometric planners stall on maneuvers like climbing when gaps do not exist, yet vision models are too slow and opaque for 500 Hz control.",
    targetUser:
      "Robotics curious developers evaluating advisory Jev loops on top of classical sim controllers.",
    overview:
      "jev-drone (github.com/RomanSlack/jev-drone) simulates a camera-only quadrotor in MuJoCo. Classical CV at fifteen hertz builds symbolic range sectors, obstacle height, and target bearing; TypeSafe Jev at about two and a half hertz advises maneuver Choice (hold_course, gap_left, gap_right, climb, brake, reacquire), risk Score, and target_truly_lost Noul when the scene fingerprint changes. A five hundred hertz geometric controller and fifty hertz safety reflex always own the sticks; code vetoes unsafe climbs. README ablation reports the no-Jev baseline never passes station two while Jev engaged clears the full course in the author's single documented run.",
    creator: {
      name: "Roman Slack",
      handle: "RomanSlack",
      githubUrl: "https://github.com/RomanSlack",
    },
    jevUsage: {
      flowRole: "Low-rate tactical advisor over symbolic perception, not pixel input",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Compact JSON scene: forward range sectors, obstruction height, top-edge visibility, target bearing, and fingerprint hash from depth plus segmentation buffers.",
      decisionOut:
        "maneuver Choice, risk Score, and target_truly_lost Noul probabilities consumed by guidance with hard reflex overrides.",
      flowSteps: [
        "Eye pipeline segments depth at fifteen hertz without ground truth cheats",
        "Fingerprint unchanged scenes reuse last Jev judgment",
        "Batch three questions in one Jev call when tactical context shifts",
        "Guidance merges Jev advice with geometric controller and reflex vetoes",
      ],
      sourcedMetrics: [
        {
          claim:
            "README ablation table: baseline without Jev stops near 17.7 m; Jev engaged run reaches 77.5 m full course with zero collisions in the cited run.",
          source: "github.com/RomanSlack/jev-drone README",
        },
        {
          claim:
            "Typical sixty five second flight issues about one hundred ten Jev calls at 0.11 s median latency per README.",
          source: "github.com/RomanSlack/jev-drone README",
        },
        {
          claim:
            "Public GitHub repo RomanSlack/jev-drone had about one hundred thirty one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Roman's drone is the clean split brain story: perception and control stay in code you can unit test; Jev only answers small meaning questions when the symbolic scene changes. Without climb in the action vocabulary the greedy baseline dies at the low beam; Jev supplies the maneuver label while reflexes prevent suicide climbs. README is candid that early arenas showed no advantage and that the published Jev column is a single run, not a seed average. Try the Vercel demo for visuals; there is no hosted X clip in this batch, so the thick page leans on README figures and the interactive site.",
    keyFeatures: [
      "MuJoCo Skydio-style airframe with five station course",
      "Advisory Jev at ~2.5 Hz with fingerprint caching",
      "500 Hz controller plus 50 Hz safety reflex overrides",
      "Web demo at jev-drone.vercel.app",
    ],
    stack: [
      "Python",
      "MuJoCo",
      "Classical CV",
      "TypeSafe Jev",
      "Vercel demo frontend",
    ],
    links: {
      repo: "https://github.com/RomanSlack/jev-drone",
      docs: "https://github.com/RomanSlack/jev-drone#the-idea",
      demo: "https://jev-drone.vercel.app",
    },
    pricingNote:
      "Open source sim; live Jev calls need your TypeSafe API key during runs.",
    firstSeen: "2026-09-17",
    relatedSlugs: [
      "fhshaik-typesafe-mario",
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev see camera pixels?",
        answer:
          "No. README states Jev reads JSON scene summaries built by classical CV, not raw images.",
      },
      {
        question: "Can Jev override safety reflexes?",
        answer:
          "No. Fifty hertz reflexes and geometric control veto unsafe maneuvers even if Jev proposes climb.",
      },
      {
        question: "Are the ablation numbers averaged?",
        answer:
          "README warns the Jev column is one sixty five second run and earlier arenas showed variance. Treat claims as structural, not leaderboard guarantees.",
      },
    ],
    metaTitle: "jev-drone: advisory Jev on MuJoCo quadrotor sim",
    metaDescription:
      "RomanSlack jev-drone uses TypeSafe Jev for maneuver Choice at 2.5 Hz over symbolic CV, with README ablation and jev-drone.vercel.app demo.",
  },

  "superagents-lab-jev-search": {
    slug: "superagents-lab-jev-search",
    status: "published",
    problem:
      "Agent search demos either hallucinate answers or ship a single hard-coded Google query. Builders want ranked evidence with explicit source planning.",
    targetUser:
      "Engineers self-hosting Cloudflare Workers search who want Jev to plan queries and score hits without a chat summarizer on top.",
    overview:
      "jev-search (github.com/superagents-lab/jev-search) is an MIT TypeScript worker that accepts plain-language questions, lets Jev choose providers, time ranges, and keyword variants, calls Search1API for raw results, then Jev Scores relevance before returning links and snippets only. Try the hosted UI at jev.s1.dev or deploy the worker with your keys.",
    creator: {
      name: "Superagents Lab",
      handle: "superagents-lab",
      githubUrl: "https://github.com/superagents-lab",
      company: "Superagents Lab",
      companyUrl: "https://github.com/superagents-lab",
    },
    jevUsage: {
      flowRole: "Query planning and per-hit relevance ranking over Search1API results",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "User question text, configured provider list, and candidate search parameters (sources, recency windows, query variants).",
      decisionOut:
        "Planned fetch plan (which sources and terms to run) plus per-result relevance scores that gate what surfaces in the UI.",
      flowSteps: [
        "User submits natural language query at jev.s1.dev or the worker API",
        "Jev Choice selects sources, time filters, and query reformulations",
        "Search1API returns raw hits without generated prose",
        "Jev Score ranks snippets; UI shows links and excerpts only",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo superagents-lab/jev-search had about four hundred twenty seven stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-search treats Jev as a planner and reranker, not an answer bot. The worker keeps HTTP boundaries crisp: one planning pass decides how to spend Search1API quota, then structured scoring trims noise before anything renders. That matches the directory pattern of typed gates instead of free-form chat. There is no public X launch clip tied to this repo in this batch, so the thick page leans on README architecture and the live demo. If you need channel-scoped search with caption jumps, compare the My First Million demo listing; jev-search is general web retrieval.",
    keyFeatures: [
      "MIT Cloudflare Workers deployment path",
      "Search1API integration with BYOK configuration",
      "No generated answer layer in the default UX",
      "Hosted demo at jev.s1.dev",
    ],
    stack: [
      "TypeScript",
      "Cloudflare Workers",
      "Search1API",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/superagents-lab/jev-search",
      docs: "https://github.com/superagents-lab/jev-search#readme",
      demo: "https://jev.s1.dev",
    },
    pricingNote:
      "Open source worker; Search1API and TypeSafe usage bill to your keys on self-hosted runs.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "mfm-jev-search",
      "classifier-dev",
      "tanstack-ai-decide",
      "vercel-eve",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does jev-search write summaries?",
        answer:
          "The product positioning is links plus snippets ranked by Jev. It is not a chat completion wrapper over search results.",
      },
      {
        question: "Can I self-host?",
        answer:
          "Yes. README documents Cloudflare Workers deployment with your Search1API and TypeSafe credentials.",
      },
      {
        question: "How is this different from the My First Million demo?",
        answer:
          "mfm-jev-search scopes retrieval to one YouTube catalog with hybrid recall. jev-search targets general web search planning via Search1API.",
      },
    ],
    metaTitle: "jev-search: Jev-planned web search on Cloudflare Workers",
    metaDescription:
      "superagents-lab jev-search uses TypeSafe Jev to plan Search1API queries and score snippets without generated answers. MIT repo and jev.s1.dev demo.",
  },

  "nailthy62-drape-virtual-try-on": {
    slug: "nailthy62-drape-virtual-try-on",
    status: "published",
    problem:
      "Fashion try-on demos choke when every outfit change needs a slow generative rerender instead of a fast discrete closet pick.",
    targetUser:
      "Creators experimenting with realtime wardrobe UX for Drape and similar virtual try-on products.",
    overview:
      "Nailthy Tang's Drape experiment streams your voice, tracks what you are wearing, and lets Jev pick the next garment from a finite closet list so the preview updates live on camera. She cites about $0.0011 per decision and about 620 ms per swap on X. Product home is weardrape.app; the madewithjev build page documents the loop.",
    creator: {
      name: "Nailthy Tang",
      handle: "nailthy62",
      xUrl: "https://x.com/nailthy62",
      company: "Drape",
      companyUrl: "https://weardrape.app",
    },
    jevUsage: {
      flowRole: "Realtime wardrobe Choice from transcript plus current outfit state",
      primitives: ["Choice", "Score"],
      stateIn:
        "Live speech transcript, detected or labeled current outfit pieces, and enumerated closet SKUs the renderer can swap.",
      decisionOut:
        "Next garment Choice (and supporting relevance scores) consumed by the try-on pipeline without free-form styling prose.",
      flowSteps: [
        "User talks through preferences while the camera feed runs",
        "ASR transcript and outfit tags land in structured state",
        "Jev Choice selects the next closet item that matches the request",
        "Renderer swaps the outfit on the live preview",
      ],
      sourcedMetrics: [
        {
          claim:
            "Author post cites about $0.0011 per decision and about 620 ms per decision on the public X clip.",
          source: "x.com/nailthy62/status/2101388186916454439",
        },
      ],
    },
    howJevIsUsed:
      "This is a closet-picker loop, not open-ended image generation every frame. Speech becomes text; the current look is already structured; Jev only answers which SKU comes next from a list the renderer understands. That keeps latency in the sub-second band Nailthy quoted on X. The directory embeds her launch video via remote twimg with referrerPolicy no-referrer like other showcase cards. Treat the experiment as a product pattern for Drape rather than a standalone open repo in this listing.",
    keyFeatures: [
      "Voice-driven outfit changes on a live feed",
      "Finite closet Choice instead of unbounded generative edits",
      "Author cost and latency figures on the X post",
      "Linked from madewithjev.com/builds/drape-virtual-try-on",
    ],
    stack: [
      "TypeSafe Jev",
      "Speech to text",
      "Realtime try-on renderer",
      "Drape product stack",
    ],
    links: {
      website: "https://weardrape.app",
      post: "https://x.com/nailthy62/status/2101388186916454439",
      demo: "https://madewithjev.com/builds/drape-virtual-try-on",
    },
    pricingNote:
      "Experiment metrics from the author post; production Drape pricing lives on weardrape.app.",
    firstSeen: "2026-09-19",
    demoIds: ["drape-virtual-try-on-nailthy62"],
    relatedSlugs: ["ploy-ai", "hypit-ai", "stealads-ai"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is there a public GitHub repo for this clip?",
        answer:
          "This listing tracks the Drape experiment and X proof. Follow weardrape.app for the product; no separate repo slug is claimed here.",
      },
      {
        question: "Does Jev generate new clothing pixels?",
        answer:
          "The described loop picks among existing closet items the renderer can swap, keeping decisions typed and fast.",
      },
      {
        question: "Where do the cost numbers come from?",
        answer:
          "They are author-reported on the X post embedded in the showcase. Re-measure on your own stack before quoting in decks.",
      },
    ],
    metaTitle: "Drape virtual try-on: Jev closet picks in realtime",
    metaDescription:
      "Nailthy Tang Drape experiment uses TypeSafe Jev to read speech and current outfit state, then Choice-pick the next look in about 620 ms. X demo clip.",
  },

  "trungdq88-youtube-sponsor-detection": {
    slug: "trungdq88-youtube-sponsor-detection",
    status: "published",
    problem:
      "Sponsor segments waste viewer time and simple keyword skips miss nuanced transitions or fire on the wrong cue.",
    targetUser:
      "Chrome users who want a BYOK extension that listens for sponsor pivots and jumps the playhead without a cloud DVR service.",
    overview:
      "youtube-sponsor-detection (github.com/trungdq88/youtube-sponsor-detection) is Tony Dinh's open JavaScript extension. Optional live audio and captions feed Jev a sponsor-segment classification; when confidence crosses threshold the player skips forward. The author cites about $0.005 per video on X. MIT repo plus madewithjev build notes.",
    creator: {
      name: "Tony Dinh",
      handle: "tdinh_me",
      xUrl: "https://x.com/tdinh_me",
      githubUrl: "https://github.com/trungdq88",
    },
    jevUsage: {
      flowRole: "Realtime sponsor segment detection gate on streaming transcript or audio cues",
      primitives: ["Noul", "Score"],
      stateIn:
        "Rolling transcript or audio-derived text from the active YouTube tab plus lightweight player state.",
      decisionOut:
        "Sponsor-segment probability that triggers an automatic skip command when above threshold.",
      flowSteps: [
        "Extension attaches to the YouTube player with user consent",
        "Audio or captions stream into chunked text state",
        "Jev evaluates sponsor-segment questions on a timer",
        "Player seeks past the segment when the gate fires",
      ],
      sourcedMetrics: [
        {
          claim:
            "Author post cites about $0.005 per video for the prototype with BYOK.",
          source: "x.com/tdinh_me/status/2100793777103466615",
        },
        {
          claim:
            "Public GitHub repo trungdq88/youtube-sponsor-detection had about ninety four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Tony's extension is a listening loop, not a batch summarizer. Chunks of transcript arrive while you watch; Jev answers a tight sponsor question instead of rewriting the video. That keeps cost in the fractional cent band he quoted. Skips are client-side player commands, so latency depends on how often you poll and how aggressive thresholds are. The showcase clip on X shows the behavior; embed uses remote twimg like other directory videos. Prototype status means expect rough edges before you ship it to non-technical friends.",
    keyFeatures: [
      "Chrome extension with optional live audio path",
      "BYOK TypeSafe configuration",
      "Automatic playhead skip on sponsor detection",
      "Open source MIT JavaScript",
    ],
    stack: [
      "JavaScript",
      "Chrome extension APIs",
      "YouTube player hooks",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/trungdq88/youtube-sponsor-detection",
      docs: "https://github.com/trungdq88/youtube-sponsor-detection#readme",
      post: "https://x.com/tdinh_me/status/2100793777103466615",
      demo: "https://madewithjev.com/builds/youtube-sponsor-skipper",
    },
    pricingNote:
      "BYOK; author cites about half a cent per video on the launch post.",
    firstSeen: "2026-09-17",
    demoIds: ["youtube-sponsor-skipper-tdinh"],
    relatedSlugs: [
      "kraayenjon-ai-slop-detector",
      "classifier-dev",
      "moritzkremb-jev-voice-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does it upload audio to a custom backend?",
        answer:
          "The prototype is BYOK to TypeSafe per repo and author post. Read the extension permissions before installing.",
      },
      {
        question: "Will it skip non-sponsor CTAs?",
        answer:
          "Threshold tuning matters. Treat detections as probabilistic gates, not legal sponsorship disclosures.",
      },
      {
        question: "Is this an official YouTube feature?",
        answer:
          "No. It is a third-party open source experiment from Tony Dinh, unrelated to Google.",
      },
    ],
    metaTitle: "YouTube sponsor skipper: Jev detects paid segments",
    metaDescription:
      "trungdq88 youtube-sponsor-detection Chrome extension uses TypeSafe Jev on live captions or audio to skip sponsor blocks. MIT repo and X demo.",
  },

  "iannuttall-internal-links": {
    slug: "iannuttall-internal-links",
    status: "published",
    problem:
      "Internal linking audits devolve into spreadsheets no one updates, while blind LLM suggestions invent URLs that do not exist.",
    targetUser:
      "SEO-minded site owners and agent builders who want structured link recommendations for up to five hundred pages.",
    overview:
      "Ian Nuttall's free tool at ian.is/tools/internal-links crawls your site, uses Jev to classify pages and select sensible link pairs, then exports CSV or JSON for an LLM or editor to implement. Bring your own key or pay one dollar to run on Ian's TypeSafe credit. Launch clip on X walks through the export flow.",
    creator: {
      name: "Ian Nuttall",
      handle: "iannuttall",
      xUrl: "https://x.com/iannuttall",
      companyUrl: "https://ian.is",
    },
    jevUsage: {
      flowRole: "Page classification and pairwise internal link Choice across crawled URLs",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Crawl graph of up to five hundred URLs with titles, headings, and short text extracts per page.",
      decisionOut:
        "Typed labels per page plus selected source-to-target link pairs with scores suitable for CSV or JSON export.",
      flowSteps: [
        "User submits a site root and authentication options",
        "Crawler collects page text up to the five hundred page cap",
        "Jev classifies each page and scores candidate link pairs",
        "Exporter writes CSV or JSON for downstream implementation",
      ],
      sourcedMetrics: [
        {
          claim: "Tool supports up to five hundred pages per run per author post.",
          source: "x.com/iannuttall/status/2102443273339994558",
        },
        {
          claim: "Pricing is BYOK or one dollar to use Ian's key per the launch post.",
          source: "x.com/iannuttall/status/2102443273339994558",
        },
      ],
    },
    howJevIsUsed:
      "Ian keeps humans or coding agents in the loop: Jev does the judgment-heavy pairing work, but the artifact is a file you can diff, not mystery HTML injected live. Classification questions keep page types explicit so you do not link a pricing page into every blog footer by accident. The dollar tier is for folks who do not want to paste a TypeSafe key on day one. Showcase video is the X clip referenced on madewithjev.com/builds/internal-link-tool; playback uses the same remote twimg pattern as other listings.",
    keyFeatures: [
      "Up to five hundred pages per crawl",
      "CSV and JSON export for agent implementers",
      "BYOK or one dollar hosted key option",
      "Live tool at ian.is/tools/internal-links",
    ],
    stack: [
      "Web crawler",
      "TypeSafe Jev",
      "CSV and JSON exporters",
    ],
    links: {
      website: "https://ian.is/tools/internal-links",
      demo: "https://ian.is/tools/internal-links",
      post: "https://x.com/iannuttall/status/2102443273339994558",
    },
    pricingNote:
      "BYOK free path or one dollar per run on Ian's key per launch post.",
    firstSeen: "2026-09-22",
    demoIds: ["internal-links-iannuttall"],
    relatedSlugs: ["dub-co", "ploy-ai", "stealads-ai"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does the tool edit my site automatically?",
        answer:
          "No. It exports recommendations you or an LLM implement in your CMS or codebase.",
      },
      {
        question: "What happens above five hundred pages?",
        answer:
          "The author caps runs at five hundred pages per the launch materials. Split large sites or crawl sections separately.",
      },
      {
        question: "Do I need an API key?",
        answer:
          "You can bring your own TypeSafe key or pay one dollar to use Ian's for that run.",
      },
    ],
    metaTitle: "Internal links tool: Jev classifies and pairs site pages",
    metaDescription:
      "Ian Nuttall internal linking tool uses TypeSafe Jev on up to 500 crawled pages, exporting CSV or JSON link plans. BYOK or $1. X demo.",
  },

  "standardagents-jevpilot": {
    slug: "standardagents-jevpilot",
    status: "published",
    problem:
      "Driving agents that read pixels burn budget and latency, while toy sims ignore safety when models get creative near traffic.",
    targetUser:
      "Game and robotics curious developers who want a Three.js sandbox where Jev steers from symbolic path tables.",
    overview:
      "JevPilot (github.com/standardagents/jevpilot) is Justin Schroeder's browser driving game inspired by Tesla FSD visuals. Geometry, collision checks, and a hard safety brake stay in TypeScript; Jev reads compact candidate steering and speed paths, not camera frames, and answers up to about four times per second near traffic. Play at jevpilot.standardagents.ai with server-metered credit, or clone the MIT repo.",
    creator: {
      name: "Justin Schroeder",
      handle: "jpschroeder",
      xUrl: "https://x.com/jpschroeder",
      githubUrl: "https://github.com/jpschroeder",
      company: "Standard Agents",
      companyUrl: "https://standardagents.ai",
    },
    jevUsage: {
      flowRole: "High-frequency path Choice among filtered steering and speed candidates",
      primitives: ["Choice", "Score"],
      stateIn:
        "Symbolic road boundaries, nearby traffic summaries, signal state, destination bearing, and tables of eligible maneuver candidates.",
      decisionOut:
        "Selected path index consumed by the sim loop; single-candidate cases resolve locally without an API call.",
      flowSteps: [
        "Simulator samples steering and speed combinations each tick",
        "Code filters candidates that leave the road or collide",
        "Jev Choice picks among remaining paths (up to ~4 Hz near traffic)",
        "Safety brake overrides imminent collisions regardless of model output",
      ],
      sourcedMetrics: [
        {
          claim:
            "Author materials cite up to about four decisions per second near traffic and about 1.5 Hz on clear roads.",
          source: "madewithjev.com/builds/jevpilot and x.com/jpschroeder/status/2100347770867458384",
        },
        {
          claim:
            "Hosted demo meters about $0.25 of Jev credit server-side so API keys never reach the browser.",
          source: "madewithjev.com/builds/jevpilot",
        },
        {
          claim:
            "Public GitHub repo standardagents/jevpilot had about one hundred seventy nine stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Justin rebuilt the vibe of FSD as a teaching toy: the renderer is Three.js eye candy, but the agent loop is classic robotics factoring. Candidate paths are rows in a table; illegal rows never reach Jev; obvious singletons short-circuit locally. That is why the sim can breathe four decisions a second without sending pixels to a vision model. Press J to toggle autopilot in the hosted build. Credit metering on standardagents.ai keeps keys off the client, which matters when you hand the link to a classroom. The X clip is embedded here via remote twimg; README and build page carry the longer architecture narrative.",
    keyFeatures: [
      "Three.js driving sim with autopilot toggle",
      "Symbolic path tables instead of pixel inputs",
      "Code-level safety brake on imminent collisions",
      "Hosted demo with server-side credit metering",
    ],
    stack: [
      "TypeScript",
      "Three.js",
      "TypeSafe Jev",
      "Standard Agents auth for hosted demo",
    ],
    links: {
      repo: "https://github.com/standardagents/jevpilot",
      docs: "https://github.com/standardagents/jevpilot#readme",
      demo: "https://jevpilot.standardagents.ai",
      post: "https://x.com/jpschroeder/status/2100347770867458384",
    },
    pricingNote:
      "Open source repo; hosted demo includes about $0.25 metered Jev credit per build page notes.",
    firstSeen: "2026-09-16",
    demoIds: ["jevpilot-jpschroeder"],
    relatedSlugs: [
      "romanslack-jev-drone",
      "fhshaik-typesafe-mario",
      "browser-use-jev-ultrafast",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev see the canvas pixels?",
        answer:
          "No. Public materials describe compact tables of candidate paths and traffic summaries, not screenshots.",
      },
      {
        question: "Can the model override the safety brake?",
        answer:
          "Imminent collision handling is coded separately from Jev outputs per the build write-up.",
      },
      {
        question: "Is this a Tesla product?",
        answer:
          "No. It is an open source homage and teaching sim from Standard Agents, unaffiliated with Tesla.",
      },
    ],
    metaTitle: "JevPilot: symbolic path Choice in a Three.js driving sim",
    metaDescription:
      "standardagents JevPilot uses TypeSafe Jev on filtered steering tables in a Three.js FSD-style game. GitHub, hosted demo, and X clip.",
  },

  "tianyucodings-nanojev": {
    slug: "tianyucodings-nanojev",
    status: "published",
    problem:
      "Researchers want System One shaped decision heads on tiny backbones without paying hosted inference or decoding answer tokens from a chat model.",
    targetUser:
      "ML engineers reproducing parallel Choice, boolean, and Score heads who need a unified checkpoint, public dataset, and replayable game harnesses.",
    overview:
      "NanoJev (github.com/TianyuCodings/NanoJev) is Tianyu Codings' 0.6B Qwen3 backbone with shared decision heads for dynamic Choice (2 to 255 candidates), boolean propositions, and ordered Score levels. Each request supplies state, question, and candidates; one forward pass returns full probability vectors with zero output-token decoding. The unified-games-v1 Hugging Face release trains Maze, Snake, ViZDoom Basic, and ViZDoom Predict Position together; README tables compare held-out success rates against TypeSafe Jev and untuned Qwen3-0.6B on the same controllers. Public side-by-side replays and ViZDoom players live on nanojev-dev.tianyuchen99.chatgpt.site; model C-Tianyu/NanoJev and dataset C-Tianyu/NanoJev-Data pin revision unified-games-v1.",
    creator: {
      name: "Tianyu Codings",
      handle: "TianyuCodings",
      githubUrl: "https://github.com/TianyuCodings",
    },
    jevUsage: {
      flowRole:
        "Parallel game and simulation decisions from a single small checkpoint with shared Choice, boolean, and Score heads",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Per-step game observations encoded as text state plus runtime-defined questions and candidate action paths documented in NanoJev harnesses and dataset rows.",
      decisionOut:
        "Softmax over supplied candidates for Choice, sigmoid probability for boolean items, and weighted level distribution for Score without generating answer tokens.",
      flowSteps: [
        "Encode candidate paths through the Qwen3-0.6B backbone",
        "Apply shared decision heads for each question type in the batch",
        "Return probabilities for epsilon-greedy or argmax controllers",
        "Replay trajectories through independent simulators for evaluation",
      ],
      sourcedMetrics: [
        {
          claim:
            "README reports NanoJev 128/128 ViZDoom Basic test successes versus 56/128 for TypeSafe Jev on the matched harness.",
          source: "github.com/TianyuCodings/NanoJev README",
        },
        {
          claim:
            "Unified dataset ships 18,760 decision questions per target variant including 16,333 ViZDoom questions.",
          source: "github.com/TianyuCodings/NanoJev README",
        },
        {
          claim:
            "Public GitHub repo TianyuCodings/NanoJev had about two thousand one hundred eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "NanoJev is an open weight replica path, not a hosted classifier.dev substitute. Where SemIf targets general System One HTTP on models you pick, and Simple Jev wraps HF logits behind /v1/classifier, NanoJev trains decision heads directly on game-scale data and publishes the full pipeline plus HF weights. Agent builders can still steal the interface lesson: pack state once, ask many typed questions, threshold probabilities in code. Game demos are evidence that 0.6B parallel heads can beat untuned backbones and match or exceed published Jev scores on specific ViZDoom splits; treat leaderboard cells as research baselines until you rerun scripts locally.",
    keyFeatures: [
      "Unified-games-v1 checkpoint across four game tasks",
      "Hugging Face model and dataset with documented training mix weights",
      "Browser replays comparing NanoJev, TypeSafe Jev, and untuned Qwen",
      "End-to-end training and evaluation docs for Predict Position",
    ],
    stack: [
      "Python",
      "PyTorch",
      "Qwen3-0.6B",
      "Hugging Face Hub",
      "ViZDoom",
    ],
    links: {
      repo: "https://github.com/TianyuCodings/NanoJev",
      docs: "https://github.com/TianyuCodings/NanoJev#quick-start",
      demo: "https://nanojev-dev.tianyuchen99.chatgpt.site/?autoplay=1",
      website: "https://huggingface.co/C-Tianyu/NanoJev",
    },
    pricingNote:
      "MIT licensed open source; you pay for GPUs, Hugging Face bandwidth, and any cloud you rent for training or inference.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "theoleecj-semif",
      "featherless-simple-jev",
      "vinnylarouge-jevlike",
      "fhshaik-typesafe-mario",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is NanoJev the same as TypeSafe Jev?",
        answer:
          "No. It is an independent 0.6B research replica with public weights and game benchmarks. TypeSafe Jev remains the closed hosted System One model.",
      },
      {
        question: "How does it differ from SemIf or Simple Jev?",
        answer:
          "SemIf serves general open models with a System One shaped server. Simple Jev builds classifier HTTP from HF logits. NanoJev fine-tunes dedicated decision heads on a unified games dataset and publishes the training recipe.",
      },
      {
        question: "Which Hugging Face revision should I download?",
        answer:
          "Use revision unified-games-v1 on C-Tianyu/NanoJev and C-Tianyu/NanoJev-Data so weights and labels match the README demos.",
      },
    ],
    metaTitle: "NanoJev: 0.6B parallel Choice and Score heads for games",
    metaDescription:
      "TianyuCodings NanoJev trains Qwen3-0.6B decision heads on Maze, Snake, and ViZDoom. HF unified-games-v1, side-by-side demos, MIT repo.",
  },

  "bespokelabsai-nimble": {
    slug: "bespokelabsai-nimble",
    status: "published",
    problem:
      "Teams want locally runnable Jev-style classifiers with published data curation and training recipes, not opaque distillation from a hosted gate.",
    targetUser:
      "Applied researchers on Apple Silicon or NVIDIA who need Choice and boolean fields from a schema with probabilities, plus scripts to reproduce Bespoke-Nimble-9B.",
    overview:
      "Nimble (github.com/bespokelabsai/nimble) from Bespoke Labs ships contrastive data curation, LoRA training on answer tokens only, and serving for Bespoke-Nimble-9B on Hugging Face. You pass text plus a schema of Choice lists or true/false fields; the model scores one answer token per question in parallel without chain-of-thought prose. README reports 90.1% agreement with reference labels on 324 held-out examples versus 66.4% for the Qwen3.5-9B base and 93.2% for Jev 1.13.0, with explicit note that Bespoke did not distill from TypeSafe. September 2026 temperature fitting improves probability calibration while keeping discrete picks stable. Runs on Mac Metal or Linux CUDA with documented merge steps for LoRA adapters.",
    creator: {
      name: "Bespoke Labs",
      handle: "bespokelabsai",
      githubUrl: "https://github.com/bespokelabsai",
      company: "Bespoke Labs",
      companyUrl: "https://bespokelabs.ai",
    },
    jevUsage: {
      flowRole:
        "Local schema-driven Choice and Noul classification from merged 9B weights",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Prompt text up to 2,048 tokens including schema field names plus per-field candidate lists or boolean questions defined in nimble/scoring/parallel_schema.py.",
      decisionOut:
        "Selected option per field with normalized probabilities across supplied answers; no free-text completions.",
      flowSteps: [
        "Validate schema against model contract and prompt hash",
        "Encode prompt once per request",
        "Score allowed answer tokens in parallel for each schema field",
        "Return picks and probabilities for downstream thresholds",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cites 90.1% label match on 324 held-out examples for Bespoke-Nimble-9B versus 93.2% for Jev 1.13.0.",
          source: "github.com/bespokelabsai/nimble README",
        },
        {
          claim:
            "Training set documents 2,676 curated examples with open curation and training scripts in-repo.",
          source: "github.com/bespokelabsai/nimble README",
        },
        {
          claim:
            "Public GitHub repo bespokelabsai/nimble had about one thousand six hundred seventy eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Nimble is the teach-the-recipe counterpart to hosted Simple Jev or SemIf servers. Operators define explicit enums and booleans in code, call local inference, and treat probabilities as hints that still need domain calibration. The repo foregrounds data edits that flip labels under contrastive curation, which is rare in integration listings that only wrap API keys. Because fields cannot depend on each other, your orchestration layer must enforce cross-field consistency after Nimble returns independent answers. Pair with classifier.dev when you want managed latency without merging nine billion parameters on a laptop.",
    keyFeatures: [
      "Open data curation, training, and MLX or CUDA serving paths",
      "Hugging Face Bespoke-Nimble-9B with schema contract files",
      "Parallel answer-token scoring inspired by System One Choice docs",
      "Documented limits: text-only, max 26 enum strings per field",
    ],
    stack: [
      "Python",
      "PyTorch",
      "MLX on Apple Silicon",
      "LoRA on Qwen3.5-9B",
      "Hugging Face Hub",
    ],
    links: {
      repo: "https://github.com/bespokelabsai/nimble",
      docs: "https://github.com/bespokelabsai/nimble#methodology",
      website: "https://huggingface.co/bespokelabs/Bespoke-Nimble-9B",
    },
    pricingNote:
      "Open source recipe; you fund GPUs, RAM for merge steps, and any cloud training you run.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "featherless-simple-jev",
      "theoleecj-semif",
      "vinnylarouge-jevlike",
      "classifier-dev",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Did Bespoke distill from TypeSafe Jev?",
        answer:
          "README states they did not distill from Jev; the repo shares curation, training, and serving so others can research similar models.",
      },
      {
        question: "Which primitives does Nimble support?",
        answer:
          "Schema fields are Choice over explicit lists or boolean (Noul-style) questions. There is no free-form text or nested JSON output.",
      },
      {
        question: "Can I trust default probabilities in production?",
        answer:
          "README warns probabilities are calibrated on their curated set and still need threshold tuning on your data, especially when no supplied answer fits.",
      },
    ],
    metaTitle: "Bespoke Nimble: open data and 9B local Choice classifier",
    metaDescription:
      "bespokelabsai/nimble publishes curation, LoRA training, and MLX or CUDA serving for Bespoke-Nimble-9B. Choice and Noul from schema, not chat JSON.",
  },

  "miuuyy-astra-ares": {
    slug: "miuuyy-astra-ares",
    status: "published",
    problem:
      "Codex sessions on GPT-6 Astra, Sol, or Luna often burn tokens on high reasoning effort for trivial next steps.",
    targetUser:
      "Power users running a patched Codex CLI who want mid-task reasoning effort changes without swapping models or invalidating prompt cache prefixes.",
    overview:
      "Astra-Ares (github.com/miuuyy/Astra-Ares) is miuuyy's experimental bridge that installs a separate pinned Codex build, then asks Jev before each eligible generation how hard the next step looks and how many generations that effort should cover. Jev reads bounded task context (recent tool results, public progress, retained user goals) and returns choices mapped to native GPT-6 reasoning effort plus a lease of 1, 2, 5, or 10 generations. Codex applies settings through OpenAI's configuration_update path so prompt prefixes stay cache-friendly. OpenRouter is the default Jev provider on fresh installs; transcript lines show APPLIED when native effort changes stick. README labels the project a reference implementation, not a polished daily driver.",
    creator: {
      name: "miuuyy",
      handle: "miuuyy",
      githubUrl: "https://github.com/miuuyy",
    },
    jevUsage: {
      flowRole:
        "Mid-run reasoning effort and lease duration routing inside patched Codex generations",
      primitives: ["Choice", "Score"],
      stateIn:
        "Evaluator packet with original task, public plans, last six tool call pairs, and truncated tool results under documented token guards (not the full encrypted reasoning stream).",
      decisionOut:
        "Selected reasoning effort tier and generation lease count applied natively before the next model generation.",
      flowSteps: [
        "Detect checkpoint when a new generation is due and lease expired or context changed",
        "Send bounded state to configured Jev provider (OpenRouter default)",
        "Map Jev choices to Codex native effort settings",
        "Hold effort across leased generations without extra Jev calls until lease ends or user interrupts",
      ],
      sourcedMetrics: [
        {
          claim:
            "Example transcript in README shows a Jev decision in about 321 ms with a two-generation lease.",
          source: "github.com/miuuyy/Astra-Ares README",
        },
        {
          claim:
            "Evaluator context caps recent tool results at 1,000 local tokens each and 28,000 tokens overall per configuration docs.",
          source: "github.com/miuuyy/Astra-Ares docs/configuration.md",
        },
        {
          claim:
            "Public GitHub repo miuuyy/Astra-Ares had about two hundred thirty two stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Ares is model routing by reasoning depth, not by vendor swap. Hermes skill packs might pick which model answers; Ares keeps Astra, Sol, or Luna fixed and only moves effort up or down based on what Jev thinks the next step needs. That matches TypeSafe's pitch that structured decisions belong on the hot path while the big model writes code. Failures are explicit: README promises no silent provider fallback and logs decisions under ~/.local/share/astra-ares/runs. Treat leases as a cost knob: ten-generation leases amortize Jev latency, but tool failures force a fresh assessment.",
    keyFeatures: [
      "Pinned Codex patch with npm run setup build pipeline",
      "Native GPT-6 effort changes with prefix-preserving cache story",
      "ares doctor and --probe for local config plus billable Jev ping",
      "Separate Ares Codex profiles without touching stock codex binary",
    ],
    stack: [
      "TypeScript",
      "Node.js 22+",
      "Patched Codex CLI",
      "OpenRouter or other Jev providers",
      "Rust toolchain for Codex build",
    ],
    links: {
      repo: "https://github.com/miuuyy/Astra-Ares",
      docs: "https://github.com/miuuyy/Astra-Ares/blob/main/docs/architecture.md",
    },
    pricingNote:
      "MIT bridge plus Apache-2.0 patched Codex sources; Jev calls bill through your configured provider, Codex usage bills through OpenAI as usual.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "gargpratyush-jev-router",
      "kerpopule-hermes-jev-skills",
      "typesafe-ai-skills",
      "vercel-labs-ai-cli",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does this replace my normal codex command?",
        answer:
          "No. Setup installs a separate binary and profiles. Your existing Codex install stays untouched per README installation notes.",
      },
      {
        question: "Which Jev provider works out of the box?",
        answer:
          "OpenRouter is default after ares configure. Other providers are documented under docs/configuration.md with explicit env vars.",
      },
      {
        question: "Is it production ready?",
        answer:
          "README marks Astra-Ares as an experimental reference for adaptive reasoning effort, primarily for integrators experimenting with GPT-6 native effort APIs.",
      },
    ],
    metaTitle: "Astra-Ares: Jev picks Codex GPT-6 reasoning effort mid-task",
    metaDescription:
      "miuuyy Astra-Ares patches Codex so Jev sets reasoning effort and generation leases on Astra, Sol, and Luna. OpenRouter default, MIT repo.",
  },

  "coldteadotai-abide": {
    slug: "coldteadotai-abide",
    status: "published",
    problem:
      "AGENTS.md and CLAUDE.md rules are too semantic for linters, so coding agents break style constraints from the first edit.",
    targetUser:
      "Teams on Claude Code, Codex, or OpenCode who want every edit checked against a compiled rubric without paying chat-model prices per hunk.",
    overview:
      "Abide (github.com/coldteadotai/abide) from Cold Tea hooks into Claude Code, Codex, and OpenCode to enforce project instruction files. On each edit or turn it sends Jev one typed question per compiled rule with the rule text and diff snippet, never the full chat log. Probabilities above 0.8 trigger an in-session repair message naming the rule and source line; mid-band scores surface notes without blocking. README replay benchmark on 93 Claude Code sessions reports about one in thirteen turns breaking a rule, with Jev checks around 300 ms and roughly a tenth of a cent per turn on measured replays. npm package @coldtea/abide stores keys locally; abide audit judges existing trees for preflight reports.",
    creator: {
      name: "Cold Tea",
      handle: "coldteadotai",
      githubUrl: "https://github.com/coldteadotai",
      companyUrl: "https://coldtea.ai",
    },
    jevUsage: {
      flowRole:
        "Per-rule guardrail Noul-style probability on each edit or end-of-turn diff against compiled rubric JSON",
      primitives: ["Noul", "Score"],
      stateIn:
        "Single rule quote plus scoped file diff or aggregated turn diff; conversation history excluded by design.",
      decisionOut:
        "Calibrated violation probability per rule ID with banded actions (repair, note, or ignore).",
      flowSteps: [
        "Compile AGENTS.md, CLAUDE.md, and related files into .abide/rubric.json",
        "On hook fire, batch one Jev question per applicable rule for the diff",
        "Threshold probabilities into repair, note, or silent paths",
        "Append repair instructions to tool results or turn follow-ups for the agent",
      ],
      sourcedMetrics: [
        {
          claim:
            "Replay benchmark README cites about 300 ms per check and roughly a tenth of a cent per turn on 93 sessions.",
          source: "github.com/coldteadotai/abide benchmarks/replay",
        },
        {
          claim:
            "Measured replay found Jev flagged 39 edits and 15 turns with independent reviewer confirmation on subsets.",
          source: "github.com/coldteadotai/abide README",
        },
        {
          claim:
            "Public GitHub repo coldteadotai/abide had about two hundred eleven stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Abide is the guardrail mirror to Hermes approvals or jev-review dashboards: instead of scoring whole PRs for humans, it sits on the agent hot path and asks cheap boolean-style questions per rule. That only works because Jev returns probabilities, not essays you must parse. Linters still own mechanically checkable rules; Abide skips duplicating ESLint. calibrate and tune commands close the loop when a rule never fires or fires everywhere. Keys stay in ~/.abide/.env or repo-local env files; README states Cold Tea does not receive your diffs on their servers.",
    keyFeatures: [
      "Hooks for Claude Code, Codex apply_patch, and OpenCode plugin mode",
      "Committed rubric.json mapping rules to instruction line citations",
      "abide audit and check for batch or pre-commit sweeps",
      "Replay, calibrate, and tune tooling with JSON output flags",
    ],
    stack: [
      "TypeScript",
      "npm CLI",
      "TypeSafe or Vercel AI Gateway keys",
      "Agent hook APIs",
    ],
    links: {
      repo: "https://github.com/coldteadotai/abide",
      docs: "https://github.com/coldteadotai/abide#commands",
      website: "https://www.npmjs.com/package/@coldtea/abide",
    },
    pricingNote:
      "Open source MIT; Jev or gateway usage billed per your key with README-measured sub-cent per edit checks.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "anpicasso-hermes-jev-approvals",
      "devagrawal09-jev-review",
      "typesafe-ai-skills",
      "dicklesworthstone-skillranker",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Abide send my chat log to Jev?",
        answer:
          "README states Jev sees the rule and diff only, not the conversation, so late edits get the same scrutiny as early ones.",
      },
      {
        question: "Which agents are supported?",
        answer:
          "Claude Code settings, Codex hooks (accept the four entries once), and OpenCode plugin installs documented in README tables.",
      },
      {
        question: "What happens at 0.86 probability?",
        answer:
          "Scores at or above 0.8 trigger a repair message with rule id and instruction quote; 0.5 to 0.8 is note-only per README bands.",
      },
    ],
    metaTitle: "Abide: Jev guardrails on every agent edit",
    metaDescription:
      "coldteadotai/abide hooks Claude Code, Codex, and OpenCode to ask Jev per AGENTS.md rule on each diff. ~300 ms checks, MIT npm CLI.",
  },

  "sdras-jev-webmcp-extension": {
    slug: "sdras-jev-webmcp-extension",
    status: "published",
    problem:
      "WebMCP pages expose many typed tools, but natural-language commands need reliable tool and argument selection without site-specific prompt hacks.",
    targetUser:
      "Frontend and agent builders experimenting with Chrome WebMCP who want Jev Choice and Noul batches mapped from JSON Schema at typing speed.",
    overview:
      "jev-webmcp-extension (github.com/sdras/jev-webmcp-extension) is Sarah Drasner's Apache-2.0 Chrome side panel. It discovers tools a page registers, converts each schema field into parallel Jev questions (tool Choice plus per-argument Choice, Noul, or span picks from the user's words), and decodes answers into executable calls with confidence and latency labels. Manifest screening runs Noul checks on tool descriptions for agent-directed instructions; execution policy respects readOnlyHint, consequential annotations, and double-Enter confirmations. No build step: load unpacked on Chrome 149+ with WebMCP enabled. Chrome Web Store listing and Basketful demo walkthrough ship in README; eval harness hits the real TypeSafe API when TYPESAFE_API_KEY is set.",
    creator: {
      name: "Sarah Drasner",
      handle: "sdras",
      githubUrl: "https://github.com/sdras",
      xUrl: "https://x.com/sdras",
    },
    jevUsage: {
      flowRole:
        "Side-panel tool routing and argument filling from schema-derived Jev question batches",
      primitives: ["Choice", "Noul"],
      stateIn:
        "User utterance plus discovered tool manifests converted to questions in src/core/questions.js (tool list Choice, enum booleans, optional-field nouls, span Choices for free text).",
      decisionOut:
        "Selected tool name, argument object, confidence score, and policy state (auto, confirm, or none).",
      flowSteps: [
        "Discover tools via page bridge and screen manifest text",
        "Build parallel Jev questions and decode plan for the utterance",
        "Call api.typesafe.ai/v1/systemone through extension storage key",
        "Apply policy.js gates before chrome.scripting executes pageCallTool",
      ],
      sourcedMetrics: [
        {
          claim:
            "README example shows search_products at 98% confidence in 164 ms on Basketful demo input.",
          source: "github.com/sdras/jev-webmcp-extension README",
        },
        {
          claim:
            "Public GitHub repo sdras/jev-webmcp-extension had about one hundred nine stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Drasner's extension is the browser-local counterpart to server-side Browser Use loops: instead of pixels, Jev chooses among declared tools and fills args using the user's own words as candidate spans. That keeps latency in the hundreds of milliseconds for read-only calls while still forcing confirmations on checkout flows. Core logic lives in pure JavaScript modules tested without Chrome so question wording tweaks are safe to iterate. Tool results stay out of model input per security README, which matters when pages are untrusted. Pair with typesafe-ai-typesafe-sdk-js when you graduate from the panel to a hosted agent backend.",
    keyFeatures: [
      "Schema-to-question converter with npm test coverage",
      "Per-site optional_host_permissions and manifest screening badges",
      "Keyboard navigation through tool candidates with Enter to execute",
      "Open in playground link for debugging System One requests",
    ],
    stack: [
      "JavaScript",
      "Chrome extension APIs",
      "WebMCP",
      "TypeSafe System One HTTP",
    ],
    links: {
      repo: "https://github.com/sdras/jev-webmcp-extension",
      docs: "https://github.com/sdras/jev-webmcp-extension#demo-walkthrough",
      demo: "https://shopping-webmcp-demo.netlify.app/",
      website:
        "https://chromewebstore.google.com/detail/jev-%C3%97-webmcp/gglnhcbhjfbmcpgccnmolbhejloflgkb",
    },
    pricingNote:
      "Free extension; TypeSafe API keys bill per System One request when not using harness mocks.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "typesafe-ai-typesafe-sdk-js",
      "typesafe-ai-skills",
      "lahfir-agent-desktop",
    ],
    relatedLearnSlugs: ["system-one", "use-cases"],
    faq: [
      {
        question: "Do I need WebMCP enabled?",
        answer:
          "README requires Chrome 149+ with WebMCP via origin trial or chrome://flags/#enable-webmcp-testing before tools appear.",
      },
      {
        question: "Can any site auto-run destructive tools?",
        answer:
          "Policy treats tools as state-changing unless readOnlyHint is set; consequential annotations always need a second Enter per README safety section.",
      },
      {
        question: "Where is the TypeSafe key stored?",
        answer:
          "Panel settings save the key in chrome.storage.local after a live API check per setup steps.",
      },
    ],
    metaTitle: "Jev WebMCP extension: typed tool picks in Chrome",
    metaDescription:
      "sdras jev-webmcp-extension maps WebMCP schemas to Jev Choice and Noul batches, screens manifests, then confirms before it runs. GitHub and Chrome Web Store.",
  },

  "jev-chat-jev-chat-jarvis": {
    slug: "jev-chat-jev-chat-jarvis",
    status: "published",
    problem:
      "Mobile chat apps bury you in threads where a blunt autocomplete draft is worse than no help, especially when tone, intent, and scam risk all matter at once.",
    targetUser:
      "Android users who want a co-pilot overlay on QQ, X DMs, or Lark without hooking chat apps or giving up send control.",
    overview:
      "jev-chat-jarvis (github.com/jev-chat/jev-chat-jarvis, chatjevs.com) is an Android 11+ accessibility overlay that reads only what is already on screen, runs a judge pass for intent, danger, and reply urgency, then drafts three ranked reply candidates you paste into the input box yourself. It never auto-sends and skips transfers or red packets. QQ and X are verified on device; Lark uses accessibility bounds plus on-device ML Kit OCR when message text is not in the AX tree. WeChat Android support stopped at 1.4 because newer builds hide message text from ordinary accessibility. Desktop siblings jev-chat-mac and jev-chat-windows share the same kernel with different capture paths.",
    creator: {
      name: "jev-chat",
      githubUrl: "https://github.com/jev-chat",
      company: "jev-chat",
      companyUrl: "https://chatjevs.com",
    },
    jevUsage: {
      flowRole:
        "Pre-reply judgment on visible thread text, then reply drafting gated on judge outputs",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Recent on-screen messages, session title, optional local knowledge notes and contact profile hits from on-device storage (README analysis section).",
      decisionOut:
        "Intent summary, danger level on a 1 to 9 rubric, should-reply-now signal, best-action Choice, then three candidate replies ranked by fit Score.",
      flowSteps: [
        "Accessibility or OCR capture builds a text state snapshot",
        "Judge model returns intent, danger, urgency, and action in about one second per README",
        "Reply model drafts three candidates; judge re-ranks with proportion scores",
        "User taps fill or copy; ACTION_SET_TEXT or clipboard only, never send",
      ],
      sourcedMetrics: [
        {
          claim:
            "Judge pass documents about one second latency with confidence on intent and danger outputs.",
          source: "github.com/jev-chat/jev-chat-jarvis README",
        },
        {
          claim:
            "Public GitHub repo jev-chat/jev-chat-jarvis had 5214 stars and 1009 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "Release APK jev-assistant-v1.4 targets Android 11 plus with signed builds in apk/ and GitHub Releases.",
          source: "github.com/jev-chat/jev-chat-jarvis README",
        },
      ],
    },
    howJevIsUsed:
      "The product splits judgment from generation on purpose: the judge route can point at TypeSafe Jev, OpenRouter, or vendor presets such as the documented Bocha Jev endpoint, while reply and vision routes stay independently configurable. That keeps intent and danger nouls on a fast structured path before any chat model writes casual text. Local notes and contact aliases inject only when tags or titles match, so replies stay consistent with your own facts without shipping a full cloud memory product. The overlay model is the opposite of bot APIs: no package hooks, no database reads, only what you already see. jev-chat-jev-chat-windows is the thick listing for the PyQt OCR desktop port.",
    keyFeatures: [
      "Floating panel with danger, intent, and three ranked replies",
      "Fill input only; no auto-send or payment actions",
      "QQ, X, and Lark paths documented with OCR fallback",
      "Local knowledge base and optional on-device chat history",
      "Separate judge, reply, and vision API cards with connectivity tests",
    ],
    stack: [
      "Android Kotlin",
      "Accessibility services",
      "ML Kit OCR",
      "TypeSafe or OpenRouter judge routes",
    ],
    links: {
      website: "https://chatjevs.com",
      repo: "https://github.com/jev-chat/jev-chat-jarvis",
      docs: "https://github.com/jev-chat/jev-chat-jarvis#为什么用它",
      demo: "https://github.com/jev-chat/jev-chat-jarvis/releases",
    },
    pricingNote:
      "Open source client; you bring API keys for judge, reply, and vision providers per README.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "jev-chat-jev-chat-windows",
      "sdras-jev-webmcp-extension",
      "avec-ai",
      "classifier-dev",
    ],
    relatedLearnSlugs: ["use-cases", "primitives"],
    faq: [
      {
        question: "Does the app send messages for me?",
        answer:
          "No. README states the tool only fills the input box or copies to clipboard and never triggers send, transfers, or red packets.",
      },
      {
        question: "Does it read WeChat on Android?",
        answer:
          "WeChat support stopped at version 1.4 because recent WeChat builds hide message text from standard accessibility and may block screenshots.",
      },
      {
        question: "Where do judge probabilities live?",
        answer:
          "Configure the judge card for TypeSafe-compatible endpoints or OpenRouter. Reply ranking uses the same judge route to sort three drafts.",
      },
    ],
    metaTitle: "Jev Chat Jarvis: judge-first Android chat co-pilot",
    metaDescription:
      "jev-chat-jarvis reads on-screen QQ, X, and Lark threads, judges intent and danger, ranks 3 replies, and fills text without auto-send. chatjevs.com.",
  },

  "sac-y-jev-cu": {
    slug: "sac-y-jev-cu",
    status: "published",
    problem:
      "Computer-use loops that ship screenshots to a judge model on every step are slow, leaky, and hard to gate when delete or pay actions appear.",
    targetUser:
      "Codex desktop users who want a text-only Jev Choice layer over accessibility candidates with dry-run defaults and explicit confirm on risky ops.",
    overview:
      "Jev-cu (github.com/Sac-Y/Jev-cu) is Sac's Codex skill plus Node scripts that pair Codex Computer Use drivers with TypeSafe Jev decisions over accessibility text lists only. Each step Jev picks element, action, completion, and risk from numbered candidates; the CUA runtime executes clicks and typing. Screenshots never go to Jev. Default runs use dryRun true; policy.mjs stops delete, send, pay, auth, upload, captcha, install, and settings paths at confirm until a human approves.",
    creator: {
      name: "Sac",
      handle: "Saccc_c",
      xUrl: "https://x.com/Saccc_c",
      githubUrl: "https://github.com/Sac-Y",
    },
    jevUsage: {
      flowRole:
        "Per-step computer-use Choice and risk gates over AX text candidates inside Codex cua_repl",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Accessibility snapshots serialized as text candidate tables per fixtures/ and loop.mjs (not pixels).",
      decisionOut:
        "Next element and action Choice, task completion Score or noul, and risk classification that policy.mjs maps to auto, confirm, or block.",
      flowSteps: [
        "npm run install-skill copies skill/jev-cu into ~/.codex/skills with repo path substitution",
        "runTask in cua_repl calls Jev with English goals for best calibration per README",
        "policy.mjs enforces app allowlists and sensitive op confirm",
        "Offline npm run p0 evaluates element pick accuracy on AX fixtures",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states Jev sees interface text only; screenshots are not sent to the judge model.",
          source: "github.com/Sac-Y/Jev-cu README",
        },
        {
          claim:
            "Public GitHub repo Sac-Y/Jev-cu had 587 stars and 59 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "Sensitive operations including delete, send, and pay default to confirm in policy.mjs with dry-run as the default loop mode.",
          source: "github.com/Sac-Y/Jev-cu README security section",
        },
      ],
    },
    howJevIsUsed:
      "Sac splits responsibilities the way awlevin-typesafe-computer-use does on macOS: deterministic capture builds a finite menu, Jev chooses among typed options, and only the executor touches the UI. The difference is packaging for Codex CUA repl instead of a Python clicker CLI, and an explicit skill install path for agent operators. Compare lahfir-agent-desktop when you want Rust snapshot refs without Codex; compare awlevin when you want OCR plus macOS accessibility in one repo. Jev-cu is the Codex-native, text-only judge slice.",
    keyFeatures: [
      "Codex skill with install and uninstall npm scripts",
      "runTask loop with dryRun and maxSteps controls",
      "policy.mjs app allowlist and sensitive op confirm",
      "Offline P0 AX fixture eval with npm run p0",
      "MIT licensed scripts and tests",
    ],
    stack: [
      "Node.js ESM",
      "Codex Computer Use driver",
      "TypeSafe System One",
      "Accessibility snapshots",
    ],
    links: {
      repo: "https://github.com/Sac-Y/Jev-cu",
      docs: "https://github.com/Sac-Y/Jev-cu#使用",
    },
    pricingNote:
      "Open source; TypeSafe API key via .env.local or TYPESAFE_API_KEY per README.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "awlevin-typesafe-computer-use",
      "lahfir-agent-desktop",
      "browser-use-jev-ultrafast",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev see my screen pixels?",
        answer:
          "No. README emphasizes text-only candidates from accessibility snapshots; Codex CUA reads the UI separately.",
      },
      {
        question: "How is this different from typesafe-computer-use?",
        answer:
          "awlevin/typesafe-computer-use is a macOS Python clicker with OCR. Jev-cu is a Codex skill plus policy layer over CUA with AX text fed to Jev.",
      },
      {
        question: "Can it run without Codex desktop?",
        answer:
          "The documented hot path imports runTask inside Codex cua_repl. Tests and p0 fixtures run offline without live UI per README.",
      },
    ],
    metaTitle: "Jev-cu: text-only Jev steps for Codex Computer Use",
    metaDescription:
      "Sac-Y/Jev-cu routes AX text through Jev Choice with dry-run defaults and confirm gates. Distinct from awlevin and lahfir desktop listings.",
  },

  "jkudish-jev-mcp": {
    slug: "jkudish-jev-mcp",
    status: "published",
    problem:
      "Agents skip cheap verification, rerank, and gate steps because calling a frontier model on every page or claim is too slow and too expensive.",
    targetUser:
      "Claude Code, Codex, OpenCode, and other MCP hosts that want ten typed Jev tools with explicit schemas instead of ad hoc evaluate HTTP.",
    overview:
      "jev-mcp (github.com/jkudish/jev-mcp, npm @jkudish/jev-mcp) exposes ten MCP tools backed by TypeSafe Jev: jev_verify, jev_screen, jev_find, jev_rerank, jev_classify, jev_decide, jev_compare, jev_extract, jev_review, and jev_gate. README positions each call at roughly 150 to 500 ms for a fraction of a cent, returning probabilities and confidence instead of prose essays. Install with npx -y @jkudish/jev-mcp and register the server in your MCP client; pass TYPESAFE_API_KEY explicitly when the host strips environment variables.",
    creator: {
      name: "Joey Kudish",
      handle: "jkudish",
      xUrl: "https://x.com/jkudish",
      githubUrl: "https://github.com/jkudish",
      companyUrl: "https://jkudish.com",
    },
    jevUsage: {
      flowRole:
        "MCP tool transport for parallel verify, screen, find, rerank, classify, decide, compare, extract, review, and gate judgments",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Tool JSON payloads: claims with evidence text, candidate lists, label sets, diffs, or patch plus completion claims per tool schema in README.",
      decisionOut:
        "Typed verdicts, ranked lists, label probabilities, field extractions, or combined patch review plus completion gate scores with confidence and suggested actions.",
      flowSteps: [
        "Agent registers npx -y @jkudish/jev-mcp as a local MCP server",
        "Each tool maps to one focused System One question batch",
        "Agent thresholds probabilities in code instead of parsing chat",
        "jev_gate merges patch review with completion claim verification in one call",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cites roughly 150 to 500 ms latency and fractional cent cost per judgment call.",
          source: "github.com/jkudish/jev-mcp README",
        },
        {
          claim:
            "Public GitHub repo jkudish/jev-mcp had 316 stars and 34 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "Package name @jkudish/jev-mcp on npm with server command npx -y @jkudish/jev-mcp documented for multiple MCP clients.",
          source: "github.com/jkudish/jev-mcp README install section",
        },
      ],
    },
    howJevIsUsed:
      "Joey packages the boring agent checks as first-class tools so hosts can call them on every retrieval page, inbox row, or PR hunk without spinning up a separate microservice. jev_verify and jev_screen cover claim and prompt-injection hygiene; jev_find and jev_rerank replace embedding maintenance for many workflows; jev_review and jev_gate mirror staged code review patterns documented elsewhere in this directory but as drop-in MCP calls. classifier-dev-mcp remains the path when you want hosted classify_texts on classifier.dev rather than general judgment tools on your key.",
    keyFeatures: [
      "Ten documented MCP tools with JSON examples",
      "Node.js 20 plus and TypeSafe API key",
      "Install snippets for Claude Code, Codex, OpenCode, and Amp",
      "Agent-install prompt block in README for guided setup",
      "MIT licensed TypeScript server with CI badge",
    ],
    stack: ["TypeScript", "MCP", "Node.js 20+", "TypeSafe System One"],
    links: {
      website: "https://www.npmjs.com/package/@jkudish/jev-mcp",
      repo: "https://github.com/jkudish/jev-mcp",
      docs: "https://github.com/jkudish/jev-mcp#the-tools",
    },
    pricingNote:
      "Open source server; TypeSafe usage billed per README latency class on your API key.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "classifier-dev-mcp",
      "kerpopule-hermes-jev-skills",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["jev-typesafe", "use-cases"],
    faq: [
      {
        question: "How is jev-mcp different from classifier.dev MCP?",
        answer:
          "classifier-dev-mcp wraps hosted classify_texts on classifier.dev. jkudish/jev-mcp ships general verify, rerank, gate, and review tools on your TypeSafe key.",
      },
      {
        question: "Why does my client say the API key is missing?",
        answer:
          "README warns some MCP hosts filter environment variables. Pass TYPESAFE_API_KEY in the server env block explicitly.",
      },
      {
        question: "Is jev_gate the same as jev_review?",
        answer:
          "jev_review scores a diff against rubric dimensions. jev_gate combines patch review with verification of completion claims in one tool per README.",
      },
    ],
    metaTitle: "jkudish jev-mcp: ten typed Jev tools over MCP",
    metaDescription:
      "Joey Kudish @jkudish/jev-mcp npm package exposes verify, screen, rerank, classify, review, and gate MCP tools on TypeSafe Jev with README latency notes.",
  },

  "dbreunig-building-with-jev-skill": {
    slug: "dbreunig-building-with-jev-skill",
    status: "published",
    problem:
      "Teams new to System One keep stuffing multi-factor questions into one prompt and then wonder why thresholds feel random in production.",
    targetUser:
      "Claude Code, Codex, and Cursor users who want a maintained skill that teaches Choice, Score, and Noul design for jev-1.13.",
    overview:
      "building-with-jev-skill (github.com/dbreunig/building-with-jev-skill) is Drew Breunig's agent skill for writing programs that call Jev well: state shape, single-factor questions, composing answers in TypeScript or Python, confidence thresholds, and debugging low-confidence failures. Content lives in skills/jev/SKILL.md and targets jev-1.13. Install via Claude Code marketplace plugin jev@building-with-jev, npx skills add dbreunig/building-with-jev-skill, or manual copy into ~/.claude/skills/jev.",
    creator: {
      name: "Drew Breunig",
      handle: "dbreunig",
      xUrl: "https://x.com/dbreunig",
      githubUrl: "https://github.com/dbreunig",
      companyUrl: "https://www.dbreunig.com/",
    },
    jevUsage: {
      flowRole:
        "Pedagogical skill invoked on Jev integration tasks; not a runtime gate itself",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "SKILL.md patterns for structuring state text and splitting questions documented against TypeSafe docs links in the repo.",
      decisionOut:
        "Teaches how to read probability vectors and set thresholds in application code rather than in model prose.",
      flowSteps: [
        "Install skill via plugin, skills CLI, or manual copy",
        "Claude loads SKILL.md when tasks mention Jev or TypeSafe questions",
        "Invoke explicitly with /jev when you want the rubric on demand",
        "SKILL.md references specific docs.typesafe.ai pages for primitives",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states the skill targets jev-1.13 and covers question design, state structure, thresholds, and diagnosis.",
          source: "github.com/dbreunig/building-with-jev-skill README",
        },
        {
          claim:
            "Public GitHub repo dbreunig/building-with-jev-skill had 131 stars and 5 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "skills/jev/SKILL.md is the canonical skill body with install paths for Claude Code plugin and vercel-labs skills CLI.",
          source: "github.com/dbreunig/building-with-jev-skill README",
        },
      ],
    },
    howJevIsUsed:
      "This repo is meta tooling: it does not call Jev on your traffic by itself. Instead it trains whichever agent is coding your integration to stop asking should we proceed style chat prompts and start asking decomposed nouls and Choices with testable thresholds. Pair it with kerpopule-hermes-jev-skills when you want runtime routing skills, or devagrawal09-jev-review when you want a staged review dashboard. The value is consistent question grammar across teammates who might otherwise copy brittle examples from random gists.",
    keyFeatures: [
      "SKILL.md focused on System One question design",
      "Claude Code plugin marketplace install path",
      "npx skills add for Codex, Cursor, and other agents",
      "Manual copy instructions for ~/.claude/skills/jev",
      "Sources cite docs.typesafe.ai pages inside SKILL.md",
    ],
    stack: [
      "Agent skills format",
      "Claude Code plugins",
      "vercel-labs skills CLI",
    ],
    links: {
      repo: "https://github.com/dbreunig/building-with-jev-skill",
      docs: "https://github.com/dbreunig/building-with-jev-skill/blob/main/skills/jev/SKILL.md",
      website: "https://www.dbreunig.com/",
    },
    pricingNote:
      "Open source skill; TypeSafe usage depends on the apps you build after reading it.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "kerpopule-hermes-jev-skills",
      "classifier-dev",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["primitives", "patterns", "jev-typesafe"],
    faq: [
      {
        question: "Does this skill call Jev for me?",
        answer:
          "No. It teaches how to write calls. Your application or agent runtime still needs a TypeSafe key for live inference.",
      },
      {
        question: "Which Jev version does it target?",
        answer:
          "README and SKILL.md target jev-1.13. Check SKILL.md when TypeSafe ships newer model notes.",
      },
      {
        question: "How do I invoke it in Claude Code?",
        answer:
          "Install the jev@building-with-jev plugin or copy skills/jev manually, then use /jev or let Claude auto-load on Jev tasks per README.",
      },
    ],
    metaTitle: "building-with-jev-skill: Drew Breunig question design",
    metaDescription:
      "dbreunig/building-with-jev-skill SKILL.md teaches Choice, Score, Noul, state, and thresholds for jev-1.13. Claude plugin and skills CLI install.",
  },

  "y0usaf-pi-jev": {
    slug: "y0usaf-pi-jev",
    status: "published",
    problem:
      "Pi agents can run destructive bash, exfiltrate secrets, or wander off-scope before you notice, and regex guards miss paraphrased risk.",
    targetUser:
      "Pi coding agent users who want measured Noul and Score gates on bash, write, and edit plus optional output judging on bash results.",
    overview:
      "pi-jev (github.com/y0usaf/pi-jev, npm @y0usaf/pi-jev) is Sami Ansari's Pi extension that batches four gate nouls and an impact Score on bash, write, and edit calls, judges bash output for leaks and failure class, and exposes a jev_ask tool for typed questions the model requests. Shadow mode is default: flagged calls notify without blocking until you switch to enforce. README documents fail-open behavior on missing keys, timeouts, 429s, and malformed responses so tool calls proceed when Jev is unavailable.",
    creator: {
      name: "Sami Ansari",
      handle: "realy0usaf",
      githubUrl: "https://github.com/y0usaf",
    },
    jevUsage: {
      flowRole:
        "Pre-tool gate on bash, write, and edit; post-tool output judge on bash; optional jev_ask for model-initiated judgments",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Working directory, tool name, truncated arguments, last user message slice, and bash stdout snippets per README privacy section.",
      decisionOut:
        "Gate: destructive, exfiltration, beyond_scope nouls plus impact Score against documented blockOn thresholds. Output: leaks_secret noul and failure_class Choice with appended advice strings.",
      flowSteps: [
        "pi install npm:@y0usaf/pi-jev loads extension with shadow gate default",
        "Four gate questions plus impact Score in one request (~300 ms README)",
        "tool_result hook runs leak and failure_class questions on bash output",
        "jev_ask accepts structured state plus question arrays for custom nouls and Choices",
      ],
      sourcedMetrics: [
        {
          claim:
            "Gate batches four nouls and impact Score in one request for about 300 ms instead of four round trips per README.",
          source: "github.com/y0usaf/pi-jev README",
        },
        {
          claim:
            "Shadow mode is default; enforce mode prompts unless headless runs where gate.blockWithoutUI applies per README.",
          source: "github.com/y0usaf/pi-jev README",
        },
        {
          claim:
            "Every error path fails open: missing key, timeout, 429, or malformed response lets the tool call proceed with throttled error reporting.",
          source: "github.com/y0usaf/pi-jev README",
        },
        {
          claim:
            "Public GitHub repo y0usaf/pi-jev had 141 stars and 9 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "y0usaf treats Jev as a measured safety layer rather than an auto-approve toy: thresholds in blockOn come from README calibration tables on git status, rm -rf, curl exfil, and scoped edits, not guessed round numbers. Output judging catches secrets echoed after bash even when the gate cleared intent. Fail-open is honest product design for local dev, but operators should read What leaves the machine before pointing at production repos. Other Pi packages exist; this listing tracks y0usaf/pi-jev only. jomatsu-pi-jev-auto-mode focuses on auto-approve patterns; pi-warden supervises broader rule sets.",
    keyFeatures: [
      "Gate on bash, write, edit with shadow default",
      "Output judge on bash with CLASS_ADVICE table",
      "jev_ask tool for typed Choice, Score, and Noul arrays",
      "Config at ~/.pi/agent/pi-jev.json with project overrides",
      "Slash commands /jev, /jev mode, /jev last, /jev check",
    ],
    stack: [
      "TypeScript Pi extension",
      "TypeSafe System One",
      "npm @y0usaf/pi-jev",
    ],
    links: {
      repo: "https://github.com/y0usaf/pi-jev",
      docs: "https://github.com/y0usaf/pi-jev#the-gate",
      website: "https://www.npmjs.com/package/@y0usaf/pi-jev",
    },
    pricingNote:
      "Open source extension; TypeSafe API key via env, config, or apiKeyFile per README.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "devmortimer-pi-warden",
      "jomatsu-pi-jev-auto-mode",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["use-cases", "primitives"],
    faq: [
      {
        question: "Does pi-jev block tools when Jev errors?",
        answer:
          "No. README states fail-open behavior on errors so development is not bricked by a dead endpoint.",
      },
      {
        question: "What is shadow versus enforce?",
        answer:
          "Shadow notifies on flagged calls. Enforce asks for confirmation before running flagged tools when UI is available.",
      },
      {
        question: "Is this the same as jomatsu pi-jev-auto-mode?",
        answer:
          "No. jomatsu focuses on auto-approve thresholds for tool calls. y0usaf/pi-jev documents destructive, exfiltration, scope, and impact scoring with output judging.",
      },
    ],
    metaTitle: "pi-jev (y0usaf): shadow gate and output judge for Pi",
    metaDescription:
      "y0usaf/pi-jev Pi extension batches gate nouls and impact Score, judges bash output, exposes jev_ask. Shadow default, fail-open on errors per README.",
  },

  "anishfn-shapeshift": {
    slug: "anishfn-shapeshift",
    status: "published",
    problem:
      "Multi-step forms force users to pick a mode before they type, so quick notes become three screens of empty fields.",
    targetUser:
      "Product builders and demo hackers who want one morphing text box that becomes event cards, checklists, timers, and converters without a chat model filling every field.",
    overview:
      "Shapeshift (github.com/anishfn/shapeshift, shapeshiftui.vercel.app) is Anish Gupta's Bun app where a single input becomes the right UI as you type. TypeSafe Jev answers fourteen typed questions in one parallel call (which card type plus signals like video call or urgency) while deterministic code parses dates, amounts, units, and math from the same string. README documents an offline keyword classifier by default so the demo runs without an account; optional TYPESAFE_API_KEY on the server route /api/intent switches the latency badge from jev-offline to pinned jev-1.13.0 with quiet fallback when the API is unreachable.",
    creator: {
      name: "Anish Gupta",
      handle: "anishfn",
      githubUrl: "https://github.com/anishfn",
    },
    jevUsage: {
      flowRole:
        "Parallel intent and card-type classification; code fills structured field values",
      primitives: ["Choice", "Noul"],
      stateIn:
        "User utterance in the morphing text box; fourteen decomposed questions per README diagram (card type plus boolean signals).",
      decisionOut:
        "Selected card template and feature flags consumed by deterministic parsers for values.",
      flowSteps: [
        "User types natural language in the single input",
        "Online path: one Jev fan-out answers fourteen questions in parallel",
        "Offline path: built-in keyword classifier when no key or mock flag",
        "Deterministic code computes dates, splits, conversions, and math",
        "Rendered card persists in browser localStorage until deleted",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states one Jev call answers fourteen typed questions in parallel while code handles values.",
          source: "github.com/anishfn/shapeshift README",
        },
        {
          claim:
            "Public GitHub repo anishfn/shapeshift had about five hundred ten stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
        {
          claim:
            "Live demo hosted at shapeshiftui.vercel.app with Bun 1.2+ dev setup documented in README.",
          source: "github.com/anishfn/shapeshift README",
        },
      ],
    },
    howJevIsUsed:
      "Shapeshift is the UI morphing counterpoint to marketing personalization listings like ploy-ai: Jev classifies intent and card shape, not audience segments. The fan-out pattern keeps latency predictable because every question shares one HTTP round trip while parsers stay testable TypeScript. That split matches the directory mantra of facts in code and judgments on Jev. Press slash to browse card types; optional keys never reach the browser per README server-only routing.",
    keyFeatures: [
      "Sixteen plus card types from events to polls and time zones",
      "Offline keyword mode without API keys",
      "Optional TypeSafe server route with offline fallback",
      "Keyboard shortcuts and localStorage history",
      "Bun 1.2+ dev workflow",
    ],
    stack: ["Bun", "TypeScript", "TypeSafe Jev", "Vercel deploy"],
    links: {
      repo: "https://github.com/anishfn/shapeshift",
      docs: "https://github.com/anishfn/shapeshift#quick-start",
      demo: "https://shapeshiftui.vercel.app",
      website: "https://shapeshiftui.vercel.app",
    },
    pricingNote:
      "Open source; TypeSafe usage bills to your key when online intent is enabled.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "classifier-dev",
      "sdras-jev-webmcp-extension",
      "typesafe-ai-skills",
      "ploy-ai",
    ],
    relatedLearnSlugs: ["primitives", "patterns", "use-cases"],
    faq: [
      {
        question: "Does Shapeshift need a TypeSafe key?",
        answer:
          "No for the default experience. README documents offline keyword classification until you set TYPESAFE_API_KEY in .env.local for the server intent route.",
      },
      {
        question: "How is this different from ploy-ai?",
        answer:
          "Shapeshift morphs a single input into structured personal UI cards. ploy-ai targets marketing segment personalization, not inline card typing.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "README states saved cards live in browser localStorage until you delete them.",
      },
    ],
    metaTitle: "Shapeshift: one box, many Jev intent cards",
    metaDescription:
      "Shapeshift fans one text box out into events, lists, and timers with parallel Jev questions. Offline by default. Live demo at shapeshiftui.vercel.app.",
  },

  "qkal-canny": {
    slug: "qkal-canny",
    status: "published",
    problem:
      "Coding agents can say done after a heredoc edit without running tests, and instruction files only ask the model to behave.",
    targetUser:
      "Claude Code and Codex users who want hook-level supervision with an append-only ledger and deterministic blockers before optional Jev judgments.",
    overview:
      "Canny (github.com/qkal/canny) is Qkal's zero runtime dependency supervisor for Claude Code and Codex. Hooks record what actually happened; code refuses finish when the ledger lacks a passing check after the last edit. README states facts go to code and judgments go to Jev: file changes, command exit codes, and secret patterns block offline, while done claims and rubric-style rule questions go to TypeSafe with about a quarter second latency. Jev never blocks by itself; a refused done is always missing ledger evidence, not a probability threshold. canny replay reproduces verdicts from the ledger.",
    creator: {
      name: "Qkal",
      handle: "qkal",
      githubUrl: "https://github.com/qkal",
    },
    jevUsage: {
      flowRole:
        "Optional Noul-style judgments on done claims and semantic rules; deterministic ledger gates completion",
      primitives: ["Noul", "Score"],
      stateIn:
        "Append-only session ledger events plus diff snippets for rule questions documented in README.",
      decisionOut:
        "Calibrated probabilities for judgments surfaced as notes; blocking verdicts come only from provable ledger facts.",
      flowSteps: [
        "Agent hooks append tool and command events to the ledger",
        "On finish attempt, code checks for passing test, build, lint, or type-check since last edit",
        "Optional Jev answers typed questions about done claims or instruction rules",
        "Deterministic refusal messages cite ledger facts, not model prose",
        "canny replay re-derives the same verdict from stored events",
      ],
      sourcedMetrics: [
        {
          claim:
            "README documents Jev answering typed yes or no questions in about a quarter of a second for judgments.",
          source: "github.com/qkal/canny README",
        },
        {
          claim:
            "README states zero runtime dependencies in package.json and compiled CLI committed to the repo.",
          source: "github.com/qkal/canny README",
        },
        {
          claim:
            "Public GitHub repo qkal/canny had about seventy eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Canny complements coldteadotai-abide and leepokai-jev-guard rather than replacing them. Abide scores each AGENTS.md rule on diffs; jev-guard risk-scores every tool call and scans results for injection. Canny sits on completion evidence: did checks run after the last change, and does the ledger prove it. Jev handles fuzzy done language and semantic rule notes while code owns hard stops. That separation keeps sessions replayable and cheap when you omit a TypeSafe key.",
    keyFeatures: [
      "Claude Code and Codex hook installers via init prompt",
      "Append-only session ledger with replay",
      "Deterministic blockers for missing checks and secret patterns",
      "Optional Jev judgments that never sole-block",
      "Node 22 plus git install path without npm package",
    ],
    stack: ["TypeScript", "Node 22", "Agent hook APIs", "TypeSafe Jev"],
    links: {
      repo: "https://github.com/qkal/canny",
      docs: "https://github.com/qkal/canny#install-by-pasting-a-prompt",
    },
    pricingNote:
      "Open source; optional Jev usage bills to your TypeSafe key when judgments are enabled.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "coldteadotai-abide",
      "hemanth-pkg-gate",
      "leepokai-jev-guard",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Can Jev block my agent from finishing?",
        answer:
          "README states Jev never blocks. Finish refusals come from ledger facts such as no passing check since the last edit.",
      },
      {
        question: "How is Canny different from Abide?",
        answer:
          "Abide enforces instruction-file rubrics on each edit. Canny focuses on completion evidence and optional semantic judgments over the session ledger.",
      },
      {
        question: "Is there an npm install?",
        answer:
          "README install flow clones github.com/qkal/canny to ~/.canny/src and runs the committed dist CLI; there is no npm package.",
      },
    ],
    metaTitle: "Canny: ledger-first agent supervision with optional Jev",
    metaDescription:
      "qkal/canny hooks Claude Code and Codex, blocks done without check evidence, and uses Jev only for judgments. Replayable ledger, zero runtime deps.",
  },

  "ellipsis-dev-blink": {
    slug: "ellipsis-dev-blink",
    status: "published",
    problem:
      "Ripgrep and filename search miss intent when engineers ask where authentication or billing logic lives in plain language.",
    targetUser:
      "Developers with a TypeSafe key who want local codebase search via parallel filesystem walkers scored by Jev probabilities.",
    overview:
      "blink (github.com/ellipsis-dev/blink) from ellipsis-dev is a Bun CLI that accepts a natural-language query and directory, optionally walks recursively, and runs an ensemble of filesystem walkers whose hits Jev scores into a ranked table. README example finds auth files in a sample tree with percentage columns per path. Setup requires Bun 1.3.14 plus TYPESAFE_API_KEY. This listing upgrades the thin catalog row with refreshed star count and a full ProductProfile distinct from web search demos.",
    creator: {
      name: "ellipsis-dev",
      handle: "ellipsis-dev",
      githubUrl: "https://github.com/ellipsis-dev",
    },
    jevUsage: {
      flowRole:
        "Relevance scoring over walker-selected file paths for a natural-language query",
      primitives: ["Score", "Choice"],
      stateIn:
        "Query string, target directory path, walker count, and candidate file nodes from parallel tree walks per README CLI flags.",
      decisionOut:
        "Ranked file paths with percentage relevance for terminal table output.",
      flowSteps: [
        "Parse query and directory from CLI arguments",
        "Spawn multiple filesystem walkers with -n_walkers and optional -r recursive mode",
        "Collect candidate file nodes from the ensemble",
        "Jev scores each node against the query",
        "Print sorted table of paths and percentages",
      ],
      sourcedMetrics: [
        {
          claim:
            "README documents Bun 1.3.14 plus requirement and example ranking auth files at seventy four and sixteen percent.",
          source: "github.com/ellipsis-dev/blink README",
        },
        {
          claim:
            "Public GitHub repo ellipsis-dev/blink had about seventy three stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "blink keeps search local: walkers explore the tree while Jev supplies calibrated relevance instead of embedding prose summaries. Compare superagents-lab-jev-search and mfm-jev-search for HTTP retrieval over the public web or a YouTube catalog; blink targets your checkout on disk. The ensemble pattern spreads walker diversity before a single scoring pass, which is a useful template when you outgrow ripgrep but do not want a vector database yet.",
    keyFeatures: [
      "CLI with query, directory, recursive, and walker count flags",
      "Ensemble filesystem walkers",
      "Terminal table output with percentage column",
      "Bun-native install path",
    ],
    stack: ["Bun", "TypeScript", "TypeSafe Jev"],
    links: {
      repo: "https://github.com/ellipsis-dev/blink",
      docs: "https://github.com/ellipsis-dev/blink#readme",
      post: "https://x.com/0xLogicrw/status/2100478725393686556",
    },
    pricingNote:
      "Open source CLI; TypeSafe usage bills to your TYPESAFE_API_KEY per README.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "superagents-lab-jev-search",
      "mfm-jev-search",
      "classifier-dev",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does blink search the web?",
        answer:
          "No. README documents local directory search with filesystem walkers, not HTTP indexes.",
      },
      {
        question: "How is blink different from jev-search?",
        answer:
          "jev-search plans Search1API web queries. blink scores files inside a path you pass on the command line.",
      },
      {
        question: "What runtime does blink need?",
        answer:
          "README requires Bun 1.3.14 or newer and export TYPESAFE_API_KEY for live scoring.",
      },
    ],
    metaTitle: "blink: Jev-scored local codebase search with walkers",
    metaDescription:
      "ellipsis-dev/blink ranks files from parallel tree walkers with TypeSafe Jev probabilities. Bun CLI, upgraded thick listing on Jev Directory.",
  },

  "nidhi-singh02-agent-router": {
    slug: "nidhi-singh02-agent-router",
    status: "published",
    problem:
      "Developers juggle Cursor, Claude Code, Codex, and OpenCode subscriptions without a quota-aware pick of agent, model, and effort per task.",
    targetUser:
      "Herdr users with multiple agent CLIs logged in who want policy-first eligibility filters then TypeSafe ranking before launch.",
    overview:
      "Agent Router (github.com/nidhi-singh02/agent-router) is Nidhi Singh's pre-release CLI that reads a task string, applies deterministic rules on enabled models, quotas, and a forty percent reserve on shared accounts, then calls TypeSafe to rank what remains and choose reasoning effort. router run launches Cursor, Claude Code, Codex, or OpenCode inside a Herdr pane via logged-in CLIs rather than raw provider API keys. README marks the project under active development and requires a TypeSafe key with no fallback on every run. Local config and decision history stay under .model-router unless you opt into integrations.",
    creator: {
      name: "Nidhi Singh",
      handle: "nidhi-singh02",
      githubUrl: "https://github.com/nidhi-singh02",
    },
    jevUsage: {
      flowRole:
        "Semantic ranking and effort selection after deterministic subscription eligibility filters",
      primitives: ["Choice", "Score"],
      stateIn:
        "Task text plus filtered agent and model candidates after quota and policy rules per README.",
      decisionOut:
        "Chosen agent, model, and effort level used to spawn the selected CLI in Herdr.",
      flowSteps: [
        "Load MODEL_ROUTER_HOME config with enabled models and quotas",
        "Apply fixed eligibility rules including shared-account reserve",
        "Send remaining candidates and task text to TypeSafe for ranking",
        "Pick agent CLI and effort, then launch via Herdr when HERDR_ENV is set",
        "Record decisions locally under .model-router",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states routing always calls TypeSafe with no fallback and rejects recognizable credentials in task text locally.",
          source: "github.com/nidhi-singh02/agent-router README",
        },
        {
          claim:
            "README labels the project pre-release and documents Node 20 plus, Herdr pane requirement, and forty percent shared quota reserve.",
          source: "github.com/nidhi-singh02/agent-router README",
        },
        {
          claim:
            "Public GitHub repo nidhi-singh02/agent-router had about seventy stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Agent Router is the multi-agent launch desk: deterministic code enforces what you are allowed to spend, then Jev picks among legal options. That differs from gargpratyush-jev-router, which focuses on cheapest model routing inside Claude Code only. Pair with dicklesworthstone-skillranker when tasks need skill selection first, or dbreunig-building-with-jev-skill when you are teaching teammates how to shape routing questions. Treat pre-release warnings seriously before pointing shared credentials at router run.",
    keyFeatures: [
      "router run task launcher for four agent CLIs",
      "Quota-aware filters before TypeSafe ranking",
      "Herdr integration for pane launches",
      "Local .model-router config and history",
      "YouTube demo linked from README",
    ],
    stack: [
      "Node.js 20",
      "TypeScript monorepo",
      "Herdr",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/nidhi-singh02/agent-router",
      docs: "https://github.com/nidhi-singh02/agent-router#setup",
      demo: "https://youtu.be/7w8eRWnUUA8",
    },
    pricingNote:
      "Open source pre-release; TypeSafe bills per routing call; agent access uses your existing CLI logins.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "dicklesworthstone-skillranker",
      "dbreunig-building-with-jev-skill",
      "y0usaf-pi-jev",
      "typesafe-ai-skills",
    ],
    relatedLearnSlugs: ["patterns", "use-cases"],
    faq: [
      {
        question: "Is Agent Router production ready?",
        answer:
          "README explicitly marks pre-release active development and asks you to review security notes before real credentials.",
      },
      {
        question: "How is this different from gargpratyush-jev-router?",
        answer:
          "Agent Router picks among Cursor, Claude Code, Codex, and OpenCode with quota rules and Herdr launch. gargpratyush-jev-router wraps Claude Code or Codex only and routes the cheapest sufficient model per fresh user turn; see its product profile for npm install and status line behavior.",
      },
      {
        question: "Can router run without Herdr?",
        answer:
          "README states non dry-run launches require running inside a Herdr pane with HERDR_ENV=1.",
      },
    ],
    metaTitle: "Agent Router: quota-aware Jev pick among coding agent CLIs",
    metaDescription:
      "nidhi-singh02/agent-router filters subscriptions, ranks with TypeSafe, launches Cursor, Codex, Claude Code, or OpenCode via Herdr. Pre-release README.",
  },

  "leepokai-jev-guard": {
    slug: "leepokai-jev-guard",
    status: "published",
    problem:
      "Auto mode style safety exists inside Claude Code, but other agents lack a cheap per-tool-call classifier with session memory and injection scanning.",
    targetUser:
      "Teams on Claude Code, Codex, Copilot, Gemini, Cursor, pi, OpenCode, or ACP who want Jev risk scoring before tools run and on untrusted results.",
    overview:
      "jev-guard (github.com/leepokai/jev-guard, npm jev-guard) from leepokai implements Claude Code auto mode semantics as three typed Jev questions (risk, user_requested, from_untrusted) on every tool call, plus result scanning for prompt injection and skill or plugin checks across hosts. README cites Vercel AI Gateway pricing near four hundredths of a cent per typical call and measured gateway p50 near five hundred eighty milliseconds in calibration runs. Adapters cover plugins, hooks, and npm global install with keys in ~/.jev-guard/config.json. Upgraded from a thin catalog row with refreshed stars and npm badge.",
    creator: {
      name: "leepokai",
      handle: "leepokai",
      githubUrl: "https://github.com/leepokai",
    },
    jevUsage: {
      flowRole:
        "Pre-tool risk gate, post-tool injection scan, and instruction file integrity checks",
      primitives: ["Score", "Noul"],
      stateIn:
        "Tool name and payload before execution; tool stdout, files, and MCP output after; skill and plugin text on load per README tables.",
      decisionOut:
        "Deny, ask, or allow decisions plus untrusted flags stored for the session with calibrated probabilities.",
      flowSteps: [
        "Hook or plugin intercepts agent tool call with session context",
        "Jev scores risk, user intent match, and untrusted instruction signals",
        "Policy maps scores to deny, ask, or allow per host capabilities",
        "After results return, Jev scans for agent-directed injection and canaries",
        "Skills and AGENTS files checked on load and via scan-skills command",
      ],
      sourcedMetrics: [
        {
          claim:
            "README pricing table cites about four hundredths of a cent per typical thousand-token call via Vercel AI Gateway model card.",
          source: "github.com/leepokai/jev-guard README",
        },
        {
          claim:
            "README measured AI Gateway p50 near five hundred eighty milliseconds over a twenty one call calibration run.",
          source: "github.com/leepokai/jev-guard README",
        },
        {
          claim:
            "Public GitHub repo leepokai/jev-guard had about thirty three stars when this listing was drafted; npm package jev-guard at 0.3.1.",
          source: "GitHub and npm September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-guard generalizes auto mode beyond Anthropic's host: same three-question batch, many adapters. coldteadotai-abide judges instruction compliance on diffs; qkal-canny refuses done without check evidence; jev-guard lives on the tool boundary and on poisoned outputs. y0usaf-pi-jev targets Pi specifically with batched nouls. Running jev-guard plus Abide plus Canny is heavy but each layer catches a different failure mode teams actually see in incident reviews.",
    keyFeatures: [
      "Claude Code, Codex, Copilot, Gemini, Cursor, pi, OpenCode, and ACP adapters",
      "Pre-tool deny and ask policy with session memory",
      "Post-tool injection and canary scanning",
      "Skill and plugin integrity checks",
      "npm global CLI with jev-guard check debugging",
    ],
    stack: [
      "JavaScript",
      "npm jev-guard",
      "Agent hook and plugin APIs",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/leepokai/jev-guard",
      docs: "https://github.com/leepokai/jev-guard#install",
      website: "https://www.npmjs.com/package/jev-guard",
    },
    pricingNote:
      "MIT npm package; Jev calls bill per README gateway or api.typesafe.ai pricing.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "coldteadotai-abide",
      "y0usaf-pi-jev",
      "hemanth-pkg-gate",
      "qkal-canny",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does jev-guard replace Claude Code auto mode?",
        answer:
          "README positions it as the same classifier idea with Jev for many hosts, or a second opinion inside Claude Code.",
      },
      {
        question: "How is jev-guard different from Canny?",
        answer:
          "Canny blocks finish without ledger check evidence. jev-guard scores each tool call and scans results for injection before work continues.",
      },
      {
        question: "Where does the API key live?",
        answer:
          "jev-guard key writes ~/.jev-guard/config.json mode 0600; environment variables override when set per README.",
      },
    ],
    metaTitle: "jev-guard: Jev auto mode for every coding agent CLI",
    metaDescription:
      "leepokai/jev-guard npm hooks risk, injection, and skill checks with TypeSafe Jev across Claude Code, Codex, Cursor, pi, and ACP. Upgraded thick page.",
  },

  "togethercomputer-tev1": {
    slug: "togethercomputer-tev1",
    status: "published",
    problem:
      "Teams want fast letter-pick classifiers without paying TypeSafe per call, but also without guessing JSON from a chat model.",
    targetUser:
      "Builders who need Jev-shaped Choice decisions on their own Together endpoint, or who want to fine-tune Qwen3.5-4B with an open recipe for about twenty dollars.",
    overview:
      "tev1 (github.com/togethercomputer/tev1, MIT) is Together's open recipe for a Jev-inspired decision model, not a TypeSafe API client. Hassan El Mghari (@nutlope) published together/Tev1-4B-experimental on Together serverless with weights at huggingface.co/togethercomputer/Tev1-4B-experimental. You send state, a question, and 2 to 24 lettered options; the model returns one answer letter via examples/decide.py (temperature 0, max_tokens 8, thinking off, regex parse). Training recipe new v1 starts from Qwen/Qwen3.5-4B with LoRA SFT on 37,840 train and 4,568 val examples. README states this is an independent implementation that does not use Jev answers as training labels.",
    creator: {
      name: "Hassan El Mghari",
      handle: "nutlope",
      xUrl: "https://x.com/nutlope",
      githubUrl: "https://github.com/Nutlope",
      company: "Together",
      companyUrl: "https://together.ai",
    },
    jevUsage: {
      flowRole:
        "Letter Choice over shared state and explicit option lists on a fine-tuned 4B endpoint",
      primitives: ["Choice"],
      stateIn:
        "JSON with state string, question string, and options array (label, key, description) per examples/ and decide.py.",
      decisionOut:
        "Single option letter (and semantic key in the helper script) parsed from a short completion; logprobs are preferences, not calibrated confidence per README.",
      flowSteps: [
        "Format state, question, and 2 to 24 lettered options as JSON",
        "Call Together chat completions with thinking disabled and tight token cap",
        "Apply the repo system prompt: state is data, return one letter only",
        "Parse the letter with regex in decide.py and map to option keys",
        "Optional: run scripts/evaluate.py on a labeled holdout you control",
      ],
      sourcedMetrics: [
        {
          claim:
            "new v1 recipe uses 37,840 training and 4,568 validation examples from the v1 plus v2.1 union on Qwen/Qwen3.5-4B with LoRA SFT.",
          source: "github.com/togethercomputer/tev1 README and runs/new-v1/README.md",
        },
        {
          claim:
            "Development benchmarks on the published endpoint scored 880/1,000 main decisions (88%) and 300/300 policy-transfer; reused during training, not a held-out eval.",
          source: "github.com/togethercomputer/tev1 runs/new-v1/README.md",
        },
        {
          claim:
            "Together blog cites about seventeen dollars and about twenty five minutes to fine-tune the sample dataset; serverless together/Tev1-4B-experimental lists about four cents per 1M input tokens with output free.",
          source: "together.ai blog how-to-train-your-own-jev and Together model pricing September 2026",
        },
        {
          claim:
            "Public GitHub repo togethercomputer/tev1 had forty two stars and six forks when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Tev1 is the DIY cousin of hosted System One and the Featherless logits stack: same mental model of state plus explicit options, but the weights and bill live on Together. nutlope-1kpapers still calls TypeSafe for atlas topics; tev1 lets you own the classifier head after a cheap LoRA run. featherless-simple-jev assembles JSON from logits without a chat completion; tev1 learns letter answers from supervised examples. kylejeong-jev-as-judge and classifier.dev remain the paths when you want the closed jev model or HTTP primitives without training. Be honest in architecture reviews: Tev1 does not call api.typesafe.ai and dev bench scores are not production SLAs.",
    keyFeatures: [
      "Open MIT repo with dataset builders, train_together.py, and decide.py",
      "Hosted weights Tev1-4B-experimental on Together serverless",
      "Hugging Face model card and full weight download",
      "Documented new v1 recipe with saved dev benchmark reports",
      "Blog walkthrough from clone to deployed endpoint for about seventeen dollars",
    ],
    stack: [
      "Python 3.12+",
      "uv",
      "Qwen/Qwen3.5-4B",
      "Together fine-tuning and inference",
      "LoRA SFT",
    ],
    links: {
      website: "https://huggingface.co/togethercomputer/Tev1-4B-experimental",
      repo: "https://github.com/togethercomputer/tev1",
      docs: "https://www.together.ai/blog/how-to-train-your-own-jev",
      demo: "https://api.together.ai/models/together/Tev1-4B-experimental",
      post: "https://x.com/nutlope/status/2102881280115249597",
    },
    pricingNote:
      "Repo training example targets about seventeen dollars per blog; serverless inference bills per Together model card (input priced, output free on the experimental endpoint).",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "nutlope-1kpapers",
      "classifier-dev",
      "featherless-simple-jev",
      "kylejeong-jev-as-judge",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is Tev1 the same as TypeSafe Jev?",
        answer:
          "No. README calls it a Jev-inspired independent implementation. It does not use Jev training labels and does not call the TypeSafe API unless you wire that yourself.",
      },
      {
        question: "Can I trust the 88 percent main benchmark?",
        answer:
          "runs/new-v1/README.md labels those rows as reused development benchmarks, not untouched holdout tests. Run evaluate.py on your own split before quoting accuracy in prod.",
      },
      {
        question: "How do I try it without training?",
        answer:
          "Call together/Tev1-4B-experimental on Together serverless or download weights from Hugging Face, then mirror decide.py settings (temperature 0, max_tokens 8, thinking off).",
      },
      {
        question: "How is this different from Simple Jev?",
        answer:
          "Simple Jev serves Choice, Score, and Noul from open-model logits on Featherless. Tev1 is a single fine-tuned Qwen that completes one letter per question on Together.",
      },
    ],
    metaTitle: "tev1: open Jev-like Choice model you train on Together",
    metaDescription:
      "togethercomputer/tev1 fine-tunes Qwen3.5-4B for letter decisions. Tev1-4B-experimental on Together, HF weights, about $17 training blog, not TypeSafe API.",
  },

  "jaredpalmer-kev": {
    slug: "jaredpalmer-kev",
    status: "published",
    problem:
      "Teams want Jev-shaped Choice, Score, and Noul gates without per-call TypeSafe bills, but also without brittle chat JSON from general LLMs.",
    targetUser:
      "Engineers who can host Python 3.12+, want System One-compatible APIs, and may fine-tune Qwen3.5 or Qwen3.8 checkpoints on their own labels.",
    overview:
      "Kev (github.com/jaredpalmer/kev, Apache-2.0) is Jared Palmer's family of small decision models on Qwen3.5 and Qwen3.8 bases (0.8B, 4B, 9B, 27B). Weights and frozen eval suites live on Hugging Face; kev.serve exposes POST /v1/systemone matching TypeSafe's System One contract so the TypeSafe Python SDK can point at localhost. README publishes dev and test accuracy and Brier scores against hosted Jev on new sources (datasets Kev never trained on) and trained sources (held-out rows from Kev training). Kev-27B is within about one point of Jev on new-source accuracy in those tables; Kev-4B is the default starting size. Modal skills, one-command HTTPS deploy, and HF Spaces demo round out the train-and-serve story.",
    creator: {
      name: "Jared Palmer",
      handle: "jaredpalmer",
      xUrl: "https://x.com/jaredpalmer",
      githubUrl: "https://github.com/jaredpalmer",
    },
    jevUsage: {
      flowRole:
        "Self-hosted System One parallel questions over shared state with calibrated probabilities",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Single state string plus a questions map of choice, noul, or score fields per README curl and typesafe_sdk examples.",
      decisionOut:
        "Per-question typed answers with probabilities or scores; latency_ms and token usage in the JSON envelope.",
      flowSteps: [
        "uv sync --extra serve and python -m kev.serve --run jaredpalmer/kev-4b",
        "POST /v1/systemone with model kev-latest and parallel questions",
        "Route high-confidence departments or escalate low-confidence tuples in app code",
        "Optional: fine-tune adapters and redeploy with the repo training and Modal skill paths",
      ],
      sourcedMetrics: [
        {
          claim:
            "README table lists Kev-4B new-source development accuracy 0.817 and test 0.838 versus Jev hosted 0.857 on development new sources only.",
          source: "github.com/jaredpalmer/kev README Models section",
        },
        {
          claim:
            "Public GitHub repo jaredpalmer/kev had 6740 stars and 389 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "Apache-2.0 license; default serve example reports about 495 ms latency for a three-question ticket on Kev-4B bf16 on Apple M5 in README.",
          source: "github.com/jaredpalmer/kev README Quick Start",
        },
      ],
    },
    howJevIsUsed:
      "Kev is the open-weights answer when you want the same SDK calls as api.typesafe.ai but the bill and GPUs are yours. togethercomputer-tev1 teaches a letter-picker via LoRA on Together; featherless-simple-jev assembles logits from arbitrary HF models; bespokelabsai-nimble ships a curated 9B recipe. Kev ships full checkpoints with eval tables against hosted Jev and explicit warnings that Jev training data is unknown, so headline accuracy is directional. wfzyx-von chases sub-25 ms non-autoregressive inference on a smaller encoder; Kev stays autoregressive Qwen with richer Score and Noul in one batch. Do not confuse this repo with kevthetech143-super-jev fan forks. classifier.dev and hosted System One remain the paths when you refuse to operate inference.",
    keyFeatures: [
      "Four public sizes from 0.8B laptop class to 27B datacenter GPU",
      "Drop-in TypeSafe Python SDK against local kev.serve",
      "Frozen HF eval suites and per-model cards with Brier scores",
      "HF Space demo, GitHub release checksums, Modal fine-tune skill",
      "Parallel choice, noul, and score questions on one state string",
    ],
    stack: [
      "Python 3.12 or 3.13",
      "uv",
      "Qwen3.5 and Qwen3.8 bases",
      "CUDA, ROCm, or MLX serve paths",
      "typesafe_sdk",
    ],
    links: {
      repo: "https://github.com/jaredpalmer/kev",
      docs: "https://github.com/jaredpalmer/kev#quick-start",
      demo: "https://huggingface.co/spaces/jaredpalmer/kev",
      website: "https://huggingface.co/collections/jaredpalmer/kev-6aad9d0ea49f2589665e07cd",
    },
    pricingNote:
      "Open source weights; you pay for GPUs, Modal training, or your own cloud serve. No TypeSafe meter unless you call both.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "togethercomputer-tev1",
      "featherless-simple-jev",
      "bespokelabsai-nimble",
      "wfzyx-von",
      "theoleecj-semif",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is Kev the same product as TypeSafe Jev?",
        answer:
          "No. Kev reimplements a Jev-like decision stack on open Qwen weights with a compatible HTTP API. Hosted Jev stays on TypeSafe unless you point SDK clients at your server.",
      },
      {
        question: "Which size should I start with?",
        answer:
          "README recommends Kev-4B for most GPUs, Kev-0.8B when size matters, and Kev-27B when you have 80 GB VRAM and want the best Kev accuracy in their tables.",
      },
      {
        question: "How does Kev compare to tev1 or Nimble?",
        answer:
          "tev1 is a Together fine-tune recipe; Nimble is Bespoke's 9B schema classifier. Kev ships multiple finished checkpoints with System One parity and Jared Palmer's eval narrative against hosted Jev.",
      },
    ],
    metaTitle: "Kev: Jared Palmer's open Jev-like models on Qwen",
    metaDescription:
      "jaredpalmer/kev serves System One-compatible Choice, Score, and Noul from 0.8B to 27B Qwen checkpoints. HF weights, evals vs hosted Jev, TypeSafe SDK drop-in.",
  },

  "wfzyx-von": {
    slug: "wfzyx-von",
    status: "published",
    problem:
      "Autoregressive chat classifiers burn hundreds of milliseconds and KV cache RAM for routing tasks that only need scored options, not generated prose.",
    targetUser:
      "Builders who want Apache-2.0 weights, local sub-25 ms decisions, and order-invariant option scoring without TypeSafe API keys.",
    overview:
      "Von (github.com/wfzyx/von, Apache-2.0) is a compact non-autoregressive System One-style model: one forward pass scores premise text against explicit option descriptions for Choice, Noul, and Score-style tasks. README positions Von 1.2 as fixing option-order sensitivity from Von 1.1 (JevBench hard-tier shuffle diagnostic). Weights ship at huggingface.co/wfzyx/von with Python 3.12+ and TypeScript clients. Marketing copy cites sub-25 ms inference and Doom gameplay where movement picks are zero-shot from depth-buffer text, with tables comparing kills and latency to TypeSafe Jev 1.13 API and other open baselines on the author's hardware.",
    creator: {
      name: "wfzyx",
      githubUrl: "https://github.com/wfzyx",
    },
    jevUsage: {
      flowRole:
        "Bidirectional encoder scores each option against shared premise text in one pass",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Premise string plus option descriptions; Von 1.2 isolates option tokens so scores do not depend on sibling option order.",
      decisionOut:
        "Discrete picks with calibrated-style probabilities per primitive; local in-process latency on GPU or CPU per README benchmarks.",
      flowSteps: [
        "Load wfzyx/von weights from Hugging Face",
        "Format premise and option list per package examples",
        "Run single forward pass scoring all questions in parallel",
        "Threshold probabilities in your router or game loop",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cites Von 1.1 about 18 ms inference on documented JevBench and Doom tables versus TypeSafe Jev API about 115 ms in the same table footnotes.",
          source: "github.com/wfzyx/von README benchmark tables",
        },
        {
          claim:
            "Von 1.2 release notes claim option-order shuffle sensitivity dropped from 49.5% answer changes on hard tier to architecture-level invariance.",
          source: "github.com/wfzyx/von README What's new in 1.2",
        },
        {
          claim:
            "Public GitHub repo wfzyx/von had 635 stars and 46 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Von is the speed-first open cousin of hosted System One: no api.typesafe.ai round trip, no token-by-token decode for a letter answer. jaredpalmer-kev keeps Qwen autoregression but adds full fine-tune and SDK parity; togethercomputer-tev1 and featherless-simple-jev target different training and serving ergonomics. Laya and MLX ports covered in /learn/laya-vs-jev solve another local open stack; Von is explicitly tagged decision-model and System One in GitHub topics. Do not confuse with genai-craft-openvons. Pair with theoleecj-semif when you want a research server narrative, or classifier.dev when managed latency beats running 395M params yourself.",
    keyFeatures: [
      "Apache-2.0 weights and Python plus TypeScript inference paths",
      "Order-invariant option scoring in Von 1.2 architecture",
      "Documented JevBench and ViZDoom-style zero-shot demos",
      "Sub-25 ms marketing claim for local interactive loops",
      "250k example training story in README methodology section",
    ],
    stack: [
      "Python 3.12+",
      "TypeScript 5.x",
      "ModernBERT-family encoder",
      "Hugging Face Hub",
    ],
    links: {
      repo: "https://github.com/wfzyx/von",
      docs: "https://github.com/wfzyx/von#whats-new-in-12-order-invariant-option-scoring",
      website: "https://huggingface.co/wfzyx/von",
    },
    pricingNote:
      "Open weights; inference cost is your hardware or cloud GPU time, not TypeSafe tokens.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "jaredpalmer-kev",
      "togethercomputer-tev1",
      "featherless-simple-jev",
      "bespokelabsai-nimble",
      "theoleecj-semif",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is Von a drop-in TypeSafe API client?",
        answer:
          "Von mirrors System One semantics in docs and examples but ships its own weights and clients. Point integrations at Von inference code, not api.typesafe.ai, unless you wrap it yourself.",
      },
      {
        question: "How is Von different from Kev?",
        answer:
          "Kev is Jared Palmer's multi-size Qwen family with TypeSafe SDK compatibility and fine-tune tooling. Von is a smaller non-autoregressive encoder focused on fast local scoring.",
      },
      {
        question: "Should I trust the Doom kill counts as production proof?",
        answer:
          "README presents them as zero-shot gameplay evidence on the author's GPU. Treat them as demos; run your own latency and accuracy harness before safety gates.",
      },
    ],
    metaTitle: "Von: open non-autoregressive System One decision model",
    metaDescription:
      "wfzyx/von scores Choice, Noul, and Score in one forward pass with Apache-2.0 weights. Claims sub-25 ms local runs and order invariance, unlike hosted Jev.",
  },

  "monteduro-killmyidea": {
    slug: "monteduro-killmyidea",
    status: "published",
    problem:
      "Founders waste weeks on ideas that fail basic indie-hacker sanity checks, but generic chat opinions are not reproducible or thresholdable.",
    targetUser:
      "Solo builders who want a blunt KILL, FIX, or SHIP label from structured scores, not a motivational essay from GPT-class models.",
    overview:
      "Kill My Idea (github.com/monteduro/killmyidea, killmyidea.stemonte.io) is a Vite playground that sends exactly one TypeSafe Jev request per idea. Ten parallel questions run together: eight rubric scores from 0 to 4 (real problem, money, competition, and similar indie fields), plus category and understandability nouls. src/lib/scoring.ts multiplies each score by 25, applies goal-specific weights (make money, open source, or just for fun), averages, and src/lib/verdict.ts maps below 50 to KILL, 50 to 64 to FIX, and 65+ to SHIP with a clarity gate. No generative LLM writes the verdict; the UI exposes raw Jev probabilities in a collapsible panel. api/evaluate.ts holds the TypeSafe key server-side; optional SQLite archives successful runs.",
    creator: {
      name: "Marco Monteduro",
      handle: "monteduro",
      githubUrl: "https://github.com/monteduro",
      companyUrl: "https://killmyidea.stemonte.io",
    },
    jevUsage: {
      flowRole:
        "Single batched Score and Noul pass that feeds deterministic weighted verdict math",
      primitives: ["Score", "Noul"],
      stateIn:
        "User idea text plus selected goal mode that reweights Real problem, Money, Adoption, Fun, and related fields per README scoring section.",
      decisionOut:
        "Eight 0 to 4 scores, category and clarity signals, weighted 0 to 100 average, and KILL, FIX, or SHIP label with latency and token usage in the debug panel.",
      flowSteps: [
        "Browser posts idea and goal to /api/evaluate",
        "Server calls TypeSafe Jev once with ten parallel questions",
        "scoring.ts applies WEIGHTS per goal and computes weighted average",
        "verdict.ts applies thresholds and clarity gate for the headline label",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states no generative LLM on the verdict path; one Jev request with ten parallel questions.",
          source: "github.com/monteduro/killmyidea README",
        },
        {
          claim:
            "Verdict thresholds documented as score below 50 KILL, 50 to 64 FIX, 65+ SHIP in src/lib/verdict.ts.",
          source: "github.com/monteduro/killmyidea src/lib/verdict.ts",
        },
        {
          claim:
            "Public GitHub repo monteduro/killmyidea had 191 stars and 24 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Jev is the entire judgment engine: parallel Score heads replace a jury of chat prompts. The product value is transparent math on top of typed outputs, so you can tune weights in git instead of re-prompting. anishfn-shapeshift fans out many intent questions for UI morphing; killmyidea fans out once for investor-style rubrics. Hosted TypeSafe keys stay off the client; TYPESAFE_MOCK=1 enables UI work without billing. This is a playground, not a replacement for legal or market research. Pair with classifier.dev when you need HTTP labels outside a Vite demo.",
    keyFeatures: [
      "KILL, FIX, SHIP headline with expandable raw Jev panel",
      "Goal modes reweight money versus adoption versus fun fields",
      "Server-side evaluate function; keys never shipped to the browser",
      "Optional SQLite analytics archive with per-request opt-out",
      "Live demo at killmyidea.stemonte.io plus Vercel deploy docs",
    ],
    stack: ["TypeScript", "Vite", "TypeSafe Jev API", "SQLite analytics"],
    links: {
      repo: "https://github.com/monteduro/killmyidea",
      demo: "https://killmyidea.stemonte.io",
      docs: "https://github.com/monteduro/killmyidea#6-scoring",
    },
    pricingNote:
      "Open source UI; each evaluation spends TypeSafe Jev tokens from your server key.",
    firstSeen: "2026-09-24",
    relatedSlugs: ["anishfn-shapeshift", "classifier-dev", "kylejeong-jev-as-judge"],
    relatedLearnSlugs: ["primitives", "use-cases"],
    faq: [
      {
        question: "Does a chat model write the KILL or SHIP text?",
        answer:
          "No. README emphasizes Jev scores feed deterministic TypeScript verdict code. There is no separate generative model on the hot path.",
      },
      {
        question: "Can I run it without a TypeSafe key?",
        answer:
          "Set TYPESAFE_MOCK=1 locally for deterministic MOCK DATA responses. Production needs TYPESAFE_API_KEY on the server.",
      },
      {
        question: "How is this different from asking ChatGPT to roast my idea?",
        answer:
          "You get fixed rubric scores, published weights, and the same thresholds every time, which is closer to a gate than a prose opinion.",
      },
    ],
    metaTitle: "Kill My Idea: Jev-scored startup verdict playground",
    metaDescription:
      "monteduro/killmyidea runs ten parallel Jev scores per idea, weighted average, KILL FIX SHIP thresholds. killmyidea.stemonte.io demo, no generative verdict LLM.",
  },

  "milind-soni-tiptour-macos": {
    slug: "milind-soni-tiptour-macos",
    status: "published",
    problem:
      "macOS computer-use demos that send screenshots to giant multimodal models are slow, costly, and hard to stop mid-loop.",
    targetUser:
      "Mac users who want a menu-bar agent that picks among locally detected controls with Jev, while keeping API keys in Keychain and screenshots local for the Jev path.",
    overview:
      "TipTour (github.com/milind-soni/tiptour-macos, MIT) is a macOS 14.2+ menu-bar app with two modes: Gemini realtime voice or screen writing, and JEV text mode (default) where you type a click task, Jev chooses among locally detected labels and coordinates, and TipTour executes single, double, or right clicks with validation. Ctrl+K starts Jev mode; Escape or Stop cancels. README documents a 12-action cap, no confidence cutoff on the top target, and keys stored per mode in Keychain without hosted proxies. Jev cannot see images or generate replacement text; Gemini handles keyboard and writing tasks. scripts/test-jev.sh runs isolated decision tests without launching the full app.",
    creator: {
      name: "Milind Soni",
      githubUrl: "https://github.com/milind-soni",
    },
    jevUsage: {
      flowRole:
        "Per-step Choice over locally detected control candidates for click automation",
      primitives: ["Choice"],
      stateIn:
        "Typed user task, locally detected screen labels and locations, and recent action history per README privacy section (screenshots stay local for Jev).",
      decisionOut:
        "Ranked click target and action type; loop ends on completion signal, failure, user stop, or twelve actions.",
      flowSteps: [
        "Grant Accessibility and Screen Recording permissions for detection",
        "User enters task in JEV text panel (Ctrl+K)",
        "Jev selects among detected controls; TipTour executes click",
        "Validate outcome and repeat until done, stop, or action limit",
      ],
      sourcedMetrics: [
        {
          claim:
            "README lists JEV as default mode with 12-action limit and no confidence cutoff on the top-ranked target.",
          source: "github.com/milind-soni/tiptour-macos README",
        },
        {
          claim:
            "Public GitHub repo milind-soni/tiptour-macos had 663 stars and 103 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "Jev path receives typed task and local labels only; screenshots stay local per privacy section.",
          source: "github.com/milind-soni/tiptour-macos README",
        },
      ],
    },
    howJevIsUsed:
      "TipTour treats Jev as a fast click router over finite local candidates, not a vision model. awlevin-typesafe-computer-use pairs OCR plus accessibility with TypeSafe on macOS CLI loops; sac-y-jev-cu does text-only AX lists inside Codex. TipTour is a polished menu-bar product with branded shortcuts and a separate Gemini path for voice. Featured on community lists such as jevlist.ai TipTour coverage. Auto-click is required for Jev; point-only mode is Gemini-only per README.",
    keyFeatures: [
      "Default JEV text mode with Ctrl+K shortcut",
      "Single, double, and right click execution with stop controls",
      "Per-mode API keys in Keychain; no shared hosted key proxy",
      "Separate Gemini realtime mode for voice and writing",
      "test-jev.sh harness for decision-only debugging",
    ],
    stack: [
      "Swift",
      "macOS 14.2+",
      "Xcode",
      "Jev API",
      "Gemini realtime optional",
    ],
    links: {
      repo: "https://github.com/milind-soni/tiptour-macos",
      docs: "https://github.com/milind-soni/tiptour-macos/blob/main/docs/tiptour-agent-contract.md",
    },
    pricingNote:
      "Open source app; you bring Jev and optional Gemini API keys.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "awlevin-typesafe-computer-use",
      "sac-y-jev-cu",
      "browser-use-jev-ultrafast",
    ],
    relatedLearnSlugs: ["use-cases", "primitives"],
    faq: [
      {
        question: "Does Jev mode send screenshots to the model?",
        answer:
          "README states Jev receives typed tasks and locally detected labels and locations while screenshots stay local. Gemini mode may send screenshots when enabled.",
      },
      {
        question: "Can TipTour type text for me in Jev mode?",
        answer:
          "No. Jev mode supports click actions only. Use Gemini mode for keyboard or writing help.",
      },
      {
        question: "How is this different from typesafe-computer-use?",
        answer:
          "Aaron Levin's CLI targets terminal-driven loops with dry-run defaults. TipTour is a menu-bar consumer app with shortcuts, dual models, and Keychain key storage.",
      },
    ],
    metaTitle: "TipTour macOS: menu-bar Jev click companion",
    metaDescription:
      "milind-soni/tiptour-macos uses Jev to pick local controls for click tasks, 12-action cap, keys in Keychain. Distinct from Codex and CLI computer-use peers.",
  },

  "samuelfaj-distill": {
    slug: "samuelfaj-distill",
    status: "published",
    problem:
      "Coding agent sessions burn tokens when every step re-sends full transcripts to huge models for routing, effort, and compression choices.",
    targetUser:
      "Developers running Distill with Grok, Codex, or OpenRouter who want Jev to decide model tier, reasoning consults, and utility payloads without granting Jev tool approval power.",
    overview:
      "Distill (github.com/samuelfaj/distill, Apache-2.0) is Samuel Fajreldines's Rust agent harness and TUI built to stretch subscription and API budgets. docs/jev-routing.md documents Jev as the decision layer over harness-assembled state: Plan, Step, and Review batteries decide when the optional reasoning model consults, what effort level applies, and how tool results get summarized versus cited. Distill owns permissions, YOLO, and auto-approval; Jev cannot approve or veto tool calls. Fail-open behavior keeps the main model path when Jev errors or lacks confidence. Main, reasoning, and utility model tiers are configured separately on the home screen.",
    creator: {
      name: "Samuel Fajreldines",
      handle: "samuelfaj",
      githubUrl: "https://github.com/samuelfaj",
    },
    jevUsage: {
      flowRole:
        "Routing and consult gating for reasoning model, effort, and utility summarization",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Bounded payloads such as tool results, struggle signals, diffs, and complexity flags described per Plan, Step, and Review tables in docs/jev-routing.md.",
      decisionOut:
        "Whether to consult reasoning model, review verdicts, per-item full versus summary inclusion, and optional effort picks with documented confidence floors (0.40 effort, 0.55 plan).",
      flowSteps: [
        "Main model runs every session step",
        "Jev Plan decision on first round when reasoning model configured",
        "Jev Step and Review decisions gate consults before delivery",
        "Utility model handles cite_spans compression when windows overflow",
      ],
      sourcedMetrics: [
        {
          claim:
            "docs/jev-routing.md states Jev chooses among candidates supplied by code, does not invent tools, and cannot approve or hold tool calls.",
          source: "github.com/samuelfaj/distill docs/jev-routing.md",
        },
        {
          claim:
            "Effort auto merges effort selection with reasoning consult questions for one Jev call per round when enabled.",
          source: "github.com/samuelfaj/distill docs/jev-routing.md",
        },
        {
          claim:
            "Public GitHub repo samuelfaj/distill had 688 stars and 44 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Distill is an unusually explicit map of where Jev saves tokens versus where the harness must stay deterministic. nidhi-singh02-agent-router ranks agents and models up front; y0usaf-pi-jev gates bash and edits inside Pi; jkudish-jev-mcp exposes typed tools to external clients. Distill keeps Jev on consult and compression policy inside its own TUI loop. Do not confuse with bespokelabsai-nimble model distillation; this repo name is the agent harness. Read docs/token-saver.md alongside jev-routing.md when you explain ROI to your team.",
    keyFeatures: [
      "Plan, Step, and Review Jev batteries for reasoning consults",
      "Fail-open when Jev times out or lacks confidence",
      "Separate main, reasoning, and utility model tiers",
      "GROK_LOG_JEV=1 debug logging for tuning questions",
      "curl and PowerShell installers for macOS, Linux, and Windows",
    ],
    stack: ["Rust", "TUI", "OpenRouter", "Codex and Grok subscriptions"],
    links: {
      repo: "https://github.com/samuelfaj/distill",
      docs: "https://github.com/samuelfaj/distill/blob/main/docs/jev-routing.md",
    },
    pricingNote:
      "Open source harness; you pay model providers plus any TypeSafe Jev calls Distill issues.",
    firstSeen: "2026-09-24",
    relatedSlugs: [
      "nidhi-singh02-agent-router",
      "y0usaf-pi-jev",
      "jkudish-jev-mcp",
      "leepokai-jev-guard",
    ],
    relatedLearnSlugs: ["use-cases", "primitives"],
    faq: [
      {
        question: "Can Jev block a dangerous tool call in Distill?",
        answer:
          "No. docs/jev-routing.md says Distill owns permission policy and Jev cannot approve, veto, or hold confirmations.",
      },
      {
        question: "What happens if Jev fails mid-session?",
        answer:
          "The harness documents fail-open behavior: the main model continues and consults may be skipped when decisions error or lack confidence.",
      },
      {
        question: "Is this the same as Bespoke Nimble distillation?",
        answer:
          "No. Nimble trains open classifiers. Distill is a coding agent harness that calls Jev for routing and consult decisions at runtime.",
      },
    ],
    metaTitle: "Distill: Rust agent harness with Jev routing docs",
    metaDescription:
      "samuelfaj/distill uses Jev for Plan, Step, Review consults and effort routing. Thick docs/jev-routing.md, fail-open, Distill owns permissions not Jev.",
  },

  "jev-chat-jev-chat-windows": {
    slug: "jev-chat-jev-chat-windows",
    status: "published",
    problem:
      "Windows desktop chat users want the same judge-first reply assist as mobile, without hooking WeChat or auto-sending messages.",
    targetUser:
      "Windows 10 1903+ users who run chat apps locally and want OCR read, Jev intent scoring, and three ranked drafts they paste manually.",
    overview:
      "JevChat Windows (github.com/jev-chat/jev-chat-windows) ports the jev-chat kernel to PyQt on Windows: window screenshot plus offline RapidOCR builds thread state, Jev judges intent, tension, and reply urgency, then a separate draft LLM writes three candidates ranked by Jev probabilities. Fill-in only; send stays manual. Releases ship as about 146 MB zip with jev-chat-windows.exe; keys for judge (OpenRouter or TypeSafe) and draft (default DeepSeek) live in HKCU environment variables. README documents session following, group speaker names, pause toggle, and optional debug overlay for OCR boxes.",
    creator: {
      name: "jev-chat",
      githubUrl: "https://github.com/jev-chat",
      company: "jev-chat",
      companyUrl: "https://chatjevs.com",
    },
    jevUsage: {
      flowRole:
        "Judge pass on OCR thread text before draft LLM writes three ranked replies",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Recent OCR messages per session, relationship preset, optional group reply target, and style notes from config.json beside the exe.",
      decisionOut:
        "Intent summary, tension 0 to 9, three reply candidates with Jev probability ordering; fill input only.",
      flowSteps: [
        "WGC captures chat window; RapidOCR extracts lines in memory",
        "Judge API (Jev via OpenRouter or TypeSafe) scores intent and ranks drafts",
        "Draft LLM writes three candidates (default DeepSeek direct)",
        "User taps fill; program never triggers send",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states fill-in only with manual send and about 146 MB release zip size.",
          source: "github.com/jev-chat/jev-chat-windows README",
        },
        {
          claim:
            "Public GitHub repo jev-chat/jev-chat-windows had 530 stars and 115 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
        {
          claim:
            "Judge and draft use separate API keys (JEV_API_KEY and LLM_API_KEY) stored in Windows user environment variables, not files.",
          source: "github.com/jev-chat/jev-chat-windows README",
        },
      ],
    },
    howJevIsUsed:
      "Windows shares the judge-then-draft split documented on jev-chat-jev-chat-jarvis for Android: structured judgment before casual text generation. Capture differs: desktop uses window screenshots and offline OCR instead of accessibility trees. TypeSafe or OpenRouter can back the judge card while draft defaults to DeepSeek for China-friendly latency per README. Cross-link the Android thick page for QQ and Lark paths; this listing covers WeChat-oriented Windows usage and floating PyQt UI. No package hooks and no auto-send mirror the mobile privacy story.",
    keyFeatures: [
      "Three ranked replies with Jev probability percentages",
      "Session-following overlay with pause toggle",
      "Separate judge and draft model cards and keys",
      "Group chat speaker OCR and optional reply target",
      "Debug view for OCR boxes without saving screenshots to disk in release exe",
    ],
    stack: [
      "Python",
      "PyQt",
      "RapidOCR",
      "OpenRouter or TypeSafe judge",
      "DeepSeek draft default",
    ],
    links: {
      repo: "https://github.com/jev-chat/jev-chat-windows",
      docs: "https://github.com/jev-chat/jev-chat-windows#使用说明",
      demo: "https://github.com/jev-chat/jev-chat-windows/releases/latest",
      website: "https://chatjevs.com",
    },
    pricingNote:
      "Free open source client; judge and draft APIs bill per provider when messages arrive.",
    firstSeen: "2026-09-24",
    relatedSlugs: ["jev-chat-jev-chat-jarvis", "avec-ai", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "primitives"],
    faq: [
      {
        question: "Does the Windows app auto-send replies?",
        answer:
          "No. README emphasizes manual send after fill-in, matching the Android jarvis policy.",
      },
      {
        question: "Which API keys do I need?",
        answer:
          "One key for judge (OpenRouter or TypeSafe) and one for draft (default DeepSeek). They are stored separately in HKCU environment variables.",
      },
      {
        question: "How does this relate to Jev Chat Jarvis?",
        answer:
          "Same jev-chat family kernel: judge-first Jev on visible thread text, three drafts, never auto-send. Jarvis is Android accessibility; this repo is Windows OCR plus PyQt.",
      },
    ],
    metaTitle: "JevChat Windows: judge-first WeChat desktop co-pilot",
    metaDescription:
      "jev-chat/jev-chat-windows OCR plus Jev judge ranks three reply drafts on Windows. OpenRouter or TypeSafe judge, DeepSeek draft, fill-only never auto-send.",
  },

  "sutro-sh-jev-align": {
    slug: "sutro-sh-jev-align",
    status: "published",
    problem:
      "Shipping a typed classifier is easy; keeping it calibrated when labels drift, options shuffle, and production rows look nothing like your first CSV is not.",
    targetUser:
      "ML and product engineers who want Sutro-style AI Functions on TypeSafe Jev with human-in-the-loop GEPA rounds, not another skill-router repo.",
    overview:
      "jev-align (github.com/sutro-sh/jev-align, Apache-2.0, PyPI jev-align 0.1.4) is Sutro's experimental CLI for building portable AI Functions with TypeSafe Jev. Run `jeva` or `jev-align` after `uv tool install jev-align`: guided setup discovers local CSV, Parquet, and JSONL, walks Binary, Multiclass, Multilabel, and Score task types, and loops evaluate, label uncertain rows, GEPA optimize, accept or reject diffs. Jev can run through TYPESAFE_API_KEY, Vercel AI Gateway, or Cloudflare Workers AI; GEPA's reflection model is separate (OpenAI, Anthropic, Gemini, or LiteLLM providers including local vLLM). Finished functions publish through ai-functions.dev.",
    creator: {
      name: "Sutro",
      handle: "sutro-sh",
      githubUrl: "https://github.com/sutro-sh",
      company: "Sutro",
      companyUrl: "https://sutro.sh",
    },
    jevUsage: {
      flowRole:
        "Iterative calibration loop: Jev scores rows, humans label ambiguity, GEPA proposes definition updates",
      primitives: ["Choice", "Noul", "Score"],
      stateIn:
        "Tabular rows (concatenated or selected columns) plus natural-language question and class or score-level definitions from guided setup or `jeva optimize` flags.",
      decisionOut:
        "Task-typed predictions with uncertainty metrics per round; accepted proposals become portable AI Function definitions for runtime Jev calls.",
      flowSteps: [
        "Install jev-align and configure Jev provider (TypeSafe, Vercel, or Cloudflare) plus reflection LLM",
        "Pick dataset, task type, and training annotations per round (5 to 20 in Advanced menu)",
        "Label ambiguous rows and optional audit sample; GEPA runs within metric-call budget (default 300)",
        "Review score, certainty delta, and definition diff; accept, reject, rewind, or resume later",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states each round evaluates uncertainty, selects ambiguous rows plus a random audit sample, runs GEPA on accumulated labels, and never auto-accepts on score alone.",
          source: "github.com/sutro-sh/jev-align README How it works",
        },
        {
          claim:
            "PyPI package jev-align version 0.1.4 listed when this listing was drafted.",
          source: "pypi.org/project/jev-align",
        },
        {
          claim:
            "Public GitHub repo sutro-sh/jev-align had 287 stars and 23 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-align is the opposite of a one-shot router: Jev is the scoring engine inside an active-learning factory. nidhi-singh02-agent-router and leepokai-jev-guard decide which agent or tool runs next; this CLI teaches a function definition until uncertain rows stop embarrassing you in prod. featherless-simple-jev and jaredpalmer-kev ship open inference; jev-align assumes you are fine with TypeSafe, Vercel, or Cloudflare Jev routes while GEPA rewrites prompts and class maps. Pair with classifier.dev when you only need a hosted gate, or cross-read nokia-applied-research-anyjev when your bottleneck is open-weight calibration instead of function authoring.",
    keyFeatures: [
      "Interactive `jeva` CLI with guided setup and three bundled examples",
      "Binary, Multiclass, Multilabel, and Score task types with flag parity",
      "GEPA optimization with separate reflection model configuration",
      "TypeSafe, Vercel AI Gateway, or Cloudflare Workers AI Jev backends",
      "Portable AI Functions shareable via ai-functions.dev",
    ],
    stack: [
      "Python 3.11+",
      "uv or pip",
      "TypeSafe Jev or gateway backends",
      "GEPA",
      "LiteLLM-compatible reflection models",
    ],
    links: {
      repo: "https://github.com/sutro-sh/jev-align",
      docs: "https://github.com/sutro-sh/jev-align#quick-start",
      website: "https://ai-functions.dev",
    },
    pricingNote:
      "Open source CLI; you pay TypeSafe, gateway, and reflection LLM usage per optimize round and runtime calls.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "classifier-dev",
      "togethercomputer-tev1",
      "nokia-applied-research-anyjev",
      "githubnext-localjev",
      "featherless-simple-jev",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is jev-align the same as the jeva chat skill router?",
        answer:
          "No. This repo is Sutro's dataset-driven GEPA loop for AI Functions on Jev. Skill routers pick tools; jev-align improves a single typed function from labels.",
      },
      {
        question: "Do I need TYPESAFE_API_KEY?",
        answer:
          "Not if you configure Vercel AI Gateway or Cloudflare Workers AI backends. README says the chosen provider is saved with the function for later runtime calls.",
      },
      {
        question: "What does GEPA change?",
        answer:
          "GEPA proposes definition diffs from your labels and rationales. You review every proposal; README explicitly rejects auto-accept on training score alone.",
      },
    ],
    metaTitle: "jev-align: Sutro CLI to calibrate Jev AI Functions with GEPA",
    metaDescription:
      "sutro-sh/jev-align (PyPI jev-align) labels uncertain rows, runs GEPA, and ships portable AI Functions on TypeSafe, Vercel, or Cloudflare Jev backends.",
  },

  "nokia-applied-research-anyjev": {
    slug: "nokia-applied-research-anyjev",
    status: "published",
    problem:
      "Raw next-token logits from general LLMs flip when you shuffle options and lie about confidence, so automation thresholds become roulette.",
    targetUser:
      "Teams serving open weights on vLLM or Hugging Face who want Jev-style typed decisions with real probabilities and optional 100 to 300 label head fits, without a full Qwen fine-tune.",
    overview:
      "AnyJev (github.com/nokia-applied-research/AnyJev, Apache-2.0, PyPI anyjev 0.0.2) from Nokia Applied Research with Tencent Hunyuan coauthors turns hub models into typed deciders: `Question.choice`, yes/no, and score rubrics return distributions you can threshold. Levels raw, L0, L1, and L2 add position-bias fixes and calibration; L2 fits a closed-form head on hidden states (often after `python -m anyjev.truncate`). README banner on BANKING77 cites order-flip rate 0.230 to 0.073 at L0 with zero labels and auto-decidable share at 5% error rising from 7.7% raw to 52.0% with labels. `python -m anyjev.pipeline` truncates, serves, fits, and measures accuracy, ECE, and latency on your machine.",
    creator: {
      name: "Nokia Applied Research",
      handle: "nokia-applied-research",
      githubUrl: "https://github.com/nokia-applied-research",
      company: "Nokia",
    },
    jevUsage: {
      flowRole:
        "Decider over vLLM or HF backends: cyclic option shifts at L0, temperature at L1, linear head on hidden states at L2",
      primitives: ["Choice", "Noul", "Score"],
      stateIn:
        "Plain-text state strings plus `Question` definitions with named criteria lists or rubric levels per README Python API.",
      decisionOut:
        "Per-question probability maps (for example route.distribution on billing vs technical) with documented calibration metrics on held-out sets.",
      flowSteps: [
        "pip install anyjev[hf] and optionally truncate blocks with python -m anyjev.truncate",
        "Serve with vLLM embed pooler for L2 or generate task for raw/L0/L1",
        "Decider.fit_head on 100 to 300 labels for L2, or run zero-label L0",
        "decide() on live traffic; optional unlabelled maintenance per README routing docs",
      ],
      sourcedMetrics: [
        {
          claim:
            "README BANKING77 table lists raw order-flip 0.230 vs L0 0.073 with zero labels, ECE 0.240 raw vs 0.095 L1, and auto-decidable at 5% error 7.7% raw vs 52.0% with labels.",
          source: "github.com/nokia-applied-research/AnyJev README banner and results table",
        },
        {
          claim:
            "README states L2 head fit on 100 to 300 labels is a closed-form solve with no gradient updates to base weights.",
          source: "github.com/nokia-applied-research/AnyJev README With labels L2",
        },
        {
          claim:
            "Public GitHub repo nokia-applied-research/AnyJev had 601 stars and 84 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "AnyJev is the research-grade open stack when you refuse Jared Palmer-sized fine-tunes but still want probabilities that survive option reordering. jaredpalmer-kev and togethercomputer-tev1 bet on trained Qwen checkpoints; featherless-simple-jev assembles logits from arbitrary HF models without Nokia's L0 rotation math. wfzyx-von is a purpose-built encoder; AnyJev wraps models you already host. theoleecj-semif chases full System One servers; AnyJev's Decider API targets pipeline operators measuring ECE on BANKING77 before they wire agents. Cross-link githubnext-localjev for Mac bridges that fake System One with chat JSON instead of logit reads.",
    keyFeatures: [
      "Decider + Question.choice Python API with vLLM and HF backends",
      "L0/L1/L2 levels documented with flip-rate and calibration tables",
      "truncate and pipeline CLIs for serve-measure loops on your hardware",
      "Prebuilt heads in anyjev-heads (~100 KB each) for select Qwen3 sizes",
      "Apache-2.0 with PyPI anyjev and CI workflow in repo",
    ],
    stack: [
      "Python",
      "vLLM embed and generate servers",
      "Hugging Face transformers",
      "PyPI anyjev",
    ],
    links: {
      repo: "https://github.com/nokia-applied-research/AnyJev",
      docs: "https://github.com/nokia-applied-research/AnyJev#-serve-it",
      website: "https://pypi.org/project/anyjev/",
    },
    pricingNote:
      "Open source library; you pay for GPUs, vLLM hosting, and label collection.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "jaredpalmer-kev",
      "wfzyx-von",
      "featherless-simple-jev",
      "togethercomputer-tev1",
      "theoleecj-semif",
      "sutro-sh-jev-align",
      "githubnext-localjev",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "How is AnyJev different from featherless-simple-jev?",
        answer:
          "Simple Jev builds classifier HTTP from logits on Featherless or your HF server. AnyJev adds L0 rotation debiasing, optional L2 heads, and pipeline measurement focused on calibration, not just API shape.",
      },
      {
        question: "Do I need labels?",
        answer:
          "L0 works with zero labels for large flip-rate gains per README. L1 and L2 expect on the order of 100 to 500 labels for temperature and head fits.",
      },
      {
        question: "Is this TypeSafe hosted Jev?",
        answer:
          "No. AnyJev is Nokia's open research code on models you serve. Compare numbers locally with python -m anyjev.pipeline before trusting banner benchmarks.",
      },
    ],
    metaTitle: "AnyJev: turn open LLMs into calibrated Jev-style deciders",
    metaDescription:
      "nokia-applied-research/AnyJev fits heads on vLLM hidden states, fixes option-order flips at L0, and documents BANKING77 calibration tables. PyPI anyjev.",
  },

  "githubnext-localjev": {
    slug: "githubnext-localjev",
    status: "published",
    problem:
      "Mac builders want System One-shaped HTTP without shipping screenshots to TypeSafe, but DiffusionGemma on oMLX lacks OpenJev's structured logit read primitives.",
    targetUser:
      "Developers running Bun 1.2+, oMLX with diffusiongemma-26B-A4B-it-4bit, and TypeSafe SDK clients pointed at localhost.",
    overview:
      "LocalJev (github.com/githubnext/localjev, MIT) is GitHub Next's TypeScript bridge that exposes POST /v1/systemone on port 8080 by default. It translates shared state plus Choice, Score, and Noul questions into classification prompts, asks an OpenAI-compatible chat endpoint (defaults: upstream http://127.0.0.1:8000, model diffusiongemma-26B-A4B-it-4bit), validates JSON probability output with retries, normalizes vectors, and returns Jev-compatible envelopes. README is explicit: wire-compatible with System One, not logit-equivalent to OpenJev's one-step structured read. GET /ready checks upstream model availability; jev-latest and jev-preview aliases satisfy SDK defaults.",
    creator: {
      name: "GitHub Next",
      handle: "githubnext",
      githubUrl: "https://github.com/githubnext",
    },
    jevUsage: {
      flowRole:
        "Local Bun server maps System One JSON to chat prompts and back with schema validation",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Standard System One body: model alias, state string, and questions map with choice, score, or noul criteria per README curl.",
      decisionOut:
        "Jev-shaped choices, expected scores, and entropy-based confidence from model-reported JSON probabilities after normalize and retry logic.",
      flowSteps: [
        "Run oMLX (or other OpenAI-compatible server) with configured DiffusionGemma checkpoint",
        "bun install, copy .env, set LOCALJEV_UPSTREAM_API_KEY, bun run start on :8080",
        "curl /ready then POST /v1/systemone or point typesafe_sdk at TYPESAFE_BASE_URL",
        "Tune LOCALJEV_QUESTIONS_PER_CALL and MALFORMED_RETRIES for your workload calibration",
      ],
      sourcedMetrics: [
        {
          claim:
            "README states probabilities are generated or self-reported by the model, not read from logits, and recommends evaluating calibration before consequential gates.",
          source: "github.com/githubnext/localjev README Why a bridge is needed",
        },
        {
          claim:
            "Defaults document upstream :8000, LocalJev :8080, LOCALJEV_MAX_INFLIGHT 2, LOCALJEV_MALFORMED_RETRIES 2, and chunking limits 16 questions / 128 outcomes per call.",
          source: "github.com/githubnext/localjev README Configuration table",
        },
        {
          claim:
            "Public GitHub repo githubnext/localjev had 771 stars and 49 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "LocalJev is the honest Mac compromise: keep TypeSafe SDK code, accept that probabilities came from a prompted JSON scalar instead of OpenJev's diffusion read. featherless-simple-jev and jaredpalmer-kev chase logit-native servers; githubnext-localjev meets oMLX where it is today. theoleecj-semif and wfzyx-von are alternative open stacks if you can leave DiffusionGemma. nokia-applied-research-anyjev is for vLLM operators measuring ECE; LocalJev is for curl-friendly localhost demos with documented limitations. Read docs/evaluation-results-2026-09-18.md before you trust bake-off rankings on your ticket queue.",
    keyFeatures: [
      "POST /v1/systemone and /ready on Bun with .env driven config",
      "TypeSafe Python SDK works with TYPESAFE_BASE_URL and dummy API key",
      "Malformed JSON retries and per-call question chunking",
      "OpenJev vs oMLX gap explained with LM Studio status notes in README",
      "Evaluation guide and September 2026 bake-off report in docs/",
    ],
    stack: [
      "TypeScript",
      "Bun 1.2+",
      "oMLX OpenAI-compatible chat",
      "DiffusionGemma",
      "typesafe_sdk client",
    ],
    links: {
      repo: "https://github.com/githubnext/localjev",
      docs: "https://github.com/githubnext/localjev#run-with-omlx",
    },
    pricingNote:
      "Open source MIT server; inference cost is your local oMLX GPU time, not TypeSafe tokens.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "jaredpalmer-kev",
      "featherless-simple-jev",
      "theoleecj-semif",
      "wfzyx-von",
      "nokia-applied-research-anyjev",
      "sutro-sh-jev-align",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is LocalJev the same as OpenJev?",
        answer:
          "No. README contrasts OpenJev's patched vLLM structured read with this chat-prompt bridge. Expect similar JSON shape, different probability semantics.",
      },
      {
        question: "Which upstream server works?",
        answer:
          "Defaults target oMLX on port 8000. Any OpenAI-compatible chat API works if you set LOCALJEV_UPSTREAM and model env vars.",
      },
      {
        question: "Can I use the TypeSafe SDK?",
        answer:
          "Yes. README shows TypeSafeClient with TYPESAFE_BASE_URL http://127.0.0.1:8080 and any API key unless LOCALJEV_API_KEY is set.",
      },
    ],
    metaTitle: "LocalJev: GitHub Next Bun bridge for local System One API",
    metaDescription:
      "githubnext/localjev serves POST /v1/systemone over oMLX DiffusionGemma chat. Wire-compatible Jev JSON with README honesty about calibration vs OpenJev.",
  },

  "typellm-typellm": {
    slug: "typellm-typellm",
    status: "published",
    problem:
      "Autoregressive LLMs excel at prose but leak invalid JSON, wrong enum labels, and option-order bias when you force them to behave like classifiers.",
    targetUser:
      "Engineers already serving open models on SGLang who want schema-guaranteed fields without swapping to a dedicated System One checkpoint.",
    overview:
      "TypeLLM (github.com/TypeLLM/TypeLLM, Apache-2.0, typellm.ai) adds type-safe generation on top of existing autoregressive weights via SGLang constrained decoding and JSON Schema. pip install typellm exposes TypeLLMClient against an HTTP SGLang endpoint: string, integer, number, boolean, and enum fields with optional thinking budgets, image input for VLMs, depends_on dependency graphs with shared-prefix KV reuse, and permutation averaging on enum questions. It is inspired by TypeSafe Jev interface ideas but is not a one-step decision head: you keep native generation while outputs stay in schema. Public JevBench evals report 195/231 tasks without thinking and 228/231 with thinking on 231 public tasks (see evals/jevbench in the repo).",
    creator: {
      name: "TypeLLM",
      handle: "TypeLLM",
      githubUrl: "https://github.com/TypeLLM",
      companyUrl: "https://typellm.ai",
    },
    jevUsage: {
      flowRole:
        "Constrained autoregressive decode over shared context instead of POST /v1/systemone on a decision model",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Free-form context string (plus optional images for vision models) and a questions map with JSON Schema types, instructions, enums, and depends_on edges per typellm.ai docs.",
      decisionOut:
        "Schema-valid values and enum distributions; JevBench-style tasks map enums to choices and numeric rubrics to scores without answer-token prose.",
      flowSteps: [
        "Serve a compatible model with SGLang prefix caching enabled",
        "pip install -U typellm and point TypeLLMClient at the SGLang base URL",
        "Declare questions with types, optional thinking, and dependency graphs",
        "Run generate(); reuse KV for shared prefixes and optional permutation averaging on enums",
      ],
      sourcedMetrics: [
        {
          claim:
            "JevBench README reports 195/231 public tasks correct without thinking and 228/231 with thinking on Qwen3.8-27B configuration documented in evals/jevbench.",
          source: "github.com/TypeLLM/TypeLLM evals/jevbench/README.md",
        },
        {
          claim:
            "README lists negligible output-token cost for categorical fields, depends_on graphs, image input, and permutation averaging blog at typellm.ai/blog/fair-die.",
          source: "github.com/TypeLLM/TypeLLM README",
        },
        {
          claim:
            "Public GitHub repo TypeLLM/TypeLLM had about 606 stars when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "TypeLLM competes in the same mental lane as typed decisions but through constrained AR on models you already host, not a frozen decision checkpoint. nokia-applied-research-anyjev and featherless-simple-jev chase logit-native or head-fitted probabilities on vLLM; githubnext-localjev fakes System One with chat JSON. TypeLLM is for teams that refuse a second model class yet still want JevBench-shaped guarantees on enums and rubrics. Read evals/jevbench/METHOD.md before you equate bench accuracy with production calibration on your tickets.",
    keyFeatures: [
      "TypeLLMClient over SGLang with string, int, number, boolean, and enum outputs",
      "depends_on graphs and shared-prefix reuse documented September 2026",
      "Optional thinking mode and vision image input for Qwen VL checkpoints",
      "Permutation averaging for fairer enum distributions",
      "Published JevBench per-task answers and METHOD.md in the repo",
    ],
    stack: ["Python", "SGLang", "JSON Schema", "typellm PyPI package"],
    links: {
      website: "https://typellm.ai",
      repo: "https://github.com/TypeLLM/TypeLLM",
      docs: "https://typellm.ai/docs",
    },
    pricingNote:
      "Open source Apache-2.0 client; you pay for your own SGLang GPU hosting.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "nokia-applied-research-anyjev",
      "featherless-simple-jev",
      "githubnext-localjev",
      "theoleecj-semif",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is TypeLLM a System One server?",
        answer:
          "No. It constrains autoregressive generation via SGLang. You do not get POST /v1/systemone unless you wrap it yourself.",
      },
      {
        question: "How does it relate to JevBench?",
        answer:
          "The repo ships a full JevBench run with per-task logs. Scores measure schema-typed answers on public tasks, not hosted api.typesafe.ai latency.",
      },
      {
        question: "Do I need to retrain my LLM?",
        answer:
          "README emphasizes no architecture or weight changes; compatibility depends on serving the base model through SGLang with the documented features.",
      },
    ],
    metaTitle: "TypeLLM: type-safe SGLang generation with JevBench evals",
    metaDescription:
      "TypeLLM adds type-safe SGLang generation with JSON Schema, depends_on graphs, and enums. JevBench 228/231 with thinking; pip install typellm.",
  },

  "rizzo-ai-academy-rizzo-flow": {
    slug: "rizzo-ai-academy-rizzo-flow",
    status: "published",
    problem:
      "Developers want Jev-shaped probabilities on localhost without api.typesafe.ai bills, but chat-json bridges and unrelated classifiers do not ship open decision weights.",
    targetUser:
      "Builders with Python 3.11+, uv, and a GPU or CPU backend who want POST /v1/systemone and /v1/decisions against Spark-X2.5 on llama.cpp.",
    overview:
      "Rizzo Flow (github.com/Rizzo-AI-Academy/rizzo-flow, Apache-2.0) is an independent local server that maps unstructured state plus Choice, Score, and Noul questions to probabilities with zero generated answer tokens on llama.cpp. README states it is not affiliated with TypeSafe and does not reproduce proprietary Jev architecture; it follows the interface pattern with Spark-X2.5 plus a September 2026 LoRA fine-tune for typed decisions. uv sync, rizzo download, and rizzo serve default to http://127.0.0.1:8017 with a playground UI. curl examples hit POST /v1/systemone; rizzo decide runs one-off JSON. Backends include Metal, CUDA, Vulkan, ROCm, SYCL, and CPU. Fine-tune tables on LocalLLaMA/typed-decisions show accuracy 0.648 vs 0.574 base Spark at Q8_0, with explicit uncalibrated probability warnings unless you calibrate locally.",
    creator: {
      name: "Rizzo AI Academy",
      handle: "Rizzo-AI-Academy",
      githubUrl: "https://github.com/Rizzo-AI-Academy",
      companyUrl: "https://www.rizzoaiacademy.com",
    },
    jevUsage: {
      flowRole:
        "Local llama.cpp inference exposing TypeSafe-compatible System One HTTP on port 8017",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "JSON state string plus questions map with type choice, score, or noul, instructions, and criteria per README curl and playground examples.",
      decisionOut:
        "Parallel typed answers with probability vectors; README emphasizes 0 generated tokens on the decision path.",
      flowSteps: [
        "git clone, uv sync --locked, uv run rizzo download for runtime plus Q8_0 weights",
        "uv run rizzo serve for daemon and playground on :8017",
        "POST /v1/systemone or /v1/decisions from TypeSafe-shaped clients",
        "Optional rizzo decide path for single JSON files without keeping the server up",
      ],
      sourcedMetrics: [
        {
          claim:
            "typed-decisions benchmark table documents Rizzo Flow 4B fine-tune at accuracy 0.648, KL 0.452, Brier 0.205, ECE 0.112 vs base Spark 0.574 accuracy at same Q8_0 GPU setup.",
          source: "github.com/Rizzo-AI-Academy/rizzo-flow README fine-tuning section",
        },
        {
          claim:
            "Badge and Snake demo cite about 50 ms per decision at Q8_0 on RTX 5060 Ti and about 150 ms round trip in recorded Snake gameplay with caveats on hardware.",
          source: "github.com/Rizzo-AI-Academy/rizzo-flow README",
        },
        {
          claim:
            "Public GitHub repo had about 489 stars when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Rizzo Flow is the open-weights counterpoint to hosted System One: same HTTP verbs, different training story than Jared Palmer Kev or Together tev1. githubnext-localjev still prompts a chat model for JSON; Rizzo runs a dedicated fine-tuned Spark head on llama.cpp. wfzyx-von and jaredpalmer-kev are alternative checkpoints; theoleecj-semif documents another local server narrative. nokia-applied-research-anyjev fits heads on models you already serve on vLLM. Treat README calibration disclaimers seriously before you wire refund gates.",
    keyFeatures: [
      "POST /v1/systemone and /v1/decisions on llama.cpp with playground UI",
      "Spark-X2.5 4B and 1.7B downloads with resumable rizzo download",
      "September 2026 LoRA fine-tune with published typed-decisions metrics",
      "Snake and ticket demos at real-time latencies with documented caveats",
      "Explicit not affiliated with TypeSafe disclaimer and uncalibrated probability notes",
    ],
    stack: [
      "Python 3.11+",
      "uv",
      "llama.cpp",
      "Spark-X2.5",
      "LoRA fine-tune",
    ],
    links: {
      website: "https://rizzo-ai-academy.github.io/rizzo-flow/",
      repo: "https://github.com/Rizzo-AI-Academy/rizzo-flow",
      docs: "https://rizzo-ai-academy.github.io/rizzo-flow/",
    },
    pricingNote:
      "Apache-2.0 open source; inference cost is your local hardware and electricity.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "githubnext-localjev",
      "wfzyx-von",
      "jaredpalmer-kev",
      "theoleecj-semif",
      "nokia-applied-research-anyjev",
    ],
    relatedLearnSlugs: ["system-one", "jev-typesafe"],
    faq: [
      {
        question: "Is Rizzo Flow official TypeSafe Jev?",
        answer:
          "No. README labels the project independent, inspired by SemIf, with open Spark weights and interface compatibility only.",
      },
      {
        question: "Which endpoint should TypeSafe SDK clients use?",
        answer:
          "Point TYPESAFE_BASE_URL at http://127.0.0.1:8017 and call the same System One shapes documented in README curl examples.",
      },
      {
        question: "Are the probabilities production calibrated?",
        answer:
          "README states they are uncalibrated unless you calibrate on your data. Compare ECE on your holdout before hard thresholds.",
      },
    ],
    metaTitle: "Rizzo Flow: local llama.cpp Jev-compatible decision server",
    metaDescription:
      "Rizzo-AI-Academy/rizzo-flow serves Spark-X2.5 LoRA on :8017 with POST /v1/systemone, zero answer tokens, typed-decisions bench tables, and playground UI.",
  },

  "tianyucodings-jevharness": {
    slug: "tianyucodings-jevharness",
    status: "published",
    problem:
      "Agent loops that ask a large LLM to reason on every action are too slow and too expensive for tight control tasks, yet hand-written Jev criteria rot when the task changes.",
    targetUser:
      "Teams using Claude Code or Codex plugins who want an LLM to author a task harness once, then rely on fast Jev calls at runtime with optional GEPA-style evolution.",
    overview:
      "JevHarness (github.com/TianyuCodings/JevHarness) lets an authoring LLM write Python harness code: feature extractors, Jev question graphs, and control flow that turns observations into actions. After you freeze the selected harness, execution calls Jev for fuzzy decisions without invoking the authoring model each step. Optional reward reflection and GEPA integration compare parent and child harnesses on training batches and evaluate accepted proposals on Eval. The shipped Pokémon demo archives a full evolution tree: README reports Eval win rate improving from 25% (3/12) to 75% (9/12) after five reflection rounds on the selection set, with latency tables for the archived harness. Companion research to NanoJev on game decisions, but this product is harness authoring, not training a 0.6B unified head. Site: jev-harness.tianyuchen99.chatgpt.site with offline archive viewer.",
    creator: {
      name: "Tianyu Codings",
      handle: "TianyuCodings",
      githubUrl: "https://github.com/TianyuCodings",
      companyUrl: "https://jev-harness.tianyuchen99.chatgpt.site",
    },
    jevUsage: {
      flowRole:
        "Frozen harness code batches choice, score, and noul Jev requests per observation",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Task-specific JSON state built by harness features plus parallel questions with instructions and criteria, as in docs/examples/pokemon-turn12-jev.json.",
      decisionOut:
        "Typed answers with probability maps and confidence; harness maps the winning action ID to environment commands.",
      flowSteps: [
        "Install jev-harness Claude Code plugin or skill for your task contract",
        "Authoring LLM proposes PipelineSpec harness code and Jev graphs",
        "Optional reflection uses full trajectories and rewards to mutate harnesses",
        "Freeze selected harness; PipelineRuntime executes Jev nodes on each observation",
      ],
      sourcedMetrics: [
        {
          claim:
            "Pokémon Eval example: win rate 25% (3/12) initial harness vs 75% (9/12) selected harness after five reflection rounds on the documented selection set.",
          source: "github.com/TianyuCodings/JevHarness README",
        },
        {
          claim:
            "Archived Eval timings: selected harness full decision median 568 ms, individual Jev request median 269 ms, with cache-excluded samples documented.",
          source: "github.com/TianyuCodings/JevHarness README Latency section",
        },
        {
          claim:
            "Public GitHub repo had about 255 stars when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "JevHarness treats hosted or local System One as the fast judge inside code the LLM wrote for your task. tianyucodings-nanojev trains tiny parallel heads on game trajectories; JevHarness keeps the general LLM for authoring and uses stock Jev for runtime fuzzy picks. sutro-sh-jev-align optimizes TypeSafe AI Functions on labeled rows; JevHarness evolves whole harness programs with GEPA on episodic rewards. Do not duplicate NanoJev as a tools page: link the benchmark for model research, use this listing for harness workflows.",
    keyFeatures: [
      "Claude Code plugin marketplace install jev-harness@jevharness",
      "PipelineSpec validation and PipelineRuntime execution path",
      "Optional GEPA parent selection with recorded ancestry and rejects",
      "Pokémon archived battles, evolution tree, and latency API on the demo site",
      "Lossless trace archives for reflection without truncating oversized inputs",
    ],
    stack: [
      "Python harness runtime",
      "TypeSafe Jev API",
      "GEPA integration",
      "Claude Code plugin",
      "Node static site viewer",
    ],
    links: {
      website: "https://jev-harness.tianyuchen99.chatgpt.site",
      repo: "https://github.com/TianyuCodings/JevHarness",
      docs: "https://github.com/TianyuCodings/JevHarness#how-it-works",
      demo: "https://jev-harness.tianyuchen99.chatgpt.site/?autoplay=1#paired-archive",
    },
    pricingNote:
      "Open repository; Jev API usage bills per your TypeSafe or compatible endpoint during harness runs.",
    firstSeen: "2026-09-25",
    relatedSlugs: ["tianyucodings-nanojev", "sutro-sh-jev-align", "nokia-applied-research-anyjev"],
    relatedLearnSlugs: ["system-one", "use-cases"],
    faq: [
      {
        question: "Is this the same product as NanoJev?",
        answer:
          "No. NanoJev trains a small unified decision model on games. JevHarness authors task code that calls Jev. NanoJev stays on /benchmarks/tianyucodings-nanojev.",
      },
      {
        question: "Does the authoring LLM run every turn in production?",
        answer:
          "No. README emphasizes freeze the selected harness so runtime is harness code plus Jev calls only.",
      },
      {
        question: "Are the Pokémon win rates universal?",
        answer:
          "README labels them example results on the Eval selection set, not independent OOD guarantees.",
      },
    ],
    metaTitle: "JevHarness: LLM-authored Jev harnesses with GEPA evolution",
    metaDescription:
      "TianyuCodings/JevHarness freezes task harnesses that batch Jev choice, score, and noul calls. Pokémon demo 25% to 75% Eval wins, latency tables, Claude plugin.",
  },

  "ollaya-dev-ollaya": {
    slug: "ollaya-dev-ollaya",
    status: "published",
    problem:
      "Pulling each open decision checkpoint by hand means different serve flags, ONNX exports, and SDK base URLs for Laya, Kev, Von, and friends.",
    targetUser:
      "Developers who want Ollama-like pull and run for decision models with TypeSafe SDK compatibility on localhost:11435.",
    overview:
      "ollaya (github.com/ollaya-dev/ollaya, Apache-2.0, ollaya.dev) is a Rust CLI and daemon that downloads small ONNX graphs (about 3 MB each), verifies upstream Hugging Face weight blobs by sha256, and serves choice, score, and noul questions over POST /v1/systemone, /v1/decisions, and GET /v1/models. curl install.sh, then ollaya run laya --preset triage on a ticket string prints intent bars in milliseconds. TYPESAFE_BASE_URL=http://localhost:11435 works with the official SDK unchanged. Registry includes laya routers, decider, kev, von, nli, gliclass, and qwen3guard without re-hosting author weights. ollaya mcp and the ollaya-decisions skill target agent clients. Modelfiles bake question sets into custom tags.",
    creator: {
      name: "ollaya",
      handle: "ollaya-dev",
      githubUrl: "https://github.com/ollaya-dev",
      companyUrl: "https://ollaya.dev",
    },
    jevUsage: {
      flowRole:
        "Local ONNX decision runtime exposing TypeSafe wire-identical System One HTTP",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "JSON state plus typed questions; CLI presets and Modelfile QUESTIONS JSON for bundled triage sets per README.",
      decisionOut:
        "Calibrated probability bars per question in one forward pass without text generation.",
      flowSteps: [
        "Install via ollaya.dev/install.sh and start ollaya serve on port 11435",
        "ollaya pull kev or ollaya run laya --preset triage on sample text",
        "Point TypeSafe clients at TYPESAFE_BASE_URL=http://localhost:11435",
        "Optional ollaya mcp for Claude Code, Cursor, and Desktop agent tooling",
      ],
      sourcedMetrics: [
        {
          claim:
            "README documents laya:en at 8 to 10 ms for five questions on RTX 4090 and fp32 parity with PyTorch on 100% of 2,383 questions per checkpoint.",
          source: "github.com/ollaya-dev/ollaya README Models and Features",
        },
        {
          claim:
            "decider:0.8b listed at 0.591 accuracy on typed-decisions in the model table.",
          source: "github.com/ollaya-dev/ollaya README Models table",
        },
        {
          claim:
            "Public GitHub repo had about 153 stars when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "ollaya is infrastructure, not another Laya marketing page: one daemon serves many open decision checkpoints with the same HTTP shape. jaredpalmer-kev and wfzyx-von remain the authoritative repos for those models; ollaya pulls verified ONNX wrappers. togethercomputer-tev1 is a training recipe on Together; ollaya is local pull and serve. githubnext-localjev bridges chat JSON on Mac; ollaya runs native decision graphs. Do not list Laya itself again here; use ollaya when the story is runtime packaging.",
    keyFeatures: [
      "Ollama-style pull, list, ps, run, and Modelfile create workflow",
      "TypeSafe-compatible /v1/systemone on default port 11435",
      "Weights stay on author HF repos; ollaya ships pinned ONNX graphs only",
      "MCP server and ollaya-decisions agent skill",
      "Desktop app and Docker cuda images on ollaya.dev/download",
    ],
    stack: ["Rust", "ONNX Runtime", "CUDA and CPU", "TypeSafe HTTP contract"],
    links: {
      website: "https://ollaya.dev",
      repo: "https://github.com/ollaya-dev/ollaya",
      docs: "https://ollaya.dev/docs",
      demo: "https://ollaya.dev/search",
    },
    pricingNote:
      "Apache-2.0 binary; model licenses follow each upstream author listed in README.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "jaredpalmer-kev",
      "wfzyx-von",
      "togethercomputer-tev1",
      "githubnext-localjev",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Does ollaya replace downloading Kev or Von directly?",
        answer:
          "It wraps upstream weights with ONNX graphs and a unified CLI. Author repos remain the source of truth for training details.",
      },
      {
        question: "Will this create a duplicate Laya tools page?",
        answer:
          "This listing covers the ollaya runtime only. It does not re-publish Convai Laya as a separate product profile.",
      },
      {
        question: "Which port should SDK users set?",
        answer:
          "README documents TYPESAFE_BASE_URL=http://localhost:11435 for wire-identical System One calls.",
      },
    ],
    metaTitle: "ollaya: Ollama-style CLI for open decision models",
    metaDescription:
      "ollaya pulls ONNX decision graphs and serves POST /v1/systemone on :11435 for Laya, Kev, Von, and Decider. Verified Hugging Face weights and MCP.",
  },

  "liuziyu77-valen": {
    slug: "liuziyu77-valen",
    status: "published",
    problem:
      "Text-only Von, Kev, and tev1 checkpoints cannot score visual state, yet multimodal agents still need thresholdable probabilities instead of long reasoning traces.",
    targetUser:
      "Researchers and builders training or serving Qwen3.5-backed System One models with image and video inputs via Hugging Face Valen-Preview-0923.",
    overview:
      "Valen (github.com/Liuziyu77/Valen, Apache-2.0) trains multimodal System One models: text, images, and video in; choice, score, and noul style probabilities out without answer-token decoding. Qwen3.5-0.8B or 2B backbones share a decision head; Valen-Preview-0923 ships on Hugging Face Valen-Team/Valen-Preview-0923 with Spaces demo, General 100k training data, and game eval sets. README Sokoban comparison claims Valen solves a level in 9 decisions with 1.13 s cumulative latency vs Qwen3.8-27B-FP8 at 198.05 s in thinking mode on the same puzzle (project demo, not independent lab proof). Blur-confidence GIF documents 91.6% confidence clear vs 19.2% at strongest blur. Repo includes SFT and experimental RLCD configs, valen.train, valen.inference, and valen.evaluate CLIs.",
    creator: {
      name: "Valen Team",
      handle: "Liuziyu77",
      githubUrl: "https://github.com/Liuziyu77",
      companyUrl: "https://huggingface.co/Valen-Team",
    },
    jevUsage: {
      flowRole:
        "Multimodal forward pass scoring supplied candidates with a shared decision head",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "JSONL records with messages content arrays for text, image_url, or video plus questions maps per README smoke and eval schemas.",
      decisionOut:
        "Probability distributions over listed criteria keys; zero generated answer tokens on the decision path.",
      flowSteps: [
        "hf download Valen-Preview-0923 and matching Qwen3.5-2B base weights",
        "python -m valen.inference --checkpoint models/Valen-Preview-0923 on JSONL tasks",
        "python -m valen.evaluate for General 5k or game sets documented in README",
        "Optional SFT or RLCD training via configs/train per docs/technical.md",
      ],
      sourcedMetrics: [
        {
          claim:
            "README Sokoban demo: Valen-Preview-0923 9 decisions and 1.13 s cumulative latency vs Qwen3.8-27B-FP8 198.05 s thinking on the same level (project-reported).",
          source: "github.com/Liuziyu77/Valen README demo comparison",
        },
        {
          claim:
            "Blur demo reports 91.6% decision confidence on clear image vs 19.2% at strongest Gaussian blur in project GIF.",
          source: "github.com/Liuziyu77/Valen README blur-confidence section",
        },
        {
          claim:
            "Public GitHub repo Liuziyu77/Valen had about 164 stars when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Valen extends the open decision model lane into vision: same candidate scoring story as jaredpalmer-kev and togethercomputer-tev1, but tensors include frames. tianyucodings-nanojev benchmarks tiny parallel heads on games; Valen targets general multimodal VQA plus Sokoban eval sets with published datasets. wfzyx-von remains text encoder speed king; Valen trades modality breadth for training complexity. Use the HF Space before you commit GPUs to a custom SFT run.",
    keyFeatures: [
      "Valen-Preview-0923 weights and Qwen3.5 base pairing documented on HF",
      "Hugging Face Space demo and General 100k plus game dataset cards",
      "python -m valen.train, inference, and evaluate entry points",
      "SFT warmup and experimental RLCD configs under configs/train",
      "Project demos for Sokoban latency, blur confidence, and four parallel games",
    ],
    stack: [
      "Python 3.10+",
      "Qwen3.5-0.8B and 2B",
      "Hugging Face weights",
      "SFT and RLCD training",
    ],
    links: {
      repo: "https://github.com/Liuziyu77/Valen",
      docs: "https://github.com/Liuziyu77/Valen/blob/main/docs/technical.md",
      demo: "https://huggingface.co/spaces/yuhangzang/Valen-Preview-0923",
      website: "https://huggingface.co/Valen-Team/Valen-Preview-0923",
    },
    pricingNote:
      "Apache-2.0 code; inference and training spend your own GPU hours and HF bandwidth.",
    firstSeen: "2026-09-25",
    relatedSlugs: [
      "tianyucodings-nanojev",
      "jaredpalmer-kev",
      "togethercomputer-tev1",
      "wfzyx-von",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Which base model do I need for Preview 0923?",
        answer:
          "README quick start downloads Valen-Preview-0923 and Qwen/Qwen3.5-2B into local models paths before inference.",
      },
      {
        question: "Is Valen a hosted TypeSafe product?",
        answer:
          "No. It is an open training and inference stack inspired by Jev with HF weights you serve yourself.",
      },
      {
        question: "How is this different from text-only Kev?",
        answer:
          "Valen accepts image and video content in state messages and scores candidates with a shared multimodal decision head.",
      },
    ],
    metaTitle: "Valen: multimodal System One with Qwen3.5 decision head",
    metaDescription:
      "Liuziyu77/Valen ships Valen-Preview-0923 on Hugging Face: vision and video in, choice probabilities out, SFT and RLCD training, Sokoban and blur demos.",
  },

  "droidrun-mobile-jev": {
    slug: "droidrun-mobile-jev",
    status: "published",
    problem:
      "Desktop browser and macOS computer-use demos dominate the Jev directory, while real Android automation still gets treated like a remote ADB script with no typed action menu.",
    targetUser:
      "Mobilerun operators who want a localhost React studio or CLI where Jev picks bounded mobile UI actions from device observations, not prose plans.",
    overview:
      "mobile-jev (github.com/droidrun/mobile-jev) is Droidrun's standalone agent for Mobilerun Android devices. Each loop observes accessibility state and installed apps, sends one TypeSafe request with operation plus speculative target heads, validates the winning branch, then executes through the Mobilerun API. A React studio on port 3040 streams the device, surfaces per-step latency, and keeps API keys server-side. The packaged dark-theme demo verifies the real Settings switch; the README Uber clip shows about 21 seconds for nine actions without claiming a completed booking.",
    creator: {
      name: "Droidrun",
      handle: "droidrun",
      githubUrl: "https://github.com/droidrun",
      company: "Mobilerun",
      companyUrl: "https://mobilerun.ai",
    },
    jevUsage: {
      flowRole:
        "Per-step mobile control routing (operation plus compatible target selection over observed UI)",
      primitives: ["Choice"],
      stateIn:
        "Indexed controls, installed-app inventory (up to 200 apps when not name-filtered), goal text, and prior executed actions from Mobilerun observations.",
      decisionOut:
        "OPEN_APP, TAP, TYPE_TEXT, scroll, navigation, WAIT, DONE, or BLOCKED with validated target indices; text spans are copied verbatim from the goal, not generated.",
      flowSteps: [
        "Observe device UI and app list through Mobilerun",
        "One Jev request chooses operation and speculative targets",
        "Executor rejects stale targets and records actions before the next read",
        "Mobilerun mutates the device; loop continues until stop, failure, or cancellation",
        "Demo runner re-observes to verify state (DONE alone is not proof)",
      ],
      sourcedMetrics: [
        {
          claim:
            "README Uber recording: about 21 seconds for 9 actions from SFO airport to Golden Gate Bridge payment screen; completed booking not demonstrated.",
          source: "github.com/droidrun/mobile-jev README",
        },
        {
          claim:
            "docs/DEMO.md exploratory dark-theme run: 8.685 seconds with three executed actions, five Jev calls, one stale decision rejected.",
          source: "github.com/droidrun/mobile-jev docs/DEMO.md",
        },
        {
          claim:
            "Public GitHub repo droidrun/mobile-jev had about 402 stars and 50 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Mobile Jev mirrors the Browser Use ultrafast split on a phone: finite operations over structured observations, with TYPE_TEXT fed from exact goal spans instead of a second generative model. Mobilerun owns transport and gestures; Jev owns which legal branch fires. The executor never retries a device mutation after an uncertain transport failure and treats Jev DONE as a hint, not QA. docs/DEMO.md documents why clock and travel flows need independent verifiers before you quote speed wins. Compare browser-use-jev-ultrafast for DOM tables in Chromium, awlevin-typesafe-computer-use for macOS accessibility loops, and moritzkremb-jev-voice-browser when the input is partial speech instead of a typed goal.",
    keyFeatures: [
      "React studio with @mobilerun/react stream, stop control, and in-memory run history",
      "CLI agent run, observe, screenshot, profile, and direct tap or type debug commands",
      "pnpm demo dark-theme with optional --reset baseline and --repeat batches",
      "Connection reuse, brief device readiness cache, and split request timing in traces",
      "Optional --confidence cutoff; MOBILERUN_TEXT_COMPLETION_MODE for field verification",
    ],
    stack: [
      "Node.js 22.16+ (24 recommended)",
      "pnpm 10.30.1",
      "Mobilerun API and React SDK",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/droidrun/mobile-jev",
      docs: "https://github.com/droidrun/mobile-jev/blob/main/docs/DEMO.md",
      demo: "https://github.com/droidrun/mobile-jev/blob/main/docs/media/uber-demo.mp4",
      website: "https://mobilerun.ai",
    },
    pricingNote:
      "Open source studio and agent; Mobilerun device usage and TypeSafe Jev calls bill to your keys.",
    firstSeen: "2026-09-26",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
      "moritzkremb-jev-voice-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Mobile Jev require ADB?",
        answer:
          "No. README states Mobilerun API control with no ADB connection required.",
      },
      {
        question: "Does Jev DONE mean the task succeeded?",
        answer:
          "README and docs/DEMO.md say DONE is not independent proof. The dark-theme demo re-reads the switch state; Uber demo stops before purchase.",
      },
      {
        question: "Can Jev invent passenger names or payment details?",
        answer:
          "No. README: text comes from exact spans in the goal or --text overrides; the agent does not generate arbitrary prose.",
      },
      {
        question: "Is the studio safe to expose on the public internet?",
        answer:
          "README binds to localhost and expects a single local operator. Public hosting needs your own auth and device authorization.",
      },
    ],
    metaTitle: "Mobile Jev: Mobilerun Android agent with typed Jev steps",
    metaDescription:
      "droidrun/mobile-jev runs TypeSafe Jev over Mobilerun observations with a React studio, CLI traces, and a verified dark-theme demo. Uber clip shows its limits.",
  },

  "gargpratyush-jev-router": {
    slug: "gargpratyush-jev-router",
    status: "published",
    problem:
      "Claude Code and Codex users on subscription tiers still default every fresh turn to the strongest model, paying latency and quota for tasks a fast tier could finish.",
    targetUser:
      "Developers already logged into Claude Code or OpenAI Codex who want jev-claude or jev-codex wrappers that route each new user turn to the cheapest sufficient model.",
    overview:
      "jev-router (github.com/gargpratyush/jev-router, npm jev-router v0.3.0) launches the real upstream CLIs unchanged. Before the first request of each user turn, it asks TypeSafe Jev which tier fits the prompt, rewrites the model field, and leaves tools, sessions, permissions, and auth with the native binary. jev-claude injects a status line in the model picker; jev-codex adds commentary lines and a temporary Jev Router provider entry. Manual model picks pause routing until you select Jev Router again.",
    creator: {
      name: "Pratyush Garg",
      handle: "gargpratyush",
      githubUrl: "https://github.com/gargpratyush",
    },
    jevUsage: {
      flowRole:
        "Per fresh user turn model tier Choice using task complexity, reasoning, tool, and context signals",
      primitives: ["Choice", "Score"],
      stateIn:
        "User prompt text for the new turn plus catalog metadata from the signed-in CLI (model ids, context token estimates). Tool-loop continuations skip routing.",
      decisionOut:
        "Selected fast, balanced, strong, or optional long tier mapped to account-native model ids; confidence and factors stored for /jev-explain.",
      flowSteps: [
        "Detect start of a fresh user turn in Claude Code or Codex",
        "Send prompt and tier catalog to TypeSafe per src/config.mjs",
        "Rewrite outgoing request model to chosen tier",
        "Surface decision on status line or Codex commentary",
        "Retain last 20 exchanges per session under OS temp for explain skill",
      ],
      sourcedMetrics: [
        {
          claim:
            "README: only the user's prompt text is sent to TypeSafe for routing; Jev adds latency on the first request of a turn, not tool-loop continuations.",
          source: "github.com/gargpratyush/jev-router README",
        },
        {
          claim:
            "README documents fail-open behavior: Jev failure never blocks the CLI.",
          source: "github.com/gargpratyush/jev-router README",
        },
        {
          claim:
            "Public GitHub repo gargpratyush/jev-router had about 427 stars and 50 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-router is the product-name answer for Claude Code model routing with Jev: wrap the CLI you already trust, do not replace it. nidhi-singh02-agent-router is the multi-agent desk with Herdr launches and quota policy filters before TypeSafe ranks Cursor, Codex, Claude Code, or OpenCode. miuuyy-astra-ares instead toggles reasoning effort inside a patched Codex binary. jev-router stays inside one CLI and optimizes model tier per turn. Use dbreunig-building-with-jev-skill when teammates need vocabulary for routing questions, and typesafe-ai-skills for maintained install patterns.",
    keyFeatures: [
      "Global npm jev-router with jev-claude and jev-codex entry points",
      "Bundled /jev-explain and $jev-explain from saved System One request bodies",
      "JEV_API_KEY or TYPESAFE_API_KEY via ~/.jev-router.env",
      "Preserves custom Claude statusLine unless JEV_NO_STATUSLINE=1",
      "Restores prior Claude default model on exit so plain claude stays untouched",
    ],
    stack: [
      "Node.js 20.12+",
      "Claude Code and OpenAI Codex CLIs",
      "TypeSafe System One",
      "npm package jev-router",
    ],
    links: {
      repo: "https://github.com/gargpratyush/jev-router",
      docs: "https://github.com/gargpratyush/jev-router#quick-start",
      website: "https://www.npmjs.com/package/jev-router",
    },
    pricingNote:
      "MIT open source; TypeSafe bills per routing decision; CLI usage still follows your Anthropic or OpenAI subscription.",
    firstSeen: "2026-09-26",
    relatedSlugs: [
      "nidhi-singh02-agent-router",
      "miuuyy-astra-ares",
      "dbreunig-building-with-jev-skill",
      "typesafe-ai-skills",
    ],
    relatedLearnSlugs: ["patterns", "use-cases"],
    faq: [
      {
        question: "Do I need separate Anthropic or OpenAI API keys?",
        answer:
          "README: no API keys required when the corresponding CLI is already logged in with a subscription.",
      },
      {
        question: "What gets sent to TypeSafe?",
        answer:
          "README limitations section: only the user prompt text for the routing decision on that turn.",
      },
      {
        question: "How is this different from Agent Router?",
        answer:
          "Agent Router (nidhi-singh02-agent-router) applies quota policy then ranks among four agent CLIs launched via Herdr. jev-router stays inside Claude Code or Codex and picks the cheapest sufficient model per turn.",
      },
      {
        question: "Where are explain reports stored?",
        answer:
          "README: up to 20 recent exchanges per session under the OS temp jev-claude directory with mode 600 files and seven-day cleanup.",
      },
    ],
    metaTitle: "jev-router: Jev model routing for Claude Code and Codex",
    metaDescription:
      "gargpratyush/jev-router npm package wraps jev-claude and jev-codex. TypeSafe picks fast or strong tiers per user turn with status lines and /jev-explain.",
  },

  "wy-coliney-jev-browser-use": {
    slug: "wy-coliney-jev-browser-use",
    status: "published",
    problem:
      "Codex Computer Use sessions spend full model turns on repetitive clicks and scrolls when the host model plans every micro-action in prose.",
    targetUser:
      "Codex (and Claude Code skill) users who want Jev to drive navigation and controls over accessibility text while the main agent types, judges visuals, and verifies outcomes.",
    overview:
      "jev-browser-use (github.com/wy-coliney/jev-browser-use) installs as a Codex skill or plugin. Jev receives accessibility text from the existing Computer Use connection, chooses clicks, navigation, toggles, and scrolls, then hands back to Codex for typing, images, and final verification. README attributes roughly 5 to 10 times faster browser operations in EZCollegeApp workflows as an author claim. Provider config supports TypeSafe or OpenRouter Decisions with keys kept in a local dotenv file named by ~/.config/jev-browser-use/config.json.",
    creator: {
      name: "Coliney",
      handle: "wy-coliney",
      githubUrl: "https://github.com/wy-coliney",
      company: "EZCollegeApp",
      companyUrl: "https://ezcollegeapp.com",
    },
    jevUsage: {
      flowRole:
        "Browser action Choice loop inside Codex Computer Use without a separate driver",
      primitives: ["Choice"],
      stateIn:
        "Accessibility text and control inventory from the connected Chrome or in-app browser session, plus the active goal from Codex.",
      decisionOut:
        "Next browser operation executed through Computer Use; Jev completion signal returns control to Codex for verification.",
      flowSteps: [
        "Codex sets a browser goal and invokes the skill",
        "Observe controls through the existing Computer Use channel",
        "Jev selects the next action from structured candidates",
        "Browser executes; session retains progress across handoffs",
        "Codex verifies page state before trusting completion",
      ],
      sourcedMetrics: [
        {
          claim:
            "README author claim: about 5 to 10 times faster browser operations in EZCollegeApp workflows (server-side processing excluded).",
          source: "github.com/wy-coliney/jev-browser-use README",
        },
        {
          claim:
            "README cost table: Jev 1.13 at $0.042 per 1M input tokens versus GPT-5.6 Terra at $2.00 per 1M input (48x) as of September 18, 2026.",
          source: "github.com/wy-coliney/jev-browser-use README",
        },
        {
          claim:
            "Public GitHub repo wy-coliney/jev-browser-use had about 545 stars and 33 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "This is the Codex plus Jev browser skill lane, distinct from browser-use-jev-ultrafast, which is Browser Use's Python hybrid with DOM tables and a tiny LLM only on TYPE_TEXT. Here the split is intentional teamwork: Jev burns cheap decisions on controls; Codex keeps judgment on text and visuals. sac-y-jev-cu is the parallel Codex skill with explicit dry-run and risk gates on sensitive ops. moritzkremb-jev-voice-browser adds microphone debouncing. Install with npx skills add wy-coliney/jev-browser-use; no extra npm driver beyond Node 22+ and an existing Computer Use browser connection.",
    keyFeatures: [
      "npx skills add wy-coliney/jev-browser-use for Codex or Claude Code agents",
      "Optional codex plugin marketplace path documented in README",
      "Shared ~/.config/jev-browser-use/config.json across install methods",
      "TypeSafe or OpenRouter provider docs under skills/jev-browser-use/references",
      "INSTALL.md agent-driven setup without pasting keys into chat",
    ],
    stack: [
      "Node.js 22+",
      "Codex Computer Use",
      "TypeSafe or OpenRouter Jev",
      "Agent skills CLI",
    ],
    links: {
      repo: "https://github.com/wy-coliney/jev-browser-use",
      docs: "https://github.com/wy-coliney/jev-browser-use/blob/main/skills/jev-browser-use/references/provider-configuration.md",
      website: "https://ezcollegeapp.com",
    },
    pricingNote:
      "MIT skill; Jev input pricing per README table; Codex usage bills separately.",
    firstSeen: "2026-09-26",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "sac-y-jev-cu",
      "socai-io-jev-social",
      "moritzkremb-jev-voice-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does this add a second browser driver?",
        answer:
          "README: it uses your existing Computer Use connection to Chrome or the in-app browser; no extra driver npm dependencies.",
      },
      {
        question: "Can I use OpenRouter instead of TypeSafe?",
        answer:
          "Yes. provider-configuration.md documents typesafe versus openrouter keys; they are not interchangeable even though both expose Jev.",
      },
      {
        question: "Is the 5 to 10x speedup a benchmark guarantee?",
        answer:
          "No. README labels it an approximate author claim from EZCollegeApp workflows with server-side processing excluded.",
      },
      {
        question: "Does Jev see screenshots?",
        answer:
          "README how-it-works: Jev receives accessibility text; Codex handles visual interpretation and typing.",
      },
    ],
    metaTitle: "Jev Browser Use: Codex skill, Jev clicks, Codex verifies",
    metaDescription:
      "wy-coliney/jev-browser-use routes browser clicks through TypeSafe Jev while Codex types and verifies. Install with npx skills add; TypeSafe or OpenRouter.",
  },

  "jevdoom-jev-arcade": {
    slug: "jevdoom-jev-arcade",
    status: "published",
    problem:
      "Browser games where Jev or other agents actually played get buried in threads. Fans want one retro hall to submit links, compare votes, and brag with arcade initials.",
    targetUser:
      "Jev curious players, doom fans, and builders who want their AI playthrough page in a community cabinet without running another Discord bot.",
    overview:
      "Jev Arcade at arcade.jevdoom.com is a fan-made coin-op index from the jevdoom.com team. Cabinets list browser games where Jev or other AI models were the player. You paste a game URL in NEW CHALLENGER; the arcade reads the page and pulls title, description, and preview image (the same pattern it uses for og art on submissions). TOP and NEW tabs sort the floor. Insert a coin to upvote a cabinet; the side panel tracks high scores with 3-letter initials and no accounts. The project grew after Jev did well at Doom; jevdoom.com/play hosts the shareware episode for humans in the browser. Footer copy states the site is fan-made and unofficial, not affiliated with Typesafe.",
    creator: {
      name: "jevdoom.com",
      handle: "jevdoom",
    },
    jevUsage: {
      flowRole:
        "Ecosystem showcase: the arcade shell curates links; Jev and other models run inside each linked game, not on every coin click",
      primitives: ["Choice"],
      stateIn:
        "Per linked game: whatever structured loop that creator documented (Doom agents, emulators, browser sims). The arcade UI only stores URL, scraped metadata, votes, initials, and timestamps.",
      decisionOut:
        "On the arcade site: vote totals and leaderboard rows. On linked demos: each game's own typed action picks (for example Jev movement in Doom playthroughs).",
      flowSteps: [
        "Visitor browses cabinets sorted by coins or recency",
        "Submitter pastes a URL where an AI model plays a browser game",
        "Backend ingests title, description, and preview image from the page",
        "Readers insert coins to upvote; optional 3-letter initials hit the high-score list",
        "Play links open the original game site in a new tab",
      ],
    },
    howJevIsUsed:
      "Treat arcade.jevdoom.com as a fan directory, not a new Jev inference product. Coins and sorting are ordinary web app logic. The Jev story lives in the linked cabinets: jevdoom.com documents an AI model clearing Doom, and the hall welcomes other agents too. That is different from jev-arcade.vercel.app, where Jev picks FPS moves at about 9 Hz, and from jevarcade.netlify.app, where KP runs seven Netlify gateway mini games. This listing does not add a separate jevdoom.com product row; use the Live demo link for human shareware play.",
    keyFeatures: [
      "TOP and NEW sort tabs on the cabinet grid",
      "Submit form with URL plus optional 3-letter initials",
      "Coin button upvotes with live vote counts",
      "High-score sidebar with arcade initials",
      "Scraped title, description, and preview image per submission",
      "Unlimited credits label in the UI (free play)",
    ],
    stack: [
      "Static HTML, CSS, and client JS on Cloudflare",
      "JSON API under /api/games on arcade.jevdoom.com",
      "Umami analytics (cloud.umami.is)",
      "Press Start 2P and VT323 fonts",
    ],
    links: {
      website: "https://arcade.jevdoom.com",
      demo: "https://jevdoom.com/play",
    },
    pricingNote:
      "Free to browse and vote on the arcade; linked games may bill their own APIs.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "lukaske-jev-doom-agent",
      "jev-arcade",
      "thumay9700-jev-plays",
      "fhshaik-typesafe-mario",
      "muratcanberber-jev-the-fish-game",
      "thisiskp-jevarcade",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same Jev Arcade as jev-arcade.vercel.app?",
        answer:
          "No. Neel490's listing is a Krunker-style 1v1 FPS where Jev picks move, aim, and fire. arcade.jevdoom.com is a link hall for many browser games.",
      },
      {
        question: "Is jevdoom.com listed separately?",
        answer:
          "Not in this directory yet. This profile links jevdoom.com/play as the human Doom demo. The main jevdoom.com site can be submitted later if the authors want a full product page.",
      },
      {
        question: "Does inserting a coin call TypeSafe Jev?",
        answer:
          "No. Coins hit the arcade vote API. Jev shows up inside the games you link to, not inside the upvote button.",
      },
      {
        question: "Is it official?",
        answer:
          "No. Site footer says fan-made and unofficial, not affiliated with Typesafe. Game rights stay with each linked creator.",
      },
    ],
    metaTitle: "Jevdoom Arcade: AI-played browser game hall",
    metaDescription:
      "arcade.jevdoom.com lists games Jev and other models played. Submit URLs, coin-vote, sort Top or New. Fan-made; demo at jevdoom.com/play.",
  },

  "langchain-ai-langchain-typesafe": {
    slug: "langchain-ai-langchain-typesafe",
    status: "published",
    problem:
      "LangGraph and LangChain agents still burn a full chat model call whenever they need a label, a route, or a pre-tool risk check, even when the answer set is finite.",
    targetUser:
      "Python teams already on LangChain who want official TypeSafeClassifier runnables, parallel Choice, Score, and Noul, and optional middleware inside create_agent flows.",
    overview:
      "langchain-typesafe (PyPI langchain-typesafe v0.0.1a3, MIT, maintained by LangChain) lives in the langchain-ai/langchain monorepo. TypeSafeClassifier is a Runnable: pass state as text, JSON, or LangChain messages plus a questions map built from Choice, Score, and Noul helpers; invoke returns typed answers per question in one System One request. Set TYPESAFE_API_KEY. The experimental extra adds ModelRouterMiddleware (once-per-run model tier Choice from the latest human message) and AutoModeMiddleware (Noul gate before configured tools). Provider errors inherit LangChain model-error hierarchy. LangChain's Building a Harness with Jev post and docs.langchain.com integration pages document routing and Auto Mode patterns; this directory page covers the package surface, not hosted Jev pricing.",
    creator: {
      name: "LangChain",
      handle: "langchain-ai",
      githubUrl: "https://github.com/langchain-ai",
      companyUrl: "https://www.langchain.com",
    },
    jevUsage: {
      flowRole:
        "Parallel System One questions inside LangChain Runnable pipelines and optional agent middleware",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "ClassifierRequest state field: plain string, structured dict, or BaseMessage lists converted to role/content objects per PyPI docs.",
      decisionOut:
        "Per-question ChoiceAnswer, ScoreAnswer, or NoulAnswer objects with probabilities; middleware stores full ChoiceAnswer in agent state for traces.",
      flowSteps: [
        "uv add langchain-typesafe and export TYPESAFE_API_KEY",
        "Build questions map and call TypeSafeClassifier.invoke or ainvoke",
        "Optional: uv add langchain-typesafe[experimental] for middleware",
        "Attach ModelRouterMiddleware or AutoModeMiddleware when using create_agent",
        "Branch in Python on thresholds instead of parsing model prose",
      ],
      sourcedMetrics: [
        {
          claim:
            "PyPI lists langchain-typesafe 0.0.1a3 with LangChain org ownership and MIT license.",
          source: "pypi.org/project/langchain-typesafe",
        },
        {
          claim:
            "LangChain blog post Building a Harness with Jev documents ModelRouterMiddleware and AutoModeMiddleware examples.",
          source: "langchain.com/blog/building-a-harness-with-jev",
        },
      ],
    },
    howJevIsUsed:
      "This is the LangChain-native SDK lane next to typesafe-ai-typesafe-sdk-python for raw HTTP and vercel-ai-sdk-provider for Vercel AI SDK apps. Use middleware when your harness already calls create_agent; call TypeSafeClassifier inside LangGraph nodes when you own the state machine. nidhi-singh02-agent-router and gargpratyush-jev-router solve multi-CLI model tier picks in terminals; langchain-typesafe stays in your Python service. Pair with antoniocoppe-jev-harness when teammates need vocabulary for gate design, and the /guides/jev-with-ai-agents/langchain-langgraph page for install snippets.",
    keyFeatures: [
      "TypeSafeClassifier Runnable with parallel question batching",
      "Choice, Score, and Noul helper constructors",
      "Experimental ModelRouterMiddleware for cost-aware model Choice",
      "Experimental AutoModeMiddleware for tool-risk Noul gates",
      "Message-as-state conversion for chat-shaped agent loops",
    ],
    stack: [
      "Python 3.10+",
      "LangChain",
      "TypeSafe System One API",
      "Optional LangGraph nodes",
    ],
    links: {
      repo: "https://github.com/langchain-ai/langchain",
      docs: "https://docs.langchain.com/oss/python/integrations/providers/typesafe",
      website: "https://pypi.org/project/langchain-typesafe/",
      post: "https://www.langchain.com/blog/building-a-harness-with-jev",
    },
    pricingNote:
      "MIT package; TypeSafe bills per System One request unless you point clients at a self-hosted decision server.",
    firstSeen: "2026-09-27",
    relatedSlugs: [
      "typesafe-ai-typesafe-sdk-python",
      "vercel-ai-sdk-provider",
      "nidhi-singh02-agent-router",
      "gargpratyush-jev-router",
    ],
    relatedLearnSlugs: ["patterns", "use-cases"],
    faq: [
      {
        question: "Where is the source code?",
        answer:
          "The integration ships inside github.com/langchain-ai/langchain; PyPI package langchain-typesafe is the install surface.",
      },
      {
        question: "Do I need the experimental extra?",
        answer:
          "Only for ModelRouterMiddleware and AutoModeMiddleware. TypeSafeClassifier works from the base install documented on PyPI.",
      },
      {
        question: "Which environment variable?",
        answer:
          "PyPI and LangChain docs use TYPESAFE_API_KEY for the TypeSafe client backing the classifier.",
      },
      {
        question: "Is this a text generator?",
        answer:
          "No. TypeSafeClassifier returns typed probabilities for questions you define; it does not draft user-facing prose.",
      },
    ],
    metaTitle: "langchain-typesafe: LangChain Runnable for System One",
    metaDescription:
      "Official langchain-typesafe PyPI package: TypeSafeClassifier, Choice, Score, Noul, and experimental routing middleware for LangChain agents.",
  },

  "mapika-decider": {
    slug: "mapika-decider",
    status: "published",
    problem:
      "Teams comparing open decision models still confuse Jared Palmer Kev, Von, Laya packaging, and independent Qwen trainers that all speak System One but ship different weights and eval stories.",
    targetUser:
      "ML engineers who want Mapika's Qwen3.5-based decider checkpoints, decider-ai serve on POST /v1/systemone, and public training mixture notes without TypeSafe API dependency.",
    overview:
      "decider (github.com/Mapika/decider, Apache-2.0, PyPI decider-ai import decider) is an independent System One class model family: state plus typed questions in, calibrated probabilities from one forward pass out, no text generation. Checkpoints include decider-0.8b through decider-35b-a3b and decider-2b-vision on Hugging Face under Mapika org tags. README states no affiliation with TypeSafe AI and no distillation from hosted Jev; teacher data comes from public mixture plus local Qwen3.5-27B labels. decider.serve and decider.serve_vllm expose TypeSafe wire-compatible HTTP; python -m decider.calibrate fits per-type temperature maps. README Standing section quotes JevBench and Decision Index leaderboard rows read on published dates; treat those as third-party harness results, not this directory's measurements. Showcase GIF on GitHub raw shows arcade games where each move is one forward pass.",
    creator: {
      name: "Mapika",
      handle: "Mapika",
      githubUrl: "https://github.com/Mapika",
    },
    jevUsage: {
      flowRole:
        "Self-hosted parallel Choice, Score, and Noul over shared state via native decider forward pass or /v1/systemone server",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "JSON state and questions map per README curl examples and decider-ai HTTP schema matching TypeSafe System One.",
      decisionOut:
        "Probability vector per question; no decoding step outside defined options.",
      flowSteps: [
        "pip or uv install decider-ai and pull weights from Hugging Face",
        "python -m decider.serve or serve_vllm for HTTP clients",
        "POST /v1/systemone with parallel questions on one state blob",
        "Optional calibrate CLI on labelled rows before production gates",
        "Point TypeSafe SDKs at local base URL when you want drop-in clients",
      ],
      sourcedMetrics: [
        {
          claim:
            "README JevBench table read 2026-09-21 lists decider-35b-a3b at 68.9 total score (#10 of 36) and decider-2b at 64.6 (#21 of 36).",
          source: "github.com/Mapika/decider README Standing",
        },
        {
          claim:
            "README Decision Index v0.1 dated 2026-09-22 ranks decider-35b-a3b NVFP4 fourth of 32 at 54.3 and decider-2b fourteenth at 44.0.",
          source: "github.com/Mapika/decider README Standing",
        },
        {
          claim:
            "Public GitHub repo Mapika/decider had 702 stars and 39 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "decider is its own model lineage, not a thin alias of Kev or Von. jaredpalmer-kev targets Jared's Qwen fine-tunes with SDK parity tables against hosted Jev; wfzyx-von chases non-autoregressive encoder speed; theoleecj-semif documents another open server narrative. ollaya-dev-ollaya can pull and serve decider ONNX wrappers for local :11435 workflows, but Mapika/decider and Hugging Face Mapika/decider-* repos remain training and weight source of truth. Compare realzachi-typesafe-adblock only when your question is browser clutter, not model training.",
    keyFeatures: [
      "decider-ai PyPI package with decider.serve and serve_vllm paths",
      "Multiple HF checkpoints from 0.8B dense to 35B-A3b MoE",
      "Public mixture.py and teacher_data transparency in repo",
      "Game and browser RL stage notes with linked docs/DEMOS.md",
      "calibrate CLI for per-type temperature fitting",
    ],
    stack: [
      "Python",
      "PyTorch",
      "CUDA, Apple MPS, vLLM optional path",
      "Hugging Face weights",
    ],
    links: {
      repo: "https://github.com/Mapika/decider",
      docs: "https://github.com/Mapika/decider/blob/main/docs/RESULTS.md",
      demo: "https://raw.githubusercontent.com/Mapika/decider/main/media/showcase.gif",
      website: "https://huggingface.co/Mapika",
    },
    pricingNote:
      "Apache-2.0 code and published weights; you pay for GPUs and electricity. Third-party leaderboard hosting may bill separately.",
    firstSeen: "2026-09-27",
    relatedSlugs: [
      "jaredpalmer-kev",
      "wfzyx-von",
      "ollaya-dev-ollaya",
      "theoleecj-semif",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is decider affiliated with TypeSafe?",
        answer:
          "README states independent project, not affiliated with or endorsed by TypeSafe AI.",
      },
      {
        question: "Does ollaya replace this repo?",
        answer:
          "ollaya packages ONNX serve for many open models including decider tags. Mapika/decider remains where training recipes and authoritative cards live.",
      },
      {
        question: "What PyPI package name?",
        answer:
          "Install decider-ai; Python import remains decider per README.",
      },
      {
        question: "Can I use TypeSafe SDKs against decider.serve?",
        answer:
          "README documents POST /v1/systemone with the TypeSafe wire format so compatible clients can point at localhost.",
      },
    ],
    metaTitle: "decider: Mapika open System One model family",
    metaDescription:
      "Mapika/decider trains Qwen3.5 decision models with decider-ai serve, HF weights, JevBench and Decision Index citations, and TypeSafe-shaped HTTP.",
  },

  "kitze-unclutter": {
    slug: "kitze-unclutter",
    status: "published",
    problem:
      "Modern sites bury useful content under ads, newsletters, cookie walls, and social widgets, but regex blocklists break on the next redesign.",
    targetUser:
      "Chrome, Edge, Brave, or Firefox users who want a WXT extension that classifies clutter with Jev once, then reuses local template rules on return visits.",
    overview:
      "Unclutter (github.com/kitze/unclutter, MIT) is Kitze's browser extension built with Bun and WXT. On analyze, it collects bounded DOM candidates (not full page HTML), asks Jev to Choice among keep, ad, promotion, newsletter, social, cookie, and uncertain, then writes hide rules keyed by page template. TypeSafe direct mode uses POST https://api.typesafe.ai/v1/systemone with model jev-latest; Vercel AI Gateway mode uses typesafe-ai/jev on the evaluation endpoint. Manual mode runs on button click; On page visit mode reuses or upgrades templates while preserving paused rules and keep-visible overrides. README requires both selected-choice probability and TypeSafe confidence at least 0.9 when confidence is present; otherwise the element stays visible. Uncertain classifications always stay visible.",
    creator: {
      name: "Kitze",
      handle: "thekitze",
      xUrl: "https://x.com/thekitze",
      githubUrl: "https://github.com/kitze",
      companyUrl: "https://kitze.io",
    },
    jevUsage: {
      flowRole:
        "Per-candidate clutter Choice with conservative thresholds before persisting template hide rules",
      primitives: ["Choice"],
      stateIn:
        "Bounded candidate snippets and metadata from the active tab DOM; page text treated as untrusted evidence per README safety section.",
      decisionOut:
        "Category label per candidate; sub-threshold or uncertain results leave elements visible and skip aggressive hides.",
      flowSteps: [
        "User loads unpacked Chromium build or temporary Firefox add-on",
        "Configure Gateway or TypeSafe key in popup (BYOK)",
        "Analyze page or run on visit to classify candidates",
        "Extension stores template rules locally for matching URLs",
        "User can uncheck rules in Hidden elements to keep items visible",
      ],
      sourcedMetrics: [
        {
          claim:
            "README safety section: probability and confidence must both be at least 0.9 to hide when confidence is provided; uncertain never hides.",
          source: "github.com/kitze/unclutter README",
        },
        {
          claim:
            "Public GitHub repo kitze/unclutter had 312 stars and 34 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Unclutter is a product-shaped cousin of realzachi-typesafe-adblock: both use Jev on web annoyances, but Unclutter emphasizes template reuse and Kitze's UX rather than a static blocklist narrative. browser-use-jev-ultrafast is for agent-driven clicks, not passive reading. No repo ships bundled API keys; operators bring Vercel AI Gateway or TypeSafe credentials. Pair with realzachi-typesafe-adblock when you want to compare approaches before standardizing internal extensions.",
    keyFeatures: [
      "WXT builds for Chrome MV3 and Firefox MV2",
      "Manual and on-visit analyze modes",
      "Template upgrade path with paused rule preservation",
      "Hidden elements panel with per-rule visibility toggles",
      "Conservative dual threshold on probability and confidence",
    ],
    stack: [
      "TypeScript",
      "Bun",
      "WXT",
      "Vercel AI Gateway or TypeSafe API",
    ],
    links: {
      repo: "https://github.com/kitze/unclutter",
      post: "https://x.com/thekitze/status/2100595129874817340",
      website: "https://github.com/kitze/unclutter",
    },
    pricingNote:
      "MIT extension; Jev or Gateway usage bills to your own keys.",
    firstSeen: "2026-09-27",
    relatedSlugs: [
      "realzachi-typesafe-adblock",
      "browser-use-jev-ultrafast",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Unclutter upload full HTML?",
        answer:
          "README describes bounded candidates sent for classification, not entire page HTML dumps.",
      },
      {
        question: "Which Jev backends are supported?",
        answer:
          "TypeSafe direct jev-latest or Vercel AI Gateway typesafe-ai/jev per README provider section.",
      },
      {
        question: "How is this different from typesafe-adblock?",
        answer:
          "See realzachi-typesafe-adblock for that project's blocklist and flow. Unclutter focuses on template rules and Kitze's extension UX.",
      },
      {
        question: "Is Safari supported?",
        answer:
          "README documents Chromium and Firefox paths; Safari packaging is not included.",
      },
    ],
    metaTitle: "Unclutter: Jev-powered browser declutter extension",
    metaDescription:
      "kitze/unclutter classifies ads and clutter with TypeSafe or Gateway Jev, stores local template hides, and keeps uncertain elements visible.",
  },

  "receptron-laya": {
    slug: "receptron-laya",
    status: "published",
    problem:
      "Node services and edge workers cannot import Python RLAgent, yet teams still want Convai Laya probabilities without standing up a separate inference container.",
    targetUser:
      "TypeScript backends on Node 20+ that need Laya systemOne parity, Hugging Face download caching, and ONNX Runtime inference without PyTorch.",
    overview:
      "receptron/laya (github.com/receptron/laya, npm @receptron/laya, MIT) implements the Convai Innovations Laya decision model for Node using onnxruntime-node. Laya.load() fetches about 1.7 GB fp32 weights into ~/.cache/receptron-laya unless LAYA_CACHE overrides. systemOne batches all questions in one run with Choice, Score, and Noul outputs matching Python RLAgent.system_one and TypeSafe system_one shape to four decimal places per README. Model weights remain Apache-2.0 upstream at convaiinnovations/laya; receptron publishes ONNX bundles such as receptron/laya-onnx. This listing is the JavaScript runtime only. Do not treat it as a second Laya weights product page.",
    creator: {
      name: "receptron",
      handle: "receptron",
      githubUrl: "https://github.com/receptron",
    },
    jevUsage: {
      flowRole:
        "Local ONNX System One client for parallel questions over structured state in Node",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Plain objects such as ticket subject and body fields or arbitrary JSON state passed to systemOne.",
      decisionOut:
        "Typed answers map with choice probabilities, score expectations, or noul P(true) per question key.",
      flowSteps: [
        "npm install @receptron/laya on Node 20+",
        "await Laya.load() to download or load local ONNX bundle",
        "Call systemOne with state and questions record",
        "Read per-question typed answer objects without casting",
        "await laya.close() when shutting down the process",
      ],
      sourcedMetrics: [
        {
          claim:
            "README documents about 140 ms for three questions on warm Apple-silicon CPU and about 1.7 GB fp32 download size.",
          source: "github.com/receptron/laya README",
        },
        {
          claim:
            "Public GitHub repo receptron/laya had 500 stars and 44 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "ollaya-dev-ollaya is the Rust daemon story: pull many open decision checkpoints and serve POST /v1/systemone on port 11435. receptron-laya is the embeddable npm library when a single Node service needs Laya only. jaredpalmer-kev and wfzyx-von remain separate open model families with their own repos. Point model authorship to Convai Innovations Laya; point package maintenance to receptron. For browser or agent automation, cross-read browser-use-jev-ultrafast instead of forcing Laya into the hot path.",
    keyFeatures: [
      "Typed systemOne API matching Python reference",
      "HF download cache with progress callbacks",
      "Optional local modelDir from export/export_onnx.py bundle",
      "Batched questions in one ONNX forward pass",
      "executionProviders and sessionOptions tuning",
    ],
    stack: [
      "Node.js 20+",
      "TypeScript",
      "ONNX Runtime",
      "Hugging Face hub downloads",
    ],
    links: {
      repo: "https://github.com/receptron/laya",
      docs: "https://github.com/receptron/laya#usage",
      website: "https://www.npmjs.com/package/@receptron/laya",
    },
    pricingNote:
      "MIT package; upstream Laya weights follow Convai license; you pay for compute and bandwidth.",
    firstSeen: "2026-09-27",
    relatedSlugs: [
      "ollaya-dev-ollaya",
      "jaredpalmer-kev",
      "wfzyx-von",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Does this re-list Laya model weights?",
        answer:
          "No. We document the receptron Node runtime. Weights and training story stay on Convai Innovations Hugging Face repos.",
      },
      {
        question: "How does this differ from ollaya?",
        answer:
          "ollaya is a multi-model pull and serve CLI. @receptron/laya is a library for embedding Laya in Node apps.",
      },
      {
        question: "How much disk and RAM?",
        answer:
          "README cites about 1.7 GB fp32 cache plus a few hundred MB per batch on top of roughly 2 GB loaded model budget.",
      },
      {
        question: "Can I pin ONNX revisions?",
        answer:
          "Laya.load accepts repo, subfolder, and revision parameters documented in README Options.",
      },
    ],
    metaTitle: "@receptron/laya: Laya System One client for Node",
    metaDescription:
      "receptron/laya npm package runs Convai Laya ONNX in Node 20+ with typed systemOne, HF cache, and Choice, Score, Noul batching.",
  },

  "dzhng-jevgrep": {
    slug: "dzhng-jevgrep",
    status: "published",
    problem:
      "Coding agents burn context and API budget reading whole repos when a human would skim folders, open two files, and jump to the right declaration.",
    targetUser:
      "Developers running Claude Code, Codex, or custom agents who want a CLI that turns a natural-language repo question into ranked files, reading leads, and verbatim excerpts on stdout.",
    overview:
      "jevgrep (github.com/dzhng/jevgrep, npm @dzhng/jevgrep, MIT) installs the `jg` command for Node 22+ on macOS and Linux. You ask a question; the tool walks hierarchy from folders to files to declarations, uses Jev to judge relevance at each level, caches evaluation answers locally by default, and prints source excerpts for the agent to implement against. `jg auth` wires Vercel AI Gateway, TypeSafe, OpenRouter, or OpenCode Zen (provider selection needs package version 0.3.0 or newer). `jg skill` and `npx skills add dzhng/jevgrep` ship an agent skill installer. Repo created 2026-09-26 with active pushes through 2026-09-28.",
    creator: {
      name: "dzhng",
      handle: "dzhng",
      githubUrl: "https://github.com/dzhng",
    },
    jevUsage: {
      flowRole:
        "Hierarchical relevance scoring and retrieval across folders, files, and declarations before the agent edits code",
      primitives: ["Choice", "Score"],
      stateIn:
        "Natural-language question plus bounded tree context (paths, summaries, declaration snippets) respecting ignore, hidden, and dependency filters per README.",
      decisionOut:
        "Ranked files and reading leads with verbatim excerpts on stdout; agent keeps research and implementation decisions.",
      flowSteps: [
        "Parse repo question and start from top-level folder candidates",
        "Jev scores which branches merit deeper traversal",
        "Drill into files and declarations with cached evaluation answers when repeats occur",
        "Emit ranked paths, leads, and source excerpts for the coding agent",
        "Optional: install jevgrep skill for agent-driven `jg` invocations",
      ],
      sourcedMetrics: [
        {
          claim:
            "README eval on 10 tuned Python SWE-bench tasks: with and without Jevgrep both solved 8/10; Sol-only total cost $7.62 versus $5.44 with Jevgrep (~28.6% lower on the cost graphic).",
          source: "github.com/dzhng/jevgrep README and evals/results/relevance-threshold-2026-09-27.md",
        },
        {
          claim:
            "Later total-cost rerun including Jev measured 25.8% lower total cost with the same 8/10 solve rate.",
          source: "github.com/dzhng/jevgrep evals/results/total-cost-2026-09-28.md",
        },
        {
          claim:
            "Public GitHub repo dzhng/jevgrep had about 1148 stars and 67 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jevgrep is the coding-agent search lane, not line-at-a-time meaning grep and not per-function yes/no scans. uehaj-jev-semgrep batches Noul questions on individual lines; sufianetaouil-every scores every function for a boolean question. jevgrep instead orchestrates a tree walk where Jev answers which folder, file, or declaration deserves the next hop, then returns exact text for the agent to read. gargpratyush-jev-router spends Jev on model tier picks; jevgrep spends it on repo cartography. tamaratran-fast-jev-compaction is transcript hygiene, not retrieval. Eligible source ships through your configured provider; README documents filters but not a secrets guarantee. Cite dzhng/jevgrep README and eval markdown for cost claims, not third-party blogs.",
    keyFeatures: [
      "Global npm @dzhng/jevgrep with `jg` CLI",
      "`jg auth` for Gateway, TypeSafe, OpenRouter, or OpenCode Zen",
      "`jg skill` and npx skills add dzhng/jevgrep agent installer",
      "Local evaluation answer cache by default",
      "Hierarchy walk with verbatim stdout excerpts for agents",
    ],
    stack: [
      "Node.js 22+",
      "TypeScript",
      "Vercel AI Gateway or TypeSafe or OpenRouter or OpenCode Zen",
      "Agent skills CLI",
    ],
    links: {
      repo: "https://github.com/dzhng/jevgrep",
      docs: "https://github.com/dzhng/jevgrep#readme",
      website: "https://www.npmjs.com/package/@dzhng/jevgrep",
    },
    pricingNote:
      "MIT open source; Jev or gateway bills per relevance evaluation; README evals quantify agent total-cost savings on SWE-bench subset.",
    firstSeen: "2026-09-28",
    relatedSlugs: [
      "uehaj-jev-semgrep",
      "tamaratran-fast-jev-compaction",
      "gargpratyush-jev-router",
      "ellipsis-dev-blink",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "How is jevgrep different from jev-semgrep?",
        answer:
          "jev-semgrep filters lines by meaning with boolean composition. jevgrep walks repo hierarchy and returns file-level reading leads plus excerpts for coding agents.",
      },
      {
        question: "Which providers does `jg auth` support?",
        answer:
          "README documents Vercel AI Gateway, TypeSafe, OpenRouter, and OpenCode Zen. Picking among them requires @dzhng/jevgrep version 0.3.0 or newer.",
      },
      {
        question: "Does jevgrep replace my coding agent?",
        answer:
          "No. jevgrep is research infrastructure on stdout. The agent still chooses what to edit after reading the excerpts.",
      },
      {
        question: "Where are the cost savings numbers from?",
        answer:
          "Upstream README and evals/results/relevance-threshold-2026-09-27.md, total-cost-2026-09-28.md, and speed-2026-09-28.md in the dzhng/jevgrep repo.",
      },
    ],
    metaTitle: "jevgrep: Jev hierarchical repo search for coding agents",
    metaDescription:
      "dzhng/jevgrep `jg` CLI uses Jev to walk repos, print excerpts, and install agent skills. README SWE-bench evals cite about 26% lower agent cost at 8/10 solves.",
  },

  "openbyteinc-quantdinger": {
    slug: "openbyteinc-quantdinger",
    status: "published",
    problem:
      "Quant teams want AI-assisted entries without letting a chat model narrate trades into the exchange, and without trapping open positions when the inference provider blips.",
    targetUser:
      "Operators self-hosting OpenByteInc QuantDinger for research, backtest, paper, or live crypto and equities workflows who may enable the optional TypeSafe pre-trade gate.",
    overview:
      "QuantDinger (github.com/OpenByteInc/QuantDinger, Apache-2.0 backend, ai.quantdinger.com and quantdinger.com) is an open-source AI Trading OS: research to Python strategies to backtest to paper or live execution to monitoring, with Agent Gateway and MCP. The stack is multi-tenant SaaS-capable across crypto and stock or forex brokers. GitHub topics include jev, typesafe-ai, mcp-server, trading, and quant. Public star count was about 12,268 when this listing was drafted.",
    creator: {
      name: "Open Byte Inc.",
      handle: "OpenByteInc",
      githubUrl: "https://github.com/OpenByteInc",
    },
    jevUsage: {
      flowRole:
        "Optional pre-trade entry filter: typed Choice with confidence before regular live strategies and Quick Trade orders reach the exchange",
      primitives: ["Choice", "Score"],
      stateIn:
        "Order intent plus strategy context, exposure, open positions, and budget state sent to TypeSafe Jev via POST /v1/systemone per README JEV-powered pre-trade decisions section.",
      decisionOut:
        "Typed Choice results with probabilities and confidence (not prose); independent checks on evidence quality, signal consistency, market regime, account risk, execution quality, and entry pass or reject; auditable decision timeline with provider, checks, result, confidence, latency, and reason in the app.",
      flowSteps: [
        "Strategy or Quick Trade proposes an entry order",
        "When AI Decision Filter is enabled, QuantDinger assembles context and calls TypeSafe Jev",
        "Jev returns structured pass or reject with confidence and check breakdown",
        "Rejected entries never reach the exchange; exits, stop-loss, take-profit, and emergency paths bypass the filter",
        "On provider failure, policy fails open with audit log; if Jev unset, configured LLM fallback; if no AI, allow and log fail-open",
      ],
      sourcedMetrics: [
        {
          claim:
            "README documents grid, DCA, and martingale strategies excluded from the first AI Decision Filter version.",
          source: "github.com/OpenByteInc/QuantDinger README JEV-powered pre-trade decisions",
        },
        {
          claim:
            "Public GitHub repo OpenByteInc/QuantDinger had about 12268 stars and 2510 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "QuantDinger puts Jev on the money path as an optional gate, not as the strategy brain. jarrodwatts-jev-trader is a compact Monad demo that Chooses buy or sell each block; QuantDinger is a full trading OS with research, execution, and monitoring. The README section JEV-powered pre-trade decisions is explicit: entries can be blocked before they hit the broker; risk exits and emergencies skip the filter so you are not stuck. Provider outage fails open with auditing so AI downtime cannot trap a position. Configure JEV_API_KEY, JEV_BASE_URL, JEV_MODEL, and JEV_TIMEOUT_SECONDS under System Settings AI or LLM. Live trading carries real loss risk; this listing is not investment advice; follow local law. Cite OpenByteInc/QuantDinger README for behavior, not rumor posts.",
    keyFeatures: [
      "End-to-end quant stack: research, Python strategies, backtest, execution, monitoring",
      "Agent Gateway plus MCP server topics in repo metadata",
      "Optional TypeSafe Jev AI Decision Filter on entries with auditable timeline UI",
      "Fail-open provider failure handling documented in README",
      "Multi-broker crypto and stocks or forex support in product positioning",
    ],
    stack: [
      "Python Apache-2.0 backend",
      "TypeSafe System One POST /v1/systemone",
      "Agent Gateway and MCP",
      "Self-hosted or SaaS-capable deployment",
    ],
    links: {
      repo: "https://github.com/OpenByteInc/QuantDinger",
      docs: "https://github.com/OpenByteInc/QuantDinger#readme",
      website: "https://ai.quantdinger.com",
    },
    pricingNote:
      "Open-source core; live trading spends real capital and TypeSafe usage when the Jev filter is enabled. Jev filter is optional.",
    firstSeen: "2026-09-28",
    relatedSlugs: [
      "jarrodwatts-jev-trader",
      "chetaslua-jevmeter",
      "realzachi-pg-jev",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is the Jev filter required?",
        answer:
          "No. README describes it as optional on regular live strategies and Quick Trade entries. Exits and emergency actions bypass it.",
      },
      {
        question: "What happens if TypeSafe is down?",
        answer:
          "README policy: provider failure is audited and fails open; if Jev is unset the app tries a configured LLM; if no AI is available it allows the order and logs fail-open so outages cannot trap positions.",
      },
      {
        question: "How is this different from jev-trader?",
        answer:
          "jev-trader is Jarrod Watts Monad block demo on Kuru MON-USDC. QuantDinger is a full trading operating system with research, backtest, multi-broker execution, and a production-shaped pre-trade gate.",
      },
      {
        question: "Which environment variables configure Jev?",
        answer:
          "README lists JEV_API_KEY, JEV_BASE_URL, JEV_MODEL, and JEV_TIMEOUT_SECONDS in System Settings under AI or LLM.",
      },
    ],
    metaTitle: "QuantDinger: Jev pre-trade filter on an AI Trading OS",
    metaDescription:
      "OpenByteInc QuantDinger optional TypeSafe entry gate: typed Choice, auditable timeline, fail-open on provider errors. Full quant stack at ai.quantdinger.com.",
  },

  "logan-markewich-jeff": {
    slug: "logan-markewich-jeff",
    status: "published",
    problem:
      "Teams want System One SDK compatibility without per-call hosted Jev bills, but chat-model JSON hacks break calibration and void comparisons to api.typesafe.ai.",
    targetUser:
      "Python engineers who can run uv locally or deploy Modal and want a self-hosted POST /v1/systemone endpoint backed by the GLiFormer encoder (~400M params).",
    overview:
      "jeff (github.com/logan-markewich/jeff, MIT) is Logan Markewich's drop-in System One server compatible with TypeSafe POST /v1/systemone and the official typesafe-sdk when you set TYPESAFE_BASE_URL to your jeff host. It serves knowledgator/gliformer-large-v1 with Choice, Score, and Noul support, temperature-scaled normalized sigmoids, and optional noul isolation modes documented in README. Run locally with uv run jeff or deploy CPU or GPU on Modal. Auth uses JEFF_API_KEYS. Token counts are not comparable to Jev billing per upstream README.",
    creator: {
      name: "Logan Markewich",
      handle: "logan-markewich",
      githubUrl: "https://github.com/logan-markewich",
    },
    jevUsage: {
      flowRole:
        "Self-hosted System One wire compatibility: same SDK clients, GLiFormer inference instead of hosted Jev",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Standard System One JSON bodies from typesafe-sdk or curl, matching hosted Jev request shape per README.",
      decisionOut:
        "Typed answers with probabilities or scores; behavior differs from hosted Jev (sigmoid scaling, noul isolation options) as documented upstream.",
      flowSteps: [
        "Configure TYPESAFE_BASE_URL to jeff host and JEFF_API_KEYS",
        "uv run jeff locally or deploy Modal template from README",
        "POST /v1/systemone from existing SDK clients unchanged",
        "Compare latency, cost, and accuracy using README and bench/RESULTS.md tables",
      ],
      sourcedMetrics: [
        {
          claim:
            "README benchmarks on 1600 labeled items: sequential p50 about 151 ms on L4 Modal versus hosted Jev about 129 ms.",
          source: "github.com/logan-markewich/jeff README",
        },
        {
          claim:
            "README cost table: about $2.6 versus about $15.6 per 1M single-question requests (jeff vs hosted Jev).",
          source: "github.com/logan-markewich/jeff README",
        },
        {
          claim:
            "README JevBench v1.2.2 total score 66.9 (rank #9) versus hosted Jev 75.3 (rank #2); AG News 75.5% vs 90.5%; Intelligence 63.9 vs 90.4.",
          source: "github.com/logan-markewich/jeff README and bench/RESULTS.md",
        },
        {
          claim:
            "Public GitHub repo logan-markewich/jeff had about 256 stars and 20 forks when this listing was drafted.",
          source: "GitHub API September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jeff speaks the Jev wire format so existing SDK clients keep working; it does not pretend to be identical hosted Jev. jaredpalmer-kev ships Qwen-trained checkpoints with full fine-tune story; wfzyx-von optimizes non-autoregressive encoder latency; githubnext-localjev proxies chat JSON on Mac; ollaya-dev-ollaya pulls many ONNX decision checkpoints behind one daemon; receptron-laya embeds Convai Laya in Node. jeff is the GLiFormer encoder path with Modal deploy and honest accuracy versus cost tables in README. Hosted Jev remains the accuracy leader in upstream benchmarks; jeff targets operators who accept the gap for roughly 5x lower per-million request cost in README math. Cite logan-markewich/jeff README and bench/RESULTS.md only.",
    keyFeatures: [
      "POST /v1/systemone compatible with typesafe-sdk via TYPESAFE_BASE_URL",
      "knowledgator/gliformer-large-v1 (~400M) GLiFormer backend",
      "Local uv run jeff or Modal GPU and CPU deploy paths",
      "JEFF_API_KEYS authentication",
      "Published latency, cost, and JevBench comparison tables",
    ],
    stack: [
      "Python",
      "uv",
      "GLiFormer weights on Hugging Face",
      "Modal optional",
      "typesafe-sdk",
    ],
    links: {
      repo: "https://github.com/logan-markewich/jeff",
      docs: "https://github.com/logan-markewich/jeff#readme",
    },
    pricingNote:
      "MIT open source; you pay Modal or your own GPUs. README documents lower per-request cost than hosted Jev with lower benchmark scores.",
    firstSeen: "2026-09-28",
    relatedSlugs: [
      "jaredpalmer-kev",
      "githubnext-localjev",
      "wfzyx-von",
      "ollaya-dev-ollaya",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Is jeff API-identical to hosted Jev?",
        answer:
          "Wire compatible for typesafe-sdk clients, but README documents different sigmoid behavior, noul isolation options, and non-comparable token billing.",
      },
      {
        question: "How do I point the SDK at jeff?",
        answer:
          "Set TYPESAFE_BASE_URL to your jeff server and configure JEFF_API_KEYS per README quick start.",
      },
      {
        question: "How does accuracy compare to api.typesafe.ai?",
        answer:
          "README and bench/RESULTS.md publish JevBench and task tables where hosted Jev leads; jeff trades accuracy for cost and self-hosting control.",
      },
      {
        question: "How is jeff different from Kev?",
        answer:
          "Kev (jaredpalmer-kev) fine-tunes Qwen checkpoints with a training and serve story. jeff serves GLiFormer as a drop-in encoder server with Modal deploy.",
      },
    ],
    metaTitle: "jeff: self-hosted GLiFormer System One server",
    metaDescription:
      "logan-markewich/jeff serves POST /v1/systemone with GLiFormer for typesafe-sdk. README cites lower cost than hosted Jev with published JevBench gap.",
  },

  "mizorewww-laya-coreml": {
    slug: "mizorewww-laya-coreml",
    status: "published",
    problem:
      "Short Laya decisions on a Mac still default to MLX or a CPU ONNX session, even when the Neural Engine is the chip you actually paid for.",
    targetUser:
      "Apple Silicon developers on macOS 15+ and Python 3.11 to 3.13 who want local choice, score, and noul calls from published Core ML bundles, plus a terminal Snake loop that shows the probabilities.",
    overview:
      "Laya-CoreML (github.com/mizorewww/laya-coreml, Apache-2.0, PyPI laya-coreml) is an independent Core ML port of Convai Innovations Laya, written beside the mizorewww/laya-mlx sibling. pip install laya-coreml, then laya.load pulls a Hugging Face bundle such as aac6fef/laya-multilingual-coreml-ane. predict() returns probabilities for choice, ordinal score, and boolean noul. There is no autoregressive decode and no JSON to parse. The ANE FP16 bundle caps the whole request at 96 tokens, counting question, options, and state. Longer text raises a capacity error. The general multilingual CPU and GPU bundle aac6fef/laya-multilingual-coreml keeps a 1024 token window. README hardware note: M3 Max, 40-core GPU, 128 GiB, macOS 27.2. One 91-token question padded to 96, with prompt prep through formatting and with load excluded, measured 4.98 ms P50 and 5.31 ms P95 on ANE FP16 versus 6.94 ms and 7.39 ms for compiled MLX FP16, over 65,598 stable calls. Whole-system energy per decision was 0.1540 J versus 0.4288 J (2.78x), from SMC PSTR samples with anomaly rejection. A W8 palette variant reached 4.88 ms P50 and 3.19x energy. README states the requested 10x speedup was not achieved. Following upstream v0.3.5, fitted calibration temperatures are clamped to the range 0.5 through 5.0 because the shipped choice:11+ bucket is 0.1006, which would report a coin flip as near certainty. Raw buckets stay on agent.temperature_raw. Public GitHub counts were 1,527 stars and 128 forks when this listing was drafted. The project states it is not an official Convai Innovations or Apple release.",
    creator: {
      name: "mizorewww",
      handle: "mizorewww",
      githubUrl: "https://github.com/mizorewww",
    },
    jevUsage: {
      flowRole:
        "On-device Core ML System One: one forward pass for choice, score, and noul on Apple Silicon, with an ANE path for short requests",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Plain text or structured state plus a questions map (choice, score, or noul). ANE bundles enforce a 96 token total budget across question, options, and state.",
      decisionOut:
        "Probability answers per question key. No generated tokens. Calibration temperatures outside 0.5 to 5.0 are clamped, with a RuntimeWarning naming each bucket.",
      flowSteps: [
        "pip install laya-coreml on Apple Silicon, macOS 15+, Python 3.11 to 3.13",
        "laya.load a Hugging Face id such as aac6fef/laya-multilingual-coreml-ane, or a local directory with local_files_only",
        "Call predict with state text and a questions dict for choice, score, or noul",
        "For the Snake loop, pip install laya-coreml[demo], hf download the snake bundle, then laya-coreml-snake",
        "Export your own graph with laya-coreml[convert] and laya-coreml convert when you need a custom bundle",
      ],
      sourcedMetrics: [
        {
          claim:
            "ANE FP16 P50/P95 4.98/5.31 ms versus compiled MLX FP16 6.94/7.39 ms on one short multilingual question; system energy 0.1540 J versus 0.4288 J (2.78x). W8 palette: 4.88/5.23 ms and 3.19x energy. 65,598 stable calls on M3 Max. The 10x target was not met.",
          source: "github.com/mizorewww/laya-coreml README Measured on M3 Max",
        },
        {
          claim:
            "Three general-purpose FP16 checkpoints match upstream selected answers on 189/189 validation questions. ANE FP16 L96 passes 59/59 fitting questions with max calibrated-probability drift 0.002925. W8 drift is 0.014393 under a 0.02 gate. Six-bit and four-bit packs failed that gate and are not published.",
          source: "github.com/mizorewww/laya-coreml README Port fidelity and limits",
        },
        {
          claim:
            "Snake loop: 49.1 to 50.0 decisions/s across three uncapped 600-step episodes, zero deaths, two safety interventions. A paired 600-step check matches 600/600 actions. A 1024-token ANE request is about 91.7 ms in its serial screen.",
          source: "github.com/mizorewww/laya-coreml README and docs/SNAKE_BENCHMARKS.md",
        },
        {
          claim:
            "Public GitHub repo mizorewww/laya-coreml had 1527 stars and 128 forks when this listing was drafted.",
          source: "GitHub API 2026-09-29",
        },
      ],
    },
    howJevIsUsed:
      "This page is the Core ML and Neural Engine runtime. receptron-laya embeds Convai Laya ONNX inside Node. ollaya-dev-ollaya pulls many open decision graphs and serves POST /v1/systemone on port 11435. The learn guide at /learn/laya-vs-jev/laya-mlx-apple-silicon covers the MLX sibling (github.com/mizorewww/laya-mlx), including its own 7 to 16 ms short-decision notes. Laya-CoreML ships separate Hugging Face bundles: English 421M at 512 tokens, multilingual 322M at 1024, typed-decisions 421M at 1024, a Snake GPU pack, and two 96-token ANE packs (FP16 and approximate W8). Ordinary SDPA export stays on CPU plus GPU after RangeDim GPU shapes failed local fidelity checks. The ANE rewrite uses BC1L activations, 1x1 projections, and per-head attention. CPU still handles input and output boundaries. Cite mizorewww/laya-coreml README, docs/ANE_BENCHMARKS.md, and docs/USAGE.md. Upstream weights trace to Convai Innovations Laya (github.com/NandhaKishorM/laya).",
    keyFeatures: [
      "PyPI package laya-coreml with predict() for choice, score, and noul",
      "Hugging Face bundles with tokenizer, model card, checksums, and packaging-time validation",
      "ANE FP16 and W8 short-context packs plus CPU and GPU packs up to 1024 tokens",
      "Terminal Snake demo with visible probabilities, score, latency, and a cycle safety layer",
      "Calibration clamp to 0.5 through 5.0, with raw temperatures still readable",
      "Reproducible speed and energy benches under benchmarks/results",
    ],
    stack: [
      "Python 3.11 to 3.13",
      "Apple Core ML",
      "Apple Neural Engine for short ANE bundles",
      "Hugging Face weights under aac6fef",
    ],
    links: {
      website: "https://pypi.org/project/laya-coreml/",
      repo: "https://github.com/mizorewww/laya-coreml",
      docs: "https://github.com/mizorewww/laya-coreml/blob/main/docs/USAGE.md",
      demo: "https://raw.githubusercontent.com/mizorewww/laya-coreml/main/docs/assets/snake-demo.gif",
    },
    pricingNote:
      "Apache-2.0 code. Inference stays on your Mac. Hub downloads are the bandwidth cost. README labels the port independent of Convai Innovations and Apple.",
    firstSeen: "2026-09-29",
    relatedSlugs: [
      "receptron-laya",
      "ollaya-dev-ollaya",
      "githubnext-localjev",
      "wfzyx-von",
    ],
    relatedLearnSlugs: ["where-to-run-jev", "system-one"],
    faq: [
      {
        question: "Is this the Laya-MLX learn page or the Node client?",
        answer:
          "No. /learn/laya-vs-jev/laya-mlx-apple-silicon documents mizorewww/laya-mlx. receptron-laya is the npm ONNX library. ollaya-dev-ollaya is the multi-model daemon. This listing is the Core ML and Neural Engine product in mizorewww/laya-coreml.",
      },
      {
        question: "Why did a long prompt fail on the ANE model?",
        answer:
          "README: the ANE bundle has a 96 token total limit, including question, options, and state. Use aac6fef/laya-multilingual-coreml for the 1024 token general model.",
      },
      {
        question: "Did they hit a 10x speedup versus MLX?",
        answer:
          "README says the requested 10x improvement was not achieved. The published short-question gain is about 1.39x versus compiled MLX FP16, with about 2.78x better whole-system energy per decision on that same experiment.",
      },
      {
        question: "Are the Snake frames a latency certificate?",
        answer:
          "README separates them. The 4.98 ms figure is one short question. The Snake loop includes rendering serialization and ran at 49.1 to 50.0 decisions per second in three 600-step episodes. A full-game ANE speedup over compiled MLX is not claimed.",
      },
    ],
    metaTitle: "Laya-CoreML: Neural Engine typed decisions on Mac",
    metaDescription:
      "mizorewww/laya-coreml runs open-weight Laya on Core ML and the Neural Engine. README: 4.98 ms P50 on M3 Max, PyPI, and Hugging Face bundles.",
  },

  "alex314618-create-jevrev": {
    slug: "alex314618-create-jevrev",
    status: "published",
    problem:
      "A host agent that tries every idea in prose burns the token budget on weak branches, then declares victory when the demo merely looks finished.",
    targetUser:
      "Codex, Claude Code, OpenCode, and custom harness operators who want a CLI JSON protocol for approach sifting, round audits, and long-session watch, while the host agent keeps the session and writes the code.",
    overview:
      "JevRev (github.com/Alex314618-create/JevRev, npm package jevrev 0.2.0, MIT, Node 20+) is an LLM plus Jev alloy with three parts: JevSift, JevLoop, and JevLong. The LLM proposes and executes. Jev filters paths, scores rounds, and raises reminders. The CLI speaks JSON and leaves the session in the host agent's hands. JevSift ranks 2 to 12 candidate cards and emits work orders only for survivors. JevLoop audits recorded commands, tests, metrics, and artifacts, then returns a next action such as fix, verify, continue, replan, or human. JevLong tails JSONL for stalls, repeated failures, drift, tool trouble, and budget risk. Providers are hosted Jev (POST /v1/systemone, key JEVREV_JEV_API_KEY or TYPESAFE_API_KEY), local SemIf, or a replay file. jevrev activation runs a shadow cost policy and does not call Jev. README case Tidal City compares the same ChatGPT-6-Sol-Ultra prompt with and without the three parts: the JevRev city has named buildings, districts, time of day, camera switches, and WASD walk or swim. README case JSONL asks a Node 20 ingester to process 25,000 production-shaped events (about 2.3 MB, 184 malformed lines, 258 duplicate IDs) with isolation, first-seen order, dedupe, and at least 2x a conservative baseline. Public GitHub counts were 670 stars and 28 forks when this listing was drafted.",
    creator: {
      name: "renard",
      handle: "Alex314618-create",
      githubUrl: "https://github.com/Alex314618-create",
    },
    jevUsage: {
      flowRole:
        "Sideline decision layer: sift candidate approaches, audit each round against evidence, and watch long sessions, while the host LLM still owns execution",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Protocol v1 JSON: task goal, constraints, success checks, and 2 to 12 candidate cards for Sift. Loop specs freeze criteria and protected surfaces. Long reads JSONL events the agent already wrote.",
      decisionOut:
        "Sift statuses keep, review, or reject, plus next_action implement, ask_human, revise_candidates, or relax_constraints. Decide returns winner, merge, probe_more, no_winner, or human_review. Loop returns the next round action only after facts are checked.",
      flowSteps: [
        "npm install and npm run build, then node scripts/install-skill.mjs for codex, claude, agents, or dsh",
        "jevrev sift --provider jev on a rank request; strict survivors become bounded work orders",
        "Host agent implements only selected approaches and records a jevrev.evidence-bundle",
        "jevrev decide or jevrev loop audits the round; completion requires replayable evidence",
        "jevrev long watch and long status on .jevrev/long for stalls and protocol alerts",
      ],
      sourcedMetrics: [
        {
          claim:
            "JSONL sift: batch-index 0.9243 kept, regex-shortcut 0.9240 kept, state-scan 0.7965 cut by budget, baseline-parse 0.6100 rejected, worker-shards 0.6043 review, external-index 0.4931 rejected. regex-shortcut failed correctness (expected 184 malformed, actual 65). batch-index passed and was the winner. Mean throughput about 180,318 events/s versus about 180,531 for the failing regex path.",
          source: "github.com/Alex314618-create/JevRev README JSONL event ingestion",
        },
        {
          claim:
            "JevLoop on that case: round 1 returned fix_regression, round 2 verify, round 3 completed. Final state completed at round 3, 838 ms wall-clock, 1,628 tokens in replay provider accounting.",
          source: "github.com/Alex314618-create/JevRev README JSONL event ingestion",
        },
        {
          claim:
            "JevLong on the same case accepted 13 events on the first import and 0 on the duplicate import (13 duplicates). It reported a high-severity failure_loop alert and a critical protocol alert. Loop reached completed while Long progress_index stayed 0.",
          source: "github.com/Alex314618-create/JevRev README JSONL event ingestion",
        },
        {
          claim:
            "docs/PROTOCOL.md default-v1 thresholds include goal_fit 0.34, constraint_fit 0.55, feasibility 0.34, validation_quality 0.25, execution_value 0.45, confidence 0.2, duplicate 0.75. Example policy profile jev/jev-1.13.0.",
          source: "github.com/Alex314618-create/JevRev docs/PROTOCOL.md",
        },
        {
          claim:
            "Public GitHub repo Alex314618-create/JevRev had 670 stars and 28 forks when this listing was drafted. package.json version is 0.2.0.",
          source: "GitHub API 2026-09-29 and package.json",
        },
      ],
    },
    howJevIsUsed:
      "JevRev is the three-part alloy with a host-owned session. thruwire-foreman supervises a software factory above Codex or OpenCode workers and steers continue, stop, or finish. tianyucodings-jevharness lets an LLM author a harness, freezes the Python, and evolves it with GEPA. samuelfaj-distill routes consults inside a Rust TUI and keeps tool permissions in Distill. miuuyy-astra-ares sets reasoning effort inside a patched Codex binary. JevRev instead exposes jevrev sift, decide, loop, and long as JSON contracts (@typesafe-ai/sdk on the hosted path). Reason codes such as GOAL_MISMATCH, CONSTRAINT_RISK, and BUDGET_CUTOFF are policy rules, not a chain of thought. Hard-constraint failures can reject a card before the confidence route. Replay files must include candidate_order or JevRev refuses to apply answers to the wrong card. Builder notes are omitted from Decide judge state. The TUI (run jevrev) lists registered host sessions and shows Kanban evidence. Loop and Long switches persist per session and do not start an observer or steer the host. Cite Alex314618-create/JevRev README and docs/PROTOCOL.md.",
    keyFeatures: [
      "JevSift, JevLoop, and JevLong as separate CLI commands with JSON envelopes",
      "Skill installer for Codex, Claude Code, agents, and dsh hosts",
      "Hosted Jev, local SemIf (default 127.0.0.1:4878), and offline replay",
      "Shadow activation policy that compares wrong-path cost with bounded probes and does not call Jev",
      "Interactive cockpit for registered sessions, evidence, and monitor switches",
      "README cases: Tidal City build comparison and a 25,000-event JSONL contract",
    ],
    stack: [
      "Node.js 20+",
      "TypeScript",
      "@typesafe-ai/sdk",
      "Optional local SemIf",
    ],
    links: {
      repo: "https://github.com/Alex314618-create/JevRev",
      docs: "https://github.com/Alex314618-create/JevRev/blob/main/docs/PROTOCOL.md",
      website: "https://github.com/Alex314618-create/JevRev",
    },
    pricingNote:
      "MIT package. Hosted Jev bills per System One call. SemIf and replay runs stay on your machine. README JSONL token figure is replay-provider accounting for that case, not a price quote.",
    firstSeen: "2026-09-29",
    relatedSlugs: [
      "thruwire-foreman",
      "tianyucodings-jevharness",
      "samuelfaj-distill",
      "miuuyy-astra-ares",
    ],
    relatedLearnSlugs: ["patterns", "use-cases"],
    faq: [
      {
        question: "Does JevRev take over the coding session?",
        answer:
          "README and docs/AUTHORITY.md keep execution with the host agent. JevRev returns JSON decisions, work orders, and alerts. The TUI monitor switches do not steer the host.",
      },
      {
        question: "What did the 25,000-event case actually prove?",
        answer:
          "README: regex-shortcut and batch-index both scored about 0.92 and both were fast (about 180k events/s). regex missed malformed lines (65 versus 184). batch-index passed the contract and was selected. That is a project case, not an independent lab certificate.",
      },
      {
        question: "Does jevrev activation call TypeSafe?",
        answer:
          "No. docs/PROTOCOL.md says activation always returns shadow true. It does not call Jev, start work, or change the host's next action.",
      },
      {
        question: "How is this different from Foreman or JevHarness?",
        answer:
          "Foreman supervises factory evidence above coding workers. JevHarness freezes an LLM-written harness and evolves it. JevRev is the Sift, Loop, and Long CLI that any host can call without handing over the session.",
      },
    ],
    metaTitle: "JevRev: Sift, Loop, and Long beside the host LLM",
    metaDescription:
      "Alex314618-create/JevRev is a CLI JSON alloy: JevSift, JevLoop, and JevLong. Host agents keep the session. README includes a 25,000-event JSONL case.",
  },

  "agricidaniel-jev-seo": {
    slug: "agricidaniel-jev-seo",
    status: "published",
    problem:
      "SEO audits either dump a template checklist or ask a chat model for a vibe score, and neither keeps the probabilities next to the fix list.",
    targetUser:
      "Marketers and developers who want one homepage URL in, a live crawl plus Jev judgments, and the same findings as a client PDF, an XLSX tracker, and Markdown.",
    overview:
      "jev-seo (github.com/AgriciDaniel/jev-seo, MIT, Python 3.10+, README version badge 0.1.1, GitHub Actions CI on main) audits a live site from one homepage URL. It crawls, checks 52 rules tied to Google Search Central, pulls Core Web Vitals through PageSpeed Insights, and asks TypeSafe Jev typed questions about pages and the site. Code scores and ranks every fix. PDF, XLSX, and Markdown render from one audit.json. Run bin/jevseo or the Claude Code skill /jev-seo. Standard mode needs no SEO data subscription. README prices Jev at 0.042 USD per million input tokens, about 0.00015 USD per page, and about a cent per site. Optional --full adds DataForSEO rankings, keywords, and backlinks at about 0.30 USD per site. Hard caps default to 0.25 USD for Jev and 1.00 USD for DataForSEO, checked before each request. Without TYPESAFE_API_KEY the crawl still runs, Jev sections are marked not assessed, and the score is labelled a partial audit. Page cap defaults to 60. Homepage type is set by code and is never asked. Public GitHub counts were 169 stars and 41 forks when this listing was drafted. An example --full audit of claude-seo.md from 2026-09-22 ships under examples/claude-seo.md.",
    creator: {
      name: "Agrici.Daniel",
      handle: "AgriciDaniel",
      githubUrl: "https://github.com/AgriciDaniel",
    },
    jevUsage: {
      flowRole:
        "Per-page and site-level typed judgments on a live crawl, with code owning rules, scores, and report rendering",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "One System One request per page carries every page question over shared state (page text capped at 6,000 characters). Site questions use homepage text, navigation, and up to 80 page titles. Model jev-latest, resolved to jev-1.13.0 on 2026-09-21 per references/judgments.md.",
      decisionOut:
        "Choice, Score, and Noul answers with probabilities kept in the workbook. Decisive band: Choice confidence at least 0.80; Score when at least 0.80 of probability sits on one side of the midpoint; Noul at P(yes) 0.80 or above, or 0.20 or below. Everything else is marked to verify.",
      flowSteps: [
        "Clone, pip install -r requirements.txt, and copy .env.example (TYPESAFE_API_KEY)",
        "bin/jevseo doctor checks dependencies and keys without printing values",
        "bin/jevseo audit URL writes audit.json and digest.md; optional Playwright for JS-only pages",
        "Jev answers 13 page questions, 5 site questions, and cannibalization pairs (Jaccard overlap at least 0.4, at most 40 pairs)",
        "bin/jevseo render writes report.pdf, report.xlsx, and report.md; narrative checks refuse unknown action IDs",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cost table: Jev at 0.042 USD per million input tokens, about 0.00015 USD per page; --full DataForSEO about 0.30 USD per site. Defaults: --jev-budget 0.25 USD, --dfs-budget 1.00 USD.",
          source: "github.com/AgriciDaniel/jev-seo README What runs where",
        },
        {
          claim:
            "references/judgments.md observed on typesafe.ai, 2026-09-21: 14 requests, 47,181 input tokens, 0.0020 USD. About 3,400 input tokens per page.",
          source: "github.com/AgriciDaniel/jev-seo references/judgments.md",
        },
        {
          claim:
            "Evaluation dated 2026-09-22: same 59 pages twice, scores moved 0.03 or less on average, confident page types agreed 44/44. Blind second judge: helpfulness and specificity 28/29, opens with the point 23/23, next step 16/16, keyword relevance 27/30. The second judge is another model, not a human panel.",
          source: "github.com/AgriciDaniel/jev-seo README How far to trust it",
        },
        {
          claim:
            "Public GitHub repo AgriciDaniel/jev-seo had 169 stars and 41 forks when this listing was drafted. README version badge is 0.1.1.",
          source: "GitHub API 2026-09-29 and README",
        },
      ],
    },
    howJevIsUsed:
      "jev-seo is the live SEO audit: one homepage URL, a crawl, 52 rules, Jev judgments, and three reports from one JSON file. iannuttall-internal-links crawls up to 500 pages and exports internal link pairs as CSV or JSON. docjev classifies and splits documents from natural-language rules. kylejeong-jev-as-judge scores writing on rubric dimensions. kraayenjon-ai-slop-detector flags low-effort pages. Here, code refuses to ask Jev what the crawl already knows: missing meta skips meta_fit, missing H1 skips h1_fit. Page questions cover type, intent, importance, action, helpfulness, specificity, trust, citability, answer-first, next step, title fit, meta fit, and H1 fit. Site questions cover business model, value prop, entity clarity, topical focus, and local-area service. Competing pages become a finding when Noul P(yes) is 0.6 or higher. Content quality is 70 percent importance-weighted helpfulness, specificity, and trust, plus 30 percent rules. Scores rank the work. README says they do not predict rankings or traffic, and that the tool is not a rank tracker or a Search Console replacement. Cite AgriciDaniel/jev-seo README, references/judgments.md, and references/evaluation.md.",
    keyFeatures: [
      "bin/jevseo audit, render, rescore, and doctor commands",
      "Claude Code skill workflow in SKILL.md",
      "52 rules across crawl, on-page, content, links, structured data, AI crawlers, performance, and security",
      "PDF, XLSX action tracker with dropdowns, and Markdown with charts from one audit.json",
      "Narrative gate: unknown action IDs refused, numbers missing from the audit flagged",
      "Offline unittest suite with no network and no spend",
    ],
    stack: [
      "Python 3.10+",
      "TypeSafe System One (jev-latest)",
      "Google PageSpeed Insights",
      "Optional DataForSEO and Playwright",
      "WeasyPrint (Pango) for PDF",
    ],
    links: {
      repo: "https://github.com/AgriciDaniel/jev-seo",
      docs: "https://github.com/AgriciDaniel/jev-seo/blob/main/references/judgments.md",
      website: "https://github.com/AgriciDaniel/jev-seo",
      demo: "https://github.com/AgriciDaniel/jev-seo/blob/main/examples/claude-seo.md/report.md",
    },
    pricingNote:
      "MIT. Crawl, rules, and reports run locally. Jev and optional DataForSEO bill to your keys, with README default budgets of 0.25 USD and 1.00 USD.",
    firstSeen: "2026-09-29",
    relatedSlugs: [
      "iannuttall-internal-links",
      "docjev",
      "kylejeong-jev-as-judge",
      "kraayenjon-ai-slop-detector",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does this replace Google Search Console?",
        answer:
          "README says it is an evidence tool for one audit. It does not measure traffic, revenue, or rankings over time, and it is not a rank tracker.",
      },
      {
        question: "What does a standard run cost?",
        answer:
          "README: about a cent in Jev per site at 0.042 USD per million input tokens, roughly 0.00015 USD per page. --full DataForSEO is about 0.30 USD per site. Caps are checked before each call.",
      },
      {
        question: "What if I have no TypeSafe key?",
        answer:
          "The audit still crawls and scores rules. Jev sections are marked not assessed and the score is labelled a partial audit.",
      },
      {
        question: "How is this different from the internal links tool?",
        answer:
          "iannuttall-internal-links classifies pages and exports which URLs should link. jev-seo runs a rule crawl, Jev content judgments, and PDF, XLSX, and Markdown reports from the same audit file.",
      },
    ],
    metaTitle: "jev-seo: live site audit with Jev judgments",
    metaDescription:
      "AgriciDaniel/jev-seo crawls one homepage URL, asks Jev typed SEO questions, and renders PDF, XLSX, and Markdown. README v0.1.1, about a cent in Jev.",
  },

  "avinash-jetwani-jevmem": {
    slug: "avinash-jetwani-jevmem",
    status: "published",
    problem:
      "Coding agents forget project decisions between sessions, and local memory tools that only embed and rerank still miss the line you actually needed.",
    targetUser:
      "Claude Code, Cursor, and Codex users who want automatic JEVMEM.md project memory with typed decide, recall, and optional PreToolUse guardrails without hand-maintaining CLAUDE.md walls.",
    overview:
      "jevmem (github.com/Avinash-jetwani/jevmem, npm jevmem, MIT, 0.6.1 on 2026-09-30, GitHub Actions CI) is Avinash Jetwani's automatic project memory for Claude Code, with Cursor and Codex paths via init and MCP. Stop hooks run async decide on each turn; UserPromptSubmit injects recalled lines. JEVMEM.md stores decision, constraint, bug, todo, dead end, and superseded kinds with stable ids. Code applies thresholds from jevmem.config.json over Jev probabilities, not prompt prose. Optional writer condenses a turn with OpenAI or Anthropic. PreToolUse guard scores Bash, Edit, and Write against saved rules. Foreign lines from git pulls pass a memory-poisoning noul gate before recall. Listed in Anthropic's Claude plugin directory; marketplace and npm init cover Cursor and Codex. Public GitHub counts were 100 stars when this listing was drafted.",
    creator: {
      name: "Avinash Jetwani",
      handle: "Avinash-jetwani",
      githubUrl: "https://github.com/Avinash-jetwani",
    },
    jevUsage: {
      flowRole:
        "Per-turn decide and save, per-prompt recall, foreign-line poisoning check, and optional PreToolUse guard on tool calls",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Scrubbed user and assistant turns, prior 2 turns, live JEVMEM.md lines, and for guard checks the tool name plus scrubbed command or edit snippet when it overlaps a saved rule.",
      decisionOut:
        "Save or skip with line kind; supersede targets by id; recall injects wanted lines; guard maps risk to ask, block, or allow; poisoning gate withholds foreign instruction lines.",
      flowSteps: [
        "Stop hook or MCP add_memory scrubs secrets and emails, then asks Jev typed questions per docs/how-it-works.md",
        "Thresholds in jevmem.config.json decide save, kind, and contradiction handling in code",
        "Writer off: up to 2 sentences from Jev-picked lines; writer on: optional small LLM condenses the turn",
        "UserPromptSubmit recalls by asking each live line (word overlap fallback after 1 second)",
        "PreToolUse guard batches risk questions on Bash, Edit, and Write; audit --security --ci replays poisoning checks",
      ],
      sourcedMetrics: [
        {
          claim:
            "README benchmark table on 66 held-out turns (2026-09-30, jevmem 0.6.0 auto): 98.5% save/skip, 95.5% save+kind, 5/5 contradictions, p50 276 ms, about $0.000157 per decision.",
          source: "github.com/Avinash-jetwani/jevmem README and results/eval-heldout-2026-09-30-v060.json",
        },
        {
          claim:
            "Recall held-out v2 (README 0.6 section): 75/78 wanted lines versus 0.5.9 at 55/78; unrelated prompts that got a line 1/18 versus 5/18; superseded lines injected 0/90 in both builds.",
          source: "github.com/Avinash-jetwani/jevmem README What's new in 0.6",
        },
        {
          claim:
            "Security eval (README Privacy): planted instruction lines blocked 20/22 with 0 false blocks on 22 legitimate rules (2026-09-25 test set).",
          source: "github.com/Avinash-jetwani/jevmem README Privacy and SECURITY.md",
        },
        {
          claim:
            "Public GitHub repo Avinash-jetwani/jevmem had 100 stars when this listing was drafted. npm jevmem 0.6.1 released 2026-09-30 per CHANGELOG.",
          source: "GitHub API and CHANGELOG 2026-09-30",
        },
      ],
    },
    howJevIsUsed:
      "jevmem is end-to-end project memory, not a reranker on an existing store. kitfunso-hippo-memory retrieves local rows and optionally reranks candidates with Jev. leepokai-jev-guard risk-scores every tool call and scans untrusted results for injection. tamaratran-jev-pruner compacts Bash stdout in hooks. jevmem owns decide on Stop, recall on UserPromptSubmit, dead ends that surface as Already tried, supersede instead of delete, and a guard backstop on edits and shell. Cite Avinash-jetwani/jevmem README, docs/how-it-works.md, docs/guardrails.md, docs/dead-ends.md, docs/benchmark.md, CHANGELOG, PRIVACY.md, and SECURITY.md only.",
    keyFeatures: [
      "Claude Code plugin directory listing plus npm global CLI",
      "JEVMEM.md line kinds with supersede chains and dead end recall",
      "Configurable Jev thresholds and optional OpenAI or Anthropic writer",
      "PreToolUse guard on Bash, Edit, and Write with session policy",
      "Memory-poisoning check on foreign lines before context injection",
      "Cursor, Codex, and Claude Desktop MCP paths documented in docs/mcp.md",
    ],
    stack: [
      "TypeScript",
      "npm jevmem",
      "TypeSafe Jev",
      "Claude Code Stop and UserPromptSubmit hooks",
      "MCP server for Cursor and Codex",
    ],
    links: {
      repo: "https://github.com/Avinash-jetwani/jevmem",
      docs: "https://github.com/Avinash-jetwani/jevmem/blob/main/docs/how-it-works.md",
      website: "https://www.npmjs.com/package/jevmem",
    },
    pricingNote:
      "MIT CLI. Jev calls bill per TypeSafe or gateway pricing documented in docs/cost.md; optional writer adds OpenAI or Anthropic usage.",
    firstSeen: "2026-09-30",
    relatedSlugs: [
      "kitfunso-hippo-memory",
      "leepokai-jev-guard",
      "tamaratran-jev-pruner",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "How is jevmem different from Hippo Memory?",
        answer:
          "Hippo is a local recall index with optional Jev reranking on candidates. jevmem captures turns into JEVMEM.md, recalls with per-line Jev questions, and ships guard and poisoning gates on the memory file itself.",
      },
      {
        question: "Does recall run on every prompt in Claude Code?",
        answer:
          "README: UserPromptSubmit injects relevant live lines automatically when hooks are enabled via the plugin or jevmem init --tool claude.",
      },
      {
        question: "What does the guard check?",
        answer:
          "docs/guardrails.md: PreToolUse on Bash, Edit, and Write compares the call against saved constraint lines with Jev risk scoring and can ask or block per policy.",
      },
      {
        question: "Is capture automatic in Cursor?",
        answer:
          "README Works with table: Cursor relies on agent-initiated MCP add_memory and search_memory prompted by .cursor/rules/jevmem.mdc, not Stop hooks.",
      },
    ],
    metaTitle: "jevmem: automatic Claude Code project memory with Jev",
    metaDescription:
      "Avinash-jetwani/jevmem npm hooks decide, recall, guard, and poisoning checks on JEVMEM.md with TypeSafe Jev. Plugin directory, 0.6.1, published evals in README.",
  },

  "abovecolin-ha-jev": {
    slug: "abovecolin-ha-jev",
    status: "published",
    problem:
      "Home Assistant automations excel at sensors and scripts, but house-level judgments still get wedged into brittle template logic or a chat model with no calibrated entity to automate on.",
    targetUser:
      "Home Assistant 2026.9+ operators who want TypeSafe Jev questions as sensors, service actions, AI Task fields, Assist conversation, and blueprint-ready automations with daily cost visibility.",
    overview:
      "HA-Jev (github.com/AboveColin/HA-Jev, HACS custom integration, hassfest and HACS CI) brings TypeSafe Jev into Home Assistant as AboveColin's Jev (TypeSafe) integration. Each configured question becomes a sensor exposing noul probability, choice distribution, or score value. Services jev.noul, jev.choice, jev.score, and jev.ask return response variables inside automations. An AI Task entity answers ai_task.generate_data when called. A conversation agent routes Assist through the same model. House check opens Repairs for week-long unavailable entities, low batteries, and suspicious states with one-click fixes. Daily token spend and budget sensors sit beside entities. 25 blueprints and 15 examples ship in repo; full docs live at jev.cdevries.dev. API client is github.com/AboveColin/jevclient. README states not affiliated with TypeSafe. Public GitHub counts were 68 stars when this listing was drafted.",
    creator: {
      name: "Colin",
      handle: "AboveColin",
      githubUrl: "https://github.com/AboveColin",
    },
    jevUsage: {
      flowRole:
        "Home entity sensors from standing questions, on-demand actions, AI Task and Assist conversation paths, and house-check repair prompts",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Question text plus Home Assistant state context documented at jev.cdevries.dev/writing-questions/, including entity attributes the integration attaches per question type.",
      decisionOut:
        "Sensor state as probability, labeled choice with distribution, or numeric score; automation response variables from jev.* actions; AI Task typed fields; conversation agent replies.",
      flowSteps: [
        "Install via HACS custom repository or copy custom_components/jev from latest release",
        "Config flow with TypeSafe API key; optional OpenRouter address and ~typesafe/jev-latest model per install docs",
        "Define questions in UI or YAML; integration polls or triggers updates per question config",
        "Automations call jev.noul, jev.choice, jev.score, or jev.ask, or trigger on binary_sensor.jev_* entities",
        "House check batches repair candidates; cost sensors aggregate calls and tokens against daily budget",
      ],
      sourcedMetrics: [
        {
          claim:
            "jev.cdevries.dev documents 25 importable blueprints (7 question-driven, 18 situational) and 15 worked examples, 4 pairing Jev with an LLM.",
          source: "jev.cdevries.dev blueprints and examples index",
        },
        {
          claim:
            "README requires Home Assistant 2026.9 or newer; hassfest, tests, and HACS GitHub Actions badges on main.",
          source: "github.com/AboveColin/HA-Jev README Installation",
        },
        {
          claim:
            "Public GitHub repo AboveColin/HA-Jev had 68 stars when this listing was drafted.",
          source: "GitHub API 2026-09-30",
        },
      ],
    },
    howJevIsUsed:
      "This is the first Home Assistant integration on the directory: Jev is not generating chat prose, it is answering typed questions whose outputs become entities and service responses you can put in YAML automations. classifier-dev is the hosted API product when you only need HTTP gates outside HA. browser-use-jev-ultrafast shows Jev driving another automation surface (the browser) with different state. docjev classifies documents from rules, not house sensors. Cite jev.cdevries.dev (questions UI and YAML, actions, AI Task, conversation, house check, cost, measurements, limitations) and AboveColin/HA-Jev README. Not a TypeSafe official release.",
    keyFeatures: [
      "Question sensors for noul, choice, and score with confidence semantics",
      "jev.noul, jev.choice, jev.score, and jev.ask automation actions",
      "AI Task and Assist conversation agent integrations",
      "House check Repairs card with quick fixes",
      "Daily cost and token budget reporting",
      "HACS install path with 25 blueprints",
    ],
    stack: [
      "Python",
      "Home Assistant 2026.9+",
      "jevclient",
      "TypeSafe Jev API",
      "HACS custom integration",
    ],
    links: {
      repo: "https://github.com/AboveColin/HA-Jev",
      docs: "https://jev.cdevries.dev",
      website: "https://jev.cdevries.dev/install/",
    },
    pricingNote:
      "Integration is open source; Jev API usage bills to your TypeSafe or OpenRouter key per jev.cdevries.dev/cost/ daily budget docs.",
    firstSeen: "2026-09-30",
    relatedSlugs: [
      "classifier-dev",
      "docjev",
      "browser-use-jev-ultrafast",
    ],
    relatedLearnSlugs: ["use-cases", "jev-typesafe"],
    faq: [
      {
        question: "Is this an official TypeSafe or Home Assistant integration?",
        answer:
          "README and docs state it is not affiliated with TypeSafe. It is a community HACS custom repository maintained by AboveColin.",
      },
      {
        question: "What Home Assistant version is required?",
        answer:
          "README: 2026.9 or newer, plus an API key from typesafe.ai or OpenRouter per install page.",
      },
      {
        question: "How do I add the first question?",
        answer:
          "jev.cdevries.dev/first-question/ walks through UI or YAML after the config flow completes.",
      },
      {
        question: "Where is the Python client documented?",
        answer:
          "README points to github.com/AboveColin/jevclient as the API client used by the integration.",
      },
    ],
    metaTitle: "HA-Jev: TypeSafe Jev sensors for Home Assistant",
    metaDescription:
      "AboveColin/HA-Jev HACS turns Jev questions into HA entities, jev.* actions, AI Task, Assist, house check, and blueprints. Docs at jev.cdevries.dev.",
  },

  "hitsz-tmg-jevembed": {
    slug: "hitsz-tmg-jevembed",
    status: "published",
    problem:
      "Embedding models return vectors, not calibrated Choice, Score, or Noul decisions, so teams either call hosted System One or bolt chat JSON on top of retrieval.",
    targetUser:
      "ML engineers and researchers who want open-weight embedding backends fine-tuned into Jev-style decisions with synthesis, LoRA training, HTTP serve, playground, and published JevEmbed-Data benchmarks.",
    overview:
      "JevEmbed (github.com/HITsz-TMG/JevEmbed, Apache-2.0) is HITsz-TMG's toolkit to turn embedding models into System One shaped Choice, Score, and Noul outputs without autoregressive decoding. Hugging Face collection HIT-TMG/lychee-jevembed ships merged and LoRA adapters such as JevEmbed-Qwen3-Embedding-0.6B and 4B; dataset HIT-TMG/JevEmbed-Data lists about 1.67 million labeled questions. CLI python -m jevembed runs inference; --serve exposes POST /v1/systemone; --playground opens an interactive UI. Docs cover synthesis, LoRA fine-tune on 1,601,157 training questions, benchmark JSONL, and HTTP backends including external /v1/embeddings. README reports held-out JevEmbed-Data test accuracy up to 85.86% overall for the 4B fine-tune versus 36.29% base Qwen3-Embedding-4B. Independent of TypeSafe; not claiming official affiliation. Public GitHub counts were 60 stars when this listing was drafted.",
    creator: {
      name: "HITsz-TMG",
      handle: "HITsz-TMG",
      githubUrl: "https://github.com/HITsz-TMG",
    },
    jevUsage: {
      flowRole:
        "Embedding forward pass plus decision heads for Choice, Score, and Noul; training, benchmark, HTTP API, and playground exploration",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "System One request JSON with state text and questions map per examples/ and docs/examples-and-scoring.md; configs select base or JevEmbed fine-tuned weights.",
      decisionOut:
        "Probability distributions and labels matching System One response shape from local inference or HTTP /v1/systemone.",
      flowSteps: [
        "Load ModelConfig YAML for a base encoder or HIT-TMG JevEmbed release",
        "JevEmbed.evaluate or CLI --input runs Choice, Score, or Noul heads on embeddings",
        "jevembed-benchmark writes per-model results.json and summary.json on JSONL suites",
        "LoRA train on JevEmbed-Data JSONL with documented BF16 batch 512 and rank 64 recipe",
        "python -m jevembed --serve listens for curl POST /v1/systemone clients",
      ],
      sourcedMetrics: [
        {
          claim:
            "README JevEmbed-Data test table: JevEmbed-Qwen3-Embedding-4B reaches 90.31% Choice, 73.41% Score, 95.88% Noul, 85.86% overall on 64,110 hard-labeled questions of 66,482 total test rows.",
          source: "github.com/HITsz-TMG/JevEmbed README and reports/JEVEMBED_DATA_TEST.md",
        },
        {
          claim:
            "Fine-tuning recipe: 1 epoch on 1,601,157 training questions, BF16, effective batch 512, LoRA rank 64, learning rate 2e-4, 1024 token truncation.",
          source: "github.com/HITsz-TMG/JevEmbed README LoRA fine-tuning",
        },
        {
          claim:
            "Dataset HIT-TMG/JevEmbed-Data documents about 1.67 million labeled Choice, Score, and Noul questions for training.",
          source: "github.com/HITsz-TMG/JevEmbed README News and Hugging Face dataset card",
        },
        {
          claim:
            "Public GitHub repo HITsz-TMG/JevEmbed had 60 stars when this listing was drafted.",
          source: "GitHub API 2026-09-30",
        },
      ],
    },
    howJevIsUsed:
      "JevEmbed targets embedding checkpoints, not Apple Neural Engine ports. mizorewww-laya-coreml runs open Laya on Core ML with ANE bundles and Snake demos. togethercomputer-tev1 fine-tunes Qwen for letter Choice on Together. logan-markewich-jeff self-hosts GLiFormer System One HTTP. featherless-simple-jev assembles logits from arbitrary HF models without HIT-TMG's JevEmbed-Data recipe. Use JevEmbed when the story is turn my embedder into decisions with published HF weights and academic citations. Cite HITsz-TMG/JevEmbed README, docs/benchmark.md, docs/training.md, docs/http.md, docs/playground.md, and reports/JEVEMBED_DATA_TEST.md only.",
    keyFeatures: [
      "Choice, Score, and Noul heads on multiple embedding backends",
      "Hugging Face JevEmbed model collection and JevEmbed-Data dataset",
      "Supervised synthesis pipeline for new question schemas",
      "LoRA fine-tune with merged releases and adapter cards",
      "HTTP POST /v1/systemone server and interactive playground",
      "jevembed-benchmark JSONL runner with summary comparison",
    ],
    stack: [
      "Python 3.10 to 3.12",
      "Sentence Transformers and configurable backends",
      "Hugging Face weights under HIT-TMG",
      "Apache-2.0",
    ],
    links: {
      repo: "https://github.com/HITsz-TMG/JevEmbed",
      docs: "https://github.com/HITsz-TMG/JevEmbed/blob/main/docs/http.md",
      website: "https://huggingface.co/collections/HIT-TMG/lychee-jevembed",
    },
    pricingNote:
      "Open source toolkit; inference cost is your GPU, electricity, and optional external embedding HTTP fees documented in docs/http.md.",
    firstSeen: "2026-09-30",
    relatedSlugs: [
      "mizorewww-laya-coreml",
      "togethercomputer-tev1",
      "logan-markewich-jeff",
      "featherless-simple-jev",
    ],
    relatedLearnSlugs: ["where-to-run-jev", "system-one"],
    faq: [
      {
        question: "Is JevEmbed a TypeSafe or System One host?",
        answer:
          "It implements System One shaped requests and responses on embedding models. It is an independent HITsz-TMG research toolkit, not a TypeSafe product.",
      },
      {
        question: "How do I try a released model quickly?",
        answer:
          "README Quick start: python -m jevembed with a configs/jevembed-qwen3-embedding-0.6b.yaml config, or --playground for the browser UI.",
      },
      {
        question: "What data was used for the published accuracy jumps?",
        answer:
          "README cites JevEmbed-Data with 1,601,157 training questions and the 66,482 question test split in reports/JEVEMBED_DATA_TEST.md.",
      },
      {
        question: "How is this different from Laya-CoreML?",
        answer:
          "Laya-CoreML ports Convai Laya to Apple Silicon Core ML. JevEmbed fine-tunes general embedding encoders on JevEmbed-Data and serves /v1/systemone from Python.",
      },
    ],
    metaTitle: "JevEmbed: embedding models as Choice, Score, Noul decisions",
    metaDescription:
      "HITsz-TMG/JevEmbed fine-tunes embedders on JevEmbed-Data, serves POST /v1/systemone, and publishes HF models to 85.86% overall test accuracy on the 4B release.",
  },

  "deepopen-com-deepopen": {
    slug: "deepopen-com-deepopen",
    status: "published",
    problem:
      "English-only open encoders and a single hosted System One endpoint both miss the case where the text is not Latin script, the checkpoint has to change before the forward pass, and you still want Choice, Score, and Noul probabilities you can threshold.",
    targetUser:
      "Python teams who want an Apache-2.0 local decision stack with an automatic English, multilingual, or typed-decisions router, and who will read the README limits on high-cardinality labels and zero-shot typed workflows.",
    overview:
      "DeepOpen (github.com/deepopen-com/deepopen, Apache-2.0, pip install deepopen) is an open multilingual non-autoregressive System 1 decision engine built on Laya. 1 forward pass answers choice, score, and noul over text, email, ticket, or JSON state. The Router detects script and language in pure Python, under 0.5 ms per the README, and sends the request to one of 3 Hugging Face checkpoints: convaiinnovations/deepopen (ModernBERT-large, 421M, 512 context, English), convaiinnovations/deepopen-multilingual (mmBERT-base, 322M, 1024 context, 100+ languages, README says about 2x the English checkpoint on speed), and convaiinnovations/deepopen-typed-decisions (ModernBERT-large, 421M, 1024 context, fine-tuned on typed workflows). You can also call deepopen.load on the root repo with subfolder multilingual or typed-decisions. README speed tables on a Tesla T4 put one multilingual question at 32.8 ms and a 10-question batch at 72.3 ms (7.2 ms per question). Preload keeps checkpoints resident. The default max_loaded of 1 rebuilds a model on every language switch, measured at a 7.4 s median on CPU and 10.3 s on T4. The GitHub repo lists www.deepopen.com as its homepage. Public counts were 1,633 stars and 217 forks when this listing was drafted.",
    creator: {
      name: "Deep Open",
      handle: "deepopen-com",
      githubUrl: "https://github.com/deepopen-com",
      company: "Deep Open",
      companyUrl: "https://www.deepopen.com",
    },
    creatorQuote: {
      text: "The built-in Router is the recommended entry point: it evaluates any state in any language, automatically detects scripts and languages in sub-milliseconds, and dispatches to the optimal checkpoint in a single forward pass.",
      attributedTo: "DeepOpen README",
      sourceUrl: "https://github.com/deepopen-com/deepopen/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Script-aware Router picks one of 3 non-autoregressive checkpoints, then 1 forward pass answers Choice, Score, and Noul",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Any state object (email fields, ticket text, or JSON) plus a questions map of choice criteria, score rubrics, or noul instructions. router.route inspects script and language without a forward pass.",
      decisionOut:
        "answers with choice label and confidence, score expectation, or noul probability, plus routing metadata (model, repo, reason). Preset packs cover model routing, prompt guardrails, moderation, and ticket triage.",
      flowSteps: [
        "pip install deepopen, then Router(preload=True) or deepopen.load on convaiinnovations/deepopen",
        "Pass state and a questions map of choice, score, and noul items, or a preset such as triage_questions()",
        "Router detects script in pure Python and dispatches to english, multilingual, or an explicit typed-decisions override",
        "1 forward pass returns answers and routing.reason. README example gates automated action at confidence 0.85 and escalates the rest",
        "For a dedicated pipeline, load one subfolder and skip the router. Raise head_max_len when a choice has dozens of options",
      ],
      sourcedMetrics: [
        {
          claim:
            "Checkpoint table: deepopen is ModernBERT-large, 421M, 512 context. deepopen-multilingual is mmBERT-base, 322M, 1024 context. deepopen-typed-decisions is ModernBERT-large, 421M, 1024 context.",
          source: "github.com/deepopen-com/deepopen README checkpoint table",
        },
        {
          claim:
            "Tesla T4 speed table: multilingual 32.8 ms for 1 question, 40.1 ms for 5, 72.3 ms for 10 (7.2 ms per question), 337 ms for 50. English checkpoint: 39.5 ms, 84.5 ms, 158.6 ms, 771 ms on the same rows. Batched throughput 103 to 332 questions per second on one T4.",
          source: "github.com/deepopen-com/deepopen README Speed (Tesla T4, measured)",
        },
        {
          claim:
            "typed-decisions, 400 cases and 2,000 decisions: deepopen-typed-decisions accuracy 0.766, soft accuracy 0.471, Brier 0.062, ECE 0.213, score MAE 0.242. Published Jev 1.13.0 on the same table: 0.727, 0.580, 0.148, 0.144, 0.391. Base checkpoints 0.362 and 0.342 sit under the 0.461 majority-class baseline. README says the 0.766 figure is the fine-tune, and that Jev still leads soft accuracy and raw ECE before temperature fitting.",
          source: "github.com/deepopen-com/deepopen README typed-decisions table and Honest limits",
        },
        {
          claim:
            "Shared route table, 17,416 questions: Router keeps English MASSIVE intent at 0.783 and lifts 13 other languages from 0.306 to 0.451. XNLI English 0.860, 14 other languages 0.731. Languages usable above 3x random: 45 of 51. Khmer on the English checkpoint: 0.000 accuracy at 0.952 confidence. Banking77: Jev 0.870 on 72 labels, deepopen 0.425 on 77 labels at the default head budget.",
          source: "github.com/deepopen-com/deepopen README Why Route and Where Jev leads",
        },
        {
          claim:
            "Public GitHub repo deepopen-com/deepopen had 1,633 stars and 217 forks on 2026-10-01. License Apache-2.0. Last push 2026-09-28.",
          source: "GitHub API 2026-10-01",
        },
      ],
    },
    howJevIsUsed:
      "DeepOpen is the multilingual router plus 3 checkpoints, built on Laya. The product is that router and those weights, not a second copy of an existing open model page. wfzyx-von is the English encoder aimed at order-invariant option scores and local speed. receptron-laya is the Node ONNX runtime for upstream Laya weights, and these 3 DeepOpen checkpoints are a different release line on convaiinnovations. nokia-applied-research-anyjev fits a Decider on hub LLMs you already serve and prints BANKING77 ECE. tianyucodings-nanojev trains 0.6B parallel heads on public game tasks. theoleecj-semif documents another open System One server. ollaya-dev-ollaya pulls and serves laya, kev, von, and decider ONNX on port 11435. githubnext-localjev bridges chat JSON on a Mac. rizzo-ai-academy-rizzo-flow serves a Spark head through llama.cpp. Hosted TypeSafe Jev remains the closed API. README comparison on 2,000 typed decisions: deepopen-typed-decisions argmax 0.766 against published Jev 1.13.0 at 0.727, with soft accuracy still behind at 0.471 against 0.580, and raw ECE 0.213 against 0.144 before temperature fitting. A separate README row lists post-temperature ECE at 0.081 against a third-party Jev ECE of 0.246. The same README gives Jev Banking77, 0.870 on 72 labels against 0.425 on 77 labels at the default head budget, and says the base checkpoints sit near chance on the typed-decisions set until you fine-tune. The Fine-Tuning section describes a Kaggle 2xT4 RLCD loop, about 4 to 5 hours for 4 epochs over about 30k questions. The notebook in the tree is notebooks/laya_finetune_typed_decisions_2xT4_kaggle.ipynb. Reproduction trees live at banking77/ and clinc150/. Cite github.com/deepopen-com/deepopen README, BENCHMARKS.md, those trees, and the Hugging Face repos convaiinnovations/deepopen, deepopen-multilingual, and deepopen-typed-decisions.",
    keyFeatures: [
      "Router with preload, max_loaded, attach, and unload",
      "3 checkpoints, plus direct deepopen.load with subfolders",
      "choice, score, and noul in 1 forward pass, with routing.reason",
      "Preset packs: router_questions, guard_questions, moderation_questions, triage_questions",
      "Banking77 and CLINC150 reproduction directories",
      "BENCHMARKS.md plus temperature-calibration notes and a typed-decisions fine-tune notebook",
    ],
    stack: [
      "Python",
      "Apache-2.0",
      "ModernBERT-large and mmBERT-base",
      "Hugging Face convaiinnovations/deepopen",
      "PyPI deepopen",
    ],
    links: {
      repo: "https://github.com/deepopen-com/deepopen",
      docs: "https://github.com/deepopen-com/deepopen/blob/main/BENCHMARKS.md",
      website: "https://www.deepopen.com",
      demo: "https://huggingface.co/spaces/convaiinnovations/deepopen-demo",
    },
    pricingNote:
      "Apache-2.0 weights. Inference cost is your GPU or CPU. README contrasts self-hosting with TypeSafe list price of $0.042 per 1M tokens for hosted Jev, and notes Jev figures in the comparison table are third-party published numbers.",
    firstSeen: "2026-10-01",
    relatedSlugs: [
      "wfzyx-von",
      "receptron-laya",
      "nokia-applied-research-anyjev",
      "tianyucodings-nanojev",
      "theoleecj-semif",
      "ollaya-dev-ollaya",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Is this the same product as receptron/laya or Von?",
        answer:
          "No. receptron/laya is a Node ONNX client for upstream Laya weights. Von is an English non-autoregressive encoder focused on order-invariant scores. DeepOpen ships 3 checkpoints and a script-aware Router. The README says it is built on Laya.",
      },
      {
        question: "Does 0.766 mean DeepOpen beats hosted Jev with no fine-tune?",
        answer:
          "README Honest limits: the base checkpoints score about 0.36 on typed-decisions, under a 0.461 majority-class baseline. The 0.766 accuracy is deepopen-typed-decisions, fine-tuned on that benchmark's training split. Soft accuracy on the same table is 0.471 against published Jev 0.580.",
      },
      {
        question: "Where does the README say hosted Jev still leads?",
        answer:
          "High-cardinality choice. Banking77 is 0.870 for Jev on 72 labels and 0.425 for deepopen on 77 labels at the default head budget. README says options share head_max_len, so 77 labels get only a few tokens each unless you raise head_max_len or split the choice.",
      },
      {
        question: "Why preload the Router?",
        answer:
          "README: a cold checkpoint build costs seconds. At max_loaded 1, alternating languages reloads a model every request, measured at 7.4 s median on CPU and 10.3 s on T4. Router(preload=True) keeps checkpoints resident. Language detection stays under 1 ms, and steady per-request latency is 32.8 ms on GPU or 193 to 464 ms on CPU.",
      },
    ],
    metaTitle: "DeepOpen: multilingual System 1 router and checkpoints",
    metaDescription:
      "System 1 router for English, multilingual, and typed-decisions checkpoints. Apache-2.0, pip install deepopen, T4 latency and Banking77 limits in the README.",
  },

  "qybaihe-mu": {
    slug: "qybaihe-mu",
    status: "published",
    problem:
      "Coding sessions spend the big model on calls that are not the code: what stays in context, whether a flagged command was asked for, whether a finding belongs on a shared board, and whether done was actually verified.",
    targetUser:
      "Developers who want a full coding agent, CLI and desktop, where a small judge owns about 35 bounded decision points and the big model still writes the code.",
    overview:
      "mu (github.com/qybaihe/mu, npm mu-agent) is a coding agent with a judgment kernel, built on pi and AionUi. A small judge answers one bounded question at a time at 35 decision points in every turn. The big model keeps the work. Each point is active, shadow, or off, and can name its own judge: hosted Jev through TypeSafe, OpenRouter, or the Vercel AI Gateway, local Laya (322M, on the machine, nothing downloaded without consent), an llm: provider tier, or a cascade such as laya,jev. Shadow asks and logs and changes nothing, so you can compare judges before a point is allowed to act. The CLI is npm i -g mu-agent on Node 22.19 or newer (mu, mu doctor, mu -p, mu ledger). Desktop builds for macOS (Apple silicon and Intel), Windows (x64 and Arm), and Linux (x64 and Arm) ship from GitHub Releases with the runtime inside. README calls 0.1.x early pre-releases whose names and formats may still change. kyrn/npm/CHANGELOG.md records 0.1.7 on 2026-09-30. Root LICENSE covers packages and kyrn (MIT). desktop/ keeps the AionUi Apache-2.0 license. Public counts were 336 stars and 32 forks when this listing was drafted.",
    creator: {
      name: "qybaihe",
      handle: "qybaihe",
      githubUrl: "https://github.com/qybaihe",
    },
    creatorQuote: {
      text: "mu gives them to a judge: a small, fast model that answers one bounded question at a time, at 35 decision points in every turn.",
      attributedTo: "mu README",
      sourceUrl: "https://github.com/qybaihe/mu/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Judgment kernel inside the agent turn: a small judge answers bounded questions at 35 decision points while the big model does the work",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "A short question and a small state per decision point: message kind, task frame, tool chunk, flagged command, bee finding, or board line. README Privacy: the judge sees only the fields that question needs.",
      decisionOut:
        "A verdict with a probability, written to the local ledger (mu ledger, or the desktop judgments tab). Active points change the turn. Shadow points are logged and change nothing. Off points are not asked.",
      flowSteps: [
        "Input: input.preflight, task.frame, and input.interjection before the model starts",
        "Model calls a tool. Rules catch a dangerous-looking command first. tool.risk, tool.constraint, and tool.approval run in Jev approves mode",
        "tool.admission walks long output chunk by chunk. context.forget and context.compact run when context grows. Test-log folding is rules by default",
        "Turn end: turn.completion, turn.drift, turn.rewind, memory.applied, board.read, and cache.warming",
        "Hive: hive.publish, hive.deliver, and hive.relate on a shared append-only board. Bees read and report. The main model edits",
      ],
      sourcedMetrics: [
        {
          claim:
            "README lists 35 decision points grouped as input, context, tools and safety, turn, and teamwork. Each point is active, shadow, or off, and can name jev, laya, llm:provider/model, or a cascade.",
          source: "github.com/qybaihe/mu README Decision points",
        },
        {
          claim:
            "Authors' sessions: one warm Jev question about 0.3 s over HTTP/2. 16 chunks of tool output judged in one request in 0.44 s, state billed once. Local Laya is 322M and does not touch the network.",
          source: "github.com/qybaihe/mu README Judges",
        },
        {
          claim:
            "Test-log replay, measured 2026-09-21: 7 failing Vitest logs, 139,820 characters, exact-repeat folding removed 51% with no model call. Goal-aware Jev selection cut 40.2% on 29 tuned goals and lost 0 of 72 required lines, and cut 46.4% on 9 held-out goals and lost 0 of 19. 282 live Jev requests cost about $0.017 at list price. Median request 345 ms. Both arms are off by default.",
          source: "github.com/qybaihe/mu README Measured and kyrn/docs/09-test-log-admission.md",
        },
        {
          claim:
            "Hive example in the README: 3 bees, 9 minutes, 117 candidates judged, 27 notes on the board, 16 delivered to the bee that needed them. Bees do not edit.",
          source: "github.com/qybaihe/mu README The hive",
        },
        {
          claim:
            "Public GitHub repo qybaihe/mu had 336 stars and 32 forks on 2026-10-01. Last push 2026-09-30. kyrn/npm/CHANGELOG.md version 0.1.7 is dated 2026-09-30.",
          source: "GitHub API 2026-10-01 and kyrn/npm/CHANGELOG.md",
        },
      ],
    },
    howJevIsUsed:
      "mu is the agent: CLI, desktop, and a judgment kernel inside the turn. y0usaf-pi-jev is a Pi extension that batches gate nouls on bash, write, and edit. devmortimer-pi-warden steers a Pi session with guardrails. leepokai-jev-guard risk-scores tool calls and scans results across several hosts. samuelfaj-distill keeps Jev on consult, effort, and compression inside a Rust TUI, and Distill owns permissions. tianyucodings-jevharness lets an LLM write a harness and then calls Jev for fast task decisions. kitfunso-hippo-memory reranks local memory rows. kerpopule-hermes-jev-skills is a Hermes skill drawer for routing, memory, compaction, and GUI steps. mu owns the session. About 35 points run from input.preflight through hive.relate. board.read feeds a plain-language board written by a model picked only because it speaks plainly. Bees (2 to 6) read code, run commands, and browse. They do not edit. The main model makes the change. Rules still catch a dangerous-looking command first. The judge only vouches that you asked for it, and an unsure tool.risk verdict asks you. In Jev approves mode, tool.approval runs only what it is sure the task needs. README is explicit about what the test-log numbers are not: they measure what reaches the model, the goals and labels are the authors', the repeat chart is 7 Vitest logs from one developer, and there is no end-to-end comparison with pi, Claude Code, or Codex yet. Cite github.com/qybaihe/mu README, kyrn/docs/09-test-log-admission.md, and kyrn/npm/CHANGELOG.md.",
    keyFeatures: [
      "35 decision points with per-point judge and active, shadow, or off",
      "Hosted Jev, local Laya, or an LLM tier, including cascades",
      "Test-log exact-repeat folding and optional goal-aware Jev selection",
      "Hive board with publish, deliver, and relate, plus a plain-language board",
      "Desktop app for macOS, Windows, and Linux with the runtime bundled",
      "CLI ledger, task frame, permissions, and import from Claude Code or Codex",
    ],
    stack: [
      "TypeScript",
      "npm mu-agent",
      "pi (MIT)",
      "AionUi desktop (Apache-2.0)",
      "TypeSafe Jev, OpenRouter, or Vercel AI Gateway",
      "Local Laya 322M",
    ],
    links: {
      repo: "https://github.com/qybaihe/mu",
      docs: "https://github.com/qybaihe/mu/blob/main/README.md",
      website: "https://www.npmjs.com/package/mu-agent",
    },
    pricingNote:
      "MIT packages and an Apache-2.0 desktop shell. You pay the big-model provider plus any hosted Jev calls. Local Laya stays on the machine. README says the 282 Jev requests in the test-log study cost about $0.017 at list price.",
    firstSeen: "2026-10-01",
    relatedSlugs: [
      "y0usaf-pi-jev",
      "leepokai-jev-guard",
      "samuelfaj-distill",
      "tianyucodings-jevharness",
      "kitfunso-hippo-memory",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is mu the same as the pi-jev extension?",
        answer:
          "No. y0usaf-pi-jev is a Pi extension that gates bash, write, and edit. mu is a coding agent built on pi, with its own CLI, desktop app, and about 35 decision points inside the turn.",
      },
      {
        question: "What do active, shadow, and off mean?",
        answer:
          "README: active changes what the model does next. Shadow asks the judge and logs the verdict and changes nothing, which is how you compare judges before switching a point on. Off does not ask. /mu mode sets one point.",
      },
      {
        question: "Do hive bees edit the repo?",
        answer:
          "README: a hive is 2 to 6 bees. They read code, run commands, and browse. They never edit. The main model makes the change. hive.publish asks whether a finding is worth the shared board.",
      },
      {
        question: "What do the test-log savings measure?",
        answer:
          "README Measured: exact-repeat folding is rules, no model call, and removed 51% of characters across 7 logs totaling 139,820 characters. Goal-aware Jev selection is a separate arm, off by default, and the README says the numbers do not show whether the model then finishes the task.",
      },
    ],
    metaTitle: "mu: coding agent with a 35-point judgment kernel",
    metaDescription:
      "qybaihe/mu on pi and AionUi. A small judge covers 35 decision points per turn. npm mu-agent, desktop builds, and shadow mode that only logs.",
  },

  "mode-io-vllm-jev": {
    slug: "mode-io-vllm-jev",
    status: "published",
    problem:
      "Open Jev-style checkpoints already exist, and teams still serve them through each author's own HTTP wrapper, so batching, compilation, and a shared POST /v1/systemone contract get reinvented per model.",
    targetUser:
      "Linux NVIDIA and Apple Silicon operators who want one launcher for Open-Jev, Laya, Tiny-Jev, Valen, and a short list of experimental decision checkpoints, and who will read the README notes when labels move under concurrency.",
    overview:
      "vLLM Jev (github.com/mode-io/vllm-jev, Apache-2.0) is native vLLM serving for compatible Jev-style decision checkpoints. You give it a question and candidate answers. It returns a label and a probability for each candidate. Linux with an NVIDIA GPU uses uv pip install . and vllm-jev serve, which prepares a Hugging Face checkpoint and starts native vLLM at http://127.0.0.1:8795. Apple Silicon (macOS 15 or newer) uses source scripts/install_mac.sh, then the same serve command. The README says Linux is native vLLM (scheduling, batching, compilation, KV cache, metrics). Apple Silicon text models run through MLX, or PyTorch MPS for Laya, and Valen multimodal decisions run through MLX. The plugin targets vLLM 0.29.0 and Python 3.12+. Serving does not train. The supported table lists ZefanCai/Open-Jev-2B (text, Linux and Mac), ZefanCai/Open-Jev-9B (text, Linux), convaiinnovations/laya, laya-multilingual, and laya-typed-decisions (text, Linux and Mac), IamBusy/OpenJev-0.6B (text, Linux and Mac), lostargon/Tiny-Jev (text, Linux and Mac), Valen-Team/Valen-Preview-0923 (text, images, and video, Linux and Mac), and yah01/vjev-vision plus vjev-vision-pilot (text and images, Linux). An experimental table adds Kev, Decider, Mica, This-That, and JevK5, with tested platforms called out per row. README contributing links Issues to github.com/Egbertjing/vllm-jev. Public counts were 198 stars and 7 forks when this listing was drafted.",
    creator: {
      name: "mode-io",
      handle: "mode-io",
      githubUrl: "https://github.com/mode-io",
    },
    creatorQuote: {
      text: "Give it a question and candidate answers; it returns a label and a probability for each candidate.",
      attributedTo: "vLLM Jev README",
      sourceUrl: "https://github.com/mode-io/vllm-jev/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Local System One runtime: one vllm-jev serve process scores Choice, Noul, and Score on a supported open checkpoint",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "JSON state plus a questions map. Choice sends criteria labels. Noul is yes/no. Score is ordered levels. Valen accepts text, images, and short MP4 video. vjev accepts text and images. Text models take text only.",
      decisionOut:
        "answers.<id>.choice and probabilities for the labels you supplied, or the Noul and Score fields documented in the user guide. The server does not generate a free-form answer.",
      flowSteps: [
        "On Linux, uv pip install . from the repo. On Apple Silicon, source scripts/install_mac.sh once (macOS 15 or newer)",
        "vllm-jev serve with a supported Hugging Face id, for example ZefanCai/Open-Jev-2B or Valen-Team/Valen-Preview-0923. First run downloads and prepares the checkpoint",
        "POST http://127.0.0.1:8795/v1/systemone with state and questions. CUDA_VISIBLE_DEVICES, --gpu-memory-utilization, and --port override the defaults",
        "Read answers.intent.choice and answers.intent.probabilities. Image and short-video requests use a vision model from the supported table",
        "Treat the experimental Kev, Decider, Mica, This-That, and JevK5 rows as tested adapters with the consistency limits in the README",
      ],
      sourcedMetrics: [
        {
          claim:
            "Valen video live run: 24 structured questions, 8 sampled frames, one A800 per runtime. PyTorch reference 5.31 s. vLLM Jev 1.22 s (4.3x). All 24 selected answers agreed. Model loading is excluded.",
          source: "github.com/mode-io/vllm-jev README Demos, video understanding",
        },
        {
          claim:
            "Open-Jev-2B on one A800, short input, concurrency 8: latency 4360.5 ms to 100.5 ms, throughput 1.83 to 78.83 req/s, 43.4x. Concurrency 1 on the same row: 546.6 ms to 73.0 ms, 7.5x. Open-Jev-9B short concurrency 8: 5337.6 ms to 205.2 ms, 26.0x.",
          source: "github.com/mode-io/vllm-jev README Inference performance, NVIDIA GPUs",
        },
        {
          claim:
            "Valen-Preview-0923 image row: median latency 231.9 ms to 77.3 ms (3.0x) on 500 image questions. Both paths reached 86.8% target-support accuracy. Choices agreed on 98.8%. Largest per-question probability difference 0.295. A separate 500-request HTTP run at concurrency 8 reached 40.6 req/s (193.4 ms median). HTTP time is excluded from the offline 500-question comparison.",
          source: "github.com/mode-io/vllm-jev README benchmark notes, Valen",
        },
        {
          claim:
            "Apple M5, 16 GB unified memory, MLX, sequential after warmup: OpenJev-0.6B text 67.9 ms (P95 120.2, 12.02 req/s) over 96 Choice requests. Valen image 205.9 ms (P95 249.7, 4.64 req/s) over 42 GameQA Maze questions. Valen matched the Linux reference answers on all 42 questions. Both answered 17 correctly. Probability values differ between backends. Mac runs one model request at a time.",
          source: "github.com/mode-io/vllm-jev README Inference performance, Apple Silicon",
        },
        {
          claim:
            "Laya English versus published laya-serve 0.3.20, same A800, 500 4-choice MMLU questions: concurrency 16 latency 404.5 ms to 77.5 ms (5.2x). Labels differed on 6 of 500. Largest option-probability difference 0.0222. README says Laya's direct predict_batch path can be faster when many states share one schema, and these HTTP figures do not measure that bulk path. JevK5 supports 2 to 16 options. In concurrent Linux batches, Kev-0.8B can change its selected label. This-That and Decider-2B can change the most likely Score level.",
          source: "github.com/mode-io/vllm-jev README benchmark notes and experimental model limits",
        },
        {
          claim:
            "Updates: 2026-09-25 fused Tiny-Jev head, 12.1% higher throughput on the measured 16-option, 16-concurrent workload, plus multimodal text and images. 2026-09-26 added all 3 Laya checkpoints, Tiny-Jev and Open-Jev-2B on Apple Silicon, and OpenJev-0.6B plus Valen on Mac. 2026-09-28 added experimental Valen video, including variable-frame-rate clips. 2026-09-29 added experimental Kev, Decider, Mica, This-That, and JevK5 adapters.",
          source: "github.com/mode-io/vllm-jev README Updates",
        },
        {
          claim:
            "Public GitHub repo mode-io/vllm-jev had 198 stars and 7 forks on 2026-10-02. License Apache-2.0. Created 2026-09-24. Last push 2026-09-29. Language Python.",
          source: "GitHub API 2026-10-02",
        },
      ],
    },
    howJevIsUsed:
      "vLLM Jev is the server, not a new weight family. githubnext-localjev keeps TypeSafe SDK calls on a Mac by asking oMLX DiffusionGemma for chat JSON, and the LocalJev README says those probabilities are not an OpenJev logit read. ollaya-dev-ollaya pulls small ONNX graphs and serves POST /v1/systemone on port 11435 for laya, kev, von, and decider. receptron-laya embeds Convai Laya ONNX inside Node. wfzyx-von is the English encoder checkpoint. liuziyu77-valen is the training and eval repo for Valen-Preview-0923. deepopen-com-deepopen is a pip package with a script-aware router over 3 Laya-based checkpoints. vLLM Jev takes those kinds of Hugging Face ids, verifies a native protocol, and serves Choice, Noul, and Score. The README also shows a live Open-Jev-2B comparison: the author HTTP server and vLLM Jev received the same 40 text-only Choice requests at once, one A800 each. Decision readouts in the About section are scalar candidate branches, marker scores, and Laya's trained decision head. A 2026-09-25 note says the fused Tiny-Jev head raised throughput 12.1% on a 16-option, 16-concurrent workload. Cite github.com/mode-io/vllm-jev README and docs/guide.md. The Choice prompt follows MIT-licensed Open-Jev, noted in THIRD_PARTY_NOTICES.md.",
    keyFeatures: [
      "vllm-jev serve for a supported Hugging Face model id, default port 8795",
      "Linux native vLLM and an Apple Silicon preview via MLX or PyTorch MPS",
      "Choice, Noul, and Score over POST /v1/systemone",
      "Valen text, image, and short video. vjev text and images on Linux",
      "Open-Jev-2B and 9B, 3 Laya checkpoints, OpenJev-0.6B, Tiny-Jev",
      "Experimental adapters for Kev, Decider, Mica, This-That, and JevK5, with published consistency limits",
    ],
    stack: [
      "Python 3.12+",
      "vLLM 0.29.0",
      "Apache-2.0",
      "MLX and PyTorch MPS on Apple Silicon",
      "Hugging Face decision checkpoints",
    ],
    links: {
      repo: "https://github.com/mode-io/vllm-jev",
      docs: "https://github.com/mode-io/vllm-jev/blob/main/docs/guide.md",
    },
    pricingNote:
      "Apache-2.0 code. Inference cost is your GPU or Apple Silicon machine. Upstream checkpoints keep their own licenses. The README says serving does not train.",
    firstSeen: "2026-10-02",
    relatedSlugs: [
      "githubnext-localjev",
      "ollaya-dev-ollaya",
      "receptron-laya",
      "liuziyu77-valen",
      "wfzyx-von",
      "deepopen-com-deepopen",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Is this LocalJev or ollaya?",
        answer:
          "githubnext-localjev is a Mac bridge from System One-shaped HTTP to oMLX DiffusionGemma, and its README says the probabilities come from prompted JSON. ollaya-dev-ollaya is a Rust daemon that pulls ONNX graphs and listens on port 11435. vLLM Jev is a vLLM plugin: Linux NVIDIA uses native vLLM, Apple Silicon uses MLX or PyTorch MPS, and the default listen address in the README is http://127.0.0.1:8795.",
      },
      {
        question: "Which checkpoints does the README mark as supported?",
        answer:
          "The supported table lists Open-Jev-2B, Open-Jev-9B (Linux only), Laya English, Laya multilingual, Laya typed-decisions, OpenJev-0.6B, Tiny-Jev, Valen-Preview-0923, and vjev-vision plus vjev-vision-pilot (Linux only). Kev, Decider, Mica, This-That, and JevK5 sit in a separate experimental table.",
      },
      {
        question: "Does the 4.3x Valen video figure include model loading?",
        answer:
          "README Demos: model loading is excluded. The same Valen checkpoint answered 24 questions about one video, using 8 sampled frames and one A800 per runtime. PyTorch took 5.31 s. vLLM Jev took 1.22 s. All 24 selected answers agreed.",
      },
      {
        question: "Can experimental Kev or Decider labels change under load?",
        answer:
          "README: JevK5 currently supports 2 to 16 options per question. In concurrent Linux batches, Kev-0.8B can change its selected label. This-That and Decider-2B can also change the most likely Score level. The README says those consistency limits remain under investigation.",
      },
    ],
    metaTitle: "vLLM Jev: System One serving on NVIDIA and Mac",
    metaDescription:
      "mode-io/vllm-jev serves Open-Jev, Laya, Valen, and Tiny-Jev. Linux uses native vLLM. Apple Silicon uses MLX. POST /v1/systemone. README Valen video: 4.3x.",
  },

  "disler-ten-levels-of-jev": {
    slug: "disler-ten-levels-of-jev",
    status: "published",
    problem:
      "Agent code is full of small judgments, and teams either keep patching a regex or spend a chat model call to get prose they still have to parse.",
    targetUser:
      "Agentic engineers who want a ladder of 30 runnable Jev examples, from one Noul in plain TypeScript up through live pi sessions where the agent writes the questions.",
    overview:
      "Ten levels of Jev (github.com/disler/ten-levels-of-jev, MIT) is IndyDevDan's curriculum repo: a live Vue lab, a terminal runner, real pi agent sessions, and a hyper-jev skill you can hand an agent. The README frames Jev as JSON in, decisions out. You send a state (string, object, or array) and a map of questions. About 300 ms later you get typed answers with probabilities. The repo arranges 30 concrete uses into 10 levels, 3 options each. Levels 1 to 5 call Jev from plain code (just jev1 through just jev5). Levels 6 to 10 put Jev inside the pi coding agent (pi 0.85.1+): hooks the agent never sees, then tools the agent chooses, until level 10's ask_jev tool lets the agent write the questions. Prereqs in the README: Node 24, bun, just, and an OpenRouter key for live runs. just test runs 201 offline tests on a deterministic mock. just web builds the lab and opens http://127.0.0.1:4399. The walkthrough video is https://youtu.be/_U-O5lYhJ7Q. Public counts were 147 stars and 45 forks when this listing was drafted.",
    creator: {
      name: "IndyDevDan",
      handle: "disler",
      githubUrl: "https://github.com/disler",
      company: "IndyDevDan",
      companyUrl: "https://www.youtube.com/@indydevdan",
    },
    creatorQuote: {
      text: "Ten levels of Jev, from one smart if statement to a coding agent that reaches for Jev on its own.",
      attributedTo: "ten-levels-of-jev README",
      sourceUrl: "https://github.com/disler/ten-levels-of-jev/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Pedagogical ladder: code calls Jev in levels 1 to 5, then pi hooks and tools call it in levels 6 to 10, ending with the agent authoring the questions",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "A state string, object, or array, plus questions keyed by ids you choose. Noul is yes or no, with optional true and false criteria. Choice is one of up to 255 declared options. Score is a position on 2 to 10 levels you describe. From level 8 on, code can attach file content, a glob, or a command the extension runs before the call.",
      decisionOut:
        "Typed answers with probabilities the option file thresholds in code. A Choice answer is one of your options. Level 4 uses confidence as a second gate: below 0.5 a person decides, above 0.9 a destructive action can skip confirmation.",
      flowSteps: [
        "just install, or the manual path: bun install in apps/ten-levels/web, copy .env.sample, set OPENROUTER_API_KEY, install pi for levels 6 to 10",
        "just test for 201 offline tests on the mock. Levels 1 to 5 still run with no key. Levels 6 to 10 need pi and the key",
        "just web opens the Vue lab on http://127.0.0.1:4399. just jev1 through just jev10 run one level in the terminal. just jev4 b runs one option",
        "Levels 6 and 7 hook tool_call, tool_result, and turn end. The agent does not ask. Levels 8 and 9 expose file tools. Level 10 exposes one ask_jev tool",
        "Each option is one TypeScript file that holds its questions and thresholds together, which the README says is the part a human reviews",
      ],
      sourcedMetrics: [
        {
          claim:
            "Ladder: 10 levels, 3 options each, 30 concrete uses. Level 1 is one Noul (injection gate, urgency gate, ticket classifier). Level 10 is one ask_jev tool over state, paths, and a command (triage a failure, judge a diff, classify a request).",
          source: "github.com/disler/ten-levels-of-jev README The ladder",
        },
        {
          claim:
            "README price contrast: 1 million yes or no calls cost $3,500 on an expensive SOTA model and $16.80 on Jev. The same section says a call returns in about 300 ms.",
          source: "github.com/disler/ten-levels-of-jev README Why this exists",
        },
        {
          claim:
            "Level 1 injection gate, 5 input sets in the README: 0.99, 0.83, 0.61, 0.27, and 0.01 on the same question. Level 4 bash table: git push --force origin main is irreversible at 0.99 and blocked. ls -la src is read only at 1.00 and runs. rm -rf node_modules && npm install is reversible at 0.35 and asks a human. Thresholds live in level04/confidence.ts: below 0.5 a person decides, above 0.9 a destructive action skips confirmation.",
          source: "github.com/disler/ten-levels-of-jev README Levels 1 and 4",
        },
        {
          claim:
            "Level 8 live lab quote: ask_jev_file_bool on session.ts and seed.ts returned yes 0.98 and no 0.12 while agent context sat at 2k tokens. Jev judged 9,089 tokens for $0.00049. README prices one read of the same files at $0.091 on an expensive SOTA input price, 187x more. Level 9: 17 files, 2 yes answers at 0.93 and 0.96, pick_first_file chose src/domain/billing.ts at 0.93. The file cap is 255.",
          source: "github.com/disler/ten-levels-of-jev README Levels 8 and 9",
        },
        {
          claim:
            "Level 10 live run in the README: told the tests are red, the agent ran npm test through ask_jev, got bug_in_code at 0.99, fixed rounding, scored its own diff at risk 0.53, and confirmed tests pass at 0.99. Ledger: 3 Jev calls, 4 questions, $0.000084. Level 6 block example: rm -rf node_modules .sessions was irreversible 0.86 and destructive intent 0.99.",
          source: "github.com/disler/ten-levels-of-jev README Levels 6 and 10",
        },
        {
          claim:
            "Test commands: just test is 201 offline tests on the deterministic mock. just test-live is 10 live tests, 1 per level. README failure notes: the mock decides by word overlap. One live level 6 run routed around a write gate with a bash heredoc. Level 10 gates ask_jev's command, and the agent's own bash tool on that level is not gated.",
          source: "github.com/disler/ten-levels-of-jev README Commands and Where it can still fail",
        },
        {
          claim:
            "Public GitHub repo disler/ten-levels-of-jev had 147 stars and 45 forks on 2026-10-02. License MIT. Created 2026-09-27. Last push 2026-09-27. Language TypeScript. Homepage field is the YouTube walkthrough.",
          source: "GitHub API 2026-10-02",
        },
      ],
    },
    howJevIsUsed:
      "This repo is a ladder you can run, plus a skill that copies the pattern. dbreunig-building-with-jev-skill is Drew Breunig's SKILL.md for question design, state shape, and thresholds on jev-1.13. It does not ship 30 option files or a pi session runner. y0usaf-pi-jev is a Pi extension that batches gate nouls on bash, write, and edit. Level 6 here is a teaching hook inside this lab's sandbox, with its own jev-guard.ts. tianyucodings-jevharness lets a model write a harness and then calls Jev for fast task decisions. jkudish-jev-mcp exposes 10 typed MCP tools. Ten levels keeps the client in apps/ten-levels/src/core/client.ts, which the folder map describes as mock, OpenRouter, and TypeSafe. .claude/skills/hyper-jev/ packages that client, the 30 examples, and a cookbook. The README's own rule set: reach for Jev when you can describe the state and the outcomes, keep numbers and counting in code, and treat a security gate as one signal. Cite github.com/disler/ten-levels-of-jev README and the YouTube walkthrough at https://youtu.be/_U-O5lYhJ7Q.",
    keyFeatures: [
      "10 levels, 3 options each, questions and thresholds in one TypeScript file per option",
      "Vue lab on port 4399 with request bodies, probability bars, and a cost table",
      "pi extensions for guard hooks, compaction, cheap file reads, fan-out, and ask_jev",
      "201 offline tests on the mock and 10 live tests, 1 per level",
      "hyper-jev skill with SKILL.md, cookbook, and a standalone starter",
      "README failure notes: mock word overlap, a write-gate bypass, and an ungated bash tool on level 10",
    ],
    stack: [
      "TypeScript",
      "Vue lab",
      "bun, just, and Node 24",
      "pi coding agent 0.85.1+",
      "OpenRouter or TypeSafe for live runs",
      "MIT",
    ],
    links: {
      repo: "https://github.com/disler/ten-levels-of-jev",
      docs: "https://github.com/disler/ten-levels-of-jev/blob/main/README.md",
      website: "https://youtu.be/_U-O5lYhJ7Q",
    },
    pricingNote:
      "MIT code. Live levels spend your OpenRouter or TypeSafe key. README contrast: 1 million yes or no calls at $16.80 on Jev versus $3,500 on an expensive SOTA model. Offline levels 1 to 5 run on the mock with no key.",
    firstSeen: "2026-10-02",
    relatedSlugs: [
      "dbreunig-building-with-jev-skill",
      "y0usaf-pi-jev",
      "tianyucodings-jevharness",
      "jkudish-jev-mcp",
    ],
    relatedLearnSlugs: ["use-cases", "jev-typesafe"],
    faq: [
      {
        question: "Is this the same as building-with-jev-skill?",
        answer:
          "dbreunig/building-with-jev-skill is a SKILL.md that teaches Choice, Score, and Noul design for jev-1.13. ten-levels-of-jev is a 10-level lab: 30 TypeScript options, a Vue UI on port 4399, pi sessions for levels 6 to 10, and a separate hyper-jev skill that copies the client and the examples.",
      },
      {
        question: "Which levels run without an API key?",
        answer:
          "README Install: with no key, levels 1 to 5 still run on the offline mock. Levels 6 to 10 need both pi 0.85.1+ and the key. just test runs 201 offline tests on that mock. just test-live runs 10 live tests, 1 per level.",
      },
      {
        question: "What changes at level 10?",
        answer:
          "Levels 6 and 7 are hooks. The agent never asks, and Jev runs on the tool call, the tool result, and the turn end. Levels 8 and 9 are file tools the agent chooses. Level 10 is one ask_jev tool: the agent passes state, paths, a command, and its own question block. The README's example ledger is 3 Jev calls, 4 questions, $0.000084.",
      },
      {
        question: "What do the README dollar figures measure?",
        answer:
          "They are the author's live-lab quotes, not a third-party invoice. The opening contrast is $3,500 versus $16.80 for 1 million yes or no calls. Level 8 prices 9,089 judged tokens at $0.00049 against a $0.091 file read. Level 10's ledger line is $0.000084. Your bill follows whichever key the lab is pointed at.",
      },
    ],
    metaTitle: "Ten levels of Jev: one Noul to agent questions",
    metaDescription:
      "disler/ten-levels-of-jev: 10 levels and 30 options, from one Noul to a pi agent that writes its own questions. Vue lab, YouTube, and 201 offline tests.",
  },

  "charlesfeng0314-jev-sees": {
    slug: "charlesfeng0314-jev-sees",
    status: "published",
    problem:
      "Hosted Jev already returns Choice, Noul, and Score, and a camera frame is still stuck in front of a captioning model when the question was a closed judgment about the objects in view.",
    targetUser:
      "Python teams who want a local vision front end for hosted TypeSafe Jev: images, video, or RGB-D in, official Choice and Noul questions out, with one call covering many tracked objects.",
    overview:
      "JEV Sees (github.com/CharlesFeng0314/JEV_sees, MIT, v0.1.0) is a visual front end for hosted TypeSafe Jev. The README line is one frame, many objects, one JEV call. Sees() is the image and video entry point. observe() tracks objects locally. state() builds the text Jev reads. Choice, Noul, Score, and TypeSafeClient are re-exported from the official typesafe-sdk, so the call is still client.system_one and the answers still live on response.choices, response.nouls, and response.scores. Python 3.10+. pip install -e . from a clone. TYPESAFE_API_KEY is required for system_one. observe() and state() stay local. RGB-only perception starts from Florence-2 dense-region captions (default microsoft/Florence-2-base-ft). Callers do not pass an object vocabulary. RGB-D mode lets depth clusters decide which physical objects exist, and overlapping Florence regions supply free-text names. Color stays evidence: a CV measurement, CLIP's color distribution, and Florence's region caption, so Jev can judge agreement instead of receiving one preselected color string. The README says an earlier YOLO latency table was removed and that a new image and video benchmark is required before publishing latency claims for this backend. Created 2026-09-30. Public counts were 113 stars and 6 forks when this listing was drafted.",
    creator: {
      name: "CharlesFeng0314",
      handle: "CharlesFeng0314",
      githubUrl: "https://github.com/CharlesFeng0314",
    },
    creatorQuote: {
      text: "One frame. Many objects. One JEV call.",
      attributedTo: "JEV Sees README",
      sourceUrl: "https://github.com/CharlesFeng0314/JEV_sees/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Local perception builds a scene state, then one hosted TypeSafe system_one call judges many named objects",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "sees.state(question) after observe() on an image, a video sample, or an RGB-D frame. Tracked objects carry object_id, label, confidence, bbox_xyxy, centroid, and color evidence. Video can add frame_index, media time, and the 2 most recent time-aware poses. RGB-D can add position_m and metric gaps when camera intrinsics are available.",
      decisionOut:
        "Official typed answers. A bus-color Choice returns response.choices['bus_color'].choice (the included image is expected to print blue). A per-pedestrian Noul returns response.nouls[object_id].noul. Video results are frame-primary in result.frames, with result.rows kept as a per-object peak summary.",
      flowSteps: [
        "Clone the repo and python -m pip install -e . on Python 3.10 or newer",
        "Export TYPESAFE_API_KEY. Create the key at console.typesafe.ai. observe() and state() do not need it",
        "Sees(), observe a path, then TypeSafeClient.system_one with Choice, Noul, or Score objects you construct. JEV Sees does not infer a question type from prose",
        "For video, pass questions= as a callable that receives current tracks and returns official questions, as examples/traffic_relations.py does for one Noul per pedestrian",
        "For RGB-D, depth clusters decide which objects exist. Florence names overlapping regions. Weights download on first use and are not stored in the repo",
      ],
      sourcedMetrics: [
        {
          claim:
            "README product line: one frame, many objects, one JEV call. The traffic demo caption says every visible pedestrian gets an accident-risk probability from the same JEV call. Question objects are official Noul or Choice values, one per object id.",
          source: "github.com/CharlesFeng0314/JEV_sees README",
        },
        {
          claim:
            "Perception: RGB-only mode starts from Florence-2 dense-region captions. Default checkpoint microsoft/Florence-2-base-ft, overridable with Sees(florence_model=...). RGB-D mode lets depth clusters decide which physical objects exist. With camera intrinsics, observations can include position_m. CLIP color evidence uses weights/clip/ViT-B-32.pt when JEV_SEES_ROBO_ROOT points at it, otherwise CLIP downloads on first use.",
          source: "github.com/CharlesFeng0314/JEV_sees README Models and weights and RGB-D",
        },
        {
          claim:
            "Scene memory: object ids stay stable when possible. Samples reuse pose_history and add frame_index plus media time. The 2 most recent time-aware poses of each visible object enter the Jev state. Color evidence keeps the CV measurement, the CLIP distribution, and Florence's region caption side by side.",
          source: "github.com/CharlesFeng0314/JEV_sees README Perception, tracking, and scene memory",
        },
        {
          claim:
            "Status v0.1.0, intentionally experimental. Python 3.10+. License MIT. The README says the earlier YOLO benchmark does not describe the Florence-2 pipeline and was removed. A new image and video benchmark is required before publishing latency claims for this backend.",
          source: "github.com/CharlesFeng0314/JEV_sees README Performance and Status",
        },
        {
          claim:
            "Public GitHub repo CharlesFeng0314/JEV_sees had 113 stars and 6 forks on 2026-10-02. Created 2026-09-30. Last push 2026-10-02. Language Python.",
          source: "GitHub API 2026-10-02",
        },
      ],
    },
    howJevIsUsed:
      "JEV Sees builds the state. Hosted TypeSafe Jev makes the judgment. liuziyu77-valen trains a multimodal decision head (Valen-Preview-0923) and serves it yourself. tianyucodings-nanojev trains 0.6B parallel heads on Maze, Snake, and ViZDoom frames. deepopen-com-deepopen routes text across 3 local checkpoints. nokia-applied-research-anyjev fits calibration heads on text models you already host. This repo publishes no decision checkpoint. Florence-2 and CLIP load from Hugging Face or a local CLIP file, and system_one still goes to TypeSafe. The README also points at a sibling, JEV Control (github.com/CharlesFeng0314/JEV_control_your_roboarm), for turning judgments into robot-arm actions. That sibling is a separate repo. examples/bus_color.py is the smallest Choice. examples/traffic_relations.py builds one official Noul per current pedestrian and requires TYPESAFE_API_KEY. Cite github.com/CharlesFeng0314/JEV_sees README only.",
    keyFeatures: [
      "Sees, observe, and state as the local visual layer",
      "Official Choice, Noul, Score, and TypeSafeClient re-exported for one import line",
      "One system_one call over many named objects in a frame",
      "Florence-2 region captions, CLIP color evidence, and optional RGB-D depth clusters",
      "Video questions as a callable, with frame-primary probabilities",
      "v0.1.0 experimental status and an explicit refusal to publish a latency number for the Florence-2 path",
    ],
    stack: [
      "Python 3.10+",
      "MIT",
      "typesafe-sdk TypeSafeClient",
      "Florence-2",
      "CLIP ViT-B-32",
      "RGB, video, and RGB-D",
    ],
    links: {
      repo: "https://github.com/CharlesFeng0314/JEV_sees",
      docs: "https://github.com/CharlesFeng0314/JEV_sees/blob/main/README.md",
    },
    pricingNote:
      "MIT code. Perception weights download on first use (Florence-2 from Hugging Face, CLIP unless a local ViT-B-32 file is set). system_one calls spend your TypeSafe key. The README publishes no latency or price table for this backend.",
    firstSeen: "2026-10-02",
    relatedSlugs: [
      "liuziyu77-valen",
      "tianyucodings-nanojev",
      "deepopen-com-deepopen",
      "nokia-applied-research-anyjev",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is JEV Sees a multimodal model like Valen?",
        answer:
          "liuziyu77-valen trains Valen-Preview-0923, a Qwen3.5 decision head over text, images, and video. JEV Sees does not ship a decision checkpoint. It tracks a scene locally and calls hosted TypeSafe Jev. Weights in this repo's README are Florence-2 and CLIP, used as perception, and they are downloaded rather than stored in the tree.",
      },
      {
        question: "How does one call cover many objects?",
        answer:
          "Your code builds one official question per object id. The traffic example selects current pedestrians and creates a Noul for each. JEV Sees passes a single state from the frame. response.nouls[object_id] is that pedestrian's probability. The README says the library does not invent questions from the prompt.",
      },
      {
        question: "Why is there no latency number on this page?",
        answer:
          "The Performance section says the earlier YOLO benchmark does not describe the Florence-2 pipeline and was removed on purpose. It asks for a new image and video benchmark before any latency claim for this backend. This listing does not fill that gap.",
      },
      {
        question: "Is this a browser or computer-use agent?",
        answer:
          "It is a camera front end: RGB, video, and RGB-D. It does not pick DOM actions or desktop clicks. The README's sibling for action is JEV Control, a separate robot-arm repo. This page covers JEV Sees only.",
      },
    ],
    metaTitle: "JEV Sees: RGB, video, and RGB-D eyes for Jev",
    metaDescription:
      "JEV Sees gives hosted TypeSafe Jev eyes: one frame, many objects, one call. Florence-2, video, and RGB-D depth. The README publishes no latency table.",
  },

  "uditakhourii-quicksilver": {
    slug: "uditakhourii-quicksilver",
    status: "published",
    problem:
      "A large share of a Claude Code session is spent reading only to decide whether something matters: which of 187 files handle auth, which of 3,000 log lines are real failures, which of 200 tickets are refunds. Claude reads it, pays for it, and the context fills with noise.",
    targetUser:
      "Claude Code users who want bulk filter, classify, rank, find, and ask calls handed to TypeSafe Jev, and who will read the README misses before they trust a shortlist.",
    overview:
      "Quicksilver (github.com/UditAkhourii/quicksilver, MIT) is a Claude Code skill that hands those bulk judgments to TypeSafe Jev. Jev returns a yes/no, a label, or a score. Claude gets a shortlist and spends tokens on the thinking only it can do. Install is 1 command: npx github:UditAkhourii/quicksilver. The installer copies the skill into ~/.claude/skills/quicksilver and asks for a Jev key once, from console.typesafe.ai. Restart Claude Code. The same skill installs as a plugin, or from a clone with install.sh or install.ps1. Pass the key with install --key, or set JEV_API_KEY or TYPESAFE_API_KEY. Node 18+. No npm dependencies. The qs CLI is filter, classify, rank, find, ask, and status. The README's 12-task bench says Quicksilver cuts the tokens Claude spends by 86% (median 82%), matches Claude on 8 of 12 tasks, and runs up to 20x faster, at a median of $0.004 of Jev per task. Public counts were 98 stars and 5 forks when this listing was drafted.",
    creator: {
      name: "Udit Akhouri",
      handle: "UditAkhourii",
      githubUrl: "https://github.com/UditAkhourii",
    },
    creatorQuote: {
      text: "Stop paying Claude to skim.",
      attributedTo: "Quicksilver README",
      sourceUrl: "https://github.com/UditAkhourii/quicksilver/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Claude Code skill and qs CLI: bulk filter, classify, rank, find, and ask calls go to TypeSafe Jev, and Claude reads the shortlist",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "One narrow question plus the files, log lines, tickets, or a state file. filter is a yes/no over paths or lines. classify takes a closed label list. rank and find take a relevance question. ask takes one question and a --state file.",
      decisionOut:
        "One line per hit, written for an LLM to read. Repeated log patterns collapse into line-number ranges. Classify results come back as id lists. A ? marks a borderline item. Every run ends with a receipt: scanned, matched, borderline, seconds, Jev tokens and dollars, and Claude tokens not read.",
      flowSteps: [
        "npx github:UditAkhourii/quicksilver, or install --key, or the Claude Code plugin marketplace command, or install.sh from a clone. Node 18+, no npm dependencies",
        "Provide a key once from console.typesafe.ai, or export JEV_API_KEY or TYPESAFE_API_KEY. The file copy lives in ~/.quicksilver/config.json with user-only permissions",
        "Restart Claude Code. The skill runs when a task looks like reading a lot to decide a little",
        "qs filter, qs classify --labels, qs rank --top, qs find, or qs ask --state. --fast packs items when the needles are obvious",
        "Read the shortlist and the receipt. Review ? rows in Claude. qs status checks the key and lifetime tokens saved",
      ],
      sourcedMetrics: [
        {
          claim:
            "README claim on the 12-task bench: Quicksilver cuts the tokens Claude spends by 86% (median 82%). It matches Claude's accuracy on 8 of 12 tasks (bold in the table means within 2 points) and runs up to 20x faster, for a median of $0.004 of Jev per task. The whole bench cost $0.45 of Jev. Jev is $0.042 per million input tokens, and output is free.",
          source: "github.com/UditAkhourii/quicksilver README The benchmark and FAQ",
        },
        {
          claim:
            "Table rows the README marks as matches: noisy 3,000-line log F1 100% to 100%, Claude tokens 53.5k to 2.5k (-95%), time 56s to 64s, Jev $0.044. Banking77, 8 intents, accuracy 100% to 99%, 15.0k to 2.7k (-82%), 60s to 6s, $0.003. Hono codebase discovery, 187 files, F1 100% to 100%, 26.4k to 2.4k (-91%), 43s to 6s, $0.013. CI failure triage, 80 logs, accuracy 100% to 100%, 9.1k to 2.5k (-72%), 30s to 3s, $0.002. Commit classification, 181 real commits, went from 106s to 5s at accuracy 83% to 76%.",
          source: "github.com/UditAkhourii/quicksilver README benchmark table",
        },
        {
          claim:
            "README misses: BGL supercomputer log, 2k lines, F1 54% to 23%, tokens 84.4k to 12.5k (-85%), 105s to 44s, $0.033. Security review of 40 files, F1 100% to 89%, tokens -74%. Spam filtering F1 97% to 92%. Commit types 83% to 76%. The README says look-alike safe files landed near p 0.5 to 0.65 and are the ? rows. On huge scans, wall-clock time is about the same as Claude. The win there is tokens and context.",
          source: "github.com/UditAkhourii/quicksilver README benchmark table and Where it shines",
        },
        {
          claim:
            "bench/README.md token rules: Claude-alone totals subtract a 68.5k-token fixed floor, measured with a control agent that reads 1 tiny file and writes 1 line. Quicksilver is charged the full SKILL.md on every situation, plus each command, its full stdout, and 40 wrapper tokens per call. Counts use characters divided by 4. Claude-alone agents used Sonnet. 8 tasks use public data. Synthetic sets S02, S07, S08, and S12 were written by the author. S12 is a numeric negative control. The main table still shows F1 100% to 100% and -76% tokens on that row, and bench/README.md says plain awk wins there.",
          source: "github.com/UditAkhourii/quicksilver bench/README.md",
        },
        {
          claim:
            "Safety: the skill never sends .env files, private keys, certificates, or credential files. It respects .gitignore and skips binaries and files over 2 MB. Content goes to api.typesafe.ai. The README says TypeSafe states that Jev is not trained on customer data. npx github:UditAkhourii/quicksilver setup --remove deletes the local key. The project says it is independent and not affiliated with Anthropic or TypeSafe AI.",
          source: "github.com/UditAkhourii/quicksilver README Safety and FAQ",
        },
        {
          claim:
            "Public GitHub repo UditAkhourii/quicksilver had 98 stars and 5 forks on 2026-10-03. License MIT. Language JavaScript. Created 2026-09-25. Last push 2026-09-25. README copyright line names Udit Akhouri.",
          source: "GitHub API 2026-10-03 and the Quicksilver README license line",
        },
      ],
    },
    howJevIsUsed:
      "Quicksilver is the Claude Code skill and the qs CLI. dbreunig-building-with-jev-skill is Drew Breunig's SKILL.md for Choice, Score, and Noul question design on jev-1.13. It does not ship qs or a 12-task bench. kerpopule-hermes-jev-skills is a Hermes skill drawer for routing, memory, compaction, and GUI steps. dzhng-jevgrep walks a repository and returns excerpts for the agent to read. tamaratran-fast-jev-compaction scores tool-result rows so a transcript can drop junk. Quicksilver spends Jev on the bulk call before Claude reads: filter, classify, rank, find, and ask. The README's own limits stay in the page. BGL alert labels fell from 54% F1 to 23%. Security look-alikes are marked ?. Commit types scored 76% against Claude's 83%. Huge scans can tie Claude on the clock and still cut tokens. Cite github.com/UditAkhourii/quicksilver README and bench/README.md.",
    keyFeatures: [
      "1-command npx install into ~/.claude/skills/quicksilver, plus a Claude Code plugin path",
      "qs filter, classify, rank, find, ask, and status",
      "Shortlist output with collapsed repeats, id lists, and a ? on borderline rows",
      "12-task bench with a reproducible bench/ directory and a published token-counting rule",
      "Skip rules for secrets, gitignored paths, binaries, and files over 2 MB",
      "Receipt on every run: Jev dollars and Claude tokens not read",
    ],
    stack: [
      "JavaScript",
      "Node 18+",
      "Claude Code skill",
      "TypeSafe Jev",
      "MIT",
    ],
    links: {
      repo: "https://github.com/UditAkhourii/quicksilver",
      docs: "https://github.com/UditAkhourii/quicksilver/blob/main/bench/README.md",
    },
    pricingNote:
      "MIT code. Jev calls spend your TypeSafe key. README price: $0.042 per million input tokens, output free. The 12-task bench cost $0.45 of Jev, with a median of $0.004 per task.",
    firstSeen: "2026-10-03",
    relatedSlugs: [
      "dbreunig-building-with-jev-skill",
      "kerpopule-hermes-jev-skills",
      "dzhng-jevgrep",
      "tamaratran-fast-jev-compaction",
    ],
    relatedLearnSlugs: ["use-cases", "jev-typesafe"],
    faq: [
      {
        question: "Is Quicksilver an official TypeSafe or Anthropic skill?",
        answer:
          "README FAQ: no. It is an independent open-source project, and the README says it is not affiliated with Anthropic or TypeSafe AI. The install path is npx github:UditAkhourii/quicksilver, and the key is your own TypeSafe key.",
      },
      {
        question: "Does the 86% figure mean every task got cheaper and faster?",
        answer:
          "The README states 86% fewer Claude tokens, median 82%, a match on 8 of 12 tasks, up to 20x faster, and a median of $0.004 of Jev. The same table shows the BGL log falling from 54% F1 to 23%, and the 3,000-line needle task moving from 56s to 64s. Huge scans save tokens. They do not always save wall-clock time.",
      },
      {
        question: "How does the bench count a Claude token?",
        answer:
          "bench/README.md: Claude-alone totals subtract a 68.5k fixed floor from a control agent. Quicksilver is charged the full SKILL.md on every situation, plus each command, the full stdout, and 40 wrapper tokens. The count is characters divided by 4. Agents on the Claude-alone side used Sonnet.",
      },
      {
        question: "What should stay on Claude or on grep?",
        answer:
          "README: writing, editing, multi-step reasoning, and anything grep answers exactly. Let Claude check the ? rows on look-alike code and on house-style labels. S12 is the numeric negative control, and bench/README.md says plain awk wins there.",
      },
    ],
    metaTitle: "Quicksilver: bulk Jev calls for Claude Code",
    metaDescription:
      "Claude Code skill that hands filter, classify, rank, find, and ask to TypeSafe Jev. README 12-task bench: 86% fewer Claude tokens, median 82%.",
  },

  "aurorainfra-grev": {
    slug: "aurorainfra-grev",
    status: "published",
    problem:
      "grep, sort, and cut match strings. The line you want is often a meaning: the crash, the refund, the vegan meal, the column that is an email. A chat model answers with a paraphrase. A pipeline still needs the original line.",
    targetUser:
      "Shell users and coding agents who want Unix-style filters that keep the input text, add labels or scores only as explicit columns, and stop a run before it overspends.",
    overview:
      "grev (github.com/aurorainfra/grev, Apache-2.0 or MIT, your choice) is a Go suite of Unix filters that ask TypeSafe Jev a typed question instead of matching a pattern. The README rule is that output is always your input. Labels and scores appear only as explicit columns. The tools are grev, isv, oneof, tagv, sortv, rank, pickv, uniqv, unwrap, seg, cutv, seek, trv, lookv, probev, and grev-settings. Each has --help and a man page. Install from GitHub Releases (deb, rpm, apk, Arch packages, and archives for Linux, macOS, FreeBSD, and Windows), with go install github.com/aurorainfra/grev/cmd/...@latest, or with make and sudo make install, which also installs man pages and bash, zsh, and fish completions. grev-settings skill install copies an agent skill into ~/.claude/skills and ~/.agents/skills. npx skills add aurorainfra/grev works too. The default endpoint is TypeSafe. OpenRouter and Fastino are documented alternates. Public counts were 55 stars and 1 fork when this listing was drafted.",
    creator: {
      name: "aurorainfra",
      handle: "aurorainfra",
      githubUrl: "https://github.com/aurorainfra",
    },
    creatorQuote: {
      text: "Unix filters that ask questions instead of matching patterns.",
      attributedTo: "grev README",
      sourceUrl: "https://github.com/aurorainfra/grev/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "Semantic coreutils: each tool asks Jev a typed question and prints the user's own records, with labels or scores only when a flag asks for a column",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "The user's records. grev asks one yes/no per record, a line by default, and --about tells the model what the lines are. A {} in the question, or {1} and {2} after -d, names a field. isv and oneof judge the whole input once. Relational tools such as unwrap, seg, and pickv put a window of line-tagged text in the state.",
      decisionOut:
        "The selected input lines, verbatim and in input order. -s prints P(yes). -n prints the line number. probev -H prints probability columns for awk. tagv --split writes records into files. isv answers with the exit status. Counting stays in code, one answer per line. DESIGN.md names 2 normalizations: CRLF comes out as LF, and cutv re-encodes CSV quoting while TSV passes through byte for byte.",
      flowSteps: [
        "Install a release package, go install github.com/aurorainfra/grev/cmd/...@latest, or make and sudo make install",
        "grev-settings key set writes the TypeSafe key into ~/.grevconfig with mode 0600. CI can set TYPESAFE_API_KEY and skip the file",
        "Optional: point api.endpoint at OpenRouter or https://api.fastino.ai and set the model. OpenRouter does not serve the default jev-1.13.0. Fastino uses fastino/GLiDE",
        "Run grev, tagv, rank, cutv, seek, or the rest of the suite. -Q quotes first. --max-cost and the daily and monthly caps stop a run. Closing the output pipe stops spending",
        "grev-settings skill install for Claude Code and for ~/.agents/skills, which the README says Codex, Gemini CLI, GitHub Copilot, Cursor, OpenCode, Goose, and Amp read",
      ],
      sourcedMetrics: [
        {
          claim:
            "README tool table: grev filters like grep, isv answers yes/no like test, oneof picks a label like case, tagv labels every record, sortv sorts by a described order, rank sorts by fit or by ordered levels, pickv returns the one best line, uniqv collapses adjacent records that mean the same thing, unwrap rejoins hard-wrapped lines, seg splits a stream into topic segments, cutv cuts columns by description, seek walks a tree, trv translates where an instruction applies, lookv finds where an ordered answer flips, probev prints probability columns, and grev-settings holds config, the key, spend, and the skill.",
          source: "github.com/aurorainfra/grev README tool table",
        },
        {
          claim:
            "docs/tools/grev.md example: 16-line examples/app.log, 1 request, 1,388 tokens, $0.000058, 0.6 seconds, model jev-1.13.0. The printed lines were the panic, the fatal concurrent map write, the OOM kill, and the supervisor restarts. A 502 retry and a delayed email stayed out. -v selects the no rows as 1 minus P(yes), not as a negated question. Default threshold is 0.5. Exit status: 0 if a record was selected, 1 if none, 2 on error, 3 if only uncertain records, 4 if declined at -Q or stopped by --max-cost.",
          source: "github.com/aurorainfra/grev docs/tools/grev.md",
        },
        {
          claim:
            "README cost: Jev is $0.042 per million input tokens and output is free. Grepping a 4,000-line source file costs about $0.008. A quote above confirmAbove asks first and refuses without a terminal. The built-in confirmAbove is $1. The sample config sets it to $0.25, with daily 5 and monthly 50 USD caps. Fastino GLiDE is $0.30 per million input tokens and bills the shared context once per question, so those runs cost several times more. Quotes include that.",
          source: "github.com/aurorainfra/grev README Cost and safety and Through Fastino",
        },
        {
          claim:
            "DESIGN.md: a request carries about 262 tokens of framing plus about 7 per question, plus the text. Choice allows up to 255 options. Score uses 2 to 10 ordered levels. Putting each record inside its own question scored 94% against 91% for a state array on labelled sets, and the doc points at eval/RESULTS.md. --about adds 3 to 5 points. Packing limits: the whole request stays at or under 64k tokens, the state plus its longest question at or under 32k, with a 15% margin and 128 questions per request. The scheduler respects 1,200 requests per minute and 250k tokens per second.",
          source: "github.com/aurorainfra/grev docs/DESIGN.md",
        },
        {
          claim:
            "README lookv example comment: the first health check that reports a failure takes 3 requests for 600 lines. OpenRouter setup uses jev-latest or jev-1.13 because the default jev-1.13.0 is not served there. Package upgrades keep the agent skill current when the deb, rpm, apk, or Arch package links it to /usr/share/grev/skills/grev.",
          source: "github.com/aurorainfra/grev README examples and Use with coding agents",
        },
        {
          claim:
            "Public GitHub repo aurorainfra/grev had 55 stars and 1 fork on 2026-10-03. License Apache-2.0 or MIT. Language Go. Created 2026-09-24. Last push 2026-10-02.",
          source: "GitHub API 2026-10-03",
        },
      ],
    },
    howJevIsUsed:
      "grev is the shell suite. dzhng-jevgrep is the coding-agent search CLI: it walks a repo and returns excerpts, and the lines on stdout are leads for the agent to open. iurysza-logview-jev is an Android log viewer whose semantic mode scores retained lines inside the TUI. leepokai-jev-guard scores tool calls and scans results for coding agents. kitfunso-hippo-memory reranks local notes on recall. grev stays on the pipe. docs/tools/grev.md says the match is the original record. DESIGN.md adds the 2 output normalizations, CRLF to LF and CSV re-encoding in cutv, and still keeps labels in columns. The Go rows already in this catalog are mostly API clients. marcus-frost is a Go CLI that routes models. grev's job is the filter. Cite github.com/aurorainfra/grev README, docs/tools/grev.md, and docs/DESIGN.md.",
    keyFeatures: [
      "16 tools from grev and isv through seek, trv, lookv, probev, and grev-settings",
      "Output contract: your lines back, scores and labels only as columns",
      "Man pages, shell completions, and deb, rpm, apk, Arch, and archive packages",
      "Spend quote, confirmAbove, --max-cost, and daily and monthly caps",
      "OpenRouter and Fastino endpoints beside the TypeSafe default",
      "Agent skill installer for Claude Code and ~/.agents/skills",
    ],
    stack: [
      "Go",
      "Apache-2.0 or MIT",
      "TypeSafe Jev, OpenRouter, or Fastino GLiDE",
      "man pages and shell completions",
    ],
    links: {
      repo: "https://github.com/aurorainfra/grev",
      docs: "https://github.com/aurorainfra/grev/blob/main/docs/tools/grev.md",
    },
    pricingNote:
      "Dual-licensed code. Jev calls spend your key at the README rate of $0.042 per million input tokens, output free. A 4,000-line grep is about $0.008. Fastino GLiDE is $0.30 per million on that endpoint. The built-in confirm prompt sits at $1.",
    firstSeen: "2026-10-03",
    relatedSlugs: [
      "dzhng-jevgrep",
      "iurysza-logview-jev",
      "leepokai-jev-guard",
      "kitfunso-hippo-memory",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does grev rewrite the lines it keeps?",
        answer:
          "docs/tools/grev.md: grev prints the records the model says yes to, verbatim and in input order. The README says labels and scores appear only as explicit columns, for example -s or probev -H. DESIGN.md adds 2 normalizations: CRLF comes out as LF, and cutv re-encodes CSV quoting. TSV passes through byte for byte.",
      },
      {
        question: "How is this different from jevgrep?",
        answer:
          "dzhng-jevgrep searches a repository for a coding agent and returns excerpts. grev is a pipe filter over lines you already have, with man pages and an exit status. The docs example on a 16-line log printed the original crash lines and left the rest out.",
      },
      {
        question: "What stops a long run from spending?",
        answer:
          "README and DESIGN.md: a quote above confirmAbove asks on a terminal and refuses without one. The built-in value is $1. --max-cost and the daily and monthly caps refuse a quote that does not fit, and they keep checking during the run. Closing the output pipe cancels the run. A failed request on a big terminal run asks whether to retry, skip, or stop.",
      },
      {
        question: "Can the same binaries call OpenRouter or Fastino?",
        answer:
          "README: set api.endpoint and api.model, then grev-settings key set. OpenRouter wants jev-latest or jev-1.13, because the default jev-1.13.0 is not served there. Fastino uses fastino/GLiDE at $0.30 per million input tokens, and DESIGN.md says a Score of 3 or more levels can take extra passes that the quote includes.",
      },
    ],
    metaTitle: "grev: Unix filters that ask Jev questions",
    metaDescription:
      "Go coreutils that filter, label, sort, and cut by meaning with TypeSafe Jev. Output is your own lines. Packages, man pages, spend caps, and a skill.",
  },

  "peterfriese-system-one-foundation-models": {
    slug: "peterfriese-system-one-foundation-models",
    status: "published",
    problem:
      "Apple's Foundation Models session wants a LanguageModel that can fill @Generable structs. Hosted Jev, a self-hosted laya-serve process, and an on-device Laya Core ML bundle are 3 different runtimes. A phone build also cannot ship a cloud API key inside the binary.",
    targetUser:
      "Swift teams who want LanguageModelSession, @Generable types, and the session.probability, choice, and score shortcuts on hosted Jev, laya-serve, or on-device Laya, and who will follow the README proxy rules before a mobile app calls the cloud.",
    overview:
      "System One for Apple Foundation Models (github.com/peterfriese/system-one-foundation-models, Apache-2.0) is Peter Friese's native Swift 6 bridge from System One decision models into Apple's Foundation Models types: LanguageModel, LanguageModelExecutor, and @Generable. The README example depends on the package from version 0.2.0. Package.swift sets swift-tools-version 6.1 and declares platforms iOS 27.0, macOS 27.0, and visionOS 27.0. The README badges also say Swift 6, Xcode 27.0+, iOS 27.0+, and macOS 27.0+. This listing quotes those declarations. It does not add a separate check that those OS versions are shipping. Swift package traits pick a backend. Jev is the default. OnDevice enables Laya. Remote enables Jev and LayaServe. All enables every backend. LayaOnDevice runs Core ML on the Apple Neural Engine and GPU. The README describes a 322M multilingual mmBERT and a 421M English and typed-decisions ModernBERT, with no network and no API key. LayaFoundationModels talks to laya-serve on localhost port 8000, localhost port 8770, or the hosted endpoint the README names as api.impossibl.com. JevFoundationModels calls hosted TypeSafe with RetryPolicy. MailTriageApp is the reference mail client, with 5 selectable backends including an offline mock. Public counts were 63 stars and 2 forks when this listing was drafted.",
    creator: {
      name: "Peter Friese",
      handle: "peterfriese",
      githubUrl: "https://github.com/peterfriese",
    },
    creatorQuote: {
      text: "A lightweight, native Swift 6 bridge integrating System One decision models into Apple's Foundation Models framework.",
      attributedTo: "System One for Apple Foundation Models README",
      sourceUrl:
        "https://github.com/peterfriese/system-one-foundation-models/blob/main/README.md",
    },
    jevUsage: {
      flowRole:
        "LanguageModelSession backend: a @Generable schema becomes System One questions, and Laya on device, laya-serve, or hosted Jev returns probabilities the session can route on",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "A prompt or application state plus a @Generable struct or enum. The README maps Bool to noul, an enum or String to choice, and a ranged Guide to score. Shortcuts skip the struct: session.probability, session.choice over a Choosable enum or a string list, and session.score over ordered levels.",
      decisionOut:
        "response.content is the decoded struct. response.decision and response.judgement apply a RoutingPolicy and return auto, confirm, or escalate. A choice result carries the winning value, confidence, and the distribution. A score result carries a continuous mean, the most likely level, and per-level probabilities.",
      flowSteps: [
        "Add the package from 0.2.0 and pick a trait: the Jev default, OnDevice, Remote, or All",
        "On device: build a LayaCoreMLEngine from a compiled mlmodelc and ModernBERTTokenizer, then open LanguageModelSession with LayaOnDeviceLanguageModel",
        "Self-hosted HTTP: LayaLanguageModel with endpoint .localDefault, .local(port: 8770), or .hosted",
        "Cloud from a server or CLI: JevLanguageModel reads TYPESAFE_API_KEY from the environment and takes a RetryPolicy. A mobile app uses ProxyTransport and does not bundle the key",
        "Call session.respond(to:generating:) or the probability, choice, and score shortcuts. The README sample RoutingPolicy escalates below 0.60 and auto-accepts at or above 0.85",
      ],
      sourcedMetrics: [
        {
          claim:
            "README trait table: Jev (default) enables JevFoundationModels. Laya enables LayaOnDevice. LayaServe enables LayaFoundationModels. OnDevice activates Laya. Remote activates Jev and LayaServe. All activates Jev, Laya, and LayaServe. SystemOneCore holds schema translation, RoutingPolicy, and offline mocks and lists no network and no API key.",
          source: "github.com/peterfriese/system-one-foundation-models README traits and target table",
        },
        {
          claim:
            "README type map: Bool is noul, enum or String is choice, a Guide description is instructions, a ranged Guide is score, and response metadata exposes confidence and probabilities. Shortcut samples: session.probability returns a value from 0.0 to 1.0, with optional whenTrue and whenFalse criteria. session.choice returns value, confidence, distribution, and probability(of:). session.score returns a continuous mean, mostLikelyLevel, mostLikelyIndex, and per-level probabilities.",
          source: "github.com/peterfriese/system-one-foundation-models README type map and shortcuts",
        },
        {
          claim:
            "README timing sentence: evaluate strongly typed @Generable structs and enums against application state in 15 to 150 ms. The README does not attach a measurement table to that range. On-device copy names Laya's 322M multilingual mmBERT and 421M English and typed-decisions ModernBERT, with zero network calls. The sample RoutingPolicy uses escalateBelow 0.60 and autoAtOrAbove 0.85.",
          source: "github.com/peterfriese/system-one-foundation-models README opening and quick start",
        },
        {
          claim:
            "MailTriageApp, listed in the README, is a macOS and iOS reference app with 5 backends: Laya Core ML, Laya local at http://127.0.0.1:8000, Laya remote at https://api.impossibl.com, Jev Cloud at https://api.typesafe.ai, and an offline mock. Package.swift also declares executable targets TicketTriageDemo, DuplicateArticleDemo, FileOrganizerDemo, and LayaDemo.",
          source: "github.com/peterfriese/system-one-foundation-models README MailTriageApp and Package.swift",
        },
        {
          claim:
            "README security warning: never hardcode or bundle TYPESAFE_API_KEY in an iOS, iPadOS, watchOS, or visionOS binary. Safe patterns in that warning: on-device Laya with no secret, a server or CLI that keeps the key in the environment, or ProxyTransport through your own proxy with Apple App Attest or Firebase App Check. The longer notes are docs/mobile-security.md and tech note 0010.",
          source: "github.com/peterfriese/system-one-foundation-models README security advisory",
        },
        {
          claim:
            "Package.swift platforms array: iOS 27.0, macOS 27.0, and visionOS 27.0, with swift-tools-version 6.1. README badges say Xcode 27.0+, iOS 27.0+, and macOS 27.0+. This listing quotes the repo and does not confirm those version numbers against a shipping OS catalog.",
          source: "github.com/peterfriese/system-one-foundation-models Package.swift and README badges",
        },
        {
          claim:
            "Public GitHub repo peterfriese/system-one-foundation-models had 63 stars and 2 forks on 2026-10-03. License Apache-2.0. Language Swift. Created 2026-09-21. Last push 2026-10-02. The GitHub account name is Peter Friese.",
          source: "GitHub API 2026-10-03",
        },
      ],
    },
    howJevIsUsed:
      "This package is the Swift adapter for LanguageModelSession. mizorewww-laya-coreml is the Python Core ML runtime for open-weight Laya, with its own Snake loop and a published latency table. receptron-laya is the Node ONNX client for Convai Laya weights. typesafe-ai-typesafe-sdk-js is the official JavaScript SDK for the hosted API. ollaya-dev-ollaya pulls ONNX graphs and serves POST /v1/systemone for agents that want a local daemon. System One Foundation Models keeps the call inside Apple's session type. Hosted traffic uses JevFoundationModels. On-device traffic uses LayaOnDevice. laya-serve traffic uses LayaFoundationModels. The README's 15 to 150 ms line is a range in the introduction, and this page does not turn it into a benchmark. Cite the README, Package.swift, and docs/mobile-security.md.",
    keyFeatures: [
      "Swift 6 package traits: Jev, OnDevice, Remote, and All",
      "LayaOnDevice, LayaFoundationModels, and JevFoundationModels targets",
      "LanguageModelSession plus @Generable structs and enums",
      "session.probability, session.choice, and session.score shortcuts",
      "RoutingPolicy example at 0.60 and 0.85",
      "MailTriageApp reference and ProxyTransport for mobile cloud calls",
    ],
    stack: [
      "Swift 6",
      "Apache-2.0",
      "Apple Foundation Models",
      "TypeSafe Jev",
      "laya-serve HTTP",
      "Core ML Laya",
    ],
    links: {
      repo: "https://github.com/peterfriese/system-one-foundation-models",
      docs: "https://github.com/peterfriese/system-one-foundation-models/blob/main/docs/getting-started.md",
    },
    pricingNote:
      "Apache-2.0 code. On-device Laya needs no API key. Hosted Jev calls spend a TypeSafe key that the README says must stay off the mobile binary. laya-serve cost is the machine you run. The README does not publish a price table.",
    firstSeen: "2026-10-03",
    relatedSlugs: [
      "mizorewww-laya-coreml",
      "receptron-laya",
      "typesafe-ai-typesafe-sdk-js",
      "ollaya-dev-ollaya",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Is this the Python Laya Core ML package?",
        answer:
          "mizorewww-laya-coreml is a Python runtime with a Snake demo and its own timing table. This repo is Swift. The on-device target is LayaOnDevice, and the session type is Apple's LanguageModelSession. Hosted Jev is a separate target, JevFoundationModels.",
      },
      {
        question: "Do the iOS 27 and Xcode 27 badges mean those releases are shipping?",
        answer:
          "Package.swift declares iOS 27.0, macOS 27.0, and visionOS 27.0. The README badges say Xcode 27.0+, iOS 27.0+, and macOS 27.0+. This directory quotes those lines. It does not add an availability check of its own.",
      },
      {
        question: "Where should a phone keep the TypeSafe key?",
        answer:
          "README warning: do not hardcode or bundle TYPESAFE_API_KEY in an iOS, iPadOS, watchOS, or visionOS binary. On-device Laya needs no key. A cloud mobile app uses ProxyTransport through your own proxy, with Apple App Attest or Firebase App Check. Server and CLI samples read the key from the environment.",
      },
      {
        question: "What do session.probability, choice, and score return?",
        answer:
          "README shortcuts: probability is a 0.0 to 1.0 truth value, with optional whenTrue and whenFalse criteria. choice returns the winning case, confidence, and the distribution. score returns a continuous mean, the most likely rubric level, and the per-level probabilities. The sample RoutingPolicy escalates below 0.60 and auto-accepts at or above 0.85.",
      },
    ],
    metaTitle: "System One for Apple Foundation Models",
    metaDescription:
      "Swift 6 bridge: LanguageModelSession over hosted Jev, laya-serve, or on-device Laya. Package.swift declares iOS, macOS, and visionOS 27.0.",
  },

  "extend-hq-jevbox": {
    slug: "extend-hq-jevbox",
    status: "published",
    problem:
      "Team document libraries still lean on embeddings or keyword search that blur permissions, hide weak evidence, or need a separate vector stack to stay current.",
    targetUser:
      "Engineering and ops teams who want a self-hostable document drive with org sharing, cited chat, and agent MCP access without maintaining chunk indexes.",
    overview:
      "Jevbox (github.com/extend-hq/jevbox, jevbox.extend.ai) is Extend's full stack document library from Andrew Luo, released October 2026. Better Auth organizations, Extend Parse indexing, SpiceDB authorization, and TypeSafe Jev hierarchical routing share one PostgreSQL estate. Search and automatic filing require a TypeSafe API key; README states there is no keyword or embedding fallback. Kushal Byatnal's launch post on X and the ModelSystem.One writeup describe Jev Choice beam search over folders, documents, and sections plus Score usefulness filtering before chat models answer with citations.",
    creator: {
      name: "Extend",
      handle: "extend-hq",
      githubUrl: "https://github.com/extend-hq",
      companyUrl: "https://extend.ai",
    },
    jevUsage: {
      flowRole:
        "Hierarchical Choice routing for filing and library search; independent Score usefulness on source passages before chat synthesis",
      primitives: ["Choice", "Score"],
      stateIn:
        "Permission-filtered folder menus, document structural outlines, and overlapping source passages from parsed uploads (see docs/retrieval.md).",
      decisionOut:
        "Route log-probability scores across up to 4 beam paths; passage usefulness on a 4-level rubric with 1.5 floor and 2.75 early-stop threshold per retrieval doc.",
      flowSteps: [
        "Parse uploads with Extend API or local text decoders; store sections and passages without generative summaries",
        "On upload, Jev classifies into existing folders or validates model-proposed branches (docs/organization.md)",
        "At query time, Jev Choice walks authorized hierarchy; weak evidence widens exploration up to documented caps",
        "Jev Score batches usefulness on candidate passages; chat providers answer only from accepted citations",
      ],
      sourcedMetrics: [
        {
          claim:
            "docs/retrieval.md: beam retains 4 routes; Choice menus up to 64 children plus none; exploration capped at 96 node expansions and 96 passage scores per query.",
          source: "github.com/extend-hq/jevbox docs/retrieval.md",
        },
        {
          claim:
            "README: TypeSafe key required for hierarchical search and document questions; no keyword or embedding fallback when the connection is missing.",
          source: "github.com/extend-hq/jevbox README Run locally",
        },
        {
          claim:
            "Public GitHub repo extend-hq/jevbox had about 401 stars when this listing was drafted.",
          source: "GitHub star count October 2026",
        },
        {
          claim:
            "Extend's October 2026 launch post on X passed 900 likes overnight per ModelSystem.One news summary; treat engagement as social signal, not a benchmark.",
          source: "modelsystem.one/news/extend-jevbox-document-drive",
        },
      ],
    },
    howJevIsUsed:
      "Jevbox is the permission-aware document application lane, not DocJev's classify-and-split library and not jev-search's Search1API web planner. Extend stores structure and original passages, then spends Jev on routing and evidence quality instead of maintaining embedding indexes. SpiceDB checks run before provider calls and again on results, so revoked sources block dependent chats. MCP and REST expose the same search and answer tools with durable run handles documented in docs/api-access.md. Chat models from many vendors write prose; Jev never replaces them, it decides where to look and which passages merit context. Compare jkudish-jev-mcp when you only need judgment tools inside an existing agent, or docjev when your problem is boundary detection on one file.",
    keyFeatures: [
      "Extend UI Finder with grid, list, columns, and gallery views plus inline citation previews",
      "Automatic filing and upload-driven organization reviews over cached indexes",
      "Versioned REST API and MCP with API-key or OAuth auth under current document permissions",
      "Render blueprint, Docker Compose, Helm, and AWS/EKS Terraform deployment guides",
      "pg-boss workers for indexing, filing, chat, and MCP jobs separate from the web tier",
    ],
    stack: [
      "TypeScript",
      "Node 24+",
      "PostgreSQL",
      "SpiceDB",
      "Extend Parse",
      "TypeSafe System One",
      "Better Auth",
    ],
    links: {
      repo: "https://github.com/extend-hq/jevbox",
      docs: "https://github.com/extend-hq/jevbox/blob/main/docs/retrieval.md",
      website: "https://jevbox.extend.ai",
      demo: "https://jevbox.extend.ai",
      post: "https://x.com/kushalbyatnal/status/2106134932795822464",
    },
    pricingNote:
      "Self-hosted infrastructure plus your Extend parse, TypeSafe Jev, and chat provider keys. README documents Render paid services; no directory-hosted SaaS meter.",
    firstSeen: "2026-10-04",
    relatedSlugs: [
      "vectifyai-jev-doc-search",
      "docjev",
      "superagents-lab-jev-search",
      "jkudish-jev-mcp",
    ],
    relatedLearnSlugs: ["system-one", "use-cases"],
    faq: [
      {
        question: "Does Jevbox use vector search?",
        answer:
          "docs/retrieval.md states the implementation uses TypeSafe as the decision provider and does not require PageIndex or a vector store. VectifyAI's jev-doc-search is the open recipe that does use PageIndex, for one long PDF. Jevbox is the shared library.",
      },
      {
        question: "How is this different from DocJev?",
        answer:
          "DocJev classifies or splits single documents from natural-language rules. Jevbox is a multi-user library with sharing, chat, MCP, and hierarchical retrieval across many indexed files.",
      },
      {
        question: "Is the repository licensed for production forks?",
        answer:
          "README encourages forks as a template and does not plan to accept pull requests. ModelSystem.One notes the public repo lacked a LICENSE file at launch; confirm license terms in the repository before you depend on it.",
      },
    ],
    metaTitle: "Jevbox: Jev document library without embeddings",
    metaDescription:
      "Extend Jevbox self-hosts cited document chat. Jev Choice beam search and Score passage filtering, SpiceDB permissions, MCP. GitHub extend-hq/jevbox.",
  },

  "codegirl-007-jevlint": {
    slug: "codegirl-007-jevlint",
    status: "published",
    problem:
      "Style and architecture rules that need human judgment still sit in review comments because regex linters cannot read intent across languages.",
    targetUser:
      "Teams who want CI-friendly semantic linting with plain-language rules, cached Jev calls, and optional rule packs without sending chat history.",
    overview:
      "jevlint (github.com/codegirl-007/jevlint) is a Go CLI that uses Tree-sitter to extract functions, types, comments, fields, or statements, then asks Jev whether each unit satisfies rules in jevlint.json. Commands cover init, doctor, check, eval, and plugin pack management. README documents TypeSafe as the default provider plus Clef on Cloudflare Workers AI and OpenRouter-hosted Jev. Prebuilt binaries ship on GitHub Releases for linux, macOS, and windows on amd64 and arm64.",
    creator: {
      name: "codegirl-007",
      handle: "codegirl-007",
      githubUrl: "https://github.com/codegirl-007",
    },
    jevUsage: {
      flowRole:
        "Per code-unit Noul-style pass or fail judgments on natural-language rule descriptions, with optional localize second pass",
      primitives: ["Noul"],
      stateIn:
        "Extracted source for one Tree-sitter unit plus rule text, exceptions, and optional callee context (up to 12 project-local callees).",
      decisionOut:
        "pass, fail, skip, or abstain per unit with confidence; failures below minConfidence stay hidden; localize reruns focused regions on fail.",
      flowSteps: [
        "jevlint init detects languages and writes jevlint.json",
        "check walks include globs, batches applicable rules per unit (default concurrency 4)",
        "Failed function or type rules may trigger localize passes up to 24 regions",
        "Results cache in the OS user cache keyed by endpoint, model, credential fingerprint, and request body",
      ],
      sourcedMetrics: [
        {
          claim:
            "README: default concurrency 4 parallel Jev requests; network failures retry up to 2 times.",
          source: "github.com/codegirl-007/jevlint README How it works",
        },
        {
          claim:
            "Public GitHub repo codegirl-007/jevlint had about 125 stars when this listing was drafted.",
          source: "GitHub star count October 2026",
        },
      ],
    },
    howJevIsUsed:
      "jevlint sits between classic linters and agent guardrails. Abide compiles AGENTS.md rubrics on every edit diff; jev-codes scores hunks against YAML standards packs; grev filters arbitrary line streams on the shell. jevlint instead targets repository taste with Tree-sitter precision across 12 language presets, rule packs shared like owner/name modules, and jevlint eval fixtures that require explicit pass or fail outcomes. Clef and OpenRouter paths reuse the same System One request shape, so switching providers does not rewrite rules. Use uehaj-jev-semgrep when you only need line-level meaning grep, or aurorainfra-grev when the job is Unix filters on logs and CSVs.",
    keyFeatures: [
      "init, doctor, check, eval, plugin, and version commands with JSON output flags",
      "Rule packs with pack.json, shared rules.json, and bundled eval fixtures",
      "OS-level result cache with --refresh-cache and --clear-cache",
      "--changed flag limits checks to git-modified files",
      "GitHub Releases binaries plus go install from source (Go 1.26+, CGO)",
    ],
    stack: [
      "Go",
      "Tree-sitter grammars",
      "TypeSafe Jev",
      "Optional Clef or OpenRouter Jev",
    ],
    links: {
      repo: "https://github.com/codegirl-007/jevlint",
      docs: "https://github.com/codegirl-007/jevlint#commands",
    },
    pricingNote:
      "Open source CLI; Jev, Clef, or OpenRouter usage bills per your API keys. README never stores credentials in the project tree.",
    firstSeen: "2026-10-04",
    relatedSlugs: [
      "coldteadotai-abide",
      "kushwho-jev-codes",
      "uehaj-jev-semgrep",
      "aurorainfra-grev",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Which languages are supported?",
        answer:
          "README lists presets c, cpp, csharp, go, java, javascript, kotlin, php, python, ruby, rust, tsx, and typescript with native grammars compiled into the binary.",
      },
      {
        question: "How is jevlint different from Abide?",
        answer:
          "Abide hooks agent edits against instruction-file rubrics. jevlint is a batch linter you run with jevlint check on repository paths.",
      },
      {
        question: "Does check send my whole repo to Jev?",
        answer:
          "README states Jevlint sends extracted code units and file metadata to the configured provider per rule batch, not full chat logs.",
      },
    ],
    metaTitle: "jevlint: Tree-sitter lint rules judged by Jev",
    metaDescription:
      "codegirl-007 jevlint runs plain-language rules on code units via Tree-sitter and TypeSafe Jev. Packs, cache, eval, Release binaries.",
  },

  "junma11-medjev": {
    slug: "junma11-medjev",
    status: "published",
    problem:
      "Clinical research pipelines still paste free-text notes into general chat models and manually transcribe answers into registries, which leaks PHI and yields inconsistent field wording.",
    targetUser:
      "Hospital and research engineers who need on-prem extraction of typed clinical variables with calibrated confidences on a single GPU.",
    overview:
      "MedJev (github.com/JunMa11/MedJev) is Jun Ma's open Python project for ultra-fast clinical variable extraction from free-text notes. It fine-tunes Qwen3.5-0.8B-Base with LoRA and a pointer head adapted from Jared Palmer's kev decision architecture (github.com/jaredpalmer/kev). Training data ships at data/medjev-v1 from the Augmented Clinical Notes corpus on Hugging Face, with underlying notes traced to PMC-Patients. README advertises thousands of notes per hour on one consumer GPU with no per-use API fee when serving locally.",
    creator: {
      name: "Jun Ma",
      handle: "JunMa11",
      githubUrl: "https://github.com/JunMa11",
    },
    jevUsage: {
      flowRole:
        "Local System One-compatible noul, choice, and score heads over encoded clinical note state with one forward pass per question branch",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Clinical note text materialized into kev-style records with per-field instructions and criteria (see medjev.records.materialize).",
      decisionOut:
        "Probability vectors per question: binaries as noul, enums as choice, ordered levels as score, with serving latency reported in evaluate JSON.",
      flowSteps: [
        "Train with python -m medjev.train on Augmented Clinical Notes splits",
        "Select checkpoints on development; test split requires --allow-test",
        "Serve with load() and probs_and_prefix so state encodes once per record",
        "Optional serve_compare UI contrasts base Qwen, hosted Jev replays, and MedJev checkpoint",
      ],
      sourcedMetrics: [
        {
          claim:
            "README dataset counts: 23,719 train, 2,997 development, and 2,895 test records in data/medjev-v1 from Augmented Clinical Notes.",
          source: "github.com/JunMa11/MedJev README Training",
        },
        {
          claim:
            "medjev.evaluate reports micro accuracy, macro-F1, Brier, ECE, score level error, majority-class floors, and latency_ms_per_record on the serving path.",
          source: "github.com/JunMa11/MedJev README Evaluation",
        },
        {
          claim:
            "Public GitHub repo JunMa11/MedJev had about 111 stars when this listing was drafted.",
          source: "GitHub star count October 2026",
        },
      ],
    },
    howJevIsUsed:
      "MedJev is a domain fine-tune, not a hosted gate you paste into agents. It inherits kev's question isolation and System One request format so each clinical field is a typed branch reading a shared encoded note state. That keeps answers inside clinician-defined option sets with explicit confidences for triage to human review. Hosted TypeSafe Jev appears only as an optional baseline replay in serve_compare (answers loaded from data/results/jev JSONL, not re-purchased per click). Contrast jaredpalmer-kev for general open weights, classifier.dev for HTTP zero-shot labels, or docjev for document splitting. Cite github.com/JunMa11/MedJev, github.com/jaredpalmer/kev, the Augmented Clinical Notes dataset, and the PMC-Patients paper linked in README acknowledgements.",
    keyFeatures: [
      "Train, evaluate, compare, bench_runtime, and serve_compare modules",
      "11 default question specs in medjev.labels.QUESTIONS or custom schemas",
      "Single-GPU recipe with bf16 and gradient checkpointing documented",
      "Optional TYPESAFE_API_KEY for hosted Jev baseline experiments only",
      "On-prem inference: patient text stays on your hardware per README positioning",
    ],
    stack: [
      "Python 3.12",
      "PyTorch",
      "Qwen3.5-0.8B",
      "peft",
      "flash-linear-attention",
      "kev-derived model code",
    ],
    links: {
      repo: "https://github.com/JunMa11/MedJev",
      docs: "https://github.com/JunMa11/MedJev#training",
    },
    pricingNote:
      "Open source training and serving on your GPUs. Optional TypeSafe Jev baseline needs your API key; routine MedJev inference does not call TypeSafe when running local checkpoints.",
    firstSeen: "2026-10-04",
    relatedSlugs: [
      "jaredpalmer-kev",
      "classifier-dev",
      "docjev",
      "peterfriese-system-one-foundation-models",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "Does MedJev send notes to TypeSafe by default?",
        answer:
          "README positions local serving so patient text stays on your network. serve_compare replays stored Jev baseline JSONL unless you configure a fresh hosted eval.",
      },
      {
        question: "What is the relationship to kev?",
        answer:
          "README acknowledgements state medjev/model.py, api.py, records.py, and checkpoint.py adapt kev under Apache-2.0 with changes recorded in NOTICE.",
      },
      {
        question: "Can I add a new clinical field without retraining?",
        answer:
          "README contrasts general LLMs (describe a field in prose) with MedJev (needs hundreds of labeled examples and a short fine-tune for reliable new option sets).",
      },
    ],
    metaTitle: "MedJev: on-prem clinical note extraction",
    metaDescription:
      "JunMa11 MedJev fine-tunes Qwen on Augmented Clinical Notes with kev-style noul, choice, and score heads. Train, eval, and serve on one GPU.",
  },

  "vectifyai-jev-doc-search": {
    slug: "vectifyai-jev-doc-search",
    status: "published",
    problem:
      "A single Jev Choice can ask which page answers a question, until the PDF is longer than the request limit or the 255-option cap.",
    targetUser:
      "Engineers who need the page that answers a question in one long PDF, such as a 10-K, without standing up a vector database.",
    overview:
      "jev-doc-search (github.com/VectifyAI/jev-doc-search) finds the page that answers a question in a long PDF. It uses Jev Choice. There is no vector database and no embeddings. VectifyAI, the team behind PageIndex (github.com/VectifyAI/PageIndex), turns the PDF into a tree of sections. Each section has a title, a summary, and a page range. tree_search.py walks that tree with one Choice per level. It keeps a beam of 3, picks candidate pages, then checks up to 16 pages with one Noul each. The model in page_search.py and tree_search.py is jev-1.13.0 through TypeSafeClient.system_one. Jevbox is the self-hosted library for many files. Its retrieval doc says it does not need PageIndex. This repo is the open recipe for one PDF.",
    creator: {
      name: "VectifyAI",
      handle: "VectifyAI",
      githubUrl: "https://github.com/VectifyAI",
      company: "PageIndex",
      companyUrl: "https://pageindex.ai",
    },
    jevUsage: {
      flowRole:
        "Choice over PageIndex section menus, then Choice over page windows, then a Noul check on each candidate page",
      primitives: ["Choice", "Noul"],
      stateIn:
        "The question, plus either a page's text (flat search and the Noul check) or a section title and summary (tree steps). See README and tree_search.py.",
      decisionOut:
        "A page id from Choice, then a yes probability from Noul. Pages at 0.5 or above are kept. If none clear 0.5, the best 2 are kept.",
      flowSteps: [
        "Flat page search (page_search.py) is one Choice with one option per page. It stops when the request passes the token budget or 255 options.",
        "PageIndex builds a tree: title, summary, and start_index to end_index on each node.",
        "tree_search.py keeps a beam of 3 paths, scored by the geometric mean of the step probabilities.",
        "Long sections are split into windows. Up to 16 candidate pages each get one Noul: does this page state the answer?",
      ],
      sourcedMetrics: [
        {
          claim:
            "README: NVIDIA's fiscal 2026 10-K has 93 pages and about 76,000 tokens, past the 32,000 token request limit. Citigroup's 2025 10-K has 318 pages, past the 255-option Choice cap.",
          source: "github.com/VectifyAI/jev-doc-search README",
        },
        {
          claim:
            "README results table, both marked correct: NVIDIA fiscal 2026 revenue found on p37 and p51. Citigroup 2025 net income found on p12, p16, p134, and p135. The income-statement pages cited are NVIDIA p51 and Citigroup p134.",
          source: "github.com/VectifyAI/jev-doc-search README",
        },
        {
          claim:
            "tree_search.py sets MODEL to jev-1.13.0, BEAM to 3, MAX_CANDIDATES to 16, and VERIFY_MIN to 0.5. Kept pages are those at or above 0.5, or the best 2 if none qualify.",
          source: "github.com/VectifyAI/jev-doc-search tree_search.py",
        },
        {
          claim:
            "Public GitHub repo VectifyAI/jev-doc-search had 95 stars and 3 forks on 2026-10-05. VectifyAI is the team behind PageIndex (github.com/VectifyAI/PageIndex).",
          source: "GitHub star counts, 2026-10-05",
        },
      ],
    },
    howJevIsUsed:
      "Flat search is the short-document path. page_search.py puts every page's text in one Choice, and Jev returns a probability for each page. The README says that request must fit in 32,000 tokens, and a Choice takes at most 255 options. A 93-page NVIDIA 10-K is already about 76,000 tokens. A 318-page Citigroup 10-K is past the option cap. PageIndex (github.com/VectifyAI/PageIndex) replaces the flat menu with a tree. Each step is a small Choice whose options are 'title. summary'. The beam of 3 follows TypeSafe's hierarchical classification cookbook, which the README names. After the beam ends, page windows that fit in one request supply candidates, and a Noul with the page text in state decides what to keep. Choice probabilities always sum to 1, so a winner can exist even when no page answers. The Noul is the absolute check. Setup needs TYPESAFE_API_KEY and PAGEINDEX_API_KEY. Jevbox (extend-hq/jevbox) is a different product: a permission-aware document drive whose docs/retrieval.md says it does not require PageIndex or a vector store. DocJev classifies or splits one document from rules you write. jev-search plans web queries. This listing is the PageIndex team's script for tree search over one long PDF.",
    keyFeatures: [
      "page_search.py for short PDFs: one Choice, one option per page",
      "tree_search.py for long PDFs: beam of 3, page windows, Noul check up to 16 pages",
      "Reuse a PageIndex doc_id so the same PDF is not uploaded again",
      "Apache-2.0. Python. Created 2026-09-30",
      "README worked example on the NVIDIA fiscal 2026 10-K and the Citigroup 2025 10-K",
    ],
    stack: [
      "Python",
      "typesafe_sdk",
      "jev-1.13.0",
      "PageIndex",
      "pypdf",
    ],
    links: {
      repo: "https://github.com/VectifyAI/jev-doc-search",
      docs: "https://github.com/VectifyAI/jev-doc-search/blob/main/README.md",
      website: "https://pageindex.ai",
    },
    pricingNote:
      "Apache-2.0 code. Runs need your TYPESAFE_API_KEY and PAGEINDEX_API_KEY. The README does not publish a price table.",
    firstSeen: "2026-09-30",
    relatedSlugs: [
      "extend-hq-jevbox",
      "docjev",
      "superagents-lab-jev-search",
    ],
    relatedLearnSlugs: ["system-one", "use-cases"],
    faq: [
      {
        question: "How do you search a long PDF with Jev without embeddings?",
        answer:
          "PageIndex builds a tree of sections with a title, a summary, and a page range. tree_search.py asks Jev one Choice per level, keeps the 3 best paths, then checks candidate pages with Noul. The README states there is no vector database.",
      },
      {
        question: "Why does one Choice per page fail on a 10-K?",
        answer:
          "The README gives 2 limits. State plus the Choice must fit in 32,000 tokens. NVIDIA's fiscal 2026 10-K is 93 pages and about 76,000 tokens. A Choice also takes at most 255 options. Citigroup's 2025 10-K is 318 pages.",
      },
      {
        question: "How is jev-doc-search different from Jevbox?",
        answer:
          "Jevbox is Extend's self-hosted document library. Its docs/retrieval.md says search uses TypeSafe and does not require PageIndex or a vector store. jev-doc-search is VectifyAI's open recipe that does use PageIndex, for one PDF at a time.",
      },
      {
        question: "Which API keys does the script need?",
        answer:
          "The README setup exports TYPESAFE_API_KEY (TypeSafe console) and PAGEINDEX_API_KEY (PageIndex dashboard). The client is TypeSafeClient with model jev-1.13.0.",
      },
    ],
    metaTitle: "jev-doc-search: PDF tree search with Jev",
    metaDescription:
      "VectifyAI jev-doc-search walks a PageIndex tree with Jev Choice, then checks pages with Noul. NVIDIA revenue landed on p37 and p51. No vector database.",
  },

  "statelyai-jevspresso": {
    slug: "statelyai-jevspresso",
    status: "published",
    problem:
      "An agent that writes its own tool calls can ask for moves the world does not allow, so the app has to reject them after the fact.",
    targetUser:
      "Developers who want an XState machine to define the legal moves, and Jev to pick one of those moves.",
    overview:
      "Jevspresso (github.com/statelyai/jevspresso, jevspresso.dev) is Stately's simulated espresso bar. You type an order in plain English, such as a cap with almond milk, and Jev grinds, tamps, pulls shots, steams milk, and serves. You can also break equipment and watch Jev cope. An XState v6 (alpha) machine models what is physically possible. The repo pins xstate 6.0.0-alpha.58. Jev only picks an event the machine accepts right now. Jev never writes an action or a payload. The helper package @xstate/jev lives in packages/jev of this repo. On 2026-10-05 the npm registry returned Not found for @xstate/jev, and the package.json in the repo is private. This listing does not claim a license: the GitHub API reports none, and the repo root has no LICENSE file.",
    creator: {
      name: "Stately",
      handle: "statelyai",
      githubUrl: "https://github.com/statelyai",
      company: "Stately",
      companyUrl: "https://stately.ai",
    },
    jevUsage: {
      flowRole:
        "Pick one legal XState event from the set snapshot.can() accepts, then send it only if the machine still accepts it",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Default state is the machine value and context. Order parsing adds the customer's words. Lookahead can describe what each event would change.",
      decisionOut:
        "One event from the closed set, or a noop, or no send when confidence is low or the machine moved on. Order fields come back as Choice and Noul answers in the same call.",
      flowSteps: [
        "decide() collects event types the active state handles, builds payloads, and fills finite fields from Zod (Standard Schema) runtime schemas. createJevLogic delivers the chosen event and decides again when the actor changes.",
        "Events that snapshot.can(event) rejects are dropped. Jev gets one parallel request over the options that remain.",
        "The chosen event is sent only if the machine still accepts it. types<T>() events throw because they have no runtime shape.",
        "Orders are one Jev call of closed questions (drinks, quantity, milk). Unclear orders go to a router agent that asks the customer to confirm.",
      ],
      sourcedMetrics: [
        {
          claim:
            "packages/jev README: decide() keeps only events snapshot.can(event) accepts, asks Jev one parallel request, and createJevLogic sends the event only if it is still accepted. Default strategy is auto: flat up to 32 options, hierarchical above that, still one parallel request.",
          source: "github.com/statelyai/jevspresso packages/jev/README.md",
        },
        {
          claim:
            "Root README: /light is a lamp. With the bulb broken and the switch on, Jev replaces the bulb. The README says it is never told about bulbs. /eval runs rush, breakdown, and sabotage scenarios against real Jev and reports orders served correctly and cost.",
          source: "github.com/statelyai/jevspresso README",
        },
        {
          claim:
            "src/lib/jev.ts calls TypeSafeClient.systemOne on the server. src/lib/jev-core.ts reads order answers as Choice (intent, quantity, milk, size) and Noul (present, milk stated, decaf, iced).",
          source: "github.com/statelyai/jevspresso src/lib/jev.ts and src/lib/jev-core.ts",
        },
        {
          claim:
            "Public GitHub repo statelyai/jevspresso had 22 stars and 5 forks on 2026-10-05. Created 2026-10-03. Language TypeScript. No license reported by the GitHub API.",
          source: "GitHub repo metadata, 2026-10-05",
        },
      ],
    },
    howJevIsUsed:
      "The bar in src/machines/espressoBar.ts is one parallel machine: order intake, grinder, espresso machine, steam wand, one portafilter, one milk pitcher, and the barista's hands. It models physics, not recipes. The barista is a createJevLogic actor. Whenever the bar changes, Jev sees every barista event that can() accepts, described in the machine's own words plus what transition() says would change. The package README's 5 steps are: collect matching event types, fill finite fields from the Zod schema, drop events can() rejects, ask Jev one parallel request, then deliver the event only if it is still legal. A field with no finite set of values and no payload is dropped. An event declared with types<T>() throws, because there is nothing to enumerate at runtime. The client in src/lib/jev.ts calls systemOne() on the server so TYPESAFE_API_KEY stays there. pnpm test runs against a mock and does not need a key. /light (live at jevspresso.dev/light) is the smallest copy of the pattern. /eval (jevspresso.dev/eval) runs scripted rushes and breakdowns against real Jev. This is the first XState listing in the directory. jev-guard scores coding-agent tool calls. Ten levels of Jev teaches questions the agent can write. TanStack decide is a typed helper in application code. Jevspresso keeps the legal set inside the state machine.",
    keyFeatures: [
      "Live espresso bar at jevspresso.dev, plus /light and /eval",
      "@xstate/jev in packages/jev: createJevLogic, decide, caching, and loop detection",
      "Zod runtime schemas fill enum, boolean, and const fields so Jev never writes a payload",
      "Order parser: one call, Choice and Noul questions, router agent when the order is unclear",
      "pnpm test uses a mock Jev. A real key is read on the server from TYPESAFE_API_KEY",
    ],
    stack: [
      "TypeScript",
      "XState v6 (alpha)",
      "Zod",
      "TypeSafe JavaScript SDK",
      "@xstate/jev (in-repo)",
    ],
    links: {
      website: "https://jevspresso.dev",
      demo: "https://jevspresso.dev",
      repo: "https://github.com/statelyai/jevspresso",
      docs: "https://github.com/statelyai/jevspresso/blob/main/packages/jev/README.md",
    },
    pricingNote:
      "The repo does not publish a license or a price table. It needs XState v6 alpha. Jev calls spend a TypeSafe key that src/lib/jev.ts keeps on the server. pnpm test does not call Jev.",
    firstSeen: "2026-10-03",
    relatedSlugs: [
      "leepokai-jev-guard",
      "disler-ten-levels-of-jev",
      "tanstack-ai-decide",
      "vercel-eve",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "How does XState keep Jev from writing actions?",
        answer:
          "The machine lists the events it accepts right now. @xstate/jev offers only those events, after Zod fills finite fields. Jev picks one. The event is sent only if snapshot.can(event) is still true. The package README says Jev never writes a payload.",
      },
      {
        question: "Is @xstate/jev on npm?",
        answer:
          "On 2026-10-05 the npm registry returned Not found for @xstate/jev. packages/jev/package.json names the package, sets version 0.0.0, and marks it private. It is a private workspace package, so use it from a clone of the repo.",
      },
      {
        question: "What does the lamp example show?",
        answer:
          "The README's /light machine is a switch and a bulb. Ask for light with the bulb broken and the switch already on, and Jev replaces the bulb. The README says the agent is never told about bulbs. It sees whether the room is lit.",
      },
      {
        question: "What does /eval report?",
        answer:
          "The README says /eval runs rush, breakdown, and sabotage scenarios against real Jev and reports how many orders were served correctly and what it cost. It does not publish a fixed score in the README.",
      },
    ],
    metaTitle: "Jevspresso: XState events chosen by Jev",
    metaDescription:
      "Stately Jevspresso lets Jev pick only events an XState v6 (alpha) machine accepts. Live bar at jevspresso.dev. @xstate/jev lives in the repo, not on npm.",
  },

  "tomerglick57-jevstiller": {
    slug: "tomerglick57-jevstiller",
    status: "published",
    problem:
      "A repeated Jev Choice is a network call every time, about 300 ms at the loads the Jevstiller README measured, even when the question never changes.",
    targetUser:
      "Teams with a stable Choice task (support intents, news sections, a fixed label set) who want many of the repeats answered on their own CPU after a short warm-up.",
    overview:
      "Jevstiller (github.com/tomerglick57/Jevstiller, jevstiller.pages.dev) is a drop-in proxy in front of repeated Jev Choice calls. Point the SDK at it with TYPESAFE_BASE_URL. At first every request still goes to Jev. From Jev's answers, including the full probability distribution, it trains a small local student on a frozen bge encoder and checks agreement against a budget you set. It then answers many repeats locally, up to about 80% on the stable label sets in the README table. TweetEval sentiment and offensive were 22.2% and 24.1%. Uncertain or novel input, and a permanent random audit slice, keep going to Jev. If the audit shows the contract broke, everything falls back to Jev. The README says agreement with Jev is not accuracy. PyPI jevstiller 0.4.0. Apache-2.0.",
    creator: {
      name: "tomerglick57",
      handle: "tomerglick57",
      githubUrl: "https://github.com/tomerglick57",
    },
    jevUsage: {
      flowRole:
        "Teacher for a local Choice student: Jev labels the traffic, the audit slice, and anything the student is not allowed to answer",
      primitives: ["Choice"],
      stateIn:
        "The caller's Choice request: instructions, criteria, and model. The proxy keys a task by that exact content.",
      decisionOut:
        "Jev's own response until a student is promoted. After that, a local label in Jev's response shape when the threshold allows it, with header x-jevstiller-source: local.",
      flowSteps: [
        "Services keep their own TYPESAFE_API_KEY. Jevstiller forwards it and the README says it never stores the key.",
        "Until the student passes its checks, requests are forwarded and Jev's responses are returned unchanged.",
        "The threshold uses an exact Clopper-Pearson bound at 95% confidence so disagreement stays inside the budget. target_agreement 0.98 means a 2% disagreement budget.",
        "Non-Choice questions and other endpoints are always forwarded. A fixed random audit slice always goes to Jev.",
      ],
      sourcedMetrics: [
        {
          claim:
            "README replay table, bge-small on CPU, target agreement 98%, 2,000 held-out rows: Banking77 71.9% local at 99.50% agreement (accuracy 78.5% Jev and 78.5% system). CLINC150 69.0% at 99.65% (90.1% / 90.1%). AG News 80.2% at 99.40% (88.7% / 88.7%). TweetEval sentiment 22.2% at 98.70% (64.2% / 64.5%). TweetEval offensive 24.1% at 98.80% (73.8% / 74.2%).",
          source: "github.com/tomerglick57/Jevstiller README Benchmark",
        },
        {
          claim:
            "README: a local Banking77 answer is about 15 ms p50 on CPU, about 20 times faster than Jev at about 300 ms p50. The proxy section, 16 vCPU and bge-small, says local answers are about 16 ms p50 and about 50 ms p99. A late September 2026 live run reached 70.7% local at 99.45% agreement.",
          source: "github.com/tomerglick57/Jevstiller README",
        },
        {
          claim:
            "README: over 100 random splits across the 5 tasks, the calibrated threshold exceeded the 2% budget once. The status example shows an audit rate of 2%. The README states plainly that agreement with the teacher is not accuracy.",
          source: "github.com/tomerglick57/Jevstiller README",
        },
        {
          claim:
            "Public GitHub repo tomerglick57/Jevstiller had 61 stars and 8 forks on 2026-10-05. PyPI jevstiller version is 0.4.0. Created 2026-09-21. Apache-2.0.",
          source: "GitHub and PyPI, 2026-10-05",
        },
      ],
    },
    howJevIsUsed:
      "Jevstiller learns a task, it does not memorize one input. The README groups jevcache with semantic caches that reuse answers to near-identical inputs, and says those caches do not learn to answer new inputs. Here a frozen sentence encoder (bge-small, base, or large) stores embeddings, and a numpy logistic regression fits Jev's distribution. An out-of-distribution gate sends unfamiliar text to Jev whatever the head says. The routing threshold is chosen on a held-out set with a Clopper-Pearson finite-sample bound at 95% confidence, strictest threshold first. The audit channel is the ongoing check. If it breaks the budget, the proxy falls back to Jev on its own. The README's closest cousin is stuntd, which also learns a local head and checks a slice of live traffic. Jevstiller's own comparison says it picks the threshold with a finite-sample bound, trains and promotes by itself, and identifies a question by its exact content. Distil Labs, named in that same section, trains a replacement model as a separate job. That is a different project from Distill, the Rust coding agent harness by Samuel Fajreldines. Non-Choice questions never get a local answer. Ops in the README: TOML config, jevstiller admin, Prometheus /metrics, a Docker image at ghcr.io/tomerglick57/jevstiller, and a Kubernetes manifest. The README marks the project Alpha.",
    keyFeatures: [
      "Drop-in proxy: TYPESAFE_BASE_URL=http://localhost:8080, callers keep their own API keys",
      "Student on bge embeddings, trained from Jev's full probability distribution",
      "target_agreement budget, Clopper-Pearson threshold, 2% audit, automatic fallback",
      "PyPI jevstiller 0.4.0, Docker tag 0.4.0, docs at jevstiller.pages.dev",
      "TOML config, admin CLI, Prometheus /metrics, backup, Kubernetes manifest",
    ],
    stack: [
      "Python 3.10+",
      "bge-small encoder",
      "TypeSafe Jev Choice",
      "Docker",
      "Prometheus",
    ],
    links: {
      website: "https://jevstiller.pages.dev",
      repo: "https://github.com/tomerglick57/Jevstiller",
      docs: "https://github.com/tomerglick57/Jevstiller/blob/main/README.md",
      demo: "https://jevstiller.pages.dev",
    },
    pricingNote:
      "Apache-2.0. PyPI package jevstiller 0.4.0. Forwarded calls still spend your TypeSafe key. Local answers run on your CPU or GPU. The README publishes no hosted price.",
    firstSeen: "2026-09-21",
    relatedSlugs: [
      "hyperspaceai-jevcache",
      "classifier-dev",
      "samuelfaj-distill",
      "mode-io-vllm-jev",
    ],
    relatedLearnSlugs: ["where-to-run-jev", "system-one"],
    faq: [
      {
        question: "Can I distill Jev Choice calls into a local model?",
        answer:
          "Yes, for a repeated Choice with a fixed label set. Jevstiller trains a student from Jev's answers, then serves the labels it is sure about. The README says this is a poor fit for changing class lists, non-text input, or volumes too small to collect a few thousand examples.",
      },
      {
        question: "How is Jevstiller different from jevcache?",
        answer:
          "The Jevstiller README puts jevcache with semantic caches that reuse an answer when the input is near-identical. Jevstiller fits a student so a new sentence can be answered locally. Identical-input replay is the job jevcache documents on its own page.",
      },
      {
        question: "Does agreement with Jev mean the label is correct?",
        answer:
          "Agreement with Jev means the student picked Jev's label. The README says that is separate from accuracy. If Jev is wrong, the student is wrong the same way. On Banking77 both sit at 78.5% against the dataset labels. The status report prints that note next to the agreement number.",
      },
      {
        question: "Does Jevstiller store my TypeSafe API key?",
        answer:
          "The README says each service keeps its own TYPESAFE_API_KEY. Jevstiller forwards the key and does not store it. Local answers are returned only for keys Jev has already accepted.",
      },
    ],
    metaTitle: "Jevstiller: proxy that distills Jev Choice calls",
    metaDescription:
      "Jevstiller proxies repeated Jev Choice calls and answers many repeats locally, up to 80% on stable label sets. Banking77: 71.9% local at 99.50% agreement.",
  },

  "raphaelmansuy-edgextract": {
    slug: "raphaelmansuy-edgextract",
    status: "published",
    problem:
      "Asking a chat model for a knowledge graph as JSON can look tidy and still be wrong, and the reply does not come with a cutoff you can defend.",
    targetUser:
      "People who already know the kinds of things and the legal links in their notes, and who want unsure links held for a person.",
    overview:
      "edgextract (github.com/raphaelmansuy/edgextract) turns markdown into a knowledge graph using an ontology you write and cutoffs you own. The ontology is YAML: types, relations with domain and range, and an optional gazetteer of names you already know. Code proposes the names. A local decision model answers one closed yes-or-no at a time. Anything it is unsure about goes to a review queue instead of the graph. This path uses Jev-style open models through Ollama, not hosted Jev. Raphael Mansuy's article says the measured models are tev1 and nimble, and that clef and clef-flash were not tested. Apache-2.0. Version 0.1.0 on crates.io, npm, and PyPI.",
    creator: {
      name: "Raphael Mansuy",
      handle: "raphaelmansuy",
      githubUrl: "https://github.com/raphaelmansuy",
    },
    jevUsage: {
      flowRole:
        "Closed yes-or-no, and a pick-one kind, on names and legal links. The ontology drops illegal pairs before any question is sent.",
      primitives: ["Choice", "Noul"],
      stateIn:
        "A sentence span plus one closed question: is this a name the ontology can hold, which kind is it, or does this legal link hold.",
      decisionOut:
        "A probability from Ollama POST /v1/systemone. Your cutoff then keeps the link, sends it to review, or drops it.",
      flowSteps: [
        "Split markdown into sentences with character offsets. Propose names from the gazetteer, markdown cues, and an optional GLiNER span finder.",
        "Type an unknown name with a yes-or-no, then a pick-one kind. Known names are a lookup.",
        "Drop pairs the ontology forbids, so an illegal link is never asked. Ask one yes-or-no per legal link type.",
        "Keep, review, or drop by cutoff. The model does not find a span and does not invent a type.",
      ],
      sourcedMetrics: [
        {
          claim:
            "README, CoNLL04, 288 test sentences, zero-shot, exact-span scoring: edgextract plus tev1 final run, Names F1 0.690 and Links F1 0.388. Mistral Small JSON, 0.643 and 0.330. SpERT trained on CoNLL04, 0.889 and 0.715. Links precision 0.41 versus 0.27 for the chat model. Wrong links kept: 218 versus 504.",
          source: "github.com/raphaelmansuy/edgextract README",
        },
        {
          claim:
            "README limits: cutoffs are not calibrated until you run edgextract calibrate. No coreference, and links do not cross sentences. The final CoNLL04 run kept 16 reversed links. The README says it claims nothing about hosted Jev calibration.",
          source: "github.com/raphaelmansuy/edgextract README Honest limits",
        },
        {
          claim:
            "docs/article/article.md: Ollama 0.35+ exposes POST /v1/systemone. The article says tev1 and nimble were measured, and clef and clef-flash were not tested. Python SystemOneClient defaults the model to nimble. The README says the published CoNLL04 run used tev1.",
          source: "github.com/raphaelmansuy/edgextract article and src/edgextract/systemone.py",
        },
        {
          claim:
            "Public GitHub repo raphaelmansuy/edgextract had 70 stars and 10 forks on 2026-10-05. crates.io, npm @raphael.mansuy/edgextract, and PyPI edgextract were all version 0.1.0. Apache-2.0.",
          source: "GitHub, crates.io, npm, and PyPI, 2026-10-05",
        },
      ],
    },
    howJevIsUsed:
      "Hosted TypeSafe Jev is not the runtime here. The Python client posts to Ollama at http://localhost:11434/v1/systemone. The library default model is nimble. The CoNLL04 number of record is tev1. The browser demo at raphaelmansuy.github.io/edgextract loads Tev1 ONNX on WebGPU, about a 1 GB download into the browser cache, and the README says no server of theirs sees your text. The demo defaults to Tev1 on WebGPU in the tab. The README says Ollama is one click away. A sample graph in the README keeps one wrong link on purpose (Acme acquired Northwind, while the text says invested in) so you can see why the review queue exists. The comparison that the README says matters is the zero-shot row: closed questions kept fewer wrong links than Mistral Small JSON, and a model trained on CoNLL04 still wins by a wide margin. Together's Tev1 recipe trains the model used for the published CoNLL04 run. The Bespoke Labs Nimble recipe is the open model behind the library default. Ollaya and vLLM Jev are other ways to serve open decision checkpoints. edgextract is the extractor that asks those models yes-or-no questions against an ontology you wrote.",
    keyFeatures: [
      "YAML ontology: types, relations with domain and range, optional gazetteer",
      "Rust crate, Python package, and npm WASM build, each at 0.1.0",
      "Browser demo on GitHub Pages and a Hugging Face Space",
      "Review queue for uncertain links. Export JSON, Cypher, or an HTML graph",
      "edgextract calibrate fits cutoffs on your labels. They start uncalibrated",
    ],
    stack: [
      "Rust",
      "Python",
      "TypeScript WASM demo",
      "Ollama 0.35+",
      "tev1 or nimble",
    ],
    links: {
      repo: "https://github.com/raphaelmansuy/edgextract",
      docs: "https://github.com/raphaelmansuy/edgextract/blob/master/docs/article/article.md",
      website: "https://raphaelmansuy.github.io/edgextract/",
      demo: "https://raphaelmansuy.github.io/edgextract/",
    },
    pricingNote:
      "Apache-2.0. crates.io, PyPI, and npm packages are 0.1.0. Local Ollama or the browser WebGPU demo. The default path does not call hosted Jev.",
    firstSeen: "2026-10-03",
    relatedSlugs: [
      "togethercomputer-tev1",
      "bespokelabsai-nimble",
      "ollaya-dev-ollaya",
      "mode-io-vllm-jev",
    ],
    relatedLearnSlugs: ["system-one", "where-to-run-jev"],
    faq: [
      {
        question: "How do you extract a knowledge graph with a decision model?",
        answer:
          "Write the kinds and the legal links in YAML. edgextract proposes names, drops pairs the ontology forbids, and asks one yes-or-no per legal link. Your cutoff keeps the link, sends it to review, or drops it. The README says the model never invents a type.",
      },
      {
        question: "Does edgextract call hosted Jev?",
        answer:
          "The README and article describe Ollama POST /v1/systemone with tev1 or nimble. The article says clef and clef-flash were not tested. The README says it makes no claim about hosted Jev calibration. The browser demo runs Tev1 ONNX on WebGPU.",
      },
      {
        question: "How does tev1 compare with a chat model on CoNLL04?",
        answer:
          "On 288 test sentences, zero-shot, the README reports edgextract plus tev1 at Names F1 0.690 and Links F1 0.388. Mistral Small JSON is 0.643 and 0.330. SpERT, trained on CoNLL04, is 0.889 and 0.715. Links precision is 0.41 versus 0.27, with 218 wrong links kept versus 504.",
      },
      {
        question: "What happens when the model is unsure?",
        answer:
          "The link goes to a review list instead of the graph. Cutoffs start uncalibrated. The README says to run edgextract calibrate on your own labels before you trust them. Direction can still flip: the final CoNLL04 run kept 16 reversed links.",
      },
    ],
    metaTitle: "edgextract: knowledge graph, Jev-style models",
    metaDescription:
      "edgextract turns markdown into a knowledge graph with Jev-style models on Ollama (tev1 or nimble). Unsure links go to review. CoNLL04 links F1 is 0.388.",
  },

  "eliot5566-jev-paper-radar": {
    slug: "eliot5566-jev-paper-radar",
    status: "published",
    problem:
      "A weekday arXiv listing is too long to read, and keyword alerts miss papers that use different words.",
    targetUser:
      "Researchers who will fork a repo, write their interests in plain English, and read a short list each morning.",
    overview:
      "Paper Radar (github.com/Eliot5566/JEV-Paper-Radar) asks Jev to score every new paper against interests you write. It then publishes the few that matter. You fork the repo and edit radar.toml. Add a TypeSafe key, or an OpenRouter key for typesafe/jev-1.13, and turn on Pages. GitHub Actions runs on weekdays at 02:00 UTC. You get a page, an RSS feed, and optional Slack, Discord, Telegram, or email digests. Every run keeps an audit trail in data/. A public set of radars is already up at eliot5566.github.io/JEV-Paper-Radar/public/. 1kpapers is a public atlas of about a thousand papers. Paper Radar is the fork-and-run daily triage.",
    creator: {
      name: "Eliot5566",
      handle: "Eliot5566",
      githubUrl: "https://github.com/Eliot5566",
    },
    jevUsage: {
      flowRole:
        "One call per paper: a Noul per interest and per exclusion, a Choice for paper type, and a Noul for whether code was released. Your code applies the thresholds.",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Title, abstract, and categories only. The README says author names and affiliations are left out.",
      decisionOut:
        "Per-interest probabilities. Your code combines them with max of weight times probability, or noisy-OR, into must-read, maybe, and near-miss bands.",
      flowSteps: [
        "Sources are deduped against the last 14 days. News near-duplicates are folded before Jev runs.",
        "One system call per paper sends every interest, exclusion, paper type, and code-released question together.",
        "Thresholds you set, or paper-radar calibrate fitted to thumbs-up and thumbs-down GitHub issues, place each paper in a band.",
        "An optional LLM writes a one-sentence TL;DR for the top 10 only. Jev does not write the sentence.",
      ],
      sourcedMetrics: [
        {
          claim:
            "README footnote, run on 2026-09-23: 50 papers in 5 seconds, 46,584 input tokens, $0.0020, 932 tokens per paper, model jev-1.13.0. The README scales that to about $0.06 a day for about 1,500 weekday papers, and says output tokens are free.",
          source: "github.com/Eliot5566/JEV-Paper-Radar README",
        },
        {
          claim:
            "README held-out Cochrane table: 4 reviews, 19,447 records, 127 eligible studies, 96.9% recall, 78.0% pooled work saved, $0.60. The README calls this the optimistic case, because those thresholds were fitted on the same judgments they are scored against. The 8 development reviews pooled 38% to 48%.",
          source: "github.com/Eliot5566/JEV-Paper-Radar README benchmark",
        },
        {
          claim:
            "README: Jev sees title, abstract, and categories. Interests combine with max of weight times probability, or noisy-OR. Screening mode uses a Noul per criterion. The tool is described as a second screener, not a replacement for a person.",
          source: "github.com/Eliot5566/JEV-Paper-Radar README",
        },
        {
          claim:
            "Public GitHub repo Eliot5566/JEV-Paper-Radar had 28 stars and 7 forks on 2026-10-05. MIT license. Created 2026-09-23. Python.",
          source: "GitHub repo metadata, 2026-10-05",
        },
      ],
    },
    howJevIsUsed:
      "Paper Radar follows the shape the README attributes to TypeSafe: one small question per interest, all of them in one call, then your code decides. Relevance defaults to the max of weight times the yes probability, so one strong interest is enough. noisy-OR is there when several weak matches should add up. Exclusions are their own Nouls, written as positive statements. paper-radar check warns about interests that ask for counts or dates, because the README says Jev does not count or compare dates. Calibration reads labels you leave as GitHub issues (radar-label) and reports Brier score, expected calibration error, and thresholds for a precision and recall target. Screening mode is a different command: every inclusion criterion has to hold, one exclusion vetoes the record, and the output is a PRISMA 2020 count block. 4 reviews the README says were never used while building the tool reproduced 96.9% of included studies and removed 78% of the reading, for $0.60. The README calls that the optimistic case, because the thresholds were fitted on the same judgments they are scored against. The development set did far worse, and about a third of new PubMed records have no abstract and are never auto-excluded. 1kpapers classifies a fixed atlas with DeepSeek summaries and one Jev topic Choice. Paper Radar is a weekday filter you fork, with feeds, calibration, and that screening benchmark. Public radars on the GitHub Pages site cover AI, agents, efficiency, robot learning, neuroscience, clinical AI, and a signal feed. The AI radar's feed.xml was live on 2026-10-05.",
    keyFeatures: [
      "radar.toml interests in plain English, weekdays at 02:00 UTC via GitHub Actions",
      "Page plus RSS. The README says Zotero can subscribe. Optional Slack, Discord, Telegram, or email",
      "Sources: arXiv, bioRxiv, medRxiv, PubMed, any RSS, Reddit, and Bluesky",
      "Thumbs on the page become GitHub issues. paper-radar calibrate fits your thresholds",
      "Screening mode with PRISMA 2020 counts and a Cochrane replay in the README",
    ],
    stack: [
      "Python",
      "GitHub Actions",
      "TypeSafe Jev or OpenRouter typesafe/jev-1.13",
      "GitHub Pages",
      "RSS",
    ],
    links: {
      website: "https://eliot5566.github.io/JEV-Paper-Radar/public/",
      demo: "https://eliot5566.github.io/JEV-Paper-Radar/public/",
      repo: "https://github.com/Eliot5566/JEV-Paper-Radar",
      docs: "https://github.com/Eliot5566/JEV-Paper-Radar/blob/main/README.md",
    },
    pricingNote:
      "MIT code. You pay the TypeSafe or OpenRouter key. The README's 50-paper run was $0.0020, and it estimates about $0.06 for a full weekday arXiv pass. paper-radar check estimates a profile before you spend.",
    firstSeen: "2026-09-23",
    relatedSlugs: ["nutlope-1kpapers", "junma11-medjev", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "How do you filter new arXiv papers with Jev each day?",
        answer:
          "Fork the repo, write one interest per idea in radar.toml, store TYPESAFE_API_KEY or OPENROUTER_API_KEY, and enable Pages. The README says Actions runs on weekdays at 02:00 UTC. Each paper gets one call: a Noul per interest and exclusion, a Choice for paper type, and a Noul for code released.",
      },
      {
        question: "How much does it cost to read all of arXiv?",
        answer:
          "The README's measured run on 2026-09-23 judged 50 papers in 5 seconds for $0.0020 (46,584 input tokens, 932 per paper, jev-1.13.0). It scales that to about $0.06 a day for about 1,500 weekday papers. Output tokens are described as free. Your own runs log cost in data/runs.jsonl.",
      },
      {
        question: "How is Paper Radar different from 1kpapers?",
        answer:
          "1kpapers is Hassan El Mghari's public atlas. A launch clip describes DeepSeek summaries plus one Jev Choice over about 1,018 papers. Paper Radar is a repo you fork. It triages new papers every weekday, publishes RSS, and includes a Cochrane screening benchmark.",
      },
      {
        question: "Can this screen a systematic review?",
        answer:
          "The README's screening command treats each criterion as a Noul and prints PRISMA 2020 counts. On 4 held-out Cochrane reviews it reports 96.9% recall and 78.0% pooled work saved across 19,447 records, for $0.60. The same section says it is a second screener, not a replacement, and that the thresholds were fitted on the judgments they are scored against. That is the optimistic case.",
      },
    ],
    metaTitle: "Paper Radar: daily arXiv triage with Jev",
    metaDescription:
      "Paper Radar scores each new arXiv paper with Jev and bands it must-read, maybe or near-miss. A 50-paper run cost $0.0020. Cochrane results are optimistic.",
  },

};
