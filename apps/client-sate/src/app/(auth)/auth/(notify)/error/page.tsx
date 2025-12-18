/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import { NotifyError as PartialNotifyError } from '@/components/partial/page/notify';

export const metadata: Metadata = { title: 'Authentication Error' };

export default function Error() {
  return (
    <LayoutPage>
      <PartialNotifyError />
    </LayoutPage>
  );
}
