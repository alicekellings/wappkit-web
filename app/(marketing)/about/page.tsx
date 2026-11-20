import { constructMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "About | Wappkit",
  description:
    "Who writes Wappkit's guides, how each article is produced and checked, and the data rules we publish under.",
});

const desks = [
  {
    name: "Wappkit Research Desk",
    scope: "Data studies and worked examples",
    detail:
      "Collects numbers that already exist in public documentation or published datasets, and cites each one in the row where it appears.",
  },
  {
    name: "Wappkit Product Notes",
    scope: "Tutorials, teardowns, and troubleshooting",
    detail:
      "Walks procedures end to end with a verifiable checkpoint at each phase, and names the step people usually skip.",
  },
  {
    name: "Wappkit Editorial",
    scope: "Comparisons, glossary entries, and opinion",
    detail:
      "States the criteria that actually decide a choice, then defends a position against its strongest counter-case.",
  },
];

const steps = [
  {
    label: "1. Research",
    detail:
      "The topic is checked against every article already on the site. If the angle is already covered, it is dropped rather than reworded.",
  },
  {
    label: "2. Draft",
    detail:
      "A draft is produced with AI assistance against an explicit structure: a fixed section budget, a required data artefact, and a byline for the desk that owns the format.",
  },
  {
    label: "3. Gate",
    detail:
      "An automated editorial gate checks structure, length, source citations, and duplicate overlap. A draft that fails is revised or discarded, never published as-is.",
  },
  {
    label: "4. Publish",
    detail:
      "Only drafts that pass every check reach the site. The commit that publishes an article is verified against the live branch before the run is reported as successful.",
  },
];

const rules = [
  "Every number in a data table must name the source it came from, in the same row.",
  "When we do not have a measured number, the article says so instead of inventing one.",
  "No article may repeat the intent of an existing article, even with different wording.",
  "Comparisons must apply the same criteria to every option, with no missing cells.",
];

export default function AboutPage() {
  return (
    <MarketingPageShell containerClassName="max-w-5xl py-16 md:py-20">
      <MarketingHero
        eyebrow="About"
        title="Small team, explicit publishing rules."
        description="Wappkit builds desktop tools for people who work with Reddit data. This page explains who writes the guides, how each article is produced, and the standards a draft has to clear before it appears on the site."
        badges={[
          { label: "Editorial standards", tone: "warm" },
          { label: "Sourced data only" },
          { label: "AI-assisted drafting" },
        ]}
        rightContent={
          <MarketingCard tone="dark">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Corrections
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Found a number without a source, or a claim that does not hold up?
              Tell us and we will fix or remove the article.
            </p>
            <a
              href={`mailto:${siteConfig.mailSupport}`}
              className="mt-4 block font-heading text-2xl text-white"
            >
              {siteConfig.mailSupport}
            </a>
          </MarketingCard>
        }
      />

      <section className="mt-10">
        <h2 className="font-heading text-2xl text-foreground">
          Three desks, one standard
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Bylines are desk names, not invented individuals. Each desk owns one
          kind of article, so you can tell a data study from a walkthrough before
          you start reading.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {desks.map((desk) => (
            <div
              key={desk.name}
              className="rounded-[1.4rem] border border-border/70 bg-card/90 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                {desk.scope}
              </p>
              <h3 className="mt-2 font-heading text-lg text-foreground">
                {desk.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {desk.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl text-foreground">
          How an article is produced
        </h2>
        <div className="mt-6 space-y-3">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/80 p-5 md:flex-row md:gap-6"
            >
              <p className="w-32 shrink-0 font-heading text-sm text-orange-600">
                {step.label}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl text-foreground">
          What we will not publish
        </h2>
        <ul className="mt-4 space-y-3">
          {rules.map((rule) => (
            <li
              key={rule}
              className="flex gap-3 text-sm leading-7 text-muted-foreground"
            >
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-[1.6rem] border border-border/70 bg-card/90 p-6 md:p-8">
        <h2 className="font-heading text-xl text-foreground">
          About AI assistance
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Drafts are produced with AI assistance and then held to the checks
          described above, including a duplicate check against every existing
          article. We disclose this because it affects how you should read a
          page: use the cited sources to verify any number that matters to your
          decision, and tell us when something does not add up.
        </p>
      </section>
    </MarketingPageShell>
  );
}
