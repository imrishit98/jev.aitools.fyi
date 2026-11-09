import { siteConfig } from "@/lib/site";

/** Privacy Policy and Terms last updated (Connecticut requires month, day, and year). */
export const LEGAL_LAST_UPDATED_DISPLAY = "October 5, 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-10-05";

/** Privacy Policy page last updated when only that document's text changes. */
export const PRIVACY_POLICY_LAST_UPDATED_DISPLAY = "October 10, 2026";
export const PRIVACY_POLICY_LAST_UPDATED_ISO = "2026-10-10";

/** Material partner-sharing sections take effect on this date (30+ days after Oct 5, 2026). */
export const PARTNER_SHARING_EFFECTIVE_DISPLAY = "November 9, 2026";
export const PARTNER_SHARING_EFFECTIVE_ISO = "2026-11-09";

/** Midnight America/Toronto on the effective calendar date (matches aitools.fyi). */
export const PARTNER_SHARING_EFFECTIVE_EPOCH_MS = Date.parse(
  "2026-11-09T05:00:00.000Z",
);

/** localStorage key when the visitor dismisses the pre-effective policy popup. */
export const POLICY_NOTICE_DISMISS_STORAGE_KEY =
  "jev_policy_notice_dismissed_2026-11-09";

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
  return now.getTime() < PARTNER_SHARING_EFFECTIVE_EPOCH_MS
    ? "upcoming"
    : "post-effective";
}

/** @deprecated Use getLegalBannerPhase in the banner script. */
export function showPolicyUpdateBanner(now = new Date()): boolean {
  return getLegalBannerPhase(now) === "upcoming";
}

/** Whether partner-sharing sections are in effect (build-time and runtime). */
export function isPartnerSharingEffective(now = new Date()): boolean {
  return now.getTime() >= PARTNER_SHARING_EFFECTIVE_EPOCH_MS;
}

/** Dated box label on Privacy Policy and Terms (Takes effect vs in effect since). */
export function partnerSharingDatedBoxLabel(now = new Date()): string {
  return isPartnerSharingEffective(now)
    ? `In effect since ${PARTNER_SHARING_EFFECTIVE_DISPLAY}`
    : `Takes effect ${PARTNER_SHARING_EFFECTIVE_DISPLAY}`;
}

/** Phrase-level copy for static legal pages (evaluated at SSG build time). */
export function getPartnerSharingLegalCopy(now = new Date()) {
  const effective = isPartnerSharingEffective(now);
  const date = PARTNER_SHARING_EFFECTIVE_DISPLAY;
  const programsRefBelow = effective
    ? '(see "Programs you choose to join" below)'
    : '(see "Programs you choose to join" below, when that section takes effect)';
  const programsRef = effective
    ? '(see "Programs you choose to join")'
    : '(see "Programs you choose to join" when that section takes effect)';

  return {
    effective,
    datedBoxLabel: partnerSharingDatedBoxLabel(now),
    programsRefBelow,
    programsRef,
    partnerSectionTitle: effective
      ? "Business and research partners"
      : "Business and research partners (future)",
    partnerSectionIntroPrefix: effective ? "Since" : "Starting",
    partnerListPreamble: effective
      ? "When we share with partners, we list here the types of partners we actually work with and what they receive."
      : "Before any sharing starts, we will list here the types of partners we actually work with and what they receive.",
    termsServiceDataPrefix: effective ? "Since" : "Starting",
  };
}
