import type { DirectoryItem } from "../types";
import catalog from "../catalog.json";

export const items: DirectoryItem[] = catalog as DirectoryItem[];

export function getCatalogItems(): DirectoryItem[] {
  return items;
}
