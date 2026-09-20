import { AppLink } from "@/components/app-link";
import {
  agentEntryPath,
  humanHomeHref,
  isAgentRoute,
  setStoredAudience,
  type AudienceMode,
} from "@/lib/audience";
import { cn } from "@/lib/utils";
import { useEffect, useId, useState } from "react";

type AudienceSwitchProps = {
  variant?: "header" | "hero";
  className?: string;
};

function modeFromLocation(): AudienceMode {
  if (typeof window === "undefined") return "human";
  return isAgentRoute(window.location.pathname) ? "agent" : "human";
}

const segmentClass = (selected: boolean, isHero: boolean) =>
  cn(
    "inline-flex items-center justify-center rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    isHero ? "text-xs sm:text-sm" : "text-xs",
    selected
      ? "bg-background text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

export function AudienceSwitch({ variant = "header", className }: AudienceSwitchProps) {
  const groupId = useId();
  const [mode, setMode] = useState<AudienceMode>(() => modeFromLocation());

  useEffect(() => {
    const sync = () => {
      const fromPath = modeFromLocation();
      setMode(fromPath);
      if (fromPath === "human") {
        setStoredAudience("human");
      }
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const isHero = variant === "hero";
  const isHeader = variant === "header";
  const showAgentLink = mode !== "agent";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2",
        isHero ? "text-sm" : "text-xs",
        isHeader && "relative z-30 shrink-0 rounded-md bg-background/95 pl-1",
        className,
      )}
    >
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        className="inline-flex rounded-md border border-border bg-muted/40 p-0.5"
      >
        <span id={`${groupId}-label`} className="sr-only">
          Site view
        </span>
        <AppLink
          href={humanHomeHref()}
          aria-current={mode === "human" ? "page" : undefined}
          className={segmentClass(mode === "human", isHero)}
          onClick={() => setStoredAudience("human")}
        >
          Human
        </AppLink>
        <AppLink
          href={agentEntryPath}
          aria-current={mode === "agent" ? "page" : undefined}
          className={segmentClass(mode === "agent", isHero)}
          onClick={() => setStoredAudience("agent")}
        >
          Agent
        </AppLink>
      </div>
      {showAgentLink ? (
        <AppLink
          href={agentEntryPath}
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isHero ? "text-sm" : "text-xs",
          )}
          onClick={() => setStoredAudience("agent")}
        >
          I&apos;m an agent
        </AppLink>
      ) : (
        <AppLink
          href={humanHomeHref()}
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isHero ? "text-sm" : "text-xs",
          )}
          onClick={() => setStoredAudience("human")}
        >
          I&apos;m human
        </AppLink>
      )}
    </div>
  );
}
