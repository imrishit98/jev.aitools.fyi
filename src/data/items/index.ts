import type { DirectoryItem } from "../types";
import catalog from "../catalog.json";
import { applyCatalogOverrides } from "@/lib/apply-catalog-overrides";
import {
  buildDuplicateDemotionSet,
  resolveContentPolicy,
  summarizeContentPolicy,
  type EnrichedDirectoryItem,
} from "@/lib/content-policy";

const catalogItems = applyCatalogOverrides(catalog as DirectoryItem[]);
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
