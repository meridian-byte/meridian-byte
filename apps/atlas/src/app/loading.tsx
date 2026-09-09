import React from 'react';
import { getAppResolver } from '@atlas/resolver';
import { getAppTheme } from '@repo/constants';
import { PartialLoadingMain, ProviderMantine } from '@repo/ui';

export default function Loading() {
  return (
    <ProviderMantine theme={getAppTheme} cssVariablesResolver={getAppResolver}>
      <PartialLoadingMain />
    </ProviderMantine>
  );
}
