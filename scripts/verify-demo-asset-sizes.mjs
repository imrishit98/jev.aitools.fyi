/**
 * Fail the build if any showcase asset exceeds Cloudflare Workers per-file limit (25 MiB).
 * Checks public/demos (source) and dist/demos (post-build) when present.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAX_BYTES = 25 * 1024 * 1024;

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

const scope = process.argv.includes("--dist-only")
  ? ["dist/demos"]
  : process.argv.includes("--public-only")
    ? ["public/demos"]
    : ["public/demos", "dist/demos"];

const errors = [];
for (const rel of scope) {
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
  console.error("Demo asset size check failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    "\nUse remoteVideoUrl in src/data/showcase-demos.ts (tweet MP4 on video.twimg.com) and remove the local file.",
  );
  process.exit(1);
}

console.log("Demo asset sizes OK (nothing over 25 MiB under public/demos or dist/demos).");
