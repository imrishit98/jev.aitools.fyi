import { useCallback, useState } from "react";
import { AppLink } from "@/components/app-link";
import { siteConfig } from "@/lib/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/data/categories";

type ListingPayload = {
  title: string;
  url: string;
  repoUrl?: string;
  demoUrl?: string;
  category: string;
  oneLiner: string;
  description: string;
  tags: string[];
  twitterHandle?: string;
  submitterEmail?: string;
  submittedAt: string;
};

function categoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.title ?? slug;
}

function buildPayload(form: FormData): ListingPayload {
  const twitterRaw = String(form.get("twitter") ?? "").trim();
  const twitterHandle = twitterRaw
    ? twitterRaw.replace(/^@/, "").replace(/\s/g, "")
    : undefined;

  return {
    title: String(form.get("title") ?? "").trim(),
    url: String(form.get("url") ?? "").trim(),
    repoUrl: String(form.get("repoUrl") ?? "").trim() || undefined,
    demoUrl: String(form.get("demoUrl") ?? "").trim() || undefined,
    category: String(form.get("category") ?? ""),
    oneLiner: String(form.get("oneLiner") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    tags: String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    twitterHandle,
    submitterEmail: String(form.get("email") ?? "").trim() || undefined,
    submittedAt: new Date().toISOString(),
  };
}

function formatIssueBody(payload: ListingPayload): string {
  const lines = [
    "## Listing submission",
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| **Project** | ${payload.title} |`,
    `| **Primary URL** | ${payload.url} |`,
    `| **Category** | ${categoryLabel(payload.category)} (\`${payload.category}\`) |`,
    `| **One-liner** | ${payload.oneLiner} |`,
  ];

  if (payload.repoUrl) {
    lines.push(`| **GitHub repo** | ${payload.repoUrl} |`);
  }
  if (payload.demoUrl) {
    lines.push(`| **Live demo** | ${payload.demoUrl} |`);
  }
  if (payload.twitterHandle) {
    lines.push(`| **Twitter / X** | @${payload.twitterHandle} |`);
  }
  if (payload.submitterEmail) {
    lines.push(`| **Contact email** | ${payload.submitterEmail} |`);
  }
  if (payload.tags.length > 0) {
    lines.push(`| **Tags** | ${payload.tags.join(", ")} |`);
  }

  lines.push(
    "",
    "### Description",
    "",
    payload.description,
    "",
    "### Machine-readable payload",
    "",
    "```json",
    JSON.stringify(payload, null, 2),
    "```",
    "",
    "---",
    "_Submitted via [jev.aitools.fyi/submit](https://jev.aitools.fyi/submit)._",
  );

  return lines.join("\n");
}

export function buildSubmitIssueUrl(payload: ListingPayload): string {
  const params = new URLSearchParams({
    title: `Listing: ${payload.title}`,
    body: formatIssueBody(payload),
  });
  const base = siteConfig.submitIssueUrl.replace(/\?$/, "");
  return `${base}?${params.toString()}`;
}

type SubmitStatus = "idle" | "success" | "popup_blocked" | "error";

export function SubmitForm() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFeedback = useCallback(() => {
    setStatus("idle");
    setIssueUrl(null);
    setErrorMessage(null);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetFeedback();

    const form = e.currentTarget;
    if (!form.reportValidity()) {
      setStatus("error");
      setErrorMessage("Fill in the required fields above. We are not psychic yet.");
      return;
    }

    try {
      const payload = buildPayload(new FormData(form));
      if (!payload.category) {
        setStatus("error");
        setErrorMessage("Pick a category so we know where to file your listing.");
        return;
      }

      const url = buildSubmitIssueUrl(payload);
      setIssueUrl(url);

      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (opened === null) {
        setStatus("popup_blocked");
      } else {
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong building your issue link.",
      );
    }
  }

  async function copyJson(form: HTMLFormElement) {
    const payload = buildPayload(new FormData(form));
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyIssueLink() {
    if (!issueUrl) return;
    try {
      await navigator.clipboard.writeText(issueUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage("Could not copy to clipboard. Use the link below instead.");
      setStatus("error");
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      onChange={() => {
        if (status !== "idle") resetFeedback();
      }}
    >
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
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" placeholder="routing, mcp, typescript" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter / X handle (optional)</Label>
          <Input id="twitter" name="twitter" placeholder="@you" autoComplete="off" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Your email (optional)</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>

      {status === "success" && (
        <div
          role="status"
          className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
        >
          <p className="font-medium">Nice. GitHub should open with your listing draft.</p>
          <p className="mt-1 text-muted-foreground">
            Submit the issue there and a human will review it. No bots, no drama.
          </p>
        </div>
      )}

      {status === "popup_blocked" && issueUrl && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
        >
          <p className="font-medium">Your browser blocked the new tab.</p>
          <p className="mt-1 text-muted-foreground">
            Open the prefilled issue manually, or copy the link and paste it in a new tab.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Open GitHub issue
            </a>
            <Button type="button" variant="outline" size="sm" onClick={() => copyIssueLink()}>
              {copied ? "Copied link" : "Copy issue link"}
            </Button>
          </div>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Open GitHub issue</Button>
        <Button
          type="button"
          variant="outline"
          onClick={(ev) => {
            const form = (ev.target as HTMLElement).closest("form");
            if (form) copyJson(form);
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
