import { getDirectoryStats } from "@/lib/items";

export function StatsBar() {
  const stats = getDirectoryStats();

  const cells = [
    { label: "Listings", value: stats.total.toLocaleString() },
    { label: "Deep dives", value: stats.detailPages.toLocaleString() },
    { label: "Card-only", value: stats.indexOnly.toLocaleString() },
    { label: "Categories", value: stats.categories },
    { label: "With demo", value: stats.withDemo },
    { label: "GitHub repos", value: stats.withRepo },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="surface-card rounded-md px-3 py-3 sm:px-4 sm:py-4"
        >
          <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">
            {cell.value}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-[11px]">
            {cell.label}
          </p>
        </div>
      ))}
    </div>
  );
}
