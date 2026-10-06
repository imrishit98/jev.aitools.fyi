import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const OPT_OUT_STORAGE_KEY = "jev-directory-privacy-opt-out";

type GpcState = "unknown" | "off" | "honored";

export function PrivacyChoicesPanel() {
  const [gpc, setGpc] = useState<GpcState>("unknown");
  const [manualOptOut, setManualOptOut] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(OPT_OUT_STORAGE_KEY);
      setManualOptOut(stored === "1");
    } catch {
      /* ignore */
    }

    const gpcEnabled =
      typeof navigator !== "undefined" &&
      "globalPrivacyControl" in navigator &&
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl === true;
    setGpc(gpcEnabled ? "honored" : "off");
  }, []);

  const setOptOut = useCallback((next: boolean) => {
    setManualOptOut(next);
    try {
      if (next) localStorage.setItem(OPT_OUT_STORAGE_KEY, "1");
      else localStorage.removeItem(OPT_OUT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const optOutHonored = gpc === "honored" || manualOptOut;
  const email = siteConfig.publisherContact.email;

  return (
    <div className="space-y-8">
      <section id="do-not-sell" className="scroll-mt-24">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Do Not Sell or Share My Personal Information
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We do not sell your personal information and we do not share it for targeted
          advertising. If that ever changes, this control already works for your browser.
        </p>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-border"
            checked={manualOptOut}
            onChange={(e) => setOptOut(e.target.checked)}
            aria-describedby="manual-opt-out-desc"
          />
          <span>
            <span className="font-medium text-foreground">Opt out of sale, sharing, and targeted advertising</span>
            <span id="manual-opt-out-desc" className="mt-1 block text-sm text-muted-foreground">
              Stored in this browser only. We honor it even though we do not sell or share personal
              information today.
            </span>
          </span>
        </label>
        {manualOptOut && (
          <p className="mt-3 text-sm font-medium text-foreground" role="status">
            Your opt-out preference is saved for this browser.
          </p>
        )}
      </section>

      <section id="global-privacy-control" className="scroll-mt-24">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Global Privacy Control (GPC)
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          If your browser sends a GPC signal, we treat it as an opt-out of sale, sharing, and
          targeted advertising for that browser. GPC does not unsubscribe you from email; use the
          unsubscribe link in any message for that.
        </p>
        <div
          className="mt-4 rounded-lg border border-border bg-muted/30 p-4"
          aria-live="polite"
        >
          {gpc === "unknown" ? (
            <p className="text-sm text-muted-foreground">Checking for a GPC signal…</p>
          ) : gpc === "honored" || optOutHonored ? (
            <p className="text-base font-semibold text-foreground">Opt-Out Request Honored</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No GPC opt-out signal detected in this browser.
            </p>
          )}
        </div>
      </section>

      <section id="access-delete-correct" className="scroll-mt-24">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Access, correct, delete, and other requests
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Email{" "}
          <a href={`mailto:${email}`} className="text-accent hover:underline">
            {email}
          </a>{" "}
          with what you want to do. We reply within 30 days. We may need to confirm who you are. If
          we refuse a request, we explain why and how you can appeal or complain under your local
          law.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          An authorized agent may make a request with your signed permission. We may still confirm
          your identity with you directly.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We will not charge you more, give you worse service, or refuse service because you used
          these choices.
        </p>
      </section>

      <section id="optional-programs" className="scroll-mt-24">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Optional programs
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          We do not run optional data-sharing programs on this directory today. If we offer one, you
          will choose on a separate screen before anything is shared, and you can withdraw here or
          by email.
        </p>
      </section>
    </div>
  );
}
