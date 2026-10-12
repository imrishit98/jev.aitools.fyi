/**
 * Remove templated filler from alternatives-pages.ts section bodies (in place).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve("src/data/alternatives-pages.ts");
let text = readFileSync(path, "utf8");

const POC_BLOCK =
  /When you run a proof of concept, log three numbers for every gate:[\s\S]*?store raw probabilities for disputed rows\.\s*/g;
const VENDOR_CHART_BLOCK =
  /Vendor-reported tables in GitHub README files[\s\S]*?reviewers are not misled\./g;
const ECOSYSTEM_FILLER =
  /Catalog listings on jev\.aitools\.fyi[\s\S]*?when raw speed beats benchmark breadth\./g;
const HYBRID_FILLER =
  /Avoid switching only because of a blog headline\.[\s\S]*?Hybrid designs are common:[\s\S]*?escalation\./g;
const OPS_FILLER =
  /Hosted price fields in our facts table come from vendor list pages[\s\S]*?shadow-mode dual writes during migration\./g;
const CATEGORY_TAIL =
  / sits in the same engineering category as TypeSafe Jev: software sends state, asks explicit questions, and reads probabilities instead of parsing chat text\.\s*/g;
const READVENDOR_TAIL =
  / Read vendor docs for exact JSON fields\. This page is independent writing on jev\.aitools\.fyi; we are not [^.]+\. When README tables compare to hosted Jev, we label them as vendor-reported\. When we cite Decision Index, we label the harness as independent\./g;

function cleanBody(body) {
  return body
    .replace(POC_BLOCK, " ")
    .replace(VENDOR_CHART_BLOCK, " ")
    .replace(ECOSYSTEM_FILLER, "See catalog listings and sibling comparison pages on this hub for a second opinion.")
    .replace(HYBRID_FILLER, " ")
    .replace(OPS_FILLER, "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape.")
    .replace(CATEGORY_TAIL, " ")
    .replace(READVENDOR_TAIL, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

text = text.replace(/"h": "When to choose ([^"]+)"/g, '"h": "Fit and tradeoffs"');

text = text.replace(/"body": "([^"]*(?:\\.[^"]*)*)"/g, (match, inner) => {
  const unescaped = inner.replace(/\\n/g, "\n").replace(/\\"/g, '"');
  if (
    !unescaped.includes("proof of concept") &&
    !unescaped.includes("engineering category") &&
    !unescaped.includes("Catalog listings on jev")
  ) {
    return match;
  }
  const cleaned = cleanBody(unescaped);
  if (!cleaned) return match;
  const escaped = cleaned.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  return `"body": "${escaped}"`;
});

writeFileSync(path, text);
console.log("Stripped boilerplate from", path);
