import type { FaqEntry } from "@/data/faq";

export type AlternativeSource = { label: string; url: string };

export type AlternativeFact = {
  row: string;
  them: string;
  jev: string;
  sourceLabel: string;
  sourceUrl: string;
  /** Defaults to page lastVerified when omitted in source data. */
  checkedAt?: string;
};

export type AlternativeSection = {
  h: string;
  body: string;
  code?: { lang: string; content: string };
};

export type Alternative = {
  slug: string;
  displayName: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  keyPoint: string;
  /** Answer-first summary (2 to 3 sentences). */
  summary: string;
  lastVerified: string;
  /** Catalog listing slug when one exists. */
  listingSlug?: string;
  siblingSlugs: string[];
  facts: AlternativeFact[];
  sections: AlternativeSection[];
  whenChooseThem: string[];
  whenChooseJev: string[];
  faq: FaqEntry[];
  sources: AlternativeSource[];
  ecosystemSlugs?: string[];
};

export type AlternativesHubRankRow = {
  rank: number;
  /** Table sort order (1 = first row). Not always equal to adoption rank. */
  order: number;
  name: string;
  maker: string;
  openWeights: string;
  hostedApi: string;
  jevCompatible: string;
  sizes: string;
  inputs: string;
  decisionIndex: string;
  adoption: string;
  pagePath: string;
  group: "open" | "hosted";
  /** adoption = GitHub/HF/search signals; editorial = curator pick (e.g. Von). */
  orderingBasis: "adoption" | "editorial";
};

export type AlternativesHub = {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  summary: string;
  lastVerified: string;
  quickPicks: { need: string; pick: string; href: string }[];
  ranked: AlternativesHubRankRow[];
  faq: FaqEntry[];
  sources: AlternativeSource[];
};
