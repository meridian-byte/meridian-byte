'use client';

import { useState } from 'react';
import { Button, Grid, GridCol } from '@mantine/core';
import { capitalizeWords, getFromLocalStorage, isProduction, setCookieClient } from '@repo/utils';
import ImageDefault from '../image/default';
import {
  AUTH_URLS,
  BASE_URL,
  COOKIE_NAME,
  getClientApiUrl,
  SECONDS_HOUR,
  STORAGE_NAME,
} from '@repo/constants';
import { PARAM_NAME } from '@repo/constants';
import { getUrlParam } from '@repo/utils';
import { icons } from '@repo/constants';
import { signIn } from '@repo/handlers';
import { AuthAction } from '@repo/types';
import { useStoreWorkspace } from '@repo/store';

export default function Providers({ props }: { props: { baseUrl: string } }) {
  const workspaces = useStoreWorkspace((s) => s.workspaces);

  const [loading, setLoading] = useState('');

  const getButton = (providerDetails: (typeof providers)[0]) => {
    const handleClick = async () => {
      setLoading(providerDetails.provider);

      const localSession = getFromLocalStorage(STORAGE_NAME.AUTH.SESSION);

      setCookieClient(COOKIE_NAME.AUTH.LOGIN, localSession, {
        expiryInSeconds: SECONDS_HOUR,
        secure: isProduction(),
        sameSite: 'Lax',
      });

      const nextValue = encodeURIComponent(getUrlParam(PARAM_NAME.REDIRECT) as string);
      const targetUrl = `${providerDetails.authUrl}?baseUrl=${props.baseUrl}&next=${nextValue || AUTH_URLS.REDIRECT.DEFAULT}`;

      const response = await signIn(
        {
          values: { email: '' },
          appData: { workspaces: workspaces || undefined },
          options: { action: AuthAction.SIGN_IN },
        },
        `${BASE_URL.ATLAS}/api`,
        targetUrl,
      );

      const data = await response.json();

      if (data.redirectUrl) {
        // Perform top-level window navigation to Google OAuth
        window.location.href = data.redirectUrl;
      }
    };

    return (
      <Button
        key={providerDetails.provider}
        fullWidth
        variant="default"
        onClick={handleClick}
        loading={loading == providerDetails.provider}
        leftSection={
          <ImageDefault
            src={providerDetails.image}
            alt={providerDetails.provider}
            height={24}
            width={24}
            mode="grid"
          />
        }
      >
        Continue with {capitalizeWords(providerDetails.provider)}
      </Button>
    );
  };

  return (
    <Grid>
      {providers.map((provider) => (
        <GridCol key={provider.provider} span={{ base: 12 }}>
          {getButton(provider)}
        </GridCol>
      ))}
    </Grid>
  );
}

const providers = [
  {
    image: icons.google,
    provider: 'google',
    authUrl: AUTH_URLS.SIGN_IN_OAUTH.GOOGLE,
  },
];
