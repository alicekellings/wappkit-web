/**
 * 根域与 studio 子域的 301 跳转。
 *
 * 为什么不放在 Pages 项目里：Pages 的 _routes.json 只让少数路径进函数，
 * 主站靠「静态资源直出」才不消耗函数额度。若把 /* 也纳入，全站静态页都会走函数。
 * 所以单独用一个只做跳转的 Worker，挂在根域和 studio 上，与主站互不影响。
 */

const APEX = "wappkit.com";
const STUDIO = "studio.wappkit.com";
const CANONICAL = "https://www.wappkit.com";

export default {
  fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;

    if (host === STUDIO) {
      return Response.redirect(`${CANONICAL}/studio${url.search}`, 301);
    }

    if (host === APEX) {
      return Response.redirect(`${CANONICAL}${url.pathname}${url.search}`, 301);
    }

    return Response.redirect(`${CANONICAL}${url.pathname}${url.search}`, 301);
  },
};