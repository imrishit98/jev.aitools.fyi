import { AppLink } from "@/components/app-link";
import { categories } from "@/data/categories";
import { getCategoryCounts } from "@/lib/items";

export function CategoryGrid() {
  const counts = getCategoryCounts();

  return (
    <section aria-labelledby="category-grid-heading" className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Browse by job
        </p>
        <h2
          id="category-grid-heading"
          className="mt-1 font-heading text-2xl font-semibold sm:text-3xl"
        >
          Categories
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          SDKs, MCP, browser agents, games, benchmarks, and the rest. Pick a lane, then filter hard on Explore.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <AppLink
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="surface-card surface-card-hover flex items-start justify-between gap-4 p-4"
          >
            <div>
              <p className="font-semibold">{cat.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {cat.description}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-sm font-medium text-primary">
              {counts[cat.slug] ?? 0}
            </span>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
