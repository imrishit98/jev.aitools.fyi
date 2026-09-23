/**
 * Not-found HTML SEO: noindex, no /404 canonical, explore param X-Robots-Tag.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const dist404 = join(root, "dist", "404.html");

const viteEntry = require.resolve("vite", {
  paths: [require.resolve("astro")],
});
const { createServer } = await import(viteEntry);

const vite = await createServer({
  configFile: resolve(root, "astro.config.mjs"),
  resolve: { alias: { "@": resolve(root, "src") } },
  logLevel: "error",
});

const nf = await vite.ssrLoadModule("/src/lib/not-found-seo.ts");
const explore = await vite.ssrLoadModule("/src/lib/explore-seo.ts");
await vite.close();

const { patchNotFoundHtml, tryNotFoundHtmlSeoResponse } = nf;
const { patchExploreHtmlForNoindex } = explore;

const sample = `<!doctype html><head>
<link rel="canonical" href="https://jev.aitools.fyi/404" />
<meta name="robots" content="index, follow" />
<meta property="og:url" content="https://jev.aitools.fyi/404" />
</head>`;

const patched = patchNotFoundHtml(sample, { stripOpenGraphUrl: true });
if (!patched.includes('content="noindex, follow"')) {
  throw new Error("patchNotFoundHtml missing noindex robots");
}
if (patched.includes('rel="canonical"')) {
  throw new Error("patchNotFoundHtml should remove canonical");
}
if (patched.includes("og:url")) {
  throw new Error("patchNotFoundHtml should strip og:url when requested");
}

const html404 = readFileSync(dist404, "utf8");
if (!html404.includes('content="noindex, follow"')) {
  throw new Error("dist/404.html missing noindex robots meta");
}
if (html404.includes('rel="canonical"')) {
  throw new Error("dist/404.html should not include canonical");
}

const indexHtml = readFileSync(join(root, "dist", "index.html"), "utf8");
const uploadDates = [
  ...indexHtml.matchAll(/"uploadDate"\s*:\s*"([^"]+)"/g),
].map((m) => m[1]);
if (uploadDates.length === 0) {
  throw new Error("index.html missing VideoObject uploadDate");
}
for (const d of uploadDates) {
  if (!/Z$|[+-]\d{2}:\d{2}$/.test(d)) {
    throw new Error(`uploadDate missing timezone: ${d}`);
  }
}

const assetRes = new Response(sample, {
  status: 404,
  headers: { "Content-Type": "text/html" },
});
const req = new Request("https://jev.aitools.fyi/missing-page");
const out = await tryNotFoundHtmlSeoResponse(req, new URL(req.url), assetRes);
if (!out || out.status !== 404) throw new Error("tryNotFoundHtmlSeoResponse failed");
if (out.headers.get("X-Robots-Tag") !== "noindex, follow") {
  throw new Error("404 HTML missing X-Robots-Tag");
}
const body = await out.text();
if (body.includes("/404") && body.includes('rel="canonical"')) {
  throw new Error("404 response still has canonical");
}

const exploreHtml = patchExploreHtmlForNoindex(
  '<meta name="robots" content="index, follow"><link rel="canonical" href="https://jev.aitools.fyi/explore">',
  "/explore",
);
if (!exploreHtml.includes("noindex, follow")) {
  throw new Error("explore patch missing noindex");
}

console.log("verify-not-found-seo: ok");
