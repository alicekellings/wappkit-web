/**
 * Cloudflare Pages 高级模式 Worker。
 *
 * 职责只有一个：把需要服务端运行的路径反代到韩国服务器上的 Next 实例；
 * 其余请求直接交给静态资源层（免费、不计函数调用）。
 *
 * 配合同目录的 _routes.json 使用 —— 只有 include 里列出的路径才会触发本
 * Worker，静态页不会进入函数额度。
 */

const ORIGIN = "https://api.wappkit.com/site";

// 必须在 _routes.json 中同步声明的路径。
const ORIGIN_PATHS = ["/api/", "/go/", "/ops", "/checkout/success"];

function needsOrigin(pathname) {
  return ORIGIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`),
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!needsOrigin(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const target = new URL(ORIGIN + url.pathname + url.search);

    const headers = new Headers(request.headers);
    // Host 由 fetch 目标决定；转发原值会让源站认错虚拟主机。
    headers.delete("host");
    // 让源站知道真实协议与原始主机，避免生成 http:// 或错误绝对地址。
    headers.set("x-forwarded-proto", "https");
    headers.set("x-forwarded-host", url.host);

    const init = { method: request.method, headers, redirect: "manual" };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    const upstream = await fetch(target, init);

    // 源站 5xx 时给一个可诊断的响应，而不是把裸错误页透给用户。
    if (upstream.status >= 500) {
      return new Response("Upstream temporarily unavailable.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8", "retry-after": "60" },
      });
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: upstream.headers,
    });
  },
};