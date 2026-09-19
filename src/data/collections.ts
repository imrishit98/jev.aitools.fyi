import type { CollectionLink } from "./types";

export const collections: CollectionLink[] = [
  {
    slug: "agents",
    title: "Best for coding agents",
    description:
      "Routers, compaction, MCP, guards. The stuff you bolt onto Claude Code before it goes feral.",
    href: "/explore?category=agent-tooling",
  },
  {
    slug: "mcp",
    title: "MCP servers",
    description:
      "Typed judgments as tools. For when your agent needs a verdict, not another paragraph.",
    href: "/explore?mcp=1",
  },
  {
    slug: "browser",
    title: "Browser and computer use",
    description:
      "Ultrafast clicks, voice browsers, OCR loops. Jev picks the action, not the essay.",
    href: "/explore?category=browser-computer-use",
  },
  {
    slug: "sdks",
    title: "SDKs and clients",
    description:
      "Official TypeScript and Python plus the community long tail in every language.",
    href: "/explore?category=sdks",
  },
  {
    slug: "games",
    title: "Games and sims",
    description:
      "Doom, Mario, chess, wikiracing. Proof that decisions beat dialogue.",
    href: "/explore?category=games",
  },
  {
    slug: "demos",
    title: "Live demos",
    description: "Try before you npm install. Filtered to listings with a live URL.",
    href: "/explore?demo=1",
  },
];
