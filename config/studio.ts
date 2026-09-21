export type StudioTier = {
  slug: string;
  name: string;
  priceLabel: string;
  priceNote: string;
  summary: string;
  deliverables: string[];
  bestFor: string;
  turnaround: string;
  ctaLabel: string;
  tone: "default" | "warm";
  featured?: boolean;
};

export const studioConfig = {
  name: "Wappkit Studio",
  brand: "Wappkit",
  eyebrow: "Custom automation work",
  title: "Automations break. We fix them.",
  description:
    "We're the team behind Wappkit. We diagnose, repair, and maintain Make, n8n, and Zapier workflows for small teams — fixed scope, fixed price, no hourly surprises.",
  platforms: ["Make.com", "n8n", "Zapier", "Airtable", "Bubble", "Shopify"],

  /**
   * 三档报价。价格统一按「起步价」展示，实际报价在看过工作流后给出。
   * 调价只改这里。
   */
  tiers: [
    {
      slug: "diagnosis",
      name: "Diagnosis",
      priceLabel: "from $39",
      priceNote: "credited against a repair",
      summary: "We find out what is actually wrong.",
      deliverables: [
        "A written root-cause report",
        "Exactly where it breaks, and why",
        "A prioritized fix plan",
        "A realistic time and cost estimate",
      ],
      bestFor: "You are not sure what is broken",
      turnaround: "24–48 hours",
      ctaLabel: "Start with a diagnosis",
      tone: "default",
    },
    {
      slug: "repair",
      name: "Repair",
      priceLabel: "from $149",
      priceNote: "fixed price, agreed up front",
      summary: "One workflow, fixed and tested.",
      deliverables: [
        "The repaired workflow, working in your own account",
        "Acceptance criteria agreed in writing before we start",
        "A short Loom walkthrough of what changed",
        "Handover notes so you are not dependent on us",
      ],
      bestFor: "You already know something is broken",
      turnaround: "Usually 3–7 days",
      ctaLabel: "Request a quote",
      tone: "warm",
      featured: true,
    },
    {
      slug: "care-plan",
      name: "Care Plan",
      priceLabel: "from $99/mo",
      priceNote: "month to month, cancel anytime",
      summary: "We keep an eye on it.",
      deliverables: [
        "Monitoring on your key workflows",
        "Alerts when a run fails silently",
        "A fixed block of hours each month for changes",
        "Priority response when something breaks",
      ],
      bestFor: "Workflows your business depends on",
      turnaround: "Ongoing",
      ctaLabel: "Talk to us",
      tone: "default",
    },
  ] satisfies StudioTier[],

  process: [
    {
      step: "01",
      title: "You describe the problem",
      detail: "A short message is enough. Export the workflow and paste the error.",
    },
    {
      step: "02",
      title: "We scope it in writing",
      detail: "You get a fixed price and explicit acceptance criteria before anything starts.",
    },
    {
      step: "03",
      title: "You approve",
      detail: "No deposit games, no open-ended hourly clock. If it is not worth fixing, we say so.",
    },
    {
      step: "04",
      title: "We fix it and hand it over",
      detail: "Tested, documented, running in your account. You keep full control.",
    },
  ],
};
