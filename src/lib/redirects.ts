import { items } from "@/data/items/index";
import { redirectTargetForLegacyItem } from "@/lib/item-paths";

/**
 * Cloudflare Pages `_redirects` (301) for retired `/items/*` URLs.
 */
/** Non-catalog 301 rules (hub + shortcuts); keep in sync with verify-seo-artifacts redirect count. */
export const EXTRA_REDIRECT_RULES = [
  "/items /explore 301",
  "/guides/index /guides 301",
  "/guides/ /guides 301",
  "/learn/laya-vs-jev/ /learn/laya-vs-jev 301",
  "/mfm /demos/my-first-million 301",
  "/mfm/ /demos/my-first-million 301",
  "/demos/my-first-million/ /demos/my-first-million 301",
];

export function generateRedirectsFile(): string {
  const lines: string[] = ["# Pass 2: retire /items/* detail URLs", ...EXTRA_REDIRECT_RULES];
  const seenFrom = new Set<string>();

  for (const item of items) {
    const from = `/items/${item.slug}`;
    if (seenFrom.has(from)) continue;
    seenFrom.add(from);

    const target = redirectTargetForLegacyItem(item);
    lines.push(`${from} ${target} 301`);
  }

  return `${lines.join("\n")}\n`;
}

export function countItemRedirects(): number {
  return items.length + EXTRA_REDIRECT_RULES.length;
}
