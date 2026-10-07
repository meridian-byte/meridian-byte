import { COOKIE_NAME } from '@repo/constants';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Signed Out. Redirecting...',
    });

    // delete auth session cookie
    response.cookies.delete(COOKIE_NAME.AUTH.SESSION);
    response.cookies.delete(COOKIE_NAME.AUTH.LAST_DB_SESSION_QUERY);

    return response;
  } catch (error) {
    console.error('---> route handler error (sign out):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
