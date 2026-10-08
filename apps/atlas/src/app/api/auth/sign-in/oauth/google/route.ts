import { NextRequest, NextResponse } from 'next/server';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  getGoogleAuthUrl,
  handlePreAuth,
  OAUTH_CALLBACK_PATH,
} from '@repo/auth';
import { isProduction } from '@repo/utils';
import { SignIn } from '@repo/types';
import { AUTH_URLS, COOKIE_NAME, SECONDS_HOUR } from '@repo/constants';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const baseUrl = searchParams.get('baseUrl') || '';
  const next = searchParams.get('next') || AUTH_URLS.REDIRECT.DEFAULT;

  try {
    const { values, appData }: SignIn = await request.json();

    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    const rawState = generateState();

    // Construct redirect URL dynamically
    const redirectUri = `${baseUrl.replace(/\/$/, '')}${OAUTH_CALLBACK_PATH}`;

    // Pack security token AND custom parameters into the state JSON object
    const statePayload = JSON.stringify({
      csrfToken: rawState,
      baseUrl,
      next,
    });

    const redirectUrl = getGoogleAuthUrl(challenge, statePayload, redirectUri);

    // Single response object instance
    const response = NextResponse.json({ redirectUrl });

    // Handle pre-auth mutations directly on the main response
    await handlePreAuth(response, values);

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction(),
      sameSite: 'lax' as const,
      maxAge: 60 * 5, // 5 minutes
      path: '/',
    };

    // Store individual state verification tokens
    response.cookies.set('oauth_code_verifier', verifier, cookieOptions);
    response.cookies.set('oauth_state', rawState, cookieOptions);

    // Store workspace payload
    response.cookies.set(
      COOKIE_NAME.APP_DATA.WORKSPACES,
      JSON.stringify(appData?.workspaces || []),
      cookieOptions,
    );

    return response;
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
        baseUrl,
      ),
    );
  }
}
