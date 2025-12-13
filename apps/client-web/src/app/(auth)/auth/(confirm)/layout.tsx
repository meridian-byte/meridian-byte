/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import LayoutSection from '@repo/components/layout/section';
import { Stack } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { appName } from '@repo/constants/app';

export const metadata: Metadata = {
  title: {
    default: 'Confirm',
    template: `%s - Authentication - ${appName}`,
  },
};

export default function LayoutConfirm({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutSection id={'layout-confirm'} containerized="sm">
        <Stack justify="center" mih={'100vh'} py={SECTION_SPACING}>
          {children}
        </Stack>
      </LayoutSection>
    </LayoutBody>
  );
}
