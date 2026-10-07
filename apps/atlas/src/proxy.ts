import { NextRequest, NextResponse } from 'next/server';
import { getColorScheme, setCorsHeaders } from '@repo/utils';
import { updateSession, validateRouteAccess } from '@repo/auth';

export async function proxy(request: NextRequest) {
  // handle preflight
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 200 });
    setCorsHeaders({ request, response });
    return response;
  }

  let response = NextResponse.next({ request });

  // handle CORS
  setCorsHeaders({ request, response });

  // check auth status & handle route protection
  const redirect = await validateRouteAccess(request);
  // if route doesn't match auth status, stop here and redirect
  if (redirect) return redirect;

  // check session & handle rolling update
  response = await updateSession(request);

  /**
   * place other logic below this section
   * (ie. only after preflight, CORS, route protection, and auth session are handled)
   */

  // handle global color scheme
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
