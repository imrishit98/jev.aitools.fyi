import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type ShowcaseDemoVideoProps = ComponentPropsWithoutRef<"video"> & {
  /** When true, src is video.twimg.com (or other remote X media) — never committed under public/. */
  videoIsRemote?: boolean;
};

/**
 * Showcase demo `<video>` wrapper.
 *
 * video.twimg.com hotlink-blocks requests that send `Referer: https://jev.aitools.fyi/`
 * (HTTP 403). Browsers send the page origin as Referer on `<video src>`, so remote X
 * videos must use `referrerPolicy="no-referrer"` or playback fails site-wide.
 */
export const ShowcaseDemoVideo = forwardRef<
  HTMLVideoElement,
  ShowcaseDemoVideoProps
>(function ShowcaseDemoVideo(
  { videoIsRemote, crossOrigin, referrerPolicy, ...rest },
  ref,
) {
  const isRemote = videoIsRemote === true;

  return (
    <video
      ref={ref}
      {...rest}
      crossOrigin={isRemote ? undefined : crossOrigin}
      referrerPolicy={
        isRemote ? "no-referrer" : (referrerPolicy ?? undefined)
      }
    />
  );
});
