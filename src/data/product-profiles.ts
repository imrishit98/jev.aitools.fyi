import type { LearnGuideSlug } from "@/data/learn-guides";

export type ProductProfileFaq = {
  question: string;
  answer: string;
};

export type ProductProfile = {
  slug: string;
  problem: string;
  audience: string;
  whatItIs: string;
  howJevIsUsed: string;
  keyFeatures: string[];
  stack: string[];
  pricingNote?: string;
  demoIds?: string[];
  relatedSlugs?: string[];
  relatedLearnSlugs?: LearnGuideSlug[];
  faq?: ProductProfileFaq[];
  metaTitle?: string;
  metaDescription?: string;
};

export function getProductProfile(slug: string): ProductProfile | undefined {
  return productProfilesBySlug[slug];
}

export function measureProductProfileBodyChars(slug: string): number {
  const profile = getProductProfile(slug);
  if (!profile) return 0;
  const chunks = [
    profile.problem,
    profile.audience,
    profile.whatItIs,
    profile.howJevIsUsed,
    ...(profile.keyFeatures ?? []),
    ...(profile.stack ?? []),
    profile.pricingNote ?? "",
    ...(profile.faq ?? []).flatMap((f) => [f.question, f.answer]),
  ];
  return chunks.join(" ").trim().length;
}

export const productProfilesBySlug: Record<string, ProductProfile> = {
  "classifier-dev": {
    slug: "classifier-dev",
    problem:
      "Teams still route moderation, support, and analytics labels through chat models that return prose instead of thresholdable scores. That makes golden tests brittle and latency unpredictable when you only needed a yes or no on a fixed label set.",
    audience:
      "Product engineers shipping classifiers in Node, Python, or browser apps who want HTTP-first labels without maintaining their own fine-tuned models.",
    whatItIs:
      "classifier.dev is a hosted zero-shot text classification API. You send plain text and a label list; the service returns calibrated probabilities per label. A fast tier runs on System One Jev; a smart tier re-asks when confidence drops below 0.7 so borderline rows still get a second pass.",
    howJevIsUsed:
      "The fast path issues parallel Choice and Score questions over your label dimensions through POST /v1/systemone semantics. Jev returns vectors your code can threshold, not strings you have to parse. The smart tier only escalates when the fast tier is uncertain, which keeps cost down on easy rows while preserving accuracy on edge cases.",
    keyFeatures: [
      "HTTP classify endpoint with multi-label and dimension support",
      "Fast Jev tier plus smart re-ask tier below 0.7 confidence",
      "Free tier that does not require an API key for light experimentation",
      "Companion MCP server for agent workflows (see classifier.dev MCP listing)",
      "Documentation aimed at production gates, not notebook demos",
    ],
    stack: ["TypeSafe System One", "Hosted HTTP API", "MCP (separate listing)"],
    pricingNote:
      "Public docs describe a free tier for experimentation and paid usage for volume. Confirm current limits on classifier.dev before you wire billing alerts.",
    demoIds: [],
    relatedSlugs: [
      "classifier-dev-mcp",
      "browser-use-jev-ultrafast",
      "hemanth-pkg-gate",
    ],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "When should I use classifier.dev instead of calling Jev directly?",
        answer:
          "Call Jev directly when you own the question schema and hosting. Use classifier.dev when you want a stable HTTP surface, built-in label dimensions, and a smart tier that re-asks without you writing the escalation logic.",
      },
      {
        question: "Does the fast tier always stay on Jev?",
        answer:
          "The product is marketed around Jev on the fast tier with a smart tier for low-confidence rows. Read the live docs for the exact routing rules before you depend on them in compliance workflows.",
      },
      {
        question: "Is there an MCP integration?",
        answer:
          "Yes. The classifier.dev MCP listing in this directory exposes classify_texts and related tools over streamable HTTP for agents.",
      },
    ],
    metaTitle: "classifier.dev: hosted Jev classification API",
    metaDescription:
      "Zero-shot text labels over HTTP with a fast Jev tier and smart re-ask tier. Free experiments, MCP for agents, and thresholdable scores for moderation and analytics.",
  },
  "classifier-dev-mcp": {
    slug: "classifier-dev-mcp",
    problem:
      "Agents need classification tools that return structured probabilities, not markdown tables buried in chat transcripts.",
    audience:
      "Agent authors using MCP clients who want classify_texts, dimensions, and multi-label helpers without bespoke HTTP glue in every repo.",
    whatItIs:
      "The classifier.dev MCP server exposes the same classification product through streamable HTTP tools. Agents can call classify_texts, work with dimensions, and search docs from a single MCP setup page.",
    howJevIsUsed:
      "Under the hood the service uses the same System One fast and smart tiers as the HTTP API. MCP is transport; Jev still produces the probability vectors your agent code thresholds.",
    keyFeatures: [
      "Streamable HTTP MCP with setup docs on classifier.dev",
      "Multi-label and dimension aware classify_texts",
      "Free tier without an API key for light agent experiments",
      "Pairs with the main classifier.dev HTTP product",
    ],
    stack: ["MCP", "TypeSafe System One", "classifier.dev API"],
    pricingNote: "Matches classifier.dev tiers. See classifier.dev/mcp-setup for current limits.",
    relatedSlugs: ["classifier-dev", "kushwho-jev-codes"],
    relatedLearnSlugs: ["jev-typesafe", "use-cases"],
    faq: [
      {
        question: "Do I need both the HTTP API and MCP?",
        answer:
          "No. Pick MCP for agent hosts or HTTP for services. They target the same classification backend.",
      },
      {
        question: "Where do I configure tools?",
        answer:
          "Follow classifier.dev/mcp-setup for streamable HTTP URLs and tool names. The directory listing links there as the demo entry point.",
      },
    ],
    metaTitle: "classifier.dev MCP: Jev tools for agents",
    metaDescription:
      "Streamable HTTP MCP for classify_texts and dimensions on classifier.dev. System One probabilities for agent moderation, routing, and analytics gates.",
  },
  "browser-use-jev-ultrafast": {
    slug: "browser-use-jev-ultrafast",
    problem:
      "Full LLM loops on every browser click are too slow and too expensive for interactive automation on real sites.",
    audience:
      "Teams building computer-use agents who already use Browser Use and want a reference hybrid where structured decisions pick DOM targets.",
    whatItIs:
      "Jev Ultrafast is the Browser Use team's integration pattern where Jev chooses the browser operation and DOM target in one shot. A small language model only appears when the flow actually needs typing.",
    howJevIsUsed:
      "Each step frames the next action as a Choice over a finite action catalog with DOM snapshot state. Jev scores candidates quickly enough for flight search and similar demos to finish in single-digit seconds with sub-cent inference cost in public clips.",
    keyFeatures: [
      "Hybrid Jev plus tiny LLM architecture documented in the ultrafast repo",
      "Pairs with browser-use.com demos and the broader Browser Use stack",
      "Featured showcase clip: flight search in about seven seconds",
      "Reference for computer-use category listings in this directory",
    ],
    stack: ["Browser Use", "TypeSafe System One", "Python", "DOM automation"],
    demoIds: ["browser-ultrafast-gregpr07", "computer-use-speed-savboj"],
    relatedSlugs: ["rtrvr-ai", "vercel-eve", "tamaratran-fast-jev-compaction"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is this a separate product from Browser Use?",
        answer:
          "It is an integration repo and pattern within the Browser Use ecosystem. Start from the GitHub repo for install steps and the browser-use.com site for hosted context.",
      },
      {
        question: "When does the LLM run?",
        answer:
          "Public demos emphasize Jev for clicks and navigation while typing-heavy steps invoke a smaller LLM. Read the repo README for the exact split in your version pin.",
      },
    ],
    metaTitle: "Browser Use Jev Ultrafast: hybrid computer-use agent",
    metaDescription:
      "Jev picks browser ops and DOM targets; a tiny LLM types when needed. Browser Use ultrafast pattern with showcase flight-search demo and sub-second decisions.",
  },
  "vercel-eve": {
    slug: "vercel-eve",
    problem:
      "Agent frameworks often bolt evaluation onto chat transcripts, which makes gates hard to test and expensive to run on every tool result.",
    audience:
      "TypeScript teams building on Vercel's agent stack who want typed evaluate paths instead of ad-hoc rubric parsing.",
    whatItIs:
      "eve is Vercel's open agent framework. It wires Jev into the experimental evaluate path so scoring stays structured alongside the rest of the agent runtime.",
    howJevIsUsed:
      "Evaluate flows send structured state and question schemas to System One, returning probabilities you can assert in tests. That keeps eval hooks parallel to production Jev gates instead of forking a separate LLM judge stack.",
    keyFeatures: [
      "Open source agent framework with Jev as default eval model in experimental paths",
      "TypeScript-first ergonomics aligned with Vercel AI workflows",
      "Live demo at eve.dev plus GitHub source",
      "Featured integration in this directory",
    ],
    stack: ["TypeScript", "Vercel eve", "TypeSafe System One"],
    demoIds: [],
    relatedSlugs: ["tanstack-ai-decide", "browser-use-jev-ultrafast"],
    relatedLearnSlugs: ["vercel-ai-gateway", "system-one"],
    faq: [
      {
        question: "Is eve official TypeSafe software?",
        answer:
          "eve is a Vercel open source project that integrates Jev. TypeSafe builds System One; Vercel maintains eve. Check each repo's license and support channels separately.",
      },
      {
        question: "Where is the evaluate path documented?",
        answer:
          "Start at eve.dev and the GitHub README for the experimental evaluate API in your pinned version.",
      },
    ],
    metaTitle: "Vercel eve: agent framework with Jev evaluate path",
    metaDescription:
      "Vercel eve ships Jev on the experimental evaluate path for typed agent scoring. TypeScript framework, eve.dev demo, and structured System One probabilities.",
  },
  "tamaratran-fast-jev-compaction": {
    slug: "tamaratran-fast-jev-compaction",
    problem:
      "Long agent threads blow token budgets because naive compaction summarizes everything with another LLM call.",
    audience:
      "Claude Code users who want compaction that asks whether each tool result is still worth keeping instead of blindly truncating context.",
    whatItIs:
      "fast-jev-compaction is a Claude Code plugin that replaces the default compaction summary with parallel Jev decisions. Tool calls and results are scored in one fast request; stale rows drop out while important evidence stays.",
    howJevIsUsed:
      "Compaction issues Score and Choice style questions over each context chunk. Jev returns keep-or-drop style probabilities so the plugin can trim history without a generative summary pass on the entire trace.",
    keyFeatures: [
      "Claude Code plugin install from the GitHub repo",
      "Parallel scoring of tool results instead of one big LLM summary",
      "Showcase clip: instant context compaction on long threads",
      "Popular reference in agent-tooling collections",
    ],
    stack: ["Claude Code", "TypeScript", "TypeSafe System One"],
    demoIds: ["context-compaction-tamarajtran"],
    relatedSlugs: ["browser-use-jev-ultrafast", "kushwho-jev-codes"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does this replace Claude's built-in compaction?",
        answer:
          "The plugin overrides the compaction step with Jev decisions per the README. Confirm compatibility with your Claude Code version before rolling out team-wide.",
      },
      {
        question: "Will I lose tool outputs I still need?",
        answer:
          "The design intent is to drop low-value rows while keeping high-scoring evidence. Tune thresholds using your own traces before trusting it on production incidents.",
      },
    ],
    metaTitle: "fast-jev-compaction: Jev scoring for Claude Code context",
    metaDescription:
      "Claude Code plugin that compacts agent context with parallel Jev keep-or-drop decisions instead of one LLM summary. GitHub repo plus showcase demo.",
  },
  "hemanth-pkg-gate": {
    slug: "hemanth-pkg-gate",
    problem:
      "npm install scripts can run unexpected lifecycle code before you have a chance to review intent.",
    audience:
      "JavaScript developers who want a pre-install gate that judges package intent with structured scores instead of regex on package names alone.",
    whatItIs:
      "pkg-gate is a pre-install security gate that uses TypeSafe System One to judge whether a package install matches developer intent before scripts run.",
    howJevIsUsed:
      "Install flows send structured metadata and intent questions to Jev. The gate thresholds probabilities to block, allow, or prompt on suspicious lifecycle scripts with low latency suitable for CLI hooks.",
    keyFeatures: [
      "Pre-install hook focused on lifecycle script risk",
      "Interactive demo site on hemanth.github.io/pkg-gate",
      "Showcase clip under pkg-gate id in the demo grid",
      "Zero dependency ethos emphasized in builder marketing",
    ],
    stack: ["Node.js", "npm hooks", "TypeSafe System One"],
    demoIds: ["pkg-gate-gnumanth"],
    relatedSlugs: ["kushwho-jev-codes", "classifier-dev"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Does pkg-gate replace npm audit?",
        answer:
          "It targets intent on install scripts, not CVE databases. Use it as an additional gate, not a full supply-chain scanner.",
      },
      {
        question: "Can I run it in CI?",
        answer:
          "Read the GitHub README for non-interactive modes and how Jev thresholds map to exit codes.",
      },
    ],
    metaTitle: "pkg-gate: Jev pre-install npm security gate",
    metaDescription:
      "Intent-aware npm install gate powered by TypeSafe System One. Block risky lifecycle scripts before they run, with a live demo and showcase clip.",
  },
  "devagrawal09-jev-review": {
    slug: "devagrawal09-jev-review",
    problem:
      "Single giant LLM code reviews are slow, expensive, and hard to regression-test across teams.",
    audience:
      "Teams experimenting with local review dashboards and staged merge gates that ask many small Jev questions per diff.",
    whatItIs:
      "jev-review is a staged code-review workflow and local dashboard built with TypeSafe Jev. It focuses on parallel questions on diffs instead of one monolithic review prompt.",
    howJevIsUsed:
      "The dashboard batches Choice and Score questions on files and hunks, surfacing pass-fail style signals you can wire into CI. Probabilities are stable enough to snapshot in tests compared to free-form LLM prose.",
    keyFeatures: [
      "Local dashboard for review stages",
      "Parallel Jev questions per diff",
      "Open source GitHub repo",
      "Related showcase clips on merge gates",
    ],
    stack: ["TypeScript", "TypeSafe System One", "GitHub Actions friendly workflows"],
    demoIds: ["code-review-gate-kunal"],
    relatedSlugs: ["kushwho-jev-codes", "magic-jev-ball"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "How is this different from jev-codes?",
        answer:
          "jev-review emphasizes a local dashboard and staged workflow. jev-codes focuses on YAML standards packs for agent diffs. Many teams prototype in jev-review and codify rules in jev-codes.",
      },
      {
        question: "Does it require cloud Jev?",
        answer:
          "Follow the repo for how it authenticates to System One and whether local gateways are supported in your pin.",
      },
    ],
    metaTitle: "jev-review: parallel Jev code review dashboard",
    metaDescription:
      "Staged code review workflow with parallel System One questions on diffs. Open source dashboard for merge gates without one LLM essay per file.",
  },
  "ploy-ai": {
    slug: "ploy-ai",
    problem:
      "Marketing teams run too many full A/B programs just to test headlines and layouts for different visitor segments.",
    audience:
      "Growth engineers and founders using AI-native site builders who want per-segment copy and layout without standing up a separate experimentation stack for every page.",
    whatItIs:
      "Ploy is an AI-native site builder that personalizes funnel content per visitor. Public demos show Jev picking headline, layout, and copy for each segment in about twenty-five milliseconds.",
    howJevIsUsed:
      "Visitor context and variant catalogs feed Choice questions that pick the best matching block per session. Jev handles the discrete selection step so the product avoids open-ended generation for every layout decision.",
    keyFeatures: [
      "Segment-aware headline and layout selection",
      "Sub-100ms decision clips on the showcase",
      "Product home at ploy.ai",
      "Featured homepage demo card",
    ],
    stack: ["Ploy platform", "TypeSafe System One", "Web personalization"],
    demoIds: ["ploy-jev-websites-bryantchou"],
    relatedSlugs: ["classifier-dev", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Do I still need traditional A/B testing?",
        answer:
          "Ploy markets faster per-segment decisions with Jev. You may still want analytics validation on conversions; treat clips as product behavior, not your final experiment design.",
      },
      {
        question: "Where do I sign up?",
        answer:
          "Start at ploy.ai linked from this listing and the showcase card.",
      },
    ],
    metaTitle: "Ploy: Jev-personalized marketing sites",
    metaDescription:
      "AI site builder using Jev to pick headline, layout, and copy per visitor segment in milliseconds. ploy.ai product with showcase demo.",
  },
  "rtrvr-ai": {
    slug: "rtrvr-ai",
    problem:
      "Browser agents often require API keys and expensive per-step LLM calls before a user can replay a simple recorded task.",
    audience:
      "Builders evaluating free-tier browser agents who want Jev on routing hot paths while LLMs handle planning.",
    whatItIs:
      "rtrvr.ai is a browser agent product that emphasizes recorded tasks and approachable onboarding. Showcase clips highlight Jev shaving time on routing inside the loop while the LLM still authors the plan.",
    howJevIsUsed:
      "Routing and tool selection steps use structured Jev decisions over finite action sets. That keeps interactive replay responsive compared to asking a large model to re-derive every micro-decision.",
    keyFeatures: [
      "Product home at rtrvr.ai",
      "Showcase demo on agent routing",
      "Positioned as free browser agent entry point in builder marketing",
      "Pairs with other browser-computer-use listings",
    ],
    stack: ["Browser automation", "TypeSafe System One", "Agent planner LLM"],
    demoIds: ["rtrvr-jev-bkalisetty"],
    relatedSlugs: ["browser-use-jev-ultrafast", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "where-to-run-jev"],
    faq: [
      {
        question: "Is rtrvr.ai the same as Browser Use Ultrafast?",
        answer:
          "No. Ultrafast is a Browser Use integration repo. rtrvr.ai is a separate product domain with its own onboarding story. Compare both demos if you are shopping for computer-use patterns.",
      },
      {
        question: "Do I need my own Jev API key?",
        answer:
          "Check rtrvr.ai docs for how inference is hosted. The directory only indexes public builder claims from the showcase clip.",
      },
    ],
    metaTitle: "rtrvr.ai: browser agent with Jev routing",
    metaDescription:
      "Free-tier browser agent product using Jev on routing while LLMs plan steps. rtrvr.ai home plus showcase demo on recorded tasks.",
  },
  "kushwho-jev-codes": {
    slug: "kushwho-jev-codes",
    problem:
      "Agent-generated diffs are hard to gate with one holistic LLM review that changes tone every run.",
    audience:
      "Teams defining YAML standards packs and wanting merge opinions that stay testable across repos.",
    whatItIs:
      "jev-codes points Jev at a pull request diff and a YAML standards pack. It emits structured merge guidance based on parallel questions instead of a single narrative review.",
    howJevIsUsed:
      "Each rule in the standards pack maps to System One questions on hunks and files. Developers threshold probabilities to block merges or request human review when agents touch protected areas.",
    keyFeatures: [
      "YAML standards packs for reusable rules",
      "GitHub-focused workflow in the public repo",
      "Showcase clip: standards gate on real diffs",
      "Complements jev-review and Magic Jev Ball demos",
    ],
    stack: ["TypeScript", "GitHub", "TypeSafe System One", "YAML rules"],
    demoIds: ["jev-codes-kushwho"],
    relatedSlugs: ["devagrawal09-jev-review", "magic-jev-ball"],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Where is the source?",
        answer:
          "The kushwho/jev-codes GitHub repository linked from this listing is the canonical open source entry.",
      },
      {
        question: "Can agents write the YAML?",
        answer:
          "Teams typically author standards deliberately, then let agents propose diffs against them. Treat YAML as versioned policy, not generated chatter.",
      },
    ],
    metaTitle: "jev-codes: YAML standards gate with Jev",
    metaDescription:
      "Open source diff gate that runs parallel System One questions against YAML standards packs. GitHub repo and showcase demo for agent merge opinions.",
  },
  "tanstack-ai-decide": {
    slug: "tanstack-ai-decide",
    problem:
      "Frontend and full-stack teams want typed agent decisions in TypeScript without maintaining raw System One HTTP clients in every app.",
    audience:
      "Developers already using TanStack libraries who plan to add AI features with structured decide() calls.",
    whatItIs:
      "TanStack AI is TanStack's AI SDK. The decide() API exposes Choice, Score, and boolean style paths so agent loops stay structured in TypeScript.",
    howJevIsUsed:
      "decide() routes typed questions to System One semantics documented on tanstack.com. You keep TanStack ergonomics while Jev returns probabilities suitable for thresholds in UI and server code.",
    keyFeatures: [
      "Official TanStack AI docs and GitHub repo",
      "decide() helper for typed choices and scores",
      "Launch clip on X featured on the homepage showcase",
      "Integration listing in this directory",
    ],
    stack: ["TanStack AI", "TypeScript", "TypeSafe System One"],
    demoIds: ["tanstack-ai-decide-tanstack"],
    relatedSlugs: ["vercel-eve", "classifier-dev"],
    relatedLearnSlugs: ["vercel-ai-gateway", "jev-typesafe"],
    faq: [
      {
        question: "Is decide() only for browsers?",
        answer:
          "TanStack AI targets both client and server TypeScript environments. Read tanstack.com/ai for the runtimes your version supports.",
      },
      {
        question: "How does this relate to @typesafe-ai/sdk?",
        answer:
          "The official TypeSafe SDK is the low-level client. TanStack AI is an integration layer with TanStack idioms. Many teams use both in different parts of a monorepo.",
      },
    ],
    metaTitle: "TanStack AI decide(): typed Jev in TypeScript",
    metaDescription:
      "TanStack AI decide() exposes Choice, Score, and boolean paths over System One. Official docs, GitHub repo, and homepage showcase clip.",
  },
  "your-signal": {
    slug: "your-signal",
    problem:
      "Feed ranking products often send your reading habits to opaque clouds just to label relevance.",
    audience:
      "Privacy-conscious users experimenting with local feed scoring and BYOK configuration.",
    whatItIs:
      "Your Signal is a builder project that scores posts already on your screen against personal rules. The showcase clip stresses local operation with bring-your-own-key setup and no telemetry guilt trip in marketing copy.",
    howJevIsUsed:
      "Posts in view become state for Score questions against user-authored rules. Jev returns ranked probabilities locally so the UI can highlight or hide items without a generative rewrite of each post.",
    keyFeatures: [
      "Local feed scoring story in the showcase clip",
      "BYOK configuration emphasized by the author",
      "Open source positioning in builder marketing",
      "Listed with launch post as primary link until a stable product URL ships",
    ],
    stack: ["TypeSafe System One", "Local client", "BYOK"],
    demoIds: ["your-signal-fabioangela79"],
    relatedSlugs: ["classifier-dev", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "where-to-run-jev"],
    faq: [
      {
        question: "Where is the download?",
        answer:
          "This directory links the public launch post on X from the showcase. Follow the author for repository or store links when they publish a canonical URL.",
      },
      {
        question: "Does it upload my feed text?",
        answer:
          "The showcase messaging claims local scoring. Verify the latest build from the author before trusting it with sensitive accounts.",
      },
    ],
    metaTitle: "Your Signal: local Jev feed scoring",
    metaDescription:
      "Local feed ranking with System One scores against your rules. BYOK, privacy-forward builder demo, and showcase clip on Your Signal.",
  },
  "magic-jev-ball": {
    slug: "magic-jev-ball",
    problem:
      "Merge buttons too often trust a single LLM vibe check that is hard to replay in CI.",
    audience:
      "Developers who want a memorable demo of merge gates that bounce bad diffs with visible Jev judgments.",
    whatItIs:
      "Magic Jev Ball is a playful code-review gate demo where Jev acts as the merge referee. The showcase positions it as a beach-ball metaphor for blocking risky diffs.",
    howJevIsUsed:
      "Parallel questions run on each diff hunk. The UI surfaces pass or fail style signals from Jev probabilities before a merge button unlocks, teaching structured review without a wall of LLM text.",
    keyFeatures: [
      "High-energy demo on the homepage showcase grid",
      "Teaching pattern for merge gates",
      "Pairs with jev-review and jev-codes listings",
      "Launch post linked as primary URL until a repo is published",
    ],
    stack: ["TypeSafe System One", "Code review UX"],
    demoIds: ["magic-jev-ball-acharyaagamya"],
    relatedSlugs: ["devagrawal09-jev-review", "kushwho-jev-codes"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is Magic Jev Ball production software?",
        answer:
          "Treat it as a demo pattern first. Use jev-review or jev-codes repos when you need installable tooling today.",
      },
      {
        question: "Where is the source code?",
        answer:
          "The listing links the public X post from the showcase. Watch that thread for repository announcements.",
      },
    ],
    metaTitle: "Magic Jev Ball: playful Jev merge gate demo",
    metaDescription:
      "Showcase demo of a merge gate that uses System One judgments before you ship agent-written diffs. Launch clip plus related review tooling listings.",
  },
};
