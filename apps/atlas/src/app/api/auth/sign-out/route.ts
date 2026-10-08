import { COOKIE_NAME } from '@repo/constants';
import { dbSessionSignOut } from '@repo/handlers';
import { SessionCookie } from '@repo/types';
import { jwtOps } from '@repo/utils';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Signed Out. Redirecting...',
    });

    // update session in db to signed out
    const sessionCookie = request.cookies.get(COOKIE_NAME.AUTH.SESSION)?.value || null;
    if (sessionCookie) {
      const jwt = await jwtOps();
      const session = await jwt.unsign<SessionCookie>(sessionCookie);
      if (session) await dbSessionSignOut(session.id);
    }

    // delete auth session cookie
    response.cookies.delete(COOKIE_NAME.AUTH.SESSION);
    response.cookies.delete(COOKIE_NAME.AUTH.LAST_DB_SESSION_QUERY);

    return response;
  } catch (error) {
    console.error('---> route handler error (sign out):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
