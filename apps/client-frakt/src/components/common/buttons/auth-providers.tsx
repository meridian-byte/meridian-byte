'use client';

import { useState } from 'react';
import { Button, Grid, GridCol } from '@mantine/core';
import { images } from '@/assets/images';
import { capitalizeWords } from '@repo/utilities/string';
import ImageDefault from '@repo/components/common/images/default';
import { API_URL } from '@repo/constants/paths';
import { AUTH_URLS } from '@/data/constants';
import { PARAM_NAME } from '@repo/constants/names';
import { createClient } from '@/libraries/supabase/client';
import { getUrlParam } from '@repo/utilities/url';

export default function Providers() {
  const [loading, setLoading] = useState('');

  const supabase = createClient();

  const getButton = (providerDetails: { image: string; provider: string }) => {
    const handleClick = async () => {
      setLoading(providerDetails.provider);
      await supabase.auth.signInWithOAuth({
        provider: providerDetails.provider.toLocaleLowerCase() as any,
        options: {
          redirectTo: `${API_URL}/auth/callback/oauth?next=${encodeURIComponent((getUrlParam(PARAM_NAME.REDIRECT) as string) || AUTH_URLS.REDIRECT.DEFAULT)}`,

          // The following options are commented out because they are not needed for most OAuth flows.
          // These options can be uncommented if you need offline access or to prompt for consent.
          // queryParams: {
          //   access_type: 'offline',
          //   prompt: 'consent',
          // },
        },
      });
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
    image: images.icons.google,
    provider: 'google',
  },
];
