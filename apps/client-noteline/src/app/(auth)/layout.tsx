/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutMain from '@repo/components/layout/main';

export default async function LayoutAuth({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain>
      <main>{children}</main>
    </LayoutMain>
  );
}
