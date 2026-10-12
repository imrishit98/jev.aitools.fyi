/**
 * Rebuild alternatives-pages.ts from last good revision with boilerplate removed at source.
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const root = resolve(".");
const origPath = "/tmp/alternatives-pages-orig.ts";
execSync(`git show 6b13692:src/data/alternatives-pages.ts > ${origPath}`, { cwd: root });

const require = createRequire(import.meta.url);
const viteEntry = require.resolve("vite", { paths: [require.resolve("astro")] });
const { createServer } = await import(viteEntry);
const vite = await createServer({
  configFile: resolve("astro.config.mjs"),
  resolve: { alias: { "@": resolve("src") } },
  logLevel: "error",
});
const origMod = await vite.ssrLoadModule(origPath);
const proseMod = await vite.ssrLoadModule("/src/data/alternatives-unique-prose.ts");
const slugsMod = await vite.ssrLoadModule("/src/data/alternatives-slugs.ts");
await vite.close();

const POC_BLOCK =
  /When you run a proof of concept, log three numbers for every gate:[\s\S]*?store raw probabilities for disputed rows\.\s*/g;
const VENDOR_CHART_BLOCK =
  /Vendor-reported tables in GitHub README files[\s\S]*?reviewers are not misled\./g;
const ECOSYSTEM_FILLER =
  /Catalog listings on jev\.aitools\.fyi[\s\S]*?when raw speed beats benchmark breadth\./g;
const HYBRID_FILLER =
  /Avoid switching only because of a blog headline\.[\s\S]*?Hybrid designs are common:[\s\S]*?escalation\./g;
const OPS_FILLER =
  /Hosted price fields in our facts table come from vendor list pages[\s\S]*?shadow-mode dual writes during migration\./g;
const CATEGORY_TAIL =
  / sits in the same engineering category as TypeSafe Jev: software sends state, asks explicit questions, and reads probabilities instead of parsing chat text\.\s*/g;
const READVENDOR_TAIL =
  / Read vendor docs for exact JSON fields\. This page is independent writing on jev\.aitools\.fyi; we are not [^.]+\. When README tables compare to hosted Jev, we label them as vendor-reported\. When we cite Decision Index, we label the harness as independent\./g;

const pricingDefault =
  "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape.";
const ecosystemDefault =
  "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories.";

function cleanBody(body) {
  return body
    .replace(POC_BLOCK, " ")
    .replace(VENDOR_CHART_BLOCK, " ")
    .replace(ECOSYSTEM_FILLER, ecosystemDefault)
    .replace(HYBRID_FILLER, " ")
    .replace(OPS_FILLER, pricingDefault)
    .replace(CATEGORY_TAIL, " ")
    .replace(READVENDOR_TAIL, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function refineAlt(slug, alt) {
  const sections = alt.sections.map((section) => {
    let h = section.h;
    if (/^When to choose /.test(h)) h = "Fit and tradeoffs";
    let body = cleanBody(section.body);
    if (h.startsWith("What ") && body.length < 40) body = alt.summary;
    if (h === "Pricing and ops" && body.length < 40) body = pricingDefault;
    if (h === "Ecosystem links" && body.length < 40) body = ecosystemDefault;
    return { ...section, h, body };
  });
  const extra = proseMod.UNIQUE_PROSE[slug];
  if (extra?.length && !sections.some((s) => s.h === "Product-specific notes")) {
    sections.push({ h: "Product-specific notes", body: extra.join(" ") });
  }
  return { ...alt, sections };
}

const cleaned = {};
for (const slug of slugsMod.alternativeSlugs) {
  cleaned[slug] = refineAlt(slug, origMod.alternatives[slug]);
}

const out = `import type { Alternative } from "@/data/alternatives-types";
import { alternativeSlugs } from "@/data/alternatives-slugs";

export const alternatives: Record<(typeof alternativeSlugs)[number], Alternative> = ${JSON.stringify(cleaned, null, 2)} as Record<(typeof alternativeSlugs)[number], Alternative>;
`;

writeFileSync(resolve("src/data/alternatives-pages.ts"), out);
console.log("Rebuilt src/data/alternatives-pages.ts from 6b13692 with refined sections.");
