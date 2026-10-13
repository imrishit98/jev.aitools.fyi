/**
 * Post-build guard: sitemap, robots, and canonical hygiene (SEO pass 5).
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
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
const alternativesSlugsMod = await vite.ssrLoadModule("/src/data/alternatives-slugs.ts");
const alternativesDataMod = await vite.ssrLoadModule("/src/data/alternatives.ts");
const alternativesHubMod = await vite.ssrLoadModule("/src/data/alternatives-hub.ts");
const alternativesSharedMod = await vite.ssrLoadModule("/src/data/alternatives-shared.ts");
const factSourcesMod = await vite.ssrLoadModule("/src/data/alternative-fact-sources.ts");
const textStatsMod = await vite.ssrLoadModule("/src/lib/alternative-text-stats.ts");
const contentDatesMod = await vite.ssrLoadModule("/src/lib/content-dates.ts");
const metricsJson = JSON.parse(
  readFileSync(join(root, "src/data/alternatives-metrics.json"), "utf8"),
);
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
const alternativesPageCount =
  1 + alternativesSlugsMod.alternativeSlugs.length; /* hub + per-alternative */
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
  alternativesPageCount +
  agentGuidePageCount; /* static hubs + categories + MFM demo + learn topics + laya hub + alternatives + agent guides */
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

async function verifyMfmCanonicalDemoResponseHeaders() {
  const { tryMfmDemoBarePathResponse, MFM_DEMO_CANONICAL_PATH } = mfmStaticMod;
  const demoUrl = new URL(MFM_DEMO_CANONICAL_PATH, "https://jev.aitools.fyi");
  const etag = '"verify-mfm-shell-etag"';
  const shellAssetHeaders = new Headers({
    "x-robots-tag": "noindex, follow",
    etag,
  });
  const htmlBody = "<!doctype html><html></html>";

  const fakeAsset =
    (status, body = null) =>
    async () =>
      new Response(body, { status, headers: shellAssetHeaders });

  const res304 = await tryMfmDemoBarePathResponse(
    new Request(demoUrl, { method: "GET" }),
    demoUrl,
    fakeAsset(304),
  );
  if (!res304 || res304.status !== 304) {
    return "MFM canonical demo: mock 304 asset must yield 304 response";
  }
  if (res304.headers.get("x-robots-tag")) {
    return "MFM canonical demo: 304 response must not include X-Robots-Tag";
  }
  if (res304.headers.get("etag") !== etag) {
    return "MFM canonical demo: 304 response must preserve ETag from asset";
  }
  if (res304.headers.get("content-type") !== "text/html; charset=utf-8") {
    return "MFM canonical demo: 304 response must set text/html content-type";
  }

  const res200 = await tryMfmDemoBarePathResponse(
    new Request(demoUrl, { method: "GET" }),
    demoUrl,
    fakeAsset(200, htmlBody),
  );
  if (!res200 || res200.status !== 200) {
    return "MFM canonical demo: mock 200 asset must yield 200 response";
  }
  if (res200.headers.get("x-robots-tag")) {
    return "MFM canonical demo: 200 GET must not include X-Robots-Tag";
  }
  if (res200.headers.get("content-type") !== "text/html; charset=utf-8") {
    return "MFM canonical demo: 200 GET must set text/html content-type";
  }
  const gotBody = await res200.text();
  if (gotBody !== htmlBody) {
    return "MFM canonical demo: 200 GET must pass through asset body";
  }

  const resHead = await tryMfmDemoBarePathResponse(
    new Request(demoUrl, { method: "HEAD" }),
    demoUrl,
    fakeAsset(200, htmlBody),
  );
  if (!resHead || resHead.status !== 200) {
    return "MFM canonical demo: mock 200 asset must yield 200 for HEAD";
  }
  if (resHead.headers.get("x-robots-tag")) {
    return "MFM canonical demo: 200 HEAD must not include X-Robots-Tag";
  }
  if (resHead.body !== null) {
    return "MFM canonical demo: 200 HEAD must have null body";
  }

  return null;
}

const mfmCanonicalHeaderErr = await verifyMfmCanonicalDemoResponseHeaders();
if (mfmCanonicalHeaderErr) {
  errors.push(mfmCanonicalHeaderErr);
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
if (!compareHtml.includes("Last verified:")) {
  errors.push("Laya compare missing last verified line from alternatives template");
}
if (!compareHtml.toLowerCase().includes("at a glance")) {
  errors.push("Laya compare missing alternatives comparison table");
}

const altHubHtml = readFileSync(join(distRoot, "alternatives.html"), "utf8");
if (!altHubHtml.includes("Jev alternatives: 11 decision models compared")) {
  errors.push("Alternatives hub H1 mismatch");
}
const hubRanked = alternativesHubMod.alternativesHub.ranked;
const expectedHubRows = alternativesSlugsMod.alternativeSlugs.length + 1;
if (hubRanked.length !== expectedHubRows) {
  errors.push(
    `alternatives hub row count: expected ${expectedHubRows}, got ${hubRanked.length}`,
  );
}
const itemListBlocks = [...altHubHtml.matchAll(/"@type":"ItemList"[^}]*"numberOfItems":(\d+)/g)];
const itemListCount = itemListBlocks.length
  ? Number(itemListBlocks[0][1])
  : -1;
if (itemListCount !== expectedHubRows) {
  errors.push(`alternatives hub ItemList count: expected ${expectedHubRows}, got ${itemListCount}`);
}
if (/\b10 decision models\b|\bten models\b|\btop 10\b/i.test(altHubHtml) && !/eleven|11 decision/i.test(altHubHtml)) {
  errors.push("alternatives hub still claims 10 models in body copy");
}
if (alternativesHubMod.alternativesHub.seoTitle.length > 54) {
  errors.push("alternatives hub seoTitle too long for branding");
}
if (alternativesHubMod.alternativesHub.seoDescription.length > 160) {
  errors.push("alternatives hub seoDescription too long");
}
if (alternativesHubMod.alternativesHub.seoTitle.includes("(2026)")) {
  errors.push("alternatives hub title must not include year");
}

function assertMetricsSnapshot(obj, pathPrefix) {
  if (obj && typeof obj === "object") {
    if ("checkedAt" in obj && !/^\d{4}-\d{2}-\d{2}$/.test(obj.checkedAt)) {
      errors.push(`${pathPrefix} checkedAt invalid`);
    }
    if ("sourceUrl" in obj && !obj.sourceUrl.startsWith("https://")) {
      errors.push(`${pathPrefix} missing sourceUrl`);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        assertMetricsSnapshot(v, `${pathPrefix}.${k}`);
      }
    }
  }
}
assertMetricsSnapshot(metricsJson.decisionIndex, "metrics.decisionIndex");
assertMetricsSnapshot(metricsJson.hostedPricingPerMInputUsd, "metrics.hostedPricing");
for (const [key, row] of Object.entries(metricsJson.pageLastVerified ?? {})) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row)) {
    errors.push(`metrics.pageLastVerified.${key} invalid date`);
  }
}
for (const slug of alternativesSlugsMod.alternativeSlugs) {
  if (!metricsJson.pageLastVerified?.[slug]) {
    errors.push(`metrics.pageLastVerified missing slug ${slug}`);
  }
}
if (!metricsJson.pageLastVerified?.hub || !metricsJson.pageLastVerified?.["laya-compare"]) {
  errors.push("metrics.pageLastVerified missing hub or laya-compare");
}
for (const [k, v] of Object.entries(metricsJson.decisionIndexFullScores)) {
  if (!v.checkedAt) errors.push(`metrics.decisionIndexFullScores.${k} missing checkedAt`);
}
for (const [k, v] of Object.entries(metricsJson.github)) {
  if (!v.checkedAt) errors.push(`metrics.github.${k} missing checkedAt`);
}
for (const [k, v] of Object.entries(metricsJson.huggingface)) {
  if (!v.checkedAt) errors.push(`metrics.huggingface.${k} missing checkedAt`);
}

const ALT_MIN_WORDS = 600;
const ALT_MIN_UNIQUE_SENTENCES = 20;
function countWords(html) {
  const $ = cheerio.load(html);
  const text = $("article").text().replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}
function countUniqueSentencesInArticle(html) {
  const $ = cheerio.load(html);
  const text = $("article").text().replace(/\s+/g, " ").trim();
  return textStatsMod.countUniqueSentences(text);
}

function lastmodFromSitemapXml(xml, locUrl) {
  const blocks = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)];
  for (const [, loc, lastmod] of blocks) {
    if (loc === locUrl) return lastmod;
  }
  return null;
}

const learnSitemapXml = readFileSync(join(distRoot, "sitemap-learn.xml"), "utf8");

function assertPageDates(label, canonicalUrl, lastVerified, html, slugForGuideDate) {
  if (!html.includes(`<time datetime="${lastVerified}">${lastVerified}</time>`)) {
    errors.push(`${label} Last verified must show ${lastVerified}`);
  }
  if (
    !html.includes(`"dateModified":"${lastVerified}"`) &&
    !html.includes(`"dateModified": "${lastVerified}"`)
  ) {
    errors.push(`${label} JSON-LD dateModified must equal ${lastVerified}`);
  }
  const lastmod = lastmodFromSitemapXml(learnSitemapXml, canonicalUrl);
  if (!lastmod) {
    errors.push(`${label} missing sitemap lastmod for ${canonicalUrl}`);
  } else if (lastmod !== lastVerified) {
    errors.push(`${label} sitemap lastmod ${lastmod} must equal lastVerified ${lastVerified}`);
  }
  if (slugForGuideDate) {
    const guideDay = contentDatesMod.alternativeGuideDate(slugForGuideDate);
    if (guideDay !== lastVerified) {
      errors.push(`${label} alternativeGuideDate ${guideDay} must equal lastVerified ${lastVerified}`);
    }
  }
}
function distFileForInternalHref(href) {
  const pathOnly = href.split("#")[0].split("?")[0];
  if (!pathOnly || pathOnly === "/") return join(distRoot, "index.html");
  const normalized = pathOnly.endsWith("/") ? pathOnly.slice(0, -1) : pathOnly;
  const asHtml = join(distRoot, `${normalized}.html`);
  if (existsSync(asHtml)) return asHtml;
  const nested = join(distRoot, normalized, "index.html");
  if (existsSync(nested)) return nested;
  return asHtml;
}
function assertInternalLinks(html, label) {
  const hrefs = [
    ...html.matchAll(/href="(\/(?:learn|alternatives|tools|apps|benchmarks|explore|guides|sdks)[^"#?]*)"/g),
  ].map((m) => m[1]);
  for (const href of hrefs) {
    const file = distFileForInternalHref(href);
    if (!existsSync(file)) {
      errors.push(`${label} broken internal link ${href} (expected ${file})`);
    }
  }
}
function assertOutboundRefs(html, label) {
  const $ = cheerio.load(html);
  $("a[href^='http']").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href || href.includes("jev.aitools.fyi")) return;
    if (href.includes("madbid.lol")) return;
    if (!href.includes("ref=jev.aitools.fyi")) {
      errors.push(`${label} external link missing outbound ref: ${href.slice(0, 96)}`);
    }
  });
}
function assertFactSources(slug, facts) {
  for (const fact of facts) {
    if (!fact.sourceUrl?.startsWith("https://")) {
      errors.push(`alternatives:${slug} fact missing sourceUrl: ${fact.row}`);
      continue;
    }
    if (factSourcesMod.isBareFactSource(fact.sourceUrl)) {
      errors.push(`alternatives:${slug} fact bare sourceUrl: ${fact.row} -> ${fact.sourceUrl}`);
    }
    if (
      slug !== "laya" &&
      factSourcesMod.isInvalidCompetitorFactSource(slug, fact, fact.sourceUrl)
    ) {
      errors.push(
        `alternatives:${slug} competitor fact cites TypeSafe root: ${fact.row} -> ${fact.sourceUrl}`,
      );
    }
    if (!fact.checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(fact.checkedAt)) {
      errors.push(`alternatives:${slug} fact missing checkedAt: ${fact.row}`);
    }
  }
}

if (alternativesSharedMod.alternativesLastVerified !== alternativesHubMod.alternativesHub.lastVerified) {
  errors.push("alternatives lastVerified mismatch between hub and shared snapshot");
}
if (!altHubHtml.includes('rel="canonical" href="https://jev.aitools.fyi/alternatives"')) {
  errors.push("Alternatives hub canonical mismatch");
}
const hubLastVerified = alternativesHubMod.alternativesHub.lastVerified;
assertPageDates(
  "alternatives hub",
  "https://jev.aitools.fyi/alternatives",
  hubLastVerified,
  altHubHtml,
  null,
);
if (contentDatesMod.alternativeHubDate() !== hubLastVerified) {
  errors.push("alternativeHubDate() must equal hub lastVerified");
}
assertInternalLinks(altHubHtml, "alternatives hub");
assertOutboundRefs(altHubHtml, "alternatives hub");
for (const row of alternativesHubMod.alternativesHub.ranked) {
  const file = distFileForInternalHref(row.pagePath);
  if (!existsSync(file)) {
    errors.push(`alternatives hub row link missing dist file: ${row.pagePath}`);
  }
}
if (!llms.includes("/alternatives")) {
  errors.push("llms.txt missing /alternatives hub");
}
for (const slug of alternativesSlugsMod.alternativeSlugs) {
  const alt = alternativesDataMod.getAlternative(slug);
  if (!alt) {
    errors.push(`alternatives data missing slug ${slug}`);
    continue;
  }
  if (alt.seoTitle.length > 54) {
    errors.push(`alternatives:${slug} seoTitle too long for branding (${alt.seoTitle.length})`);
  }
  if (alt.seoDescription.length > 160) {
    errors.push(`alternatives:${slug} seoDescription too long (${alt.seoDescription.length})`);
  }
  if (alt.seoTitle.includes("\u2014") || alt.seoDescription.includes("\u2014")) {
    errors.push(`alternatives:${slug} contains em dash in meta`);
  }
  const htmlPath = join(distRoot, `alternatives/${slug}.html`);
  const altHtml = readFileSync(htmlPath, "utf8");
  if (!locs.includes(`https://jev.aitools.fyi/alternatives/${slug}`)) {
    errors.push(`sitemap missing /alternatives/${slug}`);
  }
  if (!llms.includes(`/alternatives/${slug}`)) {
    errors.push(`llms.txt missing /alternatives/${slug}`);
  }
  if (!llms.includes(`/alternatives/${slug}.md`)) {
    errors.push(`llms.txt missing markdown twin /alternatives/${slug}.md`);
  }
  const canon = `https://jev.aitools.fyi/alternatives/${slug}`;
  if (!altHtml.includes(`href="${canon}"`)) {
    errors.push(`alternatives/${slug} canonical mismatch`);
  }
  if (altHtml.includes("\u2014") || altHtml.includes("\u2013")) {
    errors.push(`alternatives/${slug} HTML contains em or en dash`);
  }
  assertInternalLinks(altHtml, `alternatives/${slug}`);
  assertOutboundRefs(altHtml, `alternatives/${slug}`);
  assertFactSources(slug, alt.facts);
  if (altHtml.includes("aggregateRating") || altHtml.includes('"@type":"Review"')) {
    errors.push(`alternatives/${slug} must not include rating or review JSON-LD`);
  }
  const words = countWords(altHtml);
  if (words < ALT_MIN_WORDS) {
    errors.push(`alternatives/${slug} word count ${words} below ${ALT_MIN_WORDS}`);
  }
  const uniqueSentences = countUniqueSentencesInArticle(altHtml);
  if (uniqueSentences < ALT_MIN_UNIQUE_SENTENCES) {
    errors.push(
      `alternatives/${slug} unique sentence count ${uniqueSentences} below ${ALT_MIN_UNIQUE_SENTENCES}`,
    );
  }
  if (!altHtml.includes("not published")) {
    const expectsPlaceholder = alt.facts.some(
      (f) =>
        f.them?.toLowerCase().includes("not published") || f.jev?.toLowerCase().includes("not published"),
    );
    if (expectsPlaceholder) {
      errors.push(`alternatives/${slug} missing rendered not published placeholder`);
    }
  }
  assertPageDates(
    `alternatives/${slug}`,
    `https://jev.aitools.fyi/alternatives/${slug}`,
    alt.lastVerified,
    altHtml,
    slug,
  );
}
function collectCrossPageSentences(slug, text, ownersMap, minLen = 50) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/\s+/g, " ").trim().toLowerCase())
    .filter((s) => s.length > minLen);
  for (const sentence of sentences) {
    const owners = ownersMap.get(sentence) ?? new Set();
    owners.add(slug);
    ownersMap.set(sentence, owners);
  }
}
const crossPageSentenceOwners = new Map();
for (const slug of alternativesSlugsMod.alternativeSlugs) {
  const alt = alternativesDataMod.getAlternative(slug);
  if (!alt) continue;
  for (const section of alt.sections) {
    if (section.h === "Migrating from hosted Jev") continue;
    collectCrossPageSentences(slug, section.body, crossPageSentenceOwners);
  }
  for (const entry of alt.faq) {
    collectCrossPageSentences(slug, entry.answer, crossPageSentenceOwners);
  }
  for (const bullet of alt.whenChooseThem) {
    const normalized = bullet.replace(/\s+/g, " ").trim().toLowerCase();
    if (normalized.length <= 50) continue;
    const owners = crossPageSentenceOwners.get(normalized) ?? new Set();
    owners.add(slug);
    crossPageSentenceOwners.set(normalized, owners);
  }
}
const crossPageDupes = [...crossPageSentenceOwners.entries()].filter(
  ([, owners]) => owners.size >= 2,
);
if (crossPageDupes.length > 0) {
  const sample = crossPageDupes
    .slice(0, 3)
    .map(([sentence, owners]) => `${[...owners].join("+")}: ${sentence.slice(0, 72)}…`)
    .join("; ");
  errors.push(
    `alternatives cross-page duplicate prose (${crossPageDupes.length}): ${sample}`,
  );
}
const layaAlt = alternativesDataMod.getAlternative("laya");
if (layaAlt) {
  assertFactSources("laya", layaAlt.facts);
}
assertInternalLinks(compareHtml, "laya compare");
assertOutboundRefs(compareHtml, "laya compare");
const layaWords = countWords(compareHtml);
if (layaWords < ALT_MIN_WORDS) {
  errors.push(`laya compare word count ${layaWords} below ${ALT_MIN_WORDS}`);
}
const layaUnique = countUniqueSentencesInArticle(compareHtml);
if (layaUnique < ALT_MIN_UNIQUE_SENTENCES) {
  errors.push(`laya compare unique sentence count ${layaUnique} below ${ALT_MIN_UNIQUE_SENTENCES}`);
}
if (layaAlt) {
  assertPageDates(
    "laya compare",
    "https://jev.aitools.fyi/learn/laya-vs-jev/compare",
    layaAlt.lastVerified,
    compareHtml,
    null,
  );
  if (contentDatesMod.layaCompareLastVerified() !== layaAlt.lastVerified) {
    errors.push("layaCompareLastVerified() must equal laya compare lastVerified");
  }
}
if (compareHtml.includes("aggregateRating") || compareHtml.includes('"@type":"Review"')) {
  errors.push("laya compare must not include rating or review JSON-LD");
}
if (altHubHtml.includes("aggregateRating") || altHubHtml.includes('"@type":"Review"')) {
  errors.push("alternatives hub must not include rating or review JSON-LD");
}
if (!locs.includes("https://jev.aitools.fyi/alternatives")) {
  errors.push("sitemap missing /alternatives hub");
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
