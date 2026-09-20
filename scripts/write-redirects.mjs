import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const distDir = resolve(root, "dist");

const viteEntry = require.resolve("vite", {
  paths: [require.resolve("astro")],
});
const { createServer } = await import(viteEntry);

const vite = await createServer({
  configFile: resolve(root, "astro.config.mjs"),
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
  logLevel: "error",
});
const mod = await vite.ssrLoadModule("/src/lib/redirects.ts");
await vite.close();

writeFileSync(resolve(distDir, "_redirects"), mod.generateRedirectsFile());
const lineCount = mod.countItemRedirects();
console.log(`Wrote dist/_redirects (${lineCount} redirect rules incl. /items hub)`);

writeFileSync(
  resolve(distDir, "_routes.json"),
  `${JSON.stringify(
    {
      version: 1,
      include: ["/*"],
      exclude: [],
    },
    null,
    2,
  )}\n`,
);
console.log("Wrote dist/_routes.json (invoke Pages Functions + middleware on all paths)");

const indexHtml = resolve(distDir, "index.html");
const homeDir = resolve(distDir, "__home");
const homeShell = resolve(homeDir, "index.html");
if (existsSync(indexHtml)) {
  mkdirSync(homeDir, { recursive: true });
  renameSync(indexHtml, homeShell);
  console.log("Moved dist/index.html -> dist/__home/index.html (homepage served via Functions)");
}
