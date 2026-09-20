"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShowcaseDemo } from "@/data/showcase-demos";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "@/components/share-menu";
import { demoShareOptions } from "@/lib/share";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type DemoLightboxProps = {
  demo: ShowcaseDemo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DemoLightbox({ demo, open, onOpenChange }: DemoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const pauseAndReset = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  useEffect(() => {
    if (!open) {
      pauseAndReset();
      return;
    }
    const el = videoRef.current;
    if (!el || !demo?.hasLocalVideo) return;
    el.muted = true;
    setMuted(true);
    void el.play().catch(() => {});
  }, [open, demo?.id, demo?.hasLocalVideo, pauseAndReset]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setMuted(next);
  }, []);

  if (!demo) return null;

  const showVideo = demo.hasLocalVideo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[min(85vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
        )}
        showCloseButton
        aria-describedby={`demo-lightbox-desc-${demo.id}`}
      >
        <div className="relative aspect-video w-full shrink-0 bg-black">
          {showVideo ? (
            <>
              <video
                ref={videoRef}
                className="size-full object-contain"
                src={demo.videoUrl}
                poster={demo.posterUrl}
                controls
                playsInline
                muted
                aria-label={`Video demo: ${demo.title}`}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute bottom-3 right-3 bg-background/90 shadow-md backdrop-blur-sm"
                aria-label={muted ? "Unmute demo video" : "Mute demo video"}
                onClick={toggleMute}
              >
                {muted ? (
                  <VolumeX className="size-4" aria-hidden />
                ) : (
                  <Volume2 className="size-4" aria-hidden />
                )}
              </Button>
            </>
          ) : (
            <img
              src={demo.posterUrl}
              alt=""
              className="size-full object-contain"
            />
          )}
        </div>
        <DialogHeader className="gap-3 border-t border-border p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{demo.authorName}</span>
            <span aria-hidden>·</span>
            <span>@{demo.authorHandle}</span>
          </div>
          <DialogTitle className="text-left text-lg font-semibold sm:text-xl">
            {demo.title}
          </DialogTitle>
          <DialogDescription
            id={`demo-lightbox-desc-${demo.id}`}
            className="text-left text-sm leading-relaxed"
          >
            {demo.funnyBlurb}
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <ShareMenu
              options={demoShareOptions(demo)}
              triggerLabel="Share demo"
              triggerVariant="secondary"
            />
            <a
              href={demo.tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted"
            >
              Watch on X
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
            {demo.projectUrl ? (
              <a
                href={demo.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.8rem] font-medium text-primary hover:bg-muted"
              >
                Open project
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
