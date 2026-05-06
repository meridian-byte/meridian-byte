/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { COMPANY_NAME } from '@repo/constants/app';
import { Metadata } from 'next';
import LayoutAuthNotify from '@repo/components/layout/auth/notify';

export const metadata: Metadata = {
  title: {
    default: 'Notify',
    template: `%s - Authentication - ${COMPANY_NAME}`,
  },
};

export default async function LayoutNotify({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutAuthNotify>{children}</LayoutAuthNotify>
    </>
  );
}
