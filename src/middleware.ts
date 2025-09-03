import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Redirect apex and www to the canonical host.
// Excludes health checks and static asset paths.
export function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.toLowerCase();
  if (!host) return NextResponse.next();

  const url = new URL(req.url);

  // 1) Enforce HTTPS based on original client protocol
  //    GCLB sets x-forwarded-proto to the client scheme
  const xfProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  if (xfProto && xfProto !== 'https') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  // 2) Enforce canonical host
  if (host === 'hugecat.net' || host === 'www.hugecat.net') {
    url.hostname = 'portfolio.hugecat.net';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

// Apply middleware to all paths except health checks and static assets
export const config = {
  matcher: [
    '/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
