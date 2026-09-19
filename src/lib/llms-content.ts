import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { homeFaq } from "@/data/faq";
import { learnGuideSlugs, learnGuides } from "@/data/learn-guides";
import { jevSpecSheet } from "@/data/spec";
import { getDirectoryStats } from "@/lib/items";
import { siteConfig } from "@/lib/site";

export function generateLlmsTxt(): string {
  const stats = getDirectoryStats();
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `Canonical site: ${siteConfig.url}`,
    `Curator: Rishit Patel (@imrishit98) via ${siteConfig.parentBrand.name}`,
    `Affiliation: Independent directory. Not TypeSafe AI unless a listing is official.`,
    "",
    "## What this site is",
    "",
    "A curated, link-first index of the public Jev / System One ecosystem: TypeSafe SDKs, Vercel AI Gateway integrations, Jev MCP servers, agent tooling, demos, games, benchmarks, and guides.",
    "",
    `Listings indexed: ${stats.total}`,
    "",
    "## Jev spec (facts)",
    "",
    `- Model: ${jevSpecSheet.model} (${jevSpecSheet.version})`,
    `- Endpoint: ${jevSpecSheet.endpoint}`,
    `- Latency: ${jevSpecSheet.latency}`,
    `- Pricing: ${jevSpecSheet.pricing}`,
    `- Primitives: choice, score, noul`,
    "",
    "## Key URLs",
    "",
    `- Home: ${siteConfig.url}/`,
    `- Explore all listings: ${siteConfig.url}/explore`,
    `- Learn hub: ${siteConfig.url}/learn`,
    `- Submit a listing: ${siteConfig.url}/submit`,
    `- About / disclaimer: ${siteConfig.url}/about`,
    `- Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
    "## Listing detail URLs",
    "",
    "Detail pages use category paths, not `/items/`: `/sdks/{slug}`, `/tools/{slug}`, `/apps/{slug}`, `/games/{slug}`, `/benchmarks/{slug}`, `/guides/{slug}`. Explore-only listings have no on-site detail URL.",
    "",
    "## Learn guides",
    "",
    ...learnGuideSlugs.map(
      (slug) =>
        `- ${learnGuides[slug].title}: ${siteConfig.url}/learn/${slug}`,
    ),
    "",
    "## Categories",
    "",
    ...categories.map(
      (c) => `- ${c.title}: ${siteConfig.url}/categories/${c.slug}`,
    ),
    "",
    "## Collections (filtered explore)",
    "",
    ...collections.map(
      (c) => `- ${c.title}: ${siteConfig.url}${c.href}`,
    ),
    "",
    "## FAQ",
    "",
    ...homeFaq.flatMap((f) => [`### ${f.question}`, "", f.answer, ""]),
    "",
    "## Official TypeSafe links (external)",
    "",
    `- TypeSafe: ${siteConfig.typesafe.home}`,
    `- Docs: ${siteConfig.typesafe.docs}`,
    `- Playground: ${siteConfig.typesafe.playground}`,
    `- Vercel AI Gateway Jev: ${siteConfig.vercelGateway}`,
    "",
  ];
  return lines.join("\n");
}
