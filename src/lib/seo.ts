import { categories } from "@/data/categories-data";
import { getCategoryEnrichment } from "@/lib/category-enrichment";
import {
  agentGuideSlugs,
  agentGuides,
  agentGuidesHub,
  type AgentGuide,
} from "@/data/agent-guides";
import { learnGuideSlugs, learnGuides } from "@/data/learn-guides";
import type { CategoryMeta, CategorySlug, DirectoryItem } from "@/data/types";
import { getItemPath, getItemDetailSegment } from "@/lib/item-paths";
import { getDirectoryStats, getItemsWithDetailPages } from "@/lib/items";
import {
  getProductProfile,
  productProfileSeoDescription,
  productProfileSeoTitle,
} from "@/lib/product-profiles";
import { getListingEnrichment } from "@/lib/listing-enrichment";
import { siteConfig } from "@/lib/site";

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imagePath?: string;
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const ogImagePaths = {
  home: "/og/home.png",
  default: "/og/default.png",
  explore: "/og/explore.png",
  showcase: "/og/showcase.png",
  learnHub: "/og/learn/index.png",
  learnTopic: (slug: string) => `/og/learn/${slug}.png`,
  category: (slug: string) => `/og/categories/${slug}.png`,
  item: (slug: string) => `/og/items/${slug}.png`,
} as const;

const TITLE_BRAND = siteConfig.shortName;
const MAX_DOCUMENT_TITLE = 60;

function capDocumentTitle(full: string): string {
  if (full.length <= MAX_DOCUMENT_TITLE) return full;
  const pipe = full.lastIndexOf(" | ");
  if (pipe > 20) {
    const suffix = full.slice(pipe);
    const maxCore = MAX_DOCUMENT_TITLE - suffix.length;
    if (maxCore > 16) {
      const core = full.slice(0, pipe);
      const cut = core.slice(0, maxCore - 1);
      const lastSpace = cut.lastIndexOf(" ");
      const shortened =
        lastSpace > 14 ? cut.slice(0, lastSpace).trimEnd() : cut.trimEnd();
      return `${shortened}${suffix}`;
    }
  }
  const cut = full.slice(0, MAX_DOCUMENT_TITLE - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trimEnd();
}

/** Document title suffix (also used in Open Graph / Twitter titles). */
export function withBrand(title: string): string {
  const trimmed = title.trim();
  const host = siteConfig.hostnameBrand;
  if (
    trimmed.includes(`| ${TITLE_BRAND}`) ||
    trimmed.includes(`| ${host}`) ||
    trimmed.includes(`| ${siteConfig.name}`)
  ) {
    return capDocumentTitle(trimmed);
  }
  if (trimmed.includes(TITLE_BRAND) || trimmed.includes(siteConfig.name)) {
    return capDocumentTitle(trimmed);
  }
  return capDocumentTitle(`${trimmed} | ${TITLE_BRAND}`);
}

export function formatDocumentTitle(title: string): string {
  return withBrand(title);
}

export function stripEmDash(text: string): string {
  return text
    .replace(/\u2014/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function trimMetaDescription(text: string, max = 160): string {
  let t = stripEmDash(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed =
    lastSpace > 100 ? cut.slice(0, lastSpace).trimEnd() : cut.trimEnd();
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageSeo({
  title,
  description,
  path,
  type = "website",
  imagePath = ogImagePaths.default,
}: PageSeo) {
  const url = absoluteUrl(path);
  const fullTitle = withBrand(title);
  const metaDescription = trimMetaDescription(description);
  const image = absoluteUrl(imagePath);
  return {
    title: fullTitle,
    description: metaDescription,
    canonical: url,
    imagePath,
    og: {
      title: fullTitle,
      description: metaDescription,
      url,
      type,
      image,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    },
  };
}

/** Short, complete phrase for detail page titles (fits ~60 chars with brand). */
const CATEGORY_TITLE_TAIL: Record<CategorySlug, string> = {
  official: "System One SDK",
  sdks: "TypeSafe Jev SDK",
  integrations: "TypeSafe Jev integration",
  "agent-tooling": "Jev agent and MCP tools",
  "browser-computer-use": "TypeSafe browser agent",
  applications: "Jev production app",
  games: "Jev-powered game",
  playgrounds: "live Jev demo",
  benchmarks: "Jev eval harness",
  guides: "Jev community guide",
};

const SEGMENT_LABEL: Record<
  ReturnType<typeof getItemDetailSegment>,
  string
> = {
  sdks: "SDK",
  tools: "tool",
  apps: "app",
  games: "game",
  benchmarks: "benchmark",
  guides: "guide",
};

const BRAND_SUFFIX = ` | ${TITLE_BRAND}`;
const MAX_TITLE_CORE = Math.max(28, MAX_DOCUMENT_TITLE - BRAND_SUFFIX.length);

const SLUG_STOP_WORDS = new Set([
  "jev",
  "typesafe",
  "ai",
  "the",
  "and",
  "for",
  "with",
]);

function slugDisambiguator(slug: string): string {
  const parts = slug
    .split("-")
    .filter((p) => p.length > 2 && !SLUG_STOP_WORDS.has(p));
  if (parts.length >= 2) return parts.slice(-2).join(" ");
  if (parts.length === 1) return parts[0]!;
  return slug.replace(/-/g, " ").slice(0, 24);
}

function shortenTitleCore(core: string): string {
  if (core.length <= MAX_TITLE_CORE) return core;
  const cut = core.slice(0, MAX_TITLE_CORE - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trimEnd();
}

function draftItemTitleCore(
  item: DirectoryItem,
  disambiguator?: string,
): string {
  const tail = CATEGORY_TITLE_TAIL[item.category];
  const name = disambiguator
    ? `${item.title} (${disambiguator})`
    : item.title;
  const candidates = [`${name}: ${tail}`, `${item.title}: ${tail}`, name, item.title];
  for (const candidate of candidates) {
    if (withBrand(candidate).length <= 60) return candidate;
  }
  return shortenTitleCore(item.title);
}

function draftItemDescription(item: DirectoryItem): string {
  const profile = getProductProfile(item.slug);
  if (profile) {
    return trimMetaDescription(productProfileSeoDescription(profile));
  }
  const oneLiner = stripEmDash(item.oneLiner);
  const body = stripEmDash(item.description ?? "");
  if (body.length >= 100 && body !== oneLiner) {
    return trimMetaDescription(body);
  }
  if (oneLiner.length >= 100) {
    return trimMetaDescription(oneLiner);
  }
  return trimMetaDescription(
    `${oneLiner} ${item.title} uses TypeSafe Jev for typed decisions, not chatty labels.`,
  );
}

type ListingMetaDraft = { titleCore: string; description: string };

function buildUniqueListingMetaMap(): Map<string, ListingMetaDraft> {
  const items = getItemsWithDetailPages();
  const map = new Map<string, ListingMetaDraft>();

  for (const item of items) {
    const profile = getProductProfile(item.slug);
    const enrichment = getListingEnrichment(item.slug);
    map.set(item.slug, {
      titleCore: profile
        ? productProfileSeoTitle(item, profile)
        : enrichment?.metaTitle
          ? stripEmDash(enrichment.metaTitle)
          : draftItemTitleCore(item),
      description: enrichment?.metaDescription
        ? trimMetaDescription(stripEmDash(enrichment.metaDescription))
        : draftItemDescription(item),
    });
  }

  const resolveDuplicates = (
    key: (draft: ListingMetaDraft) => string,
    fix: (item: DirectoryItem, draft: ListingMetaDraft) => ListingMetaDraft,
  ) => {
    let changed = true;
    while (changed) {
      changed = false;
      const buckets = new Map<string, DirectoryItem[]>();
      for (const item of items) {
        const draft = map.get(item.slug)!;
        const k = key(draft);
        const bucket = buckets.get(k) ?? [];
        bucket.push(item);
        buckets.set(k, bucket);
      }
      for (const group of buckets.values()) {
        if (group.length < 2) continue;
        for (let i = 1; i < group.length; i++) {
          const item = group[i]!;
          const prev = map.get(item.slug)!;
          const next = fix(item, prev);
          if (next.titleCore !== prev.titleCore || next.description !== prev.description) {
            map.set(item.slug, next);
            changed = true;
          }
        }
      }
    }
  };

  resolveDuplicates(
    (d) => withBrand(d.titleCore),
    (item, draft) => ({
      ...draft,
      titleCore: draftItemTitleCore(item, slugDisambiguator(item.slug)),
    }),
  );

  resolveDuplicates(
    (d) => d.description,
    (item, draft) => ({
      ...draft,
      description: trimMetaDescription(
        `${stripEmDash(item.oneLiner)} Listing id ${item.slug.replace(/-/g, " ")} on Jev Directory.`,
      ),
    }),
  );

  return map;
}

let listingMetaBySlug: Map<string, ListingMetaDraft> | null = null;

function getListingMeta(item: DirectoryItem): ListingMetaDraft {
  if (!listingMetaBySlug) {
    listingMetaBySlug = buildUniqueListingMetaMap();
  }
  return (
    listingMetaBySlug.get(item.slug) ?? {
      titleCore: draftItemTitleCore(item),
      description: draftItemDescription(item),
    }
  );
}

export function itemListingSeo(item: DirectoryItem) {
  const path = getItemPath(item);
  const { titleCore, description } = getListingMeta(item);

  return pageSeo({
    title: titleCore,
    description,
    path,
    type: "article",
    imagePath: ogImagePaths.item(item.slug),
  });
}

export function homePageSeo() {
  return pageSeo({
    title: "Jev Directory: demos, tools, and learn guides",
    description:
      "Browse SDKs, integrations, and demos built on TypeSafe Jev. Watch builder clips, read free guides, and explore the curated tool map.",
    path: "/",
    imagePath: ogImagePaths.home,
  });
}

export function showcasePageSeo() {
  return pageSeo({
    title: "Jev demo showcase: seven real builder clips",
    description:
      "Watch curated X demos of Jev in the wild: generative UI, Zillow search, design experiments, geo maps, lurk.so, and SEO workflows. Clips hosted for fast playback.",
    path: "/showcase",
    imagePath: ogImagePaths.showcase,
  });
}

export function explorePageSeo() {
  const stats = getDirectoryStats();
  return pageSeo({
    title: `Explore ${stats.total} Jev tools: faceted System One search`,
    description:
      "Filter TypeSafe Jev projects by category, language, demos, MCP, and GitHub stars. Search SDKs, agent routers, integrations, and live demos in one directory.",
    path: "/explore",
    imagePath: ogImagePaths.explore,
  });
}

export function developersPageSeo() {
  return pageSeo({
    title: "Developers and agents: OpenAPI, llms.txt, and discovery",
    description:
      "How agents read Jev.aitools.fyi: OpenAPI, llms.txt, sitemap, search-index.json, Markdown negotiation on /, and structured JSON errors for unknown /api/* routes.",
    path: "/developers",
    imagePath: ogImagePaths.default,
  });
}

export function forAgentsPageSeo() {
  return pageSeo({
    title: "For agents: crawl map and discovery URLs",
    description:
      "Markdown-friendly entry for AI agents: llms.txt, OpenAPI, search-index.json, sitemap, and how to negotiate Markdown on the homepage.",
    path: "/for-agents",
    imagePath: ogImagePaths.default,
  });
}

export function aboutPageSeo() {
  return pageSeo({
    title: "About Jev Directory: curation and TypeSafe ecosystem",
    description:
      "How jev.aitools.fyi indexes TypeSafe Jev and System One projects, who publishes it, and how we handle affiliation with TypeSafe AI. Read our curation standards.",
    path: "/about",
  });
}

export function submitPageSeo() {
  return pageSeo({
    title: "Submit a Jev listing: add your tool to the directory",
    description:
      "Suggest a Jev SDK, MCP server, integration, demo, or guide for the public directory. Opens a structured GitHub issue so we can review and index your project.",
    path: "/submit",
  });
}

export function categoryPageSeo(
  cat: CategoryMeta,
  overrides?: { title?: string; description?: string },
) {
  return pageSeo({
    title: overrides?.title ?? cat.seoTitle,
    description: overrides?.description ?? cat.seoDescription,
    path: `/categories/${cat.slug}`,
    imagePath: ogImagePaths.category(cat.slug),
  });
}

export function guidesIndexPageSeo() {
  return pageSeo({
    title: "Guides: Jev agent setup and community articles",
    description:
      "Browse the Jev with AI agents hub (Hermes, LangChain, Cline, Copilot, Cursor, and more) plus community guide listings hosted on the directory. Links to Learn primers and official TypeSafe docs.",
    path: "/guides",
    imagePath: ogImagePaths.learnHub,
  });
}

export function learnIndexPageSeo() {
  return pageSeo({
    title: "Learn TypeSafe Jev: System One guides and primers",
    description:
      "Free guides on Choice, Score, and Noul, System One architecture, Jev vs LLM classification, Vercel AI Gateway Jev, and real production use cases. Start learning Jev here.",
    path: "/learn",
    imagePath: ogImagePaths.learnHub,
  });
}

export function learnTopicPageSeo(guide: {
  slug: string;
  seoTitle: string;
  seoDescription: string;
}) {
  return pageSeo({
    title: guide.seoTitle,
    description: guide.seoDescription,
    path: `/learn/${guide.slug}`,
    type: "article",
    imagePath: ogImagePaths.learnTopic(guide.slug),
  });
}

export function agentGuidesHubSeo() {
  return pageSeo({
    title: agentGuidesHub.seoTitle,
    description: agentGuidesHub.seoDescription,
    path: "/guides/jev-with-ai-agents",
    type: "article",
    imagePath: ogImagePaths.learnHub,
  });
}

export function agentGuidePageSeo(guide: AgentGuide) {
  return pageSeo({
    title: guide.seoTitle,
    description: guide.seoDescription,
    path: `/guides/jev-with-ai-agents/${guide.slug}`,
    type: "article",
    imagePath: ogImagePaths.default,
  });
}

export function parseItemLastModified(updatedAt?: string): Date {
  if (updatedAt) {
    const parsed = new Date(updatedAt);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

/** All indexable routes for uniqueness checks (build script). */
export function collectIndexableMeta(): { path: string; title: string; description: string }[] {
  const rows: { path: string; title: string; description: string }[] = [];

  const push = (path: string, title: string, description: string) => {
    rows.push({ path, title, description });
  };

  const home = homePageSeo();
  push("/", home.title, home.description);
  const explore = explorePageSeo();
  push("/explore", explore.title, explore.description);
  const about = aboutPageSeo();
  push("/about", about.title, about.description);
  const submit = submitPageSeo();
  push("/submit", submit.title, submit.description);
  const showcase = showcasePageSeo();
  push("/showcase", showcase.title, showcase.description);

  for (const cat of categories) {
    const enrichment = getCategoryEnrichment(cat.slug);
    const seo = categoryPageSeo(cat, {
      title: enrichment?.seoTitle,
      description: enrichment?.seoDescription,
    });
    push(`/categories/${cat.slug}`, seo.title, seo.description);
  }

  const learnIndex = learnIndexPageSeo();
  push("/learn", learnIndex.title, learnIndex.description);
  const guidesIndex = guidesIndexPageSeo();
  push("/guides", guidesIndex.title, guidesIndex.description);
  for (const slug of learnGuideSlugs) {
    const guide = learnGuides[slug];
    const seo = learnTopicPageSeo(guide);
    push(`/learn/${slug}`, seo.title, seo.description);
  }

  const agentHub = agentGuidesHubSeo();
  push("/guides/jev-with-ai-agents", agentHub.title, agentHub.description);
  for (const slug of agentGuideSlugs) {
    const guide = agentGuides[slug];
    const seo = agentGuidePageSeo(guide);
    push(`/guides/jev-with-ai-agents/${slug}`, seo.title, seo.description);
  }

  for (const item of getItemsWithDetailPages()) {
    const seo = itemListingSeo(item);
    push(getItemPath(item), seo.title, seo.description);
  }

  return rows;
}
