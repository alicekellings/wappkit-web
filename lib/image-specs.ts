/**
 * Marketplace image specifications.
 *
 * Every number here is copied from a first-party or widely-corroborated source and
 * carries its own `source` + `lastVerified`. Marketplaces change these rules without
 * notice, so the page renders the verification date next to the table and tells the
 * reader to re-check before a bulk upload.
 *
 * Nothing is invented. Where a platform does not publish a hard limit (Shopify has no
 * minimum size, Etsy enforces no background rule) the field says so explicitly instead
 * of guessing a number.
 */

export type BackgroundRule = "pure-white" | "white-or-light" | "any";

export type ImageSpec = {
  /** URL segment, also the folder name under app/(marketing)/tools/ */
  slug: string;
  platform: string;
  /** Which slot on the platform this page covers */
  surface: string;
  /** H1 — leads with the thing the user searched for */
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Hard requirements */
  minLongEdge: number;
  maxLongEdge: number;
  recommendedWidth: number;
  recommendedHeight: number;
  maxBytes: number;
  /**
   * True when the platform publishes the number as a caution rather than a rejection
   * rule. Etsy says images "larger than 1MB may not finish uploading" — advising, not
   * blocking — so exceeding it must warn, never fail.
   */
  bytesAdvisory?: boolean;
  acceptedFormats: string[];
  background: BackgroundRule;
  /** Only present when the platform publishes a fill rule (Amazon: 85%) */
  fillRatioMin?: number;
  /** Extra hard rules, one sentence each */
  requirements: string[];
  /** Why listings actually get rejected, ordered by frequency */
  rejectionReasons: string[];
  /** What the audit cannot judge from pixels alone */
  manualChecks: string[];
  source: { label: string; url: string };
  lastVerified: string;
};

export const IMAGE_SPECS: ImageSpec[] = [
  {
    slug: "amazon-main-image",
    platform: "Amazon",
    surface: "Main image",
    h1: "Amazon main image checker: 2000×2000, pure white, 85% fill",
    metaTitle: "Amazon Main Image Checker — Size, Pure White & 85% Fill",
    metaDescription:
      "Free browser checker for Amazon main images. Test pure white (RGB 255,255,255), longest edge, file size, format and frame fill, then export a compliant 2000×2000 square. Images never leave your device.",
    intro:
      "Amazon holds the main image to a tighter standard than the rest of the gallery: pure white, product filling most of the frame, no text or props. Drop a photo in and this page reports each check, then exports a 2000×2000 square you can upload.",
    minLongEdge: 500,
    maxLongEdge: 10000,
    recommendedWidth: 2000,
    recommendedHeight: 2000,
    maxBytes: 10 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG", "TIFF", "non-animated GIF"],
    background: "pure-white",
    fillRatioMin: 0.85,
    requirements: [
      "Longest side between 500 and 10,000 px; zoom only activates from 1,000 px.",
      "Pure white background, RGB 255 255 255 exactly — 245 grey can still trigger suppression.",
      "Product fills about 85% of the frame, fully inside the frame with nothing cropped.",
      "No text, logos, borders, colour blocks, watermarks or props that are not sold with the item.",
      "One unit only unless the listing is a multipack; no mannequins, no packaging unless it is a feature.",
      "At least 72 dpi, JPEG strongly recommended over PNG or TIFF.",
    ],
    rejectionReasons: [
      "Background measures 250–253 instead of 255 after a levels adjustment.",
      "Product floats in too much white space, below the 85% fill expectation.",
      "A leftover grey halo along the cut-out edge from background removal.",
      "Added text, badges or a drop shadow that reaches the frame edge.",
      "Longest side under 1,000 px, so zoom never appears and conversion drops.",
    ],
    manualChecks: [
      "Whether the photo accurately represents the real product, colour and quantity.",
      "Whether any prop, packaging or accessory shown is actually included.",
      "Whether the category has its own style guide (clothing, shoes, jewellery).",
    ],
    source: {
      label: "Amazon Seller Central — Product image guide (G1881)",
      url: "https://sellercentral.amazon.com/gp/help/external/G1881",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "amazon-secondary-image",
    platform: "Amazon",
    surface: "Secondary images",
    h1: "Amazon secondary image checker: 1600px, under 10MB",
    metaTitle: "Amazon Secondary Image Checker — Size, Format & File Limit",
    metaDescription:
      "Check Amazon gallery images 2–9: longest edge, file size and format. Background and text are allowed here, unlike the main image. Resize to a clean 1600×1600 square in your browser.",
    intro:
      "Slots 2 through 9 are where you answer the questions that otherwise become returns. Backgrounds, text and infographics are allowed here — but the technical limits still apply. This checker verifies size and weight, then exports a clean square.",
    minLongEdge: 500,
    maxLongEdge: 10000,
    recommendedWidth: 1600,
    recommendedHeight: 1600,
    maxBytes: 10 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG", "TIFF", "non-animated GIF"],
    background: "any",
    requirements: [
      "Longest side between 500 and 10,000 px; 1,000 px or more keeps zoom available.",
      "Up to 9 images per listing; most categories show 7 before the viewer scrolls.",
      "Lifestyle scenes, text callouts and infographics are allowed on secondary slots.",
      "The same ban on nudity, Amazon logos, review screenshots and pricing still applies.",
    ],
    rejectionReasons: [
      "Reusing the main image as a secondary slot instead of adding new information.",
      "Text baked in at a size that becomes unreadable at thumbnail scale.",
      "Screenshots of reviews, star ratings or claims such as free shipping.",
    ],
    manualChecks: [
      "Whether each slot answers a distinct buyer question.",
      "Whether text stays legible on a phone thumbnail.",
    ],
    source: {
      label: "Amazon Seller Central — Product image guide (G1881)",
      url: "https://sellercentral.amazon.com/gp/help/external/G1881",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "etsy-listing-image",
    platform: "Etsy",
    surface: "First listing photo",
    h1: "Etsy listing image checker: 2000px and under 1MB",
    metaTitle: "Etsy Listing Image Checker — 2000px, 1MB & Format",
    metaDescription:
      "Free Etsy photo checker. Verify the 635px minimum, aim for 2000px, keep files near 1MB so uploads do not stall, and avoid transparent PNG. Resize and compress locally in your browser.",
    intro:
      "Etsy ranks smaller first photos lower, and its uploader slows down once files pass about 1MB. This page checks both, plus the transparent-PNG trap, and exports a square that fits the listing grid.",
    minLongEdge: 635,
    maxLongEdge: 10000,
    recommendedWidth: 2000,
    recommendedHeight: 2000,
    maxBytes: 1024 * 1024,
    bytesAdvisory: true,
    acceptedFormats: ["JPEG", "PNG (no transparency)", "GIF", "HEIC"],
    background: "any",
    requirements: [
      "First photo at least 635 × 635 px — smaller images are shown less often.",
      "2000 px on the long edge is the working target; Etsy displays a 4:3 crop in search.",
      "Keep files close to 1MB; larger uploads are slow and more likely to fail.",
      "No transparent PNG for the first photo — the grid background will show through.",
      "The first photo is cropped to a landscape 4:3 in search results, so keep the product centred.",
    ],
    rejectionReasons: [
      "Transparent PNG uploaded as the first photo, showing a checkered or dark grid.",
      "Product cropped out of frame by the 4:3 search crop.",
      "First photo below 635 px, which suppresses it in listing results.",
      "Files far above 1MB, causing the uploader to time out on slow connections.",
    ],
    manualChecks: [
      "Whether the first photo reads clearly at thumbnail size on a phone.",
      "Whether the image looks like a stock photo — Etsy requires your own work.",
    ],
    source: {
      label: "Etsy Seller Handbook — Listing photo requirements",
      url: "https://www.etsy.com/seller-handbook/article/1338693013729",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "ebay-photo",
    platform: "eBay",
    surface: "Listing photo",
    h1: "eBay photo checker: 1600px and under 12MB",
    metaTitle: "eBay Photo Size Checker — 1600px, 12MB & Zoom",
    metaDescription:
      "Check eBay listing photos: 500px minimum, 1600px for zoom, 12MB limit. White or light background recommended, no added borders or text. Resize locally in your browser.",
    intro:
      "eBay's 500 px floor is a floor, not a target — 1600 px is what enables zoom and what buyers expect. Drop a photo in to check its dimensions and weight, then export a clean square.",
    minLongEdge: 500,
    maxLongEdge: 12000,
    recommendedWidth: 1600,
    recommendedHeight: 1600,
    maxBytes: 12 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG"],
    background: "white-or-light",
    requirements: [
      "Minimum 500 px on the longest side; 1600 px enables the zoom viewer.",
      "Up to 12 MB per image, up to 24 photos per listing.",
      "White or light background recommended; no added borders, text or watermarks.",
      "Stock photos are not allowed for used items — the photo must show the actual item.",
    ],
    rejectionReasons: [
      "Added text or borders burned into the image.",
      "Using a catalogue stock photo for a used item.",
      "Image below 500 px, which cannot be uploaded at all.",
    ],
    manualChecks: [
      "Whether the photo shows the actual condition, flaws included.",
      "Whether all included accessories are visible in one of the photos.",
    ],
    source: {
      label: "eBay Seller Center — Photo requirements",
      url: "https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4143",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "shopify-product-image",
    platform: "Shopify",
    surface: "Product image",
    h1: "Shopify product image checker: 2048×2048, under 20MB",
    metaTitle: "Shopify Product Image Checker — 2048×2048 & 20MB",
    metaDescription:
      "Shopify has no minimum size, which is exactly why catalogues end up inconsistent. Check dimensions and weight, standardise on 2048×2048, and compress locally before upload.",
    intro:
      "Shopify is the most permissive platform here — no minimum size, no background rule, 20MB ceiling. That freedom is why most catalogues look inconsistent. Pick 2048×2048 and keep every product on it.",
    minLongEdge: 0,
    maxLongEdge: 5000,
    recommendedWidth: 2048,
    recommendedHeight: 2048,
    maxBytes: 20 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG", "WebP"],
    background: "any",
    requirements: [
      "No minimum size and no enforced background colour.",
      "Up to 5,000 × 5,000 px and 20 MB per file.",
      "2048 × 2048 displays best across product, collection and cart surfaces.",
      "Keep one aspect ratio for the whole catalogue — mixed ratios make collection pages look amateur.",
    ],
    rejectionReasons: [
      "Nothing is rejected technically, but oversized originals slow the storefront.",
      "Mixed aspect ratios across SKUs, which reads as an unfinished catalogue.",
      "Photographs saved as PNG, which inflates file size with no visible gain.",
    ],
    manualChecks: [
      "Whether the catalogue uses one consistent ratio and framing.",
      "Whether the image is compressed for delivery, not just uploaded at full size.",
    ],
    source: {
      label: "Shopify Help — Product media types and sizes",
      url: "https://help.shopify.com/en/manual/products/product-media/product-media-types",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "temu-product-image",
    platform: "Temu",
    surface: "Product image",
    h1: "Temu product image checker: 800×800 square, under 3MB",
    metaTitle: "Temu Product Image Checker — 800×800, 3MB, Square",
    metaDescription:
      "Check Temu listing images: 800×800 minimum, 1:1 square, white background, 3MB limit. Clothing needs 1340×1785. Resize and compress in your browser.",
    intro:
      "Temu is strict about the square and tight about weight: 800 × 800 minimum, 3MB ceiling. Clothing runs on a different ratio entirely. Check yours before the upload rejects it.",
    minLongEdge: 800,
    maxLongEdge: 5000,
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    maxBytes: 3 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG"],
    background: "pure-white",
    requirements: [
      "Minimum 800 × 800 px, 1:1 square for most categories.",
      "Clothing uses a 3:4 ratio, minimum 1340 × 1785 px.",
      "White or clean light background.",
      "Up to 3 MB per file — the tightest limit of the platforms on this site.",
    ],
    rejectionReasons: [
      "Non-square image for a category that requires 1:1.",
      "File above 3MB, which fails the upload silently in some seller flows.",
      "Busy background instead of white or clean light.",
    ],
    manualChecks: [
      "Whether the category uses the standard square or the clothing 3:4 ratio.",
      "Whether Temu's seller portal shows a newer limit for your category.",
    ],
    source: {
      label: "Temu Seller Center — Image requirements",
      url: "https://seller.temu.com/",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "tiktok-shop-image",
    platform: "TikTok Shop",
    surface: "Product image",
    h1: "TikTok Shop image checker: 800×800 square, under 5MB",
    metaTitle: "TikTok Shop Image Checker — 800×800, 5MB, Pure White",
    metaDescription:
      "Check TikTok Shop product images: 600px US / 800px UK minimum, 1:1 square, 5MB limit, pure white for UK. Resize and compress locally.",
    intro:
      "TikTok Shop runs different minimums by market — 600 px in the US, 800 px in the UK — and the UK asks for a pure white background. Check which rules your listing falls under before exporting.",
    minLongEdge: 600,
    maxLongEdge: 5000,
    recommendedWidth: 1080,
    recommendedHeight: 1080,
    maxBytes: 5 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG"],
    background: "pure-white",
    requirements: [
      "Minimum 600 × 600 px for US listings, 800 × 800 px for UK listings.",
      "1:1 square, front view of the product.",
      "Up to 5 MB per file.",
      "UK listings require a pure white background; US listings ban added logos, text and borders.",
    ],
    rejectionReasons: [
      "Square requirement ignored, so the product is cropped in the feed.",
      "Added text or logos burned into the main image.",
      "Off-white background on a UK listing.",
    ],
    manualChecks: [
      "Which market the listing targets — the minimum differs between US and UK.",
      "Whether the product is centred for the feed's square crop.",
    ],
    source: {
      label: "TikTok Shop Academy — Product image guidelines",
      url: "https://seller-us.tiktok.com/university/essay",
    },
    lastVerified: "2026-11-20",
  },
  {
    slug: "walmart-main-image",
    platform: "Walmart",
    surface: "Main image",
    h1: "Walmart main image checker: 2200×2200 pure white",
    metaTitle: "Walmart Main Image Checker — 2200×2200, Pure White, 5MB",
    metaDescription:
      "Check Walmart Marketplace main images: 1000px minimum, 2200×2200 recommended, pure white RGB 255, 5MB limit. Audit and export in your browser.",
    intro:
      "Walmart is the strictest of the group on the main image: pure white, product only, no promotional claims, and a 5MB ceiling. This checker reports each rule and exports a square that fits.",
    minLongEdge: 1000,
    maxLongEdge: 5000,
    recommendedWidth: 2200,
    recommendedHeight: 2200,
    maxBytes: 5 * 1024 * 1024,
    acceptedFormats: ["JPEG", "PNG"],
    background: "pure-white",
    requirements: [
      "Minimum 1,000 × 1,000 px; 2,200 × 2,200 px recommended, zoom from 1,500 px.",
      "Seamless pure white background, RGB 255 255 255.",
      "1:1 square, product centred and cropped close.",
      "No watermarks, logos or promotional claims.",
      "Up to 5 MB per file.",
    ],
    rejectionReasons: [
      "Background not measuring 255 on all four corners.",
      "Promotional text or a badge in the main image.",
      "Product too small in frame, or touching the edge.",
    ],
    manualChecks: [
      "Whether the item is a single unit with no props.",
      "Whether the category requires an additional angle set.",
    ],
    source: {
      label: "Walmart Marketplace — Image guidelines and requirements",
      url: "https://marketplace.walmart.com/",
    },
    lastVerified: "2026-11-20",
  },
];

export function getImageSpec(slug: string): ImageSpec | undefined {
  return IMAGE_SPECS.find((spec) => spec.slug === slug);
}

export const BACKGROUND_LABEL: Record<BackgroundRule, string> = {
  "pure-white": "Pure white, RGB 255 255 255",
  "white-or-light": "White or light background",
  any: "No background requirement",
};
