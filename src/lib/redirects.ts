import { items } from "@/data/items/index";
import { redirectTargetForLegacyItem } from "@/lib/item-paths";

function isAbsoluteUrl(target: string): boolean {
  return /^https?:\/\//i.test(target);
}

/**
 * Cloudflare Pages `_redirects` (301) for retired `/items/*` URLs.
 */
export function generateRedirectsFile(): string {
  const lines: string[] = [
    "# Pass 2: retire /items/* detail URLs",
    "/items /explore 301",
  ];

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
  return items.length + 1;
}
