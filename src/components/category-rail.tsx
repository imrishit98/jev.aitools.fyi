import { AppLink } from "@/components/app-link";
import { categories } from "@/data/categories";
import { getItemsByCategory } from "@/lib/items";

export function CategoryRail() {
  return (
    <section aria-labelledby="categories-heading" className="space-y-8">
      <h2
        id="categories-heading"
        className="font-heading text-2xl font-semibold sm:text-3xl"
      >
        Browse by category
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const count = getItemsByCategory(cat.slug).length;
          return (
            <AppLink
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="surface-card surface-card-hover snap-start min-w-[240px] shrink-0 px-5 py-5 sm:min-w-[260px]"
            >
              <p className="font-semibold tracking-tight">{cat.title}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
              <p className="mt-4 font-mono text-xs font-medium text-primary">
                {count} listings →
              </p>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}
