import crypto from "node:crypto";

import { env } from "@/env.mjs";

const TOKEN_PREFIX = "wlk1";

// 令牌有效期 7 天，与桌面端 auth_manager.py 的 OFFLINE_GRACE_PERIOD 对齐。
// 原来只有 24 小时 —— 付费用户断网一天就会被降级回 Free。
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// 每个桌面工具各自的功能标识，必须与「该工具桌面端的权限清单」对齐。
// ⚠️ wappkit-web 是**多工具共用**的站点：ai-ecom-visual-studio 与 reddit-toolbox
// 都走同一个 createLicenseToken（见 app/api/license/validate/route.ts）。所以这里
// **绝不能写死某一个工具的名字** —— 早先就写死了图片工具的名单，导致
// Reddit Toolbox 拿到的功能名一个都对不上，付费却解锁不了 Pro 功能。
const TOOL_FEATURES: Record<string, string[]> = {
  // 覆盖 reddit_app/utils/permissions.py 的 FEATURE_NAMES（6 个），
  // 另含 ai_analysis / csv_export —— 这两个也是桌面端 Pro 才开放的能力，
  // 多给不产生影响（客户端只读自己认识的键），但便于以后直接启用。
  "reddit-toolbox": [
    "search_subreddits",
    "scrape_posts",
    "scrape_users",
    "subreddit_analysis",
    "post_analysis",
    "user_analysis",
    "ai_analysis",
    "csv_export",
  ],
  // 图片工具（AI E-commerce Visual Studio）—— 保持原有取值不变
  "ai-ecom-visual-studio": [
    "batch",
    "background_replace",
    "multi_size_export",
    "jpeg_export",
    "enhance",
    "smart_optimize",
  ],
};

// 与 lib/validations/license.ts 里 toolSlug 的默认值保持一致（空值时落这里）
const DEFAULT_TOOL_SLUG = "ai-ecom-visual-studio";

function featuresForTool(toolSlug: string): string[] {
  return TOOL_FEATURES[toolSlug] ?? TOOL_FEATURES[DEFAULT_TOOL_SLUG];
}

export type LicenseTokenPayload = {
  iss: "wappkit";
  aud: "desktop-license";
  toolSlug: string;
  tier: "premium";
  features: string[];
  licenseKeySha256: string;
  orderId: string;
  productName: string;
  deviceId: string;
  iat: number;
  nbf: number;
  exp: number;
};

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

function getPrivateKey() {
  return process.env.LICENSE_TOKEN_PRIVATE_KEY || env.LICENSE_TOKEN_PRIVATE_KEY;
}

export function hashLicenseKey(licenseKey: string) {
  return crypto
    .createHash("sha256")
    .update(licenseKey.trim().toUpperCase(), "utf8")
    .digest("hex");
}

export function createLicenseToken(input: {
  licenseKey: string;
  toolSlug: string;
  orderId: string;
  productName: string;
  deviceId: string;
}) {
  const rawPrivateKey = getPrivateKey();

  if (!rawPrivateKey) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Math.floor((Date.now() + TOKEN_TTL_MS) / 1000);
  const payload: LicenseTokenPayload = {
    iss: "wappkit",
    aud: "desktop-license",
    toolSlug: input.toolSlug,
    tier: "premium",
    // 按 toolSlug 取该工具的功能清单；查不到时回落到默认工具，
    // 绝不把 A 工具的功能名发给 B 工具。
    features: featuresForTool(input.toolSlug),
    licenseKeySha256: hashLicenseKey(input.licenseKey),
    orderId: input.orderId,
    productName: input.productName,
    deviceId: input.deviceId,
    iat: now,
    nbf: now - 60,
    exp: expiresAt,
  };

  const encodedPayload = base64Url(JSON.stringify(payload));
  const privateKey = crypto.createPrivateKey({
    key: normalizePrivateKey(rawPrivateKey),
    format: "pem",
  });
  const signature = crypto.sign(null, Buffer.from(encodedPayload), privateKey);

  return {
    token: `${TOKEN_PREFIX}.${encodedPayload}.${base64Url(signature)}`,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
    features: payload.features,
  };
}
