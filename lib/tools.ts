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
  priceLabel?: string;
  regularPriceLabel?: string;
  priceNote?: string;
};

export const tools: Tool[] = [
  {
    slug: "ai-ecom-visual-studio",
    name: "AI E-commerce Visual Studio",
    category: "E-commerce Images",
    status: "live",
    tagline:
      "Desktop product image studio for clean backgrounds, batch composition, and marketplace-ready exports.",
    shortDescription:
      "Start free with single-image cleanup and 100 batch background removals, then unlock unlimited batch work, background replacement, enhancement, and marketplace-ready exports with Pro.",
    longDescription:
      "AI E-commerce Visual Studio is a Windows desktop image tool for sellers and operators who need clean product photos without sending every file through a browser. Free mode includes single-image background removal, transparent PNG saving, metadata cleanup, and 100 batch background removals. Pro unlocks custom background composition, unlimited batch processing, image enhancement, and export presets for e-commerce and social media.",
    features: [
      "Free single-image cleanup plus 100 batch background removals",
      "Pro unlimited batch removal and batch background replacement",
      "Pro Amazon, Shopify, Instagram, and Facebook export presets",
      "Pro image enhancement and Smart Product Optimize",
      "Pro custom background composition with position and scale controls",
    ],
    audience: [
      "Shopify and Amazon sellers preparing product listings",
      "E-commerce operators creating repeatable image workflows",
      "Marketplace agencies handling batches of catalog photos",
      "Social commerce teams turning product shots into campaign images",
    ],
    platform: "Windows Desktop",
    downloadLabel: "Download Image Studio",
    buyLabel: "Unlock Pro",
    downloadHref: "/api/desktop/ai-ecom-visual-studio/download",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "AI E-commerce Visual Studio uses Wappkit checkout, license retrieval, and in-app activation support.",
    checkoutEnabled: true,
    priceLabel: "$6 launch special",
    regularPriceLabel: "$9 regular price",
    priceNote:
      "One-time Pro license for the current desktop workflow. Future AI generation credits, if added, can stay separate.",
  },
  {
    slug: "wappkit-app-setup",
    name: "Wappkit App Setup",
    category: "Windows Setup",
    status: "live",
    tagline:
      "Windows app setup desktop tool with optional WinGet workflows and license-based premium unlock.",
    shortDescription:
      "Queue useful Windows apps faster, run setup packs, and unlock premium diagnostics and profile workflows with one license key.",
    longDescription:
      "Wappkit App Setup is a Windows-first desktop utility for installing baseline software faster, with a direct flow for optional WinGet maintenance and a premium license unlock path for advanced workflow features.",
    features: [
      "Starter packs and supported app install flow",
      "Optional WinGet repair and diagnostics workflow",
      "License activation and device-based premium unlock",
    ],
    audience: [
      "Windows users setting up fresh or reset PCs",
      "Operators who repeat app setup tasks",
      "Small teams standardizing baseline app installs",
    ],
    platform: "Desktop",
    downloadLabel: "Download App Setup",
    buyLabel: "Unlock Premium",
    downloadHref: "/download",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "Wappkit App Setup is live with license activation flow and Creem checkout support.",
    checkoutEnabled: true,
  },
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
    priceLabel: "$9 one-time",
    priceNote:
      "One-time payment, no subscription. The free tier stays free; a single license unlocks the full desktop toolkit.",
  },
  {
    slug: "snapgrid",
    name: "SnapTiles",
    category: "Window Management",
    status: "live",
    tagline:
      "Arrange every open window with one click — pick a shape and the screen tidies itself.",
    shortDescription:
      "Eight layouts, global hotkeys and two remembered window positions, free with no time limit. Snaps every open window into place without dragging or zone setup.",
    longDescription:
      "SnapTiles arranges the windows you already have open. You do not drag anything and you do not draw zones first: pick a shape — two columns, a 2x2 grid, main plus side — and every window on the screen moves into it. Eight layouts are available, each bound to a global hotkey (Ctrl+Alt+1 to Ctrl+Alt+8) that works from any application. It lives in the system tray, so closing the window keeps it running, and launching it twice brings the existing window forward instead of starting a second copy. Windows are assigned in on-screen stacking order, which means the active window always gets the first slot. The free version also remembers two window positions and puts them back on demand, permanently.",
    features: [
      "Eight layouts: single, two columns, two rows, three columns, main + two, two + main, 2x2, 3x2",
      "One click arranges every open window on the screen",
      "Global hotkeys Ctrl+Alt+1 to Ctrl+Alt+8 work from any application",
      "No dragging and no zone setup — pick a shape and it is done",
      "Lives in the system tray; closing the window keeps it running",
      "Remembers two window positions for free, with no time limit",
    ],
    audience: [
      "People who keep too many windows open and live in Alt-Tab",
      "Laptop users working on one screen with no room for overlapping windows",
      "Anyone who wants a fixed layout without learning a tiling window manager",
    ],
    platform: "Windows Desktop",
    downloadLabel: "Get it from Microsoft Store",
    buyLabel: "Pro (coming soon)",
    downloadHref: "https://apps.microsoft.com/detail/9PMN9C65S9DZ",
    buyHref: "/contact",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "SnapTiles is live in the Microsoft Store. The free version is complete; a Pro licence is not on sale yet.",
    checkoutEnabled: false,
    priceLabel: "Free",
    priceNote:
      "All eight layouts, the global hotkeys and two remembered window positions are free and never expire.",
  },
  {
    slug: "filededupe",
    name: "FileDedupe",
    category: "File Management",
    status: "live",
    tagline:
      "Find the files that are actually identical, then get rid of the extras without fear.",
    shortDescription:
      "Scan any folder, see every group of identical files, and delete to the Recycle Bin with undo. Pro lifts the export, rule and command-line limits.",
    longDescription:
      "FileDedupe compares whole files with SHA-256 instead of a cheap checksum, so a match is a real match. Two files with the same name and size but different content are never grouped together. The scan runs in three stages — exact size, then the first 4 KB, then the full file — so it stays fast without guessing. Hard links are detected and skipped, which is why a cleanup here frees the space it claims to free. Deleting goes to the Recycle Bin through the Windows shell and can always be undone. The free version is a complete tool: Pro only removes the CSV export limit, saves unlimited exclusion rules, and adds command-line use.",
    features: [
      "SHA-256 verification instead of a checksum that can collide",
      "Hard links skipped, so removed files actually free space",
      "Deletes to the Recycle Bin by default and can be undone",
      "Scanning runs off the UI thread; Stop keeps what was already found",
      "Pro: unlimited CSV export, saved exclusion rules, command-line use",
    ],
    audience: [
      "People with years of photos and documents copied across drives",
      "Teams cleaning backup folders before archiving",
      "Anyone who wants to see exactly which copy will be kept",
    ],
    platform: "Windows Desktop",
    downloadLabel: "Get it from Microsoft Store",
    buyLabel: "Unlock Pro",
    downloadHref: "https://apps.microsoft.com/detail/9MTB41HP52QG",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "FileDedupe is in Microsoft Store certification. Pro checkout runs through Wappkit with in-app activation.",
    checkoutEnabled: true,
    priceLabel: "$6 launch special",
    regularPriceLabel: "$9 regular price",
    priceNote:
      "One-time Pro license, not a subscription. One key works on one PC at a time.",
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
  {
    slug: "firestore-gui",
    name: "Firestore GUI",
    category: "Developer Tools",
    status: "live",
    tagline:
      "Inspect Cloud Firestore data without leaving your JetBrains IDE. Read-only by design.",
    shortDescription:
      "Browse collections, documents and nested subcollections, read every document as type-converted JSON, and compare documents in a table — inside IntelliJ IDEA, Android Studio, WebStorm, PyCharm or GoLand.",
    longDescription:
      "Firestore GUI is a free JetBrains plugin that puts a read-only Firestore browser inside the IDE. Connect with a service account JSON file or point at the local Firestore emulator, walk from root collections down through documents and nested subcollections, and read each document as JSON where timestamps, references, geo points, maps and arrays already appear as values instead of opaque wrapper objects. A built-in table view turns a collection into rows and columns so you can compare documents side by side, a filter box narrows the tree while you type, and any document can be copied as JSON or opened directly in the Firebase console. There are no write buttons anywhere: the plugin can only read, so opening production data in the IDE cannot change it.",
    features: [
      "Tree browsing across root collections, documents and nested subcollections",
      "Readable JSON with timestamps, references, geo points, maps and arrays resolved",
      "Table view that compares a collection document by document",
      "Filter box that narrows the tree while you type",
      "Copy document JSON or document path in one click",
      "Open the selected document straight in the Firebase console",
      "Service account JSON or local Firestore emulator",
      "Error messages that name the thing to check instead of dumping a raw response",
    ],
    audience: [
      "Backend and full-stack developers debugging Firestore-backed apps",
      "Android and Flutter developers working against Cloud Firestore",
      "Teams that want to look at production data without write access",
      "Anyone already paying for a Firestore browser that fails to connect",
    ],
    platform: "JetBrains IDEs",
    downloadLabel: "Get it on JetBrains Marketplace",
    buyLabel: "Free plugin",
    downloadHref: "https://plugins.jetbrains.com/plugin/35569-firestore-gui",
    buyHref: "https://plugins.jetbrains.com/plugin/35569-firestore-gui",
    docsHref: "https://plugins.jetbrains.com/plugin/35569-firestore-gui",
    availabilityNote:
      "Free and read-only. Requires IntelliJ IDEA 2024.3 or newer, or any IntelliJ Platform IDE such as Android Studio, WebStorm, PyCharm or GoLand.",
    checkoutEnabled: false,
    priceLabel: "Free",
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
