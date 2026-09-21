import {
  forwardRef,
  useLayoutEffect,
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

export const ShowcaseDemoVideo = forwardRef<
  HTMLVideoElement,
  ShowcaseDemoVideoProps
>(function ShowcaseDemoVideo(
  { videoIsRemote, crossOrigin, referrerPolicy, src, ...rest },
  ref,
) {
  const isRemote = videoIsRemote === true;
  const resolvedSrc = useRemoteVideoSrc(src, videoIsRemote);

  return (
    <video
      ref={ref}
      {...rest}
      src={resolvedSrc}
      crossOrigin={isRemote ? undefined : crossOrigin}
      referrerPolicy={
        isRemote ? "no-referrer" : (referrerPolicy ?? undefined)
      }
    />
  );
});
