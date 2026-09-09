import React from 'react';
import { Metadata } from 'next';
import { NotifySignOut as PartialNotifySignOut } from '@atlas/ui/partial/page/notify';
import { BASE_URL } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Sign Out' };

export default function SignOut() {
  return (
    <div>
      <PartialNotifySignOut props={{ baseUrl: BASE_URL.ATLAS }} />
    </div>
  );
}
