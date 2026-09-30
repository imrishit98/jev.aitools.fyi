import {
  agentGuideSlugs,
  agentGuides,
  agentGuidesHub,
  getAgentGuide,
} from "@/data/agent-guides";
import { getLearnGuide, learnGuideSlugs } from "@/data/learn-guides";
import {
  getLayaVsJevGuide,
  layaVsJevGuideSlugs,
  layaVsJevGuides,
  layaVsJevHub,
} from "@/data/laya-vs-jev-guides";
import { jevSpecSheet } from "@/data/spec";
import {
  agentGuideDate,
  agentHubDate,
  CONTENT_CHECKED,
  layaGuideDate,
  layaHubDate,
  learnGuideDate,
} from "@/lib/content-dates";
import { linksForAgentGuide, linksForLayaGuide, type DirectoryLink } from "@/lib/directory-links";
import { withOutboundRef } from "@/lib/outbound-attribution";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export function markdownFileResponse(body: string, canonicalPath: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      Link: `<${absoluteUrl(canonicalPath)}>; rel="canonical"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function plain(text: string): string {
  return text
    .replace(/\u2014/g, " ")
    .replace(/\u2013/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function linkList(links: DirectoryLink[]): string {
  if (links.length === 0) return "";
  return ["## In the directory", "", ...links.map((link) => `- [${plain(link.label)}](${absoluteUrl(link.href)})`)].join(
    "\n",
  );
}

function sourcesBlock(
  sources: { label: string; url: string }[],
  updated: string,
): string {
  const lines = sources.map(
    (src) => `- [${plain(src.label)}](${withOutboundRef(src.url)})`,
  );
  return [
    "## Sources",
    "",
    `Directory copy checked ${updated}. Primary sources:`,
    "",
    ...lines,
  ].join("\n");
}

export function agentGuideMarkdown(slug: string): string | null {
  const guide = getAgentGuide(slug);
  if (!guide) return null;
  const path = `/guides/jev-with-ai-agents/${slug}`;
  const updated = agentGuideDate(slug);
  const sections = guide.sections
    .map((section) => {
      const code = section.code
        ? `\n\n\`\`\`${section.code.lang}\n${section.code.content}\n\`\`\``
        : "";
      return `## ${plain(section.h)}\n\n${plain(section.body)}${code}`;
    })
    .join("\n\n");
  const faq = guide.faq
    .map((entry) => `### ${plain(entry.question)}\n\n${plain(entry.answer)}`)
    .join("\n\n");
  return [
    `# ${plain(guide.title)}`,
    "",
    `> ${plain(guide.seoDescription)}`,
    "",
    plain(guide.tagline),
    "",
    "## Answer",
    "",
    plain(guide.whyJev),
    "",
    sections,
    "",
    linkList(linksForAgentGuide(guide)),
    "",
    "## FAQ",
    "",
    faq,
    "",
    sourcesBlock(guide.sources, updated),
    "",
    `Canonical: ${absoluteUrl(path)}`,
    `Markdown: ${absoluteUrl(`${path}.md`)}`,
    "",
  ].join("\n");
}

export function agentHubMarkdown(): string {
  const lines = agentGuideSlugs.map((slug) => {
    const guide = agentGuides[slug];
    return `- [${plain(guide.title)}](${absoluteUrl(`/guides/jev-with-ai-agents/${slug}`)}): ${plain(guide.seoDescription)}`;
  });
  const faq = agentGuidesHub.faq
    .map((entry) => `### ${plain(entry.question)}\n\n${plain(entry.answer)}`)
    .join("\n\n");
  return [
    `# ${plain(agentGuidesHub.title)}`,
    "",
    `> ${plain(agentGuidesHub.seoDescription)}`,
    "",
    plain(agentGuidesHub.tagline),
    "",
    plain(agentGuidesHub.intro),
    "",
    "## Guides",
    "",
    ...lines,
    "",
    "## FAQ",
    "",
    faq,
    "",
    `Directory copy checked ${agentHubDate}.`,
    `Canonical: ${absoluteUrl("/guides/jev-with-ai-agents")}`,
    "",
  ].join("\n");
}

export function layaGuideMarkdown(slug: string): string | null {
  const guide = getLayaVsJevGuide(slug);
  if (!guide) return null;
  const path = `/learn/laya-vs-jev/${slug}`;
  const updated = layaGuideDate(slug);
  const sections = guide.sections
    .map((section) => {
      const code = section.code
        ? `\n\n\`\`\`${section.code.lang}\n${section.code.content}\n\`\`\``
        : "";
      return `## ${plain(section.h)}\n\n${plain(section.body)}${code}`;
    })
    .join("\n\n");
  const faq = guide.faq
    .map((entry) => `### ${plain(entry.question)}\n\n${plain(entry.answer)}`)
    .join("\n\n");
  return [
    `# ${plain(guide.title)}`,
    "",
    `> ${plain(guide.seoDescription)}`,
    "",
    "## Answer",
    "",
    plain(guide.keyPoint),
    "",
    plain(guide.tagline),
    "",
    sections,
    "",
    linkList(linksForLayaGuide(slug)),
    "",
    "## FAQ",
    "",
    faq,
    "",
    sourcesBlock(guide.sources, updated),
    "",
    `Canonical: ${absoluteUrl(path)}`,
    `Markdown: ${absoluteUrl(`${path}.md`)}`,
    "",
  ].join("\n");
}

export function layaHubMarkdown(): string {
  const lines = layaVsJevGuideSlugs.map((slug) => {
    const guide = layaVsJevGuides[slug];
    return `- [${plain(guide.title)}](${absoluteUrl(`/learn/laya-vs-jev/${slug}`)}): ${plain(guide.seoDescription)}`;
  });
  const faq = layaVsJevHub.faq
    .map((entry) => `### ${plain(entry.question)}\n\n${plain(entry.answer)}`)
    .join("\n\n");
  return [
    `# ${plain(layaVsJevHub.title)}`,
    "",
    `> ${plain(layaVsJevHub.seoDescription)}`,
    "",
    plain(layaVsJevHub.tagline),
    "",
    plain(layaVsJevHub.intro),
    "",
    "## Guides",
    "",
    ...lines,
    "",
    "## FAQ",
    "",
    faq,
    "",
    `Directory copy checked ${layaHubDate}.`,
    `Canonical: ${absoluteUrl("/learn/laya-vs-jev")}`,
    "",
  ].join("\n");
}

export function learnGuideMarkdown(slug: string): string | null {
  const guide = getLearnGuide(slug);
  if (!guide) return null;
  const path = `/learn/${slug}`;
  const updated = learnGuideDate(slug);
  const sections = guide.headings
    .map((section) => `## ${plain(section.h)}\n\n${plain(section.body)}`)
    .join("\n\n");
  return [
    `# ${plain(guide.title)}`,
    "",
    `> ${plain(guide.seoDescription)}`,
    "",
    "## Answer",
    "",
    plain(guide.definition),
    "",
    sections,
    "",
    `Directory copy checked ${updated}. This directory is independent of TypeSafe AI unless a listing says it is official.`,
    `Canonical: ${absoluteUrl(path)}`,
    `Markdown: ${absoluteUrl(`${path}.md`)}`,
    "",
  ].join("\n");
}

export function stableFactsMarkdown(): string {
  const docs = withOutboundRef(siteConfig.typesafe.docs);
  return [
    "## Stable facts",
    "",
    `Checked ${CONTENT_CHECKED}. These lines come from the directory spec sheet. Latency and price are TypeSafe's published figures, not measurements from this site.`,
    "",
    `- Model: ${jevSpecSheet.model} (${jevSpecSheet.version}).`,
    `- Endpoint: ${jevSpecSheet.endpoint}.`,
    `- Input: ${jevSpecSheet.input}.`,
    `- Output: ${jevSpecSheet.output}.`,
    `- Latency: ${jevSpecSheet.latency}.`,
    `- Pricing: ${jevSpecSheet.pricing}.`,
    `- Primitives: Choice (pick one option), Score (rate on a rubric), Noul (0 to 1 on a statement).`,
    `- Source: [TypeSafe docs](${docs}).`,
    "",
    `Directory manifest: ${absoluteUrl("/.well-known/jev-directory.json")}`,
  ].join("\n");
}

/** Markdown body for a negotiated HTML path, or null when this path has no alternate. */
export function markdownForPath(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.endsWith(".md")) return null;

  if (path === "/guides/jev-with-ai-agents") return agentHubMarkdown();
  const agent = path.match(/^\/guides\/jev-with-ai-agents\/([a-z0-9-]+)$/);
  if (agent) return agentGuideMarkdown(agent[1]!);

  if (path === "/learn/laya-vs-jev") return layaHubMarkdown();
  const laya = path.match(/^\/learn\/laya-vs-jev\/([a-z0-9-]+)$/);
  if (laya) return layaGuideMarkdown(laya[1]!);

  const learn = path.match(/^\/learn\/([a-z0-9-]+)$/);
  if (learn && learnGuideSlugs.includes(learn[1] as (typeof learnGuideSlugs)[number])) {
    return learnGuideMarkdown(learn[1]!);
  }
  return null;
}

export function isMarkdownNegotiatedPath(pathname: string): boolean {
  return markdownForPath(pathname) !== null;
}
