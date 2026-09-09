import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@repo/cloudbase';
import { getColorScheme, setCorsHeaders } from '@repo/utils';
import { BASE_URL } from '@repo/constants';

export async function proxy(request: NextRequest) {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 200 });
    setCorsHeaders({ request, response });
    return response;
  }

  let response = NextResponse.next({ request });

  // Set CORS headers for the response
  setCorsHeaders({ request, response });

  // Update the session in the response
  response = await updateSession(request, response, BASE_URL.ATLAS);

  response = getColorScheme(request, response);

  // Disable SEO/indexing globally for all responses passing through middleware
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  return response;
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
