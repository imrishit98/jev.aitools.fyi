/**
 * Build guard: showcase players must route remote twimg through ShowcaseDemoVideo
 * (referrerPolicy=no-referrer). Prevents raw <video> tags that reintroduce 403s.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENT = path.join(ROOT, "src", "components", "showcase-demo-video.tsx");
const CONSUMERS = [
  path.join(ROOT, "src", "components", "demo-card.tsx"),
  path.join(ROOT, "src", "components", "demo-lightbox.tsx"),
];

const errors = [];

const wrapperSrc = fs.readFileSync(COMPONENT, "utf8");
if (
  !wrapperSrc.includes("referrerPolicy") ||
  !wrapperSrc.includes("no-referrer")
) {
  errors.push(
    "showcase-demo-video.tsx must set referrerPolicy=\"no-referrer\" for remote X videos",
  );
}

for (const file of CONSUMERS) {
  const rel = path.relative(ROOT, file);
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("ShowcaseDemoVideo")) {
    errors.push(`${rel} must render showcase videos via ShowcaseDemoVideo`);
  }
  if (/<video\b/.test(content)) {
    errors.push(`${rel} must not contain a raw <video> element (use ShowcaseDemoVideo)`);
  }
}

if (errors.length) {
  console.error("Showcase video referrer policy check failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  "Showcase video referrer policy OK (ShowcaseDemoVideo + no raw <video> in card/lightbox).",
);
