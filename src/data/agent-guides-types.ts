import type { FaqEntry } from "@/data/faq";

export type AgentGuideSource = { label: string; url: string };

export type AgentGuideSection = {
  h: string;
  body: string;
  code?: { lang: string; content: string };
};

export type AgentGuide = {
  slug: string;
  title: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  whyJev: string;
  sections: AgentGuideSection[];
  faq: FaqEntry[];
  relatedCatalogSlugs: string[];
  relatedAgentSlugs?: string[];
  sources: AgentGuideSource[];
};
