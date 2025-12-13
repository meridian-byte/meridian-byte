/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import AffixNavbar from '@repo/components/common/affixi/navbar';
import { appName } from '@repo/constants/app';

export const metadata: Metadata = {
  title: { default: appName, template: `%s - ${appName}` },
};

export default async function LayoutMarketing({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <main>{children}</main>

      <AffixNavbar />
    </LayoutBody>
  );
}
