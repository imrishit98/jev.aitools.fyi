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
const mfmStaticMod = await vite.ssrLoadModule("/src/lib/mfm-demo-static.ts");
await vite.close();

const mfmShellHeaderPaths = [
  mfmStaticMod.MFM_DEMO_HTML_ASSET_PATH,
  mfmStaticMod.MFM_DEMO_SHELL_PUBLIC_PATH,
];

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
  14 +
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
for (const day of lastmods) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    errors.push(`sitemap lastmod must be YYYY-MM-DD, got ${day}`);
    break;
  }
}
if (locs.some((l) => l.endsWith(".md") || l.includes("llms-full"))) {
  errors.push("sitemap should not list markdown alternates or llms-full.txt");
}

const robots = readFileSync(join(distRoot, "robots.txt"), "utf8");
if (!robots.includes("Allow: /")) {
  errors.push("robots.txt missing Allow: /");
}
if (!robots.includes("https://jev.aitools.fyi/sitemap.xml")) {
  errors.push("robots.txt missing sitemap URL");
}
for (const bot of [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
]) {
  if (!robots.includes(`User-agent: ${bot}`)) {
    errors.push(`robots.txt missing User-agent: ${bot}`);
  }
}
if (!robots.includes("llms-full.txt")) {
  errors.push("robots.txt missing llms-full.txt pointer");
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
  const robots = $('meta[name="robots"]').attr("content") ?? "";
  const canon = $('link[rel="canonical"]').attr("href") ?? "";
  const rel = file.replace(distRoot, "").replace(/\\/g, "/");
  const isNoindex = robots.includes("noindex");
  if (!isNoindex) {
    if (!canon.startsWith("https://jev.aitools.fyi")) {
      errors.push(`canonical host mismatch: ${rel} -> ${canon}`);
    }
  } else if (canon) {
    errors.push(`noindex page should omit canonical: ${rel} -> ${canon}`);
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
if (!llms.includes("/llms-full.txt")) {
  errors.push("llms.txt missing llms-full.txt link");
}
const mfmCanonical = "https://jev.aitools.fyi/demos/my-first-million";
if (!llms.includes(mfmCanonical)) {
  errors.push("llms.txt missing My First Million demo URL");
}
if (llms.includes(`${mfmCanonical}/`)) {
  errors.push("llms.txt must not use trailing slash on MFM demo URL");
}
if (!locs.includes(mfmCanonical)) {
  errors.push("sitemap missing MFM demo at canonical no-slash URL");
}
if (locs.includes(`${mfmCanonical}/`)) {
  errors.push("sitemap must not list MFM demo with trailing slash");
}
const mfmDemoHtml = join(distRoot, "demos/mfm-jev-search-shell.html");
try {
  const mfmHtml = readFileSync(mfmDemoHtml, "utf8");
  if (!mfmHtml.includes(`href="${mfmCanonical}"`)) {
    errors.push("MFM demo shell HTML canonical must be no-slash URL");
  }
} catch {
  errors.push("dist/demos/mfm-jev-search-shell.html missing");
}

const llmsFullPath = join(distRoot, "llms-full.txt");
const llmsFull = readFileSync(llmsFullPath, "utf8");
if (llmsFull.includes("\u2014") || llmsFull.includes("\u2013")) {
  errors.push("llms-full.txt contains an em or en dash");
}
if (!llmsFull.includes("Checked 2026-09-30")) {
  errors.push("llms-full.txt missing checked date");
}
if (!llmsFull.includes("quit faking a classifier")) {
  errors.push("llms-full.txt missing Hermes answer");
}
if (!llmsFull.includes("/.well-known/jev-directory.json")) {
  errors.push("llms-full.txt missing directory manifest");
}

const hermesHtml = readFileSync(
  join(distRoot, "guides/jev-with-ai-agents/hermes.html"),
  "utf8",
);
if (!hermesHtml.includes('aria-label="In the directory"')) {
  errors.push("Hermes guide missing directory link module");
}
if (!hermesHtml.includes("/guides/jev-with-ai-agents/hermes.md")) {
  errors.push("Hermes guide missing markdown alternate");
}
if (!hermesHtml.includes('"dateModified":"2026-09-30"')) {
  errors.push("Hermes Article JSON-LD missing dateModified");
}
if (!hermesHtml.includes("Jev with Hermes Agent: approvals and routing setup")) {
  errors.push("Hermes title was not rewritten");
}

const compareHtml = readFileSync(
  join(distRoot, "learn/laya-vs-jev/compare.html"),
  "utf8",
);
const compareTitle = compareHtml.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
if (compareTitle.includes("TypeSafe")) {
  errors.push("Laya compare title must not say TypeSafe");
}
if (!compareTitle.includes("Laya vs Jev: open weights or a hosted API")) {
  errors.push(`Laya compare title mismatch: ${compareTitle}`);
}
if (!compareHtml.includes('aria-label="In the directory"')) {
  errors.push("Laya compare missing directory link module");
}
const compareH1 = (compareHtml.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1] ?? "").trim();
if (compareH1 !== "Laya vs Jev: open weights or a hosted API") {
  errors.push(`Laya compare H1 mismatch: ${compareH1}`);
}
if (compareHtml.includes("TypeSafe's hosted release cycle")) {
  errors.push("Laya compare key point still names TypeSafe");
}
if (!compareHtml.includes("Using both is normal.")) {
  errors.push("Laya compare key point was not rewritten");
}

const homeHtml = readFileSync(join(distRoot, "index.html"), "utf8");
const homeTitle = (homeHtml.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").trim();
if (homeTitle !== "Jev tools directory: SDKs, agents, and demos") {
  errors.push(`Homepage title mismatch: ${homeTitle}`);
}
if (!homeHtml.includes("A curated map of Jev tools:")) {
  errors.push("Homepage description was not rewritten");
}

const copilotHtml = readFileSync(
  join(distRoot, "guides/jev-with-ai-agents/github-copilot-agent.html"),
  "utf8",
);
if (!copilotHtml.includes("GitHub Copilot Agent + Jev: MCP in VS Code")) {
  errors.push("Copilot guide title must stay unchanged");
}

const hermesH1 = (hermesHtml.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1] ?? "").trim();
if (hermesH1 !== "Jev with Hermes Agent") {
  errors.push(`Hermes H1 mismatch: ${hermesH1}`);
}
if (hermesH1.includes("Hermes Jev:")) {
  errors.push("Hermes H1 is keyword stuffed");
}

const omnijevHtml = readFileSync(
  join(distRoot, "guides/omnijev-awesome-jev.html"),
  "utf8",
);
const omnijevDesc =
  omnijevHtml.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
if (omnijevDesc.endsWith("Reading queue from.") || omnijevDesc.includes("Reading queue from")) {
  errors.push(`OmniJev description still chopped: ${omnijevDesc}`);
}
if (!omnijevHtml.includes("OmniJev: papers and evals behind Jev")) {
  errors.push("OmniJev title was not rewritten");
}

const learnPrimers = [
  "jev-typesafe",
  "system-one",
  "jev-vs-llm-classification",
  "vercel-ai-gateway",
  "where-to-run-jev",
  "use-cases",
];
for (const slug of learnPrimers) {
  const html = readFileSync(join(distRoot, `learn/${slug}.html`), "utf8");
  const faqPages = html.match(/"@type":"FAQPage"/g) ?? [];
  if (faqPages.length !== 1) {
    errors.push(`${slug} FAQPage JSON-LD count is ${faqPages.length}, expected 1`);
  }
  const questions = html.match(/"@type":"Question"/g) ?? [];
  if (questions.length !== 3) {
    errors.push(`${slug} FAQ question count is ${questions.length}, expected 3`);
  }
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
const extraRedirectRules =
  (redirectsMod.EXTRA_REDIRECT_RULES?.length ?? 1) + 1; /* trailing-slash catch-all */
const redirectFromPaths = redirectLines.map((l) => l.split(/\s+/)[0]);
const duplicateRedirectPaths = redirectFromPaths.filter(
  (path, index) => redirectFromPaths.indexOf(path) !== index,
);
if (duplicateRedirectPaths.length > 0) {
  errors.push(
    `_redirects duplicate source paths: ${[...new Set(duplicateRedirectPaths)].slice(0, 8).join(", ")}`,
  );
}
if (redirectLines.length !== expectedCatalog + extraRedirectRules) {
  errors.push(
    `_redirects line count: expected ${expectedCatalog + extraRedirectRules}, got ${redirectLines.length}`,
  );
}

function listMarkdownFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) listMarkdownFiles(full, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

let headersFile = "";
try {
  headersFile = readFileSync(join(distRoot, "_headers"), "utf8");
} catch {
  errors.push("dist/_headers missing");
}
const headerPaths = [...headersFile.matchAll(/^(\/\S+)$/gm)]
  .map((m) => m[1])
  .filter((path) => !path.startsWith("#"));
const duplicateHeaderPaths = headerPaths.filter(
  (path, index) => headerPaths.indexOf(path) !== index,
);
if (duplicateHeaderPaths.length > 0) {
  errors.push(`_headers duplicate paths: ${[...new Set(duplicateHeaderPaths)].join(", ")}`);
}
const allowedNonMdHeaderPaths = new Set(mfmShellHeaderPaths);
for (const path of headerPaths) {
  if (!path.endsWith(".md") && !allowedNonMdHeaderPaths.has(path)) {
    errors.push(`_headers has unexpected non-markdown path: ${path}`);
    break;
  }
}
for (const shellPath of mfmShellHeaderPaths) {
  const block = `${shellPath}\n  X-Robots-Tag: noindex, follow\n`;
  if (!headersFile.includes(block)) {
    errors.push(`_headers missing noindex rule for ${shellPath}`);
  }
}
const mdFiles = listMarkdownFiles(distRoot);
for (const file of mdFiles) {
  const mdPath = `/${file.slice(distRoot.length + 1).split("\\").join("/")}`;
  const htmlPath = mdPath.slice(0, -".md".length);
  const block = `${mdPath}\n  X-Robots-Tag: noindex, follow\n  Link: <https://jev.aitools.fyi${htmlPath}>; rel="canonical"\n  Content-Type: text/markdown; charset=utf-8\n`;
  if (!headersFile.includes(block)) {
    errors.push(`_headers missing rule for ${mdPath}`);
  }
}
const expectedHeaderRules = mdFiles.length + mfmShellHeaderPaths.length;
if (headerPaths.length !== expectedHeaderRules) {
  errors.push(
    `_headers rule count: expected ${expectedHeaderRules}, got ${headerPaths.length}`,
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
