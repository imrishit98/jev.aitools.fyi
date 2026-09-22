import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/data/types";
import { agentGuideSlugs } from "@/data/agent-guides";
import { learnGuideSlugs } from "@/data/learn-guides";
import { layaVsJevGuideSlugs } from "@/data/laya-vs-jev-guides";
import { getItemsByCategory, getItemsWithDetailPages } from "@/lib/items";
import { getItemPath } from "@/lib/item-paths";
import { absoluteUrl, parseItemLastModified } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

export type SitemapUrl = {
  loc: string;
  lastmod: Date;
  priority: number;
  changefreq: string;
};

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatLastmod(date: Date): string {
  return date.toISOString();
}

/** Source file mtime for editorial routes (falls back to now). */
export function sourceLastModified(relativeFromSrc: string): Date {
  try {
    return statSync(join(srcRoot, relativeFromSrc)).mtime;
  } catch {
    return new Date();
  }
}

function categoryLastModified(slug: CategorySlug): Date {
  const items = getItemsByCategory(slug);
  let max = sourceLastModified("data/categories-data.ts");
  for (const item of items) {
    const d = parseItemLastModified(item.updatedAt);
    if (d.getTime() > max.getTime()) max = d;
  }
  return max;
}

function renderUrlset(entries: SitemapUrl[]): string {
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${formatLastmod(e.lastmod)}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(2)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

function renderSitemapIndex(sitemaps: { loc: string; lastmod: Date }[]): string {
  const body = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${xmlEscape(s.loc)}</loc>
    <lastmod>${formatLastmod(s.lastmod)}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

const STATIC_ROUTE_META: {
  path: string;
  priority: number;
  changefreq: string;
  source: string;
}[] = [
  { path: "", priority: 1, changefreq: "daily", source: "pages/index.astro" },
  { path: "/explore", priority: 0.9, changefreq: "daily", source: "pages/explore/index.astro" },
  { path: "/showcase", priority: 0.88, changefreq: "weekly", source: "pages/showcase/index.astro" },
  { path: "/learn", priority: 0.85, changefreq: "weekly", source: "pages/learn/index.astro" },
  { path: "/guides", priority: 0.84, changefreq: "weekly", source: "pages/guides/index.astro" },
  { path: "/submit", priority: 0.6, changefreq: "monthly", source: "pages/submit.astro" },
  { path: "/about", priority: 0.55, changefreq: "monthly", source: "pages/about.astro" },
  { path: "/contact", priority: 0.52, changefreq: "monthly", source: "pages/contact.astro" },
  { path: "/privacy", priority: 0.5, changefreq: "monthly", source: "pages/privacy.astro" },
  { path: "/developers", priority: 0.62, changefreq: "monthly", source: "pages/developers.astro" },
  { path: "/for-agents", priority: 0.58, changefreq: "monthly", source: "pages/for-agents.astro" },
];

export function generateSitemapStaticXml(): string {
  const entries: SitemapUrl[] = STATIC_ROUTE_META.map((r) => ({
    loc: absoluteUrl(r.path),
    lastmod: sourceLastModified(r.source),
    priority: r.priority,
    changefreq: r.changefreq,
  }));

  for (const c of categories) {
    entries.push({
      loc: absoluteUrl(`/categories/${c.slug}`),
      lastmod: categoryLastModified(c.slug),
      priority: 0.75,
      changefreq: "weekly",
    });
  }

  entries.push({
    loc: absoluteUrl("/demos/my-first-million/"),
    lastmod: sourceLastModified("../public/demos/my-first-million/index.html"),
    priority: 0.7,
    changefreq: "monthly",
  });

  return renderUrlset(entries);
}

export function generateSitemapLearnXml(): string {
  const learnMtime = sourceLastModified("data/learn-guides.ts");
  const layaMtime = sourceLastModified("data/laya-vs-jev-guides.ts");
  const entries: SitemapUrl[] = [
    ...learnGuideSlugs.map((topic) => ({
      loc: absoluteUrl(`/learn/${topic}`),
      lastmod: learnMtime,
      priority: 0.8,
      changefreq: "monthly",
    })),
    {
      loc: absoluteUrl("/learn/laya-vs-jev"),
      lastmod: layaMtime,
      priority: 0.85,
      changefreq: "monthly",
    },
    ...layaVsJevGuideSlugs.map((topic) => ({
      loc: absoluteUrl(`/learn/laya-vs-jev/${topic}`),
      lastmod: layaMtime,
      priority: 0.82,
      changefreq: "monthly",
    })),
  ];
  return renderUrlset(entries);
}

export function generateSitemapGuidesXml(): string {
  const agentMtime = sourceLastModified("data/agent-guides.ts");
  const entries: SitemapUrl[] = [
    {
      loc: absoluteUrl("/guides/jev-with-ai-agents"),
      lastmod: agentMtime,
      priority: 0.82,
      changefreq: "monthly",
    },
    ...agentGuideSlugs.map((agent) => ({
      loc: absoluteUrl(`/guides/jev-with-ai-agents/${agent}`),
      lastmod: agentMtime,
      priority: 0.8,
      changefreq: "monthly",
    })),
  ];
  return renderUrlset(entries);
}

export function generateSitemapListingsXml(): string {
  const entries: SitemapUrl[] = getItemsWithDetailPages().map((item) => ({
    loc: absoluteUrl(getItemPath(item)),
    lastmod: parseItemLastModified(item.updatedAt),
    priority: item.featured ? 0.65 : 0.55,
    changefreq: "monthly",
  }));
  return renderUrlset(entries);
}

export function generateSitemapIndexXml(): string {
  const parts = [
    {
      path: "/sitemap-static.xml",
      xml: generateSitemapStaticXml(),
    },
    {
      path: "/sitemap-learn.xml",
      xml: generateSitemapLearnXml(),
    },
    {
      path: "/sitemap-guides.xml",
      xml: generateSitemapGuidesXml(),
    },
    {
      path: "/sitemap-listings.xml",
      xml: generateSitemapListingsXml(),
    },
  ];

  const sitemaps = parts.map((p) => {
    const lastmods = [...p.xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(
      (m) => new Date(m[1]!),
    );
    const lastmod = lastmods.reduce(
      (max, d) => (d.getTime() > max.getTime() ? d : max),
      new Date(0),
    );
    return { loc: absoluteUrl(p.path), lastmod };
  });

  return renderSitemapIndex(sitemaps);
}

/** @deprecated Use generateSitemapIndexXml and child sitemaps. Kept for tests. */
export function generateSitemapXml(): string {
  return generateSitemapIndexXml();
}

export function collectAllSitemapLocs(): string[] {
  const xmls = [
    generateSitemapStaticXml(),
    generateSitemapLearnXml(),
    generateSitemapGuidesXml(),
    generateSitemapListingsXml(),
  ];
  return xmls.flatMap((xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!));
}

export function generateRobotsTxt(): string {
  return `User-Agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;
}
