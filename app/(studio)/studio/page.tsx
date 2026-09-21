import {
  MarketingCard,
  MarketingCtaBand,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";
import { StudioInquiryForm } from "@/components/studio/inquiry-form";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { studioConfig } from "@/config/studio";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Wappkit Studio — custom automation work",
  description:
    "We diagnose, repair, and maintain Make, n8n, and Zapier workflows for small teams. Fixed scope, fixed price, no hourly surprises.",
};

const scopeNotes = [
  "We never ask for production credentials. You run the workflows in your own account; we work from your exported blueprint and a sample of the failing data.",
  "Every engagement has written acceptance criteria before work starts, so “fixed” means fixed.",
  "If a workflow is not worth fixing, we will tell you that instead of taking the job.",
];

export default function StudioPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow={studioConfig.eyebrow}
        title={studioConfig.title}
        description={studioConfig.description}
        badges={studioConfig.platforms.map((platform) => ({
          label: platform,
          tone: "default" as const,
        }))}
        actions={
          <>
            <a
              href="#contact"
              className={cn(buttonVariants({ rounded: "full", size: "lg" }), "px-8")}
            >
              Tell us what is broken
            </a>
            <a
              href="#services"
              className={cn(
                buttonVariants({ variant: "outline", rounded: "full", size: "lg" }),
                "px-8",
              )}
            >
              See how it works
            </a>
          </>
        }
      />

      {/* ---------- 服务三档 ---------- */}
      <section id="services" className="mt-16 scroll-mt-24">
        <MarketingSectionIntro
          eyebrow="Services"
          title="Pick the smallest thing that solves your problem"
          description="Most engagements start with a diagnosis. You pay for that piece, see the findings, and decide whether you want us to fix it."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {studioConfig.tiers.map((tier) => (
            <MarketingCard
              key={tier.slug}
              tone={tier.tone}
              className="flex flex-col p-6 md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-heading text-xl text-foreground">{tier.name}</p>
                {tier.featured ? (
                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-orange-700">
                    Most common
                  </span>
                ) : null}
              </div>

              <p className="mt-5 font-heading text-4xl text-foreground">
                {tier.priceLabel}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {tier.priceNote}
              </p>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.summary}
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-foreground">
                {tier.deliverables.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-1 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <dt className="font-semibold uppercase tracking-[0.14em]">Best for</dt>
                  <dd>{tier.bestFor}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold uppercase tracking-[0.14em]">Turnaround</dt>
                  <dd>{tier.turnaround}</dd>
                </div>
              </dl>

              <a
                href="#contact"
                className={cn(
                  buttonVariants({
                    variant: tier.featured ? "default" : "outline",
                    rounded: "full",
                  }),
                  "mt-7 w-full",
                )}
              >
                {tier.ctaLabel}
              </a>
            </MarketingCard>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50/70 p-5 text-sm leading-6 text-foreground">
          <strong className="font-semibold">Diagnosis fee comes off the repair.</strong>{" "}
          If you go ahead with a repair, we deduct what you already paid for the
          diagnosis. You are never charged twice for the same hour.
        </div>
      </section>

      {/* ---------- 流程 ---------- */}
      <section id="process" className="mt-20 scroll-mt-24">
        <MarketingSectionIntro
          eyebrow="How it works"
          title="Four steps, no surprises"
          description="We keep the scope small and the terms explicit. You should always know what you are paying for and what “done” means."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {studioConfig.process.map((item) => (
            <MarketingCard key={item.step} tone="soft" className="p-6">
              <p className="font-heading text-3xl text-orange-700">{item.step}</p>
              <p className="mt-4 font-heading text-lg text-foreground">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </MarketingCard>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {scopeNotes.map((note) => (
            <div
              key={note}
              className="rounded-3xl border border-border/70 bg-background/85 p-5 text-sm leading-6 text-muted-foreground"
            >
              {note}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 咨询表单 ---------- */}
      <section id="contact" className="mt-20 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <MarketingSectionIntro
            eyebrow="Get in touch"
            title="Tell us what is broken"
            description="We read every inquiry ourselves and usually reply within one business day. If it is a good fit, you get a scope and a fixed price — if it is not, we will say so."
          />

          <MarketingCard tone="default" className="p-6 md:p-8">
            <StudioInquiryForm />
          </MarketingCard>
        </div>
      </section>

      <MarketingCtaBand
        eyebrow="Not sure yet?"
        title="Send us the workflow and we will tell you honestly whether it is worth fixing."
        description="No pitch, no discovery-call theatre. A short reply with what we would do and what it would cost."
        className="mt-20"
      >
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <a
            href="#contact"
            className={cn(buttonVariants({ rounded: "full", size: "lg" }), "px-8")}
          >
            Start an inquiry
          </a>
          <a
            href={`${siteConfig.url}/pricing`}
            className={cn(
              buttonVariants({ variant: "outline", rounded: "full", size: "lg" }),
              "px-8",
            )}
          >
            See our products
          </a>
        </div>
      </MarketingCtaBand>
    </MarketingPageShell>
  );
}
