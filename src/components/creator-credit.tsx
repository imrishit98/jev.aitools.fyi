import { formatCreatorLabel, xProfileUrl } from "@/lib/creator";
import type { DirectoryItem } from "@/data/types";

export function CreatorCredit({
  item,
  className = "",
}: {
  item: Pick<DirectoryItem, "creatorHandle" | "sourcePlatform">;
  className?: string;
}) {
  if (!item.creatorHandle || item.sourcePlatform !== "x") return null;

  const label = formatCreatorLabel(item.creatorHandle);

  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      by{" "}
      <a
        href={xProfileUrl(item.creatorHandle)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 font-medium text-foreground/80 hover:text-primary focus-visible:text-primary"
      >
        {label}
      </a>
    </p>
  );
}
