import { NextRequest, NextResponse } from "next/server";

import { serializeError } from "@/lib/error-utils";

import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
  isAdminTokenConfigured,
  isValidAdminToken,
} from "@/lib/admin-auth";
import { getRequestIpFromHeaders } from "@/lib/creem";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { adminSessionSchema } from "@/lib/validations/license";

// /ops 与 /api/admin/* 不再被地区拦截，靠的就是这道登录。
// 所以这里必须自己限流：否则等于把一个纯口令校验接口摆到公网任人爆破。
const ADMIN_LOGIN_RATE_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };

export async function POST(request: NextRequest) {
  if (!isAdminTokenConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Admin access is not configured yet. Add INTERNAL_ADMIN_TOKEN before using this page.",
      },
      { status: 503 },
    );
  }

  try {
    const rateLimit = await applyRateLimit({
      key: buildRateLimitKey(
        "admin-session",
        getRequestIpFromHeaders(request.headers),
      ),
      limit: ADMIN_LOGIN_RATE_LIMIT.limit,
      windowMs: ADMIN_LOGIN_RATE_LIMIT.windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please try again in 15 minutes.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = adminSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter the internal admin access token." },
        { status: 400 },
      );
    }

    if (!isValidAdminToken(parsed.data.token)) {
      return NextResponse.json(
        { success: false, message: "The admin access token is not correct." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin session started.",
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      parsed.data.token.trim(),
      getAdminSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to start the admin session. Check the server logs for details.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session closed.",
  });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
