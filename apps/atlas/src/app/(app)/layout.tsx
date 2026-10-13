import React from 'react';
import Shell from '@atlas/ui/layout/appshell';
import ProviderModal from '@atlas/ui/provider/modal';
import ProviderNotification from '@atlas/ui/provider/notification';
import ProviderInitialize from '@atlas/ui/provider/initialize';
import ProviderSync from '@atlas/ui/provider/sync';
import { getSession } from '@repo/auth';
import { getApiUrl } from '@repo/constants';
import PageAuthPin from '@atlas/ui/partial/page/auth-pin';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <PageAuthPin authPin={'5863'} serverSession={session}>
      <ProviderModal>
        <ProviderNotification>
          <Shell>
            <ProviderInitialize props={{ baseUrl: await getApiUrl(), session }}>
              <ProviderSync props={{ serverSession: session }}>{children}</ProviderSync>
            </ProviderInitialize>
          </Shell>
        </ProviderNotification>
      </ProviderModal>
    </PageAuthPin>
  );
}
