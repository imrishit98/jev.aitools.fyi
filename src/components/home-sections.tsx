import { AppLink } from "@/components/app-link";
import { ButtonLink } from "@/components/button-link";
import { siteConfig } from "@/lib/site";

export function HomeWhyJev() {
  return (
    <section
      className="relative overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/8 via-card to-card p-8 md:p-10"
      aria-labelledby="why-jev-heading"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        Why Jev
      </p>
      <h2
        id="why-jev-heading"
        className="mt-2 max-w-xl font-heading text-2xl font-semibold sm:text-3xl"
      >
        Probabilities, not pep talks
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Jev is TypeSafe&apos;s <strong className="font-medium text-foreground">System One</strong> model. You ask structured questions with Choice, Score, and Noul. You get calibrated probabilities your code can threshold. Fast, cheap, and allergic to writing essays when a boolean would do.
      </p>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
        <AppLink href="/learn/jev-typesafe" className="text-primary hover:underline">
          Jev and TypeSafe
        </AppLink>
        <AppLink href="/learn/jev-vs-llm-classification" className="text-primary hover:underline">
          Jev vs chat labels
        </AppLink>
        <AppLink href="/learn/vercel-ai-gateway" className="text-primary hover:underline">
          Vercel AI Gateway
        </AppLink>
        <AppLink href={siteConfig.typesafe.playground} className="text-primary hover:underline" external>
          Playground
        </AppLink>
      </div>
    </section>
  );
}

export function HomeHero() {
  return (
    <section className="hero-mesh relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-border bg-card/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            System One · TypeSafe Jev · not a chat LLM
          </p>
          <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            Jev is having a{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              moment
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Watch builders turn structured decisions into generative UI, property search, maps, and SEO runs that do not bankrupt the agency. The full tool map lives one click away in Explore.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/explore" size="lg">
              Explore tools
            </ButtonLink>
            <ButtonLink href="/showcase" size="lg" variant="outline">
              Watch demos
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
