'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@repo/utils';
import { Box, LoadingOverlay } from '@mantine/core';
import { signOut } from '@repo/handlers';
import { deleteDatabase, useStoreSession } from '@repo/store';
import { AuthAction } from '@repo/types';
import { DBConfig } from '@repo/types';
import { AUTH_URLS } from '@repo/constants';

export function WrapperActionSignIn({
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
            targetUrl: options.action == AuthAction.SIGN_IN ? AUTH_URLS.SIGN_IN : AUTH_URLS.SIGN_UP,
            redirectUrl: pathname,
          }),
        );
      }}
    >
      {children}
    </span>
  );
}

export function WrapperActionSignOut({
  props,
  children,
}: {
  props: {
    baseUrl: string;
    dbConfig: DBConfig;
    options?: { clearDB?: boolean; redirectUrl?: string };
  };
  children: React.ReactNode;
}) {
  const [clicked, setClicked] = useState(false);
  const { session } = useStoreSession();

  return (
    <Box
      component="span"
      pos="relative"
      onClick={async () => {
        setClicked(true);

        if (!!session) {
          // sign out
          await signOut({ options: { baseUrl: props.baseUrl || window.location.origin } });

          if (props.options?.clearDB) {
            // Shut down local db connections delete local db
            await deleteDatabase(props.dbConfig.name);
          }

          // clear storage
          localStorage.clear();
          sessionStorage.clear();

          // clear client cookies
          document.cookie.split(';').forEach((c) => {
            document.cookie = c
              .replace(/^ +/, '')
              .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
          });
        }

        window.location.href = props.options?.redirectUrl || AUTH_URLS.SIGNED_OUT;
      }}
    >
      <LoadingOverlay
        visible={clicked}
        zIndex={1000}
        overlayProps={{ radius: 'md', blur: 2 }}
        loaderProps={{ size: 'xs' }}
      />
      <Box p={2}>{children}</Box>
    </Box>
  );
}
