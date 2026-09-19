"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShowcaseDemo } from "@/data/showcase-demos";
import { DemoLightbox } from "@/components/demo-lightbox";
import { AppLink } from "@/components/app-link";
import { cn } from "@/lib/utils";
import { ShareMenu } from "@/components/share-menu";
import { demoShareOptions } from "@/lib/share";
import { Play } from "lucide-react";

type DemoCardProps = {
  demo: ShowcaseDemo;
  variant?: "default" | "hero" | "compact";
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
          "group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-shadow motion-safe:hover:shadow-md",
          className,
        )}
      >
        <button
          type="button"
          className={cn(
            "relative w-full shrink-0 overflow-hidden bg-muted text-left",
            isHero ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-video",
          )}
          aria-label={`Open video lightbox: ${demo.title}`}
          onClick={openLightbox}
          onMouseEnter={startHoverPreview}
          onMouseLeave={stopHoverPreview}
          onFocus={startHoverPreview}
          onBlur={stopHoverPreview}
        >
          {demo.hasLocalVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              poster={demo.posterUrl}
              src={demo.videoUrl}
              muted
              playsInline
              loop
              preload="metadata"
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
            <span className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-background/90 text-primary shadow-lg backdrop-blur-sm motion-safe:transition-transform motion-safe:group-hover:scale-105 sm:size-14">
              <Play className="ml-0.5 size-5 fill-current sm:ml-1 sm:size-6" aria-hidden />
            </span>
          </span>
        </button>
        <div
          className={cn(
            "flex flex-1 flex-col space-y-2",
            isCompact ? "p-3" : isHero ? "p-5 sm:p-6" : "p-4",
          )}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{demo.authorName}</span>
            <span aria-hidden>·</span>
            <a
              href={demo.tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              @{demo.authorHandle}
            </a>
          </div>
          <h3
            className={cn(
              "font-heading font-semibold leading-snug tracking-tight",
              isHero ? "text-xl sm:text-2xl" : isCompact ? "text-sm" : "text-base",
            )}
          >
            {demo.title}
          </h3>
          {!isCompact && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {demo.funnyBlurb}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
            {demo.categoryTags.slice(0, isCompact ? 2 : 3).map((tag) => (
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
                triggerSize="xs"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
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
    <section aria-labelledby="demos-heading" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Cool builds
          </p>
          <h2
            id="demos-heading"
            className="mt-1 font-heading text-2xl font-semibold sm:text-3xl"
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
        <div className="flex shrink-0 flex-wrap gap-3 text-sm font-medium">
          <AppLink href="/showcase" className="text-primary hover:underline">
            Full showcase →
          </AppLink>
          <AppLink href="/submit" className="text-muted-foreground hover:text-primary hover:underline">
            Yours could be here
          </AppLink>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {hero && (
          <div className="lg:col-span-7">
            <DemoCard demo={hero} variant="hero" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:content-start">
          {rest.map((demo) => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>
      </div>
    </section>
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
