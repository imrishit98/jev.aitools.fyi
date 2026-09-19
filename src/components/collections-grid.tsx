import { AppLink } from "@/components/app-link";
import { collections } from "@/data/collections";
import { ArrowRight } from "lucide-react";

export function CollectionsGrid() {
  return (
    <section aria-labelledby="collections-heading" className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Collections
        </p>
        <h2 id="collections-heading" className="mt-1 font-heading text-2xl font-semibold sm:text-3xl">
          Shortcuts that actually save time
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <AppLink
            key={c.slug}
            href={c.href}
            className="surface-card surface-card-hover group flex flex-col p-5"
          >
            <p className="font-semibold tracking-tight group-hover:text-primary">
              {c.title}
            </p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {c.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Browse
              <ArrowRight className="size-3.5" />
            </span>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
