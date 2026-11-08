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
  // 可选：给页面右侧展示卡的每条特性配一句说明。缺省时整块沿用 availabilityNote，
  // 会出现五张卡文字相同的情况，所以新上产品尽量补齐。
  featureNotes?: string[];
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
    slug: "reddit-viewer-extension",
    name: "Reddit Reader",
    category: "Reddit Tools",
    status: "live",
    tagline:
      "Read Reddit without login walls — a clean reader mode that lives in your browser.",
    shortDescription:
      "A Chrome and Edge extension that hides login prompts and clutter, highlights keywords, and exports a thread to Markdown. Free with a 3-export trial; Pro is a one-time $4.99 license.",
    longDescription:
      "Reddit Reader is a browser extension for people who read Reddit without an account. It removes login prompts, sidebars, app banners and promoted posts, highlights the keywords you care about, and can export the post plus its comments to a clean Markdown file. The free version includes reader mode, one keyword and three Markdown exports. Pro unlocks unlimited keywords and exports. It runs in Chrome and Edge on Windows, macOS and Linux, so there is no installer and no separate account.",
    features: [
      "Clean reader mode that hides login walls, sidebars, app banners and promoted posts",
      "Keyword highlighting across the post and comments",
      "One-click export of the post and comments to Markdown",
      "Works on reddit.com, including direct thread URLs",
      "No installer and no Wappkit account required",
    ],
    featureNotes: [
      "The reader mode is a toggle: turn it off when you want the normal Reddit layout back.",
      "Free includes one keyword; Pro removes the keyword limit.",
      "Free includes three Markdown exports; Pro removes the export limit.",
      "Useful when a thread is easier to keep as a file than as a browser tab.",
      "Install from the extension store, then activate Pro inside the extension.",
    ],
    audience: [
      "People who read Reddit without logging in",
      "Researchers collecting threads for notes or analysis",
      "Privacy-conscious readers who want less clutter and no app prompts",
    ],
    platform: "Chrome / Edge",
    downloadLabel: "Install free extension",
    buyLabel: "Get Pro — $4.99",
    downloadHref: "https://chromewebstore.google.com/",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "Reddit Reader is a free browser extension with a 3-export trial. Pro activates inside the extension with a Wappkit license key.",
    checkoutEnabled: true,
    priceLabel: "$4.99 one-time",
    priceNote:
      "One-time Pro license. Free mode includes reader mode, one keyword and three Markdown exports.",
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
    featureNotes: [
      "Each shape is bound to its own hotkey, so the same eight layouts are one keystroke away.",
      "Windows are assigned in on-screen stacking order, which means the active window takes the first slot.",
      "The hotkeys are registered globally, so you never leave the application you are working in.",
      "There are no zones to draw and nothing to drag — the layout is applied to whatever is already open.",
      "Clicking the X hides it to the tray instead of quitting, so the hotkeys keep working.",
      "Save where a window belongs, then put it back with one click from the tray or the layout list.",
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
    featureNotes: [
      "Two files with the same name and the same size but different content can never land in the same group.",
      "A hard link is a second name for the same data, so removing it frees nothing. Those entries are left alone.",
      "Removal goes through the Windows shell, which means anything deleted can be restored from the Recycle Bin.",
      "The window stays responsive while a drive is being read, and Stop keeps every group found so far.",
      "The free version exports 20 groups and remembers 2 rules; the licence lifts both caps and adds scheduled runs.",
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
      "FileDedupe is live in the Microsoft Store. Pro checkout runs through Wappkit with in-app activation.",
    checkoutEnabled: true,
    priceLabel: "$6 launch special",
    regularPriceLabel: "$9 regular price",
    priceNote:
      "One-time Pro license, not a subscription. One key works on one PC at a time.",
  },
  {
    slug: "renamer",
    name: "Bulk File Renamer Studio",
    category: "File Management",
    status: "live",
    tagline:
      "Rename thousands of files by rule, see every new name before anything moves, and undo the whole batch.",
    shortDescription:
      "Stack rules — find and replace, renumber, change case, fix extensions — and watch the preview rewrite itself. Clashes and illegal names are flagged before you run. Pro lifts the saved rule sets, regular expressions, date naming and command-line limits.",
    longDescription:
      "Bulk File Renamer Studio turns a folder of files into a list you can rewrite by rule instead of by hand. Rules run top to bottom like a sentence: replace \"DSC_\" with a trip name, add a three-digit number, lower-case the result. The preview column updates as you type, and nothing is applied until you press the button. Two files landing on the same name are marked in red, names Windows will not accept are marked before you run, and a name that already exists on disk is marked as a clash. Renames go out in two passes — every file first moves to a temporary name, then to its final one — so chains and swaps come out correct instead of silently overwriting each other. The undo record is written to disk, so Ctrl+Z still works after the app is closed and reopened. The free version is a complete renamer; Pro removes the saved-rule-set cap and adds regular expressions, date-based naming and command-line runs.",
    features: [
      "Live preview of every new name before a single file moves",
      "Clashes, illegal characters, reserved names and over-long names flagged in the list",
      "Two-pass rename, so chains and swaps never overwrite each other",
      "Undo written to disk — it survives closing the app",
      "Pro: unlimited saved rule sets, regular expressions, date naming, command-line runs",
    ],
    featureNotes: [
      "The right-hand column shows the result of the whole rule chain, updated while you type, so you can judge the batch before touching the disk.",
      "A name Windows refuses — a reserved word like CON, a trailing dot, an illegal character, more than 255 characters — is caught in the preview instead of failing halfway through the run.",
      "Renaming a.txt to b.txt while b.txt becomes c.txt is a chain; swapping two names is the same problem. Both are applied through temporary names, which one-pass renamers get wrong.",
      "The journal lives next to the settings, so a rename done yesterday can still be reversed today, even after a restart.",
      "The free version saves one rule set; the licence lifts that cap and unlocks the rules that need a parser or a clock.",
    ],
    audience: [
      "People organising years of camera files, screenshots and downloads",
      "Anyone who has renamed two hundred files by hand and does not intend to again",
      "Teams standardising file names before handing a folder to someone else",
    ],
    platform: "Windows Desktop",
    downloadLabel: "Get it from Microsoft Store",
    buyLabel: "Unlock Pro",
    downloadHref: "https://apps.microsoft.com/detail/9MW101RGQNN1",
    buyHref: "/license",
    docsHref: "/docs/checkout-and-activation",
    availabilityNote:
      "Bulk File Renamer Studio is live in the Microsoft Store. Pro checkout runs through Wappkit with in-app activation.",
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

/**
 * 博客文章到产品的主题映射。
 *
 * 旧实现按 slug 字符码哈希取模分配，等于随机。实测结果是 Reddit 文章底部
 * 推销截图工具、数据库工具、去重工具，301 次点击被推给完全不相关的产品。
 * 现在改成按关键词匹配：先看 slug，再看标题和分类，都匹配不上时回退到
 * 站上流量主体对应的产品（宁可推同一个对的，也不要随机推错的）。
 */
const PROMOTED_TOOL_TOPIC_RULES: ReadonlyArray<{
  slug: string;
  pattern: RegExp;
}> = [
  {
    slug: "reddit-viewer-extension",
    pattern:
      /reddit[- ]?viewer|browse[- ]?reddit|without[- ]?account|anonymous|lurker|old[- ]?reddit|read[- ]?reddit/i,
  },
  {
    slug: "reddit-toolbox",
    pattern:
      /reddit|subreddit|gummysearch|karma|upvote|moderator|r\/[a-z0-9_]+/i,
  },
  {
    slug: "renamer",
    pattern:
      /renam|file[- ]?names?|naming[- ]?convention|organi[sz]e[- ]?(your[- ]?)?(files?|photos?|folder)/i,
  },
  {
    slug: "filededupe",
    pattern:
      /duplicate|dedupe|disk[- ]?space|storage[- ]?sense|large[- ]?files?|hard[- ]?drive|free[- ]?up[- ]?space|photo[- ]?library/i,
  },
  {
    slug: "snapgrid",
    pattern:
      /screenshot|window[- ]?(snap|manager|layout|tile)|tile[- ]?windows?|multi[- ]?monitor|split[- ]?screen|always[- ]?on[- ]?top/i,
  },
  {
    slug: "ai-ecom-visual-studio",
    pattern:
      /e-?com(merce)?|product[- ]?(photo|image|picture|listing)|background[- ]?remov|amazon[- ]?listing|shopify/i,
  },
  {
    slug: "wappkit-app-setup",
    pattern: /license[- ]?key|activation|installer|checkout[- ]?flow/i,
  },
];

const DEFAULT_PROMOTED_TOOL_SLUG = "reddit-toolbox";

export type PromotedToolMatch = {
  slug: string;
  title?: string | null;
  categories?: ReadonlyArray<string> | null;
};

export function getPromotedTool(match: string | PromotedToolMatch) {
  const promotableTools = getPromotableTools();

  if (promotableTools.length === 0) {
    return null;
  }

  const haystack =
    typeof match === "string"
      ? match
      : [match.slug, match.title ?? "", ...(match.categories ?? [])].join(" ");

  for (const rule of PROMOTED_TOOL_TOPIC_RULES) {
    if (!rule.pattern.test(haystack)) {
      continue;
    }

    const tool = promotableTools.find(
      (candidate) => candidate.slug === rule.slug,
    );

    if (tool) {
      return tool;
    }
  }

  return (
    promotableTools.find((tool) => tool.slug === DEFAULT_PROMOTED_TOOL_SLUG) ??
    promotableTools[0]
  );
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
