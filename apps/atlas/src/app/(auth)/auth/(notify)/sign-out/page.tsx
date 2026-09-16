import React from 'react';
import { Metadata } from 'next';
import { NotifySignOut as PartialNotifySignOut } from '@atlas/ui/partial/page/notify';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Sign Out' };

export default async function SignOut() {
  return (
    <div>
      <PartialNotifySignOut props={{ baseUrl: (await getBaseUrl()).ATLAS }} />
    </div>
  );
}
