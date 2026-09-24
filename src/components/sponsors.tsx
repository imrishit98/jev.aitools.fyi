import { useState, type ReactNode } from "react";
import { sponsors, type Sponsor } from "@/data/sponsors";
import { sponsorHref, sponsorLinkRel } from "@/lib/outbound-attribution";
import { cn } from "cn";

const LOGO_SIZE = 32;

function sponsorInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const first = trimmed[0];
  return first?.toUpperCase() ?? "?";
}

export function SponsorLogo({
  sponsor,
  size = LOGO_SIZE,
  className,
}: {
  sponsor: Sponsor;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showBadge = failed || !sponsor.logoUrl;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/50",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showBadge ? (
        <span
          className="font-heading text-xs font-semibold text-primary"
          aria-hidden
        >
          {sponsorInitial(sponsor.name)}
        </span>
      ) : (
        <img
          src={sponsor.logoUrl}
          alt=""
          width={size}
          height={size}
          className="size-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function SponsorExternalLink({
  sponsor,
  className,
  children,
}: {
  sponsor: Sponsor;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={sponsorHref(sponsor.url)}
      target="_blank"
      rel={sponsorLinkRel(sponsor.url)}
      className={className}
    >
      {children}
    </a>
  );
}

export function HomeSponsors() {
  return (
    <section aria-labelledby="sponsors-heading" className="space-y-6">
      <h2
        id="sponsors-heading"
        className="font-heading text-xl font-semibold sm:text-2xl"
      >
        Sponsors
      </h2>
      <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <li key={sponsor.url}>
            <SponsorExternalLink
              sponsor={sponsor}
              className="flex h-full gap-3 rounded-md border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow] hover:border-primary/25 hover:shadow-md"
            >
              <SponsorLogo sponsor={sponsor} />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-semibold text-foreground">
                  {sponsor.name}
                </p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                  {sponsor.tagline}
                </p>
              </div>
            </SponsorExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FooterSponsors() {
  return (
    <p className="mx-auto max-w-6xl px-4 text-center text-[11px] leading-relaxed text-muted-foreground sm:px-6">
      <span className="text-muted-foreground/90">Sponsored by</span>{" "}
      {sponsors.map((sponsor, index) => (
        <span key={sponsor.url}>
          {index > 0 ? (
            <span className="text-muted-foreground/60" aria-hidden>
              {" · "}
            </span>
          ) : null}
          <SponsorExternalLink
            sponsor={sponsor}
            className="font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {sponsor.name}
          </SponsorExternalLink>
        </span>
      ))}
    </p>
  );
}
