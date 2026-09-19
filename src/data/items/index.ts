import type { DirectoryItem } from "../types";
import catalog from "../catalog.json";
import {
  buildDuplicateDemotionSet,
  resolveContentPolicy,
  summarizeContentPolicy,
  type EnrichedDirectoryItem,
} from "@/lib/content-policy";

const catalogItems = catalog as DirectoryItem[];
const duplicateDemotions = buildDuplicateDemotionSet(catalogItems);

export const items: EnrichedDirectoryItem[] =
  resolveContentPolicy(catalogItems);

export const contentPolicyStats = summarizeContentPolicy(
  items,
  duplicateDemotions,
);

export function getCatalogItems(): EnrichedDirectoryItem[] {
  return items;
}
