import showcaseDemoMediaJson from "./showcase-demo-media.json";

type ShowcaseDemoMediaEntry = {
  posterUrl: string;
  videoUrl?: string;
  posterOnly?: boolean;
};

const showcaseDemoMedia = showcaseDemoMediaJson as Record<
  string,
  ShowcaseDemoMediaEntry
>;

export type ShowcaseDemo = {
  id: string;
  authorHandle: string;
  authorName: string;
  tweetUrl: string;
  title: string;
  funnyBlurb: string;
  posterUrl: string;
  videoUrl: string;
  /** True when the card/lightbox should render a video (always remote twimg). */
  hasLocalVideo: boolean;
  /** Video plays from video.twimg.com (never committed under public/demos). */
  videoIsRemote?: boolean;
  homepage: boolean;
  categoryTags: string[];
  projectUrl?: string;
};

type DemoInput = Omit<
  ShowcaseDemo,
  "posterUrl" | "videoUrl" | "videoIsRemote"
> & {
  /** Poster-only card (no tweet video), e.g. X Article cover. */
  hasLocalVideo?: boolean;
};

const demo = (partial: DemoInput): ShowcaseDemo => {
  const media = showcaseDemoMedia[partial.id];
  const posterOnly =
    partial.hasLocalVideo === false || media?.posterOnly === true;

  if (posterOnly || !media?.videoUrl) {
    return {
      ...partial,
      hasLocalVideo: false,
      videoIsRemote: false,
      posterUrl: media?.posterUrl ?? "",
      videoUrl: "",
    };
  }

  return {
    ...partial,
    hasLocalVideo: true,
    videoIsRemote: true,
    posterUrl: media.posterUrl,
    videoUrl: media.videoUrl,
  };
};

/** Absolute URL for JSON-LD and share metadata. */
export function showcaseDemoMediaUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base =
    (typeof import.meta !== "undefined" &&
      import.meta.env?.PUBLIC_SITE_URL) ||
    "https://jev.aitools.fyi";
  const origin = base.replace(/\/$/, "");
  return `${origin}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export const showcaseDemos: ShowcaseDemo[] = [
  demo({
    id: "virlo-clearance-dsqjaffa",
    authorHandle: "dsqjaffa",
    authorName: "jaffa",
    tweetUrl: "https://x.com/dsqjaffa/status/2102090111198363988",
    title: "Virlo Clearance for TikTok content research",
    funnyBlurb:
      "Twelve million viral clips, one Clearance gate so your niche feed stops pretending every trend fits. Jev says on-brief before Virlo's eighty-signal panel tags the hooks.",
    homepage: true,
    categoryTags: ["marketing", "product", "demo"],
    projectUrl: "https://virlo.ai",
  }),
  demo({
    id: "stealads-ad-teardown-mattberman",
    authorHandle: "TheMattBerman",
    authorName: "Matthew Berman",
    tweetUrl: "https://x.com/TheMattBerman/status/2100654891756589230",
    title: "StealAds competitor ad teardown",
    funnyBlurb:
      "724 live ads, 37 brands, 40 seconds, 9 cents. Jev labels hooks and landing mismatches so media buyers steal patterns, not vibes.",
    homepage: true,
    categoryTags: ["marketing", "ads", "product"],
    projectUrl: "https://stealads.ai",
  }),
  demo({
    id: "jev-trader-jarrodwatts",
    authorHandle: "jarrodwatts",
    authorName: "Jarrod Watts",
    tweetUrl: "https://x.com/jarrodwatts/status/2100356151468585346",
    title: "jev-trader buy or sell every Monad block",
    funnyBlurb:
      "Three hundred millisecond blocks, one Jev Choice, real Kuru orders. Your LLM can keep writing macro essays while the bot actually trades MON-USDC.",
    homepage: true,
    categoryTags: ["trading", "applications", "demo"],
    projectUrl: "https://jev-trader.vercel.app",
  }),
  demo({
    id: "1kpapers-nutlope",
    authorHandle: "nutlope",
    authorName: "Hassan El Mghari",
    tweetUrl: "https://x.com/nutlope/status/2100426999546184123",
    title: "1kpapers atlas with Jev topic Choice",
    funnyBlurb:
      "One thousand eighteen papers, eight cents, two hundred fifty six milliseconds median. DeepSeek summarizes; Jev picks the topic so your research map is not hashtag soup.",
    homepage: true,
    categoryTags: ["research", "applications", "demo"],
    projectUrl: "https://1kpapers.com",
  }),
  demo({
    id: "pg-jev-iam-zachi",
    authorHandle: "iam_zachi",
    authorName: "Zachi",
    tweetUrl: "https://x.com/iam_zachi/status/2100679300756435135",
    title: "pg-jev SQL filters in plain language",
    funnyBlurb:
      "WHERE jev(people, 'could work from home') and no vector index babysitting. Postgres rows get Noul gates; cache hits land in six milliseconds.",
    homepage: true,
    categoryTags: ["databases", "integrations", "demo"],
    projectUrl: "https://pgjev.com",
  }),
  demo({
    id: "ai-slop-detector-kraayenjon",
    authorHandle: "kraayenJon",
    authorName: "Jon Kraayenbrink",
    tweetUrl: "https://x.com/kraayenJon/status/2101157548346794059",
    title: "AI Slop Detector for landing pages",
    funnyBlurb:
      "Thirty five parallel Noul tells catch purple gradients and fake testimonials before your designer notices. Chrome renders; Jev judges; DeepSeek narrates the roast.",
    homepage: true,
    categoryTags: ["marketing", "tools", "demo"],
    projectUrl: "https://madewithjev.com/free-tools/ai-slop-detector",
  }),
  demo({
    id: "jevmeter-chetaslua",
    authorHandle: "chetaslua",
    authorName: "chetaslua",
    tweetUrl: "https://x.com/chetaslua/status/2100602714204049588",
    title: "jevmeter live BS meter on any video",
    funnyBlurb:
      "Whisper slices the rant into sentences; parallel Noul probes light up every dodge. Sixteen by nine ffmpeg guilt you can post before the talking head finishes pivoting.",
    homepage: true,
    categoryTags: ["video", "applications", "demo"],
    projectUrl: "https://github.com/ChetasLua/jevmeter",
  }),
  demo({
    id: "superx-post-scoring-robj3d3",
    authorHandle: "robj3d3",
    authorName: "Rob Hallam",
    tweetUrl: "https://x.com/robj3d3/status/2100722975645598191",
    title: "SuperX viral post scoring",
    funnyBlurb:
      "Sixty one Jev questions in a second, rewrite until the score peaks, and reply bait gets side-eyed. Tweet Tester is free; your drafts are not.",
    homepage: true,
    categoryTags: ["marketing", "social", "product"],
    projectUrl: "https://superx.so/tweet-tester",
  }),
  demo({
    id: "tanstack-ai-decide-tanstack",
    authorHandle: "tan_stack",
    authorName: "TANSTACK",
    tweetUrl: "https://x.com/tan_stack/status/2101659024890765819",
    title: "decide() in TanStack AI",
    funnyBlurb:
      "TanStack ships decide() for typed choices, scores, and booleans so your agent loop stops faking it as a chatbot. They call the moment jevolution; we call it one less regex on model prose.",
    homepage: true,
    categoryTags: ["integrations", "sdk", "demo"],
    projectUrl: "https://tanstack.com/ai/latest",
  }),
  demo({
    id: "smart-copy-paste-marcus-lowe",
    authorHandle: "marcus_lowe",
    authorName: "Marcus Lowe",
    tweetUrl: "https://x.com/marcus_lowe/status/2101476399488160013",
    title: "Smart copy and paste",
    funnyBlurb:
      "Your clipboard finally reads the room. Jev picks what you meant to paste before you undo the chaos.",
    homepage: true,
    categoryTags: ["productivity", "clipboard", "demo"],
  }),
  demo({
    id: "ploy-jev-websites-bryantchou",
    authorHandle: "bryantchou",
    authorName: "Bryant Chou",
    tweetUrl: "https://x.com/bryantchou/status/2101485995669770522",
    title: "Ploy picks copy and design per visitor",
    funnyBlurb:
      "Ploy reads your funnel, Jev picks headline and layout for each segment in about twenty-five milliseconds. A/B tests without the all-hands.",
    homepage: true,
    categoryTags: ["marketing", "personalization", "product"],
    projectUrl: "https://ploy.ai",
  }),
  demo({
    id: "clera-jobs-sebastianscott",
    authorHandle: "_sebastianscott",
    authorName: "Seb from Clera",
    tweetUrl: "https://x.com/_sebastianscott/status/2101429879078330390",
    title: "Jev for hiring workflows",
    funnyBlurb:
      "Clera matches talent at scale. Jev handles the messy job of who fits what before your calendar fills with maybe calls.",
    homepage: true,
    categoryTags: ["jobs", "recruiting", "product"],
    projectUrl: "https://getclera.com",
  }),
  demo({
    id: "ui-flow-capture-omarjpeg",
    authorHandle: "omarjpeg",
    authorName: "omar",
    tweetUrl: "https://x.com/omarjpeg/status/2101047036863037753",
    title: "On-demand UI flow capture",
    funnyBlurb:
      "Mobbin energy, but Jev grabs fresh flows for whatever you are building instead of stale screenshots from 2019.",
    homepage: false,
    categoryTags: ["design", "browser-use", "demo"],
  }),
  demo({
    id: "rtrvr-jev-bkalisetty",
    authorHandle: "b_kalisetty",
    authorName: "Bhavani Kalisetty",
    tweetUrl: "https://x.com/b_kalisetty/status/2100693198175928707",
    title: "rtrvr.ai with Jev routing",
    funnyBlurb:
      "Free browser agent, no API key drama. Jev shaves time off recorded tasks while the LLM still writes the plan.",
    homepage: false,
    categoryTags: ["agents", "browser", "product"],
    projectUrl: "https://rtrvr.ai",
  }),
  demo({
    id: "jev-codes-kushwho",
    authorHandle: "kushwho11146",
    authorName: "Kushal Agarwal",
    tweetUrl: "https://x.com/kushwho11146/status/2101103318386758011",
    title: "jev-codes standards gate",
    funnyBlurb:
      "Point Jev at your diff and a YAML standards pack. Your agent gets a merge opinion that is not vibes-only.",
    homepage: false,
    categoryTags: ["devtools", "review", "demo"],
    projectUrl: "https://github.com/kushwho/jev-codes",
  }),
  demo({
    id: "your-signal-fabioangela79",
    authorHandle: "FabioAngela79",
    authorName: "Fabio Angela",
    tweetUrl: "https://x.com/FabioAngela79/status/2101013867627159592",
    title: "Your Signal feed scoring",
    funnyBlurb:
      "Jev scores posts already on your screen against your rules locally. BYOK, reversible, and no telemetry guilt trip.",
    homepage: false,
    categoryTags: ["social", "ranking", "opensource"],
  }),
  demo({
    id: "computer-use-speed-savboj",
    authorHandle: "savboj",
    authorName: "Sav",
    tweetUrl: "https://x.com/savboj/status/2100545295201288678",
    title: "Blink-and-you-miss-it browser use",
    funnyBlurb:
      "Jev plus computer use moves so fast you need slo-mo to see the DOM click. LLMs are still catching up.",
    homepage: false,
    categoryTags: ["browser-use", "agents", "demo"],
  }),
  demo({
    id: "jev-captcha-arbitrage-kenonews",
    authorHandle: "kenonews",
    authorName: "keno",
    tweetUrl: "https://x.com/kenonews/status/2101656436136661163",
    title: "CAPTCHA arbitrage spreadsheet",
    funnyBlurb:
      "Keno runs the napkin math: a cent per puzzle on one side, about seven mills for a hundred Jev solves on the other. Gross margin, not a business plan.",
    homepage: false,
    categoryTags: ["economics", "security", "demo"],
  }),
  demo({
    id: "laya-mlx-lonely-mh",
    authorHandle: "Lonely__MH",
    authorName: "Lonely",
    tweetUrl: "https://x.com/Lonely__MH/status/2101626594452492450",
    title: "laya-mlx snake on Apple Silicon",
    funnyBlurb:
      "Lonely ports Laya, an open text-probability classifier, to MLX on an M2 Pro. Their tweet claims about fifty times faster than cloud Jev for latency; snake runs near sixty decisions per second on roughly one gig of RAM.",
    homepage: false,
    categoryTags: ["local", "mlx", "ecosystem", "demo"],
  }),
  demo({
    id: "browser-ultrafast-gregpr07",
    authorHandle: "gregpr07",
    authorName: "Gregor Zunic",
    tweetUrl: "https://x.com/gregpr07/status/2100411066966749359",
    title: "Browser Use ultrafast flight search",
    funnyBlurb:
      "Seven seconds, four tenths of a cent, and Jev clicks the right DOM node while a tiny LLM only types when it must.",
    homepage: true,
    categoryTags: ["browser-use", "agents", "demo"],
  }),
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
    id: "spreadsheets-intent-dabit3",
    authorHandle: "dabit3",
    authorName: "Nader Dabit",
    tweetUrl: "https://x.com/dabit3/status/2100780008193020049",
    title: "Spreadsheets that read intent",
    funnyBlurb:
      "Type what you mean, not the formula. Jev guesses the column before Excel finishes judging your pivot table.",
    homepage: true,
    categoryTags: ["spreadsheets", "productivity", "demo"],
  }),
  demo({
    id: "zillow-venturetwins",
    authorHandle: "venturetwins",
    authorName: "Justine Moore",
    tweetUrl: "https://x.com/venturetwins/status/2101341075684434245",
    title: "Zillow search that filters vibes",
    funnyBlurb:
      "Thousands of listings, weird filters like not near a freeway, under twenty seconds for about eighteen cents.",
    homepage: true,
    categoryTags: ["search", "real-estate", "classification"],
  }),
  demo({
    id: "magic-jev-ball-acharyaagamya",
    authorHandle: "acharyaagamya",
    authorName: "Agamya",
    tweetUrl: "https://x.com/acharyaagamya/status/2101129105676861621",
    title: "Magic Jev Ball",
    funnyBlurb:
      "A code review gate that bounces bad diffs like a beach ball. Merge when Jev says yes, not when vibes say maybe.",
    homepage: true,
    categoryTags: ["devtools", "review", "demo"],
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
    id: "find-in-page-jiayao",
    authorHandle: "jiayao",
    authorName: "Jiayao",
    tweetUrl: "https://x.com/jiayao/status/2101108866713063804",
    title: "Find in page by meaning",
    funnyBlurb:
      "Ctrl+F but for humans. Highlight the paragraph you meant, not the one that merely contained the keyword.",
    homepage: false,
    categoryTags: ["browser", "search", "demo"],
  }),
  demo({
    id: "typeahead-ui-mikegee",
    authorHandle: "mikegee",
    authorName: "Mike Gee",
    tweetUrl: "https://x.com/mikegee/status/2101098282655338995",
    title: "Typeahead UI",
    funnyBlurb:
      "Suggestions that feel psychic until you remember it is just Jev ranking what you probably meant next.",
    homepage: false,
    categoryTags: ["ui", "typeahead", "demo"],
  }),
  demo({
    id: "jevform-tamirspiritt",
    authorHandle: "tamirspiritt",
    authorName: "Tamir",
    tweetUrl: "https://x.com/tamirspiritt/status/2101079101997982037",
    title: "JevForm",
    funnyBlurb:
      "Forms that branch like a good interviewer: Jev picks the next question so users never see your entire survey at once.",
    homepage: false,
    categoryTags: ["forms", "json-render", "demo"],
  }),
  demo({
    id: "jargon-pigeon-prkeshari",
    authorHandle: "prkeshari",
    authorName: "Prateek K. Keshari",
    tweetUrl: "https://x.com/prkeshari/status/2101048015720951975",
    title: "Jargon-detecting pigeon",
    funnyBlurb:
      "One job: spot corporate speak and poop on it. The most honest editor you will ever ship.",
    homepage: false,
    categoryTags: ["writing", "humor", "demo"],
  }),
  demo({
    id: "ask-jev-waynesutton",
    authorHandle: "waynesutton",
    authorName: "Wayne Sutton",
    tweetUrl: "https://x.com/waynesutton/status/2100487878992388279",
    title: "Ask Jev",
    funnyBlurb:
      "A tiny oracle for structured questions. Less chatbot TED talk, more calibrated answer you can wire into code.",
    homepage: false,
    categoryTags: ["product", "qa", "demo"],
  }),
  demo({
    id: "gmail-intent-dabit3",
    authorHandle: "dabit3",
    authorName: "Nader Dabit",
    tweetUrl: "https://x.com/dabit3/status/2100960281769738433",
    title: "Gmail intent search",
    funnyBlurb:
      "Search your inbox by what you meant, not the exact words your past self typed at 2 a.m.",
    homepage: false,
    categoryTags: ["email", "search", "demo"],
  }),
  demo({
    id: "traffic-guard-gnumanth",
    authorHandle: "GNUmanth",
    authorName: "Hemanth.HM",
    tweetUrl: "https://x.com/GNUmanth/status/2100963107552280754",
    title: "traffic-guard",
    funnyBlurb:
      "Offline bot gate for your reverse proxy. Zero dependencies, one less scraper eating your free tier.",
    homepage: false,
    categoryTags: ["infra", "security", "demo"],
  }),
  demo({
    id: "higgsfield-routing",
    authorHandle: "higgsfield_ai",
    authorName: "Higgsfield",
    tweetUrl: "https://x.com/higgsfield_ai/status/2101022133753430365",
    title: "Higgsfield model routing",
    funnyBlurb:
      "Pick the right generative model per shot without playing roulette with your render budget.",
    homepage: false,
    categoryTags: ["routing", "media", "demo"],
  }),
  demo({
    id: "opencode-tetris-tanaysoni",
    authorHandle: "tanaysoni_",
    authorName: "Tanay Soni",
    tweetUrl: "https://x.com/tanaysoni_/status/2101020844092756072",
    title: "OpenCode plays Tetris",
    funnyBlurb:
      "Your coding agent takes a break and still stacks blocks better than your standup commitments.",
    homepage: false,
    categoryTags: ["games", "agents", "demo"],
  }),
  demo({
    id: "snack-scoring-nikunj",
    authorHandle: "nikunj",
    authorName: "Nikunj",
    tweetUrl: "https://x.com/nikunj/status/2101006585481073093",
    title: "Semantic snack scoring",
    funnyBlurb:
      "Three thousand kids snacks ranked by Jev so lunchbox diplomacy survives the playground.",
    homepage: false,
    categoryTags: ["classification", "humor", "demo"],
  }),
  demo({
    id: "designer-heystefan",
    authorHandle: "heystefan_",
    authorName: "Stefan",
    tweetUrl: "https://x.com/heystefan_/status/2101369117496521042",
    title: "When a designer touches Jev",
    funnyBlurb:
      "Proof that Choice and Score primitives can still look like someone cared about the pixels.",
    homepage: false,
    categoryTags: ["design", "demo", "ui"],
  }),
  demo({
    id: "context-compaction-tamarajtran",
    authorHandle: "tamarajtran",
    authorName: "Tamara",
    tweetUrl: "https://x.com/tamarajtran/status/2100694549362553153",
    title: "Instant context compaction",
    funnyBlurb:
      "Shrink a messy thread before your agent drowns in tokens. Jev keeps the plot, drops the fanfic.",
    homepage: false,
    categoryTags: ["agents", "context", "demo"],
  }),
  demo({
    id: "jev-chess-qibinlou",
    authorHandle: "qibinlou",
    authorName: "Qibin Lou",
    tweetUrl: "https://x.com/qibinlou/status/2100676619815862464",
    title: "Jev Chess Master",
    funnyBlurb:
      "Structured moves on a board that does not care about your Elo. Watch probabilities play defense.",
    homepage: false,
    categoryTags: ["games", "chess", "demo"],
  }),
  demo({
    id: "ad-blocker-iam-zachi",
    authorHandle: "iam_zachi",
    authorName: "Zachi",
    tweetUrl: "https://x.com/iam_zachi/status/2100529273186472318",
    title: "Ad blocker with judgment",
    funnyBlurb:
      "Not every rectangle is an ad, and not every ad is honest. Jev tells the difference before your page layout cries.",
    homepage: false,
    categoryTags: ["browser", "moderation", "demo"],
  }),
  demo({
    id: "pkg-gate-gnumanth",
    authorHandle: "GNUmanth",
    authorName: "Hemanth.HM",
    tweetUrl: "https://x.com/GNUmanth/status/2100405456187564201",
    title: "pkg-gate",
    funnyBlurb:
      "Intent-aware package installs: block the dependency you did not mean before npm writes to disk.",
    homepage: false,
    categoryTags: ["devtools", "security", "demo"],
  }),
  demo({
    id: "code-review-gate-kunal",
    authorHandle: "Kunal_Jain9",
    authorName: "Kunal Jain",
    tweetUrl: "https://x.com/Kunal_Jain9/status/2101027586587738151",
    title: "Jev code review gate",
    funnyBlurb:
      "A merge button that listens to parallel Jev questions instead of one giant LLM rant per file.",
    homepage: false,
    categoryTags: ["devtools", "review", "demo"],
    hasLocalVideo: false,
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
      "Same client deliverable, about twenty-five bucks instead of two fifty. Jev ate the spreadsheet part of the agency bill.",
    homepage: false,
    categoryTags: ["seo", "geo", "agency"],
  }),
  demo({
    id: "dub-malicious-urls-steventey",
    authorHandle: "steventey",
    authorName: "Steven Tey",
    tweetUrl: "https://x.com/steventey/status/2101706435898069093",
    title: "Malicious dub.sh URL scanner",
    funnyBlurb:
      "Ten thousand shady domains fed into Jev, dub.sh stops looking like a free pass for phishers. Steven solved a day-one abuse problem in one weekend sprint.",
    homepage: true,
    categoryTags: ["product", "security", "links"],
    projectUrl: "https://dub.co",
  }),
  demo({
    id: "flutter-genui-jev-abdallahsh07",
    authorHandle: "AbdallahSh07",
    authorName: "Abdallah Sh",
    tweetUrl: "https://x.com/AbdallahSh07/status/2101719364450046351",
    title: "GenUI picks with Jev latency",
    funnyBlurb:
      "Flutter GenUI was waiting on a fast brain for which widget tree wins. Jev picks the UI path while Google’s stack keeps the paint wet.",
    homepage: false,
    categoryTags: ["integrations", "mobile", "ui"],
  }),
  demo({
    id: "chat-negative-comments-developedbyed",
    authorHandle: "developedbyed",
    authorName: "Dev Ed",
    tweetUrl: "https://x.com/developedbyed/status/2101628206478512341",
    title: "Negative comment removal speed run",
    funnyBlurb:
      "Live chat toxicity gets yeeted at Jev speed while the audience watches the counter. Moderation as a spectator sport, minus the LLM essay per insult.",
    homepage: true,
    categoryTags: ["moderation", "streaming", "demo"],
  }),
  demo({
    id: "avec-email-priority-jnnnthnn",
    authorHandle: "jnnnthnn",
    authorName: "Jonathan Unikowski",
    tweetUrl: "https://x.com/jnnnthnn/status/2101399331115077760",
    title: "Live inbox by importance",
    funnyBlurb:
      "Reverse chronological is for archaeologists. Jev re-sorts your inbox while new mail lands so the boss thread floats up without you refreshing like it is 2009.",
    homepage: false,
    categoryTags: ["product", "email", "ranking"],
    projectUrl: "https://avec.ai",
  }),
  demo({
    id: "atonomi-monetization-everestchris6",
    authorHandle: "everestchris6",
    authorName: "Chris Everest",
    tweetUrl: "https://x.com/everestchris6/status/2101706320261128398",
    title: "Monetize Jev on autopilot",
    funnyBlurb:
      "Instant pricing on boring businesses that already have answers. Jev picks the tier in a fifth of a second and tells you how sure it is.",
    homepage: false,
    categoryTags: ["business", "guides", "demo"],
    projectUrl: "https://atonomi.ai",
  }),
  demo({
    id: "twitter-bookmarks-alexchristou",
    authorHandle: "alexchristou_",
    authorName: "Alex Christou",
    tweetUrl: "https://x.com/alexchristou_/status/2101674202361221376",
    title: "Twitter bookmark triage",
    funnyBlurb:
      "Years of bookmark hoarding, one Jev pass to decide what still deserves a tab. Your save-for-later pile finally gets a librarian.",
    homepage: false,
    categoryTags: ["social", "ranking", "productivity"],
  }),
  demo({
    id: "toothless-addressee-ashutoshpuro97",
    authorHandle: "ashutoshpuro97",
    authorName: "Ashutosh Purohit",
    tweetUrl: "https://x.com/ashutoshpuro97/status/2101660362882085299",
    title: "Toothless addressee detection",
    funnyBlurb:
      "Always-on voice that knows when you are talking to the AI versus the human on the couch. No wake word karaoke, no awkward replies to your roommate.",
    homepage: false,
    categoryTags: ["voice", "agents", "demo"],
  }),
  demo({
    id: "openrouter-news-brands-k2sbhai",
    authorHandle: "k2sbhai",
    authorName: "K2",
    tweetUrl: "https://x.com/k2sbhai/status/2101408270128935071",
    title: "471 headlines, 15 brand bets",
    funnyBlurb:
      "OpenRouter Jev scanned four hundred seventy-one news stories in thirty-two seconds and surfaced fifteen brands worth jumping on. Free tier goes brr.",
    homepage: false,
    categoryTags: ["integrations", "news", "routing"],
    projectUrl: "https://openrouter.ai/typesafe/jev-1.13",
  }),
  demo({
    id: "pixelml-av-grok-jev-seanphan",
    authorHandle: "seanphan",
    authorName: "Sean Phan",
    tweetUrl: "https://x.com/seanphan/status/2101398226654171359",
    title: "pixelml-av relevance with Grok + Jev",
    funnyBlurb:
      "Seventy-five minutes of video, eight questions, pennies per query. Jev filters evidence before Grok talks and checks support after so Gemini flash bills do not haunt you.",
    homepage: true,
    categoryTags: ["product", "video", "rag"],
    projectUrl: "https://pixelml.com",
  }),
  demo({
    id: "egghead-procurement-sakai1910",
    authorHandle: "sakai_1910",
    authorName: "sakai",
    tweetUrl: "https://x.com/sakai_1910/status/2101536551360704770",
    title: "Manufacturing procurement browser ops",
    funnyBlurb:
      "Jev browser speed meets SAP and Oracle busywork. Japanese manufacturing procurement gets a robot clerk that clicks faster than your integrator quotes.",
    homepage: false,
    categoryTags: ["product", "browser-use", "enterprise"],
    projectUrl: "https://www.egghead.co.jp",
  }),
  demo({
    id: "hypit-ugc-styles-hypitai",
    authorHandle: "hypitai",
    authorName: "Hypit",
    tweetUrl: "https://x.com/hypitai/status/2101686320909426977",
    title: "100 UGC creators in 13 seconds",
    funnyBlurb:
      "Drop product, audience, and vibe. Jev picks the style mix, Hypit spawns a hundred non-cookie-cutter faces before your coffee cools.",
    homepage: true,
    categoryTags: ["product", "marketing", "ugc"],
    projectUrl: "https://hypit.ai",
  }),
  demo({
    id: "x-reply-skip-itspavangk",
    authorHandle: "ItsPavanGK",
    authorName: "Pavan GK",
    tweetUrl: "https://x.com/ItsPavanGK/status/2101388322077917388",
    title: "Reply or Skip on X scroll",
    funnyBlurb:
      "Green reply, red skip, zero auto-posting. A Chrome extension whispers which posts deserve your hot take while Jev stays advisory only.",
    homepage: false,
    categoryTags: ["browser", "social", "extension"],
  }),
  demo({
    id: "opencode-palette-sonnylazuardi",
    authorHandle: "sonnylazuardi",
    authorName: "Sonny Lazuardi",
    tweetUrl: "https://x.com/sonnylazuardi/status/2101699901461864664",
    title: "Terminal command palette tabs",
    funnyBlurb:
      "Jev predicts your next tab action inside OpenCode threads. Command palette energy for terminal power users who hate hunting the right pane.",
    homepage: false,
    categoryTags: ["devtools", "terminal", "agents"],
    projectUrl: "https://sonnylab.com",
  }),
  demo({
    id: "moongotchi-trading-bot-moongotchi",
    authorHandle: "MoonGotchi",
    authorName: "Moon",
    tweetUrl: "https://x.com/MoonGotchi/status/2101320141065609294",
    title: "Autonomous trading bot, costly lesson",
    funnyBlurb:
      "One evening build, onchain plus offchain feeds, Jev picking trades at machine speed. Also self-reported minus thirty-one grand. Peak interesting.",
    homepage: true,
    categoryTags: ["interesting", "trading", "demo"],
  }),
  demo({
    id: "nhtsa-complaints-kanaworks",
    authorHandle: "KanaWorks_AI",
    authorName: "KANA",
    tweetUrl: "https://x.com/KanaWorks_AI/status/2101509756737462446",
    title: "NHTSA complaints in six buckets",
    funnyBlurb:
      "Seventy-four thousand federal car complaints on the shelf, three hundred sampled, Jev sorted six categories in twenty seconds for about a penny. Paper mountains hate this one trick.",
    homepage: false,
    categoryTags: ["classification", "demo", "data"],
  }),
  demo({
    id: "docjev-jerryjliu0",
    authorHandle: "jerryjliu0",
    authorName: "Jerry Liu",
    tweetUrl: "https://x.com/jerryjliu0/status/2101738281046294552",
    title: "DocJev classify and split",
    funnyBlurb:
      "Feed a doc plus plain-English category rules. DocJev uses Jev to classify or find split boundaries six times faster than gpt-5.6-luna at matching accuracy, liteparse included.",
    homepage: true,
    categoryTags: ["product", "documents", "classification"],
    projectUrl: "https://github.com/jerryjliu/docjev",
  }),
  demo({
    id: "jev-fifa-rebuild-shubhankar",
    authorHandle: "_shubhankar",
    authorName: "Shubhankar Srivastava",
    tweetUrl: "https://x.com/_shubhankar/status/2101830589620056160",
    title: "FIFA rebuilt on Jev loops",
    funnyBlurb:
      "Eleven brains on the pitch, each asking Jev every 150 ms whether to tackle, pass, or shoot. Even the commentary queue got promoted from intern to System One.",
    homepage: true,
    categoryTags: ["games", "sports", "demo"],
    projectUrl: "https://shubhankar.xyz/",
  }),
  demo({
    id: "jev-dodge-realtime-abolbuild",
    authorHandle: "abolbuild",
    authorName: "abolbuild",
    tweetUrl: "https://x.com/abolbuild/status/2100509548339408972",
    title: "Don't get hit: Jev in the game loop",
    funnyBlurb:
      "One goal, zero chat transcripts. Structured state goes in, LEFT or RIGHT or STAY comes out, and your rectangle survives another frame of chaos.",
    homepage: false,
    categoryTags: ["games", "realtime", "demo"],
  }),
  demo({
    id: "jev-doom-realtime-ziwenxu",
    authorHandle: "ziwenxu_",
    authorName: "Ziwen Xu",
    tweetUrl: "https://x.com/ziwenxu_/status/2100039609958727756",
    title: "Jev plays Doom in real time",
    funnyBlurb:
      "Looks like a human fragging, smells like ten typed decisions per second. No essay per demon, just probabilities on the next button mash.",
    homepage: false,
    categoryTags: ["games", "fps", "demo"],
  }),
  demo({
    id: "typesafe-mario-faadilhshaik",
    authorHandle: "faadilhshaik",
    authorName: "Faadil Shaik",
    tweetUrl: "https://x.com/faadilhshaik/status/2100086301894881578",
    title: "Super Mario Bros from RAM, not pixels",
    funnyBlurb:
      "NES memory becomes JSON, Jev picks run or jump, and World 1-1 advances without a vision model cosplaying as a speedrunner.",
    homepage: false,
    categoryTags: ["games", "emulator", "demo"],
    projectUrl: "https://github.com/fhshaik/typesafe-mario",
  }),
  demo({
    id: "jev-shootout-goalie-peytoncasper",
    authorHandle: "peytoncasper",
    authorName: "Peyton Casper",
    tweetUrl: "https://x.com/peytoncasper/status/2101724157587357977",
    title: "Shootout goalie with split-second Jev",
    funnyBlurb:
      "Before the full FIFA rebuild, Shubhankar's keeper was already diving on typed reflexes. Same soccer itch, smaller pitch, equal panic.",
    homepage: false,
    categoryTags: ["games", "sports", "demo"],
    projectUrl: "https://shubhankar.xyz/",
  }),
  demo({
    id: "jev-as-judge-kylejeong",
    authorHandle: "kylejeong",
    authorName: "Kyle Jeong",
    tweetUrl: "https://x.com/kylejeong/status/2101832317862056149",
    title: "Jev as a Judge on real cases",
    funnyBlurb:
      "Feed a docket, get a ruling with confidence. Kyle benchmarked 100 plus famous cases and Jev picked a different outcome than history only 13 percent of the time. Law school wishlist energy.",
    homepage: true,
    categoryTags: ["product", "legal", "demo"],
    projectUrl: "https://judge.kylejeong.com",
  }),
  demo({
    id: "jev-agent-economics-mika",
    authorHandle: "mika_systems",
    authorName: "Mika",
    tweetUrl: "https://x.com/mika_systems/status/2101745157846823228",
    title: "When agents stop renting an LLM per click",
    funnyBlurb:
      "Twenty-eight seconds on why yes-or-no branches belong on System One: batch the leads, threshold the scores, ship the high-confidence rows, nap on the rest.",
    homepage: false,
    categoryTags: ["guides", "economics", "demo"],
  }),
  demo({
    id: "jevrls-supabase-carolmonroe",
    authorHandle: "CarolMonroe",
    authorName: "Carol Monroe",
    tweetUrl: "https://x.com/carolmonroe/status/2101747586126557230",
    title: "JevRLS races your RLS policies",
    funnyBlurb:
      "Paste pg_policies, watch Jev, GPT, and Gemini flag the same Supabase leaks side by side. Same rubric, same stopwatch, fewer quiet data holes.",
    homepage: false,
    categoryTags: ["product", "security", "database"],
    projectUrl: "https://jevrls.lovable.app",
  }),
  demo({
    id: "logview-semantic-iurysza",
    authorHandle: "IurySza",
    authorName: "iury souza",
    tweetUrl: "https://x.com/iurysza/status/2101770705155010568",
    title: "Semantic Android log filter",
    funnyBlurb:
      "Slash becomes a natural-language triage lane. Jev scores fresh log lines while your TUI keeps scrolling and agents get a CLI that speaks relevance, not regex.",
    homepage: false,
    categoryTags: ["devtools", "cli", "demo"],
    projectUrl: "https://github.com/iurysza/logview",
  }),
  demo({
    id: "jevarcade-seven-games-thisiskp",
    authorHandle: "thisiskp_",
    authorName: "KP",
    tweetUrl: "https://x.com/thisiskp_/status/2101846703091376219",
    title: "Seven-game Jev Arcade on Netlify",
    funnyBlurb:
      "KP traded sleep for a coin-op cabinet: color blobs, mood piano, pictionary, puppet theatre, movie guesser, things icons, plus an explainer on Netlify plus Jev. Pick your favorite mini boss.",
    homepage: true,
    categoryTags: ["games", "integrations", "product"],
    projectUrl: "https://jevarcade.netlify.app",
  }),
  demo({
    id: "wordshift-semantic-racer-marcelpociot",
    authorHandle: "marcelpociot",
    authorName: "Marcel Pociot",
    tweetUrl: "https://x.com/marcelpociot/status/2100715684732801095",
    title: "Wordshift semantic typing racer",
    funnyBlurb:
      "Type slower than a jet, bigger than an elephant, faster than a cheetah. Jev scores how far apart your words are in meaning, and the car moves when you are semantically correct, not just fast.",
    homepage: false,
    categoryTags: ["games", "demo"],
  }),
  demo({
    id: "box-incident-triage-levie",
    authorHandle: "levie",
    authorName: "Aaron Levie",
    tweetUrl: "https://x.com/levie/status/2101007708044574906",
    title: "Box incident triage with Jev",
    funnyBlurb:
      "Pull the incident from Box, ask customer-facing and severity with confidence, file it into escalate, monitor, or review, and stamp metadata before anyone schedules a war room for a typo.",
    homepage: false,
    categoryTags: ["enterprise", "integrations", "demo"],
    projectUrl: "https://www.box.com",
  }),
  demo({
    id: "socialwithaayan-ten-jev-repos",
    authorHandle: "socialwithaayan",
    authorName: "Muhammad Aayan",
    tweetUrl: "https://x.com/socialwithaayan/status/2102059089652285739",
    title: "10 Jev repos blowing up right now",
    funnyBlurb:
      "No video, just receipts: Aayan ranks ten GitHub projects by stars and tells you what Jev actually does in each loop. Bookmark the directory guide so you do not paste the same list into Slack twice.",
    homepage: false,
    categoryTags: ["guides", "roundup", "interesting"],
    projectUrl: "https://jev.aitools.fyi/guides/socialwithaayan-ten-jev-repos",
  }),
  demo({
    id: "typesafe-computer-use-awlevin",
    authorHandle: "awlevin",
    authorName: "Aaron Levin",
    tweetUrl: "https://x.com/awlevin/status/2100262612428894676",
    title: "typesafe-computer-use without screenshot theater",
    funnyBlurb:
      "OCR builds the menu, Jev picks the click for fractions of a cent, and Haiku only types when the classifier admits defeat. Your Opus screenshot budget can stay asleep.",
    homepage: false,
    categoryTags: ["browser-computer-use", "browser-use", "demo"],
    projectUrl: "https://github.com/awlevin/typesafe-computer-use",
  }),
  demo({
    id: "drape-virtual-try-on-nailthy62",
    authorHandle: "nailthy62",
    authorName: "Nailthy Tang",
    tweetUrl: "https://x.com/nailthy62/status/2101388186916454439",
    title: "Drape realtime virtual try-on",
    funnyBlurb:
      "You narrate the outfit like a podcast host; Jev hears the transcript, checks what you are already wearing, and yeets the next look onto camera before your coffee cools.",
    homepage: false,
    categoryTags: ["applications", "fashion", "demo"],
    projectUrl: "https://weardrape.app",
  }),
  demo({
    id: "youtube-sponsor-skipper-tdinh",
    authorHandle: "tdinh_me",
    authorName: "Tony Dinh",
    tweetUrl: "https://x.com/tdinh_me/status/2100793777103466615",
    title: "YouTube sponsor segment skipper",
    funnyBlurb:
      "Optional ears on the tab, Jev spots the this video is sponsored pivot, and the player jumps past the coupon code monologue. BYOK, pennies per binge.",
    homepage: false,
    categoryTags: ["applications", "chrome-extension", "demo"],
    projectUrl: "https://github.com/trungdq88/youtube-sponsor-detection",
  }),
  demo({
    id: "internal-links-iannuttall",
    authorHandle: "iannuttall",
    authorName: "Ian Nuttall",
    tweetUrl: "https://x.com/iannuttall/status/2102443273339994558",
    title: "Internal linking with Jev classification",
    funnyBlurb:
      "Five hundred pages, zero spreadsheet trauma. Jev labels the site map and picks which posts should shake hands, then exports CSV your coding agent can actually read.",
    homepage: false,
    categoryTags: ["applications", "seo", "demo"],
    projectUrl: "https://ian.is/tools/internal-links",
  }),
  demo({
    id: "jevpilot-jpschroeder",
    authorHandle: "jpschroeder",
    authorName: "Justin Schroeder",
    tweetUrl: "https://x.com/jpschroeder/status/2100347770867458384",
    title: "JevPilot FSD-style driving sim",
    funnyBlurb:
      "No pixel soup: tables of legal steering arcs, Jev picks a lane like a calm copilot, and the safety brake still owns your dignity near traffic.",
    homepage: false,
    categoryTags: ["games", "simulation", "demo"],
    projectUrl: "https://jevpilot.standardagents.ai",
  }),
];

/** Tweet fetch hints for scripts/sync-showcase-demo-media.mjs (not used at runtime). */
export const showcaseDemoFetchHints: { id: string; tweetId: string; prefer1080?: boolean }[] =
  showcaseDemos.map((d) => ({
    id: d.id,
    tweetId: d.tweetUrl.split("/").pop() ?? "",
    prefer1080: d.id === "json-render-ctatedev",
  }));

/** Curated strip on `/` (Press play on the timeline). Full library: `/showcase`. */
const HOMEPAGE_DEMO_IDS: string[] = [
  "moongotchi-trading-bot-moongotchi",
  "virlo-clearance-dsqjaffa",
  "stealads-ad-teardown-mattberman",
  "jev-trader-jarrodwatts",
  "tanstack-ai-decide-tanstack",
  "browser-ultrafast-gregpr07",
  "pg-jev-iam-zachi",
  "docjev-jerryjliu0",
  "dub-malicious-urls-steventey",
];

export function getHomepageDemos(): ShowcaseDemo[] {
  const byId = new Map(showcaseDemos.map((d) => [d.id, d]));
  const curated = HOMEPAGE_DEMO_IDS.flatMap((id) => {
    const demo = byId.get(id);
    return demo ? [demo] : [];
  });
  const interesting = curated.filter((d) => d.categoryTags.includes("interesting"));
  const rest = curated.filter((d) => !d.categoryTags.includes("interesting"));
  return [...interesting, ...rest];
}

export function getInterestingDemos(): ShowcaseDemo[] {
  return showcaseDemos.filter((d) => d.categoryTags.includes("interesting"));
}

export function getDemoById(id: string): ShowcaseDemo | undefined {
  return showcaseDemos.find((d) => d.id === id);
}
