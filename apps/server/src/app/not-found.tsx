/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import Error404 from '@repo/components/partial/errors/404';
import ProviderMantine from '@repo/components/provider/mantine';
import { mantine } from '@/assets/styles';

export default function NotFound() {
  return (
    <ProviderMantine appThemeProps={{ styleSheets: { ...mantine } }}>
      <Error404 />
    </ProviderMantine>
  );
}
