import { AppLink } from "@/components/app-link";
import { ITEM_DETAIL_SEGMENTS } from "@/lib/item-paths";

const chips: { href: string; label: string; hint: string }[] = [
  { href: "/explore?category=sdks", label: "SDKs", hint: "Typed clients" },
  { href: "/explore?category=integrations", label: "Tools", hint: "Gateways & glue" },
  { href: "/explore?category=applications", label: "Apps", hint: "Production builds" },
  { href: "/explore?category=games", label: "Games", hint: "Weird and fun" },
  { href: "/explore?category=benchmarks", label: "Benchmarks", hint: "Eval harnesses" },
  { href: "/explore?category=guides", label: "Guides", hint: "Community writeups" },
];

/** Pass-2 segment roots for power users */
export const segmentRoots = ITEM_DETAIL_SEGMENTS.map((s) => `/${s}/`);

export function HomeQuickJump() {
  return (
    <section aria-labelledby="jump-heading" className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Skip the scroll
        </p>
        <h2
          id="jump-heading"
          className="mt-1 font-heading text-xl font-semibold sm:text-2xl"
        >
          Jump into the directory
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
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
      </div>
    </section>
  );
}
