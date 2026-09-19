/**
 * Post-build guard: every indexable HTML page must have a unique <title> and meta description.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const distRoot = join(process.cwd(), "dist");

function walkHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkHtmlFiles(full, acc);
    else if (entry.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function relPath(file) {
  return file.replace(distRoot, "").replace(/\\/g, "/");
}

const files = walkHtmlFiles(distRoot);
const byTitle = new Map();
const byDescription = new Map();
const rows = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const $ = cheerio.load(html);
  const robots = $('meta[name="robots"]').attr("content") ?? "";
  if (robots.includes("noindex")) continue;

  const title = $("title").first().text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const path = relPath(file);
  rows.push({ path, title, description });

  const titleBucket = byTitle.get(title) ?? [];
  titleBucket.push(path);
  byTitle.set(title, titleBucket);

  const descBucket = byDescription.get(description) ?? [];
  descBucket.push(path);
  byDescription.set(description, descBucket);
}

const dupTitles = [...byTitle.entries()].filter(([, paths]) => paths.length > 1);
const dupDescriptions = [...byDescription.entries()].filter(
  ([, paths]) => paths.length > 1,
);

if (dupTitles.length || dupDescriptions.length) {
  console.error("Meta uniqueness check failed.\n");
  for (const [title, paths] of dupTitles) {
    console.error(`Duplicate title (${paths.length}): ${title}`);
    for (const p of paths) console.error(`  ${p}`);
  }
  for (const [desc, paths] of dupDescriptions) {
    console.error(`Duplicate description (${paths.length}): ${desc.slice(0, 80)}…`);
    for (const p of paths) console.error(`  ${p}`);
  }
  process.exit(1);
}

console.log(
  `Meta uniqueness OK across ${rows.length} indexable HTML files (${files.length} total HTML).`,
);
