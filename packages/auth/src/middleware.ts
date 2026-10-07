'use server';

import { COOKIE_NAME, SECONDS_MINUTE, SECONDS_WEEK } from '@repo/constants';
import { db } from '@repo/db';
import { SessionCookie, SessionGet } from '@repo/types';
import { getCookieServer, isProduction, setCookieServer } from '@repo/utils';
import { checkSession } from './shared';
import { NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest): Promise<NextResponse> => {
  // Start with a standard passing response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const withPathname = request.nextUrl.pathname && !request.nextUrl.pathname.includes('undefined');
  if (!withPathname) return response;

  const sessionCookie = request.cookies.get(COOKIE_NAME.AUTH.SESSION)?.value || null;

  await checkSession(sessionCookie, {
    // nothing to update
    sessionMissing: async () => {},

    // clear session data
    sessionInvalid: async () => {
      // clear session cookie
      response.cookies.delete(COOKIE_NAME.AUTH.LAST_DB_SESSION_QUERY);
    },

    // perform the rolling update to the session
    sessionValid: async (payload, signFunction) => {
      const now = new Date();

      const future7days = new Date(now.getTime() + SECONDS_WEEK * 1000);
      const past2Minutes = new Date(now.getTime() - 2 * SECONDS_MINUTE * 1000);
      const past5Minutes = new Date(now.getTime() - 5 * SECONDS_MINUTE * 1000);

      const newExpiryInSeconds = SECONDS_WEEK;

      let newSessionCookie: SessionCookie = payload;
      let datesUpdated = false;

      // 1. Throttle Rolling Cookie Refresh (Max 1x per 2 mins)
      if (past2Minutes > new Date(newSessionCookie.updatedAt)) {
        newSessionCookie = {
          ...newSessionCookie,
          expiresAt: future7days.toISOString() as any,
          updatedAt: now.toISOString() as any,
        };
        datesUpdated = true;

        const { signature } = await signFunction(newSessionCookie, SECONDS_WEEK);

        response.cookies.set(COOKIE_NAME.AUTH.SESSION, signature, {
          maxAge: newExpiryInSeconds,
          httpOnly: true,
          secure: isProduction(),
          sameSite: 'lax',
          path: '/',
        });
      }

      // 2. Throttle Database Session Sync (Max 1x per 5 mins)
      const lastDbQueryCookie = await getCookieServer(COOKIE_NAME.AUTH.LAST_DB_SESSION_QUERY);

      if (!lastDbQueryCookie || past5Minutes > new Date(lastDbQueryCookie)) {
        response.cookies.set(COOKIE_NAME.AUTH.LAST_DB_SESSION_QUERY, now.toISOString(), {
          maxAge: newExpiryInSeconds,
          httpOnly: true,
          secure: isProduction(),
          sameSite: 'lax',
          path: '/',
        });

        const currentSessionDb = await db.session.findUnique({
          where: { id: newSessionCookie.id },
        });

        if (currentSessionDb) {
          // If cookie wasn't refreshed in this request scope, push current 'now' & 'future7days' to DB
          const dbExpiresAt = datesUpdated ? new Date(newSessionCookie.expiresAt) : future7days;
          const dbUpdatedAt = datesUpdated ? new Date(newSessionCookie.updatedAt) : now;

          await db.session.update({
            where: { id: newSessionCookie.id },
            data: {
              expiresAt: dbExpiresAt,
              updatedAt: dbUpdatedAt,
            },
          });
        } else {
          // Session deleted in DB -> clear cookies
          response.cookies.delete(COOKIE_NAME.AUTH.SESSION);
          response.cookies.delete(COOKIE_NAME.AUTH.LAST_DB_SESSION_QUERY);

          response.cookies.set(COOKIE_NAME.AUTH.CLEAR_LOCAL_DATA, 'true', {
            maxAge: SECONDS_WEEK,
            httpOnly: false,
            secure: isProduction(),
            sameSite: 'lax',
            path: '/',
          });
        }
      }
    },
  });

  return response;
};
