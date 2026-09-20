import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { getDirectoryStats } from "@/lib/items";
import {
  type SearchIndexEntry,
  searchIndexEntries,
} from "@/lib/search-index";

const SEARCH_INDEX_URL = "/search-index.json";

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState<SearchIndexEntry[] | null>(null);
  const [indexError, setIndexError] = React.useState(false);
  const stats = React.useMemo(() => getDirectoryStats(), []);

  React.useEffect(() => {
    let cancelled = false;
    void fetch(SEARCH_INDEX_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`search index ${res.status}`);
        return res.json() as Promise<SearchIndexEntry[]>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setIndexError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = React.useMemo(
    () => (index ? searchIndexEntries(index, query, 12) : []),
    [index, query],
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuery("");
  }

  function go(path: string) {
    setOpen(false);
    setQuery("");
    window.location.href = path;
  }

  const trimmed = query.trim();
  const showListingResults = Boolean(trimmed && index && !indexError);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 px-0 sm:w-auto sm:gap-2 sm:px-3"
        onClick={() => setOpen(true)}
        aria-label="Search directory"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="hidden text-muted-foreground sm:inline">Search</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command shouldFilter={false} loop className="rounded-md">
          <CommandInput
            aria-label="Search listings"
            placeholder={`Search ${stats.total} listings...`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {indexError ? (
              <CommandEmpty>
                Search index failed to load. Use{" "}
                <a href="/explore" className="text-primary underline">
                  Explore
                </a>{" "}
                filters instead.
              </CommandEmpty>
            ) : !index ? (
              <CommandEmpty>Loading search index…</CommandEmpty>
            ) : !trimmed ? (
              <CommandEmpty>
                Type a name, tag, category, or creator handle. Press Escape to close.
              </CommandEmpty>
            ) : results.length === 0 ? (
              <CommandEmpty>
                Nothing matched. Try Explore filters or a shorter query.
              </CommandEmpty>
            ) : null}
            {showListingResults ? (
              <CommandGroup heading="Listings">
                {results.map((item) => (
                  <CommandItem
                    key={item.slug}
                    value={item.slug}
                    onSelect={() => go(item.href)}
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="ml-2 truncate text-xs text-muted-foreground">
                      {item.oneLiner}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            <CommandSeparator />
            <CommandGroup heading="Pages">
              <CommandItem value="explore" onSelect={() => go("/explore")}>
                Explore all listings
              </CommandItem>
              <CommandItem value="learn" onSelect={() => go("/learn")}>
                Learn: start here
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
