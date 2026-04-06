import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
  isAdminTokenConfigured,
  isValidAdminToken,
} from "@/lib/admin-auth";
import { adminSessionSchema } from "@/lib/validations/license";

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
          error instanceof Error
            ? error.message
            : "Failed to start the admin session.",
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
