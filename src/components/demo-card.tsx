"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShowcaseDemo } from "@/data/showcase-demos";
import { DemoLightbox } from "@/components/demo-lightbox";
import { AppLink } from "@/components/app-link";
import { cn } from "@/lib/utils";
import { ShareMenu } from "@/components/share-menu";
import { demoShareOptions } from "@/lib/share";
import { Play } from "lucide-react";
import { ShowcaseDemoVideo } from "@/components/showcase-demo-video";

type DemoCardProps = {
  demo: ShowcaseDemo;
  variant?: "default" | "hero" | "compact" | "sidebar";
  className?: string;
};

export function DemoCard({
  demo,
  variant = "default",
  className,
}: DemoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hoverPreview, setHoverPreview] = useState(false);

  const isHero = variant === "hero";
  const isCompact = variant === "compact";
  const isSidebar = variant === "sidebar";

  const startHoverPreview = useCallback(() => {
    if (!demo.hasLocalVideo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
    setHoverPreview(true);
  }, [demo.hasLocalVideo]);

  const stopHoverPreview = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setHoverPreview(false);
  }, []);

  const openLightbox = useCallback(() => {
    stopHoverPreview();
    setLightboxOpen(true);
  }, [stopHoverPreview]);

  return (
    <>
      <article
        className={cn(
          "group relative flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-shadow motion-safe:hover:shadow-md",
          isHero ? "h-auto w-full self-start" : variant === "default" ? "h-full" : "h-auto self-start",
          className,
        )}
      >
        <button
          type="button"
          className={cn(
            "relative w-full shrink-0 overflow-hidden bg-muted text-left",
            isHero ? "aspect-video lg:aspect-[16/10]" : "aspect-video",
          )}
          aria-label={`Open video lightbox: ${demo.title}`}
          onClick={openLightbox}
          onMouseEnter={startHoverPreview}
          onMouseLeave={stopHoverPreview}
          onFocus={startHoverPreview}
          onBlur={stopHoverPreview}
        >
          {demo.hasLocalVideo ? (
            <ShowcaseDemoVideo
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              poster={demo.posterUrl}
              src={demo.videoUrl}
              muted
              playsInline
              loop
              preload="metadata"
              videoIsRemote={demo.videoIsRemote}
              aria-hidden
            />
          ) : (
            <img
              src={demo.posterUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
          )}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent transition-opacity",
              hoverPreview ? "opacity-40" : "opacity-100",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity",
              hoverPreview ? "opacity-0" : "opacity-100",
              "motion-safe:group-hover:opacity-90",
            )}
          >
            <span className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-primary/30 bg-background/90 text-primary shadow-lg backdrop-blur-sm motion-safe:transition-transform motion-safe:group-hover:scale-105 sm:size-14 sm:min-h-14 sm:min-w-14">
              <Play className="ml-0.5 size-5 fill-current sm:ml-1 sm:size-6" aria-hidden />
            </span>
          </span>
        </button>
        <div
          className={cn(
            "flex flex-col space-y-2",
            variant === "default" && "flex-1",
            isCompact
              ? "p-3"
              : isSidebar
                ? "p-4 sm:p-4 lg:p-3.5"
                : isHero
                  ? "p-5 sm:p-6"
                  : "p-4",
          )}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-muted-foreground">
            <span className="font-medium text-foreground">{demo.authorName}</span>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <a
              href={demo.tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center truncate rounded-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:min-h-11 max-sm:py-2"
              onClick={(e) => e.stopPropagation()}
            >
              @{demo.authorHandle}
            </a>
          </div>
          <h3
            className={cn(
              "font-heading font-semibold leading-snug tracking-tight [overflow-wrap:anywhere]",
              isHero
                ? "text-xl sm:text-2xl"
                : isCompact
                  ? "text-sm"
                  : isSidebar
                    ? "text-base lg:text-[0.9375rem]"
                    : "text-base",
            )}
          >
            {demo.title}
          </h3>
          {!isCompact && (
            <p
              className={cn(
                "text-sm leading-relaxed text-muted-foreground",
                isSidebar ? "line-clamp-3 lg:line-clamp-2" : "line-clamp-4 sm:line-clamp-none",
              )}
            >
              {demo.funnyBlurb}
            </p>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-2 pt-1",
              variant === "default" && "mt-auto",
            )}
          >
            <div className="flex flex-wrap gap-1.5">
            {demo.categoryTags.slice(0, isCompact || isSidebar ? 2 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            </div>
            <div
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <ShareMenu
                options={demoShareOptions(demo)}
                triggerLabel="Share"
                triggerVariant="ghost"
                triggerSize="sm"
                className="min-h-11 min-w-[4.25rem] px-3 text-muted-foreground hover:text-foreground sm:h-7 sm:min-h-0 sm:min-w-0 sm:px-2"
              />
            </div>
          </div>
        </div>
      </article>
      <DemoLightbox
        demo={demo}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}

export function HomeDemoStrip({ demos }: { demos: ShowcaseDemo[] }) {
  const [hero, ...rest] = demos;

  return (
    <section
      aria-labelledby="demos-heading"
      className="min-w-0 space-y-6 overflow-x-clip pb-4 sm:space-y-8 md:pb-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Cool builds
          </p>
          <h2
            id="demos-heading"
            className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Press play on the timeline
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Real clips from builders. Hover for a sneak peek, click for the full lightbox. Then steal ideas from{" "}
            <AppLink href="/explore" className="text-primary hover:underline">
              Explore
            </AppLink>
            .
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-2 border-t border-border/60 pt-4 text-sm font-medium sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 sm:gap-y-1 md:border-0 md:pt-0 md:justify-end">
          <AppLink href="/showcase" className="text-primary hover:underline">
            Full showcase →
          </AppLink>
          <AppLink
            href="/submit"
            className="text-muted-foreground hover:text-primary hover:underline"
          >
            Yours could be here
          </AppLink>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        {hero && (
          <div className="min-w-0 w-full">
            <DemoCard demo={hero} variant="hero" />
          </div>
        )}
        {rest.length > 0 && (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-3 [&>*:last-child:nth-child(odd)]:sm:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1">
            {rest.map((demo) => (
              <DemoCard
                key={demo.id}
                demo={demo}
                variant="default"
                className="h-auto self-start"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function InterestingDemoStrip({ demos }: { demos: ShowcaseDemo[] }) {
  if (demos.length === 0) return null;

  return (
    <section
      aria-labelledby="interesting-demos-heading"
      className="min-w-0 space-y-4 overflow-x-clip border-b border-border/60 pb-10"
    >
      <div className="min-w-0 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Interesting
        </p>
        <h2
          id="interesting-demos-heading"
          className="mt-1 font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Weird, viral, or painfully honest
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Demos tagged{" "}
          <span className="font-medium text-foreground">interesting</span>. Trading bots that
          confess their P and L, not just their latency.
        </p>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} variant="default" className="h-auto self-start" />
        ))}
      </div>
    </section>
  );
}

export function ProductProfileDemos({ demos }: { demos: ShowcaseDemo[] }) {
  if (demos.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {demos.map((demo) => (
        <DemoCard key={demo.id} demo={demo} variant="default" className="h-auto self-start" />
      ))}
    </div>
  );
}

export function ShowcaseDemoGrid({ demos }: { demos: ShowcaseDemo[] }) {
  const [deepLinkDemo, setDeepLinkDemo] = useState<ShowcaseDemo | null>(null);
  const [deepLinkOpen, setDeepLinkOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("demo");
    if (!id) return;
    const match = demos.find((d) => d.id === id);
    if (!match) return;
    setDeepLinkDemo(match);
    setDeepLinkOpen(true);
  }, [demos]);

  const onDeepLinkOpenChange = useCallback((open: boolean) => {
    setDeepLinkOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("demo")) {
        url.searchParams.delete("demo");
        const next = `${url.pathname}${url.search}${url.hash}`;
        window.history.replaceState({}, "", next);
      }
    }
  }, []);

  return (
    <>
      <div
        className="columns-1 gap-5 sm:columns-2 xl:columns-3"
        style={{ columnFill: "balance" }}
      >
        {demos.map((demo) => (
          <div key={demo.id} className="mb-5 break-inside-avoid">
            <DemoCard demo={demo} variant="compact" />
          </div>
        ))}
      </div>
      <DemoLightbox
        demo={deepLinkDemo}
        open={deepLinkOpen}
        onOpenChange={onDeepLinkOpenChange}
      />
    </>
  );
}
