import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const domain = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Detect if this is master admin domain
  const isMasterDomain = domain.includes('master') || domain.includes('localhost:3001');

  // Create response
  const response = NextResponse.next();

  // Set custom headers for app detection
  response.headers.set('x-domain', domain);
  response.headers.set('x-is-master', isMasterDomain ? 'true' : 'false');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
