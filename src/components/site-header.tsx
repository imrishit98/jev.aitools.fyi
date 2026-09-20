import { AppLink } from "@/components/app-link";
import ThemeToggle from "@/components/theme-toggle";
import { AudienceSwitch } from "@/components/audience-switch";
import SearchCommand from "@/components/search-command";
import { ButtonLink } from "@/components/button-link";
import { categories } from "@/data/categories";
import { siteConfig } from "@/lib/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const nav = [
  { href: "/explore", label: "Explore" },
  { href: "/showcase", label: "Showcase" },
  { href: "/learn", label: "Learn" },
  { href: "/developers", label: "Agents" },
  { href: "/submit", label: "Submit" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl min-w-0 items-center gap-2 overflow-x-clip px-4 sm:gap-3 sm:px-6">
        <AppLink
          href="/"
          className="group flex min-w-0 max-w-[11.5rem] shrink items-baseline font-heading text-sm tracking-tight sm:max-w-none sm:text-base"
          title={siteConfig.hostnameBrand}
        >
          <span className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
            {siteConfig.hostnameBrand}
          </span>
        </AppLink>

        <nav className="hidden min-w-0 shrink items-center gap-0.5 md:flex" aria-label="Main">
          {nav.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.label}
            </AppLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
              Categories
              <ChevronDown className="size-3.5 opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-80 w-56">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} className="p-0">
                  <AppLink
                    href={`/categories/${cat.slug}`}
                    className="block w-full px-2 py-1.5 text-sm"
                  >
                    {cat.title}
                  </AppLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <AudienceSwitch variant="header" className="hidden sm:flex" />
          <ThemeToggle />
          <SearchCommand />
          <ButtonLink href="/explore" size="sm" className="hidden lg:inline-flex">
            Explore all
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
