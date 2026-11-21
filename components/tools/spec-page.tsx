import Link from "next/link";
import { ArrowRight, Check, Info, ShieldAlert, Sparkles } from "lucide-react";

import { ImageSpecTool } from "@/components/tools/image-spec-tool";
import { TrackedToolLink } from "@/components/tools/tracked-tool-link";
import { formatBytes } from "@/lib/image-audit";
import {
  BACKGROUND_LABEL,
  IMAGE_SPECS,
  type ImageSpec,
} from "@/lib/image-specs";

function specFaq(spec: ImageSpec): Array<{ question: string; answer: string }> {
  const ceiling = spec.maxLongEdge
    ? `, up to ${spec.maxLongEdge} px`
    : ", with no published ceiling";
  return [
    {
      question: `What size should a ${spec.platform} ${spec.surface.toLowerCase()} be?`,
      answer: `${spec.platform} ${
        spec.minLongEdge > 0
          ? `requires at least ${spec.minLongEdge} px on the longest side${ceiling}`
          : `publishes no minimum size${ceiling}`
      }. ${spec.recommendedWidth} × ${spec.recommendedHeight} px is the working size this page exports, and ${
        spec.bytesAdvisory
          ? `the platform advises staying near ${formatBytes(spec.maxBytes)} per file, though it publishes no hard cap`
          : `the file must stay under ${formatBytes(spec.maxBytes)}`
      }.`,
    },
    {
      question: `Does the background have to be pure white?`,
      answer:
        spec.background === "pure-white"
          ? `Yes for this slot. ${spec.platform} expects RGB 255, 255, 255 — a background that merely looks white (245 or 250) can still be rejected.`
          : spec.background === "white-or-light"
            ? `Not strictly. ${spec.platform} prefers a white or light background for this slot but does not enforce an exact RGB value.`
            : `${spec.platform} does not enforce a background colour for this slot.`,
    },
    {
      question: "Why was my image rejected?",
      answer: `The most common causes for ${spec.platform} ${spec.surface.toLowerCase()}s are: ${spec.rejectionReasons.slice(0, 3).join(" ")}`,
    },
    {
      question: "Does this checker upload my photos?",
      answer:
        "No. Every check runs in your browser using the Canvas API. The file is read from disk into memory, measured, and exported back to your device — no request carries the image anywhere.",
    },
    {
      question: "Can it fix the background for me?",
      answer:
        "No, and it deliberately does not pretend to. Turning a studio backdrop into RGB 255,255,255 requires a real cut-out. A browser filter that brightens the background would also wash out light products and create halos, which is one of the named causes of rejection.",
    },
  ];
}

export function SpecPage({ spec }: { spec: ImageSpec }) {
  const faq = specFaq(spec);
  const others = IMAGE_SPECS.filter((entry) => entry.slug !== spec.slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${spec.platform} ${spec.surface} Checker`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: spec.metaDescription,
  };

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),linear-gradient(to_bottom,#ffffff,#fffbf5_40%,#ffffff)]" />

      <div className="container max-w-6xl py-12 md:py-16">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/tools" className="hover:text-foreground">
            Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">{spec.platform} image checker</span>
        </nav>

        <header className="mt-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              Free · no upload
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Verified {spec.lastVerified}
            </span>
          </div>
          <h1 className="mt-5 font-heading text-4xl leading-tight text-foreground md:text-5xl">
            {spec.h1}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{spec.intro}</p>
        </header>

        <div className="mt-8">
          <ImageSpecTool spec={spec} />
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.6rem] border bg-card p-6 md:p-8">
            <h2 className="font-heading text-2xl text-foreground">
              {spec.platform} {spec.surface.toLowerCase()} requirements
            </h2>
            <dl className="mt-5 divide-y divide-border/60 text-sm">
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted-foreground">Frame size</dt>
                <dd className="text-right font-medium text-foreground">
                  {spec.recommendedWidth} × {spec.recommendedHeight} px recommended
                  <span className="block text-xs font-normal text-muted-foreground">
                    {spec.minLongEdge > 0
                      ? `minimum ${spec.minLongEdge} px`
                      : "no published minimum"}
                    {" · "}
                    {spec.maxLongEdge
                      ? `ceiling ${spec.maxLongEdge} px`
                      : "no published ceiling"}
                    {spec.zoomThreshold
                      ? ` · zoom from ${spec.zoomThreshold} px`
                      : ""}
                  </span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted-foreground">File size</dt>
                <dd className="text-right font-medium text-foreground">
                  {spec.bytesAdvisory ? (
                    <>
                      {formatBytes(spec.maxBytes)} guidance
                      <span className="block text-xs font-normal text-muted-foreground">
                        no published hard cap — larger files may stall mid-upload
                      </span>
                    </>
                  ) : (
                    <>up to {formatBytes(spec.maxBytes)}</>
                  )}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted-foreground">Formats</dt>
                <dd className="text-right font-medium text-foreground">
                  {spec.acceptedFormats.join(", ")}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted-foreground">Background</dt>
                <dd className="text-right font-medium text-foreground">
                  {BACKGROUND_LABEL[spec.background]}
                </dd>
              </div>
              {spec.fillRatioMin ? (
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-muted-foreground">Frame fill</dt>
                  <dd className="text-right font-medium text-foreground">
                    product fills about {Math.round(spec.fillRatioMin * 100)}%
                    <span className="block text-xs font-normal text-muted-foreground">
                      judged on the subject&apos;s longest span, not area
                    </span>
                  </dd>
                </div>
              ) : null}
            </dl>

            <ul className="mt-6 space-y-3">
              {spec.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-3 text-sm leading-6">
                  <Check className="mt-1 size-4 shrink-0 text-emerald-600" />
                  <span className="text-foreground">{requirement}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Source:{" "}
              <a
                href={spec.source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                {spec.source.label}
              </a>
              . Checked {spec.lastVerified}. Marketplaces revise these rules, so confirm on
              the seller portal before a bulk upload.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.6rem] border bg-card p-6 md:p-8">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-rose-600" />
                <h2 className="font-heading text-xl text-foreground">
                  Why listings get rejected
                </h2>
              </div>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {spec.rejectionReasons.map((reason, index) => (
                  <li key={reason} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[11px] font-semibold text-rose-700">
                      {index + 1}
                    </span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.6rem] border bg-card p-6 md:p-8">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-slate-500" />
                <h2 className="font-heading text-xl text-foreground">
                  What pixels cannot tell you
                </h2>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                {spec.manualChecks.map((check) => (
                  <li key={check} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.6rem] border border-orange-200 bg-[linear-gradient(135deg,rgba(255,247,237,0.96),rgba(255,255,255,0.98))] p-6 md:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                When the background is the problem
              </p>
              <h2 className="mt-3 font-heading text-2xl text-foreground">
                A checker can flag a grey backdrop. It cannot cut the product out.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                If the report says the border is not RGB 255, the photo needs a real
                cut-out — that is a desktop job. AI E-commerce Visual Studio removes
                backgrounds, fills white, and exports marketplace presets in batch on
                Windows. The checker stays free and unlimited here.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <TrackedToolLink
                href="/tools/ai-ecom-visual-studio"
                event="image_checker_to_desktop_app"
                data={{ slot: spec.slug, platform: spec.platform }}
                className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-orange-300"
              >
                <span>Open the desktop image studio</span>
                <ArrowRight className="size-4" />
              </TrackedToolLink>
              <TrackedToolLink
                href="/tools"
                event="image_checker_to_index"
                data={{ slot: spec.slug }}
                className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-orange-300"
              >
                <span>Browse all checkers</span>
                <ArrowRight className="size-4" />
              </TrackedToolLink>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.6rem] border bg-card p-6 md:p-8">
          <h2 className="font-heading text-2xl text-foreground">
            Frequently asked questions
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-border/70 bg-background/70 p-4"
              >
                <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.6rem] border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-orange-600" />
            <h2 className="font-heading text-xl text-foreground">
              Other marketplace sizes
            </h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((entry) => (
              <Link
                key={entry.slug}
                href={`/tools/${entry.slug}`}
                className="rounded-2xl border border-border/70 bg-background/70 p-4 transition hover:border-orange-300"
              >
                <p className="text-sm font-semibold text-foreground">
                  {entry.platform} {entry.surface.toLowerCase()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {entry.recommendedWidth} × {entry.recommendedHeight} px · up to{" "}
                  {formatBytes(entry.maxBytes)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </div>
    </div>
  );
}
