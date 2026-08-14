import React from 'react';
import Shell from '@atlas/ui/layout/appshell';
import ProviderModal from '@atlas/ui/provider/modal';

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <ProviderModal>
      <Shell>{children}</Shell>
    </ProviderModal>
  );
}
