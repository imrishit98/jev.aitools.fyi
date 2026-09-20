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
await vite.close();

const stats = itemsMod.getDirectoryStats();
const learnTopicCount = learnMod.learnGuideSlugs.length;
const expectedDetail = stats.detailPages;
const expectedCatalog = stats.total;

const xml = readFileSync(join(distRoot, "sitemap.xml"), "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const errors = [];

if (locs.some((l) => l.includes("/items"))) {
  errors.push("sitemap contains /items/ URLs");
}
if (locs.some((l) => l.includes("llms.txt"))) {
  errors.push("sitemap should not list llms.txt (non-HTML)");
}

const detailInSitemap = locs.filter((l) =>
  /\/(sdks|tools|apps|games|benchmarks|guides)\//.test(l),
).length;
if (detailInSitemap !== expectedDetail) {
  errors.push(
    `sitemap detail URLs: expected ${expectedDetail}, got ${detailInSitemap}`,
  );
}

const staticExpected =
  6 + 10 + learnTopicCount; /* home, explore, learn, submit, about, showcase + categories + learn topics */
if (locs.length !== staticExpected + expectedDetail) {
  errors.push(
    `sitemap total: expected ${staticExpected + expectedDetail}, got ${locs.length}`,
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
if (redirectLines.length !== expectedCatalog + 1) {
  errors.push(
    `_redirects line count: expected ${expectedCatalog + 1}, got ${redirectLines.length}`,
  );
}

if (errors.length) {
  console.error("SEO artifact verification failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `SEO artifacts OK: sitemap ${locs.length} URLs (${expectedDetail} detail), catalog ${expectedCatalog}, redirects ${redirectLines.length}.`,
);
