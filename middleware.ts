import { NextRequest, NextResponse } from "next/server";

import { getRequestCountry, shouldBlockCountry } from "@/lib/geo-block";

export function middleware(request: NextRequest) {
  const country = getRequestCountry(request.headers);

  if (!shouldBlockCountry(country)) {
    return NextResponse.next();
  }

  return new NextResponse("Access unavailable from this region.", {
    status: 403,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image.jpg|robots.txt|sitemap.xml|site.webmanifest).*)",
  ],
};
