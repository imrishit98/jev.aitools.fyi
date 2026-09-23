import { items } from "@/data/items/index";
import { redirectTargetForLegacyItem } from "@/lib/item-paths";

/**
 * Cloudflare Pages `_redirects` (301) for retired `/items/*` URLs.
 */
/** Non-catalog 301 rules (hub + shortcuts); keep in sync with verify-seo-artifacts redirect count. */
export const EXTRA_REDIRECT_RULES = [
  "/items /explore 301",
  "/guides/index /guides 301",
  "/mfm /demos/my-first-million 301",
  "/mfm/ /demos/my-first-million 301",
];

/**
 * Strip trailing slashes site-wide (after explicit rules above).
 * Cloudflare Pages: `:splat` is the path before the final `/`.
 */
export const TRAILING_SLASH_REDIRECT_RULE = "/*/ /:splat 301";

export function generateRedirectsFile(): string {
  const lines: string[] = [
    "# Pass 2: retire /items/* detail URLs",
    ...EXTRA_REDIRECT_RULES,
  ];
  const seenFrom = new Set<string>();

  for (const item of items) {
    const from = `/items/${item.slug}`;
    if (seenFrom.has(from)) continue;
    seenFrom.add(from);

    const target = redirectTargetForLegacyItem(item);
    lines.push(`${from} ${target} 301`);
  }

  lines.push("# Trailing slash removal (must be last; first match wins)");
  lines.push(TRAILING_SLASH_REDIRECT_RULE);

  return `${lines.join("\n")}\n`;
}

export function countItemRedirects(): number {
  return items.length + EXTRA_REDIRECT_RULES.length + 1;
}
