/**
 * Sanity checks for Markdown negotiation helpers (shared Worker + Pages Functions).
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

const agent = await vite.ssrLoadModule("/src/lib/agent-surface.ts");
const neg = await vite.ssrLoadModule("/src/lib/markdown-negotiation.ts");
await vite.close();

const home = agent.homeMarkdownBody();
const nf = agent.notFoundMarkdownBody("/missing-probe");

if (home.length < 20) throw new Error("homeMarkdownBody too short");
if (nf.length < 20) throw new Error("notFoundMarkdownBody too short");
if (!nf.includes("/llms.txt")) throw new Error("404 markdown missing llms.txt link");

const req = new Request("https://jev.aitools.fyi/", {
  headers: { Accept: "text/markdown" },
});
const res = neg.tryHomeMarkdownResponse(req, new URL(req.url));
if (!res || res.status !== 200) throw new Error("tryHomeMarkdownResponse failed");
if (res.headers.get("Content-Type")?.includes("text/markdown") !== true) {
  throw new Error("home markdown missing content-type");
}
if (res.headers.get("Vary") !== "Accept") throw new Error("home markdown missing Vary: Accept");

const nfReq = new Request("https://jev.aitools.fyi/nope", {
  headers: { Accept: "text/markdown" },
});
const nfRes = neg.tryNotFoundMarkdownResponse(
  nfReq,
  new URL(nfReq.url),
  new Response("html", { status: 404, headers: { "Content-Type": "text/html" } }),
);
if (!nfRes || nfRes.status !== 404) throw new Error("tryNotFoundMarkdownResponse failed");

console.log("verify-markdown-negotiation: ok");
