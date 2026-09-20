import { AppLink } from "@/components/app-link";
import { AudienceSwitch } from "@/components/audience-switch";
import { ButtonLink } from "@/components/button-link";
import { ShareBar } from "@/components/share-menu";
import { homeShareOptions } from "@/lib/share";
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
        <AppLink
          href="#what-is-jev"
          className="inline-flex items-center rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
        >
          Jump to What is Jev?
        </AppLink>
      </div>
    </section>
  );
}

const startPaths = [
  {
    icon: BookOpen,
    title: "Learn guides",
    blurb: "Plain-language paths through System One, gateway wiring, and when not to use chat labels.",
    href: "/learn",
    cta: "/learn",
  },
  {
    icon: Rocket,
    title: "Quick start",
    blurb: "First steps on the official stack listing, with links out when you are ready to run code.",
    href: "/sdks/quick-start",
    cta: "quick-start profile",
  },
  {
    icon: Layers,
    title: "API reference",
    blurb: "HTTP shapes, primitives, and the boring parts, indexed here like every other listing.",
    href: "/sdks/documentation",
    cta: "documentation profile",
  },
  {
    icon: FlaskConical,
    title: "Playgrounds",
    blurb: "Official sandbox profile plus community demos when you want to click before you npm install.",
    href: "/sdks/playground",
    cta: "playground profile",
  },
  {
    icon: Zap,
    title: "Vercel AI Gateway",
    blurb: `Learn how ${GATEWAY_MODEL_ID} shows up in AI SDK flows, then open the tool page.`,
    href: "/learn/vercel-ai-gateway",
    cta: "Gateway learn guide",
  },
  {
    icon: Code2,
    title: "JavaScript SDK",
    blurb: "First-party TypeScript client in the directory, stars and repo links included.",
    href: "/sdks/typesafe-ai-typesafe-sdk-js",
    cta: "typesafe-ai-typesafe-sdk-js",
  },
] as const;

const externalStartLinks = [
  {
    label: "TypeSafe docs",
    hint: "docs.typesafe.ai",
    href: siteConfig.typesafe.docs,
  },
  {
    label: "Live playground",
    hint: "console.typesafe.ai",
    href: siteConfig.typesafe.playground,
  },
  {
    label: "Vercel model docs",
    hint: "vercel.com/docs/ai-gateway",
    href: siteConfig.vercelGateway,
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
          Stay on jev.aitools.fyi for guides, SDK profiles, and gateway notes. External TypeSafe and Vercel links sit below when you are ready to leave.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {startPaths.map((path) => {
          const Icon = path.icon;
          return (
            <AppLink
              key={path.title}
              href={path.href}
              className="group flex gap-4 rounded-md border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-semibold">{path.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {path.blurb}
                </p>
                <p className="mt-2 font-mono text-[11px] text-primary">{path.cta}</p>
              </div>
            </AppLink>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-muted-foreground">
        <span className="w-full text-xs font-medium uppercase tracking-widest text-muted-foreground sm:w-auto sm:normal-case sm:tracking-normal">
          Also on this site:
        </span>
        <AppLink href="/explore?category=sdks" className="text-primary hover:underline">
          SDK hub
        </AppLink>
        <span aria-hidden>·</span>
        <AppLink href="/explore?category=official" className="text-primary hover:underline">
          Official stack
        </AppLink>
        <span aria-hidden>·</span>
        <AppLink href="/tools/jev-on-vercel-ai-gateway" className="font-mono text-primary hover:underline">
          {GATEWAY_MODEL_ID}
        </AppLink>
        <span aria-hidden>·</span>
        <AppLink href="/developers" className="text-primary hover:underline">
          Agent docs
        </AppLink>
        <span aria-hidden>·</span>
        <AppLink href="/openapi.json" className="text-primary hover:underline">
          OpenAPI
        </AppLink>
        <span aria-hidden>·</span>
        <AppLink href="/sdks/typesafe-ai-typesafe-sdk-python" className="font-mono text-primary hover:underline">
          typesafe-ai-typesafe-sdk-python
        </AppLink>
      </div>
      <div className="rounded-md border border-dashed border-border bg-muted/25 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          External (opens in a new tab)
        </p>
        <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
          {externalStartLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-primary hover:underline"
              >
                {link.label}
                <span className="font-mono text-[11px] font-normal text-muted-foreground">
                  {link.hint}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
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
        <div className="mt-8">
          <ShareBar
            options={homeShareOptions()}
            hint="Steal this link. Tag TypeSafe if your team should see it."
            layout="stack"
          />
        </div>
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
        <AppLink href="/sdks/playground" className="text-primary hover:underline">
          Playground listing
        </AppLink>
        <AppLink href={siteConfig.typesafe.playground} className="text-muted-foreground hover:text-primary hover:underline" external>
          Live console (external)
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
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <p className="inline-flex w-fit max-w-full items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur-sm">
              <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              Jev directory
            </p>
            <AudienceSwitch variant="hero" />
          </div>
          <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            Discover what people build with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Jev
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The curated map of SDKs, integrations, demos, and apps on TypeSafe System One. Watch real builder clips, skim honest listings, and open docs when you are ready to wire something up.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/explore" size="lg">
              Browse the directory
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

/** Learn topic chips for home IA (exported for quick-jump reuse). */
export { learnChips };
