import type { DirectoryItem } from "@/data/types";
import type { FaqEntry } from "@/data/faq";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

const publisherOrg = {
  "@type": "Organization" as const,
  name: "Southern East Inc.",
  url: siteConfig.parentBrand.url,
  brand: {
    "@type": "Brand",
    name: siteConfig.parentBrand.name,
  },
};

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
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
      url: `${siteConfig.url}/items/${item.slug}`,
    })),
  };
}

export function softwareApplicationJsonLd(item: DirectoryItem) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title,
    description: item.description,
    applicationCategory: "DeveloperApplication",
    url: item.url,
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
    url: absoluteUrl(`/items/${item.slug}`),
    mainEntityOfPage: absoluteUrl(`/items/${item.slug}`),
  };
}

export function listingJsonLd(item: DirectoryItem) {
  if (item.category === "guides") {
    return creativeWorkJsonLd(item);
  }
  return softwareApplicationJsonLd(item);
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