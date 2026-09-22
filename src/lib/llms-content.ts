import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { homeFaq } from "@/data/faq";
import { agentGuideSlugs, agentGuides, agentGuidesHub } from "@/data/agent-guides";
import { learnGuideSlugs, learnGuides } from "@/data/learn-guides";
import {
  layaVsJevGuideSlugs,
  layaVsJevGuides,
  layaVsJevHub,
} from "@/data/laya-vs-jev-guides";
import { jevSpecSheet } from "@/data/spec";
import { getAllProductProfileSlugs } from "@/lib/product-profiles";
import { getDirectoryStats, getItemBySlug } from "@/lib/items";
import { getItemPath } from "@/lib/item-paths";
import { siteConfig } from "@/lib/site";

export function generateLlmsTxt(): string {
  const stats = getDirectoryStats();
  const lines: string[] = [
    `# ${siteConfig.hostnameBrand} (${siteConfig.name})`,
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
    `Catalog listings (explore index): ${stats.total}`,
    `Detail pages (indexable HTML): ${stats.detailPages}`,
    `Explore-only listings (no on-site detail URL): ${stats.indexOnly}`,
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
    `- Guides hub: ${siteConfig.url}/guides`,
    `- Submit a listing: ${siteConfig.url}/submit`,
    `- About / disclaimer: ${siteConfig.url}/about`,
    `- Contact: ${siteConfig.url}/contact`,
    `- Privacy policy: ${siteConfig.url}/privacy`,
    `- Developers / agents: ${siteConfig.url}/developers`,
    `- For agents (crawl map): ${siteConfig.url}/for-agents`,
    `- Sitemap index: ${siteConfig.url}/sitemap.xml (child maps: sitemap-static.xml, sitemap-learn.xml, sitemap-guides.xml, sitemap-listings.xml)`,
    `- OpenAPI (agent surface): ${siteConfig.url}/openapi.json`,
    `- JSON API errors: unknown /api/* routes return application/json (see OpenAPI)`,
    "",
    "## Product profiles (rich detail pages)",
    "",
    `SEO-rich product and project pages with FAQs, System One usage notes, and showcase embeds when clips exist: ${getAllProductProfileSlugs().length} listings.`,
    ...getAllProductProfileSlugs().map((slug) => {
      const item = getItemBySlug(slug);
      const title = item?.title ?? slug;
      const path = item ? getItemPath(item) : `/apps/${slug}`;
      return `- ${title}: ${siteConfig.url}${path}`;
    }),
    "",
    "## Listing detail URLs",
    "",
    "Detail pages use category paths, not `/items/`: `/sdks/{slug}`, `/tools/{slug}`, `/apps/{slug}`, `/games/{slug}`, `/benchmarks/{slug}`, `/guides/{slug}`. Explore-only listings link out to the author's site from Explore.",
    "",
    "Examples:",
    `- SDK: ${siteConfig.url}/sdks/typesafe-ai-typesafe-sdk-js`,
    `- Tool: ${siteConfig.url}/tools/vercel-eve`,
    `- App: ${siteConfig.url}/apps/browser-use-jev-ultrafast`,
    `- Game: ${siteConfig.url}/games/jev-arcade`,
    `- Benchmark: ${siteConfig.url}/benchmarks/iammrduncan-typesafe-ai-benchmark`,
    `- Guide: ${siteConfig.url}/guides/yibie-awesome-jev`,
    "",
    "## Learn guides",
    "",
    ...learnGuideSlugs.map(
      (slug) =>
        `- ${learnGuides[slug].title}: ${siteConfig.url}/learn/${slug}`,
    ),
    "",
    "## Laya vs Jev (open-weight local decisions)",
    "",
    `- ${layaVsJevHub.title} (hub): ${siteConfig.url}/learn/laya-vs-jev`,
    ...layaVsJevGuideSlugs.map(
      (slug) =>
        `- ${layaVsJevGuides[slug].title}: ${siteConfig.url}/learn/laya-vs-jev/${slug}`,
    ),
    "",
    "## Agent integration guides",
    "",
    `- ${agentGuidesHub.title} (hub): ${siteConfig.url}/guides/jev-with-ai-agents`,
    ...agentGuideSlugs.map(
      (slug) =>
        `- ${agentGuides[slug].title}: ${siteConfig.url}/guides/jev-with-ai-agents/${slug}`,
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
