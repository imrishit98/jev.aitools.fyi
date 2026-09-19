import { AppLink } from "@/components/app-link";
import { ButtonLink } from "@/components/button-link";
import { learnGuideSlugs, learnGuides } from "@/data/learn-guides";
import { siteConfig } from "@/lib/site";
import {
  BookOpen,
  Code2,
  FlaskConical,
  Layers,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";

const GATEWAY_MODEL_ID = "typesafe-ai/jev";

const learnChips = learnGuideSlugs.map((slug) => {
  const guide = learnGuides[slug];
  return { href: `/learn/${slug}`, label: guide.title, hint: guide.description };
});

export function HomeWhatIsJev() {
  return (
    <section
      id="what-is-jev"
      className="relative overflow-hidden rounded-md border border-border bg-card p-8 shadow-sm md:p-10"
      aria-labelledby="what-is-jev-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        What is Jev?
      </p>
      <h2
        id="what-is-jev-heading"
        className="mt-2 max-w-2xl font-heading text-2xl font-semibold sm:text-3xl"
      >
        Structured decisions, not chat essays
      </h2>
      <blockquote className="mt-5 border-l-2 border-primary/50 pl-4 font-heading text-lg leading-snug text-foreground sm:text-xl">
        &ldquo;Ask Choice, Score, or Noul. Get probabilities your code can threshold. Skip the pep talk.&rdquo;
      </blockquote>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Jev is TypeSafe&apos;s <strong className="font-medium text-foreground">System One</strong> model: parallel typed questions in, calibrated answers out. Fast, cheap, and allergic to writing paragraphs when a boolean would do.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { href: "/learn/jev-typesafe", label: "What is Jev?" },
          { href: "/learn/jev-vs-llm-classification", label: "Jev vs chat labels" },
          { href: "/learn/system-one", label: "System One" },
          { href: "/learn/vercel-ai-gateway", label: "AI Gateway" },
          { href: "/learn/use-cases", label: "Use cases" },
        ].map((link) => (
          <AppLink
            key={link.href}
            href={link.href}
            className="inline-flex items-center rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
          >
            {link.label}
          </AppLink>
        ))}
        <AppLink
          href="/learn"
          className="inline-flex items-center rounded-md border border-dashed border-primary/40 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
        >
          All Learn guides →
        </AppLink>
      </div>
    </section>
  );
}

const startPaths = [
  {
    icon: BookOpen,
    title: "Official docs",
    blurb: "Quick start, API reference, and the boring parts done right.",
    href: siteConfig.typesafe.docs,
    external: true,
    cta: "docs.typesafe.ai",
  },
  {
    icon: FlaskConical,
    title: "Playground",
    blurb: "Poke Choice, Score, and Noul in the browser before you wire prod.",
    href: siteConfig.typesafe.playground,
    external: true,
    cta: "Open playground",
  },
  {
    icon: Zap,
    title: "Vercel AI Gateway",
    blurb: `Model id ${GATEWAY_MODEL_ID} for AI SDK evaluate flows.`,
    href: siteConfig.vercelGateway,
    external: true,
    cta: GATEWAY_MODEL_ID,
  },
  {
    icon: Code2,
    title: "SDKs",
    blurb: "TypeScript and Python clients plus community wrappers in the directory.",
    href: "/sdks/typesafe-ai-typesafe-sdk-js",
    external: false,
    cta: "JS SDK profile",
  },
  {
    icon: Layers,
    title: "SDK hub",
    blurb: "Every client we know about, one faceted list.",
    href: "/explore?category=sdks",
    external: false,
    cta: "Browse SDKs",
  },
  {
    icon: Rocket,
    title: "Official stack",
    blurb: "First-party listings: API, console, and friends.",
    href: "/explore?category=official",
    external: false,
    cta: "Official tools",
  },
] as const;

export function HomeGetStarted() {
  return (
    <section aria-labelledby="get-started-heading" className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Try it
        </p>
        <h2
          id="get-started-heading"
          className="mt-1 font-heading text-2xl font-semibold sm:text-3xl"
        >
          Get started in minutes
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Docs, playground, gateway model id, and SDK paths. Pick one door; they all lead to System One.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {startPaths.map((path) => {
          const Icon = path.icon;
          const inner = (
            <>
              <span className="flex size-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-semibold">{path.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {path.blurb}
                </p>
                <p className="mt-2 font-mono text-[11px] text-primary">{path.cta}</p>
              </div>
            </>
          );
          const className =
            "group flex gap-4 rounded-md border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0";

          if (path.external) {
            return (
              <a
                key={path.title}
                href={path.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            );
          }
          return (
            <AppLink key={path.title} href={path.href} className={className}>
              {inner}
            </AppLink>
          );
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Python SDK:{" "}
        <AppLink href="/sdks/typesafe-ai-typesafe-sdk-python" className="font-mono text-primary hover:underline">
          typesafe-ai-typesafe-sdk-python
        </AppLink>
      </p>
    </section>
  );
}

export function HomeHangout() {
  return (
    <section
      className="relative overflow-hidden rounded-md border border-accent/30 bg-gradient-to-br from-accent/12 via-card to-primary/8 p-8 md:p-10"
      aria-labelledby="hangout-heading"
    >
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          <Sparkles className="size-3.5" aria-hidden />
          The hangout
        </p>
        <h2
          id="hangout-heading"
          className="mt-3 font-heading text-2xl font-semibold sm:text-3xl"
        >
          People are shipping weird, cool stuff
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Ad blockers that think, chess that scores moves, Gmail intent gates, and typeahead that does not melt your wallet. Watch the clips, steal the patterns, then add yours to the wall.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/showcase" size="lg">
            Browse the showcase
          </ButtonLink>
          <ButtonLink href="/explore" size="lg" variant="outline">
            Explore the directory
          </ButtonLink>
          <ButtonLink href="/submit" size="lg" variant="secondary">
            Submit your build
          </ButtonLink>
        </div>
        <p className="mt-6 text-xs text-muted-foreground/80" data-share-placeholder>
          Share buttons land in the next pass. For now, grab a demo link from Showcase.
        </p>
      </div>
    </section>
  );
}

export function HomeWhyJev() {
  return (
    <section
      className="relative overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/8 via-card to-card p-8 md:p-10"
      aria-labelledby="why-jev-heading"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        Why builders pick Jev
      </p>
      <h2
        id="why-jev-heading"
        className="mt-2 max-w-xl font-heading text-2xl font-semibold sm:text-3xl"
      >
        Probabilities, not pep talks
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Route traffic, score snacks, gate code reviews, compact context: same primitives, different vibes. Your app sets thresholds; Jev returns numbers you can log, test, and ship.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { k: "Choice", v: "Pick a label from a fixed set" },
          { k: "Score", v: "Rate on a rubric with uncertainty" },
          { k: "Noul", v: "True/false style checks with confidence" },
        ].map((row) => (
          <li
            key={row.k}
            className="rounded-md border border-border bg-muted/30 px-3 py-3 text-sm"
          >
            <span className="font-mono text-primary">{row.k}</span>
            <p className="mt-1 text-xs text-muted-foreground">{row.v}</p>
          </li>
        ))}
      </ul>
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
            The homepage for Jev · System One · not a chat LLM
          </p>
          <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            Learn Jev. Watch the builds.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ship yours.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Your 30-second briefing: structured decisions with Choice, Score, and Noul. Real demos from the timeline. Docs, SDKs, and the full tool map one click away.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#what-is-jev" size="lg">
              What is Jev?
            </ButtonLink>
            <ButtonLink href="/showcase" size="lg" variant="outline">
              Watch demos
            </ButtonLink>
            <ButtonLink href="/learn" size="lg" variant="outline">
              Learn guides
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <AppLink href="/explore" className="font-medium text-primary hover:underline">
              Explore tools
            </AppLink>
            {" · "}
            <AppLink href="/submit" className="font-medium text-primary hover:underline">
              Submit a build
            </AppLink>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Learn topic chips for home IA (exported for quick-jump reuse). */
export { learnChips };
