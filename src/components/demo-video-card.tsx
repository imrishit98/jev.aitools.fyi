"use client";

import { useCallback, useRef, useState } from "react";
import { AppLink } from "@/components/app-link";
import type { ShowcaseDemo } from "@/data/showcase-demos";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

type DemoVideoCardProps = {
  demo: ShowcaseDemo;
  variant?: "default" | "hero";
  className?: string;
};

export function DemoVideoCard({
  demo,
  variant = "default",
  className,
}: DemoVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    void el.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
  }, []);

  const isHero = variant === "hero";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-md border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          isHero ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-video",
        )}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          poster={demo.posterUrl}
          src={demo.videoUrl}
          muted
          playsInline
          loop
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {!playing && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
            aria-hidden
          />
        )}
        <button
          type="button"
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            playing ? "opacity-0" : "opacity-100",
            "motion-safe:group-hover:opacity-90",
          )}
          aria-label={`Play demo: ${demo.title}`}
          onClick={() => (playing ? pause() : play())}
          onMouseEnter={() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            if (window.matchMedia("(hover: hover)").matches) play();
          }}
          onMouseLeave={() => {
            if (window.matchMedia("(hover: hover)").matches) pause();
          }}
        >
          <span className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-background/90 text-primary shadow-lg backdrop-blur-sm motion-safe:transition-transform motion-safe:group-hover:scale-105">
            <Play className="ml-1 size-6 fill-current" aria-hidden />
          </span>
        </button>
      </div>
      <div className={cn("space-y-2 p-4", isHero && "p-5 sm:p-6")}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{demo.authorName}</span>
          <span aria-hidden>·</span>
          <a
            href={demo.tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @{demo.authorHandle}
          </a>
        </div>
        <h3
          className={cn(
            "font-heading font-semibold leading-snug tracking-tight",
            isHero ? "text-xl sm:text-2xl" : "text-base",
          )}
        >
          {demo.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {demo.funnyBlurb}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {demo.categoryTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function HomeDemoStrip({ demos }: { demos: ShowcaseDemo[] }) {
  const [hero, ...rest] = demos;

  return (
    <section aria-labelledby="demos-heading" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Proof, not promises
          </p>
          <h2
            id="demos-heading"
            className="mt-1 font-heading text-2xl font-semibold sm:text-3xl"
          >
            Watch people ship with Jev
          </h2>
        </div>
        <AppLink
          href="/showcase"
          className="text-sm font-medium text-primary hover:underline"
        >
          See all demos →
        </AppLink>
      </div>
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {hero && (
          <div className="lg:col-span-7">
            <DemoVideoCard demo={hero} variant="hero" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:content-start">
          {rest.map((demo) => (
            <DemoVideoCard key={demo.id} demo={demo} />
          ))}
        </div>
      </div>
    </section>
  );
}
