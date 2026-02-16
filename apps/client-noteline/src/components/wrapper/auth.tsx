'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@repo/utilities/url';
import { Box, LoadingOverlay } from '@mantine/core';
import { AUTH_URLS, BASE_URL_CLIENT } from '@/data/constants';
import { config } from '@/libraries/indexed-db';
import { deleteDatabase } from '@repo/libraries/indexed-db/actions';
import { AuthAction } from '@repo/types/enums';
import { createClient } from '@/libraries/supabase/client';

export function Auth({
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

export function SignOut({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [clicked, setClicked] = useState(false);

  return (
    <Box
      component="span"
      pos="relative"
      onClick={async () => {
        setClicked(true);

        await supabase.auth.signOut();

        // Clear storage (optional)
        localStorage.clear();
        sessionStorage.clear();

        // delete client cookies
        document.cookie.split(';').forEach((c) => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(
              /=.*/,
              '=;expires=' + new Date().toUTCString() + ';path=/'
            );
        });

        // Delete local database
        await deleteDatabase(config.name);

        window.location.href = BASE_URL_CLIENT;
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
