export const CATEGORY_SLUGS = [
  "official",
  "sdks",
  "integrations",
  "agent-tooling",
  "browser-computer-use",
  "applications",
  "games",
  "playgrounds",
  "benchmarks",
  "guides",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type ItemBadge =
  | "official"
  | "featured"
  | "has-demo"
  | "mcp"
  | "sdk";

export type SourcePlatform = "x" | "github" | "official" | "web";

export type DirectoryItem = {
  slug: string;
  title: string;
  oneLiner: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  language?: string;
  stars?: number;
  url: string;
  repoUrl?: string;
  demoUrl?: string;
  postUrl?: string;
  featured?: boolean;
  badges?: ItemBadge[];
  sourceNote?: string;
  updatedAt?: string;
  verifiedNote?: string;
  creatorHandle?: string;
  creatorName?: string;
  sourcePlatform?: SourcePlatform;
};

export type CategoryMeta = {
  slug: CategorySlug;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  intro?: string;
};

export type CollectionLink = {
  slug: string;
  title: string;
  description: string;
  href: string;
};
