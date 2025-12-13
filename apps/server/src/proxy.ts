import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './libraries/supabase/middleware';
import { setCorsHeaders } from '@repo/utilities/middeware';
import { crossOrigins } from '@repo/constants/hosts';

export async function proxy(request: NextRequest) {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 200 });
    setCorsHeaders({ crossOrigins, request, response });
    return response;
  }

  let response = NextResponse.next({ request });

  // Set CORS headers for the response
  setCorsHeaders({ crossOrigins, request, response });

  // Update the session in the response
  response = await updateSession(request, response);

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
