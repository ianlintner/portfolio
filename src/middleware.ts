import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirect apex and www to the canonical host.
// Excludes health checks and static asset paths.
export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase();
  if (!host) return NextResponse.next();

  return NextResponse.next();
}

// Apply middleware to all paths except health checks and static assets
export const config = {
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
