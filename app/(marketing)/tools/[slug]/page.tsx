import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  CreditCard,
  Download,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getToolBySlug, tools } from "@/lib/tools";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/forms/checkout-button";

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

type ToolMarketingContent = {
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  trustPoints: string[];
  stats: Array<{
    label: string;
    value: string;
  }>;
  showcaseItems: Array<{
    label: string;
    description: string;
    locked?: boolean;
  }>;
  freeFeatures: string[];
  proFeatures: string[];
  workflow: Array<{
    title: string;
    description: string;
  }>;
  assurances: Array<{
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  finalCtaTitle: string;
  finalCtaDescription: string;
};

function getToolMarketingContent(
  tool: (typeof tools)[number],
): ToolMarketingContent {
  if (tool.slug === "reddit-toolbox") {
    return {
      eyebrow: "Desktop Reddit Research Software",
      heroTitle:
        "Turn Reddit signal into a cleaner, paid-ready research workflow.",
      heroDescription:
        "Reddit Toolbox lets users start with a free Reddit collection mode, prove the workflow on real communities, and then unlock the full desktop toolbox with a single Wappkit license key.",
      trustPoints: [
        "Free Reddit collector included",
        "Upgrade inside the app with one license key",
        "No customer dashboard or forced login flow",
      ],
      stats: [
        {
          label: "Free access",
          value: "Reddit collector",
        },
        {
          label: "Paid unlock",
          value: "Full toolbox",
        },
        {
          label: "Activation model",
          value: "Remote license validation",
        },
      ],
      showcaseItems: [
        {
          label: "Reddit collector",
          description:
            "Open in free mode to validate communities, topics, and signal.",
        },
        {
          label: "Advanced workflow modules",
          description:
            "Premium functions stay locked until a valid license is activated.",
          locked: true,
        },
        {
          label: "License status",
          description:
            "The app talks to Wappkit to verify the key and unlock the paid version.",
        },
      ],
      freeFeatures: [
        "Use the Reddit collector before spending anything",
        "Test the product on your own workflow and communities",
        "Stay inside the desktop app without creating a web account",
      ],
      proFeatures: [
        "Unlock the rest of the desktop toolbox with one paid key",
        "Validate the license remotely and activate inside the app",
        "Recover a lost key on Wappkit with order details and purchase email",
      ],
      workflow: [
        {
          title: "Download and start free",
          description:
            "Install the desktop app and use the Reddit collector immediately as the free entry point.",
        },
        {
          title: "Upgrade when the workflow proves useful",
          description:
            "Buy the full version from the product page without being pushed into a bulky SaaS account model.",
        },
        {
          title: "Activate with your license key",
          description:
            "Paste the key inside the app, validate it against Wappkit, and unlock the paid version on the device.",
        },
      ],
      assurances: [
        {
          title: "License recovery stays on your site",
          description:
            "Customers can retrieve the key from Wappkit using the original order details and purchase email.",
        },
        {
          title: "Designed for focused operators",
          description:
            "The product is positioned for founders, marketers, and researchers who want cleaner Reddit signal fast.",
        },
        {
          title: "Checkout, docs, and support stay connected",
          description:
            "The product page, download flow, activation docs, and retrieval path all live under the same brand surface.",
        },
      ],
      faq: [
        {
          question: "Do I need a Wappkit account to use the paid version?",
          answer:
            "No. Customers buy, receive a license key, and activate directly inside the desktop app.",
        },
        {
          question: "What does the free version include?",
          answer:
            "The free version keeps the Reddit collector open so users can test the workflow before upgrading.",
        },
        {
          question: "What unlocks after purchase?",
          answer:
            "The paid license upgrades the app from the free collector entry point to the full desktop toolbox.",
        },
        {
          question: "What if the customer loses the license key?",
          answer:
            "They can use the Wappkit retrieval flow with the original order details and purchase email to get the key again.",
        },
      ],
      finalCtaTitle:
        "Start free now and move to the full version only when the workflow earns it.",
      finalCtaDescription:
        "This keeps the product approachable for new users while still making the upgrade path feel like a real software purchase, not a vague sign-up funnel.",
    };
  }

  return {
    eyebrow: `${tool.category} tool`,
    heroTitle: tool.name,
    heroDescription: tool.longDescription,
    trustPoints: [
      `${tool.platform} delivery`,
      tool.status === "live"
        ? "Product page is available now"
        : "Product page reserved for launch",
      "Shared docs and licensing support on Wappkit",
    ],
    stats: [
      {
        label: "Status",
        value: tool.status === "live" ? "Live" : "Coming soon",
      },
      {
        label: "Category",
        value: tool.category,
      },
      {
        label: "Platform",
        value: tool.platform,
      },
    ],
    showcaseItems: tool.features.map((feature) => ({
      label: feature,
      description: tool.availabilityNote,
    })),
    freeFeatures: tool.features,
    proFeatures: [
      "Shared Wappkit product page and support flow",
      "License-based upgrade path when checkout is enabled",
      "Future launch copy can be added without changing the structure",
    ],
    workflow: [
      {
        title: "Open the product page",
        description: tool.shortDescription,
      },
      {
        title: "Read the documentation",
        description:
          "Product guidance stays attached to the main Wappkit site.",
      },
      {
        title: "Watch the launch state",
        description: tool.availabilityNote,
      },
    ],
    assurances: tool.audience.map((item) => ({
      title: item,
      description: tool.availabilityNote,
    })),
    faq: [
      {
        question: "Is this tool already available?",
        answer: tool.availabilityNote,
      },
      {
        question: "Where do product details live?",
        answer:
          "Wappkit keeps tool details, docs, and support on the same main domain.",
      },
      {
        question: "How will upgrades work later?",
        answer:
          "Future tools can use the same license-based checkout and retrieval pattern.",
      },
      {
        question: "Where should I go next?",
        answer:
          "Use the tool page, docs, or contact page depending on your stage.",
      },
    ],
    finalCtaTitle:
      "Track this tool on Wappkit while the launch surface is taking shape.",
    finalCtaDescription: tool.availabilityNote,
  };
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

  const marketing = getToolMarketingContent(tool);

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_24%),linear-gradient(to_bottom,#ffffff,#fffbf5_42%,#ffffff)]" />

      <div className="container max-w-6xl py-16 md:py-20">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] md:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                  {marketing.eyebrow}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {tool.status === "live" ? "Live now" : "Coming soon"}
                </span>
                <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {tool.platform}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl font-heading text-4xl leading-tight text-foreground md:text-5xl xl:text-6xl">
                {marketing.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                {marketing.heroDescription}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {marketing.trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-border/70 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-full bg-orange-100 p-1 text-orange-700">
                        <Check className="size-4" />
                      </span>
                      <p className="text-sm leading-6 text-foreground">
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {tool.checkoutEnabled ? (
                  <CheckoutButton
                    toolSlug={tool.slug}
                    label={tool.buyLabel}
                    size="lg"
                    variant="default"
                    className="shadow-sm"
                  />
                ) : (
                  <Link href={tool.buyHref}>
                    <Button rounded="full" size="lg">
                      {tool.buyLabel}
                    </Button>
                  </Link>
                )}
                <Link href={tool.downloadHref}>
                  <Button rounded="full" size="lg" variant="outline">
                    <Download className="mr-2 size-4" />
                    {tool.downloadLabel}
                  </Button>
                </Link>
                <Link href={tool.docsHref}>
                  <Button rounded="full" size="lg" variant="ghost">
                    <BookOpen className="mr-2 size-4" />
                    Activation Guide
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {marketing.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-border/70 bg-background/90 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-base font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-8 top-6 size-32 rounded-full bg-orange-200/60 blur-3xl" />
              <div className="rounded-[1.8rem] border border-slate-800 bg-slate-950 p-4 text-white shadow-[0_32px_80px_-24px_rgba(15,23,42,0.55)]">
                <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Wappkit Desktop
                    </p>
                    <h2 className="mt-2 font-heading text-2xl text-white">
                      {tool.name}
                    </h2>
                  </div>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    {tool.status === "live"
                      ? "Ready to activate"
                      : "Launch in progress"}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[0.78fr_1fr]">
                  <div className="rounded-[1.4rem] bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Workspace
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="bg-orange-500/12 rounded-2xl p-3">
                        <p className="text-sm font-semibold text-orange-100">
                          Reddit Collector
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-300">
                          Free access entry point for real-world testing.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-dashed border-white/10 p-3">
                        <p className="text-sm font-semibold text-slate-200">
                          Premium Modules
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Full workflow stays locked until a valid key is
                          applied.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {marketing.showcaseItems.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {item.description}
                            </p>
                          </div>
                          <span
                            className={`rounded-full p-2 ${
                              item.locked
                                ? "bg-white/10 text-slate-300"
                                : "bg-emerald-500/10 text-emerald-300"
                            }`}
                          >
                            {item.locked ? (
                              <Lock className="size-4" />
                            ) : (
                              <Sparkles className="size-4" />
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-orange-500/12 rounded-full p-2 text-orange-200">
                      <KeyRound className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        License activation happens inside the app
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Customers buy on Wappkit, receive a key, and validate it
                        remotely without needing a separate account center.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.8rem] border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Free to paid flow
            </p>
            <h2 className="mt-3 font-heading text-3xl text-foreground">
              Start with a usable free entry. Upgrade only when the software
              earns it.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              This structure keeps the tool approachable for new users and makes
              the paid version feel like a real product upgrade instead of a
              forced login wall.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-orange-200 bg-orange-50/70 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Free version
                </p>
                <h3 className="mt-3 font-heading text-2xl text-foreground">
                  Validate the Reddit workflow first
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground">
                  {marketing.freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-1 size-4 text-orange-700" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">
                  Paid version
                </p>
                <h3 className="mt-3 font-heading text-2xl text-white">
                  Unlock the rest of the toolbox
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
                  {marketing.proFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-1 size-4 text-orange-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.8rem] border bg-card p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Best fit for
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {tool.audience.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border bg-background px-4 py-2 text-sm text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border bg-card p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Included in this product
              </p>
              <ul className="mt-5 space-y-4">
                {tool.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="rounded-full bg-muted p-2 text-foreground">
                      <ArrowRight className="size-4" />
                    </span>
                    <span className="text-sm leading-6 text-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.8rem] border bg-card p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-3 font-heading text-3xl text-foreground">
              A simple purchase and activation loop that feels like real
              software.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {marketing.workflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-border/70 bg-background/80 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Step 0{index + 1}
                  </span>
                  <span className="rounded-full bg-orange-100 p-2 text-orange-700">
                    {index === 0 ? (
                      <Download className="size-4" />
                    ) : index === 1 ? (
                      <CreditCard className="size-4" />
                    ) : (
                      <KeyRound className="size-4" />
                    )}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-2xl text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[1.8rem] border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product assurances
            </p>
            <div className="mt-5 space-y-4">
              {marketing.assurances.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.4rem] border border-border/70 bg-background/80 p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-orange-100 p-2 text-orange-700">
                      <ShieldCheck className="size-4" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              FAQ
            </p>
            <div className="mt-5 space-y-4">
              {marketing.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-[1.4rem] border border-border/70 bg-background/80 p-5"
                >
                  <h3 className="font-semibold text-foreground">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.8rem] border border-orange-200 bg-[linear-gradient(135deg,rgba(255,247,237,0.95),rgba(255,255,255,0.98))] p-8 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
                Ready to try it
              </p>
              <h2 className="mt-3 max-w-3xl font-heading text-3xl text-foreground md:text-4xl">
                {marketing.finalCtaTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {marketing.finalCtaDescription}
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-white/85 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Support paths
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {tool.availabilityNote}
              </p>
              <div className="mt-5 space-y-3">
                <Link href="/license/retrieve" className="block">
                  <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-orange-300">
                    <span>Retrieve a lost license</span>
                    <ArrowRight className="size-4" />
                  </div>
                </Link>
                <Link href={tool.docsHref} className="block">
                  <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-orange-300">
                    <span>Read checkout and activation docs</span>
                    <ArrowRight className="size-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
