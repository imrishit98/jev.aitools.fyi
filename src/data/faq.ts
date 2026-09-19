export type FaqEntry = { question: string; answer: string };

export const homeFaq: FaqEntry[] = [
  {
    question: "What is Jev?",
    answer:
      "Jev is TypeSafe AI's flagship System One model. You send structured state and typed questions (Choice, Score, or Noul). The API returns discrete answers with calibrated probabilities and confidence. Your code applies thresholds and runs side effects.",
  },
  {
    question: "How is Jev different from an LLM?",
    answer:
      "LLMs generate open-ended text. Jev answers constrained questions with explicit probability mass over options. That makes routing, moderation, and safety gates easier than parsing YES or NO from chat output.",
  },
  {
    question: "How do I try Jev on Vercel AI Gateway?",
    answer:
      "Use model id typesafe-ai/jev through Vercel AI Gateway with the AI SDK, including experimental_evaluate flows. See Vercel's gateway docs and the eve agent framework for TypeScript examples.",
  },
  {
    question: "What is this directory?",
    answer:
      "Jev Directory at jev.aitools.fyi is an independent curated index of SDKs, integrations, Jev MCP servers, demos, and apps. It is published by aitools.fyi and is not affiliated with TypeSafe AI unless a listing is official.",
  },
];
