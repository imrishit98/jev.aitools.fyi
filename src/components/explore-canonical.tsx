import { useEffect } from "react";
import { categoryCanonicalFromExploreParams } from "@/lib/explore-canonical";
import { absoluteUrl } from "@/lib/seo";

type Props = {
  params: URLSearchParams;
};

/** Sync canonical link when explore duplicates a category hub URL. */
export function ExploreCanonical({ params }: Props) {
  useEffect(() => {
    const path = categoryCanonicalFromExploreParams(params);
    if (!path) return;
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = absoluteUrl(path);
  }, [params]);

  return null;
}
