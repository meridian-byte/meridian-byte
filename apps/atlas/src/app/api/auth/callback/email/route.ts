import { NextResponse, NextRequest } from 'next/server';
import { COOKIE_NAME, SECONDS_MINUTE, SECONDS_WEEK } from '@repo/constants';
import { AUTH_URLS } from '@repo/constants';
import { getCookieServer, isProduction, jwtOps } from '@repo/utils';
import { SessionCookie, SignIn } from '@repo/types';
import { handlePostAuth } from '@repo/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const loginCookie: SessionCookie | null = await getCookieServer(COOKIE_NAME.AUTH.LOGIN);
    if (!loginCookie) throw new Error('Missing client login cookie.');
    if (!loginCookie.otp) throw new Error('Missing stored otp.');

    const { values, appData }: SignIn = await request.json();

    type OtpPayload = { otpValue: string };
    let payload: OtpPayload | null;

    try {
      const jwt = await jwtOps();
      const unsignPayload = await jwt.unsign<OtpPayload>(loginCookie.otp);

      if (!unsignPayload) {
        throw new Error('OTP invalid or expired. Request another OTP.');
      } else {
        payload = unsignPayload;
      }
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

    if (values.otp != payload.otpValue) {
      return NextResponse.json(
        { error: "OTP doesn't match. Try entering it again." },
        { status: 200 },
      );
    }

    // all well. proceed with auth

    const { searchParams } = new URL(request.url);
    const baseUrl = searchParams.get('baseUrl');
    if (!baseUrl) throw new Error('Base url is required.');
    const redirectUrl = searchParams.get('redirectUrl');

    const { authCookieValue, defaultWorkspaceId } = await handlePostAuth(
      values,
      loginCookie,
      appData?.workspaces,
    );

    // Ensure absolute URL construction
    const redirectPath = redirectUrl || AUTH_URLS.REDIRECT.DEFAULT;
    const targetUrl = new URL(redirectPath, baseUrl);

    const response = NextResponse.json({
      message: 'OTP verified. Redirecting...',
      redirectUrl: targetUrl.toString(),
    });

    // Delete email cookie
    response.cookies.delete({
      name: COOKIE_NAME.AUTH.EMAIL,
      path: '/',
    });

    // Delete login cookie
    response.cookies.delete({
      name: COOKIE_NAME.AUTH.LOGIN,
      path: '/',
    });

    // Set default workspace id
    response.cookies.set(COOKIE_NAME.DEFAULT_WORKSPACE, defaultWorkspaceId, {
      maxAge: SECONDS_MINUTE * 5,
      path: '/',
      httpOnly: false, // needed in the client for initial sync
      secure: isProduction(),
      sameSite: 'lax',
    });

    // Set auth session cookie
    response.cookies.set(COOKIE_NAME.AUTH.SESSION, authCookieValue, {
      maxAge: SECONDS_WEEK,
      path: '/',
      httpOnly: true,
      secure: isProduction(),
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('---> route handler error (email auth callback):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
