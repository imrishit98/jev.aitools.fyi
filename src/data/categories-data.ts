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
      "Start here if you want the real API, not a fork with vibes. Docs, SDKs, playground, evals, and the manifesto.",
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
      "Official JS and Python plus a whole alphabet of community ports. Same System One API, different syntax sugar.",
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
      "Where Jev meets the stack you already run. Gateways, agents, databases, and home automation.",
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
      "The Claude Code accessory aisle. Routers, compaction, MCP, guards, and reviewers that speak probability.",
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
      "Click the right node, not the wrong paragraph. Browser Use ultrafast, voice control, OCR loops, and extensions.",
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
      "Things people actually run in production (or at least on mainnet demos). Moderation, trading, triage, rerankers.",
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
      "Proof that System One is fun at parties. Arcade games, sims, and research toys with live decision telemetry.",
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
      "Paste state, click buttons, watch probabilities. Demos for skeptics and screenshot enthusiasts.",
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
      "Measure twice, route once. Calibration papers, open replicas, and head-to-head rerank battles.",
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
      "Reading material for the curious. Awesome lists, threads, and essays from people who shipped.",
  },
];
