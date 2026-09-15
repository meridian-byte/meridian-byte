import { NextRequest, NextResponse } from 'next/server';
import { getColorScheme, setCorsHeaders } from '@repo/utils';

export async function proxy(request: NextRequest) {
  // Handle OPTIONS preflight immediately
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders({ request, response });
    return response;
  }

  // Generate standard downstream response
  const response = NextResponse.next();

  // Apply CORS headers directly
  setCorsHeaders({ request, response });

  // Handle other middleware checks
  const modifiedResponse = getColorScheme(request, response);

  // Disable SEO/indexing globally for all responses passing through middleware
  modifiedResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');

  return modifiedResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};
