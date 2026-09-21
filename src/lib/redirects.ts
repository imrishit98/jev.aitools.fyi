import { items } from "@/data/items/index";
import { redirectTargetForLegacyItem } from "@/lib/item-paths";

function isAbsoluteUrl(target: string): boolean {
  return /^https?:\/\//i.test(target);
}

/**
 * Cloudflare Pages `_redirects` (301) for retired `/items/*` URLs.
 */
/** Non-catalog 301 rules (hub + shortcuts); keep in sync with verify-seo-artifacts redirect count. */
export const EXTRA_REDIRECT_RULES = [
  "/items /explore 301",
  "/mfm /demos/my-first-million/ 301",
  "/mfm/ /demos/my-first-million/ 301",
];

export function generateRedirectsFile(): string {
  const lines: string[] = ["# Pass 2: retire /items/* detail URLs", ...EXTRA_REDIRECT_RULES];

  for (const item of items) {
    const target = redirectTargetForLegacyItem(item);
    const from = `/items/${item.slug}`;
    if (isAbsoluteUrl(target)) {
      lines.push(`${from} ${target} 301`);
    } else {
      lines.push(`${from} ${target} 301`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function countItemRedirects(): number {
  return items.length + EXTRA_REDIRECT_RULES.length;
}
