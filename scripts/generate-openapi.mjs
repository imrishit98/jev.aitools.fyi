import { writeFileSync } from "node:fs";
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
const mod = await vite.ssrLoadModule("/src/lib/agent-surface.ts");
await vite.close();

const spec = mod.buildOpenApiSpec();
const jsonPath = resolve(root, "public", "openapi.json");
writeFileSync(jsonPath, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
console.log(`Wrote ${jsonPath}`);
