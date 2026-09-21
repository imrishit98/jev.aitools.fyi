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
      "Hosted zero-shot labels with Jev on the fast tier, 0.7 confidence escalation, and HTTP plus CLI surfaces. Sourced from the open classifier.dev Worker repository.",
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
        "TanStack ships decide() for typed choices, scores, and booleans so your agent loop stops cosplaying as a chatbot.",
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
      "Jev Social pairs TypeSafe Jev with the socai CLI. You state a research goal; each loop rebuilds a finite menu of read-only socai commands (search, open a discovered profile or post, read comments, optional TikTok download, inspect state, finish). Jev selects the next operation; socai executes in the user's Chrome and returns structured observations. The UI stores choice, confidence, command, summary, and timing per step, then compiles cards, tables, and an evidence report with source links.",
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
      "Jev never emits arbitrary shell or DOM coordinates. It only chooses among commands the app exposes, matching the Browser Use pattern of finite actions over structured state. Confidence and policy live in application code: sub-threshold or invalid picks are dropped before socai runs. The OpenRouter Decisions path supplies Jev access with bring-your-own-key configuration documented in the repository README. Step limits (--max-steps, default 12) bound cost while partial results remain honest when login walls or decision failures appear.",
    keyFeatures: [
      "Instagram, TikTok, and LinkedIn operation tables in README",
      "npx github:socai-io/jev-social onboard without cloning",
      "Loopback web UI at 127.0.0.1:8766 plus CLI search mode",
      "Per-step telemetry: choice, confidence, command, elapsed time",
      "Marketing site and GIF demos linked from repository",
    ],
    stack: [
      "Node 20+",
      "socai CLI (Chrome automation)",
      "TypeSafe Jev via OpenRouter",
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
      "Open source; OpenRouter Jev usage bills to your key. No mock fallback when Jev is unavailable.",
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
          "npx --yes github:socai-io/jev-social onboard then npx --yes github:socai-io/jev-social, or clone the repo and npm start per README. You need Node 20+, OpenRouter with Jev access, and socai CLI.",
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

};
