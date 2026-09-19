import { useEffect, useMemo, useState } from "react";
import type { CategorySlug } from "@/data/types";
import { CATEGORY_SLUGS } from "@/data/types";
import { categories } from "@/data/categories";
import { AppLink } from "@/components/app-link";
import { ItemCard } from "@/components/item-card";
import { ButtonLink } from "@/components/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPLORE_PAGE_SIZE,
  filterItems,
  getAllItems,
  getDirectoryStats,
  parseExploreFilters,
} from "@/lib/items";

function useUrlSearchParams() {
  const [params, setParams] = useState(
    () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""),
  );

  useEffect(() => {
    const sync = () =>
      setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const navigate = (next: URLSearchParams) => {
    const qs = next.toString();
    window.history.pushState({}, "", qs ? `/explore?${qs}` : "/explore");
    setParams(new URLSearchParams(next));
  };

  return { params, navigate };
}

export default function ExploreApp() {
  const { params, navigate } = useUrlSearchParams();
  const stats = getDirectoryStats();
  const all = getAllItems();

  const filters = useMemo(() => parseExploreFilters(params), [params]);
  const filtered = useMemo(() => filterItems(filters, all), [filters, all]);
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / EXPLORE_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * EXPLORE_PAGE_SIZE;
  const slice = filtered.slice(start, start + EXPLORE_PAGE_SIZE);

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "" || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete("page");
    navigate(next);
  }

  const category = params.get("category") as CategorySlug | null;

  return (
    <>
      <div className="surface-card space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span> matches of{" "}
            <span className="font-medium text-foreground">{stats.total}</span> listings
          </p>
          <AppLink href="/explore" className="text-sm text-primary hover:underline">
            Clear filters
          </AppLink>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search name, tag, or creator..."
              defaultValue={params.get("q") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("q", (e.target as HTMLInputElement).value || null);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category && CATEGORY_SLUGS.includes(category) ? category : "all"}
              onValueChange={(v) => updateParam("category", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sort</Label>
            <Select
              value={params.get("sort") ?? "featured"}
              onValueChange={(v) => updateParam("sort", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured first</SelectItem>
                <SelectItem value="stars">Most stars</SelectItem>
                <SelectItem value="newest">Recently updated</SelectItem>
                <SelectItem value="title">A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {(
            [
              ["demo", "Live demo"],
              ["repo", "GitHub repo"],
              ["mcp", "Jev MCP"],
              ["official", "Official TypeSafe"],
              ["featured", "Featured only"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="size-4 rounded-md border-border accent-primary"
                checked={params.get(key) === "1"}
                onChange={(e) => updateParam(key, e.target.checked ? "1" : null)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {slice.length === 0 ? (
          <div className="surface-card rounded-md border-dashed px-6 py-16 text-center">
            <p className="font-heading text-lg">No matches (yet)</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Widen a filter or{" "}
              <AppLink href="/submit" className="text-primary hover:underline">
                suggest a listing
              </AppLink>
              {" "}we are missing.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slice.map((item) => (
              <ItemCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-8"
          aria-label="Pagination"
        >
          <p className="text-sm text-muted-foreground">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            {safePage > 1 ? (
              <ButtonLink
                href={`/explore?${(() => {
                  const q = new URLSearchParams(params);
                  q.set("page", String(safePage - 1));
                  return q.toString();
                })()}`}
                variant="outline"
                size="sm"
              >
                Previous
              </ButtonLink>
            ) : (
              <span className="inline-flex h-7 items-center px-2 text-sm text-muted-foreground">
                Previous
              </span>
            )}
            {safePage < totalPages ? (
              <ButtonLink
                href={`/explore?${(() => {
                  const q = new URLSearchParams(params);
                  q.set("page", String(safePage + 1));
                  return q.toString();
                })()}`}
                size="sm"
              >
                Next
              </ButtonLink>
            ) : (
              <span className="pointer-events-none text-sm opacity-40">Next</span>
            )}
          </div>
        </nav>
      )}

      <nav
        className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground"
        aria-label="Related hubs"
      >
        <p className="font-medium text-foreground">Popular next stops</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <li>
            <AppLink href="/categories/agent-tooling" className="hover:text-primary">
              Agent tooling
            </AppLink>
          </li>
          <li>
            <AppLink href="/explore?mcp=1" className="hover:text-primary">
              Jev MCP
            </AppLink>
          </li>
          <li>
            <AppLink href="/learn/use-cases" className="hover:text-primary">
              Jev use cases
            </AppLink>
          </li>
          <li>
            <AppLink href="/" className="hover:text-primary">
              Home
            </AppLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
