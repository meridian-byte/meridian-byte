import React from 'react';
import { COMPANY_NAME } from '@repo/constants';
import { Metadata } from 'next';
import LayoutAuthDefault from '@atlas/ui/layout/auth/default';

export const metadata: Metadata = {
  title: {
    default: 'Authentication',
    template: `%s - Authentication - ${COMPANY_NAME}`,
  },
};

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LayoutAuthDefault>{children}</LayoutAuthDefault>
    </>
  );
}
