/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import LayoutSection from '@repo/components/layout/section';
import ImageDefault from '@repo/components/common/images/default';
import { Stack, Card } from '@mantine/core';
import { images } from '@/assets/images';
import { appName } from '@repo/constants/app';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Metadata } from 'next';
import AnchorNextLink from '@repo/components/common/anchor/next-link';

export const metadata: Metadata = {
  title: {
    default: 'Authentication',
    template: `%s - Authentication - ${appName}`,
  },
};

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutSection id={'layout-auth-default'} containerized="xs">
        <Stack
          justify="center"
          mih={'100vh'}
          px={{ base: 0, sm: 40 }}
          py={SECTION_SPACING}
        >
          <Card
            shadow="xs"
            withBorder
            bg={'transparent'}
            p={{ base: 'xl', xs: 40 }}
          >
            <Stack gap={'xl'}>
              <AnchorNextLink href={'/'}>
                <ImageDefault
                  src={images.brand.logo.light}
                  alt={appName}
                  height={{ base: 28 }}
                  fit="contain"
                  mode="grid"
                />
              </AnchorNextLink>

              {children}
            </Stack>
          </Card>
        </Stack>
      </LayoutSection>
    </LayoutBody>
  );
}
