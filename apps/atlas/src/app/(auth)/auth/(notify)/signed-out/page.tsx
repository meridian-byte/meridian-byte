import React from 'react';
import { Metadata } from 'next';
import { NotifySignedOut as PartialNotifySignedOut } from '@atlas/ui/partial/page/notify';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Signed Out' };

export default function SignedOut() {
  return (
    <div>
      <PartialNotifySignedOut />
    </div>
  );
}
