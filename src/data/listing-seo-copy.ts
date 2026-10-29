/**
 * SERP title and description for listings whose auto draft chops mid-sentence
 * or leads with a package name. Source strings must stay within meta limits.
 */
export const listingSeoCopy: Record<
  string,
  { metaTitle?: string; metaDescription: string }
> = {
  "omnijev-awesome-jev": {
    metaTitle: "OmniJev: papers and evals behind Jev",
    metaDescription:
      "OmniJev (awesome-jev) collects papers, open reproductions, and independent evals behind System One and Jev. A reading list, not the official docs.",
  },
  // Description only. None of these slugs have a listing-enrichment record
  // (jev-on-vercel-ai-gateway and openrouter-typesafe-jev-1-13 appear only as
  // related slugs), so this map wins over the draft. Titles stay on the draft path.
  "jev-on-vercel-ai-gateway": {
    metaDescription:
      "Jev on Vercel AI Gateway: hosted typesafe-ai/jev for AI SDK evaluate calls, no TypeSafe waitlist required.",
  },
  "openrouter-typesafe-jev-1-13": {
    metaDescription:
      "OpenRouter lists typesafe/jev-1.13 for TypeSafe's structured decision model. Routing uses the Decisions API rather than chat completions.",
  },
  "realzachi-typesafe-adblock": {
    metaDescription:
      "Chrome extension that asks a tiny AI decision model (TypeSafe Jev) if a DOM element is an ad and pops it off the page. BYOK, no backend, not a real ad blocker.",
  },
  "nshkrdotcom-typesafe-sdk": {
    metaDescription:
      "Idiomatic, type-safe Elixir port of the official TypeScript AI SDK, with streaming text, structured outputs, tool calling, and agentic workflows.",
  },
  "cookbooks": {
    metaDescription:
      "Reproducible cookbooks for reranking, parallel evaluations, guardrails, citation checks, field extraction, and hierarchical classification.",
  },
  "kikoncuo-jevfire": {
    metaDescription:
      "JEV-inspired parallel decisions for CUDA LLMs. One context, many decisions. vLLM API, game-agent examples, and reproducible benchmarks.",
  },
  "vercel-ai-sdk-provider": {
    metaDescription:
      "Vercel AI SDK provider: @ai-sdk/typesafe-ai plus experimental_evaluate; use jev-latest as an evaluation model.",
  },
  "wustep-jev-playground": {
    metaDescription:
      "Can a System One model steer music? Jev picks the plan (enums only); code renders sheet, audio and MIDI.",
  },
  "ndolinschi-jevplay": {
    metaDescription:
      "TypeSafe Jev playground: a custom Choice, Score, and Noul builder with live distributions.",
  },
  "docxology-daf-jev": {
    metaDescription:
      "Daf-jev: composable Python toolkit for TypeSafe's Jev API, with question builders, confidence gates, evaluator, calibration, CLI, MCP server, and agent skill.",
  },
  "narulaskaran-jev-data-questions": {
    metaDescription:
      "Jev Gamecast is a replay-first React app that asks Jev typed questions about live sports data.",
  },
  "jackalope-dev-jackalope": {
    metaDescription:
      "Desktop GUI that routes agentic coding tasks across local agents and accounts. Jev picks the best agent per task and runs basic code-review checks.",
  },
  "hellogumbo-should-ai-kill-us-all": {
    metaDescription:
      "Live verdict page, every ten minutes: feeds Jev Florida Man, odd-news, politics and world headlines and asks all three primitives whether AI should kill us all.",
  },
  "jordiparracrespo-typesafe-ai-trading-showcase": {
    metaDescription:
      "Probably: live BTC, ETH, and XRP prices with a shared TypeSafe buy-or-wait demonstration. No trades placed.",
  },
  "mateonunez-jod": {
    metaDescription:
      "jod: semantic schemas over TypeSafe's Jev. Validate the state locally, then project typed answers.",
  },
};
