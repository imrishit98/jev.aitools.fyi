import { siteConfig } from "@/lib/site";

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

const ogImage = "/og.svg";

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
}: PageSeo) {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} · ${siteConfig.name}`;
  return {
    title: fullTitle,
    description,
    canonical: url,
    og: {
      title: fullTitle,
      description,
      url,
      type,
      image: absoluteUrl(ogImage),
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
