/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import { NotifyError as PartialNotifyError } from '@repo/components/partial/page/notify';
import { BASE_URL_CLIENT } from '@repo/constants/paths';

export const metadata: Metadata = { title: 'Authentication Error' };

export default function Error() {
  return (
    <LayoutPage>
      <PartialNotifyError props={{ baseUrl: BASE_URL_CLIENT.WEB }} />
    </LayoutPage>
  );
}
