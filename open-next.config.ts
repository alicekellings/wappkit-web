import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // 本站全部页面在构建期静态生成，没有时间型 ISR。
  // 该缓存从 env.ASSETS 的 cdn-cgi/_next_cache 读取预渲染页面，
  // 由静态资源层直接返回，不消耗 Worker CPU、不计请求费用。
  incrementalCache: () => staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
