import type { AlternativeSection } from "@/data/alternatives-types";
import type { AlternativeSlug } from "@/data/alternatives-slugs";
import { UNIQUE_PROSE } from "@/data/alternatives-unique-prose";

const POC_BLOCK =
  /When you run a proof of concept, log three numbers for every gate:[\s\S]*?store raw probabilities for disputed rows\.\s*/g;
const CATEGORY_BLOCK =
  /[^.!?]+ sits in the same engineering category as TypeSafe Jev:[\s\S]*?we label the harness as independent\./g;
const VENDOR_CHART_BLOCK =
  /Vendor-reported tables in GitHub README files[\s\S]*?reviewers are not misled\./g;
const ECOSYSTEM_FILLER =
  /Catalog listings on jev\.aitools\.fyi[\s\S]*?when raw speed beats benchmark breadth\./g;
const HYBRID_FILLER =
  /Avoid switching only because of a blog headline\.[\s\S]*?Hybrid designs are common:[\s\S]*?escalation\./g;
const OPS_FILLER =
  /Hosted price fields in our facts table come from vendor list pages[\s\S]*?shadow-mode dual writes during migration\./g;

function cleanBody(body: string): string {
  return body
    .replace(POC_BLOCK, " ")
    .replace(CATEGORY_BLOCK, " ")
    .replace(VENDOR_CHART_BLOCK, " ")
    .replace(ECOSYSTEM_FILLER, " ")
    .replace(HYBRID_FILLER, " ")
    .replace(OPS_FILLER, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function dedupeSummary(summary: string, body: string): string {
  const firstSentence = summary.split(/(?<=[.!?])\s+/)[0]?.trim();
  if (!firstSentence || firstSentence.length < 40) return body;
  if (body.startsWith(firstSentence)) {
    const rest = body.slice(firstSentence.length).trim();
    return rest || firstSentence;
  }
  return body;
}

export function sanitizeAlternativeSections(
  slug: AlternativeSlug | "laya",
  summary: string,
  sections: AlternativeSection[],
): AlternativeSection[] {
  const extra = UNIQUE_PROSE[slug] ?? [];
  const cleaned = sections
    .map((section) => {
      let h = section.h;
      if (/^When to choose /.test(h)) {
        h = "Fit and tradeoffs";
      }
      let body = cleanBody(section.body);
      if (h.startsWith("What ")) {
        body = dedupeSummary(summary, body);
      }
      if (h === "Ecosystem links" && body.length < 40) {
        body =
          "Use the catalog listing and sibling comparison pages when you need a second opinion. Each page is independent writing on jev.aitools.fyi.";
      }
      return { ...section, h, body };
    })
    .filter((s) => s.body.length >= 24 || s.code);

  if (extra.length) {
    cleaned.push({
      h: "Product-specific notes",
      body: extra.join(" "),
    });
  }

  return cleaned;
}

export function countUniqueSentences(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return 0;
  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 12);
  return new Set(sentences).size;
}
