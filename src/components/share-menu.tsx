"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  absoluteShareUrl,
  buildLinkedInShareUrl,
  buildXShareUrl,
  canUseNativeShare,
  itemShareOptions,
  learnShareOptions,
  showcasePageShareOptions,
  type ShareOptions,
} from "@/lib/share";
import { cn } from "@/lib/utils";
import { Check, Copy, Share2 } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-4", className)}
      fill="currentColor"
    >
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-4", className)}
      fill="currentColor"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

type ShareMenuProps = {
  options: ShareOptions;
  align?: "start" | "center" | "end";
  triggerLabel?: string;
  triggerVariant?: NonNullable<React.ComponentProps<typeof Button>["variant"]>;
  triggerSize?: NonNullable<React.ComponentProps<typeof Button>["size"]>;
  className?: string;
  onCopy?: () => void;
};

export function ShareMenu({
  options,
  align = "end",
  triggerLabel = "Share",
  triggerVariant = "outline",
  triggerSize = "sm",
  className,
  onCopy,
}: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showNative = canUseNativeShare();

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyLink = useCallback(async () => {
    const url = absoluteShareUrl(options.url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    onCopy?.();
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [options.url, onCopy]);

  const openX = useCallback(() => {
    window.open(buildXShareUrl(options), "_blank", "noopener,noreferrer");
  }, [options]);

  const openLinkedIn = useCallback(() => {
    window.open(buildLinkedInShareUrl(options.url), "_blank", "noopener,noreferrer");
  }, [options.url]);

  const nativeShare = useCallback(async () => {
    if (!showNative) return;
    const url = absoluteShareUrl(options.url);
    try {
      await navigator.share({
        title: options.title,
        text: options.tweetText,
        url,
      });
    } catch {
      /* user dismissed */
    }
  }, [options, showNative]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: triggerVariant, size: triggerSize }),
          className,
        )}
        aria-label={`Share: ${options.title}`}
      >
        <Share2 className="size-3.5" aria-hidden />
        {triggerLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-44">
        <DropdownMenuItem onClick={() => void copyLink()}>
          {copied ? (
            <Check className="size-4 text-primary" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          <span className="inline-grid">
            <span className={cn("col-start-1 row-start-1", copied && "invisible")}>
              Copy link
            </span>
            <span
              className={cn("col-start-1 row-start-1", !copied && "invisible")}
              aria-live="polite"
            >
              Copied!
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={openX}>
          <XIcon />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openLinkedIn}>
          <LinkedInIcon />
          Share on LinkedIn
        </DropdownMenuItem>
        {showNative ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void nativeShare()}>
              <Share2 className="size-4" aria-hidden />
              More options…
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ShareBarProps = {
  options: ShareOptions;
  /** Micro social proof under the controls */
  hint?: string;
  layout?: "row" | "stack";
  className?: string;
};

const COPY_LABEL = "Steal this link";

export function ShareBar({
  options,
  hint = "Drop it in the group chat",
  layout = "row",
  className,
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showNative = canUseNativeShare();

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyLink = useCallback(async () => {
    const url = absoluteShareUrl(options.url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [options.url]);

  const stack = layout === "stack";

  return (
    <div
      className={cn(
        stack
          ? "flex flex-col items-center gap-3"
          : "flex flex-wrap items-center justify-center gap-2 sm:gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          stack && "justify-center",
        )}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void copyLink()}
          aria-label={copied ? "Link copied to clipboard" : COPY_LABEL}
          className="min-w-[9.5rem]"
        >
          {copied ? (
            <Check className="size-3.5 text-primary" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          <span className="inline-grid text-center">
            <span className={cn("col-start-1 row-start-1", copied && "invisible")}>
              {COPY_LABEL}
            </span>
            <span
              className={cn("col-start-1 row-start-1", !copied && "invisible")}
              aria-live="polite"
            >
              Copied!
            </span>
          </span>
        </Button>
        <ShareMenu
          options={options}
          triggerVariant="outline"
          triggerSize="sm"
          triggerLabel="Share"
          align={stack ? "center" : "end"}
        />
        {showNative ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={async () => {
              const url = absoluteShareUrl(options.url);
              try {
                await navigator.share({
                  title: options.title,
                  text: options.tweetText,
                  url,
                });
              } catch {
                /* dismissed */
              }
            }}
          >
            <Share2 className="size-3.5" aria-hidden />
            Share…
          </Button>
        ) : null}
      </div>
      {hint ? (
        <p className="text-xs text-muted-foreground/90">{hint}</p>
      ) : null}
    </div>
  );
}

export function ShowcasePageShare({ className }: { className?: string }) {
  return (
    <ShareBar
      options={showcasePageShareOptions()}
      hint="Drop a clip in the group chat. Someone will ask how they built it."
      layout="row"
      className={cn("mt-6 !justify-start", className)}
    />
  );
}

export function ItemListingShare({
  title,
  oneLiner,
  path,
}: {
  title: string;
  oneLiner: string;
  path: string;
}) {
  return (
    <div className="mt-6 border-t border-border pt-6">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        Spread the word
      </p>
      <div className="mt-3">
        <ShareMenu
          options={itemShareOptions({ title, oneLiner, path })}
          triggerLabel="Share this tool"
          triggerVariant="outline"
          className="w-full justify-center sm:w-auto"
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Steal this link for your team chat or README.
      </p>
    </div>
  );
}

export function LearnArticleShare({
  topic,
  title,
  description,
}: {
  topic: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 rounded-md border border-border bg-muted/30 p-5">
      <p className="text-sm font-medium text-foreground">
        Know someone still labeling with chat?
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Send them this guide. Low spam, high signal.
      </p>
      <div className="mt-4">
        <ShareBar
          options={learnShareOptions({ topic, title, description })}
          hint="Drop it in Slack. Tag TypeSafe if it saves someone a sprint."
          layout="row"
          className="!justify-start"
        />
      </div>
    </div>
  );
}
