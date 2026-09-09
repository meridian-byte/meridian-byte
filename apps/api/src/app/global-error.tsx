'use client';

import React from 'react';
import { PartialError500, ProviderMantine } from '@repo/ui';
import { getAppTheme } from '@repo/constants';
import { getAppResolver } from '@api/resolver';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <ProviderMantine theme={getAppTheme} cssVariablesResolver={getAppResolver}>
          <PartialError500 reset={reset} />
        </ProviderMantine>
      </body>
    </html>
  );
}
