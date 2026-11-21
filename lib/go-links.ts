import { tools, type Tool } from "@/lib/tools";

/**
 * /go/<slug> 的解析规则。
 *
 * 微软商店不告诉我们浏览量从哪来：Partner Center 的 Acquisitions 只有
 * "All" 一行，没有任何来源细分。所以每一条站外链接都必须先落到
 * /go/<工具>-<渠道>，再由这一层把 slug 拆成"哪个产品 + 哪条渠道"，
 * 这样商店点击才有归因。
 *
 * slug 形如：
 *   filededupe-yt01   工具 filededupe，渠道 yt01
 *   renamer-directory 工具 renamer，渠道 directory
 *   snapgrid          工具 snapgrid，渠道 direct（兜底）
 *
 * 工具 slug 自己可能带连字符（ai-ecom-visual-studio），所以按"最长前缀"
 * 匹配，而不是按第一个连字符切。
 */

const STORE_HOST = "apps.microsoft.com";

function isStoreListing(href: string) {
  try {
    return new URL(href).hostname === STORE_HOST;
  } catch {
    return false;
  }
}

/** 只挑真正在微软商店上架、且下载地址指向商店的产品。 */
export function getStoreTools(): Tool[] {
  return tools.filter(
    (tool) => tool.status === "live" && isStoreListing(tool.downloadHref),
  );
}

export type GoTarget = {
  tool: Tool;
  toolSlug: string;
  /** 渠道标记，缺省为 direct。会原样写进 Upstash 的 source 字段。 */
  channel: string;
  storeHref: string;
  /** 落地页上的按钮地址，带上渠道参数，避免解析歧义。 */
  outHref: string;
};

export function resolveGoSlug(rawSlug: string): GoTarget | null {
  const slug = rawSlug.trim().toLowerCase();

  if (!slug) {
    return null;
  }

  const match = getStoreTools()
    .filter((tool) => slug === tool.slug || slug.startsWith(`${tool.slug}-`))
    // 最长优先：ai-ecom-visual-studio 必须先于任何短前缀被匹配到
    .sort((a, b) => b.slug.length - a.slug.length)[0];

  if (!match) {
    return null;
  }

  const channel =
    slug.slice(match.slug.length).replace(/^-+/, "").slice(0, 48) || "direct";

  return {
    tool: match,
    toolSlug: match.slug,
    channel,
    storeHref: match.downloadHref,
    outHref: `/go/${slug}/out?src=${encodeURIComponent(channel)}`,
  };
}
