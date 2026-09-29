import React from 'react';
import Shell from '@atlas/ui/layout/appshell';
import ProviderModal from '@atlas/ui/provider/modal';
import ProviderNotification from '@atlas/ui/provider/notification';

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <ProviderModal>
      <ProviderNotification>
        <Shell>{children}</Shell>
      </ProviderNotification>
    </ProviderModal>
  );
}
