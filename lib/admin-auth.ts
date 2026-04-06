import { cookies } from "next/headers";

import { getTrimmedEnv } from "@/lib/env-utils";

export const ADMIN_SESSION_COOKIE_NAME = "wappkit_admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export function getAdminAccessToken() {
  return getTrimmedEnv("INTERNAL_ADMIN_TOKEN");
}

export function isAdminTokenConfigured() {
  return Boolean(getAdminAccessToken());
}

export function isValidAdminToken(token: string) {
  const expectedToken = getAdminAccessToken();

  if (!expectedToken) {
    return false;
  }

  return token.trim() === expectedToken;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export function hasAdminRequestSession(cookieValue: string | undefined) {
  const expectedToken = getAdminAccessToken();

  if (!expectedToken || !cookieValue) {
    return false;
  }

  return cookieValue === expectedToken;
}

export function readAdminSessionCookie(cookieHeader: string) {
  if (!cookieHeader) {
    return undefined;
  }

  const segments = cookieHeader.split(";").map((segment) => segment.trim());

  for (const segment of segments) {
    const [name, ...valueParts] = segment.split("=");

    if (name === ADMIN_SESSION_COOKIE_NAME) {
      return valueParts.join("=") || undefined;
    }
  }

  return undefined;
}

export function isAdminRequestAuthenticated(request: Request) {
  return hasAdminRequestSession(
    readAdminSessionCookie(request.headers.get("cookie") ?? ""),
  );
}

export function hasAdminPageSession() {
  const expectedToken = getAdminAccessToken();
  const currentToken = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!expectedToken || !currentToken) {
    return false;
  }

  return currentToken === expectedToken;
}
