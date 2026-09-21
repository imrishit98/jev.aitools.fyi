import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

export type ShowcaseDemoVideoProps = ComponentPropsWithoutRef<"video"> & {
  /** When true, src is video.twimg.com (or other remote X media) — never committed under public/. */
  videoIsRemote?: boolean;
};

/**
 * Chromium ignores `referrerPolicy` on `<video>` media fetches; a document-level
 * `meta name="referrer" content="no-referrer"` (see BaseLayout `remoteShowcaseVideos`)
 * is what actually stops twimg 403s. We still set referrerPolicy on the element for
 * other engines and keep remote src assignment after that meta is present.
 */
function ensureShowcaseVideoReferrerMeta() {
  if (
    document.querySelector('meta[name="referrer"][content="no-referrer"]')
  ) {
    return;
  }
  const meta = document.createElement("meta");
  meta.name = "referrer";
  meta.content = "no-referrer";
  meta.dataset.jevShowcaseVideo = "";
  document.head.prepend(meta);
}

function useRemoteVideoSrc(
  src: string | undefined,
  videoIsRemote: boolean | undefined,
) {
  const isRemote = videoIsRemote === true;
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(
    isRemote ? undefined : src,
  );

  useLayoutEffect(() => {
    if (!isRemote) {
      setResolvedSrc(src);
      return;
    }
    if (!src) {
      setResolvedSrc(undefined);
      return;
    }
    ensureShowcaseVideoReferrerMeta();
    setResolvedSrc(src);
  }, [isRemote, src]);

  return resolvedSrc;
}

const READY_EVENTS = ["canplay", "loadeddata", "loadedmetadata"] as const;

/** Muted autoplay with retries when media becomes ready (e.g. after deferred remote src). */
export function playMutedAutoplayWhenReady(
  el: HTMLVideoElement,
  muted: boolean,
) {
  el.muted = muted;
  const tryPlay = () => {
    el.muted = muted;
    void el.play().catch(() => {});
  };
  tryPlay();
  for (const ev of READY_EVENTS) {
    el.addEventListener(ev, tryPlay);
  }
  return () => {
    for (const ev of READY_EVENTS) {
      el.removeEventListener(ev, tryPlay);
    }
  };
}

export const ShowcaseDemoVideo = forwardRef<
  HTMLVideoElement,
  ShowcaseDemoVideoProps
>(function ShowcaseDemoVideo(
  {
    videoIsRemote,
    crossOrigin,
    referrerPolicy,
    src,
    autoPlay,
    muted,
    ...rest
  },
  ref,
) {
  const isRemote = videoIsRemote === true;
  const resolvedSrc = useRemoteVideoSrc(src, videoIsRemote);
  const innerRef = useRef<HTMLVideoElement | null>(null);
  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    if (!autoPlay || !resolvedSrc) return;
    const el = innerRef.current;
    if (!el) return;
    return playMutedAutoplayWhenReady(el, muted !== false);
  }, [autoPlay, resolvedSrc, muted]);

  return (
    <video
      ref={setVideoRef}
      {...rest}
      autoPlay={autoPlay}
      muted={muted}
      src={resolvedSrc}
      crossOrigin={isRemote ? undefined : crossOrigin}
      referrerPolicy={
        isRemote ? "no-referrer" : (referrerPolicy ?? undefined)
      }
    />
  );
});
