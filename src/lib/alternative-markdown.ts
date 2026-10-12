import type { Alternative } from "@/data/alternatives-types";
import { linksForAlternative } from "@/lib/directory-links";
import { withOutboundRef } from "@/lib/outbound-attribution";
import { absoluteUrl } from "@/lib/seo";

function plain(text: string): string {
  return text
    .replace(/\u2014/g, " ")
    .replace(/\u2013/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function linkList(links: ReturnType<typeof linksForAlternative>): string {
  if (links.length === 0) return "";
  return [
    "## In the directory",
    "",
    ...links.map((link) => `- [${plain(link.label)}](${absoluteUrl(link.href)})`),
  ].join("\n");
}

import type { AlternativesHub } from "@/data/alternatives-types";

export function alternativesHubMarkdown(hub: AlternativesHub): string {
  const ranked = hub.ranked
    .map(
      (r) =>
        `${r.rank}. [${plain(r.name)}](${absoluteUrl(r.pagePath)}): ${plain(r.openWeights)}; ${plain(r.hostedApi)}; DI ${plain(r.decisionIndex)}`,
    )
    .join("\n");
  const faq = hub.faq
    .map((entry) => `### ${plain(entry.question)}\n\n${plain(entry.answer)}`)
    .join("\n\n");
  const sources = hub.sources
    .map((s) => `- [${plain(s.label)}](${withOutboundRef(s.url)})`)
    .join("\n");
  return [
    `# ${plain(hub.h1)}`,
    "",
    `> ${plain(hub.seoDescription)}`,
    "",
    `Last verified: ${hub.lastVerified}.`,
    "",
    plain(hub.summary),
    "",
    "## Ranked alternatives",
    "",
    ranked,
    "",
    "## FAQ",
    "",
    faq,
    "",
    "## Sources",
    "",
    sources,
    "",
    `Canonical: ${absoluteUrl("/alternatives")}`,
    `Markdown: ${absoluteUrl("/alternatives.md")}`,
    "",
  ].join("\n");
}

export function alternativeMarkdown(alt: Alternative, canonicalPath: string): string {
  const table = [
    "| Topic | " + alt.displayName + " | Jev | Source |",
    "| --- | --- | --- | --- |",
    ...alt.facts.map(
      (f) =>
        `| ${plain(f.row)} | ${plain(f.them)} | ${plain(f.jev)} | [${plain(f.sourceLabel)}](${withOutboundRef(f.sourceUrl)}) |`,
    ),
  ].join("\n");

  const sections = alt.sections
    .map((section) => {
      const code = section.code
        ? `\n\n\`\`\`${section.code.lang}\n${section.code.content}\n\`\`\``
        : "";
      return `## ${plain(section.h)}\n\n${plain(section.body)}${code}`;
    })
    .join("\n\n");

  const faq = alt.faq
    .map((entry) => `### ${plain(entry.question)}\n\n${plain(entry.answer)}`)
    .join("\n\n");

  const sources = alt.sources
    .map((s) => `- [${plain(s.label)}](${withOutboundRef(s.url)})`)
    .join("\n");

  return [
    `# ${plain(alt.h1)}`,
    "",
    `> ${plain(alt.seoDescription)}`,
    "",
    `Last verified: ${alt.lastVerified}.`,
    "",
    "## Answer",
    "",
    plain(alt.summary),
    "",
    plain(alt.keyPoint),
    "",
    "## At a glance",
    "",
    table,
    "",
    sections,
    "",
    "## When to choose " + plain(alt.displayName),
    "",
    ...alt.whenChooseThem.map((b) => `- ${plain(b)}`),
    "",
    "## When to stay on Jev",
    "",
    ...alt.whenChooseJev.map((b) => `- ${plain(b)}`),
    "",
    linkList(linksForAlternative(alt)),
    "",
    "## FAQ",
    "",
    faq,
    "",
    "## Sources",
    "",
    sources,
    "",
    `Canonical: ${absoluteUrl(canonicalPath)}`,
    `Markdown: ${absoluteUrl(`${canonicalPath}.md`)}`,
    "",
  ].join("\n");
}
