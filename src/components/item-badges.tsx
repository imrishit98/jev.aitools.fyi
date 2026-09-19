import type { DirectoryItem, ItemBadge } from "@/data/types";
import { Badge } from "@/components/ui/badge";

const labels: Record<ItemBadge, string> = {
  official: "Official",
  featured: "Featured",
  "has-demo": "Demo",
  mcp: "MCP",
  sdk: "SDK",
};

export function ItemBadges({ item }: { item: DirectoryItem }) {
  const badges = item.badges ?? [];
  const show = new Set<ItemBadge>(badges);
  if (item.featured) show.add("featured");
  if (item.demoUrl) show.add("has-demo");

  if (show.size === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {[...show].map((b) => (
        <Badge
          key={b}
          variant={b === "official" ? "default" : "secondary"}
          className="text-[10px] font-normal"
        >
          {labels[b]}
        </Badge>
      ))}
    </div>
  );
}
