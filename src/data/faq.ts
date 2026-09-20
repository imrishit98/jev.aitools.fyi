export type FaqEntry = { question: string; answer: string };

export const homeFaq: FaqEntry[] = [
  {
    question: "What is Jev?",
    answer:
      "Jev is TypeSafe AI's System One decision model for software. You send structured state and typed questions (Choice, Score, or Noul). The API returns discrete answers with probabilities and confidence. Your code applies thresholds and runs side effects.",
  },
  {
    question: "How is Jev different from an LLM?",
    answer:
      "LLMs generate open-ended text. Jev answers fixed questions with explicit probability mass over options. That makes routing, moderation, and safety gates easier than parsing YES or NO from chat output.",
  },
  {
    question: "How do I try Jev on Vercel AI Gateway?",
    answer:
      "Use model id typesafe-ai/jev through Vercel AI Gateway with the AI SDK, including experimental_evaluate flows. See Vercel's gateway docs and the eve agent framework for TypeScript examples.",
  },
  {
    question: "What is this directory?",
    answer:
      "Jev Directory at jev.aitools.fyi is an independent index of SDKs, integrations, Jev MCP servers, demos, and apps. The explore index lists the full public catalog; only stronger listings get on-site detail pages under paths like /sdks/ and /tools/. Published by aitools.fyi. Not affiliated with TypeSafe AI unless a listing is official.",
  },
  {
    question: "What is the Jev AI website?",
    answer:
      "TypeSafe AI hosts product docs and the playground at docs.typesafe.ai and jev.works. This site, jev.aitools.fyi, is a community directory of tools, SDKs, benchmarks, and guides that use System One Jev. Start on Learn for primers, then Explore for listings.",
  },
];
