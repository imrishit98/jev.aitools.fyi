import { siteConfig } from "@/lib/site";

/** Privacy Policy and Terms last updated (Connecticut requires month, day, and year). */
export const LEGAL_LAST_UPDATED_DISPLAY = "October 5, 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-10-05";

/** Material partner-sharing sections take effect on this date (30+ days after Oct 5, 2026). */
export const PARTNER_SHARING_EFFECTIVE_DISPLAY = "November 9, 2026";
export const PARTNER_SHARING_EFFECTIVE_ISO = "2026-11-09";

export const PRIVACY_OFFICER = "Rishit Patel";
export const MIN_COHORT = 10;

export const LEGAL_PATHS = {
  privacy: "/privacy",
  privacyArchive: "/privacy/archive",
  terms: "/terms",
  choices: "/your-privacy-choices",
} as const;

export function legalMailingAddress(): string {
  const { address } = siteConfig.publisherContact;
  return `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, Canada`;
}

export function privacyContactEmail(): string {
  return siteConfig.publisherContact.email;
}

/** Banner phase for the site-wide privacy notice (client-side date check). */
export type LegalBannerPhase = "upcoming" | "post-effective";

export function getLegalBannerPhase(now = new Date()): LegalBannerPhase {
  const effectiveStart = new Date(`${PARTNER_SHARING_EFFECTIVE_ISO}T00:00:00.000Z`);
  return now.getTime() < effectiveStart.getTime() ? "upcoming" : "post-effective";
}

/** @deprecated Use getLegalBannerPhase in the banner script. */
export function showPolicyUpdateBanner(now = new Date()): boolean {
  return getLegalBannerPhase(now) === "upcoming";
}
