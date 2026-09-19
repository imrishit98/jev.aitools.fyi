import { jevSpecSheet } from "@/data/spec";

export function JevSpecSheet() {
  return (
    <section
      aria-labelledby="spec-heading"
      className="surface-card overflow-hidden"
    >
      <div className="border-b border-border bg-muted/40 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Jev spec sheet {jevSpecSheet.version}
      </div>
      <div className="grid gap-px bg-border md:grid-cols-2">
        {[
          ["Model", jevSpecSheet.model],
          ["AI Gateway", "typesafe-ai/jev"],
          ["Endpoint", jevSpecSheet.endpoint],
          ["Input", jevSpecSheet.input],
          ["Output", jevSpecSheet.output],
          ["Latency", jevSpecSheet.latency],
          ["Pricing", jevSpecSheet.pricing],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3 bg-card px-4 py-3 text-sm">
            <span className="w-20 shrink-0 font-medium text-muted-foreground">
              {k}
            </span>
            <span className="font-mono text-xs leading-relaxed sm:text-sm">
              {v}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-4">
        <p id="spec-heading" className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          Primitives
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {jevSpecSheet.primitives.map((p) => (
            <div
              key={p.name}
              className="rounded-md border border-border bg-muted/30 px-3 py-2"
            >
              <p className="font-mono text-sm text-primary">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.summary}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                {p.returns}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
