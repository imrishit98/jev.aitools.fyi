import { categories } from "@/data/categories";
import type { AgentGuide } from "@/data/agent-guides-types";
import { itemHasDetailPage } from "@/lib/content-policy";
import { getItemBySlug } from "@/lib/items";
import { getItemPath } from "@/lib/item-paths";

export type DirectoryLink = { href: string; label: string };

function dedupe(links: DirectoryLink[]): DirectoryLink[] {
  const seen = new Set<string>();
  const out: DirectoryLink[] = [];
  for (const link of links) {
    const href = link.href.replace(/\/$/, "") || "/";
    if (seen.has(href)) continue;
    seen.add(href);
    out.push({ href, label: link.label });
  }
  return out;
}

function categoryLinks(slugs: string[]): DirectoryLink[] {
  return slugs.flatMap((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return [];
    return [{ href: `/categories/${cat.slug}`, label: cat.title }];
  });
}

function listingLinks(slugs: string[]): DirectoryLink[] {
  const links: DirectoryLink[] = [];
  for (const slug of slugs) {
    const item = getItemBySlug(slug);
    if (!item || !itemHasDetailPage(item)) continue;
    links.push({ href: getItemPath(item), label: item.title });
  }
  return links;
}

/** Listings and categories a high-traffic agent guide should point at. */
export function linksForAgentGuide(guide: AgentGuide): DirectoryLink[] {
  const categorySlugs =
    guide.slug === "browser-computer-use"
      ? ["browser-computer-use", "agent-tooling"]
      : ["agent-tooling"];
  const self = `/guides/jev-with-ai-agents/${guide.slug}`;
  return dedupe([
    { href: "/guides/jev-with-ai-agents", label: "All agent guides" },
    { href: "/learn/system-one", label: "System One primer" },
    ...categoryLinks(categorySlugs),
    ...listingLinks(guide.relatedCatalogSlugs),
  ]).filter((link) => link.href !== self);
}

const LAYA_LISTINGS = [
  "receptron-laya",
  "ollaya-dev-ollaya",
  "mizorewww-laya-coreml",
];

/** Listings and categories for the Laya vs Jev guides. */
export function linksForLayaGuide(slug: string): DirectoryLink[] {
  const self = `/learn/laya-vs-jev/${slug}`;
  return dedupe([
    { href: "/learn/laya-vs-jev", label: "Laya vs Jev hub" },
    { href: "/learn/laya-vs-jev/compare", label: "Laya vs Jev compared" },
    { href: "/learn/system-one", label: "System One primer" },
    { href: "/learn/jev-typesafe", label: "What Jev is" },
    ...categoryLinks(["benchmarks", "sdks"]),
    ...listingLinks(LAYA_LISTINGS),
  ]).filter((link) => link.href !== self);
}
