import type { Alternative } from "@/data/alternatives-types";
import { alternativeSlugs } from "@/data/alternatives-slugs";

export const alternatives: Record<(typeof alternativeSlugs)[number], Alternative> = {
  "cloudflare-clef": {
    "slug": "cloudflare-clef",
    "displayName": "Cloudflare clef",
    "listingSlug": "cloudflare-clef",
    "ecosystemSlugs": [
      "apolinario-decision-index"
    ],
    "seoTitle": "Cloudflare Clef vs Jev: open weights on Workers AI",
    "seoDescription": "Clef and Clef-flash are Cloudflare's Apache-2.0 decision models with a Jev-compatible API. Compare price, context, speed, benchmarks and how to switch.",
    "h1": "Cloudflare Clef vs Jev",
    "keyPoint": "clef is Cloudflare's hosted decision model on Workers AI. It fits teams that already run Workers and want metered inference beside their fetch handlers.",
    "summary": "Cloudflare clef answers typed decision questions through Workers AI while publishing weights on Hugging Face for inspection. You pay Cloudflare meters instead of TypeSafe Jev tokens, which helps when Workers, R2, and D1 already anchor your stack. clef-flash is a lower priced SKU with a different public Decision Index score. clef is not a drop-in for every Jev gateway integration, but it competes in the same category: parallel decisions over explicit options, not open-ended chat.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Cloudflare",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "2025 Workers AI catalog (see model page)",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0 weights on Hugging Face",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "$0.24 per M input tokens (vendor list, 2026-10-12)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Workers AI HTTP for clef / clef-flash",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Choice-style decision tasks (vendor docs)",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Text state per Workers AI schema",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "clef and clef-flash SKUs",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Vendor-reported edge inference; measure your region",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "53.08 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Processed under Cloudflare AI terms",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "REST via Workers AI; no TypeSafe SDK by default",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "14,351 HF downloads, apache-2.0 (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      },
      {
        "row": "clef-flash hosted price",
        "them": "$0.038 per M input tokens (vendor list, 2026-10-12)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Cloudflare clef-flash model page",
        "sourceUrl": "https://developers.cloudflare.com/workers-ai/models/clef-flash/"
      },
      {
        "row": "clef-flash Decision Index",
        "them": "47.61 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ],
    "sections": [
      {
        "h": "What clef is",
        "body": "Cloudflare clef answers typed decision questions through Workers AI while publishing weights on Hugging Face for inspection. You pay Cloudflare meters instead of TypeSafe Jev tokens, which helps when Workers, R2, and D1 already anchor your stack. clef-flash is a lower priced SKU with a different public Decision Index score. clef is not a drop-in for every Jev gateway integration, but it competes in the same category: parallel decisions over explicit options, not open-ended chat. clef Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Cloudflare or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists Cloudflare clef at 53.08 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose clef when your constraints match its deployment model: Workers AI is already approved in your security review; You want inference colocated with Workers requests; Finops prefers Cloudflare meters over a second AI vendor."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"@cf/cloudflare/clef\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "Workers AI runs clef beside your existing fetch handlers, which matters when latency budgets are dominated by round trips to a separate AI vendor. clef-flash is a separate SKU with its own price row in our table; do not assume flash scores transfer to the standard clef gate you ship in production. Gateway adapters that hard-code api.typesafe.ai still need a translation layer for Workers AI JSON even when question semantics match. Cloudflare publishes weights on Hugging Face, but production inference still flows through Workers AI meters and account limits. If your security review already approved Workers, clef is often faster to ship than opening a second AI vendor relationship. Measure p95 inside the region where your Workers execute; edge placement changes both latency and which failure modes you see first."
      }
    ],
    "whenChooseThem": [
      "Workers AI is already approved in your security review",
      "You want inference colocated with Workers requests",
      "Finops prefers Cloudflare meters over a second AI vendor"
    ],
    "whenChooseJev": [
      "You depend on TypeSafe gateway partners and api.typesafe.ai SLAs",
      "You need the highest public Decision Index score among hosted options we track",
      "Legal already signed TypeSafe data processing terms"
    ],
    "faq": [
      {
        "question": "Is Cloudflare clef the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. Cloudflare clef is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does Cloudflare clef beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores Cloudflare clef; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with Cloudflare clef?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with Cloudflare clef on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "Cloudflare Workers AI: clef",
        "url": "https://developers.cloudflare.com/workers-ai/models/clef/"
      },
      {
        "label": "Cloudflare Workers AI: clef-flash",
        "url": "https://developers.cloudflare.com/workers-ai/models/clef-flash/"
      },
      {
        "label": "Hugging Face: Cloudflare/clef",
        "url": "https://huggingface.co/Cloudflare/clef"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "kev": {
    "slug": "kev",
    "displayName": "Kev",
    "listingSlug": "jaredpalmer-kev",
    "ecosystemSlugs": [
      "apolinario-decision-index",
      "posthog-jeeves"
    ],
    "seoTitle": "Kev vs Jev: Jared Palmer's open decision models",
    "seoDescription": "Kev is an open Jev-like model family on Qwen with a System One compatible server. Compare sizes, hardware, accuracy, license and migration from Jev.",
    "h1": "Kev as a Jev alternative",
    "keyPoint": "Kev ships Apache 2.0 decision checkpoints with a TypeSafe-compatible HTTP server, so many teams only change baseURL while keeping parallel Choice, Score, and Noul questions.",
    "summary": "Kev is Jared Palmer's open-weight family trained on Qwen3.5 and Qwen3.8 bases. kev.serve exposes POST /v1/systemone so the TypeSafe Python SDK can target localhost. README publishes vendor-reported accuracy and Brier tables against hosted Jev on frozen suites. Independent Decision Index scores Kev-27B slightly below Jev in our snapshot, but self-host economics and fine-tuning freedom drive most evaluations.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Jared Palmer",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "Public GitHub releases from 2025",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "POST /v1/systemone via kev.serve",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Choice, Score, Noul",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Single state string plus questions map",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "0.8B, 4B, 9B, 27B",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "README cites hundreds of ms for sample tickets on laptop class GPUs (vendor-reported)",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "58.78 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Stays on hardware you control when self-hosted",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "typesafe_sdk pointed at local base URL",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "8,943 GitHub stars (2026-10-12); 21,656 HF downloads (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What Kev is",
        "body": "Kev is Jared Palmer's open-weight family trained on Qwen3.5 and Qwen3.8 bases. kev.serve exposes POST /v1/systemone so the TypeSafe Python SDK can target localhost. README publishes vendor-reported accuracy and Brier tables against hosted Jev on frozen suites. Independent Decision Index scores Kev-27B slightly below Jev in our snapshot, but self-host economics and fine-tuning freedom drive most evaluations. Kev Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Jared Palmer or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists Kev at 58.78 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose Kev when your constraints match its deployment model: You must run weights inside your VPC without sending state to TypeSafe; You want fine-tune adapters on your own labels; You already operate GPU inference and can own calibration."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"kev-latest\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "kev.serve is the supported path for POST /v1/systemone compatibility; pick a checkpoint size that matches your GPU budget before you promise 27B accuracy. README tables that compare to hosted Jev are vendor-run on frozen suites; treat them as directional, not as your compliance sign-off. Fine-tuning adapters on your labels is the main reason teams pick Kev over metered tokens, not a one-point Decision Index gap. Kev checkpoints span sub-billion to 27B parameters; match VRAM, batch size, and concurrency before you copy a demo config. Shadow mode against hosted Jev should log raw probabilities, not just argmax labels, so you can diff calibration on disputed rows. Keep rollback to api.typesafe.ai for at least one release when you move a production gate to self-hosted Kev."
      }
    ],
    "whenChooseThem": [
      "You must run weights inside your VPC without sending state to TypeSafe",
      "You want fine-tune adapters on your own labels",
      "You already operate GPU inference and can own calibration"
    ],
    "whenChooseJev": [
      "You want zero GPU ops and predictable hosted billing",
      "You need the vendor-supported api.typesafe.ai path for compliance",
      "Your option sets exceed what you want to tune on open checkpoints"
    ],
    "faq": [
      {
        "question": "Is Kev the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. Kev is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does Kev beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores Kev; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with Kev?",
        "answer": "Many teams point typesafe_sdk at a compatible self-hosted base URL. Verify model strings and response metadata in staging."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with Kev on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "GitHub: jaredpalmer/kev",
        "url": "https://github.com/jaredpalmer/kev"
      },
      {
        "label": "Hugging Face: jaredpalmer/kev-4b",
        "url": "https://huggingface.co/jaredpalmer/kev-4b"
      },
      {
        "label": "Hugging Face Space: jaredpalmer/kev",
        "url": "https://huggingface.co/spaces/jaredpalmer/kev"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "openai-decisions-api": {
    "slug": "openai-decisions-api",
    "displayName": "OpenAI Decisions API",
    "listingSlug": "openai-decisions-api",
    "seoTitle": "OpenAI Decisions API vs Jev: price, speed, inputs",
    "seoDescription": "OpenAI's Decisions API (gpt-6-luna, beta) vs TypeSafe Jev: request shape, image input, price per token, data controls and when each one fits.",
    "h1": "OpenAI Decisions API as a Jev alternative",
    "keyPoint": "Decisions API is OpenAI's beta surface for structured decisions rather than chat completions. Evaluate it when OpenAI enterprise contracts already cover your AI spend.",
    "summary": "OpenAI announced Decisions API in public beta with a Luna-class decision model priced per million input tokens in community posts. It targets the same engineering pain as Jev: software needs scored options, not essays. Beta terms, model names, and regional availability can change quickly. Our snapshot does not list OpenAI on the public Decision Index board, so treat accuracy claims as vendor-beta until you run your own eval harness.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "OpenAI",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "Public beta announced 2026 (community post)",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Hosted API only",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "gpt-6-luna (vendor, beta): $0.1 per M input tokens (vendor list, 2026-10-12)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Decisions API (beta) separate from chat completions",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Structured decision objects (vendor beta docs)",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Vendor JSON schema for decisions",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "gpt-6-luna class (vendor naming)",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Vendor beta SLAs; measure per region",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "Not listed on Decision Index public board for this edition",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Processed under OpenAI enterprise / API terms",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "OpenAI SDK routes for beta endpoints",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "See vendor channels",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What Decisions API is",
        "body": "OpenAI announced Decisions API in public beta with a Luna-class decision model priced per million input tokens in community posts. It targets the same engineering pain as Jev: software needs scored options, not essays. Beta terms, model names, and regional availability can change quickly. Our snapshot does not list OpenAI on the public Decision Index board, so treat accuracy claims as vendor-beta until you run your own eval harness. Decisions API Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not OpenAI or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 does not list OpenAI Decisions API in the snapshot we ship."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose Decisions API when your constraints match its deployment model: OpenAI is already your primary AI vendor with approved DPAs; You want decisions beside GPT-class tools under one invoice; You can accept beta churn on model names and limits."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"gpt-6-luna\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "Decisions API is a beta surface: model codenames, regional availability, and enterprise DPAs can change without a semver bump on your side. Request payloads resemble System One questions, but error shapes and rate limits follow OpenAI's general API policies. If you already route chat through OpenAI, adding Decisions can reduce vendor count, but you lose the open-weight exit ramp Kev or Laya provide. Community beta posts cite pricing; your enterprise agreement may override list numbers shown in our facts table. OpenAI does not appear on the public Decision Index board we import, so plan an internal eval harness before accuracy promises. Data handling follows OpenAI's standard API terms unless your account team signs a custom addendum."
      }
    ],
    "whenChooseThem": [
      "OpenAI is already your primary AI vendor with approved DPAs",
      "You want decisions beside GPT-class tools under one invoice",
      "You can accept beta churn on model names and limits"
    ],
    "whenChooseJev": [
      "You need System One primitives documented on docs.typesafe.ai today",
      "You rely on Vercel AI Gateway typesafe-ai/jev routing",
      "You want public Decision Index scores for procurement"
    ],
    "faq": [
      {
        "question": "Is OpenAI Decisions API the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. OpenAI Decisions API is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does OpenAI Decisions API beat Jev on Decision Index?",
        "answer": "OpenAI Decisions API is not listed on the Decision Index snapshot we import; run your own eval."
      },
      {
        "question": "Can I use the TypeSafe SDK with OpenAI Decisions API?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with OpenAI Decisions API on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "OpenAI community: Decisions API beta",
        "url": "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      }
    ]
  },
  "perplexity-pplx-decider": {
    "slug": "perplexity-pplx-decider",
    "displayName": "Perplexity pplx-decider",
    "listingSlug": "perplexity-pplx-decider",
    "ecosystemSlugs": [
      "apolinario-decision-index"
    ],
    "seoTitle": "Perplexity pplx-decider vs Jev: open 27B decisions",
    "seoDescription": "pplx-decider is Perplexity's Apache-2.0 27B decision model, hosted or self-run. Compare Decision Index scores, price, hardware and API with Jev.",
    "h1": "Perplexity pplx-decider as a Jev alternative",
    "keyPoint": "pplx-decider v1.1 is a 27B open-weight multimodal decider with one of the highest public Decision Index scores among alternatives in our snapshot.",
    "summary": "Perplexity publishes pplx-decider checkpoints on Hugging Face under Apache 2.0 and discusses hosted pricing in community threads. The model targets parallel decision questions with vendor-reported multimodal inputs. Independent Decision Index scores place Perplexity Decider v1.1 slightly above hosted Jev in edition 0.3.1, but that is still a public benchmark slice, not your production labels. Plan calibration and serving GPUs before you promise SLA parity with api.typesafe.ai.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Perplexity",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "v1.1 weights announced 2026",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0 (Hugging Face card)",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "$0.02 per M input tokens (vendor list, 2026-10-12)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Self-host weights or vendor-hosted inference (see community post)",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Choice, Score, Noul style batches (vendor)",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Text and image per vendor card",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "27B featured in v1.1",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Depends on GPU class; vendor demos are not your SLA",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "62.75 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Self-host keeps data local; hosted path follows vendor terms",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "Compatible HTTP servers when community ports exist; verify before production",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "2,221 HF downloads, apache-2.0 (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What pplx-decider is",
        "body": "Perplexity publishes pplx-decider checkpoints on Hugging Face under Apache 2.0 and discusses hosted pricing in community threads. The model targets parallel decision questions with vendor-reported multimodal inputs. Independent Decision Index scores place Perplexity Decider v1.1 slightly above hosted Jev in edition 0.3.1, but that is still a public benchmark slice, not your production labels. Plan calibration and serving GPUs before you promise SLA parity with api.typesafe.ai. pplx-decider Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Perplexity or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists Perplexity pplx-decider at 62.75 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose pplx-decider when your constraints match its deployment model: You need multimodal decision inputs in one forward pass; Public Decision Index score is a procurement requirement; You can host 27B class GPUs or buy Perplexity inference."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"pplx-decider-v1.1\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "The 27B checkpoint is multimodal in vendor messaging; confirm your serving stack supports image tensors before you copy a text-only Jev integration. Community pricing posts are not a contract; confirm list price in your Perplexity account before you model finops. High Decision Index scores on public slices still fail when your labels are domain-specific legal or medical text. Hosted Perplexity inference and self-hosted weights are different operational animals; this page covers both paths at a high level. When you self-host, you own GPU placement, autoscaling, and incident response for the checkpoint you pin. Pair pplx-decider with cheaper local routers on high-volume pre-filters if cost at 27B is prohibitive."
      }
    ],
    "whenChooseThem": [
      "You need multimodal decision inputs in one forward pass",
      "Public Decision Index score is a procurement requirement",
      "You can host 27B class GPUs or buy Perplexity inference"
    ],
    "whenChooseJev": [
      "You want a single supported System One URL without tuning vLLM",
      "Your workloads are text-only with large option sets Jev already handles",
      "Gateway integrations matter more than open weights"
    ],
    "faq": [
      {
        "question": "Is Perplexity pplx-decider the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. Perplexity pplx-decider is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does Perplexity pplx-decider beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores Perplexity pplx-decider; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with Perplexity pplx-decider?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with Perplexity pplx-decider on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "Perplexity community: pplx-decider v1.1",
        "url": "https://community.perplexity.ai/t/pplx-decider-v1-1-27b-our-updated-open-weights-multimodal-decision-model-is-now-available/6286"
      },
      {
        "label": "Hugging Face: perplexity-ai/pplx-decider-v1.1-27b",
        "url": "https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "mapika-decider": {
    "slug": "mapika-decider",
    "displayName": "Mapika decider",
    "listingSlug": "mapika-decider",
    "ecosystemSlugs": [
      "apolinario-decision-index",
      "ollaya-dev-ollaya"
    ],
    "seoTitle": "Decider vs Jev: Mapika's small open decision models",
    "seoDescription": "Decider is an open System One model family on Qwen3.5, from 0.8B up. Compare speed, accuracy, hardware, license and the /v1/systemone server with Jev.",
    "h1": "Mapika decider as a Jev alternative",
    "keyPoint": "decider is Mapika's independent System One class family with transparent mixture notes and HTTP compatible with TypeSafe clients.",
    "summary": "Mapika/decider ships Apache 2.0 code and multiple Hugging Face checkpoints from 2B dense to 35B-A3b MoE. README states no affiliation with TypeSafe and no distillation from hosted Jev. decider.serve and decider.serve_vllm expose POST /v1/systemone. Standing sections quote JevBench and Decision Index rows as vendor-read leaderboard snapshots. Independent Decision Index scores for decider-2B are lower than Jev in our import, so evaluate on your data before you replace production gates.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Mapika",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "2025 public GitHub and PyPI decider-ai",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "POST /v1/systemone via decider.serve",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Choice, Score, Noul",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "JSON state and questions map",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "0.8B through 35B-A3b plus vision variants",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "GPU dependent; arcade demos are vendor illustrations",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "25.8 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Self-hosted; state stays on your cluster",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "TypeSafe SDK with base URL swap; pip install decider-ai",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "1,124 GitHub stars (2026-10-12); 331,532 HF downloads (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What decider is",
        "body": "Mapika/decider ships Apache 2.0 code and multiple Hugging Face checkpoints from 2B dense to 35B-A3b MoE. README states no affiliation with TypeSafe and no distillation from hosted Jev. decider.serve and decider.serve_vllm expose POST /v1/systemone. Standing sections quote JevBench and Decision Index rows as vendor-read leaderboard snapshots. Independent Decision Index scores for decider-2B are lower than Jev in our import, so evaluate on your data before you replace production gates. decider Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Mapika or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists Mapika decider at 25.8 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose decider when your constraints match its deployment model: You want Qwen3.5 trained decider weights with public mixture.py; You need vLLM serve for throughput on your cluster; You prefer an independent lineage from Jared Palmer Kev."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"decider-2b\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "decider.serve_vllm is the path when you already operate vLLM fleets; decider.serve is lighter for a single-node proof of concept. MoE checkpoints change memory footprints non-linearly; read the HF card for the exact variant before you size GPUs. Mapika's README explicitly disclaims distillation from hosted Jev, which matters for procurement questionnaires. Vendor README leaderboard snapshots can disagree with independent Decision Index rows; label charts clearly in internal reviews. Multiple dense and MoE sizes exist; do not assume decider-2B scores predict 35B-A3b behavior on your labels. HTTP compatibility with POST /v1/systemone helps SDK reuse, but you still own auth, TLS, and rate limits on the server you run."
      }
    ],
    "whenChooseThem": [
      "You want Qwen3.5 trained decider weights with public mixture.py",
      "You need vLLM serve for throughput on your cluster",
      "You prefer an independent lineage from Jared Palmer Kev"
    ],
    "whenChooseJev": [
      "You do not want to operate calibration CLIs and GPU fleets",
      "Hosted Jev already passes your internal eval without retraining",
      "You need TypeSafe-supported incident response"
    ],
    "faq": [
      {
        "question": "Is Mapika decider the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. Mapika decider is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does Mapika decider beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores Mapika decider; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with Mapika decider?",
        "answer": "Many teams point typesafe_sdk at a compatible self-hosted base URL. Verify model strings and response metadata in staging."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with Mapika decider on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "GitHub: Mapika/decider",
        "url": "https://github.com/Mapika/decider"
      },
      {
        "label": "Hugging Face: Mapika/decider-2b",
        "url": "https://huggingface.co/Mapika/decider-2b"
      },
      {
        "label": "PyPI: decider-ai",
        "url": "https://pypi.org/project/decider-ai/"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "fastino-gliner-decide": {
    "slug": "fastino-gliner-decide",
    "displayName": "GLiNER2.5 Decide",
    "listingSlug": "fastino-gliner-decide",
    "seoTitle": "GLiNER2.5-Decide vs Jev: a 340M local decision model",
    "seoDescription": "Fastino's GLiNER2.5-Decide is a 340M Apache-2.0 encoder for typed decisions on CPU. Compare accuracy, speed, fine-tuning and hosting with Jev.",
    "h1": "GLiNER2.5 Decide as a Jev alternative",
    "keyPoint": "GLiNER2.5-Decide extends the GLiNER line with decision heads for criteria over text spans, useful when your state is document-centric rather than a single chat blob.",
    "summary": "Fastino publishes GLiNER2.5-Decide on Hugging Face under Apache 2.0 with strong download adoption relative to niche decision stacks. It is not a full System One server out of the box: you integrate Decide outputs into application gates rather than assuming POST /v1/systemone parity. Independent Decision Index scores are lower than Jev in edition 0.3.1, which is expected when the harness stresses broad decision suites. Decide can still win when entity-span workflows dominate and you want a smaller specialized model instead of a 27B decider.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "semif",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Fastino",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "2025 Hugging Face Decide checkpoints",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Python inference on GLiNER2.5-Decide weights",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Span criteria decisions (not full System One server)",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Text documents and labeled spans",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "Decide variant per HF card",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Typically faster than multi-billion decoders on CPU/GPU mix",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "9.24 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Local inference; no TypeSafe upload",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "Hugging Face transformers / Fastino examples",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "90,464 HF downloads, apache-2.0 (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What GLiNER2.5 Decide is",
        "body": "Fastino publishes GLiNER2.5-Decide on Hugging Face under Apache 2.0 with strong download adoption relative to niche decision stacks. It is not a full System One server out of the box: you integrate Decide outputs into application gates rather than assuming POST /v1/systemone parity. Independent Decision Index scores are lower than Jev in edition 0.3.1, which is expected when the harness stresses broad decision suites. Decide can still win when entity-span workflows dominate and you want a smaller specialized model instead of a 27B decider. GLiNER2.5 Decide Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Fastino or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists GLiNER2.5 Decide at 9.24 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose GLiNER2.5 Decide when your constraints match its deployment model: Your gates are span or entity centric like GLiNER workflows; You want smaller models with high HF adoption for NLP extraction plus decide; You can wrap outputs into your own threshold logic."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"gliner25-decide\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "GLiNER Decide targets span-style entity decisions; it is not a drop-in replacement for every Choice gate in a large agent graph. CPU inference can win on cost for shallow gates even when Decision Index headline scores look lower than a 27B decoder. Pair Decide with a larger model on escalation paths instead of forcing one checkpoint to cover every gate. Fastino documents Decide as part of the GLiNER family; read the HF card for input shapes before you wire production JSON. High Hugging Face downloads reflect niche routing demand, not a guarantee of parity with hosted Jev on your compliance suite. Fine-tuning on domain spans may beat zero-shot Decide outputs when your entities are proprietary jargon."
      }
    ],
    "whenChooseThem": [
      "Your gates are span or entity centric like GLiNER workflows",
      "You want smaller models with high HF adoption for NLP extraction plus decide",
      "You can wrap outputs into your own threshold logic"
    ],
    "whenChooseJev": [
      "You need parallel Choice, Score, and Noul on one shared state string",
      "You want a hosted API without building glue code",
      "Decision Index scores near Jev matter for procurement"
    ],
    "faq": [
      {
        "question": "Is GLiNER2.5 Decide the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. GLiNER2.5 Decide is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does GLiNER2.5 Decide beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores GLiNER2.5 Decide; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with GLiNER2.5 Decide?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with GLiNER2.5 Decide on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "Hugging Face: fastino/GLiNER2.5-Decide",
        "url": "https://huggingface.co/fastino/GLiNER2.5-Decide"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "semif": {
    "slug": "semif",
    "displayName": "SemIf",
    "listingSlug": "theoleecj-semif",
    "ecosystemSlugs": [
      "classifier-dev",
      "vinnylarouge-jevlike"
    ],
    "seoTitle": "SemIf vs Jev: decisions from open model logits",
    "seoDescription": "SemIf reads option logits from open models you host to answer Choice, Score and Noul. Compare setup, speed, calibration and license with Jev.",
    "h1": "SemIf as a Jev alternative",
    "keyPoint": "SemIf is Theo Lee CJ's independent decision server with openjev.com demos. It mimics System One interfaces with open weights, not TypeSafe's closed hosted model.",
    "summary": "SemIf packages Choice, Score, and Noul style batches over shared state with probabilities read from logits instead of chat decoding. README stresses independence from TypeSafe. GitHub stars are high for a research server, but Decision Index does not list SemIf in our snapshot, so treat benchmarks as DIY. WebGPU browser demos help you explain the category to stakeholders before you rack GPUs.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "clm-8b",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Theo Lee CJ",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "SemIf rebrand documented on openjev.com",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Open source (see repository LICENSE)",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "System One compatible HTTP in harnesses",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Choice, Score, Noul",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Shared text or structured state",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "Depends on bundled open bridges",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Home GPU numbers in README are vendor-reported demos",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "Not listed on Decision Index public board for this edition",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Self-hosted",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "Community clients; verify parity before production",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "4,783 GitHub stars (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What SemIf is",
        "body": "SemIf packages Choice, Score, and Noul style batches over shared state with probabilities read from logits instead of chat decoding. README stresses independence from TypeSafe. GitHub stars are high for a research server, but Decision Index does not list SemIf in our snapshot, so treat benchmarks as DIY. WebGPU browser demos help you explain the category to stakeholders before you rack GPUs. SemIf Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Theo Lee CJ or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 does not list SemIf in the snapshot we ship."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose SemIf when your constraints match its deployment model: You want an open research server with browser demos for stakeholders; You can run calibration passes on your hardware; You need semantic if statements without TypeSafe bills."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"semif-latest\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "SemIf ships research weights and community bridges; treat openjev.com demos as experiments until you harden auth and logging. Logit-level servers behave differently under concurrent requests than hosted Jev; load test with your real batch sizes. SemIf is strongest when you want to study open decision heads, not when you need a vendor SLA this quarter. The SemIf-OpenJev repository is the adoption signal we cite; forks and bridges may diverge from upstream behavior. Calibration drift shows up quickly when you change tokenizer or context packing; version-pin everything in shadow mode. Research stacks like SemIf benefit from explicit ownership of serving, monitoring, and rollback playbooks."
      }
    ],
    "whenChooseThem": [
      "You want an open research server with browser demos for stakeholders",
      "You can run calibration passes on your hardware",
      "You need semantic if statements without TypeSafe bills"
    ],
    "whenChooseJev": [
      "You want vendor-supported hosted inference",
      "You need Decision Index scores for compliance slides",
      "You rely on production-grade TypeSafe SDK releases"
    ],
    "faq": [
      {
        "question": "Is SemIf the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. SemIf is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does SemIf beat Jev on Decision Index?",
        "answer": "SemIf is not listed on the Decision Index snapshot we import; run your own eval."
      },
      {
        "question": "Can I use the TypeSafe SDK with SemIf?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with SemIf on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "GitHub: TheoLeeCJ/SemIf",
        "url": "https://github.com/TheoLeeCJ/SemIf"
      },
      {
        "label": "openjev.com",
        "url": "https://openjev.com"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      }
    ]
  },
  "clm-8b": {
    "slug": "clm-8b",
    "displayName": "CLM 8B",
    "listingSlug": "contrastive-lm-clm-8b",
    "seoTitle": "CLM-8B vs Jev: a contrastive System One model",
    "seoDescription": "CLM-8B from Contrastive-LM is an Apache-2.0 8B decision model with cached state and action embeddings. Compare claims, benchmarks and fit with Jev.",
    "h1": "CLM 8B as a Jev alternative",
    "keyPoint": "CLM ships Qwen3-8B decision heads from Contrastive LM for teams experimenting with contrastive training recipes instead of full vendor stacks.",
    "summary": "Contrastive-LM/CLM publishes Apache 2.0 weights and training code for decision heads on Qwen3-8B. Adoption on GitHub and Hugging Face is meaningful for a research repo, but independent Decision Index scores are far below Jev in edition 0.3.1. CLM is best viewed as a laboratory checkpoint: useful when your team already fine-tunes Qwen and wants published head architectures, not when you need a turnkey hosted API tomorrow.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "liquid-d1",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Contrastive LM",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "CLM v0.1 weights on Hugging Face",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Research inference scripts; wire your own HTTP",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Decision heads on Qwen3 (project docs)",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Text state per training repo",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "8B class featured",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Depends on your serve stack",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "6.24 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Self-hosted",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "PyTorch workflows from repository",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "2,981 GitHub stars (2026-10-12); 4,367 HF downloads, apache-2.0 (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What CLM 8B is",
        "body": "Contrastive-LM/CLM publishes Apache 2.0 weights and training code for decision heads on Qwen3-8B. Adoption on GitHub and Hugging Face is meaningful for a research repo, but independent Decision Index scores are far below Jev in edition 0.3.1. CLM is best viewed as a laboratory checkpoint: useful when your team already fine-tunes Qwen and wants published head architectures, not when you need a turnkey hosted API tomorrow. CLM 8B Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Contrastive LM or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists CLM 8B at 6.24 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose CLM 8B when your constraints match its deployment model: You experiment with contrastive decision training on Qwen3; You can build your own System One compatible HTTP layer; Decision Index headline score is not your gate."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"clm-v0.1-8b\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "CLM publishes contrastive head architectures on Qwen3-8B; you still own serving, calibration, and HTTP glue. Decision Index scores for CLM are far below hosted Jev in edition 0.3.1, so treat CLM as a lab checkpoint. There is no published Stanford or NVIDIA affiliation on the official Contrastive-LM repositories we link. Contrastive training recipes may help when you already fine-tune Qwen and want published head designs to iterate on. Laboratory checkpoints still need security review for weight provenance and license terms before production trials. If you only need a hosted API this quarter, CLM is the wrong shortcut compared to clef or hosted Jev."
      }
    ],
    "whenChooseThem": [
      "You experiment with contrastive decision training on Qwen3",
      "You can build your own System One compatible HTTP layer",
      "Decision Index headline score is not your gate"
    ],
    "whenChooseJev": [
      "You need supported hosted inference now",
      "You want multi-question batches without writing serve code",
      "Public benchmark parity with Jev is required"
    ],
    "faq": [
      {
        "question": "Is CLM 8B the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. CLM 8B is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does CLM 8B beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores CLM 8B; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with CLM 8B?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with CLM 8B on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "GitHub: Contrastive-LM/CLM",
        "url": "https://github.com/Contrastive-LM/CLM"
      },
      {
        "label": "Hugging Face: Contrastive-LM/CLM-v0.1-8B",
        "url": "https://huggingface.co/Contrastive-LM/CLM-v0.1-8B"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "liquid-d1": {
    "slug": "liquid-d1",
    "displayName": "Liquid d1",
    "listingSlug": "liquidai-d1-3b",
    "seoTitle": "Liquid d1-3B vs Jev: small multimodal decisions",
    "seoDescription": "Liquid AI's d1-3B answers typed questions over text and images in one pass. Compare Decision Index score, latency, license terms and hardware with Jev.",
    "h1": "Liquid d1 as a Jev alternative",
    "keyPoint": "Liquid d1-3B is a decision-tuned Liquid Foundation Model for teams that want compact weights with published Decision Index scores above many niche decoders.",
    "summary": "LiquidAI ships d1-3B on Hugging Face under the LFM 1.0 license with decision-oriented tuning. Independent Decision Index scores land near 40 in edition 0.3.1, below Jev but above several specialist checkpoints. d1 targets efficient inference on edge GPUs. You still need to wrap inference in your System One compatible server if you want drop-in SDK parity with api.typesafe.ai.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "von"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "Liquid AI",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "d1-3B on Hugging Face",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "LFM 1.0 (Hugging Face card)",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Self-host inference; bring your HTTP contract",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Decision tuned LFM outputs",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Text state per model card",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "d1-3B featured",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "Vendor positions LFM for efficient inference; benchmark locally",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "40.08 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Self-hosted",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "Liquid inference examples; integrate with your gateway",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "10,843 HF downloads, lfm-1.0 (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What Liquid d1 is",
        "body": "LiquidAI ships d1-3B on Hugging Face under the LFM 1.0 license with decision-oriented tuning. Independent Decision Index scores land near 40 in edition 0.3.1, below Jev but above several specialist checkpoints. d1 targets efficient inference on edge GPUs. You still need to wrap inference in your System One compatible server if you want drop-in SDK parity with api.typesafe.ai. Liquid d1 Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not Liquid AI or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 lists Liquid d1 at 40.08 in our imported snapshot."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose Liquid d1 when your constraints match its deployment model: You want compact LFM weights for edge GPUs; Decision Index score beats smaller niche models in your slides; You can operate inference without hosted Jev."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"liquid-d1-3b\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "d1-3B uses the LFM 1.0 license, not Apache; legal review should read the HF card before you redistribute weights. Vendor model cards cite their own benchmark slices; compare against your labels before you replace Jev in production. Multimodal inputs increase preprocessing complexity relative to text-only System One calls. Liquid documents d1 as a decision-tuned LFM stack; confirm your inference code supports the modality mix you need. Smaller multimodal checkpoints can win on edge devices when latency matters more than maximum benchmark breadth. Independent Decision Index scores for d1-3B are mid-pack in our snapshot; do not treat them as production guarantees."
      }
    ],
    "whenChooseThem": [
      "You want compact LFM weights for edge GPUs",
      "Decision Index score beats smaller niche models in your slides",
      "You can operate inference without hosted Jev"
    ],
    "whenChooseJev": [
      "You need full System One primitives with vendor support",
      "You want gateway billing and large option sets without tuning",
      "Apache or MIT licenses are required for weights"
    ],
    "faq": [
      {
        "question": "Is Liquid d1 the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. Liquid d1 is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does Liquid d1 beat Jev on Decision Index?",
        "answer": "The public snapshot in our metrics file scores Liquid d1; compare the facts table to hosted Jev. Decision Index is independent but still not your production labels."
      },
      {
        "question": "Can I use the TypeSafe SDK with Liquid d1?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with Liquid d1 on lower-risk paths. Run shadow mode until metrics prove parity."
      }
    ],
    "sources": [
      {
        "label": "Hugging Face: LiquidAI/d1-3B",
        "url": "https://huggingface.co/LiquidAI/d1-3B"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      },
      {
        "label": "Decision Index public snapshot (edition 0.3.1)",
        "url": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      }
    ]
  },
  "von": {
    "slug": "von",
    "displayName": "Von",
    "listingSlug": "wfzyx-von",
    "ecosystemSlugs": [
      "jaredpalmer-kev",
      "theoleecj-semif"
    ],
    "seoTitle": "von vs Jev: an Apache-2.0 local decision model",
    "seoDescription": "von is a non-autoregressive System One model with order-invariant option scores. Compare local latency claims, setup, license and accuracy with Jev.",
    "h1": "von vs Jev",
    "keyPoint": "Von is a compact non-autoregressive encoder for fast Choice, Noul, and Score style routing when you can trade some benchmark breadth for milliseconds.",
    "summary": "Von publishes Apache 2.0 weights with Python and TypeScript clients. README emphasizes order-invariant option scoring and sub-25 ms inference on author hardware, with gameplay demos comparing kills and latency to hosted Jev API calls. Von is a runners-up pick on the hub ranked table because teams often pair it with larger decoders, but Hugging Face downloads are high for its size class. Decision Index does not list Von in our snapshot, so run your own harness before you promise accuracy parity.",
    "lastVerified": "2026-10-12",
    "siblingSlugs": [
      "cloudflare-clef",
      "kev",
      "openai-decisions-api",
      "perplexity-pplx-decider",
      "mapika-decider",
      "fastino-gliner-decide",
      "semif",
      "clm-8b",
      "liquid-d1"
    ],
    "facts": [
      {
        "row": "Maker",
        "them": "wfzyx",
        "jev": "TypeSafe AI",
        "sourceLabel": "Product pages",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "First public release",
        "them": "Von 1.2 weights on Hugging Face",
        "jev": "Hosted System One (ongoing)",
        "sourceLabel": "Vendor docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "License / access",
        "them": "Apache 2.0",
        "jev": "Hosted API (weights not downloadable)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Hosted price (input)",
        "them": "Self-host only (no TypeSafe meter)",
        "jev": "$0.042 per M input tokens (vendor, TypeSafe docs)",
        "sourceLabel": "Price lists",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "API shape",
        "them": "Library clients; optional HTTP wrappers in community",
        "jev": "POST /v1/systemone",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Question types",
        "them": "Choice, Noul, Score style tasks",
        "jev": "Choice, Score, Noul",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Inputs",
        "them": "Premise text plus explicit option descriptions",
        "jev": "Structured state string",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Model sizes",
        "them": "Sub-billion encoder class (see card)",
        "jev": "Hosted Jev (closed)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Latency",
        "them": "README cites sub-25 ms on author hardware (vendor-reported)",
        "jev": "Network plus vendor batching (measure yours)",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Decision Index (public)",
        "them": "Not listed on Decision Index public board for this edition",
        "jev": "60.11 (Decision Index 0.3.1, snapshot 2026-10-10; independent harness, not vendor-only)",
        "sourceLabel": "Decision Index snapshot",
        "sourceUrl": "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json"
      },
      {
        "row": "Data handling",
        "them": "Local inference",
        "jev": "Processed under TypeSafe terms",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "SDKs",
        "them": "Python and TypeScript repositories",
        "jev": "typesafe_sdk, gateways, MCP ecosystem",
        "sourceLabel": "TypeSafe docs",
        "sourceUrl": "https://docs.typesafe.ai"
      },
      {
        "row": "Adoption signal",
        "them": "883 GitHub stars (2026-10-12); 106,915 HF downloads, apache-2.0 (2026-10-12)",
        "jev": "Vendor hosted (no public GitHub stars)",
        "sourceLabel": "GitHub / Hugging Face API",
        "sourceUrl": "https://github.com"
      }
    ],
    "sections": [
      {
        "h": "What Von is",
        "body": "Von publishes Apache 2.0 weights with Python and TypeScript clients. README emphasizes order-invariant option scoring and sub-25 ms inference on author hardware, with gameplay demos comparing kills and latency to hosted Jev API calls. Von is a runners-up pick on the hub ranked table because teams often pair it with larger decoders, but Hugging Face downloads are high for its size class. Decision Index does not list Von in our snapshot, so run your own harness before you promise accuracy parity. Von Read vendor docs for exact JSON fields. This page is independent writing on jev.aitools.fyi; we are not wfzyx or TypeSafe. When README tables compare to hosted Jev, we label them vendor-reported. When we cite Decision Index, we label the harness as independent."
      },
      {
        "h": "Accuracy and benchmarks",
        "body": "Independent Decision Index edition 0.3.1 does not list Von in the snapshot we ship."
      },
      {
        "h": "Fit and tradeoffs",
        "body": "Choose Von when your constraints match its deployment model: Latency below autoregressive Qwen decoders is mandatory; You route games or agents with small state and few options; You can accept DIY calibration without hosted SLAs."
      },
      {
        "h": "Pricing and ops",
        "body": "Hosted and self-hosted cost models differ: compare vendor list prices to GPU, storage, and on-call time for your traffic shape."
      },
      {
        "h": "Migrating from hosted Jev",
        "body": "Keep your question map and threshold logic stable. Swap client configuration to point at the new base URL or SDK, then run shadow traffic until disagreement rates fall below your risk budget.",
        "code": {
          "lang": "typescript",
          "content": "// Before: hosted Jev\nconst client = new TypeSafe({ apiKey: process.env.TYPESAFE_API_KEY });\nawait client.systemone({ model: \"jev-latest\", state, questions });\n\n// After: self-hosted System One compatible server (Kev, decider, SemIf, etc.)\nconst client = new TypeSafe({ baseURL: \"http://localhost:8000\" });\nawait client.systemone({ model: \"von-latest\", state, questions });"
        }
      },
      {
        "h": "Ecosystem links",
        "body": "See catalog listings and sibling comparison pages on this hub for a second opinion. Sources at the bottom link to official vendor repositories."
      },
      {
        "h": "Product-specific notes",
        "body": "Von optimizes for order-invariant option scoring on small encoders; README gameplay demos are vendor hardware, not your SLA. Von is not listed on the public Decision Index board we import; run a private harness before accuracy promises. Hub row 11 is an editorial speed pick, not proof Von outranks larger decoders on every adoption signal. Python and TypeScript clients exist, but you still operate the server process and secure the listen port. Teams often pair Von with a larger decoder on escalation when raw speed matters on hot paths. Gameplay comparisons in the README are vendor-reported; reproduce on your CPUs or GPUs before finops sign-off."
      }
    ],
    "whenChooseThem": [
      "Latency below autoregressive Qwen decoders is mandatory",
      "You route games or agents with small state and few options",
      "You can accept DIY calibration without hosted SLAs"
    ],
    "whenChooseJev": [
      "You need vendor-supported System One with confidence metadata",
      "Your tasks need large parallel question batches on one state",
      "Decision Index scores are part of compliance evidence"
    ],
    "faq": [
      {
        "question": "Is Von the same product as TypeSafe Jev?",
        "answer": "No. Jev is TypeSafe's hosted System One service. Von is a separate product with its own weights, terms, and ops model unless explicitly documented as compatible HTTP."
      },
      {
        "question": "Does Von beat Jev on Decision Index?",
        "answer": "Von is not listed on the Decision Index snapshot we import; run your own eval."
      },
      {
        "question": "Can I use the TypeSafe SDK with Von?",
        "answer": "You may need a thin adapter if the HTTP shape differs from POST /v1/systemone. Plan engineering time for glue code."
      },
      {
        "question": "Should I leave hosted Jev entirely?",
        "answer": "Not necessarily. Teams often keep Jev for gates that need vendor support while experimenting with Von on lower-risk paths. Run shadow mode until metrics prove parity."
      },
      {
        "question": "Why is Von outside the hub ranked table?",
        "answer": "The ranked table lists the ten models teams most often benchmark for full System One migrations (Laya through Liquid d1). Von remains a popular runners-up when you need a fast encoder; see the hub FAQ."
      }
    ],
    "sources": [
      {
        "label": "GitHub: wfzyx/von",
        "url": "https://github.com/wfzyx/von"
      },
      {
        "label": "Hugging Face: wfzyx/von",
        "url": "https://huggingface.co/wfzyx/von"
      },
      {
        "label": "TypeSafe docs: System One / Jev API",
        "url": "https://docs.typesafe.ai"
      }
    ]
  }
} as Record<(typeof alternativeSlugs)[number], Alternative>;
