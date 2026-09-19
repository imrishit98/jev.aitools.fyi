import { AppLink } from "@/components/app-link";
import { Code2, ExternalLink, Star } from "lucide-react";
import type { DirectoryItem } from "@/data/types";
import { getCategory } from "@/data/categories";
import { CreatorCredit } from "@/components/creator-credit";
import { ItemBadges } from "@/components/item-badges";
import { ButtonLink } from "@/components/button-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ItemCard({
  item,
  className,
}: {
  item: DirectoryItem;
  className?: string;
}) {
  const cat = getCategory(item.category);

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden border-border/80 bg-card shadow-sm surface-card-hover",
        className,
      )}
    >
      <CardHeader className="gap-2 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-normal text-[10px]">
            {cat?.title ?? item.category}
          </Badge>
          {item.language && (
            <Badge variant="secondary" className="font-mono text-[10px]">
              {item.language}
            </Badge>
          )}
          {typeof item.stars === "number" && item.stars > 0 && (
            <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
              <Star
                className="size-3 fill-amber-400/90 text-amber-500/90"
                aria-hidden
              />
              {item.stars.toLocaleString()}
            </span>
          )}
        </div>
        <ItemBadges item={item} />
        <CardTitle className="text-base font-semibold leading-snug tracking-tight">
          <AppLink
            href={`/items/${item.slug}`}
            className="after:absolute after:inset-0 hover:text-primary focus-visible:text-primary"
          >
            {item.title}
          </AppLink>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {item.oneLiner}
        </CardDescription>
        <CreatorCredit item={item} className="pt-0.5" />
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5 pt-0">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </CardContent>
      <CardFooter className="relative z-10 mt-auto flex gap-2 border-t border-border/60 bg-muted/20 pt-3">
        <ButtonLink href={`/items/${item.slug}`} size="sm" variant="secondary">
          Details
        </ButtonLink>
        {item.demoUrl && (
          <ButtonLink href={item.demoUrl} size="sm" variant="outline" external>
            <ExternalLink className="size-3.5" />
            Demo
          </ButtonLink>
        )}
        {!item.demoUrl && item.repoUrl && (
          <span className="ml-auto text-muted-foreground">
            <Code2 className="size-4 opacity-60" aria-hidden />
          </span>
        )}
      </CardFooter>
    </Card>
  );
}

export function ItemCardSkeleton() {
  return (
    <Card className="border-border/80 bg-card/80 shadow-sm">
      <CardHeader className="gap-3">
        <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </CardHeader>
    </Card>
  );
}
