import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { searchItems } from "@/lib/items";

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(
    () => searchItems(query.trim(), 12),
    [query],
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

  function go(path: string) {
    setOpen(false);
    window.location.href = path;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 px-0 sm:w-auto sm:gap-2 sm:px-3"
        onClick={() => setOpen(true)}
        aria-label="Search directory"
      >
        <Search className="size-4 shrink-0" />
        <span className="hidden text-muted-foreground sm:inline">Search</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search 488 listings..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No listings found.</CommandEmpty>
          <CommandGroup heading="Listings">
            {results.map((item) => (
              <CommandItem
                key={item.slug}
                value={item.title}
                onSelect={() => go(`/items/${item.slug}`)}
              >
                <span className="font-medium">{item.title}</span>
                <span className="ml-2 truncate text-xs text-muted-foreground">
                  {item.oneLiner}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => go("/explore")}>
              Explore all listings
            </CommandItem>
            <CommandItem onSelect={() => go("/learn")}>
              Learn: start here
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
