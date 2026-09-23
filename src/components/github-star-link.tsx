import { externalLinkRel, withOutboundRef } from "@/lib/outbound-attribution";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

function repoApiPath(repoUrl: string): string | null {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (parts.length < 2) return null;
    return `https://api.github.com/repos/${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

export default function GitHubStarLink({ className }: { className?: string }) {
  const [stars, setStars] = useState<number | null>(null);
  const api = repoApiPath(siteConfig.githubRepo);

  useEffect(() => {
    if (!api) return;
    const controller = new AbortController();
    fetch(api, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        /* ignore: star link still works without count */
      });
    return () => controller.abort();
  }, [api]);

  const label =
    stars != null ? `Star on GitHub (${stars.toLocaleString()} stars)` : "Star on GitHub";

  return (
    <a
      href={withOutboundRef(siteConfig.githubRepo)}
      target="_blank"
      rel={externalLinkRel(siteConfig.githubRepo)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Star className="size-3.5 shrink-0 text-primary" aria-hidden />
      <span className="hidden sm:inline">Star</span>
      {stars != null ? (
        <span className="tabular-nums text-muted-foreground">{stars.toLocaleString()}</span>
      ) : null}
    </a>
  );
}
