'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@repo/utilities/url';
import { Box, LoadingOverlay } from '@mantine/core';
import { signOut } from '@repo/handlers/requests/auth';
import { deleteDatabase } from '@repo/libraries/indexed-db/actions';
import { AuthAction } from '@repo/types/enums';
import { DBConfig } from '@repo/types/indexed-db';
import { AUTH_URLS } from '@repo/constants/paths';

export function SignIn({
  children,
  options,
}: {
  options: { action: AuthAction };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <span
      onClick={() => {
        router.push(
          setRedirectUrl({
            targetUrl:
              options.action == AuthAction.SIGN_IN
                ? AUTH_URLS.SIGN_IN
                : AUTH_URLS.SIGN_UP,
            redirectUrl: pathname,
          })
        );
      }}
    >
      {children}
    </span>
  );
}

export function SignOut({
  props,
  children,
}: {
  props: { baseUrl: string; dbConfig: DBConfig };
  children: React.ReactNode;
}) {
  const [clicked, setClicked] = useState(false);

  return (
    <Box
      component="span"
      pos="relative"
      onClick={async () => {
        setClicked(true);

        // Delete local database
        await deleteDatabase(props.dbConfig.name);

        // Clear storage (optional)
        localStorage.clear();
        sessionStorage.clear();

        // clear client cookies
        document.cookie.split(';').forEach((c) => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(
              /=.*/,
              '=;expires=' + new Date().toUTCString() + ';path=/'
            );
        });

        await signOut({ options: { baseUrl: props.baseUrl } });

        window.location.href = '/';
      }}
    >
      <LoadingOverlay
        visible={clicked}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ size: 'xs' }}
      />
      {children}
    </Box>
  );
}
