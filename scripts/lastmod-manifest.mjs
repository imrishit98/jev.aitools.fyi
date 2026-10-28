/**
 * Content-hash manifest for sitemap lastmod.
 *
 * --check  Compare current source hashes to src/data/lastmod-manifest.json.
 *          Exit 1 on drift. Also exit 1 when a raw item updatedAt is later
 *          than the UTC day. Does not call git. Does not use the clock as a lastmod.
 * --write  Update hashes. A changed or new URL gets the UTC day of this run.
 *          Unchanged URLs keep their stored date. Removed URLs are pruned.
 *          /privacy, /terms, and /your-privacy-choices keep the legal.ts ISO date.
 * --seed   Full clone only. Write hashes plus historical dates. Aborts when
 *          `git rev-parse --is-shallow-repository` is true. Never called by build.
 *          Refuses the UTC day of the run.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "src/data/lastmod-manifest.json");
const require = createRequire(import.meta.url);
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const VOLATILE_KEYS = new Set(["updatedAt"]);

const CARD_CHROME = [
  "src/components/item-card.tsx",
  "src/components/item-badges.tsx",
  "src/components/creator-credit.tsx",
];
const DEMO_CHROME = [
  "src/components/demo-card.tsx",
  "src/components/demo-lightbox.tsx",
  "src/components/share-menu.tsx",
];

/** Page file, local copy components, and data files. Records are added in staticRecords. */
const STATIC_TEMPLATES = {
  "/": [
    "src/pages/index.astro",
    "src/components/home-sections.tsx",
    "src/components/home-faq.tsx",
    "src/components/featured-rail.tsx",
    "src/components/sponsors.tsx",
    "src/components/audience-switch.tsx",
    "src/data/faq.ts",
    "src/data/sponsors.ts",
    ...DEMO_CHROME,
    ...CARD_CHROME,
  ],
  "/explore": [
    "src/pages/explore/index.astro",
    "src/components/explore-app.tsx",
    ...CARD_CHROME,
  ],
  "/showcase": ["src/pages/showcase/index.astro", ...DEMO_CHROME],
  "/learn": ["src/pages/learn/index.astro"],
  "/guides": ["src/pages/guides/index.astro"],
  "/submit": ["src/pages/submit.astro", "src/components/submit-form.tsx"],
  "/about": ["src/pages/about.astro"],
  "/contact": ["src/pages/contact.astro"],
  "/privacy": ["src/pages/privacy.astro", "src/lib/legal.ts"],
  "/privacy/archive": ["src/pages/privacy/archive.astro"],
  "/terms": ["src/pages/terms.astro", "src/lib/legal.ts"],
  "/your-privacy-choices": [
    "src/pages/your-privacy-choices.astro",
    "src/lib/legal.ts",
    "src/components/privacy-choices-panel.tsx",
  ],
  "/developers": ["src/pages/developers.astro"],
  "/for-agents": ["src/pages/for-agents.astro", "src/components/audience-switch.tsx"],
  "/demos/my-first-million": ["public/demos/mfm-jev-search-shell.html"],
};

/** Issue #119 evidence. These paths are at least this day. */
const ISSUE_LASTMOD = {
  "/": "2026-10-17",
  "/learn/laya-vs-jev": "2026-10-17",
  "/learn/jev-typesafe": "2026-10-17",
  "/tools/realzachi-pg-jev": "2026-10-17",
  "/tools/dzhng-jevgrep": "2026-10-17",
  "/tools/jaredpalmer-kev": "2026-10-17",
  "/sdks/langchain-ai-langchain-typesafe": "2026-10-17",
};

let allowGit = false;

function git(args) {
  if (!allowGit) {
    throw new Error("git is only available while seeding lastmod history");
  }
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
}

function assertFullClone() {
  const out = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  }).trim();
  if (out === "true") {
    console.error(
      "lastmod seed aborted: this clone is shallow. Git dates would be wrong for every file.",
    );
    process.exit(1);
  }
}

function later(a, b) {
  if (!a) return b ?? null;
  if (!b) return a;
  return a > b ? a : b;
}

function sanitize(value) {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) return value.map((entry) => sanitize(entry));
  if (typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (VOLATILE_KEYS.has(key)) continue;
      const child = value[key];
      if (typeof child === "function" || child === undefined) continue;
      out[key] = sanitize(child);
    }
    return out;
  }
  return null;
}

function sha256(value) {
  const json = JSON.stringify(sanitize(value));
  return createHash("sha256").update(json).digest("hex");
}

function readRepoFile(relPath) {
  return readFileSync(join(root, relPath), "utf8").replace(/\r\n/g, "\n");
}

function pathFromLoc(loc) {
  const pathname = new URL(loc).pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

function loadPrevious() {
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("manifest must be an object");
    }
    return parsed;
  } catch (error) {
    if (error && error.code === "ENOENT") return {};
    throw error;
  }
}

function serialize(entries) {
  const sorted = {};
  for (const path of Object.keys(entries).sort()) {
    sorted[path] = {
      hash: entries[path].hash,
      lastmod: entries[path].lastmod,
    };
  }
  return `${JSON.stringify(sorted, null, 2)}\n`;
}

async function loadSources() {
  const viteEntry = require.resolve("vite", {
    paths: [require.resolve("astro")],
  });
  const { createServer } = await import(viteEntry);
  const vite = await createServer({
    configFile: resolve(root, "astro.config.mjs"),
    resolve: { alias: { "@": resolve(root, "src") } },
    logLevel: "error",
  });
  try {
    const sitemap = await vite.ssrLoadModule("/src/lib/sitemap-xml.ts");
    const itemsMod = await vite.ssrLoadModule("/src/lib/items.ts");
    const itemPaths = await vite.ssrLoadModule("/src/lib/item-paths.ts");
    const learn = await vite.ssrLoadModule("/src/data/learn-guides.ts");
    const laya = await vite.ssrLoadModule("/src/data/laya-vs-jev-guides.ts");
    const agents = await vite.ssrLoadModule("/src/data/agent-guides.ts");
    const alternatives = await vite.ssrLoadModule("/src/data/alternatives.ts");
    const categories = await vite.ssrLoadModule("/src/data/categories.ts");
    const categoryEnrichment = await vite.ssrLoadModule("/src/lib/category-enrichment.ts");
    const profiles = await vite.ssrLoadModule("/src/data/product-profiles.ts");
    const enrichment = await vite.ssrLoadModule("/src/lib/listing-enrichment.ts");
    const dates = await vite.ssrLoadModule("/src/lib/content-dates.ts");
    const showcase = await vite.ssrLoadModule("/src/data/showcase-demos.ts");
    const site = await vite.ssrLoadModule("/src/lib/site.ts");
    const legal = await vite.ssrLoadModule("/src/lib/legal.ts");
    const locs = sitemap.collectAllSitemapLocs();
    const paths = [];
    const seen = new Set();
    for (const loc of locs) {
      const path = pathFromLoc(loc);
      if (seen.has(path)) throw new Error(`duplicate sitemap path: ${path}`);
      seen.add(path);
      paths.push(path);
    }
    paths.sort();
    const itemsByPath = new Map();
    for (const item of itemsMod.getItemsWithDetailPages()) {
      itemsByPath.set(itemPaths.getItemPath(item), item);
    }
    return {
      paths,
      itemsByPath,
      itemsMod,
      itemPaths,
      learn,
      laya,
      agents,
      alternatives,
      categories,
      categoryEnrichment,
      profiles,
      enrichment,
      dates,
      showcase,
      site,
      legal,
    };
  } finally {
    await vite.close();
  }
}

function cardRecord(item) {
  return {
    slug: item.slug,
    title: item.title,
    oneLiner: item.oneLiner,
    category: item.category,
    language: item.language ?? null,
    stars: typeof item.stars === "number" ? item.stars : null,
    badges: item.badges ?? [],
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 3) : [],
    featured: Boolean(item.featured),
    url: item.url ?? null,
    repoUrl: item.repoUrl ?? null,
    demoUrl: item.demoUrl ?? null,
    creatorHandle: item.creatorHandle ?? null,
    creatorName: item.creatorName ?? null,
    indexOnly: Boolean(item.indexOnly),
  };
}

function categoryTitles(src) {
  return src.categories.categories.map((category) => ({
    slug: category.slug,
    title: category.title,
  }));
}

/** Data the route renders. siteConfig.url is env-derived, so it stays out of the hash. */
function staticRecords(src, path) {
  const site = src.site.siteConfig;
  if (path === "/") {
    return {
      homepageDemos: src.showcase.getHomepageDemos(),
      featured: src.itemsMod.getFeaturedItems(4).map(cardRecord),
    };
  }
  if (path === "/explore") {
    return {
      items: src.itemsMod.getAllItems().map(cardRecord),
      categories: categoryTitles(src),
    };
  }
  if (path === "/showcase") {
    return { demos: src.showcase.showcaseDemos };
  }
  if (path === "/learn") {
    return {
      topics: src.learn.learnGuideSlugs.map((slug) => {
        const guide = src.learn.learnGuides[slug];
        return { slug, title: guide.title, description: guide.description };
      }),
      layaHub: {
        title: src.laya.layaVsJevHub.title,
        tagline: src.laya.layaVsJevHub.tagline,
      },
      layaCards: src.laya.layaVsJevGuideSlugs.slice(0, 4).map((slug) => {
        const guide = src.laya.layaVsJevGuides[slug];
        return { slug, title: guide.title, tagline: guide.tagline };
      }),
      docs: site.typesafe.docs,
      playground: site.typesafe.playground,
      gateway: site.vercelGateway,
    };
  }
  if (path === "/guides") {
    const community = src.itemsMod
      .getItemsWithDetailPages()
      .filter((item) => src.itemPaths.itemBelongsOnSegment(item, "guides"))
      .sort(
        (a, b) =>
          (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") ||
          a.title.localeCompare(b.title),
      )
      .map((item) => ({ slug: item.slug, title: item.title, oneLiner: item.oneLiner }));
    return {
      hub: {
        title: src.agents.agentGuidesHub.title,
        tagline: src.agents.agentGuidesHub.tagline,
      },
      agents: src.agents.agentGuideSlugs.map((slug) => {
        const guide = src.agents.agentGuides[slug];
        return { slug, title: guide.title, tagline: guide.tagline };
      }),
      community,
      docs: site.typesafe.docs,
    };
  }
  if (path === "/submit") return { categories: categoryTitles(src) };
  if (path === "/about") {
    return {
      hostnameBrand: site.hostnameBrand,
      name: site.name,
      parentBrand: site.parentBrand,
      legalName: site.publisherContact.legalName,
    };
  }
  if (path === "/contact") {
    return {
      hostnameBrand: site.hostnameBrand,
      parentName: site.parentBrand.name,
      publisherContact: site.publisherContact,
    };
  }
  if (path === "/developers") {
    return {
      hostnameBrand: site.hostnameBrand,
      name: site.name,
      api: site.typesafe.api,
    };
  }
  if (path === "/for-agents") return { api: site.typesafe.api };
  if (path === "/privacy" || path === "/terms") {
    return {
      email: src.legal.privacyContactEmail(),
      address: src.legal.legalMailingAddress(),
    };
  }
  if (path === "/your-privacy-choices") {
    return { email: src.legal.privacyContactEmail() };
  }
  if (path === "/privacy/archive") {
    return {
      legalName: site.publisherContact.legalName,
      hostnameBrand: site.hostnameBrand,
    };
  }
  return null;
}

function sourceRecord(src, path) {
  const templates = STATIC_TEMPLATES[path];
  if (templates) {
    const files = {};
    for (const rel of [...templates].sort()) files[rel] = readRepoFile(rel);
    const records = staticRecords(src, path);
    return records ? { kind: "static", files, records } : { kind: "static", files };
  }
  if (path.startsWith("/categories/")) {
    const slug = path.slice("/categories/".length);
    const category = src.categories.getCategory(slug);
    if (!category) throw new Error(`missing category ${slug}`);
    const items = src.itemsMod.getItemsByCategory(slug);
    return {
      kind: "category",
      category,
      enrichment: src.categoryEnrichment.getCategoryEnrichment(slug) ?? null,
      items,
    };
  }
  if (path === "/learn/laya-vs-jev") {
    return { kind: "laya-hub", hub: src.laya.layaVsJevHub };
  }
  if (path.startsWith("/learn/laya-vs-jev/")) {
    const slug = path.slice("/learn/laya-vs-jev/".length);
    const guide = src.laya.getLayaVsJevGuide(slug);
    if (!guide) throw new Error(`missing laya guide ${slug}`);
    if (slug === "compare") {
      return {
        kind: "laya-compare",
        guide,
        alternative: src.alternatives.getAlternative("laya"),
      };
    }
    return { kind: "laya", guide };
  }
  if (path.startsWith("/learn/")) {
    const slug = path.slice("/learn/".length);
    const guide = src.learn.getLearnGuide(slug);
    if (!guide) throw new Error(`missing learn guide ${slug}`);
    return { kind: "learn", guide };
  }
  if (path === "/alternatives") {
    return { kind: "alternatives-hub", hub: src.alternatives.alternativesHub };
  }
  if (path.startsWith("/alternatives/")) {
    const slug = path.slice("/alternatives/".length);
    const alternative = src.alternatives.getAlternative(slug);
    if (!alternative) throw new Error(`missing alternative ${slug}`);
    return { kind: "alternative", alternative };
  }
  if (path === "/guides/jev-with-ai-agents") {
    return { kind: "agent-hub", hub: src.agents.agentGuidesHub };
  }
  if (path.startsWith("/guides/jev-with-ai-agents/")) {
    const slug = path.slice("/guides/jev-with-ai-agents/".length);
    const guide = src.agents.getAgentGuide(slug);
    if (!guide) throw new Error(`missing agent guide ${slug}`);
    return { kind: "agent", guide };
  }
  const item = src.itemsByPath.get(path);
  if (item) {
    return {
      kind: "listing",
      item,
      profile: src.profiles.getProductProfile(item.slug) ?? null,
      enrichment: src.enrichment.getListingEnrichment(item.slug) ?? null,
    };
  }
  throw new Error(`no lastmod source record for ${path}`);
}

function hashPaths(src) {
  const hashes = new Map();
  for (const path of src.paths) hashes.set(path, sha256(sourceRecord(src, path)));
  return hashes;
}

function driftList(hashes, previous, legalLocked) {
  const drifted = [];
  for (const [path, hash] of hashes) {
    const prev = previous[path];
    if (!prev) drifted.push(`${path} is missing from the manifest`);
    else if (prev.hash !== hash) drifted.push(`${path} content hash changed`);
    else if (typeof prev.lastmod !== "string" || !ISO_DAY.test(prev.lastmod)) {
      drifted.push(`${path} lastmod is not YYYY-MM-DD`);
    } else if (legalLocked[path] && prev.lastmod !== legalLocked[path]) {
      drifted.push(
        `${path} lastmod ${prev.lastmod} must equal legal date ${legalLocked[path]}`,
      );
    }
  }
  for (const path of Object.keys(previous)) {
    if (!hashes.has(path)) drifted.push(`${path} was removed`);
  }
  return drifted.sort();
}

const lineCache = new Map();
const blameCache = new Map();

function fileLines(relPath) {
  if (!lineCache.has(relPath)) lineCache.set(relPath, readRepoFile(relPath).split("\n"));
  return lineCache.get(relPath);
}

function blameDates(relPath) {
  if (blameCache.has(relPath)) return blameCache.get(relPath);
  const out = git(["blame", "--date=short", "--", relPath]);
  const map = new Map();
  for (const line of out.split("\n")) {
    const match = line.match(/(\d{4}-\d{2}-\d{2})\s+(\d+)\)/);
    if (match) map.set(Number(match[2]), match[1]);
  }
  blameCache.set(relPath, map);
  return map;
}

function maxInRange(dates, start, end) {
  let max = null;
  for (let line = start; line <= end; line += 1) {
    max = later(max, dates.get(line) ?? null);
  }
  return max;
}

function slugRanges(relPath, slugs) {
  const lines = fileLines(relPath);
  const starts = [];
  for (const slug of slugs) {
    const plain = `  ${slug}: {`;
    const quoted = `  "${slug}": {`;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trimEnd();
      if (line !== plain && line !== quoted) continue;
      const window = lines.slice(i, i + 12).join("\n");
      if (
        window.includes(`slug: "${slug}"`) ||
        window.includes(`slug: '${slug}'`) ||
        window.includes(`"slug": "${slug}"`)
      ) {
        starts.push({ slug, line: i + 1 });
        break;
      }
    }
  }
  starts.sort((a, b) => a.line - b.line);
  const dates = blameDates(relPath);
  const out = new Map();
  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i].line;
    let end = lines.length;
    if (i + 1 < starts.length) end = starts[i + 1].line - 1;
    else {
      for (let j = start; j <= lines.length; j += 1) {
        if (lines[j - 1] === "};") {
          end = j;
          break;
        }
      }
    }
    out.set(starts[i].slug, maxInRange(dates, start, end));
  }
  return out;
}

function constObjectDate(relPath, exportName) {
  const lines = fileLines(relPath);
  const header = `export const ${exportName} = {`;
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith(header)) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return null;
  let end = lines.length;
  for (let j = start; j <= lines.length; j += 1) {
    if (lines[j - 1] === "};") {
      end = j;
      break;
    }
  }
  return maxInRange(blameDates(relPath), start, end);
}

function categoryMetaDate(slug) {
  const relPath = "src/data/categories-data.ts";
  const lines = fileLines(relPath);
  const marker = `    slug: "${slug}",`;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== marker) continue;
    let start = i;
    while (start > 0 && lines[start] !== "  {") start -= 1;
    let end = i;
    while (end < lines.length && lines[end] !== "  }," && lines[end] !== "  }") end += 1;
    return maxInRange(blameDates(relPath), start + 1, end + 1);
  }
  return null;
}

function gitHistoryDay(relPath) {
  const today = new Date().toISOString().slice(0, 10);
  const days = git(["log", "--format=%cs", "--", relPath])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  for (const day of days) {
    if (!ISO_DAY.test(day)) throw new Error(`unexpected git date for ${relPath}: ${day}`);
    if (day !== today) return day;
  }
  return null;
}

function objectStart(relPath, slug) {
  const lines = fileLines(relPath);
  const plain = `  ${slug}: {`;
  const quoted = `  "${slug}": {`;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trimEnd();
    if (line !== plain && line !== quoted) continue;
    const window = lines.slice(i, i + 8).join("\n");
    if (
      window.includes(`slug: "${slug}"`) ||
      window.includes(`slug: '${slug}'`) ||
      window.includes(`"slug": "${slug}"`)
    ) {
      return i + 1;
    }
  }
  return -1;
}

function blameUntil(relPath, start, stopPattern) {
  if (start < 1) return null;
  const lines = fileLines(relPath);
  const dates = blameDates(relPath);
  let max = null;
  const limit = Math.min(lines.length, start + 40);
  for (let line = start; line <= limit; line += 1) {
    if (line > start && stopPattern.test(lines[line - 1])) break;
    max = later(max, dates.get(line) ?? null);
  }
  return max;
}

function cardFieldDay(relPath, slug) {
  return blameUntil(relPath, objectStart(relPath, slug), /^\s+seoTitle:/);
}

function constCardDay(relPath, exportName) {
  const lines = fileLines(relPath);
  const header = `export const ${exportName} = {`;
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith(header)) {
      start = i + 1;
      break;
    }
  }
  return blameUntil(relPath, start, /^\s+seoTitle:/);
}

function supplementSpan(slug) {
  const relPath = "src/data/catalog-supplement.json";
  const lines = fileLines(relPath);
  const marker = `    "slug": "${slug}",`;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== marker) continue;
    let start = i;
    while (start > 0 && lines[start] !== "  {") start -= 1;
    let end = i;
    while (end < lines.length && lines[end] !== "  }," && lines[end] !== "  }") end += 1;
    return { relPath, start: start + 1, end: end + 1 };
  }
  return null;
}

function overrideSpan(slug) {
  const relPath = "src/data/catalog-marketing-overrides.json";
  const lines = fileLines(relPath);
  const marker = `  "${slug}": {`;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== marker) continue;
    let end = i;
    while (end < lines.length && lines[end] !== "  }," && lines[end] !== "  }") end += 1;
    return { relPath, start: i + 1, end: end + 1 };
  }
  return null;
}

function blameSpanLines(span, pattern) {
  if (!span) return null;
  const lines = fileLines(span.relPath);
  const dates = blameDates(span.relPath);
  let max = null;
  for (let line = span.start; line <= span.end; line += 1) {
    if (pattern && !pattern.test(lines[line - 1])) continue;
    max = later(max, dates.get(line) ?? null);
  }
  return max;
}

const CARD_LINE =
  /^\s+"(?:slug|title|oneLiner|category|tags|language|stars|url|repoUrl|demoUrl|postUrl|featured|badges|creatorHandle|creatorName|indexOnly|detailPage|sourcePlatform)"/;
const GUIDE_LINE = /^\s+"(?:title|oneLiner)"/;

let catalogHistoryDay;

function itemCardHistory(slug, linePattern) {
  const supplement = supplementSpan(slug);
  let day;
  if (supplement) day = blameSpanLines(supplement, linePattern);
  else {
    if (catalogHistoryDay === undefined) {
      catalogHistoryDay = gitHistoryDay("src/data/catalog.json");
    }
    day = catalogHistoryDay;
  }
  const override = overrideSpan(slug);
  if (override) day = later(day, blameSpanLines(override, linePattern));
  return day;
}

function demoSpans() {
  const relPath = "src/data/showcase-demos.ts";
  const lines = fileLines(relPath);
  const spans = [];
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^\s+id:\s*"([^"]+)"\s*,?\s*$/);
    if (!match) continue;
    let start = i;
    while (start > 0 && !lines[start].includes("demo({")) start -= 1;
    let end = i;
    while (end < lines.length - 1 && !lines[end].includes("}),")) end += 1;
    spans.push({ id: match[1], start: start + 1, end: end + 1 });
  }
  return spans;
}

function mediaSpan(id) {
  const relPath = "src/data/showcase-demo-media.json";
  const lines = fileLines(relPath);
  const marker = `  "${id}": {`;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== marker) continue;
    let end = i;
    while (end < lines.length && lines[end] !== "  }," && lines[end] !== "  }") end += 1;
    return { relPath, start: i + 1, end: end + 1 };
  }
  return null;
}

function demoHistory(ids) {
  const dates = blameDates("src/data/showcase-demos.ts");
  const wanted = ids ? new Set(ids) : null;
  let max = null;
  for (const span of demoSpans()) {
    if (wanted && !wanted.has(span.id)) continue;
    max = later(max, maxInRange(dates, span.start, span.end));
    max = later(max, blameSpanLines(mediaSpan(span.id), null));
  }
  return max;
}

function categoryTitleHistory() {
  const relPath = "src/data/categories-data.ts";
  const lines = fileLines(relPath);
  const dates = blameDates(relPath);
  let max = null;
  for (let i = 0; i < lines.length; i += 1) {
    if (!/^\s+title: /.test(lines[i])) continue;
    max = later(max, dates.get(i + 1) ?? null);
  }
  return max;
}

function siteLiteralHistory() {
  const relPath = "src/lib/site.ts";
  const lines = fileLines(relPath);
  const dates = blameDates(relPath);
  let max = null;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s+(hostnameBrand|name|legalName|email|streetAddress|docs|playground|api|vercelGateway):/.test(lines[i])) {
      max = later(max, dates.get(i + 1) ?? null);
    }
  }
  return max;
}

function staticRecordHistory(src, path) {
  if (path === "/") {
    const ids = src.showcase.getHomepageDemos().map((demo) => demo.id);
    let day = demoHistory(ids);
    for (const item of src.itemsMod.getFeaturedItems(4)) {
      day = later(day, itemCardHistory(item.slug, CARD_LINE));
    }
    return day;
  }
  if (path === "/showcase") return demoHistory(null);
  if (path === "/explore") {
    let day = categoryTitleHistory();
    day = later(day, gitHistoryDay("src/lib/content-policy.ts"));
    for (const item of src.itemsMod.getAllItems()) {
      day = later(day, itemCardHistory(item.slug, CARD_LINE));
    }
    return day;
  }
  if (path === "/learn") {
    let day = constCardDay("src/data/laya-vs-jev-guides.ts", "layaVsJevHub");
    for (const slug of src.learn.learnGuideSlugs) {
      day = later(day, cardFieldDay("src/data/learn-guides.ts", slug));
    }
    for (const slug of src.laya.layaVsJevGuideSlugs.slice(0, 4)) {
      day = later(day, cardFieldDay("src/data/laya-vs-jev-guides.ts", slug));
    }
    day = later(day, siteLiteralHistory());
    return day;
  }
  if (path === "/guides") {
    let day = constCardDay("src/data/agent-guides.ts", "agentGuidesHub");
    for (const slug of src.agents.agentGuideSlugs) {
      day = later(
        day,
        cardFieldDay("src/data/agent-guides.ts", slug) ??
          cardFieldDay("src/data/agent-guides-batch-2.ts", slug),
      );
    }
    const community = src.itemsMod
      .getItemsWithDetailPages()
      .filter((item) => src.itemPaths.itemBelongsOnSegment(item, "guides"));
    for (const item of community) day = later(day, itemCardHistory(item.slug, GUIDE_LINE));
    day = later(day, siteLiteralHistory());
    return day;
  }
  if (path === "/submit") return categoryTitleHistory();
  if (
    path === "/about" ||
    path === "/contact" ||
    path === "/developers" ||
    path === "/for-agents" ||
    path === "/privacy/archive"
  ) {
    return siteLiteralHistory();
  }
  return null;
}

function staticHistoryDay(src, path) {
  let day = null;
  for (const rel of STATIC_TEMPLATES[path] ?? []) day = later(day, gitHistoryDay(rel));
  return later(day, staticRecordHistory(src, path));
}

function futureUpdatedAt(src) {
  const today = new Date().toISOString().slice(0, 10);
  const bad = [];
  for (const item of src.itemsMod.getAllItems()) {
    const raw = typeof item.updatedAt === "string" ? item.updatedAt.slice(0, 10) : "";
    if (ISO_DAY.test(raw) && raw > today) bad.push(`${item.slug} updatedAt ${raw}`);
  }
  bad.sort();
  return { today, bad };
}

function listingHand(datesMod, item) {
  const day = typeof item.updatedAt === "string" ? item.updatedAt.slice(0, 10) : "";
  if (ISO_DAY.test(day)) return day;
  return datesMod.LISTING_LASTMOD_FALLBACK;
}

function seedDates(src, hashes) {
  assertFullClone();
  allowGit = true;
  const metrics = JSON.parse(readRepoFile("src/data/alternatives-metrics.json"));
  const verified = metrics.pageLastVerified;
  const metricsLocked = new Map([
    ["/alternatives", verified.hub],
    ["/learn/laya-vs-jev/compare", verified["laya-compare"]],
  ]);
  for (const slug of src.alternatives.alternativeSlugs) {
    metricsLocked.set(`/alternatives/${slug}`, verified[slug]);
  }

  const detailItems = [...src.itemsByPath.values()];
  const detailSlugs = detailItems.map((item) => item.slug);
  const profileDates = slugRanges("src/data/product-profiles.ts", detailSlugs);
  const enrichmentDates = slugRanges("src/data/listing-enrichment.ts", detailSlugs);
  const learnDates = slugRanges("src/data/learn-guides.ts", src.learn.learnGuideSlugs);
  const layaDates = slugRanges("src/data/laya-vs-jev-guides.ts", src.laya.layaVsJevGuideSlugs);
  const agentDates = new Map([
    ...slugRanges("src/data/agent-guides.ts", src.agents.agentGuideSlugs),
    ...slugRanges("src/data/agent-guides-batch-2.ts", src.agents.agentGuideSlugs),
  ]);
  const categoryCopyDates = slugRanges(
    "src/data/category-enrichment.ts",
    src.categories.categories.map((category) => category.slug),
  );
  const layaHubBlame = constObjectDate("src/data/laya-vs-jev-guides.ts", "layaVsJevHub");
  const agentHubBlame = constObjectDate("src/data/agent-guides.ts", "agentGuidesHub");

  const today = new Date().toISOString().slice(0, 10);
  const entries = {};
  const rows = [];

  for (const path of src.paths) {
    let hand = src.dates.fallbackLastmod(path);
    if (src.itemsByPath.has(path)) {
      hand = listingHand(src.dates, src.itemsByPath.get(path));
    } else if (path.startsWith("/categories/")) {
      const slug = path.slice("/categories/".length);
      let max = src.dates.fallbackLastmod(path);
      for (const item of src.itemsMod.getItemsByCategory(slug)) {
        max = later(max, listingHand(src.dates, item));
      }
      hand = max;
    }

    let day = hand;
    const templates = STATIC_TEMPLATES[path];
    if (templates) day = later(day, staticHistoryDay(src, path));
    if (src.itemsByPath.has(path)) {
      const slug = src.itemsByPath.get(path).slug;
      day = later(day, profileDates.get(slug) ?? null);
      day = later(day, enrichmentDates.get(slug) ?? null);
    }
    if (path.startsWith("/learn/") && !path.startsWith("/learn/laya-vs-jev")) {
      day = later(day, learnDates.get(path.slice("/learn/".length)) ?? null);
    }
    if (path === "/learn/laya-vs-jev") day = later(day, layaHubBlame);
    if (path.startsWith("/learn/laya-vs-jev/")) {
      day = later(day, layaDates.get(path.slice("/learn/laya-vs-jev/".length)) ?? null);
    }
    if (path === "/guides/jev-with-ai-agents") day = later(day, agentHubBlame);
    if (path.startsWith("/guides/jev-with-ai-agents/")) {
      day = later(day, agentDates.get(path.slice("/guides/jev-with-ai-agents/".length)) ?? null);
    }
    if (path.startsWith("/categories/")) {
      const slug = path.slice("/categories/".length);
      day = later(day, categoryMetaDate(slug));
      day = later(day, categoryCopyDates.get(slug) ?? null);
    }
    if (ISSUE_LASTMOD[path]) day = later(day, ISSUE_LASTMOD[path]);
    if (metricsLocked.has(path)) day = metricsLocked.get(path);
    const legalLocked = src.dates.legalLockedLastmod ?? {};
    if (legalLocked[path]) day = legalLocked[path];

    if (!day || !ISO_DAY.test(day)) throw new Error(`no historical lastmod for ${path}`);
    if (day === today) {
      throw new Error(
        `refusing to seed ${path} with today ${today}. Unchanged URLs must keep an older date.`,
      );
    }
    entries[path] = { hash: hashes.get(path), lastmod: day };
    if (day !== hand) rows.push({ path, hand, lastmod: day });
  }

  rows.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  console.log(`seeded ${src.paths.length} URLs; ${rows.length} dates differ from the previous hand date`);
  for (const row of rows) {
    console.log(`  ${row.hand} -> ${row.lastmod}  ${row.path}`);
  }
  return entries;
}

function usage() {
  console.error("usage: node scripts/lastmod-manifest.mjs --check|--write|--seed");
  process.exit(1);
}

const mode = process.argv.includes("--seed")
  ? "seed"
  : process.argv.includes("--write")
    ? "write"
    : process.argv.includes("--check")
      ? "check"
      : null;
if (!mode) usage();

const src = await loadSources();
const hashes = hashPaths(src);
const previous = loadPrevious();
const legalLocked = src.dates.legalLockedLastmod ?? {};
const future = futureUpdatedAt(src);
if (future.bad.length) {
  console.error(`raw updatedAt is after today ${future.today}.`);
  for (const line of future.bad.slice(0, 30)) console.error(`  ${line}`);
  if (future.bad.length > 30) console.error(`  ... ${future.bad.length - 30} more`);
  process.exit(1);
}

if (mode === "check") {
  const drifted = driftList(hashes, previous, legalLocked);
  if (drifted.length) {
    console.error("lastmod manifest drift.");
    console.error("Run pnpm lastmod:update and commit src/data/lastmod-manifest.json.");
    for (const line of drifted.slice(0, 30)) console.error(`  ${line}`);
    if (drifted.length > 30) console.error(`  ... ${drifted.length - 30} more`);
    process.exit(1);
  }
  console.log(`lastmod manifest OK: ${hashes.size} URLs`);
} else if (mode === "write") {
  const today = new Date().toISOString().slice(0, 10);
  const entries = {};
  let bumped = 0;
  let added = 0;
  let kept = 0;
  for (const [path, hash] of hashes) {
    const prev = previous[path];
    const lockedDay = legalLocked[path];
    if (lockedDay) {
      entries[path] = { hash, lastmod: lockedDay };
      if (
        prev &&
        prev.hash === hash &&
        prev.lastmod === lockedDay
      ) {
        kept += 1;
      } else if (prev) {
        bumped += 1;
        console.log(`lock ${path} -> ${lockedDay}`);
      } else {
        added += 1;
        console.log(`lock ${path} -> ${lockedDay}`);
      }
    } else if (prev && prev.hash === hash && typeof prev.lastmod === "string" && ISO_DAY.test(prev.lastmod)) {
      entries[path] = { hash, lastmod: prev.lastmod };
      kept += 1;
    } else if (prev) {
      entries[path] = { hash, lastmod: today };
      bumped += 1;
      console.log(`bump ${path} -> ${today}`);
    } else {
      entries[path] = { hash, lastmod: today };
      added += 1;
      console.log(`add ${path} -> ${today}`);
    }
  }
  const pruned = Object.keys(previous).filter((path) => !hashes.has(path));
  for (const path of pruned) console.log(`prune ${path}`);
  writeFileSync(manifestPath, serialize(entries));
  console.log(
    `lastmod manifest wrote ${hashes.size} URLs (kept ${kept}, bumped ${bumped}, added ${added}, pruned ${pruned.length})`,
  );
} else {
  const entries = seedDates(src, hashes);
  writeFileSync(manifestPath, serialize(entries));
  console.log(`wrote ${manifestPath}`);
}
