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

function applyAudienceMode(mode: AudienceMode): void {
  setStoredAudience(mode);

  const { pathname, search } = window.location;
  const onAgentPage = isAgentRoute(pathname);
  const params = new URLSearchParams(search);
  const agentViewQuery =
    params.get("view") === "agent" || params.get("view") === "agents";

  if (mode === "agent") {
    if (!onAgentPage) {
      window.location.assign(agentEntryPath);
    }
    return;
  }

  if (onAgentPage || agentViewQuery) {
    window.location.assign(humanHomeHref());
  }
}

export function AudienceSwitch({ variant = "header", className }: AudienceSwitchProps) {
  const groupId = useId();
  const [mode, setMode] = useState<AudienceMode>(() => modeFromLocation());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fromPath = modeFromLocation();
    setMode(fromPath);
    if (fromPath === "human") {
      setStoredAudience("human");
    }
    setMounted(true);
  }, []);

  const isHero = variant === "hero";
  const showAgentLink = mode !== "agent";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2",
        isHero ? "text-sm" : "text-xs",
        className,
      )}
    >
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        className={cn(
          "inline-flex rounded-md border border-border bg-muted/40 p-0.5",
          !mounted && "opacity-80",
        )}
      >
        <span id={`${groupId}-label`} className="sr-only">
          Site view
        </span>
        {(
          [
            { value: "human" as const, label: "Human" },
            { value: "agent" as const, label: "Agent" },
          ] as const
        ).map((option) => {
          const selected = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isHero ? "text-xs sm:text-sm" : "text-xs",
                selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => {
                setMode(option.value);
                applyAudienceMode(option.value);
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {showAgentLink ? (
        <AppLink
          href={agentEntryPath}
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isHero ? "text-sm" : "text-xs",
          )}
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
        >
          I&apos;m human
        </AppLink>
      )}
    </div>
  );
}
