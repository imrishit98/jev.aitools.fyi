import type { ShowcaseDemo } from "@/data/showcase-demos";
import type { DirectoryItem } from "@/data/types";
import type { FaqEntry } from "@/data/faq";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { getItemPath, hrefForListing } from "@/lib/item-paths";
import { itemHasDetailPage } from "@/lib/content-policy";

const publisherOrg = {
  "@type": "Organization" as const,
  name: "Southern East Inc.",
  url: siteConfig.parentBrand.url,
  brand: {
    "@type": "Brand",
    name: siteConfig.hostnameBrand,
    alternateName: siteConfig.name,
  },
};

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.hostnameBrand,
    alternateName: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en-US",
    publisher: publisherOrg,
    author: {
      "@type": "Person",
      name: "Rishit Patel",
      url: "https://twitter.com/imrishit98",
      sameAs: ["https://twitter.com/imrishit98"],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/explore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    ...publisherOrg,
    sameAs: [siteConfig.parentBrand.url, siteConfig.githubRepo],
  };
}

export function faqPageJsonLd(faq: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function itemListJsonLd(
  items: DirectoryItem[],
  options?: { name?: string; url?: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options?.name ?? siteConfig.name,
    description: siteConfig.description,
    url: options?.url ?? `${siteConfig.url}/explore`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: itemHasDetailPage(item)
        ? absoluteUrl(getItemPath(item))
        : item.url,
    })),
  };
}

export function softwareApplicationJsonLd(
  item: DirectoryItem,
  options?: { description?: string },
) {
  const detailUrl = absoluteUrl(getItemPath(item));
  const description = options?.description ?? item.description;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title,
    description,
    applicationCategory: "DeveloperApplication",
    url: item.url,
    mainEntityOfPage: detailUrl,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(item.repoUrl ? { codeRepository: item.repoUrl } : {}),
    author: item.creatorName
      ? { "@type": "Person", name: item.creatorName }
      : undefined,
  };
}

export function creativeWorkJsonLd(item: DirectoryItem) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description,
    url: absoluteUrl(getItemPath(item)),
    mainEntityOfPage: absoluteUrl(getItemPath(item)),
  };
}

export function listingJsonLd(
  item: DirectoryItem,
  options?: { description?: string },
) {
  if (item.category === "guides") {
    return creativeWorkJsonLd(item);
  }
  return softwareApplicationJsonLd(item, options);
}

export function learnArticleJsonLd(guide: {
  title: string;
  description: string;
  slug: string;
}) {
  const url = absoluteUrl(`/learn/${guide.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: "Rishit Patel",
      url: "https://twitter.com/imrishit98",
    },
    publisher: publisherOrg,
    inLanguage: "en-US",
  };
}

export function agentGuideArticleJsonLd(guide: {
  title: string;
  tagline: string;
  slug: string;
}) {
  const url = absoluteUrl(`/guides/jev-with-ai-agents/${guide.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.tagline,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: "Rishit Patel",
      url: "https://twitter.com/imrishit98",
    },
    publisher: publisherOrg,
    inLanguage: "en-US",
  };
}

export function layaVsJevArticleJsonLd(guide: {
  title: string;
  tagline: string;
  slug: string;
}) {
  const url = absoluteUrl(`/learn/laya-vs-jev/${guide.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.tagline,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: "Rishit Patel",
      url: "https://twitter.com/imrishit98",
    },
    publisher: publisherOrg,
    inLanguage: "en-US",
  };
}

export function demoVideoJsonLd(demo: ShowcaseDemo) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: demo.title,
    description: demo.funnyBlurb,
    thumbnailUrl: demo.posterUrl.startsWith("http")
      ? demo.posterUrl
      : absoluteUrl(demo.posterUrl),
    contentUrl: demo.hasLocalVideo
      ? demo.videoUrl.startsWith("http")
        ? demo.videoUrl
        : absoluteUrl(demo.videoUrl)
      : demo.posterUrl.startsWith("http")
        ? demo.posterUrl
        : absoluteUrl(demo.posterUrl),
    embedUrl: demo.tweetUrl,
    uploadDate: "2026-09-19",
    author: {
      "@type": "Person",
      name: demo.authorName,
      url: `https://x.com/${demo.authorHandle}`,
    },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}