/**
 * Explore URL SEO policy (category 301 + noindex for search/filter params).
 */
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");

const viteEntry = require.resolve("vite", {
  paths: [require.resolve("astro")],
});
const { createServer } = await import(viteEntry);

const vite = await createServer({
  configFile: resolve(root, "astro.config.mjs"),
  resolve: { alias: { "@": resolve(root, "src") } },
  logLevel: "error",
});

const mod = await vite.ssrLoadModule("/src/lib/explore-seo.ts");
await vite.close();

const { exploreSeoAction, isExplorePath } = mod;

if (!isExplorePath("/explore") || !isExplorePath("/explore/")) {
  throw new Error("isExplorePath should accept /explore variants");
}

const bare = exploreSeoAction("");
if (bare.kind !== "index") throw new Error("bare explore should index");

const category = exploreSeoAction("?category=benchmarks");
if (category.kind !== "redirect" || category.path !== "/categories/benchmarks") {
  throw new Error("category-only explore should 301 to category hub");
}

const search = exploreSeoAction("?q=emulator");
if (search.kind !== "noindex" || search.canonicalPath !== "/explore") {
  throw new Error("explore search should noindex with /explore canonical");
}

const sort = exploreSeoAction("?sort=featured");
if (sort.kind !== "noindex") {
  throw new Error("explore sort param should noindex");
}

console.log("Explore SEO policy checks OK.");
