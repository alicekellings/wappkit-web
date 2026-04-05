export type ToolStatus = "live" | "coming-soon";

export type Tool = {
  slug: string;
  name: string;
  category: string;
  status: ToolStatus;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  audience: string[];
  platform: string;
  downloadLabel: string;
  buyLabel: string;
  downloadHref: string;
  buyHref: string;
  docsHref: string;
  availabilityNote: string;
  checkoutEnabled?: boolean;
};

export const tools: Tool[] = [
  {
    slug: "reddit-toolbox",
    name: "Reddit Toolbox",
    category: "Research",
    status: "live",
    tagline: "A focused desktop tool for Reddit research and workflow support.",
    shortDescription:
      "Explore Reddit communities, inspect opportunities, and keep your workflow in one focused utility.",
    longDescription:
      "Reddit Toolbox is the first Wappkit product page in the new platform structure. It is designed for focused research workflows and uses a license-based model instead of a web account dashboard.",
    features: [
      "Dedicated tool page with download and licensing guidance",
      "English-first positioning for product, docs, and blog content",
      "Structured placement inside the Wappkit multi-tool directory",
    ],
    audience: [
      "Founders validating communities",
      "Marketers doing audience research",
      "Operators who want simple desktop tooling",
    ],
    platform: "Desktop",
    downloadLabel: "Download Reddit Toolbox",
    buyLabel: "Buy with Creem",
    downloadHref: "/download",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "Live product page structure ready now. App delivery and checkout wiring can be connected next.",
    checkoutEnabled: true,
  },
  {
    slug: "keyword-radar",
    name: "Keyword Radar",
    category: "Discovery",
    status: "coming-soon",
    tagline: "An upcoming utility for tracking useful keyword signals faster.",
    shortDescription:
      "Planned as a lightweight discovery tool inside the Wappkit tool catalog.",
    longDescription:
      "Keyword Radar is a placeholder product card that shows how future tools can be introduced without changing the overall platform structure.",
    features: [
      "Directory-ready metadata model",
      "Fits the shared docs and blog system",
      "Prepared for license-based checkout later",
    ],
    audience: [
      "Product researchers",
      "Content teams",
      "Operators scanning demand signals",
    ],
    platform: "Desktop / Web",
    downloadLabel: "Join waitlist",
    buyLabel: "Coming soon",
    downloadHref: "/contact",
    buyHref: "/tools/keyword-radar",
    docsHref: "/docs",
    availabilityNote:
      "Planned tool entry that proves we can add future products without creating new subdomains.",
  },
  {
    slug: "clip-exporter",
    name: "Clip Exporter",
    category: "Utility",
    status: "coming-soon",
    tagline: "A future export-focused utility for clean download workflows.",
    shortDescription:
      "A placeholder tool entry to validate the future multi-tool expansion model.",
    longDescription:
      "Clip Exporter helps test the information architecture for future Wappkit tools without forcing a new subdomain or separate content system.",
    features: [
      "Can reuse the same product template",
      "Shares the same help and license center patterns",
      "Keeps all SEO value on the root domain",
    ],
    audience: [
      "Small software teams",
      "Indie makers",
      "Users who prefer simple download tools",
    ],
    platform: "Desktop",
    downloadLabel: "Join waitlist",
    buyLabel: "Coming soon",
    downloadHref: "/contact",
    buyHref: "/tools/clip-exporter",
    docsHref: "/docs",
    availabilityNote:
      "Placeholder launch slot for future tools that need the same landing page and support structure.",
  },
];

export function getFeaturedTools() {
  return tools.slice(0, 3);
}

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getDisplayProductName(toolSlug: string, fallbackName?: string | null) {
  const tool = getToolBySlug(toolSlug);

  return tool?.name ?? fallbackName ?? "Wappkit Tool";
}
