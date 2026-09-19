import { AppLink } from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { getFeaturedItems } from "@/lib/items";
import { ItemCard } from "@/components/item-card";

export function FeaturedRail() {
  const featured = getFeaturedItems(6);

  return (
    <section aria-labelledby="featured-heading" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Staff picks
          </p>
          <h2
            id="featured-heading"
            className="mt-1 font-heading text-2xl font-semibold sm:text-3xl"
          >
            Featured this week
          </h2>
        </div>
        <AppLink
          href="/explore?sort=featured"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary"
        >
          See all featured
          <ArrowRight className="size-4" />
        </AppLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {featured.map((item) => (
          <ItemCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
