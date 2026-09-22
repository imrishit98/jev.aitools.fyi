/**
 * Post-build guard: sitemap, robots, and canonical hygiene (SEO pass 5).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const root = process.cwd();
const distRoot = join(root, "dist");
const require = createRequire(import.meta.url);

const viteEntry = require.resolve("vite", {
  paths: [require.resolve("astro")],
});
const { createServer } = await import(viteEntry);
const vite = await createServer({
  configFile: resolve(root, "astro.config.mjs"),
  resolve: { alias: { "@": resolve(root, "src") } },
  logLevel: "error",
});
const itemsMod = await vite.ssrLoadModule("/src/lib/items.ts");
const learnMod = await vite.ssrLoadModule("/src/data/learn-guides.ts");
const layaVsJevMod = await vite.ssrLoadModule("/src/data/laya-vs-jev-guides.ts");
const agentGuidesMod = await vite.ssrLoadModule("/src/data/agent-guides.ts");
const redirectsMod = await vite.ssrLoadModule("/src/lib/redirects.ts");
const sitemapMod = await vite.ssrLoadModule("/src/lib/sitemap-xml.ts");
await vite.close();

const stats = itemsMod.getDirectoryStats();
const learnTopicCount = learnMod.learnGuideSlugs.length;
const agentGuidePageCount =
  1 + agentGuidesMod.agentGuideSlugs.length; /* hub + per-agent */
const layaVsJevPageCount =
  1 + layaVsJevMod.layaVsJevGuideSlugs.length; /* hub + per-topic */
const expectedDetail = stats.detailPages;
const expectedCatalog = stats.total;

function readLocsFromFile(fileName) {
  const xml = readFileSync(join(distRoot, fileName), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const indexXml = readFileSync(join(distRoot, "sitemap.xml"), "utf8");
if (!indexXml.includes("<sitemapindex")) {
  throw new Error("sitemap.xml must be a sitemap index");
}

const childSitemaps = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
const expectedChildren = [
  "https://jev.aitools.fyi/sitemap-static.xml",
  "https://jev.aitools.fyi/sitemap-learn.xml",
  "https://jev.aitools.fyi/sitemap-guides.xml",
  "https://jev.aitools.fyi/sitemap-listings.xml",
];
for (const child of expectedChildren) {
  if (!childSitemaps.includes(child)) {
    throw new Error(`sitemap index missing child: ${child}`);
  }
}

const locs = childSitemaps.flatMap((url) => {
  const file = url.replace("https://jev.aitools.fyi/", "");
  return readLocsFromFile(file);
});

const expectedFromLib = sitemapMod.collectAllSitemapLocs();
if (locs.length !== expectedFromLib.length) {
  throw new Error(
    `sitemap URL count mismatch: dist ${locs.length}, lib ${expectedFromLib.length}`,
  );
}

const errors = [];

if (locs.some((l) => l.includes("/items"))) {
  errors.push("sitemap contains /items/ URLs");
}
if (locs.some((l) => l.includes("llms.txt"))) {
  errors.push("sitemap should not list llms.txt (non-HTML)");
}

const detailInSitemap = locs.filter(
  (l) =>
    /\/(sdks|tools|apps|games|benchmarks|guides)\//.test(l) &&
    !l.includes("/guides/jev-with-ai-agents"),
).length;
if (detailInSitemap !== expectedDetail) {
  errors.push(
    `sitemap detail URLs: expected ${expectedDetail}, got ${detailInSitemap}`,
  );
}

const staticExpected =
  11 +
  10 +
  1 +
  learnTopicCount +
  layaVsJevPageCount +
  agentGuidePageCount; /* static hubs + categories + MFM demo + learn topics + laya hub + agent guides */
if (locs.length !== staticExpected + expectedDetail) {
  errors.push(
    `sitemap total: expected ${staticExpected + expectedDetail}, got ${locs.length}`,
  );
}

const lastmods = childSitemaps.flatMap((url) => {
  const file = url.replace("https://jev.aitools.fyi/", "");
  const xml = readFileSync(join(distRoot, file), "utf8");
  return [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
});
const uniqueLastmods = new Set(lastmods);
if (uniqueLastmods.size < 3 && expectedDetail > 10) {
  errors.push(
    "sitemap lastmod values look too uniform (expected mixed content dates)",
  );
}

const robots = readFileSync(join(distRoot, "robots.txt"), "utf8");
if (!robots.includes("Allow: /")) {
  errors.push("robots.txt missing Allow: /");
}
if (!robots.includes("https://jev.aitools.fyi/sitemap.xml")) {
  errors.push("robots.txt missing sitemap URL");
}

function walkHtml(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkHtml(full, acc);
    else if (entry.endsWith(".html")) acc.push(full);
  }
  return acc;
}

for (const file of walkHtml(distRoot)) {
  const html = readFileSync(file, "utf8");
  const $ = cheerio.load(html);
  const canon = $('link[rel="canonical"]').attr("href") ?? "";
  const rel = file.replace(distRoot, "").replace(/\\/g, "/");
  if (!canon.startsWith("https://jev.aitools.fyi")) {
    errors.push(`canonical host mismatch: ${rel} -> ${canon}`);
  }
  if (canon.includes("/items/")) {
    errors.push(`canonical still uses /items/: ${rel}`);
  }
  const jsonLdBlocks = $('script[type="application/ld+json"]')
    .map((_, el) => $(el).html() ?? "")
    .get();
  for (const block of jsonLdBlocks) {
    if (block.includes("/items/")) {
      errors.push(`JSON-LD references /items/ on ${rel}`);
    }
  }
}

const llms = readFileSync(join(distRoot, "llms.txt"), "utf8");
if (llms.includes("\u2014")) {
  errors.push("llms.txt contains em dash");
}
if (!llms.includes(`Catalog listings (explore index): ${expectedCatalog}`)) {
  errors.push("llms.txt missing catalog count");
}
if (!llms.includes(`Detail pages (indexable HTML): ${expectedDetail}`)) {
  errors.push("llms.txt missing detail page count");
}

const openapiPath = join(distRoot, "openapi.json");
try {
  const openapi = JSON.parse(readFileSync(openapiPath, "utf8"));
  if (!openapi.openapi?.startsWith("3.")) {
    errors.push("openapi.json missing OpenAPI 3.x version");
  }
  if (!openapi.paths?.["/search-index.json"]) {
    errors.push("openapi.json missing /search-index.json path");
  }
} catch {
  errors.push("openapi.json missing or invalid JSON");
}

const publisherPath = join(distRoot, ".well-known/jev-directory.json");
const publisher = JSON.parse(readFileSync(publisherPath, "utf8"));
if (publisher.catalog_listings !== expectedCatalog) {
  errors.push(
    `jev-directory.json catalog_listings: expected ${expectedCatalog}, got ${publisher.catalog_listings}`,
  );
}
if (publisher.detail_pages !== expectedDetail) {
  errors.push(
    `jev-directory.json detail_pages: expected ${expectedDetail}, got ${publisher.detail_pages}`,
  );
}
if (publisher.url !== "https://jev.aitools.fyi") {
  errors.push("jev-directory.json url must be https://jev.aitools.fyi");
}

const redirects = readFileSync(join(distRoot, "_redirects"), "utf8");
if (!redirects.includes("/items /explore 301")) {
  errors.push("_redirects missing /items hub rule");
}
const redirectLines = redirects
  .split("\n")
  .filter((l) => l && !l.startsWith("#"));
const extraRedirectRules = redirectsMod.EXTRA_REDIRECT_RULES?.length ?? 1;
if (redirectLines.length !== expectedCatalog + extraRedirectRules) {
  errors.push(
    `_redirects line count: expected ${expectedCatalog + extraRedirectRules}, got ${redirectLines.length}`,
  );
}

if (errors.length) {
  console.error("SEO artifact verification failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `SEO artifacts OK: sitemap index + ${childSitemaps.length} child maps, ${locs.length} URLs (${expectedDetail} detail), catalog ${expectedCatalog}, redirects ${redirectLines.length}.`,
);
