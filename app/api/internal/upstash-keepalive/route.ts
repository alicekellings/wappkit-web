import { NextRequest, NextResponse } from "next/server";

import { getTrimmedEnv } from "@/lib/env-utils";
import { getSafeUrlOrigin, serializeError } from "@/lib/error-utils";

const KEEPALIVE_KEY = "system:upstash:keepalive:last_run";
const KEEPALIVE_TTL_SECONDS = 60 * 60 * 24 * 45;

function readCronSecret() {
  return getTrimmedEnv("CRON_SECRET");
}

function isAuthorizedCronRequest(request: NextRequest) {
  const cronSecret = readCronSecret();
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || !authHeader) {
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!readCronSecret()) {
    console.error("Upstash keepalive is missing CRON_SECRET.");

    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 500 },
    );
  }

  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = getTrimmedEnv("UPSTASH_REDIS_REST_URL");
  const token = getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!url || !token) {
    console.error("Upstash keepalive is missing Redis REST credentials.", {
      hasUrl: Boolean(url),
      hasToken: Boolean(token),
    });

    return NextResponse.json(
      { error: "Upstash Redis REST credentials are not configured." },
      { status: 500 },
    );
  }

  const executedAt = new Date().toISOString();
  const payload = JSON.stringify({
    executedAt,
    source: "vercel-cron",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "SET",
        KEEPALIVE_KEY,
        payload,
        "EX",
        String(KEEPALIVE_TTL_SECONDS),
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      const responseText = await response.text();

      console.error("Upstash keepalive returned non-ok response.", {
        upstashOrigin: getSafeUrlOrigin(url),
        status: response.status,
        responseText,
      });

      return NextResponse.json(
        { error: "Upstash keepalive request failed." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as { result?: string; error?: string };

    if (result.error) {
      console.error("Upstash keepalive returned command error.", {
        upstashOrigin: getSafeUrlOrigin(url),
        payloadError: result.error,
      });

      return NextResponse.json(
        { error: "Upstash keepalive command failed." },
        { status: 502 },
      );
    }

    console.info("Upstash keepalive succeeded.", {
      keepaliveKey: KEEPALIVE_KEY,
      executedAt,
      upstashOrigin: getSafeUrlOrigin(url),
      result: result.result ?? null,
    });

    return NextResponse.json({
      ok: true,
      keepaliveKey: KEEPALIVE_KEY,
      executedAt,
      upstashOrigin: getSafeUrlOrigin(url),
    });
  } catch (error) {
    console.error("Upstash keepalive failed before response.", {
      keepaliveKey: KEEPALIVE_KEY,
      executedAt,
      upstashOrigin: getSafeUrlOrigin(url),
      error: serializeError(error),
    });

    return NextResponse.json(
      { error: "Upstash keepalive request threw before completion." },
      { status: 502 },
    );
  }
}
