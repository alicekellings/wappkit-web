import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

/**
 * 导出 Ed25519 公钥，供桌面端内置（TOFU 之外的正式路径）。
 *
 * 为什么需要它
 * ------------
 * 桌面端 `utils/license_token.py` 的 `PINNED_PUBLIC_KEY_PEM` 必须填一个固定公钥，
 * 否则客户端不验签，任何人都能伪造 wlk1 令牌。但公钥只能从私钥推导，而私钥
 * 只应该待在 Vercel 环境变量里 —— 不该为了导出一串公钥就把私钥拉到本地。
 *
 * 所以让服务端自己算：这里只返回公钥，私钥不出进程。
 *
 * 安全性
 * ------
 * Ed25519 公钥本来就是设计成公开的（客户端要内置它），拿到公钥无法签发令牌。
 * 因此本端点不含敏感数据，但仍然：
 *   - 不回传私钥的任何片段，只回公钥 PEM 与一个短指纹；
 *   - 不缓存（no-store），避免环境变量轮换后 CDN 还吐旧值；
 *   - 私钥缺失或无法解析时只给出机器可读的状态，不回传异常详情。
 *
 * 用途：发布前把 `publicKeyPem` 粘到桌面端 `PINNED_PUBLIC_KEY_PEM`，
 * 并把 `fingerprint` 记进发布记录，方便日后核对线上私钥有没有被换过。
 */
export const dynamic = "force-dynamic";

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

export async function GET() {
  const rawPrivateKey =
    process.env.LICENSE_TOKEN_PRIVATE_KEY || env.LICENSE_TOKEN_PRIVATE_KEY;

  if (!rawPrivateKey) {
    return NextResponse.json(
      {
        configured: false,
        code: "LICENSE_SIGNING_UNAVAILABLE",
        message: "License signing is not configured on this deployment.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const privateKey = crypto.createPrivateKey({
      key: normalizePrivateKey(rawPrivateKey),
      format: "pem",
    });
    const publicKey = crypto.createPublicKey(privateKey);
    const publicKeyPem = publicKey
      .export({ type: "spki", format: "pem" })
      .toString();
    const der = publicKey.export({ type: "spki", format: "der" });
    const fingerprint = crypto
      .createHash("sha256")
      .update(der)
      .digest("hex")
      .slice(0, 16);

    return NextResponse.json(
      {
        configured: true,
        algorithm: publicKey.asymmetricKeyType ?? "unknown",
        fingerprint,
        publicKeyPem,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // 私钥存在但解析不了（多半是换行被写成字面 \n 或粘错了）。只说状态，不透露内容。
    return NextResponse.json(
      {
        configured: false,
        code: "LICENSE_SIGNING_KEY_UNREADABLE",
        message: "License signing key is present but could not be parsed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
