/**
 * Flags indexable detail listings with thin or robotic copy.
 * Run: node scripts/audit-detail-copy.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
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
const seoMod = await vite.ssrLoadModule("/src/lib/seo.ts");
const policyMod = await vite.ssrLoadModule("/src/lib/content-policy.ts");
await vite.close();

const detail = itemsMod.getItemsWithDetailPages();
const { itemListingSeo } = seoMod;
const { measureDetailBodyChars } = policyMod;

const ROBOTIC = [
  /^this is a\b/i,
  /^this is an\b/i,
  /^request and response contract/i,
  /^official sync and async python client\. pip install/i,
  /^official typescript\/javascript client with inferred/i,
  /^introduction, primitives, patterns/i,
  /^product and research updates\.?$/i,
  /^official typesafe server\./i,
  /^company homepage, waitlist/i,
  /^the case for machine-native/i,
  /^known failure modes of the current public model, documented$/i,
  /^published eval methodology and per-model results for system one workflows\.?$/i,
  /^reproducible recipes: parallel questions/i, // only if entire desc is catalog line
  /^paste a state, add questions/i,
  /^shortest path from an api key/i,
  /repository that/i,
  /npm install @typesafe-ai\/sdk\.?$/i,
  /like an imposter/i,
];

const THIN_DESC = 140;
const THIN_BODY = 380;

function flags(item) {
  const f = [];
  const ol = (item.oneLiner || "").trim();
  const desc = (item.description || "").trim();
  const body = measureDetailBodyChars(item);
  const combined = `${ol} ${desc} ${item.editorialBlurb || ""}`;

  if (/awesomejev|indexed from|sourced from/i.test(combined)) {
    f.push("attribution");
  }
  if (ol === desc && desc.length < 200) f.push("duplicate-thin");
  if (desc.length < THIN_DESC) f.push("short-desc");
  if (body < THIN_BODY && !(item.editorialBlurb?.length > 180))
    f.push("thin-body");

  for (const re of ROBOTIC) {
    if (re.test(ol) || re.test(desc)) {
      f.push(`robotic:${re.source.slice(0, 40)}`);
      break;
    }
  }

  const seo = itemListingSeo(item);
  if (
    /curated (sdk|tool|app|game|guide|benchmark) listing on jev directory/i.test(
      seo.description,
    ) &&
    ol.length < 90
  ) {
    f.push("robotic-meta");
  }

  return f;
}

const failures = [];
for (const item of detail) {
  const f = flags(item);
  if (f.length) {
    failures.push({
      slug: item.slug,
      category: item.category,
      featured: Boolean(item.featured || item.badges?.includes("featured")),
      stars: item.stars ?? 0,
      descLen: item.description?.length ?? 0,
      body: measureDetailBodyChars(item),
      oneLiner: item.oneLiner?.slice(0, 100),
      flags: f,
    });
  }
}

failures.sort((a, b) => {
  const pri = (x) =>
    (x.featured ? 1000 : 0) +
    (x.stars >= 400 ? 500 : x.stars) +
    (x.flags.includes("attribution") ? 2000 : 0);
  return pri(b) - pri(a);
});

console.log(`Detail pages audited: ${detail.length}`);
console.log(`Flagged: ${failures.length}\n`);
for (const row of failures) {
  console.log(
    JSON.stringify(row, null, 0),
  );
}
