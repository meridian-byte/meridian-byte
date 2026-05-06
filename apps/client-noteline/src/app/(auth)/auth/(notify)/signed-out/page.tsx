/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import { NotifySignedOut as PartialNotifySignedOut } from '@repo/components/partial/page/notify';

export const metadata: Metadata = { title: 'Signed Out' };

export default function SignedOut() {
  return (
    <LayoutPage>
      <PartialNotifySignedOut />
    </LayoutPage>
  );
}
