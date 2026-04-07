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
    tagline:
      "Desktop Reddit research software with a free starting mode and a license-based full unlock.",
    shortDescription:
      "Start with the Reddit collector for free, then unlock the full desktop workflow with a Wappkit license key.",
    longDescription:
      "Reddit Toolbox helps founders, marketers, and operators turn Reddit activity into a cleaner research workflow. The free version keeps the Reddit collector open, while the paid license unlocks the full toolbox inside the app without forcing users into a web account dashboard.",
    features: [
      "Free mode keeps the Reddit collector open for hands-on evaluation",
      "Paid activation unlocks the rest of the desktop toolbox inside the app",
      "License retrieval and activation help live on the main Wappkit site",
    ],
    audience: [
      "Founders validating communities and pain points",
      "Marketers collecting live Reddit demand signals",
      "Operators who want desktop software without account friction",
    ],
    platform: "Desktop",
    downloadLabel: "Download Free Version",
    buyLabel: "Unlock Full Version",
    downloadHref: "/download",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "Reddit Toolbox is live on Wappkit with checkout, license retrieval, and in-app activation connected.",
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

export function getPromotableTools() {
  const liveTools = tools.filter((tool) => tool.status === "live");

  return liveTools.length > 0 ? liveTools : getFeaturedTools();
}

export function getPromotedTool(seed: string) {
  const promotableTools = getPromotableTools();

  if (promotableTools.length === 0) {
    return null;
  }

  const hash = seed
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return promotableTools[hash % promotableTools.length];
}

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getDisplayProductName(
  toolSlug: string,
  fallbackName?: string | null,
) {
  const tool = getToolBySlug(toolSlug);

  return tool?.name ?? fallbackName ?? "Wappkit Tool";
}
