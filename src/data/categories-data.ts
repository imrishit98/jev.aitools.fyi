import type { CategoryMeta } from "./types";

export const categories: CategoryMeta[] = [
  {
    slug: "official",
    title: "Official",
    description: "TypeSafe docs, SDKs, playground, and repos they actually maintain.",
    seoTitle: "Official TypeSafe Jev docs, SDKs, and playground links",
    seoDescription:
      "Canonical TypeSafe AI surfaces for Jev and System One: API docs, official SDKs, playground, and launch repos. Start here before community forks and wrappers.",
    intro:
      "Start here when you want the real API, not a fork with vibes. Docs, SDKs, playground, evals, and the manifesto. These links are the canonical source for endpoint shapes, pricing notes, and primitive definitions. When you compare latency or file a bug, cite TypeSafe surfaces first. This hub gathers every official entry we index so you can jump to docs.typesafe.ai or the playground without wading through community summaries.",
  },
  {
    slug: "sdks",
    title: "SDKs and clients",
    description:
      "Official JS and Python plus community ports. Typed questions in, probabilities out.",
    seoTitle: "Jev SDKs and clients: TypeScript, Python, and community ports",
    seoDescription:
      "Browse official and community SDKs that call POST /v1/systemone with typed Choice, Score, and Noul questions. Compare languages, stars, and install docs in one hub.",
    intro:
      "Same POST /v1/systemone contract, different syntax sugar. Official TypeScript and Python sit next to Go, Rust, Elixir, Java, .NET, and the long tail. SDK listings wrap Choice, Score, and Noul with idiomatic types and retries. Favor repos with recent commits and clear install docs. Community clients are not audited here: verify auth, errors, and version pins before production.",
  },
  {
    slug: "integrations",
    title: "Integrations",
    description:
      "Vercel AI Gateway, eve, LangChain, Postgres, Home Assistant, n8n, and platform glue.",
    seoTitle: "Jev integrations: Vercel AI Gateway, LangChain, and platforms",
    seoDescription:
      "Framework and platform glue that embeds TypeSafe Jev for routing, evals, and structured decisions. Find gateway routes, agents, and databases wired to System One.",
    intro:
      "Where Jev meets the stack you already run. Gateways, agents, databases, and home automation. These projects embed evaluate paths into the Vercel AI SDK, LangChain, or HA flows. Look for demos that show structured questions, not giant chat prompts. Gateway routes are great for prototypes; direct TypeSafe credentials may fit better at volume or with private networking.",
  },
  {
    slug: "agent-tooling",
    title: "Agent tooling",
    description:
      "Routers, MCP servers, compaction, review gates, guards, and skills for coding agents.",
    seoTitle: "Jev agent tooling: MCP servers, routers, and review gates",
    seoDescription:
      "Coding-agent accessories that use Jev to pick models, approve tool calls, compact context, and score diffs. Explore MCP servers and routers with documented latency budgets.",
    intro:
      "The Claude Code accessory aisle. Routers, compaction, MCP, guards, and reviewers that speak probability. Agent tooling usually sits on the hot path: picking models, approving tool calls, compacting context, or scoring diffs. Favor READMEs that document latency budgets and failure modes. MCP listings should expose tool schemas so you know what state hits Jev.",
  },
  {
    slug: "browser-computer-use",
    title: "Browser and computer use",
    description:
      "Ultrafast browser agents, extensions, voice control, and desktop automation.",
    seoTitle: "Jev browser and computer use: ultrafast agents and automation",
    seoDescription:
      "Browser Use ultrafast, extensions, voice control, and desktop loops where Jev chooses the next action over a finite catalog. See demos before you automate logged-in flows.",
    intro:
      "Click the right node, not the wrong paragraph. Browser Use ultrafast, voice browsers, OCR loops, and extensions. Computer-use listings treat UI state as structured input and actions as discrete choices. Demos are the fastest way to feel latency before you trust a loop on logged-in accounts. Read security notes: automation plus external APIs needs tight scopes and human confirmation for destructive steps.",
  },
  {
    slug: "applications",
    title: "Applications",
    description:
      "Shipped products: trading, moderation, analytics, triage, RAG verify, support pipelines.",
    seoTitle: "Jev applications: moderation, trading, triage, and pipelines",
    seoDescription:
      "Shipped products and serious demos that run System One Jev in production paths: trust and safety, trading, log triage, RAG verify, and support automation.",
    intro:
      "Things people run in production (or at least on mainnet demos). Moderation, trading, triage, rerankers. Application listings skew toward user-visible outcomes: blocked comments, routed tickets, approved refunds, verified citations. They are the best proof that System One patterns survive outside research repos. Check each README for deployment and data handling before you send real traffic.",
  },
  {
    slug: "games",
    title: "Games and sims",
    description:
      "Doom, Mario, chess, wikiracing, and sims where Jev picks the next move.",
    seoTitle: "Jev games and sims: Mario, chess, and live decision telemetry",
    seoDescription:
      "Playable games and research toys where each move is a typed Jev choice. Great for feeling System One latency before you wire the same primitives into billing or safety code.",
    intro:
      "Proof that System One is fun at parties. Arcade games, sims, and research toys with live decision telemetry. Games make latency and probability visible turn by turn. They teach Jev faster than a whitepaper. Prefer listings with playable demos or videos so you can sanity-check responsiveness on your network.",
  },
  {
    slug: "playgrounds",
    title: "Playgrounds",
    description:
      "Interactive demos and sandboxes for Choice, Score, and Noul in the browser.",
    seoTitle: "Jev playgrounds: live Choice, Score, and Noul demos",
    seoDescription:
      "Interactive sandboxes to paste state, run typed questions, and watch probabilities move. Ideal for skeptics, screenshots, and validating primitives before production gates.",
    intro:
      "Paste state, mash buttons, watch probabilities move. Demos for skeptics and screenshot collectors. Playgrounds help you validate primitive combos before Jev touches billing or safety code. Many entries are static sites or sandboxes: still valuable for learning even when they are not production services. Submit yours if it teaches a pattern we have not filed.",
  },
  {
    slug: "benchmarks",
    title: "Benchmarks",
    description:
      "Evals, open replicas, calibration studies, and comparison harnesses.",
    seoTitle: "Jev benchmarks and evals: calibration and open replicas",
    seoDescription:
      "Datasets, harnesses, and open replicas for comparing typed Jev decisions. Measure calibration and latency on your hardware before you pick a routing policy.",
    intro:
      "Measure twice, route once. Calibration papers, open replicas, and head-to-head rerank battles. Benchmark listings document datasets, baselines, and reproducible harnesses. Treat star counts as hints, not votes. Open replicas help you compare latency and calibration on your hardware before you pick a routing policy.",
  },
  {
    slug: "guides",
    title: "Articles and lists",
    description:
      "Directory taxonomy for launch posts, essays, and awesome-list listings. Not the agent how-to hub.",
    seoTitle: "Jev articles and lists: community write-ups in the catalog",
    seoDescription:
      "Catalog bucket for community essays, launch posts, and awesome lists indexed as listings. For agent setup walkthroughs use /guides; for System One primers use /learn.",
    intro:
      "This is a catalog category, not an editorial hub. Entries are single-link announcements, threads, and essays we index as listings. Many stay explore-only when the overview is too thin for a detail page. For LangChain, Cursor, and Copilot setup guides, open /guides. For Choice, Score, and Noul primers, open /learn.",
  },
];
