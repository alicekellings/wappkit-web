import Link from "next/link";
import { notFound } from "next/navigation";

import { constructMetadata } from "@/lib/utils";
import { getToolBySlug, tools } from "@/lib/tools";
import { CheckoutButton } from "@/components/forms/checkout-button";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return constructMetadata({ title: "Tool Not Found | Wappkit" });
  }

  return constructMetadata({
    title: `${tool.name} | Wappkit`,
    description: tool.shortDescription,
  });
}

export default function ToolDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="container max-w-5xl py-16 md:py-20">
      <div className="rounded-[2rem] border bg-card p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tool.status === "live" ? "Live tool" : "Coming soon"}
          </span>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tool.category}
          </span>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tool.platform}
          </span>
        </div>

        <h1 className="mt-6 font-heading text-4xl text-foreground md:text-5xl">
          {tool.name}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">{tool.tagline}</p>
        <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
          {tool.longDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={tool.downloadHref}>
            <Button rounded="full">{tool.downloadLabel}</Button>
          </Link>
          {tool.checkoutEnabled ? (
            <CheckoutButton toolSlug={tool.slug} label={tool.buyLabel} />
          ) : (
            <Link href={tool.buyHref}>
              <Button rounded="full" variant="outline">
                {tool.buyLabel}
              </Button>
            </Link>
          )}
          <Link href={tool.docsHref}>
            <Button rounded="full" variant="ghost">
              Read Docs
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-2xl text-foreground">
            What this page should cover
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {tool.features.map((feature) => (
              <li key={feature}>- {feature}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-2xl text-foreground">
            Best fit for
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {tool.audience.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border bg-muted/30 p-6">
        <h2 className="font-heading text-2xl text-foreground">
          Availability note
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {tool.availabilityNote}
        </p>
        {tool.checkoutEnabled ? (
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Checkout is wired for Creem. License retrieval stays on the main
            site and can later send a copy to the original purchase email when
            email delivery is configured.
          </p>
        ) : null}
      </section>
    </div>
  );
}
