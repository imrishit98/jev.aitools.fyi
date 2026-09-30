/**
 * Build-time guard: source metaTitle / seoTitle must be <= 60 characters
 * and metaDescription / seoDescription must be <= 160. Silent truncation is not enough.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

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
const mod = await vite.ssrLoadModule("/src/lib/meta-limits.ts");
await vite.close();

const errors = [];
for (const field of mod.metaFieldViolations()) {
  const max = field.kind === "title" ? mod.META_TITLE_MAX : mod.META_DESCRIPTION_MAX;
  errors.push(
    `${field.id} is ${field.value.length} characters (max ${max}): ${field.value}`,
  );
}

const seoSrc = readFileSync(resolve(root, "src/lib/seo.ts"), "utf8");
for (const match of seoSrc.matchAll(
  /(title|description):\s*(?:\n\s*)?"([^"\\]*)"/g,
)) {
  const kind = match[1];
  const value = match[2];
  const max = kind === "title" ? 60 : 160;
  if (value.length > max) {
    errors.push(
      `seo.ts ${kind} is ${value.length} characters (max ${max}): ${value}`,
    );
  }
}

if (errors.length) {
  console.error("Meta length check failed.\n");
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(
  `Meta length OK (${mod.collectRawMetaFields().length} source fields, titles <= 60, descriptions <= 160).`,
);
