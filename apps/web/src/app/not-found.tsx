import React from 'react';
import { getAppResolver } from '@web/resolver';
import { getAppTheme } from '@repo/constants';
import { PartialError404, ProviderMantine } from '@repo/ui';

export default function NotFound() {
  return (
    <ProviderMantine theme={getAppTheme} cssVariablesResolver={getAppResolver}>
      <PartialError404 />
    </ProviderMantine>
  );
}
