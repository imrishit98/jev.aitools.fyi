import { categories } from "@/data/categories";
import { learnGuideSlugs } from "@/data/learn-guides";
import { getItemsWithDetailPages } from "@/lib/items";
import { getItemPath } from "@/lib/item-paths";
import { absoluteUrl, parseItemLastModified } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateSitemapXml(): string {
  const buildTime = new Date();
  const entries: { loc: string; lastmod: Date; priority: number; changefreq: string }[] =
    [];

  const staticRoutes = [
    { path: "", priority: 1, changefreq: "daily" },
    { path: "/explore", priority: 0.9, changefreq: "daily" },
    { path: "/showcase", priority: 0.88, changefreq: "weekly" },
    { path: "/learn", priority: 0.85, changefreq: "weekly" },
    { path: "/submit", priority: 0.6, changefreq: "monthly" },
    { path: "/about", priority: 0.55, changefreq: "monthly" },
    { path: "/developers", priority: 0.62, changefreq: "monthly" },
  ];

  for (const r of staticRoutes) {
    entries.push({
      loc: absoluteUrl(r.path),
      lastmod: buildTime,
      priority: r.priority,
      changefreq: r.changefreq,
    });
  }

  for (const c of categories) {
    entries.push({
      loc: absoluteUrl(`/categories/${c.slug}`),
      lastmod: buildTime,
      priority: 0.75,
      changefreq: "weekly",
    });
  }

  for (const item of getItemsWithDetailPages()) {
    entries.push({
      loc: absoluteUrl(getItemPath(item)),
      lastmod: parseItemLastModified(item.updatedAt),
      priority: item.featured ? 0.65 : 0.55,
      changefreq: "monthly",
    });
  }

  for (const topic of learnGuideSlugs) {
    entries.push({
      loc: absoluteUrl(`/learn/${topic}`),
      lastmod: buildTime,
      priority: 0.8,
      changefreq: "monthly",
    });
  }

  const body = entries
    .map(
      (e) => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${e.lastmod.toISOString()}</lastmod>
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

export function generateRobotsTxt(): string {
  return `User-Agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;
}
