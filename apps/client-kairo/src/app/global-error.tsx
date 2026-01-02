'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import Error500 from '@repo/components/partial/errors/500';
import ProviderMantine from '@repo/components/provider/mantine';
import { mantine } from '@/assets/styles';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <ProviderMantine appThemeProps={{ styleSheets: { ...mantine } }}>
          <Error500 reset={reset} />
        </ProviderMantine>
      </body>
    </html>
  );
}
