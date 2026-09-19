export const jevSpecSheet = {
  version: "v1.13",
  model: "jev-latest",
  endpoint: "POST https://api.typesafe.ai/v1/systemone",
  input: "State plus typed questions, evaluated in parallel",
  output: "Typed answers, per-option probabilities, confidence",
  latency: "70 to 500 ms end to end (per TypeSafe)",
  pricing: "$0.042 / MTok input, output free",
  sdks: "JS, Python, AI Gateway, plus community clients below",
  primitives: [
    {
      name: "choice",
      summary: "Pick one option from a list",
      returns: "choice, probabilities, confidence",
    },
    {
      name: "score",
      summary: "Rate state on a rubric",
      returns: "score, probabilities, confidence",
    },
    {
      name: "noul",
      summary: "Is this statement true?",
      returns: "noul (0 to 1)",
    },
  ],
} as const;
