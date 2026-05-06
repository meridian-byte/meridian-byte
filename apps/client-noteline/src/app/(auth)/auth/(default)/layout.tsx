/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { COMPANY_NAME } from '@repo/constants/app';
import { Metadata } from 'next';
import LayoutAuthDefault from '@repo/components/layout/auth/default';

export const metadata: Metadata = {
  title: {
    default: 'Authentication',
    template: `%s - Authentication - ${COMPANY_NAME}`,
  },
};

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutAuthDefault>{children}</LayoutAuthDefault>
    </>
  );
}
