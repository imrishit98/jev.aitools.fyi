import { useState } from "react";
import { AppLink } from "@/components/app-link";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/data/categories";

export function SubmitForm() {
  const [copied, setCopied] = useState(false);

  function buildPayload(form: FormData) {
    return {
      title: String(form.get("title") ?? ""),
      url: String(form.get("url") ?? ""),
      repoUrl: String(form.get("repoUrl") ?? "") || undefined,
      demoUrl: String(form.get("demoUrl") ?? "") || undefined,
      category: String(form.get("category") ?? ""),
      oneLiner: String(form.get("oneLiner") ?? ""),
      description: String(form.get("description") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      submitterEmail: String(form.get("email") ?? "") || undefined,
      submittedAt: new Date().toISOString(),
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = buildPayload(form);
    const body = encodeURIComponent(
      `## Listing submission\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``,
    );
    window.open(
      `${siteConfig.submitIssueUrl}&title=${encodeURIComponent(`Listing: ${payload.title}`)}&body=${body}`,
      "_blank",
    );
  }

  async function copyJson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = buildPayload(form);
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Project name</Label>
          <Input id="title" name="title" required placeholder="my-jev-router" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="url">Primary URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://github.com/you/project"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repoUrl">GitHub repo (optional)</Label>
          <Input id="repoUrl" name="repoUrl" type="url" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="demoUrl">Live demo (optional)</Label>
          <Input id="demoUrl" name="demoUrl" type="url" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="oneLiner">One-liner</Label>
          <Input id="oneLiner" name="oneLiner" required maxLength={140} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required rows={4} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" placeholder="routing, mcp, typescript" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Your email (optional)</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Open GitHub issue</Button>
        <Button
          type="button"
          variant="outline"
          onClick={(ev) => {
            const form = (ev.target as HTMLElement).closest("form");
            if (form) copyJson({ preventDefault: () => {}, currentTarget: form } as React.FormEvent<HTMLFormElement>);
          }}
        >
          {copied ? "Copied JSON" : "Copy JSON"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Opens a prefilled GitHub issue on this repo. Maintainers merge approved entries into{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">src/data/catalog.json</code>{" "}
        via{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">scripts/generate-catalog.mjs</code>.
        No backend, no spam funnel.
      </p>
    </form>
  );
}

export function SubmitPageContent() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">Submit a listing</h1>
      <p className="mt-3 text-muted-foreground">
        Built with Jev? Share the repo, product, MCP server, or guide. We verify links by hand before anything goes live.
      </p>
      <div className="mt-10">
        <SubmitForm />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Prefer email? Contact via{" "}
        <AppLink href="/about" className="text-accent hover:underline">
          About
        </AppLink>{" "}
        once the repo is connected on Origin.
      </p>
    </div>
  );
}
