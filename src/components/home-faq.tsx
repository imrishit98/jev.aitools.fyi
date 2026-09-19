import { AppLink } from "@/components/app-link";
import { homeFaq } from "@/data/faq";

export function HomeFaq() {
  return (
    <section
      className="surface-card p-8 md:p-10 lg:p-12"
      aria-labelledby="home-faq-heading"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        FAQ
      </p>
      <h2
        id="home-faq-heading"
        className="mt-2 font-heading text-2xl font-semibold sm:text-3xl"
      >
        Jev questions, short answers
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Quotable facts for humans and search engines. Deeper guides live on{" "}
        <AppLink href="/learn" className="text-primary hover:underline">
          Learn
        </AppLink>
        .
      </p>
      <dl className="mt-8 space-y-6">
        {homeFaq.map((entry) => (
          <div key={entry.question}>
            <dt className="font-heading text-base font-semibold text-foreground">
              {entry.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {entry.answer}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
        <AppLink href="/explore?mcp=1" className="text-primary hover:underline">
          Jev MCP listings
        </AppLink>
        <AppLink href="/learn/use-cases" className="text-primary hover:underline">
          Jev use cases
        </AppLink>
        <AppLink
          href="/learn/vercel-ai-gateway"
          className="text-primary hover:underline"
        >
          Vercel AI Gateway Jev
        </AppLink>
      </div>
    </section>
  );
}
