/**
 * Cloudflare Workers static assets ignore Response headers from Astro's
 * static build. Write one dist/_headers rule per built .md file so
 * X-Robots-Tag, the canonical Link, and Content-Type actually ship.
 * Homepage and 404 markdown are not files (the Worker negotiates them),
 * so they are not listed here.
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const distDir = resolve(import.meta.dirname, "..", "dist");
const site = "https://jev.aitools.fyi";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

function htmlPath(absFile) {
  const rel = relative(distDir, absFile).split("\\").join("/");
  let path = `/${rel.slice(0, -".md".length)}`;
  if (path === "/index") return "/";
  if (path.endsWith("/index")) path = path.slice(0, -"/index".length) || "/";
  return path;
}

const files = walk(distDir).sort();
if (files.length === 0) {
  console.error("write-md-headers: no .md files in dist");
  process.exit(1);
}

const seen = new Set();
const lines = [
  "# One rule per markdown alternate. Do not add a second rule for the same path.",
];

for (const file of files) {
  const mdPath = `/${relative(distDir, file).split("\\").join("/")}`;
  if (seen.has(mdPath)) {
    console.error(`write-md-headers: duplicate path ${mdPath}`);
    process.exit(1);
  }
  seen.add(mdPath);
  const canonical = `${site}${htmlPath(file)}`;
  lines.push(
    mdPath,
    "  X-Robots-Tag: noindex, follow",
    `  Link: <${canonical}>; rel="canonical"`,
    "  Content-Type: text/markdown; charset=utf-8",
    "",
  );
}

writeFileSync(join(distDir, "_headers"), `${lines.join("\n")}\n`);
console.log(`Wrote dist/_headers (${files.length} markdown rules)`);
