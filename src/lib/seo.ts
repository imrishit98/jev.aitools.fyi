import { siteConfig } from "@/lib/site";

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imagePath?: string;
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const ogImagePaths = {
  home: "/og/home.png",
  default: "/og/default.png",
  explore: "/og/explore.png",
  learnHub: "/og/learn/index.png",
  learnTopic: (slug: string) => `/og/learn/${slug}.png`,
  category: (slug: string) => `/og/categories/${slug}.png`,
  item: (slug: string) => `/og/items/${slug}.png`,
} as const;

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageSeo({
  title,
  description,
  path,
  type = "website",
  imagePath = ogImagePaths.default,
}: PageSeo) {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} · ${siteConfig.name}`;
  const image = absoluteUrl(imagePath);
  return {
    title: fullTitle,
    description,
    canonical: url,
    imagePath,
    og: {
      title: fullTitle,
      description,
      url,
      type,
      image,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    },
  };
}

export function parseItemLastModified(updatedAt?: string): Date {
  if (updatedAt) {
    const parsed = new Date(updatedAt);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}
