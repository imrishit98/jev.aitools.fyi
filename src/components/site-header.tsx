"use client";

import { AppLink } from "@/components/app-link";
import ThemeToggle from "@/components/theme-toggle";
import { AudienceSwitch } from "@/components/audience-switch";
import GitHubStarLink from "@/components/github-star-link";
import SearchCommand from "@/components/search-command";
import { categories } from "@/data/categories";
import { siteConfig } from "@/lib/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const primaryNav = [
  { href: "/explore", label: "Explore" },
  { href: "/showcase", label: "Showcase" },
  { href: "/learn", label: "Learn" },
  { href: "/submit", label: "Submit" },
] as const;

const moreNav = [
  { href: "/developers", label: "Agents & API" },
  { href: "/for-agents", label: "For agents" },
  { href: "/about", label: "About" },
] as const;

function MoreMenuContent() {
  return (
    <>
      {moreNav.map((item) => (
        <DropdownMenuItem key={item.href} className="p-0">
          <AppLink href={item.href} className="block w-full px-2 py-1.5 text-sm">
            {item.label}
          </AppLink>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Categories</DropdownMenuLabel>
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
      </DropdownMenuGroup>
    </>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl min-w-0 items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <AppLink
          href="/"
          className="group flex min-w-0 max-w-[10rem] shrink-0 items-baseline font-heading text-sm tracking-tight sm:max-w-[11.5rem] sm:text-base"
          title={siteConfig.hostnameBrand}
        >
          <span className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
            {siteConfig.hostnameBrand}
          </span>
        </AppLink>

        <nav
          className="hidden min-w-0 flex-1 items-center gap-0.5 md:flex lg:gap-1"
          aria-label="Main"
        >
          {primaryNav.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 lg:px-3"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>

        {/* Non-modal menu: modal dropdowns mark the rest of the page inert and hide the sticky bar. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 lg:px-3">
            More
            <ChevronDown className="size-3.5 opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="z-[100] max-h-[min(24rem,70vh)] w-56 md:align-start"
          >
            <div className="md:hidden">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Browse</DropdownMenuLabel>
                {primaryNav.map((item) => (
                  <DropdownMenuItem key={item.href} className="p-0">
                    <AppLink href={item.href} className="block w-full px-2 py-1.5 text-sm">
                      {item.label}
                    </AppLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </div>
            <MoreMenuContent />
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative z-[100] ml-auto flex min-w-0 shrink-0 items-center gap-1 border-l border-border/60 pl-2 sm:gap-1.5 sm:pl-3">
          <AudienceSwitch variant="header" className="hidden sm:flex" />
          <GitHubStarLink />
          <ThemeToggle />
          <SearchCommand />
        </div>
      </div>
    </header>
  );
}
