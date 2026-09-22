export const siteConfig = {
  /** Public hostname brand (navbar, JSON-LD, titles). */
  hostnameBrand: "Jev.aitools.fyi",
  name: "Jev Directory",
  shortName: "Jev",
  tagline: "The sharpest map of Jev tools",
  description:
    "Jev Directory at Jev.aitools.fyi: curated SDKs, integrations, MCP servers, agents, demos, and apps on TypeSafe Jev. Find System One tooling fast, with links you can trust.",
  url:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.PUBLIC_SITE_URL &&
      String(import.meta.env.PUBLIC_SITE_URL).replace(/\/$/, "")) ||
    (typeof process !== "undefined" &&
      process.env.PUBLIC_SITE_URL &&
      process.env.PUBLIC_SITE_URL.replace(/\/$/, "")) ||
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")) ||
    "https://jev.aitools.fyi",
  parentBrand: {
    name: "aitools.fyi",
    url: "https://aitools.fyi",
  },
  /** Southern East Inc. public contact (JSON-LD, contact page). No public phone in repo. */
  publisherContact: {
    legalName: "Southern East Inc.",
    email: "support@aitools.fyi",
    contactType: "customer support",
    address: {
      streetAddress: "222 Main St E",
      addressLocality: "North Bay",
      addressRegion: "ON",
      postalCode: "P1B 1B1",
      addressCountry: "CA",
    },
  },
  submitIssueUrl:
    "https://github.com/imrishit98/jev.aitools.fyi/issues/new",
  typesafe: {
    docs: "https://docs.typesafe.ai",
    home: "https://typesafe.ai",
    playground: "https://console.typesafe.ai/playground",
    api: "https://docs.typesafe.ai/api",
    discord: "https://discord.gg/typesafe",
  },
  vercelGateway:
    "https://vercel.com/docs/ai-gateway/models/jev",
  githubRepo: "https://github.com/imrishit98/jev.aitools.fyi",
} as const;
