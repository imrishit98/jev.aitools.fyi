/**
 * Build guard for showcase assets:
 * - No video binaries under public/ or dist/ (.mp4, .webm, .mov)
 * - No file over Cloudflare Workers per-file limit (25 MiB) under public/demos or dist/demos
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAX_BYTES = 25 * 1024 * 1024;
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

const publicOnly = process.argv.includes("--public-only");
const distOnly = process.argv.includes("--dist-only");

const videoRoots = distOnly
  ? ["dist"]
  : publicOnly
    ? ["public"]
    : ["public", "dist"];

const sizeRoots = distOnly
  ? ["dist/demos"]
  : publicOnly
    ? ["public/demos"]
    : ["public/demos", "dist/demos"];

const errors = [];

for (const rel of videoRoots) {
  const root = path.join(ROOT, rel);
  for (const file of walkFiles(root)) {
    if (VIDEO_EXT.has(path.extname(file).toLowerCase())) {
      errors.push(
        `video binary: ${rel}/${path.relative(root, file)} (showcase demos must use video.twimg.com URLs in showcase-demo-media.json)`,
      );
    }
  }
}

for (const rel of sizeRoots) {
  const root = path.join(ROOT, rel);
  for (const file of walkFiles(root)) {
    const size = fs.statSync(file).size;
    if (size > MAX_BYTES) {
      errors.push(
        `${rel}/${path.relative(root, file)}: ${(size / 1024 / 1024).toFixed(1)} MiB (max 25 MiB)`,
      );
    }
  }
}

if (errors.length) {
  console.error("Demo asset check failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  "Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).",
);
