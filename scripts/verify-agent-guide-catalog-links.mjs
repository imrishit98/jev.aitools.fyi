/**
 * Guard: agent guide hub + related catalog slugs must not imply dead on-site detail URLs.
 */
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
const policyMod = await vite.ssrLoadModule("/src/lib/content-policy.ts");
const pathsMod = await vite.ssrLoadModule("/src/lib/item-paths.ts");
const agentGuidesMod = await vite.ssrLoadModule("/src/data/agent-guides.ts");
await vite.close();

const { getItemBySlug } = itemsMod;
const { itemHasDetailPage } = policyMod;
const { getItemPath } = pathsMod;
const { agentGuides, agentGuidesHub } = agentGuidesMod;

const errors = [];

for (const guide of Object.values(agentGuides)) {
  for (const slug of guide.relatedCatalogSlugs) {
    const item = getItemBySlug(slug);
    if (!item) {
      errors.push(`relatedCatalogSlugs missing catalog item: ${guide.slug} -> ${slug}`);
      continue;
    }
    if (!itemHasDetailPage(item)) {
      errors.push(
        `relatedCatalogSlugs index-only (would 404 at ${getItemPath(item)}): ${guide.slug} -> ${slug}`,
      );
    }
  }
}

for (const row of agentGuidesHub.alsoWorksWith) {
  if (!row.slug) continue;
  const item = getItemBySlug(row.slug);
  if (!item) {
    errors.push(`alsoWorksWith missing catalog item: ${row.slug}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("verify-agent-guide-catalog-links: ok");
