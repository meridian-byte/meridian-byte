'use client';

import { PARAM_NAME } from '@repo/constants/names';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useIdle } from '@mantine/hooks';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';

export default function RouteProtection({
  props,
  children,
}: {
  props: {
    authRoutes: string[];
    protectedRoutes: string[];
    authRedirectDefault: string;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const idle = useIdle(500);
  const { session } = useStoreSession();

  const isProtected = props.protectedRoutes.some((pr) =>
    pathname.startsWith(pr)
  );
  const isAuth = props.authRoutes.some((ar) => pathname.startsWith(ar));
  const noSession = !session?.id && !session?.email;

  useEffect(() => {
    if (session === undefined) return;

    if (isProtected) {
      if (noSession) {
        router.replace(
          `auth/sign-in?${PARAM_NAME.REDIRECT}=${encodeURIComponent(pathname)}`
        );
      }
    } else if (isAuth) {
      if (!noSession) {
        router.replace(props.authRedirectDefault);
      }
    }
  }, [session, pathname, isAuth, isProtected, idle]);

  return <div>{children}</div>;
}
