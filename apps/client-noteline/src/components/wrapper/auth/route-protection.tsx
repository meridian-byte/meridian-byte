'use client';

import { AUTH_URLS } from '@/data/constants';
import { authRoutes, protectedRoutes } from '@/data/routes';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { PARAM_NAME } from '@repo/constants/names';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function RouteProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useStoreSession();

  const pathIsProtectedRoute = protectedRoutes.some((pr) =>
    pathname.includes(pr)
  );
  const pathIsAuthRoute = authRoutes.some((ar) => pathname.includes(ar));

  useEffect(() => {
    if (session === undefined) return;

    if (session === null || !session.email) {
      if (pathIsProtectedRoute) {
        router.replace(`auth/sign-in?${PARAM_NAME.REDIRECT}=${pathname}`);
      }
    } else {
      if (pathIsAuthRoute) {
        router.replace(AUTH_URLS.REDIRECT.DEFAULT);
      }
    }
  }, [session, pathname, router]);

  return <div>{children}</div>;
}
