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
  /** False when only a poster is hosted (image posts). */
  hasLocalVideo: boolean;
  homepage: boolean;
  categoryTags: string[];
  projectUrl?: string;
};

type DemoInput = Omit<ShowcaseDemo, "posterUrl" | "videoUrl"> & {
  hasLocalVideo?: boolean;
};

const demo = (partial: DemoInput): ShowcaseDemo => {
  const hasLocalVideo = partial.hasLocalVideo ?? true;
  return {
    ...partial,
    hasLocalVideo,
    posterUrl: `/demos/${partial.id}/poster.jpg`,
    videoUrl: hasLocalVideo ? `/demos/${partial.id}/video.mp4` : "",
  };
};

export const showcaseDemos: ShowcaseDemo[] = [
  demo({
    id: "tanstack-ai-decide-tanstack",
    authorHandle: "tan_stack",
    authorName: "TANSTACK",
    tweetUrl: "https://x.com/tan_stack/status/2101659024890765819",
    title: "decide() in TanStack AI",
    funnyBlurb:
      "TanStack ships decide() for typed choices, scores, and booleans so your agent loop stops cosplaying as a chatbot. They call the moment jevolution; we call it one less regex on model prose.",
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
];

/** Tweet fetch hints for scripts/fetch-demos.mjs (not used at runtime). */
export const showcaseDemoFetchHints: { id: string; tweetId: string; prefer1080?: boolean }[] =
  showcaseDemos.map((d) => ({
    id: d.id,
    tweetId: d.tweetUrl.split("/").pop() ?? "",
    prefer1080: d.id === "json-render-ctatedev",
  }));

export function getHomepageDemos(): ShowcaseDemo[] {
  const home = showcaseDemos.filter((d) => d.homepage);
  const interesting = home.filter((d) => d.categoryTags.includes("interesting"));
  const rest = home.filter((d) => !d.categoryTags.includes("interesting"));
  return [...interesting, ...rest];
}

export function getInterestingDemos(): ShowcaseDemo[] {
  return showcaseDemos.filter((d) => d.categoryTags.includes("interesting"));
}

export function getDemoById(id: string): ShowcaseDemo | undefined {
  return showcaseDemos.find((d) => d.id === id);
}
