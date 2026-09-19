import { AppLink } from "@/components/app-link";
import ThemeToggle from "@/components/theme-toggle";
import SearchCommand from "@/components/search-command";
import { ButtonLink } from "@/components/button-link";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn" },
  { href: "/submit", label: "Submit" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center gap-3 px-4 sm:px-6">
        <AppLink
          href="/"
          className="group flex shrink-0 items-baseline gap-2 font-heading text-lg tracking-tight"
        >
          <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
            Jev
          </span>
          <span className="hidden text-muted-foreground sm:inline">
            Directory
          </span>
          <span className="ml-1 hidden rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary sm:inline">
            System One
          </span>
        </AppLink>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
          {nav.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <SearchCommand />
          <ButtonLink href="/explore" size="sm" className="hidden sm:inline-flex">
            Browse all
          </ButtonLink>
          <ButtonLink
            href={siteConfig.typesafe.docs}
            size="sm"
            variant="outline"
            className="hidden lg:inline-flex"
            external
          >
            TypeSafe docs
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
