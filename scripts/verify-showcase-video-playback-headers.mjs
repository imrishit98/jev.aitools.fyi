/**
 * Smoke test: documents why ShowcaseDemoVideo sets referrerPolicy=no-referrer.
 * Not wired into `pnpm build` — Twitter can flap; run manually after media sync.
 *
 *   node scripts/verify-showcase-video-playback-headers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MEDIA = path.join(ROOT, "src", "data", "showcase-demo-media.json");
const SITE_REFERER = "https://jev.aitools.fyi/";

const entries = Object.values(JSON.parse(fs.readFileSync(MEDIA, "utf8")));
const sample = entries.find((e) => e.videoUrl?.includes("video.twimg.com"));
if (!sample?.videoUrl) {
  console.error("No video.twimg.com URL in showcase-demo-media.json");
  process.exit(1);
}

const url = sample.videoUrl;

async function head(referer) {
  const headers = referer ? { Referer: referer } : {};
  const res = await fetch(url, { method: "HEAD", headers, redirect: "follow" });
  return res.status;
}

const without = await head(null);
const withSite = await head(SITE_REFERER);
const withX = await head("https://x.com/");

console.log(`Sample: ${url}`);
console.log(`  no Referer:     ${without} (expect 200)`);
console.log(`  jev Referer:    ${withSite} (expect 403 — hotlink block)`);
console.log(`  x.com Referer:  ${withX} (expect 200)`);

if (without !== 200) {
  console.warn("\nWarning: twimg returned non-200 without Referer (CDN may be flaky).");
  process.exit(0);
}

if (withSite !== 403) {
  console.warn(
    "\nWarning: expected 403 with site Referer; Twitter policy may have changed.",
  );
  process.exit(0);
}

console.log("\nOK — omitting Referer (no-referrer) is required for in-site playback.");
