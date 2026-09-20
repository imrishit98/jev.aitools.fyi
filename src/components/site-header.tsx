"use client";

/**
 * Breakpoint contract (Tailwind lg = 1024px):
 * - Below lg: logo + hamburger sheet for all primary/secondary/category links; utility cluster on the right.
 * - lg+: inline primary links + More dropdown (secondary + categories); hamburger hidden.
 */
import { useState, type ReactNode } from "react";
import { AppLink } from "@/components/app-link";
import ThemeToggle from "@/components/theme-toggle";
import { AudienceSwitch } from "@/components/audience-switch";
import GitHubStarLink from "@/components/github-star-link";
import SearchCommand from "@/components/search-command";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";

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

const HEADER_HEIGHT = "top-14 sm:top-[4.25rem]";
const HEADER_HEIGHT_CALC = "h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4.25rem)]";

function NavDrawerLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <AppLink
      href={href}
      className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onNavigate}
    >
      {children}
    </AppLink>
  );
}

function MobileNavSheet() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="lg:hidden"
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton
        overlayClassName={`${HEADER_HEIGHT} inset-x-0 bottom-0`}
        className={`${HEADER_HEIGHT} ${HEADER_HEIGHT_CALC} w-full max-w-sm gap-0 overflow-y-auto border-l p-0 data-[side=right]:inset-y-auto data-[side=right]:h-auto`}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Site navigation</SheetTitle>
          <SheetDescription>Directory pages and categories</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col px-2 pb-8 pt-3" aria-label="Mobile and tablet">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Browse
          </p>
          {primaryNav.map((item) => (
            <NavDrawerLink key={item.href} href={item.href} onNavigate={close}>
              {item.label}
            </NavDrawerLink>
          ))}
          <p className="mt-4 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            More
          </p>
          {moreNav.map((item) => (
            <NavDrawerLink key={item.href} href={item.href} onNavigate={close}>
              {item.label}
            </NavDrawerLink>
          ))}
          <p className="mt-4 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          {categories.map((cat) => (
            <NavDrawerLink key={cat.slug} href={`/categories/${cat.slug}`} onNavigate={close}>
              {cat.title}
            </NavDrawerLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DesktopMoreMenu() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 xl:px-3">
        More
        <ChevronDown className="size-3.5 opacity-70" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="z-[120] max-h-[min(24rem,70vh)] w-56"
      >
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[100] border-b border-border/80 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl min-w-0 items-center gap-2 px-3 sm:h-[4.25rem] sm:gap-3 sm:px-6">
        <AppLink
          href="/"
          className="group flex min-w-0 max-w-[8.75rem] shrink-0 items-baseline font-heading text-sm tracking-tight sm:max-w-[11.5rem] sm:text-base"
          title={siteConfig.hostnameBrand}
        >
          <span className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
            {siteConfig.hostnameBrand}
          </span>
        </AppLink>

        <MobileNavSheet />

        <nav
          className="ml-1 hidden min-w-0 shrink-0 items-center gap-0.5 lg:flex xl:ml-2 xl:gap-1"
          aria-label="Main"
        >
          {primaryNav.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 xl:px-3"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <DesktopMoreMenu />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 border-l border-border/60 pl-2 sm:gap-1.5 sm:pl-3">
          <AudienceSwitch
            variant="header"
            hideAuxLinkUntil="lg"
            className="hidden md:flex"
          />
          <GitHubStarLink className="max-[374px]:px-1.5" />
          <ThemeToggle />
          <SearchCommand />
        </div>
      </div>
    </header>
  );
}
