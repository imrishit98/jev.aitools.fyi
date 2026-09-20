/**
 * Parses awesomejev.com HTML (saved or fetched) into src/data/catalog.json
 * Run: node scripts/generate-catalog.mjs [path-to-html]
 */
import * as fs from "fs";
import * as path from "path";
import { load } from "cheerio";
import { fileURLToPath } from "url";
import { mergeMarketingOverrides } from "./lib/merge-marketing-overrides.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath =
  process.argv[2] || "/tmp/awesomejev.html";

const CAT_MAP = {
  official: "official",
  sdks: "sdks",
  integrations: "integrations",
  agents: "agent-tooling",
  browser: "browser-computer-use",
  apps: "applications",
  games: "games",
  demos: "playgrounds",
  research: "benchmarks",
  lists: "guides",
  articles: "guides",
};

const FEATURED_MIN_STARS = 400;
const featuredRepos = new Set([
  "browser-use/jev-ultrafast",
  "vercel/eve",
  "tamaratran/fast-jev-compaction",
  "TheoLeeCJ/SemIf",
  "vinnylarouge/jevlike",
  "jarrodwatts/jev-trader",
  "typesafe-ai/typesafe-sdk-js",
  "typesafe-ai/skills",
]);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function inferTags(category, text, title) {
  const t = `${text} ${title}`.toLowerCase();
  const tags = new Set([category.replace(/-/g, " ")]);
  const rules = [
    ["routing", /rout/],
    ["moderation", /moderat|trust|spam|phish/],
    ["mcp", /\bmcp\b/],
    ["compaction", /compact/],
    ["browser-use", /browser/],
    ["guardrails", /guard|shield|firewall/],
    ["trading", /trad|defi|monad/],
    ["rag", /rag|rerank|embed/],
    ["sdk", /sdk|client/],
    ["agents", /agent|claude|codex|pi-/],
    ["eval", /benchmark|eval|calibrat/],
    ["game", /game|mario|doom|chess|snake/],
  ];
  for (const [tag, re] of rules) {
    if (re.test(t)) tags.add(tag);
  }
  return [...tags].slice(0, 6);
}

function parseXHandle(postUrl) {
  const m = postUrl.match(/x\.com\/([^/]+)/i);
  if (!m) return undefined;
  const h = m[1];
  if (h === "i" || h === "status") return undefined;
  return h;
}

function stripEmDash(s) {
  return s.replace(/\s*[—–]\s*/g, ", ").replace(/\s+/g, " ").trim();
}

const html = fs.readFileSync(htmlPath, "utf8");
const $ = load(html);
const items = [];
const seen = new Set();

$("section.cat.win").each((_, section) => {
  const dataCat = $(section).attr("data-cat");
  const category = CAT_MAP[dataCat];
  if (!category) return;

  $(section)
    .find("tbody tr")
    .each((_, row) => {
      const $row = $(row);
      const title = stripEmDash($row.find(".c-name a").first().text().trim());
      if (!title) return;

      const owner = $row.find(".c-name .owner").text().trim() || undefined;
      const description = stripEmDash($row.find(".c-desc").text().trim());
      const langRaw = $row.find(".c-lang").text().trim();
      const language =
        langRaw && langRaw !== "—" && langRaw !== "–" ? langRaw : undefined;

      const stars = parseInt($row.attr("data-stars") || "0", 10) || undefined;
      const addedAt = $row.attr("data-added") || undefined;

      let repoUrl;
      let demoUrl;
      let postUrl;
      let siteUrl;

      $row.find(".c-links a").each((__, a) => {
        const href = $(a).attr("href");
        const label = $(a).text().toLowerCase();
        if (!href) return;
        if (label.includes("repo") || href.includes("github.com")) {
          repoUrl = href.split("?")[0];
        } else if (label.includes("post") || href.includes("x.com")) {
          postUrl = href;
        } else if (label.includes("site") || href.startsWith("http")) {
          siteUrl = href;
        }
      });

      const primaryHref = $row.find(".c-name a").first().attr("href") || siteUrl;
      let url = repoUrl || primaryHref || siteUrl;
      if (!url) return;

      if (siteUrl && siteUrl !== repoUrl && !siteUrl.includes("github.com")) {
        demoUrl = siteUrl;
      }

      const dedupeKey = (repoUrl || url).toLowerCase();
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);

      let slug = repoUrl
        ? slugify(repoUrl.replace("https://github.com/", ""))
        : slugify(`${title}-${owner || ""}`);

      if (items.some((i) => i.slug === slug)) {
        slug = `${slug}-${items.length}`;
      }

      const badges = [];
      if (category === "official") badges.push("official");
      if (repoUrl && /\/mcp|jev-mcp|typesafe-mcp/i.test(`${title} ${description} ${repoUrl}`)) {
        badges.push("mcp");
      }
      if (category === "sdks") badges.push("sdk");
      if (demoUrl) badges.push("has-demo");

      const repoPath = repoUrl?.replace("https://github.com/", "");
      const featured =
        (stars && stars >= FEATURED_MIN_STARS) ||
        (repoPath && featuredRepos.has(repoPath));

      if (featured) badges.push("featured");

      const creatorHandle =
        parseXHandle(postUrl || "") ||
        (owner && !owner.includes(" ") ? owner : undefined);

      let sourcePlatform = "web";
      if (category === "official") sourcePlatform = "official";
      else if (postUrl) sourcePlatform = "x";
      else if (repoUrl) sourcePlatform = "github";

      const oneLiner =
        description.length > 140
          ? `${description.slice(0, 137)}...`
          : description;

      items.push({
        slug,
        title,
        oneLiner,
        description,
        category,
        tags: inferTags(category, $row.attr("data-text") || description, title),
        language,
        ...(stars ? { stars } : {}),
        url,
        ...(repoUrl ? { repoUrl } : {}),
        ...(demoUrl ? { demoUrl } : {}),
        ...(postUrl ? { postUrl } : {}),
        ...(featured ? { featured: true } : {}),
        ...(badges.length ? { badges } : {}),
        ...(addedAt ? { updatedAt: addedAt } : {}),
        ...(creatorHandle && sourcePlatform === "x"
          ? { creatorHandle, sourcePlatform: "x" }
          : {}),
      });
    });
});

items.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));

const out = path.join(__dirname, "../src/data/catalog.json");
fs.writeFileSync(out, JSON.stringify(items, null, 0));
mergeMarketingOverrides(out);

console.log(`Wrote ${items.length} items to ${out}`);
