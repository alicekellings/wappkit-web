/**
 * Marketplace image specifications.
 *
 * Every number here is copied from a first-party page and carries its own `source` +
 * `lastVerified`. Marketplaces change these rules without notice, so the page renders
 * the verification date next to the table and tells the reader to re-check before a
 * bulk upload.
 *
 * Nothing is invented. Where a platform does not publish a limit the optional field is
 * left off and the audit skips that check — a missing official number is not a licence
 * to guess one, because a guessed gate produces a false failure and costs the reader
 * more than no advice at all.
 *
 * The published numbers fall into three classes, and the fields keep them apart:
 *
 *   hard gate   minLongEdge / maxLongEdge / maxBytes     violate -> fail
 *   recommended recommendedWidth / recommendedHeight     short   -> warn
 *   advisory    bytesAdvisory / backgroundAdvisory /
 *               minLongEdgeAdvisory / zoomThreshold      miss    -> warn
 *
 * Two corrections in 2026-11 came from mixing those classes up: Etsy's 1MB is upload
 * advice, not a cap; TikTok Shop's 5MB is the video limit, not the image limit.
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
  /** Hard requirements — 0 means the platform publishes no minimum */
  minLongEdge: number;
  /**
   * Hard ceiling. Omitted when the platform publishes no maximum. Walmart, Temu,
   * TikTok Shop and eBay publish no upper bound, so inventing 5,000 px would fail
   * images those platforms accept.
   */
  maxLongEdge?: number;
  recommendedWidth: number;
  recommendedHeight: number;
  maxBytes: number;
  /**
   * True when the platform publishes the number as a caution rather than a rejection
   * rule. Etsy says images "larger than 1MB may not finish uploading" — advising, not
   * blocking — so exceeding it must warn, never fail.
   */
  bytesAdvisory?: boolean;
  /**
   * A size below which the platform still accepts the file but ranks or displays it
   * worse. Etsy's 635 px applies to the first photo and is not an upload minimum.
   */
  minLongEdgeAdvisory?: number;
  /**
   * Longest edge at which the platform's zoom viewer activates. Omitted where the
   * platform publishes none, so the audit stops quoting a 1,000 px rule that only
   * applies to Amazon.
   */
  zoomThreshold?: number;
  /** True when the background is guidance rather than a rejection rule (eBay). */
  backgroundAdvisory?: boolean;
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
      "Amazon holds the main image to a tighter standard than the rest of the gallery: pure white, product filling 85% of the frame, no text or props. Drop a photo in and this page reports each check, then exports a 2000×2000 square you can upload.",
    minLongEdge: 500,
    maxLongEdge: 10000,
    recommendedWidth: 2000,
    recommendedHeight: 2000,
    maxBytes: 10 * 1024 * 1024,
    zoomThreshold: 1000,
    acceptedFormats: ["JPEG", "PNG", "TIFF", "non-animated GIF"],
    background: "pure-white",
    fillRatioMin: 0.85,
    requirements: [
      "Longest side at least 500 px and at most 10,000 px; below 500 px the upload is refused outright.",
      "1,000 px turns on zoom and 1,600 px is the size Amazon calls optimal for it. This page exports 2,000 px so the square survives cropping.",
      "Pure white background, RGB 255 255 255 exactly — 245 grey can still trigger suppression.",
      "Amazon's wording is “show the product as 85% of the image”, listed as a main-image requirement, not a tip.",
      "No text, logos, borders, colour blocks, watermarks or props that are not sold with the item.",
      "One unit only unless the listing is a multipack; no mannequins, no packaging unless it is a feature.",
      "At least 72 dpi, 10 MB maximum, JPEG preferred over PNG or TIFF.",
    ],
    rejectionReasons: [
      "Background measures 250–253 instead of 255 after a levels adjustment.",
      "Product floats in too much white space, below the 85% fill requirement.",
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
    lastVerified: "2026-11-21",
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
    zoomThreshold: 1000,
    acceptedFormats: ["JPEG", "PNG", "TIFF", "non-animated GIF"],
    background: "any",
    requirements: [
      "Same technical limits as the main slot: 500–10,000 px on the longest side, 10 MB per file.",
      "1,600 px is the size Amazon calls optimal for zoom; 1,000 px is the minimum for zoom to work at all.",
      "Up to 9 images per listing. Amazon recommends six additional images plus one video.",
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
    lastVerified: "2026-11-21",
  },
  {
    slug: "etsy-listing-image",
    platform: "Etsy",
    surface: "First listing photo",
    h1: "Etsy listing image checker: 2000px, 1MB upload guidance",
    metaTitle: "Etsy Listing Image Checker — 2000px, 635px Floor & Formats",
    metaDescription:
      "Free Etsy photo checker. 2000px is the recommendation, 635px is only a search-ranking floor — neither blocks an upload. Check size, format and the 1MB upload guidance, then resize locally.",
    intro:
      "Etsy publishes fewer hard rules than the marketplaces it gets compared to. There is no upload minimum and no background rule; 635 px affects search placement and 1 MB affects upload reliability. This page reports which is which, then exports a 2000 px square.",
    minLongEdge: 0,
    recommendedWidth: 2000,
    recommendedHeight: 2000,
    maxBytes: 1024 * 1024,
    bytesAdvisory: true,
    minLongEdgeAdvisory: 635,
    acceptedFormats: ["JPEG", "PNG (no transparency)", "GIF", "SVG", "HEIC"],
    background: "any",
    requirements: [
      "Etsy recommends 2,000 px on both sides. It is a recommendation — the help page publishes no upload minimum.",
      "A first photo under 635 px still uploads, but Etsy shows the listing lower in search.",
      "Images over 1 MB “may not finish uploading, especially on a slower internet connection” — advice, not a cap.",
      "JPG, PNG, static GIF, SVG or HEIC only. Animated GIF and transparent PNG are not supported, and transparent areas render black.",
      "No background rule and no fixed ratio. The first photo should be landscape or square because it sets the shape of the rest.",
    ],
    rejectionReasons: [
      "Transparent PNG uploaded as the first photo, showing a checkered or dark grid.",
      "Product cropped out of frame by the 4:3 search crop.",
      "First photo below 635 px, which pushes the listing down in search results.",
      "Files far above 1MB, causing the uploader to time out on slow connections.",
    ],
    manualChecks: [
      "Whether the first photo reads clearly at thumbnail size on a phone.",
      "Whether the image looks like a stock photo — Etsy requires your own work.",
    ],
    source: {
      label: "Etsy Help — Requirements and best practices for images in your shop",
      url: "https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop",
    },
    lastVerified: "2026-11-21",
  },
  {
    slug: "ebay-photo",
    platform: "eBay",
    surface: "Listing photo",
    h1: "eBay photo checker: 1600px and under 12MB",
    metaTitle: "eBay Photo Size Checker — 1600px, 12MB & Zoom",
    metaDescription:
      "Check eBay listing photos: 500px minimum, 1600px recommended, 12MB limit, eight accepted formats. Neutral background preferred, not required. Resize locally in your browser.",
    intro:
      "eBay's 500 px floor is a floor, not a target — 1,600 px is what it recommends, and what buyers expect. Drop a photo in to check dimensions, weight and format, then export a clean square.",
    minLongEdge: 500,
    recommendedWidth: 1600,
    recommendedHeight: 1600,
    maxBytes: 12 * 1024 * 1024,
    background: "white-or-light",
    backgroundAdvisory: true,
    acceptedFormats: [
      "JPEG",
      "PNG",
      "GIF",
      "TIFF",
      "BMP",
      "WebP",
      "HEIC",
      "AVIF",
    ],
    requirements: [
      "Minimum 500 px on the longest side; eBay recommends about 1,600 × 1,600 px for mobile and zoomed viewing.",
      "Up to 12 MB per image and up to 24 photos per listing.",
      "JPEG, PNG, GIF, TIFF, BMP, WebP, HEIC or AVIF — a wider list than most marketplaces.",
      "An uncluttered, neutral background is recommended rather than enforced: white usually works best, but eBay says a darker backdrop can suit shiny items.",
      "No added text, artwork, borders or watermarks of any type — they can keep the photo out of third-party search.",
      "No catalogue or stock photo for an item listed as used.",
    ],
    rejectionReasons: [
      "Added text, artwork, borders or a watermark burned into the image.",
      "Using a catalogue stock photo for a used item.",
      "Image below 500 px on the longest side, which the uploader refuses.",
    ],
    manualChecks: [
      "Whether the photo shows the actual condition, flaws included.",
      "Whether all included accessories are visible in one of the photos.",
    ],
    source: {
      label: "eBay Help — Adding pictures to your listings",
      url: "https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148",
    },
    lastVerified: "2026-11-21",
  },
  {
    slug: "shopify-product-image",
    platform: "Shopify",
    surface: "Product image",
    h1: "Shopify product image checker: 2048×2048, under 20MB",
    metaTitle: "Shopify Product Image Checker — 2048×2048 & 20MB",
    metaDescription:
      "Shopify has no minimum size, which is exactly why catalogues end up inconsistent. Check dimensions, format and the 20MB ceiling, standardise on 2048×2048, and compress locally.",
    intro:
      "Shopify is the most permissive platform here — no minimum size, no background rule, a 20 MB ceiling. That freedom is why most catalogues look inconsistent. Pick 2048×2048 and keep every product on it.",
    minLongEdge: 0,
    maxLongEdge: 5000,
    recommendedWidth: 2048,
    recommendedHeight: 2048,
    maxBytes: 20 * 1024 * 1024,
    acceptedFormats: [
      "JPEG",
      "PNG",
      "TIFF",
      "BMP",
      "GIF",
      "SVG",
      "HEIC",
      "WebP",
    ],
    background: "any",
    requirements: [
      "No minimum size and no enforced background colour.",
      "Up to 5,000 × 5,000 px or 25 megapixels, and under 20 MB per file.",
      "PNG, JPEG, TIFF, BMP, GIF, SVG, HEIC or WebP; animated GIF and WebP work too.",
      "2,048 × 2,048 px usually displays best for square product images.",
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
      label: "Shopify Help — Product media types",
      url: "https://help.shopify.com/en/manual/products/product-media/product-media-types",
    },
    lastVerified: "2026-11-21",
  },
  {
    slug: "temu-product-image",
    platform: "Temu",
    surface: "Product image",
    h1: "Temu product image checker: 800×800 square, under 3MB",
    metaTitle: "Temu Product Image Checker — 800×800, 3MB, Square",
    metaDescription:
      "Check Temu listing images: 800×800 square, 3MB per file, JPEG or PNG. Clothing uses 3:4 at 1340×1785. Verify size, weight and format in your browser before the upload rejects it.",
    intro:
      "Temu splits its spec by surface: the carousel is 1:1 at 800 px for most categories, 3:4 at 1340 × 1785 for apparel, and 3 MB is the ceiling for both. Check yours before the upload rejects it.",
    minLongEdge: 800,
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    maxBytes: 3 * 1024 * 1024,
    acceptedFormats: ["JPEG", "JPG", "PNG"],
    background: "pure-white",
    requirements: [
      "Non-apparel carousel: 1:1 square, at least 800 × 800 px, 3 to 10 images per SKU.",
      "Apparel carousel: 3:4 portrait, at least 1340 × 1785 px — a separate spec, not a preference.",
      "Gallery images outside the carousel only need 480 px on each side, with a ratio of 1:3 or squarer.",
      "3 MB per file, JPEG/JPG/PNG — the tightest weight limit of the platforms on this site.",
      "White background comes from Temu's content review rules; its published file spec covers size, weight and format only.",
    ],
    rejectionReasons: [
      "Non-square image for a category that requires 1:1, or a square one where apparel expects 3:4.",
      "File above 3MB, which fails the upload silently in some seller flows.",
      "Background not clean enough to pass the content review that sits after the file checks.",
    ],
    manualChecks: [
      "Whether the category uses the standard square or the clothing 3:4 ratio.",
      "Whether the seller portal shows a newer limit for your category.",
    ],
    source: {
      label: "Temu Partner Platform — Product listing instructions (image spec table)",
      url: "https://partner-eu.temu.com/documentation?menu_code=85762c6ccc5a4dbc8c023ea5e10c6dc0&sub_menu_code=52762d939e124161927db394dcfb7531",
    },
    lastVerified: "2026-11-21",
  },
  {
    slug: "tiktok-shop-image",
    platform: "TikTok Shop",
    surface: "Product image",
    h1: "TikTok Shop image checker: 800×800 square, pure white",
    metaTitle: "TikTok Shop Image Checker — 600/800px, Pure White, 10MB",
    metaDescription:
      "Check TikTok Shop product images: 600px US / 800px UK minimum, 1:1 square, pure white main image, 10MB per image. The 5MB figure is the video cap, not photos. Resize locally.",
    intro:
      "TikTok Shop runs two published floors — 600 px in the US, 800 px in the UK — and the main image must be pure white in both. This page checks which rules your file meets, then exports a square.",
    minLongEdge: 600,
    recommendedWidth: 800,
    recommendedHeight: 800,
    maxBytes: 10 * 1024 * 1024,
    acceptedFormats: ["JPEG", "JPG", "PNG"],
    background: "pure-white",
    requirements: [
      "US listings accept 600 × 600 px; UK listing rules require 800 × 800 px on every image.",
      "Up to 9 square images, one nominated as the main image, which must show the front of the product.",
      "The main image must have a pure white background; the other eight may use scenes, close-ups and size comparisons.",
      "JPG, JPEG or PNG up to 10 MB per image. The 5 MB limit in the listing policy applies to the single listing video, not to photos.",
      "Images must be in colour — black-and-white is rejected — and no two may show the same angle.",
    ],
    rejectionReasons: [
      "Square requirement ignored, so the product is cropped in the feed.",
      "Added text, logos or promotional stickers burned into an image.",
      "Off-white background on the main image, or a black-and-white photo.",
    ],
    manualChecks: [
      "Which market the listing targets — the minimum differs between US and UK.",
      "Whether the product is centred for the feed's square crop.",
    ],
    source: {
      label: "TikTok Shop Seller Center — Product listing rules, §4.5 images and video",
      url: "https://seller.tiktokglobalshop.com/university/essay?knowledge_id=6837857193281282&default_language=zh-CN",
    },
    lastVerified: "2026-11-21",
  },
  {
    slug: "walmart-main-image",
    platform: "Walmart",
    surface: "Main image",
    h1: "Walmart main image checker: 2200×2200 pure white",
    metaTitle: "Walmart Main Image Checker — 2200×2200, Pure White, 5MB",
    metaDescription:
      "Check Walmart Marketplace main images: 2,200 × 2,200 px, 1,500 px for zoom, seamless white RGB 255, 5 MB, 1:1, JPEG/PNG/BMP. Audit and export in your browser.",
    intro:
      "Walmart is the strictest of the group on the main image: seamless white, product only, no promotional claims, and a 5 MB ceiling. This checker reports each rule and exports a square that fits.",
    minLongEdge: 0,
    recommendedWidth: 2200,
    recommendedHeight: 2200,
    maxBytes: 5 * 1024 * 1024,
    zoomThreshold: 1500,
    acceptedFormats: ["JPEG", "JPG", "PNG", "BMP"],
    background: "pure-white",
    requirements: [
      "Walmart's guide lists 2,200 × 2,200 px; zoom needs at least 1,500 × 1,500 px. No smaller upload floor is published.",
      "Seamless white background, RGB 255 255 255.",
      "1:1 square, product cropped close with no excessive background.",
      "JPEG, JPG, PNG or BMP at 8 bits per pixel — GIF is not accepted.",
      "5 MB or less per file.",
      "No watermarks, seller names, logos, promotional claims, or props not included with the item.",
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
      label: "Walmart Marketplace Learn — Product detail page: image guidelines & requirements",
      url: "https://marketplacelearn.walmart.com/guides/Item+setup/Item+content,+imagery,+and+media/Product-detail-page:-Image-guidelines-&-requirements",
    },
    lastVerified: "2026-11-21",
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
