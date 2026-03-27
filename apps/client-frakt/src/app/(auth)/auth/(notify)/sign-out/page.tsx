/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import { NotifySignOut as PartialNotifySignOut } from '@/components/partial/page/notify';

export const metadata: Metadata = { title: 'Sign Out' };

export default function SignOut() {
  return (
    <LayoutPage>
      <PartialNotifySignOut />
    </LayoutPage>
  );
}
