#!/usr/bin/env node
/**
 * 纯静态导出构建（供 Cloudflare Pages 直传）。
 *
 * 本站不是纯静态站：/api、/ops、/go、checkout 成功页都要服务端运行。这些
 * 路由在导出模式下无法编译，所以构建前临时移出仓库，构建后原样放回。
 * 它们由韩国服务器上的 Next 实例承接，Cloudflare 只负责静态页。
 *
 * 产出：
 *   out/            —— 纯静态站点（wrangler pages deploy out）
 *   out/_redirects  —— 91 条 301（导出模式不支持 next.config redirects）
 *   out/_headers    —— 平台没给的两个安全头
 *   out/_worker.js  —— 只反代服务端路径，其余交给静态资源
 *   out/_routes.json—— 限定 _worker.js 的生效范围，保住静态免费额度
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const stash = join(root, ".export-stash");
const outDir = join(root, "out");

// 站点绝对地址。缺失会让 canonical 和 sitemap 全部指向 localhost:3000，
// 静态站一旦上线就是大面积无效 canonical，必须先于构建拦住。
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;
if (!SITE_URL || !/^https:\/\//.test(SITE_URL)) {
  console.error(
    "[export] NEXT_PUBLIC_APP_URL must be set to the production https URL,\n" +
      "         otherwise canonical and sitemap URLs point at localhost.",
  );
  process.exit(1);
}
console.log(`[export] site url: ${SITE_URL}`);

// 这些路径需要 Node 运行时，不进入静态导出。
const SERVER_SIDE = [
  "app/api",
  "app/ops",
  "app/go",
  "app/(studio)/studio/api",
  "middleware.ts",
  // 支付成功页要验签、调 Creem、把许可证写进 Upstash，只能在服务端跑。
  "app/(marketing)/checkout/success",
];

const stashPath = (rel) => join(stash, rel);

function moveOut() {
  rmSync(stash, { recursive: true, force: true });
  for (const rel of SERVER_SIDE) {
    const src = join(root, rel);
    if (!existsSync(src)) {
      console.log(`[export] absent, skipped: ${rel}`);
      continue;
    }
    const dst = stashPath(rel);
    mkdirSync(dirname(dst), { recursive: true });
    renameSync(src, dst);
    console.log(`[export] moved out: ${rel}`);
  }
}

function moveBack() {
  for (const rel of SERVER_SIDE) {
    const src = stashPath(rel);
    if (!existsSync(src)) continue;
    const dst = join(root, rel);
    mkdirSync(dirname(dst), { recursive: true });
    renameSync(src, dst);
    console.log(`[export] restored: ${rel}`);
  }
  rmSync(stash, { recursive: true, force: true });
}

function writeRedirects() {
  const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  const rules = [
    ["/reddit-toolbox", "/tools/reddit-toolbox"],
    ...vercel.redirects.map((r) => [r.source, r.destination]),
  ];
  const body = rules.map(([from, to]) => `${from} ${to} 301`).join("\n");
  writeFileSync(join(outDir, "_redirects"), `${body}\n`, "utf8");
  console.log(`[export] _redirects written: ${rules.length} rules`);
}

function writeHeaders() {
  // 平台默认已带 x-content-type-options / referrer-policy，这里只补缺的两个。
  const body = [
    "/*",
    "  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
    "",
  ].join("\n");
  writeFileSync(join(outDir, "_headers"), body, "utf8");
  console.log("[export] _headers written");
}

// 把 Pages 高级模式的反代 Worker 与路由白名单放进产物。
// _routes.json 让静态页不经过函数，保留「静态请求免费」的额度优势。
function copyPagesFunctions() {
  const from = join(root, "deploy", "pages");
  for (const name of ["_worker.js", "_routes.json"]) {
    const source = join(from, name);
    if (!existsSync(source)) {
      console.error(`[export] missing function file: ${source}`);
      process.exit(1);
    }
    copyFileSync(source, join(outDir, name));
  }
  console.log("[export] _worker.js + _routes.json copied");
}

moveOut();
let failed = false;
try {
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, WAPPKIT_STATIC_EXPORT: "1" },
  });
} catch (error) {
  failed = true;
  console.error("[export] build failed");
  if (error?.status) console.error(`[export] exit code: ${error.status}`);
} finally {
  moveBack();
}

if (failed) {
  console.error("[export] source tree restored; no static output produced");
  process.exit(1);
}

if (!existsSync(outDir)) {
  console.error("[export] build succeeded but out/ is missing");
  process.exit(1);
}

writeRedirects();
writeHeaders();
copyPagesFunctions();
console.log("[export] done: out/ ready for Cloudflare Pages");