import React from 'react';
import { Metadata } from 'next';
import { NotifyError as PartialNotifyError } from '@atlas/ui/partial/page/notify';
import { BASE_URL } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Authentication Error' };

export default function Error() {
  return (
    <div>
      <PartialNotifyError props={{ baseUrl: BASE_URL.ATLAS }} />
    </div>
  );
}
