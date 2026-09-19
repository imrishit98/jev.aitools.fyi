export type ShowcaseDemo = {
  id: string;
  authorHandle: string;
  authorName: string;
  tweetUrl: string;
  title: string;
  funnyBlurb: string;
  /** Paths under public/ after scripts/fetch-demos.mjs */
  posterUrl: string;
  videoUrl: string;
  homepage: boolean;
  categoryTags: string[];
};

const demo = (
  partial: Omit<ShowcaseDemo, "posterUrl" | "videoUrl">,
): ShowcaseDemo => ({
  ...partial,
  posterUrl: `/demos/${partial.id}/poster.jpg`,
  videoUrl: `/demos/${partial.id}/video.mp4`,
});

export const showcaseDemos: ShowcaseDemo[] = [
  demo({
    id: "json-render-ctatedev",
    authorHandle: "ctatedev",
    authorName: "Chris Tate",
    tweetUrl: "https://x.com/ctatedev/status/2101022101750571357",
    title: "Generative UI in milliseconds",
    funnyBlurb:
      "json-render plus Jev turns your design system into a slot machine that always pays out components.",
    homepage: true,
    categoryTags: ["generative-ui", "json-render", "demo"],
  }),
  demo({
    id: "zillow-venturetwins",
    authorHandle: "venturetwins",
    authorName: "Justine Moore",
    tweetUrl: "https://x.com/venturetwins/status/2101341075684434245",
    title: "Zillow search that filters vibes",
    funnyBlurb:
      "Thousands of listings, weird filters like \"not near a freeway,\" under 20 seconds for about eighteen cents.",
    homepage: true,
    categoryTags: ["search", "real-estate", "classification"],
  }),
  demo({
    id: "designer-heystefan",
    authorHandle: "heystefan_",
    authorName: "Stefan",
    tweetUrl: "https://x.com/heystefan_/status/2101369117496521042",
    title: "When a designer touches Jev",
    funnyBlurb:
      "Proof that Choice and Score primitives can still look like someone cared about the pixels.",
    homepage: true,
    categoryTags: ["design", "demo", "ui"],
  }),
  demo({
    id: "canada-measure-plan",
    authorHandle: "measure_plan",
    authorName: "AA",
    tweetUrl: "https://x.com/measure_plan/status/2101315424247820309",
    title: "Canada map word match",
    funnyBlurb:
      "Type a word, watch Jev paint Canada. Instant answers for less than a penny. Maple syrup not included.",
    homepage: true,
    categoryTags: ["geo", "maps", "demo"],
  }),
  demo({
    id: "lurk-mxfp4",
    authorHandle: "mxfp4",
    authorName: "Kevin Wang",
    tweetUrl: "https://x.com/mxfp4/status/2101070906852298910",
    title: "lurk.so Reddit citation radar",
    funnyBlurb:
      "A real product, not a weekend demo: monitor Reddit so AI actually cites you. Free tier powered by Jev math.",
    homepage: false,
    categoryTags: ["product", "reddit", "seo"],
  }),
  demo({
    id: "ryze-irabukht",
    authorHandle: "irabukht",
    authorName: "Ryze",
    tweetUrl: "https://x.com/irabukht/status/2101375295152652372",
    title: "Seven SEO workflows, one model",
    funnyBlurb:
      "Competitor pages, citation odds, internal links: seven boring SEO jobs Jev does without writing a novella.",
    homepage: false,
    categoryTags: ["seo", "geo", "workflows"],
  }),
  demo({
    id: "seo-cost-hamonpaulm",
    authorHandle: "HamonPaulm",
    authorName: "Paul-Marie",
    tweetUrl: "https://x.com/HamonPaulm/status/2101265909826609278",
    title: "90% cheaper SEO runs",
    funnyBlurb:
      "Same client deliverable, about $25 instead of $250. Jev ate the spreadsheet part of the agency bill.",
    homepage: false,
    categoryTags: ["seo", "geo", "agency"],
  }),
];

export function getHomepageDemos(): ShowcaseDemo[] {
  return showcaseDemos.filter((d) => d.homepage);
}

export function getDemoById(id: string): ShowcaseDemo | undefined {
  return showcaseDemos.find((d) => d.id === id);
}
