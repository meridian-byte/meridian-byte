import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@repo/libraries/supabase/middleware';
import { setCorsHeaders } from '@repo/utilities/middeware';
import { CROSS_ORIGINS } from '@repo/constants/hosts';
import { BASE_URL_CLIENT } from '@repo/constants/paths';

export async function proxy(request: NextRequest) {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 200 });
    setCorsHeaders({ crossOrigins: CROSS_ORIGINS, request, response });
    return response;
  }

  let response = NextResponse.next({ request });

  // Set CORS headers for the response
  setCorsHeaders({ crossOrigins: CROSS_ORIGINS, request, response });

  // Update the session in the response
  response = await updateSession(request, response, BASE_URL_CLIENT.NOTELINE);

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
