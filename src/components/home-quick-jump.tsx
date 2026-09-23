import { AppLink } from "@/components/app-link";
import { learnChips } from "@/components/home-sections";
import { ITEM_DETAIL_SEGMENTS } from "@/lib/item-paths";

const categoryChips: { href: string; label: string; hint: string }[] = [
  { href: "/categories/official", label: "Official", hint: "TypeSafe first-party" },
  { href: "/categories/sdks", label: "SDKs", hint: "Typed clients" },
  { href: "/categories/integrations", label: "Tools", hint: "Gateways & glue" },
  { href: "/categories/applications", label: "Apps", hint: "Production builds" },
  { href: "/categories/games", label: "Games", hint: "Weird and fun" },
  { href: "/categories/benchmarks", label: "Benchmarks", hint: "Eval harnesses" },
  { href: "/categories/guides", label: "Articles", hint: "Catalog writeups" },
];

/** Pass-2 segment roots for power users */
export const segmentRoots = ITEM_DETAIL_SEGMENTS.map((s) => `/${s}`);

export function HomeQuickJump() {
  return (
    <section aria-labelledby="jump-heading" className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Map of the site
        </p>
        <h2
          id="jump-heading"
          className="mt-1 font-heading text-xl font-semibold sm:text-2xl"
        >
          Learn, browse, or ship
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Topic guides for the curious. Category hubs for the directory obsessed. Submit when you have something worth clicking.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Learn
        </h3>
        <div className="flex flex-wrap gap-2">
          {learnChips.map((chip) => (
            <AppLink
              key={chip.href}
              href={chip.href}
              title={chip.hint}
              className="group inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="truncate">{chip.label}</span>
            </AppLink>
          ))}
          <AppLink
            href="/learn"
            className="inline-flex items-center rounded-md border border-dashed border-primary/40 bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Learn hub →
          </AppLink>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Directory
        </h3>
        <div className="flex flex-wrap gap-2">
          {categoryChips.map((chip) => (
            <AppLink
              key={chip.href}
              href={chip.href}
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span>{chip.label}</span>
              <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
                {chip.hint}
              </span>
            </AppLink>
          ))}
          <AppLink
            href="/explore"
            className="inline-flex items-center rounded-md border border-dashed border-primary/40 bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Full explore →
          </AppLink>
          <AppLink
            href="/submit"
            className="inline-flex items-center rounded-md border border-primary/50 bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Submit a build
          </AppLink>
        </div>
      </div>
    </section>
  );
}
