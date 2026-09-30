import { agentGuideSlugs, agentGuides, agentGuidesHub } from "@/data/agent-guides";
import { categoryEnrichmentBySlug } from "@/data/category-enrichment";
import { categories } from "@/data/categories";
import { learnGuideSlugs, learnGuides } from "@/data/learn-guides";
import { listingEnrichmentBySlug } from "@/data/listing-enrichment";
import { listingSeoCopy } from "@/data/listing-seo-copy";
import {
  layaVsJevGuideSlugs,
  layaVsJevGuides,
  layaVsJevHub,
} from "@/data/laya-vs-jev-guides";
import { productProfilesBySlug } from "@/data/product-profiles";

export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;

export type RawMetaField = {
  id: string;
  kind: "title" | "description";
  value: string;
};

function push(
  fields: RawMetaField[],
  id: string,
  kind: RawMetaField["kind"],
  value: string | undefined,
) {
  if (!value) return;
  fields.push({ id, kind, value });
}

/** Source strings that become titles and meta descriptions, before any silent trim. */
export function collectRawMetaFields(): RawMetaField[] {
  const fields: RawMetaField[] = [];

  for (const [slug, profile] of Object.entries(productProfilesBySlug)) {
    push(fields, `product:${slug}:metaTitle`, "title", profile.metaTitle);
    push(fields, `product:${slug}:metaDescription`, "description", profile.metaDescription);
  }

  for (const [slug, enrichment] of Object.entries(listingEnrichmentBySlug)) {
    push(fields, `listing:${slug}:metaTitle`, "title", enrichment.metaTitle);
    push(fields, `listing:${slug}:metaDescription`, "description", enrichment.metaDescription);
  }

  for (const [slug, copy] of Object.entries(listingSeoCopy)) {
    push(fields, `listing-seo:${slug}:metaTitle`, "title", copy.metaTitle);
    push(fields, `listing-seo:${slug}:metaDescription`, "description", copy.metaDescription);
  }

  for (const cat of categories) {
    push(fields, `category:${cat.slug}:seoTitle`, "title", cat.seoTitle);
    push(fields, `category:${cat.slug}:seoDescription`, "description", cat.seoDescription);
  }

  for (const [slug, enrichment] of Object.entries(categoryEnrichmentBySlug)) {
    if (!enrichment) continue;
    push(fields, `category-enrichment:${slug}:seoTitle`, "title", enrichment.seoTitle);
    push(
      fields,
      `category-enrichment:${slug}:seoDescription`,
      "description",
      enrichment.seoDescription,
    );
  }

  for (const slug of learnGuideSlugs) {
    const guide = learnGuides[slug];
    push(fields, `learn:${slug}:seoTitle`, "title", guide.seoTitle);
    push(fields, `learn:${slug}:seoDescription`, "description", guide.seoDescription);
  }

  push(fields, "laya-hub:seoTitle", "title", layaVsJevHub.seoTitle);
  push(fields, "laya-hub:seoDescription", "description", layaVsJevHub.seoDescription);
  for (const slug of layaVsJevGuideSlugs) {
    const guide = layaVsJevGuides[slug];
    push(fields, `laya:${slug}:seoTitle`, "title", guide.seoTitle);
    push(fields, `laya:${slug}:seoDescription`, "description", guide.seoDescription);
  }

  push(fields, "agent-hub:seoTitle", "title", agentGuidesHub.seoTitle);
  push(fields, "agent-hub:seoDescription", "description", agentGuidesHub.seoDescription);
  for (const slug of agentGuideSlugs) {
    const guide = agentGuides[slug];
    push(fields, `agent:${slug}:seoTitle`, "title", guide.seoTitle);
    push(fields, `agent:${slug}:seoDescription`, "description", guide.seoDescription);
  }

  return fields;
}

export function metaFieldViolations(fields: RawMetaField[] = collectRawMetaFields()): RawMetaField[] {
  return fields.filter((field) => {
    const max = field.kind === "title" ? META_TITLE_MAX : META_DESCRIPTION_MAX;
    return field.value.length > max;
  });
}
