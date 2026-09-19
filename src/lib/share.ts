import { siteConfig } from "@/lib/site";

const X_VIA = "typesafeai";
const DEFAULT_HASHTAGS = ["Jev", "TypeSafe"];

export type ShareOptions = {
  /** Path (e.g. `/showcase`) or absolute URL */
  url: string;
  /** Short label for native share / accessibility */
  title: string;
  /** Prefill for X intent (keep under ~240 chars with URL) */
  tweetText: string;
  hashtags?: string[];
  via?: string;
};

export function absoluteShareUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = siteConfig.url.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function buildXShareUrl(options: ShareOptions): string {
  const pageUrl = absoluteShareUrl(options.url);
  const text = `${options.tweetText} ${pageUrl}`;
  const params = new URLSearchParams({
    text,
  });
  const via = options.via ?? X_VIA;
  if (via) params.set("via", via);
  const tags = options.hashtags ?? DEFAULT_HASHTAGS;
  if (tags.length) params.set("hashtags", tags.join(","));
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function buildLinkedInShareUrl(pathOrUrl: string): string {
  const pageUrl = absoluteShareUrl(pathOrUrl);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
}

export function homeShareOptions(): ShareOptions {
  return {
    url: "/",
    title: siteConfig.shortName,
    tweetText:
      "The homepage for Jev: watch wild demos, map the tools, learn System One without another chat essay.",
  };
}

export function showcasePageShareOptions(): ShareOptions {
  return {
    url: "/showcase",
    title: "Jev showcase",
    tweetText:
      "Real builders, real clips: ad blockers with opinions, chess that scores moves, Gmail intent gates. Your group chat needs this wall.",
  };
}

export function demoShareOptions(demo: {
  id: string;
  title: string;
  authorHandle: string;
}): ShareOptions {
  return {
    url: `/showcase?demo=${encodeURIComponent(demo.id)}`,
    title: demo.title,
    tweetText: `"${demo.title}" on the Jev wall (@${demo.authorHandle} shipped it). Steal the pattern, tag TypeSafe if you remix.`,
  };
}

export function itemShareOptions(item: {
  title: string;
  oneLiner: string;
  path: string;
}): ShareOptions {
  return {
    url: item.path,
    title: item.title,
    tweetText: `${item.title}: ${item.oneLiner} Found it on the Jev directory.`,
  };
}

export function learnShareOptions(guide: {
  title: string;
  topic: string;
  description: string;
}): ShareOptions {
  return {
    url: `/learn/${guide.topic}`,
    title: guide.title,
    tweetText: `${guide.title}. ${guide.description} (Jev learn hub, no fluff).`,
  };
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
