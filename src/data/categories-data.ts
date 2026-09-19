import type { CategoryMeta } from "./types";

export const categories: CategoryMeta[] = [
  {
    slug: "official",
    title: "Official",
    description: "TypeSafe docs, SDKs, playground, and the stuff they actually maintain.",
    seoTitle: "Official Jev and TypeSafe Resources",
    seoDescription:
      "Documentation, SDKs, playground, and launch materials for TypeSafe AI Jev.",
    intro:
      "Start here if you want the real API, not a fork with vibes. Docs, SDKs, playground, evals, and the manifesto. Official pages are the canonical source for endpoint shapes, pricing notes, and primitive definitions. When you file an issue or compare latency numbers, cite these links rather than third-party summaries. This hub collects every TypeSafe-maintained entry we index so you can jump straight to docs.typesafe.ai or the playground without wading through community forks first.",
  },
  {
    slug: "sdks",
    title: "SDKs and clients",
    description:
      "Community clients for Go, Rust, Elixir, Java, .NET, and more. Typed questions in, probabilities out.",
    seoTitle: "Jev SDKs and Community Clients",
    seoDescription:
      "Community and official SDKs for calling TypeSafe Jev from your language.",
    intro:
      "Official JS and Python plus a whole alphabet of community ports. Same System One API, different syntax sugar. SDK listings here wrap POST /v1/systemone with idiomatic types, retries, and helpers for Choice, Score, and Noul batches. Prefer repos with recent commits and published install instructions. Community clients are not audited by this directory: verify auth, error handling, and version pins before production.",
  },
  {
    slug: "integrations",
    title: "Integrations",
    description:
      "Vercel AI Gateway, eve, LangChain, Postgres, Home Assistant, n8n, and platform glue.",
    seoTitle: "Jev Integrations and Platforms",
    seoDescription:
      "Framework integrations that embed Jev for routing, evals, and structured decisions.",
    intro:
      "Where Jev meets the stack you already run. Gateways, agents, databases, and home automation. Integrations listed here embed evaluate paths into frameworks like the Vercel AI SDK, LangChain, or home-assistant flows. Look for demos that show structured questions rather than open-ended chat prompts. Gateway routes are convenient for prototypes; direct TypeSafe credentials may fit better once volume or networking requirements grow.",
  },
  {
    slug: "agent-tooling",
    title: "Agent tooling",
    description:
      "Routers, MCP servers, compaction, review gates, guards, and skills for coding agents.",
    seoTitle: "Jev Agent Tooling and MCP",
    seoDescription:
      "Tools that use Jev to route models, gate tool calls, compact context, and review agent work.",
    intro:
      "The Claude Code accessory aisle. Routers, compaction, MCP, guards, and reviewers that speak probability. Agent tooling entries usually sit on the hot path of a coding agent: picking models, approving tool calls, compacting context, or scoring diffs. Favor projects that document latency budgets and failure modes. MCP listings should link server repos with explicit tool schemas so you know what state gets sent to Jev.",
  },
  {
    slug: "browser-computer-use",
    title: "Browser and computer use",
    description:
      "Ultrafast browser agents, extensions, voice control, and desktop automation.",
    seoTitle: "Jev Browser and Computer Use",
    seoDescription:
      "Browser automation where Jev picks actions instead of generating free-form text.",
    intro:
      "Click the right node, not the wrong paragraph. Browser Use ultrafast, voice control, OCR loops, and extensions. Computer-use listings treat UI state as structured input and actions as discrete choices. Demos are the fastest way to see latency before you trust a loop on production accounts. Read security notes carefully: browser automation plus external APIs needs tight scopes and human confirmation for destructive steps.",
  },
  {
    slug: "applications",
    title: "Applications",
    description:
      "Shipped products: trading, moderation, analytics, triage, RAG verify, support pipelines.",
    seoTitle: "Jev Applications and Products",
    seoDescription:
      "Real applications built on Jev for moderation, trading, log triage, and semantic pipelines.",
    intro:
      "Things people actually run in production (or at least on mainnet demos). Moderation, trading, triage, rerankers. Application listings skew toward user-visible outcomes: blocked comments, routed tickets, approved refunds, or verified citations. They are the best evidence that System One patterns survive outside research repos. Check each project's README for deployment requirements and data handling before you send real user traffic.",
  },
  {
    slug: "games",
    title: "Games and sims",
    description:
      "Doom, Mario, chess, wikiracing, and simulations where Jev makes the next move.",
    seoTitle: "Jev Games and Simulations",
    seoDescription:
      "Games powered by typed Jev choices, from Mario to autonomous drones.",
    intro:
      "Proof that System One is fun at parties. Arcade games, sims, and research toys with live decision telemetry. Games make latency and probability visible turn by turn. They are useful teaching tools even when you never ship a game. Prefer listings with playable demos or videos so you can sanity-check responsiveness on your network.",
  },
  {
    slug: "playgrounds",
    title: "Playgrounds",
    description:
      "Interactive demos and sandboxes for Choice, Score, and Noul in the browser.",
    seoTitle: "Jev Playgrounds and Live Demos",
    seoDescription:
      "Live playgrounds and demos for experimenting with TypeSafe Jev.",
    intro:
      "Paste state, click buttons, watch probabilities. Demos for skeptics and screenshot enthusiasts. Playgrounds help you validate primitive combinations before you wire Jev into billing or safety code. Many entries are static sites or Codesandbox links: still valuable for learning even when they are not production services. Submit your demo if it teaches a pattern missing here.",
  },
  {
    slug: "benchmarks",
    title: "Benchmarks",
    description:
      "Evals, open replicas, calibration studies, and comparison harnesses.",
    seoTitle: "Jev Benchmarks and Evals",
    seoDescription:
      "Benchmarks and open Jev replicas for typed decision models.",
    intro:
      "Measure twice, route once. Calibration papers, open replicas, and head-to-head rerank battles. Benchmark listings document datasets, baselines, and reproducible harnesses. Treat star counts as hints, not votes. Open replicas help you compare latency and calibration on your hardware before you pick a routing policy.",
  },
  {
    slug: "guides",
    title: "Guides and lists",
    description:
      "Launch posts, how-tos, essays, awesome lists, and community write-ups.",
    seoTitle: "Jev Guides and Essays",
    seoDescription:
      "Essays, tutorials, and lists about TypeSafe Jev and System One workflows.",
    intro:
      "Reading material for the curious. Awesome lists, threads, and essays from people who shipped. Guide entries are often announcements or essays with a single outbound link. Many stay explore-only without a detail page when the overview is too thin to index. Use them as reading lists, not as substitutes for official TypeSafe docs.",
  },
];
