/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import { APP_NAME } from '@/data/constants';
import LayoutShellApp from '@/components/layout/shells/app';
import ProviderStore from '@/components/provider/store';
import ProviderSync from '@/components/provider/sync';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s - App - ${APP_NAME}` },
};

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <ProviderStore>
        <ProviderSync>
          <LayoutShellApp>{children}</LayoutShellApp>
        </ProviderSync>
      </ProviderStore>
    </LayoutBody>
  );
}
