import { siteConfig } from "@/lib/site";

export const OUTBOUND_REF_VALUE = "jev.aitools.fyi";

const REF_PARAM = "ref";

/** Hosts that must not get ?ref= (X media, embeds, share targets). */
const SKIP_REF_HOST_SUFFIXES = [
  "twitter.com",
  "x.com",
  "twimg.com",
  "fxtwitter.com",
  "fixupx.com",
  "vxtwitter.com",
];

function parseHttpUrl(href: string): URL | null {
  try {
    if (!href || href.startsWith("#") || href.startsWith("/")) return null;
    if (!/^https?:\/\//i.test(href)) return null;
    return new URL(href);
  } catch {
    return null;
  }
}

function hostnameOf(href: string): string | null {
  return parseHttpUrl(href)?.hostname.toLowerCase() ?? null;
}

export function isOutboundHttpUrl(href: string): boolean {
  const url = parseHttpUrl(href);
  if (!url) return false;
  const siteHost = new URL(siteConfig.url).hostname.toLowerCase();
  return url.hostname.toLowerCase() !== siteHost;
}

export function shouldSkipOutboundRef(href: string): boolean {
  const host = hostnameOf(href);
  if (!host) return true;
  return SKIP_REF_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  );
}

/**
 * Append directory ref for outbound product and repo links. Preserves existing query params (UTMs).
 */
export function withOutboundRef(href: string): string {
  const url = parseHttpUrl(href);
  if (!url || !isOutboundHttpUrl(href) || shouldSkipOutboundRef(href)) {
    return href;
  }
  if (!url.searchParams.has(REF_PARAM)) {
    url.searchParams.set(REF_PARAM, OUTBOUND_REF_VALUE);
  }
  return url.toString();
}

/** Use noopener only when we want Referer + ref attribution; noreferrer blocks both. */
export function externalLinkRel(href: string): string {
  if (shouldSkipOutboundRef(href)) return "noopener noreferrer";
  return "noopener";
}

/** rel for paid sponsor outbound links (keeps ref attribution via noopener, not noreferrer). */
export function sponsorLinkRel(href: string): string {
  if (shouldSkipOutboundRef(href)) return "sponsored noopener noreferrer";
  return "sponsored noopener";
}
