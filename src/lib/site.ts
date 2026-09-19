export const siteConfig = {
  name: "Jev Directory",
  shortName: "Jev",
  tagline: "Everything useful with Jev",
  description:
    "A scannable directory of SDKs, integrations, agents, demos, and products built on TypeSafe AI Jev, the System One decision model.",
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
