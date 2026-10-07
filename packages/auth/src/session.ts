'use server';

import { COOKIE_NAME, SECONDS_WEEK } from '@repo/constants';
import { SessionCookie } from '@repo/types';
import { getCookieServer, isProduction, jwtOps, setCookieServer } from '@repo/utils';

export const getSession = async (): Promise<SessionCookie | null> => {
  const sessionCookie = await getCookieServer(COOKIE_NAME.AUTH.SESSION);
  if (!sessionCookie) return null;

  try {
    const jwt = await jwtOps();
    const sessionPayload = await jwt.unsign<SessionCookie>(sessionCookie);

    // Verify session existance and expiration
    if (!sessionPayload || new Date() > new Date(sessionPayload.expiresAt)) {
      return null;
    }

    return sessionPayload;
  } catch (error) {
    // Catches ERR_JWT_EXPIRED, signature mismatches, or malformed cookies
    return null;
  }
};

export const setSession = async (currentSession?: SessionCookie): Promise<void> => {
  if (!currentSession) return;

  const jwt = await jwtOps();

  const { signature } = await jwt.sign(currentSession);

  await setCookieServer(COOKIE_NAME.AUTH.SESSION, signature, {
    expiryInSeconds: SECONDS_WEEK,
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
  });
};
