import { NextRequest, NextResponse } from 'next/server';
import { getEmailLocalPart, isProduction, segmentFullName } from '@repo/utils';
import { AUTH_URLS, COOKIE_NAME, SECONDS_WEEK } from '@repo/constants';
import {
  exchangeCodeForTokens,
  getGoogleUserProfile,
  handlePostAuth,
  OAUTH_CALLBACK_PATH,
} from '@repo/auth';
import { SessionCookie, WorkspaceGet } from '@repo/types';

export const dynamic = 'force-dynamic';

function getSafeRedirectUrl(nextParam: string | null, fallback: string, baseUrl: string): URL {
  if (nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')) {
    return new URL(nextParam, baseUrl);
  }
  return new URL(fallback, baseUrl);
}

export async function GET(request: NextRequest) {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const currentBaseUrl = `${protocol}://${host}`;

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');

    const storedState = request.cookies.get('oauth_state')?.value;
    const codeVerifier = request.cookies.get('oauth_code_verifier')?.value;

    if (!code || !stateParam || !storedState || !codeVerifier) {
      return NextResponse.json({ error: 'Missing OAuth parameters or cookies' }, { status: 400 });
    }

    // Unpack state payload safely
    let parsedState: { csrfToken: string; next?: string; baseUrl?: string };

    try {
      parsedState = JSON.parse(stateParam);
    } catch {
      return NextResponse.json({ error: 'Malformed state parameter' }, { status: 400 });
    }

    // 1. Verify CSRF Token
    if (parsedState.csrfToken !== storedState) {
      return NextResponse.json(
        { error: 'Invalid OAuth state (CSRF match failed)' },
        { status: 400 },
      );
    }

    // Use state.baseUrl if available, otherwise fall back to host header
    const effectiveBaseUrl = parsedState.baseUrl || currentBaseUrl;
    const redirectUri = `${effectiveBaseUrl.replace(/\/$/, '')}${OAUTH_CALLBACK_PATH}`;

    // 2. Token exchange
    const tokens = await exchangeCodeForTokens(code, codeVerifier, redirectUri);

    // 3. Retrieve user profile
    const userProfile = await getGoogleUserProfile(tokens.access_token);

    const loginCookieVal = request.cookies.get(COOKIE_NAME.AUTH.LOGIN)?.value;
    if (!loginCookieVal) throw new Error('Missing client login session.');
    const sessionData = JSON.parse(loginCookieVal) as SessionCookie;

    const workspacesCookieVal = request.cookies.get(COOKIE_NAME.APP_DATA.WORKSPACES)?.value;
    const workspacesData = workspacesCookieVal
      ? (JSON.parse(workspacesCookieVal) as WorkspaceGet[])
      : [];

    const nameSegment = segmentFullName(userProfile.name);

    const { authCookieValue } = await handlePostAuth(
      { email: userProfile.email },
      {
        ...sessionData,
        accounts: [{ ...sessionData.accounts[0], email: userProfile.email }],
        profile: {
          ...sessionData.profile,
          userName: getEmailLocalPart(userProfile.email),
          firstName: nameSegment.first,
          lastName: nameSegment.last,
          avatar: userProfile.picture,
        },
      },
      workspacesData,
    );

    // Prevent Open Redirect: sanitize `next` path from state payload
    const redirectTarget = getSafeRedirectUrl(
      parsedState.next || null,
      AUTH_URLS.REDIRECT.DEFAULT,
      effectiveBaseUrl,
    );
    const response = NextResponse.redirect(redirectTarget);

    // Clean up OAuth cookies
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_code_verifier');
    response.cookies.delete(COOKIE_NAME.AUTH.LOGIN);
    response.cookies.delete(COOKIE_NAME.APP_DATA.WORKSPACES);

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
    return NextResponse.redirect(
      new URL(
        `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
        currentBaseUrl,
      ),
    );
  }
}
