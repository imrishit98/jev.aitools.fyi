import { AppLink } from "@/components/app-link";
import { categories } from "@/data/categories";
import { getCategoryCounts } from "@/lib/items";

export function CategoryGrid() {
  const counts = getCategoryCounts();

  return (
    <section aria-labelledby="category-grid-heading" className="space-y-6">
      <h2
        id="category-grid-heading"
        className="font-heading text-2xl font-semibold sm:text-3xl"
      >
        Categories
      </h2>
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
