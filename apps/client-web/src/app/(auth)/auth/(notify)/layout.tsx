/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Center, Grid, GridCol, Stack } from '@mantine/core';
import LayoutBody from '@repo/components/layout/body';
import LayoutSection from '@repo/components/layout/section';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { appName } from '@repo/constants/app';
import { Metadata } from 'next';
import AnchorNextLink from '@repo/components/common/anchor/next-link';

export const metadata: Metadata = {
  title: {
    default: 'Notify',
    template: `%s - Authentication - ${appName}`,
  },
};

export default function LayoutNotify({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <Grid gutter={0} px={{ base: 'md', xs: 0 }}>
        <GridCol
          span={5.5}
          visibleFrom="md"
          bg={'var(--mantine-color-pri-light)'}
        >
          <LayoutSection
            id={'layout-auth-notify-icon'}
            containerized="xs"
            pos={'sticky'}
            top={0}
          >
            <Center h={'100vh'} px={{ xs: 32 }}>
              <AnchorNextLink href={'/'}>
                <ImageDefault
                  src={images.brand.logo.light}
                  alt={appName}
                  height={48}
                  width={160}
                  mode="grid"
                />
              </AnchorNextLink>
            </Center>
          </LayoutSection>
        </GridCol>

        <GridCol span={{ base: 12, md: 6.5 }}>
          <LayoutSection id={'layout-auth-notify-text'} containerized="xs">
            <Stack
              gap={'xl'}
              justify="center"
              mih={'100vh'}
              px={{ xs: 32 }}
              py={SECTION_SPACING}
            >
              {children}
            </Stack>
          </LayoutSection>
        </GridCol>
      </Grid>
    </LayoutBody>
  );
}
